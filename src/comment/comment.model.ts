import { MovieModel } from './../movie/movie.model'
import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from 'src/user/user.model'

export interface CommentModel extends Base {}

export class CommentModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	user: Ref<UserModel>

	@prop({ ref: () => MovieModel })
	movie: Ref<MovieModel>

	@prop()
	content: string
}
