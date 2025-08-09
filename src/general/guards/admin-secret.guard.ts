import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const headerRaw =
      req.headers['x-admin-secret'] ||
      req.headers['x-admin-password'] ||
      req.headers['authorization'];

    const envSecret = this.config.get<string>('ADMIN_SECRET');
    if (!envSecret) {
      throw new UnauthorizedException('ADMIN_SECRET is not configured');
    }

    const header = Array.isArray(headerRaw) ? headerRaw[0] : headerRaw;
    if (!header) throw new UnauthorizedException('Missing admin secret');

    const token =
      typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice(7)
        : (header as string);

    if (token !== envSecret) {
      throw new UnauthorizedException('Invalid admin secret');
    }
    return true;
  }
}
