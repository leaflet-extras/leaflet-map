Polymer( 'leaflet-map', {
    ready: function () {
        var baseLayer = L.tileLayer( 'http://{s}.tile.osm.org/{z}/{x}/{y}.png');
        var map = new L.Map( this.$.map , {
                center: new L.LatLng(51.505, -0.09),
                zoom: 12,
            layers: [baseLayer]
        });
    }
} );
