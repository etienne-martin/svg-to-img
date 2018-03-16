# svg-to-img (test)

#### A node.js library to convert SVGs to images built with [Puppeteer](https://github.com/GoogleChrome/puppeteer).

[![CircleCI build](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg)](https://circleci.com/gh/etienne-martin/svg-to-img)
[![node version](https://img.shields.io/node/v/svg-to-img.svg)](https://www.npmjs.com/package/svg-to-img)
[![npm version](https://img.shields.io/npm/v/svg-to-img.svg)](https://www.npmjs.com/package/svg-to-img)
[![npm weekly downloads](https://img.shields.io/npm/dw/svg-to-img.svg)](https://www.npmjs.com/package/svg-to-img)

## Getting Started

### Installation

To use svg-to-img in your project, run:

```bash
npm i --save svg-to-img
```

Note: When you install svg-to-img, it downloads a recent version of Chromium (~170Mb Mac, ~282Mb Linux, ~280Mb Win) that is guaranteed to work with the library.

#### Debian

If you're planning on running svg-to-img on Debian, you will need to manually install the following dependencies:

```bash
#!/bin/bash

apt-get update
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
  ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

### Usage

Caution: svg-to-img uses async/await which is only supported in Node v7.6.0 or greater.

**Example** - converting a `svg` to `png`:

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  const image = await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").toPng();
  
  console.log(image);
})();
```

**Example** - converting a `svg` to `png` and saving the image as *example.png*:

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    path: "./example.png"
  });
})();
```

**Example** - resizing a `svg` proportionally and converting it to `png`:

```javascript
const svgToImg = require("svg-to-img");

(async () => {
  const image = await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").to({
    width: 300
  });
  
  console.log(image);
})();
```

**Example** - converting a `svg` to base64-encoded png:

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
  - `width` <[number]> width of the output image. Defaults to the natural width of the SVG.
  - `height` <[number]> height of the output image. Defaults to the natural height of the SVG.
  - `clip` <[Object]> An object which specifies clipping region of the output image. Should have the following fields:
    - `x` <[number]> x-coordinate of top-left corner of clip area
    - `y` <[number]> y-coordinate of top-left corner of clip area
    - `width` <[number]> width of clipping area
    - `height` <[number]> height of clipping area
  - `background` <[string]> background color applied to the output image, must be a valid [CSS color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
  - `encoding` <[string]> Specify encoding, can be either `base64`, `utf8`, `binary` or `hex`. Returns a `Buffer` is this option is omitted.
- returns: <[Promise]<Buffer|String>> Promise which resolves to the output image.

### svg.toPng([options])
- `options` <[Object]> Optional options object that can have the same properties as the `to` method except for the type property.
- returns: <[Promise]<Buffer|String>> Promise which resolves to the `png` image.

This method is simply a shorthand for the `to` method.

### svg.toJpeg([options])
- `options` <[Object]> Optional options object that can have the same properties as the `to` method except for the type property.
- returns: <[Promise]<Buffer|String>> Promise which resolves to the `jpeg` image.

This method is simply a shorthand for the `to` method.

## Built with

* [node.js](https://nodejs.org/en/) - Cross-platform JavaScript run-time environment for executing JavaScript code server-side. 
* [Puppeteer](https://github.com/GoogleChrome/puppeteer/) - Headless Chrome Node API.
* [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
* [Jest](https://facebook.github.io/jest/) - Delightful JavaScript Testing.

## Contributing

When contributing to this project, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Update the [README.md](https://github.com/etienne-martin/svg-to-img/blob/master/README.md) with details of changes to the library.

Execute `npm run test` on the command line to test your changes.

Build the project and update the [tests](https://github.com/etienne-martin/svg-to-img/tree/master/src/tests) before submitting your pull request.

## Authors

* **Etienne Martin** - *Initial work* - [etiennemartin.ca](http://etiennemartin.ca/)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/etienne-martin/svg-to-img/blob/master/LICENSE) file for details.
