import type { PropertyValues, TemplateResult } from 'lit-element';

import { html, customElement, property, query, internalProperty } from 'lit-element';

import { LeafletBase } from './base';

import { bound } from './bound-decorator';

import ResizeObserver from 'resize-observer-polyfill';

import * as L from 'leaflet';

import MAP_STYLES from './leaflet-map.css';

/**
 * Best guess, assuming `leaflet-element` is installed alongside `leaflet` in `node_modules`
 */
const NODE_MODULES_LEAFLET_IMAGE_PATH =
  new URL('../../node_modules/leaflet/dist/images/', import.meta.url).pathname;

interface FeatureElement extends LeafletBase {
  feature: L.LayerGroup | L.Polyline | L.Polygon | L.Marker;
  layer: L.LayerGroup | L.Layer;
}

interface LayerElement extends LeafletBase {
  isLayer?(): boolean;
}

const DEFAULT_TILE_LAYER_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const DEFAULT_TILE_LAYER_ATTRIBUTION =
  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>';

const DEFAULT_TILE_LAYER_MAX_ZOOM =
  18;

function isLeafletElement(x: Node): x is LeafletBase {
  return x instanceof HTMLElement && x.tagName.toLowerCase().startsWith('leaflet-');
}

function isFeatureElement(x: Node): x is FeatureElement {
  if (!isLeafletElement(x)) return false;
  const tag = x.tagName.toLowerCase();
  return !!(tag.match(/(circle|geojson|layer-group|marker|polygon|polyline)$/));
}

function isSlot(node: ChildNode): node is HTMLSlotElement {
  return node instanceof HTMLSlotElement;
}

function isIntersecting(x: IntersectionObserverEntry): boolean {
  return x.isIntersecting;
}

function isLayer(x: LayerElement): x is FeatureElement {
  return x.isLayer?.();
}

function hasHeight(x: IntersectionObserverEntry): boolean {
  return x.boundingClientRect.height > 0;
}

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
 * @param {Point} oldSize The old size before resize event.
 * @param {Point} newSize The new size after the resize event.
 */

/**
 * @typedef {Event} LeafletLayerEvent
 * @param {ILayer} layer The layer that was added or removed.
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

  static readonly styles = MAP_STYLES;

  static readonly events = [
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
  @property({ type: Number, attribute: 'max-zoom' }) maxZoom = Number.MAX_SAFE_INTEGER;

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
  @property({ type: Boolean, attribute: 'no-scroll-wheel-zoom' }) noScrollWheelZoom = false;

  /**
   * The `no-double-click-zoom` attribute disables the whether the map can be zoomed in by double clicking on it and zoomed out by double clicking while holding shift. If passed 'center', double-click zoom will zoom to the center of the view regardless of where the mouse was.
   */
  @property({ type: Boolean, attribute: 'no-double-click-zoom' }) noDoubleClickZoom = false;

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
  @property({ type: Boolean, attribute: 'no-track-resize' }) noTrackResize = false;

  /**
   * The `world-copy-jump` attribute sets whether the map tracks when you pan to another "copy" of the world and seamlessly jumps to the original one so that all overlays like markers and vector layers are still visible.
   */
  @property({ type: Boolean, attribute: 'world-copy-jump' }) worldCopyJump = false;

  /**
   * The `no-close-popup-on-click` attribute disables whether popups are closed when user clicks the map.
   */
  @property({ type: Boolean, attribute: 'no-close-popup-on-click' }) noClosePopupOnClick = false;

  /**
   * The `no-bounce-at-zoom-limits` attribute disables whether the map to zoom beyond min/max zoom and then bounce back when pinch-zooming.
   */
  @property({ type: Boolean, attribute: 'no-bounce-at-zoom-limits' }) noBounceAtZoomLimits = false;

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
  @property({ type: Number, attribute: 'inertia-deceleration' }) inertiaDeceleration = 3000;

  /**
   * The `inertia-max-speed` attribute sets the max speed of the inertial movement, in pixels/second.
   */
  @property({ type: Number, attribute: 'inertia-max-speed' }) inertiaMaxSpeed = 1500;

  /**
   * The `no-zoom-control` attribute disables the zoom control is added to the map by default.
   */
  @property({ type: Boolean, attribute: 'no-zoom-control' }) noZoomControl = false;

  /**
   * The `no-attribution-control` attribute disable the attribution control is added to the map by default.
   */
  @property({ type: Boolean, attribute: 'no-attribution-control' }) noAttributionControl = false;

  /**
   * The `zoom-animation-threshold` attribute sets the maximum number of zoom level differences that still use animation
   */
  @property({ type: Number, attribute: 'zoom-animation-threshold' }) zoomAnimationThreshold = 4;

  /**
   * `L.Icon.Default.imagePath` url. When unset, the element will attempt to guess using `import.meta.url`.
   */
  @property({ reflect: true, attribute: 'image-path' })
  get imagePath(): string {
    return (
      // Let user override the assets path per-element
      this.__imagePath ||
      // Let user override the assets path globally
      L.Icon.Default.imagePath ||
      // fallback to default assets path,
      // assumes that `leaflet-element` is a sibling of `leaflet`, i.e. in `/node_modules`.
      NODE_MODULES_LEAFLET_IMAGE_PATH
    );
  }

  set imagePath(path: string) {
    this.__imagePath = path;
  }

  declare __imagePath: string;

  /**
   * If set, the map is zoomed such that all elements in it are visible
   */
  @property({ type: Boolean, attribute: 'fit-to-markers' }) fitToMarkers = false;

  @internalProperty() private mapReady = false;

  @query('#map') mapContainer: HTMLDivElement;

  declare features?: { feature: L.LayerGroup | L.Polyline | L.Marker }[];

  declare readonly children: HTMLCollectionOf<
    LeafletBase & Partial<FeatureElement> & { isLayer?(): boolean }
  >;

  get latLng(): L.LatLng {
    return L.latLng(this.latitude, this.longitude);
  }

  private get elements(): LeafletBase[] {
    return [...this.children]
      .flatMap(child => isSlot(child) ? child.assignedElements() : [child])
      .filter(isLeafletElement);
  }

  declare private _ignoreViewChange: boolean;

  declare protected io: IntersectionObserver;

  declare protected mo: MutationObserver;

  declare protected ro: ResizeObserver;

  constructor() {
    super();
    // TODO: We should be able to do this for every component that registers this Map as their container, without assigning to the shared state
    L.Icon.Default.imagePath = this.imagePath;
    this.io = new IntersectionObserver(this.onIntersection, { rootMargin: '50%' });
    this.mo = new MutationObserver(this.onMutation);
    this.ro = new ResizeObserver(this.onResize);

    this.mo.observe(this, { childList: true });
    this.ro.observe(this);
    this.io.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.mo.disconnect();
    this.ro.disconnect();
    this.io.disconnect();
  }

  render(): TemplateResult {
    const url = `${this.imagePath}../leaflet.css`;
    return html`
      <link rel="stylesheet" href="${url}"></link>
      <div id="map"></div>
      <slot id="markers"></slot>
    `;
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('fitToMarkers'))
      this.fitToMarkersChanged();

    if (changed.has('latitude') || changed.has('longitude') || changed.has('zoom'))
      this.viewChanged();
  }

  initMap(): void {
    if (this.map)
      this.map.remove();

    const map = L.map(this.mapContainer, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      dragging: !this.noDragging,
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

    this.map = map;

    // forward all leaflet events to DOM
    map.on(LeafletMap.events, this.onLeafletEvent);

    map.whenReady(this.onLoad);
    map.on('moveend', this.onMoveend);
    map.on('zoomend', this.onZoomend);

    // set map view after registering events so viewreset and load events can be caught
    map.setView([this.latitude, this.longitude], this.zoom);

    // add a default layer if there are no layers defined
    if (!Array.from(this.children).some(isLayer))
      this.initDefaultLayer();

    for (const child of this.elements)
      child.container = this.map;

    if (this.fitToMarkers)
      this.fitBoundsToMarkers();

    else if (this.zoom === -1)
      map.fitWorld();
  }

  /**
   * Returns a GeoJSON including all the features of the map
   */
  public toGeoJSON(): { type: 'FeatureCollection', features: unknown } {
    const features =
      this.features?.map?.(f => f.feature.toGeoJSON()) ?? [];

    const type =
      'FeatureCollection';

    return { type, features };
  }

  public async fitBoundsToMarkers(): Promise<void> {
    const features =
      this.elements.filter(isFeatureElement);

    if (!features.length) return;

    // Make sure all child feature-elements are defined and updated before proceeding.
    await Promise.all(features.map(async x => {
      // @ts-expect-error: trust me i'm good for it
      const tag = x.constructor.is;
      await customElements.whenDefined(tag);
      if (!x.feature)
        x.container = this.map;
      return await x.updateComplete;
    }));

    // Get the Leaflet feature from each feature-element child
    const featuresToGroup =
      features
        .map(x => x.feature ?? x.layer)
        .filter(Boolean);

    // short-circuit if there are no relevant features
    if (!featuresToGroup.length) return;

    const group =
      L.featureGroup(featuresToGroup);

    const bounds =
      group.getBounds();

    this.map.fitBounds(bounds);
  }

  private invalidateSize(): void {
    if (!this.map) return;
    this.map.invalidateSize();
  }

  private fitToMarkersChanged() {
    if (!this.mapReady && this.fitToMarkers) return;
    this.fitBoundsToMarkers();
    this.invalidateSize();
  }

  private viewChanged() {
    if (!this.mapReady || this._ignoreViewChange) return;
    setTimeout(() => {
      this.map.setView(this.latLng, this.zoom);
    }, 1);
  }

  private initDefaultLayer(): void {
    const attribution =
      DEFAULT_TILE_LAYER_ATTRIBUTION;

    const maxZoom =
      DEFAULT_TILE_LAYER_MAX_ZOOM;

    L.tileLayer(DEFAULT_TILE_LAYER_URL, { attribution, maxZoom })
      .addTo(this.map);
  }

  @bound private onLoad(): void {
    // fire an event for when this.map is defined and ready.
    // (needed for components that talk to this.map directly)
    this.mapReady = true;
    this.fire('map-ready');
  }

  @bound private async onMoveend() {
    this._ignoreViewChange = true;
    this.longitude = this.map.getCenter().lng;
    this.latitude = this.map.getCenter().lat;
    await this.updateComplete;
    this._ignoreViewChange = false;
  }

  @bound private onZoomend() {
    this.zoom = this.map.getZoom();
  }

  @bound private async onIntersection(records: IntersectionObserverEntry[]) {
    if (this.mapReady) return;
    if (records.some(isIntersecting) && records.some(hasHeight)) {
      await this.updateComplete;
      this.initMap();
      this.io.disconnect();
    }
  }

  @bound private onResize(): void {
    this.invalidateSize();
    if (this.fitToMarkers && this.mapReady)
      this.fitBoundsToMarkers();
  }

  @bound private onMutation(records: MutationRecord[]): void {
    if (!this.map) return;
    records.forEach(({ addedNodes, removedNodes }) => {
      [...removedNodes].filter(isLayer).forEach(l => this.map.removeLayer(l.feature));
      [...addedNodes as NodeListOf<LayerElement>].forEach(x => x.container = this.map);
    });
  }
}
