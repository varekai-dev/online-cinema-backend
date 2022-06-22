import {
	Controller,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
	HttpCode,
	Get,
	Query,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { resetPasswordDto } from './dto/resetPassword.dto'
import { restorePasswordDto } from './dto/restorePassword.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto)
	}

	@HttpCode(200)
	@Get('verify-email')
	async verifyEmail(@Query('token') token: string) {
		return this.authService.emailVerification(token)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('reset-password')
	async restorePassword(@Body() body: resetPasswordDto) {
		return this.authService.restorePassword(body)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('restore-password')
	async resetPassword(@Body('email') email: string) {
		return this.authService.resetPassword(email)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}
}
