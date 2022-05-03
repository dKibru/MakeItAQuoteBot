import 'dotenv/config'
import { Telegraf } from 'telegraf'
import {addTextOnImage} from './imageManipulator.js'


const bot = new Telegraf(process.env.BOT_TOKEN)


bot.command('start', (ctx) => {
  try {
    ctx.reply('Forward or send me a quote')
  } catch (error) {
    console.log("???????")
  }
})

const backgroundImgPath = "assets/bg.png"

bot.on('text', async (ctx) => {
  console.log({ctx : ctx.update.message})
  let username = ctx.message.from.username
  let text = ctx.message.text
  if(username) 
    username = `@${username}`
  else 
    username = ctx.message.from.first_name

  let images = await ctx.tg.getUserProfilePhotos(ctx.message.from.id)

  let firstProfP = images.photos[0]

  const forward_from = ctx.update.message.forward_from
  // forward_sender_name
  if(forward_from){
    let un = forward_from.username ? `@${forward_from.username}` : null
    un = un ? un : `${forward_from.first_name} ${forward_from.last_name ? forward_from.last_name : ''}`
    username = un
    console.log({username})
    images = await ctx.tg.getUserProfilePhotos(forward_from.id)
    firstProfP = images.photos[0]
  }
  let theQuotePic = null
  if(firstProfP?.length){
    const profPicImage = await ctx.telegram.getFileLink(firstProfP[2].file_id)
    theQuotePic = await addTextOnImage(text, backgroundImgPath, profPicImage.href, username)
  }else{
    theQuotePic = await addTextOnImage(text, backgroundImgPath, null, username)
  }
  
  try {
    ctx.reply(`Generating your quote ...`)
    ctx.replyWithPhoto({
      source: theQuotePic
    })
  } catch (error) {
    console.error({error})
  }
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