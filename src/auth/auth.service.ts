import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash, compare } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid'
import { AuthDto } from './dto/auth.dto'
import { UserModel } from '../user/user.model'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly ConfigService: ConfigService,
		@InjectSendGrid() private readonly sendGridService: SendGridService,
		private readonly jwtService: JwtService
	) {}

	async login({ email, password }: AuthDto) {
		const user = await this.validateUser(email, password)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async register({ email, password }: AuthDto) {
		const salt = await genSalt(10)
		const newUser = new this.UserModel({
			email,
			password: await hash(password, salt),
		})
		const user = await newUser.save()

		const verificationToken = await this.issueVerificationToken(
			String(user._id)
		)
		const message = {
			to: email,
			from: 'serhijsav@gmail.com',
			subject: 'Online Cinema email verification',
			text: 'Online Cinema email verification',
			html: `<h3>To verify your email click this link  <a href="${this.ConfigService.get(
				'CLIENT_URI'
			)}/auth?token=${verificationToken}">link</a></h3>`,
		}

		await this.sendGridService.send(message)

		return {
			user: this.returnUserFields(user),
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('Please sign in!')

		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid token or expired!')

		const user = await this.UserModel.findById(result._id)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async findByEmail(email: string) {
		return this.UserModel.findOne({ email }).exec()
	}

	async validateUser(email: string, password: string): Promise<UserModel> {
		const user = await this.findByEmail(email)
		if (!user) throw new UnauthorizedException('User not found')
		if (!user.isVerified)
			throw new UnauthorizedException('Email is not verified')
		const isValidPassword = await compare(password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	async issueVerificationToken(userId: string) {
		const data = { _id: userId }
		const issueVerificationToken = await this.jwtService.signAsync(data, {
			expiresIn: '48h',
		})
		return issueVerificationToken
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		})

		return { refreshToken, accessToken }
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
		}
	}

	async emailVerification(verificationToken: string) {
		const result = await this.jwtService.verifyAsync(verificationToken)
		if (!result) throw new UnauthorizedException('Invalid token or expired!')

		const user = await this.UserModel.findById(result._id)
		if (user.isVerified)
			throw new UnauthorizedException('Email is already verified')
		if (!user) throw new UnauthorizedException('User not found')

		user.isVerified = true

		await user.save()
		const tokens = await this.issueTokenPair(String(user._id))
		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}
}
