import { UserEntity } from '../../domain/user.entity';
import { IUser } from '../../domain/user.types';

export class GetUserByTelegramIdQueryResponseDto implements IUser {
  id: string;
  telegramUserId: string;
  isAdmin: boolean;
  canCreateCompliments: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.telegramUserId = user.telegramUserId;
    this.isAdmin = user.isAdmin;
    this.canCreateCompliments = user.canCreateCompliments;
  }
}
