# WPShortcode-pointmap

A Wordpress shortcode to join a CSV &amp; GeoJSON to make a map.

## Quick Start

1. Upload the files to your theme.

2. Include the `pointmaps/functions-pointmaps.php` file in your theme's `functions.php` file.

```
require_once 'pointmaps/functions-pointmaps.php';
```

3. Use a shortcode like this, supplying a CSV file and a GeoJSON file, and what fields in the CSV provide the lat/lng and name for the points.

```
[pointmap geofile="/data.counties_fl.json" csvfile="/data/pointmap_sample_fl_gda.csv" csvlatfield="Lat" csvlngfield="Lng" csvnamefield="City"]
```

## Shortcode Options

