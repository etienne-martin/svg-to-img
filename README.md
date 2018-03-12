# svg-to-img

A node.js library to convert SVGs to images built with [Puppeteer](https://github.com/GoogleChrome/puppeteer).

## Getting Started

### Installation

To use svg-to-img in your project, run:

```bash
npm i --save svg-to-img
```

Note: When you install svg-to-img, it downloads a recent version of Chromium (~170Mb Mac, ~282Mb Linux, ~280Mb Win) that is guaranteed to work with the library.

### Usage

Caution: svg-to-img uses async/await which is only supported in Node v7.6.0 or greater.

**Example** - converting a svg to png and saving the image as *example.png*:

Save file as **example.js**

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    path: "./example.png"
  });
})();
```

Execute script on the command line

```
node example.js
```

**Example** - resizing a svg proportionally and converting it to png:

Save file as **resize.js**

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  const image = await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    width: 300
  });
  
  console.log(image);
})();
```

Execute script on the command line

```
node resize.js
```

**Example** - converting a svg to base64-encoded png:

Save file as **base64.js**

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  const image = await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    encoding: "base64"
  });
  
  console.log(image);
})();
```

Execute script on the command line

```
node base64.js
```