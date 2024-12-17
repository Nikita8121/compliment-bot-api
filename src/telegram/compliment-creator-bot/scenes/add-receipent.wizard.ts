import { Markup } from 'telegraf';
import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CREATE_RECEIPENT_WIZARD_SCENE_ID,
  EDIT_RECEIPENT_SCENE_ID,
  LANGUAGES,
  TIMEZONES,
} from '../constant';
import { groupArray } from 'src/common/utils/functions.utils';
import {
  AddReceipentWizardContext,
  ScheduleState,
} from '../compliment-creator-bot.interface';

@Wizard(CREATE_RECEIPENT_WIZARD_SCENE_ID)
export class AddRecipientWizard {
  // Step 1: Get username
  @WizardStep(1)
  async startStep(@Ctx() ctx: AddReceipentWizardContext) {
    await ctx.reply(
      "✨ Let's set up a new recipient!\n\n" +
        'Please share a Telegram user by clicking the button below:',
      Markup.keyboard([
        Markup.button.userRequest('👤 Share User', 1, {
          user_is_bot: false,
        }),
        '❌ Cancel',
      ])
        .oneTime()
        .resize(),
    );

    ctx.wizard.next();
    return;
  }

  // Step 2: Handle username and ask for name
  @WizardStep(2)
  async tgUsernameStep(
    @Ctx()
    ctx: AddReceipentWizardContext,
  ) {
    const text = ctx.text;

    if (text === '❌ Cancel') {
      await ctx.reply('Operation cancelled', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const userShared = ctx?.message.user_shared;

    if (!userShared) {
      await ctx.reply('Please share a user using the button');
      return;
    }

    ctx.wizard.state.tgUserId = userShared.userId;

    await ctx.reply(
      '👤 Great! Now, what name should I use in compliments?',
      Markup.keyboard([['↩️ Back', '❌ Cancel']])
        .oneTime()
        .resize(),
    );

    ctx.wizard.next();
    return;
  }

  // Step 3: Handle name and ask for language
  @WizardStep(3)
  async nameStep(@Ctx() ctx: AddReceipentWizardContext) {
    const text = ctx.text;

    if (!text || text === '❌ Cancel') {
      await ctx.reply('Operation cancelled', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    if (text === '↩️ Back') {
      await this.startStep(ctx);
      return ctx.wizard.selectStep(1);
    }

    ctx.wizard.state.name = text;

    await ctx.reply(
      '🌐 Select compliment language:',
      Markup.inlineKeyboard([
        Object.entries(LANGUAGES).map(([key, value]) => {
          return Markup.button.callback(value, key);
        }),
        [Markup.button.callback('↩️ Back', 'back')],
        [Markup.button.callback('❌ Cancel', 'cancel')],
      ]),
    );

    ctx.wizard.next();
    return;
  }

  @WizardStep(4)
  async languageStep(@Ctx() ctx: AddReceipentWizardContext) {
    const text = ctx.callbackQuery.data;

    if (!text || text === 'cancel') {
      await ctx.reply('Operation cancelled', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    if (text === 'back') {
      await this.nameStep(ctx);
      return ctx.wizard.selectStep(2);
    }

    ctx.wizard.state.language = text as keyof typeof LANGUAGES;

    await ctx.reply(
      '🌍 Select timezone:',
      Markup.inlineKeyboard([
        ...groupArray(
          Object.entries(TIMEZONES).map(([key, value]) => {
            return Markup.button.callback(value, key);
          }),
          1,
        ),
        [Markup.button.callback('↩️ Back', 'back')],
        [Markup.button.callback('❌ Cancel', 'cancel')],
      ]),
    );

    ctx.wizard.next();
    return;
  }

  // Step 5: Handle timezone and ask for schedule
  @WizardStep(5)
  async timezoneStep(@Ctx() ctx: AddReceipentWizardContext) {
    const text = ctx.callbackQuery.data;

    if (!text || text === 'back') {
      ctx.wizard.selectStep(4);
      return await this.languageStep(ctx);
    }

    ctx.wizard.state.timezone = text as keyof typeof TIMEZONES;

    await ctx.reply(
      '📝 Finally, tell me about them:\n' +
        'What are their interests, achievements, or special qualities?\n\n' +
        'This helps me generate more personal compliments!',
      Markup.keyboard([['↩️ Back', '❌ Cancel']])
        .oneTime()
        .resize(),
    );

    ctx.wizard.next();
    return;
  }

  // Step 6: Handle description and show summary
  @WizardStep(6)
  async descriptionStep(@Ctx() ctx: AddReceipentWizardContext) {
    const text = ctx.text;

    if (!text) {
      await ctx.reply('Write smth...');
      return;
    }

    if (text === 'cancel') {
      await ctx.reply('Operation cancelled', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    if (text === 'back') {
      ctx.wizard.selectStep(5);
      return await this.timezoneStep(ctx);
    }

    ctx.wizard.state.description = text;

    // Show summary and ask for confirmation
    const summary =
      `📋 Please review the recipient details:\n\n` +
      `👤 Name: ${ctx.wizard.state.name}\n` +
      `🌐 Language: ${LANGUAGES[ctx.wizard.state.language]}\n` +
      `🌍 Timezone: ${TIMEZONES[ctx.wizard.state.timezone]}\n` +
      `📝 Description: ${ctx.wizard.state.description}\n\n` +
      `Is everything correct?`;

    await ctx.reply(
      summary,
      Markup.keyboard([['✅ Confirm', '✏️ Edit', '❌ Cancel']])
        .oneTime()
        .resize(),
    );

    ctx.wizard.next();
    return;
  }

  // Final Step: Handle approve
  @WizardStep(7)
  async approveStep(@Ctx() ctx: AddReceipentWizardContext) {
    const text = ctx.text;

    if (!text) {
      await ctx.reply('Please select an option');
      return;
    }

    if (text === '❌ Cancel') {
      await ctx.reply('Operation cancelled', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    if (text === '✏️ Edit') {
      await ctx.reply(
        "Let's start over to edit the details",
        Markup.removeKeyboard(),
      );
      await this.startStep(ctx);
      return ctx.wizard.selectStep(1);
    }

    if (text === '✅ Confirm') {
      await ctx.reply(
        '✨ Perfect! Recipient has been added successfully!\n\n' +
          "Now let's set up their schedule.",
        Markup.removeKeyboard(),
      );

      ctx.scene.enter(EDIT_RECEIPENT_SCENE_ID, {
        recipientId: 1,
      } as ScheduleState);

      return;
    }

    await ctx.reply('Please use the provided buttons to respond');
    return;
  }
}
