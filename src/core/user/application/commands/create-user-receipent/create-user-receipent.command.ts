import { ICommand } from '@nestjs/cqrs';

export class CreateUserReceipentCommand implements ICommand {
  constructor(public readonly telegramUserId: string) {}
}
