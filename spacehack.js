

Meteor.methods({
    populatePosts: function(userId) {
        var u = Meteor.users.findOne({'id': userId});
        if (u && u.username === 'ravi') {
            console.log('hi ravi');
        }
        var p = Meteor.http.call('GET',
            'http://www.pckl.me/data.csv',
            function(err, result){
                if (result.statusCode == 200) {
                    var horrible = EJSON.parse(result);
                }
            });
    }
});