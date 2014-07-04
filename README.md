# leaflet-map-component

Make leaflet maps using declarative [Polymer](http://polymer-project.org) web components.
To get started read the [documentation](http://prtksxna.github.io/leaflet-map-component/)
or checkout the [demo](http://prtksxna.github.io/leaflet-map-component/components/leaflet-map-component/demo.html).

## Quickstart Guide

Install this web component using [Bower](http://bower.io):

```
bower install leaflet-map-component
```

Import the main component and start creating your map:

```html
  <head>
    <script src="../platform/platform.js"></script>
    <link rel="import" href="leaflet-map-component.html">
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
  <body unresolved>
    <leaflet-map longitude="77.2" latitude="28.4" zoom="12">
      <leaflet-marker longitude="77.2" latitude="28.4">
        Marker I
      </leaflet-marker>
      <leaflet-circle longitude="77.2" latitude="28.4" radius="300">
        Round
      </leaflet-circle>
    </leaflet-map>
  </body>
```

##License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
