
// posts -- {title: String, body: String, image: String}
Posts = new Meteor.Collection('posts');

Meteor.startup(function (){
    // Posts.insert({
    //     title: 'test title',
    //     body: 'Williamsburg placeat banksy, scenester art party incididunt four loko magna fingerstache street art accusamus portland eiusmod pork belly vero. Typewriter incididunt letterpress, consectetur in williamsburg iphone mollit wolf tempor etsy yr accusamus. Twee banh mi ethical meggings, mcsweeney\'s actually sriracha post-ironic swag sint gastropub. Bicycle rights master cleanse pariatur truffaut, delectus 90\'s banksy vero consequat cupidatat before they sold out. Occaecat quinoa viral, shoreditch wayfarers duis veniam authentic cupidatat DIY chillwave odd future esse ullamco.',
    //     image: 'http://placekitten.com/100/100',
    //     link: 'http://nasa.gov',
    //     score: 0
    // });

});

Meteor.methods({
    upvote: function(postId) {
        var user = Meteor.user();
        if (!user) {
            return;
        }

        Posts.update({
            _id: postId,
            upvotes: {$ne: user._id}
        }, {
            $addToSet: {upvoters: user._id},
            $inc: {score: 1}
        });
    }
});