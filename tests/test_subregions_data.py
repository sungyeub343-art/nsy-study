import json
import re
import unittest
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent


class SubregionsDataTests(unittest.TestCase):
    def test_jeonnam_gwangju_regions_are_merged(self):
        regions = json.loads((ROOT / "data" / "regions.json").read_text(encoding="utf-8"))
        provinces = {region["province"]: region["cities"] for region in regions}
        expected_cities = {
            "동구", "서구", "남구", "북구", "광산구",
            "목포시", "여수시", "순천시", "나주시", "광양시",
            "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군",
            "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군",
            "영광군", "장성군", "완도군", "진도군", "신안군",
        }

        self.assertNotIn("광주광역시", provinces)
        self.assertNotIn("전라남도", provinces)
        self.assertEqual(expected_cities, set(provinces["전남광주통합특별시"]))

    def test_jeonnam_gwangju_cities_have_subregions(self):
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        payload = content.removeprefix("// City -> town/eup/myeon mapping for local pages.\n// Extend this object to support more provinces and cities.\nwindow.subRegionsData = ").removesuffix(";\n")
        subregions = json.loads(payload)["전남광주통합특별시"]

        self.assertEqual(27, len(subregions))
        self.assertTrue(all(names for names in subregions.values()))
        self.assertIn("충장동", subregions["동구"])
        self.assertIn("돌산읍", subregions["여수시"])
        self.assertIn("흑산면", subregions["신안군"])

    def test_data_file_contains_multiple_provinces(self):
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        self.assertIn('"서울특별시"', content)
        self.assertIn('"부산광역시"', content)
        self.assertIn('"경기도"', content)
        self.assertIn('"대구광역시"', content)
        self.assertIn('"수성구"', content)
        self.assertIn('"범어1동"', content)
        self.assertIn('"달성군"', content)
        self.assertIn('"화원읍"', content)
        self.assertIn('"군위군"', content)
        self.assertIn('"삼국유사면"', content)
        self.assertIn('"강남구"', content)
        self.assertIn('"압구정동"', content)

    def test_data_file_contains_incheon_subregions(self):
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        self.assertIn('"인천광역시"', content)
        for district in ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"]:
            self.assertIn(f'"{district}"', content)
        for subregion in ["영종1동", "송림1동", "용현1·4동", "송도1동", "논현1동", "산곡1동", "계양1동", "청라1동", "강화읍", "백령면"]:
            self.assertIn(f'"{subregion}"', content)

    def test_daejeon_districts_have_subregions(self):
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        payload = content.split("window.subRegionsData = ", 1)[1].strip().removesuffix(";")
        subregions = json.loads(payload)["대전광역시"]

        self.assertEqual({"동구", "중구", "서구", "유성구", "대덕구"}, set(subregions))
        self.assertEqual(
            {"동구": 16, "중구": 17, "서구": 24, "유성구": 13, "대덕구": 12},
            {district: len(towns) for district, towns in subregions.items()},
        )
        self.assertTrue(all(len(towns) == len(set(towns)) for towns in subregions.values()))
        for district, town in {
            "동구": "판암1동",
            "중구": "은행선화동",
            "서구": "둔산1동",
            "유성구": "노은1동",
            "대덕구": "신탄진동",
        }.items():
            self.assertIn(town, subregions[district])

    def test_ulsan_districts_have_subregions(self):
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        payload = content.split("window.subRegionsData = ", 1)[1].strip().removesuffix(";")
        subregions = json.loads(payload)["울산광역시"]

        self.assertEqual({"중구", "남구", "동구", "북구", "울주군"}, set(subregions))
        self.assertEqual(
            {"중구": 12, "남구": 14, "동구": 9, "북구": 8, "울주군": 12},
            {district: len(towns) for district, towns in subregions.items()},
        )
        self.assertTrue(all(len(towns) == len(set(towns)) for towns in subregions.values()))
        for district, town in {
            "중구": "복산동",
            "남구": "야음장생포동",
            "동구": "남목3동",
            "북구": "농소1동",
            "울주군": "삼남읍",
        }.items():
            self.assertIn(town, subregions[district])

    def test_detail_pages_load_the_subregions_script(self):
        for filename in ["region.html", "essay-region.html", "ged-detail.html"]:
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('<script src="subregions-data.js', html)

    def test_font_resource_hints_are_present(self):
        for filename in ["index.html", "region.html", "international-detail.html", "ged-detail.html", "essay-region.html"]:
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('<link rel="dns-prefetch" href="https://fonts.googleapis.com"', html)
            self.assertIn('<link rel="dns-prefetch" href="https://fonts.gstatic.com"', html)

    def test_template_pages_default_to_noindex(self):
        templates = ["region.html", "ged-detail.html", "essay-region.html", "international-detail.html"]
        for filename in templates:
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('content="noindex,follow"', html, f"{filename} should default to noindex")

    def test_detail_page_scripts_use_valid_breadcrumb_jsonld(self):
        for filename in ["region.js", "essay-region.js", "ged-detail.js", "international-detail.js"]:
            content = (ROOT / filename).read_text(encoding="utf-8")
            self.assertRegex(
                content,
                r"upsertJsonLdScript\('breadcrumbSchema', \{\s*\"@context\": \"https://schema\.org\"",
                f"{filename} should define a valid breadcrumb schema object",
            )

    def test_sitemap_has_no_bare_template_urls(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        for bare in [
            "/region.html</",
            "/ged-detail.html</",
            "/essay-region.html</",
            "/international-detail.html</",
        ]:
            self.assertNotIn(bare, sitemap, f"Bare template URL {bare} should not be in sitemap")

    def test_sitemap_has_specific_region_urls(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        self.assertIn("region.html?province=", sitemap)
        self.assertIn("ged-detail.html?province=", sitemap)
        self.assertIn("essay-region.html?province=", sitemap)
        self.assertIn("international-detail.html?school=", sitemap)

    def test_daegu_region_urls_are_in_sitemap(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        self.assertIn("province=%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C&amp;city=%EC%88%98%EC%84%B1%EA%B5%AC", sitemap)

    def test_daejeon_district_and_town_urls_are_in_sitemap(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        payload = content.split("window.subRegionsData = ", 1)[1].strip().removesuffix(";")
        subregions = json.loads(payload)["대전광역시"]
        province = quote("대전광역시", safe="")

        for city, towns in subregions.items():
            city_url = f"province={province}&amp;city={quote(city, safe='')}"
            self.assertIn(city_url, sitemap)
            for town in towns:
                self.assertIn(f"{city_url}&amp;town={quote(town, safe='')}", sitemap)

    def test_ulsan_district_and_town_urls_are_in_sitemap(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        payload = content.split("window.subRegionsData = ", 1)[1].strip().removesuffix(";")
        subregions = json.loads(payload)["울산광역시"]
        province = quote("울산광역시", safe="")

        for city, towns in subregions.items():
            city_url = f"province={province}&amp;city={quote(city, safe='')}"
            self.assertIn(city_url, sitemap)
            for town in towns:
                self.assertIn(f"{city_url}&amp;town={quote(town, safe='')}", sitemap)

    def test_jeonnam_gwangju_city_and_town_urls_are_in_sitemap(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        province = quote("전남광주통합특별시", safe="")
        city = quote("여수시", safe="")
        town = quote("돌산읍", safe="")
        self.assertIn(f"province={province}&amp;city={city}", sitemap)
        self.assertIn(f"province={province}&amp;city={city}&amp;town={town}", sitemap)
        self.assertNotIn(f"province={quote('광주광역시', safe='')}&amp;", sitemap)


if __name__ == "__main__":
    unittest.main()
