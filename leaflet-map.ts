import {
  html,
  css,
  customElement,
  property,
  query,
  PropertyValues,
  TemplateResult,
} from 'lit-element';

import { LeafletBase } from './base';

import { bound } from './bound-decorator';

import * as L from 'leaflet';

interface FeatureElement extends LeafletBase {
  feature: L.LayerGroup | L.Polyline | L.Polygon | L.Marker;
  layer: L.LayerGroup | L.Layer;
}

const isFeatureElement = (
  x: Node & Partial<FeatureElement>
): x is Node & FeatureElement => x && 'feature' in x;

const EVENTS = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'contextmenu',
  'focus',
  'blur',
  'preclick',
  'load',
  'unload',
  'viewreset',
  'movestart',
  'move',
  'moveend',
  'dragstart',
  'drag',
  'dragend',
  'zoomstart',
  'zoomend',
  'zoomlevelschange',
  'resize',
  'autopanstart',
  'layeradd',
  'layerremove',
  'baselayerchange',
  'overlayadd',
  'overlayremove',
  'locationfound',
  'locationerror',
  'popupopen',
  'popupclose',
].join(' ');

/**
 * @typedef {LeafletMouseEvent}
 *
 * @param {LatLng} latlng The geographical point where the mouse event occured.
 * @param {Point} layerPoint Pixel coordinates of the point where the mouse event occured relative to the map layer.
 * @param {Point} containerPoint Pixel coordinates of the point where the mouse event occured relative to the map сontainer.
 * @param {DOMMouseEvent} originalEvent The original DOM mouse event fired by the browser.
 */

/**
 * @typedef {Event} LeafletDragEndEvent
 * @param {number} distance The distance in pixels the draggable element was moved by.
 */

/**
 * @typedef {Event} LeafletResizeEvent
 * @param {Point}	oldSize	The old size before resize event.
 * @param {Point}	newSize	The new size after the resize event.
 */

/**
 * @typedef {Event} LeafletLayerEvent
 * @param {ILayer}	layer	The layer that was added or removed.
 */

/**
 * @typedef {Event} LeafletLocationEvent
 * @param {LatLng} latlng Detected geographical location of the user.
 * @param {LatLngBounds} bounds Geographical bounds of the area user is located in (with respect to the accuracy of location).
 * @param {Number} accuracy Accuracy of location in meters.
 * @param {Number} altitude Height of the position above the WGS84 ellipsoid in meters.
 * @param {Number} altitudeAccuracy Accuracy of altitude in meters.
 * @param {Number} heading The direction of travel in degrees counting clockwise from true North.
 * @param {Number} speed Current velocity in meters per second.
 * @param {Number} timestamp The time when the position was acquired.
 */

/**
 * @typedef {Event} LeafletPopupEvent
 * @param {Popup} popup The popup that was opened or closed.
 */

/**
 * Element which defines a Leaflet map (<a href="http://leafletjs.com/reference.html#map">Leaflet Reference</a>).
 *
 * @example
 * ```html
 *     <leaflet-map> </leaflet-map>
 * ```
 *
 * This simple example will show a map of the world. It is pan and zoomable.
 *
 * @example
 *
 * ```html
 *     <leaflet-map latitude="78.8" longitude="-96" zoom="5">
 *
 *         <leaflet-marker latitude="51.5" longitude="-0.10" title="Some title">
 *             <b>Popup text</b>
 *         </leaflet-marker>
 *
 *     </leaflet-map>
 * ```
 *
 * This code will zoom in on the specified latitude and longitude coordinates. Further, it will
 * add a marker with a popup text.
 *
 * @example
 * ##### Add markers & circles
 * ```html
 *     <leaflet-map longitude="77.2" latitude="28.4" zoom="12">
 *         <leaflet-marker longitude="77.2" latitude="28.4">
 *             Marker
 *         </leaflet-marker>
 *         <leaflet-circle longitude="77.2" latitude="28.4" radius="300">
 *             Circle
 *         </leaflet-circle>
 *     </leaflet-map>
 * ```
 *

 * @fires {LeafletMouseEvent} click - Fired when the user clicks (or taps) the marker.
 * @fires {LeafletMouseEvent} dblclick - Fired when the user double-clicks (or double-taps) the marker.
 * @fires {LeafletMouseEvent} mousedown - Fired when the user pushes the mouse button on the marker.
 * @fires {LeafletMouseEvent} mouseover - Fired when the mouse enters the marker.
 * @fires {LeafletMouseEvent} mouseout - Fired when the mouse leaves the marker.
 * @fires {LeafletMouseEvent} contextmenu - Fired when the user right-clicks on the marker.
 * @fires {LeafletMouseEvent} preclick - Fired before mouse click on the map (sometimes useful when you want something to happen on click before any existing click handlers start running).
 * @fires focus - Fired when the user focuses the map either by tabbing to it or clicking/panning.
 * @fires blur - Fired when the map looses focus.
 * @fires load - Fired when the map is initialized (when its center and zoom are set for the first time).
 * @fires unload - Fired when the map is destroyed with remove method.
 * @fires viewreset - Fired when the map needs to redraw its content (this usually happens on map zoom or load). Very useful for creating custom overlays.
 * @fires movestart - Fired when the view of the map starts changing (e.g. user starts dragging the map).
 * @fires move - Fired on any movement of the map view.
 * @fires moveend - Fired when the view of the map ends changed (e.g. user stopped dragging the map).
 * @fires dragstart - Fired when the user starts dragging the marker.
 * @fires drag - Fired repeatedly while the user drags the marker.
 * @fires autopanstart - Fired when the map starts autopanning when opening a popup.
 * @fires zoomstart - Fired when the map zoom is about to change (e.g. before zoom animation).
 * @fires zoomend - Fired when the map zoom changes.
 * @fires zoomlevelschange - Fired when the number of zoomlevels on the map is changed due to adding or removing a layer.
 * @fires {LeafletDragEndEvent} dragend - Fired when the user stops dragging the marker.
 * @fires {LeafletResizeEvent} resize - Fired when the map is resized.
 * @fires {LeafletLayerEvent} layeradd - Fired when a new layer is added to the map.
 * @fires {LeafletLayerEvent} layerremove - Fired when some layer is removed from the map.
 * @fires {LeafletLayerEvent} baselayerchange - Fired when the base layer is changed through the layer control.
 * @fires {LeafletLayerEvent} overlayadd - Fired when an overlay is selected through the layer control.
 * @fires {LeafletLayerEvent} overlayremove - Fired when an overlay is deselected through the layer control.
 * @fires {LeafletLocationEvent} locationfound - Fired when geolocation (using the locate method) went successfully.
 * @fires {ErrorEvent} locationerror - Fired when geolocation (using the locate method) failed.
 * @fires {LeafletPopupEvent} popupopen - Fired when a popup bound to the marker is open.
 * @fires {LeafletPopupEvent} popupclose - Fired when a popup bound to the marker is closed.
 *
 * @element leaflet-map
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 */

@customElement('leaflet-map')
export class LeafletMap extends LeafletBase {
  static readonly is = 'leaflet-map';

  static readonly styles = [
    css`
      :host {
        display: block;
        height: 480px;
      }

      #map {
        height: 100%;
        width: 100%;
        position: relative;
      }
    `,
  ];

  /**
   * reference to the leaflet map
   */
  @property({ attribute: false }) map: L.Map;

  /**
   * The `latitude` attribute sets the map center.
   */
  @property({ type: Number, reflect: true }) latitude = 51;

  /**
   * The `longitude` attribute sets the map center.
   */
  @property({ type: Number, reflect: true }) longitude = 0;

  /**
   * Whether the map should display a fullscreen control
   */
  @property({ type: Boolean, reflect: true, attribute: 'fullscreen-control' })
  fullscreenControl = false;

  /**
   * The `zoom` attribute sets the map zoom.
   */
  @property({ type: Number, reflect: true }) zoom = -1;

  /**
   * The `min-zoom` attribute sets the minimum zoom level of the map. Overrides any minZoom set on map layers.
   */
  @property({ type: Number, attribute: 'min-zoom' }) minZoom = 0;

  /**
   * The `maxZoom` attribute sets the maximum zoom level of the map. This overrides any maxZoom set on map layers.
   */
  @property({ type: Number, attribute: 'max-zoom' }) maxZoom =
    Number.MAX_SAFE_INTEGER;

  /**
   * The `no-dragging` attribute disables whether the map is draggable with mouse/touch or not.
   */
  @property({ type: Boolean, attribute: 'no-dragging' }) noDragging = false;

  /**
   * The `no-touch-zoom` attribute disables whether the map can be zoomed by touch-dragging with two fingers.
   */
  @property({ type: Boolean, attribute: 'no-touch-zoom' }) noTouchZoom = false;

  /**
   * The `no-scroll-wheel-zoom` attribute disables whether the map can be zoomed by using the mouse wheel. If passed 'center', it will zoom to the center of the view regardless of where the mouse was.
   */
  @property({ type: Boolean, attribute: 'no-scroll-wheel-zoom' })
  noScrollWheelZoom = false;

  /**
   * The `no-double-click-zoom` attribute disables the whether the map can be zoomed in by double clicking on it and zoomed out by double clicking while holding shift. If passed 'center', double-click zoom will zoom to the center of the view regardless of where the mouse was.
   */
  @property({ type: Boolean, attribute: 'no-double-click-zoom' })
  noDoubleClickZoom = false;

  /**
   * The `no-box-zoom` attribute disable the whether the map can be zoomed to a rectangular area specified by dragging the mouse while pressing shift.
   */
  @property({ type: Boolean, attribute: 'no-box-zoom' }) noBoxZoom = false;

  /**
   * The `no-tap` attribute disables mobile hacks for supporting instant taps (fixing 200ms click delay on iOS/Android) and touch holds (fired as contextmenu events).
   */
  @property({ type: Boolean, attribute: 'no-tap' }) noTap = false;

  /**
   * The `tap-tolerance` attribute sets the max number of pixels a user can shift his finger during touch for it to be considered a valid tap.
   */
  @property({ type: Number, attribute: 'tap-tolerance' }) tapTolerance = 15;

  /**
   * The `no-track-resize` attribute disables whether the map automatically handles browser window resize to update itself.
   */
  @property({ type: Boolean, attribute: 'no-track-resize' })
  noTrackResize = false;

  /**
   * The `world-copy-jump` attribute sets whether the map tracks when you pan to another "copy" of the world and seamlessly jumps to the original one so that all overlays like markers and vector layers are still visible.
   */
  @property({ type: Boolean, attribute: 'world-copy-jump' })
  worldCopyJump = false;

  /**
   * The `no-close-popup-on-click` attribute disables whether popups are closed when user clicks the map.
   */
  @property({ type: Boolean, attribute: 'no-close-popup-on-click' })
  noClosePopupOnClick = false;

  /**
   * The `no-bounce-at-zoom-limits` attribute disables whether the map to zoom beyond min/max zoom and then bounce back when pinch-zooming.
   */
  @property({ type: Boolean, attribute: 'no-bounce-at-zoom-limits' })
  noBounceAtZoomLimits = false;

  /**
   * The `no-keyboard` attribute disables whether the map is focusable and allows users to navigate the map with keyboard arrows and +/- keys.
   */
  @property({ type: Boolean, attribute: 'no-keyboard' }) noKeyboard = false;

  /**
   * The `no-inertia` attribute disables panning of the map will have an inertia effect where the map builds momentum while dragging and continues moving in the same direction for some time. Feels especially nice on touch devices.
   */
  @property({ type: Boolean, attribute: 'no-inertia' }) noInertia = false;

  /**
   * The `inertia-deceleration` attribute sets the rate with which the inertial movement slows down, in pixels/second2.
   */
  @property({ type: Number, attribute: 'inertia-deceleration' })
  inertiaDeceleration = 3000;

  /**
   * The `inertia-max-speed` attribute sets the max speed of the inertial movement, in pixels/second.
   */
  @property({ type: Number, attribute: 'inertia-max-speed' })
  inertiaMaxSpeed = 1500;

  /**
   * The `no-zoom-control` attribute disables the zoom control is added to the map by default.
   */
  @property({ type: Boolean, attribute: 'no-zoom-control' })
  noZoomControl = false;

  /**
   * The `no-attribution-control` attribute disable the attribution control is added to the map by default.
   */
  @property({ type: Boolean, attribute: 'no-attribution-control' })
  noAttributionControl = false;

  /**
   * The `zoom-animation-threshold` attribute sets the maximum number of zoom level differences that still use animation
   */
  @property({ type: Number, attribute: 'zoom-animation-threshold' })
  zoomAnimationThreshold = 4;

  /**
   * `L.Icon.Default.imagePath` url. When unset, the element will attempt to guess using `import.meta.url`.
   */
  @property({ reflect: true, attribute: 'image-path' })
  imagePath: string;

  /**
   * If set, the map is zoomed such that all elements in it are visible
   */
  @property({ type: Boolean, attribute: 'fit-to-markers' })
  fitToMarkers = false;

  @query('#map') mapContainer: HTMLDivElement;

  features?: { feature: L.LayerGroup | L.Polyline | L.Marker }[];

  readonly children: HTMLCollectionOf<
    LeafletBase & Partial<FeatureElement> & { isLayer?(): boolean }
  >;

  get latLng(): L.LatLng {
    return L.latLng(this.latitude, this.longitude);
  }

  _ignoreViewChange: boolean;

  _mutationObserver: MutationObserver;

  render(): TemplateResult {
    const url = L.Icon.Default.imagePath + '../leaflet.css';
    return html`
      <link rel="stylesheet" href="${url}"></link>
      <div id="map"></div>
      <slot id="markers"></slot>
    `;
  }

  updated(changed: PropertyValues) {
    super.updated(changed);
    if (changed.has('fitToMarkers')) this.fitToMarkersChanged();
    if (
      changed.has('latitude') ||
      changed.has('longitude') ||
      changed.has('zoom')
    )
      this.viewChanged();
  }

  async fitToMarkersChanged() {
    if (this.map && this.fitToMarkers) {
      const elements = [...this.children].filter(isFeatureElement);
      if (!elements.length) return;
      await Promise.race([
        new Promise(r => setTimeout(r, 100)),
        Promise.all(elements.map(x => x.updateComplete)),
      ]);
      const group = L.featureGroup(elements.map(x => x.feature ?? x.layer));
      const bounds = group.getBounds();
      this.map.fitBounds(bounds);
      this.map.invalidateSize();
    }
  }

  viewChanged() {
    if (this.map && !this._ignoreViewChange) {
      setTimeout(this.setView, 1);
    }
  }

  @bound setView() {
    this.map.setView(this.latLng, this.zoom);
  }

  guessLeafletImagePath() {
    L.Icon.Default.imagePath =
      this.imagePath ||
      L.Icon.Default.imagePath ||
      new URL('../leaflet/dist/images/', import.meta.url);
    return L.Icon.Default.imagePath;
  }

  firstUpdated() {
    this.guessLeafletImagePath();

    this.map = L.map(this.mapContainer, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      dragging: !this.noDragging,
      fullscreenControl: this.fullscreenControl,
      touchZoom: !this.noTouchZoom,
      scrollWheelZoom: !this.noScrollWheelZoom,
      doubleClickZoom: !this.noDoubleClickZoom,
      boxZoom: !this.noBoxZoom,
      tap: !this.noTap,
      tapTolerance: this.tapTolerance,
      trackResize: !this.noTrackResize,
      worldCopyJump: this.worldCopyJump,
      closePopupOnClick: !this.noClosePopupOnClick,
      bounceAtZoomLimits: !this.noBounceAtZoomLimits,
      keyboard: !this.noKeyboard,
      inertia: !this.noInertia,
      inertiaDeceleration: this.inertiaDeceleration,
      inertiaMaxSpeed: this.inertiaMaxSpeed,
      zoomControl: !this.noZoomControl,
      attributionControl: !this.noAttributionControl,
      zoomAnimationThreshold: this.zoomAnimationThreshold,
    });

    this.fitToMarkersChanged();

    // fire an event for when this.map is defined and ready.
    // (needed for components that talk to this.map directly)
    this.fire('map-ready');

    const { map } = this;

    // forward events
    map.on(EVENTS, this.onLeafletEvent);

    // set map view after registering events so viewreset and load events can be caught
    map.setView([this.latitude, this.longitude], this.zoom);

    // update attributes
    map.on('moveend', this.onMoveend);
    map.on('zoomend', this.onZoomend);

    if (this.zoom == -1) {
      this.map.fitWorld();
    }

    // add a default layer if there are no layers defined
    let defaultLayerRequired = true;

    for (const child of this.children) {
      if (child.isLayer?.()) {
        defaultLayerRequired = false;
      }
    }

    if (defaultLayerRequired) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
      }).addTo(this.map);
    }

    this.registerMapOnChildren();

    this._mutationObserver = new MutationObserver(this.registerMapOnChildren);
    this._mutationObserver.observe(this, { childList: true });
  }

  @bound async onMoveend() {
    this._ignoreViewChange = true;
    this.longitude = this.map.getCenter().lng;
    this.latitude = this.map.getCenter().lat;
    await this.updateComplete;
    this._ignoreViewChange = false;
  }

  @bound onZoomend() {
    this.zoom = this.map.getZoom();
  }

  disconnectedCallback() {
    this._mutationObserver.disconnect();
  }

  @bound async registerMapOnChildren() {
    for (const child of this.children) {
      child.container = this.map;
    }

    this.fitToMarkersChanged();
  }

  /**
   * Returns a GeoJSON including all the features of the map
   */
  toGeoJSON() {
    return {
      type: 'FeatureCollection',
      features: this.features?.map?.(f => f.feature.toGeoJSON()) ?? [],
    };
  }
}
