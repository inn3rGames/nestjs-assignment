import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  saltRounds = 10;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  // Log in user
  async logIn(username: string, password: string) {
    const user = await this.usersService.findOneBy(username);

    if (user?.password !== password) {
      const isMatch = await bcrypt.compare(password, user?.password);

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      const payload = {
        sub: user.id,
        username: user.username,
        roles: user.roles,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  // Register user
  async register(payload: CreateUserDto) {
    const hashPass = await bcrypt.hash(payload.password, this.saltRounds);

    const data = {
      ...payload,
      password: hashPass,
    };

    const user = await this.usersService.create(data);

    const { password, ...serializedUser } = user;
    return serializedUser;
  }
}
