//-------------------------------fuqiang‘s js------------------------------------
$("#endTime").datetimepicker({
    format: "yyyy-mm-dd hh:ii:ss",
    autoclose: true,
    todayBtn: true,
    language: "zh-CN"
}).on('hide', function () {
    myEtime();
});
$("#inputE").datetimepicker({
    format: "yyyy-mm-dd hh:ii:ss",
    autoclose: true,
    todayBtn: true,
    language: "zh-CN"
}).on('hide', function () {
    myStime();
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
        ajaxCounting:false,
        url: "basic/getMerchantInfoByTenantId",
        data: {
            tenantId: Iptools.DEFAULTS.tenantId
//            id:valId
        },
        success: function (data) {
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
        }
    });
}