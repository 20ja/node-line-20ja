// 引用linebot 套件
import linebot from 'linebot'
// 引用dotenv 套件
import dotenv from 'dotenv'
// 引用request套件(後端)
import rp from 'request-promise'

// 讀取 .env檔
dotenv.config()

// 宣告機器人的資訊
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 當收到訊息時
bot.on('message', async (event) => {
  let msg = ''
  try {
    const data = await rp({ uri: 'https://bangumi.bilibili.com/web_api/timeline_global', json: true })
    msg = data.seasons[0].title
  } catch (error) {
    msg = '發生錯誤'
  }
  event.reply(msg)
})

// 在port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
