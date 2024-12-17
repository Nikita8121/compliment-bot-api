export * from './get-user-by-telegram-id/get-user-by-telegram-id.query';

import { GetUserByTelegramIdHandler } from './get-user-by-telegram-id/get-user-by-telegram-id.handler';

export const QUERY_HANDLERS = [GetUserByTelegramIdHandler];
