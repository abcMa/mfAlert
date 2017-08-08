var staAppId = "";
var staRootId = "";
var resAppId = "";
var resRootId = "";
var resListAppId = "";
var resListRootId = "";
var oppAppletId = '';
var oppRootId = '';
var backOpp_id = '';
//        var valueId = 28;
var address = "";
var deviceType = "";
var time = 0;
var startSubTime = null;
var endSubTime;
//快捷版营销没有起止时间的概念
var startTime = "2016-12-06 08:00:00";
var endTime = "2016-12-18 12:00:00";
//        var awardName = "";
var awardTel = "";
var awardName = "精美点心";
var awardLeft = 0;
var formData = [];
var btnC = "#E9394E";
var linkUrl = "http://www.qq.com";
// var img = "http://enterpriseserver.intopalm.com/upload/33/pic/1465901094783.jpg";
var title = "简洁版优惠活动";
var btnHtml = "我感兴趣";
var form_applet =1;
var contactTraceAppletId ;
var contactTraceRootId;
var visitorLinkTagApplet = "";
var visitorLinkTagRootId = "";

var checkRepeatTagApplet = "";
var checkRepeatTagRootId = "";
var visitorTagPool = [];
var tenantName ='';
var tenantAddress = '';
var contactApplet = '';
var newConRoot ="";
var conTagArr = [];
var visiTagArr = [];
//获得ip地址
var phoneIp= returnCitySN.cip;
//用户代理
var userAgent = navigator.userAgent;
//来源
var referrer = document.referrer;
//进入页面的时间
var firstScanTime = "";
var isFirst = 0;
//cookie
var conCookie = '';
//设置cookie
function setCookie(c_name,value,expiredays){
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
};
//获得cookie
function getCookie(c_name){
    if (document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=");
//        console.log(c_start)
        if (c_start!=-1){
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return ""
};
//检查cookie里是否有名称为yzkfk的值
function checkCookie(){
    var yzkfk=getCookie('yzkfk');
    if (yzkfk!=null && yzkfk!=""){
//                alert('your cookie is '+username+'!');
        //如果有yzkfk，那么证明不是第一次进入该页面；新插入数据；first_visit_time不放置值
        conCookie = yzkfk;
    }else{//首次进入--置一个标志位用来标志是否post  first——time
        isFirst = 1;
        var c_value = 'yzkfk'+Math.round(new Date().getTime());
        if (c_value!=null && c_value!=""){
            setCookie('yzkfk',c_value,30);
            conCookie = c_value;
        }
    }
};


//获取url里的参数
function getUrlParameter(paramName) {
    var pageURL = decodeURIComponent(window.location.search.substring(1));
    var urlParams = pageURL.split('&');
    var paramPair;

    for (var i = 0; i < urlParams.length; i++) {
        paramPair = urlParams[i].split('=');
        if (paramPair[0] === paramName) {
            return paramPair[1] === undefined ? null : paramPair[1];
        }
    }
    return null;
};
function checkDataInUrl(data){
    var flag;
    if(data == null || data == "" || data == "null" || data == 0){
        window.location.href = "../404/index.html";
    }else{
        flag=true;
    }
    return flag;
};
function getFirstTime(){
    var dt=new Date();
    var year=dt.getFullYear();
    var month=dt.getMonth()+1;
    if(month < 10)month = '0'+month;
    var day=dt.getDate();
    if(day < 10)day = '0'+day;
    var honrs=dt.getHours();
    if(honrs < 10)honrs = '0'+honrs;
    var minutes=dt.getMinutes();
    if(minutes < 10)minutes = '0'+minutes;
    var seconds=dt.getSeconds();
    if(seconds < 10)seconds = '0'+seconds;
    return year+"-"+month+"-"+day+" "+honrs+":"+minutes+":"+seconds;
};

//创建一个访客信息到contact-applet---18538
function createVisitorInfo(){
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/customizeApplets",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Visitor Detail"'
        },
        async:false,
        success:function(data){
            var visitorApplet = data[0].appletId;//18539
            Iptools.GetJson({
                ajaxCounting:false,
                url:"service/appletConfig",
                data:{
                    tenantId:Iptools.DEFAULTS.tenantId,
                    appletId:data[0].appletId//18539
                },
                async:false,
                success:function(r){
                    var visitorRoot = r.rootBcGroupLinkId;
                    var data = '{"'+visitorRoot+'_ip_address":"'+phoneIp+'","'+visitorRoot+'_device":"'+deviceType+'","'+visitorRoot+'_location":"'+address+'","'+visitorRoot+
                        '_referrer":"'+referrer+'","'+visitorRoot+'_user_agent":"'+userAgent+'","'+visitorRoot+'_cookie":"'+conCookie+'","'+visitorRoot+'_stay_time":"'+time+'"';
                    var firstTime = ',"'+visitorRoot+'_first_visit_time":"'+firstScanTime+'"}';
                    if(isFirst){
                        data += firstTime
                    }else{
                        data += '}';
                    }
//                            console.log(data)
                    Iptools.PostJson({
                        async:false,
                        ajaxCounting:false,
                        url: "service/appletData",
                        data: {
                            tenantId: Iptools.DEFAULTS.tenantId,
                            userId: Iptools.DEFAULTS.userId,
                            appletId: visitorApplet,
                            fieldData: data
                        },
                        success:function(data){
                            $.each(visitorTagPool,function(key,obj){
                                autoTagForVisitor(obj,data.id);
                            })
                        }
                    })
                }
            });
        }
    })
};
function getVisitorLinkApplet(){
    //拿到要往--访客和标签关联的applet，最终要post到该applet下
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/customizeApplets",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Visitor_Tag_Link Applet"'
        },
        async:false,
        success:function(data){
            visitorLinkTagApplet = data[0].appletId;//18540---要post到该applet下
            Iptools.GetJson({
                ajaxCounting:false,
                url:"service/appletConfig",
                data:{
                    tenantId:Iptools.DEFAULTS.tenantId,
                    appletId:visitorLinkTagApplet
                },
                async:false,
                success:function(r){
                    visitorLinkTagRootId = r.rootBcGroupLinkId;
                }
            })
        }
    });
    //拿到去重的list--applet
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/customizeApplets",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Visitor Tag Link List Applet"'
        },
        async:false,
        success:function(data){
            checkRepeatTagApplet = data[0].appletId;//18541---用该listapplet查看去重
            Iptools.GetJson({
                ajaxCounting:false,
                url:"service/appletConfig",
                data:{
                    tenantId:Iptools.DEFAULTS.tenantId,
                    appletId:checkRepeatTagApplet//18541
                },
                async:false,
                success:function(r){
                    checkRepeatTagRootId = r.rootBcGroupLinkId;//10557
                }
            })
        }
    });
}
function autoTagForVisitor(tagId,visitorId){
//            console.log(visitorLinkTagApplet+'-'+visitorLinkTagRootId);
//            console.log(checkRepeatTagApplet+'-'+checkRepeatTagRootId)
    //先将标签提到标签库里，将返回的tagid和visitorid关联到link applet里
    //去重
    Iptools.GetJson({
        ajaxCounting:false,
        url:"service/appletDataGetList",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            appletId:checkRepeatTagApplet,//18541
            condition:'{"'+checkRepeatTagRootId+'_tag_id":"='+tagId+'","'+checkRepeatTagRootId+'_visitor_id":"='+visitorId+'"}'
        },
        async:false,
        success:function(data){
            if(data.listData){
                return false;
            }else{
                Iptools.PostJson({
                    ajaxCounting:false,
                    url:"service/appletData",
                    data: {
                        tenantId: Iptools.DEFAULTS.tenantId,
                        appletId:visitorLinkTagApplet,//18540，
                        fieldData:'{"'+visitorLinkTagRootId+'_tag_id":"'+tagId+'","'+visitorLinkTagRootId+'_visitor_id":"'+visitorId+'"}'
                    },
                    async:false,
                    success:function(data){//标签id和访客id关联到link-applet=18540
                        console.log('关联到了标签和访客')
                    }
                });
            }
        }
    });
};
function tagToTagLib(tagValue){
    Iptools.PostJson({
        ajaxCounting:false,
        url:"basic/tags",
        data: {
            tenantId: Iptools.DEFAULTS.tenantId,
            tagValue:tagValue
        },
        async:false,
        success:function(data){
            visitorTagPool.push(data.id);
//                    console.log('创建标签到标签库,标签id'+data.id+'并放到标签池里')
        }
    });
};
function contactTagToTagLib(tagValue){
    Iptools.PostJson({
        ajaxCounting:false,
        url:"basic/tags",
        data: {
            tenantId: Iptools.DEFAULTS.tenantId,
            tagValue:tagValue
        },
        async:false,
        success:function(data){
            console.log('为客户打的标签post到系统标签库')
        }
    });
}
function autoTagForContact(Id){
    Iptools.PostJson({
        async: false,
        ajaxCounting: false,
        url: "basic/contactMultiTagLinks",
        data: {
            tenantId: Iptools.DEFAULTS.tenantId,
            contactId: Id,
            tagValues: conTagArr.join()
        },
        success: function (data) {
            if (data.retcode == 'ok') {
                console.log('autotag 到客户')
            };
            //添加标签的动作加入客户动态---type2
            $.each(conTagArr, function (key, obj) {
                createTagTrace(obj,Id);
            })
        }
    });
}
//为客户打标签的动态
function createTagTrace(tagName,contact_id){
    Iptools.PostJson({
        ajaxCounting:false,
        url:"service/appletData",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            userId:Iptools.DEFAULTS.userId,
            appletId:contactTraceAppletId,
            fieldData:'{"'+contactTraceRootId+'_title":"'+tagName+'","'+contactTraceRootId+'_contact_id":"'+contact_id+'","'+contactTraceRootId+'_trace_type":"2"}'
        },
        async:false,
        success:function(data){
            console.log('为客户创建标签的动态已post')
        }
    });
};
function getContactApplet(){//为了将得到的cookie等信息提交到2046---客户的applet下（提交了表单的用户put这些信息）
    Iptools.GetJson({
        ajaxCounting: false,
        url: "basic/customizeApplets",
        data: {
            tenantId: Iptools.DEFAULTS.tenantId,
            nameList: '"contact"'
        },
        async: false,
        success: function (data) {
            contactApplet = data[0].appletId;
            Iptools.GetJson({
                ajaxCounting: false,
                url: "service/appletConfig",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    appletId: data[0].appletId//2046
                },
                async: false,
                success: function (r) {
                    newConRoot = r.rootBcGroupLinkId;
                }
            });
        }
    });

}
//拿到租户下的信息
function getTenantIdInfo(){
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/getMerchantInfoByTenantId",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId
        },
        async:false,
        success:function(data){
            tenantName =  data.merchantName;
            $('.company-top').html(tenantName);
            tenantAddress = data.address;
            tenantLogo = data.merchantLogo;
            $('.name-top').css('background-image','url('+tenantLogo+')');
            $('.company-bottom').html(tenantAddress);
        }
    });
}
//由'Campaign Detail Applet'拿到campaign_scene_id
function getCampaignSceneId(){
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/customizeApplets",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Campaign Detail Applet"'
        },
        async:false,
        success:function(data){
            Iptools.GetJson({
                ajaxCounting:false,
                url:"service/appletDataGetDetail",
                data:{
                    tenantId:Iptools.DEFAULTS.tenantId,
                    appletId:data[0].appletId,//8034
                    valueId: Iptools.DEFAULTS.campaignId
                },
                async:false,
                success:function(r){
                    var rootId = r.rootBcGroupLinkId;
                    Iptools.DEFAULTS.campaign_scene_id = r.detailData[rootId+'_campaign_scene_id'];
//                            console.log(Iptools.DEFAULTS.campaign_scene_id)
                }
            });
        }
    });
}
//用户提交表单时，将这个动作post到客户的动态里
//拿到8143，客户动态
function getContactTraceAppletId(){
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/customizeApplets",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Contact Trace Detail"'
        },
        async:false,
        success:function(data){
            contactTraceAppletId = data[0].appletId;
            Iptools.GetJson({
                ajaxCounting:false,
                url:"service/appletConfig",
                data:{
                    tenantId:Iptools.DEFAULTS.tenantId,
                    appletId:contactTraceAppletId//8143
                },
                async:false,
                success:function(data){
                    contactTraceRootId = data.rootBcGroupLinkId;
                }
            });
        }
    });
};


//拿到Opportunity Detail的appletId，用来post用户的预约时间
function getOppApplet(){
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/customizeApplets",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Opportunity Detail"'
        },
        async:false,
        success:function(data){
            oppAppletId = data[0].appletId;
            Iptools.GetJson({
                async: false,
                ajaxCounting:false,
                url: "service/appletConfig",
                data: {
                    tenantId:Iptools.DEFAULTS.tenantId,
                    appletId:oppAppletId
                },
                success: function (data) {
                    oppRootId =  data.rootBcGroupLinkId;//16
                }
            });

        }
    });
};
function addOrderTime(){
    Iptools.PostJson({
        ajaxCounting:false,
        url:"service/appletData",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            userId:Iptools.DEFAULTS.userId,
            appletId:oppAppletId,
            fieldData:'{"'+oppRootId+'_reserve_time":"'+$('#order').val()+'"}'
        },
        async:false,
        success:function(data){
            backOpp_id = data.id;
        }
    });
}
function createContactTrace(marketName,contact_id){
    Iptools.PostJson({
        ajaxCounting:false,
        url:"service/appletData",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            userId:Iptools.DEFAULTS.userId,
            appletId:contactTraceAppletId,
            fieldData:'{"'+contactTraceRootId+'_title":"'+marketName+'","'+contactTraceRootId+'_contact_id":"'+contact_id+'","'+contactTraceRootId+'_trace_type":"1","'+contactTraceRootId+'_value_id":"'+Iptools.DEFAULTS.campaignH5_id+'"}'
        },
        async:false,
        success:function(data){
            console.log('客户参加活动的动态post成功')
        }
    });
}
//浏览量计数
function browseCount(){
    Iptools.PostJson({
        async: false,
        ajaxCounting:false,
        url:"service/appletData",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            appletId:staAppId,
            fieldData:'{"'+staRootId+'_campaign_id":"'+ Iptools.DEFAULTS.campaignId+'","'+staRootId+'_campaign_response_type":"2","'+staRootId+'_campaign_scene_id":"'+ Iptools.DEFAULTS.campaign_scene_id+'"}'
        },
        success:function(data){
            console.log("页面浏览量加1");
//                 console.log(data.id);
        }
    });
};
//计算在该页面的停留时间
function stayTime(){
    time++;
};
function timeCounter(paramTime){
    Iptools.PostJson({
        async: false,
        ajaxCounting:false,
        url: "service/appletData",
        data: {
            tenantId:Iptools.DEFAULTS.tenantId,
            appletId:staAppId,
            fieldData:'{"'+staRootId+'_campaign_id":"'+Iptools.DEFAULTS.campaignId+'","'+staRootId+'_campaign_response_type":"5","'+staRootId+'_campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'","'+staRootId+'_stay_time":"'+paramTime+'"}'
        },
        success: function (data) {
            console.log('你呆了'+paramTime+'秒');
//                     alert('你呆了'+paramTime+'秒')
//                     console.log(data.id);
        }
    });
}
//获得appletId  记名
function getResAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Campaign Response Detail Applet"'
        },
        success: function (data) {
            resAppId =  data[0].appletId;//8045
//                    console.log(resAppId);
            getResRootId();

        }
    });
};
//获得记名的8045的rootid
function getResRootId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "service/appletConfig",
        data: {
            tenantId:Iptools.DEFAULTS.tenantId,
            appletId:resAppId
        },
        success: function (data) {
            resRootId =  data.rootBcGroupLinkId;//106
        }
    });
}
//不记名
function getStaAppletId(){

    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Campaign Statistic Detail Applet"'
        },
        success: function (data) {
            staAppId = data[0].appletId;//8046
//		        	console.log(staAppId);
            getStaRootId();
        }
    });
};
function getStaRootId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "service/appletConfig",
        data: {
            tenantId:Iptools.DEFAULTS.tenantId,
            appletId:staAppId
        },
        success: function (data) {
            staRootId =  data.rootBcGroupLinkId;//107
        }
    });
}

function checkRepeat(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            tenantId:Iptools.DEFAULTS.tenantId,
            nameList:'"Campaign Response List Applet"'
        },
        success: function (data) {
            resListAppId = data[0].appletId;//8049
            getResListRootId();
//                    console.log(resListAppId);
        }
    });
};
function getResListRootId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "service/appletConfig",
        data: {
            tenantId:Iptools.DEFAULTS.tenantId,
            appletId:resListAppId
        },
        success: function (data) {
            resListRootId =  data.rootBcGroupLinkId;//110
        }
    });
}
setTimeout(function(){
    checkRepeat();
},200);

function clickCount(){
    Iptools.PostJson({
        async: false,
        ajaxCounting:false,
        url:"service/appletData",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId,
            appletId:staAppId,
            fieldData:'{"'+staRootId+'_campaign_id":"'+Iptools.DEFAULTS.campaignId+'","'+staRootId+'_campaign_response_type":"1","'+staRootId+'_campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'"}'
        },
        success:function(data){
            console.log("吸引点击量加1");
            // console.log(data.id);
        }
    });
};
function map(){
    var myCity = new BMap.LocalCity();
    myCity.get(myLocation);
};
function myLocation(result){
    var geoc = new BMap.Geocoder();
//    console.log(result.center.lng+'-'+result.center.lat);
    geoc.getLocation(result.center, function(rs){
        var addComp = rs.addressComponents;
        address = String(addComp.province + addComp.city + addComp.district)
        console.log(address);
    });
}
function device(){
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1 //是否iPad
            };
        }()
    };

    if (browser.versions.iPhone|| browser.versions.iPad || browser.versions.ios) {
        deviceType = "iPhone";
//			     console.log("iphone");
    };
    if (browser.versions.android) {
        deviceType = "android";
//			   console.log("android");
    };
};
//获取屏幕高度和宽度,使模态框垂直水平居中
$(document).ready(function() {
    $("html, body").scrollTop(0+"px");//niefuqiang//niefuqiang
    $('html,body').stop().animate({'scrollTop': '0px'}, 400);//niefuqiang
    firstScanTime =  getFirstTime();
    getTenantIdInfo();
    checkCookie();
    map();
    device();
    getContactApplet();
    getVisitorLinkApplet();
//          setTimeout(function(){
//              createVisitorInfo();
//          },3000)

//niefuqiang
    $('.primary').click(function(){
        $('#dialog2').hide();
//        successResetForm();
//        failResetForm();
    });
    //niefuqiang
    $(".successPrimary").click(function(){
        clickResign();
        toInitInfo();
        toBottom();
    });
    //niefuqiang
    $('#dialog1 .primary').click(function(){
        $('#dialog1').hide();
        $('.footl').hide();
        $('.form-group').remove();
    })
    //niefuqiang
    //点击模态框的其他位置，模态框隐藏
    $(".awardModal").click(function () {
        $('.awardModal').hide();
        $(this).hide();
        $(".foots").hide();
        $(".award").hide();
        toSetSuccessInfo();
        $(".successForm .weui_dialog_bd").html("报名成功!");
//        $('.form-group').remove();
    });
    //niefuqiang
    $(".award").click(function () {
        $('.awardModal').hide();
        $(this).hide();
        $(".foots").hide();
        $(".award").hide();
        toSetSuccessInfo();
        $(".successForm .weui_dialog_bd").html("报名成功!");
//        $('.form-group').remove();
    });

//	       	//点击提交表单
    $("#btn").click(function () {
        check();
        $('form').bootstrapValidator('validate');
        if(!$('form').data("bootstrapValidator").isValid()){
            return false;
        }
        //点击提交表单时，统计提交表单的数量,并判断是否为新用户
        getPromptHeight();//niefuqiang
        formCheckAndSubmit();
    });
    elementHeight=$(".foots").height();//niefuqiang
});
function renderTime(){
    $("#order").mobiscroll().datetime({
        theme: 'ios',
        mode: 'scroller',
        display: 'bottom',
        lang: 'zh',
        minDate: new Date(),
        maxDate: new Date(2030,1,1,12,00),
        // stepMinute: 1,
        dateFormat: 'yy-mm-dd'
        //dateFormat:'mm月dd日',
        //dateOrder:"mmdd DD",
        //dateFormat:'DD',
        //dateOrder:"DD",
        //dayNames:['','','今天','明天','','','']
    });
}
//活动倒计时
function comTime(start,end){
    startSubTime = (new Date(startTime))-(new Date());
    endSubTime = (new Date(endTime))-(new Date());
    startDay =  parseInt(startSubTime / 1000 / 60 / 60 / 24);//距离开始天数
    var startHour = parseInt(startSubTime / 1000 / 60 / 60 % 24);//距离开始小时数
    var startMin = parseInt(startSubTime / 1000 / 60 % 60);//距离开始分钟数
    var startSec = parseInt(startSubTime / 1000 % 60);//距离开始秒数
    var endDay =  parseInt(endSubTime / 1000 / 60 / 60 / 24);//距离结束天数
    var endHour = parseInt(endSubTime / 1000 / 60 / 60 % 24);//距离结束小时数
    var endMin = parseInt(endSubTime / 1000 / 60 % 60);//距离结束分钟数
    var endSec = parseInt(endSubTime / 1000 % 60);
    // 距离结束秒数
    if(startDay<10){
        startDay = "0"+startDay;
    };
    if(endDay <10){
        endDay = "0"+endDay;
    };
    if(startHour <10){
        startHour = "0"+startHour;
    }
    if(endHour <10){
        endHour = "0"+endHour;
    }
    if(startMin <10){
        startMin = "0"+startMin;
    }
    if(endMin <10){
        endMin = "0"+endMin;
    }
    if(startSec <10){
        startSec = "0"+startSec;
    }
    if(endSec <10){
        endSec = "0"+endSec;
    }
    //倒计时部分所显示的文字
    if(startSubTime>0){
        $(".time .text").html("活动开始倒计时:"+startDay+"天"+startHour+"时"+startMin+"分"+startSec+"秒")

    }else if(endSubTime<0){
        $(".time .text").html("活动已结束！");
        // $(".time").css("line-height","60px");
    }else if(endSubTime>startSubTime){
        $(".time .text").html("活动结束倒计时:"+endDay+"天"+endHour+"时"+endMin+"分"+endSec+"秒")
    }
}
//设置背景图
function setImg(img){
    $(".picture img").attr("src",img);
};
//设置按钮的文本
function setBtnHtml(html){
    $(".float-btn a").html(html);
};
//设置按钮的颜色
function setBtnColor(color){
    $(".float-btn").css("background",color);
    $(".bt").css("background",color);
};
//改变文档的title
function setTitle(title){
    document.title = title;
    $('.title-top').html(title);
};
function setSub_title(sub_title){
    $('.title-bottom').html(sub_title);
}
function setBottomText(text){
    $('.notice-picture').html(text);
}
function setStartTime(startTime){
    $('.dateTime-top').html(startTime);
}
function setEndTime(endTime){
    $('.dateTime-bottom').html(endTime);
}
function settenantPhone(phone){
    $('.tel .phone a').html(phone);
    $('.tel .phone a').attr('href',"tel:"+phone);
}


//点击参加活动按钮跳转到链接
function openLink(linkUrl){
    window.open(linkUrl);
};
//点击参加活动按钮填写表单时，需要填什么字段
function setFormData(data){
    //预约类型的活动多一个预约类型的input，自己创建,不是传来的
    console.log("执行了");
    $(".form").html("");
    for(var d=0;d<data.length;d++){
        var namev=data[d].columnName.split("_")[1];
        console.log(namev);
        var htmlNew = '<div class="form-group modd">'+
            '<label>'+data[d].display_name+'</label>'+
            '<input class="form-control" id="'+data[d].columnName+'" data-name="'+data[d].columnName+'" name="'+namev+'" placeholder="请输入'+data[d].display_name+'" ">'+
            '</div>';
        $(".foot-bottom.sub").before(htmlNew);
    };
    if(Iptools.DEFAULTS.campaign_scene_id == 38){
        var orderHtml = '<div class="form-group modd">'+
            '<label>预约时间</label>'+
            '<input class="form-control" readonly name="order" id="order" onclick="renderTime()" placeholder="请输入预约时间">'+
            '</div>';
        $(".foot-bottom.sub").before(orderHtml);
    }
    setTimeout(function(){
        $(".form-group input").each(function(i){
            if(data[i]){
                if(data[i].display_name == "电话"){
                    $(this).attr("type","number");
                };
            }
        });
    },300);

    $('#order').click();

};
//        输入框获得焦点底部按钮定位改变和弹窗滚动
//        function rollPopup(){
//            alert("输入框获得焦点");
//            $(".float-btn").attr("position","absolute");
//            $(".foots").attr("position","absolute");
//        }
//        function fixedPopup(){
//            alert("输入框失去焦点");
//            $(".float-btn").removeAttr("position","absolute");
//            $(".foots").removeAttr("position","absolute");
//        }
//表单非空校验和提交时显示奖品信息
function formCheckAndSubmit(){
    var lenArray = [];
    var zeroLen = 0;
    //电话号码和邮箱的验证
    var nameVal = $("#"+formRootId+"_title").val();
    var telVal = $("input[type='number']").val();
//    if($("#email").size()>0){
        var emailVal = $("#"+formRootId+"_email").val();
//    };
    var telLen = telVal.length;
    var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var emailReg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/;
    var formParam =  '{';//为了拼接提交活动的信息统计
    var personInfo = '{';
    $(".form-group").each(function(i){
        var len = $(this).find("input").val().length;
        if($(this).find("input").attr("data-name")){
            var formName = $(this).find("input").attr("data-name");
            var formVal = $(this).find("input").val();
            formParam += '"'+formName+'":"'+formVal+'",';
            var pos = formName.indexOf("_");
            var len = formName.length;
            personInfo += '"'+newConRoot+formName.substring(pos,len)+'":"'+formVal+'",';
        }
        lenArray.push(len);
    });
    for(var l=0;l<lenArray.length;l++){
        if(lenArray[l]==0){
            zeroLen = zeroLen+1;
        }
    }
    if(zeroLen>0){
        $("#dialog2").show();
        $(".weui_dialog_bd").html("请输入完整信息!");
    }else if(telLen != 11 || !telReg.test(telVal)){
        $("#dialog2").show();
        $(".weui_dialog_bd").html("请输入有效的手机号!");
    }else {
        if(emailVal){
            if(!emailReg.test(emailVal)){
                $("#dialog2").show();
                $(".weui_dialog_bd").html("请输入正确的邮箱!");
                return;
            }
        };
//                map();
//                device();
        //
        if(Iptools.DEFAULTS.campaign_scene_id == 38){
            addOrderTime();
        };
        setTimeout(function(){
            //提交表单时的数据统计  记名
            //查看所填的电话号码是否存在
            Iptools.GetJson({
                async: false,
                ajaxCounting:false,
                url:"basic/contacts",
                data:{
                    tenantId:Iptools.DEFAULTS.tenantId,
                    phone:telVal
                },
                success:function(data){
                    if(data.length > 0){
                        var contact_id = data[0].id;
                        //老客户提交的最新信息也要put一下
                        Iptools.PutJson({
                            url:"service/appletData",
                            async: false,
                            ajaxCounting:false,
                            data:{
                                tenantId: Iptools.DEFAULTS.tenantId,
                                userId: Iptools.DEFAULTS.userId,
                                valueId:contact_id,
                                appletId: contactApplet,//2046
                                fieldData: personInfo+'}'
                            },
                            success:function(r){
                                console.log('老用户的新信息put成功')
                            }
                        })
                        autoTagForContact(contact_id);
                        console.log(formParam);
//                                    contactExist(param);
                        //老用户在提交之前先查重，没有重复在提交到response中
                        Iptools.GetJson({
                            async: false,
                            ajaxCounting:false,
                            url:"service/appletDataGetList",
                            data:{
                                tenantId:Iptools.DEFAULTS.tenantId,
                                appletId:resListAppId,//8049
                                pageNow:1,
                                pageSize:1,
                                condition:'{"'+resListRootId+'_contact_id":"='+contact_id+'","'+resListRootId+'_campaign_id":"='+Iptools.DEFAULTS.campaignId+'"}'
                            },
                            success:function(data){
                                if(data.listData){
                                    if(data.listData.records.length == 1){
                                        //显示活动报名成功
                                        $("#dialog1").show();
                                        $(".foots").hide();
                                        toSetSuccessInfo();//niefuqiang
                                        $(".successForm .weui_dialog_bd").html("您已经报名该活动啦!");//niefuqiang
                                        return;
                                    }
                                }else{
                                    var orderData = '';
                                    //如果老用户没有参加过活动,则post到res
                                    //如果是预约形式，则需要post预约时间
                                    if(Iptools.DEFAULTS.campaign_scene_id == 38){

                                        Iptools.PostJson({
                                            async: false,
                                            ajaxCounting:false,
                                            url:"service/appletData",
                                            data:{
                                                tenantId:Iptools.DEFAULTS.tenantId,
                                                appletId:resAppId,//8045
                                                fieldData: '{"'+resRootId+'_campaign_id":"'+ Iptools.DEFAULTS.campaignId+'","'+resRootId+'_campaign_response_type":"3","'+resRootId+'_campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'","'+resRootId+'_is_new":"0","'+resRootId+'_device":"'+deviceType+'","'+resRootId+'_location":"'+address+'","'+resRootId+'_contact_id":"'+contact_id+'","'+resRootId+'_opp_id":"'+backOpp_id+'"}'
                                            },
                                            success:function(data){
                                                console.log("老用户post成功--带预约时间");
//                                                            console.log(data.id);
                                                awardShow(awardLeft,awardName,awardTel);
                                            }
                                        });

                                    }else{
                                        Iptools.PostJson({
                                            async: false,
                                            ajaxCounting:false,
                                            url:"service/appletData",
                                            data:{
                                                tenantId:Iptools.DEFAULTS.tenantId,
                                                appletId:resAppId,//8045
                                                fieldData: '{"'+resRootId+'_campaign_id":"'+ Iptools.DEFAULTS.campaignId+'","'+resRootId+'_campaign_response_type":"3","'+resRootId+'_campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'","'+resRootId+'_is_new":"0","'+resRootId+'_device":"'+deviceType+'","'+resRootId+'_location":"'+address+'","'+resRootId+'_contact_id":"'+contact_id+'"}'
                                            },
                                            success:function(data){
                                                console.log("老用户post成功");
//                                                            console.log(data.id);
                                                awardShow(awardLeft,awardName,awardTel);
                                            }
                                        });
                                    }
                                    createContactTrace(title,contact_id);

                                };
                            }
                        });

                    }else{
                        //新用户
                        formParam +='"'+formRootId+'_contacttype":"2"}';
                        console.log(formParam);
                        //新客户的话需要先往8047里post一条数据，然后拿着得到的id在往8045里post一条数据
//                                    noContact(param);

                        Iptools.PostJson({
                            async: false,
                            ajaxCounting:false,
                            url:"service/appletData",
                            data:{
                                tenantId:Iptools.DEFAULTS.tenantId,
                                appletId:form_applet,
                                fieldData:formParam
                            },
                            success:function(data){
                                var contact_id = data.id;
                                //把收集到的其他信息也post到新用户里
//                                var data = '{"'+newConRoot+'_ip_address":"'+phoneIp+'","'+newConRoot+'_device":"'+deviceType+'","'+newConRoot+'_location":"'+address+'","'+newConRoot+
//                                    '_referrer":"'+referrer+'","'+newConRoot+'_user_agent":"'+userAgent+'","'+newConRoot+'_cookie":"'+conCookie+'"';
//                                var firstTime = ',"'+newConRoot+'_first_visit_time":"'+firstScanTime+'"}';
//                                if(isFirst){
//                                    data += firstTime
//                                }else{
//                                    data += '}';
//                                }
//                                Iptools.PutJson({
//                                    async: false,
//                                    ajaxCounting:false,
//                                    url:"service/appletData",
//                                    data:{
//                                        tenantId:Iptools.DEFAULTS.tenantId,
//                                        appletId:contactApplet,//2046
//                                        valueId:contact_id,
//                                        fieldData:data
//                                    },
//                                    success:function(data){
//                                        console.log("post新用户成功且put新用户的其他信息成功");
//                                    }
//                                });
                                //给新用户带上标签
                                autoTagForContact(contact_id);
                                //用户在提交之前先查重，没有重复在提交到response中
                                Iptools.GetJson({
                                    async: false,
                                    ajaxCounting:false,
                                    url:"service/appletDataGetList",
                                    data:{
                                        tenantId:Iptools.DEFAULTS.tenantId,
                                        appletId:resListAppId,
                                        pageNow:1,
                                        pageSize:1,
                                        condition:'{"'+resListRootId+'_contact_id":"='+contact_id+'","'+resListRootId+'_campaign_id":"='+Iptools.DEFAULTS.campaignId+'"}'
                                    },
                                    success:function(data){
                                        if(data.listData){
                                            if(data.listData.records.length == 1){
                                                $("#dialog2").show();
                                                $(".foots").hide();
                                                toSetSuccessInfo();//niefuqiang
                                                $(".successForm .weui_dialog_bd").html("您已经报名该活动啦!");//niefuqiang
                                                return;
                                            }
                                        }else{
                                            if(Iptools.DEFAULTS.campaign_scene_id == 38){
                                                Iptools.PostJson({
                                                    async: false,
                                                    ajaxCounting:false,
                                                    url:"service/appletData",
                                                    data:{
                                                        tenantId:Iptools.DEFAULTS.tenantId,
                                                        appletId:resAppId,
                                                        fieldData:'{"'+resRootId+'_campaign_id":"'+ Iptools.DEFAULTS.campaignId+'","'+resRootId+'_campaign_response_type":"3","'+resRootId+'_campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'","'+resRootId+'_is_new":"1","'+resRootId+'_device":"'+deviceType+'","'+resRootId+'_location":"'+address+'","'+resRootId+'_contact_id":"'+contact_id+'","'+resRootId+'_opp_id":"'+backOpp_id+'"}'
                                                    },
                                                    success:function(data){
                                                        console.log("新用户参加活动成功---带预约时间");
//                                                                console.log(data.id);
                                                        awardShow(awardLeft,awardName,awardTel);
                                                    }
                                                });
                                            }else{
                                                Iptools.PostJson({
                                                    async: false,
                                                    ajaxCounting:false,
                                                    url:"service/appletData",
                                                    data:{
                                                        tenantId:Iptools.DEFAULTS.tenantId,
                                                        appletId:resAppId,
                                                        fieldData:'{"'+resRootId+'_campaign_id":"'+ Iptools.DEFAULTS.campaignId+'","'+resRootId+'_campaign_response_type":"3","'+resRootId+'_campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'","'+resRootId+'_is_new":"1","'+resRootId+'_device":"'+deviceType+'","'+resRootId+'_location":"'+address+'","'+resRootId+'_contact_id":"'+contact_id+'"}'
                                                    },
                                                    success:function(data){
                                                        console.log("新用户参加活动成功");
//                                                                console.log(data.id);
                                                        awardShow(awardLeft,awardName,awardTel);
                                                    }
                                                });
                                            }

                                            createContactTrace(title,contact_id);
                                        }
                                    }
                                })

                            }
                        });
                    };
                }
            });
        },200);


    };
}
//显示奖品的函数
function awardShow(awardLeft,awardName,awardTel){
    if(awardLeft>0){
        //有奖品时奖品模态框显示
        if(awardName != "" && awardTel != ""){
            $(".award p").eq(1).html(awardName+"一份");
            $(".foots").hide();
            $(".awardModal").show();//niefuqiang
            toInitInfo();//niefuqiang
            $(".award").show();
            $(".award a").attr("href","tel:"+awardTel);
        }
    } else{
        //没奖品时显示报名成功
        $(".foots").hide();
        $("#dialog1").show();
        toSetSuccessInfo();//niefuqiang
        $(".successForm .weui_dialog_bd").html('恭喜您报名成功!');//niefuqiang
    }
};
//----------------------------------------niefuqiangH5弹窗事件-----------------------------------------------------
var elementH=0;
var elementHeight=0;
$(window).scroll(function(){
    elementH=313;
    console.log($(".foots").height());
    console.log($(".successForm").height());
    console.log($(this).scrollTop());
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height()-elementHeight-elementH;
    var windowHeight = $(this).height();
    var wheight=scrollHeight-windowHeight;
    console.log(scrollTop);
    console.log(windowHeight);
    console.log(wheight);
    if(scrollTop >wheight){
            $(".float-btn").hide();
    }else{
           $(".float-btn").show();
    }

});
function toBottom(){
    var scHeight=$(document).height()-$(".float-btn").height()-313;
    $('body,html').animate({'scrollTop':scHeight},400);
};
function toInitInfo(){
    $(".foots").show();
    $(".successForm").hide();
};
function toSetSuccessInfo(){
    $(".foots").hide();
    $(".successForm").show();
};
function getPromptHeight(){
    elementHeight=$(".successForm").height();
    elementH=0;
};
function clickResign(){
    elementHeight=$(".foots").height();
    elementH=40;
};
window.onload = function(){
    document.getElementsByTagName('body')[0].scrollTop = 0;
};
function check(){
    $('form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            groupname: {
                message: '客户群验证失败',
                validators: {
                    notEmpty: {
                        message: '客户群不能为空'
                    }
                }
            },
            groupreson: {
                validators: {
                    notEmpty: {
                        message: '分群依据不能为空'
                    }
                }
            },
            groupdescri: {
                message: '客户群描述验证失败',
                validators: {
                    notEmpty: {
                        message: '客户群描述不能为空'
                    }
                }
            }
        }
    });
}
