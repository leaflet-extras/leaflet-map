import { customElement, property, PropertyValues } from 'lit-element';
import * as L from 'leaflet';
import { DATA_ELEMENT_STYLES } from './data-element.css';
import { LeafletBase } from './base';

/**
 * Element which defines an divicon template for markers (<a href="http://leafletjs.com/reference.html#divicon">Leaflet Reference</a>).
 *
 * @example
 * html```
 *     <leaflet-divicon id="myicon" class-name="name">
 *         <a href="https://leaflet-extras.github.io/leaflet-map/demo.html">Demo</a>
 *     </leaflet-divicon>
 * ```
 *
 * @element leaflet-divicon
 * @blurb element which defines an divicon template for markers.
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-divicon')
export class LeafletDivicon extends LeafletBase {
  static readonly is = 'leaflet-divicon';

  static readonly styles = DATA_ELEMENT_STYLES;

  /**
   * The `icon-width` attribute sets the size of the icon image in pixels.
   */
  @property({ attribute: 'icon-width', type: Number }) iconWidth: number;

  /**
   * The `icon-height` attribute sets the size of the icon image in pixels.
   */
  @property({ attribute: 'icon-height', type: Number }) iconHeight: number;

  /**
   * The `icon-anchor-x` attribute sets the coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that this point is at the marker's geographical location. Centered by default if size is specified, also can be set in CSS with negative margins.
   */
  @property({ attribute: 'icon-anchor-x', type: Number }) iconAnchorX: number;

  /**
   * The `icon-anchor-y` attribute sets the coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that this point is at the marker's geographical location. Centered by default if size is specified, also can be set in CSS with negative margins.
   */
  @property({ attribute: 'icon-anchor-y', type: Number }) iconAnchorY: number;

  /**
   * The `class-name` attribute sets a custom class name to assign to both icon and shadow images. Empty by default.
   */
  @property({ attribute: 'class-name', type: String }) className = '';

  private icon: L.DivIcon;

  getIcon(): L.DivIcon {
    if (this.icon) return this.icon;

    const {
      className,
      iconWidth,
      iconHeight,
      iconAnchorX,
      iconAnchorY,
      innerHTML: html,
    } = this;

    const iconSize =
      iconWidth && iconHeight ? L.point(iconWidth, iconHeight) : undefined;
    const iconAnchor =
      iconAnchorX && iconAnchorY ?
        L.point(iconAnchorX, iconAnchorY)
        : undefined;

    this.icon = L.divIcon({
      iconSize,
      iconAnchor,
      className,
      html,
    });

    return this.icon;
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);
    this.icon = null;
  }
}
