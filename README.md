# leaflet-map

*leaflet-map* is a web-component which provides access to the [leaflet map](http://leafletjs.com)
JavaScript library via html elements.

Please have a look at the [demo](https://leaflet-extras.github.io/leaflet-map/demo.html) or the [api documentation](https://leaflet-extras.github.io/leaflet-map/doc.html#leaflet-map).

Most of the options documented in the Leaflet reference are exported as html attributes.
All events are mapped into html events of the same name.</p>
For example use &lt;leaflet-map latitude="51.505" longitude="-0.09" zoom="13"&gt; &lt;/leaflet-map&gt;
to define the view and zoom level.


## Quickstart Guide

Make leaflet maps using declarative web components.
To get started read the [documentation](http://leaflet-extras.github.io/leaflet-map/doc.html)
or checkout the [demo](http://leaflet-extras.github.io/leaflet-map/).

Install this web component using [npm](https://npm.im/leaflet-element):

```
npm i -S leaflet-element
```

Import the main component and start creating your map:

```js
import 'leaflet-element'
```
```html
  <head>
    <style>
      html, body {
        margin: 0;
        height: 100%;
      }
      leaflet-map {
        height: 100%;
      }
    </style>
  </head>
  <body>
    <leaflet-map fit-to-markers>
      <leaflet-marker longitude="77.2" latitude="28.4">
        Marker I
      </leaflet-marker>
      <leaflet-circle longitude="77.2" latitude="28.4" radius="300">
        Round
      </leaflet-circle>
    </leaflet-map>
  </body>
```


## Status

Although leaflet-map is still under heavy development, it is already fully usable.

List of demos:

* [leaflet-map](https://leaflet-extras.github.io/leaflet-map/demo.html#view) (L.map)
* [leaflet-marker](https://leaflet-extras.github.io/leaflet-map/demo.html#marker) (L.marker)
* [leaflet-icon](https://leaflet-extras.github.io/leaflet-map/demo.html#icon) (L.icon)
* [leaflet-divicon](https://leaflet-extras.github.io/leaflet-map/demo.html#icon) (L.divicon) (since 0.0.1)
* [leaflet-circle](https://leaflet-extras.github.io/leaflet-map/demo.html#vector) (L.circle) (since 0.3.0)
* [leaflet-polygon](https://leaflet-extras.github.io/leaflet-map/demo.html#vector) (L.polygon) (since 0.3.0)
* [leaflet-polyline](https://leaflet-extras.github.io/leaflet-map/demo.html#vector) (L.polyline) (since 0.3.0)
* [leaflet-tilelayer](https://leaflet-extras.github.io/leaflet-map/demo.html#tilelayer) (L.tileLayer)
* [leaflet-tilelayer-wms](https://leaflet-extras.github.io/leaflet-map/demo.html#layerwms) (L.tileLayer.wms)  (since 0.0.2)
* [leaflet-scale-control](https://leaflet-extras.github.io/leaflet-map/demo.html#scale) (L.control.scale) (since 0.2.0)
* [leaflet-geojson](https://leaflet-extras.github.io/leaflet-map/demo.html#geojson) (since 0.4.0)
* [leaflet-geolocation](https://leaflet-extras.github.io/leaflet-map/demo.html#databinding) (part of L.map) (since 0.0.2)

Please have a look at the [change log](https://github.com/nhnb/leaflet-map/blob/master/CHANGES.md), for recent developments.

## Notes for implementing child elements

Child elements like markers or layers will be initialized by the surrounding container (the map or a layer)
by setting a "container" javascript property.
Therefore the child element should define a _containerChanged method and use that as initializer.
Don't forget to define a detached method to support removal of elements. The leaflet-marker element is a good template.


## License

leaflet-map is based on polymer and leaflet. Small parts of leaflet,
especially the api documentation, have been copied into leaflet-map files.

* [Leaflet](https://github.com/Leaflet/Leaflet/blob/master/LICENSE)
* [Polymer](https://github.com/polymer/polymer/blob/master/LICENSE.txt)


Copyright (c) 2014-2016
Hendrik Brummermann, Prateek Saxena

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
