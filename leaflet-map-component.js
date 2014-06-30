Polymer( 'leaflet-map', {

    // Setting Defaults
    publish: {
        latitude: {
            value: 15.466736,
            reflect: true
        },
        longitude: {
            value: 73.808159,
            reflect: true
        },
        zoom: {
            value: 10,
            reflect: true
        }
    },
    tileServer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',

    observe: {
        latitude: 'updateCenter',
        longitude: 'updateCenter'
    },

    attached: function () {
        var baseLayer = L.tileLayer( this.tileServer );
        var lat = this.latitude;
        var lon = this.longitude;
        var zoom = this.zoom;

        this.map = new L.Map( this.$.map , {
            center: new L.LatLng( this.latitude, this.longitude ),
            zoom: this.zoom,
            layers: [baseLayer]
        } );

        this.map.on( 'zoomend', function ( event ) {
            this.zoom = event.target.getZoom();
        }.bind( this ) );

        this.map.on( 'dragend', function ( event ) {
            var center = event.target.getCenter();
            this.latitude = center.lat;
            this.longitude = center.lng;
        }.bind( this ) );

        this.updateMarkers();
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
    },

    updateMarkers: function () {
        this.markers = Array.prototype.slice.call( this.$.markers.getDistributedNodes() );

        this.onMutation( this, this.updateMarkers );

        if ( this.markers.length && this.map ) {
            for ( var i = 0, m; m = this.markers[i]; i++ ) {
                m.map = this.map;
            }

            // Keep in view
        }
    }
} );
