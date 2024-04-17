import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Query user by username
  async findOneBy(username: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ username: username });
  }

  // Create user
  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      ...createUserDto,
    });
  }
}
