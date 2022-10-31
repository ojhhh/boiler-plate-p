// express.js 설정
const express = require('express')
const app = express()
const port = 5000

// mongoose 연결 설정
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://oh:aa123@firsttime.wt9gz1s.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})