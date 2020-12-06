import * as L from 'leaflet';

import { customElement, LitElement, property } from 'lit-element';

import { LeafletBase } from './base';

import DATA_ELEMENT_STYLES from './data-element.css';

type LegendSymbolType = 'circle' | 'image' | 'polygon' | 'polyline' | 'rectangle';

/* eslint-disable @typescript-eslint/no-namespace*/
declare module 'leaflet' {
  export interface LegendOptions extends ControlOptions {
    /** The title of the control. */
    title: string
    /** Opacity of the container.*/
    opacity: number
    /** Array of legend symbols that will be added to the container.*/
    legends: LegendSymbolOptions[]
    /** Symbol width of the legend, in pixels.*/
    symbolWidth: number
    /** Symbol width of the legend, in pixels.*/
    symbolHeight: number
    /** The number of columns arranged in the legend. */
    column: number
    /** If true, the control will be collapsed into an icon and expanded on mouse hover or touch.*/
    collapsed: boolean
  }

  interface BaseLegendSymbolOptions {
    /**  The label of the legend symbol.  */
    label: string;
    /** The type of the legend symbol. Possible values are 'image', 'circle', 'rectangle', 'polygon' or 'polyline'  */
    type: string;
    /** Legend symbol associated layers. While associating the layers, the display state of the layers can be toggled.  */
    layers: L.Layer | L.Layer[];
    /** Is the legend symbol inactive */
    inactive: boolean;
    /** Whether to draw stroke along the path. Set it to false to disable borders on polygons or circles.  */
    stroke: boolean;
    /** Stroke color */
    color: string;
    /** Stroke width in pixels */
    weight: number;
    /** Stroke opacity */
    opacity: number;
    /** A string that defines shape to be used at the end of the stroke. */
    lineCap: CanvasLineCap;
    /** A string that defines shape to be used at the corners of the stroke. */
    lineJoin: CanvasLineJoin;
    /** A string that defines the stroke dash pattern. Doesn't work on Canvas-powered layers in some old browsers.  */
    dashArray: string;
    /** A string that defines the distance into the dash pattern to start the dash. Doesn't work on Canvas-powered layers in some old browsers.  */
    dashOffset: string;
    /** Whether to fill the path with color. Set it to false to disable filling on polygons or circles. */
    fill: boolean;
    /** Fill color. Defaults to the value of the color option */
    fillColor: string;
    /** Fill opacity. */
    fillOpacity: number;
    /** A string that defines how the inside of a shape is determined. */
    fillRule: CanvasFillRule;
    /** Reference to the symbol's custom element */
    element: LegendSymbolElement;
  }

  export interface ImageSymbolOptions extends BaseLegendSymbolOptions {
    /** The url of the symbol image, only used when type is 'image' */
    url: string;
  }

  export interface CircleSymbolOptions extends BaseLegendSymbolOptions {
    /** The radius of the circle, in pixels, only used when type is 'circle' */
    radius: number;
  }

  export interface PolygonSymbolOptions extends BaseLegendSymbolOptions {
    /** The number of sides of a regular polygon, only used when type is 'polygon' */
    sides: number;
  }

  export type LegendSymbolOptions =
      BaseLegendSymbolOptions
    | ImageSymbolOptions
    | CircleSymbolOptions
    | PolygonSymbolOptions;

  namespace control {
    function legend(options: LegendOptions): L.Control.Legend;
  }

  namespace Control {
    class Legend extends Control {
      options: LegendOptions;

      container: HTMLDivElement;

      protected _contents: HTMLElement;

      protected symbols: LegendSymbol[];

      protected _map: L.Map;

      protected _link: HTMLAnchorElement;

      protected _buildContainer(): void;

      protected _buildContents(): void;

      protected _buildLegendItems(container: HTMLElement, options: L.LegendSymbolOptions): void;

      protected _toggleLegend(legendDiv: HTMLElement, layers: L.Layer[]): void;

      protected _initLayout(): void;

      constructor(options?: LegendOptions);

      initialize(options: LegendOptions): void;

      expand(): Legend

      collapse(): Legend

      redraw(): void
    }

    export interface Map {
      getContainerRoot(): DocumentOrShadowRoot;
    }
  }
}

/**
 * Legend control. (<a href="https://github.com/ptma/Leaflet.Legend">Leaflet Reference</a>).
 *
 * ##### Example
 *
 *     <leaflet-legend> </leaflet-legend>
 *
 * ##### Example
 *
 *     <leaflet-legend>
 *     </leaflet-legend>
 *
 * @element leaflet-legend
 * @blurb Legend control.
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 */
@customElement('leaflet-legend')
export class LeafletLegendControl extends LeafletBase {
  static readonly is = 'leaflet-legend';

  static readonly styles = DATA_ELEMENT_STYLES;

  // @ts-expect-error: ambient property. see https://github.com/microsoft/TypeScript/issues/40220
  declare container: L.Map;

  declare control: L.Control.Legend;

  /**
   * The position of the control (one of the map corners).
   * Possible values are 'topleft', 'topright', 'bottomleft' or 'bottomright'
   */
  @property({ type: String }) position: L.ControlPosition = 'topleft';

  /** The title of the control. */
  @property({ type: String }) title = 'Legend';

  /** If true, the control will be collapsed into an icon and expanded on mouse hover or touch. */
  @property({ type: Boolean }) collapsed = false;

  /** Opacity of the container.*/
  @property({ type: Number }) opacity: number;

  /** Symbol width of the legend, in pixels.*/
  @property({ type: Number, attribute: 'symbol-width' }) symbolWidth = 24;

  /** Symbol width of the legend, in pixels.*/
  @property({ type: Number, attribute: 'symbol-height' }) symbolHeight = 24;

  /** The number of columns arranged in the legend. */
  @property({ type: Number }) column: number

  /** Array of legend symbols that will be added to the container. */
  get legends(): L.LegendSymbolOptions[] {
    return [...this.children]
      .filter(isLegendSymbolElement).map(x => x.options);
  }

  get options(): L.LegendOptions {
    const {
      position, title, opacity, symbolHeight,
      symbolWidth, column, collapsed, legends,
    } = this;

    return {
      position, title, opacity, symbolHeight,
      symbolWidth, column, collapsed, legends,
    };
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.mo = new MutationObserver(records => this.onMutation(records));
    await this.updateComplete;
    this.mo.observe(this, { childList: true });
  }

  async _getUpdateComplete(): Promise<void> {
    await super._getUpdateComplete();
    await Promise.all([...this.children].filter(isLegendSymbolElement).map(x => x.updateComplete));
  }

  protected onMutation(records: MutationRecord[]): void {
    records.forEach(record => {
      record.addedNodes.forEach(async node => {
        if (isLegendSymbolElement(node)) {
          await node.updateComplete;
          node.control = this.control;
          this.control.options.legends.push(node.options);
        }
      });
    });
  }

  async containerChanged(): Promise<void> {
    if (!this.container) return;
    this.container.on('zoomend', () => this.rescale());
    await this.updateComplete;
    this.initControl();
  }

  private initControl(): void {
    this.control = L.control.legend(this.options);
    this.legends.forEach(x => this.control.options.legends.push(x));
    this.control.addTo(this.container);
  }


  disconnectedCallback(): void {
    if (this.container && this.control)
      this.container.removeControl(this.control);
  }

  redraw(): void {
    this.control.redraw();
  }

  rescale(): void {
    [...this.children].forEach(x => {
      if (isLegendSymbolElement(x) && isGeometricSymbol(x.legend))
        x.legend.rescale();
    });
  }
}

function isLegendSymbolElement(node: Node): node is LegendSymbolElement {
  return node instanceof LegendSymbolElement;
}

function isGeometricSymbol(legend: LegendSymbol): legend is GeometricSymbol {
  return legend instanceof GeometricSymbol;
}

@customElement('leaflet-legend-symbol')
class LegendSymbolElement extends LitElement {
  /** A reference to the leaflet legend object */
  declare legend: LegendSymbol;

  /** The type of the legend symbol. Possible values are 'image', 'circle', 'rectangle', 'polygon' or 'polyline' */
  @property({ type: String }) type: LegendSymbolType;

  /** The label of the legend symbol. */
  @property({ type: String }) label: string;

  /** Stroke color */
  @property({ type: String }) color = '#3388ff';

  /** Whether to fill the path with color. Set it to false to disable filling on polygons or circles. */
  @property({ type: Boolean }) fill = false;

  /** The radius of the circle, in pixels, only used when type is 'circle' */
  @property({ type: Number }) radius: number;

  /** The url of the symbol image, only used when type is 'image' */
  @property({ type: String }) url: string

  /** The number of sides of a regular polygon, only used when type is 'polygon' */
  @property({ type: Number }) sides: number;

  /** Fill color. Defaults to the value of the color option */
  @property({ type: String, attribute: 'fill-color' }) fillColor: string;

  /** Fill opacity. */
  @property({ type: Number, attribute: 'fill-opacity' }) fillOpacity = 0.2;

  /** A string that defines how the inside of a shape is determined. */
  @property({ type: String, attribute: 'fill-rule' }) fillRule: CanvasFillRule;

  /** Whether to draw stroke along the path. Set it to false to disable borders on polygons or circles.  */
  @property({ type: Boolean }) stroke = true;

  /** A string that defines the stroke dash pattern. Doesn't work on Canvas-powered layers in some old browsers.  */
  @property({ type: String, attribute: 'dash-array' }) dashArray: string = null;

  /** A string that defines the distance into the dash pattern to start the dash. Doesn't work on Canvas-powered layers in some old browsers.  */
  @property({ type: String, attribute: 'dash-offset' }) dashOffset: string = null;

  /** Stroke opacity */
  @property({ type: Number }) opacity = 1.0;

  /** Stroke width in pixels */
  @property({ type: Number }) weight = 3;

  /** A string that defines shape to be used at the end of the stroke. */
  @property({ type: String, attribute: 'line-cap' }) lineCap: CanvasLineCap = 'round';

  /** A string that defines shape to be used at the corners of the stroke. */
  @property({ type: String, attribute: 'line-join' }) lineJoin: CanvasLineJoin = 'round';

  /** Is the legend symbol inactive */
  @property({ type: Boolean }) inactive = false;

  layers: L.Layer | L.Layer[];

  #control: L.Control.Legend;

  get control(): L.Control.Legend {
    return this.#control;
  }

  set control(value: L.Control.Legend) {
    this.#control = value;
    this.controlChanged();
  }

  controlChanged(): void {
    const { baseOptions, type, url, radius, sides } = this;
    switch (type) {
      case 'image': this.control.options.legends.push({ ...baseOptions, url }); break;
      case 'circle': this.control.options.legends.push({ ...baseOptions, radius }); break;
      case 'rectangle': this.control.options.legends.push(baseOptions); break;
      case 'polygon': this.control.options.legends.push({ ...baseOptions, sides }); break;
      case 'polyline': this.control.options.legends.push(baseOptions); break;
      default: return;
    }
  }

  private get baseOptions(): L.BaseLegendSymbolOptions {
    const {
      color, opacity,
      dashArray, dashOffset, stroke, weight,
      fill, fillColor, fillOpacity, fillRule,
      lineCap, lineJoin,
      type, label, layers, inactive,
    } = this;
    return {
      color, opacity,
      dashArray, dashOffset, stroke, weight,
      fill, fillColor, fillOpacity, fillRule,
      lineCap, lineJoin,
      type, label, layers, inactive,
      element: this,
    };
  }

  get options(): L.LegendSymbolOptions {
    const { baseOptions, url, radius, sides, type } = this;
    return {
      ...baseOptions,
      ...(type === 'image' ? { url }
        : type === 'circle' ? { radius }
        : type === 'polygon' ? { sides }
        : {}),
    };
  }
}

/**
   * @license
   * for subsequent code
   * MIT License

  Copyright (c) 2020 ptma@163.com

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
   */

class LegendSymbol {
  width: number;

  height: number;

  inactive: boolean;

  label: string;

  layers: L.Layer[];

  type: LegendSymbolType;

  fill: string;

  fillColor: string;

  fillOpacity: number;

  color: string;

  fillRule: CanvasFillRule;

  stroke: string;

  dashArray: number[];

  opacity: number;

  weight: number;

  lineCap: CanvasLineCap;

  lineJoin: CanvasLineJoin;

  element: LegendSymbolElement;

  constructor(
    protected control: L.Control.Legend,
    protected container: HTMLElement,
    protected options: L.LegendSymbolOptions,
  ) {
    this.element = this.options.element;
    this.element.legend = this;
    this.width = this.control.options.symbolWidth;
    this.height = this.control.options.symbolHeight;
  }
}

abstract class GeometricSymbol extends LegendSymbol {
  protected canvas: HTMLCanvasElement;

  abstract ctx: CanvasRenderingContext2D;

  abstract _drawSymbol(): void

  abstract rescale(): void

  abstract center(): void

  __init?(): void;

  constructor(
    protected control: L.Control.Legend,
    protected container: HTMLElement,
    protected options: L.LegendSymbolOptions,
  ) {
    super(control, container, options);

    this.__init?.();
    this.canvas = this._buildCanvas();

    this._drawSymbol?.();

    this._style();
  }

  _buildCanvas() {
    const canvas = L.DomUtil.create('canvas', null, this.container) as HTMLCanvasElement;
    canvas.height = this.control.options.symbolHeight;
    canvas.width = this.control.options.symbolWidth;
    return canvas;
  }

  _style() {
    const ctx = (this.ctx = this.canvas.getContext('2d'));
    if (this.options.fill || this.options.fillColor) {
      ctx.globalAlpha = this.options.fillOpacity ?? 1;
      ctx.fillStyle = this.options.fillColor ?? this.options.color;
      ctx.fill(this.options.fillRule ?? 'evenodd');
    }

    if (this.options.stroke || this.options.color) {
      if (this.options.dashArray)
        ctx.setLineDash(this.options.dashArray.split(',').map(x => parseFloat(x)) || []);

      ctx.globalAlpha = this.options.opacity || 1.0;
      ctx.lineWidth = this.options.weight || 2;
      ctx.strokeStyle = this.options.color || '#3388ff';
      ctx.lineCap = this.options.lineCap || 'round';
      ctx.lineJoin = this.options.lineJoin || 'round';
      ctx.stroke();
    }
  }
}

class CircleSymbol extends GeometricSymbol {
  declare dimensions: { centerX: number, centerY: number, radius: number };

  rescale(): void {
    if (!this.dimensions) return;
    // const { dimensions: { centerX, centerY, radius } } = this;
    // this.ctx.clearRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    // this._drawSymbol();
  }

  center(): void { void 0; }

  ctx: CanvasRenderingContext2D;

  radius: number;

  constructor(
    protected control: L.Control.Legend,
    protected container: HTMLDivElement,
    protected options: L.CircleSymbolOptions
  ) {
    super(control, container, options);
  }

  __init(): void {
    const { options } = this;
    const linelWeight = options.weight || 3;

    const centerX = this.control.options.symbolWidth / 2;
    const centerY = this.control.options.symbolHeight / 2;
    const maxRadius = Math.min(centerX, centerY) - linelWeight;

    let radius = maxRadius;

    if (options.radius)
      radius = Math.min(options.radius, maxRadius);

    this.dimensions = { centerX, centerY, radius };
  }

  _drawSymbol() {
    const ctx = (this.ctx = this.canvas.getContext('2d'));
    const { dimensions: { centerX, centerY, radius } } = this;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  }
}

class PolylineSymbol extends GeometricSymbol {
  rescale(): void { void 0; }

  center(): void { void 0; }

  ctx: CanvasRenderingContext2D;

  _drawSymbol() {
    const ctx = (this.ctx = this.canvas.getContext('2d'));

    const x1 = 0;
    const x2 = this.control.options.symbolWidth;
    const y = this.control.options.symbolHeight / 2;

    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
  }
}

class RectangleSymbol extends GeometricSymbol {
  rescale(): void { void 0; }

  center(): void { void 0; }

  ctx: CanvasRenderingContext2D;

  _drawSymbol() {
    const ctx = (this.ctx = this.canvas.getContext('2d'));
    const linelWeight = this.options.weight || 3;

    const x0 = this.control.options.symbolWidth / 2;
    const y0 = this.control.options.symbolHeight / 2;

    const rx = x0 - linelWeight;
    let ry = y0 - linelWeight;
    if (rx === ry)
      ry = ry / 2;

    ctx.rect(x0 - rx, y0 - ry, rx * 2, ry * 2);
  }
}

/**
       * 圆心坐标：(x0,y0) 半径：r 角度(X轴顺时针旋转)：a
       * 弧度 = 角度 * Math.PI / 180
       * 则圆上任一点为：（x1,y1）
       * x1   =   x0   +   r   *   Math.cos( a  * Math.PI / 180)
       * y1   =   y0   +   r   *   Math.sin( a  * Math.PI / 180)
       */
class PolygonSymbol extends GeometricSymbol {
  rescale(): void { void 0; }

  center(): void { void 0; }

  options: L.PolygonSymbolOptions;

  sides: number;

  ctx: CanvasRenderingContext2D;

  _drawSymbol() {
    const ctx = (this.ctx = this.canvas.getContext('2d'));

    const linelWeight = this.options.weight || 3;
    const x0 = this.control.options.symbolWidth / 2;
    const y0 = this.control.options.symbolHeight / 2;
    const r = Math.min(x0, y0) - linelWeight;
    const a = 360 / this.options.sides;
    ctx.beginPath();
    // eslint-disable-next-line easy-loops/easy-loops
    for (let i = 0; i <= this.options.sides; i++) {
      const x1 = x0 + r * Math.cos(((a * i + (90 - a / 2)) * Math.PI) / 180);
      const y1 = y0 + r * Math.sin(((a * i + (90 - a / 2)) * Math.PI) / 180);
      if (i === 0)
        ctx.moveTo(x1, y1);
      else
        ctx.lineTo(x1, y1);
    }
  }
}

class ImageSymbol extends LegendSymbol {
  protected img: HTMLImageElement = null;

  url: string;

  constructor(
    public control: L.Control.Legend,
    public container: HTMLElement,
    public options: L.ImageSymbolOptions
  ) {
    super(control, container, options);
    this._loadImages();
  }

  _loadImages() {
    const imageLoaded = () => this.rescale();
    const img = L.DomUtil.create('img', null, this.container) as HTMLImageElement;
    this.img = img;
    img.onload = imageLoaded;
    img.src = this.options.url;
  }

  rescale() {
    if (this.img) {
      const { options } = this.control;
      if (this.img.width > options.symbolWidth || this.img.height > options.symbolHeight) {
        const imgW = this.img.width;
        const imgH = this.img.height;
        const scaleW = options.symbolWidth / imgW;
        const scaleH = options.symbolHeight / imgH;
        const scale = Math.min(scaleW, scaleH);
        this.img.width = imgW * scale;
        this.img.height = imgH * scale;
      }
      this.center();
    }
  }

  center() {
    const containerCenterX = this.container.offsetWidth / 2;
    const containerCenterY = this.container.offsetHeight / 2;
    const imageCenterX = parseInt(this.img.width.toString()) / 2;
    const imageCenterY = parseInt(this.img.height.toString()) / 2;

    const shiftX = containerCenterX - imageCenterX;
    const shiftY = containerCenterY - imageCenterY;

    this.img.style.left = `${shiftX.toString()}px`;
    this.img.style.top = `${shiftY.toString()}px`;
  }
}

L.Control.Legend = L.Control.extend({
  options: {
    position: 'topleft',
    title: 'Legend',
    legends: [],
    symbolWidth: 24,
    symbolHeight: 24,
    opacity: 1.0,
    column: 1,
    collapsed: false,
  },

  initialize(this: L.Control.Legend, options: L.LegendOptions) {
    L.Util.setOptions(this, options);
    this.symbols = [];
    this._buildContainer();
    this._buildContents();
  },

  onAdd(this: L.Control.Legend, map: L.Map) {
    this._map = map;
    this._initLayout();
    return this.container;
  },

  _buildContainer(this: L.Control.Legend) {
    this.container =
      L.DomUtil.create('div', 'leaflet-legend leaflet-bar leaflet-control') as HTMLDivElement;

    this.container.style.backgroundColor = `rgba(255,255,255, ${this.options.opacity})`;
  },

  _buildContents(this: L.Control.Legend) {
    this._contents =
      L.DomUtil.create('section', 'leaflet-legend-contents', this.container) as HTMLElement;

    this._contents.setAttribute('part', 'leaflet-legend-contents');

    this._link =
      L.DomUtil.create('a', 'leaflet-legend-toggle', this.container) as HTMLAnchorElement;

    this._link.title = 'Legend';
    this._link.href = '#';

    const title =
      L.DomUtil.create('h3', 'leaflet-legend-title', this._contents);

    title.innerText = this.options.title || 'Legend';

    const len = this.options.legends.length;
    const colSize = Math.ceil(len / this.options.column);

    let legendContainer = this._contents;

    // eslint-disable-next-line easy-loops/easy-loops
    for (let i = 0; i < len; i++) {
      if (i % colSize === 0)
        legendContainer = L.DomUtil.create('div', 'leaflet-legend-column', this._contents);

      const options = this.options.legends[i];
      this._buildLegendItems(legendContainer, options);
    }
  },

  _buildLegendItems(
    this: L.Control.Legend,
    legendContainer: HTMLDivElement,
    options: L.LegendSymbolOptions
  ) {
    const legendItemDiv = L.DomUtil.create('div', 'leaflet-legend-item', legendContainer);

    if (options.inactive)
      L.DomUtil.addClass(legendItemDiv, 'leaflet-legend-item-inactive');

    const container = L.DomUtil.create('i', null, legendItemDiv) as HTMLDivElement;

    switch (options.type) {
      case 'image':
        this.symbols.push(new ImageSymbol(this, container, options as L.ImageSymbolOptions));
        break;
      case 'circle':
        this.symbols.push(new CircleSymbol(this, container, options as L.CircleSymbolOptions));
        break;
      case 'rectangle':
        this.symbols.push(new RectangleSymbol(this, container, options));
        break;
      case 'polygon':
        this.symbols.push(new PolygonSymbol(this, container, options));
        break;
      case 'polyline':
        this.symbols.push(new PolylineSymbol(this, container, options));
        break;
      default:
        L.DomUtil.remove(legendItemDiv);
        return;
    }

    container.style.width = `${this.options.symbolWidth}px`;
    container.style.height = `${this.options.symbolHeight}px`;

    const legendLabel = L.DomUtil.create('span', null, legendItemDiv);

    legendLabel.innerText = options.label;

    if (options.layers) {
      L.DomUtil.addClass(legendItemDiv, 'leaflet-legend-item-clickable');
      L.DomEvent.on(
        legendItemDiv,
        'click',
        () => this._toggleLegend.call(this, legendItemDiv, options.layers),
        this
      );
    }
  },

  _initLayout() {
    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.disableScrollPropagation(this.container);

    if (this.options.collapsed) {
      this._map.on('click', this.collapse, this);

      L.DomEvent.on(
        this.container,
        {
          mouseenter: this.expand,
          mouseleave: this.collapse,
        },
        this
      );
    } else
      this.expand();
  },

  _toggleLegend(legendDiv: HTMLElement, layers: L.Layer[]) {
    if (L.DomUtil.hasClass(legendDiv, 'leaflet-legend-item-inactive')) {
      L.DomUtil.removeClass(legendDiv, 'leaflet-legend-item-inactive');
      if (L.Util.isArray(layers)) {
        for (const layer of layers)
          this._map.addLayer(layer);
      } else
        this._map.addLayer(layers);
    } else {
      L.DomUtil.addClass(legendDiv, 'leaflet-legend-item-inactive');
      if (L.Util.isArray(layers)) {
        for (const layer of layers)
          this._map.removeLayer(layer);
      } else
        this._map.removeLayer(layers);
    }
  },

  expand(this: L.Control.Legend) {
    this._link.style.display = 'none';
    L.DomUtil.addClass(this.container, 'leaflet-legend-expanded');
    // eslint-disable-next-line easy-loops/easy-loops
    for (const symbol of this.symbols) {
      if (isGeometricSymbol(symbol))
        symbol.rescale();
    }

    return this;
  },

  collapse() {
    this._link.style.display = 'block';
    L.DomUtil.removeClass(this.container, 'leaflet-legend-expanded');
    return this;
  },

  redraw(this: L.Control.Legend) {
    L.DomUtil.empty(this.container);
    this._buildContents();
  },
} as unknown as L.Control.Legend);

L.control.legend = function(options) {
  return new L.Control.Legend(options);
};
