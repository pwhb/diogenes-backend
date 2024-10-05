import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  refresh_token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  deviceId: string;
}
