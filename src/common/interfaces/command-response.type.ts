export interface ICommandResponse<T = undefined> {
  isSuccess: boolean;
  data?: T;
  code?: string;
  message?: string;
}
