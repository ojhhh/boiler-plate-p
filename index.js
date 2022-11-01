// express.js 설정
const express = require('express')
const app = express()
const port = 5000

//User.js에서 생성한 User 모델을 가져옴
const { User } = require("./model/User");

// bodyparser를 불러옴
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// key.js를 가져옴 (설정 정보 비밀)
const config = require('./config/key');

// mongoose 연결 설정
const mongoose = require('mongoose')
mongoose.connect('', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {

  // 회원 가입할때 입력한 정보를 데이터베이스에 넣어줌
  const user = new User(req.body)

  user.save((err, userInfo) => {  // mongdb에서 오는 메소드
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})