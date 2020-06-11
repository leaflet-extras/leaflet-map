import { customElement } from 'lit-element';
import { LeafletBase } from './base';
import { bound } from './bound-decorator';

import * as L from 'leaflet';

import type { LeafletMarker } from './leaflet-marker';

/**
 * A [Layer group](http://leafletjs.com/reference.html#layergroup)
 *
 * @example
 * ```html
 *     <leaflet-layer-group>
 *         <leaflet-marker latitude="51.505" longitude="-0.09"> </leaflet-marker>
 *     </leaflet-layer-group>
 * ```
 *
 * @element leaflet-layer-group
 * @blurb an element which represents a layer group
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-layer-group')
export class LeafletLayerGroup extends LeafletBase {
  static readonly is = 'leaflet-layer-group';

  feature: L.LayerGroup;

  readonly children: HTMLCollectionOf<LeafletMarker>;

  firstUpdated() {
    this._mutationObserver = new MutationObserver(
      this.registerContainerOnChildren
    );
    this._mutationObserver.observe(this, { childList: true });
  }

  get container() {
    return this._container;
  }
  set container(v) {
    this._container = v;
    if (!this.container) return;
    this.feature = L.layerGroup();
    this.feature.addTo(this.container);
    this.registerContainerOnChildren();
  }

  disconnectedCallback() {
    if (this.container && this.feature) {
      this.container.removeLayer(this.feature);
    }
    this._mutationObserver.disconnect();
  }

  @bound registerContainerOnChildren() {
    for (const child of this.children) child.container = this.feature;
  }
}
