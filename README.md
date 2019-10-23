# SVG to Components

Turn your svg files into React components, allows for:


```jsx
import { Star } from './components/icons';

const App = () => (
  <div>
    <Star />
  </div>
);
```

or


```jsx
import * as Icons from './components/icons';

const App = () => (
  <div>
    <Icons.Star />
  </div>
);
```

To create icons:

## From node

```javascript 1.8
const componentiser = require('svg-to-components');

componentiser.create({
    src: 'my/src/dir',
    output: 'my/out/dir'
});
```

## From command line

```shell script
svg-to-react --src images --output output/dir
```

## More info

```shell script
svg-to-react --help
```

Inspired by https://github.com/pedronauck/reicons#readme re-written with async/await, less dependencies, and tests

## Developing

```shell script
yarn install
yarn test
```