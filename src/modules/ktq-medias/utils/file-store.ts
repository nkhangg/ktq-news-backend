import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import sharp from 'sharp';

export const ALLOWED_IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp'];
export const ALLOWED_VIDEO_EXT = ['.mp4'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

export const storageConfig = (folder: string) =>
    diskStorage({
        destination: `public/${folder}`,
        filename(req, file, callback) {
            try {
                callback(null, Date.now() + '-' + randomUUID() + '-' + file.originalname);
            } catch (error) {}
        },
    });

export const filterStorage: MulterOptions['fileFilter'] = (req, file, callback) => {
    const etx = extname(file.originalname);
    const allowedExtArr = ALLOWED_IMAGE_EXT;

    if (!allowedExtArr.includes(etx)) {
        req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.join(', ')}`;
        callback(null, false);
    } else {
        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size less than 5mb`;
            callback(null, false);
        } else {
            callback(null, true);
        }
    }
};

export const filterMediasStorage: MulterOptions['fileFilter'] = (req, file, callback) => {
    const allowedImageExt = ALLOWED_IMAGE_EXT;
    const allowedVideoExt = ALLOWED_VIDEO_EXT;

    const ext = extname(file.originalname).toLowerCase();

    const fileSize = parseInt(req.headers['content-length']);

    if (allowedImageExt.includes(ext)) {
        if (fileSize > MAX_IMAGE_SIZE) {
            req.fileValidationError = 'Image file size is too large. Maximum accepted size is 5MB.';
            callback(null, false);
            return;
        }
    } else if (allowedVideoExt.includes(ext)) {
        if (fileSize > MAX_VIDEO_SIZE) {
            req.fileValidationError = 'Video file size is too large. Maximum accepted size is 10MB.';

            callback(null, false);
            return;
        }
    } else {
        req.fileValidationError = `Unsupported file type. Accepted file types are: ${[...allowedImageExt, ...allowedVideoExt].join(', ')}`;
        callback(null, false);
        return;
    }

    callback(null, true);
};
