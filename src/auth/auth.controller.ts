import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public-strategy";
import { Role } from "./role.enum";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // Login route
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  logIn(@Body() logInDto: Record<string, any>) {
    return this.authService.logIn(logInDto.username, logInDto.password);
  }

  // Register new basic user
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body() registerDto: Record<string, any>) {
    const payload = {
      username: registerDto.username,
      password: registerDto.password,
      roles: [Role.User],
    };

    return this.authService.register(payload);
  }

  // Register admin
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("register-admin")
  registerAdmin(@Body() registerDto: Record<string, any>) {
    const payload = {
      username: registerDto.username,
      password: registerDto.password,
      roles: [Role.User, Role.Admin],
    };

    return this.authService.register(payload);
  }
}
