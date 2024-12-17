import { IQuery } from '@nestjs/cqrs';

export class GetUserByTelegramIdQuery implements IQuery {
  constructor(public readonly telegramId: string) {}
}
