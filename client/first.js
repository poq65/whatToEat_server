Template.first.onCreated(function() {
  // alert("onCreated runs!")
});

Template.first.onRendered(function() {
  // alert("onRendered runs!")
  setInterval(function() {
    $('#inpDateTime').val((new Date()).toISOString().substring(0, 19));
  }, 1000);

  // $('#inpDateTime').val((new Date()).toISOString().substring(0, 19));

});

Template.first.helpers({
  percentage: function() {
    var curProjectTodosCount = todoDB.find({project_id: 'AAA'}).count();
    var curProjectTodosCompletedCount = todoDB.find({project_id: 'AAA', isCompleted: true}).count();
    console.log(curProjectTodosCount);
    console.log(curProjectTodosCompletedCount);
    if (curProjectTodosCount === 0) {
      return 0;
    }
    return (curProjectTodosCompletedCount / curProjectTodosCount) * 100;
  },
  ageColor: function() {
    if (this.age > 20) {
      return 'red'
    }
    else {
      return 'yellow'
    }
  },
  array: function() {
    return [
      {
        userName: 'jungwon jin',
        age: 30,
        address: 'Seoul'
      },
      {
        userName: 'jungwon jin',
        age: 31,
        address: 'Seoul'
      },
      {
        userName: 'jungwon jin',
        age: 32,
        address: 'Seoul'
      },
      {
        userName: 'jungwon jin',
        age: 33,
        address: 'Seoul'
      }

    ];
  },
  userColor: function() {
    //DB에서 해당 유저가 어떤놈인지 확인한다.
    return "btn-danger";
  },
  data: function() {
    return {
      userName: 'jungwon jin',
      age: 30,
      address: 'Seoul'
    };
  }
});

Template.first.events({
  'click [name=lnkSecond]': function(evt, tmpl) {
    Session.set('age', this);
  },
  'click #targetButton': function(evt, tmpl) {
    $('#inpDateTime').trigger('click');
  },
  'change #inpDateTime': function(evt, tmpl) {
    // meteor add momentjs:moment
    var _date = new Date($('#inpDateTime').val());
    var str_date = moment(_date).format('YYYY-MM-DD');
    $('#targetButton').text(str_date);
  }
});