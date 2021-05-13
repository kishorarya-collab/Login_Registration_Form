const express = require("express")
const app = express()
const bcrypt = require("bcryptjs")
const path = require("path")
const jwt = require("jsonwebtoken")
const port = 3000

require("./db/connect")
const Register = require("./db/connect")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "ejs")
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/index',(req,res)=>{
    res.render('index')
})

app.get('/registration',(req,res)=>{
    res.render('registration')
})

app.get('/update',(req,res)=>{
    res.render('update')
})

app.get('/userdata',(req,res)=>{
    Register.find({},function(err,registers){
        res.render('userdata',{
            data:registers
        })
    })
})

app.post('/registration', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password == cpassword) {
            const dets = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobilenumber: req.body.mobilenumber,
                dateofbirth: req.body.dateofbirth,
                state: req.body.state,
                city: req.body.city,
                pincode: req.body.pincode,
                password: password,
                cpassword: cpassword
            })

            const token = await dets.generateauthtoken();

            const registered = await dets.save();
            res.render('index')
        }

        else {
            res.send("Password are not matching")
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
})



app.post('/index', async (req, res) => {
    try {

        const email = req.body.username;
        const password = req.body.password;

        const username = await Register.findOne({ email: email });
        const ismatch = bcrypt.compare(password,username.password)

        if (ismatch) {
            res.render('update',{
                fname:username.firstname,
                lname:username.lastname,
                mail:username.email,
                mnumber:username.mobilenumber,
                birthdate:username.dateofbirth,
                stat:username.state,
                cty:username.city,
                pCode:username.pincode,
                ps:username.password,
                tok:username.tokens
            })
            console.log(username);
        }
        else {
    res.send("Password is incorrect")
}

    }catch (error) {
    res.status(400).send("Invalid Login Details")
}
})


app.listen(port, () => {
    console.log(`server is running at ${port}`);
})