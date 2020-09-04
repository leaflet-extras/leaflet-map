import type { PropertyValues } from 'lit-element';

import * as L from 'leaflet';

import { customElement, property } from 'lit-element';
import { LeafletPathMixin } from './mixins/path';
import { LeafletPopupContentMixin } from './mixins/popup-content';
import { LeafletBase } from './base';

import DATA_ELEMENT_STYLES from './data-element.css';

/**
 * The `leaflet-circle` element represents a circle on the map and is used as
 * a child element of the `leaflet-map` element.
 *
 *
 * ##### Example: Add circles
 *     <leaflet-map longitude="77.2" latitude="28.4" zoom="12">
 *         <leaflet-circle longitude="77.2" latitude="28.4" radius="300">
 *             Circle
 *         </leaflet-circle>
 *     </leaflet-map>
 *
 * @element leaflet-circle
 * @blurb Element for putting a circle on the map
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-circle')
export class LeafletCircle
  extends LeafletPathMixin(LeafletPopupContentMixin(LeafletBase)) {
  static readonly is = 'leaflet-circle';

  static readonly styles = DATA_ELEMENT_STYLES;

  static isLeafletCircle(node: Node): node is LeafletCircle {
    return node instanceof LeafletCircle;
  }

  static readonly events =
    'click dblclick mousedown mouseover mouseout contextmenu add remove popupopen popupclose';

  /**
   * A Leaflet circle object
   */
  declare feature: L.Circle;

  /**
   * The circle's longitude coordinate
   */
  @property({ type: Number }) longitude = null;

  /**
   * The circle's latitude coordinate
   */
  @property({ type: Number }) latitude = null;

  /**
   * The circle's radius is metres
   */
  @property({ type: Number }) radius = 100;

  updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('radius')) this.updateRadius();
    if (changed.has('latitude') || changed.has('longitude'))
      this.updatePosition();
  }

  containerChanged(): void {
    if (!(this.latitude && this.longitude && this.container)) return;

    this.feature = L.circle([this.latitude, this.longitude], this.radius, this.getPathOptions());
    this.feature.addTo(this.container);
    this.updatePopupContent();

    this.feature.on(LeafletCircle.events, this.onLeafletEvent);
  }

  updatePosition(): void {
    if (this.feature && this.latitude != null && this.longitude != null)
      this.feature.setLatLng(L.latLng(this.latitude, this.longitude));
  }

  updateRadius(): void {
    if (this.feature && this.radius != null)
      this.feature.setRadius(this.radius);
  }
}
