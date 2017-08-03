var tmp_id;

Template.second.onCreated(function() {

});

Template.second.helpers({
  ageVaue: function() {
    return Session.get('age').age;
  },
  boards: function() {
    return boardDB.find({}, {sort: {createdAt: -1}}).fetch();
  }
});

Template.second.events({
  'click [id=btnEdit]': function(evt, tmpl) {
    boardDB.update({_id: tmp_id},
      {
        $set: {
          title: $('#inpTitle').val(),
          body: $('#inpBody').val()
        }
      });
  },
  'click #trRow': function(evt, tmpl) {
    $('#inpTitle').val(this.title);
    $("#inpBody").val(this.body);
    tmp_id = this._id;
  },
  'click #btnRemove': function(evt, tmpl) {
    if(confirm('정말 삭제하시겠습니까?')) {
      boardDB.remove({_id: this._id});
    };
  },
  'click #btnWrite': function(evt, tmpl) {
    var strTitle = $('#inpTitle').val();
    var strBody = $("#inpBody").val();

    boardDB.insert({
      createdAt: new Date(),
      title: strTitle,
      body: strBody,
      isChecked: $('#'+this._id+':checked').val()
    });

    $('#inpTitle').val('');
    $("#inpBody").val('');
  }
});