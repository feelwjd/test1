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
/////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/form', function(req, res) {  
  res.render('form');                     // form.Jade
})
/////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/topic", function (req, res) {   
    var title = req.body.title;                  // 전송된 제목(파일 이름)         
    var description = req.body.description     // 전송된 내용(파일 내용)

    //          파일이름,      내용,         에러 
    fs.writeFile('data/' + title, description , function(err) {
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      
      res.redirect('/topic/');              // 경로 자동 이동
    });  
});
///////////////////////////////////////////////////////////////////////
app.get(["/topic", "/topic/:title"], function (req, res) { // FORM
    var title = req.params.title;        // 선택한 파일
    fs.readdir('data', function(err, titles) {
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      if(title) {         // 파일이 있는 경우 파일 내용 읽음
        fs.readFile('data/'+title, function(err, description) {
          res.render("view", {titles : titles, title : title, description : description}); 
        });
      }
      else          // 파일이 없으면
        res.render("view", {titles : titles, title:'Welcome', description:'Topic is'}); 
    })
  });

// form의 post 전송을 위한 미들웨어
app.use(express.urlencoded({ extended: true }));  
app.use(express.json());

app.set('view engine', 'jade');             
app.set('views', './views');    

var mysql = require('mysql');

const connection = {   
  host: "database-1.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com",     // IP
  port: "3306",                  // PORT
  user: "admin",                  // 사용자
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
  const job = req.body.job;
  const hobby = req.body.hobby;

  const sql = "INSERT INTO test (name, id, pwd, tel, job, hobby) VALUES('"+name+"','"+id+"','"+pwd+"','"+tel+"','"+job+"','"+hobby+"')";
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
      res.redirect('/member/' +(i+1)); 
    } 
  }  

  if(use == 1) {
    console.log('비밀번호나 패스워드가 틀립니다.');
     res.redirect('/'); 
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
  const job = req.body.job;
  const hobby = req.body.hobby;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql,idx,function(err,result){
    const sql2 = "UPDATE test SET (name, id, pwd, tel, job, hobby) VALUES('"+name+"','"+id+"','"+pwd+"','"+tel+"','"+job+"','"+hobby+"') where id=1;"
    conn.query(sql2,idx,function(err,result){
      res.redirect('/member/1')
    });
  });
});

// 회원 삭제 /////////////////////////////////////////////////////////////////////////////////

app.get('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member){
    res.render('view', {member : member[0]});
  });
});

app.post('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member){
    res.render('view', {member : member[0]});
  });
});

