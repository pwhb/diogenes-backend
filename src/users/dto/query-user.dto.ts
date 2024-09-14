import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto extends PartialType(
  PickType(CreateUserDto, ['username'] as const),
) {
  @ApiProperty({ required: false })
  @IsOptional()
  q: string;

  @ApiProperty({ required: false })
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  size: number;

  @ApiProperty({ required: false })
  @IsOptional()
  sort_by: string;
}
