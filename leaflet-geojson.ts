import type { GeoJsonObject } from 'geojson';

import { customElement, property, PropertyValues } from 'lit-element';
import { LeafletILayerMixin } from './mixins/ilayer';
import * as L from 'leaflet';
import { SVGAttributesMixin } from './mixins/svg-attributes';
import { LeafletBase } from './base';
import DATA_ELEMENT_STYLES from './data-element.css';

/**
 * A [GeoJSON layer](http://leafletjs.com/reference.html#geojson).
 *
 * @example
 * ```html
 *     <leaflet-map longitude="-104.99404" latitude="39.75621" zoom="12">
 *       <leaflet-geojson></leaflet-geojson>
 *     </leaflet-map>
 *     <script>
 *       document.querySelector('leaflet-geojson').data = {
 *         'type': 'Feature',
 *         'properties': {
 *           'name': 'Coors Field',
 *           'popupContent': 'Yo popup'
 *         },
 *         'geometry': {
 *           'type': 'Point',
 *           'coordinates': [-104.99404, 39.75621]
 *         }
 *       }
 *     </script>
 * ```
 *
 * @element leaflet-geojson
 * @blurb an element which represents a geojson layer
 * @status beta
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-geojson')
export class LeafletGeoJSON
  extends SVGAttributesMixin(LeafletILayerMixin(LeafletBase)) {
  static readonly is = 'leaflet-geojson';

  static readonly styles = DATA_ELEMENT_STYLES;

  declare feature: L.GeoJSON;

  declare fill: boolean;

  declare private _data: GeoJsonObject;

  declare parseError: Error;

  /**
   * data as geojson object
   */
  @property({ attribute: false })
  get data(): GeoJsonObject {
    if (this._data)
      return this._data;

    try {
      return JSON.parse(this.querySelector('script[type="application/json"]').textContent);
    } catch (e) {
      this.parseError = e;
    }
  }

  set data(v: GeoJsonObject) {
    const old = this.data;
    this._data = v;
    this.requestUpdate('data', old);
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('data'))
      this.containerChanged();
  }

  containerChanged(): void {
    if (!this.container || !this.data) return;

    if (this.feature) this.container.removeLayer(this.feature);

    this.feature = L.geoJSON(this.data);

    this.feature.addTo(this.container).setStyle({
      color: this.color,
      weight: this.weight,
      opacity: this.opacity,
      fill: this.fill,
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
      dashArray: this.dashArray,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    if (this.container && this.feature)
      this.container.removeLayer(this.feature);
  }
}
