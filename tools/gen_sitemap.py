"""Generate sitemap.xml with real region/detail URLs."""
import json
from urllib.parse import quote
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LASTMOD = "2026-08-28"
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
    ("대구광역시", ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"]),
    ("대전광역시", ["동구", "중구", "서구", "유성구", "대덕구"]),
    ("전남광주통합특별시", ["동구", "서구", "남구", "북구", "광산구",
                         "목포시", "여수시", "순천시", "나주시", "광양시",
                         "담양군", "곡성군", "구례군", "고흥군", "보성군",
                         "화순군", "장흥군", "강진군", "해남군", "영암군",
                         "무안군", "함평군", "영광군", "장성군", "완도군",
                         "진도군", "신안군"]),
    ("제주특별자치도", ["제주시"]),
]


def load_subregions():
    source = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
    payload = source.split("window.subRegionsData = ", 1)[1].strip().removesuffix(";")
    return json.loads(payload)

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
subregions = load_subregions()
for province, cities in REGION_CITIES:
    for city in cities:
        loc = f"{BASE}/region.html?province={enc(province)}&amp;city={enc(city)}"
        lines.append(url_entry(loc, 0.8, "daily"))
        for town in subregions.get(province, {}).get(city, []):
            town_loc = f"{loc}&amp;town={enc(town)}"
            lines.append(url_entry(town_loc, 0.7, "weekly"))

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
