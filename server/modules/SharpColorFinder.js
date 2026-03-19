const fs = require('fs');
const sharp = require('sharp');

/**
 * Find all white pixels and return continuous ranges of pixel indices.
 * @param {string} imagePath
 * @param {number} tolerance
 * @returns {Promise<Array<{start:number,end:number}>>}
 */
async function findWhitePixelRanges(imagePath, tolerance = 12) {
    const { data, info } = await sharp(imagePath)
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    const ranges = [];
    let rangeStart = null;

    const isWhite = (r, g, b, a) => {
        if (a === 0) return false; // skip fully transparent
        const alpha = a / 255;
        const rVis = Math.round(r * alpha + 255 * (1 - alpha));
        const gVis = Math.round(g * alpha + 255 * (1 - alpha));
        const bVis = Math.round(b * alpha + 255 * (1 - alpha));
        return (
            Math.abs(rVis - 255) <= tolerance &&
            Math.abs(gVis - 255) <= tolerance &&
            Math.abs(bVis - 255) <= tolerance
        );
    };

    const totalPixels = width * height;

    for (let p = 0; p < totalPixels; p++) {
        const i = p * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (isWhite(r, g, b, a)) {
            if (rangeStart === null) rangeStart = p; // start new range
        } else {
            if (rangeStart !== null) {
                ranges.push({ start: rangeStart, end: p - 1 });
                rangeStart = null;
            }
        }
    }

    // push last range if image ends with white pixels
    if (rangeStart !== null) {
        ranges.push({ start: rangeStart, end: totalPixels - 1 });
    }

    return ranges;
}

/**
 * Save white pixel ranges to JSON file
 */
async function saveWhitePixelRangesToJson(imagePath, outputJsonPath) {
    const ranges = await findWhitePixelRanges(imagePath, 12);
    fs.writeFileSync(outputJsonPath, JSON.stringify(ranges)); // no pretty print
}

module.exports = {
    findWhitePixelRanges,
    saveWhitePixelRangesToJson
};