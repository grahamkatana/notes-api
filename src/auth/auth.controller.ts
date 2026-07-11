import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) {
        this.authService = authService;
    }

    @Post('signup')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('signin')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

}
