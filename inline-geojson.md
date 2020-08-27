```html
<leaflet-map longitude="102.304" latitude="0.3516" zoom="6">
	<leaflet-tilelayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom="18">
		Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
		<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
		Imagery &copy; <a href="http://mapbox.com">Mapbox</a>
	</leaflet-tilelayer>
	<leaflet-geojson color="#FF0000">
		<script type="application/json">
		{
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [102.0, 0.5]
					},
					"properties": {
						"prop0": "value0"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "LineString",
						"coordinates": [
									[102.0, 0.0],
									[103.0, 1.0],
									[104.0, 0.0],
									[105.0, 1.0]
						]
					},
					"properties": {
						"prop0": "value0",
						"prop1": 0.0
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": [
							[
								[100.0, 0.0],
								[101.0, 0.0],
								[101.0, 1.0],
								[100.0, 1.0],
								[100.0, 0.0]
							]
						]
					},
					"properties": {
						"prop0": "value0",
						"prop1": {
							"this": "that"
						}
					}
				}
			]
		}
		</script>
	</leaflet-geojson>
</leaflet-map>
```

Or fetch the GeoJSON and assign it to the `<leaflet-geojson>` `data` property.

```js
const handleAsJson = r => r.json()
fetch('demo-geojson.json')
	.then(handleAsJson)
	.then(data => {
		document.querySelector('#leafletgeojson > leaflet-geojson')
			.data = data
	})
```
