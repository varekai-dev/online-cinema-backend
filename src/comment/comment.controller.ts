import { PostCommentDto } from './dto/post-comment.dto'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorators'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Controller('comments')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Get(':movieId')
	@HttpCode(200)
	async getCommentsByMovie(@Param('movieId') movieId: Types.ObjectId) {
		return this.commentService.getCommentsByMovie(movieId)
	}

	@UsePipes(new ValidationPipe())
	@Put('')
	@HttpCode(200)
	@Auth()
	async updateComment(
		@User('_id') userId: Types.ObjectId,
		@Body() dto: UpdateCommentDto
	) {
		return this.commentService.updateComment(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('')
	@HttpCode(200)
	@Auth()
	async postComment(
		@User('_id') userId: Types.ObjectId,
		@Body() dto: PostCommentDto
	) {
		return this.commentService.postComment(dto, userId)
	}
	@UsePipes(new ValidationPipe())
	@Delete(':commentId')
	@HttpCode(200)
	@Auth()
	async deleteComment(
		@User() user,
		@Param('commentId') commentId: Types.ObjectId
	) {
		return this.commentService.deleteComment(commentId, user)
	}
}
