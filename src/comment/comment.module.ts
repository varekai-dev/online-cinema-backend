import { TypegooseModule } from 'nestjs-typegoose'
import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { CommentModel } from './comment.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CommentModel,
				schemaOptions: {
					collection: 'Comment',
				},
			},
		]),
	],
	controllers: [CommentController],
	providers: [CommentService],
})
export class CommentModule {}
