"""Debug login - inspect the login page DOM and figure out correct selectors."""
import asyncio, sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOGIN_URL = "https://app.esgtech.ai/login"
EMAIL     = "compliance.mfg@kgirdharlal.com"
PASSWORD  = "PXJNAEBasj"

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, slow_mo=200)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})

        print(f"Going to: {LOGIN_URL}")
        await page.goto(LOGIN_URL, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)

        print(f"Current URL: {page.url}")
        await page.screenshot(path="output/debug_login_1.png", full_page=True)

        # dump all inputs
        inputs = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('input')).map(el => ({
                type: el.type, name: el.name, id: el.id,
                placeholder: el.placeholder, class: el.className.substring(0,80)
            }));
        }""")
        print(f"\nInputs found: {len(inputs)}")
        for inp in inputs:
            print(f"  {inp}")

        # dump all buttons
        buttons = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('button')).map(el => ({
                type: el.type, text: el.innerText.trim().substring(0,50),
                id: el.id, class: el.className.substring(0,80)
            }));
        }""")
        print(f"\nButtons found: {len(buttons)}")
        for b in buttons:
            print(f"  {b}")

        # dump forms
        forms = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('form')).map(f => ({
                action: f.action, method: f.method, id: f.id, class: f.className.substring(0,80)
            }));
        }""")
        print(f"\nForms found: {len(forms)}")
        for f in forms:
            print(f"  {f}")

        print("\n--- Attempting login ---")

        # try to fill email
        email_filled = False
        for sel in ["input[type='email']", "input[name='email']", "input[placeholder*='email' i]",
                    "input[placeholder*='Email' i]", "input[id*='email' i]", "input:first-of-type"]:
            loc = page.locator(sel)
            if await loc.count():
                print(f"  Email field found: {sel}")
                await loc.first.click()
                await loc.first.fill(EMAIL)
                email_filled = True
                break
        if not email_filled:
            print("  WARNING: no email field found!")

        await page.wait_for_timeout(500)
        await page.screenshot(path="output/debug_login_2_email_filled.png")

        # try to fill password
        pass_filled = False
        for sel in ["input[type='password']", "input[name='password']",
                    "input[placeholder*='password' i]", "input[id*='password' i]"]:
            loc = page.locator(sel)
            if await loc.count():
                print(f"  Password field found: {sel}")
                await loc.first.click()
                await loc.first.fill(PASSWORD)
                pass_filled = True
                break
        if not pass_filled:
            print("  WARNING: no password field found!")

        await page.wait_for_timeout(500)
        await page.screenshot(path="output/debug_login_3_pass_filled.png")

        # try to submit
        submitted = False
        for sel in ["button[type='submit']", "button:has-text('Login')", "button:has-text('Sign In')",
                    "button:has-text('Log In')", "button:has-text('Submit')", "input[type='submit']",
                    "form button", "button"]:
            loc = page.locator(sel)
            if await loc.count():
                t = await loc.first.inner_text() if sel != "input[type='submit']" else "submit"
                print(f"  Submit via: {sel} — '{t.strip()}'")
                await loc.first.click()
                submitted = True
                break

        print("\nWaiting for navigation...")
        try:
            await page.wait_for_url(lambda u: "login" not in u, timeout=20000)
            print(f"SUCCESS! Navigated to: {page.url}")
        except:
            print(f"FAILED. Still at: {page.url}")
            # check for error messages
            errors = await page.evaluate("""() => {
                const errs = document.querySelectorAll('[class*=error],[class*=Error],[class*=alert],[class*=Alert],[role=alert]');
                return Array.from(errs).map(e => e.innerText.trim()).filter(t=>t);
            }""")
            if errors:
                print(f"Error messages on page: {errors}")

        await page.screenshot(path="output/debug_login_4_after.png", full_page=True)

        print(f"\nFinal URL: {page.url}")
        print("Screenshots saved to output/debug_login_*.png")

        input("Press Enter to close browser...")
        await browser.close()

asyncio.run(main())
