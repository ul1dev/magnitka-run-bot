import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  id!: string; // ShopProduct.id

  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsInt()
  @Min(1)
  count!: number;

  @IsOptional()
  @IsString()
  size?: string;
}

function parseProducts(value: unknown): unknown {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return value;
}

export class CreateOrderDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  deliveryMethod!: string;

  @Transform(({ value }) => parseProducts(value))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  products!: CreateOrderItemDto[];
}
