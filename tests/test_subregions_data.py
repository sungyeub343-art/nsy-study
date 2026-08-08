import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class SubregionsDataTests(unittest.TestCase):
    def test_data_file_contains_multiple_provinces(self):
        content = (ROOT / "subregions-data.js").read_text(encoding="utf-8")
        self.assertIn('"서울특별시"', content)
        self.assertIn('"부산광역시"', content)
        self.assertIn('"경기도"', content)
        self.assertIn('"대구광역시"', content)
        self.assertIn('"강남구"', content)
        self.assertIn('"압구정동"', content)

    def test_detail_pages_load_the_subregions_script(self):
        for filename in ["region.html", "essay-region.html", "ged-detail.html"]:
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('<script src="subregions-data.js', html)

    def test_font_resource_hints_are_present(self):
        for filename in ["index.html", "region.html", "international-detail.html", "ged-detail.html", "essay-region.html"]:
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('<link rel="dns-prefetch" href="https://fonts.googleapis.com"', html)
            self.assertIn('<link rel="dns-prefetch" href="https://fonts.gstatic.com"', html)


if __name__ == "__main__":
    unittest.main()
