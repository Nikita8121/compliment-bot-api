import { IRepositoryMapper } from 'src/common/interfaces/repository-mapper.interface';
import { UserEntity } from '../../domain/user.entity';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryMapper
  implements IRepositoryMapper<UserEntity, User>
{
  mapToEntity(schema: User): UserEntity {
    return new UserEntity({
      ...schema,
    });
  }

  mapToDBSchema({
    id,
    telegramUserId,
    isAdmin,
    canCreateCompliments,
  }: UserEntity): User {
    return {
      id,
      telegramUserId,
      isAdmin,
      canCreateCompliments,
    };
  }
}
