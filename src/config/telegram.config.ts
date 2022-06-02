import { Telegram } from '../telegram/telegram.interface'
export const getTelegramConfig = (): Telegram => ({
	chatId: '817605658',
	token: process.env.TELEGRAM_TOKEN,
})
