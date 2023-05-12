# WPShortcode-pointmap

A Wordpress shortcode to join a CSV & GeoJSON to make a map. The GeoJSON features will be displayed as a base map, and the points from the CSV will be drawn over top.

Amenities and features:
- Supply an arbitrary CSV and GeoJSON file, enter a WP shortcode, and get a map
- the map is really Leaflet though with much interactivity turned off
  - dynamic bounding box fitting and re-adjustment
  - infinite extensibility if you want yours to do something else
- Download PNG button using dom-to-image
- Caption, which is ARIA-linked to the map DIV for a11y


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

* `geofile` = Required. URL of the GeoJSON file.
* `csvfile` = Required. URL of the CSV file.


* `csvlatfield` = The CSV column providing the latitude of each point.
  * Defaults to "Latitude"
* `csvlngfield` = The CSV column providing the longitude of each point.
  * Defaults to "Longitude"
* `csvnamefield` = The CSV column providing the name of each point, which will be displayed in tooltips.
  * Defaults to "Name"
* `csvpopupfield` = The CSV column providing the popup content for each point, displayed when the point is clicked.
  * Defaults to "Popup"
  * This should be plain text and not HTML. HTML is escaped and will be visible instead of rendered, to prevent malicious HTML/JavaScript from being used.
* `areafillcolor` = The color to fill areas.
  * Defaults to "white"
* `areabordercolor` = The color for the areas' boundaries.
  * Defaults to "black"
* `pointfillcolor` = The color for the circle marker fills.
  * Defaults to "silver"
* `pointbordercolor` = The color for the circle marker outline.
  * Defaults to "black"
* `pointradius` = 
  * Defaults to "10"
* `caption` = An optional caption to be placed below the map. This is linked to the map's `aria-describedby` for accessibility purposes.
* `width` = A width for the generated map, in CSS format.
  * Example: `width="800px"`
* `downloadbuttoncssclass` = CSS classes to apply to the Download PNG button, to fit into your site's other buttons and style.
  * Default is `btn btn-sm btn-primary` which fits Bootstrap 4 and 5
  * If you specify blank `downloadbuttoncssclass=""` then the button will not be displayed.
