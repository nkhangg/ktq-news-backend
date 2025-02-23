import axios from 'axios';
import { randomUUID } from 'crypto';
import { basename, join } from 'path';
import * as sharp from 'sharp';
import { Constant } from './constant';
import { mkdir, unlink } from 'fs/promises';
import { createWriteStream, existsSync } from 'fs';

export async function downloadImage(url: string, filepath: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });
}

async function resizeImage(
  inputPath: string,
  outputPath: string,
  resize: { width?: number; height?: number },
) {
  await sharp(inputPath)
    .resize({
      width: resize?.width || Constant.DEFAULT_RESIZE,
      height: resize?.height || Constant.DEFAULT_RESIZE,
    })
    .webp({ effort: 3 })
    .toFile(outputPath);
}

export async function processImage(
  link: string,
  resize: { width?: number; height?: number },
): Promise<{ filename: string; original_path: string } | null> {
  const uniqueId = `${Date.now()}-${this?.resize?.width || Constant.DEFAULT_RESIZE}x${this?.resize?.height || Constant.DEFAULT_RESIZE}-${randomUUID()}`;
  const tmpDir = `public/${Constant.TMP_FOLDER}`;
  const mediaDir = `public/${Constant.MEDIA_FOLDER}`;

  const tempFilePath = join(tmpDir, `${uniqueId}`);
  const resizedFilePath = join(mediaDir, `${uniqueId}.webp`);

  try {
    if (!existsSync(tmpDir)) await mkdir(tmpDir, { recursive: true });
    if (!existsSync(mediaDir)) await mkdir(mediaDir, { recursive: true });

    await downloadImage(link, tempFilePath);

    await resizeImage(tempFilePath, resizedFilePath, resize);

    return {
      filename: basename(resizedFilePath),
      original_path: resizedFilePath,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  } finally {
    if (existsSync(tempFilePath)) {
      try {
        await unlink(tempFilePath);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }
    }
  }
}
