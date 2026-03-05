import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  getRoot() {
    return { status: 'OK', msg: 'Service is running!' };
  }
}
