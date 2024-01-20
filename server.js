const express=require("express");
const request1=require("request");
const app=express();
const port=5000;
const {initializeApp,cert}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');

var serviceAccount=require("./key.json");
const { request } = require("express");
app.use(express.static('public'));
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
initializeApp({
    credential: cert(serviceAccount)
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const db=getFirestore();
app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.render("web")
})
app.get("/register",(req,res)=>{
    res.render('register')
})
app.get("/signup",(req,res)=>{
    const name=req.query.name;
    const email=req.query.email;
    const password=req.query.pwd;

    db.collection('users').add({
        name:name,
        email:email,
        password:password,
    }).then(()=>{
        res.render("login")

    })

});
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/signin',(req,res)=>{
    const email=req.query.email;
    const password=req.query.pwd;

    db.collection('users')
    .where("email","==",email).where("password","==",password)
    .get()
    .then((docs)=>{
        if(docs.size>0){
            res.render('search')
        }
        else{
            res.render('loginfailed')
        }
    });
});
app.get('/search',(req,res)=>{
    res.render('search');
})
app.get('/getinfo',(req,res)=>{
    const name=req.query.name;
    //res.send(name)
    var datainfo=[];
    request1('https://api.nutritionix.com/v1_1/search/'+name+'?results=0:1&fields=*&appId=e73e5e60&appKey=274edaee38690127491877e4d1fed086',function(error,response,body){
    const data=JSON.parse(body)
       var a=data.hits[0].fields.nf_calories;
       var b=data.hits[0].fields.nf_sugars;
       var c=data.hits[0].fields.nf_total_carbohydrate;
       var d=data.hits[0].fields.nf_protein;
       datainfo.push(a)
       datainfo.push(b)
       datainfo.push(c)
       datainfo.push(d)
       res.render("datainfo",{user:datainfo},)  
})
})

app.listen(port,()=>{
    console.log(`application is running on port $(post)`);
})


