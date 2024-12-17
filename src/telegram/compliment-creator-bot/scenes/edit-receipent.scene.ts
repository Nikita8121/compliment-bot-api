// scenes/edit-recipient.scene.ts
import { Scene, SceneEnter, Action, Ctx, On } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { EDIT_RECEIPENT_SCENE_ID } from '../constant';

interface Schedule {
  hour: number;
  minute: number;
}

interface Recipient {
  id: string;
  name: string;
  username: string;
  schedules: Schedule[];
  timezone: string;
  language: string;
  description: string;
}

const MOCK_RECIPIENTS: Recipient[] = [
  {
    id: '1',
    name: 'John',
    username: 'john_doe',
    schedules: [
      { hour: 9, minute: 0 },
      { hour: 18, minute: 0 },
    ],
    timezone: 'UTC+1',
    language: 'English',
    description: 'Loves photography and hiking',
  },
  {
    id: '2',
    name: 'Sarah',
    username: 'sarah123',
    schedules: [{ hour: 8, minute: 0 }],
    timezone: 'UTC-5',
    language: 'English',
    description: 'Passionate about cooking',
  },
];

interface EditRecipientState {
  recipientId: string;
  editingField?: 'name' | 'language' | 'timezone' | 'schedule' | 'description';
}

@Scene(EDIT_RECEIPENT_SCENE_ID)
export class EditRecipientScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    const state = ctx.scene.state as EditRecipientState;
    await this.showEditMenu(ctx, state.recipientId);
  }

  private formatTime(schedule: Schedule): string {
    const hour12 = schedule.hour % 12 || 12;
    const period = schedule.hour >= 12 ? 'PM' : 'AM';
    const minute = schedule.minute.toString().padStart(2, '0');
    return `${hour12}:${minute} ${period}`;
  }

  private async showEditMenu(ctx: Scenes.SceneContext, recipientId: string) {
    const recipient = MOCK_RECIPIENTS.find((r) => r.id === recipientId);

    if (!recipient) {
      await ctx.reply('Recipient not found');
      await ctx.scene.enter('recipient-list');
      return;
    }

    const message = this.formatRecipientDetails(recipient);
    const keyboard = this.createEditKeyboard();

    await ctx.reply(message, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }

  private formatRecipientDetails(recipient: Recipient): string {
    const schedulesFormatted = recipient.schedules
      .map((s) => `• ${this.formatTime(s)}`)
      .join('\n');

    return `✏️ <b>Edit Recipient</b>

👤 Name: ${recipient.name}
📝 Username: @${recipient.username}
🔤 Language: ${recipient.language}
🌍 Timezone: ${recipient.timezone}

⏰ Scheduled Times:
${schedulesFormatted}

📝 Description:
${recipient.description}`;
  }

  private createEditKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: '👤 Edit Name', callback_data: 'edit:name' },
          { text: '🔤 Change Language', callback_data: 'edit:language' },
        ],
        [
          { text: '🌍 Change Timezone', callback_data: 'edit:timezone' },
          { text: '⏰ Edit Schedule', callback_data: 'edit:schedule' },
        ],
        [{ text: '📝 Edit Description', callback_data: 'edit:description' }],
        [{ text: '↩️ Back to List', callback_data: 'back_to_list' }],
      ],
    };
  }

  @Action(/edit:(.+)/)
  async onEditField(@Ctx() ctx: Scenes.SceneContext) {
    const state = ctx.scene.state as EditRecipientState;
    const field = ctx.match[1] as EditRecipientState['editingField'];
    state.editingField = field;

    const recipient = MOCK_RECIPIENTS.find((r) => r.id === state.recipientId);
    if (!recipient) return;

    switch (field) {
      case 'language':
        await this.showLanguageOptions(ctx);
        break;
      case 'timezone':
        await this.showTimezoneOptions(ctx);
        break;
      case 'schedule':
        await this.showScheduleOptions(ctx, recipient);
        break;
      default:
        await this.showTextInput(ctx, field);
    }
  }

  private async showLanguageOptions(ctx: Scenes.SceneContext) {
    await ctx.reply('Select new language:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🇺🇸 English', callback_data: 'set_lang:en' },
            { text: '🇪🇸 Spanish', callback_data: 'set_lang:es' },
          ],
          [
            { text: '🇫🇷 French', callback_data: 'set_lang:fr' },
            { text: '🇩🇪 German', callback_data: 'set_lang:de' },
          ],
          [{ text: '↩️ Cancel', callback_data: 'cancel_edit' }],
        ],
      },
    });
  }

  private async showTimezoneOptions(ctx: Scenes.SceneContext) {
    await ctx.reply('Select new timezone:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'UTC+0', callback_data: 'set_tz:UTC+0' },
            { text: 'UTC+1', callback_data: 'set_tz:UTC+1' },
            { text: 'UTC+2', callback_data: 'set_tz:UTC+2' },
          ],
          [
            { text: 'UTC-5', callback_data: 'set_tz:UTC-5' },
            { text: 'UTC-8', callback_data: 'set_tz:UTC-8' },
          ],
          [{ text: '↩️ Cancel', callback_data: 'cancel_edit' }],
        ],
      },
    });
  }

  private async showScheduleOptions(
    ctx: Scenes.SceneContext,
    recipient: Recipient,
  ) {
    const schedulesFormatted = recipient.schedules
      .map((s) => this.formatTime(s))
      .join('\n');

    await ctx.reply(`Current schedules:\n${schedulesFormatted}`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '➕ Add Time', callback_data: 'schedule:add' },
            { text: '❌ Remove Time', callback_data: 'schedule:remove' },
          ],
          [{ text: '↩️ Cancel', callback_data: 'cancel_edit' }],
        ],
      },
    });
  }

  private async showTextInput(ctx: Scenes.SceneContext, field: string) {
    const prompts: Record<string, string> = {
      name: 'Please enter new name:',
      description: 'Please enter new description:',
    };

    await ctx.reply(prompts[field], {
      reply_markup: {
        inline_keyboard: [
          [{ text: '↩️ Cancel', callback_data: 'cancel_edit' }],
        ],
      },
    });
  }

  @Action(/set_lang:(.+)/)
  async onLanguageSet(@Ctx() ctx: Scenes.SceneContext) {
    console.log(ctx.callbackQuery);
    const language = ctx.match[1];
    // Here would be actual update logic
    await ctx.answerCbQuery(`Language updated to: ${language}`);
    await this.showEditMenu(
      ctx,
      (ctx.scene.state as EditRecipientState).recipientId,
    );
  }

  @Action(/set_tz:(.+)/)
  async onTimezoneSet(@Ctx() ctx: Scenes.SceneContext) {
    const timezone = ctx.match[1];
    // Here would be actual update logic
    await ctx.answerCbQuery(`Timezone updated to: ${timezone}`);
    await this.showEditMenu(
      ctx,
      (ctx.scene.state as EditRecipientState).recipientId,
    );
  }

  @Action(/schedule:(add|remove)/)
  async onScheduleAction(@Ctx() ctx: Scenes.SceneContext) {
    const action = ctx.match[1];
    const state = ctx.scene.state as EditRecipientState;
    const recipient = MOCK_RECIPIENTS.find((r) => r.id === state.recipientId);

    if (!recipient) return;

    if (action === 'add') {
      await ctx.reply('Select time:', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🌅 8:00 AM', callback_data: 'add_time:8:00' },
              { text: '🌞 12:00 PM', callback_data: 'add_time:12:00' },
            ],
            [
              { text: '🌆 6:00 PM', callback_data: 'add_time:18:00' },
              { text: '🌙 9:00 PM', callback_data: 'add_time:21:00' },
            ],
            [{ text: '↩️ Cancel', callback_data: 'cancel_edit' }],
          ],
        },
      });
    } else {
      const keyboard = recipient.schedules.map((schedule) => [
        {
          text: this.formatTime(schedule),
          callback_data: `remove_time:${schedule.hour}:${schedule.minute}`,
        },
      ]);

      keyboard.push([{ text: '↩️ Cancel', callback_data: 'cancel_edit' }]);

      await ctx.reply('Select time to remove:', {
        reply_markup: { inline_keyboard: keyboard },
      });
    }
  }

  @Action(/add_time:(\d+):(\d+)/)
  async onAddTime(@Ctx() ctx: Scenes.SceneContext) {
    const hour = parseInt(ctx.match[1]);
    const minute = parseInt(ctx.match[2]);
    // Here would be actual update logic
    await ctx.answerCbQuery(`Time added: ${hour}:${minute}`);
    await this.showEditMenu(
      ctx,
      (ctx.scene.state as EditRecipientState).recipientId,
    );
  }

  @Action(/remove_time:(\d+):(\d+)/)
  async onRemoveTime(@Ctx() ctx: Scenes.SceneContext) {
    const hour = parseInt(ctx.match[1]);
    const minute = parseInt(ctx.match[2]);
    // Here would be actual update logic
    await ctx.answerCbQuery(`Time removed: ${hour}:${minute}`);
    await this.showEditMenu(
      ctx,
      (ctx.scene.state as EditRecipientState).recipientId,
    );
  }

  @On('text')
  async onText(@Ctx() ctx: Scenes.SceneContext) {
    const state = ctx.scene.state as EditRecipientState;
    const text = ctx.text;

    if (!state.editingField) return;

    // Here would be actual update logic
    await ctx.reply(`Updated ${state.editingField} to: ${text}`);
    state.editingField = undefined;
    await this.showEditMenu(ctx, state.recipientId);
  }

  @Action('cancel_edit')
  async onCancelEdit(@Ctx() ctx: Scenes.SceneContext) {
    const state = ctx.scene.state as EditRecipientState;
    state.editingField = undefined;
    await this.showEditMenu(ctx, state.recipientId);
  }

  @Action('back_to_list')
  async onBackToList(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter('recipient-list');
  }
}
