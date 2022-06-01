import { IsNumber } from 'class-validator'
import { Types } from 'mongoose'
export class SetRatingDto {
	movieId: string

	@IsNumber()
	value: number
}
