var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.her_daniel_url || 'mongodb://localhost/spacebookDB', function() {
    console.log("DB connection established!!!");
})


var Post = require('./models/postModel.js')
    // console.log('----------------')
    // var newThing = new Post({ text: 'hey' })
    // var anotherThing = new Post({ text: ' hey just another one' });
    // newThing.save();
    // anotherThing.save();
    // console.log('----------------')

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts

// 2) to handle adding a post
// 3) to handle deleting a post

// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.post('/postsUrl', function(req, res) {
    var post = new Post(req.body);
    post.save();
    res.send(post);
})

app.get('/posts', function(req, res) {
    Post.find(function(error, result) {
        if (error) { return console.error(error); }
        res.send(result);
    });
})

app.delete('/posts/:id', function(req, res) {
    var idwhatever = req.params.id;
    Post.findByIdAndRemove(idwhatever, function(err, deleted_post) {

        res.send(deleted_post);

    })
})

app.post('/posts/:id', function(req, res) {
    var postId = req.params.id;
    var newComment = req.body
    console.log(req.body);
    Post.findById(postId, function(err, foundPost) {
        foundPost.comments.push(req.body);
        foundPost.save(function(error, result) {
            if (error) { return console.error(error); }
            res.send(result);
            console.log(result);
        });


    })
})




app.listen(process.env.PORT || 8000, function() {
    console.log("listeninggggg");

});