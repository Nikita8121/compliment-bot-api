export type CreateUserProps = {
  telegramUserId: string;
  isAdmin: boolean;
  canCreateCompliments: boolean;
};

export interface IUser {
  id: string;
  telegramUserId: string;
  isAdmin: boolean;
  canCreateCompliments: boolean;
}
