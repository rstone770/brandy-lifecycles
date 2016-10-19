import { expect } from 'chai';
import { createContainer } from '@rstone770/brandy';
import createValue from './helpers/createValue';
import { configureLifecycles, types } from '../src';

describe('configureLifecycles', () => {
  it('throws if defaultLifecycle is not a valid lifecycle value.', () => {
    expect(
      () => configureLifecycles('boop')
    ).to.throw();

    expect(
      () => configureLifecycles()
    ).to.throw();

    expect(
      () => configureLifecycles(types.SINGLETON)
    ).to.not.throw();

    expect(
      () => configureLifecycles(types.TRANSIENT)
    ).to.not.throw();

    expect(
      () => configureLifecycles('tranSieNt')
    ).to.not.throw();
  });

  it('returns an enhancer', () => {
    const container = configureLifecycles(types.SINGLETON)(createContainer)();

    expect(container.bind).to.be.a('function');
    expect(container.factory).to.be.a('function');
    expect(container.instance).to.be.a('function');
  });

  it('uses defaultLifecycle=TRANSIENT if one is not provided', () => {
    const container = configureLifecycles(types.TRANSIENT)(createContainer)();

    container.bind('bind', () => createValue());
    expect(container.instance('bind')).to.not.equal(container.instance('bind'));

    container.factory('factory', () => createValue());
    expect(container.instance('factory')).to.not.equal(container.instance('factory'));
  });

  it('uses defaultLifecycle=SINGLETON if one is not provided', () => {
    const container = configureLifecycles(types.SINGLETON)(createContainer)();

    container.bind('bind', () => createValue());
    expect(container.instance('bind')).to.equal(container.instance('bind'));

    container.factory('factory', () => createValue());
    expect(container.instance('factory')).to.equal(container.instance('factory'));
  });
});
