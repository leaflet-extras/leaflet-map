Polymer( 'leaflet-marker', {
    marker: null,
    map: null,
    info: null,
    publish: {
        longitude: {
            value: null,
            reflect: true
        },
        latitude: {
            value: null,
            reflect: true
        }
    },

    ready: function () {
        this.mapReady();
    },

    mapChanged: function () {
        this.mapReady();
    },

    mapReady: function () {
        if ( this.latitude && this.longitude && this.map ) {
            this.marker = L.marker( [this.latitude, this.longitude] );
            this.marker.addTo( this.map );
            this.contentChanged();
        }
    },

    contentChanged: function () {
        this.onMutation( this, this.contentChanged );
        var content = this.innerHTML;
        this.marker.bindPopup( content );
    }
} );
