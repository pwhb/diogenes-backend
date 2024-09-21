import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  method: string;

  slug?: string;
}
