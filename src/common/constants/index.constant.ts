import {ParseFilePipeBuilder, HttpStatus} from '@nestjs/common';

export const REQUEST_USER_KEY = 'user';
export const ROLES_KEY = 'roles';
export const IS_PUBLIC_KEY = 'isPublic';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const API_PREFIX = 'api';

export const IMAGE_VALIDATION = new ParseFilePipeBuilder()
    .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
    .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: false });