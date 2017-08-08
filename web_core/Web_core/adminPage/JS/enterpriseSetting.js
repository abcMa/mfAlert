//设置相关的全局变量
var msgNum = "";
var  msgMoney= "";
var orderNo = "";
var imgPath = "";
//页面加载完成后的简单交交互
$(document).ready(function(){
    $("form").show();
    $(".account").hide();
    $('.enterpriseInfo').click(function(){
        $(this).find("h4").addClass("infoActive");
        $(".accountInfo h4").removeClass("infoActive");
        $("form").show();
        $(".account").hide();
    });
    $('.accountInfo').click(function(){
        $(this).find("h4").addClass("infoActive");
        $('.enterpriseInfo h4').removeClass("infoActive");
        $("form").hide();
        $(".account").show();
    });
    //企业简称失去焦点的时候提示
    $("input.shortName").blur(function(){
        var RegExp =/^[\u4e00-\u9fa5A-Za-z0-9]{2,8}$/;
        if($(".shortName").val() == ""){
            $(this).parent().find(".wrong-msg").html("请填写企业简称");
            $(this).css("border-color","#f66");
        }else if($(".shortName").val().length < 2){
            $(this).parent().find(".wrong-msg").html("企业简称至少要有2个字符");
            $(this).css("border-color","#f66");
        }else if(!RegExp.test($(".shortName").val())){
            $(this).parent().find(".wrong-msg").html("企业简称格式不对");
            $(this).css("border-color","#f66");
        }else if($(".shortName").val() > 8){
            $(this).parent().find(".wrong-msg").html("企业简称不能超过8个字符");
            $(this).css("border-color","#f66");
        }else {
            $(this).parent().find(".wrong-msg").html("");
            $(this).css("border-color","#ccc");
        }
    });
    //点击充值按钮
    $("#recharge").click(function(){
        showRechargeItems();
    });
    //点击当前短信条数，添加蒙版
    $(".recharge").click(function(){
        $(".recharge-mask").removeClass("active");
        $("#goPay").removeClass("btn-disable");
        $("#goPay").removeAttr("disabled");
        //点击后得到选择短信的数量以及支付的金额
        msgNum = parseInt($(this).find(".messageNum span").html());
        msgMoney  = parseInt($(this).find(".total span").html());
        if($(this).hasClass("active")){
            $(this).parent().find(".recharge-mask").removeClass("active");
        }else{
            $(this).parent().find(".recharge-mask").addClass("active");
        }
    });
//点击当前蒙版，清楚当前蒙版
    $(".recharge-mask").on("click",function(){
        //支付btn不能点击
        $("#goPay").attr("disabled","disabled");
        $("#goPay").addClass("btn-disable");
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
            $(this).addClass("active");
        }
    });
});
//.............加载页面input框里面的信息....................
setTimeout(function(){
    getInfoByTenantid();
},300);
function getInfoByTenantid(){
    Iptools.GetJson({
        url: "basic/getMerchantInfoByTenantId",
        data: {
            tenantId: Iptools.DEFAULTS.tenantId,
        },
    }).done(function (data) {
        //console.log(data)
        if(data){
            buildEnterpriseInfo(data);
        }
    });
}
//回显企业信息
function buildEnterpriseInfo(data){
    $(".shortName").val(data.shortName);
    $(".briefIntroduction").val(data.briefIntroduction);
    $(".address").val(data.address);
    $(".contactPhone").val(data.contactPhone);
    if(data.industry != undefined || data.industry != "" || data.industry != null){
        $(".industry").val(data.industry);
    };
    if(data.website != undefined || data.website != "" || data.website != null){
        $(".website").val(data.website);
    };
    if(data.mail != undefined || data.mail != "" || data.mail != null){
        $(".mail").val(data.mail);
    };
    var introduction = data.introduction;
    if(introduction == 'undefined' || introduction == "" || introduction == null){
        $(".introduction").val();
    }else{
        $(".introduction").val(introduction);
    }
    if(data.merchantLogo != ""){
        $(".logo-position img").attr("src",data.merchantLogo);
        $("#crop-test-input").attr("data-value",data.merchantLogo);
    }
    $(".keep").attr("data-id",data.id);
}
//...................选择上传企业LOGO文件............
var imgCanvas = "";
function addFile(e){
    if (e.files && e.files.length) {
        component._crop({
            file: e.files[0],
            aspectRatio: 1 / 1, //图片裁剪框比例
            getCanvas: function (canvas) {//点击确定触发
                $("#crop-test-container").css("display","block");
                $("#crop-test-container").html(canvas);
                imgCanvas = canvas;
            }
        });
    }
    $("input#crop-test-input").val("");
};
function commitTenantInfo(e){
    var RegExp =/^[\u4e00-\u9fa5A-Za-z0-9]{2,8}$/;
    if($(".shortName").val() == ""){
        $(this).parent().find(".wrong-msg").html("请填写企业简称");
        $(this).css("border-color","#f66");
        return;
    }else if($(".shortName").val().length < 2){
        $(this).parent().find(".wrong-msg").html("企业简称至少要有2个字符");
        $(this).css("border-color","#f66");
        return;
    }else if(!RegExp.test($(".shortName").val())){
        $(this).parent().find(".wrong-msg").html("企业简称格式不对");
        $(this).css("border-color","#f66");
        return;
    }else if($(".shortName").val() > 8){
        $(this).parent().find(".wrong-msg").html("企业简称不能超过8个字符");
        $(this).css("border-color","#f66");
        return;
    }
    if($("#crop-test-container").html() != ""){
        Iptools.uidataTool._uploadCanvasData({ //上传裁剪的图片到服务器，得到图片路径
            async:false,
            canvas: imgCanvas,
            type: "picture"
        }).done(function (path) {
            imgPath = Iptools.DEFAULTS.serviceUrl + path;
            $("#crop-test-input").attr("data-value",imgPath);
        });
    }else{
        imgPath = $(".logo-position img").attr("src");
    }
    var outParamObj = {};
    outParamObj["token"] = Iptools.DEFAULTS.token;
    outParamObj["id"] = $(".keep").attr("data-id")?$(".keep").attr("data-id"):"";
    outParamObj["shortName"] = $("input.shortName").val()?$("input.shortName").val():"";
    outParamObj["briefIntroduction"] = $("input.briefIntroduction").val()?$("input.briefIntroduction").val():"";
    outParamObj["address"] = $("input.address").val()?$("input.address").val():"";
    outParamObj["contactPhone"] = $("input.contactPhone").val()?$("input.contactPhone").val():"";
    outParamObj["industry"] = $("#industry option:selected").text()?$("#industry option:selected").text():"";
    outParamObj["website"] = $("input.website").val()?$("input.website").val():"";
    outParamObj["mail"] = $("input.mail").val()?$("input.mail").val():"";
    outParamObj["introduction"] = $("textarea.introduction").val()?$("textarea.introduction").val():"";
    outParamObj["merchantLogo"] = $("#crop-test-input").attr("data-value")?$("#crop-test-input").attr("data-value"):"";
    Iptools.PutJson({
        url: "basic/tenantMerchantInfos",
        data: outParamObj,
    }).done(function(data){
        if(data){
            //console.log(data)
            buildEnterpriseInfo(data);
            Iptools.Tool.pAlert({
                type: "info",
                title: "系统提示：",
                content: "更新完成",
                delay: 1000
            });
        };
    }).fail(function(){
        Iptools.Tool.pAlert({
            type: "danger",
            title: "系统提示：",
            content: "更新失败",
            delay: 1000
        });
        return ;
    });
}
//.................充值逻辑.....................
function showRechargeItems() {
    $("#myModal").modal("show");
    $("#payQRArea").hide();
    $("#payState").hide();
    $("#rechargeItems").show();
    for(var i = 0;i < $(".recharge-mask").length;i++){
        $($(".recharge-mask")[i]).removeClass("active");
    }
};
//点击支付按钮
var ip = returnCitySN["cip"];
var timer;
function goPay(e){
    //参数
    var money = (msgNum) * 10;
    var paramObj = {
        "token":Iptools.DEFAULTS.token,
        "channel":"wx_pub_qr",
        "clientIp":ip,
        "amount":money,
        "subject":"易掌客短信充值",
        "payBody":"易掌客短信充值"+msgNum+"条",
        "item.name":"msg",
        "item.counter":msgNum,
    };
    Iptools.PostJson({
        url:"basic/createOrder",
        data:paramObj,
    }).done(function(data){
        if(data){
            if(data.retcode === "ok"){
                $(".wx_mobile_qr").empty();
                //生成支付二维码
                $(".wx_mobile_qr").qrcode({
                    render: "canvas", //table方式
                    width: 150, //宽度
                    height:150, //高度
                    correctLevel:3,
                    text: data.charge.credential.wx_pub_qr //任意内容
                });
                orderNo = data.charge.orderNo;
                $("#myModal .modal-title").html("支付方式");
                $("#payQRArea").show();
                $("#rechargeItems").hide();
                //调用支付是否成功接口查看支付状态
                timer = setInterval(function () {getPayState(orderNo)},2000);
            }
        }
    })
};
//查看是否完成付款
function getPayState(orderNo){
    Iptools.GetJson({
        url:"basic/tenantOrders/isPaid",
        data:{
            "tenantId":Iptools.DEFAULTS.tenantId,
            "orderNo":orderNo
        },
    }).done(function(data){
        if(data === false){
            /* 				  alert("支付失败");
             $("#payQRArea").hide();
             $("#payState").show();
             $(".pay_fail").show(); */
        }else{
            //alert("支付成功");
            msgAndCharge();
            $("#payQRArea").hide();
            $("#payState").show();
            $(".pay_success").show();
            //关闭计时器
            clearInterval(timer);
        }
    })
}
//充值之后返回租户的所有充值消息和短信消息的更新
function msgAndCharge(){
    Iptools.GetJson({
        url:"basic/tenants/getAccountInfo",
        data:{
            //"tenantId":Iptools.DEFAULTS.tenantId
            "token":Iptools.DEFAULTS.token,
        },
    }).done(function(data){
        if(data){
            var rechargeAmt = 0;
            if(data.rechargeAmt){
                rechargeAmt = data.rechargeAmt;
            };
            $(".rechargeTotal").html(rechargeAmt);
            $(".remainMsg").html(data.smsRemain);
            $(".userMsg").html(data.smsUsed);
        }
    })
}
//取消支付
function preStep(){
    $("#myModal .modal-title").html("短信充值");
    $("#payQRArea").hide();
    $("#payState").hide();
    $("#rechargeItems").show();
}
/*企业信息返回按钮方法*/
function goBack(){
    Iptools.Tool._redirectToParent();
}

