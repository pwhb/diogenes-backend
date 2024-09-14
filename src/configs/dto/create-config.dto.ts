import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export enum ConfigType {
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  NUMBER = 'NUMBER',
}

export type TConfig = {
  code: string;
  name: string;
  value: any;
  type: ConfigType;
};

export class CreateConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  value: any;

  @ApiProperty({ default: [] })
  @IsArray()
  subConfigs: TConfig[];
}
