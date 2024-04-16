import { IsInt, IsString, IsNotEmpty } from "class-validator";

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  readonly breed: string;
}
