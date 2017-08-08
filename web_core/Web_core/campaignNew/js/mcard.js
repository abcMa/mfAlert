/**
 * Created by 1 on 2016/12/28.
 */
function switchBasicInfo(){
//    console.log(1111);
    $(".switchBasic").css("display","block");
    $(".appendInfo").css("display","none");
    $(".section-acticle-bar").removeClass("section-acticle-bar-change");
    $(".section-event .nav-left").removeClass("nav-left-change");
}
//切换到基本设置页面
function switchOther(){
//    console.log(22222);
    $(".switchBasic").css("display","none");
    $(".appendInfo").css("display","block");
    $(".section-acticle-bar").addClass("section-acticle-bar-change");
    $(".section-event .nav-left").addClass("nav-left-change");
}
//初始化颜色选择器插件
$("#nameColor").colorpicker({
    color: "#000000",
    defaultPalette: 'theme',
    history: false,
    transparentColor: true
});
$("#propagandaColor").colorpicker({
    color: "#646464",
    defaultPalette: 'theme',
    history: false,
    transparentColor: true
});
$("#iconColor").colorpicker({
    color: "#5bc0de",
    defaultPalette: 'theme',
    history: false,
    transparentColor: true
});
$("#nameColor").parent().css("width","85px");
$("#propagandaColor").parent().css("width","70px");
$("#iconColor").parent().css("width","70px");
$("#nameColor").on("change.color", function(event, color){
    $("#nameColor+.evo-colorind").attr("style", "background-color:" + color);
    $("#order").attr("style", "color:" + color);
});
$("#propagandaColor").on("change.color", function(event, color){
    $("#propagandaColor+.evo-colorind").attr("style", "background-color:" + color);
    $("#orders").attr("style", "color:" + color);
});
$("#iconColor").on("change.color", function(event, color){
    $("#iconColor+.evo-colorind").attr("style", "background-color:" + color);
    $(".iconColor").attr("style", "color:" + color);
});
//图片上传功能....
var uploadImg=false;
var ImgObj;
$("#photo").on('change',function(e){
    uploadImg=true;
//    console.log(2222222222);
    var files = this.files;
    ImgObj = $(this);
    var img = new Image();
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    $("#campamnyLogo img").remove();
    reader.onload = function(e){
        var mb = (e.total/1024)/1024;
        if(mb>= 2){
            alert('文件大小大于2M');
            return;
        }
        img.src = this.result;
        document.getElementById('campamnyLogo').appendChild(img);
//        console.log(11100011);
        $("#inputEmail").val(files[0].name);
        $("#enrollActivityForm").data("bootstrapValidator").updateStatus("inputEmail", "NOT_VALIDATED").validateField("inputEmail");
    }
});
var uploadBgImg=false;
var bgImgObj;
$("#photoTop").on('change',function(e){
    uploadBgImg=true;
//    console.log(2222222222);
    var files = this.files;
    bgImgObj = $(this);
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    $("#bgPhoto").removeAttr("background-image");
    reader.onload = function(e){
        var mb = (e.total/1024)/1024;
        if(mb>= 2){
            alert('文件大小大于2M');
            return;
        }
//        bg.url = this.result;
        document.getElementById('bgPhoto');
        $("#bgPhoto").attr('style','background-image:url("'+this.result+'")');
//        console.log(11100011);
        $("#inputEmailTop").val(files[0].name);
    }
});
//上传企业名称
$("#uploadName")[0].addEventListener("input", campanyName);
function campanyName(){
    $("#order").html($("#uploadName").val());
}
//上传企业宣传语
$("#propagate")[0].addEventListener("input", campanyPropagate);
function campanyPropagate(){
    $("#orders").html($("#propagate").val());
}
//上传业务详情
$("#business")[0].addEventListener("input", campanyBusiness);
function campanyBusiness(){
    $(".section-found-second-code").html($("#business").val());
}
//上传企业网站
$("#webSite")[0].addEventListener("input", campanyWebSite);
function campanyWebSite(){
    $("#web").html($("#webSite").val());
}
//上传手机号码
$("#tel")[0].addEventListener("input", campanyTel);
function campanyTel(){
    $("#ptel").html($("#tel").val());
}
//上传企业地址
$("#address")[0].addEventListener("input", campanyAddress);
function campanyAddress(){
    $("#paddress").html($("#address").val());
}
//颜色选择插件中文字体
$(".evo-pointer").on("click", function(){
    $(".evo-palette tr:nth-child(1) .ui-widget-content").html("主题颜色");
    $(".evo-palette tr:nth-child(9) .ui-widget-content").text("标准颜色");
    $(".evo-more a").html("网页颜色");
});
//是否显示网站
$(".checkLeft").on("change",function(){
    var value = this.checked?"true":"false";
    if(value=="true"){
//        console.log("选中了");
        $(".webActive").removeAttr("style");
    }else{
//        console.log("没选中");
        $(".webActive").attr("style","display:none;")
    }
});
//----跑马灯----
//var meninfo=$(".section-found-second-code").html();
//function left() {
//    var id = document.getElementById("wenzi");
//    if (typeof id.textContent == "string") {
//        id.textContent = meninfo.substring(0, meninfo.length);
//    } else {
//        id.innerText = meninfo.substring(0, meninfo.length);
//    }
//    meninfo = meninfo + meninfo.substring(0, 1);
//    meninfo = meninfo.substring(1, meninfo.length);
//}
//var times=setInterval(left, 500);
//
//$(".section-found-second-code").on("mouseover",function(){
//    clearInterval(times)
//});