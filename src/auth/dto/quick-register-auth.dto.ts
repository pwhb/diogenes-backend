import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class QuickRegisterAuthDto {
    @ApiProperty()
    @IsNotEmpty()
    deviceId: string
}
