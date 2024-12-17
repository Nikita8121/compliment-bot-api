import { Module } from '@nestjs/common';
import { ComplimentCreatorBotModule } from './compliment-creator-bot/compliment-creator-bot.module';
import { ComplimentReceipentBotModule } from './compliment-receipent-bot/compliment-receipent-bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { complimentCreatorBotSessionMiddleware } from './compliment-creator-bot/session.middleware';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/common/config/envConfig.schema';
import { COMPLIMENT_CREATOR_BOT_NAME } from './constants';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      botName: COMPLIMENT_CREATOR_BOT_NAME,
      useFactory: (configService: ConfigService<Env>) => {
        return {
          token: configService.getOrThrow(
            'TELEGRAM_BOT_COMPLIMENT_CREATOR_TOKEN',
          ),
          middlewares: [complimentCreatorBotSessionMiddleware],
          include: [ComplimentCreatorBotModule],
        };
      },
    }),
    ComplimentCreatorBotModule,
    ComplimentReceipentBotModule,
  ],
})
export class TelegramModule {}
