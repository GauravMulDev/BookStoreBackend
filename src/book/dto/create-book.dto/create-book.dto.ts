import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookDTO {
  @IsOptional()
  @IsString()
  readonly title: string;
  @IsOptional()
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsString()
  readonly description: string;
  @IsOptional()
  readonly price: number;

  @IsOptional()
  readonly rating: number;
  @IsOptional()
  @IsString()
  filePath?: string;
  @IsOptional()
  @IsString()
  readonly file?: Express.Multer.File;
}
