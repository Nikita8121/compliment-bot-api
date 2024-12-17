import { Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { COMPLIMENT_CREATOR_BOT_NAME } from '../constants';
import {
  CREATE_RECEIPENT_WIZARD_SCENE_ID,
  RECEIPENT_LIST_SCENE_ID,
} from './constant';

@Update()
export class ComplimentCreatorBotUpdate {
  constructor(@InjectBot(COMPLIMENT_CREATOR_BOT_NAME) private bot: Telegraf) {}

  /*  onModuleInit() {
    this.setupMenu();
  } */

  /*  private async setupMenu() {
    // Set commands for menu
    await this.bot.telegram.setMyCommands(commands);
  }
 */
  @Start()
  async onStart(@Ctx() ctx: Scenes.SceneContext) {
    ctx.setMyCommands([
      { command: 'start', description: 'Start' },
      { command: 'create_new_receipent', description: '➕ Add New Recipient' },
      { command: 'get_my_receipents', description: '👥 My Recipients' },
    ]);

    await ctx.reply('hello');
    return;
  }

  @Command('create_new_receipent')
  async onCreateNewRecipentCommand(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter(CREATE_RECEIPENT_WIZARD_SCENE_ID);
  }

  @Command('get_my_receipents')
  async onGetMyReceipentsCommand(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter(RECEIPENT_LIST_SCENE_ID);
  }
}
