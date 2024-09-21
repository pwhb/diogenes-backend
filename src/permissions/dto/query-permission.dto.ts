import { PartialType, PickType } from '@nestjs/mapped-types';

import { IsOptional } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class QueryPermissionDto extends PartialType(
  PickType(CreatePermissionDto, ['name', 'method', 'path'] as const),
) {
  @IsOptional()
  q: string;

  @IsOptional()
  page: number;

  @IsOptional()
  size: number;

  @IsOptional()
  sort_by: string;
}
