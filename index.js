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

// key.js를 가져옴
const config = require('./config/key');

// cookie-parser를 가져옴
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// mongoose 연결 설정
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
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

app.post('/login', (req, res) => {
  
  // 요청된 이메일을 데이터베이스에 있는지 찾음
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "등록된 이메일이 없습니다."
      })
    }
  
  // 요청된 이메일이 데이터베이스에 있으면 비밀번호가 맞는지 조회
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch) return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

    // 비밀번호가 맞으면 토큰을 생성
    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);
      
      // 토큰을 쿠키에 저장
      res.cookie("x_auth", user.token)
      .status(200)
      .json({loginSuccess: true, userId: user._id})

    })

  })
  
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})