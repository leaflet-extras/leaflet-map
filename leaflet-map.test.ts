import { aTimeout, expect, fixture } from '@open-wc/testing';
import { LeafletBase } from './base';
import { LeafletMap } from './leaflet-map';

import './leaflet-map';
import './leaflet-point';
import './leaflet-polyline';
import './leaflet-circle';
import './leaflet-polygon';

// import { Icon } from 'leaflet';

// const initialImagePath = Icon.Default.imagePath;
// Icon.Default.imagePath = '/node_modules/leaflet/dist/images';

describe('leaflet-map', function() {
  let element: LeafletMap;

  async function setupElement() {
    element = await fixture<LeafletMap>('<leaflet-map></leaflet-map>');
  }

  function teardownElement() {
    element?.remove();
    element = undefined;
  }
  afterEach(teardownElement);

  describe('simply instantiating', function() {
    beforeEach(setupElement);
    it('is an instance of LeafletBase', function() {
      expect(element).to.be.an.instanceOf(LeafletBase);
    });

    it('guesses leaflet image path', async function() {
      expect(element.imagePath).to.equal('/node_modules/leaflet/dist/images/');
    });
  });

  describe('with fit-to-markers set', function() {
    beforeEach(async function setupElement() {
      element = await fixture<LeafletMap>('<leaflet-map fit-to-markers></leaflet-map>');
    });
    describe('appending shape elements', function() {
      beforeEach(async function() {
        element.innerHTML = /* html */`
          <leaflet-polygon color="#f00" fill-opacity="1" stroke>
            <leaflet-point longitude="77.5700" latitude="12.9700"></leaflet-point>
            <leaflet-point longitude="77.6034" latitude="13.0001"></leaflet-point>
            <leaflet-point longitude="77.6006" latitude="12.9547"></leaflet-point>
            Hi, I am a <b>polygon</b>.
          </leaflet-polygon>

          <leaflet-circle
              longitude="77.58"
              latitude="12.9300"
              radius="2000"
              color="#0a0"
              fill-color="#aa0"
              fill-opacity="0.5"
              fill="true">
            Hi, I am a <b>circle</b>.
          </leaflet-circle>

          <leaflet-polyline
              fill-opacity="0.5"
              stroke>
            <leaflet-point longitude="77.6400" latitude="12.9100"></leaflet-point>
            <leaflet-point longitude="77.6229" latitude="12.9259"></leaflet-point>
            <leaflet-point longitude="77.6499" latitude="12.9699"></leaflet-point>
            <leaflet-point longitude="77.6119" latitude="12.9738"></leaflet-point>
          </leaflet-polyline>

          <leaflet-circle
              longitude="77.64"
              latitude="12.9300"
              radius="500"
              color="#077"
              fill
              fill-opacity="0.5"
          ></leaflet-circle>
        `;
      });

      beforeEach(() => aTimeout(200));

      it('renders shapes', function() {
        expect(element.shadowRoot.querySelectorAll('.leaflet-interactive').length).to.equal(4);
      });
    });
  });
});
