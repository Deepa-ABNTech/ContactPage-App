import { Document } from 'mongoose';
export interface Contact extends Document {
  readonly id: number;
  readonly FirstName: string;
  readonly LastName: string;
  readonly Email: string;
  readonly Phone: string;
}
