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

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    path: "./example.png"
  });
})();
```

**Example** - resizing a svg proportionally and converting it to png:

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  const image = await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    width: 300
  });
  
  console.log(image);
})();
```

**Example** - converting a svg to base64-encoded png:

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  const image = await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    encoding: "base64"
  });
  
  console.log(image);
})();
```

## API Documentation

### svgToImg.from(svg)
- `svg` <Buffer|string>  SVG markup to be converted.
- returns: <[Svg]> a new Svg object.

The method returns a svg instance based on the given argument.

### svg.to([options])
- `options` <[Object]> Options object which might have the following properties:
  - `path` <[string]> The file path to save the image to. The image type will be inferred from file extension. If `path` is a relative path, then it is resolved relative to [current working directory](https://nodejs.org/api/process.html#process_process_cwd). If no path is provided, the image won't be saved to the disk.
  - `type` <[string]> Specify image type, can be either `jpeg` or `png`. Defaults to `png`.
  - `quality` <[number]> The quality of the image, between 0-100. Defaults to `100`. Not applicable to `png` images.
  - `clip` <[Object]> An object which specifies clipping region of the page. Should have the following fields:
    - `x` <[number]> x-coordinate of top-left corner of clip area
    - `y` <[number]> y-coordinate of top-left corner of clip area
    - `width` <[number]> width of clipping area
    - `height` <[number]> height of clipping area
  - `width` <[number]> width of the output image. Defaults to the natural width of the SVG.
  - `height` <[number]> height of the output image. Defaults to the natural height of the SVG.
  - `background` <[string]> background color applied to the output image. Must be a valid [CSS color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
  - `encoding` <[string]> Specify encoding, can be either `base64`, `utf8`, `binary` or `hex`.
- returns: <[Promise]<Buffer|String>> Promise which resolves to the output image.