# leaflet-map-component
The `leaflet-map` element renders a [Leaflet](http://leafletjs.com/) map.

**Example:**
```html
<style>
  leaflet-map {
    height: 100%;
  }
</style>
<leaflet-map longitude="77.2" latitude="28.4" zoom="12"></leaflet-map>
```

**Example:** Add markers & circles
```html
<leaflet-map longitude="77.2" latitude="28.4" zoom="12">
  <leaflet-marker longitude="77.2" latitude="28.4">
    Marker
  </leaflet-marker>
  <leaflet-circle longitude="77.2" latitude="28.4" radius="300">
    Circle
  </leaflet-circle>
</leaflet-map>
```

## leaflet-map

|Attribute|Description|
|---------|-----------|
|**tileServer**|*string* URL of the tile server to be used|
|**latitude**|*number* A latitude to center on the map|
|**longitude**|*number* A longitude to center on the map|
|**zoom**|*number* A zoom level to set to the map|

## leaflet-marker

|Attribute|Description|
|---------|-----------|
|**latitude**|*number* A latitude to position the marker|
|**longitude**|*number* A longitude to position the marker|

## leaflet-circle

|Attribute|Description|
|---------|-----------|
|**latitude**|*number* A latitude to position the marker|
|**longitude**|*number* A longitude to position the marker|
|**radius**|*number*: Radius of circle in meters|