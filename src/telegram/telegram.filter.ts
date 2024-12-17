import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Catch()
export class BotFilter implements ExceptionFilter {
  private readonly logger = new Logger(BotFilter.name);

  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();

    this.logger.error(
      `Telegram bot error: ${exception.message}. Stack trace: ${exception.stack}`,
    );

    await ctx.replyWithHTML(`<b>Error</b>: ${exception.message}`);
  }
}
