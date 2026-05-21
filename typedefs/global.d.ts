// Minimal ambient Phaser 3 type surface used by @vpmedia/bitcharify-phaser3.
// We avoid taking a hard dependency on `phaser`; only the subset of API
// touched by addToCache is described here.

declare global {
  namespace BitcharifyPhaser3 {
    interface Phaser3FrameSource {
      width: number;
      height: number;
    }

    interface Phaser3Frame {
      cutX: number;
      cutY: number;
      source: Phaser3FrameSource;
      sourceIndex: number;
      trimmed: boolean;
      width: number;
      height: number;
      x: number;
      y: number;
      setUVs(width: number, height: number, u0: number, v0: number, u1: number, v1: number): void;
    }

    interface Phaser3Texture {
      add(
        name: string,
        sourceIndex: number,
        x: number,
        y: number,
        width: number,
        height: number
      ): Phaser3Frame | null | undefined;
    }

    interface Phaser3TextureManager {
      addImage(key: string, source: HTMLImageElement | HTMLCanvasElement): unknown;
      get(key: string): Phaser3Texture;
      getFrame(key: string): Phaser3Frame;
    }

    interface Phaser3BitmapFontCache {
      add(key: string, value: { data: BitmapFontCacheData; texture: string; frame: string | null }): void;
    }

    interface Phaser3CacheManager {
      bitmapFont: Phaser3BitmapFontCache;
    }

    interface Phaser3Game {
      textures: Phaser3TextureManager;
      cache: Phaser3CacheManager;
    }

    // Subset of the BMFont (XML-parsed-to-JSON) shape produced by @vpmedia/bitcharify.
    interface BitmapFontInfo {
      face: string;
      size: number;
    }

    interface BitmapFontCommon {
      lineHeight: number;
    }

    interface BitmapFontChar {
      id: number;
      x: number;
      y: number;
      width: number;
      height: number;
      xoffset: number;
      yoffset: number;
      xadvance: number;
    }

    interface BitmapFontKerning {
      first: number;
      second: number;
      amount: number;
    }

    interface BitmapFontData {
      info: BitmapFontInfo[];
      common: BitmapFontCommon[];
      char: BitmapFontChar[];
      kerning: BitmapFontKerning[];
    }

    interface BitmapFontCacheChar {
      x: number;
      y: number;
      width: number;
      height: number;
      centerX: number;
      centerY: number;
      xOffset: number;
      yOffset: number;
      xAdvance: number;
      data: Record<string, unknown>;
      kerning: Record<number, number>;
      u0: number;
      v0: number;
      u1: number;
      v1: number;
    }

    interface BitmapFontCacheData {
      font: string;
      size: number;
      lineHeight: number;
      chars: Record<number, BitmapFontCacheChar>;
    }
  }
}

export {};
