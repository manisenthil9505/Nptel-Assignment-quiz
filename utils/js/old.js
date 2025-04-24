function submitFun() {
    /*  var ch = checkAll();
     if (ch == -1) {alert("some questions might unanswered");return;}
     var cWeek=data[`week ${currentWeek+1}`];
     changeState(1);
     let s=0;
     let totLen=Object.keys(cWeek).length
     for(var i=1;i<=totLen;i++){
         let ele=document.getElementsByName(`name${i}`);
         let checked =Array.from(ele).find(j=>j.checked);
         let selected=checked.value;
         let answer=cWeek[i].options[cWeek[i].answer];
         s+=updateAnswers(i,selected,answer)
     }
     let ele=document.getElementById("score")
     ele.style.display="block"
     ele.innerText=`Score: ${s}/${totLen}` */
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
 function updateMcqs(i) {
    var weakI = data[`week ${i+1}`]
    console.log("week1")
    console.log(weakI[1])

    var keys=Object.keys(weakI);
    let Shuffle=document.getElementsByName("shuffle");
    let isShuffle=Array.from(Shuffle).find(i=>i.checked).value
    if(isShuffle=="1"){
        keys=shuffleArray(Object.keys(weakI));
    }
    var mcq = document.getElementById("mcq");
    mcq.innerHTML = ""
    currentMcqs=[];
    for (var i = 0; i < keys.length; i++) {
        currentMcqs.push(weakI[keys[i]]);
        var options = createElement("div", "options");
        var opLen=weakI[keys[i]].options.length;
        var opKeys=generateArray(opLen)
        if(isShuffle=="1"){
            opKeys=shuffleArray(opKeys);
        }
        for (var j = 0; j < opLen; j++){
            let div = document.createElement("label");
            div.innerHTML = `<input type="radio" class="mcqOptions" name="name${keys[i]}" value="${weakI[keys[i]].options[opKeys[j]]}"> ${weakI[keys[i]].options[opKeys[j]]}
             <img class="answer-img" src="assets\\images\\tick.png" alt="" name="${keys[i]}${weakI[keys[i]].options[opKeys[j]]}">`;
            options.append(div);
            let br=document.createElement("br")
            options.append(br)
        }
        let ele = document.createElement("li");
        let answerBox=createElement("div","answerBox");
        answerBox.innerHTML=` <b id="message${keys[i]}">Answer</b>
                        <div id="exp${keys[i]}">Expected Answer: </div>`
        answerBox.id=`answerBox${keys[i]}`
        let question = createElement("p", "question");

        question.innerHTML = weakI[keys[i]].question;
        ele.append(question);
        try{
            if(weakI[keys[i]].table){
                let table=createTableElement(weakI[keys[i]].table)
                ele.append(table)
            }
        }
        catch(e){}
        if(weakI[keys[i]].isImgExist){
            let img=createImgElement(`w${currentWeek+1}q${keys[i]}`);ele.append(img);
        }
        ele.append(options);
        ele.append(answerBox)
        mcq.append(ele);
    }
    console.log(currentMcqs)
}