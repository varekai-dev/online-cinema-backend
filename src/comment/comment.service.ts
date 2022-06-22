import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CommentModel } from './comment.model'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from 'src/user/user.model'
import { PostCommentDto } from './dto/post-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Injectable()
export class CommentService {
	constructor(
		@InjectModel(CommentModel)
		private readonly CommentModel: ModelType<CommentModel>
	) {}

	async getCommentsByMovie(movieId: Types.ObjectId) {
		const comments = await this.CommentModel.find({ movieId }).populate(
			'user',
			['email', 'avatarPath']
		)
		if (!comments) return []

		return comments
	}

	async postComment(dto: PostCommentDto, userId: Types.ObjectId) {
		const comment = await this.CommentModel.create({
			content: dto.content,
			movie: dto.movieId,
			user: userId,
		})
		if (!comment) throw new NotFoundException('Comment not found')

		return comment
	}
	async updateComment(dto: UpdateCommentDto, userId: Types.ObjectId) {
		const comment = await this.CommentModel.findOneAndUpdate(
			{ _id: dto.commentId, userId },
			{ content: dto.content },
			{ new: true }
		)
		if (!comment) throw new NotFoundException('Comment not found')

		return comment
	}
	async deleteComment(commentId: Types.ObjectId, user: UserModel) {
		const params = user.isAdmin
			? { _id: commentId }
			: { _id: commentId, user: user._id }

		await this.CommentModel.findOneAndDelete(params)

		return 'Comment deleted'
	}
}
