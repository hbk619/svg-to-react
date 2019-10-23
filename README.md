# SVG to Components

WORK IN PROGRESS NOT ACTUALLY FULLY IMPLEMENTED

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

Inspired by https://github.com/pedronauck/reicons#readme re-written with async/await, less dependencies, tests 
(well there will be better tests soon).