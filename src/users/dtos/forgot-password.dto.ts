export class ForgotPasswordDto {
 
@IsEmail()
@MaxLength(250)
@IsNotEmpty()
  email: string;
}
