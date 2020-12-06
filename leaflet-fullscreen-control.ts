import * as L from 'leaflet';

import {
  customElement,
  html,
  property,
  query,
  queryAssignedNodes,
  TemplateResult,
} from 'lit-element';

import { LeafletBase } from './base';

import DATA_ELEMENT_STYLES from './data-element.css';

declare global {
  interface Element {
    /* eslint-disable max-len */
    mozRequestFullScreen?(...params: Parameters<HTMLElement['requestFullscreen']>): ReturnType<HTMLElement['requestFullscreen']>
    webkitRequestFullscreen?(...params: Parameters<HTMLElement['requestFullscreen']>): ReturnType<HTMLElement['requestFullscreen']>
    msRequestFullscreen?(...params: Parameters<HTMLElement['requestFullscreen']>): ReturnType<HTMLElement['requestFullscreen']>
    /* eslint-enable max-len */
  }

  interface DocumentOrShadowRoot {
    mozFullScreenElement?: DocumentOrShadowRoot['fullscreenElement']
    webkitFullscreenElement?: DocumentOrShadowRoot['fullscreenElement']
    msFullscreenElement?: DocumentOrShadowRoot['fullscreenElement']
  }

  interface Document {
    mozCancelFullScreen?: Document['exitFullscreen']
    webkitCancelFullScreen?: Document['exitFullscreen']
    msExitFullscreen?: Document['exitFullscreen']
  }
}

/* eslint-disable @typescript-eslint/no-namespace*/
declare module 'leaflet' {
  export interface FullscreenOptions extends ControlOptions {
    pseudoFullscreen: boolean,
    fullscreenIcon: string|Element,
    exitIcon: string|Element,
    title: {
      false: string;
      true: string;
    }
  }

  namespace control {
    function fullscreen(options: FullscreenOptions): L.Control.Fullscreen;
  }

  namespace Control {
    class Fullscreen extends Control {
      constructor(options?: FullscreenOptions);

      link: HTMLAnchorElement;

      options: FullscreenOptions;

      public updateIcons(iconsChanged?: boolean): void;

      protected _map: L.Map;

      protected _click(e: Event): void;

      protected _toggleTitle(): void;
    }
  }

  export interface Map {
    isFullscreen(): boolean;
    toggleFullscreen(options: FullscreenOptions, control: L.Control.Fullscreen): Promise<void>;
    getContainerRoot(): DocumentOrShadowRoot;
    _setFullscreen(state: boolean): void;
    _disablePseudoFullscreen(container: HTMLElement): void
    _enablePseudoFullscreen(container: HTMLElement): void
    _isPseudoFullscreen: boolean;
  }
}

function getFullscreenElement(root: DocumentOrShadowRoot): Element {
  return (
    root.fullscreenElement ||
    root.mozFullScreenElement ||
    root.webkitFullscreenElement ||
    root.msFullscreenElement
  );
}

function canRequestFullscreen(element: HTMLElement): boolean {
  return !!(
    element.requestFullscreen ||
    element.mozRequestFullScreen ||
    element.webkitRequestFullscreen ||
    element.msRequestFullscreen
  );
}

function requestFullscreen(element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) return element.requestFullscreen();
  else if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
  else if (element.webkitRequestFullscreen) // @ts-expect-error: good old safari
    return element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  else if (element.msRequestFullscreen) return element.msRequestFullscreen();
}

function canExitFullscreen(root: Document): boolean {
  return !!(
    root.exitFullscreen ||
    root.mozCancelFullScreen ||
    root.webkitCancelFullScreen ||
    root.msExitFullscreen
  );
}

function exitFullscreen(root: Document): Promise<void> {
  if (root.exitFullscreen) return root.exitFullscreen();
  else if (root.mozCancelFullScreen) return root.mozCancelFullScreen();
  else if (root.webkitCancelFullScreen) return root.webkitCancelFullScreen();
  else if (root.msExitFullscreen) return root.msExitFullscreen();
}

/**
 * Fullscreen control..
 *
 * ##### Example
 *
 *     <leaflet-fullscreen-control> </leaflet-fullscreen-control>
 *
 * ##### Example
 *
 *     <leaflet-fullscreen-control metric>
 *     </leaflet-fullscreen-control>
 *
 * @element leaflet-fullscreen-control
 * @blurb Fullscreen control.
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 */
@customElement('leaflet-fullscreen-control')
export class LeafletFullscreenControl extends LeafletBase {
  static readonly is = 'leaflet-fullscreen-control';

  static readonly styles = DATA_ELEMENT_STYLES;

  // @ts-expect-error: ambient property. see https://github.com/microsoft/TypeScript/issues/40220
  declare container: L.Map;

  declare control: L.Control.Fullscreen;

  /**
   * The position of the control (one of the map corners).
   * Possible values are 'topleft', 'topright', 'bottomleft' or 'bottomright'
   */
  @property({ type: String }) position: L.ControlPosition = 'topleft';

  @property({ type: Boolean, attribute: 'pseudo-fullscreen' }) pseudoFullscreen = false;

  @property({ type: String, attribute: 'true-text' }) trueText = 'Exit Fullscreen';

  @property({ type: String, attribute: 'false-text' }) falseText = 'View Fullscreen';

  @queryAssignedNodes('exit-icon') exitIcons: NodeListOf<SVGSVGElement>

  @queryAssignedNodes('fullscreen-icon') fullscreenIcons: NodeListOf<SVGSVGElement>

  @query('[name="fullscreen-icon"] svg') defaultExitIcon: SVGSVGElement;

  @query('[name="exit-icon"] svg') defaultFullscreenIcon: SVGSVGElement;

  get isFullscreen(): boolean {
    return this.container?.isFullscreen() ?? false;
  }

  async toggleFullscreen(): Promise<void> {
    return await this.container.toggleFullscreen(this.control.options, this.control);
  }

  containerChanged(): void {
    if (!this.container) return;
    const {
      position,
      pseudoFullscreen,
      trueText,
      falseText,
      fullscreenIcons: [fullscreenIcon = this.defaultFullscreenIcon],
      exitIcons: [exitIcon = this.defaultExitIcon],
    } = this;

    const title = { true: trueText, false: falseText };
    this.control =
      L.control.fullscreen({ position, title, pseudoFullscreen, fullscreenIcon, exitIcon });
    this.control.addTo(this.container);
  }

  disconnectedCallback(): void {
    if (this.container && this.control)
      this.container.removeControl(this.control);
  }

  render(): TemplateResult {
    return html`
      <slot name="fullscreen-icon" @slotchange="${() => this.control.updateIcons(true)}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </svg>
      </slot>
      <slot name="exit-icon" @slotchange="${() => this.control.updateIcons(true)}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
        </svg>
      </slot>
    `;
  }
}

L.Control.Fullscreen = L.Control.extend({
  options: {
    position: 'topleft',
    exitIcon: '',
    fullscreenIcon: '',
    pseudoFullscreen: false,
    title: {
      'false': 'View Fullscreen',
      'true': 'Exit Fullscreen',
    },
  } as L.FullscreenOptions,

  onAdd(this: L.Control.Fullscreen, map: L.Map) {
    const container =
      L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

    this.link =
      L.DomUtil.create(
        'a',
        'leaflet-control-fullscreen-button leaflet-bar-part',
        container
      ) as HTMLAnchorElement;

    this.link.href = '#';
    this.link.innerHTML = /* html */`
      <span class="fullscreen-icon" hidden></span>
      <span class="exit-icon" hidden></span>
    `;

    this._map = map;
    this._map.on('fullscreenchange', this._toggleTitle, this);
    this._toggleTitle();

    this.updateIcons(true);

    L.DomEvent.on(this.link, 'click', this._click, this);

    return container;
  },

  _click(e: Event) {
    L.DomEvent.stopPropagation(e);
    L.DomEvent.preventDefault(e);
    this._map.toggleFullscreen(this.options, this);
  },

  _toggleTitle() {
    this.link.title = this.options.title[`${this._map.isFullscreen()}`];
  },

  updateIcons(iconsChanged: boolean): void {
    const exitContainer = this.link.querySelector('.exit-icon');
    const fullscreenContainer = this.link.querySelector('.fullscreen-icon');

    if (iconsChanged) {
      const { exitIcon, fullscreenIcon } = this.options;
      exitContainer.children[0]?.remove();
      fullscreenContainer.children[0]?.remove();

      if (typeof exitIcon === 'string')
        exitContainer.appendChild(new Text(exitIcon));
      else if (exitIcon instanceof Element)
        exitContainer.appendChild(exitIcon.cloneNode(true));

      if (typeof fullscreenIcon === 'string')
        fullscreenContainer.appendChild(new Text(fullscreenIcon));
      else if (fullscreenIcon instanceof Element)
        fullscreenContainer.appendChild(fullscreenIcon.cloneNode(true));
    }

    const isFullscreen = this._map.isFullscreen();

    exitContainer.hidden = isFullscreen;
    fullscreenContainer.hidden = !isFullscreen;
  },
} as unknown as L.Control.Fullscreen);

L.Map.include({
  isFullscreen(this: L.Map): boolean {
    return (
      this._isPseudoFullscreen ||
      this.getContainer() === getFullscreenElement(this.getContainerRoot())
    );
  },

  getContainerRoot(this: L.Map) {
    const root = this.getContainer()?.getRootNode?.();
    if (root instanceof Document || root instanceof ShadowRoot)
      return root;
    else
      return document;
  },

  async toggleFullscreen(this: L.Map, options: L.FullscreenOptions, control: L.Control.Fullscreen) {
    const container = this.getContainer();
    if (this.isFullscreen()) {
      if (options?.pseudoFullscreen)
        this._disablePseudoFullscreen(container);
      else if (canExitFullscreen(document))
        await exitFullscreen(document);
      else
        this._disablePseudoFullscreen(container);
    } else {
      if (options?.pseudoFullscreen)
        this._enablePseudoFullscreen(container);
      else if (canRequestFullscreen(container))
        await requestFullscreen(container);
      else
        this._enablePseudoFullscreen(container);
    }

    control.updateIcons();
  },

  _enablePseudoFullscreen(this: L.Map, container: HTMLElement) {
    L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
    this._isPseudoFullscreen = true;
    this._setFullscreen(true);
    this.fire('fullscreenchange');
  },

  _disablePseudoFullscreen(this: L.Map, container: HTMLElement) {
    L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
    this._isPseudoFullscreen = false;
    this._setFullscreen(false);
    this.fire('fullscreenchange');
  },

  _setFullscreen(this: L.Map, fullscreen: boolean) {
    const container = this.getContainer();
    if (fullscreen)
      L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
    else
      L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');

    this.invalidateSize();
  },

  _onFullscreenChange(this: L.Map) {
    this._setFullscreen(!this.isFullscreen());
    this.fire('fullscreenchange');
  },
});

L.Map.mergeOptions({
  fullscreenControl: false,
});

/* eslint-disable no-invalid-this */
L.Map.addInitHook(function() {
  if (this.options.fullscreenControl) {
    this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
    this.addControl(this.fullscreenControl);
  }

  let fullscreenchange: string;

  if ('onfullscreenchange' in document)
    fullscreenchange = 'fullscreenchange';
  else if ('onmozfullscreenchange' in document)
    fullscreenchange = 'mozfullscreenchange';
  else if ('onwebkitfullscreenchange' in document)
    fullscreenchange = 'webkitfullscreenchange';
  else if ('onmsfullscreenchange' in document)
    fullscreenchange = 'MSFullscreenChange';


  if (fullscreenchange) {
    const onFullscreenChange = this._onFullscreenChange.bind(this);

    this.whenReady(function() {
      L.DomEvent.on(document as unknown as HTMLElement, fullscreenchange, onFullscreenChange);
    });

    this.on('unload', function() {
      L.DomEvent.off(document as unknown as HTMLElement, fullscreenchange, onFullscreenChange);
    });
  }
});
/* eslint-enable no-invalid-this */

L.control.fullscreen = function(options) {
  return new L.Control.Fullscreen(options);
};
