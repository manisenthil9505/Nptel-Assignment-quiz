import { fullData } from './data.js'
var urlEle = new URLSearchParams(window.location.search);
var cIndex = parseInt(urlEle.get("course"))
var data = fullData[cIndex]["mcq"]
var currentWeek = 0;
var currentMcqs=[];
var isWeekSelectExam=document.getElementById("isWeekSelectExam");
var weekTray=document.getElementById("weekTray");
var mcq = document.getElementById("mcq");
console.log(cIndex);
let shuffelBUt=document.querySelectorAll(".shuffelBUt");
shuffelBUt[1].addEventListener("click",()=>updateMcqs(currentWeek))
shuffelBUt[0].addEventListener("click",()=>updateMcqs(currentWeek))
document.getElementById('em').addEventListener('click',()=>{
    let ele=document.querySelector(".answer-img");
    console.log("value "+ele.getAttribute("name"));

} );
document.getElementById("weekSelectExamUpdate").addEventListener("click",getExamMcq)
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('submit').addEventListener('click', submitFun);
var cName=document.getElementById("courseName");
cName.innerText=fullData[cIndex].name;
var wList = document.getElementById("week-list");
wList.innerHTML = "";
var wLen = Object.keys(data).length;
for (let i = 0; i < wLen; i++) {
    let ele = createWeekElement(i,`Week ${i + 1}`,0);
    wList.append(ele);
}
wList.append(createWeekElement(99,"Special Exam",1));

weekChange(0);

function createElement(type, cl) {
    var ele = document.createElement(type);
    ele.classList.add(cl);
    return ele;
}
function createWeekElement(i,text,isExam) {
    let li = document.createElement("li");
    li.innerHTML = text;
    li.classList.add("week");
    if(isExam==0){
        li.classList.add("ass")
        li.addEventListener("click", () => weekChange(i));
    }
    else{
        li.id="specialExam"
        li.addEventListener("click",updateSpecialExam);
    }
    return li;
}
function reset(){
    changeState(0);
    let answerImg=document.querySelectorAll(".answer-img");
    answerImg.forEach(i=>i.style.display="none");
    let ele=document.getElementById("score")
    ele.style.display="none"
    var cWeek=currentMcqs;
    for(var i=0;i<currentMcqs.length;i++){
        let answerBox=document.getElementById(`answerBox${i}`);
        answerBox.style.display="none";
    }
    let mcqOptions=document.querySelectorAll(".mcqOptions");
    Array.from(mcqOptions).forEach(i=>i.checked=false);
}
function checkAll() {
    for (var i = 0; i <currentMcqs.length; i++) {
        let ele=document.getElementsByName(`ques${i}`);
        let d=Array.from(ele).find(j=>j.checked);
        //console.log(d);
        if(d==null) {
            return -1;
        }
    }
    return 0;
}
async function submitFun() {
    if(currentMcqs.length==0) return;
    var ch = checkAll();
    if (ch == -1) {alert("some questions might unanswered");return;}
    var cWeek=currentMcqs;
    changeState(1);
    let s=0;
    let totLen=Object.keys(cWeek).length
    for(var i=0;i<totLen;i++){
        let ele=document.getElementsByName(`ques${i}`);
        let checked =Array.from(ele).find(j=>j.checked);
        let selected=checked.value;
        let answer=cWeek[i].options[cWeek[i].answer];
        s+=updateAnswers(i,selected,answer)
    }
    let ele=document.getElementById("score")
    ele.style.display="block"
    ele.innerText=`Score: ${s}/${totLen}`
}
function changeState(ch) {
    try{
        for (var i = 1; i <= Object.keys(data[`week ${currentWeek+1}`]).length; i++) {
            var radio = document.getElementsByName(`name${i}`);
            radio.forEach(i => {
                i.disabled = ch == 1 ? true : false;
            })
        }
    }
    catch(e){

    }
}
function weekChange(i) {
    isWeekSelectExam.checked=false;
    
    weekTray.checked=true;
    let allWeek = document.querySelectorAll(".ass");
    removeWeek();
    allWeek[i].classList.add("sel");
    currentWeek = i;
    let weekNum = document.getElementById("week-num")
    weekNum.innerText = `Week ${currentWeek + 1} Assignment`
    updateMcqs(currentWeek);
}
function removeWeek() {
    let allWeek=document.querySelectorAll(".sel");
    allWeek.forEach(i => {
        i.classList.remove("sel");
    })
}
function updateMcqs(i) {
    var weakI = data[`week ${i+1}`]
    console.log("week1")
    var keys=Object.keys(weakI);
    let Shuffle=document.getElementsByName("shuffle");
    let isShuffle=Array.from(Shuffle).find(i=>i.checked).value
    if(isShuffle=="1"){
        keys=shuffleArray(Object.keys(weakI));
    }
    mcq.innerHTML = ""
    currentMcqs=[];
    for (var i = 0; i < keys.length; i++) {
        currentMcqs.push(weakI[keys[i]]);
        var opLen=weakI[keys[i]].options.length;
        var mcqQue=weakI[keys[i]];
        var opKeys=generateArray(opLen)
        if(isShuffle=="1"){
            opKeys=shuffleArray(opKeys);
        }
        let mcqtile=createMcqTile(i,mcqQue,opKeys)
        mcq.append(mcqtile);
    }
    console.log(currentMcqs)
}
function createMcqTile(i,mcqQue,opKeys){
    var options = createElement("div", "options");
    for (var j = 0; j < opKeys.length; j++){
        let div = document.createElement("label");
        div.innerHTML = `<input type="radio" class="mcqOptions" name="ques${i}" value="${mcqQue.options[opKeys[j]]}"> ${mcqQue.options[opKeys[j]]} 
                        <img class="answer-img" src="assets\\images\\tick.png" alt="" name="imgg${i}${mcqQue.options[opKeys[j]]}">`;
        options.append(div);
        let br=document.createElement("br")
        options.append(br)
        
    }
    let ele = document.createElement("li");
    let answerBox=createElement("div","answerBox");
    answerBox.innerHTML=` <b id="message${i}">Answer</b>
                    <div id="exp${i}">Expected Answer: </div>`
    answerBox.id=`answerBox${i}`
    let question = createElement("p", "question");

    question.innerHTML = mcqQue.question;
    ele.append(question);

    try{
        if(mcqQue.table){
            let table=createTableElement(mcqQue.table)
            ele.append(table)
        }
    }
    catch(e){}
    if(mcqQue.isImgExist){
        let img=createImgElement(mcqQue.imgLoc);ele.append(img);
    }
    ele.append(options);
    ele.append(answerBox)
    return ele;
}
function generateArray(n){
    return Array.from({ length: n }, (_, i) => i);
}
function createTableElement(tData){
    var table=document.createElement("table");
    var keys=Array.from(Object.keys(tData));
    keys.forEach(i=>{
        let tr=createRowElement(i,tData[i]);
        table.append(tr);
    })
    return table;
}
function createRowElement(k,a){
    let tr=document.createElement("tr");
    tr.innerHTML=`<td>${k}</td><td>${a}</td>`
    return tr;
}
function createImgElement(name){
    let img=document.createElement("img")
    img.classList.add("imageBox");
    img.src=`assets/course/${fullData[cIndex].name}/${name}.png`
    return img;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate random index
      var j = Math.floor(Math.random() * (i + 1));
      // Swap elements
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function updateAnswers(i,selected,answer){
    let ele=document.getElementsByName(`ques${i}`);
    let answerBox=document.getElementById(`answerBox${i}`);
    answerBox.style.display="flex";
    let message=document.getElementById(`message${i}`);
    let exp=document.getElementById(`exp${i}`)
    let c=selected==answer?1:0;
    let answerIndicator1=document.getElementsByName("imgg"+i+answer)[0];
    console.log(answerIndicator1);
    answerIndicator1.style.display="inline"
    if(c==1){ 
        answerBox.style.background="#00800091";
        message.innerText="Correct Answer"
        exp.style.display="none";
        return 1;
    }
    else{ 
        answerIndicator1=document.getElementsByName("imgg"+i+selected)[0];
        answerIndicator1.setAttribute("src","assets/images/cross.png")
        answerIndicator1.style.display="inline"
        message.innerText="Wrong Answer"
        answerBox.style.background="#e73e2091"
        let t=currentMcqs[i];
        exp.style.display="block";
        exp.innerText=`Expected Answer: ${t.options[t.answer]}`
        return 0;
    }

}
function updateSpecialExam(){
    removeWeek();
    let specialExam=document.getElementById("specialExam");
    specialExam.classList.add("sel");
    isWeekSelectExam.checked=true;
     let weekNum = document.getElementById("week-num")
    weekNum.innerText = `${fullData[cIndex].name} Exam`
    mcq.innerHTML="";
    weekTray.checked=true;
    currentMcqs=[];
}
function getExamMcq(){
    mcq.innerHTML="";
    currentMcqs=[];
    let selectByRangeBut=document.getElementsByName("selectByRangeBut")
    selectByRangeBut=Array.from(selectByRangeBut).find(i=>i.checked).value;
    var arr=[]
    if(selectByRangeBut==1){
        var from=document.getElementById("form")
        var to=document.getElementById("to")
        if(parseInt(from.value)>12) from.value=12;
        if(parseInt(to.value)>12) to.value=12;
        if(parseInt(from.value)>parseInt(to.value)){
            var t=from.value;
            from.value=to.value;
            to.value=t;
        }
        var Weeks=Array.from(Object.keys(data));
        for(var i=parseInt(from.value)-1;i<parseInt(to.value);i++){
            arr.push(Weeks[i])
        }
    }
    else {
        for(var i=1;i<13;i++){
            if(document.getElementById(`cbWeek${i}`).checked) arr.push(`week ${i}`);
        }
    }
    var mcqs=getAllMcq(arr)
    var length=Array.from(Object.keys(mcqs)).length;
    var n=document.getElementById("nQues");
    if(parseInt(n.value)>length) n.value=length; 
    var keys=pickRandomNumbers(parseInt(n.value),length)
    for(var i=0;i<keys.length;i++){
        currentMcqs.push(mcqs[keys[i]]);
        let opt=mcqs[keys[i]].options.length;
        let opKeys=generateArray(opt)
        opKeys=shuffleArray(opKeys);
        let ele=createMcqTile(i,mcqs[keys[i]],opKeys)
        mcq.append(ele);    
    }
    console.log(currentMcqs)
}
function getAllMcq(totWeek){
    var q=1;
    var allMcq={}
    totWeek.forEach((i)=>{
        let ques=Array.from(Object.keys(data[i]))
        ques.forEach((j)=>{
           allMcq[q++]=data[i][j]
        })
    })
    return allMcq;
}
function pickRandomNumbers(n, K) {
    if (n > K) {
        throw new Error("n cannot be greater than K");
    }
    let numbers = [];
    for (let i = 1; i <= K; i++) {
        numbers.push(i);
    }
    for (let i = numbers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, n);
}
