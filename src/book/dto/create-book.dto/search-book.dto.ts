import { IsNumber, IsString } from 'class-validator';

export class SearchBookDTO {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly author?: string;

  @IsNumber()
  readonly minPrice?: number;

  @IsNumber()
  readonly maxPrice?: number;

  @IsNumber()
  readonly rating?: number;
}
