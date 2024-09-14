import { PartialType } from '@nestjs/swagger';
import { QuickRegisterAuthDto } from './quick-register-auth.dto';

export class UpdateAuthDto extends PartialType(QuickRegisterAuthDto) {}
