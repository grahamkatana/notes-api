import { Injectable, ConflictException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        // check if email already exists in the database
        // hash the password using bcrypt
        // save the user to the database
        // return a success message + jwt token + user object without pwd
        const user = await this.userService.getUserByEmail(registerDto.email!);
        if (user) {
            throw new ConflictException('Email already exists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password!, saltRounds);
        const registeredUser = await this.userService.createUser({
            name: registerDto.name!,
            email: registerDto.email!,
            password: hashedPassword
        });
        const payload = {sub: registeredUser.id, email: registeredUser.email};
        const token = await this.jwtService.signAsync(payload);
        const userWithoutPassword = {
            id: registeredUser.id,
            name: registeredUser.name,
            email: registeredUser.email,
            verifiedAt: registeredUser.verifiedAt,
            createdAt: registeredUser.createdAt,
            updatedAt: registeredUser.updatedAt
        };
        return {
            message: 'User registered successfully!',
            token,
            user: userWithoutPassword
        };
    }
}
