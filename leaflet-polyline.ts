import type { TemplateResult } from 'lit-element';

import { html, customElement, property } from 'lit-element';
import * as L from 'leaflet';
import { LeafletPathMixin } from './mixins/path';
import { LeafletPointContentMixin } from './mixins/point-content';
import { LeafletPopupContentMixin } from './mixins/popup';
import { LeafletBase } from './base';
import { DATA_ELEMENT_STYLES } from './data-element.css';

/**
 * The `leaflet-polyline` element represents a polyline on the map and is used as
 * a child element of the `leaflet-map` element. To compose the line one needs to
 * add `leaflet-point` elements inside it.
 *
 * @example
 * ```html
 *     <leaflet-map longitude="77.2" latitude="28.4" zoom="12">
 *         <leaflet-polyline>
 *             <leaflet-point longitude="77.22" latitude="28.44"></leaflet-point>
 *             <leaflet-point longitude="77.44" latitude="28.66"></leaflet-point>
 *         </leaflet-polyline>
 *     </leaflet-map>
 * ```
 *
 * @element leaflet-polyline
 * @blurb Element for putting a polyline on the map
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-polyline')
export class LeafletPolyline extends LeafletPathMixin(
  LeafletPointContentMixin(LeafletPopupContentMixin(LeafletBase))
) {
  static readonly is = 'leaflet-polyline';

  static readonly styles = DATA_ELEMENT_STYLES;

  render(): TemplateResult {
    return html` <slot id="points"></slot> `;
  }

  /**
   * A Leaflet [Polyline](http://leafletjs.com/reference.html#polyline) object
   */
  @property({ attribute: false }) feature: L.Polyline = null;

  _container: L.Map;

  get container() {
    return this._container;
  }

  set container(v) {
    this._container = v;
    if (this.container) {
      this.feature = L.polyline([], this.getPathOptions());
      this.feature.addTo(this.container);
      this.updatePointContent();
      this.updatePopupContent();

      // forward events
      this.feature.on(
        'click dblclick mousedown mouseover mouseout contextmenu add remove popupopen popupclose',
        this.onLeafletEvent
      );
    }
  }

  disconnectedCallback() {
    if (this.container && this.feature) {
      this.container.removeLayer(this.feature);
    }
  }
}
