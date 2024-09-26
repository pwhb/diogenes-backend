import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { RoomVisibility } from 'src/rooms/rooms.schema';

export class CreateGroupDto {
  @ApiProperty()
  @IsArray()
  friendIds: string[];

  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  icon?: string;

  @ApiProperty()
  @IsOptional()
  visibility?: RoomVisibility;
}
