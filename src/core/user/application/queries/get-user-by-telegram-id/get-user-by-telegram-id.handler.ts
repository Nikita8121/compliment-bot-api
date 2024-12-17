import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByTelegramIdQuery } from './get-user-by-telegram-id.query';
import { ICommandResponse } from 'src/common/interfaces/command-response.type';
import { GetUserByTelegramIdQueryResponseDto } from '../../dtos';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ERRORS } from '@app/contracts';

@QueryHandler(GetUserByTelegramIdQuery)
export class GetUserByTelegramIdHandler
  implements
    IQueryHandler<
      GetUserByTelegramIdQuery,
      ICommandResponse<GetUserByTelegramIdQueryResponseDto>
    >
{
  private readonly logger = new Logger(GetUserByTelegramIdHandler.name);

  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    telegramId,
  }: GetUserByTelegramIdQuery): Promise<
    ICommandResponse<GetUserByTelegramIdQueryResponseDto>
  > {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          telegramUserId: telegramId,
        },
      });

      if (!user) {
        return {
          isSuccess: false,
          code: ERRORS.USER_NOT_FOUND.code,
          message: ERRORS.USER_NOT_FOUND.message,
        };
      }

      return {
        isSuccess: true,
        data: new GetUserByTelegramIdQueryResponseDto({
          ...user,
        }),
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch user by telegramId: ${telegramId}`,
        error,
      );

      return {
        isSuccess: false,
        code: ERRORS.USER_FETCH_FAILED.code,
        message: ERRORS.USER_FETCH_FAILED.message,
      };
    }
  }
}
