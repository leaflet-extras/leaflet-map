import { customElement, css, LitElement, property } from 'lit-element';
import { DATA_ELEMENT_STYLES } from './data-element.css';
import { LeafletBase } from './base';

/**
 * Element which controls geo location (<a href="http://leafletjs.com/reference.html#map">Leaflet Reference</a>).
 *
 * @example
 * ```html
 *     <leaflet-geolocation watch enableHighAccuracy latitude="{{latitude}}" longitude="{{longitude}}"> </leaflet-geolocation>
 * ```

 * Fired when geolocation (using the locate method) went successfully.
 *
 * @event locationfound
 * @type LocationEvent
 * @param {LatLng} latlng Detected geographical location of the user.
 * @param {LatLngBounds} bounds Geographical bounds of the area user is located in (with respect to the accuracy of location).
 * @param {Number} accuracy Accuracy of location in meters.
 * @param {Number} altitude Height of the position above the WGS84 ellipsoid in meters.
 * @param {Number} altitudeAccuracy Accuracy of altitude in meters.
 * @param {Number} heading The direction of travel in degrees counting clockwise from true North.
 * @param {Number} speed Current velocity in meters per second.
 * @param {Number} timestamp The time when the position was acquired.

 * Fired when geolocation (using the locate method) failed.
 *
 * @event locationerror
 * @type ErrorEvent
 * @param {string} message Error message.
 * @param {number} code Error code (if applicable).

 * @element leaflet-geolocation
 * @blurb element which controls geo location.
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-geolocation')
export class LeafletGeolocation extends LeafletBase {
  static readonly is = 'leaflet-geolocation';

  static readonly styles = DATA_ELEMENT_STYLES;

  /**
   * The `watch` attribute sets wether location changes should be continous watching (instead of detecting it once) using W3C watchPosition method. You can later stop watching using map.stopLocate() method.
   */
  @property({ type: Boolean }) watch = false;

  /**
   * The `set-view` attribute sets whether the map view to the user location with respect to detection accuracy, or to world view if geolocation failed.
   *
   */
  @property({ type: Boolean, attribute: 'set-view' }) setView = false;

  /**
   * The `max-zoom` attribute sets the maximum zoom for automatic view setting when using `setView` option.
   *
   */
  @property({ type: Number, attribute: 'max-zoom' }) maxZoom =
    Number.MAX_SAFE_INTEGER;

  /**
   * The `timeout` attribute sets the number of milliseconds to wait for a response from geolocation before firing a locationerror event.
   */
  @property({ type: Number }) timeout = 10_000;

  /**
   * The `maximum-age` attribute sets maximum age of detected location. If less than this amount of milliseconds passed since last geolocation response, locate will return a cached location.
   *
   */
  @property({ type: Number, attribute: 'maximum-age' }) maximumAge = 0;

  /**
   * The `enable-high-accuracy` attribute sets whether high accuracy is enabled, see description in the W3C spec.
   *
   */
  @property({ type: Boolean, attribute: 'enable-high-accuracy' })
  enableHighAccuracy = false;

  /**
   * The `latitude` attribute returns the detected geographical location of the user.
   */
  @property({ type: Number }) latitude = null;

  /**
   * The `longitude` attribute returns the detected geographical location of the user.
   */
  @property({ type: Number }) longitude = null;

  /**
   * The `bounds` attribute returns the geographical bounds of the area user is located in (with respect to the accuracy of location).
   */
  @property({ type: Number }) bounds = null;

  /**
   * The `accuracy` attribute returns the accuracy of location in meters.
   */
  @property({ type: Number }) accuracy = null;

  /**
   * The `altitude` attribute returns the height of the position above the WGS84 ellipsoid in meters.
   */
  @property({ type: Number }) altitude = null;

  /**
   * The `altitude-accuracy` attribute returns the accuracy of altitude in meters.
   *
   */
  @property({ type: Number, attribute: 'altitude-accuracy' })
  altitudeAccuracy = null;

  /**
   * The `heading` attribute returns the direction of travel in degrees counting clockwise from true North.
   */
  @property({ type: Number }) heading = null;

  /**
   * The `speed` attribute returns the current velocity in meters per second.
   */
  @property({ type: Number }) speed = null;

  /**
   * The `timestamp` attribute returns the time when the position was acquired.
   */
  @property({ type: Number }) timestamp = null;

  _container: L.Map;

  get container() {
    return this._container;
  }

  set container(v) {
    this._container = v;
    if (this.container) {
      this.container.on('locationfound locationerror', this.onLeafletEvent);

      this.container.on(
        'locationfound',
        function (e) {
          this.latitude = e.latlng.lat;
          this.longitude = e.latlng.lng;
          this.bounds = e.bounds;
          this.accuracy = e.accuracy;
          this.altitude = e.altitude;
          this.altitudeAccuracy = e.altitudeAccuracy;
          this.heading = e.heading;
          this.speed = e.speed;
          this.timestamp = e.timestamp;
        },
        this
      );

      this.container.locate({
        watch: this.watch,
        setView: this.setView,
        maxZoom: this.maxZoom,
        timeout: this.timeout,
        maximumAge: this.maximumAge,
        enableHighAccuracy: this.enableHighAccuracy,
      });
    }
  }
}
