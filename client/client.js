Meteor.subscribe('posts');


Template.posts.posts = function () {
  var searchValue = Session.get('searchValue');
  var reg = new RegExp(searchValue, "i");
  var sel = {
    $or: [
      {
        title: {
          $regex: reg
        }
      }, {
        body: {
          $regex: reg
        }
      }
    ]
  };

  return Posts.find(sel, {sort: {score:-1}});
};

Template.posts.rendered = function() {
  $('.cards').packery({
    'gutter': 10
  });
};

Template.posts.events({
  'keyup #search': function (e, template) {
    var $field = $('#search');
    Session.set('searchValue', $field.val());
  }
});

Template.post.loaded = function() {
  $('.cards').packery('reloadItems');
};

Template.post.image = function() {
  var src;
  if (this.image !== "") {
    src = this.image;
  } else {
    var grossRandomNumber = Math.floor(Math.random(9)*10);
    src = "http://spaceholder.co/p/22"+grossRandomNumber;
  }
  return new Handlebars.SafeString("<img src='"+ src + "'>");
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


