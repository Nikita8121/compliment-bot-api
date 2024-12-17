export interface IComplimentReceipentProfile {
  id: string;
  name: string;
  language: string;
  timeZone: string;
  description: string;
  assignmentId: string;
}

export type CreateComplimentReceipentProfileProps = {
  name: string;
  language: string;
  timeZone: string;
  description: string;
  assignmentId: string;
};

export type UpdateComplimentReceipentProfileProps = {
  name?: string;
  language?: string;
  timeZone?: string;
  description?: string;
};
