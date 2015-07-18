v1.1.0
======
* added support for styling GeoJson layers (thanks to Ryan Cooper)
* renamed attributes on leaflet-map: no-dragging, no-touch-zoom, no-scroll-wheel-zoom, no-double-click-zoom, no-box-zoom, no-tap, no-track-resize, no-close-popup-on-click, no-bounce-at-zoom-limits, no-keyboard, no-inertia, no-zoom-control, no-attribution-control
* renamed attributes on leaflet-marker: no-clickable, no-keyboard

v1.0.2
======
* workaround for {s},{x},{y},{z} being escaped in tileset urls (thanks to Kevin Schaaf, John Eckhart, JustinCase1089)
* fixed fitToMarkers (thanks to Horacio Gonzalez)
* fixed an endless loop on dragging a highly zoomed map
* various documentation fixes (thanks to David Calhoun)

v1.0.1
======
* moved repository to https://github.com/leaflet-extras/leaflet-map
* fixed some urls and version numbers

v1.0.0
======
* breaking change: based on polymer 1.0, please check https://www.polymer-project.org/1.0/docs/migration.html
* breaking change: camelCase attributes renamed to all lower case with hyphen (e.g. maxZoom renamed to max-zoom)
* added geojson support (thanks to Rob Beers)
* fixed marker.zIndexOffset (thanks to Jason Shortall)

v0.3.2
======
* fixed syntax error in event handler for position updates of markers (thanks to bezineb5)

v0.3.1
======
* fixed divIcon syntax error (thanks to spoobar)
* fixed "observer_" not a variable in scope (thanks to fabiosantoscode)

v0.3.0
======
* merged leaflet-map-component by Prateek Saxena (leaflet-circle, leaflet-polygon, leaflet-polyline)
* added abstract leaflet-path element to style vector layers
* added layer-group
* split leaflet-map.html into leaflet-control.html, leaflet-layer.html, leaflet.map.html and leaflet-marker.html
  all files are included from leaflet-map.html, so no changes are required.

v0.2.0
======
* changed dependency from leaflet_bower to leaflet (which is available on bower, too)
* added support for leaflet-scale-control

v0.1.1
======
* registered on bower

v0.1.0
======
* dropped nhnb- prefix

r0.0.2
======
* added support for leaflet-geolocation
* added support for leaflet-tilelayer-wms
* added demonstration of data binding in a custom component
* changed property names to camelCase (attributes are case insensitive) 

r0.0.1
======
* added support for leaflet-divicon
* fixed events from markers
* added documentation for events

r0.0.0
======

* first pre-release version
* map, markers, icon, divicon, tilelayer
