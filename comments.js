//create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const ObjectId = require('mongodb').ObjectId;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//create collection
app.get('/api/comments', (req, res) => {
    db.getDB().collection('comments').find({}).toArray((err, documents) => {
        if (err)
            console.log(err);
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});

//add new comment
app.post('/api/comments', (req, res) => {
    const newComment = req.body;
    db.getDB().collection('comments').insertOne(newComment, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

//update comment
app.put('/api/comments/:id', (req, res) => {
    const id = req.params.id;
    const userInput = req.body;
    db.getDB().collection('comments').findOneAndUpdate({ _id: ObjectId(id) }, { $set: { comment: userInput.comment } }, { returnOriginal: false }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

//delete comment
app.delete('/api/comments/:id', (req, res) => {
    const id = req.params.id;
    db.getDB().collection('comments').findOneAndDelete({ _id: ObjectId(id) }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

//listen on port 3000
db.connect((err) => {
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    } else {
        app.listen(3000, () => {
            console.log('connected to database, app listening on port 3000');
        });
    }
});