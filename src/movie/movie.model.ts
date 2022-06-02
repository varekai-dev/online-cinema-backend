import { GenreModel } from './../genre/genre.model'
import { ActorModel } from './../actor/actor.model'
import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface MovieModel extends Base {}

export class Parameters {
	@prop()
	year: number

	@prop()
	duration: number

	@prop()
	country: string
}

export class MovieModel extends TimeStamps {
	@prop()
	poster: string

	@prop()
	bigPoster: string

	@prop()
	title: string

	@prop()
	description: string

	@prop({ unique: true })
	slug: string

	@prop({ default: 4.0 })
	rating?: number

	@prop({ default: 0 })
	countOpened?: number

	@prop()
	parameters?: Parameters

	@prop()
	videoUrl: string

	@prop({ ref: () => GenreModel })
	genres: Ref<GenreModel>[]

	@prop({ ref: () => ActorModel })
	actors: Ref<ActorModel>[]

	@prop({ default: false })
	isSendTelegram?: boolean
}
