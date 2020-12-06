import * as L from 'leaflet';
import { property, customElement, PropertyValues } from 'lit-element';
import { LeafletBase } from './base';

/**
 * Element which defines an icon template for markers (<a href="http://leafletjs.com/reference.html#icon">Leaflet Reference</a>).
 *
 * @example
 * ```html
 *     <leaflet-icon id="myicon"
 *         icon-url="https://stendhalgame.org/images/mapmarker/me.png">
 *     </leaflet-icon>
 * ```
 *
 * @element leaflet-icon
 * @blurb element which defines an icon template for markers.
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-icon')
export class LeafletIcon extends LeafletBase {
  static readonly is = 'leaflet-icon';

  static isLeafletIcon(node: Element): node is LeafletIcon {
    return node instanceof LeafletIcon;
  }

  /**
   * The `icon-url` attribute sets the URL to the icon image (absolute or relative to your script path).
   */
  @property({ type: String, attribute: 'icon-url' }) iconUrl: string;

  /**
   * The `icon-retina-url` attribute sets the URL to a retina sized version of the icon image (absolute or relative to your script path). Used for Retina screen devices.
   */
  @property({ type: String, attribute: 'icon-retina-url' })
  iconRetinaUrl: string;

  /**
   * The `icon-width` attribute sets the size of the icon image in pixels.
   */
  @property({ type: Number, attribute: 'icon-width' }) iconWidth: number;

  /**
   * The `icon-height` attribute sets the size of the icon image in pixels.
   */
  @property({ type: Number, attribute: 'icon-height' }) iconHeight: number;

  /**
   * The `icon-anchor-x` attribute sets the coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that this point is at the marker's geographical location. Centered by default if size is specified, also can be set in CSS with negative margins.
   */
  @property({ type: Number, attribute: 'icon-anchor-x' }) iconAnchorX: number;

  /**
   * The `icon-anchor-y` attribute sets the coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that this point is at the marker's geographical location. Centered by default if size is specified, also can be set in CSS with negative margins.
   */
  @property({ type: Number, attribute: 'icon-anchor-y' }) iconAnchorY: number;

  /**
   * The `shadow-url` attribute sets the URL to the icon shadow image. If not specified, no shadow image will be created.
   */
  @property({ type: String, attribute: 'shadow-url' }) shadowUrl: string;

  /**
   * The `shadow-retina-url` attribute sets the URL to the retina sized version of the icon shadow image. If not specified, no shadow image will be created. Used for Retina screen devices.
   */
  @property({ type: String, attribute: 'shadow-retina-url' }) shadowRetinaUrl: string;

  /**
   * The `shadow-width` attribute sets the size of the shadow image in pixels.
   */
  @property({ type: Number, attribute: 'shadow-width' }) shadowWidth: number;

  /**
   * The `shadow-height` attribute sets the size of the shadow image in pixels.
   */
  @property({ type: Number, attribute: 'shadow-height' }) shadowHeight: number;

  /**
   * The `shadow-anchor-x` attribute sets the coordinates of the "tip" of the shadow (relative to its top left corner) (the same as iconAnchor if not specified).
   */
  @property({ type: Number, attribute: 'shadow-anchor-x' }) shadowAnchorX: number;

  /**
   * The `shadow-anchor-y` attribute sets the coordinates of the "tip" of the shadow (relative to its top left corner) (the same as iconAnchor if not specified).
   */
  @property({ type: Number, attribute: 'shadow-anchor-y' }) shadowAnchorY: number;

  /**
   * The `popup-anchor-x` attribute sets the coordinates of the point from which popups will "open", relative to the icon anchor.
   */
  @property({ type: Number, attribute: 'popup-anchor-x' }) popupAnchorX: number;

  /**
   * The `popupanchory` attribute sets the coordinates of the point from which popups will "open", relative to the icon anchor.
   */
  @property({ type: Number, attribute: 'popup-anchor-y' }) popupAnchorY: number;

  /**
   * The `class-name` attribute sets a custom class name to assign to both icon and shadow images. Empty by default.
   */
  @property({ attribute: 'class-name' }) className = '';

  private icon: L.Icon = null;

  getIcon(): L.Icon {
    if (this.icon) return this.icon;

    const {
      className,
      iconAnchorX,
      iconAnchorY,
      iconHeight,
      iconRetinaUrl,
      iconUrl,
      iconWidth,
      popupAnchorX,
      popupAnchorY,
      shadowAnchorX,
      shadowAnchorY,
      shadowHeight,
      shadowRetinaUrl,
      shadowUrl,
      shadowWidth,
    } = this;

    const iconSize =
      iconWidth && iconHeight ?
        L.point(iconWidth, iconHeight)
        : undefined;

    const iconAnchor =
      iconAnchorX && iconAnchorY ?
        L.point(iconAnchorX, iconAnchorY)
        : undefined;

    const shadowSize =
      shadowWidth && shadowHeight ?
        L.point(shadowWidth, shadowHeight)
        : undefined;

    const shadowAnchor =
      shadowAnchorX && shadowAnchorY ?
        L.point(shadowAnchorX, shadowAnchorY)
        : undefined;

    const popupAnchor =
      popupAnchorX && popupAnchorY ?
        L.point(popupAnchorX, popupAnchorY)
        : undefined;

    this.icon = L.icon({
      className,
      iconAnchor,
      iconRetinaUrl,
      iconSize,
      iconUrl,
      popupAnchor,
      shadowAnchor,
      shadowRetinaUrl,
      shadowSize,
      shadowUrl,
    });

    return this.icon;
  }

  updated(changed: PropertyValues): void {
    super.updated(changed);
    this.icon = null;
  }
}
