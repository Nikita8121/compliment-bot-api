export * from './create-user-receipent/create-user-receipent.command';

import { CreateUserReceipentHandler } from './create-user-receipent/create-user-receipent.handler';

export const COMMAND_HANDLERS = [CreateUserReceipentHandler];
