import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CatsService } from "./cats.service";
import { Cat } from "../entities/cat.entity";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "../auth/role.enum";
import { Roles } from "src/auth/roles.decorators";

@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // Get all cats
  @Get()
  async findAll(): Promise<Cat[]> {
    return await this.catsService.findAll();
  }

  // Get one cat
  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Cat> {
    const cat = await this.catsService.findOne(id);
    if (!cat) {
      throw new Error("Cat not found");
    } else {
      return cat;
    }
  }

  // Create cat
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() cat: Cat): Promise<Cat> {
    return await this.catsService.create(cat);
  }

  // Update cat
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Put(":id")
  async update(@Param("id") id: number, @Body() cat: Cat): Promise<Cat> {
    return this.catsService.update(id, cat);
  }

  // Delete cat
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Delete(":id")
  async delete(@Param("id") id: number): Promise<void> {
    // Handle the error if the cat is not found
    const cat = await this.catsService.findOne(id);
    if (!cat) {
      throw new Error("Cat not found");
    }
    return this.catsService.delete(id);
  }
}
