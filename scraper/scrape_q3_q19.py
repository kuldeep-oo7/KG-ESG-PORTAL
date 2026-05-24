"""
Targeted scraper: Q3–Q19 dropdown options only.
NO cascade testing (avoids browser crash from repeated navigation).
Just reads each form's dropdowns once.
"""
import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOGIN_URL = "https://app.esgtech.ai/login"
EMAIL     = "compliance.mfg@kgirdharlal.com"
PASSWORD  = "PXJNAEBasj"
BASE_URL  = "https://app.esgtech.ai"
SITE_ID   = 193  # Surat — most data

# Only the missing ones
CATEGORIES = [
    {"code": "Q3",  "name": "Fugitive Emissions",        "scope": 1},
    {"code": "Q4",  "name": "Electricity",               "scope": 2},
    {"code": "Q5",  "name": "Heat/Steam",                "scope": 2},
    {"code": "Q19", "name": "Renewable Electricity",     "scope": 2},
    {"code": "Q6",  "name": "Water Supply",              "scope": 3},
    {"code": "Q7",  "name": "Water Treatment",           "scope": 3},
    {"code": "Q8",  "name": "Purchased Goods",           "scope": 3},
    {"code": "Q9",  "name": "Waste Disposal",            "scope": 3},
    {"code": "Q10", "name": "Business Travel (Air)",     "scope": 3},
    {"code": "Q11", "name": "Business Travel (Sea)",     "scope": 3},
    {"code": "Q12", "name": "Business Travel (Land)",    "scope": 3},
    {"code": "Q13", "name": "Upstream Activities",       "scope": 3},
    {"code": "Q14", "name": "Hotel Stay",                "scope": 3},
    {"code": "Q15", "name": "Food Consumption",          "scope": 3},
    {"code": "Q16", "name": "Employee Commute",          "scope": 3},
    {"code": "Q17", "name": "T&D Loss",                  "scope": 3},
    {"code": "Q18", "name": "Downstream Activities",     "scope": 3},
]

OUT = Path(__file__).parent / "output"
OUT.mkdir(exist_ok=True)
SHOT = OUT / "screenshots_q3q19"
SHOT.mkdir(exist_ok=True)
N = [0]

def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", (t or "").lower()).strip("_")[:40]

async def ss(page, label):
    N[0] += 1
    try:
        await page.screenshot(path=str(SHOT / f"{N[0]:04d}_{slug(label)}.png"), full_page=False)
    except: pass

async def login(page):
    print("Logging in...")
    await page.goto(LOGIN_URL, wait_until="domcontentloaded")
    await page.wait_for_timeout(2500)
    await page.locator("input[name='email']").fill(EMAIL)
    await page.wait_for_timeout(400)
    await page.locator("input[type='password']").fill(PASSWORD)
    await page.wait_for_timeout(400)
    await page.keyboard.press("Enter")
    await page.wait_for_url(lambda u: "login" not in u, timeout=20000)
    await page.wait_for_timeout(2500)
    print(f"  Logged in: {page.url}")


async def read_select_buttons(page):
    """Read options from all 'Select *' button dropdowns on the page."""
    result = {}
    all_btns = await page.locator("button").all()
    select_btns = []
    for btn in all_btns:
        try:
            txt = (await btn.inner_text()).strip()
            if txt.startswith("Select") and await btn.is_visible():
                select_btns.append((txt, btn))
        except: pass

    print(f"  Found {len(select_btns)} Select buttons: {[t for t,_ in select_btns]}")

    for btn_label, btn in select_btns:
        try:
            await btn.scroll_into_view_if_needed()
            await btn.click(timeout=4000)
            await page.wait_for_timeout(1200)

            # Read options from the absolute dropdown div
            options = await page.evaluate("""() => {
                const dropdowns = document.querySelectorAll("div[class*='absolute']");
                const visible = Array.from(dropdowns).filter(d =>
                    d.offsetParent !== null &&
                    d.innerText.trim().length > 0 &&
                    (d.className.includes('bg-white') || d.className.includes('rounded'))
                );
                if (!visible.length) return [];
                visible.sort((a,b) => b.innerText.length - a.innerText.length);
                const container = visible[0];
                const items = [];
                container.querySelectorAll('button, li, p, span').forEach(el => {
                    if (!el.children.length || el.tagName === 'BUTTON') {
                        const t = el.innerText.trim();
                        if (t && t.length > 0 && t.length < 120 && !items.includes(t)) items.push(t);
                    }
                });
                if (!items.length) {
                    container.innerText.split('\\n').forEach(line => {
                        const t = line.trim();
                        if (t && t.length > 0 && t.length < 120 && !items.includes(t)) items.push(t);
                    });
                }
                return items;
            }""")

            if options:
                result[btn_label] = options
                print(f"    [{btn_label}] → {len(options)} opts: {options[:4]}{'...' if len(options)>4 else ''}")
            else:
                # Try React-select style as fallback
                opts2 = await page.evaluate("""() => {
                    const items = [];
                    document.querySelectorAll('[class*="option"],[role="option"]').forEach(el => {
                        const t = el.innerText.trim();
                        if (t && t.length < 120 && !items.includes(t)) items.push(t);
                    });
                    return items;
                }""")
                if opts2:
                    result[btn_label] = opts2
                    print(f"    [{btn_label}] (react-select) → {len(opts2)} opts: {opts2[:4]}")
                else:
                    print(f"    [{btn_label}] → no options found")

            # Close
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(600)
        except Exception as e:
            print(f"    Error on [{btn_label}]: {e}")
            try: await page.keyboard.press("Escape")
            except: pass

    return result


async def read_form_labels(page):
    """Read visible form input labels to understand the fields."""
    return await page.evaluate("""() => {
        const labels = [];
        document.querySelectorAll('label, .label, [class*="label"]').forEach(el => {
            const t = el.innerText.trim();
            if (t && t.length < 80 && !labels.includes(t)) labels.push(t);
        });
        return labels;
    }""")


async def scrape_q(page, cat):
    url = f"{BASE_URL}/sites/{SITE_ID}/assessment/{cat['code']}/2026/5"
    print(f"\n{'='*55}")
    print(f"[{cat['code']}] {cat['name']} (Scope {cat['scope']})")
    print(f"{'='*55}")

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except Exception as e:
        print(f"  Nav error: {e}")
        return {}

    await page.wait_for_timeout(3500)
    await ss(page, f"{cat['code']}_form")

    # Read form labels
    labels = await read_form_labels(page)
    print(f"  Labels: {labels[:8]}")

    # Read dropdowns
    dropdowns = await read_select_buttons(page)

    # Take screenshot after reading
    await ss(page, f"{cat['code']}_after")

    return {"url": url, "labels": labels, "dropdowns": dropdowns}


async def main():
    # Load existing dropdown data to preserve Q1 and Q2
    existing_file = OUT / "dropdown_options.json"
    existing = {}
    if existing_file.exists():
        with open(existing_file, encoding="utf-8") as f:
            existing = json.load(f)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, slow_mo=50)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()

        await login(page)

        results = dict(existing)  # Start with existing Q1/Q2 data

        for cat in CATEGORIES:
            try:
                data = await scrape_q(page, cat)
                results[cat["code"]] = {
                    "name": cat["name"],
                    "scope": cat["scope"],
                    **data,
                }
            except Exception as e:
                print(f"\nFATAL on {cat['code']}: {e}")
                results[cat["code"]] = {"name": cat["name"], "scope": cat["scope"], "error": str(e)}

        # Save
        with open(existing_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        # Summary
        print(f"\n\n{'='*55}")
        print("DROPDOWN SUMMARY")
        print(f"{'='*55}")
        for code, data in results.items():
            dds = data.get("dropdowns", {})
            print(f"\n[{code}] {data.get('name','')}")
            for field, opts in dds.items():
                if isinstance(opts, list):
                    print(f"  {field}: {opts[:6]}{'...' if len(opts)>6 else ''}")
        print(f"\nSaved: {existing_file}")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
