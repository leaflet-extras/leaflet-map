import { dedupeMixin } from '@open-wc/dedupe-mixin';
import type { Constructor } from 'lit-element';
import type { LeafletBase } from '../base';

export interface LeafletILayerMixinElement extends LeafletBase {
  isLayer(): boolean;
}

/**
 * Abstract element representing [ILayer](http://leafletjs.com/reference.html#ilayer).
 */
export const LeafletILayerMixin = dedupeMixin(function LeafletILayerMixin<
  TBase extends Constructor<LeafletBase>
>(superclass: TBase): TBase & Constructor<LeafletILayerMixinElement> {
  class LeafletILayerElement extends superclass {
    isLayer() {
      return true;
    }
  }

  return LeafletILayerElement;
});
