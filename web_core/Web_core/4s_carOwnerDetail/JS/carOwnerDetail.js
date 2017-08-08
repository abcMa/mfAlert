var widget = {};
widget = {
    _UIDEFAULFS: {
        cusId : "",
        customerApplet :"",
        customerControl: [],
        cusRoot:"",
        phone:"",
        conActionId : "",
        conActionRoot :"",
        conAction_PAGE_NOW: 1,
        conAction_PAGE_SIZE : 10,
        CampaignDetailApplet :"",
        GroupListAppletId : "",
        groupRootLink : "",
        contactGroup_PAGE_NOW: 1,
        contactGroup_PAGE_SIZE : 10,
        filterGroupCondition : "",
        groupLinkApplet : "",
        groupLinkRoot : "",
        existGroupArr : [],
        taskListApplet:"",
        taskListAppletRoot:"",
        carListRoot :"",
        carLinkContactApplet:"",
        carLinkContactRoot:"",
        taskDetailApplet:"",
        filterTraceType:"",
        contactInfo:[],//存储联系人的电话和名称
        contactRoot:"",
        contactApplet:"",
        cusName :"",
        cusPhone :"",
        traceIcon:[
            {"type":"1","icon":"fa-gift"},//活动
            {"type":"2","icon":"fa-tag"},//添加标签
            {"type":"3","icon":"fa-rmb"},//消费
            {"type":"4","icon":"fa-user"},//创建客户
            {"type":"5","icon":"fa-pencil-square-o"},//编辑
            {"type":"6","icon":"fa-users"},//添到客户群
            {"type":"7","icon":"fa-chain-broken"},//移出客户群
            {"type":"8","icon":"fa-trash"},//移除标签
            {"type":"9","icon":"fa-plus"},//创建任务
            {"type":"22","icon":"fa-toggle-on"},//重新打开任务
            {"type":"10","icon":"fa-calendar-plus-o"},//笔记
            {"type":"11","icon":"fa-commenting-o"},//发送信息
            {"type":"14","icon":"fa-check"},//完成任务
            {"type":"16","icon":"fa-weixin"},//微信群发
            {"type":"17","icon":"fa-file-text-o"},//回访
            {"type":"18","icon":"fa-phone"},//外呼
            {"type":"19","icon":"fa-sign-in"},//来电
            {"type":"20",'icon':"fa-wrench"},//维保记录
            {"type":"21","icon":"fa-wpforms"},//到店
            {"type":"29","icon":"fa-shield"},//增加延保
            {"type":"30","icon":"fa-star"},//增加安吉星
            {"type":"12","icon":"fa-volume-control-phone"}//拨号
        ]
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
        widget._clickJumpView();
        widget._clickaddTagPanel();
//        widget._clickTaskDetail();//查看任务详情
//        widget._haveCompleteTask();//勾选完成任务
        widget._clickGetMoreTrace();//加载更多动态
        widget._clickFilterTrace();//筛选动态根据动态类型
        widget._clickToFilterTrace();//点击确定筛选动态
        widget._clickToCancelFilterTrace();//点击取消筛选动态
        widget._clickDocument();
//        widget._selectSend();//选择给车主还是车主关联的联系人发短信
//        widget._selectContactForMsg();//选择联系人发短信
    },
    _bindingEventAfterLoad: function () {//插件的初始化
//        var tour = new Tour({
//            backdrop:true,
//            storage: false,
//            container: "body",
//            template:"<div class='popover tour' style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
//                +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
//                +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
//                +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
//            steps: [
//                {
//                    element: ".left_top",
//                    title: "车主基本信息",
//                    placement: "bottom",
//                    content: "展示车主的电话、姓名等基本信息",
//                    onShown: function () {
//                        $(".tour-step-background").css("width","64px").css("height","33px").css("border-radius","0px");
//                    }
//                },
//                {
//                    element: ".right-top",
//                    title: "核心看板",
//                    placement: "bottom",
//                    content: "展示车主关键信息，也可进行“记录互动”、“发短信”等 ",
//                    onShown: function () {
//                        $(".tour-step-background").css("width","82%").css("height","277px").css("border-radius","0px");
//                    }
//                },
//                {
//                    element: ".right_bottom",
//                    title: "车主相关信息展示",
//                    placement: "top",
//                    content: "详细记录了车主的动态、联系人列表、车辆信息列表、车主任务列表和车主相关信息的更改追踪",
//                    onShown: function () {
//                        $(".tour-step-background").css("width",'100%').css("height",'').css("border-radius","0px");
//                    }
//                }
//            ],
//            onEnd:function(){
//                $(".left_top,.right-top,.demo-inner .panel-group .panel:first-child,.left_middle .panel-group .panel:nth-child(4)").removeClass("disabled");
//                $('html,body').animate({scrollTop: '0px'}, 100);
//            }
//        });
//        if(window.localStorage.getItem("contactDetail_tour")!="yes"){
//            tour.init();
//            window.localStorage.setItem("contactDetail_tour","yes");
//            $(".left_top,.right-top,.demo-inner .panel-group .panel:first-child,.left_middle .panel-group .panel:nth-child(4)").addClass("disabled");
//            tour.start(true);
//            tour.goTo(0);
//        }
    },
    _init: function () {
        widget._bindingDomEvent();
//        监听任务
       // send_message_task_carOwner_
        Iptools.Tool._pushListen("send_message_task_carOwner_"+Iptools.DEFAULTS.currentViewValue, function (ms) {
            widget._getCustomerTasks();//获得车主的任务
        });
        Iptools.Tool._pushListen("task_detail_trace_listener"+Iptools.DEFAULTS.currentViewValue, function (ms) {//对任务做了操作后，动态和任务会刷新
            widget._getCustomerTasks();
            widget._initTracePanel();
            if(widget._UIDEFAULFS.filterTraceType){
                widget._getConActionList('#time_1',$('#time_1').attr('data-time'),widget._UIDEFAULFS.filterTraceType);
                widget._getConActionList('#time_2',$('#time_2').attr('data-time'),widget._UIDEFAULFS.filterTraceType);
                widget._getConActionList('#time_3',$('#time_3').attr('data-time'),widget._UIDEFAULFS.filterTraceType);
            }else{
                widget._getConActionList('#time_1',$('#time_1').attr('data-time'));
                widget._getConActionList('#time_2',$('#time_2').attr('data-time'));
                widget._getConActionList('#time_3',$('#time_3').attr('data-time'));
            };
        });
        Iptools.Tool._pushListen("customer_detail_trace_listener"+Iptools.DEFAULTS.currentViewValue, function (ms) {//延保和安吉星的新增的监听
            widget._initTracePanel();
            if(widget._UIDEFAULFS.filterTraceType){
                widget._getConActionList('#time_1',$('#time_1').attr('data-time'),widget._UIDEFAULFS.filterTraceType);
                widget._getConActionList('#time_2',$('#time_2').attr('data-time'),widget._UIDEFAULFS.filterTraceType);
                widget._getConActionList('#time_3',$('#time_3').attr('data-time'),widget._UIDEFAULFS.filterTraceType);
            }else{
                widget._getConActionList('#time_1',$('#time_1').attr('data-time'));
                widget._getConActionList('#time_2',$('#time_2').attr('data-time'));
                widget._getConActionList('#time_3',$('#time_3').attr('data-time'));
            };
        });
        widget._UIDEFAULFS.cusId = Iptools.DEFAULTS.currentViewValue;
        //获取车主信息
        widget._getCustomerInfo();
        //车主动态----没有新建和编辑所以对动态只是展示和接受监听后刷新动态
        widget._getActionApplet();
        widget._getCarLinkCon();//获得车辆和客户的link
        //车主的车辆列表
        widget._getCarList();
//        车主link的联系人----要先找到车主下的所有车辆，再找到该车辆下的所有联系人（contact---包括联系人和送修人）

//        widget._getLinkContactList();
        //获得车主的任务
        widget._getCustomerTasks();
        //获得审计追踪列表----需要先获得车主的allControl
        widget.getAllControls();

    },
    //对任何有对动态产生影响的都需要重新铺设面板
    _initTracePanel: function(){
        $('#time_1 .panel-body,#time_2 .panel-body,#time_3 .panel-body').html("");
        $('#time_1,#time_2,#time_3').collapse('show');
        widget._UIDEFAULFS.conAction_PAGE_NOW = 1;
    },
    _getCustomerInfo: function(){
        $('.waitDiv').loading();
        $('#baseInfo .detailInfo table').loading({'url':'../Content/Image/load-data-noBg.gif'});
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'customer_detail_leftPanel'"//数据集是车主的detail
        }).done(function(r) {
            if(r && r.applets[0]){
                var rootId = "";
                Iptools.uidataTool._getApplet({
                    applet:r.applets[0].applet
                }).done(function(data) {
                    if (data) {
                        rootId = data.rootLink;
                        component._panel("#baseInfo .detailInfo", {
                            applet: r.applets[0].applet,
                            valueId: widget._UIDEFAULFS.cusId,
                            afterLoad: function () {
                                var data = $("#baseInfo .detailInfo").data("panel").options.DataOriginalSets;
                                $('.waitDiv').remove();
                                $('#baseInfo .detailInfo table .load-data-container').remove();
                                $('.myInfoPanel').show();
                                if (data) {
                                    widget._UIDEFAULFS.cusRoot = rootId;
                                    var pic = data[rootId + ':headpic'] ? data[rootId + ':headpic'] : '../Content/Image/defaultHead.svg';
                                    if (pic == 'undefined' || pic == 'null') {
                                        pic = '../Content/Image/defaultHead.svg'
                                    }
                                    $(".pic img").attr("src", pic);
                                    var cusName = data[rootId + ':customer_name'] ? data[rootId + ':customer_name'] : "";
                                    $('.perInfo .name span').html(cusName);
                                    $('.associat-customer').val(cusName);
                                    var cusPhone = data[rootId + ':customer_phone'] ? data[rootId + ':customer_phone'] : "";
                                    $(".phone span:last-child").html(cusPhone);
                                    var cellPhone = data[rootId + ':customer_cellphone'] ? data[rootId + ':customer_cellphone'] : "";
                                    $(".cell_phone span:last-child").html(cellPhone);
                                    var cusType = data[rootId + ':customer_type'] ? data[rootId + ':customer_type'] : "";
                                    $('.perId span:last-child').html(cusType);
                                    var owner = data[rootId + ':owner'] ? data[rootId + ':owner'] : "";
                                    $('.personOwner span:last-child').html(owner);
                                    $('.sendPer').html(cusName+'-'+cusPhone);
                                    widget._UIDEFAULFS.cusName = cusName;
                                    widget._UIDEFAULFS.cusPhone = cusPhone;
                                };
                                widget._bindingEventAfterLoad();
                            },
                            autoRefresh: false,
                            allowEdit:false
                        });
                    }
                });
            };
        });
    },
    _getActionApplet: function(){//获取车主的动态list applet
        $('#carOwner').append('<div class="loading" style="text-align: center;padding-bottom:60px;"><img src="../Content/Image/load-data-noBg.gif" style="width:60px;height:60px;"></div>');
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Trace List'"
        }).done(function(data) {
            if (data) {
                widget._UIDEFAULFS.conActionId = data.applets[0].applet;//8064
                Iptools.uidataTool._getApplet({
                    applet:widget._UIDEFAULFS.conActionId//8064
                }).done(function(data) {
                    widget._UIDEFAULFS.conActionRoot = data.rootLink;
                    //接下来的优化 如果三个月都没有动态则只展示无动态的图片，如果有一个月有动态则不展示
                    Iptools.uidataTool._getUserlistAppletData({
                        appletId:widget._UIDEFAULFS.conActionId,//8064
                        pageSize:1,
                        condition:'{"'+widget._UIDEFAULFS.conActionRoot+':customer_id":"='+widget._UIDEFAULFS.cusId+'","'+widget._UIDEFAULFS.conActionRoot+':trace_time":"'+' BETWEEN \''+$('#time_3').attr('data-time')+'-01\''+' and \''+$('#time_1').attr('data-time')+'-31\'"}'
                    }).done(function(s){
                        $('#carOwner .loading').remove();
                        if(s.data){
                            if(s.data.rowCount > 0){
                                $('.demo-inner .panel-group').show();
                                //动态中是活动类型的跳转到活动详情页
                                widget._getCampaignDeApplet();
                                widget._getConActionList('#time_1',$('#time_1').attr('data-time'));
                                widget._getConActionList('#time_2',$('#time_2').attr('data-time'));
                                widget._getConActionList('#time_3',$('#time_3').attr('data-time'));
                            }
                        }else{
                            $('.demo .noTraceData').show();
                        }
                    });
                });
            }
        })
    },
    _getCampaignDeApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign Detail Applet'"
        }).done(function (data) {
            widget._UIDEFAULFS.CampaignDetailApplet =  data.applets[0].applet;//8034
        });
    },
    _getConActionList: function(parent,time,condition,isNext){
        $('.noTraceData').hide();
        $('.demo-inner .panel-group').show();
        $(parent+' .panel-body').append('<div class="loading" style="text-align: center;"><img src="../Content/Image/load-data-noBg.gif" style="width:60px;height:60px;"></div>');
        var rootId = widget._UIDEFAULFS.conActionRoot;
        var dataCondition = '{"'+rootId+':customer_id":"='+widget._UIDEFAULFS.cusId+'","'+rootId+':trace_time":"'+' BETWEEN \''+time+'-01\''+' and \''+time+'-31\'",';
        if(condition){
            dataCondition += '"'+rootId+':trace_category":" ='+condition+'"';//举例
        };
        dataCondition += '}';
//            console.log(dataCondition);
        Iptools.uidataTool._getUserlistAppletData({
            appletId:widget._UIDEFAULFS.conActionId,//8064
            pageNow:widget._UIDEFAULFS.conAction_PAGE_NOW,
            pageSize:widget._UIDEFAULFS.conAction_PAGE_SIZE,
            condition:dataCondition,
            orderByColumn:rootId+':trace_time',
            orderByAscDesc:'desc'
        }).done(function(s){
            $(parent+' .panel-body .loading').remove();
            //isNext 只有是加载下一页时才会  为true
//                console.log(s.data)
            if(isNext){}else{$(parent+' .panel-body').html("");$(parent).collapse('show');}
            if(s.data && s.data.records){
                var pageCount = s.data.pageCount;//得到页数
                $.each(s.data.records,function(key,obj){
                    var actionType = obj[rootId+':trace_type']['id'];

                    var actionString = obj[rootId+':trace_type']['name'];
                    var iconHtml = "";
                    $.each(widget._UIDEFAULFS.traceIcon,function(key,objIcon){
                        if(actionType == objIcon.type){
                            iconHtml = objIcon.icon;
                        }
                    });
                    var actionName = "";
                    if(obj[rootId+':title'] && obj[rootId+':title'] != 'undefined' && obj[rootId+':title'] != 'null'){
                        actionName = obj[rootId+':title'];
//                            if(obj[rootId+':title'].length > 16){actionName = obj[rootId+':title'].substring(0,16)+'...';}
                    };
                    var isClick = "";
                    if(actionType == 1 ){//参加活动
                        Iptools.uidataTool._getUserDetailAppletData({
                            appletId:widget._UIDEFAULFS.CampaignDetailApplet,
                            valueId:obj[rootId+':value_id'],
                            async:false
                        }).done(function(s){
                            var prefix = s.rootLink;
                            if(s.data[prefix+":title"] && s.data[prefix+":title"] != 'undefined' && s.data[prefix+":title"] != null){
                                actionName = s.data[prefix+":title"];
                                isClick = "isClick";
                            }else{
                                actionName = "";
                            }
                        });
                    };
                    var contactName = "";
                    if(obj[rootId+':customer_id'] && obj[rootId+':customer_id']['name']){
                        contactName = obj[rootId+':customer_id']['name'];
                    };
                    if(contactName == 'undefined' || contactName == 'null'){
                        contactName = "";
                    }
                    var owner = obj[rootId+':owner']?obj[rootId+':owner']['name']:"";
                    if(isClick != ""){
                        var doSome = '<div>内容详情 : <span class="person" style="cursor:pointer" data-name="'+actionName+'" data-id="'+obj[rootId+':value_id']+'" data-type="'+actionType+'">'+actionName+'</span></div>';
                    }else{
                        var doSome = '<div>内容详情 : <span data-name="'+actionName+'" data-id="'+obj[rootId+':value_id']+'" data-type="'+actionType+'">'+actionName+'</span></div>';
                    }
                    var mainHtml = '<div>'+
                        '<div>'+actionString+'</div>'+
                        '<div>互动对象 : '+contactName+' </div>'+
                        doSome+
                        '<div>记录人 : '+owner+'</div>'+
                        '</div>';

                    var html = '<div class="trace-demo row">'+
                        '<div class="col-md-1 col-sm-2">'+
                        '<div class="trace-icon">'+
                        '<span class="'+iconHtml+'"></span>'+
                        '</div>'+
                        '</div>'+
                        '<div class="trace-panel col-md-11 col-sm-10">'+
                        '<div class="trace-title col-md-12 clearfix">'+
                        '<div class="trace-title-left col-md-9 col-sm-9">'+
                        mainHtml+
                        '</div>'+
                        '<div class="trace-time col-md-3 col-sm-3">'+obj[rootId+':trace_time'].substr(5,14)+'</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                    $(parent+' .panel-body').append(html);
                });
                //判断当前页是不是最后一页，不是最后一页的话加一个  加载更多
                if(widget._UIDEFAULFS.conAction_PAGE_NOW < pageCount){
                    var getMore = '<div class="traceMore" data-parent="'+parent+'" data-time="'+time+'" data-page="'+(widget._UIDEFAULFS.conAction_PAGE_NOW+1)+'">加载更多</div>'
                    $(parent+' .panel-body').append(getMore);
                }
            }else{
                var noData = '<p class="theMonthNoTrace">本月没有动态</p>'
                $(parent+' .panel-body').append(noData);
            };
        });
    },
    getAllControls: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'customer_detail'"
        }).done(function(data) {
            widget._UIDEFAULFS.customerApplet = data.applets[0].applet;//2046
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet
            }).done(function(s) {
                widget._UIDEFAULFS.customerControl = s.controls;
                widget._getTrack();
            });
        });

    },
    _getTrack: function(){//获得车主的字段更改记录，则得以车主的详情的applet（新建和编辑所用的applet）作为condition
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'track_list'"
        }).done(function(data) {
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet
            }).done(function(s) {
                var root = s.rootLink;//bc_modify_log
                var condition = {};
                condition[root+':applet'] = "='"+widget._UIDEFAULFS.customerApplet+"'";//"bc_modify_log:applet"
                condition[root+':table_value_id'] = "='"+widget._UIDEFAULFS.cusId+"'";//"bc_modify_log:table_value_id"

                component._table("#track", {
                    applet: data.applets[0].applet,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    condition: condition,
                    emptyText: '暂无追踪',
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    showChecks: false,
                    jumpType: "template",
                    jumpTemplate: "<a class='trackDetail'><span class='fa fa-sign-in'></span></a>",
                    dataModify: function (r) {
                        var promise = $.Deferred();
                        if (r) {
                            r.columns.splice(2, 0, {
                                type: "text",
                                column: root + ":count",
                                name: "编号"
                            });
                            if (r.data && r.data.records && r.data.records.length) {
                                $.each(r.data.records,function(key,obj){
                                    if(obj[root + ":operation"] == 'update'){
                                        obj[root + ":operation"] = '变更';
                                    }else if(obj[root + ":operation"] == 'insert'){
                                        obj[root + ":operation"] = '新增';
                                    }else if(obj[root + ":operation"] == 'delete'){
                                        obj[root + ":operation"] = '删除';
                                    }
                                    if(key+1 < 10){
                                        obj[root + ":count"] = "<span>0"+(key+1)+"</span>";
                                    }else{
                                        obj[root + ":count"] = "<span>"+(key+1)+"</span>";
                                    }

                                });
                            }
                            promise.resolve(r);
                            return promise;
                        }
                    },
                    events:[
                        {
                            target: ".trackDetail",
                            type: "click",
                            event: function (e) {
                                e = e || event;
                                e.stopPropagation();
                                var promise = $.Deferred();
                                $('.trackTable table tbody').html("");
                                var me = $(this);
                                var index = me.parent().attr('data-index');
                                $('.trackTable').css({"display":"block","position":"absolute","right":"35px","top":me.offset().top+20});
                                var changeData = JSON.parse($("#track").data("stable").options.data.records[index][root+":after_modified_data"]);
                                var orignData = JSON.parse($("#track").data("stable").options.data.records[index][root+":before_modified_data"]);
//                                console.log(changeData);
//                                console.log(orignData);
                                $.each(changeData,function(name, value) {
                                    var orign = orignData[name] ? orignData[name] :"";
                                    //拿到字段名称的中文
                                    $.each(widget._UIDEFAULFS.customerControl,function(key,obj){
                                        var displayName = "";
                                        var fieldName = widget._UIDEFAULFS.cusRoot+':'+name;
                                        if(fieldName == obj.column){
                                            displayName = obj.name;
                                            if(obj.type == 'select'){
                                                $.each(obj.pickList,function(k,o){
                                                    if(orign){
                                                       if(orign == o.id){
                                                           orign = o.name;
                                                       }
                                                    };
                                                    if(value){
                                                        if(value == o.id){
                                                            value = o.name;
                                                        }
                                                    }
                                                });
                                            }else if(obj.type == 'pickApplet'){
                                                //从员工列表里获得员工的名字
                                                Iptools.GetJson({
                                                    url:"basic/getEmployee",
                                                    async:false,
                                                    data:{
                                                        token:Iptools.DEFAULTS.token,
                                                        id:value
                                                    }
                                                }).done(function(data){
                                                    value = data.name;
                                                    Iptools.GetJson({
                                                        url:"basic/getEmployee",
                                                        async:false,
                                                        data:{
                                                            token:Iptools.DEFAULTS.token,
                                                            id:orign
                                                        }
                                                    }).done(function(data){
                                                        orign = data.name;
                                                    }).fail(function(){
                                                        orign = "";
                                                    })
                                                }).fail(function(){
                                                    value = "";
                                                })
                                            };
                                            var tr = '<tr>'+
                                                '<td>'+displayName+'</td>'+//字段名称
                                                '<td>'+orign+'</td>'+//原值
                                                '<td>'+value+'</td>'+//现值
                                                '</tr>';
                                            $('.trackTable table tbody').append(tr);
                                        }
                                    })

                                });
                            }
                        }
                    ]
                });
            })
        });
    },
    _getCustomerTasks: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'customer_link_task'"
        }).done(function(data) {
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet
            }).done(function(s){
                var root = s.rootLink;//root-----task
                var condition = {};
                condition[root+':customer_id'] = "='"+widget._UIDEFAULFS.cusId+"'";//"task:customer_id"
                component._table("#customerTask", {
                    applet: data.applets[0].applet,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    condition: condition,
                    emptyText: '暂无任务',
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    showChecks: false,
                    jumpType: "template",
                    jumpTemplate: "<a class='doSome'><span class='fa-pencil-square-o'></span></a>",
                    dataModify: function (r) {
                        var promise = $.Deferred();
                        if (r) {
                            if (r.data && r.data.records && r.data.records.length) {
                                for (var i = 0; i < r.data.records.length; i++) {
                                    var rec = r.data.records[i];
                                    if (rec[r.rootLink + ":status"] && rec[r.rootLink + ":status"].id) {
                                        if (rec[r.rootLink + ":status"].id == "2") {
                                            rec[r.rootLink + ":title2"] = rec[root+":title"];
                                            rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='true' data-id='" + rec[r.rootLink + ":id"] + "'>" +
                                                "<input type='checkbox' class='changeStatus blueCheckbox'/></span>" +
                                                "<span class='taskNameTitle' data-id='" + rec[r.rootLink + ":id"] + "'>" + rec[root+":title"] + "</span>";
                                        } else {
                                            rec[r.rootLink + ":title2"] = rec[root+":title"];
                                            rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='false' data-id='" + rec[r.rootLink + ":id"] + "'>" +
                                                "<input type='checkbox' class='changeStatus blueCheckbox'/></span>" +
                                                "<span class='taskNameTitle' data-id='" + rec[r.rootLink + ":id"] + "'>" + rec[root+":title"] + "</span>";
                                        }
                                    } else {
                                        rec[r.rootLink + ":title2"] = rec[root+":title"];
                                        rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='false' data-id='" + rec[r.rootLink + ":id"] + "'>" +
                                            "<input type='checkbox' class='changeStatus blueCheckbox'/></span>" +
                                            "<span class='taskNameTitle' data-id='" + rec[r.rootLink + ":id"] + "'>" + rec[root+":title"] + "</span>";
                                    }
                                }
                            } else {
//                                taskWidget._UIDEFAULFS.taskListEmpty = "emp";
                            }
                        }
                        promise.resolve(r);
                        return promise;
                    },
                    afterLoad: function () {
                        var haveComplete = [];
                        $("#customerTask .s-table .s-column .s-cell .taskCheckStyle").each(function (key, obj) {
                            var taskStatus = $(obj).attr("data-task");
                            if (taskStatus == "true") {
                                var index = parseInt($(obj).parent().attr("data-index")) + 1;
                                $(obj).find("input").attr("checked", true);
                                haveComplete.push(index);
                            }
                        });
                        for (var i = 0; i < haveComplete.length; i++) {
                            $("#customerTask .s-table .s-column").each(function (key, obj) {
                                $(obj).find(".s-cell").eq(haveComplete[i]).css("color", "#c3c3c3");
                            });
                        }
                    },
                    events :[
                        {
                            target: ".doSome",
                            type: "click",
                            event: function () {
                                var me =$(this);
                                $('#addToTask').modal('show');
                                //铺设任务编辑的modal
                                var taskId = me.parent().data("key");
                                var index = me.parent().attr('data-index');
                                var data = $("#customerTask").data("stable").options.data.records[index];
                                var title = data[root+":title2"];
                                var des = data[root+":description"];
                                var due_time = data[root+":due_time"];
                                var type = ""
                                if(data[root+":type"]){
                                    type = data[root+":type"]['id'];
                                };
                                var ownerName = "";
                                var ownerId = "";
                                if(data[root+":owner"]){
                                    ownerName = data[root+":owner"]['name'];
                                    ownerId = data[root+":owner"]['id'];
                                };
                                $('#profile .modal-footer .saveTask').data('type', 'edit');
                                $('#profile .modal-footer .saveTask').data('task', taskId);

                                $('.profile-name input').val(title);
                                $('.profile-des textarea').val(des);
                                $('#endDay').val(due_time);
//                                $('.profile-type option[value="'+type+'"]').prop("selected","selected");
                                $('.profile-type').val(type)
                                $('#owner').val(ownerName);
                                $('#owner').attr('data-id',ownerId);
                                $('#formTask').bootstrapValidator('resetForm');
                            }
                        },
                        {
                            target: ".s-header-bar .s-manage .new-task",
                            type: "click",
                            event: function () {
                                $('#addToTask').modal('show');
                                $('#profile .modal-footer .saveTask').data('type','new');
                                $('#addToTask form .profile-name input,#addToTask form textarea,#endDay').val("");
                                $('#addToTask form .profile-type').val("");
                                $('#owner').val(window.sessionStorage.getItem('userTitle'));
                                $('#owner').attr('data-id',Iptools.DEFAULTS.userId);
                                $('#formTask').bootstrapValidator('resetForm');
                            }
                        },
                        {
                            target: ".changeStatus",
                            type: "click",
                            event: function () {
                                var status = "";
                                var me=$(this);
                                var param={};
                                var index = me.parent().parent().attr("data-index");
                                var taskId = me.parent().data("id");
                                if($(this).is(":checked") == true){
                                    status = "已完成";
                                    $(this).parent().attr("data-task","true");
                                    param[common._UIDEFAULFS.taskDetailRoot + ":status"] = "2";
                                }else{
                                    status = "重新打开";
                                    $(this).parent().attr("data-task","false");
                                    param[common._UIDEFAULFS.taskDetailRoot+":status"] = "1";
                                };
                                Iptools.uidataTool._saveAppletData({
                                    appletId: common._UIDEFAULFS.taskDetail,
                                    valueId: taskId,
                                    data:  JSON.stringify(param)
                                }).done(function (r) {
                                    if(r && r.retcode == "ok"){
                                        $("#customerTask .s-column").each(function (key, obj) {
                                            $(obj).find(".s-cell").eq(parseInt(index) + 1).css("color", "#c3c3c3");
                                        });
                                        Iptools.uidataTool._pushMessage({channel: "send_message_task_list"});//任务列表发送消息
                                        Iptools.Tool.pAlert({
                                            type: "info",
                                            title: "系统提示：",
                                            content: me.parent().next().html() + " " + " " + status,
                                            delay: 2500
                                        });
                                        $("#customerTask").data("stable")._refresh();
                                    }
                                });
                            }
                        }
                    ]
                });
            });
        })
    },
    _getCarLinkCon: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'customerView_contactLinkCar'"
        }).done(function(s) {
            widget._UIDEFAULFS.carLinkContactApplet = s.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:s.applets[0].applet
            }).done(function(o) {
                widget._UIDEFAULFS.carLinkContactRoot = o.rootLink;
                Iptools.uidataTool._getCustomizeApplet({
                    nameList:"'contact'"
                }).done(function(d) {
                    widget._UIDEFAULFS.contactApplet = d.applets[0].applet;
                    Iptools.uidataTool._getApplet({
                        applet:d.applets[0].applet
                    }).done(function(r) {
                        widget._UIDEFAULFS.contactRoot = r.rootLink;
                    });
                })
            });
        })
    },
    _getCarList: function(){//车主关联车辆
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'customer_link_car'"
        }).done(function(data) {
                Iptools.uidataTool._getApplet({
                    applet:data.applets[0].applet
                }).done(function(allData) {
                    var root = allData.rootLink;//root------car
                    var condition = {};
                    condition[root+':customer_id'] = "='"+widget._UIDEFAULFS.cusId+"'";//car:customer_id
                    component._table("#carInfo", {
                        applet: data.applets[0].applet,
                        emptyImage: "../Content/Image/nodetail.png",
                        emptySize: "150",
                        condition:condition,
                        emptyText: '暂无车辆信息',
                        emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                        showChecks:false,
                        jumpType: "template",
                        jumpTemplate: "<a class='gotoCarDetail'><span class='fa fa-sign-in'></span></a>",//跳转至车辆详情页
                        afterLoad: function () {
                            //获得车主下的所有车辆后，从---车辆联系人表中---得到所有车辆对应的客户id，铺设车主下联系人列表
                            Iptools.uidataTool._getAppletColumnValueList({//这一步是拿到所有数据的car_ID
                                applet:data.applets[0].applet,
                                column:root+':id'
                            }).done(function(s){
                                if(s){
                                    var search = {};
                                    if(s.ids&& s.ids.length){
                                        search[widget._UIDEFAULFS.carLinkContactRoot+':car_id'] = " in("+s.ids.join()+")";//"contact_car_link:car_id":
                                    }else{
                                        search[widget._UIDEFAULFS.carLinkContactRoot+':car_id'] = " =-1";
                                    }
                                    component._table("#linkContact", {
                                        applet: widget._UIDEFAULFS.carLinkContactApplet,
                                        emptyImage: "../Content/Image/nodetail.png",
                                        emptySize: "150",
                                        condition: search,
                                        emptyText: '暂无联系人信息',
                                        emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                                        showChecks: false,
                                        jumpType: "template",
                                        jumpTemplate: "<a class='gotoContactDetail'><span class='fa fa-sign-in'></span></a>",//跳转至客户详情页
                                        dataModify:function(r){
                                            var promise = $.Deferred();
                                            r.columns.splice(4, 0, {
                                                type: "text",
                                                column: root + ":is_valid_text",
                                                name: "状态"
                                            });
                                            //数据拿到后，找到客户类型的车主的，拿到核心看板的数据
                                            if (r.data && r.data.records && r.data.records.length) {
                                                $.each(r.data.records,function(key,obj) {
                                                    if (obj[widget._UIDEFAULFS.contactRoot + ":is_valid"]) {
                                                        obj[root + ":is_valid_text"] = '有效';
//                                                        obj.name = obj[widget._UIDEFAULFS.contactRoot + ":title"];
//                                                        obj.phone = obj[widget._UIDEFAULFS.contactRoot + ":phone"];
//                                                        obj.type = obj[widget._UIDEFAULFS.contactRoot + ":contacttype"]['name'];
//                                                        widget._UIDEFAULFS.contactInfo.push(obj);
                                                    } else {
                                                        obj[root + ":is_valid_text"] = '无效';
                                                    }
                                                    if (obj[widget._UIDEFAULFS.contactRoot + ':contact_type']) {
                                                        if (obj[widget._UIDEFAULFS.contactRoot + ':contact_type']['id'] == 4) {//类型为车主
    //                                                        console.log(obj[widget._UIDEFAULFS.carLinkContactRoot+":contact_id"]['id'])
                                                            Iptools.uidataTool._getUserDetailAppletData({
                                                                appletId: widget._UIDEFAULFS.contactApplet,
                                                                valueId: obj[widget._UIDEFAULFS.carLinkContactRoot + ":contact_id"]['id']
                                                            }).done(function (de) {
                                                                var root = de.rootLink;
                                                                if (de.data[root + ':last_outreach_date']) {//上次跟进时间
                                                                    $('.lastTouch').html(de.data[root + ':last_outreach_date']);//获取上次/末次保养/维护时间
                                                                } else {
                                                                    $('.lastTouch').html('---');
                                                                }
                                                                ;
                                                                if (de.data[root + ':total_amount_sum'] || de.data[root + ':total_amount_sum'] == 0) {//总消费金额
                                                                    $('.totalMoney').html(de.data[root + ':total_amount_sum']);
                                                                } else {
                                                                    $('.totalMoney').html('---');
                                                                }
                                                                ;
                                                                if (de.data[root + ':total_consume_counter'] || de.data[root + ':total_consume_counter'] == 0) {//总消费次数
                                                                    $('.totalCount').html(de.data[root + ':total_consume_counter']);
                                                                } else {
                                                                    $('.totalCount').html('---');
                                                                }
                                                                ;
                                                                if (de.data[root + ':30days_touch_counter'] || de.data[root + ':30days_touch_counter'] == 0) {//近30天跟进次数
                                                                    $('.monthFollowTime').html(de.data[root + ':30days_touch_counter']);
                                                                } else {
                                                                    $('.monthFollowTime').html('---');
                                                                }
                                                                ;

                                                                if (de.data[root + ':1year_amount_sum'] || de.data[root + ':1year_amount_sum'] == 0) {//当期消费金额
                                                                    $('.consumeCount').html(de.data[root + ':1year_amount_sum']);
                                                                } else {
                                                                    $('.consumeCount').html('---');
                                                                }
                                                                ;
                                                                if (de.data[root + ':1year_consume_counter'] || de.data[root + ':1year_consume_counter'] == 0) {//当期消费次数
                                                                    $('.consumeTime').html(de.data[root + ':1year_consume_counter']);
                                                                } else {
                                                                    $('.consumeTime').html('---');
                                                                }
                                                                ;
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                            promise.resolve(r);
                                            return promise;
                                        },
                                        events:[
                                            {
                                                target: ".gotoContactDetail",
                                                type: "click",
                                                event: function () {
                                                    var me = $(this);
                                                    var value_id = "";
                                                    var index = me.parent().attr('data-index');
                                                    var name= "";
                                                    if($("#linkContact").data("stable").options.data.records[index][widget._UIDEFAULFS.contactRoot+":title"]){
                                                        name += $("#linkContact").data("stable").options.data.records[index][widget._UIDEFAULFS.contactRoot+":title"];
                                                    };
                                                    if($("#linkContact").data("stable").options.data.records[index][widget._UIDEFAULFS.carLinkContactRoot+":contact_id"]){
                                                        value_id = $("#linkContact").data("stable").options.data.records[index][widget._UIDEFAULFS.carLinkContactRoot+":contact_id"]['id'];
                                                    };
                                                    Iptools.uidataTool._getCustomizeView({
                                                        nameList: "'contact_detailView'"
                                                    }).done(function(data){
                                                        if (data.views.length) {
                                                            Iptools.uidataTool._getView({
                                                                view: data.views[0].view
                                                            }).done(function(r){
                                                                Iptools.Tool._jumpView({
                                                                    view: data.views[0].view,
                                                                    name: r.view.name+'->'+name,
                                                                    valueId:value_id,
                                                                    type: r.view.type,
                                                                    url: r.view.url,
                                                                    bread: true
                                                                });
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        ]
                                    });
                                }
                            });
                        },
                        events:[
                            {
                                target: ".gotoCarDetail",
                                type: "click",
                                event: function () {
                                    var me = $(this);
                                    var value_id = me.parent().data("key");
                                    var index = me.parent().attr('data-index');
                                    var name= "";
                                    if($("#carInfo").data("stable").options.data.records[index][root+":plate_number"]){
                                        name += $("#carInfo").data("stable").options.data.records[index][root+":plate_number"];
                                    };
                                    Iptools.uidataTool._getCustomizeView({
                                        nameList: "'car_detail_view'"
                                    }).done(function(data){
                                        if (data.views.length) {
                                            Iptools.uidataTool._getView({
                                                view: data.views[0].view
                                            }).done(function(r){
                                                Iptools.Tool._jumpView({
                                                    view: data.views[0].view,
                                                name: r.view.name+'->'+name,
                                                    valueId:value_id,
                                                    type: r.view.type,
                                                    url: r.view.url,
                                                    bread: true
                                                });
                                            })
                                        }
                                    })
                                }
                            }
                        ]
                    });
                });

        });
    },

    //-------------------------------------事件-------------------------------------------
    _clickJumpView: function(){
        widget._addEventListener({
            container: "body",
            target: ".person",
            type: "click",
            event: function () {
                var me = $(this);
                var type = $(this).attr('data-type');
                var value_id = $(this).attr('data-id');
                var data = '';
                if(type == '6'){//跳到客户群详情页
                    Iptools.uidataTool._getCustomizeView({
                        nameList: "'contactGroupPortrait'"
                    }).done(function(data){
                        if (data.views.length) {
                            Iptools.uidataTool._getView({
                                view: data.views[0].view
                            }).done(function(r){
                                Iptools.Tool._jumpView({
                                    view: data.views[0].view,
                                    name: r.view.name+'->'+me.attr('data-name'),
                                    valueId:value_id,
                                    type: r.view.type,
                                    url: r.view.url,
                                    bread: true
                                });
                            })
                        }
                    })

                }else if(type == '1'){//跳到活动页
                    Iptools.uidataTool._getCustomizeView({
                        nameList: "'campaign_detail'"
                    }).done(function(data){
                        if (data.views.length) {
                            Iptools.uidataTool._getView({
                                view: data.views[0].view
                            }).done(function(r){
                                Iptools.Tool._jumpView({
                                    view: data.views[0].view,
                                    name: r.view.name+'->'+me.attr('data-name'),
                                    valueId:value_id,
                                    type: r.view.type,
                                    url: r.view.url,
                                    bread: true
                                });
                            })
                        }
                    })

                }
            }
        });
    },

    _clickGetMoreTrace: function () {//点击加载更多动态时，要确定，哪个月份加，加第几页,加给哪个dom
        widget._addEventListener({
            container: "body",
            target: ".traceMore",
            type: "click",
            event: function (e) {
                widget._UIDEFAULFS.conAction_PAGE_NOW = $(this).data('page');
                var parent = $(this).attr('data-parent');
                var time = $(this).attr('data-time');
                var next = true;
                //只有当点击加载更多的时候，之前铺设的数据不会清空，而是append到后面，否则执行_getConActionList时全是清空重新填充
                if(widget._UIDEFAULFS.filterTraceType){
                    widget._getConActionList(parent,time,widget._UIDEFAULFS.filterTraceType,next);
                }else{
                    widget._getConActionList(parent,time,"",next);
                }
                $(this).remove();
            }
        })
    },
    _clickFilterTrace: function(){
        widget._addEventListener({
            container: "body",
            target: ".filterTraceType>button",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                if($('.allTraceType').is(':hidden')){
                    $('.allTraceType').show();
                    me.attr('id','low');
                }else{
                    $('.allTraceType').hide();
                    me.attr('id','');
                };
            }
        });
    },
    _clickToFilterTrace: function(){//筛选动态
        widget._addEventListener({
            container: "body",
            target: ".sureFilterBtn .commonBtn",
            type: "click",
            event: function (e) {
                var conditionStr = $('.allTraceType select option:selected').val();
                widget._UIDEFAULFS.filterTraceType = conditionStr;
                widget._initTracePanel();
                widget._getConActionList('#time_1',$('#time_1').attr('data-time'),conditionStr);
                widget._getConActionList('#time_2',$('#time_2').attr('data-time'),conditionStr);
                widget._getConActionList('#time_3',$('#time_3').attr('data-time'),conditionStr);
            }
        });
    },
    _clickToCancelFilterTrace: function(){//清空筛选的动态
        widget._addEventListener({
            container: "body",
            target: ".sureFilterBtn .cancel",
            type: "click",
            event: function (e) {
                widget._UIDEFAULFS.filterTraceType = "";
                $('.allTraceType select option:first-child').prop("selected","selected");
                widget._initTracePanel();
                widget._getConActionList('#time_1',$('#time_1').attr('data-time'));
                widget._getConActionList('#time_2',$('#time_2').attr('data-time'));
                widget._getConActionList('#time_3',$('#time_3').attr('data-time'));
                $('.allTraceType').hide();
                $('.filterTraceType>button').attr('id','')
            }
        });
    },
    _clickDocument: function(){
        widget._addEventListener({
            container: "body",
            target: ".left,.right",
            type: "click",
            event: function (e) {
                $('.allTraceType').hide();
                $('.filterTraceType>button').attr('id','')
                $('.trackTable').hide();
                $('.sendMessSel').hide();
            }
        })
    },
    _clickaddTagPanel: function(){
        widget._addEventListener({
            container: "body",
            target: ".allTraceType,.selDiv",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
            }
        })
    }


}