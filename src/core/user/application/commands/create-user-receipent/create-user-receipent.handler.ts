import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserReceipentCommand } from './create-user-receipent.command';
import { ICommandResponse } from 'src/common/interfaces/command-response.type';
import { UserRepository } from 'src/core/user/infrastracture/repositories/user.repository';
import { ERRORS } from '@app/contracts';
import { UserEntity } from 'src/core/user/domain/user.entity';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateUserReceipentCommand)
export class CreateUserReceipentHandler
  implements ICommandHandler<CreateUserReceipentCommand, ICommandResponse>
{
  private readonly logger = new Logger(CreateUserReceipentHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    telegramUserId,
  }: CreateUserReceipentCommand): Promise<ICommandResponse> {
    this.logger.log(`Creating user with telegramId: ${telegramUserId}`);
    try {
      const isUserExists =
        !!(await this.userRepository.findByTelegramId(telegramUserId));

      if (isUserExists) {
        this.logger.log(
          `Failed to create user receipent with telegramId: ${telegramUserId}, because it already exists`,
        );

        return {
          isSuccess: false,
          code: ERRORS.USER_ALREADY_EXISTS.code,
          message: ERRORS.USER_ALREADY_EXISTS.message,
        };
      }

      const user = UserEntity.createReceipent({
        telegramUserId,
      });

      await this.userRepository.create(user);

      return {
        isSuccess: true,
      };
    } catch (error) {
      this.logger.error('Failed to create user receipent. error', error);

      return {
        isSuccess: false,
        code: ERRORS.USER_CREATE_FAILED.code,
        message: ERRORS.USER_CREATE_FAILED.message,
      };
    }
  }
}
