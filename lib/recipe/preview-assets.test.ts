import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const publicAsset = (filename: string) =>
  fileURLToPath(new URL(`../../public/${filename}`, import.meta.url));

const dimensionsFromPng = (image: Buffer) => ({
  width: image.readUInt32BE(16),
  height: image.readUInt32BE(20),
});

const dimensionsFromJpeg = (image: Buffer) => {
  let offset = 2;

  while (offset < image.length) {
    if (image[offset] !== 0xff) break;

    const marker = image[offset + 1];
    const segmentLength = image.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        width: image.readUInt16BE(offset + 7),
        height: image.readUInt16BE(offset + 5),
      };
    }

    offset += segmentLength + 2;
  }

  throw new Error('JPEG dimensions were not found');
};

describe('public preview assets', () => {
  it('keeps the gallery compatibility image at /og.png', async () => {
    const image = await readFile(publicAsset('og.png'));

    expect(Array.from(image.subarray(0, 8))).toEqual([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    expect(dimensionsFromPng(image)).toEqual({ width: 1200, height: 630 });
  });

  it('ships the canonical metadata image as a 1200 x 630 JPEG', async () => {
    const image = await readFile(publicAsset('og.jpg'));

    expect(Array.from(image.subarray(0, 3))).toEqual([0xff, 0xd8, 0xff]);
    expect(dimensionsFromJpeg(image)).toEqual({ width: 1200, height: 630 });
  });
});
