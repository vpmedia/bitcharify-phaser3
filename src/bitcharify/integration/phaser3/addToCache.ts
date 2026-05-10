type BitmapFontData = BitcharifyPhaser3.BitmapFontData;
type BitmapFontCacheChar = BitcharifyPhaser3.BitmapFontCacheChar;
type BitmapFontCacheData = BitcharifyPhaser3.BitmapFontCacheData;
type Phaser3Frame = BitcharifyPhaser3.Phaser3Frame;
type Phaser3Game = BitcharifyPhaser3.Phaser3Game;
type Phaser3Texture = BitcharifyPhaser3.Phaser3Texture;

/**
 * Build the bitmap font cache payload that Phaser 3 expects from raw BMFont data.
 * @param fontData - Parsed BMFont JSON.
 * @param frame - Phaser 3 texture frame for the font atlas.
 * @param texture - Phaser 3 texture that will receive per-glyph sub-frames.
 * @returns The cache data ready to be stored under `game.cache.bitmapFont`.
 */
const getBitmapFontData = (
  fontData: BitmapFontData,
  frame: Phaser3Frame,
  texture: Phaser3Texture,
): BitmapFontCacheData => {
  const xSpacing = 0;
  const ySpacing = 0;
  const textureX = frame.cutX;
  const textureY = frame.cutY;
  const textureWidth = frame.source.width;
  const textureHeight = frame.source.height;
  const sourceIndex = frame.sourceIndex;
  const chars: Record<number, BitmapFontCacheChar> = {};
  const data: BitmapFontCacheData = {
    font: fontData.info[0].face,
    size: fontData.info[0].size,
    lineHeight: fontData.common[0].lineHeight + ySpacing,
    chars,
  };
  const adjustForTrim = frame !== undefined && frame.trimmed;
  let top = frame.height;
  let left = frame.width;
  for (let index = 0; index < fontData.char.length; index += 1) {
    const char = fontData.char[index];
    const charCode = char.id;
    const letter = String.fromCodePoint(charCode);
    let gx = char.x;
    let gy = char.y;
    const gw = char.width;
    const gh = char.height;
    //  Handle frame trim issues
    if (adjustForTrim) {
      if (gx < left) {
        left = gx;
      }
      if (gy < top) {
        top = gy;
      }
    }
    if (adjustForTrim && top !== 0 && left !== 0) {
      //  Now we know the top and left coordinates of the glyphs in the original data
      //  so we can work out how much to adjust the glyphs by
      gx -= frame.x;
      gy -= frame.y;
    }
    const u0 = (textureX + gx) / textureWidth;
    const v0 = (textureY + gy) / textureHeight;
    const u1 = (textureX + gx + gw) / textureWidth;
    const v1 = (textureY + gy + gh) / textureHeight;
    chars[charCode] = {
      x: gx,
      y: gy,
      width: gw,
      height: gh,
      centerX: Math.floor(gw / 2),
      centerY: Math.floor(gh / 2),
      xOffset: char.xoffset,
      yOffset: char.yoffset,
      xAdvance: char.xadvance + xSpacing,
      data: {},
      kerning: {},
      u0: u0,
      v0: v0,
      u1: u1,
      v1: v1,
    };
    if (texture && gw !== 0 && gh !== 0) {
      const charFrame = texture.add(letter, sourceIndex, gx, gy, gw, gh);
      if (charFrame) {
        charFrame.setUVs(gw, gh, u0, v0, u1, v1);
      }
    }
  }
  for (let index = 0; index < fontData.kerning.length; index += 1) {
    const kerning = fontData.kerning[index];
    const first = kerning.first;
    const second = kerning.second;
    const amount = kerning.amount;
    chars[second].kerning[first] = amount;
  }
  return data;
};

/**
 * Register a bitmap font with Phaser 3's caches.
 * @param game - The active Phaser 3 game instance.
 * @param key - Cache key shared between the texture and bitmap-font caches.
 * @param fontData - Parsed BMFont JSON data.
 * @param textureSource - The font atlas image or canvas source.
 */
export function addToCache(
  game: Phaser3Game,
  key: string,
  fontData: BitmapFontData,
  textureSource: HTMLImageElement | HTMLCanvasElement,
): void {
  game.textures.addImage(key, textureSource);
  const texture = game.textures.get(key);
  const frame = game.textures.getFrame(key);
  const cacheData = getBitmapFontData(fontData, frame, texture);
  game.cache.bitmapFont.add(key, { data: cacheData, texture: key, frame: null });
}
