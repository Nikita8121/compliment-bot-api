import { Module } from '@nestjs/common';
import { COMMAND_HANDLERS } from './commands';
import { QUERY_HANDLERS } from './queries';

@Module({
  providers: [...COMMAND_HANDLERS, ...QUERY_HANDLERS],
})
export class ApplicationModule {}
