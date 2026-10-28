"""Playwright supplied by the cloud environment. API routes are always intercepted."""
import os
import re
import unittest
from playwright.sync_api import sync_playwright, expect
BASE = os.environ.get('SEO_BASE_URL', 'http://127.0.0.1:3000').rstrip('/')
PATHS = {'en': '/paella-cooking-classes-los-angeles/', 'es': '/es/clases-de-paella-los-angeles/'}
SIZES = [('mobile', {'width': 390, 'height': 844}), ('desktop', {'width': 1440, 'height': 1000})]


class ClassTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def page(self, size, **kwargs):
        page = self.browser.new_page(viewport=size, **kwargs)
        self.addCleanup(page.context.close)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('console', lambda message: errors.append(message.text) if re.search(r'hydration|hydrating|did not match', message.text, re.I) else None)
        self.addCleanup(lambda: self.assertEqual(errors, []))
        requests = []
        def respond(route):
            requests.append((route.request.url, route.request.post_data_json))
            route.fulfill(status=200, content_type='application/json', body='{"ok":true,"serviceId":"cooking-class"}')
        page.route('**/api/**', respond)
        return page, requests

    def test_server_pages_without_js_and_native_links(self):
        for locale in PATHS:
            for name, size in SIZES:
                with self.subTest(locale=locale, viewport=name):
                    page, requests = self.page(size, java_script_enabled=False)
                    response = page.goto(BASE + PATHS[locale], wait_until='networkidle')
                    self.assertEqual(response.status, 200)
                    expect(page.locator('html')).to_have_attribute('lang', locale)
                    self.assertEqual(page.locator('h1').count(), 1)
                    self.assertEqual(page.locator('[data-reveal=pending]').count(), 0)
                    expect(page.locator('form[data-draft=cooking-class] button[type=submit]')).to_be_disabled()
                    expect(page.locator('form[data-draft=cooking-class]')).to_have_attribute('method', 'post')
                    self.assertTrue(page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
                    home = '/' if locale == 'en' else '/es/'
                    expect(page.locator('header a:has(img[alt=Pauella])')).to_have_attribute('href', home)
                    for part in ['menu', 'extras', 'about']:
                        self.assertGreater(page.locator(f'header a[href="{home}#{part}"]').count(), 0)
                    page.locator('#class-faq summary').first.click()
                    expect(page.locator('#class-faq details').first.locator('p')).to_be_visible()
                    other = 'es' if locale == 'en' else 'en'
                    page.get_by_role('link', name=other.upper(), exact=True).click()
                    expect(page).to_have_url(BASE + PATHS[other])
                    expect(page.locator('html')).to_have_attribute('lang', other)
                    self.assertEqual(requests, [])

    def test_forms_failure_retry_and_video(self):
        for locale in PATHS:
            for name, size in SIZES:
                with self.subTest(locale=locale, viewport=name):
                    page, requests = self.page(size, reduced_motion='reduce')
                    page.goto(BASE + PATHS[locale], wait_until='networkidle')
                    if name == 'mobile':
                        page.get_by_role('button', name='Toggle menu' if locale == 'en' else 'Abrir o cerrar menú').click()
                        page.locator('header nav a[href="#class-enquiry"]').filter(visible=True).first.click()
                    else:
                        page.locator('header a[href="#class-enquiry"]').first.click()
                    form = page.locator('form[data-draft=cooking-class]')
                    self.assertFalse(form.evaluate('form => form.checkValidity()'))
                    form.locator('[name=name]').fill('Browser test')
                    form.locator('[name=email]').fill('test@example.invalid')
                    form.locator('[name=participants]').fill('0')
                    self.assertFalse(form.evaluate('form => form.checkValidity()'))
                    form.locator('[name=participants]').fill('3')
                    self.assertTrue(form.evaluate('form => form.checkValidity()'))
                    # Fail without involving the backend or Resend, then retry.
                    page.route('**/api/cooking-class', lambda route: route.fulfill(status=502, content_type='application/json', body='{"error":"test"}'), times=1)
                    form.locator('button[type=submit]').click()
                    expect(form.get_by_role('alert')).to_be_visible()
                    expect(form.locator('[name=name]')).to_have_value('Browser test')
                    expect(form.locator('[name=participants]')).to_have_value('3')
                    form.locator('button[type=submit]').click()
                    expect(page.get_by_role('status')).to_contain_text('not confirmed' if locale == 'en' else 'no está confirmada')
                    self.assertEqual(len(requests), 1)
                    self.assertTrue(requests[0][0].endswith('/api/cooking-class'))
                    self.assertEqual(requests[0][1]['serviceId'], 'cooking-class')
                    self.assertEqual(requests[0][1]['participants'], '3')
                    self.assertEqual(page.locator('#class-overview video').count(), 0)
                    page.get_by_role('button', name='Watch the cooking' if locale == 'en' else 'Ver cómo se cocina', exact=True).click()
                    video = page.locator('#class-overview video')
                    expect(video).to_be_visible()
                    self.assertTrue(video.evaluate('v => v.controls'))
                    page.wait_for_function('!document.querySelector("#class-overview video").paused')
                    video.evaluate('v => v.pause()')
                    self.assertTrue(video.evaluate('v => v.paused'))

    def test_independent_drafts_and_selections_between_pages_and_languages(self):
        for name, size in SIZES:
            with self.subTest(viewport=name):
                page, requests = self.page(size, reduced_motion='reduce')
                page.goto(BASE + '/', wait_until='networkidle')
                page.get_by_role('link', name='Ask about this one', exact=True).first.click()
                event = page.locator('form[data-draft=contact]')
                event.locator('[name=name]').fill('Catering draft')
                event.locator('[name=email]').fill('event@example.invalid')
                event.locator('[name=message]').fill('Keep event context')
                page.locator('#menu').get_by_role('button', name='Tell Pau your idea', exact=True).click()
                custom = page.locator('form[data-draft=custom-idea]')
                custom.locator('[name=idea]').fill('Keep custom idea')
                page.keyboard.press('Escape')
                page.locator(f'#learn a[href="{PATHS["en"]}"]').first.click()
                page.wait_for_load_state('networkidle')
                form = page.locator('form[data-draft=cooking-class]')
                expect(form.locator('[name=name]')).to_have_value('')
                form.locator('[name=name]').fill('Class draft')
                form.locator('[name=email]').fill('class@example.invalid')
                form.locator('[name=participants]').fill('4')
                form.locator('[name=message]').fill('Keep class context')
                page.locator('main a[href="#class-enquiry"]').first.click()
                page.get_by_role('link', name='ES', exact=True).click()
                page.wait_for_load_state('networkidle')
                expect(page).to_have_url(BASE + PATHS['es'] + '#class-enquiry')
                expect(form.locator('[name=name]')).to_have_value('Class draft')
                expect(form.locator('[name=participants]')).to_have_value('4')
                page.locator('header a:has(img[alt=Pauella])').click()
                page.wait_for_load_state('networkidle')
                expect(page).to_have_url(BASE + '/es/')
                expect(event.locator('[name=name]')).to_have_value('Catering draft')
                expect(event.locator('[name=message]')).to_have_value('Keep event context')
                expect(page.locator('[name=interestedPaella]')).to_have_value('Pauella')
                expect(custom.locator('[name=idea]')).to_have_value('Keep custom idea')
                page.locator(f'footer a[href="{PATHS["es"]}"]').click()
                page.wait_for_load_state('networkidle')
                expect(form.locator('[name=name]')).to_have_value('Class draft')
                expect(form.locator('[name=email]')).to_have_value('class@example.invalid')
                expect(form.locator('[name=message]')).to_have_value('Keep class context')
                page.get_by_role('link', name='EN', exact=True).click()
                page.wait_for_load_state('networkidle')
                expect(page).to_have_url(BASE + PATHS['en'])
                expect(form.locator('[name=participants]')).to_have_value('4')
                self.assertEqual(requests, [])

    def test_reveal_reduced_motion_and_equivalent_anchor(self):
        for locale in PATHS:
            page, _ = self.page(SIZES[0][1])
            page.goto(BASE + PATHS[locale], wait_until='networkidle')
            target = page.locator('[data-reveal=pending]').first
            page.wait_for_function("el => getComputedStyle(el).opacity === '0'", arg=target.element_handle())
            target.evaluate('el => el.scrollIntoView({block:"center",behavior:"instant"})')
            page.wait_for_function("() => [...document.querySelectorAll('main *')].some(el => el.getAnimations().some(a => a.transitionProperty === 'opacity'))")
            page.emulate_media(reduced_motion='reduce')
            page.wait_for_function('!document.querySelector("[data-reveal=pending]")')
            page.locator('main a[href="#class-enquiry"]').first.click()
            other = 'es' if locale == 'en' else 'en'
            page.get_by_role('link', name=other.upper(), exact=True).click()
            expect(page).to_have_url(BASE + PATHS[other] + '#class-enquiry')


if __name__ == '__main__':
    unittest.main()
