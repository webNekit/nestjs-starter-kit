import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export function deleteFileFromDisk(
    filename: string | null,
    configService: ConfigService,
) {
    if (!filename) return;

    const uploadDir = configService.get<string>('UPLOAD_DIR') || 'uploads';
    const filePath = path.join(process.cwd(), uploadDir, filename);

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`Ошибка при удалении файла ${filePath}:`, err);
        }
    }
}
