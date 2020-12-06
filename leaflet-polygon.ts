import type { LeafletPoint } from './leaflet-point';

import * as L from 'leaflet';

import { html, customElement, property, queryAssignedNodes, TemplateResult } from 'lit-element';
import { LeafletPathMixin } from './mixins/path';
import { LeafletPointContentMixin } from './mixins/point-content';
import { LeafletPopupContentMixin } from './mixins/popup-content';
import { LeafletBase } from './base';

import DATA_ELEMENT_STYLES from './data-element.css';

/**
 * The `leaflet-polygon` element represents a polygon on the map and is used as
 * a child element of the `leaflet-map` element. To compose the line one needs to
 * add `leaflet-point` elements inside it.
 *
 *
 * @example
 * ```html
 *     <leaflet-map longitude="77.2" latitude="28.4" zoom="12">
 *         <leaflet-polygon>
 *             <leaflet-point longitude="77.1000" latitude="13.3400"></leaflet-point>
 *             <leaflet-point longitude="77.5000" latitude="13.5500"></leaflet-point>
 *             <leaflet-point longitude="77.7200" latitude="12.7200"></leaflet-point>
 *         </leaflet-polygon>
 *     </leaflet-map>
 * ```
 *
 * @element leaflet-polygon
 * @blurb Element for putting a polygon on the map
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-polygon')
export class LeafletPolygon
  extends LeafletPathMixin(LeafletPointContentMixin(LeafletPopupContentMixin(LeafletBase))) {
  static readonly is = 'leaflet-polygon';

  static readonly styles = DATA_ELEMENT_STYLES;

  static readonly events =
    'click dblclick mousedown mouseover mouseout contextmenu add remove popupopen popupclose';

  /**
   * A Leaflet [Polygon](http://leafletjs.com/reference.html#polygon) object
   */
  @property({ attribute: false }) feature: L.Polygon = null;

  @queryAssignedNodes('points') points: LeafletPoint[];

  render(): TemplateResult {
    return html`
      <slot id="points"></slot>
    `;
  }

  containerChanged(): void {
    const opt = this.getPathOptions();

    if (typeof opt.fill === 'undefined' || opt.fill === null)
      opt.fill = true;

    this.feature = L.polygon([], opt);
    this.feature.addTo(this.container);
    this.updatePointContent();
    this.updatePopupContent();

    // forward events
    this.feature.on(LeafletPolygon.events, this.onLeafletEvent);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.container && this.feature)
      this.container.removeLayer(this.feature);
  }
}
