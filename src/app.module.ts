import { getMongoConfig } from './config/mongo.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { GenreModule } from './genre/genre.module'
import { FileModule } from './file/file.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { ActorModule } from './actor/actor.module'
import { MovieModule } from './movie/movie.module'
import { RatingModule } from './rating/rating.module'
import { TelegramModule } from './telegram/telegram.module'
import { SendGridModule } from '@ntegral/nestjs-sendgrid'

@Module({
	imports: [
		SendGridModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (cfg: ConfigService) => ({
				apiKey: cfg.get('SENDGRID_API_KEY'),
			}),
			inject: [ConfigService],
		}),
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		UserModule,
		GenreModule,
		FileModule,
		CloudinaryModule,
		ActorModule,
		MovieModule,
		RatingModule,
		TelegramModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
