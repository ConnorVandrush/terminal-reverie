class ClientSpriteColorer {
  constructor() {
    this.spriteRanges = null; // templateName -> pixel ranges for each option
    this.colors = null; // colorName -> { primary, secondary }
    this.defaultColors = null; // templateName -> defaultColors object
    this.loading = false; // prevents duplicate fetches
  }

  /** Load JSON once and populate ranges, colors, and defaults */
  async loadAppearanceData() {
    try {
      const res = await fetch("/data/Appearance.json");
      const json = await res.json();

      // Store templates separately for pixel recolor
      this.spriteRanges = json.templates || {};

      // Store color table
      this.colors = json.colors || {};

      // Build Map for template -> defaultColors
      this.defaultColors = new Map(
        Object.entries(this.spriteRanges).map(([name, data]) => [
          name,
          data.defaultColors || {},
        ]),
      );
    } catch (err) {
      throw err;
    } finally {
      this.loading = false;
    }
  }

  /** Normalize image input: path, base64, or HTMLImageElement */
  async loadImage(srcOrImg) {
    return new Promise((resolve, reject) => {
      if (srcOrImg instanceof HTMLImageElement) {
        if (srcOrImg.complete) return resolve(srcOrImg);
        srcOrImg.onload = () => resolve(srcOrImg);
        srcOrImg.onerror = reject;
        return;
      }

      const img = new Image();
      if (typeof srcOrImg === "string" && !srcOrImg.startsWith("data:")) {
        img.crossOrigin = "Anonymous";
      }
      img.src = srcOrImg;

      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  /**
   * Recolor a sprite
   * @param {string|HTMLImageElement} imageSrcOrImg - path, base64, or image element
   * @param {string} templateName - e.g., "grasslandswarriormalehair1style1"
   * @param {string} option - "hair", "eyes", etc.
   * @param {string} colorName - key from colors table
   * @returns {Promise<string>} base64 PNG
   */
  async recolorSprite(imageSrcOrImg, templateName, option, colorName) {
    // Ensure appearance data is loaded
    await this.loadAppearanceData();

    const ranges = this.spriteRanges?.[templateName]?.[option];
    if (!ranges) {
      throw new Error(`No pixel ranges found for ${templateName} -> ${option}`);
    }

    const colorEntry = this.colors?.[colorName];
    if (!colorEntry) {
      throw new Error(`Color "${colorName}" not found in color table`);
    }

    const img = await this.loadImage(imageSrcOrImg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const recolorRanges = (pixelRanges, color) => {
      if (!pixelRanges || !color) return;
      for (const { start, end } of pixelRanges) {
        for (let i = start; i <= end; i++) {
          const idx = i * 4;
          data[idx] = color.r;
          data[idx + 1] = color.g;
          data[idx + 2] = color.b;
        }
      }
    };

    recolorRanges(ranges.primary, colorEntry.primary);
    recolorRanges(ranges.secondary, colorEntry.secondary);

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL("image/png");
  }

  /** Get default colors for a template */
  getDefaultColors(templateName) {
    if (!this.defaultColors) return {};
    return this.defaultColors.get(templateName) || {};
  }

  recolorSpritesheet(imageSrcOrImg, templateName, colorChoices) {
    return this.recolorSprite(
      imageSrcOrImg,
      templateName,
      "hair",
      colorChoices.hair,
    )
      .then((recoloredHair) =>
        this.recolorSprite(
          recoloredHair,
          templateName,
          "eyes",
          colorChoices.eyes,
        ),
      )
      .then((recoloredEyes) =>
        this.recolorSprite(
          recoloredEyes,
          templateName,
          "skin",
          colorChoices.skin,
        ),
      )
      .then((recoloredSkin) =>
        this.recolorSprite(
          recoloredSkin,
          templateName,
          "shirt",
          colorChoices.shirt,
        ),
      )
      .then((recoloredShirt) =>
        this.recolorSprite(
          recoloredShirt,
          templateName,
          "pants",
          colorChoices.pants,
        ),
      );
  }
}

// Assign globally
window.clientAPI.spriteColorer = new ClientSpriteColorer();
