import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from './configs.schema';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  exports: [ConfigsService],
  controllers: [ConfigsController],
  providers: [ConfigsService, CacheService],
})
export class ConfigsModule {}
