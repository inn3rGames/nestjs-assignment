import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cat } from "../entities/cat.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,

    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  // Get all cats
  async findAll(): Promise<Cat[]> {
    return await this.catsRepository.find();
  }

  // Get one cat
  async findOne(id: string): Promise<Cat> {
    return await this.catsRepository.findOne({ where: { id: parseInt(id) } });
  }

  // Create cat
  async create(cat: Cat): Promise<Cat> {
    const newCat = this.catsRepository.create(cat);
    return await this.catsRepository.save(newCat);
  }

  // Update cat
  async update(id: string, cat: Cat): Promise<Cat> {
    await this.catsRepository.update(id, cat);
    return await this.catsRepository.findOne({ where: { id: parseInt(id) } });
  }

  // Delete cat
  async delete(id: string): Promise<void> {
    await this.catsRepository.delete(id);
  }

  // Add favorite cat
  async addFavoriteCat(username: string, addCatId: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        favorites: true,
      },
    });
    const cat = await this.catsRepository.findOneBy({ id: parseInt(addCatId) });

    if (user && cat) {
      let favorites = user.favorites;

      let findExistingItems = favorites.filter((catItem) => {
        return catItem.id === parseInt(addCatId);
      });

      if (findExistingItems.length <= 0) {
        user.favorites.push(cat);
        this.usersRepository.save(user);
      } else {
        return "Cat already marked as favorite";
      }

      return user;
    } else {
      //Handle pair not found
      throw new Error("Pair not found");
    }
  }

  // Delete favorite cat
  async deleteFavoriteCat(username: string, deleteCatId: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        favorites: true,
      },
    });
    const cat = await this.catsRepository.findOneBy({
      id: parseInt(deleteCatId),
    });

    if (user && cat) {
      let favorites = user.favorites;

      let deletedFavorites = favorites.filter((catItem) => {
        return catItem.id !== parseInt(deleteCatId);
      });

      user.favorites = deletedFavorites;

      this.usersRepository.save(user);

      return user;
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
