"""Cloud-provided Playwright/Chromium; all form APIs are intercepted, no email sent."""
import os
import re
import unittest
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('SEO_BASE_URL', 'http://127.0.0.1:3000').rstrip('/')
SIZES = [('mobile', {'width': 390, 'height': 844}), ('desktop', {'width': 1440, 'height': 1000})]


class I18nTests(unittest.TestCase):
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
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if re.search(r'hydration|hydrating|did not match', m.text, re.I) else None)
        self.addCleanup(lambda: self.assertEqual(errors, []))
        requests = []
        def respond(route):
            requests.append((route.request.url, route.request.post_data_json))
            route.fulfill(status=200, content_type='application/json', body='{"ok":true}')
        page.route('**/api/**', respond)
        return page, requests

    def test_without_js(self):
        for locale, path, h1 in [('en', '/', 'Live Paella Catering in Los Angeles'), ('es', '/es/', 'Catering de paellas en directo en Los Ángeles')]:
            for name, size in SIZES:
                with self.subTest(locale=locale, viewport=name):
                    page, _ = self.page(size, java_script_enabled=False)
                    response = page.goto(BASE + path, wait_until='networkidle')
                    self.assertEqual(response.status, 200)
                    expect(page.locator('html')).to_have_attribute('lang', locale)
                    expect(page.locator('h1')).to_have_text(h1)
                    self.assertEqual(page.locator('[data-reveal=pending]').count(), 0)
                    expect(page.get_by_role('link', name='EN', exact=True)).to_have_attribute('href', '/')
                    expect(page.get_by_role('link', name='ES', exact=True)).to_have_attribute('href', '/es/')
                    page.get_by_role('link', name='ES' if locale == 'en' else 'EN', exact=True).click()
                    expect(page.locator('html')).to_have_attribute('lang', 'es' if locale == 'en' else 'en')

    def test_url_overrides_preference_and_reload(self):
        page, _ = self.page(SIZES[0][1], locale='es-ES')
        page.add_init_script("localStorage.setItem('pauella-locale', location.pathname.startsWith('/es') ? 'en' : 'es')")
        for path, locale in [('/', 'en'), ('/es/', 'es')]:
            page.goto(BASE + path, wait_until='networkidle')
            expect(page.locator('html')).to_have_attribute('lang', locale)
            page.reload(wait_until='networkidle')
            expect(page.locator('html')).to_have_attribute('lang', locale)
            self.assertTrue(page.url.endswith(path))

    def test_language_switch_preserves_drafts_choices_and_anchor(self):
        for name, size in SIZES:
            with self.subTest(viewport=name):
                page, requests = self.page(size, reduced_motion='reduce')
                page.goto(BASE, wait_until='networkidle')
                page.get_by_role('button', name='Make it black', exact=True).click()
                page.get_by_role('link', name='Ask about this one', exact=True).first.click()
                contact = page.locator('form[data-draft=contact]')
                contact.locator('[name=name]').fill('Language switch test')
                contact.locator('[name=email]').fill('test@example.invalid')
                contact.locator('[name=message]').fill('Keep this draft')
                page.get_by_role('link', name='EN', exact=True).click()
                expect(contact.locator('[name=message]')).to_have_value('Keep this draft')
                contact.locator('[name=eventType]').select_option('wedding')
                page.locator('#menu button[aria-pressed]').filter(has_text='Truffle').click()
                page.get_by_role('button', name='Tell Pau your idea', exact=True).click()
                custom = page.locator('form[data-draft=custom-idea]')
                custom.locator('[name=email]').fill('custom@example.invalid')
                custom.locator('[name=idea]').fill('Keep custom idea')
                page.keyboard.press('Escape')
                page.locator('footer a[href="#contact"]').click()
                page.get_by_role('link', name='ES', exact=True).click()
                expect(page).to_have_url(BASE + '/es/#contact')
                expect(page.locator('html')).to_have_attribute('lang', 'es')
                expect(contact.locator('[name=name]')).to_have_value('Language switch test')
                expect(contact.locator('[name=email]')).to_have_value('test@example.invalid')
                expect(contact.locator('[name=message]')).to_have_value('Keep this draft')
                expect(contact.locator('[name=eventType]')).to_have_value('wedding')
                expect(page.locator('[name=interestedPaella]')).to_have_value('Pauella')
                expect(custom.locator('[name=idea]')).to_have_value('Keep custom idea')
                expect(custom.locator('[name=tags]')).to_have_value('Trufa')
                expect(page.locator('#menu button[aria-pressed=true]').filter(has_text='Trufa')).to_be_visible()
                expect(page.get_by_role('button', name='Versión negra', exact=True)).to_be_visible()
                page.get_by_role('link', name='EN', exact=True).click()
                expect(page).to_have_url(BASE + '/#contact')
                expect(contact.locator('[name=name]')).to_have_value('Language switch test')
                expect(custom.locator('[name=idea]')).to_have_value('Keep custom idea')
                self.assertEqual(requests, [])

    def test_blocked_storage_warns_before_navigation(self):
        page, _ = self.page(SIZES[0][1], reduced_motion='reduce')
        page.add_init_script("Storage.prototype.setItem = function() { throw Error('blocked'); }")
        page.goto(BASE, wait_until='networkidle')
        page.locator('form[data-draft=contact] [name=name]').fill('Unsaved')
        dialogs = []
        def dismiss(dialog):
            dialogs.append(dialog.message)
            dialog.dismiss()
        page.on('dialog', dismiss)
        page.get_by_role('link', name='ES', exact=True).click()
        self.assertEqual(len(dialogs), 1)
        expect(page.locator('html')).to_have_attribute('lang', 'en')
        expect(page.locator('form[data-draft=contact] [name=name]')).to_have_value('Unsaved')

    def test_interactions_both_languages(self):
        for locale, path in [('en', '/'), ('es', '/es/')]:
            for name, size in SIZES:
                with self.subTest(locale=locale, viewport=name):
                    page, requests = self.page(size, reduced_motion='reduce')
                    page.goto(BASE + path, wait_until='networkidle')
                    if name == 'mobile':
                        page.get_by_role('button', name='Toggle menu' if locale == 'en' else 'Abrir o cerrar menú').click()
                    page.locator('header nav a[href="#menu"]').filter(visible=True).click()
                    page.wait_for_function('location.hash === "#menu"')
                    page.locator('#menu button[aria-pressed]').first.click()
                    expect(page.locator('#menu button[aria-pressed]').first).to_have_attribute('aria-pressed', 'true')
                    page.locator('#menu a[href="#contact"]').first.click()
                    expect(page.locator('[name=interestedPaella]')).to_have_value('Pauella')
                    page.get_by_role('button', name='Remove Pauella' if locale == 'en' else 'Quitar Pauella', exact=True).click()
                    expect(page.locator('[name=interestedPaella]')).to_have_value('')
                    video = page.locator('#menu video').first
                    page.mouse.move(0, 0)
                    video.scroll_into_view_if_needed()
                    video.locator('..').dispatch_event('click')
                    page.wait_for_function('!document.querySelector("#menu video").paused')
                    expect(video).to_have_class(re.compile(r'.*\bopacity-100\b.*'))
                    video.locator('..').dispatch_event('click')
                    page.wait_for_function('document.querySelector("#menu video").paused')
                    extra = page.locator('#extras button[aria-expanded]').first
                    extra.click()
                    expect(extra).to_have_attribute('aria-expanded', 'true')
                    page.locator('#learn > div > a').click()
                    page.wait_for_load_state('networkidle')
                    expect(page).to_have_url(BASE + ('/paella-cooking-classes-los-angeles/' if locale == 'en' else '/es/clases-de-paella-los-angeles/'))
                    expect(page.locator('form[data-draft=cooking-class]')).to_be_visible()
                    page.locator('header a:has(img[alt=Pauella])').click()
                    page.wait_for_load_state('networkidle')
                    expect(page.locator('[name=interestedPaella]')).to_have_value('')
                    page.locator('#menu').get_by_role('button', name='Tell Pau your idea' if locale == 'en' else 'Cuéntale tu idea a Pau', exact=True).click()
                    custom = page.locator('form[data-draft=custom-idea]')
                    custom.locator('[name=email]').fill('test@example.invalid')
                    custom.locator('[name=idea]').fill('Intercepted regression')
                    custom.locator('button[type=submit]').click()
                    expect(page.locator('dialog[open]')).to_contain_text('Thank you.' if locale == 'en' else 'Gracias.')
                    page.keyboard.press('Escape')
                    contact = page.locator('form[data-draft=contact]')
                    contact.locator('[name=name]').fill('Intercepted test')
                    contact.locator('[name=email]').fill('test@example.invalid')
                    contact.locator('button[type=submit]').click()
                    expect(page.locator('#contact')).to_contain_text('Thank you.' if locale == 'en' else 'Gracias.')
                    self.assertEqual(len(requests), 2)
                    self.assertTrue(requests[0][0].endswith('/api/custom-idea'))
                    self.assertTrue(requests[1][0].endswith('/api/contact'))
                    self.assertEqual(requests[1][1]['interestedPaella'], '')

    def test_language_change_waits_for_pending_submission(self):
        page, _ = self.page(SIZES[0][1], reduced_motion='reduce')
        pending = []
        page.route('**/api/contact', lambda route: pending.append(route))
        page.goto(BASE, wait_until='networkidle')
        form = page.locator('form[data-draft=contact]')
        form.locator('[name=name]').fill('Pending test')
        form.locator('[name=email]').fill('test@example.invalid')
        form.locator('button[type=submit]').click()
        expect(form).to_have_attribute('data-submitting', 'true')
        notices = []
        def accept(dialog):
            notices.append(dialog.message)
            dialog.accept()
        page.on('dialog', accept)
        page.get_by_role('link', name='ES', exact=True).click()
        self.assertEqual(len(notices), 1)
        expect(page.locator('html')).to_have_attribute('lang', 'en')
        self.assertEqual(len(pending), 1)
        pending[0].fulfill(status=200, content_type='application/json', body='{"ok":true}')
        expect(page.locator('#contact')).to_contain_text('Thank you.')

    def test_spanish_animation_and_reduced_motion(self):
        for name, size in SIZES:
            page, _ = self.page(size)
            page.goto(BASE + '/es/', wait_until='networkidle')
            pending = page.locator('#menu [data-reveal=pending]').first
            page.wait_for_function("el => getComputedStyle(el).opacity === '0'", arg=pending.element_handle())
            pending.evaluate('el => el.scrollIntoView({block:"center",behavior:"instant"})')
            page.wait_for_function("() => [...document.querySelectorAll('#menu *')].some(el => el.getAnimations().some(a => a.transitionProperty === 'opacity'))")
            page.emulate_media(reduced_motion='reduce')
            page.wait_for_function('!document.querySelector("[data-reveal=pending]")')


if __name__ == '__main__':
    unittest.main()
