var express = require("express");
var router = express.Router({mergeParams: true});

var Product = require("../models/product"),
    Comment = require("../models/comment");


// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


function checkCommentOnwership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // foundProduct.author.id.equals is a mongoose object
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}


/* Comment NEW */
router.get("/new", isLoggedIn, function(req, res) {
    // find the prodcut with specific ID
    Product.findById(req.params.id,  function(err, foundProduct) {
       if (err) {
           console.log(err);
       } else {
           console.log(foundProduct);
           res.render("comments/new", {product: foundProduct});
       }
    });
});


/* Comment Create */
router.post("/", isLoggedIn, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        if (err) {
            console.log(err);
            res.redirect("/items");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    foundProduct.comments.push(comment);
                    foundProduct.save();
                    res.redirect("/items/" + foundProduct._id);
                }
            });
        }
    });
});


router.get("/:comment_id/edit", checkCommentOnwership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {product_id: req.params.id, comment : foundComment});
        }
    });
});


router.put("/:comment_id", checkCommentOnwership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/items/" + req.params.id);
       }
   });
   
});


// Comment destroy route
router.delete("/:comment_id", checkCommentOnwership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/items/" + req.params.id);
        }
    });
});


module.exports = router;