import { Injectable, ConflictException, Logger, UnprocessableEntityException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto, RegisterResponseDto, LoginDto, LoginResponseDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { User } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    userWithoutPassword(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            verifiedAt: user.verifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

    }

    async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        const user = await this.userService.getUserByEmail(registerDto.email!);
        if (user) {
            this.logger.warn(`Attempt to register with existing email: ${registerDto.email}`);
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
        const userWithoutPassword = this.userWithoutPassword(registeredUser);
        this.logger.log(`User registered successfully: ${JSON.stringify(userWithoutPassword)}`);
        return {
            message: 'User registered successfully!',
            token,
            user: userWithoutPassword
        };
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const user = await this.userService.getUserByEmail(loginDto.email!);
        if (!user) {
            this.logger.warn(`Attempt to login with non-existent email: ${loginDto.email}`);
            throw new UnprocessableEntityException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(loginDto.password!, user.password);
        if (!isMatch) {
            this.logger.warn(`Attempt to login with incorrect password for email: ${loginDto.email}`);
            throw new UnprocessableEntityException('Invalid email or password');
        }
        const payload = {sub: user.id, email: user.email};
        const token = await this.jwtService.signAsync(payload);
        const userWithoutPassword = this.userWithoutPassword(user);
        this.logger.log(`User logged in successfully: ${JSON.stringify(userWithoutPassword)}`);
        return {
            message: 'User logged in successfully!',
            token,
            user: userWithoutPassword
        };
    }
    }
