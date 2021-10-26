const express = require('express');
const app = express();
var bodyParser = require('body-parser');         // post 전송 미들웨어
app.use(bodyParser.urlencoded({extended : false}));
var fs = require('fs');
const port = 3000;

app.set('view engine', 'jade');
app.set('views', './views');    



app.listen(port, function(){
  console.log(`Example app listening at http://localhost:${port}`);
});
var mysql = require('mysql');

const connection = {   
  host: "cloudcomputing.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com",     // IP
  port: "3306",                  // PORT
  user: "cloud",                  // 사용자
  password: "12345678",    // 비밀 번호
  database: "member",       // Database 명
};

var conn = mysql.createConnection(connection); // DB 커넥션
conn.connect();                                // DB 연결


///////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res) {                 // index
  res.render('view.jade');                         // view.jade
})

// 회원 가입 /////////////////////////////////////////////////////////////////////////////

app.get('/register', function(req, res) {  
  res.render('register');                     // register.jade   
});

app.post('/register', function(req, res) {  
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const gender = req.body.gender;
  const job = req.body.job;
  const hobby = req.body.hobby;

  const sql = "INSERT INTO test (name, id, pwd, tel, gender, job, hobby) VALUES('"+name+"','"+id+"','"+pwd+"','"+tel+"','"+gender+"','"+job+"','"+hobby+"')";
    conn.query(sql, function(err, topics, fields){
    res.redirect('/login');              // 회원가입 후 로그인으로 자동이돋
  });
});

// 로그인 ////////////////////////////////////////////////////////////////////////////////////////////

app.get('/login', function(req, res) {     // 
  res.render('login');                         // 회원가입 폼   
});

app.post('/login', function(req, res) {  
  const id = req.body.id;                    // 아이디
  const pwd = req.body.pwd;              // 패스워드
  sql = 'SELECT * FROM test';             
  var use = 1;

  conn.query(sql, function(err, members, fields){      
  for(var i=0; i<members.length; i++){         // 행(아이템)의 갯수
    if(members[i].id == id && members[i].pwd == pwd) {
      use = 0;
      console.log('로그인 되었어요');
      //res.redirect('/member/'+(i+1)); 
      res.redirect('/member/'+members[i].id_1)
    } 
  }  

  if(use == 1) {
    console.log('비밀번호나 패스워드가 틀립니다.');
     res.redirect('/login'); 
  }
  });
});

// 회원 가입 후 //////////////////////////////////////////////////////////////////////////////

app.get('/member/:idx', function(req, res){
    const idx = req.params.idx;
    res.render('view_1', {id : idx});  
  });

// 회원 수정 //////////////////////////////////////////////////////////////////////////////

app.get('/edit/:idx', function(req, res){    // 글 수정 페이지
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member, fields){
      console.log(member[0]);
     res.render('edit', {member : member[0]});  // 회원 수정 화면
  }); 
});

app.post(['/edit/:idx'], function(req, res){ 
  var idx = req.params.idx;   
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const gender = req.body.gender;
  const job = req.body.job;
  const hobby = req.body.hobby;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql,idx,function(err,result){
    const sql2 = "UPDATE test SET id_1 ='"+idx+"', name ='"+name+"', id= '"+id+"', pwd ='"+pwd+"' , tel = '"+tel+"', gender = '"+gender+"', job = '"+job+"', hobby = '"+hobby+"' where id_1 = '"+idx+"';"
    conn.query(sql2,idx,function(err,result){
      res.redirect('/member/'+idx)
    });
  });
});

// 회원 삭제 /////////////////////////////////////////////////////////////////////////////////

app.get('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member){
    res.render('delete', {member : member[0]});
  });
});

app.post('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql,idx,function(err,result){
    const sql2 = "DELETE FROM test where id_1 = "+idx+";"
    conn.query(sql2,idx,function(err,result){
      res.redirect('../login');
    });
  });
});

