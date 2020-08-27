import { customElement, property } from 'lit-element';
import * as L from 'leaflet';
import { LeafletBase } from './base';

/**
 * The `leaflet-point` element represents one point in an polyline on the map and is used as
 * a child element of the `leaflet-polyline` element.
 *
 * ##### Example: Add polylines
 *     <leaflet-map longitude="77.2" latitude="28.4" zoom="12">
 *         <leaflet-polyline>
 *             <leaflet-point longitude="77.22" latitude="28.44"></leaflet-point>
 *             <leaflet-point longitude="77.44" latitude="28.66"></leaflet-point>
 *         </leaflet-polyline>
 *     </leaflet-map>
 *
 * @element leaflet-point
 * @blurb Element for adding a point to a polyline
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-point')
export class LeafletPoint extends LeafletBase {
  static is = 'leaflet-point';

  static isLeafletPoint(node: Node): node is LeafletPoint {
    return node instanceof LeafletPoint;
  }

  @property({ type: Number, reflect: true }) latitude = 0;

  @property({ type: Number, reflect: true }) longitude = 0;

  get latLng(): L.LatLng {
    return L.latLng(this.latitude, this.longitude);
  }
}
