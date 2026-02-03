import {IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "@prisma/client";

export class CreateUserDto {
    @ApiProperty({ example: 'admin@example.com', description: 'Email пользователя' })
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @ApiProperty({ example: 'password', description: 'Пароль пользователя' })
    @IsString()
    @MinLength(6, { message: 'Минимальное кол-во символов 6' })
    password: string;

    @ApiProperty({ example: 'Иванов Иван', description: 'Имя пользователя' })
    @IsString()
    @MinLength(2, { message: 'Минимальное кол-во символов 2' })
    @MaxLength(50, {  message: 'Максимальное кол-во символов 50'})
    fullName: string;

    @ApiProperty({ enum: Role, default: Role.USER, description: 'Роль пользователя' })
    @IsOptional()
    @IsEnum(Role)
    role?: Role
}