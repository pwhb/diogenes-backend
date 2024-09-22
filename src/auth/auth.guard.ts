import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from 'src/tokens/tokens.service';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/permissions/permissions.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.tokensService.verifyAsync(token);
      if (!payload || !payload.userId) throw new UnauthorizedException();
      const user = await this.usersService.findUserById(payload.userId);
      if (!user) throw new UnauthorizedException();
      request['user'] = user;
      request['deviceId'] = payload.deviceId;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new HttpException(error.name, 401);
      }
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      const { method, params, path } = request;
      const parsed = this.parseUrl(path, params);
      const allowed = await this.permissionsService.checkPermission(
        { path: parsed, method: method },
        request.user.role,
      );
      return allowed;
    }
    return false;
  }

  private parseUrl(url: string, params: Record<string, string>) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(value, `:${key}`);
    }
    return url;
  }
}
