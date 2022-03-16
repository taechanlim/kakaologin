const express=require('express')
const axios = require('axios')
const qs = require('qs') //객체를 query형태로 바꿔주는 라이브러리 npm install qs
const router = express.Router()
const client_id = '' //https://developers.kakao.com/ <-여기들어가서 내 애플리케이션의 REST API 키
const redirect_uri = 'http://localhost:3000/oauth/kakao'
const host = 'https://kauth.kakao.com'
const client_secret = '' //https://developers.kakao.com/console/app/717771/product/login/security <- 여기접속


router.get('/',(req,res)=>{
    res.render('index')
})
//1.인가코드받기
router.get('/kakao/login',(req,res)=>{
    const redirectURI = host + `/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
    res.redirect(redirectURI)
})

router.get('/oauth/kakao',async (req,res)=>{
    // console.log(req.query.code) //인가코드
    const {code} = req.query
    const token_url = host+'/oauth/token'
    const headers = {
        "Content-type":"application/x-www-form-urlencoded"
    }
    
    const body = qs.stringify({
        grant_type:'authorization_code',
        client_id:client_id,
        redirect_uri:redirect_uri,
        code:code,
        client_secret:client_secret,
    }) //카카오서버는 객체를 못읽기때문에 string으로 변환

    //2.토큰받기
    const response = await axios.post(token_url,body,headers)
    // console.log(response.data.access_token)

    //3.토큰을 활용하여 사용자정보 가져오기
    try{
        const {access_token:ACCESS_TOKEN} = response.data
        const url = 'https://kapi.kakao.com/v2/user/me'

        const user = await axios.post(url,null,{
            headers:{
                'Authorization':`Bearer ${ACCESS_TOKEN}`
            }
        })
        // console.log(user.data.kakao_account.profile.nickname) //로그인한유저 닉네임
        // console.log(user.data.kakao_account.profile.profile_image_url) //로그인한유저 프로필사진

    }catch(e){
        console.log(e)
    }

    res.send('로그인 성공')
})


module.exports = router