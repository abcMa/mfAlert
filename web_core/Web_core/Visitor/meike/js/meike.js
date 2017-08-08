/**
 * Created by 1 on 2017/3/22.
 */
var meikeWidget = {};
meikeWidget = {
    _UIDEFAULFS: {
        comeBtn: ".comeBtn",
        addMac: ".newaddMac",
        reduce: ".reduce",
        confirm: ".confirm",
        putComeBtn: ".putComeBtn",
        searchBtn: ".searchBtn",
        newBuildWina: ".newBuildWina",
        winaAddress: ".winaAddress",
        campaignSelect: { text: [], value: [] },
        campaignCondition: {},
        groupNum: 3,
        avgSeconds: 0,
        type: "hour",
        heatType: "all",
        shopHtml: "",
        tableHtml: "",
        shopName: "",
        PointValue: "",
        speardIcon: false,
        heatTr: ".heatTr",
        datas: "",
        heatHtml: "",
        tabTh: "",
        tableDody: ""
    },
    _rebuildUiDefaults: function (options) {
        meikeWidget._UIDEFAULFS = Iptools.Tool._extend(meikeWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        meikeWidget._getDateMiddle();//点击刷新日期按钮，改变全局时间段
        meikeWidget._addwina();//点击加号按钮，添加相应的探针
        meikeWidget._putwinaData();//点击保存探针管理页面数据
        meikeWidget._getSearchBtn();//点击搜索按钮或者回车，列出查询内容
        meikeWidget._getDayHour();//点击日或者小时日期选择按钮铺设数据
        meikeWidget._newBuildWina();//点击确定按钮，新建探针
        meikeWidget._getPopup();//鼠标滑过事件，显示在店停留时间
        meikeWidget._keydownWinaAddress();//点击搜索或者回车空搜数据处理
        meikeWidget._openSpreadData();//点击热力分布，加载百度地图和热力图数据铺设
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        meikeWidget._UIDEFAULFS.shopsId = Iptools.DEFAULTS.currentViewValue;
        meikeWidget._setWinaTime();//初始化获得当前日期的和向前推七天的日期
        meikeWidget._getShopDate();//初始化探针模态框数据
        meikeWidget._layAllDtata();//初始化铺设客流统计头部数据
        meikeWidget._getTrend();//初始化客流统计页面的客流趋势数据
        meikeWidget._toValidateForm();//初始化探针表单验证图表
        meikeWidget._layWinaData();//初始化加载铺设所有探针信息表格
        meikeWidget._setHeatMapData();//初始化百度地图，铺设地图热力数据
        meikeWidget._bindingDomEvent();//事件函数
        meikeWidget._bindingEventAfterLoad();//初始化加载函数
    },
    _getPopup: function () {
        $(".customerStopTime").mouseover(function(){
            var contents = "店内停留时间超过" + $("#comeInTime").val() + "分钟的顾客（去除员工）";
            $(this).attr("data-content",contents);
        });
    },
    _setWinaTime: function () {
        $(".datetimepickSearch").datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: "month"
        });
        var myDate = new Date(); //获取今天日期
        myDate.setDate( myDate.getDate() - 6 );
        var dateArray = [];
        var dateTemp;
        var flag = 1;
        for (var i = 0; i < 7; i++) {
            dateArray.push( myDate.format("yyyy-MM-dd") );
            myDate.setDate( myDate.getDate() + flag );
        }
        $("#inputStartDate").val( dateArray[0] );
        $("#inputEndDate").val( dateArray[6] );
        $('.datetimepickSearch').datetimepicker().on('changeDate', function () {
            if ($(this).attr("id") == "inputStartDate"){
                $(this).css("color","#282828");
                $("#inputEndDate").datetimepicker('setStartDate', $(this).val());
            }else if($(this).attr("id") == "inputEndDate"){
                $(this).css("color","#282828");
                $('#inputStartDate').datetimepicker('setEndDate', $(this).val());
            }else if($(this).attr("id") == "inputStartDate"){
                $(this).css("color","#282828");
                $('#inputEndDate').datetimepicker('setStartDate', $(this).val());
            }else if($(this).attr("id") == "inputEndDate"){
                $(this).css("color","#282828");
                $('#inputStartDate').datetimepicker('setEndDate', $(this).val());
            }
        });
    },
    _getShopDate: function () {
        Iptools.GetJson({
            url: "basic/wina/getShop",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId
            }
        }).done( function (data) {
            meikeWidget._UIDEFAULFS.shopName = data.shop.shopName;
            $("#shopName").val( data.shop.shopName );
            $(".addShopName").html( data.shop.shopName );
            $(".storeName").html( data.shop.shopName );
            $("#comeInTime").val( data.shop.incomeMinute );
            $("#employeeTime").val( data.shop.newMinute );
        });
    },
    _layAllDtata: function () {
        Iptools.GetJson({
            url: "basic/wina/getAnalysis",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            if(data.data.avgSeconds < 60){
                meikeWidget._UIDEFAULFS.avgSeconds = "0'" + data.data.avgSeconds;
            }else{
                meikeWidget._UIDEFAULFS.avgSeconds = parseInt(data.data.avgSeconds / 60) + "'" + data.data.avgSeconds % 60;
            }
            if(data.retcode == "ok"){
                $(".allNum").zeroTonum(0,data.data.totalCount,"slow");
                $(".comeInNum").zeroTonum(0,data.data.incomeCount,"normal");
                $(".newsNum").zeroTonum(0,data.data.newCount,"fast");
                $(".timeNum").html(meikeWidget._UIDEFAULFS.avgSeconds);
            }
        });
    },
    _getTrend: function () {
        $("#customerTrendChart").html(" ");
        $('#customerTrendChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: meikeWidget._UIDEFAULFS.type,
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done(function (data) {
            if(data.retcode == "ok" && data.report && data.report.totalCount){
                if(data.report.totalCount.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                    $("#customerTrendChart").html(emptyHtml);
                    $("#customerTrendChart .noDataArea").css("padding-top",$("#customerTrendChart").height() === 0 ? 0+"px":($("#customerTrendChart").height()- 175)/2+"px");
                }else{
                    $('#customerTrendChart').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                second: "%Y年-%b-%e日 %H时",
                                minute: "%Y年-%b-%e日 %H时",
                                hour: "%Y年-%b-%e日 %H时",
                                day: "%Y年-%b-%e日 %H时",
                                week: "%Y年-%b-%e日 %H时",
                                month: "%Y年-%b-%e日 %H时"
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

                        },{
                            linkedTo: 0,
                            gridLineWidth: 0,
                            opposite: true,
                            title: {
                                text: '时长(秒)'
                            },
                            labels: {
                                align: 'right',
                                x: -3,
                                y: 16,
                                format: '{value:.,1f}'
                            },
                            showFirstLabel: false
                        }],
                        tooltip: {
                            dateTimeLabelFormats: {
                                second: "%Y年-%b-%e日 %H时",
                                minute: "%Y年-%b-%e日 %H时",
                                hour: "%Y年-%b-%e日 %H时",
                                day: "%Y年-%b-%e日 %H时",
                                week: "%Y年-%b-%e日 %H时",
                                month: "%Y年-%b-%e日 %H时"
                            },
                            shared: true,
                            useHTML: true,
                            crosshairs: [{
                                width: 1,
                                color: "#666",
                                plotOptions: 'longdashdot',
                                zIndex: 1000
                            }]
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
                        series: [{
                            name: '客流量',
                            data: data.report.totalCount
                        }, {
                            name: '进店顾客数',
                            data: data.report.incomeCount
                        }, {
                            name: '新顾客数',
                            data: data.report.newCount
                        }, {
                            name: '平均停留时间',
                            data: data.report.avgSeconds
                        }]
                    });
                }
            }
        });
        meikeWidget._settableData(1);
    },
    _getDayTrend: function () {
        $("#customerTrendChart").html(" ");
        $('#customerTrendChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: meikeWidget._UIDEFAULFS.type,
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            if(data.retcode == "ok" && data.report && data.report.totalCount){
                if(data.report.totalCount.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                    $("#customerTrendChart").html(emptyHtml);
                    $("#customerTrendChart .noDataArea").css("padding-top",$("#customerTrendChart").height() === 0 ? 0+"px":($("#customerTrendChart").height()- 175)/2+"px");
                }else{
                    $('#customerTrendChart').highcharts({
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

                        },{
                            linkedTo: 0,
                            gridLineWidth: 0,
                            opposite: true,
                            title: {
                                text: '时长(秒)'
                            },
                            labels: {
                                align: 'right',
                                x: -3,
                                y: 16,
                                format: '{value:.,1f}'
                            },
                            showFirstLabel: false
                        }],
                        tooltip: {
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
                        series: [{
                            name: '客流量',
                            data: data.report.totalCount
                        }, {
                            name: '进店顾客数',
                            data: data.report.incomeCount
                        }, {
                            name: '新顾客数',
                            data: data.report.newCount
                        }, {
                            name: '平均停留时间',
                            data: data.report.avgSeconds
                        }]
                    });
                }
            }
        });
        meikeWidget._settableData(1);
    },
    _getgenderProportionChart: function () {
        $('#genderProportionChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getGroupReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: "gender",
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            var seriess = [];
            if(data.retcode == "ok"){
                $("#genderProportionChart").html("");
                for(var i = 0;i < data.data.categories.length;i++){
                    seriess.push([data.data.categories[i],parseFloat(data.data.series[i])]);
                }
                if(data.data.categories.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:120px;"><span>暂无统计数据</span></div>';
                    $("#genderProportionChart").html(emptyHtml);
                    $("#genderProportionChart .noDataArea").css("padding-top",$("#genderProportionChart").height() === 0 ? 0+"px":($("#genderProportionChart").height()- 175)/2+"px");
                }else{
                    $('#genderProportionChart').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            headerFormat: '{series.name}<br>',
                            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true,
                                innerSize: 80,
                                depth: 20,
                                colors:[
                                    "#5eb4ef",
                                    "#ffd777"
                                ]
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '性别',
                            data: seriess
                        }]
                    });
                }
            };
        });
    },
    _getageProportionChart: function () {
        $('#ageProportionChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getGroupReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: "age",
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            $("#ageProportionChart").html("");
            var seriess = [];
            var index = [];
            for(var i = 0;i < 7;i++){
                if(data.data.categories[i] == "18岁以下"){
                    index[0] = i;
                }
                if(data.data.categories[i] == "18-24岁"){
                    index[1] = i;
                }
                if(data.data.categories[i] == "25-34岁"){
                    index[2] = i;
                }
                if(data.data.categories[i] == "35-44岁"){
                    index[3] = i;
                }
                if(data.data.categories[i] == "45-54岁"){
                    index[4] = i;
                }
                if(data.data.categories[i] == "55-64岁"){
                    index[5] = i;
                }
                if(data.data.categories[i] == "65岁以上"){
                    index[6] = i;
                }
            }
            if(data.retcode == "ok") {
                for(var j = 0;j < 7;j++){
                    if(data.data.series[index[j]]){
                        seriess.push([data.data.categories[index[j]],parseFloat(data.data.series[index[j]])]);
                    }else{
                        seriess.push([data.data.categories[index[j]],parseFloat(0)]);
                    }
                }
                if(data.data.categories.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:120px;"><span>暂无统计数据</span></div>';
                    $("#ageProportionChart").html("");
                    $("#ageProportionChart").append(emptyHtml);
                    $("#ageProportionChart .noDataArea").css("padding-top",$("#ageProportionChart").height() == 0 ? 0+"px":($("#ageProportionChart").height()- 175)/2+"px");
                }else{
                    $('#ageProportionChart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'category',
                            labels: {
                                enabled: false
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            },
                            labels: {
                                enabled: false
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,  //图表柱形的
                                borderWidth: 0      //图表柱形的粗细
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                var allseriess = 0;
                                for(var i = 0;i < seriess.length;i++){
                                    allseriess += seriess[i][1];
                                };
                                return '<div> <b>' + '年龄' + '</b></div>' + '<br>' + this.point.name + ':' + (this.y/allseriess*100).toFixed(2) + '%';
                            }
                        },
                        series: [{
                            name: '年龄',
                            data: seriess,
                            color:'#7dd2fc'
                        }]
                    });

                }
            }
        });
    },
    _geteducationCharts: function () {
        $('#educationProportionChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getGroupReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: "education",
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            var seriess = [];
            if (data.retcode == "ok") {
                $("#educationProportionChart").html("");
                for(var i = 0;i < data.data.categories.length;i++){
                    seriess.push([data.data.categories[i],parseFloat(data.data.series[i])]);
                }
                if(data.data.categories.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:120px;"><span>暂无统计数据</span></div>';
                    $("#educationProportionChart").append(emptyHtml);
                    $("#educationProportionChart .noDataArea").css("padding-top",$("#educationProportionChart").height() === 0 ? 0+"px":($("#educationProportionChart").height()- 175)/2+"px");
                }else{
                    $('#educationProportionChart').highcharts({
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            headerFormat: '{series.name}<br>',
                            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true,
                                innerSize: 80,
                                depth: 20,
                                colors:[
                                    "#5eb4ef",
                                    "#ffd777",
                                    "#6fcdcd"
                                ]
                            }
                        },
                        series: [{
                            name: '学历',
                            data: seriess
                        }]
                    });
                }
            }
        });
    },
    _getincomeCharts: function () {
        $('#incomeProportionChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getGroupReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: "incomelevel",
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            var seriess = [];
            if (data.retcode == "ok") {
                $("#incomeProportionChart").html("");
                for(var i = 0;i < data.data.categories.length;i++){
                    seriess.push([data.data.categories[i],parseFloat(data.data.series[i])]);
                }
                if(data.data.categories.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:120px;"><span>暂无统计数据</span></div>';
                    $("#incomeProportionChart").append(emptyHtml);
                    $("#incomeProportionChart .noDataArea").css("padding-top",$("#incomeProportionChart").height() === 0 ? 0+"px":($("#incomeProportionChart").height()- 175)/2+"px");
                }else{
                    $('#incomeProportionChart').highcharts({
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            headerFormat: '{series.name}<br>',
                            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true,
                                innerSize: 80,
                                depth: 20,
                                colors:[
                                    "#5eb4ef",
                                    "#ffd777",
                                    "#6fcdcd"
                                ]
                            }
                        },
                        series: [{
                            name: '收入',
                            data: seriess
                        }]
                    });
                }
            }
        });
    },
    _getliftCharts: function () {
        $('#liftProportionChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getGroupReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: "lifestage",
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            var seriess = [];
            if (data.retcode == "ok") {
                $("#liftProportionChart").html("");
                for(var i = 0; i < data.data.categories.length;i++){
                    seriess.push([data.data.categories[i], parseFloat(data.data.series[i])]);
                }
                var seriesName = "人生阶段";
                if(data.data.categories.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                    $("#liftProportionChart").append(emptyHtml);
                    $("#liftProportionChart .noDataArea").css("padding-top",$("#liftProportionChart").height() === 0 ? 0+"px":($("#liftProportionChart").height()- 175)/2+"px");
                }else{
                    $('#liftProportionChart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'category',
                            labels: {
                                rotation: -45,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: '单位(%)'
                            }
                        },
                        plotOptions: {

                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                var allseriess=0;
                                for(var i = 0;i < seriess.length;i++){
                                    allseriess += seriess[i][1];
                                };
                                return '<div> <b>' + seriesName + '</b></div>' + '<br>' + this.point.name + ':' + (this.y/allseriess*100).toFixed(2) + '%)';
                            }
                        },
                        series: [{
                            name: seriesName,
                            data: seriess,
                            color: '#7dd2fc'
                        }]
                    });
                }
            }
        });
    },
    _getgradeCharts: function () {
        $('#gradeProportionChart').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getGroupReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: "industry",
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            var seriess = [];
            if (data.retcode == "ok") {
                $("#gradeProportionChart").html("");
                for(var i = 0;i < data.data.categories.length;i++){
                    seriess.push([data.data.categories[i],parseFloat(data.data.series[i])]);
                }
                var seriesName = "职业分布";
                if(data.data.categories.length == 0){
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                    $("#gradeProportionChart").append(emptyHtml);
                    $("#gradeProportionChart .noDataArea").css("padding-top",$("#gradeProportionChart").height() === 0 ? 0+"px":($("#gradeProportionChart").height()- 175)/2+"px");
                }else{
                    $('#gradeProportionChart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'category',
                            labels: {
                                rotation: -45,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: '单位(%)'
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.4,  //图表柱形的
                                borderWidth: 0      //图表柱形的粗细
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                var allseriess=0;
                                for(var i = 0;i < seriess.length;i++){
                                    allseriess+=seriess[i][1];
                                };
                                return '<div> <b>' + seriesName + '</b></div>' + '<br>' + this.point.name + ':' + (this.y/allseriess*100).toFixed(2) + '%';
                            }
                        },
                        series: [{
                            name: seriesName,
                            data: seriess,
                            color: '#7dd2fc'
                        }]
                    });
                }
            }
        });
    },
    _getDateMiddle: function () {
        $("#setMiddleDate").attr("data-loading-text", "<span class='fa fa-refresh'></span>");
        meikeWidget._addEventListener({
            container: "body",
            type: "click",
            target: "#setMiddleDate",
            event: function () {
                var me = $(this);
                me.css("pointer-events", "none");
                me.button("loading");
                var tinput = me.parent().find(".dateInput input.datetimepickSearch");
                var utime = tinput.eq(0).val();
                var dtime = tinput.eq(1).val();
                if (Iptools.Tool._checkNull(utime) && Iptools.Tool._checkNull(dtime)) {
                    meikeWidget._UIDEFAULFS.campaignCondition["create_time"] = " between '" + utime + "' and '" + dtime + "'";
                } else if (Iptools.Tool._checkNull(utime)) {
                    meikeWidget._UIDEFAULFS.campaignCondition["create_time"] = " >= '" + utime + "'";
                } else if (Iptools.Tool._checkNull(dtime)) {
                    meikeWidget._UIDEFAULFS.campaignCondition["create_time"] = " <= '" + dtime + "'";
                } else {
                    delete meikeWidget._UIDEFAULFS.campaignCondition["create_time"];
                }
                meikeWidget._getTablink($(".contactTabList .active").children().data("id"));//获得选择的那个列表
                setTimeout(function () {
                    me.button("reset");
                    me.css("pointer-events", "auto");
                }, 5000);
            }
        });
    },
    _toValidateForm: function () {
        $('#comeInCustomer').bootstrapValidator({
            message: '',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                shopName: {
                    validators: {
                        notEmpty: {
                            message: '请输入店铺名称'
                        }
                    }
                },
                comeInTime: {
                    validators: {
                        notEmpty: {
                            message: '请输入进店顾客时长'
                        }
                    }
                },
                employeeTime: {
                    validators: {
                        notEmpty: {
                            message: '请输入员工驻店时长'
                        }
                    }
                }
            }
        });
    },
    _addwina: function () {
            meikeWidget._addEventListener({
                container: "body",
                target: meikeWidget._UIDEFAULFS.addMac,
                type: "click",
                event: function () {
                    meikeWidget._UIDEFAULFS.groupNum = parseInt($(".macGroup:last p").html()) + 1;
                    var copyClone = document.createElement("div");
                    $(copyClone).addClass("macGroup");
                    var form = document.createElement("div");
                    $(form).addClass("form-group");
                    $(copyClone).append(form);

                    var p = document.createElement("p");
                    $(p).addClass("hideNum");
                    $(p).html(meikeWidget._UIDEFAULFS.groupNum);
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
                    $(toEmp).addClass("newWinaAddress");
                    $(toEmp).attr("type","text");
                    $(toEmp).attr("name","macID");
                    $(toEmp).attr("placeholder","请输入MAC地址");
                    $(ipt).append(toEmp);
                    $(reduce).before(ipt);

                    var ll = document.createElement("label");
                    $(ll).addClass("col-sm-3");
                    $(ll).addClass("control-label");
                    $(ll).html("探针MAC地址-" + meikeWidget._UIDEFAULFS.groupNum);
                    $(ipt).before(ll);

                    $(meikeWidget._UIDEFAULFS.addMac).before(copyClone);
                    $('#eventAddMac').bootstrapValidator('addField', $(copyClone).find("input[name='macID']"));
                }
            });
            meikeWidget._addEventListener({
                container: "body",
                target: meikeWidget._UIDEFAULFS.reduce,
                type: "click",
                event: function (e) {
                    e = e || event;
                    e.stopPropagation();
                    meikeWidget._UIDEFAULFS.groupNum = parseInt($(".macGroup:last p").html()) - 1;
                    var me = $(this);
                    if(meikeWidget._UIDEFAULFS.groupNum >= 1){
                        me.parent().parent().remove();
                    };
                }
            });
            $('#eventAddMac').bootstrapValidator({
                message: '',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    macID: {
                        validators: {
                            notEmpty: {
                                message: '请输入MAC地址'
                            },
                            regexp:{
                                regexp:/^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/,
                                message: '请输入正确的MAC地址'
                            }
                        }
                    }
                }
            });
    },
    _putwinaData: function () {
        $(".putComeBtn").attr("data-loading-text", "<span class='icon-refresh icon-spin icon-upload-Btn'></span>");
        meikeWidget._addEventListener({
            container: "body",
            target: meikeWidget._UIDEFAULFS.putComeBtn,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                me.button("loading");
                me.css("pointer-events", "none");
                Iptools.PutJson({
                    url: "basic/wina/updateShop",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        shopId: meikeWidget._UIDEFAULFS.shopsId,
                        shopName: $("#shopName").val(),
                        incomeMinute: $("#comeInTime").val(),
                        empMinute: $("#employeeTime").val()
                    }
                }).done( function (data) {
                    if(data.retcode == "ok"){
                        Iptools.Tool.pAlert({
                            type: "info",
                            title: "系统提示：",
                            content: "修改成功",
                            delay: 1000
                        });
                        $(".newWinaAddress").val("");
                        me.css("pointer-events", "auto");
                    };
                });
                setTimeout(function () {
                    me.button("reset");
                    me.css("pointer-events", "auto");
                }, 1500);
            }
        });
    },
    _getSearchBtn: function () {
        meikeWidget._addEventListener({
            container: "body",
            target: meikeWidget._UIDEFAULFS.searchBtn,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                me.css("pointer-events", "none");
                Iptools.GetJson({
                    url: "basic/wina/getProbes",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        shopId: meikeWidget._UIDEFAULFS.shopsId,
                        searchWord: $(".winaAddress").val().split(":").join("")
                    }
                }).done( function (data) {
                    meikeWidget._UIDEFAULFS.shopHtml = "";
                    if(data.probes.length < 1){
                        Iptools.Tool.pAlert({
                            type: "danger",
                            title: "系统提示：",
                            content: "搜索内容不存在",
                            delay: 1000
                        });
                    };
                    if(data.retcode == "ok"){
                        var num = 1;
                        var number = 1;
                        for(var i = 0; i < data.probes.length;i++,number++){
                            if(i < 9){ num = "00"+number; }
                            var winaMacId = data.probes[i].winaMacId[0] + data.probes[i].winaMacId[1]+":"
                                +data.probes[i].winaMacId[2] + data.probes[i].winaMacId[3]+":"
                                +data.probes[i].winaMacId[4] + data.probes[i].winaMacId[5]+":"
                                +data.probes[i].winaMacId[6] + data.probes[i].winaMacId[7]+":"
                                +data.probes[i].winaMacId[8] + data.probes[i].winaMacId[9]+":"
                                +data.probes[i].winaMacId[10] + data.probes[i].winaMacId[11];
                            meikeWidget._UIDEFAULFS.shopHtml += '<tr> <td>' + num + '</td> <td>' + winaMacId + '</td> <td><span class="delectWina">删除</span></td></tr>';
                        }
                        $(".addWinaTab").html(meikeWidget._UIDEFAULFS.shopHtml);
                    }
                });
                me.css("pointer-events", "auto");
            }
        });
    },
    _getDayHour: function () {
        $(".report-time-btn").attr("data-loading-text", "<span class='icon-refresh icon-spin'></span>");
        meikeWidget._addEventListener({
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
                if(me.data("type") == "hour"){
                    me.button("loading");
                    me.css("pointer-events", "none");
                    meikeWidget._UIDEFAULFS.type = "hour";
                    meikeWidget._getTrend();
//                    setTimeout( function () {
                        me.button("reset");
                        me.css("pointer-events", "auto");
//                    }, 1500);
                }else{
                    me.button("loading");
                    me.css("pointer-events", "none");
                    meikeWidget._UIDEFAULFS.type = "day";
                    meikeWidget._getDayTrend();
//                    setTimeout(function () {
                        me.button("reset");
                        me.css("pointer-events", "auto");
//                    }, 1500);
                }
            }
        });
        meikeWidget._addEventListener({
            container: "body",
            target: ".heat-time-btn",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                me.button("loading");
                me.css("pointer-events", "none");
                $(".heat-time-btn").removeClass("report-btn-selected");
                me.addClass("report-btn-selected");
                me.css("pointer-events", "none");
                if(me.data("type") == "all"){
                    meikeWidget._getSpreadList();
                        me.button("reset");
                        me.css("pointer-events", "auto");
                }
            }
        });
    },
    _layWinaData: function () {
        $(".addWinaTab").loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getProbes",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId
            }
        }).done(function (data) {
            meikeWidget._UIDEFAULFS.shopHtml = "";
            if(data.retcode == "ok"){
                var num = 1;
                var number = 1;
                for(var i = 0;i < data.probes.length;i++,number++){
                    if(i < 9){ num = "00" + number; }
                    var winaMacId = data.probes[i].winaMacId[0] + data.probes[i].winaMacId[1] + ":"
                        +data.probes[i].winaMacId[2] + data.probes[i].winaMacId[3]+":"
                        +data.probes[i].winaMacId[4] + data.probes[i].winaMacId[5]+":"
                        +data.probes[i].winaMacId[6] + data.probes[i].winaMacId[7]+":"
                        +data.probes[i].winaMacId[8] + data.probes[i].winaMacId[9]+":"
                        +data.probes[i].winaMacId[10] + data.probes[i].winaMacId[11];
                    meikeWidget._UIDEFAULFS.shopHtml += '<tr> <td>' + num + '</td> <td>' + winaMacId + '</td> <td><span class="delectWina">删除</span></td></tr>';
                }
                $(".addWinaTab").html(meikeWidget._UIDEFAULFS.shopHtml);
            }
        });
    },
    _newBuildWina: function () {
        $(".newBuildWina").attr("data-loading-text", "<span class='icon-refresh icon-spin'></span>");
        meikeWidget._addEventListener({
            container: "body",
            target: meikeWidget._UIDEFAULFS.newBuildWina,
            type: "click",
            event: function () {
                $("#eventAddMac").bootstrapValidator('validate');
                if ($("#eventAddMac").data("bootstrapValidator").isValid()) {
                    var me = $(this);
                    $(".report-time-btn").removeClass("report-btn-selected");
                    me.addClass("report-btn-selected");
                    me.button("loading");
                    me.css("pointer-events", "none");
                    var macListWina = "";
                    var macLiasta = "";
                    var macLists = $(".newWinaAddress");
                    for(var i = 0;i < macLists.length;i++){
                        macLiasta += $(macLists[i]).val() + ",";
                    };
                    macListWina = macLiasta.split(":").join("");
                    macListWina = macListWina.substring(0, macListWina.lastIndexOf(','));
                        Iptools.PostJson({
                            url: "basic/wina/addProbes",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                shopId: meikeWidget._UIDEFAULFS.shopsId,
                                macList: macListWina
                            }
                        }).done( function (r) {
                            if(r.retcode == "ok"){
                                Iptools.Tool.pAlert({
                                    type: "info",
                                    title: "系统提示：",
                                    content: r.retmsg,
                                    delay: 1000
                                });
                                $("#addModal").modal("hide");
                                me.css("pointer-events", "auto");
                            }else{
                                Iptools.Tool.pAlert({
                                    type: "danger",
                                    title: "系统提示",
                                    content: r.retmsg,
                                    delay: 1000
                                });
                                $(".macIdPage input").each(function(){
                                    me.css("pointer-events", "auto");
                                });
                            }
                        });
                    me.button("reset");
                    me.css("pointer-events", "auto");
                    meikeWidget._layWinaData();//初始化加载铺设所有探针信息表格
                }
            }
        });
    },
    _settableData: function (pageNow) {
        Iptools.GetJson({
            url: "basic/wina/getReportTableData",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: meikeWidget._UIDEFAULFS.type,
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val(),
                pageNow: pageNow,
                pageSize: 8
            }
        }).done( function (data) {
            if(data.data.pageCount == "0"){
                meikeWidget._settablesData(1);
            }else{
                meikeWidget._settablesData(data.data.pageCount);
            }
        })
    },
    _settablesData: function (pageCount) {
        $('.tableBody').loading({
            url: "../../Content/Image/load-data-noBg.gif"
        });
        Iptools.GetJson({
            url: "basic/wina/getReportTableData",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: meikeWidget._UIDEFAULFS.type,
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val(),
                pageNow: pageCount,
                pageSize: 8
            }
        }).done( function (data) {
            if(data.retcode == "ok"){
                if (data.data.pageCount == "0") {
                    var emptyHtml = '<div class="noDataArea emptyReport"><img src="../../Content/Image/nodetail.png" class="emptyImg" style="width:150px;"><span style="margin-bottom: 50px;">暂无数据报表</span></div>';
                    $(".tableBody").html(emptyHtml);
                }else{
                    var typeData = "";
                    meikeWidget._UIDEFAULFS.tableDody = "";
                    meikeWidget._UIDEFAULFS.tableHtml = "";
                    meikeWidget._UIDEFAULFS.tabTh = "";
                    $(".tableBody").html("");
                    $(".customerTabData").html("");
                    $(".customerTabBody").html("");
                    meikeWidget._UIDEFAULFS.tableDody = '<table class="table"> <tr class="customerTabBody"> </tr> <tbody class="customerTabData"> <div class="interimTab"> </div> </tbody> </table> <div class="ticker"> <div id="dataPager"> </div> </div>';
                    for(var i = 0;i < data.data.records.length;i++){
                        if(meikeWidget._UIDEFAULFS.type == "hour"){
                            if (data.data.records[i].hour) {
                                typeData = data.data.records[i].hour.split(" ")[0] + '日' + data.data.records[i].hour.split(" ")[1] + '时';
                            }
                        }else{
                            typeData = data.data.records[i].day.split(" ")[0];
                        }
                        var time = "";
                        if(data.data.records[i].avgSeconds < 60){
                            time = "0'" + data.data.records[i].avgSeconds;
                        }else{
                            if(60 < data.data.records[i].avgSeconds < 600){}
                            time = parseInt(data.data.records[i].avgSeconds/60) + "'" + data.data.records[i].avgSeconds%60;
                        }
                        meikeWidget._UIDEFAULFS.tableHtml += '<tr> <td>' + typeData + '</td> <td>'
                            +meikeWidget._UIDEFAULFS.shopName + '</td> <td>' + data.data.records[i]["count"] + '</td> <td>'
                            +data.data.records[i].incomeCount + '</td> <td>' + data.data.records[i].newCount + '</td> <td>'
                            +time + '<span>"</span></td></tr>';
                    }
                    meikeWidget._UIDEFAULFS.tabTh = '<th>日期</th> <th>店铺名称</th> <th>客流量</th> <th>进店顾客数</th> <th>新顾客数</th> <th>平均驻店时长</th>';
                    meikeWidget._UIDEFAULFS.TabType = true;
                    $(".tableBody").html(meikeWidget._UIDEFAULFS.tableDody);
                    $(".customerTabData").html(meikeWidget._UIDEFAULFS.tableHtml);
                    $(".customerTabBody").html(meikeWidget._UIDEFAULFS.tabTh);
                    component._pager({
                        container: "dataPager",//ID选择器
                        pageSize: 8,
                        pageCount: data.data.pageCount,
                        rowCount: data.data.rowCount,
                        pageNow: pageCount,
                        jump: function (page) {
                            meikeWidget._settablesData(page);
                        }
                    });
                }
            }
        });
    },
    _keydownWinaAddress: function () {
        meikeWidget._addEventListener({
            container: "body",
            target: meikeWidget._UIDEFAULFS.winaAddress,
            type: "focus",
            event: function () {
                $(".baceIcon").hide();
                $(".winaAddress").css("padding-left","6px").css("padding-right","45px").attr("placeholder","探针mac地址");
                $(".enter").show();

            }
        });
        meikeWidget._addEventListener({
            container: "body",
            target: meikeWidget._UIDEFAULFS.winaAddress,
            type: "blur",
            event: function () {
                $(".baceIcon").show();
                $(".winaAddress").css("padding-left","27px").css("padding-right","6px").attr("placeholder","请输入探针mac地址");
                $(".enter").hide();

            }
        });
        meikeWidget._addEventListener({
            container: "body",
            target: meikeWidget._UIDEFAULFS.winaAddress,
            type: "keydown",
            event: function () {
                if (event.keyCode == 13){
                    if($(meikeWidget._UIDEFAULFS.winaAddress).val() == ""){
                       meikeWidget._layWinaData();
                    }else{
                        Iptools.GetJson({
                            url: "basic/wina/getProbes",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                shopId: meikeWidget._UIDEFAULFS.shopsId,
                                searchWord: $(".winaAddress").val().split(":").join("")
                            }
                        }).done( function (data) {
                            meikeWidget._UIDEFAULFS.shopHtml = "";
                            if(data.probes.length < 1){
                                Iptools.Tool.pAlert({
                                    type: "danger",
                                    title: "系统提示：",
                                    content: "搜索内容不存在",
                                    delay: 1000
                                });
                            };
                            if(data.retcode == "ok"){
                                var num = 1;
                                var number = 1;
                                for(var i = 0;i < data.probes.length;i++,number++){
                                    if(i < 9){ num = "00"+number; }
                                    var winaMacId = data.probes[i].winaMacId[0] + data.probes[i].winaMacId[1] + ":"
                                        +data.probes[i].winaMacId[2] + data.probes[i].winaMacId[3] + ":"
                                        +data.probes[i].winaMacId[4] + data.probes[i].winaMacId[5] + ":"
                                        +data.probes[i].winaMacId[6] + data.probes[i].winaMacId[7] + ":"
                                        +data.probes[i].winaMacId[8] + data.probes[i].winaMacId[9] + ":"
                                        +data.probes[i].winaMacId[10] + data.probes[i].winaMacId[11];
                                    meikeWidget._UIDEFAULFS.shopHtml += '<tr> <td>' + num + '</td> <td>' + winaMacId + '</td> <td><span class="delectWina">删除</span></td></tr>';
                                };
                                $(".addWinaTab").html(meikeWidget._UIDEFAULFS.shopHtml);
                            };
                        });
                    }
                }
            }
        });
    },
    _setHeatMapData: function () {
        $(function () {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var activeTab = $(e.target).data("id");
                meikeWidget._getTablink(activeTab);//获得选择的那个列表
            });
        });
    },
    _openSpreadData: function () {
        meikeWidget._addEventListener({
            container: "body",
            target: meikeWidget._UIDEFAULFS.heatTr,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                meikeWidget._getSpreadList();
            }
        });
    },
    _getHeatMap: function () {
        var datas = [];
        var lng = "116.48087777778";
        var lat = "39.954277777778";
        Iptools.GetJson({
            async: false,
            url: "basic/wina/getMapReport",
            data: {
                token: Iptools.DEFAULTS.token,
                shopId: meikeWidget._UIDEFAULFS.shopsId,
                type: "shopCustomerSourceGpsInfos",
                startDate: $("#inputStartDate").val(),
                endDate: $("#inputEndDate").val()
            }
        }).done( function (data) {
            if(data.retcode == "ok"){
                datas = data.data.series;
                if(data.data.series && data.data.series.length != 0){
                    lng = datas[0].lng;
                    lat = datas[0].lat;
                }
            }
        });
        var map = new BMap.Map("heatMap");    // 创建Map实例
        map.centerAndZoom(new BMap.Point(lng,lat), 11);  // 初始化地图,设置中心点坐标和地图级别
        var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
        var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);
        map.enableScrollWheelZoom(); // 允许滚轮缩放
        map.setMinZoom(5);
        map.setMaxZoom(18);
        heatmapOverlay = new BMapLib.HeatmapOverlay({
            "radius": 10
        });
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: datas,max: 1});
    },
    _getSpreadList: function (data) {
        meikeWidget._UIDEFAULFS.heatHtml = "";
        if(data == false){
            meikeWidget._UIDEFAULFS.speardIcon = false;
        }
        if(meikeWidget._UIDEFAULFS.speardIcon == false){
            $(".spread").css("width","300px");
            $(".spread").css("height","448px");
            $(".spread").css("overflow-y","auto");
            $(".spreadLine").css("padding-left","0");
            $(".heatIcon").html("&#xe69f;");
            Iptools.GetJson({
                async: false,
                url: "basic/wina/getMapReport",
                data: {
                    token: Iptools.DEFAULTS.token,
                    shopId: meikeWidget._UIDEFAULFS.shopsId,
                    type: "shopCustomerSourcePOIInfos",
                    startDate: $("#inputStartDate").val(),
                    endDate: $("#inputEndDate").val()
                }
            }).done( function (data) {
                if(data.retcode == "ok"){
                    if(data.data.categories.length == 0){
                        $(".heatTab").html("");
                        $(".spread").css("overflow-y","hidden");
                        var emptyHtml = '<tr> <td></td> <td class="emptyTD"><div class="noDataArea emptyReport"><img src="../../Content/Image/source.svg" class="emptyImg" style="width:100px;"><span>暂无客户来源</span></div></td><td></td></tr>';
                        $(".heatTab").html(emptyHtml).css("border-bottom","1px solid transparent");
                        $(".emptyTD").css("padding-bottom","230px");
                        $(".heatTab .noDataArea").css("padding-top",$(".heatTab").height() === 0 ? 0+"px":($(".heatTab").height()- 175)/2+"px");
                    }else{
                        $(".heatTab").html("").css("border-bottom","1px solid #ddd");
                        $(".spread").css("overflow-y","auto");
                        for(var i = 0,j = 1; i < data.data.categories.length;i++,j++){
                            if(j == 1){
                                meikeWidget._UIDEFAULFS.heatHtml += '<tr> <td class="heatTd"><span class="heatSpan"  style="background-color: #ff7d7e;color: #fff;">' + j + '</span></td> <td>' + data.data.categories[i] + '</td><td><span class="heatDataRanking">' + data.data.series[i] + '</span></td></tr>';
                            }else if(j == 2){
                                meikeWidget._UIDEFAULFS.heatHtml += '<tr> <td class="heatTd"><span class="heatSpan"  style="background-color: #f5bb78;color: #fff;">' + j + '</span></td> <td>' + data.data.categories[i] + '</td><td><span class="heatDataRanking">' + data.data.series[i] + '</span></td></tr>';
                            }else if(j == 3){
                                meikeWidget._UIDEFAULFS.heatHtml += '<tr> <td class="heatTd"><span class="heatSpan"  style="background-color: #8bd08b;color: #fff;">' + j + '</span></td> <td>' + data.data.categories[i] + '</td><td><span class="heatDataRanking">' + data.data.series[i] + '</span></td></tr>';
                            }else{
                                meikeWidget._UIDEFAULFS.heatHtml += '<tr> <td class="heatTd"><span class="heatSpan">' + j + '</span></td> <td>' + data.data.categories[i] + '</td><td><span class="heatDataRanking">' + data.data.series[i] + '</span></td></tr>';
                            }
                        }
                        $(".heatTab").html(meikeWidget._UIDEFAULFS.heatHtml);
                    }
                }
            });
            meikeWidget._UIDEFAULFS.speardIcon = true;
        }else{
            meikeWidget._UIDEFAULFS.heatHtml = "";
            $(".spread").css("width","140px");
            $(".spread").css("height","54px");
            $(".spread").css("overflow","hidden");
            $(".spreadLine").css("padding-left","10px");
            $(".heatIcon").html("&#x3442;");
            $(".heatTab").html(meikeWidget._UIDEFAULFS.heatHtml);
            meikeWidget._UIDEFAULFS.speardIcon = false;
        }
    },
    _getTablink: function (activeTab) {
        if (activeTab == "2") {
            meikeWidget._getHeatMap();//初始化铺设地图热力点
            meikeWidget._getSpreadList(false);//切换客户来源列表
            $(".dateChoice").show();
        }else if (activeTab == "1") {
            meikeWidget._getgenderProportionChart();//初始化加载铺设性别比例图表
            meikeWidget._getageProportionChart();//初始化加载铺设年龄分布图表
            meikeWidget._geteducationCharts();//初始化加载铺设学历比例图表
            meikeWidget._getincomeCharts();//初始化加载铺设收入水平图表
            meikeWidget._getliftCharts();//初始化加载铺设人生阶段图表
            meikeWidget._getgradeCharts();//初始化加载铺设职业分布图表
            $(".dateChoice").show();
        }else if (activeTab == "0") {
            meikeWidget._getShopDate();//初始化探针店铺数据
            meikeWidget._layAllDtata();//初始化探针客流统计顶部数据
            if (meikeWidget._UIDEFAULFS.type == "day") {
                meikeWidget._getDayTrend();//单位为天，客流趋势
            } else {
                meikeWidget._getTrend();//单位为小时，客流趋势
            }
            $(".dateChoice").show();
        }else if (activeTab == "3") {
            $(".dateChoice").hide();
        }else if (activeTab == "4") {
            $(".dateChoice").hide();
        }
    }
};