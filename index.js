import 'dotenv/config'
import { Telegraf } from 'telegraf'
import {addTextOnImage} from './imageManipulator.js'


const bot = new Telegraf(process.env.BOT_TOKEN)


bot.command('start', (ctx) => {
  ctx.reply('Forward or send me a quote')
})

const backgroundImgPath = "assets/bg.png"

bot.on('text', async (ctx) => {
  let username = ctx.message.from.username
  let text = ctx.message.text
  if(username) 
    username = `@${username}`
  else 
    username = ctx.message.from.first_name

  let images = await ctx.tg.getUserProfilePhotos(ctx.message.from.id)

  let firstProfP = images.photos[0]

  if(ctx.message.forward_from){
    username = `@${ctx.message.forward_from.username}` || `${ctx.message.forward_from.first_name} ${ctx.message.forward_from.last_name ? ctx.message.forward_from.last_name : ''}` 
    
    images = await ctx.tg.getUserProfilePhotos(ctx.message.forward_from.id)
    firstProfP = images.photos[0]
  }
  let theQuotePic = null
  if(firstProfP?.length){
    const profPicImage = await ctx.telegram.getFileLink(firstProfP[2].file_id)
    theQuotePic = await addTextOnImage(text, backgroundImgPath, profPicImage.href, username)
  }else{
    theQuotePic = await addTextOnImage(text, backgroundImgPath, null, username)
  }
  
  ctx.reply(`Generating your quote ...`)
  ctx.replyWithPhoto({
    source: theQuotePic
  })
})


if (process.env.DEVELOPMENT){
    bot.launch()
}else{
    bot.launch({
        webhook: {
            domain: process.env.WEBHOOK_URL,
            port: process.env.WEBHOOK_PORT,
            host: '0.0.0.0'
        }
    })
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM')) 