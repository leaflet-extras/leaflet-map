import type { Constructor } from 'lit-element';
import type { LeafletBase } from '../base';

import { bound } from '../bound-decorator';
import { LeafletPoint } from '../leaflet-point';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

import type * as L from 'leaflet';

export interface LeafletPointContentMixinElement extends LeafletBase {
  _pointMutationObserver: MutationObserver;
  feature: L.Polygon | L.Polyline;
  updatePointContent(): void;
}

export const LeafletPointContentMixin = dedupeMixin(
  function LeafletPointContentMixin<TBase extends Constructor<LeafletBase>>(
    superclass: TBase
  ): TBase & Constructor<LeafletPointContentMixinElement> {
    class LeafletPointContentElement extends superclass {
      _pointMutationObserver: MutationObserver;

      feature: L.Polygon | L.Polyline;

      connectedCallback() {
        if (MutationObserver && !this._pointMutationObserver) {
          this._pointMutationObserver = new MutationObserver(
            this.updatePointContent
          );
          this._pointMutationObserver.observe(this, {
            childList: true,
            characterData: true,
            attributes: true,
            subtree: true,
          });
        }
      }

      @bound updatePointContent() {
        if (!this.feature) return;

        const latLngs = [...this.children]
          .filter(LeafletPoint.isLeafletPoint)
          .map(x => x.latLng);

        this.feature.setLatLngs(latLngs);
      }

      disconnectedCallback() {
        if (this._pointMutationObserver) {
          this._pointMutationObserver.disconnect();
        }
      }
    }

    return LeafletPointContentElement;
  }
);
