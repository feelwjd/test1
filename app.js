var express = require('express');                 
var app = express();
var mysql = require('mysql');  
                 
const cors = require('cors')
const serverless = require('serverless-http');
                            
app.use(express.urlencoded({extended: true}));  
app.use(express.json());
app.use(cors());

app.set('view engine', 'jade');                  
app.set('views', './views');    


const connection = {                            // 데이터 베이스 연결 설정 
  host: "cbkim2.c1yma7jrflra.ap-northeast-2.rds.amazonaws.com",     
  port: "3306",                                // PORT
  user: "root",                                 // 사용자
  password: "11111111",                       // 비밀 번호
  database: "member",                         // Database 명
};

var conn = mysql.createConnection(connection); // DB 연결 객체
conn.connect();                                // DB 연결

app.listen(3000, function(){                     // 웹 서버 포트
  console.log('Connected, 3000 port!');
});

const handler = serverless(app);
exports.handler = async (event, context) => {
    return await handler(event, context);
};

// index ////////////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res) {                 // index
  res.render('view');                           // view.jade
})

// 2. 회원 가입 /////////////////////////////////////////////////////////////////////////////

app.get('/register', function(req, res) {  
  res.render('register');                     // register.jade   
});

app.post('/register', function(req, res) {  
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const job = req.body.job;
  const gender = req.body.gender;
  const hobby = req.body.hobby;
   console.log(name);
  const sql = 'INSERT INTO test (name, id, pwd, tel, job, gender, hobby) VALUES(?, ?, ?, ?, ?, ?, ?)';
    conn.query(sql, [name, id, pwd, tel, job, gender, hobby], function(err, member, fields){
    // 웹브라우저 자바스크립트 API 사용
    res.send("<script> alert('회원 등록되었습니다.'); location.href = '/dev/login';</script>");
//    res.redirect('/login');              // 회원가입 후 로그인으로 자동이돋
  });
});

// 3. 로그인 ////////////////////////////////////////////////////////////////////////////////////////////

app.get('/login', function(req, res) {     // 
  res.render('login');                         // 회원가입 폼   
});

app.post('/login', function(req, res) {  
  const id = req.body.id;                    // 아이디
  const pwd = req.body.pwd;              // 패스워드
  const sql = 'SELECT * FROM test';             
  var use = 1;

  conn.query(sql, function(err, members, fields){      

  for(var i=0 ; i<members.length ; i++){         // 행(아이템)의 갯수
    if(members[i].id == id && members[i].pwd == pwd) {
      use = 0;
      res.redirect('/dev/member/' + members[i].id_1); 
    } 
  }  

  if(use == 1) {
   res.send("<script> alert('회원 번호나 비밀번호가 틀립니다.'); window.location = '/dev' </script>");
   }
  });
});

// 4. 회원 가입 후 //////////////////////////////////////////////////////////////////////////////

app.get('/member/:idx', function(req, res){
    const idx = req.params.idx;
    res.render('view_1', {id : idx});  
  });

// 5. 회원 수정 //////////////////////////////////////////////////////////////////////////////

app.get('/edit/:idx', function(req, res){    // 글 수정 페이지
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member, fields){
     console.log(member[0]);
     res.render('edit', {member : member[0]});  // 회원 수정 화면
  });
});

app.post(['/edit/:idx'], function(req, res){    
  const idx = req.params.idx;
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const job = req.body.job;
  const gender = req.body.gender;
  const hobby = req.body.hobby;
  console.log(idx)
  var sql = 'UPDATE test SET name=?, id=?, pwd=?, job=? WHERE id_1=?';
  conn.query(sql, [name, id, pwd, job, idx], function(err, result, fields){
     console.log('업데이트되었어요');
     res.redirect('/dev/member/'+ idx);
  });
});

// 6. 회원 삭제 /////////////////////////////////////////////////////////////////////////////////

app.get('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member){
    res.render('delete', {member : member[0]});
  });
});

app.post('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'DELETE FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, result){
    res.redirect('/dev');
  });
});