import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value, 10);
    return isNaN(val) ? undefined : val;
  })
  @IsNumber()
  width?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = parseInt(value, 10);
    return isNaN(val) ? undefined : val;
  })
  @IsNumber()
  height?: number;
}
