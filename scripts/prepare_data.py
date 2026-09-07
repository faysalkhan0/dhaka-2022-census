from pathlib import Path
import geopandas as gpd

GPKG = Path("gis/Dhaka_2022_Census_Hierarchical.gpkg")
OUT = Path("data/geojson")

OUT.mkdir(parents=True, exist_ok=True)

# CHANGE THIS after checking ogrinfo.
LAYER = "dhaka_2022_census"

gdf = gpd.read_file(GPKG, layer=LAYER)

print("Total features:", len(gdf))
print("CRS:", gdf.crs)

# Make sure web coordinates are WGS84.
if gdf.crs is None:
    raise ValueError("GPKG has no CRS.")

gdf = gdf.to_crs(4326)

# Standardize level values.
gdf["LEVEL_STANDARD"] = (
    gdf["LEVEL_STANDARD"]
    .astype(str)
    .str.strip()
    .str.lower()
)

LEVELS = {
    "district": "district",
    "city_corporation": "city_corporation",
    "upazila": "upazila",
    "municipality": "municipality",
    "union_ward": "union_ward",
    "mauza": "mauza",
    "village": "village",
}

for level_value, filename in LEVELS.items():

    subset = gdf[
        gdf["LEVEL_STANDARD"] == level_value
    ].copy()

    print(
        f"{level_value}: {len(subset)} features"
    )

    if len(subset) == 0:
        continue

    output = OUT / f"{filename}.geojson"

    subset.to_file(
        output,
        driver="GeoJSON"
    )

    print("Written:", output)