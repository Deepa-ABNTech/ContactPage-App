// contact.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  public getContact() {
    return this.contactService.getContact();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createContact(@Body() contact: ContactDto) {
    console.log('Received create contact request:', contact);
    try {
      const newContact = await this.contactService.createContact(contact);
      console.log('New contact created:', newContact);
      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  public async getContactById(@Param('id') id: number) {
    return this.contactService.getContactById(id);
  }

  @Delete(':id')
  public async deleteContactById(@Param('id') id: number) {
    return this.contactService.deleteContactById(id);
  }

  @Put(':id')
  public async updateContact(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: ContactDto,
  ) {
    console.log(`Received update request for contact ID: ${id}`);
    console.log('Update data:', updateContactDto);
    return this.contactService.updateContact(id, updateContactDto);
  }
}
