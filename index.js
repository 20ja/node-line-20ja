// 從內建http套件引用變數，取名為http
// require 是 commosjs語法
// const http = require('http')
// import 是EMCAScript 語法
// 必須要在node.js>13.0 且在package.json 加入 "type":"module",
import http from 'http'

const server = http.createServer((req, res) => {
    // 回應狀態碼200成功
    res.writeHead(200)
    // 回應內容
    res.write('hello')
    // 回應結束
    res.end()
})

// 在port1234啟動，啟動後在console顯示訊息
server.listen(1234, () => {
    console.log('網頁伺服器已啟動:http://localhost:1234')
})