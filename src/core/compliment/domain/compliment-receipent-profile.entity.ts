import { randomUUID } from 'crypto';
import {
  CreateComplimentReceipentProfileProps,
  IComplimentReceipentProfile,
  UpdateComplimentReceipentProfileProps,
} from './compliment.types';

export class ComplimentReceipentProfileEntity
  implements IComplimentReceipentProfile
{
  id: string;
  name: string;
  language: string;
  timeZone: string;
  description: string;
  assignmentId: string;

  constructor(complimentReceipentProfile: IComplimentReceipentProfile) {
    this.id = complimentReceipentProfile.id;
    this.name = complimentReceipentProfile.name;
    this.language = complimentReceipentProfile.language;
    this.timeZone = complimentReceipentProfile.timeZone;
    this.description = complimentReceipentProfile.description;
    this.assignmentId = complimentReceipentProfile.assignmentId;
  }

  static create(props: CreateComplimentReceipentProfileProps) {
    const id = randomUUID();

    const complimentReceipentProfile = new ComplimentReceipentProfileEntity({
      id,
      ...props,
    });

    return complimentReceipentProfile;
  }

  update({
    name,
    language,
    timeZone,
    description,
  }: UpdateComplimentReceipentProfileProps) {
    this.name = name ? name : this.name;
    this.language = language ? language : this.language;
    this.timeZone = timeZone ? timeZone : this.timeZone;
    this.description = description ? description : this.description;
  }
}
