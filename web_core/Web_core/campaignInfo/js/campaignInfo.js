
//此变量是无论list入口访问，还是创建活动流程，都需在之前的页面存放此session值
var valueid = Iptools.DEFAULTS.currentViewValue !== "undefined" ? Iptools.DEFAULTS.currentViewValue : getThisTabVars("campaignValueId");

var viewId = Iptools.DEFAULTS.currentView;
var h5id = "";
var enrollCharts = false;
//如果填写表单，表单的form_appletid
var formAppletId = "";
//添加至客户群所选客户群id
var selectedContactGroupId;
//活动渠道分页
var camp_PAGE_SIZE = 6;
var camp_PAGE_NOW = 1;
//参与人员分页
var enroll_PAGE_SIZE = 6;
var enroll_PAGE_NOW = 1;
//客户群list弹框分页
var contactGroup_PAGE_NOW = 1;
var contactGroup_PAGE_SIZE = 6;
var now = new Date();
var nowStr = now.format("yyyyMMdd");
//折线图的时间维度
var TIME_TYPE = "week";
var campaignInfo = {}
//isStock代表筛选条件
var isStock;
$(document).ready(function () {
    initDateTimePicker();
    enableLoadChartBtn();
    //获取4项数据
    getStatisticsData();
    //获取活动相关信息
    getCampaignInfo();
    //获取活动发布记录
    getReaseRecords();
    //set相关session
    getH5InfoBycampaignValId();

    //获取参与人员list的appletid
    getEnrollListAppletId();
    //报名人的链接跳转
    contactDetailLink();
    getViewNoBy();
    //数据报表分析tab切换时重画chart
    _enableAnalysisTabShow();
})
function enableLoadChartBtn(){
    $("body").on("click","#reportSearch_campaign",function(){
        getViewNoBy();
    })
}
//获取访问量图表
function getViewNoBy() {
    var container = "", appletId = "";

    var stime = (new Date($(".search-text-group #startTime").val())).format("yyyyMMdd");
    var etime = (new Date($(".search-text-group #endTime").val())).format("yyyyMMdd");
    if(!Iptools.Tool._checkNull(stime) && !Iptools.Tool._checkNull(etime)){
       return false;
    }
    if (enrollCharts) {
        container = "enrollLine";
        appletId = enrollAppletId;
    } else {
        container = "visitedLine";
        appletId = viewAppletId;
    }
    Iptools.uidataTool._getApplet({
        applet: appletId
    }).done(function (data) {
        var conObj = {};
        if (enrollCharts) {
            conObj["" + data.rootLink + ":campaign_response_type"] = '=3';
        } else {
            conObj["" + data.rootLink + ":campaign_response_type"] = '=2';
        }
        var d = Iptools.uidataTool._buildReport({
            container: container,
            date:Iptools.Tool._checkNull(stime)?stime:etime,
            endDate:Iptools.Tool._checkNull(etime)?etime:"",
            timeType:"dayBetween",
            applet: appletId,
            condition: JSON.stringify(conObj),
            viewId: viewId,
            valueId: valueid,
            showReport: true,
        })
    })
}
//报表时间空间
function initDateTimePicker() {
    $(".datetimepickSearch").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        language: "zh-CN",
        minView: "month",
    });
    $("#startTime").val(getNowTime("pre7"));
    $("#endTime").val(getNowTime());
    $('.datetimepickSearch').datetimepicker().on('changeDate', function (ev) {
        if ($(this).attr("id") === "startTime") {
            $("#endTime").datetimepicker('setStartDate', $(this).val());
        } else if ($(this).attr("id") === "endTime") {
            $('#startTime').datetimepicker('setEndDate', $(this).val());
        } else if ($(this).attr("id") === "startTime") {
            $('#endTime').datetimepicker('setStartDate', $(this).val());
        } else if ($(this).attr("id") === "endTime") {
            $('#startTime').datetimepicker('setEndDate', $(this).val());
        }
    });
}


//切换报表tab重新画图表
function _enableAnalysisTabShow() {

    $("body").on("shown.bs.tab", ".nav-tabs a", function () {
        var me = $(this);
        if (me.data("type") == "analysis") {
            setTimeout(function () {
                if ($("#funnel").highcharts()) {
                    $("#funnel").highcharts().reflow();
                }
                if ($("#visitedLine").highcharts()) {
                    $("#visitedLine").highcharts().reflow();
                }
                if ($("#enrollLine").highcharts()) {
                    $("#enrollLine").highcharts().reflow();
                }
            }, 100);
        }
    })
}
//切换图标时
function swithCharts(e) {
    //访问量
    if ($(e).hasClass("visitTab")) {
        $("#visitedLine").show();
        $("#enrollLine").hide();
        $(e).closest("li").addClass("thisactive");
        $(".enrollTab").closest("li").removeClass("thisactive");
        enrollCharts = false;
    } else {
        $("#visitedLine").hide();
        $("#enrollLine").show();
        $(e).closest("li").addClass("thisactive");
        $(".visitTab").closest("li").removeClass("thisactive");
        enrollCharts = true;
    }
    getViewNoBy();
}
//取消发布弹框
function cancelCampaign(e) {
    $("#cancelReleaseModal").modal('show');
}
//open addtocontactgroup
function addToGroup() {
    $("#addToContactGroupModal").modal("show").css({
        "margin-top": function () {
            return "5%";
        }, "overflow-y": "hidden"
    });
    //滚动条位置
    window.parent.window.scrollTo(0, ($(window).height() / 4));
    //先清空搜索框
    $(".con-level").val("0");
    clearContactFormCondition();
    getContactGroupList();
    $(".addGroup").show();
    $(".newGroup").hide();
    $(".modalSwitch").removeClass("active");
    $(".add").addClass("active");
}
//确认取消
function cancelRelease(e) {
    var paramStr = "";
    var h5id = getThisTabVars("H5ValueId");
    var paramStr = "";
    paramStr += '{';
    paramStr += "\"campaign_h5:is_cancelled\":1";
    paramStr += "}";

    Iptools.uidataTool._saveAppletData({
        data: paramStr,
        "appletId": H5AppletId,
        "valueId":h5id,
    }).done(function (data) {
        if (data) {
            $("#cancelReleaseModal").modal('hide');
            setBtnDisabled();
        }
    })
}


//设置“编辑h5”和“取消发布”btn为不能点击
function setBtnDisabled() {
    $(".cancelCampaignBtn").attr("disabled", "disabled");
    $(".cancelCampaignBtn").removeAttr("onclick").css("cursor", "not-allowed");
    $(".editH5Btn").removeAttr("onclick").css("cursor", "not-allowed");
    $(".releaseBtn").attr("disabled", "disabled");
    $(".releaseBtn").removeAttr("onclick").css("cursor", "not-allowed");
}
//关闭二维码面板
function closeQRPanel(e) {
    $(".QRPanel").hide().removeClass("ease_in").addClass("ease");
}

//预览
function preview(e) {
    $("#QRmodal").modal("show");
}

//初始化漏斗图
function initFunnel(data) {
    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" class="emptyImg"><span>暂无统计数据</span></div>';
    var seriesObj = "[{";
    seriesObj += "'name': 'Unique users',";
    seriesObj += "'data': [" +
        "['浏览量'," + data.pageView + "]," +
        "['点击量'," + data.clickCnt + "]," +
        "['报名量'," + data.responseCnt + "]" +
        "]";
    seriesObj += "}]";
    var obj = eval(seriesObj);
    if (data.pageView === 0 && data.clickCnt === 0 && data.responseCnt === 0) {
        $("#funnel").append(emptyHtml);
    } else {
        //漏斗
        $('#funnel').highcharts({
            chart: {
                type: 'funnel',
                marginRight: 100
            },
            title: {
                text: '',
                x: -50
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                        color: 'black',
                        softConnector: true
                    },
                    neckWidth: '30%',
                    neckHeight: '25%'
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: obj

        });
    }

}

//得到某天日期
function GetDateStr(intervalDay) {
    var dd = new Date();
    dd.setDate(dd.getDate() - intervalDay);//获取intervalDay天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    return y + m + d;
}
//构建4项统计指数
function getStatisticsData() {
    Iptools.GetJson({
        //ajaxCounting:false,
        url: "basic/getReportData",
        data: {"token": Iptools.DEFAULTS.token, "campaignId": parseInt(valueid)},
        //async:false,
    }).done(function (data) {
        if (data) {
            if (data.pageView) {
                $(".browse").html(data.pageView);
            } else {
                $(".browse").html(0);
            }
            if (data.clickCnt) {
                $(".attract").html(data.clickCnt);
            } else {
                $(".attract").html(0);
            }
            if (data.avgStayTime) {
                $(".remain").html(toDecimal(data.avgStayTime));
            } else {
                $(".remain").html(0);
            }
            if (data.responseCnt) {
                $(".enrollNum").html(data.responseCnt);
            } else {
                $(".enrollNum").html(0);
            }
            initFunnel(data);
        }
    })
}
//保留两位小数   
//功能：将浮点数四舍五入，取小数点后2位  
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x * 10) / 10;
    return f;
}

//构建不记名图表
function getViewNum(beginTime, endTime) {
    var paramObj = {
        "tenantId": tenantId,
        "appletId": viewAppletId,
        "timeFormat": "%Y%m%d",
        "beginTime": beginTime,
        "endTime": endTime,
        "condition": '[{"campaign_id":"=' + valueid + '"}]'
    }
    Iptools.GetJson({
        ajaxCounting: false,
        url: "service/report",
        data: paramObj,
        async: false,
    }).done(function (data) {
        if (data.series) {
            $('#enrollLine').highcharts({
                // chart: {
                //     type: 'column'
                // },
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                xAxis: {
                    categories: data.categories
                },
                yAxis: {
                    title: {
                        text: '人数'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ''
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: getChartsItemByKey(data.series)
            });
        } else {

        }
    })
}
//构建活动信息
function getCampaignInfo() {
    //debugger
    Iptools.uidataTool._getUserDetailAppletData({
        "appletId": campaignAppletId,
        "valueId": parseInt(valueid)
    }).done(function (data) {
        if (data.data) {

            var prefix = data.rootLink;
            $(".campaignName span").html(data.data[prefix + ":title"]);
            campaignInfo["campaignName"] = data.data[prefix + ":title"];
            $(".contact_group").html(data.data[prefix + ":target_group"] ? data.data[prefix + ":target_group"].name : "");
            $(".startTime").html(data.data[prefix + ":start_time"] ? data.data[prefix + ":start_time"] : "无限制");
            $(".endTime").html(data.data[prefix + ":end_time"] ? data.data[prefix + ":end_time"] : "无限制");
        }
    })
}
//获取活动渠道（短信）列表
function getReaseRecords() {
    Iptools.uidataTool._getCustomizeApplet({
        nameList: "'Campaign Channel List Applet'"
    }).done(function (r) {
        if (r && r.applets && r.applets.length) {
            component._table(".releaseRecord", {
                pageNow: 1,
                pageSize: 10,
                showChecks: false,
                condition: {
                    "campaign_channel:campaign_id": " =" + valueid,
                    "campaign_channel:target_group": " is not null",
                    "campaign_channel:filter_condition_json": " is not null"
                },
                applet: r.applets[0].applet,
                emptyImage: "../Content/Image/nodetail.png",
                emptySize: "150",
                emptyText: "没有群发记录",
                emptySearch:"没有搜索到数据，请更换关键词后再次搜索",
                jumpType: "template",//操作列跳转类型
                jumpTemplate: "<a class='send-item-detail' title='查看群发详情'><span class='icon-signin'></span></a>",////操作列dom
                events: [//applet-btn事件及样式
                    {
                        target: ".s-header-bar .s-manage .add-group",//add-group是新建客户群，还有其他类型
                        type: "click",
                        event: function () {
                            $("#newModal").modal("show");
                        }
                    }],
                dataModify: function (rs) {//更改数据列--columns为表头，data.records为表数据，更改完进行渲染表
                    var promise = $.Deferred();
                    if (rs) {
                        if (rs.columns && rs.columns.length) {
                            if (rs.data && rs.data.records && rs.data.records.length) {
                                for (var i = 0; i < rs.data.records.length; i++) {
                                    var rec = rs.data.records[i];
                                    var conditionJsonStr = rec[rs.rootLink + ":filter_condition_json"];
                                    var conditionStr = "";
                                    if (conditionJsonStr) {
                                        switch (conditionJsonStr) {
                                            case "{'contactType':' =2'}":
                                                conditionStr = "潜在客户";
                                                break;
                                            case "{'contactType':' =3'}":
                                                conditionStr = "消费客户";
                                                break;
                                            case "{'contactType':' =4'}":
                                                conditionStr = "会员客户";
                                                break;
                                            case "{'contactType':' in (2,3,4)'}":
                                                conditionStr = "全部客户";
                                                break;
                                        }
                                    }
                                    rec[rs.rootLink + ":filter_condition_json"] = conditionStr;
                                }
                            }
                        }
                    }
                    promise.resolve(rs);
                    return promise;
                },
                afterLoad: function () { //当前页加载完执行此方法

                    var stopItems = $(".releaseRecord .s-table .s-column .send-item-detail");
                    var itemchannelId = "", itemIsRepeat, itemMsgStatus;
                    var options = $(".releaseRecord").data("stable").options;
                    var records;
                    if (options) {
                        var data = $(".releaseRecord").data("stable").options.data;
                        if (data && data.records && data.records.length) {
                            records = data.records;

                        }
                    }
                    stopItems.each(function (key, obj) {
                        itemchannelId = data.records[key][options.rootLink + ":id"];
                        itemIsRepeat = data.records[key][options.rootLink + ":is_repeat"];
                        itemMsgStatus = data.records[key][options.rootLink + ":msg_status"];
                        if (itemIsRepeat && (itemMsgStatus.id === "1" || itemMsgStatus.id === "3")) {
                            $(obj).after("<a class='send-stop' title='终止群发任务'><span class='icon-stop'></span></a>");
                        }
                    })
                }
            });
        }
    });
}

getAllEnrollList();
function getAllEnrollList() {
    Iptools.uidataTool._getCustomizeApplet({
        nameList: "'Campaign Response List Applet'"
    }).done(function (r) {
        if (r && r.applets && r.applets.length) {
            component._table(".enrollTable", {
                pageNow: 1,
                pageSize: 10,
                condition: {
                    "campaign_response:campaign_id": "=" + valueid,
                    "campaign_response:campaign_response_type": "=3"
                },
                showChecks: true,
                applet: r.applets[0].applet,
                emptyImage: "../Content/Image/nodetail.png",
                emptySize: "150",
                emptyText: "没有人参与！是目标客户定位不准确，还是奖品不够给力呢？",
                jumpType: "template",//操作列跳转类型
                jumpTemplate: "<a class='campaign-edit' title='查看活动详情'><span class='icon-signin'></span></a>",////操作列dom
                events: [//table中的事件
                    {
                        target: ".addToContactGroup",//添加到客户群
                        type: "click",
                        event: function () {

                            var idArr = $(".enrollTable").data("stable")._getCheckIndex();//所有选中的行的数据的index
                            var datas = $(".enrollTable").data("stable").options.data.records;//所有的表的源数据

                            for (var i = 0; i < idArr.length; i++) {
                                checkedContactIdObj.push(datas[idArr[i]]["campaign_response:contact_id"].id);
                            }
                            addToGroup();
                        }
                    }
                ],
                dataModify: function (rs) {//更改数据列--columns为表头，data.records为表数据，更改完进行渲染表
                    var promise = $.Deferred();
                    if (rs) {
                        if (rs.columns && rs.columns.length) {
                            var emailEmpty = 0;
                            if (rs.data && rs.data.records && rs.data.records.length) {
                                for (var i = 0; i < rs.data.records.length; i++) {
                                    //如果没有邮箱
                                    if (!rs.data.records[i]["contact:email"]) {
                                        emailEmpty++;
                                    }
                                }
                            }
                            if (emailEmpty === 0) {
                                for (var j = 0; j < rs.columns.length; j++) {
                                    if (rs.columns[j].column.split(":")[1] === "email") {
                                        rs.columns.splice(j, 1);
                                    }
                                }
                            }
                        }
                    }
                    promise.resolve(rs);
                    return promise;
                },
                afterLoad: function () { //当前页加载完执行此方法

                }
            });
        }
    });
}


//根据渠道值显示渠道名称
function getChannelName(ChannelVal) {
    var ChannelName = "";
    var ChannelObj = {
        "pickList": [
            {
                "id": 3209,
                "value": "短信",
                "key": "1"
            },
            {
                "id": 3210,
                "value": "微信",
                "key": "2"
            }
        ]
    }
    for (var i = 0; i < ChannelObj.pickList.length; i++) {
        if (parseInt(ChannelObj.pickList[i].key) === ChannelVal) {
            ChannelName = ChannelObj.pickList[i].value;
        }
    }
    ;
    return ChannelName;
}
//根据状态值显示状态名称
function getStatusName(StatusVal) {
    var StatusName = "";
    var statusObj = {
        "pickList": [
            {
                "id": 3209,
                "value": "新建",
                "key": "1"
            },
            {
                "id": 3210,
                "value": "审核中",
                "key": "2"
            },
            {
                "id": 3211,
                "value": "审核通过",
                "key": "3"
            },
            {
                "id": 3212,
                "value": "审核未通过",
                "key": "4"
            },
            {
                "id": 3213,
                "value": "发布中",
                "key": "5"
            },
            {
                "id": 3214,
                "value": "挂起",
                "key": "6"
            },
            {
                "id": 3215,
                "value": "发布完成",
                "key": "7"
            },
            {
                "id": 6667,
                "value": "发布失败",
                "key": "8"
            },
            {
                "id": 6691,
                "value": "发布取消",
                "key": "9"
            }
        ]
    }
    for (var i = 0; i < statusObj.pickList.length; i++) {
        if (parseInt(statusObj.pickList[i].key) === StatusVal) {
            StatusName = statusObj.pickList[i].value;
        }
    }
    ;
    return StatusName;
}
//根据key值得到图表显示项
function getChartsItemByKey(seriesObj) {
    var Obj = {
        "pickList": [
            {
                "value": "吸引点击量",
                "key": "1"
            },
            {
                "value": "浏览量",
                "key": "2"
            },
            {
                "value": "报名量",
                "key": "3"
            },
            {
                "value": "微信分享数量",
                "key": "4"
            },
            {
                "value": "停留时长",
                "key": "5"
            },
            {
                "value": "吸引点击量计数",
                "key": "6"
            },
            {
                "value": "浏览量计数",
                "key": "7"
            },
            {
                "value": "微信分享计数",
                "key": "8"
            },
            {
                "value": "停留时长计数",
                "key": "9"
            }
        ]
    }
    for (var i = 0; i < seriesObj.length; i++) {
        for (var j = 0; j < Obj.pickList.length; j++) {
            if (Obj.pickList[j].key === seriesObj[i].name) {
                seriesObj[i].name = Obj.pickList[j].value;
                break;
            }
        }
        ;

    }
    ;
    return seriesObj;
}
//发布todo
function releaseCampaign() {
    // window.location = "releaseCampaign.html";
    setThisTabVars("campaignValueId", valueid);
    var obj = {
        async: false,
        "nameList": "\"newSendGroup\""
    }
    Iptools.uidataTool._getCustomizeView(obj).done(function (thisView) {
        Iptools.uidataTool._getView({
            view: thisView.views[0].view,
        }).done(function (data) {
            if (Iptools.Tool._getVersion() == "v1") {
                //set各种值
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "newSMSMarketing",
                    value: "no"
                });
                //set各种值
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "campaignName",
                    value: campaignInfo.campaignName
                });
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "campaignUrlstr",
                    value: campaignInfo.campaignUrl
                });
                //设置tab下的局部变量
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "campaignValueId",
                    value: Iptools.DEFAULTS.currentViewValue
                });
                Iptools.Tool._jumpView({
                    view: thisView.views[0].view,
                    name: data.view.name + "-" + campaignInfo.campaignName,
                    type: data.view.type,
                    valueId: h5Id,
                    primary: data.view.primary,
                    icon: data.view.icon,
                    url: data.view.url,
                    bread: true
                });
            } else if (Iptools.Tool._getVersion() == "v2") {
                Iptools.Tool._jumpView({
                    view: thisView.views[0].view,
                    name: data.view.name + ">" + campaignInfo.campaignName,
                    type: data.view.type,
                    valueId: h5Id,
                    primary: data.view.primary,
                    icon: data.view.icon,
                    url: data.view.url,
                    bread: true
                });
                //set各种值
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "newSMSMarketing",
                    value: "no"
                });
                //set各种值
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "campaignName",
                    value: campaignInfo.campaignName
                });
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "campaignUrlstr",
                    value: campaignInfo.campaignUrl
                });
                //设置tab下的局部变量
                Iptools.Tool._setTabData({
                    view: thisView.views[0].view,
                    valueId: h5Id,
                    type: data.view.type,
                    key: "campaignValueId",
                    value: Iptools.DEFAULTS.currentViewValue
                });
            }

        });
    });

}

//根据campaignValId获取H5相关信息
var H5prefix;
function getH5InfoBycampaignValId() {
    Iptools.uidataTool._getUserlistAppletData({
        async: false,
        "appletId": getH5InfoAppletId,
    }).done(function (data) {
        if (data.data) {
            var pre = data.rootLink;
            //得到h5Id
            Iptools.uidataTool._getUserlistAppletData({
                async: false,
                "appletId": getH5InfoAppletId,
                "condition": "{'" + pre + ":campaign_id':'=" + valueid + "'}"
            }).done(function (data) {
                if (data&&data.data&&data.data.records&&data.data.records.length !=0) {
                    //debugger
                    H5prefix = data.rootLink;
                    if (data.data.records[0][H5prefix + ":form_applet"]) {
                        formAppletId = data.data.records[0][H5prefix + ":form_applet"];
                    }
                    h5Id = data.data.records[0][H5prefix + ":id"];
                    setThisTabVars("H5ValueId", data.data.records[0][H5prefix + ":id"]);
                    $(".campaignLink span").html(data.data.records[0][H5prefix + ":view_address"]);
                    campaignInfo["campaignUrl"] = data.data.records[0][H5prefix + ":view_address"];
                    $(".QRCode").qrcode({
                        render: "canvas", //table方式
                        width: 165, //宽度
                        height: 165, //高度
                        text: data.data.records[0][H5prefix + ":view_address"] ? data.data.records[0][H5prefix + ":view_address"] : "" //任意内容
                    });
                    //根据h5模板id得到所选的模板的类型
                    Iptools.GetJson({
                        async: false,
                        url: "basic/campaignSceneTemplates/" + data.data.records[0][H5prefix + ":campaign_template_id"],
                    }).done(function (data) {
                        if (data) {
                            $(".editH5Btn").attr("data-sTemId", data.sceneTemplateType);
                            $(".editH5Btn").attr("data-camTemId", data.id);
                        }
                    })
                    if (data.data.records[0][H5prefix + ":is_cancelled"]) {
                        setBtnDisabled();
                    }
                }
            })
        }
    })
}
var viewobj = {}
//跳转编辑页面
function toEditH5ByTenplateId(e) {
    var sceneTemid = $(e).attr("data-sTemId");
    var id = $(e).attr("data-camTemId");
    switch (sceneTemid) {
        case "4"://41
            //$(".editH5Btn").attr("href","../campaignEdit/enterActivity.html");
            viewobj["nameList"] = '\"campaignh5Edit2\"';
            jumpView(id);
            break;
        case "5"://42
            //$(".editH5Btn").attr("href","../campaignEdit/appointmentService.html");
            viewobj["nameList"] = '\"campaignh5Edit1\"';
            jumpView(id);
            break;
        case "6"://43
            //$(".editH5Btn").attr("href","../campaignEdit/feedBack.html");
            break;
        /*default:
         $(".editH5Btn").attr("href","../campaignEdit/H5Workbench.html");*/
    }
}

function jumpView(id) {
    //viewobjs["async"] = false;
    Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
        //跳转编辑页
        Iptools.uidataTool._getView({
            view: thisView.views[0].view,
            async: false
        }).done(function (data) {
            Iptools.Tool._jumpView({
                view: thisView.views[0].view,
                name: data.view.name + ">" + campaignInfo.campaignName,
                type: data.view.type,
                valueId: h5Id,
                primary: data.view.primary,
                icon: data.view.icon,
                url: data.view.url,
                bread: true
            });
        })
        //新版先jump后设置值。旧版先设置值，再jump。
        setTabVals(thisView, id);
    });
}
//设置跳转tab的值
function setTabVals(thisView, id) {
    //设置跳转tab下的局部变量
    //h5id
    //campaignId
    Iptools.uidataTool._getView({
        view: thisView.views[0].view,
        async: false
    }).done(function (json) {
        Iptools.Tool._setTabData({
            view: thisView.views[0].view,
            valueId: h5Id,
            type: json.view.type,
            key: "H5ValueId",
            value: h5Id
        });
        //设置tab下的局部变量
        Iptools.Tool._setTabData({
            view: thisView.views[0].view,
            valueId: h5Id,
            type: json.view.type,
            key: "campaignValueId",
            value: Iptools.DEFAULTS.currentViewValue
        });
        //设置从listEdit进入的编辑H5页
        Iptools.Tool._setTabData({
            view: thisView.views[0].view,
            valueId: h5Id,
            type: json.view.type,
            key: "formList",
            value: false
        });
        Iptools.Tool._setTabData({
            view: thisView.views[0].view,
            valueId: h5Id,
            type: json.view.type,
            key: "campaign_template_id",
            value: id
        });
    })

}
//-----------------------------------------添加至客户群--------------------------------------------
var checkedContactIdObj = [];
getContactGroupListAppletId();
var CroupPrefix;
function getContactGroupList(term) {
    $(".contactGroupListTbody").html("");
    var paramData = {
        //"tenantId":tenantId,
        //"userId":userId,
        "appletId": contactGroupListAppletId,
        "pageNow": contactGroup_PAGE_NOW,
        "pageSize": contactGroup_PAGE_SIZE,
        "async": false
    }
    var condition = {};
    if (term) {
        condition = term;
        paramData["condition"] = term;
        //paramData["pageNow"]=1;
    } else {
        var contactName = $(".con-Name").val();
        var level = $(".con-level").val();
        var des = $(".con-des").val();
        var condition = {};
        if (contactName !== "") {
            condition[CroupPrefix + ":title"] = " like \"%" + contactName + "%\"";
        }
        if (des !== "") {
            condition[CroupPrefix + ":description"] = " like \"%" + des + "%\"";
        }
        condition = JSON.stringify(condition);
        if (condition !== "{}") {
            paramData["condition"] = condition;
        }
    }

    //debugger
    Iptools.uidataTool._getUserlistAppletData(paramData).done(function (data) {
        if (data.data) {
            //客户群list
            CroupPrefix = data.rootLink;
            var len = data.data.records.length;
            var listobj = data.data.records;
            var html = "";
            $("#addToContactGroupModal .pageCountCalText").remove();
            component._pager({
                container: "contactGroup-pager-example-panel",//ID选择器
                pageSize: data.data.pageSize,
                pageCount: data.data.pageCount,
                rowCount: data.data.rowCount,
                pageNow: contactGroup_PAGE_NOW,
                jump: function (page) {
                    //page为跳转的页数
                    //加载自己的表格数据
                    //加载完成后更新分页控件信息
                    contactGroup_PAGE_NOW = page;
                    if (typeof addToGroupcondition === "string") {
                        getContactGroupList(addToGroupcondition);
                    } else {
                        getContactGroupList();
                    }
                }
            });
            //debugger
            for (var i = 0; i < len; i++) {
                html += '<tr onclick="selectContact(this)" data-id="' + listobj[i][CroupPrefix + ":id"] + '"><lable for="contactItem">' +
                    '<td><input type="radio" name="contactItem"></td>' +
                    '<td title="' + listobj[i][CroupPrefix + ":title"] + '">';
                if (listobj[i][CroupPrefix + ":title"].length < 7) {
                    html += listobj[i][CroupPrefix + ":title"] + '</td>';
                } else {
                    html += listobj[i][CroupPrefix + ":title"].substring(0, 6) + "..." + '</td>';
                }

                html += '<td>' + getContactGroupNum(listobj[i][CroupPrefix + ":id"]) + '</td>';

                if (Iptools.Tool._checkNull(listobj[i][CroupPrefix + ":description"])) {
                    if (listobj[i][CroupPrefix + ":description"].length < 21) {
                        html += '<td title="' + listobj[i][CroupPrefix + ":description"] + '">' + listobj[i][CroupPrefix + ":description"] + '</td>';
                    } else {
                        html += '<td title="' + listobj[i][CroupPrefix + ":description"] + '">' + listobj[i][CroupPrefix + ":description"].substring(0, 20) + "..." + '</td>';
                    }
                } else {
                    html += '<td></td>';
                }

                html += '</lable></tr>';
            }
            $(".contactGroupListTbody").append(html);
        } else {
            $(".contactGroup#pagenumber").html(0 + "/" + 0);
            $(".contactGroup.pageSkip").attr("max-page", 0);
            $(".contactGroup.pageNext").attr("max-page", 0);
            $(".contactGroup#toPage").attr("max-page", 0);
            $(".contactGroupListTbody").append('<tr><td colspan="5" style="text-align: center;"><img src="../Content/Image/emptyData.png" alt="" style="height: 150px;"><span style="display: block;">未查询到数据</span></td></tr>');
        }
    })
}
//选择某一客户群
function selectContact(e) {
    $(e).parent().find("tr").removeClass("selectContactActive");
    $(e).find("input[name=contactItem]").prop("checked", true);
    $(e).addClass("selectContactActive");
    selectedContactGroupId = $(e).data("id");
}
//获取所选客户群人数
function getContactGroupNum(groupId) {
    var groupNum = 0;
    Iptools.GetJson({
        url: "basic/contactgroups/" + groupId + "?token=" + Iptools.DEFAULTS.token,
        async: false,
    }).done(function (data) {
        if (data) {
            groupNum = data.contactCount;
        }
    })
    return groupNum;
}
//筛选客户群
var addToGroupcondition = {};
function getContactListByCondition(e) {
    //debugger
    contactGroup_PAGE_NOW = 1;
    addToGroupcondition = {};
    var contactName = $(".con-Name").val();
    var level = $(".con-level").val();
    var des = $(".con-des").val();
    if (contactName === "" && level === "-1" && des === "") {
        addToGroupcondition = {};
        getContactGroupList();
        return false;
    }
    //var condition = {};
    if (contactName !== "") {
        addToGroupcondition[CroupPrefix + ":title"] = " like \"%" + contactName + "%\"";
    }
    if (level !== "-1") {
        addToGroupcondition[CroupPrefix + ":group_reason"] = "=" + level;
    }
    if (des !== "") {
        addToGroupcondition[CroupPrefix + ":description"] = " like \"%" + des + "%\"";
    }
    addToGroupcondition = JSON.stringify(addToGroupcondition);
    //如果没有输入搜索条件
    getContactGroupList(addToGroupcondition);

}
//清空筛选条件框
function clearContactFormCondition() {
    $(".con-Name").val("");
    $(".con-level").val("");
    $(".con-des").val("");
}
//确认添加至客户群
function comfirmAddToContact() {
    if (!selectedContactGroupId) {
        var options = {
            "title": "提示",
            "content": "请选择客户群！"
        }
        parent.Iptools.Tool.Alert(options);
        return false;
    }
    var contactIds = checkedContactIdObj.join(",");
    var paramData = {
        "token": Iptools.DEFAULTS.token,
        "contactgroupId": selectedContactGroupId,
        "contactIds": contactIds
    }
    Iptools.PostJson({
        url: "basic/linkContactgroup",
        data: paramData,
        async: false,
    }).done(function (data) {
        if (data) {
            var options = {
                "title": "提示",
                "content": "添加成功！"
            }
            parent.Iptools.Tool.Alert(options);
            $("#addToContactGroupModal").modal("hide");
            //清空contactId数组
            checkedContactIdObj.length = 0;
            $("input[name=enrollcheckbox]").prop("checked", false);
            //清空所选的参与人员相关
            selectedEnroll = 0;
            $(".enrollCount").html(selectedEnroll);

        }
    })
}
//切换添加至客户群btn 和新建客户群
$(".modalSwitch").on("click", function () {
    if ($(this).hasClass("add")) {
        $(".addGroup").show();
        $(".newGroup").hide();
        $(".modalSwitch").removeClass("active");
        $(this).addClass("active");
    } else {
        $(".modalSwitch").removeClass("active");
        $(this).addClass("active");
        $(".addGroup").hide();
        $(".newGroup").show();
    }
    ;
})
$(".new-con-name").focus(function () {
    $(this).css("border", "1px solid #ccc");
})
//群人新建客户群，并把所选的客户放到新建的客户群中
getContactGroupDetailAppletId();
var groupDetailPrefix;
function comfirmNewContact(e) {
    if ($(".new-con-name").val() === "") {
        $(".new-con-name").css("boder", "1px solid red");
        return false;
    }
    var level = $(".new-con-level").val();
    var paramStr = "";
    var paramData = {
        "appletId": contactGroupDetailAppletId,
        async: false
    }
    //获得前缀
    Iptools.uidataTool._getApplet({
        "applet": contactGroupDetailAppletId,
        async: false,

    }).done(function (data) {
        groupDetailPrefix = data.rootLink;
    })
    paramStr += '{';
    paramStr += "\"" + groupDetailPrefix + ":title\":\"" + $(".new-con-name").val() + "\"";
    if ($(".new-con-level").val() !== "") {
        paramStr += ",\"" + groupDetailPrefix + ":group_reason\":\"" + level + "\"";
    }
    if ($(".new-con-des").val() !== "") {
        paramStr += ",\"" + groupDetailPrefix + ":description\":\"" + $(".new-con-des").val() + "\"";
    }
    paramStr += "}";
    paramData["data"] = paramStr;
    Iptools.uidataTool._addAppletData(paramData).done(function (data) {
        if (data) {
            selectedContactGroupId = data.id;
            comfirmAddToContact();
            clearNewContactFormItem();
            $(".addGroup").show();
            $(".newGroup").hide();
        }
    })
}
//跳转到个人画像
function contactDetailLink() {
    $(".contactLink").on("click", function () {
        var me = $(this);
        Iptools.uidataTool._getCustomizeView({
            nameList: "'contact_detail'"
        }).done(function (data) {
            if (data.views.length) {
                Iptools.uidataTool._getView({
                    view: data.views[0].view
                }).done(function (r) {
                    Iptools.Tool._jumpView({
                        view: data.views[0].view,
                        name: r.view.name,
                        type: r.view.type,
                        url: r.view.url,
                        valueId: me.data("key"),
                        bread: true
                    });
                });
            }
        });
    })
}
//清空新建客户群表单
function clearNewContactFormItem() {
    $(".new-con-name").val("");
    $(".new-con-level").val("");
    $(".new-con-des").val("");
}