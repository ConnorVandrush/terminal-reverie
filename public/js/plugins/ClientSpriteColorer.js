class ClientSpriteColorer {
    constructor() {
        this.spriteRanges = null;
        this.loadingRanges = false;
    }

    async loadSpriteRanges() {
        if (this.spriteRanges) {
            console.log("Sprite ranges already loaded.");
            return this.spriteRanges;
        }

        if (this.loadingRanges) {
            console.log("Waiting for sprite ranges to finish loading...");
            while (this.loadingRanges) await new Promise(r => setTimeout(r, 50));
            return this.spriteRanges;
        }

        console.log("Loading sprite ranges from /data/Appearance.json...");
        this.loadingRanges = true;
        try {
            const res = await fetch("/data/Appearance.json");
            this.spriteRanges = await res.json();
            console.log("Sprite ranges loaded successfully:", this.spriteRanges);
        } catch (err) {
            console.error("Failed to load sprite ranges:", err);
            throw err;
        } finally {
            this.loadingRanges = false;
        }

        return this.spriteRanges;
    }

    async recolorSprite(imageSrc, spriteKey, option, primaryColor, secondaryColor) {
        console.log("RecolorSprite called with:", {
            imageSrc,
            spriteKey,
            option,
            primaryColor,
            secondaryColor
        });

        const rangesJSON = await this.loadSpriteRanges();
        const ranges = rangesJSON[spriteKey]?.[option];

        if (!ranges) {
            console.error(`No ranges found for ${spriteKey} -> ${option}`);
            throw new Error(`No ranges found for ${spriteKey} -> ${option}`);
        }
        console.log("Using sprite ranges:", ranges);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageSrc;

            img.onload = () => {
                console.log("Image loaded successfully:", { width: img.width, height: img.height });

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
                console.log("Image drawn to offscreen canvas.");

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const recolorRanges = (pixelRanges, color, type) => {
                    if (!pixelRanges || !color) {
                        console.warn(`Skipping recolor for ${type}, no pixels or color`);
                        return;
                    }
                    console.log(`Recoloring ${type} pixels, ${pixelRanges.length} ranges`);
                    for (const { start, end } of pixelRanges) {
                        for (let i = start; i <= end; i++) {
                            const idx = i * 4;
                            data[idx] = color.r;
                            data[idx + 1] = color.g;
                            data[idx + 2] = color.b;
                        }
                    }
                };

                recolorRanges(ranges.primary, primaryColor, "primary");
                recolorRanges(ranges.secondary, secondaryColor, "secondary");

                ctx.putImageData(imageData, 0, 0);
                console.log("ImageData applied to canvas.");

                const result = canvas.toDataURL("image/png");
                console.log("Recolor complete, returning base64 PNG.");
                resolve(result);
            };

            img.onerror = (err) => {
                console.error("Image failed to load:", err, "Src:", imageSrc);
                reject(err);
            };
        });
    }
}

// Assign globally
window.clientGlobalManager.spriteColorer = new ClientSpriteColorer();