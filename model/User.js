// mongoose 연결
const mongoose = require('mongoose');

// 비밀번호 암호화 설정
const bcrypt = require('bcrypt');
const saltRounds = 10; // 10자리 salt 생성

// 스키마 연습을 위한 스키마 생성
const userSchema = mongoose.Schema({
    name: {
        type: String, // 타입
        maxlength: 50 // 문자 최대 길이
    },
    email: {
        type: String,
        trim: true, // 띄어쓰기 제거 a b c -> abc
        unique: 1 // 중복되지 않게 설정
    },
    password: {
        type: String,
        minlength: 5 // 문자 최소 길이
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 유저별 정책 설정
        type: Number,
        default: 0
    },
    image: String,
    token: { // 토큰을 이용하여 유효성을 관리하기 위해 생성
        type: String 
    },
    tokenExp: { // 토큰 사용기간
        type: Number
    }
})

// 유저 모델을 저장하기 전에 동작함
// next 파라미터를 주어 동작이 끝난 후 다시 보냄
userSchema.pre('save', function(next) {
    var user = this;

    // user 설정 중 password가 변환 될때만 암호화 
    if(user.isModified('password')){

    // 비밀번호 암호화 설정
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err)
            user.password = hash
            next()
        })
    })
    } else {
        next()
    }  

})

// 스키마로 모델로 감싸기 위해 설정
const User = mongoose.model('User',userSchema) // mongoose.model('이름',스키마명)

// 모델을 다른곳에서도 쓸수 있게 설정
module.exports = { User }