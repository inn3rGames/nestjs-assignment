import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public-strategy";
import { Role } from "./role.enum";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.logIn(signInDto.username, signInDto.password);
  }

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
