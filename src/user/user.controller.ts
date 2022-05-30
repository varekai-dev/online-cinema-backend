import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { User } from './decorators/user.decorators'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth('admin')
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id)
	}
}
