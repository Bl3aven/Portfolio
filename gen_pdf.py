from playwright.sync_api import sync_playwright
import os

html_path = r'c:\Users\mathy\OneDrive\Documents\.codex_tmp\Portfolio-github\cv-en-print.html'
pdf_path = r'c:\Users\mathy\OneDrive\Documents\.codex_tmp\Portfolio-github\cv-tournayre-en-2026.pdf'

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={'width': 794, 'height': 1123})
    page.goto(f'file:///{html_path}', wait_until='networkidle')
    content_height = page.evaluate('document.querySelector(".page").scrollHeight')
    viewport_height = 1123
    scale = viewport_height / max(content_height, viewport_height)
    print(f'Content: {content_height}px, Viewport: {viewport_height}px, Scale: {scale:.3f}')
    if scale < 1:
        page.pdf(path=pdf_path, width='210mm', height='297mm', print_background=True, scale=scale)
    else:
        page.pdf(path=pdf_path, width='210mm', height='297mm', print_background=True)
    b.close()
    print(f'PDF generated: {pdf_path} ({os.path.getsize(pdf_path)} bytes)')