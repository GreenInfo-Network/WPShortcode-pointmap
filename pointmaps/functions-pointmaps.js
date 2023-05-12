/**
 * createPointMap(divid, options)
 * create a hex map with the [pointmap] shortcode
 */

function createPointMap (divid, options) {
    // default options and options validation
    options = Object.assign({
        // geofile and csvfile = string, the names of the CSV and GeoJSON file, under the data-download area
        'geofile': '',
        'csvfile': '',
        // field names within the CSV file: lat and long, name for tooltip, popup HTML content
        'csvlatfield': 'Latitude',
        'csvlngfield': 'Longitude',
        'csvnamefield': 'Name',
        'csvpopupfield': 'Popup',
        // areafillcolor and areabordercolor = colors for the polygonal background map; use #RRGGBB code or a well-known browser color
        'areafillcolor': 'white',
        'areabordercolor': 'black',
        // pointfillcolor and pointbordercolor = colors for the marker circles; use #RRGGBB code or a well-known browser color
        'pointfillcolor': 'silver',
        'pointbordercolor': 'black',
        // pointradius = integer, radius of the circle marker in pixels
        'pointradius': 10,
        // downloadbuttoncssclass = CSS classes to apply to the Download PNG button; pass blank to not add the button
        'downloadbuttoncssclass': '',
        // caption = string, a caption for the table which will be displayed at the bottom
        'caption': '',
        // width = a CSS string for the width of the wrapper/container e.g. "500px" or "100%" or "calc(100% - 50px)"
        'width': undefined,
    }, options);

    if (! options.csvlatfield) throw new Error('createPointMap() missing required option: csvlatfield');
    if (! options.csvlngfield) throw new Error('createPointMap() missing required option: csvlngfield');
    if (! options.csvnamefield) throw new Error('createPointMap() missing required option: csvnamefield');
    if (! options.csvpopupfield) throw new Error('createPointMap() missing required option: csvpopupfield');

    // set the wrapper's width, if given, and check that the target element exists
    const div = document.getElementById(divid);
    if (! div) throw new Error(`createPointMap() no such DIV ${divid}`);
    const bottomarea = document.getElementById(`${divid}-after`);

    if (options.width) {
        div.parentElement.style.width = options.width;
    }

    // fetch the CSV file and GeoJSON file, then initialize
    const geourl = `/data-downloads/${options.geofile}`;
    const csvurl = `/data-downloads/${options.csvfile}`;
    let MAP;

    jQuery.getJSON(geourl, function (geodata) {
        Papa.parse(csvurl, {
            download: true,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: function (results) {
                // start up the map
                MAP = L.map(divid, {
                    attributionControl: false,
                    zoomControl: false,
                    dragging: false,
                    doubleClickZoom: false,
                    boxZoom: false,
                    keyboard: false,
                    touchZoom: false,
                    scrollWheelZoom: false,
                    zoomSnap: 0.01,
                });

                // add the GeoJSON boundaries
                // and zoom to it
                MAP.PLACES = L.geoJSON(geodata, {
                    style: {
                        color: options.areabordercolor,
                        weight: 0.25,
                        fillOpacity: 1,
                        fillColor: options.areafillcolor,
                    },
                })
                .addTo(MAP);

                function fitMapBounds () {
                    MAP.fitBounds(MAP.PLACES.getBounds());
                }
                MAP.on('popupclose', function () {
                    fitMapBounds();
                });
                MAP.on('resize', function () {
                    MAP.closePopup();
                    fitMapBounds();
                });
                fitMapBounds();

                // add the CSV points
                results.data.forEach((row) => {
                    const lat = parseFloat(row[options.csvlatfield]);
                    const lng = parseFloat(row[options.csvlngfield]);
                    const name = row[options.csvnamefield];
                    const popuphtml = row[options.csvpopupfield];

                    if (! lat || isNaN(lat)) return console.error(`createPointMap() skipping CSV row with blank ${options.csvlatfield}`);
                    if (! lng || isNaN(lng)) return console.error(`createPointMap() skipping CSV row with blank ${options.csvlngfield}`);
                    if (! name) return console.error(`createPointMap() skipping CSV row with blank ${options.csvnamefield}`);
                    if (! popuphtml) return console.error(`createPointMap() skipping CSV row with blank ${options.csvpopupfield}`);

                    const marker = L.circleMarker([lat, lng], {
                        radius: options.pointradius,
                        color: options.pointbordercolor,
                        weight: 1,
                        fillOpacity: 1,
                        fillColor: options.pointfillcolor,
                    })
                    .bindTooltip(function (layer) {
                        // bounce off textContent to sanitize HTML/JS
                        const content = document.createElement('DIV');
                        content.textContent = name;
                        return content;
                    })
                    .bindPopup(function (layer) {
                        // bounce off textContent to sanitize HTML/JS
                        const nameblock = document.createElement('STRONG');
                        nameblock.textContent = name;

                        const contentblock = document.createElement('DIV');
                        contentblock.textContent = popuphtml;

                        const content = document.createElement('DIV');
                        content.appendChild(nameblock);
                        content.appendChild(contentblock);
                        return content;
                    })
                    .addTo(MAP);
                });

                // add a Download PNG button
                if (options.downloadbuttoncssclass) {
                    const button = document.createElement('button');
                    button.innerText = 'Download PNG';
                    button.className = options.downloadbuttoncssclass;
                    bottomarea.appendChild(button);

                    button.addEventListener('click', () => {
                        domtoimage
                            .toPng(div)
                            .then(function (dataUrl) {
                                const link = document.createElement('a');
                                link.download = 'map.png';
                                link.href = dataUrl;
                                link.click();
                            })
                            .catch(function (error) {
                                console.error('createPointMap() PNG export failed', error);
                            });
                    });
                }

                // add the caption
                if (options.caption) {
                    const caption = document.createElement('DIV');
                    caption.id = `${divid}-caption`;
                    caption.textContent = options.caption;
                    bottomarea.appendChild(caption);
                    div.setAttribute('aria-described-by', caption.id);
                }
            },
            error: function() {
                console.error(`createPointMap() Could not load CSV file ${csvurl}`);
            },
        });
    }).fail(function () {
        console.error(`createPointMap() Could not load GeoJSON file ${geourl}`);
    });
}
