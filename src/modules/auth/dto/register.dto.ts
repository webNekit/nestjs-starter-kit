import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @ApiProperty({ example: 'password' })
    @IsString()
    @MinLength(6, { message: 'Минимальное кол-во символов 6' })
    password: string;

    @ApiProperty({ example: 'Иванов Иван' })
    @IsString()
    @MinLength(2, { message: 'Минимальное кол-во символов 2' })
    @MaxLength(50, { message: 'Максимальное кол-во символов 50' })
    fullName: string;
}