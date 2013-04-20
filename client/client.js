Meteor.subscribe('posts');


Template.posts.posts = function () {
    return Posts.find();
};

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

