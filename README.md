# `@yuigoto/infiniship-js`

> Infiniship is a pixelated spaceship sprite generator, inspired by David Bollinger's "Pixel Spaceships".

The difference between the original **[Infiniship](https://github.com/yuigoto/infiniship)** I wrote years ago, and this version is that the base pixel grid and some code has been changed, so it won't generate eventual copyrighted images Dave's script might've generated.

So feel free to use it without worries! :wink:

---

## How to

Install this library with:

```
npm install @yuigoto/infiniship-js
```

or

```
yarn add @yuigoto/infiniship-js
```

Then just import the main infiniship class and use it:

```js
import Infiniship from "@yuigoto/infiniship-js";

const generator = new Infiniship();

// You can either generate an image with the sprite
document.body.append(generator.generateShipImage());

// Or just get the canvas `ImageData` object:
const spriteData = generator.generateShipImageData();
```

---

## Docs

### `new Infiniship(monochrome?: boolean)`

> Creates a generator instance.

#### Parameters

|  Parameter   |   Type    |                                    Description                                    |
| :----------: | :-------: | :-------------------------------------------------------------------------------: |
| `monochrome` | `boolean` | If the generator should create monochrome, 1-bit, images instead of colored ones. |

#### Returns

`Infiniship` instance.

### `generateShipImageData(): ImageData`

> Generates an `ImageData` object, filled with the sprite data.

#### Returns

`ImageData` object, ready to be drawn to a `CanvasRenderingContext2D`.

### `generateShipImage(): HTMLImageElement`

> Generates a `HTMLImageElement` containing a single, 16x16, sprite data as a Base64 encoded source.

#### Returns

`HTMLImageElement` object, ready to be appended to the document's `body`.

### `generateShipSpriteSheet(x: number, y: number): HTMLImageElement`

> Generates a `HTMLImageElement` containing a spritesheet with the desired number of ships, as a Base64 encoded source.

#### Parameters

| Parameter |   Type   |              Description              |
| :-------: | :------: | :-----------------------------------: |
|    `x`    | `number` | Number of ships to draw horizontally. |
|    `y`    | `number` |  Number of ships to draw vertically.  |

#### Returns

`HTMLImageElement` object, ready to be appended to the document's `body`.

---

## Author

See `AUTHORS.md` for more information.

---

## License

This project is licensed under the `MIT License`. See `LICENSE.md` for details.

---

_&copy;2022 YUITI_
