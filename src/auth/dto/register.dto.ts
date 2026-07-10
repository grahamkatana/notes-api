import { IsEmail, IsNotEmpty, IsString, MinLength, IsStrongPassword } from 'class-validator';
import { Match } from './match.decorator';
export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Match('password', { message: 'Passwords do not match' })
    confirm_password?: string;
}

export class RegisterResponseDto {
    message?: string;
}