import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Great product' })
  comment?: string;
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  rating?: number;
}
