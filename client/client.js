Meteor.subscribe('posts');


Template.posts.posts = function () {
    return Posts.find({}, {sort: {score:-1}});
};

Template.posts.rendered = function() {
  $(document).ready(function() {
    $('.cards').packery();
  });
};

Template.post.events({
  'click .upvotable': function(event) {
    event.preventDefault();
    Meteor.call('upvote', this._id);
  }
});

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});


