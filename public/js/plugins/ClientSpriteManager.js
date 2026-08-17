class ClientSpriteManager {
  constructor() {
    this.appearanceData = new Map();
    this.imageCache = new Map();
  }

  async loadAppearanceFolder(folder) {
    const indexUrl = `/data/appearance/${folder}/0index.json`;

    const indexResponse = await fetch(indexUrl);
    const indexText = await indexResponse.text();

    let names;

    try {
      names = JSON.parse(indexText);
    } catch (e) {
      console.error("BAD INDEX JSON:", indexUrl);
      console.error(indexText);
      throw e;
    }

    for (const name of names) {
      const url = `/data/appearance/${folder}/${name}.json`;

      const response = await fetch(url);
      const text = await response.text();

      try {
        const data = JSON.parse(text);
        this.appearanceData.set(name, data);
      } catch (e) {
        console.error("BAD JSON FILE:", url);
        console.error(text);
        throw e;
      }
    }
  }

  async loadAppearanceData() {
    const folders = [
      "1skin",
      "2eyes",
      "3clothing",
      "4hair",
      "5armor",
      "6accessory",
      "7weapon",
    ];

    for (const folder of folders) {
      try {
        await this.loadAppearanceFolder(folder);
      } catch (err) {
        console.error("FAILED FOLDER:", folder);
        throw err;
      }
    }
  }

  async loadImage(src) {
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src);
    }

    const img = await new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;

      image.src = src;
    });

    this.imageCache.set(src, img);

    return img;
  }

  applyPalette(imageData, appearanceJson, paletteName) {
    const palette = appearanceJson.palettes?.[paletteName];
    const ranges = appearanceJson.pixelRanges;

    if (!palette || !ranges) return imageData;

    const pixels = imageData.data;

    for (const colorName in ranges) {
      const replacement = palette[colorName];

      if (!replacement) continue;

      const colorRanges = ranges[colorName];

      if (!Array.isArray(colorRanges)) continue;

      for (const range of colorRanges) {
        for (let pixel = range.start; pixel <= range.end; pixel++) {
          const i = pixel * 4;

          // overwrite whatever was there before
          pixels[i] = replacement.r;
          pixels[i + 1] = replacement.g;
          pixels[i + 2] = replacement.b;
          pixels[i + 3] = 255;
        }
      }
    }

    return imageData;
  }

  async generateBase64pngSpritesheet(appearance, mode) {
    let width;
    let height;
    if (mode === "Overworld") {
      width = 144;
      height = 192;
    } else if (mode === "Battler") {
      width = 576;
      height = 384;
    }

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // transparent blank spritesheet
    ctx.clearRect(0, 0, width, height);

    let imageData = ctx.createImageData(width, height);

    const suffix = mode; // "Overworld" or "Battler"

    const layers = [
      {
        name: "skin",
        data: this.appearanceData.get(`${appearance.skin.type}${suffix}`),
        palette: appearance.skin.palette,
      },

      {
        name: "eyes",
        data: this.appearanceData.get(`${appearance.eyes.type}${suffix}`),
        palette: appearance.eyes.palette,
      },

      {
        name: "clothing",
        data: this.appearanceData.get(`${appearance.clothing.type}${suffix}`),
        palette: appearance.clothing.palette,
      },

      {
        name: "hair",
        data: this.appearanceData.get(`${appearance.hair.style}${suffix}`),
        palette: appearance.hair.palette,
      },
    ];

    for (const layer of layers) {
      if (!layer.data) {
        continue;
      }

      imageData = this.applyPalette(imageData, layer.data, layer.palette);
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL("image/png");
  }

  async designCharacterSprite(imgSrc, mode) {
    const design =
      window.clientAPI.getReactState().PartySlice.characterSpriteDesign;

    const {
      origin,
      sex,
      hairStyle,
      clothingStyle,
      hairColor,
      eyeColor,
      skinTone,
      clothingColor,
    } = design;

    if (
      !origin ||
      !sex ||
      !hairStyle ||
      !clothingStyle ||
      !hairColor ||
      !eyeColor ||
      !skinTone ||
      !clothingColor
    ) {
      return null;
    }

    const appearance = {
      skin: {
        type: `Skin${origin}${sex}`,
        palette: skinTone,
      },
      eyes: {
        type: `Eyes${origin}${sex}`,
        palette: eyeColor,
      },
      clothing: {
        type: `${clothingStyle}${origin}${sex}`,
        palette: clothingColor,
      },
      hair: {
        style: `${hairStyle}${origin}${sex}`,
        palette: hairColor,
      },
    };

    window.clientAPI.dispatchToReact({
      type: "PartySlice/setCreateCharacterAppearance",
      payload: appearance,
    });
    return this.generateBase64pngSpritesheet(appearance, mode);
  }
}

window.clientAPI.spriteManager = new ClientSpriteManager();
