import { ActorModel } from './actor.model'
import { InjectModel } from 'nestjs-typegoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorDto } from './actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async bySlug(slug: string) {
		const findSlug = await this.ActorModel.findOne({ slug }).exec()
		if (!findSlug) throw new NotFoundException('Slug not found')
		return findSlug
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
				],
			}
		}

		//Aggregation

		return this.ActorModel.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				foreignField: 'actors',
				localField: '_id',
				as: 'movies',
			})
			.addFields({
				countMovies: {
					$size: '$movies',
				},
			})
			.project({ __v: 0, updatedAt: 0, movies: 0 })
			.sort({
				createdAt: -1,
			})
			.exec()
	}

	//Admin

	async byId(id: string) {
		const actor = await this.ActorModel.findById(id).exec()
		if (!actor) throw new NotFoundException('Actor not found')
		return actor
	}

	async getCount() {
		return this.ActorModel.find().count().exec()
	}

	async update(_id: string, dto: ActorDto) {
		const updateDoc = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Actor not found')

		return updateDoc
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		}
		const actor = await this.ActorModel.create(defaultValue)
		return actor._id
	}

	async delete(_id: string) {
		const deleteDoc = this.ActorModel.findByIdAndDelete(_id).exec()
		if (!deleteDoc) throw new NotFoundException('Actor not found')
		return deleteDoc
	}
}
