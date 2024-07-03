import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './contact.dto';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

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
  @ApiParam({ name: 'id', required: true, description: 'Contact ID' })
  @ApiQuery({
    name: 'property_name',
    required: true,
    description: 'Property name to update',
  })
  @ApiQuery({
    name: 'property_value',
    required: true,
    description: 'New value for the property',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated contact',
    type: ContactDto,
  })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  public async putContactById(
    @Param('id') id: number,
    @Query('property_name') propertyName: string,
    @Query('property_value') propertyValue: string,
  ): Promise<ContactDto> {
    console.log('Received PUT request:', { id, propertyName, propertyValue });
    try {
      const result = await this.contactService.putContactById(
        id,
        propertyName,
        propertyValue,
      );
      console.log('Updated contact:', result);
      return result;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }
}
