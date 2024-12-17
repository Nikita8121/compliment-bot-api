import { Context, Scenes } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';

export interface TgCtx extends Context {
  callbackQuery: Context['callbackQuery'] & {
    data?: string;
  };
  message: Context['message'] & {
    user_shared?: {
      userId: number;
      requires_id: number;
    };
  };
}

export type TgWizardCtx<TState> = TgCtx &
  WizardContext & {
    wizard: WizardContext['wizard'] & {
      state: WizardContext['wizard']['state'] & TState;
    };
  };

export type TgSceneCtx<TState> = TgCtx &
  Scenes.SceneContext & {
    scene: {
      state: TState;
    };
  };
