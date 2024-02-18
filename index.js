const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const { User } = require('./source/models');
//const open = require('open');




app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {
  if (req.body.username) {
    const nu = new User({ username: req.body.username });

    nu.save().then(data => {
      res.json({ username: data.username, _id: data._id });
    }, err => {
      res.json({ error: "Ups!! Error at save new user." });
    });
  }
});

app.get('/api/users', (req, res) => {

  User.find({}).select('_id username').then(data => {
    res.json(data)
  }, err => {
    res.json({ error: "Ups!! Error at get users list." });
  });

});

app.post('/api/users/:_id/exercises', (req, res) => {
  if (req.params._id) {
    User.findById(req.params._id).then(user => {
      const date = req.body.date ? new Date(req.body.date) : new Date();
      
      if (user) {
        const ex = {
          description: req.body.description,
          duration: parseInt(req.body.duration) ,
          date: date
        };

        user.exercises.push(ex);
        user.save().then(data => {
          res.json({ _id: data._id, username: data.username, description: ex.description, duration: ex.duration,date:ex.date.toDateString() });
        }, err => {
          console.error(err)
          res.json({ error: "Ups!! Error at save new exercise." });
        });
      }
      else{
        res.json({ error: "Ups!! User not found." });
      }
    }
    );
  }
});

app.get('/api/users/:_id/logs', (req, res) => {
  if (req.params._id) {
    try{
      User.findById(req.params._id).then(user => {
        if (user) {
          let count = 0;
          const logs = user.exercises.filter((item) => {
            
            count ++;
            
            if (req.query.limit && count > req.query.limit) return false;
  
            if(req.query.from){
              const from = new Date(req.query.from)
              if(item.date < from) return false;
            }
  
            if(req.query.to){
              const to = new Date(req.query.to)
              if(item.date > to) return false;
            }
  
            return true;
          }).map(item => { return { description: item.description, duration: item.duration, date: item.date.toDateString() } });
  
          res.json({
            _id: user._id,
            user: user.username,
            count: logs.length,
            log: logs
          });
        }
      }
      );
    }
    catch(exception){
      console.error(exception)
      res.json({message:'Oops'})
    }
    
  }
});



const port = process.env.PORT || 3000
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
