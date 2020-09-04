import { expect, fixture, html } from '@open-wc/testing';
import { LeafletBase } from './base';
import { LeafletMap } from './leaflet-map';
import './leaflet-map';

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
});
