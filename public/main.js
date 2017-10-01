var SpacebookApp = function() {

    var posts = [];

    var $posts = $(".posts");

    getPosts();

    function _renderPosts() {
        $posts.empty();
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts.length; i++) {
            var newHTML = template(posts[i]);
            console.log(newHTML);
            $posts.append(newHTML);
            _renderComments(i)
        }
    }

    function addPost(input_text) {
        $.ajax({
            type: "POST",
            url: "/postsUrl",
            data: { text: input_text },
            success: function(newPost) {
                if (newPost) {
                    console.log("this is your post " + newPost);
                    //save this post inside the posts array
                    //render the posts array on the screen
                    // posts.push({ text: newPost, comments: [] });
                    // _renderPosts();
                    posts.push(newPost);
                    _renderPosts();

                } else {
                    console.log("there was an error !");
                }
            }
        });
    }



    function getPosts() {
        $.ajax({
            type: "GET",
            url: "/posts",
            success: function(data) {
                posts = data;
                _renderPosts();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        })


    };


    function _renderComments(postIndex) {
        var post = $(".post")[postIndex];
        $commentsList = $(post).find('.comments-list')
        $commentsList.empty();
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts[postIndex].comments.length; i++) {
            var newHTML = template(posts[postIndex].comments[i]);
            $commentsList.append(newHTML);
        }
    }

    var removePost = function(index) {

        var id = posts[index]._id

        $.ajax({
            type: "DELETE",
            url: "/posts/" + id,
            // data: { text: input_text },
            success: function(res) {

                posts.splice(index, 1);
                _renderPosts();


            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }


        });
    }



    var addComment = function(newComment, postIndex) {

        var id = posts[postIndex]._id;


        $.ajax({

            type: "POST",
            url: "/posts/" + id,
            data: newComment,
            success: function(res) {

                posts[postIndex].comments.push(newComment)
                res.comments.push(newComment)
                _renderComments(postIndex);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        })


    };


    var deleteComment = function(postIndex, commentIndex) {
        posts[postIndex].comments.splice(commentIndex, 1);
        _renderComments(postIndex);
    };

    return {
        addPost: addPost,
        removePost: removePost,
        addComment: addComment,
        deleteComment: deleteComment,
    };
};

var app = SpacebookApp();


$('#addpost').on('click', function() {

    var $input = $("#postText");
    if ($input.val() === "") {
        alert("Please enter text!");
    } else {
        app.addPost($input.val());
        $input.val("");
    }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
    var index = $(this).closest('.post').index();;
    app.removePost(index);
});

$posts.on('click', '.toggle-comments', function() {
    var $clickedPost = $(this).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {

    var $comment = $(this).siblings('.comment');
    var $user = $(this).siblings('.name');

    if ($comment.val() === "" || $user.val() === "") {
        alert("Please enter your name and a comment!");
        return;
    }

    var postIndex = $(this).closest('.post').index();
    var newComment = { text: $comment.val(), user: $user.val() };

    app.addComment(newComment, postIndex);

    $comment.val("");
    $user.val("");

});

$posts.on('click', '.remove-comment', function() {
    var $commentsList = $(this).closest('.post').find('.comments-list');
    var postIndex = $(this).closest('.post').index();
    var commentIndex = $(this).closest('.comment').index();

    app.deleteComment(postIndex, commentIndex);
});