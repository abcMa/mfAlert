var tenantId = getUrlParameter("tenantId");
var campaignH5_id = getUrlParameter("h5Id");
var token = getUrlParameter("token");
var historyForm = getUrlParameter("form");
var channel = getUrlParameter("channel");
var ytk_tId = getUrlParameter("ytk_tenant_id");
var readOnly = getUrlParameter("readOnly");//为1时不计数
campaignH5_id = campaignH5_id.replace('_from','');
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
var startSubTime = "";
var endSubTime = "";
//快捷版营销没有起止时间的概念
var startTime = "";
var endTime = "";
var campaignTimeCount = "";
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
var traceTime = "";
var visitorApplet = "";
var visitorRoot = "";
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
    traceTime = dt.format("yyyy-MM-dd hh:mm:ss");
    var year=dt.getFullYear();
    var month=dt.getMonth()+1;
    if(month < 10){
        month = '0'+month;
    };
    var day=dt.getDate();
    if(day < 10){
        day = '0'+day;
    };
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
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Visitor Detail"'
    }).done(function(data){
        visitorApplet = data.applets[0].applet;//18539
        Iptools.uidataTool._getApplet({
            applet:visitorApplet//18539
        }).done(function(r){
            visitorRoot = r.rootLink;
        })
    })
};
function postVisitorInfo(){
    var data = '{"'+visitorRoot+':ip_address":"'+phoneIp+'","'+visitorRoot+':device":"'+deviceType+'","'+visitorRoot+':location":"'+address+'","'+visitorRoot+
        ':referrer":"'+referrer+'","'+visitorRoot+':user_agent":"'+userAgent+'","'+visitorRoot+':cookie":"'+conCookie+'","'+visitorRoot+':stay_time":"'+time+'"';
    var firstTime = ',"'+visitorRoot+':first_visit_time":"'+firstScanTime+'"}';
    if(isFirst){
        data += firstTime
    }else{
        data += '}';
    };
    Iptools.uidataTool._addAppletData({
        appletId:visitorApplet,
        data:data
    }).done(function(data){
        $.each(visitorTagPool,function(key,obj){
            autoTagForVisitor(obj,data.id);
        })
    })
}
function getVisitorLinkApplet(){
    //拿到要往--访客和标签关联的applet，最终要post到该applet下
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Visitor_Tag_Link Applet"'
    }).done(function(data){
            visitorLinkTagApplet = data.applets[0].applet;//18540---要post到该applet下
            Iptools.uidataTool._getApplet({
                applet:visitorLinkTagApplet
            }).done(function(r){
                visitorLinkTagRootId = r.rootLink;
            })
    })
    //拿到去重的list--applet
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Visitor Tag Link List Applet"'
    }).done(function(data){
            checkRepeatTagApplet = data.applets[0].applet;//18541---用该listapplet查看去重
            Iptools.uidataTool._getApplet({
                applet:checkRepeatTagApplet//18541
            }).done(function(r){
                    checkRepeatTagRootId = r.rootLink;//10557
            })
    })
}
function autoTagForVisitor(tagId,visitorId){
//            console.log(visitorLinkTagApplet+'-'+visitorLinkTagRootId);
//            console.log(checkRepeatTagApplet+'-'+checkRepeatTagRootId)
    //先将标签提到标签库里，将返回的tagid和visitorid关联到link applet里
    //去重
    Iptools.uidataTool._getUserlistAppletData({
        appletId:checkRepeatTagApplet,//18541
        condition:'{"'+checkRepeatTagRootId+':tag_id":"='+tagId+'","'+checkRepeatTagRootId+':visitor_id":"='+visitorId+'"}'
    }).done(function(s){
            if(s.data){
                return false;
            }else{
                Iptools.uidataTool._addAppletData({
                    appletId:visitorLinkTagApplet,//18540，
                    data:'{"'+visitorLinkTagRootId+':tag_id":"'+tagId+'","'+visitorLinkTagRootId+':visitor_id":"'+visitorId+'"}'
                }).done(function(data){//标签id和访客id关联到link-applet=18540
                        console.log('关联到了标签和访客')
                })
            }
    })
};
function tagToTagLib(tagValue){
    Iptools.PostJson({
        ajaxCounting:false,
        url:"basic/tags",
        data: {
            token: Iptools.DEFAULTS.token,
            tagValue:tagValue
        }
//        async:false,
    }).done(function(data){
            visitorTagPool.push(data.id);
//                    console.log('创建标签到标签库,标签id'+data.id+'并放到标签池里')
    })
};
function contactTagToTagLib(tagValue){
    Iptools.PostJson({
        ajaxCounting:false,
        url:"basic/tags",
        data: {
            token: Iptools.DEFAULTS.token,
            tagValue:tagValue
        }
//        async:false,
    }).done(function(data){
            console.log('活动带的自动标签打到系统标签库')
    })
}
function autoTagForContact(Id){
    Iptools.PostJson({
//        async: false,
        ajaxCounting: false,
        url: "basic/contactMultiTagLinks",
        data: {
            token: Iptools.DEFAULTS.token,
            contactId: Id,
            tagValues: conTagArr.join()
        }
    }).done(function(data){
            if (data.retcode == 'ok') {
                console.log('autotag 到客户')
            };
            //添加标签的动作加入客户动态---type2
            $.each(conTagArr, function (key, obj) {
                createTagTrace(obj,Id);
            })
    })
}
//为客户打标签的动态
function createTagTrace(tagName,contact_id){
    Iptools.uidataTool._addAppletData({
        appletId:contactTraceAppletId,
        data:'{"'+contactTraceRootId+':title":"'+tagName+'","'+contactTraceRootId+':contact_id":"'+contact_id+'","'+contactTraceRootId+':trace_type":"2"}'
    }).done(function(data){
            console.log('为客户创建标签的动态已post')
    })
};
//创建客户的动态
function createConTrace(conName,contact_id){
    Iptools.uidataTool._addAppletData({
        appletId:contactTraceAppletId,
        data:'{"'+contactTraceRootId+':title":"'+conName+'","'+contactTraceRootId+':contact_id":"'+contact_id+'","'+contactTraceRootId+':trace_type":"4"}'
    }).done(function(data){
        console.log('新客户被创建的动态已post')
    });
};
//编辑客户的动态
function editConTrace(editName,contact_id){
    Iptools.uidataTool._addAppletData({
        appletId:contactTraceAppletId,
        data:'{"'+contactTraceRootId+':title":"'+editName+'","'+contactTraceRootId+':contact_id":"'+contact_id+'","'+contactTraceRootId+':trace_type":"5"}'
    }).done(function(data){
        console.log('编辑客户的动态已post')
    });
};
function getContactApplet(){//为了将得到的cookie等信息提交到2046---客户的applet下（提交了表单的用户put这些信息）
    Iptools.uidataTool._getCustomizeApplet({
        nameList: '"contact"'
    }).done(function(data){
            contactApplet = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet//2046
            }).done(function(r){
                    newConRoot = r.rootLink;
            })
    })

}
//拿到租户下的信息
function getTenantIdInfo(){
    Iptools.GetJson({
        ajaxCounting:false,
        url:"basic/getMerchantInfoByTenantId",
        data:{
            tenantId:Iptools.DEFAULTS.tenantId
        }
//        async:false,
    }).done(function (data) {
        if(data.merchantName){
            tenantName =  data.merchantName;
            $('.company-top').html(tenantName);
        };
        if(data.address){
            tenantAddress = data.address;
            $('.company-bottom').html(tenantAddress);
        };
        if(data.merchantLogo){
            tenantLogo = data.merchantLogo;
            $('.name-top').css('background-image','url('+tenantLogo+')');
        };
    })
}
//由'Campaign Detail Applet'拿到campaign_scene_id
function getCampaignSceneId(){
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Campaign Detail Applet"'
    }).done(function(data){
        Iptools.uidataTool._getUserDetailAppletData({
            appletId:data.applets[0].applet,//8034
            valueId: Iptools.DEFAULTS.campaignId
//            async:false
        }).done(function (r) {
                var rootId = r.rootLink;
                Iptools.DEFAULTS.campaign_scene_id = r.data[rootId+':campaign_scene_id'];
            //在铺设表单时需要看一下是否是预约活动类型，所以要判断campaign_scene_id，所以得在拿到campaign_scene_id之后再去铺设表单
                setFormData(formData);
                if(!readOnly){
                    browseCount(channel,ytk_tId);
                }
            })
    })
}
//用户提交表单时，将这个动作post到客户的动态里
//拿到8143，客户动态
function getContactTraceAppletId(){
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Contact Trace Detail"'
    }).done(function(data){
            contactTraceAppletId = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:contactTraceAppletId//8143
            }).done(function(data){
                    contactTraceRootId = data.rootLink;
            })
    })
};


//拿到Opportunity Detail的appletId，用来post用户的预约时间
function getOppApplet(){
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Opportunity Detail"'
    }).done(function(data){
            oppAppletId = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:oppAppletId
            }).done(function (data) {
                oppRootId =  data.rootLink;//16
            })
    })
};
function addOrderTime(){
    Iptools.uidataTool._addAppletData({
        appletId:oppAppletId,
        data:'{"'+oppRootId+':reserve_time":"'+$('#order').val()+'"}'
    }).done(function(data){
            backOpp_id = data.id;
    })
}
function createContactTrace(marketName,contact_id){
    Iptools.uidataTool._addAppletData({
        appletId:contactTraceAppletId,
        data:'{"'+contactTraceRootId+':title":"'+marketName+'","'+contactTraceRootId+':trace_category":"6","'+contactTraceRootId+':trace_time":"'+traceTime+'","'+contactTraceRootId+':contact_id":"'+contact_id+'","'+contactTraceRootId+':trace_type":"1","'+contactTraceRootId+':value_id":"'+Iptools.DEFAULTS.campaignId+'"}'
    }).done(function(data){
            console.log('客户参加活动的动态post成功');
//        Iptools.PostJson({
//            url:"/basic/updateInteractValue?token="+Iptools.DEFAULTS.token+'&contactTrace='+data.id
//        }).done(function(data){
//
//        });
    })
}
//浏览量计数
function browseCount(channelFrom,ytk_id){
    var data = '{"'+staRootId+':campaign_id":"'+ Iptools.DEFAULTS.campaignId+'","'+staRootId+':campaign_response_type":"2","'+staRootId+':campaign_scene_id":"'+ Iptools.DEFAULTS.campaign_scene_id+'"';
    if(channelFrom){
        data += ',"'+staRootId+':channel":"'+channelFrom+'","'+staRootId+':yuntui_tenant_id":"'+ytk_id+'"';
    };
    data += '}';
    Iptools.uidataTool._addAppletData({
        appletId:staAppId,
        data:data
    }).done(function(data){
//            console.log("页面浏览量加1");
    })
};
//计算在该页面的停留时间
function stayTime(){
    time++;
};
function timeCounter(paramTime,channelFrom,ytk_id){
    var data = '{"'+staRootId+':campaign_id":"'+Iptools.DEFAULTS.campaignId+'","'+staRootId+':campaign_response_type":"5","'+staRootId+':campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'","'+staRootId+':stay_time":"'+paramTime+'"';
    if(channelFrom){
        data += ',"'+staRootId+':channel":"'+channelFrom+'","'+staRootId+':yuntui_tenant_id":"'+ytk_id+'"';
    }
    data += '}';
    Iptools.uidataTool._addAppletData({
        appletId:staAppId,
        data:data
    }).done(function(data){
            console.log('你呆了'+paramTime+'秒');
//                     console.log(data.id);
    })
}
//获得appletId  记名
function getResAppletId(){
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Campaign Response Detail Applet"'
    }).done(function(data){
            resAppId =  data.applets[0].applet;//8045
//                    console.log(resAppId);
            getResRootId();
    })
};
//获得记名的8045的rootid
function getResRootId(){
    Iptools.uidataTool._getApplet({
        applet:resAppId
    }).done(function(data){
        resRootId =  data.rootLink;//106
    })
}
//不记名
function getStaAppletId(){
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Campaign Statistic Detail Applet"'
    }).done(function(data){
            staAppId = data.applets[0].applet;//8046
//		        	console.log(staAppId);
            getStaRootId();
    })
};
function getStaRootId(){
    Iptools.uidataTool._getApplet({
        applet:staAppId
    }).done(function(data){
        staRootId =  data.rootLink;//107
    })
}

function checkRepeat(){
    Iptools.uidataTool._getCustomizeApplet({
        nameList:'"Campaign Response List Applet"',
        async: false
    }).done(function(data){
            resListAppId = data.applets[0].applet;//8049
            getResListRootId();
//            console.log(resListAppId);
    })
};
function getResListRootId(){
    Iptools.uidataTool._getApplet({
        applet:resListAppId
    }).done(function(data){
            resListRootId =  data.rootLink;//110
    })
}
setTimeout(function(){
    checkRepeat();
},200);

function clickCount(channelFrom,ytk_id){
    var data =  '{"'+staRootId+':campaign_id":"'+Iptools.DEFAULTS.campaignId+'","'+staRootId+':campaign_response_type":"1","'+staRootId+':campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'"';
    if(channelFrom){
        data += ',"'+staRootId+':channel":"'+channelFrom+'","'+staRootId+':yuntui_tenant_id":"'+ytk_id+'"';
    }
    data += '}';
    Iptools.uidataTool._addAppletData({
        appletId:staAppId,
        data:data
    }).done(function(data){
            console.log("吸引点击量加1");
            // console.log(data.id);
    })
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
//        console.log(address);
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
    createVisitorInfo();
    checkCookie();
    map();
    device();
    getContactApplet();
    getVisitorLinkApplet();


    $('.primary').click(function(){
        $('#dialog2').hide();
    });
    //niefuqiang
    $(".successPrimary").click(function(){
        clickResign();
        toInitInfo();
        toBottom();
        $(".float-btn").removeClass("success");
        if(!readOnly){
            clickCount(channel,ytk_tId);
        }
    });
    //niefuqiang
    $(".failPrimary").click(function(){
        clickResign();
        toInitInfo();
        toBottom();
    });
    $('#dialog1 .primary').click(function(){
        $('#dialog1').hide();
        $('.footl').hide();
        $('.form-group').remove();
    })
    //点击模态框的其他位置，模态框隐藏
    $(".awardModal").click(function () {
//        $('.foot').hide();
        $(this).hide();
        $(".foots").hide();
        $(".award").hide();
//        $('.form-group').remove();
        toSetSuccessInfo();
        $(".successForm .weui_dialog_bd").html("报名成功!");
        $(".float-btn").addClass("success");
    });
    //niefuqiang
    $(".award").click(function () {
        $('.awardModal').hide();
        $(this).hide();
        $(".foots").hide();
        $(".award").hide();
        toSetSuccessInfo();
        $(".successForm .weui_dialog_bd").html("报名成功!");
        $(".float-btn").addClass("success");
//        $('.form-group').remove();
    });
//	       	//点击提交表单
    $("#btn").click(function () {
        check();
        $('form').bootstrapValidator('validate');
        if(!$('form').data("bootstrapValidator").isValid()){
            return false;
        }
        $(".float-btn").removeClass("success");
        //点击提交表单时，统计提交表单的数量,并判断是否为新用户
        getPromptHeight();//niefuqiang点击表单设置元素高低和内边距
        if(!readOnly){
            clickCount(channel,ytk_tId);
        }
        formCheckAndSubmit();
    });
});
function renderTime(){
    $("#order").mobiscroll().datetime({
        theme: 'ios',
        mode: 'scroller',
        display: 'bottom',
        lang: 'zh',
        minDate: new Date(),
        maxDate: new Date(2030,1,1,12,00),
        dateFormat: 'yy-mm-dd'
    });
}
//活动倒计时
function comTime(){
    if(startTime != ""){
        startSubTime = (new Date(startTime))-(new Date());
        var startDay =  parseInt(startSubTime / 1000 / 60 / 60 / 24);//距离开始天数
        var startHour = parseInt(startSubTime / 1000 / 60 / 60 % 24);//距离开始小时数
        var startMin = parseInt(startSubTime / 1000 / 60 % 60);//距离开始分钟数
        var startSec = parseInt(startSubTime / 1000 % 60);//距离开始秒数
        // 距离结束秒数
        if(startDay<10){
            startDay = "0"+startDay;
        };
        if(startHour <10){
            startHour = "0"+startHour;
        }
        if(startMin <10){
            startMin = "0"+startMin;
        }
        if(startSec <10){
            startSec = "0"+startSec;
        }
    };
    if(endTime != ""){
        endSubTime = (new Date(endTime))-(new Date());
        var endDay =  parseInt(endSubTime / 1000 / 60 / 60 / 24);//距离结束天数
        var endHour = parseInt(endSubTime / 1000 / 60 / 60 % 24);//距离结束小时数
        var endMin = parseInt(endSubTime / 1000 / 60 % 60);//距离结束分钟数
        var endSec = parseInt(endSubTime / 1000 % 60);
        if(endDay <10){
            endDay = "0"+endDay;
        };
        if(endHour <10){
            endHour = "0"+endHour;
        }
        if(endMin <10){
            endMin = "0"+endMin;
        }
        if(endSec <10){
            endSec = "0"+endSec;
        };
    };
    var showText = "";
    //倒计时部分所显示的文字----如果有结束时间，那么要判断是否结束，如果没有，那么不用判断

    if(startSubTime != "" && startSubTime>0){
        showText = "活动开始倒计时:"+startDay+"天"+startHour+"时"+startMin+"分"+startSec+"秒";
        $(".float-btn").css('pointer-events','none');
        $('#btn').html('活动还未开始哦').css('pointer-events','none');
        setBtnHtml(showText);
    }else{//活动开始了
        if(endSubTime != ""){//证明有结束时间
            if(endSubTime<0){
                showText = "活动已结束！";
                $(".float-btn").css('pointer-events','none');
                $('#btn').html(showText).css('pointer-events','none');
                clearInterval(campaignTimeCount);
//                console.log('有结束时间且活动结束了')
                setBtnHtml(showText);
            }else if(endSubTime>startSubTime){//活动正在进行
                setBtnHtml(btnHtml);
                $(".float-btn").css('pointer-events','auto');
                $('#btn').html('提交').css('pointer-events','auto');
//                console.log('有结束时间且活动正在进行');
            };
        }else{//证明没有结束时间
            setBtnHtml(btnHtml);
            clearInterval(campaignTimeCount);
            $(".float-btn").css('pointer-events','auto');
            $('#btn').html('提交').css('pointer-events','auto');
//            console.log('没有结束时间且活动正在进行')
        }
    };
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
    $(".form").html("");
    for(var d=0;d<data.length;d++){
        var namev=data[d].columnName.split(":")[1];
        var htmlNew = '<div class="form-group modd">'+
            '<label>'+data[d].display_name+'</label>'+
            '<input type = "text" class="form-control" id="'+data[d].columnName+'" data-name="'+data[d].columnName+'" name="'+namev+'" placeholder="请输入'+data[d].display_name+'" ">'+
            '</div>';
        $(".foot-bottom.sub").before(htmlNew);
    };
    if(Iptools.DEFAULTS.campaign_scene_id == 38){

        var orderHtml = '<div class="form-group modd">'+
            '<label>预约时间</label>'+
            '<input  class="form-control" readonly name="order" id="order" onclick="renderTime()" placeholder="请输入预约时间">'+
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
    var marketName = title;
    var lenArray = [];
    var zeroLen = 0;
    //电话号码和邮箱的验证
    var nameVal = $("input[name='title']").val();
    var telVal = $("input[type='number']").val();
//    if($("#email").size()>0){
        var emailVal = $("#"+formRootId+":email").val();
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
            var pos = formName.indexOf(":");
            var columnPos = formName.length;
            personInfo += '"'+newConRoot+formName.substring(pos,columnPos)+'":"'+formVal+'",';
        }
        lenArray.push(len);
    });
    for(var l=0;l<lenArray.length;l++){
        if(lenArray[l]==0){
            zeroLen = zeroLen+1;
        }
    };
    if(zeroLen>0){
        $("#dialog2").show();
//        toSetInfo();//niefuqiang
        $(".weui_dialog_bd").html("请输入完整信息!");
    }else if(telLen != 11 || !telReg.test(telVal)){
        $("#dialog2").show();
//        toSetInfo();//niefuqiang
        $(".weui_dialog_bd").html("请输入有效的手机号!");
    }else {
        if(emailVal){
            if(!emailReg.test(emailVal)){
                $("#dialog2").show();
//                toSetInfo();//niefuqiang
                $(".weui_dialog_bd").html("请输入正确的邮箱!");
                return;
            }
        };
        if(!readOnly){
            if(Iptools.DEFAULTS.campaign_scene_id == 38){
                addOrderTime();
            };
            setTimeout(function(){
                //提交表单时的数据统计  记名
                //查看所填的电话号码是否存在
                Iptools.GetJson({
    //                async: false,
                    ajaxCounting: false,
                    url: "basic/contacts",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        phone: telVal
                    }
                }).done(function(data){
                        if(data.length > 0){
                            var contact_id = data[0].id;
//                            if(nameVal != data[0].title){//证明姓名变了，要post一条动态
//                                var title = "姓名:"+nameVal;
//                                editConTrace(title,contact_id);
//                            }
                            //老客户提交的最新信息也要put一下
//                            Iptools.PutJson({
//                                url:"service/appletData",
//    //                            async: false,
//                                ajaxCounting:false,
//                                data:{
//                                    token: Iptools.DEFAULTS.token,
//                                    userId: Iptools.DEFAULTS.userId,
//                                    valueId:contact_id,
//                                    appletId: contactApplet,//2046
//                                    fieldData: personInfo+'}'
//                                }
//                            }).done(function(r){
//                                console.log('老用户的新信息put成功---'+contact_id);
//                                console.log('{"'+resListRootId+':contact_id":"='+contact_id+'","'+resListRootId+':campaign_id":"='+Iptools.DEFAULTS.campaignId+'"}')
                                //老用户在提交之前先查重，没有重复在提交到response中
                                Iptools.uidataTool._getUserlistAppletData({
                                    appletId:resListAppId,//8049
                                    pageNow:1,
                                    pageSize:1,
                                    condition:'{"'+resListRootId+':contact_id":"='+contact_id+'","'+resListRootId+':campaign_id":"='+Iptools.DEFAULTS.campaignId+'"}'
                                }).done(function(s){
                                    if(s.data){
                                        if(s.data.records.length == 1){
                                            //显示活动报名成功
                                            $("#dialog1").show();
                                            $(".foots").hide();
                                            toSetSuccessInfo();//niefuqiang
                                            $(".successForm .weui_dialog_bd").html("您已经报名该活动啦!");//niefuqiang
                                            $(".float-btn").addClass("success");
                                            return;
                                        }
                                    }else{
                                        autoTagForContact(contact_id);
                                        joinCampaignCount(0,contact_id,channel,ytk_tId);
                                        createContactTrace(marketName,contact_id);
                                    };
                                })
//                            });
                        }else{
                            //新用户
                            formParam +='"'+formRootId+':contacttype":"2"}';
                            console.log(formParam);
                            //新客户的话需要先往formApplet里post一条数据，然后拿着得到的id在往resAppId---8045里post一条数据
                            Iptools.uidataTool._addAppletData({
                                appletId: form_applet,
                                data: formParam
                            }).done(function(data){
                                    var contact_id = data.id;
                                    createConTrace(nameVal,contact_id);//新客户被创建时的动态
                                    //给新用户带上标签
                                    autoTagForContact(contact_id);
                                    joinCampaignCount(1,contact_id,channel,ytk_tId);
                                    createContactTrace(marketName,contact_id);
                            });
                        };
                    $(".form-control").val("");
                    $("form").data('bootstrapValidator').resetForm();
                });
            },200);
        }else{//readonly开启之后，不做任何数据的上传
            awardShow(awardLeft,awardName,awardTel);
        }
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
        $(".float-btn").addClass("success");
    }
};
//客户提交表单参加活动后，报名量加1
function joinCampaignCount(isJoin,contactId,channelFrom,ytk_id){
    var exist = 0;
    if(isJoin){//新客户
        exist = 1;
    };
    var postToResData = '';
    postToResData = '{"'+resRootId+':campaign_id":"'+ Iptools.DEFAULTS.campaignId+'","'+
        resRootId+':campaign_response_type":"3","'+
        resRootId+':campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'","'+
        resRootId+':is_new":"'+exist+'","'+
        resRootId+':device":"'+deviceType+'","'+
        resRootId+':location":"'+address+'","'+
        resRootId+':contact_id":"'+contactId+'"';
    if(Iptools.DEFAULTS.campaign_scene_id == 38){
        postToResData += ',"'+resRootId+':opp_id":"'+backOpp_id+'"'
    };
    if(channelFrom){
        postToResData += ',"'+resRootId+':channel":"'+channelFrom+'","'+resRootId+':yuntui_tenant_id":"'+ytk_id+'"';
    }
    postToResData += '}';
//    console.log(postToResData);
    Iptools.uidataTool._addAppletData({
        appletId:resAppId,
        data:postToResData
    }).done(function(data){
        console.log("参加活动成功---"+exist);
        awardShow(awardLeft,awardName,awardTel);
    });
}

//----------------------------------------niefuqiangH5弹窗事件-----------------------------------------------------
var linkHeight = 0;
var formHeight = 0;
var state = false;
$(window).scroll(function(){
    if(state == false){
        formHeight = parseInt($('.addFoot').height()) + 55 ;
    }else{
        formHeight = 75;
    }
    linkHeight = parseInt($('.webSideLink').height()) + 15;
    var scrollTop = $(this).scrollTop();
    var windowHeight = $(this).height();
    var scrollHeight = $(document).height()-windowHeight-scrollTop;
    var wheight = formHeight+linkHeight;
    if(scrollHeight < wheight){
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
    $(".failForm").hide();
    $(".successForm").hide();
};
//function toSetInfo(){
//    $(".foots").hide();
//    $(".failForm").show();
//    $(".successForm").hide();
//};
function toSetSuccessInfo(){
    $(".foots").hide();
    $(".failForm").hide();
    $(".successForm").show();
};
function getPromptHeight(){
    state = true;
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
            title: {
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: '请输入手机号码'
                    },
                    regexp: {
                        regexp: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                        message: "请输入正确的手机号码"
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    emailAddress: {
                        message: '邮箱格式有误'
                    }
                }
            }
        }
    });
}
