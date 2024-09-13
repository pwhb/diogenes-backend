import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ENV from './config/env';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }
  getHello(): object {
    const env = this.configService.get(ENV.NODE_ENV) ? `(${this.configService.get(ENV.NODE_ENV)})` : 'unknown'
    return {
      name: `diogenes backend ${env}`,
      version: this.configService.get(ENV.VERSION)
    };
  }
}
