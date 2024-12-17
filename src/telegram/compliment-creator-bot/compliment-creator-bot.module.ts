import { Module } from '@nestjs/common';
import { ComplimentCreatorBotUpdate } from './compliment-creator-bot.update';
import { AddRecipientWizard } from './scenes';
import { RecipientListScene } from './scenes/receipent-list.scene';
import { EditRecipientScene } from './scenes/edit-receipent.scene';

@Module({
  providers: [
    ComplimentCreatorBotUpdate,
    AddRecipientWizard,
    ScheduleManagerScene,
    RecipientListScene,
    EditRecipientScene,
  ],
})
export class ComplimentCreatorBotModule {}
