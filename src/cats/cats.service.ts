import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cat } from "../entities/cat.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Get all cats
  async findAll(): Promise<Cat[]> {
    return await this.catsRepository.find();
  }

  // Get one cat
  async findOne(id: number): Promise<Cat> {
    return await this.catsRepository.findOne({ where: { id } });
  }

  // Create cat
  async create(cat: Cat): Promise<Cat> {
    const newCat = this.catsRepository.create(cat);
    return await this.catsRepository.save(newCat);
  }

  // Update cat
  async update(id: number, cat: Cat): Promise<Cat> {
    await this.catsRepository.update(id, cat);
    return await this.catsRepository.findOne({ where: { id: id } });
  }

  // Delete cat
  async delete(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }

  // Add favorite cat
  async addFavoriteCat(username: string, addCatId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        favorites: true,
      },
    });
    const cat = await this.catsRepository.findOneBy({ id: addCatId });

    if (user && cat) {
      const favorites = user.favorites;

      const findExistingItems = favorites.filter((catItem) => {
        return catItem.id === addCatId;
      });

      if (findExistingItems.length <= 0) {
        user.favorites.push(cat);
        this.usersRepository.save(user);
      } else {
        return "Cat already marked as favorite";
      }

      const { password, ...serializedUser } = user;
      return serializedUser;
    } else {
      //Handle pair not found
      throw new Error("Pair not found");
    }
  }

  // Delete favorite cat
  async deleteFavoriteCat(username: string, deleteCatId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        favorites: true,
      },
    });
    const cat = await this.catsRepository.findOneBy({
      id: deleteCatId,
    });

    if (user && cat) {
      const favorites = user.favorites;

      const deletedFavorites = favorites.filter((catItem) => {
        return catItem.id !== deleteCatId;
      });

      user.favorites = deletedFavorites;

      this.usersRepository.save(user);

      const { password, ...serializedUser } = user;
      return serializedUser;
    } else {
      //Handle pair not found
      throw new Error("Pair not found");
    }
  }

  // View all cats marked as favorite from user
  async viewFavoriteCats(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        favorites: true,
      },
    });

    if (user) {
      return user.favorites;
    } else {
      //Handle user not found
      throw new Error("User not found");
    }
  }
}
