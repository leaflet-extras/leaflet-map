import { customElement, property, PropertyValues } from 'lit-element';
import { LeafletILayerMixin } from './mixins/ilayer';
import { LeafletTileLayerMixin } from './mixins/tile-layer';
import * as L from 'leaflet';
import { LeafletBase } from './base';
import { DATA_ELEMENT_STYLES } from './data-element.css';

/**
 * Element which defines a [tile layer for wms](http://leafletjs.com/reference.html#tilelayer-wms)
 *
 * @example
 * ```html
 *     <leaflet-tilelayer-wms
 *         url="https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi"
 *         layers="nexrad-n0r-900913" format="image/png" transparent>
 *
 *             Weather data &copy; 2012 IEM Nexrad
 *
 *     </leaflet-tilelayer-wms>
 * ```
 *
 * @element leaflet-tilelayer-wms
 * @blurb Element which defines a tile layer for wms. The content of the leaflet-tilelayer-wms is used as attribution. It inherits attributes and events from &lt;leaflet-tilelayer&gt;
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 * @since 0.0.2
 */
@customElement('leaflet-tilelayer-wms')
export class LeafletTileLayerWms extends LeafletILayerMixin(
  LeafletTileLayerMixin(LeafletBase)
) {
  static readonly is = 'leaflet-tilelayer-wms';

  static readonly styles = DATA_ELEMENT_STYLES;

  layer: L.TileLayer.WMS;

  @property() url = '';

  /**
   * The `layers` attribute sets the comma-separated list of WMS layers to show (required).
   */
  @property() layers = '';

  /**
   * The `styles` attribute sets the comma-separated list of WMS styles.
   */
  @property() styles = '';

  /**
   * The `format` attribute sets the WMS image format (use 'image/png' for layers with transparency).
   */
  @property() format = 'image/jpeg';

  /**
   * The `transparent` attribute whether the WMS service will return images with transparency.
   */
  @property({ type: Boolean }) transparent = false;

  /**
   * The `version` attribute sets the version of the WMS service to use.
   */
  @property() version = '1.1.1';

  /**
   * The `crs` attribute sets the coordinate Reference System to use for the WMS requests, defaults to map CRS. Don't change this if you're not sure what it means.
   */
  @property({ attribute: false }) crs: L.CRS;

  updated(changed: PropertyValues) {
    super.updated(changed);
    if (changed.has('url')) this.urlChanged();
  }

  get container() {
    return this._container;
  }

  set container(v) {
    this._container = v;
    if (!this.container) return;

    this.layer = L.tileLayer.wms(this.url, {
      attribution: this.innerHTML + this.attribution,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      maxNativeZoom: this.maxNativeZoom,
      tileSize: this.tileSize,
      subdomains: this.subdomains,
      errorTileUrl: this.errorTileUrl,
      tms: this.tms,
      noWrap: this.noWrap,
      zoomOffset: this.zoomOffset,
      zoomReverse: this.zoomReverse,
      opacity: this.opacity,
      zIndex: this.zIndex,
      detectRetina: this.detectRetina,
      layers: this.layers,
      styles: this.styles,
      format: this.format,
      transparent: this.transparent,
      version: this.version,
      crs: this.crs,
    });

    // forward events
    this.layer.on(
      'loading load tileloadstart tileload tileunload',
      this.onLeafletEvent
    );

    this.layer.addTo(this.container);
  }

  urlChanged() {
    if (this.layer) {
      this.layer.setUrl(this.url);
    }
  }
}
