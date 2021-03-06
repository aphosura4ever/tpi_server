const express = require('express')
const router = express.Router()
const connection = require('../database/db')
const passport = require('../passport')
const IncomingForm = require('formidable').IncomingForm
const bcrypt = require('bcrypt');
const fs = require('fs');
saltRounds = 10
var uploadPath = `C:/Users/Denis/Desktop/vidfun_videos/`



router.post('/', (req, res) => {
    console.log('user signup');

    const { name, username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
      connection.query(
        `insert into users(Name,Username,Email,Password) values('${name}','${username}','${email}','${hash}')`,
        function(error) {
          if (error) console.error(error);
          else {
            console.log('User signed up succesfully')
            res.send({msg : 'User signed up succesfully'})
          }
      
        }
      
      
        );
  
  
    });
  });

router.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        console.log("username "+req.body.username)
        console.log("password "+req.body.password)
        var userInfo = {
            username: req.user.Username
        };
        console.log(req.user.Username)
        console.log(req.session)
        res.send(userInfo);
    }
)

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
   
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

router.post('/upload',(req,res)=>{
       
    if (!fs.existsSync(uploadPath+`${req.user.Username}`)) {
        fs.mkdirSync(uploadPath+`${req.user.Username}`)
    }
    


        var form = new IncomingForm({uploadDir: uploadPath+`${req.user.Username}` })


    form.on ('fileBegin', function(name, file){
        //rename the incoming file to the file's name
        file.path = form.uploadDir + "/" + file.name;
    })

    form.on('file', (field, file) => {
      // Do something with the file
      // e.g. save it to the database
      // you can access it using file.path

        console.log(file)
        // destination.txt will be created or overwritten by default.
        // fs.copyFile(file.path, `C:/Users/Denis/Desktop/vidfun_videos/${file.name}`, (err) => {
        //     if (err) throw err;
        //      console.log('vieo was copied to destination');
        // });
        
    })
    

    form.on('end', () => {
      res.send('File tranfer succesfull')
    })
    form.parse(req)



})


router.get('/videos',(req,res)=>{






})


module.exports = router