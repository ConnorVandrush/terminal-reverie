const fs = require('fs');
const sharp = require('sharp');

/**
 * Detect visible color after alpha blending
 */
function getVisibleColor(r, g, b, a) {
    const alpha = a / 255;

    return {
        r: Math.round(r * alpha + 255 * (1 - alpha)),
        g: Math.round(g * alpha + 255 * (1 - alpha)),
        b: Math.round(b * alpha + 255 * (1 - alpha))
    };
}

/**
 * Create a color matcher
 */
function createColorMatcher(targetR, targetG, targetB, tolerance = 12) {
    return (r, g, b, a) => {
        if (a === 0) return false;

        const visible = getVisibleColor(r, g, b, a);

        return (
            Math.abs(visible.r - targetR) <= tolerance &&
            Math.abs(visible.g - targetG) <= tolerance &&
            Math.abs(visible.b - targetB) <= tolerance
        );
    };
}

/**
 * Find continuous pixel ranges for multiple colors
 */
async function findColorPixelRanges(imagePath, tolerance = 12) {
    const { data, info } = await sharp(imagePath)
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const totalPixels = info.width * info.height;

    // Define colors to track
    const colorMatchers = {
        white: createColorMatcher(255, 255, 255, tolerance),
        red: createColorMatcher(255, 0, 0, tolerance),
        green: createColorMatcher(0, 255, 0, tolerance),
        blue: createColorMatcher(0, 0, 255, tolerance),
        cyan: createColorMatcher(0, 255, 255, tolerance),
        magenta: createColorMatcher(255, 0, 255, tolerance),
        yellow: createColorMatcher(255, 255, 0, tolerance)
    };

    const ranges = {};
    const activeRanges = {};

    // Initialize storage
    for (const color in colorMatchers) {
        ranges[color] = [];
        activeRanges[color] = null;
    }

    for (let p = 0; p < totalPixels; p++) {
        const i = p * 4;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        for (const color in colorMatchers) {
            const matches = colorMatchers[color](r, g, b, a);

            if (matches) {
                if (activeRanges[color] === null) {
                    activeRanges[color] = p;
                }
            } else {
                if (activeRanges[color] !== null) {
                    ranges[color].push({
                        start: activeRanges[color],
                        end: p - 1
                    });
                    activeRanges[color] = null;
                }
            }
        }
    }

    // Close any remaining open ranges
    for (const color in activeRanges) {
        if (activeRanges[color] !== null) {
            ranges[color].push({
                start: activeRanges[color],
                end: totalPixels - 1
            });
        }
    }

    return ranges;
}

/**
 * Save color ranges to JSON
 */
async function saveColorPixelRangesToJson(imagePath, outputJsonPath) {
    const ranges = await findColorPixelRanges(imagePath);

    const lines = ['{'];

    const entries = Object.entries(ranges);

    entries.forEach(([color, values], index) => {
        const comma = index < entries.length - 1 ? ',' : '';

        lines.push(
            `  "${color}": ${JSON.stringify(values)}${comma}`
        );
    });

    lines.push('}');

    fs.writeFileSync(
        outputJsonPath,
        lines.join('\n')
    );
}

module.exports = {
    findColorPixelRanges,
    saveColorPixelRangesToJson
};