"""Generate sitemap.xml with real region/detail URLs."""
from urllib.parse import quote
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LASTMOD = "2026-08-08"
BASE = "https://nsystudy.kr"


def enc(s):
    return quote(s, safe="")


# ── Hub pages ──────────────────────────────────────────────────────────────
HUB_PAGES = [
    ("", 1.0, "weekly"),
    ("regions.html", 0.9, "weekly"),
    ("international.html", 0.8, "weekly"),
    ("ged.html", 0.8, "weekly"),
    ("essay.html", 0.8, "weekly"),
]

# ── Region detail pages ────────────────────────────────────────────────────
REGION_CITIES = [
    ("서울특별시", ["강남구", "서초구", "강서구", "마포구", "노원구",
                   "강동구", "송파구", "관악구", "영등포구", "성동구"]),
    ("경기도",    ["수원시", "성남시", "용인시", "고양시", "부천시"]),
    ("부산광역시", ["해운대구", "부산진구", "동래구"]),
    ("인천광역시", ["연수구"]),
    ("대구광역시", ["수성구"]),
    ("대전광역시", ["유성구"]),
    ("광주광역시", ["광산구"]),
    ("제주특별자치도", ["제주시"]),
]

# ── GED detail pages ───────────────────────────────────────────────────────
GED_CITIES = [
    ("서울특별시", ["강남구", "서초구", "강서구", "노원구", "관악구"]),
    ("경기도",    ["수원시", "성남시", "용인시"]),
    ("부산광역시", ["해운대구"]),
    ("인천광역시", ["연수구"]),
    ("대구광역시", ["수성구"]),
]

# ── Essay region pages ─────────────────────────────────────────────────────
ESSAY_CITIES = [
    ("서울특별시", ["강남구", "서초구", "강서구", "마포구", "노원구"]),
    ("경기도",    ["수원시", "성남시", "용인시"]),
    ("부산광역시", ["해운대구"]),
]

# ── International school pages ─────────────────────────────────────────────
INTL_SCHOOLS = [
    "korean-foreign-school-seoul",
    "seoul-dwight-school",
    "chadwick-jeju",
    "nlcs-jeju",
]


def url_entry(loc, priority, changefreq):
    return (
        "  <url>\n"
        f"    <loc>{loc}</loc>\n"
        f"    <lastmod>{LASTMOD}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>"
    )


lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]

# Hub pages
for path, prio, freq in HUB_PAGES:
    loc = f"{BASE}/{path}" if path else f"{BASE}/"
    lines.append(url_entry(loc, prio, freq))

# region.html detail URLs
for province, cities in REGION_CITIES:
    for city in cities:
        loc = f"{BASE}/region.html?province={enc(province)}&amp;city={enc(city)}"
        lines.append(url_entry(loc, 0.8, "daily"))

# ged-detail.html URLs
for province, cities in GED_CITIES:
    for city in cities:
        loc = f"{BASE}/ged-detail.html?province={enc(province)}&amp;city={enc(city)}"
        lines.append(url_entry(loc, 0.7, "weekly"))

# essay-region.html URLs
for province, cities in ESSAY_CITIES:
    for city in cities:
        loc = f"{BASE}/essay-region.html?province={enc(province)}&amp;city={enc(city)}"
        lines.append(url_entry(loc, 0.7, "weekly"))

# international-detail.html URLs
for school in INTL_SCHOOLS:
    loc = f"{BASE}/international-detail.html?school={school}"
    lines.append(url_entry(loc, 0.7, "weekly"))

lines.append("</urlset>")

output = "\n".join(lines) + "\n"
out_path = ROOT / "sitemap.xml"
out_path.write_text(output, encoding="utf-8")
print(f"Wrote {out_path}")
print(f"Total URL entries: {output.count('<url>')}")
