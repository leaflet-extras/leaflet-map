import type { LeafletBase } from '../base';
import type * as L from 'leaflet';

import { Constructor } from 'lit-element';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { bound } from '../bound-decorator';

export interface LeafletPopupContentMixinElement extends LeafletBase {
  feature: L.Popup | L.Polygon | L.Polyline | L.Circle | L.Marker;
  _popupMO: MutationObserver;
  updatePopupContent(): void;
}

export const LeafletPopupContentMixin = dedupeMixin(
  function LeafletPopupContentMixin<TBase extends Constructor<LeafletBase>>(
    superclass: TBase
  ): TBase & Constructor<LeafletPopupContentMixinElement> {
    class LeafletPopupContentElement extends superclass {
      feature: L.Popup | L.Polygon | L.Polyline | L.Circle | L.Marker;

      _popupMO: MutationObserver;

      connectedCallback() {
        super.connectedCallback();
        if (MutationObserver && !this._popupMO) {
          this._popupMO = new MutationObserver(this.updatePopupContent);
          this._popupMO.observe(this, {
            childList: true,
            characterData: true,
            attributes: true,
            subtree: true,
          });
        }
      }

      @bound updatePopupContent() {
        if (!this.feature) return;

        this.feature.unbindPopup();

        // TODO: Hack, ignore <leaflet-point>-tag
        // const content = Polymer.dom(this).innerHTML.replace(/<\/?leaflet-point[^>]*>/g, "").trim();
        const content = this.innerHTML
          .replace(/<\/?leaflet-point[^>]*>/g, '')
          .trim();
        if (content) {
          this.feature.bindPopup(content);
        }
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        if (this._popupMO) {
          this._popupMO.disconnect();
        }
      }
    }

    return LeafletPopupContentElement;
  }
);
