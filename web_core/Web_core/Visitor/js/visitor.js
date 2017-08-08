/**
 * Created by 1 on 2017/3/21.
 */
var visitorWidget = {};
visitorWidget = {
    _UIDEFAULFS: {
        lineDownBtn: "#lineDownBtn",
        lineUpperBtn: ".lineUpperBtn",
        totalChart: "totalChart",
        eventMACAddress: "#eventMACAddress",
        reduce: ".reduce",
        addMac: ".addShop",
        meikela: ".meikela",
        keepBtn: ".confirm",
        lineDownBtnHtml: "",
        lineUpperBtnHtml: "",
        weekStart: "",
        weekEnd: "",
        monthStart: "",
        monthEnd: "",
        type: "month",
        groupNum: 3,
        token: "",
        id: 1,
        winaName: ""
    },
    _rebuildUiDefaults: function (options) {
        visitorWidget._UIDEFAULFS = Iptools.Tool._extend(visitorWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        visitorWidget._addDeletMacGroup();//点击加号事件，添加探针
        visitorWidget._addLineStore();//点击确定按钮新建探针
        visitorWidget._toStore();//点击门店，携带唯一标识ID，进入相应门店
        visitorWidget._setTimeChang();//点击本周或者本月按钮，切换图表对应时间

    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        visitorWidget._UIDEFAULFS.token = Iptools.DEFAULTS.token;
        visitorWidget._getEventTime();//获得日期本周开始时间和结束时间，本月开始时间结束时间
        visitorWidget._toLayData();//初始化加载已有门店
        visitorWidget._toValidatorForm();//初始化新建门店表单验证
        visitorWidget._getMonthTrend();//初始化加载图表数据
        visitorWidget._bindingDomEvent();//事件函数
        visitorWidget._bindingEventAfterLoad();//初始化加载函数
    },
    _getEventTime: function () {
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0;
        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth()+1;
            var myweekday = date.getDate();

            if(mymonth < 10){
                mymonth = "0" + mymonth;
            }
            if(myweekday < 10){
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        }
//获得某月的天数
        function getMonthDays(myMonth){
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            return (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
        }
//获得本周的开始日期
        function getWeekStartDate() {
            var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
            return formatDate(weekStartDate);
        }
//获得本周的结束日期
        function getWeekEndDate () {
            var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
            return formatDate(weekEndDate);
        }
//获得本月的开始日期
        function getMonthStartDate () {
            var monthStartDate = new Date(nowYear, nowMonth, 1);
            return formatDate(monthStartDate);
        }
//获得本月的结束日期
        function getMonthEndDate () {
            var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
            return formatDate(monthEndDate);
        }
        visitorWidget._UIDEFAULFS.weekStart = getWeekStartDate();
        visitorWidget._UIDEFAULFS.weekEnd = getWeekEndDate();
        visitorWidget._UIDEFAULFS.monthStart = getMonthStartDate();
        visitorWidget._UIDEFAULFS.monthEnd = getMonthEndDate();
    },
    _toLayData: function () {
        Iptools.GetJson({
            url: "basic/wina/getShops",
            data: {
                token: visitorWidget._UIDEFAULFS.token
            }
        }).done( function (data) {
            if(data.retcode == "ok"){
                var shopsAll = data.shops;
                var htmls = "";
                for(var i = 0;i < shopsAll.length;i++){
                    htmls += '<div class="meikela inlet inlets" id="' + data.shops[i].id + '">' + data.shops[i].shopName + '</div>';
                }
                $("#lineDownBtn").before(htmls);
            };
            if(data.retcode == "timeout"){
                Iptools.Tool.pAlert({
                    type: "danger",
                    title: "系统提示：",
                    content: data.retmsg,
                    delay: 1000
                });
            };
        });
        $('[data-bv-validator = "lessThan"]').hide();
    },
    _addLineStore: function () {
        visitorWidget._addEventListener({
            container: "body",
            target: visitorWidget._UIDEFAULFS.keepBtn,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                $(visitorWidget._UIDEFAULFS.eventMACAddress).bootstrapValidator('validate');
                if ($(visitorWidget._UIDEFAULFS.eventMACAddress).data("bootstrapValidator").isValid()) {
                    me.css("pointer-events", "none");
                    var data = $("#inputText3").val();
                    var toEmptes = $(".toEmpty").val();
                    var macListWinas = "";
                    var macLiastas = "";
                    var macLists = $(".addWinaOneAddress .toEmpty");
                    for(var i = 0;i < macLists.length;i++){
                        macLiastas += $(macLists[i]).val() + ",";
                    };
                    macListWinas = macLiastas.split(":").join("");
                    macListWinas = macListWinas.substring(0, macListWinas.lastIndexOf(','));
                    Iptools.PostJson({
                        url: "basic/wina/addNewShop",
                        data: {
                            token: visitorWidget._UIDEFAULFS.token,
                            shopName: data,
                            macList: macListWinas
                        }
                    }).done( function (r) {
                        if(r.retcode == "ok"){
                            visitorWidget._UIDEFAULFS.lineDownBtnHtml = '<div class="meikela inlet" id="' + r.shop.id + '">' + r.shop.shopName + '</div><div class="lineMiddle"></div>';
                            $(visitorWidget._UIDEFAULFS.lineDownBtn).before(visitorWidget._UIDEFAULFS.lineDownBtnHtml);
                            $("#myModal").modal("hide");
                        }else{
                            Iptools.Tool.pAlert({
                                type: "danger",
                                title: "系统提示",
                                content: r.retmsg,
                                delay: 1000
                            });
                            $(".macIdPage input").each( function () {
                                me.css("pointer-events", "auto");
                            });
                        };
                    });
                    me.css("pointer-events", "auto");
                }
            }
        });
        visitorWidget._addEventListener({
            container: "body",
            target: visitorWidget._UIDEFAULFS.lineUpperBtn,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var data = "每克拉美—订阅号";
                var storeName = "meikeding";
                visitorWidget._UIDEFAULFS.lineUpperBtnHtml = '<div class="' + storeName + ' inlet">' + data + '</div><div class="lineMiddle"></div>';
                $(visitorWidget._UIDEFAULFS.lineUpperBtn).before(visitorWidget._UIDEFAULFS.lineUpperBtnHtml);
            }
        });
    },
    _toValidatorForm: function () {
        $('#eventMACAddress').bootstrapValidator({
            message: '',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                shopName: {
                    validators: {
                        regexp:{
                            regexp:/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/,
                            message: '请输入汉字,英文,数字'
                        },
                        notEmpty: {
                            message: '请输入店铺名称'
                        }
                    }
                },
                macID: {
                    validators: {
                        notEmpty: {
                            message: '请输入MAC地址'
                        },
                        regexp:{
                            regexp: /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/,
                            message: '请输入正确的MAC地址'
                        }
                    }
                }
            }
        });
    },
    _toStore: function () {
        visitorWidget._addEventListener({
            container: "body",
            target: visitorWidget._UIDEFAULFS.meikela,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                visitorWidget._UIDEFAULFS.winaName = me.html();
                visitorWidget._UIDEFAULFS.conId = me.attr("id");
                me.css("pointer-events", "none");
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'wina_title_name'"
                }).done( function (data) {
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            async: false,
                            view: data.views[0].view
                        }).done(function(r){
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: visitorWidget._UIDEFAULFS.winaName,
                                valueId: visitorWidget._UIDEFAULFS.conId,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true
                            });
                        })
                    }
                });
                me.css("pointer-events", "auto");
            }
        });
    },
    _addDeletMacGroup: function () {
        visitorWidget._addEventListener({
            container: "body",
            target: visitorWidget._UIDEFAULFS.addMac,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                visitorWidget._UIDEFAULFS.groupNum = parseInt($(".macGroup:last p").html())+1;
                var copyClone = document.createElement("div");
                $(copyClone).addClass("macGroup");
                var form = document.createElement("div");
                $(form).addClass("form-group");
                $(copyClone).append(form);

                var p = document.createElement("p");
                $(p).addClass("hideNum");
                $(p).html(visitorWidget._UIDEFAULFS.groupNum);
                $(form).append(p);

                var reduce = document.createElement("div");
                $(reduce).addClass("col-sm-1");
                $(reduce).addClass("reduce");
                var i = document.createElement("i");
                $(i).addClass("icon");
                $(i).addClass("iconfont");
                $(i).addClass("iconReduce");
                $(i).html("&#xe75e;");
                $(reduce).append(i);
                $(p).before(reduce);

                var ipt = document.createElement("div");
                $(ipt).addClass("col-sm-8");
                var toEmp = document.createElement("input");
                $(toEmp).addClass("form-control");
                $(toEmp).addClass("toEmpty");
                $(toEmp).attr("type","text");
                $(toEmp).attr("name","macID");
                $(toEmp).attr("placeholder","请输入MAC地址");
                $(ipt).append(toEmp);
                $(reduce).before(ipt);

                var ll = document.createElement("label");
                $(ll).addClass("col-sm-3");
                $(ll).addClass("control-label");
                $(ll).html("探针MAC地址-" + visitorWidget._UIDEFAULFS.groupNum);
                $(ipt).before(ll);

                $(visitorWidget._UIDEFAULFS.addMac).before(copyClone);
                $('#eventMACAddress').bootstrapValidator('addField', $(copyClone).find("input[name='macID']"));
            }
        });
        visitorWidget._addEventListener({
            container: "body",
            target: visitorWidget._UIDEFAULFS.reduce,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                visitorWidget._UIDEFAULFS.groupNum = parseInt($(".macGroup:last p").html()) - 1;
                var me = $(this);
                if(visitorWidget._UIDEFAULFS.groupNum >= 1){
                    me.parent().parent().remove();
                }
            }
        });
    },
    _setTimeChang: function () {
        $(".report-time-btn").attr("data-loading-text", "<span class='icon-refresh icon-spin'></span>");
        visitorWidget._addEventListener({
            container: "body",
            target: ".report-time-btn",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                $(".report-time-btn").removeClass("report-btn-selected");
                me.addClass("report-btn-selected");
                me.css("pointer-events", "none");
                if(me.data("type") == "month"){
                    me.button("loading");
                    me.css("pointer-events", "none");
                    visitorWidget._UIDEFAULFS.type = "month";
                    visitorWidget._getMonthTrend();
//                    setTimeout( function () {
                        me.button("reset");
                        me.css("pointer-events", "auto");
//                    }, 1000);
                }else{
                    me.button("loading");
                    me.css("pointer-events", "none");
                    visitorWidget._UIDEFAULFS.type = "week";
                    visitorWidget._getWeekTrend();
//                    setTimeout( function () {
                        me.button("reset");
                        me.css("pointer-events", "auto");
//                    }, 1000);
                }
            }
        });
    },
    _getWeekTrend: function () {
        $("#totalChart").loading();
        Iptools.GetJson({
            url: "basic/wina/getAllReport",
            data: {
                token: visitorWidget._UIDEFAULFS.token,
                startDate: visitorWidget._UIDEFAULFS.weekStart,
                endDate: visitorWidget._UIDEFAULFS.weekEnd
            }
        }).done( function (data) {
            $("#totalChart").html("");
            var totalNameList = [];
            var totalAataList = [];
            for(var i = 0;i < data.data.length;i++){
                totalNameList.push(data.data[i].name);
                totalAataList.push(data.data[i].data);
            }
            var seriessList = [];
            for(var j = 0;j < totalNameList.length;j++){
                var list={};
                list.name = totalNameList[j];
                list.data = totalAataList[j];
                seriessList.push(list)
            }
            if(data.retcode != true){
                var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                $("#totalChart").append(emptyHtml);
                $(".load-data-container img").hide();
                $("#totalChart .noDataArea").css("padding-top",$("#totalChart").height() === 0 ? 0+"px":($("#totalChart").height()- 175)/2+"px");
            }else{
                $('#totalChart').highcharts({
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: "%Y年-%b-%e日",
                            minute: "%Y年-%b-%e日",
                            hour: "%Y年-%b-%e日",
                            day: "%Y年-%b-%e日",
                            week: "%Y年-%b-%e日",
                            month: "%Y年-%b-%e日"
                        }
                    },
                    yAxis: [{
                        title: {
                            text: '人数'
                        },
                        labels: {
                            align: 'left',
                            x: 3,
                            y: 16,
                            format: '{value:.,0f}'
                        },
                        showFirstLabel: false

                    }],
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: 10,
                        y: 10,
                        floating: true
                    },
                    tooltip: {
//                    crosshairs: true,
                        dateTimeLabelFormats: {
                            second: "%Y年-%b-%e日",
                            minute: "%Y年-%b-%e日",
                            hour: "%Y年-%b-%e日",
                            day: "%Y年-%b-%e日",
                            week: "%Y年-%b-%e日",
                            month: "%Y年-%b-%e日"
                        },
                        shared: true,
                        useHTML: true,
                        crosshairs: [{
                            width: 1,
                            color: "#666",
                            plotOptions: 'longdashdot',
                            zIndex: 1000
                        }],
                        headerFormat: '{point.key}<br>'
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    series: seriessList
                });
            }
        });
    },
    _getMonthTrend: function () {
        $("#totalChart").loading();
        Iptools.GetJson({
            url: "basic/wina/getAllReport",
            data:{
                token: visitorWidget._UIDEFAULFS.token,
                startDate: visitorWidget._UIDEFAULFS.monthStart,
                endDate: visitorWidget._UIDEFAULFS.monthEnd
            }
        }).done( function (data) {
            var totalNameList = [];
            var totalAataList = [];
            for(var i = 0;i < data.data.length;i++){
                totalNameList.push(data.data[i].name);
                totalAataList.push(data.data[i].data);
            }
            var seriessList = [];
            for(var j = 0;j < totalNameList.length;j++){
                var list = {};
                list.name = totalNameList[j];
                list.data = totalAataList[j];
                seriessList.push(list)
            }
            if(data.retcode != true){
                var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                $("#totalChart").append(emptyHtml);
                $(".load-data-container img").hide();
                $("#totalChart .noDataArea").css("padding-top",$("#totalChart").height() === 0 ? 0+"px":($("#totalChart").height()- 175)/2+"px");
            }else{
                $('#totalChart').highcharts({
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: "%Y年-%b-%e日",
                            minute: "%Y年-%b-%e日",
                            hour: "%Y年-%b-%e日",
                            day: "%Y年-%b-%e日",
                            week: "%Y年-%b-%e日",
                            month: "%Y年-%b-%e日"
                        }
                    },
                    yAxis: [{
                        title: {
                            text: '人数'
                        },
                        labels: {
                            align: 'left',
                            x: 3,
                            y: 16,
                            format: '{value:.,0f}'
                        },
                        showFirstLabel: false

                    }],
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: 10,
                        y: 10,
                        floating: true
                    },
                    tooltip: {
//                    crosshairs: true,
                        dateTimeLabelFormats: {
                            second: "%Y年-%b-%e日",
                            minute: "%Y年-%b-%e日",
                            hour: "%Y年-%b-%e日",
                            day: "%Y年-%b-%e日",
                            week: "%Y年-%b-%e日",
                            month: "%Y年-%b-%e日"
                        },
                        shared: true,
                        useHTML: true,
                        crosshairs: [{
                            width: 1,
                            color: "#666",
                            plotOptions: 'longdashdot',
                            zIndex: 1000
                        }],
                        headerFormat: '{point.key}<br>'
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    series: seriessList
                });
            }
        });
    }

};