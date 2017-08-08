//var valueId= 28;
//分享至微信相关参数
var locationStr = location.href;
locationStr = locationStr.substring(0,locationStr.indexOf('&form='));
var wx_share={
    shareTitle:"易掌客",
    lineLink:locationStr,
    descContent:"动动手指参与活动,就有机会获得奖品哦！",
    imgUrl:"http://enterpriseserver.yizhangke.com/upload/33/pic/1462524871029.jpg"
};
$(function () {
    var wx_config = {};
    wx_config.debug = false;
    wx_config.appId = "wx3cfea31ab273a3e5";
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx_config.timestamp = timestamp;//生成签名时间戳
    wx_config.nonceStr = "Lzr2RX71qMPcdwtK";//签名的随机串
    var url = location.href;
    //生成签名
    generateSignature(wx_config.nonceStr, wx_config.timestamp,url, wx_config);
    wx_config.jsApiList = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow'
    ];
    wx.config(wx_config);
    wx.ready(function () {
        // var stateString = "T" + window.sessionStorage.tenantId + "E" + window.sessionStorage.userId;
        // var lineLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb54ec6b2341609bf&redirect_uri=http%3A%2F%2Fenterpriseserver.intopalm.com%2Feis%2Fv1%2Fwx%2Fserver%2FinviteEmp&response_type=code&scope=snsapi_userinfo'
        //     + "&state=" + stateString
        //     +'#wechat_redirect';
        // var shareTitle = window.sessionStorage.empName + '邀请您加入: ' + window.sessionStorage.tenantName;
        // var descContent = "我在“易掌客”注册了企业，点击链接，注册后就可以协同办公了！";
        // var imgUrl = 'http://enterpriseserver.intopalm.com/upload/33/pic/1462524871029.jpg';

        //获取微信相关信息
        Iptools.uidataTool._getCustomizeApplet({
            nameList:'"Campaign_H5 Detail Applet"'
        }).done(function(data){
            var  H5_detailId =  data.applets[0].applet;
            Iptools.uidataTool._getUserDetailAppletData({
                appletId:H5_detailId,
                valueId:Iptools.DEFAULTS.campaignH5_id
            }).done(function(s){
                var rootId = s.rootLink;//98
                //微信分享标题
                wx_share.shareTitle = s.data[rootId+':title'];
                //微信分享描述
                wx_share.descContent = s.data[rootId+':sub_title'];
                //微信分享图标
                wx_share.imgUrl =s.data[rootId+':back_img'];
            })
        });
        // 微信分享的数据
        var wxData = {
            title: wx_share.shareTitle, // 分享标题
            link: wx_share.lineLink,//分享链接
            desc: wx_share.descContent,// 分享描述
            imgUrl: wx_share.imgUrl, // 分享图标
            success: function () {
                    //分享到微信次数的统计
                if(!readOnly){
                    shareCount(channel,ytk_tId);
                }
            },
            cancel: function () {
            }
        };
//        if( Iptools.DEFAULTS.campaign_scene_id != 33 &&  Iptools.DEFAULTS.campaign_scene_id != 38){
            //发送给微信好友
            wx.onMenuShareAppMessage(wxData);
            //分享至朋友圈
            wx.onMenuShareTimeline(wxData);
            //分享至qq好友
            wx.onMenuShareQQ(wxData);
//        }




        //要显示的功能按钮接口
        wx.showMenuItems({
            menuList: [
                "menuItem:share:appMessage",
                "menuItem:share:timeline",
                "menuItem:share:qq"
            ]
        });
        //右上角三个点要隐藏的功能按钮接口
        wx.hideMenuItems({
        	//要隐藏的菜单项
            menuList: [
                'menuItem:copyUrl',
                'menuItem:share:email',
                'menuItem:share:weiboApp',
                'menuItem:favorite',
                'menuItem:share:facebook',
                'menuItem:share:QZone',
                'menuItem:originPage',
                'menuItem:readMode',
                'menuItem:openWithQQBrowser',
                'menuItem:openWithSafari'
            ]
        });
    });
});

function generateSignature(nonceStr, timestamp, url, wx_config){
    var signature = "";
    var jsapiTicket = "";
    Iptools.GetJson({
        url: "wx/server/getJsapiTicket",
        async: false,
        ajaxCounting:false,
        error: function () {
//            alert("JsapiTicket Error!");
        },
        success:function(data){
            jsapiTicket = data.jsapiTicket;
            var reorderString = "jsapi_ticket=" + jsapiTicket +
                "&noncestr=" + nonceStr +
                "&timestamp=" + timestamp +
                "&url=" + url;
            var signatureArray = CryptoJS.SHA1(reorderString, { asString: true });
            signature = signatureArray.toString();
            //alert("signature:"+signature);
            //alert("wx_config:"+JSON.stringify(wx_config));
            wx_config.signature =  signature;
        }
    })
};
function shareCount(channelFrom,ytk_id){
    var data = '{"'+staRootId+':campaign_id":"'+Iptools.DEFAULTS.campaignId+'","'+staRootId+':campaign_response_type":"4","'+staRootId+':campaign_scene_id":"'+Iptools.DEFAULTS.campaign_scene_id+'"';
    if(channelFrom){
        data += ',"'+staRootId+':channel":"'+channelFrom+'","'+staRootId+':yuntui_tenant_id":"'+ytk_id+'"';
    }
    data += '}';
    Iptools.uidataTool._addAppletData({
        appletId:staAppId,
        data:data
    }).done(function(){
        console.log("微信分享加1");
    })
}