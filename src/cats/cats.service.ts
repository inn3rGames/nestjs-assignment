import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cat } from "./cat.entity";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
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
    return await this.catsRepository.findOne({ where: { id } });
  }

  // Delete cat
  async delete(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }
}
