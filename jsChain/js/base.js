/**
 * Created by mafang on 2017/7/17.
 */
//函数对象
function f1(){

}
f1.name = "ma";//function对象不能通过此方法新增属性
f1.prototype={
    calAge:function(){
        this.age = 20;//this指f1对象
        console.log(this.name);
    }
}
//console.log(f1.calAge());//报错
var f2=function(){

}
var f3 = new Function();

//普通对象
var o1 = {};
var o2 = new Object();

var o3 = new f1();
o3.name = "fang";//console.log(o3.name)-->fang
o3.calAge();

var o4 = f2();//o4为undefined
var o5= o1;//object

//数组对象
var a1 = [];
//日期对象
var d1=new Date();

console.log(
typeof f1+"-"+
typeof f2+"-"+
typeof f3+"-"+
typeof o1+"-"+
typeof o2+"-"+
typeof o3
);
console.log(f1.prototype === Function.prototype);//false
console.log(f1.prototype === Object.prototype);//false
console.log(f1.prototype instanceof Object);//true


//------------------------------
$(".area1").on("click",".a-span",function(e){
    alert("span1");
})
$(".area2").on("click",".a-span",function(e){
    $(".area2").append("<p>eeeee</p>");
})
