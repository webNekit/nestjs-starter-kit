import {BadRequestException, Injectable} from "@nestjs/common";
import {MulterModuleOptions, MulterOptionsFactory} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createMulterOptions(): MulterModuleOptions {
        const uploadDir = this.configService.get<string>('UPLOAD_DIR') || 'uploads';
        const maxSize = this.configService.get<number>('UPLOAD_MAX_SIZE') || 5 * 1024 * 1024;
        const allowedMimeTypes = this.configService.get<string>('UPLOAD_ALLOWED_MIME_TYPES')?.split(',') || ['image/jpeg', 'image/png'];
        const absolutePath = join(process.cwd(), uploadDir);

        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
        }

        return {
            limits: {
                fileSize: maxSize,
            },
            fileFilter: (req, file, cb) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new BadRequestException(`Недопустимый формат файла. Разрешены: ${allowedMimeTypes.join(', ')}`),
                        false,
                    );
                }
                cb(null, true);
            },
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, absolutePath);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = uuidv4();
                    const ext = extname(file.originalname).toLowerCase();
                    const filename = `${uniqueSuffix}${ext}`;
                    cb(null, filename);
                },
            }),
        };
    }
}