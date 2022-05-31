import { genSalt, hash } from 'bcryptjs'
import { UserModel } from 'src/user/user.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}
	async byId(id: string): Promise<DocumentType<UserModel>> {
		const user = await this.UserModel.findById(id).exec()

		if (!user) throw new NotFoundException('User not found')

		return user
	}
	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id)
		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Email already exists')
		}
		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}
		user.email = dto.email
		if (dto.isAdmin || dto.isAdmin === false) {
			user.isAdmin = dto.isAdmin
		}
		await user.save()
		return
	}
	async getCount() {
		return this.UserModel.find().count().exec()
	}
	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [{ email: new RegExp(searchTerm, 'i') }],
			}
		}
		return this.UserModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: -1,
			})
			.exec()
	}
	async delete(_id: string) {
		return this.UserModel.findByIdAndDelete(_id).exec()
	}
}
