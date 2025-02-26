const express=require('express')
const dotenv=require('dotenv')
const bodyparser=require('body-parser')
const request=require('request')
const cors = require('cors');


const PORT=process.env.PORT || 5000
dotenv.config()
const app=express()
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.post('/subscribe',(req,res)=>{
    if(req.body.captcha===undefined || 
        req.body.captcha === '' || 
        req.body.captcha === null){
        return res.json({'success':false,'msg':'Please select captcha'})
    }
    const secretkey='6Lc06OIqAAAAAGOMAlpXJs0UBzpfyxDgWPdsiYOD'
    const verifyurl=`https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`

    request(verifyurl,((err,response,body)=>{
        body=JSON.parse(body)
        if(body.success!=undefined && !body.success){
            return res.json({'success':false,"msg":"Failed captcha verification"})
        }
        return res.json({'success':true,'msg':'Captcha verified'})
        
    }))
})

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`)
})