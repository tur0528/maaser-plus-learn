# usage: python3 tools/shots.py [base_url]   → screenshots/*.png (needs playwright + google-chrome)
import sys
from playwright.sync_api import sync_playwright
base = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4321'
pages = {'home': '/', 'articles': '/articles/', 'stories': '/stories/', 'story-submit': '/stories/submit/', 'forum': '/forum/', 'about': '/about/'}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True)
    for dev, vp, scale in [('desktop', {'width': 1440, 'height': 900}, 1), ('mobile', {'width': 390, 'height': 844}, 2)]:
        ctx = b.new_context(viewport=vp, device_scale_factor=scale, locale='he-IL', is_mobile=(dev == 'mobile'), has_touch=(dev == 'mobile'))
        pg = ctx.new_page()
        for name, path in pages.items():
            pg.goto(base + path, wait_until='networkidle'); pg.wait_for_timeout(500)
            pg.screenshot(path=f'screenshots/{name}-{dev}.png', full_page=True)
            print(name, dev, pg.evaluate('document.documentElement.scrollWidth'), pg.evaluate('innerWidth'))
        ctx.close()
    b.close()
