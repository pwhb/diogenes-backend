import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';

export class QueryTemplateDto extends PartialType(
  PickType(CreateTemplateDto, [] as const),
) {
  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  q?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  sort_by?: string;
}
