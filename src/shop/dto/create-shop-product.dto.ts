import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

function toInt(v: any) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseInt(v, 10);
  return v;
}
function parseJSON<T>(v: any): T | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'object') return v as T;
  try {
    return JSON.parse(String(v)) as T;
  } catch {
    return undefined;
  }
}

type SizeItem = { isUnavailable: boolean; value: string };

export class CreateShopProductDto {
  @IsString() article!: string;

  @Transform(({ value }) => toInt(value))
  @IsInt()
  @Min(0)
  price!: number;

  @IsString() title!: string;
  @IsString() info!: string;

  @IsOptional()
  @Transform(({ value }) => toInt(value))
  @IsInt()
  discountProcent?: number;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() sizesTitle?: string;

  @IsOptional()
  @Transform(({ value }) => parseJSON<SizeItem[]>(value))
  @IsArray()
  sizes?: SizeItem[];
}
