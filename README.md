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

```
const componentiser = require('svg-to-components');

compnentiser.create({
src: 'my/src/dir',
output: 'my/out/dir'
```

## From command line

TODO