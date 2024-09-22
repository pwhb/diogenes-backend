import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { LangString } from '../templates.schema';

export class CreateTemplateDto {
  @ApiProperty()
  @IsObject()
  name: {
    en: string;
    my: string;
  };

  @ApiProperty()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsObject()
  config: {
    params: string[];
    init: string;
  };

  @ApiProperty()
  @IsObject()
  metadata: {
    icon?: string;
    image?: string;
    description?: LangString;
    rules?: LangString;
    messageTemplate?: LangString;
    gameModes?: string[];
    playersOptions?: string[];
  };
}
