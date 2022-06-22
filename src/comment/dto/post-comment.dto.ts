import { IsNotEmpty, IsString } from 'class-validator'

export class PostCommentDto {
	@IsString()
	@IsNotEmpty()
	content: string

	@IsString()
	movieId: string
}
