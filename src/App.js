import './App.css';
import React,{useState,useEffect} from 'react';
// 기본 게시판 셋팅
// 기본 디자인, 기본 컨텐츠 생성
function Content(props){
  const lis = [];
    for(let i=0; i<props.topics.length; i++){
      let t = props.topics[i];
      lis.push(
      <li key={t.id}>
        <ul className="postBox">
          <li>{t.id}</li>
          <li><a id={t.id} href={"/read/"+t.id} onClick={(event)=>{event.preventDefault(); props.onChangeMode(Number(event.target.id));}}>{t.title}</a></li>
          <li className="">{t.date}</li>
        </ul>
      </li>);
    }
  return <section className='content'>
    <ul className="subText">
          <li>No.</li>
          <li>내용</li>
          <li>날짜</li>
        </ul>
    <ul className="contentBox">
      {lis}
    </ul>
  </section>
}
// 질문 세부정보 
function Article(props){
  return <article className="content">
    <h2 className="contentTitle">
      <p>제목 : </p>
      <p className="title">{props.title}</p> 
    </h2>
    <span className="text text01">{props.body}</span>
  </article>
}
// 질문하기 버튼 생성
function Create(props){
  return <article className="content">
    <h2 className="contentTitle">질문하기</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      const date = event.target.date.value;
      localStorage.setItem('title',title);
      const dbTitle = localStorage.getItem('title');
      console.log(dbTitle);
      props.onCreate(dbTitle,body,date);
    }}>
      {/* 질문 폼 생성 */}
     <p className="inputTitle"> <input name="title" type="text" placeholder='제목을 작성해 주세요.'/></p>
     <p> <input name="date" type="text" placeholder='작성일을 기록해 주세요.'/></p>
     <p className="inputBody"> <textarea name="body" placeholder='내용을 작성해 주세요.'></textarea></p>
     <p><input type="submit" value="저장" /></p>
    </form>
  </article>
}
// 로고 헤더 생성
function Header(props){
  return <header>
    <h1><a href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}
// 수정하기 버튼 생성
function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article className="content">
  <h2 className="contentTitle">질문 수정하기</h2>
  <form onSubmit={event=>{
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    const date = event.target.date.value;
    props.onUpdate(title,body,date);
  }}>
    {/* 수정 폼 생성 */}
   <p className="inputTitle"> <input name="title" type="text" placeholder='제목을 작성해 주세요.' value={title} onChange={event=>{
     setTitle(event.target.value);
   }}/></p>
   <p> <input name="date" type="text" placeholder='작성일을 기록해 주세요.' value={props.date}/></p>
   <p className="inputBody"> <textarea name="body" placeholder='내용을 작성해 주세요.' value={body}  onChange={event=>{
     setBody(event.target.value);
   }}></textarea></p>
   <p><input type="submit" value="수정" /></p>
  </form>
</article>
}
// 메인페이지 디자인
function Main(){
  let textArr = [
    "Learn to HTML",
    "Learn to CSS",
    "Learn to JavaScript",
    "Learn to React.js"
  ];
  // 글씨 타이핑 효과
  useEffect(()=>{
    let target = document.querySelector('#dynamic');
    function randomString(){
      let selectString = textArr[Math.floor(Math.random()*textArr.length)];
      let selectStringArr = selectString.split("");
      return selectStringArr;
    }
    
    function resetTyping(){
      target.textContent = "";
      dynamic(randomString());
    }
    function dynamic(randomArr){
      if(randomArr.length>0){
        target.textContent += randomArr.shift();
        setTimeout(function(){
          dynamic(randomArr);
        },100);
      }else{
        setTimeout(resetTyping, 3000);
      }
    };
     dynamic(randomString());
  },[]);
  
      //커서 깜빡임 효과
  const [cursor, setCursor] = useState(true);
  const toggle = ()=>{
    setCursor(cursor =>!cursor);
  }
  useEffect(()=>{
    const interval = setInterval(toggle,500);
    return () => clearInterval(interval);
}, []);
// 내용 값
 return <div>
   <h2 id="dynamic" className={cursor? '':'active'} onChange={()=>{toggle();}}></h2>
 </div> 
}
function App() {
  const [mode, modeChange] = useState('welcome');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  // 기본 질문, 컨텐츠 내용
  const [topics, setTopics] = useState( [
    {id : 1 , title : '프론트엔드 취준생 입니다.' , body : '퍼블리셔 실무자 양성과정 6개월을 국비지원으로 공부 하였습니다. 독학으로 리액트 공부 중에 있는데, 프론트엔드로 취업 가능할까요?', date : '2022-04-25'},
    {id : 2 , title : '프론트엔드 질문입니다' , body : '프론트엔드 코테는 뭐 준비해야 하나요?', date : '2022-04-25'},
    {id : 3 , title : '프론트엔드 취업 질문' , body : '퍼블리싱 경력이 프론트엔드 취업에 얼마나 도움이 될까요?', date : '2022-04-25'}
  ]);
  let content = null;
  let control = null;
  if(mode=='welcome'){
    content = <div className="mainBox"><Main></Main></div>
  }
  else if(mode=='read'){
    let title, body, date = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id == id){
        title = topics[i].title;
        body = topics[i].body;
        date = topics[i].date;
      }
    }
    content = <Article title={title} body={body} date={date}></Article>;
    control = <>
    <span className="update"> <a href={"/update/"+id} onClick={(event)=>{
      event.preventDefault();
      modeChange('update');
    }}>수정하기</a></span>
    <input type="button" value="삭제하기" onClick={()=>{
            const newTopics = [];
            for (let i=0; i<topics.length; i++){
              if(topics[i].id !== id){
                newTopics.push(topics[i]);
              }
            }
            setTopics(newTopics);
            modeChange('welcome');
          }}></input>
    </>  
  }
  else if(mode == 'create'){
    content = <Create onCreate={(dbTitle, _body, _date)=>{
      const newTopic = {id:nextId, title:dbTitle, body:_body, date:_date};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      modeChange('read');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }
  else if(mode == 'update'){
    let title, body, date = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id == id){
        title = topics[i].title;
        body = topics[i].body;
        date = topics[i].date;
      }
    } 
    control = <Update title={title} body={body} date={date} onUpdate={(title, body, date)=>
    {
      const newTopic = [...topics];
      const updateTopic = {id:id, title:title, body:body, date:date};
      for(let i=0; i<topics.length; i++){
        if(newTopic[i].id == id){
          newTopic[i] = updateTopic;
          break;
        }
      }
      setTopics(newTopic);
      modeChange('read');
    }}></Update>
  }
  return (
    <div className="App">
      <Header title="프론트엔드 게시판" onChangeMode={()=>{
        modeChange('welcome');
      }}></Header>
      <div className="container">
      <div className="contents">{content} {control}</div>
      <Content topics={topics} onChangeMode={(_id)=>{modeChange('read'); setId(_id);}}></Content>
      <span className="create">
       <a href="/" className="" onClick={(event)=>{
        event.preventDefault();
        modeChange('create');
      }}>질문하기</a>
      </span>
      </div>
    </div>
  );
}

export default App;
