import { expect } from 'chai';
import createContainer from './helpers/createContainer';
import { lifecycles, types } from '../src';

describe('lifecycles', () => {
  it('throws if createContainer is not passed in.', () => {
    expect(
      () => lifecycles()
    ).to.throw();

    expect(
      () => lifecycles(createContainer)
    ).to.not.throw();
  });

  ['factory', 'bind'].forEach((method) => {
    describe(method, () => {
      it(`throws if an invalid lifecycle is passed into ${method}.`, () => {
        const container = lifecycles(createContainer)();

        expect(
          () => container[method]('name', () => {}, { lifecycle: 'boop' })
        ).to.throw();

        expect(
          () => container[method]('name', () => {})
        ).to.not.throw();

        expect(
          () => container[method]('name', () => {}, { lifecycle: 'singleTON' })
        ).to.not.throw();

        expect(
          () => container[method]('name', () => {}, { lifecycle: types.SINGLETON })
        ).to.not.throw();

        expect(
          () => container[method]('name', () => {}, { lifecycle: types.TRANSIENT })
        ).to.not.throw();
      });

      it('returns container.', () => {
        const container = lifecycles(createContainer)();

        expect(
          container[method]('name', () => {})
        ).to.equal(container);
      });
    });
  });

  describe('instance', () => {
    it('returns the same instance if registered with SINGLETON.', () => {
      const container = lifecycles(createContainer)();

      container.bind('bind', () => {}, { lifecycle: types.SINGLETON });
      expect(container.instance('bind')).to.equal(container.instance('bind'));

      container.factory('factory', () => {}, { lifecycle: types.SINGLETON });
      expect(container.instance('factory')).to.equal(container.instance('factory'));
    });

    it('returns new instances if registered with TRANSIENT.', () => {
      const container = lifecycles(createContainer)();

      container.bind('bind', () => {}, { lifecycle: types.TRANSIENT });
      expect(container.instance('bind')).to.not.equal(container.instance('bind'));

      container.factory('factory', () => {}, { lifecycle: types.TRANSIENT });
      expect(container.instance('factory')).to.not.equal(container.instance('factory'));
    });

    it('should use SINGLETON lifecycle by default.', () => {
      const container = lifecycles(createContainer)();

      container.bind('bind', () => {});
      expect(container.instance('bind')).to.equal(container.instance('bind'));

      container.factory('factory', () => {});
      expect(container.instance('factory')).to.equal(container.instance('factory'));
    });
  });
});
