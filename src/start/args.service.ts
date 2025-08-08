import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Context } from 'telegraf';
import { StartService } from './start.service';

@Injectable()
export class StartArgsService {
  constructor(
    @Inject(forwardRef(() => StartService))
    private readonly startService: StartService,
  ) {}

  async argsHandler(ctx: Context | any) {
    const arg = ctx?.args[0];

    // if () {
    // }

    await this.startService.sendStartMessage(ctx);
  }
}
