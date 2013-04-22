Meteor.subscribe('posts');

Template.voting.posts = function() {
  var votedOn = Session.get('votedOn') || [];
  var randomNum = Math.random();
  console.log(randomNum);
  var postOne = Posts.findOne({randomKey:{$lte:randomNum}}) || Posts.findOne({randomKey:{$gte:randomNum}});
  var postTwo = Posts.findOne({_id:{$not:postOne._id} ,randomKey:{$lte:randomNum}}) || Posts.findOne({randomKey:{$gte:randomNum}});
  var postPair = [postOne, postTwo];

 // var votedPair = postPair[0]._id + ',' postPair[1]._id;
  return postPair;
};

Template.posts.posts = function () {
  var searchValue = Session.get('searchValue');
  var reg = new RegExp(searchValue, "i");
  var sel = {
    featured: true,
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

  return Posts.find(sel, {sort: {score:-1}, limit: 100} );
};

Template.posts.rendered = function() {
    $('.cards').isotope({
      // options
      itemSelector : '.card',
      layoutMode : 'masonry',
      transformsEnabled: false
    });
  $('.cards').imagesLoaded(function(){
    $('.cards').isotope('reloadItems');
  });
};

Template.posts.events({
  'keyup #search': function (e, template) {
    var $field = $('#search');
    Session.set('searchValue', $field.val());
  }
});

Template.post.rendered = function() {

  if ($('.cards').hasClass('isotope')) {
    $('.cards').isotope('reloadItems');
  }
  // $('.cards').packery().packery('reloadItems').packery();
};

// Template.post.image = function() {
//   var src;
//   if (this.image !== "") {
//     src = this.image;
//   } else {
//     var grossRandomNumber = Math.floor(Math.random(9)*10);
//     src = "http://spaceholder.co/p/22"+grossRandomNumber;
//   }
//   return new Handlebars.SafeString("<img src='"+ src + "'>");
// };

Template.post.events({
  'click .upvotable': function(event) {
    event.preventDefault();
    event.stopPropagation();
    Meteor.call('upvote', this._id);
    console.log(this);
    return false;
  },
  'click': function(event) {
    window.open(this.link, '_blank');
  }
});

Template.post.score = function() {
  if (this.score === '') {
    return 0;
  } else {
    return this.score;
  }
};

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});
