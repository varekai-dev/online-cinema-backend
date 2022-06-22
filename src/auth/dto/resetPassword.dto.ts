import { IsString, MinLength } from 'class-validator'

export class resetPasswordDto {
	@MinLength(6, {
		message: 'Password must be at least 6 characters',
	})
	@IsString()
	password: string
	@IsString()
	token: string
}
