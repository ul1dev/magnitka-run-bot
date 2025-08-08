import { Module, forwardRef } from '@nestjs/common';
import { GeneralValidations } from './general.validations';
import { GeneralButtons } from './general.buttons';
import { GeneralMiddlewares } from './general.middlewares';
import { GeneralPresets } from './general.presets';
import { UsersModule } from 'src/users/users.module';
import { ListenersModule } from 'src/libs/listeners/listeners.module';
import { BansModule } from 'src/bans/bans.module';
import { ChainModule } from 'src/libs/chain/chain.module';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ListenersModule),
    forwardRef(() => BansModule),
    forwardRef(() => ChainModule),
    MenuModule,
  ],
  providers: [
    GeneralValidations,
    GeneralButtons,
    GeneralMiddlewares,
    GeneralPresets,
  ],
  exports: [
    GeneralValidations,
    GeneralButtons,
    GeneralMiddlewares,
    GeneralPresets,
  ],
})
export class GeneralModule {}
