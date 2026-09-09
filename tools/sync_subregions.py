"""Fill missing city subregions from the nationwide administrative GeoJSON."""
import json
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
REGIONS_PATH = ROOT / "data" / "regions.json"
SUBREGIONS_PATH = ROOT / "subregions-data.js"
GEOJSON_PATH = ROOT / "hangjeong.geojson"
PREFIX = (
    "// City -> town/eup/myeon mapping for local pages.\n"
    "// Extend this object to support more provinces and cities.\n"
    "window.subRegionsData = "
)

PROVINCE_ALIASES = {
    "강원도": ["강원특별자치도"],
    "전라북도": ["전북특별자치도"],
    "전남광주통합특별시": ["광주광역시", "전라남도"],
}

CITY_ALIASES = {
    ("세종특별자치시", "세종특별자치시"): [("세종특별자치시", "세종시")],
    ("경상북도", "군위군"): [("대구광역시", "군위군")],
}


def load_subregions():
    source = SUBREGIONS_PATH.read_text(encoding="utf-8")
    payload = source.split("window.subRegionsData = ", 1)[1].strip().removesuffix(";")
    return json.loads(payload)


def build_geojson_index():
    geojson = json.loads(GEOJSON_PATH.read_text(encoding="utf-8"))
    index = defaultdict(list)
    for feature in geojson["features"]:
        properties = feature["properties"]
        key = (properties["sidonm"], properties["sggnm"])
        town = properties["adm_nm"].removeprefix(f"{properties['sidonm']} {properties['sggnm']} ")
        if town not in index[key]:
            index[key].append(town)
    return index


def source_keys(province, city, index):
    alias = CITY_ALIASES.get((province, city))
    if alias:
        return alias

    provinces = PROVINCE_ALIASES.get(province, [province])
    exact = [(source_province, city) for source_province in provinces if (source_province, city) in index]
    if exact:
        return exact

    return sorted(
        (source_province, source_city)
        for source_province in provinces
        for source_city in {key[1] for key in index if key[0] == source_province}
        if source_city.startswith(city) and source_city != city
    )


def extract_towns(province, city, index):
    towns = []
    for source_province, source_city in source_keys(province, city, index):
        district = source_city[len(city):]
        for town in index[(source_province, source_city)]:
            label = f"{district} {town}" if district else town
            if label not in towns:
                towns.append(label)
    return towns


def write_subregions(regions, subregions):
    lines = [PREFIX + "{"]
    for province_index, region in enumerate(regions):
        province = region["province"]
        lines.append(f"  {json.dumps(province, ensure_ascii=False)}: {{")
        for city_index, city in enumerate(region["cities"]):
            comma = "," if city_index < len(region["cities"]) - 1 else ""
            names = json.dumps(subregions[province][city], ensure_ascii=False)
            lines.append(f"    {json.dumps(city, ensure_ascii=False)}: {names}{comma}")
        province_comma = "," if province_index < len(regions) - 1 else ""
        lines.append(f"  }}{province_comma}")
    lines.append("};")
    SUBREGIONS_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    regions = json.loads(REGIONS_PATH.read_text(encoding="utf-8"))
    subregions = load_subregions()
    index = build_geojson_index()
    added = 0

    for region in regions:
        province = region["province"]
        province_data = subregions.setdefault(province, {})
        for city in region["cities"]:
            if province_data.get(city):
                continue
            towns = extract_towns(province, city, index)
            if not towns:
                raise ValueError(f"No subregions found for {province} {city}")
            province_data[city] = towns
            added += 1

    write_subregions(regions, subregions)
    total = sum(len(names) for cities in subregions.values() for names in cities.values())
    print(f"Added {added} cities; wrote {total} subregions")


if __name__ == "__main__":
    main()