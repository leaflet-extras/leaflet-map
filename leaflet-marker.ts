import { customElement, property, PropertyValues } from 'lit-element';
import { LeafletPopupContentMixin } from './mixins/popup-content';
import * as L from 'leaflet';
import { DATA_ELEMENT_STYLES } from './data-element.css';
import { LeafletBase } from './base';
import { LeafletIcon } from './leaflet-icon';
import { LeafletDivicon } from './leaflet-divicon';

const EVENTS = [
  'click',
  'dblclick',
  'mousedown',
  'mouseover',
  'mouseout',
  'contextmenu',
  'dragstart',
  'drag',
  'dragend',
  'move',
  'add',
  'remove',
  'popupopen',
  'popupclose',
].join(' ');

/**
 * Element which defines a [marker](http://leafletjs.com/reference.html#marker)
 *
 * @example
 * html```
 *     <leaflet-marker latitude="51.5" longitude="-0.10" title="Some title">
 *         <b>Popup text</b>
 *     </leaflet-marker>
 * ```
 *
 * @example
 * html```
 *     <leaflet-icon id="myicon" icon-url="https://stendhalgame.org/images/mapmarker/me.png"></leaflet-icon>
 *     <leaflet-marker latitude="51.5" longitude="-0.10" title="Some title" icon="myicon"></leaflet-marker>
 * ```
 *

 * Fired when the user clicks (or taps) the marker.
 *
 * @fires click
 * @type MouseEvent
 * @param {LatLng} latlng The geographical point where the mouse event occured.
 * @param {Point} layerPoint Pixel coordinates of the point where the mouse event occured relative to the map layer.
 * @param {Point} containerPoint Pixel coordinates of the point where the mouse event occured relative to the map сontainer.
 * @param {DOMMouseEvent} originalEvent The original DOM mouse event fired by the browser.

 * Fired when the user double-clicks (or double-taps) the marker.
 *
 * @fires dblclick
 * @type MouseEvent
 * @param {LatLng} latlng The geographical point where the mouse event occured.
 * @param {Point} layerPoint Pixel coordinates of the point where the mouse event occured relative to the map layer.
 * @param {Point} containerPoint Pixel coordinates of the point where the mouse event occured relative to the map сontainer.
 * @param {DOMMouseEvent} originalEvent The original DOM mouse event fired by the browser.

 * Fired when the user pushes the mouse button on the marker.
 *
 * @fires mousedown
 * @type MouseEvent
 * @param {LatLng} latlng The geographical point where the mouse event occured.
 * @param {Point} layerPoint Pixel coordinates of the point where the mouse event occured relative to the map layer.
 * @param {Point} containerPoint Pixel coordinates of the point where the mouse event occured relative to the map сontainer.
 * @param {DOMMouseEvent} originalEvent The original DOM mouse event fired by the browser.

 * Fired when the mouse enters the marker.
 *
 * @fires mouseover
 * @type MouseEvent
 * @param {LatLng} latlng The geographical point where the mouse event occured.
 * @param {Point} layerPoint Pixel coordinates of the point where the mouse event occured relative to the map layer.
 * @param {Point} containerPoint Pixel coordinates of the point where the mouse event occured relative to the map сontainer.
 * @param {DOMMouseEvent} originalEvent The original DOM mouse event fired by the browser.

 * Fired when the mouse leaves the marker.
 *
 * @fires mouseout
 * @type MouseEvent
 * @param {LatLng} latlng The geographical point where the mouse event occured.
 * @param {Point} layerPoint Pixel coordinates of the point where the mouse event occured relative to the map layer.
 * @param {Point} containerPoint Pixel coordinates of the point where the mouse event occured relative to the map сontainer.
 * @param {DOMMouseEvent} originalEvent The original DOM mouse event fired by the browser.

 * Fired when the user right-clicks on the marker.
 *
 * @fires contextmenu
 * @type MouseEvent

 * Fired when the user starts dragging the marker.
 *
 * @fires dragstart

 * Fired repeatedly while the user drags the marker.
 *
 * @fires drag

 * Fired when the user stops dragging the marker.
 *
 * @fires dragend
 * @type DragEndEvent
 * @param {number} distance The distance in pixels the draggable element was moved by.

 * Fired when the marker is moved via setLatLng. New coordinate include in event arguments.
 *
 * @fires move
 * @type

 * Fired when the marker is added to the map.
 *
 * @fires add
 * @type

 * Fired when the marker is removed from the map.
 *
 * @fires remove

 * Fired when a popup bound to the marker is open.
 *
 * @fires popupopen
 * @type PopupEvent
 * @param {Popup} popup The popup that was opened or closed.

 * Fired when a popup bound to the marker is closed.
 *
 * @fires popupclose
 * @type PopupEvent
 * @param {Popup} popup The popup that was opened or closed.

 * @element leaflet-marker
 * @blurb element which defines a marker. The content is used as popup window, unless it is empty.
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-marker')
export class LeafletMarker extends LeafletPopupContentMixin(LeafletBase) {
  static readonly is = 'leaflet-marker';

  static readonly styles = DATA_ELEMENT_STYLES;

  static isLeafletMarker(node: Node): node is LeafletMarker {
    return node instanceof LeafletMarker;
  }

  feature: L.Marker;

  /**
   * The `latitude` attribute sets the positions of the marker.
   */
  @property({ type: Number, reflect: true }) latitude: number = null;

  /**
   * The `longitude` attribute sets the positions of the marker.
   */
  @property({ type: Number, reflect: true }) longitude: number = null;

  /**
   * The `icon` attribute sets the Icon class to use for rendering the marker.
   * This attribute may be refer to an id-attribute of an leaflet-icon-element,
   * contain json syntax or it be assigned an instance of L.icon.
   * See Icon documentation for details on how to customize the marker icon. Set to new L.Icon.Default() by default.
   */
  @property({ type: String }) icon: string | L.Icon;

  /**
   * The `draggable` attribute sets the whether the marker is draggable with mouse/touch or not.
   */
  @property({ type: Boolean }) draggable = false;

  /**
   * The `no-keyboard` attribute disables whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
   */
  @property({ type: Boolean }) keyboard = false;

  /**
   * The `title` attribute sets the text for the browser tooltip that appear on marker hover (no tooltip by default).
   */
  @property() title = '';

  /**
   * The `alt` attribute sets the text for the alt attribute of the icon image (useful for accessibility).
   */
  @property() alt = '';

  /**
   * The `z-index-offset` attribute sets the zIndexOffset. By default, marker images zIndex is set automatically based on its latitude
   */
  @property({ type: Number, attribute: 'z-index-offset' }) zIndexOffset = 0;

  /**
   * The `opacity` attribute sets the opacity of the marker.
   */
  @property({ type: Number }) opacity = 1.0;

  /**
   * The `rise-on-hover` attribute sets the whether the marker will get on top of others when you hover the mouse over it.
   */
  @property({ type: Boolean, attribute: 'rise-on-hover' }) riseOnHover = false;

  /**
   * The `rise-offset` attribute sets the z-index offset used for the riseOnHover feature.
   */
  @property({ type: Number, attribute: 'rise-offset' }) riseOffset = 250;

  get latLng(): L.LatLng {
    return L.latLng(this.latitude, this.longitude);
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('icon')) this.iconChanged();
    if (changed.has('opacity')) this.opacityChanged();
    if (changed.has('latitude') || changed.has('longitude'))
      this.positionChanged();
    if (changed.has('zIndexOffset')) this.zIndexOffsetChanged();
  }

  get container(): L.Map | L.LayerGroup {
    return this._container;
  }

  set container(v: L.Map | L.LayerGroup) {
    this._container = v;
    if (!this.container) return;

    this.feature = L.marker([this.latitude, this.longitude], {
      draggable: this.draggable,
      keyboard: this.keyboard,
      title: this.title,
      alt: this.alt,
      zIndexOffset: this.zIndexOffset,
      opacity: this.opacity,
      riseOnHover: this.riseOnHover,
      riseOffset: this.riseOffset,
    });

    this.iconChanged();

    // forward events
    this.feature.on(EVENTS, this.onLeafletEvent);

    this.updatePopupContent();

    this.feature.addTo(this.container);
  }

  iconChanged(): void {
    let icon: L.Icon | L.DivIcon;

    if (typeof this.icon === 'string')
      icon = this.walkDOMForIcon(this.icon);
    else if (this.icon?.options)
      ({ icon } = this);
    else if (this.icon)
      icon = L.icon(this.icon as unknown as L.IconOptions);
    else
      icon = new L.Icon.Default();

    if (this.feature)
      this.feature.setIcon(icon);
  }

  private walkDOMForIcon(icon: string): L.Icon | L.DivIcon {
    let iconElement =
      this.shadowRoot.getElementById(icon) as LeafletIcon | LeafletDivicon;

    let root = this.getRootNode();

    // eslint-disable-next-line no-loops/no-loops
    while (!iconElement) {
      if (root instanceof ShadowRoot) {
        iconElement = root.getElementById(icon) as LeafletIcon | LeafletDivicon;
        root = root.host.getRootNode();
      } else if (root instanceof Document) {
        iconElement = root.getElementById(icon) as LeafletIcon | LeafletDivicon;
        break;
      }
    }

    if (iconElement instanceof LeafletIcon || iconElement instanceof LeafletDivicon)
      return iconElement.getIcon();
    else {
      try {
        return L.icon(JSON.parse(icon));
      } catch (e) {
        return new L.Icon.Default();
      }
    }
  }

  positionChanged(): void {
    if (this.feature)
      this.feature.setLatLng(this.latLng);
  }

  zIndexOffsetChanged(): void {
    if (this.feature)
      this.feature.setZIndexOffset(this.zIndexOffset);
  }

  opacityChanged(): void {
    if (this.feature)
      this.feature.setOpacity(this.opacity);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.container && this.feature)
      this.container.removeLayer(this.feature);
  }
}
