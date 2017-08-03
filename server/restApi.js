// todoListDB
//
// {
//   title: ''
//   body: ''
//   startAt: new Date()
//   endAt: new Date()
//   members: [
//     {
//       username: "username1"
//       isManager: true
//     }
//       ...
//   ]
//   username: ''
//   createdAt: new Date()
//   count: 0
//   comments: [
//     {
//       username: ''
//       createdAt: new Date()
//       comment: ''
//     }
//   ]
// }
HTTP.methods({
    //오늘뭐먹지
    'getOrderList': function(data) {
      var order = orderDB.findOne({}, {sort: {createdAt: -1}}); //역순으로 정렬해서 마지막날짜 주문만 나오는 조건
      console.log(order)
      return {
        status: 'success',
          data: order
      }
    },
    'addOrderList': function(data) {

        console.log(data);
        //data 안에 ID가 들어 있을 것임. / orderList 라는 어레이도 들어 있을 것임.
        orderDB.insert({
            // orderUserId: data.userId,
            createdAt: new Date(),
            orderList: data.Order
        });

        return {
            status: 'success'
        }
    },

    //분실물
    'getPegyList': function(data) {
        var today = new Date();
        today.setDate(today.getDate() - 30);
        var startTime = today.setHours(0,0,0,0);
        var endTime = today.setHours(23,59,59,999);
        var lostList = lostDB.find({isLost: false,
            createdAt: {$gte: startTime, $lt: endTime}}).fetch();
        return lostList;
    },
    'getIGotItListToday': function(data) {
        //있어요 리스트

        var startTime = (new Date()).setHours(0,0,0,0);
        var endTime = (new Date()).setHours(23,59,59,999);
        var lostList = lostDB.find({isLost: false,
            createdAt: {$gte: startTime, $lt: endTime}}).fetch();
        return lostList;
    },
    'getFinderListToday': function(data) {
        //찾아요 리스트
        var startTime = (new Date()).setHours(0,0,0,0);
        var endTime = (new Date()).setHours(23,59,59,999);
        var lostList = lostDB.find({isLost: true,
            createdAt: {$gte: startTime, $lt: endTime}}).fetch();
        return lostList;
    },
    'getIGotItList': function(data) {
        //있어요 리스트
        var lostList = lostDB.find({isLost: false}).fetch();
        return lostList;
    },
    'getFinderList': function(data) {
        //찾아요 리스트
        var lostList = lostDB.find({isLost: true}).fetch();
        return lostList;
    },
    'addLostDB': function(data) {
        /*
        data 안에는 분실 내용 / 시간 / 장소 등의 내용이 들어 있을 것임.
         */
        data.createdAt = new Date();
        lostDB.insert(data);

        return {
            status: 'success'
        }
    },
    'userLogin': function(data) {
        //data.아이디입니다
        console.log('===================');
        console.log(data);
        var user = userDB.findOne({userId: data.Name});
        console.log(user);
        if (user == undefined) {
            return {
                status: 'Not success'
            }
        }
        else {
            if(user.password === data.PhoneNumber) {
                return {
                    status: 'success',
                    user: user
                }
            }
            else {
                return {
                    status: 'Wrong password'
                }
            }

        }
    },
    'userAdd': function(data) {
        var user = userDB.findOne({userId: data.Name});
        console.log(data);
        if (user == undefined) {
            userDB.insert({
                userId: data.Name,
                password: data.PhoneNumber
            });
        }
        else {
            return {
                status: '해당 ID가 있습니다.'
            }
        }

        return {
            status: 'success'
        }
    },
    'test': function(data) {
        console.log(data);
        return {
            status: 'success',
            // data: ['one', 'two', 'threew'],
            // data2: {'one2': 'two2'},
            data: [
                {
                    'Name': 'tom',
                    'PhoneNumber': '123'
                },
                {
                    'Name': 'sam',
                    'PhoneNumber': '234'
                },
                {
                    'Name': 'bob',
                    'PhoneNumber': '345'
                }
            ]
        }
    },
    'searchPost': function(data) {
        var jsonData = JSON.parse(data);
        var posts = postDB.find({
            $or: [
                {title: new RegExp(jsonData.searchText, 'i')},
                {body: new RegExp(jsonData.searchText, 'i')},
                {username: new RegExp(jsonData.searchText, 'i')}
            ]
        }).fetch();

        return {
            status: 'success',
            data: posts
        }
    },
    'removeComment': function(data) {
        var jsonData = JSON.parse(data);
        //요청 사용자가 작성자인지 확인한다
        var post = postDB.findOne({_id: jsonData._id});
        var comment = post.comments[jsonData.commentIndex];
        if(comment.username !== jsonData.username) {
            return {
                status: '코멘트 작성자만 삭제 가능합니다.'
            }
        }

        //요청 댓글을 삭제 한다.
        post.comments.splice(jsonData.commentIndex, 1)
        postDB.update({_id: jsonData._id}, post);

        return {
            status: 'success'
        }
    },
    'addComment': function(data) {
        var jsonData = JSON.parse(data);

        var obj = {
            username: jsonData.username,
            createdAt: new Date(),
            comment: jsonData.comment
        }

        var post = postDB.findOne({_id: jsonData._id});
        post.comments.push(obj);

        postDB.update({_id: jsonData._id}, post);

        return {
            status: 'success'
        }
    },
    'countUpPost': function(data) {
        var jsonData = JSON.parse(data);
        var post = postDB.findOne({_id: jsonData._id});
        var count = post.count + 1;
        postDB.update({_id: jsonData._id},{
            $set: {
                "count": count
            }
        });

        return {
            status: 'success'
        }

    },
    'updatePost': function(data) {
        var jsonData = JSON.parse(data);
        if (jsonData['title'] === undefined ||
            jsonData['body'] === undefined ||
            jsonData['_id'] === undefined) {
            return {
                status: '필수 항목이 없습니다.'
            }
        }

        // var keys = Object.getOwnPropertyNames(jsonData);
        // if(keys.indexOf('title') === -1 || keys.indexOf('body') === -1 || keys.indexOf('_id') === -1) {
        //   return {
        //     status: '필수 항목이 빠져 있ㅓ네요.'
        //   }
        // }

        postDB.update({_id: jsonData._id}, {
            $set: {
                title: jsonData.title,
                body: jsonData.body
            }
        });

    },
    'removePost':function(data) {
        var jsonData = JSON.parse(data);
        postDB.remove({_id: jsonData._id});

        return {
            status: 'success'
        }
    },
    'getPost': function(data) {
        var jsonData = JSON.parse(data);
        var post = postDB.findOne({_id: jsonData._id});

        return {
            status: 'success',
            data: post
        }
    },
    'getPosts': function(data) {
        var jsonData = JSON.parse(data);
        var posts = postDB.find({}).fetch();

        return {
            status: 'success',
            data: posts
        }
    },
    'insertPost': function(data) {
        var jsonData = JSON.parse(data);
        jsonData.createdAt = new Date();
        jsonData.count = 0;
        jsonData.comments = [];
        postDB.insert(jsonData);
        return {
            status: 'success'
        }
    },
    'removeUser': function(data) {
        var jsonData = JSON.parse(data);

        var rslt = userDB.remove({username: jsonData.username});
        if(rslt !== 1) {
            //데이터가 1개가 지워진 상황이 아니면 , 에러
            return {
                status: '데이터 삭제에 문제가 있습니다. 고객센터에 문의 해 주세요.'
            }
        }

        return {
            status: 'success'
        };
    },
    'updateUser': function(data) {
        var jsonData = JSON.parse(data);

        //해당 username이 있는지 체크한다 -> 없으면 에러
        var user = userDB.findOne({
            username: jsonData.username
        });

        if (user === undefined) {
            return {
                status: '회원이 없습니다.'
            }
        }
        //있다면 해당 유저의 정보를 업데이트한다.

        //방식1
        // user.address = jsonData.address;
        // user.phone = jsonData.phone;
        // user.nickname = jsonData.nickname;
        // userDB.update({username: jsonData.username}, user);

        //방식2
        userDB.update({username: jsonData.username}, {
            $set: {
                address: jsonData.address,
                phone: jsonData.phone,
                nickname: jsonData.nickname
            }
        });

        return {
            status: 'success'
        };
    },
    'loginUser': function(data) {
        var jsonData = JSON.parse(data);

        //username으로 db에서 회원이 있는지 확인 후 있으면 성공, 없으면 에러 리턴
        var obj = userDB.findOne(
            {
                username: jsonData.username
            }
        );

        if (obj === undefined) {
            return {
                status: '가입된 회원이 없습니다'
            }
        }
        //혹은 비밀번호가 틀렸으면 비밀번호 오류 리턴

        if (obj.password !== jsonData.password) {
            return {
                status: '비밀번호가 다릅니다'
            }
        }


        return {
            status: 'success'
        }
    },
    'joinUser': function(data) {
        var jsonData = JSON.parse(data);
        // console.log(jsonData);

        //기존 회원 아이디가 있으면 가입 안되는 로직.
        //Select count(*) from userDB where username = data.username
        //회원이 없으면 가입시키자 => 회원이 있으면 현재 함수를 종료 시키자


        var obj = userDB.findOne(
            {username: jsonData.username}
        );
        if (obj !== undefined) {
            //회원이 있으므로 가입을 시키면 안되는 상태
            return {
                status: '기존 회원이 있습니다'
            }
        }

        console.log(jsonData);
        //비밀번호와 비밀번호 확인이 다르면 오타로 생각해서 거절.
        if (jsonData.password !== jsonData.passwordConfirm) {
            return {
                status: '비밀번호 확인이 다름.'
            }
        }


        //비밀번호 자릿수가 8자리 이상이어야 함
        if(jsonData.password.length < 8) {
            return {
                status: '비밀번호는 8자리 이상이어야 합니다'
            }
        }
        //아이디의 자릿수도 8자리 이상이어야 함
        if(jsonData.username.length < 8) {
            return {
                status: '아이디는 8자리 이상이어야 합니다'
            }
        }

        //정상 가입 후에는 이메일 인증을 통해 인증이 되어야만 정상 회원으로 등급 업 한다

        jsonData.createdAt = new Date();
        userDB.insert(jsonData);


        return {
            'status': 'success'
        }
    }
});
