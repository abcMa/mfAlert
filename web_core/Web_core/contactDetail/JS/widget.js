var widget = {};
widget = {
    _UIDEFAULFS: {
        conId : "",
        contactApplet :"",
        allTag : [], //所有的系统标签
        haveSelTag : [],//已经选了的标签
        canSelTag:[],//可以选择的标签
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
        taskDetailApplet:"",
        filterTraceType:"",
        traceIcon:[
            {"type":1,"icon":"fa-gift"},//活动
            {"type":2,"icon":"fa-tag"},//添加标签
            {"type":3,"icon":"fa-money"},//消费
            {"type":4,"icon":"fa-user"},//创建客户
            {"type":5,"icon":"fa-pencil-square-o"},//编辑
            {"type":6,"icon":"fa-users"},//添到客户群
            {"type":7,"icon":"fa-chain-broken"},//移出客户群
            {"type":8,"icon":"fa-trash"},//移除标签
            {"type":9,"icon":"fa-tasks"},//创建任务
            {"type":22,"icon":"fa-reply-all"},//重新打开任务
            {"type":10,"icon":"fa-sticky-note"},//笔记
            {"type":11,"icon":"fa-comments"},//信息
            {"type":14,"icon":"fa-check-circle-o"},//完成任务
            {"type":16,"icon":"fa-weixin"},//微信群发
            {"type":17,"icon":"fa-refresh"},//回访
            {"type":18,"icon":"fa-bullhorn"},//外呼
            {"type":19,"icon":"fa-phone"},//来电
            {"type":20,'icon':"fa-cogs"},
            {"type":21,"icon":"fa-globe"}//到店
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
        widget._clickJoinGroup();
        widget._addTag();//打标签
        widget._gotoEdit();
        widget._clickTaskMore();//点击创建任务
        widget._clickTaskDetail();//查看任务详情
        widget._haveCompleteTask();//勾选完成任务
        widget._clickGetMoreTrace();//加载更多动态
        widget._clickFilterTrace();//筛选动态根据动态类型
        widget._clickToFilterTrace();//点击确定筛选动态
        widget._clickToCancelFilterTrace();//点击取消筛选动态
        widget._clickPostNewTag();//点击新建标签的动态展示
        widget._postNewTag();//新建一个标签到标签库
        widget._cancelPostTag();//取消新建标签
        widget._inputNewTag();//监听新建标签的输入框
        widget._clickDelTag();//删除标签
        widget._clickInGroup();//点击客户所在客户群跳转到该客户群的画像页
        widget._clickDocument();
        widget._clickaddTagPanel();//点击添加标签的面板阻止事件冒泡
    },
    _bindingEventAfterLoad: function () {//插件的初始化
        var tour = new Tour({
            backdrop:true,
            storage: false,
            container: "body",
            template:"<div class='popover tour' style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
                +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
                +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
                +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
            steps: [
                {
                    element: ".left_top",
                    title: "客户基本信息",
                    placement: "bottom",
                    content: "展示客户的电话、生日等基本信息，可随时编辑更新",
                    onShown: function () {
                        $(".tour-step-background").css("width","64px").css("height","33px").css("border-radius","0px");
                    }
                },
                {
                    element: ".right-top",
                    title: "核心看板",
                    placement: "bottom",
                    content: "展示客户关键信息，也可进行“打标签”、“记录互动”、“发短信”等 ",
                    onShown: function () {
                        $(".tour-step-background").css("width","82%").css("height","277px").css("border-radius","0px");
                    }
                },
                {
                    element: ".demo-inner .panel-group .panel:first-child",
                    title: "客户动态",
                    placement: "top",
                    content: "详细记录了和客户的每一次互动情况，时刻了解客户最新状态",
                    onShown: function () {
                        $(".tour-step-background").css("width",'100%').css("height",'').css("border-radius","0px");
                    }
                },
                {
                    element: ".left_middle .panel-group .panel:nth-child(4)",
                    title: "客户任务",
                    placement: "top",
                    content: "快速为当前客户创建任务，跟进相关事宜",
                    onShown: function () {
                        $(".tour-step-background").css("width","300px").css("height","55px").css("border-radius","0px");
                    }
                }
            ],
            onEnd:function(){
                $(".left_top,.right-top,.demo-inner .panel-group .panel:first-child,.left_middle .panel-group .panel:nth-child(4)").removeClass("disabled");
                $('html,body').animate({scrollTop: '0px'}, 100);
            }
        });
        if(window.localStorage.getItem("contactDetail_tour")!="yes"){
            tour.init();
            window.localStorage.setItem("contactDetail_tour","yes");
            $(".left_top,.right-top,.demo-inner .panel-group .panel:first-child,.left_middle .panel-group .panel:nth-child(4)").addClass("disabled");
            tour.start(true);
            tour.goTo(0);
        }
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._UIDEFAULFS.conId = Iptools.DEFAULTS.currentViewValue;
        Iptools.Tool._pushListen("contact_edit_"+Iptools.DEFAULTS.currentViewValue, function (ms) {
            widget._getContactInfo();
            widget._haveInGroup();
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
        Iptools.Tool._pushListen("contact_edit_tag"+Iptools.DEFAULTS.currentViewValue, function (ms) {
            if($('#eventTags').find('li').size() > 0){
                $('#eventTags').tagit("destroy");
            };
            widget._getConTags();
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
        Iptools.Tool._pushListen("send_message_task_list_"+Iptools.DEFAULTS.currentViewValue, function (ms) {
//                console.log('客户有任务了')
//            widget._getContactTasks();
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
        //获取客户信息
        widget._getContactInfo();
//        //获取所有的标签
//        widget._getAllTags();
//        //获得该客户已经打上的标签
        widget._getConTags();
//        获得该客户下的任务
        widget._getContactTask();
        //客户动态
        widget._getActionApplet();
        //客户群列表
        widget._getGroupApplet();
        //已在的客户群
        widget._groupLinkApplet();

    },
    //对任何有对动态产生影响的都需要重新铺设面板
    _initTracePanel: function(){
        $('#time_1 .panel-body,#time_2 .panel-body,#time_3 .panel-body').html("");
        $('#time_1,#time_2,#time_3').collapse('show');
        widget._UIDEFAULFS.conAction_PAGE_NOW = 1;
    },
    _getContactInfo: function(){
        $('.saveBtn').css('pointer-events','none');
        $('.waitDiv').loading();
        $('#baseInfo .detailInfo table,#carInfo .detailInfo table,#insuranceInfo .detailInfo table').loading({'url':'../Content/Image/load-data-noBg.gif'});
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact'"
        }).done(function(r) {
            if(r && r.applets[0]){
                widget._UIDEFAULFS.contactApplet = r.applets[0].applet;//2046
                Iptools.uidataTool._getUserDetailAppletData({
                    appletId:widget._UIDEFAULFS.contactApplet,
                    valueId:widget._UIDEFAULFS.conId
                }).done(function(s){
                    $('.waitDiv').remove();
                    $('#baseInfo .detailInfo table .load-data-container,#carInfo .detailInfo table .load-data-container,#insuranceInfo .detailInfo table .load-data-container').remove();
                    $('.myInfoPanel').show();
                    var rootId = s.rootLink;//拿到rootlinkid
                    $('#baseInfo .detailInfo table').html("");

                    var name = s.data[rootId+':title']?s.data[rootId+':title']:'';
                    widget._UIDEFAULFS.conName = name;
                    $('.associat-contact').val(name);
                    $('.name>span').html(name);
                    $('.saveBtn').attr('data-name',name);
                    if(name.length > 8){
                        $('.name>span').css('font-size',"20px")
                    };
                    var html = "";
                    var phone = s.data[rootId+':phone']?s.data[rootId+':phone']:'';
                    widget._UIDEFAULFS.phone = phone;
                    $(".phone span:last-child").html(phone);
                    $('.sendPer').html(name+'-'+phone);
                    var birthday = s.data[rootId+':birthday']?s.data[rootId+':birthday'] :"";
                    html += '<tr>'+'<td>生日</td>'+'<td>'+birthday+'</td>'+'</tr>';
                    var gender = s.data[rootId+':gender']?s.data[rootId+':gender']['name'] :"";
                    html += '<tr>'+'<td>性别</td>'+'<td>'+gender+'</td>'+'</tr>';
                    var address = s.data[rootId+':address']?s.data[rootId+':address'] :"";
                    html += '<tr>'+'<td>地址</td>'+'<td>'+address+'</td>'+'</tr>';
                    var assigned_to_insurance = s.data[rootId+':assigned_to_insurance']?s.data[rootId+':assigned_to_insurance'].name :"";
                    var assigned_to_agent = s.data[rootId+':assigned_to_agent']?s.data[rootId+':assigned_to_agent'].name :"";
                    html += '<tr>'+'<td>客服专员</td>'+'<td>'+assigned_to_agent+'</td>'+'</tr>';

                    $('#baseInfo .detailInfo table').append(html);

                    var pic = s.data[rootId+':headpic']?s.data[rootId+':headpic']:'../Content/Image/defaultHead.svg';
                    if(pic == 'undefined' || pic == 'null' ){
                        pic = '../Content/Image/defaultHead.svg'
                    }
                    $(".pic img").attr("src",pic);


                    var owner = s.data[rootId+':owner']?s.data[rootId+':owner']['name'] :"未指派客户经理";
                    $('.personOwner span:last-child').html(owner);
                    var identity =  s.data[rootId+':identity']?s.data[rootId+':identity'].substr(0,12)+'******' :"";
                    $('.perId span:last-child').html(identity);
                    $('.saveBtn').css('pointer-events','auto');
                    widget._getInteractInfo();
                    widget._bindingEventAfterLoad();
                });
            };
        });
    },
    _getInteractInfo : function(){
        Iptools.uidataTool._getUserDetailAppletData({
            appletId:widget._UIDEFAULFS.contactApplet,
            valueId:widget._UIDEFAULFS.conId
        }).done(function(s) {
//            console.log('最新的活跃度和时间更新')
            var rootId = s.rootLink
            if(s.data[rootId+':interact_score']){//获取活跃度
                $('.activePer').html(s.data[rootId+':interact_score']);
            }else{
                $('.activePer').html(0);
            }
            if(s.data[rootId+':outreach_times_a_month']){//近30天的维护次数
                $('.monthMaintainCount').html(s.data[rootId+':outreach_times_a_month']+'次');
            }else{
                $('.monthMaintainCount').html('0次')
            };
            if(s.data[rootId+':consumption_times_a_year']){//近一年消费次数
                $('.yearGoStore').html(s.data[rootId+':consumption_times_a_year']+'次');
            }else{
                $('.yearGoStore').html('0次')
            };
            if(s.data[rootId+':consumption_amount_a_year']){//近一年消费总额
                $('.yearAllConsume').html(s.data[rootId+':consumption_amount_a_year']+'元');
            }else{
                $('.yearAllConsume').html('0元')
            };
            if(s.data[rootId+':last_interact_date']){//上次活跃日期
                $('.startDate').html(s.data[rootId+':last_interact_date']);//获取上次/末次活跃时间
            }else{
                $('.startDate').html('---');
            };
            if(s.data[rootId+':last_outreach_date']){//上次维护日期
                $('.lastTouch').html(s.data[rootId+':last_outreach_date']);//获取上次/末次保养/维护时间
            }else{
                $('.lastTouch').html('---');
            };
            if(s.data[rootId+':last_visit_date']){//上次到店时间
                $('.lastVisit').html(s.data[rootId+':last_visit_date']);
            }else{
                $('.lastVisit').html('---');
            };
            if(s.data[rootId+':total_consumption']){//消费总额
                $('.consumeAll').html(s.data[rootId+':total_consumption']+'元');
            }else{
                $('.consumeAll').html('0元');
            };
        })
    },
    _getAllTags: function(){//获得客户可选的标签
        $(".allTag").html("");
        widget._UIDEFAULFS.canSelTag = [];
        Iptools.GetJson({
            url: "basic/tags",
            data: {
                token: Iptools.DEFAULTS.token
            }
        }).done(function(data){
            for(var t = 0;t<data.length;t++){
//                widget._UIDEFAULFS.allTag.push(data[t].tagValue);
                var flag = $.inArray(data[t].tagValue, widget._UIDEFAULFS.haveSelTag);
                if(flag == -1){//不在里面说明客户还可以选这个标签
                    var html = '<span id="'+data[t].id+'">'+data[t].tagValue+'</span>';
                    $(".allTag").append(html);
                    widget._UIDEFAULFS.canSelTag.push(data[t].tagValue);
                }
            };
//            console.log(widget._UIDEFAULFS.canSelTag)
            $(".allTag").niceScroll({
                cursorborder:"",
                cursorcolor:"#c1d6f0",
                horizrailenabled:false
            })
        });
    },
    _getConTags: function(){
        Iptools.GetJson({
            url:"basic/contactTagLinks",
            data:{
                token:Iptools.DEFAULTS.token,
                contactId:Iptools.DEFAULTS.currentViewValue
            }
        }).done(function(data){
            var selTag = [];
            if(data.length == 0){
                $('#eventTags').show();
                $('.addTagPanel').css({'top':'182px','left':'0'});
                var noData = '<div style="text-align:center;margin-top:30px;cursor: pointer;" class="notagTips">'+
                    '<img src="../contactDetail/Image/notagNew.png" style="width:80px;">'+
                    '<p class="plusTag" >&nbsp;&nbsp;&nbsp;&nbsp; + 添加标签</p>'
                '</div>';
                $('#eventTags').append(noData);
            }else{
                $('#eventTags p').remove();
                if(data.length < 20){
                    $('.addTags').hide();
                    $('#tagsMoreInner').hide();
                    $('#eventTags').show();
                    $('#eventTags').html("");
                    for(var t = 0;t<data.length;t++){
                        var html = "<li id='"+data[t]['id']+"'>"+data[t].tagValue+"</li>";
                        $("#eventTags").append(html);
                        selTag.push(data[t].tagValue);
                        widget._UIDEFAULFS.haveSelTag = selTag;
                    };
                    $("#eventTags").append('<button type="button" class="lessTagAdd btn">+</button>');
                    $("#eventTags").niceScroll({
                        cursorborder:"",
                        cursorcolor:"#c1d6f0",
                        horizrailenabled:false
                    })
                    widget._initTagIt();
                }else{
                    $('.addTags').show();
                    $('#eventTags').hide();
                    $('#tagsMoreInner').show();
                    $('#tagsMoreInner a').remove();
                    $('.addTagPanel').css({'top':'60px','right':'15px'});
                    for(var t = 0;t<data.length;t++){
                        var a = '<a href="#">'+
                            '<span>'+data[t].tagValue+'</span>'+
                            '<button class="delTag" data-id="'+data[t].id+'">×</button>'
                        '</a>';
                        widget._UIDEFAULFS.haveSelTag.push(data[t].tagValue);
                        $('#tagsMoreInner').append(a);
                    };
                    loadCloud();
                };
            };
            widget._getAllTags();
        });
    },

    _getActionApplet: function(){
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
                        condition:'{"'+widget._UIDEFAULFS.conActionRoot+':contact_id":"='+widget._UIDEFAULFS.conId+'","'+widget._UIDEFAULFS.conActionRoot+':trace_time":"'+' BETWEEN \''+$('#time_3').attr('data-time')+'-01\''+' and \''+$('#time_1').attr('data-time')+'-31\'"}'
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
        var timeDate  = time.split("-");
        var endTime = timeDate[0]+"-"+Number(Number(timeDate[1])+1)+"-"+"01";
        if(timeDate[2] == 12){
            endTime = Number(Number(timeDate[0])+1)+"-"+Number(Number(timeDate[1])+1)+"-"+"01";
        }
        var dataCondition = '{"'+rootId+':contact_id":"='+widget._UIDEFAULFS.conId+'","'+rootId+':trace_time":"'+' BETWEEN \''+time+'-01\''+' and \''+endTime+'-01\'",';
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
                    if(actionType == 6){
                        Iptools.GetJson({
                            url: "basic/contactgroups/"+obj[rootId+':value_id']+'?token='+Iptools.DEFAULTS.token,
                            ajaxCounting:false,
                            async:false
                        }).done(function(data){
                            if(data.contactGroup){
                                if(data.contactGroup.title && data.contactGroup.title != 'undefined'){
                                    actionName = data.contactGroup.title;
                                    isClick = "isClick";
                                }else{
                                    actionName = "";
                                };
                            }else{
                                actionName = "";
                            }

                        })
                    }
                    if(actionType == 1 ){
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
                    if(obj[rootId+':contact_id'] && obj[rootId+':contact_id']['name']){
                        contactName = obj[rootId+':contact_id']['name'];
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
                        '<span class="fa '+iconHtml+'"></span>'+
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
//                    $(".demo-inner").niceScroll({
//                        cursorborder:"",
//                        cursorcolor:"#c1d6f0",
//                        horizrailenabled:false
//                    })
            }else{
                var noData = '<p class="theMonthNoTrace">本月没有动态</p>'
                $(parent+' .panel-body').append(noData);
            };
        });
    },
    _getGroupApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:'\"searching_groupList\"'
        }).done(function(data){
            if(data){
                widget._UIDEFAULFS.GroupListAppletId = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:widget._UIDEFAULFS.GroupListAppletId
                }).done(function(data){
                    widget._UIDEFAULFS.groupRootLink = data.rootLink;
                });
            }
        });
    },
    _getContactTask : function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'contact_link_task'"
        }).done(function(data) {
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet
            }).done(function(s){
                var root = s.rootLink;//root-----task
                var condition = {};
                condition[root+':contact_id'] = "='"+widget._UIDEFAULFS.conId+"'";//"task:contact_id"
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
    _getGroupList: function(){//将客户加入至客户群
        component._table("#addContactToGroup", {
            applet:widget._UIDEFAULFS.GroupListAppletId,
            emptyImage: "../Content/Image/nodetail.png",
            emptySize: "150",
            emptyText: "暂无数据！快去创建客户群吧！",
            emptyClick: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_group_list'"
                }).done(function(data){
                    if (data && data.views.length) {
                        Iptools.uidataTool._getView({
                            async: false,
                            view: data.views[0].view
                        }).done(function(r){
                            if(r){
                                Iptools.Tool._jumpView({
                                    view: data.views[0].view,
                                    name: r.view.name,
                                    type: r.view.type,
                                    url: r.view.url,
                                    bread: true
                                })
                            };
                        })
                    }
                })
            },
            showChecks:false,
            jumpType: "template",
            jumpTemplate: "<a class='joinGroup'><span class='fa fa-plus-square-o'></span></a>",
            //点击自己配置的按钮后的事件
            events: [{
                target: ".joinGroup",
                type: "click",
                event: function () {
//                    $(".addContactToGroup").data("stable")._refresh();
//                    var object=$(".addContactToGroup").data("stable")._condition();
//                    var list=$(".addContactToGroup").data("stable")._getChecks();
                    var me=$(this);
                    var id=me.parent().data("key");
                    var index = me.parent().attr('data-index');
                    var groupName= $("#addContactToGroup").data("stable").options.data.records[index][widget._UIDEFAULFS.groupRootLink+":title"];
                    var paramData={
                        "token":Iptools.DEFAULTS.token,
                        "contactgroupId": id,
                        "contactIds":widget._UIDEFAULFS.conId
                    };
//                    再添加之前判断一下是否有过该客群了
                    if(widget._UIDEFAULFS.existGroupArr.indexOf(id) == -1){//若不在
                        Iptools.PostJson({
                            ajaxCounting:false,
                            url:"basic/linkContactgroup",
                            data:paramData
                        }).done(function(data){
                            if(data){
                                widget._haveInGroup();
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
                                $("#addToContactGroupModal").modal("hide");
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "添加成功！"
                                });
                            };
                        });
                    }else{
                        Iptools.Tool.pAlert({
                            type: "info",
                            title: "系统提示：",
                            content: "该客户已经是该群的成员!",
                            delay: 1000
                        });
                    }
                }
            }],
            searchEvent: function (condition) {
                if (condition) {
                    $("#test_panel").append(JSON.stringify(condition) + "<br/>");
                }
            }
        });
    },
    _groupLinkApplet : function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Group Link List Applet'"
        }).done(function(data) {
            if (data) {
                widget._UIDEFAULFS.groupLinkApplet = data.applets[0].applet;//4771
                Iptools.uidataTool._getApplet({
                    applet:data.applets[0].applet//4771
                }).done(function(data) {
                    if(data){
                        widget._UIDEFAULFS.groupLinkRoot = data.rootLink;
                        widget._haveInGroup();
                    }
                })
            }
        })
    },
    _haveInGroup: function(){
        $(".groupName").remove();
        Iptools.uidataTool._getUserlistAppletData({
            appletId:widget._UIDEFAULFS.groupLinkApplet,//4771
//            viewId:Iptools.DEFAULTS.currentView,
            condition:'{"'+widget._UIDEFAULFS.groupLinkRoot+':contactid":"='+widget._UIDEFAULFS.conId+'","contactlinkgroup:valid_to":" is null"}'
        }).done(function(s){
            var rootId = s.rootLink;
//            console.log(s.data)
            if(s && s.data){
                $.each(s.data.records,function(key,obj){
                    if(obj[rootId+':groupid']){
                        widget._UIDEFAULFS.existGroupArr.push(obj[rootId+':groupid'].id);
                        var groupTitle = '';
                        if(obj[rootId+':groupid'].name){
                            groupTitle = obj[rootId +':groupid'].name;
                            if(obj[rootId+':groupid'].name.length > 10){groupTitle = obj[rootId+':groupid'].name.substr(0,10)+'...';}
                        }
                        var html = '<div class="groupName" data-name="'+groupTitle+'" data-id="'+obj[rootId+':groupid'].id+'">'+groupTitle+'</div>';
                        $(".join").before(html);
                    }

                });
            }
        });
    },
    _initTagIt: function(){
        $("#eventTags").tagit({
            afterTagRemoved: function(evt, ui) {//新加上的标签删除时执行
                widget._UIDEFAULFS.haveSelTag.splice($.inArray($("#eventTags").tagit('tagLabel', ui.tag), widget._UIDEFAULFS.haveSelTag),1);//将删除的标签从已选标签里剔除掉
                Iptools.DeleteJson({
                    url:"basic/contactTagLinks?token="+ Iptools.DEFAULTS.token + '&ids=' +ui.tag[0].id
                }).done(function(data){
                    if(data.retcode == 'ok'){
                        //标签删除后post一条数据到客户动态
                        trace._deleteTagTrace(Iptools.DEFAULTS.userId,$("#eventTags").tagit('tagLabel', ui.tag),Iptools.DEFAULTS.currentViewValue);
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
                    }
                });
            }
        });
    },

    //-------------------------------------事件-------------------------------------------
//    _jumpToMyTask: function(){
//        widget._addEventListener({
//            container: "body",
//            target: ".unfinish,.overdue,.finshed",
//            type: "click",
//            event: function () {
//                Iptools.uidataTool._getCustomizeView({
//                    nameList: "'new-mytask'"
//                }).done(function(data){
//                    if (data.views.length) {
//                        Iptools.uidataTool._getView({
//                            view: data.views[0].view
//                        }).done(function(r){
//                            Iptools.Tool._jumpView({
//                                view: data.views[0].view,
//                                name: r.view.name,
////                                valueId:value_id,
//                                type: r.view.type,
//                                url: r.view.url,
//                                bread: true
//                            });
//                        })
//                    }
//                })
//            }
//        });
//    },
    _addTag : function(){
        widget._addEventListener({
            container: "body",
            target: ".addTagPanel .allTag span",
            type: "click",
            event: function () {
                var me = $(this);
                if($.inArray(me.html(), widget._UIDEFAULFS.haveSelTag) == -1){
                    widget._UIDEFAULFS.haveSelTag.push(me.html());
                    //首先判断往什么样的标签形式里添加
                    if($('#eventTags').is(':visible')){//标签少于20个时
                        widget._initTagIt();
                        if($('#eventTags').is(':visible')){
                            $('#eventTags div').remove();
                            var data =  {"token":Iptools.DEFAULTS.token,
                                "contactId":widget._UIDEFAULFS.conId,
                                "tagValues":me.html()};
                            Iptools.PostJson({
                                url:"basic/contactMultiTagLinks",
                                data:data
                            }).done(function(data){
                                $("#eventTags").tagit('createTag',me.html());
                                if($("#eventTags").find('button').size() == 0){
                                    $("#eventTags").append('<button type="button" class="lessTagAdd btn">+</button>')
                                };
                                $("#eventTags li:first-child").attr("id",data.id);
                                $('.addTagPanel').css({'left':'0','top':$('.lessTagAdd').position().top+35});
                            });
                        };
                    }else{
                        //往动效标签添加标签
                        Iptools.PostJson({
                            url:"basic/contactTagLinks",
                            data:{
                                token:Iptools.DEFAULTS.token,
                                contactId:widget._UIDEFAULFS.conId,
                                tagValue:me.html()
                            }
                        }).done(function(data){
//                            trace._createTagTrace(Iptools.DEFAULTS.userId,me.html(),widget._UIDEFAULFS.conId);
                        });
                    };
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
                }
                me.remove();
            }
        });
    },
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
    _clickJoinGroup: function(){
        widget._addEventListener({
            container: "body",
            target: ".join",
            type: "click",
            event: function () {
                $("#addToContactGroupModal").modal("show");
                widget._getGroupList();
            }
        })
    },
    _gotoEdit: function(){
        widget._addEventListener({
            container: "body",
            target: ".saveBtn",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_edit'"
                }).done(function(data){
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            view: data.views[0].view
                        }).done(function(r){
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name+'->'+$('.saveBtn').attr('data-name'),
                                valueId:widget._UIDEFAULFS.conId,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true
                            });
                        })
                    }
                })
            }
        })
    },
    _clickTaskMore: function(){
        widget._addEventListener({
            container: "body",
            target: "#headingZero .panel-title .createTask",//创建任务
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $('#parentTabContents .tab-pane',parent.document).animate({scrollTop: '0px'}, 800);
                $('#addToTask form .profile-name input,#addToTask form textarea,#endDay').val("");
                $('#addToTask form .profile-type option:first-child').prop("selected","selected");
                $('#owner').val(window.sessionStorage.getItem('userTitle'));
                $('#owner').attr('data-id',Iptools.DEFAULTS.userId);
                $('#formTask').bootstrapValidator('resetForm');
                $('#addToTask').modal('show');
            }
        })
    },
    _clickTaskDetail: function(){
        widget._addEventListener({
            container: "body",
            target: ".seeDetail",//查看任务详情
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $('#parentTabContents .tab-pane',parent.document).animate({scrollTop: '0px'}, 800);
                $('#addToTask').modal('show');
                var me = $(this);
                var taskId = me.attr('data-taskId');
                Iptools.uidataTool._getUserDetailAppletData({
                    appletId:common._UIDEFAULFS.taskDetail,
                    valueId:taskId
                }).done(function(s){
//                    console.log(s.data[common._UIDEFAULFS.taskDetailRoot+':type']['id']);
                    $('#profile .modal-footer .saveTask').data('type','edit');
                    $('#profile .modal-footer .saveTask').data('task',taskId);
                    $('.profile-name input').val(s.data[common._UIDEFAULFS.taskDetailRoot+':title']);
                    $('.profile-des textarea').val(s.data[common._UIDEFAULFS.taskDetailRoot+':description']);
                    $('#endDay').val(s.data[common._UIDEFAULFS.taskDetailRoot+':due_time']);
                    $('.profile-type option[value="'+s.data[common._UIDEFAULFS.taskDetailRoot+':type']['id']+'"]').attr("selected","selected");
                    $('#owner').val(s.data[common._UIDEFAULFS.taskDetailRoot+':owner']['name']);
                    $('#owner').attr('data-id',s.data[common._UIDEFAULFS.taskDetailRoot+':owner']['id']);
                    $('#formTask').bootstrapValidator('resetForm');
                });

            }
        })
    },
    _haveCompleteTask: function(){//完成任务
        widget._addEventListener({
            container: "body",
            target: "#taskInfo .list-group-item .notComplete",
            type: "click",
            event: function (e) {
                var me = $(this);
                me.css({'background':'url(../../Content/Image/task.png) no-repeat','background-position':'0 -16px','background-size':'cover'});
                var taskName = me.data('title');
                Iptools.uidataTool._saveAppletData({
                    appletId: common._UIDEFAULFS.taskDetail,
                    valueId: me.data('id'),
                    data:'{"'+common._UIDEFAULFS.taskDetailRoot+':status":"2"}'
                }).done(function(data){
                    setTimeout(function(){
                        widget._getContactTasks();
                        widget._getContactTasksOfFinshed();
                        widget._getContactTasksOfFinshed();
                        //最好完成后弹个框表示已完成
//                        trace._createContactCompleteTask(Iptools.DEFAULTS.userId,taskName,widget._UIDEFAULFS.conId);//完成任务的动态post
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
                    },500)
                });
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
            target: ".filterTraceType>button,.addTags,.lessTagAdd,#eventTags .notagTips",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                if($(this).attr('data-show') == 1){
                    if($('.allTraceType').is(':hidden')){
                        $('.allTraceType').show();
                        me.attr('id','low');
                    }else{
                        $('.allTraceType').hide();
                        me.attr('id','');
                    };
                }else{
                    if($('.addTagPanel').is(':hidden')){
                        if(me.hasClass('lessTagAdd')){
                            $('.addTagPanel').css({'left':'0','top':me.position().top+35});
                            $('.postNewTag>a').show();
                            $('.postNewTag>form').hide();
                            $('.postNewTag .form-inline button:nth-child(2)').removeClass('saveThisTag').addClass('notClick');
                            $('.notClick').attr('disabled',true);
                            $('#tagValue').val("");
                        };
                        $('.notagTips p').removeClass('plusTag')
                        $('.addTagPanel').show();
                        widget._getAllTags();
                        $('.allTag span').removeClass('hasBgc');
                    }else{
                        $('.addTagPanel').hide();
                    }
                }
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
//                $('.filterTraceType>button').css({'color':'#09f','border':'1px solid #09f'})
                $('.filterTraceType>button').attr('id','')
            }
        });
    },
    _clickPostNewTag: function(){
        widget._addEventListener({
            container: "body",
            target: ".postNewTag a",
            type: "click",
            event: function (e) {
                $(this).hide();
                $(this).siblings().show();
            }
        });
    },
    _postNewTag: function(){
        widget._addEventListener({
            container: "body",
            target: ".postNewTag .saveThisTag",
            type: "click",
            event: function (e) {
                var me= $(this);
                Iptools.PostJson({
                    url: "basic/tags",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        tagValues: $('#tagValue').val()
                    }
                }).done(function(data){
                    if(data && data.tagList.length > 0){
                        var data =  {"token":Iptools.DEFAULTS.token,
                            "contactId":widget._UIDEFAULFS.conId,
                            "tagValue":$('#tagValue').val()};
                        Iptools.PostJson({
                            url:"basic/contactTagLinks",
                            data:data
                        }).done(function(data){
                            if(data){
                                $('#eventTags div').remove();
                                $("#eventTags").tagit();
                                $("#eventTags").tagit('createTag',$('#tagValue').val());
                                if($("#eventTags").find('button').size() == 0){
                                    $("#eventTags").append('<button type="button" class="lessTagAdd btn">+</button>')
                                };
                                $("#eventTags li:first-child").attr("id",data.id);
                                //添加标签的动作加入客户动态---type2
                                if($.inArray($('#tagValue').val(),widget._UIDEFAULFS.haveSelTag) == -1){
                                    widget._UIDEFAULFS.haveSelTag.push($('#tagValue').val());
//                                    trace._createTagTrace(Iptools.DEFAULTS.userId,$('#tagValue').val(),widget._UIDEFAULFS.conId);
                                    me.removeClass('saveThisTag').addClass('notClick');
                                    $('#tagValue').val("");
                                    me.attr('disabled',true);
                                    if(widget._UIDEFAULFS.filterTraceType){
                                        widget._getConActionList('#time_1',trace._UIDEFAULFS.year+'-'+trace._UIDEFAULFS.month,widget._UIDEFAULFS.filterTraceType);
                                    }else{
                                        widget._getConActionList('#time_1',trace._UIDEFAULFS.year+'-'+trace._UIDEFAULFS.month);
                                    };
                                }else{
                                    me.removeClass('saveThisTag').addClass('notClick');
                                    $('#tagValue').val("");
                                    me.attr('disabled',true);
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    _cancelPostTag: function(){
        widget._addEventListener({
            container: "body",
            target: ".postNewTag .cancel",
            type: "click",
            event: function (e) {
                $('#tagValue').val("");
                $('.postNewTag .form-inline button:nth-child(2)').removeClass('saveThisTag').addClass('notClick');
                $('.notClick').attr('disabled',true);
                $('.postNewTag .form-inline').hide();
                $('.postNewTag a').show();
            }
        });
    },
    _inputNewTag: function(){
        widget._addEventListener({
            container: "body",
            target: "#tagValue",
            type: "input",
            event: function (e) {
                if($(this).val().length <= 0){
                    $('.postNewTag .form-inline button:nth-child(2)').removeClass('saveThisTag').addClass('notClick');
                    $('.notClick').attr('disabled',true);
                }else{
                    $('.postNewTag .form-inline button:nth-child(2)').removeClass('notClick').addClass('saveThisTag');
                    $('.saveThisTag').attr('disabled',false);
                }
            }
        });
    },
    _clickDelTag: function(){
        widget._addEventListener({
            container: "body",
            target: ".delTag",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var that = $(this).parent('a');
                var me = $(this).attr('data-id');
                var meHtml = $(this).siblings('span').html()
                Iptools.DeleteJson({
                    url:"basic/contactTagLinks?token="+ Iptools.DEFAULTS.token + '&ids=' +me
                }).done(function(data){
                    if(data.retcode == 'ok'){
                        that.remove();
                        //标签删除后post一条数据到客户动态
//                        trace._deleteTagTrace(Iptools.DEFAULTS.userId,meHtml,Iptools.DEFAULTS.currentViewValue);
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
                    };
                });
            }
        });
    },
    _clickInGroup: function(){
        widget._addEventListener({
            container: "body",
            target: ".conGroup .groupName",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me= $(this);
                var value_id = me.attr('data-id');
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
            }
        });
    },
    _clickDocument: function(){
        widget._addEventListener({
            container: "body",
            target: ".left,.right",
            type: "click",
            event: function (e) {
                $('.addTagPanel').hide();
                $('.allTraceType').hide();
//                $('.filterTraceType>button').css({'color':'#09f','border':'1px solid #09f'})
                $('.filterTraceType>button').attr('id','')
            }
        })
    },
    _clickaddTagPanel: function(){
        widget._addEventListener({
            container: "body",
            target: ".addTagPanel,.allTraceType",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
            }
        })
    }


}