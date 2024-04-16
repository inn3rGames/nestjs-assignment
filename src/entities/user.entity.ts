import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Cat } from "../entities/cat.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column("text", { array: true })
  roles: string[];

  @ManyToMany(() => Cat, (cat) => cat.users)
  @JoinTable()
  favorites: Cat[];
}
