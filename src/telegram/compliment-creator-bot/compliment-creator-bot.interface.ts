import { TgWizardCtx, TgSceneCtx } from '../telegram.interface';
import { LANGUAGES, TIMEZONES } from './constant';

// Schedule manager
export interface Schedule {
  hour: number;
}

export interface ScheduleState {
  schedules: Schedule[];
  recipientId: number;
  editingIndex?: number;
}

export type ScheduleMangerSceneContext = TgSceneCtx<ScheduleState>;

// Add receipent
export type AddReceipentWizardContext = TgWizardCtx<{
  tgUserId: number;
  name: string;
  language: keyof typeof LANGUAGES;
  timezone: keyof typeof TIMEZONES;
  description: string;
}>;
