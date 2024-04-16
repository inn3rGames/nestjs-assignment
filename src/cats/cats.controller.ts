import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CatsService } from "./cats.service";
import { Cat } from "../entities/cat.entity";
import { User } from "../entities/user.entity";
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
  async findOne(@Param("id") id: string): Promise<Cat> {
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
  async update(@Param("id") id: string, @Body() cat: Cat): Promise<Cat> {
    // Handle the error if the cat is not found
    const catExists = await this.catsService.findOne(id);
    if (!catExists) {
      throw new Error("Cat not found");
    }
    return this.catsService.update(id, cat);
  }

  // Delete cat
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    // Handle the error if the cat is not found
    const cat = await this.catsService.findOne(id);
    if (!cat) {
      throw new Error("Cat not found");
    }
    return this.catsService.delete(id);
  }

  // Add favorite cat to user
  @UseGuards(AuthGuard)
  @Post("/favorite/:id")
  async addFavorite(@Req() request: any, @Param("id") addCatId: string) {
    return this.catsService.addFavoriteCat(request.user.username, addCatId);
  }

  // Delete favorite cat from user
  @UseGuards(AuthGuard)
  @Delete("/favorite/:id")
  async deleteFavorite(@Req() request: any, @Param("id") deleteCatId: string) {
    return this.catsService.deleteFavoriteCat(
      request.user.username,
      deleteCatId,
    );
  }

  // View all cats marked as favorite from user
  @UseGuards(AuthGuard)
  @Get("/favorite/:id")
  async viewFavorites(@Req() request: any) {
    return this.catsService.viewFavoriteCats(request.user.username);
  }
}
