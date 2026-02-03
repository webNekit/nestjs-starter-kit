import { ConfigService } from '@nestjs/config';

export const getFileUrl = ( filename: string | null, configService: ConfigService ): string | null => {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;

    const baseUrl = configService.get<string>('BASE_URL');
    return `${baseUrl}/uploads/${filename}`;
};