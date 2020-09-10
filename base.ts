import { FireMixin } from '@pwrs/mixins/fire';
import { LitElement } from 'lit-element';
import { bound } from './bound-decorator';
import * as L from 'leaflet';

type LeafletFeature =
  | null
  | L.Circle
  | L.GeoJSON
  | L.Marker
  | L.LayerGroup
  | L.Polyline
  | L.Polygon
  | L.Popup
  | L.Point;

export class LeafletBase extends FireMixin(LitElement) {
  declare static is: string;

  declare feature: LeafletFeature;

  declare protected mo?: MutationObserver;

  declare private _container: L.Map | L.LayerGroup;

  get container(): L.Map | L.LayerGroup {
    return this._container;
  }

  set container(container: L.Map | L.LayerGroup) {
    this._container = container;
    this.containerChanged?.(container);
  }

  @bound onLeafletEvent(e: L.LeafletEvent): void {
    this.fire(e.type, e);
  }

  containerChanged?(container?: L.Map | L.LayerGroup): void
}
