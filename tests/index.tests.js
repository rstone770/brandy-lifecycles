import { expect } from 'chai';
import * as brandyLifecycles from '../src';

describe('brandyLifecycles', () => {
  it('exports configureLifecycle, lifecycles, types.', () => {
    expect(brandyLifecycles.configureLifecycles).to.be.a('function');
    expect(brandyLifecycles.lifecycles).to.be.a('function');
    expect(brandyLifecycles.types).to.be.a('object');
  });

  describe('types', () => {
    const types = brandyLifecycles.types;

    it('contains SINGLETON and TRANSIENT properties.', () => {
      expect(types).to.have.property('SINGLETON', 'singleton');
      expect(types).to.have.property('TRANSIENT', 'transient');
    });
  });
});
