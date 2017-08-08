//-------------------------------fuqiang‘s js------------------------------------
$("#endTime").datetimepicker({
    format: "yyyy-mm-dd hh:00:00",
    autoclose: true,
    todayBtn: true,
    minView: 1,
    language: "zh-CN"
}).on('hide', function () {
    myEtime();
    $(this).trigger("input");
});
$("#inputE").datetimepicker({
    format: "yyyy-mm-dd hh:00:00",
    autoclose: true,
    todayBtn: true,
    minView: 1,
    language: "zh-CN"
}).on('hide', function () {
    myStime();
    $(this).trigger("input");
});
//标题
function myFunction(){
     $("#order").html($("#inputEma").val());
    if($("#inputEma").val()==""){
        $("#order").html("标题");
    }/*
    $("#myOrder").html($("#inputEma").val());
    if($("#inputEma").val()==""){
        $("#myOrder").html("满意度调查");
    }
    $("#message").html($("#inputEma").val());
    if($("#inputEma").val()==""){
        $("#message").html("留言板");
    }*/
}
//副标题
function myFunctions(){
    $("#orders").html($("#inputEm").val());
    if($("#inputEm").val()==""){
        $("#orders").html("副标题");
    }/*
    $("#myOpinion").html($("#updown").val());
    console.log($("#updown").val());
    if(!$("#updown").val()){
        $("#myOpinion").html("感谢您的关注！请对我们的服务/产品作出评价。也可以拨打下方电话直接联系我们！");
    }*/
}
//开始时间
function myStime(){
    $("#stime").html($("#inputE").val());
    if($("#inputE").val()==""){
        $("#stime").html(getNowTime("today"));
    }
}
//结束时间
function myEtime(){
    $("#etime").html($("#endTime").val());
    if($("#endTime").val()==""){
        $("#etime").html(getNowTime("nextday"));
    }
}
//获取时间
function  getNowTime(str){
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;

    var strDate = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    //获取下一天
    if(str === "nextday"){
        strDate = strDate + 1;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 1 && hour <= 9) {
        hour = "0" + hour;
    }
    if (min >= 0 && min <= 9) {
        min = "0" + min;
    }
    if (sec >= 0 && sec <= 9) {
        sec = "0" + sec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hour + seperator2 + "00"
        + seperator2 + "00";
    return currentdate;
}
//电话号码
function myTel(){
    /*var reg=/[0-9]{0,}/;
    if($("#inpu").val().length<20){
    if( reg.test($("#inpu").val())) {

        $("#tel").html($("#inpu").val());

        if ($("#inpu").val() == "") {

            $("#tel").html("15210397652");
        }
    }else{*/
        $("#ptel").html($("#tel").val());
        if ($("#tel").val() == "") {

            $("#ptel").html(etel);
        }
    /*}}*/
}
//企业地址
function myAddress(){
    $("#address").html($("#inp").val());
    if($("#inp").val()==""){
        $("#address").html("活动具体地点");
    }
}
///------------------------------------------mafang's js-----------------------------------------

//获取租户相关信息
function getTenantInfo(){
	Iptools.GetJson({
        async: false,
        url: "basic/getMerchantInfoByTenantId",
        data: {
            tenantId: Iptools.DEFAULTS.tenantId,
            token:Iptools.DEFAULTS.token
//            id:valId
        },
    }).done(function(data){
        	if(data){
        		$("#tel").val(data.contactPhone);
        		$("#ptel").html(data.contactPhone);
        		$(".enterpriseAddress").html(data.address?data.address:"");
        		$(".enterpriseName").html(data.merchantName);
        		eadress = data.address?data.address:"";
        		etel = data.contactPhone;
        		ename = data.merchantName;
        		if(data.merchantLogo){
        			$(".pLogo").attr("src",data.merchantLogo);
        		}
        		
        	}
    })
}

//获取裁剪过后的图片地址
function getCanvasImgUrl(canObj){
	var url = "";
	Iptools.uidataTool._uploadCanvasData({ //上传裁剪的图片到服务器，得到图片路径
	    canvas: canObj,
	    type: "picture"
	}).done(function (path) {
	    //$("#crop-test-container").append(Iptools.DEFAULTS.serviceUrl + path);
	    url = Iptools.DEFAULTS.serviceUrl + path;
	});
  return url;
}