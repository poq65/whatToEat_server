Template.head.events({
  'click #btnTest': function(evt, tmpl) {
   HTTP.call('POST', 'http://localhost:3000/test', {
     "headers": {'Content-Type': 'application/json'},
     "data": {
       id: 'nicejwjin',
       pw: 'nicejin123'
     }
   }, function(err, rslt) {
     alert(rslt);
   });
  }
});