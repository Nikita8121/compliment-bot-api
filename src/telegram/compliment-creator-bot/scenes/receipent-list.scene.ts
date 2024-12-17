// scenes/recipient-list.scene.ts
import { Scene, SceneEnter, Action, Ctx } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { RECEIPENT_LIST_SCENE_ID } from '../constant';

// Mock data
const MOCK_RECIPIENTS = [
  {
    id: '1',
    name: 'John',
    username: 'john_doe',
    schedules: ['9:00 AM', '6:00 PM'],
    timezone: 'UTC+1',
    language: 'English',
  },
  {
    id: '2',
    name: 'Sarah',
    username: 'sarah123',
    schedules: ['8:00 AM'],
    timezone: 'UTC-5',
    language: 'English',
  },
  {
    id: '3',
    name: 'Miguel',
    username: 'miguel_sp',
    schedules: ['2:00 PM', '8:00 PM'],
    timezone: 'UTC+2',
    language: 'Spanish',
  },
];

@Scene(RECEIPENT_LIST_SCENE_ID)
export class RecipientListScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    console.log('hello');
    await this.showRecipientList(ctx);
    return;
  }

  private async showRecipientList(ctx: Scenes.SceneContext) {
    const message = this.formatRecipientListMessage();
    const keyboard = this.createRecipientListKeyboard();

    await ctx.reply(message, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }

  private formatRecipientListMessage(): string {
    let message = '👥 <b>Your Recipients</b>\n\n';

    if (MOCK_RECIPIENTS.length === 0) {
      message += 'No recipients yet. Add someone new!';
      return message;
    }

    MOCK_RECIPIENTS.forEach((recipient, index) => {
      message += `${index + 1}. <b>${recipient.name}</b> (@${recipient.username})\n`;
      message += `   ⏰ ${recipient.schedules.join(', ')}\n`;
      message += `   🌍 ${recipient.timezone}\n\n`;
    });

    return message;
  }

  private createRecipientListKeyboard() {
    const keyboard = {
      inline_keyboard: [] as any[][],
    };

    // Action buttons for each recipient
    MOCK_RECIPIENTS.forEach((recipient) => {
      keyboard.inline_keyboard.push([
        {
          text: `✏️ Edit ${recipient.name}`,
          callback_data: `edit_recipient:${recipient.id}`,
        },
        {
          text: '❌',
          callback_data: `delete_recipient:${recipient.id}`,
        },
      ]);
    });

    // Add new recipient button
    keyboard.inline_keyboard.push([
      {
        text: '➕ Add New Recipient',
        callback_data: 'add_recipient',
      },
    ]);

    // Back to main menu button
    keyboard.inline_keyboard.push([
      {
        text: '↩️ Back',
        callback_data: 'back_to_menu',
      },
    ]);

    return keyboard;
  }

  @Action(/edit_recipient:(.+)/)
  async onEditRecipient(@Ctx() ctx: Scenes.SceneContext) {
    const recipientId = 1;
    await ctx.scene.enter('edit-recipient', { recipientId: '1' });
  }

  @Action(/delete_recipient:(.+)/)
  async onDeleteRecipient(@Ctx() ctx: Scenes.SceneContext) {
    const recipientId = 1;

    await ctx.reply('Are you sure you want to delete this recipient?', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Yes',
              callback_data: `confirm_delete:${recipientId}`,
            },
            {
              text: '❌ No',
              callback_data: 'cancel_delete',
            },
          ],
        ],
      },
    });
  }

  @Action(/confirm_delete:(.+)/)
  async onConfirmDelete(@Ctx() ctx: Scenes.SceneContext) {
    // Here would be actual delete logic
    await ctx.answerCbQuery('Recipient deleted');
    await this.showRecipientList(ctx);
  }

  @Action('cancel_delete')
  async onCancelDelete(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.answerCbQuery('Deletion cancelled');
    await this.showRecipientList(ctx);
  }

  @Action('add_recipient')
  async onAddRecipient(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter('add-recipient');
  }

  @Action('back_to_menu')
  async onBackToMenu(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter('main-menu');
  }
}
