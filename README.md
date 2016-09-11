Brandy Lifecycles
=================

Add life cycle support to brandy.

[![Build Status](https://travis-ci.org/rstone770/brandy-lifecycles.svg?branch=master)](https://travis-ci.org/rstone770/brandy-lifecycles)
[![npm (scoped)](https://img.shields.io/npm/v/@rstone770/brandy-lifecycles.svg?maxAge=2592000)](https://www.npmjs.com/package/@rstone770/brandy-lifecycles)

```
npm install @rstone770/brandy-lifecycles
```

__By default, if a `lifecycle` is not explicitly defined, all registrations are assumed as `SINGLETON` which is different from vanilla brandy.__

```js
import { createContainer } from '@rstone770/brandy'
import { lifecycles, types } from '@rstone770/brandy-lifecycles'

const container = createContainer(lifecycles);

const factory = () => Object.create(null);

container.factory('default', factory);
container.factory('transient', factory, { lifecycle: types.TRANSIENT });
container.factory('singleton', factory, { lifecycle: types.SINGELTON });

container.instance('default') === container.instance('default'); // true
container.instance('transient') !== container.instance('transient'); // true
container.instance('singleton') === container.instance('singleton'); // true
```

## API

### lifecycles()

Enhances the container to allow lifecycle control. The enhancer looks at `options.lifecycle` passed in as the third argument to `bind` and `factory` to determine the lifecycle.

```js
import { createContainer } from '@rstone770/brandy'
import { lifecycles, types } from '@rstone770/brandy-lifecycles'

const container = createContainer(lifecycles);

class SomeClass {}

container.factory('transient', () => Object.create(null), { lifecycle: 'transient' });
container.bind('singleton', SomeClass, { lifecycle: types.SINGELTON });

container.instance('transient') !== container.factory('transient') // true
container.instance('singleton') === container.instance('singleton'); // true
```

By default, if a lifecycle is not passed in, SINGLETON is used. Lifecycles can be from the `types` enum or a case insensitive string represting the lifecycle.

### configureLifecycle(defaultLifecycle)

Creates an enhancer that is configured to use a specific lifecycle, if one is not defined.

```js

import { createContainer } from '@rstone770/brandy'
import { configureLifecycle, types } from '@rstone770/brandy-lifecycles'

const container = createContainer(configureLifecycle(types.Transient));
```

### types

Lifecycle values supported by this enhancer when registering dependencies and setting the `defaultLifecycle` when using `configureLifecycle`. Case insensitive string literals can be used instead.

## License

MIT

