// 引用linebot 套件
import linebot from 'linebot'
// 引用dotenv 套件
import dotenv from 'dotenv'
// 引用request套件(後端)
import rp from 'request-promise'
// 引用 cheerio套件(可以抓html資料)
import cheerio from 'cheerio'

// 讀取 .env檔
dotenv.config()

// 宣告機器人的資訊
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const search = async (keyword) => {
  let msg = ''
  console.log(keyword)
  try {
    const result = await rp({
      uri: 'https://www.jpmarumaru.com/tw/JPSongList.asp',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        keyword,
        KW: keyword,
        OrderBy: 'Views',
        Page: 1
      }
    })
    // jq語法
    // console.log(result)
    const $ = cheerio.load(result)

    for (let i = 0; i < $('.song-list').length; i++) {
      // trim()移除空白
      const name = $('.song-list').eq(i).find('.song-name').text().trim()
      const href = $('.song-list').eq(i).find('.song-name a').attr('href')
      const id = href.slice(11, -5)
      msg += `ID: ${id}，名稱: ${name}\n`
    }
  } catch (error) {
    msg = error.message
  }
  console.log(msg)
  return msg
}

const lyrics = async (songid) => {
  let msg = ''
  console.log(songid)
  if (isNaN(songid)) {
    msg = '請輸入 id'
  } else {
    try {
      const result = await rp({
        method: 'POST',
        uri: 'https://www.jpmarumaru.com/tw/api/json_JPSongTrack.asp',
        json: true,
        headers: {
          Referer: `https://www.jpmarumaru.com/tw/JPSongPlay-${songid}.html`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          SongPK: songid
        }
      })
      const alyrics = result.Lyrics.splice(',')
      const blyrics = result.Translate_zh.splice(',')
      const clyrics = []
      for (let i = 0; i < alyrics.length; i++) {
        clyrics.push(alyrics[i])
        clyrics.push(blyrics[i])
      }
      msg = clyrics.join('\n')
      console.log(msg)
      // msg += `${result.Lyrics.join('\n')}。\n中文:\n${result.Translate_zh.join('\n')}`
      // console.log(msg)
    } catch (error) {
      msg = error.message
    }
  }
  return msg
}

bot.on('message', async (event) => {
  let msg
  if (event.message.text.includes('搜尋')) msg = await search(event.message.text.slice(3))
  else if (event.message.text.includes('歌詞')) msg = await lyrics(event.message.text.slice(3))
  event.reply(msg)
})

// 在port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
