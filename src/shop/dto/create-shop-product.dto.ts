import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

function toOptionalInt(v: any) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'string' && v.trim() === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
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

  @Transform(({ value }) => toOptionalInt(value))
  @IsInt()
  @Min(0)
  price!: number;

  @IsString() title!: string;
  @IsString() info!: string;

  @IsOptional()
  @Transform(({ value }) => toOptionalInt(value))
  @IsInt()
  @Min(0)
  discountProcent?: number;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() sizesTitle?: string;

  @IsOptional()
  @Transform(({ value }) => parseJSON<SizeItem[]>(value))
  @IsArray()
  sizes?: SizeItem[];
}
