Meteor.startup(function () {
});

Meteor.publish('posts');

function thingToPost(thing) {
    return {
        title: thing['Alt Title'],
        image: thing['Image link'],
        source: thing['Source'],
        body: thing['Alt Blurb'],
        link: thing['Link'],
        origin: thing['Origin'],
        categories: thing['Categories'].split(','),
        featured: thing['Featured'] && thing['Featured'] == '1'
    }
}

Meteor.methods({
    populatePosts: function(userId) {
        var u = Meteor.users.findOne({'id': userId});
        if (u && u.username === 'ravi') {
            console.log('hi ravi');
        Meteor.http.call('GET',
            'http://gdoc-json-proxy.herokuapp.com/0AuP1oLBXUWp1dE00cVItdlZqeTVRVDFSMmh3U2ZVTGc/',
            function(err, result){
                if (result.statusCode == 200) {
                    var sexynasastuff = EJSON.parse(result.content);
                    sexynasastuff.forEach(function(thing){
                        exists = Posts.findOne({title: thing['Alt Title']});
                        if (!exists) {
                            Posts.insert(thingToPost(thing));
                        } else {
                            Posts.update(exists.__id, {$set: thingToPost(thing) });
                        }
                    });
                }
            });
        }
    }
});
