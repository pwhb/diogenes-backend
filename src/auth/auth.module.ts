import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './auth.schema';
import { UsersModule } from 'src/users/users.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    ConfigsModule,
    UsersModule,
    TokensModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
