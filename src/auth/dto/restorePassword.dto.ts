import { IsEmail } from 'class-validator'

export class restorePasswordDto {
	@IsEmail()
	email: string
}
