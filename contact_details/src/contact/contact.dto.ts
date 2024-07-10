import { IsInt, IsString, IsEmail, Matches, IsOptional } from 'class-validator';

export class ContactDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message:
      'FirstName must contain only alphabets and spaces, and it should not be empty',
  })
  readonly FirstName: string;

  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message:
      'LastName must contain only alphabets and spaces, and it should not be empty',
  })
  readonly LastName: string;

  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address and it should not be empty',
    },
  )
  readonly Email: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be a string of 10 digits' })
  readonly Phone: string;

  @IsString()
  @IsOptional()
  readonly PictureUrl?: string;
}
