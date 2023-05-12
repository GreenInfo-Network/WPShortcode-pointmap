<?php
/**
 * SUM TABLE & CHART SHORTCODE
 * [pointmap]
 * shortcode to show a GeoJSON background map, with points overlaid from a CSV
 * see also pointmaps.js and pointmaps.css which provide the frontend code, including the params & options
 *
 * example:
 * [pointmap geofile="counties_fl.json" csvfile="pointmap_sample_fl_gda.csv" areafillcolor="yellow" areabordercolor="red" pointbordercolor="green" pointfillcolor="orange" csvlatfield="Lat" csvlngfield="Lng" csvnamefield="City" csvpopupfield="Info"]
 */

add_shortcode('pointmap', function ($atts) {
    // set defaults, validate, split comma-joined strings into lists
    $atts = shortcode_atts(array(
        'geofile' => '',  // string
        'csvfile' => '',  // string
        'csvlatfield' => 'Latitude',  // string
        'csvlngfield' => 'Longitude',  // string
        'csvnamefield' => 'Name',  // string
        'csvpopupfield' => 'Popup',  // string
        'areafillcolor' => 'white',  // string, a known color or hex code
        'areabordercolor' => 'black',  // string, a known color or hex code
        'pointfillcolor' => 'silver',  // string, a known color or hex code
        'pointbordercolor' => 'black',  // string, a known color or hex code
        'pointradius' => 10,  // integer
        'downloadbuttoncssclass' => 'btn btn-sm btn-primary mt-1',  // string or blank
        'caption' => '',  // string
        'width' => '',  // string
    ), $atts);

    // enqueue necessary libraries
    wp_enqueue_script('papaparse', get_template_directory_uri() . '/libraries/papaparse-5.4.1.min.js');

    wp_enqueue_script('leaflet', get_template_directory_uri() . '/libraries/leaflet-1.9.3.js');
    wp_enqueue_style('leaflet', get_template_directory_uri() . '/libraries/leaflet-1.9.3.css');

    wp_enqueue_script('domtoimage', get_template_directory_uri() . '/libraries/domtoimagemore-3.1.6.min.js');

    wp_enqueue_script('pointmaps', get_template_directory_uri() . '/functions-pointmaps.js');
    wp_enqueue_style('pointmaps', get_template_directory_uri() . '/functions-pointmaps.css');

    // construct and return HTML
    $attrsjson = json_encode($atts);
    $divid = 'pointmap-' . md5(rand());
    $html = "
        <div class=\"pointmap-wrapper\">
            <div id=\"$divid\" class=\"pointmap\" role=\"img\" aria-label=\"Map\"></div>
            <div class=\"pointmap-after\" id=\"$divid-after\"></div>
            <script>window.addEventListener('DOMContentLoaded', () => { createPointMap('$divid', $attrsjson); });</script>
        </div>
    ";
    return $html;
});
