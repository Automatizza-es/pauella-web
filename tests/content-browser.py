"""Browser regression checks. Uses the cloud environment's Python Playwright + Chromium.
No requests reach the real form APIs: both POST routes are intercepted locally.
Run: python tests/content-browser.py (SEO_BASE_URL defaults to localhost:3000).
"""
import os
import re
import unittest
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('SEO_BASE_URL', 'http://127.0.0.1:3000')
SIZES = [('mobile', {'width': 390, 'height': 844}),
         ('desktop', {'width': 1440, 'height': 1000})]


class ContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(
            executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
            args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def page(self, size, **kwargs):
        page = self.browser.new_page(viewport=size, **kwargs)
        self.addCleanup(page.context.close)
        page.route('**/api/**', lambda route: route.fulfill(
            status=200, content_type='application/json', body='{"ok":true}'))
        return page

    def assert_readable(self, page):
        # Check text blocks, not overlays or intentionally closed dialogs.
        for selector in ['#menu h2', '#menu h4', '#extras > div > div h2',
                         '#learn > div > h3', '#experience li:visible h3']:
            for node in page.locator(selector).all():
                self.assertTrue(node.is_visible(), selector)
                self.assertTrue(node.evaluate('''el => {
                    for (let p=el; p; p=p.parentElement) {
                        if (+getComputedStyle(p).opacity === 0) return false;
                    }
                    return true;
                }'''), selector)

    def test_without_javascript(self):
        for name, size in SIZES:
            with self.subTest(viewport=name):
                page = self.page(size, java_script_enabled=False)
                page.goto(BASE, wait_until='networkidle')
                self.assertEqual(page.locator('h1').inner_text(),
                                 'LIVE PAELLA CATERING IN LOS ANGELES')
                self.assert_readable(page)
                self.assertEqual(page.locator('[data-reveal=pending]').count(), 0)

    def test_failed_javascript_and_deep_link(self):
        for name, size in SIZES:
            with self.subTest(viewport=name):
                page = self.page(size)
                page.route('**/_next/**/*.js*', lambda route: route.abort())
                page.goto(BASE, wait_until='networkidle')
                self.assert_readable(page)
                self.assertEqual(page.locator('[data-reveal=pending]').count(), 0)
                linked = self.page(size)
                linked.goto(BASE + '/#menu', wait_until='networkidle')
                expect(linked.locator('#menu h2')).to_be_visible()
                # Content at the restored anchor must not be re-hidden.
                self.assertNotEqual(linked.locator('#menu h2').locator('..').get_attribute('data-reveal'), 'pending')

    def test_observer_missing_or_broken(self):
        for script in ['window.IntersectionObserver = undefined',
                       'window.IntersectionObserver = class { constructor() { throw Error("unavailable"); } }']:
            page = self.page(SIZES[0][1])
            page.add_init_script(script)
            page.goto(BASE, wait_until='networkidle')
            self.assert_readable(page)
            self.assertEqual(page.locator('[data-reveal=pending]').count(), 0)

    def test_animation_and_reduced_motion(self):
        for name, size in SIZES:
            with self.subTest(viewport=name):
                page = self.page(size)
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m: errors.append(m.text) if re.search(
                    r'hydration|hydrating|did not match', m.text, re.I) else None)
                page.goto(BASE, wait_until='networkidle')
                pending = page.locator('#menu [data-reveal=pending]').first
                self.assertGreater(pending.count(), 0)
                page.wait_for_function("el => getComputedStyle(el).opacity === '0'", arg=pending.element_handle())
                pending.evaluate('el => el.scrollIntoView({block:"center", behavior:"instant"})')
                # A CSS transition really runs, rather than merely changing the class.
                page.wait_for_function('''() => [...document.querySelectorAll('#menu *')]
                    .some(el => el.getAnimations().some(a => a.transitionProperty === 'opacity'))''')
                page.emulate_media(reduced_motion='reduce')
                page.wait_for_function('!document.querySelector("[data-reveal=pending]")')
                self.assert_readable(page)
                self.assertEqual(errors, [])
                reduced = self.page(size, reduced_motion='reduce')
                reduced.goto(BASE, wait_until='networkidle')
                self.assert_readable(reduced)
                self.assertEqual(reduced.locator('[data-reveal=pending]').count(), 0)

    def test_interactions_and_spanish(self):
        for name, size in SIZES:
            with self.subTest(viewport=name):
                page = self.page(size, reduced_motion='reduce')
                page.goto(BASE, wait_until='networkidle')
                page.get_by_role('link', name='ES', exact=True).click()
                expect(page.locator('h1')).to_have_text('Catering de paellas en directo en Los Ángeles')
                page.wait_for_load_state('networkidle')
                page.get_by_role('link', name='EN', exact=True).click()
                page.wait_for_load_state('networkidle')
                if name == 'mobile':
                    page.get_by_role('button', name='Toggle menu').click()
                page.locator('header').get_by_role('link', name='Menu', exact=True).click()
                page.wait_for_function('location.hash === "#menu"')
                page.get_by_role('button', name='Make it black', exact=True).click()
                expect(page.get_by_role('button', name='Black version')).to_be_visible()
                page.get_by_role('link', name='Ask about this one').first.click()
                self.assertIn('Pauella', page.locator('input[name=interestedPaella]').input_value())
                page.get_by_role('button', name='Remove Pauella').click()
                self.assertEqual(page.locator('input[name=interestedPaella]').input_value(), '')
                # Video shares a parent with its source and image; use that container.
                video = page.locator('#menu video').first
                container = video.locator('..')
                container.scroll_into_view_if_needed()
                container.dispatch_event('click')
                page.wait_for_function('!document.querySelector("#menu video").paused')
                expect(video).to_have_class(re.compile(r'.*\bopacity-100\b.*'))
                container.dispatch_event('click')
                self.assertTrue(video.evaluate('v => v.paused'))
                extra = page.locator('#extras button[aria-expanded]').first
                extra.click()
                self.assertEqual(extra.get_attribute('aria-expanded'), 'true')
                page.get_by_role('button', name='Cook with Pau', exact=True).click()
                self.assertTrue(page.locator('dialog[open]').is_visible())
                self.assertEqual(page.locator('dialog[open] video').count(), 1)
                page.get_by_role('link', name='Start cooking', exact=True).click()
                self.assertIn('Cooking class', page.locator('input[name=interestedPaella]').input_value())
                page.get_by_role('button', name='Tell Pau your idea', exact=True).click()
                dialog = page.locator('dialog[open]')
                dialog.locator('input[name=email]').fill('test@example.invalid')
                dialog.locator('textarea[name=idea]').fill('Browser regression; intercepted locally')
                dialog.get_by_role('button', name='Send my idea').click()
                expect(dialog.get_by_text('Thank you.', exact=False)).to_be_visible()
                page.keyboard.press('Escape')
                form = page.locator('form').filter(has=page.locator('input[name=name]'))
                form.locator('input[name=name]').fill('Local regression')
                form.locator('input[name=email]').fill('test@example.invalid')
                form.get_by_role('button', name='Request your event').click()
                expect(page.get_by_text('Thank you. Your request is in.', exact=False)).to_be_visible()


if __name__ == '__main__':
    unittest.main()
