import type { Constructor } from 'lit-element';
import type { LeafletBase } from '../base';

import { bound } from '../bound-decorator';
import { LeafletPoint } from '../leaflet-point';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

import type * as L from 'leaflet';

export interface LeafletPointContentMixinElement extends LeafletBase {
  pointMO: MutationObserver;
  feature: L.Polygon | L.Polyline;
  updatePointContent(): void;
}

export const LeafletPointContentMixin = dedupeMixin(
  function LeafletPointContentMixin<TBase extends Constructor<LeafletBase>>(
    superclass: TBase
  ): TBase & Constructor<LeafletPointContentMixinElement> {
    class LeafletPointContentElement extends superclass {
      /** @private */
      declare pointMO: MutationObserver;

      declare feature: L.Polygon | L.Polyline;

      connectedCallback() {
        if (MutationObserver && !this.pointMO) {
          this.pointMO = new MutationObserver(this.updatePointContent);
          this.pointMO.observe(this, {
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
        if (this.pointMO)
          this.pointMO.disconnect();
      }
    }

    return LeafletPointContentElement;
  }
);
