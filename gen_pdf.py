from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
TARGETS = [
    ("cv-mathys-tournayre.html", "cv-tournayre-fr-2026.pdf"),
    ("cv-mathys-tournayre-en.html", "cv-tournayre-en-2026.pdf"),
]


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 794, "height": 1123})

    for html_name, pdf_name in TARGETS:
        html_path = ROOT / html_name
        pdf_path = ROOT / pdf_name
        page.goto(html_path.as_uri(), wait_until="networkidle")
        content_height = page.evaluate('document.querySelector(".page").scrollHeight')
        viewport_height = 1123
        scale = min((viewport_height / max(content_height, viewport_height)) * 0.95, 0.95)
        page.pdf(path=str(pdf_path), width="210mm", height="297mm", print_background=True, scale=scale)
        print(f"{pdf_name}: content={content_height}px scale={scale:.3f} size={pdf_path.stat().st_size} bytes")

    browser.close()
