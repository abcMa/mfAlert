//图片上传功能....
document.getElementById('photo').addEventListener('change',function(e){
    var files = this.files;
    var img = new Image();
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    $("#iimg img").remove();
    reader.onload = function(e){
        var mb = (e.total/1024)/1024;
        if(mb>= 2){
            alert('文件大小大于2M');
            return;
        }
        img.src = this.result;
        document.getElementById('iimg').appendChild(img);
    }
});
//表单提交功能....
function myFunction(){
     $("#order").html($("#inputEma").val());
    if($("#inputEma").val()==""){
        $("#order").html("最牛设计师为你打造独一无二的设计");
    }
    $("#myOrder").html($("#inputEma").val());
    if($("#inputEma").val()==""){
        $("#myOrder").html("满意度调查");
    }
    $("#message").html($("#inputEma").val());
    if($("#inputEma").val()==""){
        $("#message").html("留言板");
    }
}
//标题和副标题的显示
function myFunctions(){
    $("#orders").html($("#inputEm").val());
    if($("#inputEm").val()==""){
        $("#orders").html("最牛设计师为你打造独一无二的设计最牛设计师为你打造独一无二的设计最牛设计师为你打造独一无二的设计");
    }
    $("#myOpinion").html($("#updown").val());
//    console.log($("#updown").val());
    if(!$("#updown").val()){
        $("#myOpinion").html("感谢您的关注！请对我们的服务/产品作出评价。也可以拨打下方电话直接联系我们！");
    }
}
//显示输入的当前日期时间
$("#stime").ready(function(){
    var c=new Date();
    var M=c.getMonth();
    var d=c.getDate();
    var h=c.getHours();
    var m=c.getMinutes();
    var s=c.getSeconds();
    M<10?M="0"+M:M;
    d<10?d="0"+d:d;
    h<10?h="0"+h:h;
    m<10?m="0"+m:m;
    s<10?s="0"+s:s;
    var bb=c.getFullYear()+"-"+M+"-"+(d-1)+"  "+h+":"+ m+":"+s;
    var dd=c.getFullYear()+"-"+M+"-"+d+"  "+h+":"+ m+":"+s;
    $("#stime").html(bb);
    $("#etime").html(dd);
});
//显示日期时间控制
function myStime(){
    var c=new Date();
    var dd=c.getFullYear()+"."+c.getMonth()+"."+c.getDate()+"  "+c.getHours()+":"+ c.getMinutes()+":"+c.getSeconds();
    $("#stime").html($("#inputE").val());
    if($("#inputE").val()==""){
        $("#stime").html(dd);
    }
}
function myEtime(){
    var c=new Date();
    var dd=c.getFullYear()+"."+c.getMonth()+"."+c.getDate()+"  "+c.getHours()+":"+ c.getMinutes()+":"+c.getSeconds();
    $("#etime").html($("#input").val());
    if($("#input").val()==""){
        $("#etime").html(dd);
    }
}
//显示输入的电话号码以及验证
function myTel() {
    $("#tel").html($("#inpu").val());
    $("#tel").html().replace(reg,"");
    var reg= /^[A-Za-z]+$/;
    if (reg.test($("#tel").html())){
        $("#tel").html("15210397652");
    }
    if ($("#inpu").val() == "") {
        $("#tel").html("15210397652");
    }
}
//左侧地点输入放到活动具体地点
function myAddress(){
    $("#address").html($("#inp").val());
    if($("#inp").val()==""){
        $("#address").html("活动具体地点");
    }
}
//富文本编译器
    $('#editer').summernote({
        height:200,
        lang: 'zh-CN',
        callbacks: {
//            富文本失去焦点事件内容放到左侧预约须知里
            onBlur: function () {
                var value = $(this).summernote("code");
//                console.log(value);
                $("#odd").html( $(this).summernote("code"));
            }
        },
//        初始化编辑器添加功能
        toolbar:[
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['para', ['paragraph']],
            ['Misc', ['fullscreen', 'undo']]
        ]
    });
//“选择活动类型”页面右侧白框点亮左边蓝球
function porters(){
    $("#hom").addClass("display-none");
    $("#hom-one").removeClass("display-none");
    $("#hom-two").removeClass("display-none");
    $("#hom-three").removeClass("display-none");
    $("#hom-four").removeClass("display-none");
}
function news(){
    $("#hom").removeClass("display-none");
    $("#hom-one").addClass("display-none");
    $("#hom-two").removeClass("display-none");
    $("#hom-three").removeClass("display-none");
    $("#hom-four").removeClass("display-none");
}
function itns(){
    $("#hom").removeClass("display-none");
    $("#hom-one").removeClass("display-none");
    $("#hom-two").addClass("display-none");
    $("#hom-three").removeClass("display-none");
    $("#hom-four").removeClass("display-none");
}

function sgs(){
    $("#hom").removeClass("display-none");
    $("#hom-one").removeClass("display-none");
    $("#hom-two").removeClass("display-none");
    $("#hom-three").addClass("display-none");
    $("#hom-four").removeClass("display-none");
}
function rpds(){
    $("#hom").removeClass("display-none");
    $("#hom-one").removeClass("display-none");
    $("#hom-two").removeClass("display-none");
    $("#hom-three").removeClass("display-none");
    $("#hom-four").addClass("display-none");
}
//function kles(){
//    $("#kle").toggleClass("interaction-three");
//}
//function dies(){
//    $("#die").toggleClass("profit-one");
//}
//
//function dcts(){
//    $("#dct").toggleClass("profit-two");
//}
//
//function pmns(){
//    $("#pmn").toggleClass("profit-three");
//}
//
//function lfts(){
//    $("#lft").toggleClass("flow-one");
//}
//
//function pes(){
//    $("#pe").toggleClass("flow-two");
//}
//function mes(){
//    $("#me").toggleClass("senior-one");
//}































window.onload=function(){
    //preview();
}