/**
 *  File name:speedreader.js
 *  Writer: Zhang Shuangli 1552664
 *  Content: This file controls the behavior of the speedreader html page.
 *           There are total 8 functions and 3 global variables in this js file.
 *
 *
 *     Functions:
 *           (1)initAll:    when the html page is loaded, then this function will
 *                          executes.
 *           (2)startClick:  When the start button is clicked, this function will
 *                           be executed. In this function's control, the reader div
 *                           will get the text message from the text area, and the start
 *                           button, stop button and inout text area will get into the
 *                           start state. And the most important is the words read animation
 *                           will start. I use the setInterval and clearInterval functions to
 *                           control the animation's frames.
 *           (3)getText: This is a function to deal with the text in the input text area
 *                       according to the restricts. When the text area is blank, there will
 *                       be an alert window.
 *           (4)stopClick: When the stop button is clicked, this function will be executed.
 *                         According to the requirements, when the stop button is clicked,
 *                         the animation will stop and some parts will change their state.
 *                         Here are another two functions in this function, stopOrOverState
 *                         and clearInterval.
 *           (5)startClickedState: This is a function to set the state when the start button
 *                                 is clicked. It is used in the startClick function. Each time
 *                                 the startClick is running, this function will be executed.
 *           (6)stopOrOverState: This is a function to set the state when the stop button is
 *                               clicked or the animation is over. So when the stop button is
 *                               clicked successfully and the animation is over, this function
 *                               will be executed.
 *           (7)selectChange: This is a function to get which speed the user selects and then
 *                            sets the speed of animation. It control the reader's speed by
 *                            changing the value of the global variable delay, which is a parameter
 *                            of the function setInterval.
 *           (8)radioControl: This is a function to get which font size the user selects and
 *                            then sets the corresponding size of the font in the reader. It
 *                            controls the reader div by changing the value of a local variable.
 *                            Each time the user selects one of the font size, the size of the
 *                            font in the reader div will be changed immediately.
 *
 *
 *      Global variables:
 *           (1)playTime: This variable records the time each word will show. It is initialed
 *                        in the function getText and will be used in the function wordAnim,
 *                        which is in the function startClick. If playTime[i]==1, then play the
 *                        word once, and if its value is 2 then play the word's animation twice.
 *           (2)delay: It is a variable to control the reader's speed. Its initial value is 171,
 *                     and it may be changed when the function selectChange is executed and it
 *                     will be as the second parameter of the function setInterval, which will
 *                     control the speed the animation plays.
 *           (3)id: This variable is a tag for what the animation it is now. And it is assigned
 *                  a value in the startClick by sentence 'id=setInterval(wordAnim,delay);' and
 *                  will be used in the function stopClick and wordAnim.
 *
 *
 */


"use strict";
window.onload=initAll;
function initAll()
{
    document.getElementById('startBtn').onclick=startClick;
    document.getElementById('stopBtn').onclick=stopClick;
    document.getElementById('stopBtn').disabled=true;
    document.getElementById('stopBtn').style.backgroundColor='lightgray';
    document.getElementById('textArea').cols='80';
    document.getElementById('textArea').rows='10';
    var select=document.getElementById('speedList');
    var speed=['200wpm','300wpm','350wpm','400wpm','450wpm','500wpm'];
    for(var i=0;i<speed.length;i++)
    {
        var _speed=new Option(speed[i],speed[i]);
        select[i]=_speed;
        if(speed[i]=="350wpm")
        {
            select[i].selected=true;
        }
    }
    select.onchange=selectChange;
    document.getElementById('Medium').onclick=radioControl;
    document.getElementById('Medium').checked=true;
    document.getElementById('Big').onclick=radioControl;
    document.getElementById('Bigger').onclick=radioControl;
    document.getElementById('reader').style.fontSize='36pt';
}
/**
 *  Global variable
 */
var playTime=[];  //记录每一个单词要进行动画的次数
var delay=171;     //记录每次动画的速度,也即speed
var id;    //记录动画的id


function startClick()   //开始按钮调用的函数
{
    // alert('click start button');
    var _text=getText();
    // alert("_text:"+_text);
    if(_text===null)
    {
        alert("Please input your text!");
        return;
    }
    startClickedState();
    var reader=document.getElementById('reader');
    var textArray=_text.split(' ');
    // alert(textArray);
    for(var i=0;i<textArray.length;i++)   //在reader中创建子节点以便实行动画
    {
        var spanDom=document.createElement('span');
        spanDom.innerHTML=textArray[i]+" ";
        reader.appendChild(spanDom);
        // console.log(spanDom.innerHTML);
        // frameList
    }
    // alert('animation starts!');
    //字体动画：变色
    var children=reader.childNodes;
    var currentFrame=0;
    var isReplay=false;
    function wordAnim()     //字体动画：改变字体颜色
    {
        if(currentFrame>=children.length-1)
        {
            currentFrame=0;
            console.log("clear interval");
            clearInterval(id);
            stopOrOverState();
            return;
        }
        children[currentFrame].style.color='red';
        if(playTime[currentFrame]==1) {
            console.log(children[currentFrame].innerHTML+" currentFrame:"+currentFrame+","+playTime[currentFrame]);
            currentFrame++;
        }
        else if(playTime[currentFrame]==2)
        {
            console.log(children[currentFrame].innerHTML+" currentFrame:"+currentFrame+","+playTime[currentFrame]);
            if(isReplay)
            {
                isReplay=false;
                currentFrame++;
            }
            else
            {
                isReplay=true;
            }
        }
    }
   id=setInterval(wordAnim,delay);
}

function getText()   //处理textarea中输入的内容
{
    var text=document.getElementById('textArea').value;
    if(text=="")
    {
        return null;
    }
    var words_array = text.split(/[ \t]+/);
    // var words_array = text.split(' ');
    var result="";
        for (var i=0;i<words_array.length;i++)
        {
            var end_char=words_array[i].charAt(words_array[i].length-1);
            // alert(end_char);
            if((end_char>='a'&&end_char<='z')||(end_char>='A'&&end_char<='Z'))
            {
                result+=words_array[i]+" ";
                // alert(result);
                playTime[i]=1;
            }
            else
            {
                var word=words_array[i].substr(0,words_array[i].length-1);
                result+=word+" ";
                playTime[i]=2;
            }
        }
        return result;
}


function stopClick()  //stop按钮调用的函数
{
    // alert('click stop button');
    stopOrOverState();
    clearInterval(id);
}

function startClickedState()  //当按下开始键时规定元素的状态切换
{
    document.getElementById('startBtn').disabled=true;
    document.getElementById('startBtn').style.backgroundColor='lightgray';
    document.getElementById('textArea').disabled=true;
    document.getElementById('textArea').style.backgroundColor='lightgray';
    document.getElementById('stopBtn').disabled=false;
    document.getElementById('stopBtn').style.backgroundColor='white';
}

function stopOrOverState()  //当按下stop键或者是动画结束时规定元素的状态切换
{
    document.getElementById('startBtn').disabled=false;
    document.getElementById('startBtn').style.backgroundColor='white';
    document.getElementById('textArea').disabled=false;
    document.getElementById('textArea').style.backgroundColor='white';
    document.getElementById('stopBtn').disable=true;
    document.getElementById('stopBtn').style.backgroundColor='lightgray';
    // clearReader();
    var reader=document.getElementById('reader');
    reader.innerHTML="";
}

function selectChange()   //控制播放速度
{
    var select=document.getElementById("speedList");
    var index=select.selectedIndex;
    var optionValue=select.options[index].value;
    switch (optionValue)
    {
        case '200wpm':delay=300;break;
        case '300wpm':delay=200;break;
        case '350wpm':delay=171;break;
        case '400wpm':delay=150;break;
        case '450wpm':delay=133;break;
        case '500wpm':delay=120;break;
        default:break;
    }
}

function radioControl()    //控制字体大小
{
    if(this.checked){
        var fontSize="";
        switch(this.value)
        {
            case 'Medium':fontSize='36pt';break;
            case 'Big':fontSize='48pt';break;
            case 'Bigger':fontSize='60pt';break;
            default:break;
        }
        document.getElementById('reader').style.fontSize=fontSize;
        return;}  //不能没有字体大小，所以重复点一个radio都是选中状态
    else
    {
        var radios=document.getElementsByName('radio');
        for(var i=0;i<radios.length;i++)
        {
            if(this.value==radios[i].value)
            {
                radios[i].checked=true;
            }
            else {
                radios[i].checked = false;
            }
        }
    }
}