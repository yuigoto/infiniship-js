/**
 * @yuigoto/infiniship-js
 * ----------------------------------------------------------------------
 * Infiniship is a pixelated spaceship sprite generator, inspired by David
 * Bollinger's "Pixel Spaceships".
 *
 * The base pixel grid has been changed, though, so it won't generate eventual
 * copyrighted images Dave's script might've generated.
 *
 * The code is based on a the remake of Dave's script I did at
 * "https://github.com/yuigoto/infiniship".
 *
 * Feel free to use it without worries!
 *
 * @author    Fabio Y. Goto <lab@yuiti.dev>
 * @since     1.0.0
 * @license   MIT
 */

/**
 * Defines cell types do be drawn.
 */
enum CellType {
  EMPTY,
  SOLID,
  BODY,
  COCKPIT,
  JETS,
}

/**
 * Base class interface.
 */
interface IInfiniship {
  /**
   * Canvas instance.
   */
  canvas: HTMLCanvasElement;

  /**
   * Canvas Context2D used to draw the sprite.
   */
  canvasContext: CanvasRenderingContext2D;

  /**
   * If using monochrome mode.
   */
  monochrome?: boolean;

  /**
   * Pseudo-random seed used to define colors.
   */
  seedForColor: number;

  /**
   * Pseudo-random seed used to define the shape.
   */
  seedForShape: number;
}

/**
 * RGBA color object, values from 0 ~ 255.
 */
type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

/**
 * Sprite generator class.
 */
export default class Infiniship implements IInfiniship {
  /**
   * Defines which cells will be always solid.
   */
  static SOLID_CELLS: Array<[number, number]> = [
    [5, 2],
    [5, 3],
    [5, 4],
    [5, 8],
  ];

  /**
   * Lists which cells might, or not, be used in the ship's body.
   */
  static BODY_CELLS: Array<[number, number]> = [
    [4, 1],
    [5, 1],
    [4, 2],
    [3, 3],
    [4, 3],
    [3, 4],
    [4, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [1, 6],
    [2, 6],
    [3, 6],
    [1, 7],
    [2, 7],
    [3, 7],
    [1, 8],
    [2, 8],
    [3, 8],
    [1, 9],
    [2, 9],
    [3, 9],
    [4, 9],
    [1, 10],
    [2, 10],
    [5, 10],
  ];

  /**
   * Lists which cells might, or not, be used in the ship's cockpit.
   */
  static COCKPIT_CELLS: Array<[number, number]> = [
    [4, 6],
    [5, 6],
    [4, 7],
    [5, 7],
    [4, 8],
    [5, 5],
    [4, 10],
  ];

  /**
   * Lists which cells for the ship's jets/propellers.
   *
   * Always drawn.
   */
  static JETS_CELLS: Array<[number, number]> = [
    [5, 9],
    [5, 10],
  ];

  /**
   * Color brightness levels used when defining colors.
   */
  static SPRITE_BRIGHTNESS: Array<number> = [
    40, 70, 100, 130, 160, 190, 220, 220, 190, 160, 130, 100, 70, 40,
  ];

  /**
   * Color saturation levels used when defining colors.
   */
  static SPRITE_SATURATION: Array<number> = [
    40, 60, 80, 100, 80, 60, 80, 100, 120, 100, 80, 60,
  ];

  /**
   * Base sprite draw area width.
   */
  static SPRITE_WIDTH: number = 12;

  /**
   * Base sprite draw area height.
   */
  static SPRITE_HEIGHT: number = 12;

  /**
   * Black color.
   */
  static COLOR_BLACK: RGBAColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 255,
  };

  /**
   * Transparent white color.
   */
  static COLOR_TRANSPARENT: RGBAColor = {
    r: 255,
    g: 255,
    b: 255,
    a: 0,
  };

  /**
   * Transparent black color.
   */
  static COLOR_TRANSPARENT_BLACK: RGBAColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  /**
   * White color.
   */
  static COLOR_WHITE: RGBAColor = {
    r: 255,
    g: 255,
    b: 255,
    a: 255,
  };

  canvas: HTMLCanvasElement;

  canvasContext: CanvasRenderingContext2D;

  monochrome?: boolean;

  seedForColor!: number;

  seedForShape!: number;

  /**
   * Constructor.
   *
   * @param monochrome
   */
  constructor(monochrome?: boolean) {
    this.canvas = document.createElement("canvas");

    this.canvasContext = this.canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.monochrome = true === monochrome;
  }

  /**
   * Generates an `ImageData` object, filled with the sprite data, ready to
   * be drawn to a `CanvasRenderingContext2D`.
   *
   * @returns
   */
  public generateShipImageData(): ImageData {
    this.seedForColor = this.generateSeed();

    this.seedForShape = this.generateSeed();

    const width: number = Infiniship.SPRITE_WIDTH;

    const height: number = Infiniship.SPRITE_HEIGHT;

    const image: ImageData = this.canvasContext.createImageData(width, height);

    const shipData: Array<CellType> = [];

    // Step 0: Draw all pixels as transparent
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        this.drawPixelAt(image, x, y, Infiniship.COLOR_TRANSPARENT);
      }
    }

    // Step 1: Initialize all cell data as empty
    for (let i = 0; i < width * height; ++i) {
      shipData[i] = CellType.EMPTY;
    }

    // Step 2: Set always solid cells
    for (let i = 0; i < Infiniship.SOLID_CELLS.length; ++i) {
      const cellIndex = this.getCellIndex(...Infiniship.SOLID_CELLS[i]);
      shipData[cellIndex] = CellType.SOLID;
    }

    // Step 3: Set body cells
    for (let i = 0; i < Infiniship.BODY_CELLS.length; ++i) {
      const cellIndex = this.getCellIndex(...Infiniship.BODY_CELLS[i]);
      shipData[cellIndex] =
        this.seedForShape & (1 << i) ? CellType.BODY : CellType.EMPTY;
    }

    // Step 4: Set cockpit cells
    for (let i = 0; i < Infiniship.COCKPIT_CELLS.length; ++i) {
      const cellIndex = this.getCellIndex(...Infiniship.COCKPIT_CELLS[i]);
      shipData[cellIndex] =
        this.seedForShape & (1 << (Infiniship.COCKPIT_CELLS.length + i))
          ? CellType.SOLID
          : CellType.COCKPIT;
    }

    // Step 5: Set jets cells
    for (let i = 0; i < Infiniship.JETS_CELLS.length; ++i) {
      const cellIndex = this.getCellIndex(...Infiniship.JETS_CELLS[i]);
      shipData[cellIndex] = CellType.JETS;
    }

    // Step 6: Define borders
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width / 2; ++x) {
        const currentCellIndex: number = this.getCellIndex(x, y);

        if (
          shipData[currentCellIndex] !== CellType.EMPTY &&
          shipData[currentCellIndex] !== CellType.SOLID
        ) {
          this.markBorderTop(shipData, x, y);
          this.markBorderRight(shipData, x, y);
          this.markBorderBottom(shipData, x, y);
          this.markBorderLeft(shipData, x, y);
        }
      }
    }

    // Drawing pixels
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width / 2; ++x) {
        let currentColor: RGBAColor;
        let currentCell: number = this.getCellIndex(x, y);

        switch (shipData[currentCell]) {
          case CellType.SOLID:
            currentColor = Infiniship.COLOR_BLACK;
            break;
          case CellType.BODY:
            currentColor = this.monochrome
              ? Infiniship.COLOR_WHITE
              : this.getBodyColor(x, y);
            break;
          case CellType.COCKPIT:
            currentColor = this.monochrome
              ? Infiniship.COLOR_WHITE
              : this.getCockpitColor(x, y);
            break;
          case CellType.JETS:
            currentColor = this.monochrome
              ? Infiniship.COLOR_BLACK
              : this.getJetsColor(x);
            break;
          case CellType.EMPTY:
          default:
            currentColor = Infiniship.COLOR_TRANSPARENT_BLACK;
            break;
        }

        this.drawPixelAt(image, x, y, currentColor);
        // Mirrored pixel
        this.drawPixelAt(image, width - x - 1, y, currentColor);
      }
    }

    return image;
  }

  /**
   * Generates a `HTMLImageElement` containing a single, 16x16, sprite data as
   * a Base64 encoded source.
   *
   * @returns
   */
  public generateShipImage(): HTMLImageElement {
    // Make sprite 16x16
    this.canvas.width = Infiniship.SPRITE_WIDTH + 4;
    this.canvas.height = Infiniship.SPRITE_HEIGHT + 4;

    const imageData = this.generateShipImageData();
    this.canvasContext.putImageData(imageData, 2, 2);

    const image: HTMLImageElement = new Image();
    image.src = this.canvas.toDataURL();

    return image;
  }

  /**
   * Generates a `HTMLImageElement` containing a spritesheet with the desired
   * number of ships, as a Base64 encoded source.
   *
   * @param shipsX
   *     Number of ships to draw horizontally
   * @param shipsY
   *     Number of ships to draw vertically
   * @returns
   */
  public generateShipSpriteSheet(
    shipsX: number = 8,
    shipsY: number = 8
  ): HTMLImageElement {
    this.canvas.width = (Infiniship.SPRITE_WIDTH + 4) * shipsX;
    this.canvas.height = (Infiniship.SPRITE_HEIGHT + 4) * shipsY;

    for (let y = 0; y < this.canvas.height - 12; y += 16) {
      for (let x = 0; x < this.canvas.width - 12; x += 16) {
        const imageData = this.generateShipImageData();
        this.canvasContext.putImageData(imageData, x + 2, y + 2);
      }
    }

    const image: HTMLImageElement = new Image();
    image.src = this.canvas.toDataURL();

    return image;
  }

  /**
   * Converts a color from the HSV color space to an RGBA color.
   *
   * @param h
   *     Hue to be used
   * @param s
   *     Saturation level
   * @param v
   *     Saturation brightness level
   * @returns
   */
  protected convertHsvToRgb(h: number, s: number, v: number): RGBAColor {
    let r: number = 0,
      g: number = 0,
      b: number = 0,
      i: number,
      f: number,
      p: number,
      q: number,
      t: number;

    if (s === 0) {
      return {
        r: Math.floor(v * 255),
        g: Math.floor(v * 255),
        b: Math.floor(v * 255),
        a: 255,
      };
    }

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return {
      r: Math.floor(r * 255),
      g: Math.floor(g * 255),
      b: Math.floor(b * 255),
      a: 255,
    };
  }

  /**
   * Draws a single pixel into an `ImageData` object.
   *
   * @param image
   *     Image data object
   * @param x
   *     Pixel X position
   * @param y
   *     Pixel Y position
   * @param color
   *     Color to use
   */
  protected drawPixelAt(
    image: ImageData,
    x: number,
    y: number,
    color: RGBAColor
  ) {
    const imagePixelIndex: number = (y * image.width + x) * 4;

    image.data[imagePixelIndex] = color.r;
    image.data[imagePixelIndex + 1] = color.g;
    image.data[imagePixelIndex + 2] = color.b;
    image.data[imagePixelIndex + 3] = color.a;
  }

  /**
   * Generates a pseudo-random seed, used to define color and shape.
   *
   * @returns
   */
  protected generateSeed(): number {
    return Math.floor(Math.random() * 4 * 1024 ** 3);
  }

  /**
   * Returns a linear index for the current cell, as if it belonged to a
   * 1D array.
   *
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   * @returns
   */
  protected getCellIndex(x: number, y: number): number {
    return y * Infiniship.SPRITE_WIDTH + x;
  }

  /**
   * Returns the color for a pixel inside the sprite's body.
   *
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   * @returns
   */
  protected getBodyColor(x: number, y: number): RGBAColor {
    const saturation: number = Infiniship.SPRITE_SATURATION[y] / 255;
    const brightness: number = Infiniship.SPRITE_BRIGHTNESS[x] / 255;
    let hue: number;

    if (y < 6) {
      hue = (this.seedForColor >> 8) & 0xff;
    } else if (y < 9) {
      hue = (this.seedForColor >> 16) & 0xff;
    } else {
      hue = (this.seedForColor >> 24) & 0xff;
    }

    return this.convertHsvToRgb((360 * hue) / 256, saturation, brightness);
  }

  /**
   * Returns the color for a pixel inside the sprite's cockpit.
   *
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   * @returns
   */
  protected getCockpitColor(x: number, y: number): RGBAColor {
    const saturation = Infiniship.SPRITE_SATURATION[y] / 255;
    const brightness = (Infiniship.SPRITE_BRIGHTNESS[x] + 40) / 255;
    const hue = this.seedForColor & 0xff;
    return this.convertHsvToRgb((360 * hue) / 256, saturation, brightness);
  }

  /**
   * Returns the color for a pixel inside the sprite's jets/propellers.
   *
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   * @returns
   */
  protected getJetsColor(x: number): RGBAColor {
    const saturation = 10 / 255;
    const brightness = (Infiniship.SPRITE_BRIGHTNESS[x] - 40) / 255;
    const hue = this.seedForColor & 0xff;
    return this.convertHsvToRgb((360 * hue) / 256, saturation, brightness);
  }

  /**
   * Checks if the cell over the current one is an empty one, then marks it
   * as a solid-type.
   *
   * @param shipData
   *     Sprite cell type data array
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   */
  protected markBorderTop(shipData: Array<CellType>, x: number, y: number) {
    const currentIndex = this.getCellIndex(x, y - 1);

    if (y > 0 && shipData[currentIndex] === CellType.EMPTY) {
      shipData[currentIndex] = CellType.SOLID;
    }
  }

  /**
   * Checks if the cell at right of the current one is an empty one, then marks
   * it as a solid-type.
   *
   * @param shipData
   *     Sprite cell type data array
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   */
  protected markBorderRight(shipData: Array<CellType>, x: number, y: number) {
    const currentIndex = this.getCellIndex(x + 1, y);

    if (
      x < Infiniship.SPRITE_WIDTH / 2 - 1 &&
      shipData[currentIndex] === CellType.EMPTY
    ) {
      shipData[currentIndex] = CellType.SOLID;
    }
  }

  /**
   * Checks if the cell below the current one is an empty one, then marks it
   * as a solid-type.
   *
   * @param shipData
   *     Sprite cell type data array
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   */
  protected markBorderBottom(shipData: Array<CellType>, x: number, y: number) {
    const currentIndex = this.getCellIndex(x, y + 1);

    if (
      y < Infiniship.SPRITE_HEIGHT &&
      shipData[currentIndex] === CellType.EMPTY
    ) {
      shipData[currentIndex] = CellType.SOLID;
    }
  }

  /**
   * Checks if the cell at left of the current one is an empty one, then marks
   * it as a solid-type.
   *
   * @param shipData
   *     Sprite cell type data array
   * @param x
   *     Cell X position
   * @param y
   *     Cell Y position
   */
  protected markBorderLeft(shipData: Array<CellType>, x: number, y: number) {
    const currentIndex = this.getCellIndex(x - 1, y);

    if (x > 0 && shipData[currentIndex] === CellType.EMPTY) {
      shipData[currentIndex] = CellType.SOLID;
    }
  }
}
