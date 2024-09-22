import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import ENV from './config/env';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigsModule } from './configs/configs.module';
import { PermissionsModule } from './permissions/permissions.module';
import { MenusModule } from './menus/menus.module';
import { TokensModule } from './tokens/tokens.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TemplatesModule } from './templates/templates.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RoleGuard } from './auth/auth.guard';
import { HomeModule } from './home/home.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(ENV.MONGODB_URI),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    ConfigsModule,
    PermissionsModule,
    MenusModule,
    TokensModule,
    TemplatesModule,
    HomeModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
