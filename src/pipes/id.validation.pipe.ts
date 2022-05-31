import {
	BadRequestException,
	PipeTransform,
	ArgumentMetadata,
} from '@nestjs/common'
import { Types } from 'mongoose'

export class IdValidationPipe implements PipeTransform<string> {
	transform(value: string, meta: ArgumentMetadata) {
		if (meta.type !== 'param') return value
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Invalid id')
		}
		return value
	}
}
