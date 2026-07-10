import { Injectable } from '@nestjs/common';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {
        this.userService = userService;
    }
    register(registerDto: RegisterDto): RegisterResponseDto {
        // check if email already exists in the database
        // hash the password using bcrypt
        // save the user to the database
        // return a success message + jwt token + user object without pwd
        const user = this.userService.getUserByEmail(registerDto.email!);
        

        return {
            message: 'User registered successfully!'
        };
    }
}
