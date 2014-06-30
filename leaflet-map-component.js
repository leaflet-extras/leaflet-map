Polymer( 'leaflet-map', {

    // Setting Defaults
    latitude: 15.466736,
    longitude: 73.808159,
    zoom: 10,
    tileServer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',

    observe: {
        latitude: 'updateCenter',
        longitude: 'updateCenter'
    },

    ready: function () {
        var baseLayer = L.tileLayer( this.tileServer );
        var lat = this.latitude;
        var lon = this.longitude;
        var zoom = this.zoom;
        this.map = new L.Map( this.$.map , {
            center: new L.LatLng( this.latitude, this.longitude ),
            zoom: this.zoom,
            layers: [baseLayer]
        } );
    },

    zoomChanged: function () {
        if ( this.map ) {
            this.map.setZoom( this.zoom );
        }
    },

    updateCenter: function () {
        if ( this.map && this.latitude && this.longitude ) {
            this.map.panTo( L.latLng( this.latitude, this.longitude ), { animate: true } );
        }
    }
} );
