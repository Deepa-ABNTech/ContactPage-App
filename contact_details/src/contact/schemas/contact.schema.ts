import * as mongoose from 'mongoose';

export const ContactSchema = new mongoose.Schema({
  id: Number,
  FirstName: {
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  LastName: {
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  Email: {
    type: String,
    required: true,
    match: /^.+@.+\..+$/,
  },
  Phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  PictureUrl: {
    type: String,
    required: false,
  },
});
