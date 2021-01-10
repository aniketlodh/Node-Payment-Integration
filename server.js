require("dotenv").config()
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var PORT=process.env.PORT|| 3000;
var Insta = require('instamojo-nodejs');
Insta.setKeys(process.env.API_KEY,process.env.AUTH_KEY );
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

Insta.isSandboxMode(true);

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/donate",(req,res)=>{
    res.render("donate")
})

app.post("/pay",(req,res)=>{
    
    var name=req.body.name;
    var email=req.body.email;
    var amount=req.body.amount;
    
    var data = new Insta.PaymentData();
    
    data.purpose = "Child Welfare";
    data.amount = amount;                 
    data.name=name;
    data.email=email;
    data.setRedirectUrl("https://nodepayment.herokuapp.com/success");
    data.send_email ="True"   
    Insta.createPayment(data, function(error, response) {
        if (error) {
            res.send("Error occured");
        } else {
            console.log(response);
            res.send("Please check your email to confirm payment");
        }
    });
})

app.get("/success",(req,res)=>{
    res.send("Payment was successful. Please check your email for invoice");
})
app.listen(PORT,()=>{
    console.log(`Server started`);
})