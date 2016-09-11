import { expect } from 'chai';
import createContainer from './helpers/createContainer';
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

  it('uses defaultLifecycle=transient if one is not provided', () => {
    const container = configureLifecycles(types.TRANSIENT)(createContainer)();

    container.bind('bind', () => {});
    expect(container.instance('bind')).to.not.equal(container.instance('bind'));

    container.factory('factory', () => {});
    expect(container.instance('factory')).to.not.equal(container.instance('factory'));
  });

  it('uses defaultLifecycle=singelton if one is not provided', () => {
    const container = configureLifecycles(types.SINGLETON)(createContainer)();

    container.bind('bind', () => {});
    expect(container.instance('bind')).to.equal(container.instance('bind'));

    container.factory('factory', () => {});
    expect(container.instance('factory')).to.equal(container.instance('factory'));
  });
});
