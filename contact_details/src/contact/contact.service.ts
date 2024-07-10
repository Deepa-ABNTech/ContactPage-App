// contact.service.ts
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './interfaces/contact.interface';
import { ContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('Contact') private readonly contactModel: Model<Contact>,
  ) {}

  public async getContact(): Promise<ContactDto[]> {
    const contacts = await this.contactModel.find().exec();
    if (!contacts || !contacts[0]) {
      throw new HttpException('Not Found', 404);
    }
    return contacts;
  }

  public async createContact(contact: ContactDto): Promise<ContactDto> {
    console.log('Creating new contact:', contact);
    const newContact = new this.contactModel(contact);
    const savedContact = await newContact.save();
    console.log('Saved new contact:', savedContact);
    return savedContact;
  }

  public async getContactById(id: number): Promise<ContactDto> {
    const contact = await this.contactModel.findOne({ id }).exec();
    if (!contact) {
      throw new HttpException('Not Found', 404);
    }
    return contact;
  }

  public async deleteContactById(id: number): Promise<any> {
    const contact = await this.contactModel.deleteOne({ id }).exec();
    if (contact.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    }
    return contact;
  }

  public async updateContact(
    id: number,
    updateContactDto: ContactDto,
  ): Promise<Contact> {
    console.log(`Attempting to update contact with ID: ${id}`);
    const existingContact = await this.contactModel.findOne({ id });
    if (!existingContact) {
      console.log(`Contact with ID: ${id} not found`);
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    Object.assign(existingContact, updateContactDto);
    console.log(`Updated contact: ${existingContact}`);
    return existingContact.save();
  }
}
