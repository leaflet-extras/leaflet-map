import * as L from 'leaflet';

import { customElement, property } from 'lit-element';

import { LeafletBase } from './base';

import DATA_ELEMENT_STYLES from './data-element.css';

/**
 * Zoom control. (<a href="http://leafletjs.com/reference.html#control-zoom">Leaflet Reference</a>).
 *
 * ##### Example
 *
 *     <leaflet-zoom-control> </leaflet-zoom-control>
 *
 * ##### Example
 *
 *     <leaflet-zoom-control metric>
 *     </leaflet-zoom-control>
 *
 * @element leaflet-zoom-control
 * @blurb Zoom control.
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 */
@customElement('leaflet-zoom-control')
export class LeafletZoomControl extends LeafletBase {
  static readonly is = 'leaflet-zoom-control';

  static readonly styles = DATA_ELEMENT_STYLES;

  // @ts-expect-error: ambient property. see https://github.com/microsoft/TypeScript/issues/40220
  declare container: L.Map;

  declare control: L.Control.Zoom;

  /**
   * The position of the control (one of the map corners).
   * Possible values are 'topleft', 'topright', 'bottomleft' or 'bottomright'
   */
  @property({ type: String }) position: L.ControlPosition = 'topright';

  /** The text set on the 'zoom in' button.*/
  @property({ type: String }) zoomInText ='+'

  /** The title set on the 'zoom in' button.*/
  @property({ type: String }) zoomInTitle = 'Zoom in'

  /** The text set on the 'zoom out' button.*/
  @property({ type: String }) zoomOutText = '&#x2212'

  /** The title set on the 'zoom out' button. */
  @property({ type: String }) zoomOutTitle = 'Zoom out'

  containerChanged(): void {
    if (!this.container) return;
    const { position, zoomInText, zoomInTitle, zoomOutText, zoomOutTitle } = this;
    this.control = L.control.zoom({ position, zoomInText, zoomInTitle, zoomOutText, zoomOutTitle });
    this.control.addTo(this.container);
  }

  disconnectedCallback(): void {
    if (this.container && this.control)
      this.container.removeControl(this.control);
  }
}
