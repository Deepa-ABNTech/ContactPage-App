import * as mongoose from 'mongoose';
export const ContactSchema = new mongoose.Schema({
  id: Number,
  FirstName: String,
  LastName: String,
  Email: String,
  Phone: String,
});
