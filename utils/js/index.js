import { fullData } from "./data.js";
var cList=document.getElementById("courseList");
for(var i=0;i<fullData.length-1;i++){
    let ele=createCourseTile(fullData[i].name,i);
    cList.append(ele);
}
function createElement(type,cl){
    var ele = document.createElement(type);
    ele.classList.add(cl);
    return ele;
}
function createCourseTile(n,i){
    let li =document.createElement('li');
    let ct=createElement("div","courseTit");
    ct.innerHTML=` <img src="assets\\images\\NPTEL_logo_128.png" alt="">
                ${n}`;
    let a = document.createElement("a");
    a.href=`course.html?course=${i}`;
    a.innerHTML="<button id='goToC'>Go to Course</button>";
    li.append(ct);
    li.append(a);
    return li;
}