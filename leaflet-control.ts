import * as L from 'leaflet';

import { customElement, property } from 'lit-element';

import { LeafletBase } from './base';

import DATA_ELEMENT_STYLES from './data-element.css';

/**
 * Scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. (<a href="http://leafletjs.com/reference.html#control-scale">Leaflet Reference</a>).
 *
 * ##### Example
 *
 *     <leaflet-scale-control> </leaflet-scale-control>
 *
 * ##### Example
 *
 *     <leaflet-scale-control metric>
 *     </leaflet-scale-control>
 *
 * @element leaflet-scale-control
 * @blurb Scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems.
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 */
@customElement('leaflet-scale-control')
export class LeafletControl extends LeafletBase {
  static readonly is = 'leaflet-scale-control';

  static readonly styles = DATA_ELEMENT_STYLES;

  // @ts-expect-error: ambient property. see https://github.com/microsoft/TypeScript/issues/40220
  declare container: L.Map;

  declare control: L.Control.Scale;

  /**
   * The `position` attribute sets the position of the control (one of the map corners). See control positions.
   */
  @property({ type: String }) position: L.ControlPosition = 'bottomleft';

  /**
   * The `max-width` attribute sets the maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
   */
  @property({ type: Number, attribute: 'max-width' }) maxWidth = 100;

  /**
   * The `metric` attribute sets whether to show the metric scale line (m/km).
   */
  @property({ type: Boolean }) metric = false;

  /**
   * The `imperial` attribute sets whether to show the imperial scale line (mi/ft).
   */
  @property({ type: Boolean }) imperial = false;

  /**
   * The `update-when-idle` attribute sets whether the control is updated on moveend, otherwise it's always up-to-date (updated on move).
   */
  @property({ type: Boolean, attribute: 'update-when-idle' }) updateWhenIdle = false;

  containerChanged(): void {
    if (!this.container) return;
    this.control = L.control.scale({
      position: this.position,
      maxWidth: this.maxWidth,
      metric: this.metric || !this.imperial,
      imperial: this.imperial || !this.metric,
      updateWhenIdle: this.updateWhenIdle,
    });
    this.control.addTo(this.container);
  }

  disconnectedCallback(): void {
    if (this.container && this.control)
      this.container.removeControl(this.control);
  }
}
