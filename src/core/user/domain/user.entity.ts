import { randomUUID } from 'crypto';
import { CreateUserProps, IUser } from './user.types';

export class UserEntity implements IUser {
  id: string;
  telegramUserId: string;
  isAdmin: boolean;
  canCreateCompliments: boolean;

  constructor(user: IUser) {
    this.id = user.id;
    this.isAdmin = user.isAdmin;
    this.canCreateCompliments = user.canCreateCompliments;
    this.telegramUserId = user.telegramUserId;
  }

  static create(props: CreateUserProps) {
    const id = randomUUID();

    const user = new UserEntity({ id, ...props });

    return user;
  }

  static createReceipent(props: Pick<CreateUserProps, 'telegramUserId'>) {
    return UserEntity.create({
      ...props,
      isAdmin: false,
      canCreateCompliments: false,
    });
  }
}
