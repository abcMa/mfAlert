//客户群详情页widget.js  2017-04-12
var widget = {};
widget = {
    _UIDEFAULFS: {
        groupValue : "",//客户群id
        currentView : "",
        traceApplet : "",//客户群动态applet
        conInGroupApplet : "",//'客户群内客户'----applet
        contactRoot : "",//’contact‘  applet 的root
        conLinkGroupRoot : "",//客户群link的root
        groupNumApplet : "",//客户群内客户的数量report--applet
        conTypeApplet : "",//客户群内客户类型的report---applet
        conChannelApplet : "",//客户群内客户来源的report---applet
        groupCampaignReport : "",//客户群营销统计---applet
        campaignResponseApplet : "",//营销活动反馈列表---applet
        campaignResRootId : "",//营销活动反馈列表的root
        campaignDifResRootId : "",//不同于营销活动反馈列表的root-----由此root可以拿到活动所有的参与人数
        allCon : [],//该客群内的所有客户的数组集合
        campaignInfo : [],//营销活动的--信息---数组
        campaignDeApplet : "",
        conGroupAction_PAGE_NOW : 1,
        conGroupAction_PAGE_SIZE :10,
        contact_PAGE_NOW : 1,
        contact_PAGE_SIZE :10,
        deTableData : [],
        selArray : [],//-----所选择的要展示出来的的字段---数组

    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
        widget._clickToggleField();//客户所有字段面板的展开和隐藏
        widget._touchField();//点击选择客户属性的字段----div区域
        widget._touchFieldInput();//点击选择客户属性的字段----input区域
        widget._clickSureRender();//点击确定变换表头
        widget._delToRed();//点击客户群内客户list 的tr
        widget._stopProByInput();// 点击客户群内客户list 的tr td:first-child input:checkbox
        widget._selAll();//点击客户群内客户list的全选checkbox
        widget._showConfirm();//点击删除时的确认框出现
        widget._delContactFromGroup();//确认将客户从客群内删除的函数
        widget._sureAddToGroup();//确认添加客户
        widget._gotoThisView();//客群的动态的跳转
        widget._gotoGroupEdit();//跳转到客群编辑页
        widget._clickChangeReportTime();//变换报表的时间维度
    },
    _bindingEventAfterLoad: function () {//插件的初始化

    },
    _init: function () {
        widget._bindingDomEvent();
        widget._UIDEFAULFS.groupValue = Iptools.DEFAULTS.currentViewValue;
        widget._UIDEFAULFS.currentView = Iptools.DEFAULTS.currentView
        widget._getGroupDetail();//获取客户群详细信息，如名称和简介
        widget._getCampaignDeApplet();
        widget._getGroupTraceApplet();//获取客户群动态applet

        widget._getGroupCampaignReport();//获得客户群营销统计报表的applet
        widget._getCampaignResponse();//获得营销活动反馈列表的applet

        widget._getContactByGroupApplet();//获得‘客户群内客户’的 applet
        widget._getContactLinkGroupRoot();
        widget._getContactAllField();//获得客户的所有字段名称


        widget._getNumReportApplet();//获得客群内客户数量变化的报表
        widget._getTypeReportApplet();//获得客群内客户类型变化的报表
        widget._getChannelApplet();//获得客群内客户渠道变化的报表
        widget._contactGroupTagsReport();//获得客群内客户标签的report报表
    },
    _getCampaignDeApplet: function(){
        //获取campaignAppletId---8034，为了在动态部分显示最新的活动名称,避免显示成undefined
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign Detail Applet'"
        }).done(function (data) {
            widget._UIDEFAULFS.campaignDeApplet =  data.applets[0].applet;//8034
        });
    },
    _getGroupTraceApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'Contactgroup Trace List'"
        }).done(function(r){
            if(r)
                widget._UIDEFAULFS.traceApplet = r.applets[0].applet;//8065
                widget._getGroupTraceList(widget._UIDEFAULFS.traceApplet);
        });
    },
    _getGroupTraceList: function(){
        //先获得rootID
        var rootId;
        Iptools.uidataTool._getApplet({
            applet:widget._UIDEFAULFS.traceApplet//8065
        }).done(function(data){
            rootId = data.rootLink;
            Iptools.uidataTool._getUserlistAppletData({
                appletId: widget._UIDEFAULFS.traceApplet,//8065
                condition:'{"'+rootId+':contactgroup_id":"='+widget._UIDEFAULFS.groupValue+'"}',
                pageNow:widget._UIDEFAULFS.conGroupAction_PAGE_NOW,
                pageSize:widget._UIDEFAULFS.conGroupAction_PAGE_SIZE
            }).done(function(s){
                console.log(s.data.records);
                if(s.data && s.data.records){
                    $('.nodata').hide();
//                    $(".top .right ul.list").show();
                    $(".top .right ul.list").html("");
                    component._pager({
                        container: "pager-example-panel-groupAction",
                        pageSize: s.data.pageSize,
                        pageCount: s.data.pageCount,//总页数
                        rowCount: s.data.rowCount,//总条数
                        pageNow: s.data.pageNow,
                        jump: function (page) {
                            widget._UIDEFAULFS.conGroupAction_PAGE_NOW = page;
                            widget._getGroupTraceList(widget._UIDEFAULFS.traceApplet);
                        }
                    });
                    $.each(s.data.records,function(key,obj){
                        var actionType = obj[rootId+':trace_type']['id'];
                        switch(actionType)
                        {
                            case '1':
                                var actionString = "举行了活动";
                                break;
                            case '2':
                                var actionString = "创建了客户群";
                                break;
                            case '3':
                                var actionString = "完善了客户群";
                                break;
                            case '4':
                                var actionString = "添加了客户";
                                break;
                            case '5':
                                var actionString = "删除了客户";
                                break;
                        };

                        //如果动态是添加客户，为了防止客户名称或电话更新，需要拿到最新的名称和电话
                        var conName = obj[rootId+':title'];
                        if(actionType == 4){
                            Iptools.GetJson({
                                url: "basic/contacts/"+obj[rootId+':value_id']+'?token='+Iptools.DEFAULTS.token,
                                async:false,
                            }).done(function(data){
                                if(data.title && data.title != 'undefined'){
                                    conName = data.title;
                                }else{
                                    conName = data.phone;
                                }
                            })
                        };
                        if(actionType == 1 ){
                            Iptools.GetJson({
                                url: "service/appletDataGetDetail",
                                data:{
                                    token:Iptools.DEFAULTS.token,
                                    appletId:widget._UIDEFAULFS.campaignDeApplet,
                                    valueId:obj[rootId+':value_id']
                                },
                                async:false
                            }).done(function(data){
                                if(data)
                                    var prefix = data.rootAliasName;
                                if(data.detailData[prefix+":title"] && data.detailData[prefix+":title"] != 'undefined'){
                                    conName = data.detailData[prefix+":title"];
                                }else{
                                    conName = "";
                                }
                            })
                        }
                        var html ='<li>'+
                            '<span class="action"><i class="iconfontyyy" aria-hidden="true">&#xe67b;</i>'+actionString+'</span>'+
                            '<span class="person" title="'+conName+'" data-name='+conName+' data-type="'+actionType+'" data-id="'+obj[rootId+':value_id']+'">'+conName+'</span>'+
                            '<span class="time">'+obj[rootId+':update_time']+'</span>'+
                            '</li>';
                        $(".top .right ul.list").append(html);
                    })
                }else{
                    $('.nodata').show();
                    $(".top .right ul.list").hide();
                    $(".groupActionPage").hide();
                }
            })
        })
    },
//    -------------------营销活动部分---------------------------------------
    _getGroupCampaignReport: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign Contact Group Report'"
        }).done(function (data) {
            widget._UIDEFAULFS.groupCampaignReport =  data.applets[0].applet;//8150
        });
    },
    _getCampaignResponse: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign Response List in Title'"
        }).done(function (data) {
            widget._UIDEFAULFS.campaignResponseApplet =  data.applets[0].applet;//8151
            Iptools.uidataTool._getApplet({
                applet:widget._UIDEFAULFS.campaignResponseApplet
            }).done(function(data){
                widget._UIDEFAULFS.campaignResRootId = data.rootLink;//103
                $.each(data.columns,function(key,obj){
                    var column = obj.column;
                    var rootColumn = column.substr(0,column.indexOf(':'));
                    if(rootColumn != widget._UIDEFAULFS.campaignResRootId){
                        widget._UIDEFAULFS.campaignDifResRootId = rootColumn;//228
                    }
                });
                widget._getContactJoinCampaign();//获得该客群内的客户参加过的活动
            })
        });
    },
    _getContactJoinCampaign: function(){
        Iptools.GetJson({
            url: "basic/queryContactsAllField",
            data: {
                token: Iptools.DEFAULTS.token,
                id: widget._UIDEFAULFS.groupValue,
                pageNow: 1,
                pagesize:100
            }
        }).done(function(data){
            $.each(data.records,function(key,obj){
                widget._UIDEFAULFS.allCon.push(obj.id)
            });
            if( widget._UIDEFAULFS.allCon != ''){
                var  campainOriginData;
                Iptools.uidataTool._buildReport({
                    applet:widget._UIDEFAULFS.groupCampaignReport,
                    condition:'{"'+widget._UIDEFAULFS.campaignResRootId+':contact_id":" in('+widget._UIDEFAULFS.allCon.join()+')"}'
                }).done(function(data){
                    campainOriginData = data;
//                console.log(data)
                    //将得到的原始数据进行map，易于铺设数据
                    $.each(campainOriginData.series[0].categories,function(key,obj){
                        var camObj = {};
                        if(obj != ''){
                            camObj.allCount =  widget._getCampaignAllCount(obj);
                            camObj.time = widget._getCampaignTime(obj);
                            camObj.title = obj;
                            camObj.count = campainOriginData.series[0].data[key];
                            widget._UIDEFAULFS.campaignInfo.push(camObj);
                        }
                    });
                    //开始铺设客群与营销模块
                    widget._renderGroupWithCampaign();
                    $('#allMarket').html(widget._UIDEFAULFS.campaignInfo.length);
                })

            }else{
                $('.left.carousel-control').hide();
                $('.right.carousel-control').hide();
                $('.carousel-indicators').hide();
                $('#allMarket').html('0');
                var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                $('.groupWithCampaign').append(emptyHtml);
                $(".groupWithCampaign .noDataArea").css("padding-top",$(".groupWithCampaign").height() === 0 ? 0+"px":($(".groupWithCampaign").height()- 175)/2+"px");
                return false;
            }
//            console.log(allCon.join());
        })
    },
    _getCampaignAllCount: function(dataPar){
        var allPer = '';
        Iptools.uidataTool._getUserlistAppletData({
            appletId:widget._UIDEFAULFS.campaignResponseApplet,//8151
            condition:'{"'+widget._UIDEFAULFS.campaignDifResRootId+':title":"=\''+dataPar+'\'"}',
            async:false
        }).done(function(s){
            allPer = s.data.rowCount;
        })
        return allPer;
    },
    _getCampaignTime : function(dataPar){
        var creatTime = '';
        Iptools.uidataTool._getUserlistAppletData({
            async:false,
            appletId:widget._UIDEFAULFS.campaignResponseApplet,//8151
            condition:'{"'+widget._UIDEFAULFS.campaignDifResRootId+':title":"=\''+dataPar+'\'"}'
        }).done(function(s){
            //活动时间
            creatTime = s.data.records[0][widget._UIDEFAULFS.campaignDifResRootId+':create_time'];
            creatTime = creatTime.substr(0,10);
        })
        return creatTime;
    },
    _renderGroupWithCampaign: function(){
        if(widget._UIDEFAULFS.campaignInfo.length == 0){
            var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
            $('.left.carousel-control').hide();
            $('.right.carousel-control').hide();
            $('.carousel-indicators').hide();
            $('.groupWithCampaign').append(emptyHtml);
            $(".groupWithCampaign .noDataArea").css("padding-top",$(".groupWithCampaign").height() === 0 ? 0+"px":($(".groupWithCampaign").height()- 175)/2+"px");
            return false;
        };
        //拿得到的campaignInfo去铺设数据

        for(var c = 0;c<widget._UIDEFAULFS.campaignInfo.length;c++){
            var campainInfo = widget._UIDEFAULFS.campaignInfo;
            if(campainInfo.length == 1){
                widget._renderLastItem();
                $('.groupWithCampaign .item').eq(0).addClass('active');
                return false;
            };
            if(c % 2 == 0){
                var leftJoin = (Number(campainInfo[c].count)/widget._UIDEFAULFS.allCon.length).toFixed(2);
                if(leftJoin == 1.00){
                    leftJoin = 100;
                };
                var leftConTri = (Number(campainInfo[c].count)/campainInfo[c].allCount).toFixed(2);
                if(leftConTri == 1.00){
                    leftConTri = 100;
                };
                var rightJoin = (Number(campainInfo[c+1].count)/widget._UIDEFAULFS.allCon.length).toFixed(2);
                if(rightJoin == 1.00){
                    rightJoin = 100;
                };
                var rightConTri = (Number(campainInfo[c+1].count)/campainInfo[c+1].allCount).toFixed(2);
                if(rightConTri == 1.00){
                    rightConTri = 100;
                };

                var html = '<div class="item" style="width: 500px;margin: 0 auto;">';
                html+=   '<div class="item-left col-md-5" style="width:208px;">'+
                    '<div class="row one">'+
                    '<div class="col-md-12">'+
                    '<p style="padding-top:6px;">'+campainInfo[c].time+'</p>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                    '<h4 class="marketName" title="'+campainInfo[c].title+'">'+campainInfo[c].title+'</h4>'+
                    '</div>'+
                    '</div>'+
                    '<div class="row two" style="border-bottom: 1px solid #fff;">'+
                    '<div class="col-md-6 join">'+leftJoin+'<span style="font-size: 16px;">%</span></div>'+
                    '<div class="col-md-6 join-per">参与率</div>'+
                    '</div>'+
                    '<div class="row two">'+
                    '<div class="col-md-6 person thisGro">'+Number(campainInfo[c].count)+'</div>'+
                    '<div class="col-md-6 groupPer">本群参与人数</div>'+
                    '</div>'+

                    '<div class="row two" style="border-bottom: 1px solid #fff;">'+
                    '<div class="col-md-6 join">'+leftConTri+'<span style="font-size: 16px;">%</span></div>'+
                    '<div class="col-md-6 join-per">贡献率</div>'+
                    '</div>'+
                    '<div class="row two" style="padding-bottom:7px;">'+
                    '<div class="col-md-6 person allPer">'+campainInfo[c].allCount+'</div>'+
                    '<div class="col-md-6 groupPer">总参与人数</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="col-md-2"></div>';
//            if(campainInfo.length % 2 == 0){
                html +=  '<div class="item-right col-md-5" style="width:208px;">'+
                    '<div class="row one">'+
                    '<div class="col-md-12">'+
                    '<p style="padding-top:6px;">'+campainInfo[c+1].time+'</p>'+
                    '</div>'+
                    '<div class="col-md-12">'+
                    '<h4 class="marketName" title="'+campainInfo[c+1].title+'">'+campainInfo[c+1].title+'</h4>'+
                    '</div>'+
                    '</div>'+
                    '<div class="row two" style="border-bottom: 1px solid #fff;">'+
                    '<div class="col-md-6 join">'+rightJoin+'<span style="font-size: 16px;">%</span></div>'+
                    '<div class="col-md-6 join-per">参与率</div>'+
                    '</div>'+

                    '<div class="row two">'+
                    '<div class="col-md-6 person thisGro">'+Number(campainInfo[c+1].count)+'</div>'+
                    '<div class="col-md-6 groupPer">本群参与人数</div>'+
                    '</div>'+

                    '<div class="row two" style="border-bottom: 1px solid #fff;">'+
                    '<div class="col-md-6 join">'+rightConTri+'<span style="font-size: 16px;">%</span></div>'+
                    '<div class="col-md-6 join-per">贡献率</div>'+
                    '</div>'+
                    '<div class="row two" style="padding-bottom:7px;">'+
                    '<div class="col-md-6 person allPer">'+campainInfo[c+1].allCount+'</div>'+
                    '<div class="col-md-6 groupPer">总参与人数</div>'+
                    '</div>'+
                    '</div>';

                html += '</div>';
                $('.groupWithCampaign').append(html);
                $('.item-left .col-md-6.person.thisGro').zeroTonum(0,Number(campainInfo[c].count));
                $('.item-right .col-md-6.person.thisGro').zeroTonum(0,Number(campainInfo[c+1].count));
                $('.item-left .col-md-6.person.allPer').zeroTonum(0,Number(campainInfo[c].allCount));
                $('.item-right .col-md-6.person.allPer').zeroTonum(0,Number(campainInfo[c+1].allCount));
                //铺设轮播下面的小圆圈
                var liHtml =  '<li data-target="#carousel-example-generic" class="active"></li>';
                $('.carousel-indicators').append(liHtml);
                $('.groupWithCampaign .item').eq(0).addClass('active');
//                console.log((c+2)+'-'+(campainInfo.length-1));
                if((c+2) == campainInfo.length-1){//最后一个
                    widget._renderLastItem();
                }
            }
        };
    },
    _renderLastItem: function(){
        var campainInfo = widget._UIDEFAULFS.campaignInfo;
        var leftJoin = (Number(campainInfo[campainInfo.length-1].count)/widget._UIDEFAULFS.allCon.length).toFixed(2);
        if(leftJoin == 1.00){
            leftJoin = 100;
        };
        var leftConTri = (Number(campainInfo[campainInfo.length-1].count)/campainInfo[campainInfo.length-1].allCount).toFixed(2);
        if(leftConTri == 1.00){
            leftConTri = 100;
        };
        var html = '<div class="item" style="width: 500px;margin: 0 auto;">';
        html+=   '<div class="item-left col-md-5" style="width:208px;">'+
            '<div class="row one">'+
            '<div class="col-md-12">'+
            '<p style="padding-top:6px;">'+campainInfo[campainInfo.length-1].time+'</p>'+
            '</div>'+
            '<div class="col-md-12">'+
            '<h4 class="marketName" title="'+campainInfo[campainInfo.length-1].title+'">'+campainInfo[campainInfo.length-1].title+'</h4>'+
            '</div>'+
            '</div>'+
            '<div class="row two" style="border-bottom: 1px solid #fff;">'+
            '<div class="col-md-6 join">'+leftJoin+'<span style="font-size: 16px;">%</span></div>'+
            '<div class="col-md-6 join-per">参与率</div>'+
            '</div>'+
            '<div class="row two">'+
            '<div class="col-md-6 person">'+Number(campainInfo[campainInfo.length-1].count)+'</div>'+
            '<div class="col-md-6 groupPer">本群参与人数</div>'+
            '</div>'+

            '<div class="row two" style="border-bottom: 1px solid #fff;">'+
            '<div class="col-md-6 join">'+leftConTri+'<span style="font-size: 16px;">%</span></div>'+
            '<div class="col-md-6 join-per">贡献率</div>'+
            '</div>'+
            '<div class="row two" style="padding-bottom:7px;">'+
            '<div class="col-md-6 person">'+campainInfo[campainInfo.length-1].allCount+'</div>'+
            '<div class="col-md-6 groupPer">总参与人数</div>'+
            '</div>'+
            '</div>'+
            '<div class="col-md-2"></div>';

        html += '</div>';
        $('.groupWithCampaign').append(html);
        //铺设轮播下面的小圆圈
        var liHtml =  '<li data-target="#carousel-example-generic" class="active"></li>';
        $('.carousel-indicators').append(liHtml);
    },
//    --------------------营销部分 end-------------------------------------------------
    _getContactByGroupApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact by groupview'"
        }).done(function (data) {
            widget._UIDEFAULFS.conInGroupApplet =  data.applets[0].applet;
        });
    },
    _getContactLinkGroupRoot: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Group Link List Applet'"
        }).done(function(data) {
            if (data) {
                var conGroupId = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: conGroupId
                }).done(function (data) {
                    if (data) {
                        widget._UIDEFAULFS.conLinkGroupRoot = data.rootLink;
                    }
                })
            }
        });
    },
    _getContactAllField: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:'"contact"'
        }).done(function(data){
            var conAppId = data.applets[0].applet;//2046
            Iptools.uidataTool._getApplet({
                applet:conAppId
            }).done(function(data){
                widget._UIDEFAULFS.contactRoot = data.rootLink;
                var array  = [
                    {"title":"姓名","columnName":data.rootLink+":title"},
                    {"title":"电话号码","columnName":data.rootLink+":phone"},
                    {"title":"标签","columnName":data.rootLink+":tag"},
                    {"title":"客户类型","columnName":data.rootLink+":contacttype"},
                    {"title":"客户来源","columnName":data.rootLink+":channel"}
                ];
                widget._UIDEFAULFS.deTableData = array;
                var rootId = data.rootLink;//10
                var defaultHtml = '<div class="demo">'+
                    '<input type="checkbox" class="blueCheckbox" checked="checked" disabled="true">' +
                    '<span data-name ="'+rootId+':title'+'">姓名</span>'+
                    '</div>'+
                    '<div class="demo">'+
                    '<input type="checkbox" class="blueCheckbox" checked="checked" disabled="true">' +
                    '<span data-name ="'+rootId+':phone'+'">电话</span>'+
                    '</div>'+
                    '<div class="demo">'+
                    '<input type="checkbox" class="blueCheckbox" checked="checked" id="selTag" disabled="true">' +
                    '<span data-name="'+rootId+':tag'+'">标签</span>'+
                    '</div>'+
                    '<div class="demo">'+
                    '<input type="checkbox" class="blueCheckbox" checked="checked">' +
                    '<span data-name ="'+rootId+':contacttype'+'">客户类型</span>'+
                    '</div>'+
                    '<div class="demo">'+
                    '<input type="checkbox" class="blueCheckbox" checked="checked">' +
                    '<span data-name ="'+rootId+':channel'+'">客户来源</span>'+
                    '</div>';
                $(".default").append(defaultHtml);
                $.each(data.controls,function(key,obj){
                    var Name = obj.column;
                    if( Name != rootId+':title' &&
                        Name != rootId+':headpic' &&
                        Name != rootId+':login_name' &&
                        Name != rootId+':stay_time' &&
                        Name != rootId+':phone' &&
                        Name != rootId+':phone2' &&
                        Name != rootId+':phone3' &&
                        Name != rootId+':phone4' &&
                        Name != rootId+':owner' &&
                        Name != rootId+':contacttype'
                        && Name != rootId+':channel'){
                        var html = '<div class="demo">'+
                            '<input type="checkbox" class="blueCheckbox">'+
                            '<span data-name ="'+obj.column+'">'+obj.name+'</span>'+
                            '</div>';

                        $(".can-sel").append(html);
                    }
                });
                widget._renderConTable(widget._UIDEFAULFS.deTableData);
            });
        })
    },
    _renderConTable: function(tableData){
        //存储已选的客户
        $('.del').removeClass('delToRed');
        $('.del').attr('disabled',true);
        $('.selAll').prop('checked',false);
        $('.selAll').attr('disabled',false);
        Iptools.uidataTool._getUserlistAppletData({
            view:widget._UIDEFAULFS.currentView,
            appletId:widget._UIDEFAULFS.conInGroupApplet,
            valueId:widget._UIDEFAULFS.groupValue,
            pageNow: widget._UIDEFAULFS.contact_PAGE_NOW,
            pageSize:widget._UIDEFAULFS.contact_PAGE_SIZE
        }).done(function(s){
            console.log(s.data)
            if(s.data == undefined){
                $('#pager-example-panel-contactInGroup').hide();
                $('.sure button').attr('disabled',true);
                $('.empty').show();
                $("#haveConTable tbody").html("");
                $('.selAll').attr('disabled',true);
                return false;
            };
            $('.sure button').attr('disabled',false);
            $("#haveConTable tbody").html("");
            $('.empty').hide()
            component._pager({
                container: "pager-example-panel-contactInGroup",
                pageSize: s.data.pageSize,
                pageCount: s.data.pageCount,//总页数
                rowCount: s.data.rowCount,//总条数
                pageNow: s.data.pageNow,
                jump: function (page) {
                    widget._UIDEFAULFS.contact_PAGE_NOW = page;
                    var thData = [];
                    $('#haveConTable thead tr th').each(function(i){
                        var name = $(this).attr('name');
                        var text = $(this).html();
                        var obj = {};
                        if(name != undefined){
                            obj.columnName = name;
                            thData.push(obj);
                        }
                    });
                    widget._renderConTable(thData);
                }
            });
            var len = tableData.length;

            //最少显示电话和姓名和标签
            $.each(s.data.records,function(key,obj){
                var conName = obj[widget._UIDEFAULFS.contactRoot+':title'] ? obj[widget._UIDEFAULFS.contactRoot+':title'] : "";
                var conPhone = obj[widget._UIDEFAULFS.contactRoot+':phone'] ? obj[widget._UIDEFAULFS.contactRoot+':phone'] : "";
                var showHtml = "";
                showHtml += '<tr data-id="'+obj[widget._UIDEFAULFS.conLinkGroupRoot+':contactid']['id']+'">'+
                    '<td>'+
                    '<label>'+'<input type="checkbox" class="blueCheckbox" id="'+obj[widget._UIDEFAULFS.conLinkGroupRoot+':contactid']['id']+'">'+'</label>'+
                    '</td>'+
                    '<td>'+conName+'</td>'+
                    '<td>'+conPhone+'</td>';
                Iptools.GetJson({
                    url: "basic/contactTagLink_paging",
                    async:false,
                    data: {
                        token: Iptools.DEFAULTS.token,
                        contactId: obj[widget._UIDEFAULFS.conLinkGroupRoot+':contactid']['id'],
                        pageNow: 1,
                        pagesize: 3
                    }
                }).done(function (tags) {
                    if (tags.records) {
                        var li = tags.records;
                        var tagHtml = "";
                        $.each(li,function(key,obj){
                            var tag = '<span class="label tag label-info">'+obj.tagValue+'</span>';
                            tagHtml += tag;
                        });
                        showHtml += '<td>'+tagHtml+'</td>';
                    }else{
                        showHtml += '<td></td>';
                    };
                    $("#haveConTable").append(showHtml);
                });

                //铺设后面的数据

                if(len > 3){
                    for(var td=3;td < len ; td++){
                        var demo = tableData[td].columnName;
                        var tdHtml = "";
                        if (obj[demo]) {
                            tdHtml = '<td>' + obj[demo] + '</td>';
                            if(typeof(obj[demo]) == 'object'){
                                tdHtml = '<td>' + obj[demo].name + '</td>';
                            }
                        } else {
                            tdHtml = '<td></td>';
                        }
//                    };
                        var a =obj[widget._UIDEFAULFS.conLinkGroupRoot+':contactid']['id'];
                        $('#haveConTable tr[data-id='+a+']').append(tdHtml);
                    }
                };
                showHtml += '<tr>';
            });
        })
    },
    _getGroupDetail : function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contactgroup Detail Applet'"
        }).done(function (data) {
            //拿到rootGroupId
            var rootId;
            Iptools.uidataTool._getUserDetailAppletData({
                appletId: data.applets[0].applet,
                valueId:widget._UIDEFAULFS.groupValue
            }).done(function(s){
                rootId = s.rootLink;
                $('.ti-left p').html(s.data[rootId+':title']);
                $('.editBtn a').attr('data-name',s.data[rootId+':title']);
                if(s.data[rootId+':group_reason']){
                    if(s.data[rootId+':group_reason'].name){
                        $('.ti-left button').html(s.data[rootId+':group_reason'].name);
                    }else{
                        $('.ti-left button').html(s.data[rootId+':group_reason']);
                    }
                }
                $('.left-top .content p').html(s.data[rootId+':description']);
                //拿到客户群的人数
                Iptools.GetJson({
                    url: "basic/contactgroups/"+Iptools.DEFAULTS.currentViewValue+"?token="+Iptools.DEFAULTS.token,
                }).done(function(r){
                    $('.ti-right p span').html(r.contactCount);
                })
            })
        });
    },
    _getNumReportApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Group ContactnewNum Line Report'"
        }).done(function (data) {
            widget._UIDEFAULFS.groupNumApplet =  data.applets[0].applet;
            widget._reportGroupNum();
        });
    },
    _reportGroupNum : function(){
        Iptools.uidataTool._buildReport({
            viewId:widget._UIDEFAULFS.currentView,
            applet:widget._UIDEFAULFS.groupNumApplet,
            valueId:widget._UIDEFAULFS.groupValue,
            container:'groupNumAcount',
            date: (new Date()).format("yyyyMMdd"),
            timeType: 'year',
            showReport: true
        });
    },
    _getTypeReportApplet : function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Group Contact Type'"
        }).done(function (data) {
            widget._UIDEFAULFS.conTypeApplet =  data.applets[0].applet;
            widget._reportConType();
        });
    },
    _reportConType : function(){
        Iptools.uidataTool._buildReport({
            viewId:widget._UIDEFAULFS.currentView,
            applet:widget._UIDEFAULFS.conTypeApplet,
            valueId:widget._UIDEFAULFS.groupValue,
            container:'conType',
            showReport: true
        });
    },
    _getChannelApplet : function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Group ContactChannel Report'"
        }).done(function (data) {
            widget._UIDEFAULFS.conChannelApplet =  data.applets[0].applet;
            widget._reportConChannel();
        });
    },
    _reportConChannel: function(){
        Iptools.uidataTool._buildReport({
            viewId:widget._UIDEFAULFS.currentView,
            applet:widget._UIDEFAULFS.conChannelApplet,
            valueId:widget._UIDEFAULFS.groupValue,
            container:'conChannel',
            showReport: true
        });
    },
    _contactGroupTagsReport: function(){
        Iptools.GetJson({
            url: "service/contactGroupTagReport",
            data: {
                token: Iptools.DEFAULTS.token,
                contactGroupId: widget._UIDEFAULFS.groupValue
            }
        }).done(function(data){
            widget._renderColumnTag(data.series[0].data,data.categories);
        })
    },
    _renderColumnTag : function(series,categories){
        if(series.length === 0){
            var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
            $("#groupTagAcount").append(emptyHtml);
            $("#groupTagAcount .noDataArea").css("padding-top",$("#groupTagAcount").height() === 0 ? 0+"px":($("#groupTagAcount").height()- 175)/2+"px");
        }else{
            $('#groupTagAcount').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
//        subtitle: {
//            text: 'Source: WorldClimate.com'
//        },
                xAxis: {
                    categories: categories,
//            crosshair: true//滑上去是否显示灰色的背景
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '数量 (人)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">人数: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} 人</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series:{
                        colorByPoint:true
                    }
                },
                series: [{
                    name: '标签',
                    data: series

                }]
            });
        }
    },
    _getHaveConId : function(){
        var haveConArray = [];
        $('#haveConTable tbody tr td:first-child input').each(function(i){
            haveConArray.push(Number($(this).attr('id')));
        });
        return haveConArray;
    },
//    ---------------------------------------------------------------------------绑定事件----------------------------------------------------------------------
    _clickToggleField: function(){
        widget._addEventListener({
            container: "body",
            target: ".filter",
            type: "click",
            event: function () {
                $(".can-sel").toggle();
                if($(this).find("img").data("flag") == 'down'){
                    $(this).find("img").data("flag","up");
                    $(this).find("img").attr("src","img/u3014.png")
                }else{
                    $(this).find("img").data("flag","down");
                    $(this).find("img").attr("src","img/u3009.png")
                }
            }
        })
    },
    _touchField: function(){
        widget._addEventListener({
            container: "body",
            target: ".can-sel .demo,.default .demo",
            type: "click",
            event: function () {
                if($(this).parent().attr('class') == 'default'){
                    if($(this).index() == 0 || $(this).index() == 1 || $(this).index() == 2){
                        return false;
                    }
                }
                if($(this).find('input').prop('checked')){
                    //$(this).find('input').css('background',"#fff");
                    $(this).find('input').prop('checked',false);
                }else{
                    //$(this).find('input').css('background',"#2ea4ed");
                    $(this).find('input').prop('checked',true);
                }
            }
        })
    },
    _touchFieldInput: function(){
        widget._addEventListener({
            container: "body",
            target: ".can-sel .demo input,.default .demo input",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if($(this).prop('checked')){
                    //$(this).css('background',"#2ea4ed");
                }else{
                    //$(this).css('background',"#fff");
                }
            }
        })
    },
    _clickSureRender: function(){
        widget._addEventListener({
            container: "body",
            target: ".sure",
            type: "click",
            event: function (e) {
                widget._UIDEFAULFS.selArray = [];
                $(".default input:checkbox").each(function(i){
                    if($(this).prop("checked") == true){
                        var selDeObj = {};
                        selDeObj.title = $(this).siblings('span').html();
                        var disLen = $(this).siblings('span').attr("data-name").length;
                        var attrName = $(this).siblings('span').attr("data-name");
//                selDeObj.columnName = attrName.substring( attrName.indexOf(':')+1,disLen);
                        selDeObj.columnName = attrName
                        widget._UIDEFAULFS.selArray.push(selDeObj);

                    }
                });
                $(".can-sel input:checkbox").each(function(i){
                    if($(this).prop("checked") == true){
                        var selCanObj = {};
                        selCanObj.title = $(this).siblings('span').html();
                        var disLen = $(this).siblings('span').attr("data-name").length;
                        var attrName = $(this).siblings('span').attr("data-name");
//                selCanObj.columnName = attrName.substring( attrName.indexOf(':')+1,disLen);
                        selCanObj.columnName = attrName
                        widget._UIDEFAULFS.selArray.push(selCanObj);

                    }
                });
                if( widget._UIDEFAULFS.selArray.length > 7){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "最多只能选7个"
                    });
                    widget._UIDEFAULFS.selArray = [];
//            $(".can-sel input").prop("checked",false);
//            $(".can-sel input").css("background",'#fff');
                    return false;
                }else{
                    $("#haveConTable tbody").html("");
                    //生成头部thead
                    $("table#haveConTable thead tr:first-child").html("");
//            $(".can-sel input").prop("checked",false);
//            $(".can-sel input").css("background",'#fff');
                    var xu = '';
//            xu = "<th>序号</th>";
                    var th_sel = "<th><input type='checkbox' class='selAll blueCheckbox'></th>"+xu;
                    $("table#haveConTable thead tr:first-child").append(th_sel);
                    for(var t = 0;t< widget._UIDEFAULFS.selArray.length;t++){
                        var th = '<th name="'+ widget._UIDEFAULFS.selArray[t]['columnName']+'"></th>';
                        $("table#haveConTable thead tr:first-child").append(th);
                        $("table#haveConTable th:nth-child("+(t+2)+")").html(widget._UIDEFAULFS.selArray[t].title);
                    };
                    widget._UIDEFAULFS.contact_PAGE_NOW = 1;
                    widget._renderConTable(widget._UIDEFAULFS.selArray);

                }
            }
        })
    },
    _delToRed : function(){
        widget._addEventListener({
            container: "body",
            target: "#haveConTable tr",
            type: "click",
            event: function (e) {
                var everyPageSize = $('#haveConTable tbody tr td:first-child label input').size();
                if($(this).find('input').prop("checked")){
                    $(this).find('input').prop("checked",false);
                    //全选不打勾
                    $('.selAll').prop('checked',false);
                }else{
                    $(this).find('input').prop("checked",true);
                    $('.del').addClass('delToRed');
                    $('.del').attr('disabled',false);
                    if($('#haveConTable tbody tr td:first-child label input:checked').size() == everyPageSize){//所有都选上了
                        //全选打勾
                        $('.selAll').prop('checked',true);
                    }
                };

                if($('#haveConTable tbody tr td:first-child label input:checked').size() == 0){
                    $('.del').removeClass('delToRed');
                    $('.del').attr('disabled',true);
                };
            }
        })
    },
    _stopProByInput : function(){
        widget._addEventListener({
            container: "body",
            target: "#haveConTable tr td:first-child input,.contactGroupListTbody tr td:first-child input",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                //需要分一下是添加客户的模态框还是已存在的客户列表
                if($(this).parent().parent().parent().attr('class') == 'contactGroupListTbody'){//模态框
                    if(!$(this).prop('checked')){
                        //全选不打勾
                        $('.allCheck').attr('checked',false);
                    }else{
                        var everyPageSize = $('.contactGroupListTbody tr td:first-child input').size();
                        if($('.contactGroupListTbody tr td:first-child input:checked').size() == everyPageSize){//所有都选上了
                            //全选打勾
                            $('.allCheck').prop('checked',true);
                        }
                    };
                }else{
                    if(!$(this).prop('checked')){
                        //全选不打勾
                        $('.selAll').attr('checked',false);
                    }else{
                        var everyPageSize = $('#haveConTable tbody tr td:first-child label input').size();
                        if($('#haveConTable tbody tr td:first-child label input:checked').size() == everyPageSize){//所有都选上了
                            //全选打勾
                            $('.selAll').prop('checked',true);
                        }
                    }
                }
                if($('#haveConTable tbody tr td:first-child label input:checked').size() == 0){
                    $('.del').removeClass('delToRed');
                    $('.del').attr('disabled',true);
                }else{
                    $('.del').addClass('delToRed');
                    $('.del').attr('disabled',false);
                }
            }
        })
    },
    _selAll: function(){
        widget._addEventListener({
            container: "body",
            target: "#haveConTable .selAll",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if($(this).prop('checked')){
                    $('#haveConTable tbody tr td:first-child label input').prop('checked',true);
                    $('.del').addClass('delToRed');
                    $('.del').attr('disabled',false);
                }else{
                    $('#haveConTable tbody tr td:first-child label input').prop('checked',false);
                    $('.del').removeClass('delToRed');
                    $('.del').attr('disabled',true);
                }
            }
        })
    },
    _showConfirm: function(){
        widget._addEventListener({
            container: "body",
            target: ".btn-list .del.delToRed",
            type: "click",
            event: function (e) {
                $('#myModal').modal('show');
            }
        })
    },
    _delContactFromGroup: function(){
        widget._addEventListener({
            container: "body",
            target: "#myModal .confirmBtn",
            type: "click",
            event: function (e) {
                var delData = [];
                var finalDelName = [];
                $('#haveConTable tbody tr td:first-child label input:checked').each(function(i){
                    delData.push($(this).attr('id'));
                    if($(this).parent().parent().siblings('td:nth-child(2)').html()){
                        finalDelName.push($(this).parent().parent().siblings('td:nth-child(2)').html());
                    }else{
                        finalDelName.push($(this).parent().parent().siblings('td:nth-child(3)').html());
                    }

                });

                Iptools.PostJson({
                    url:"basic/delContactFromGroup",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        contactgroupId:widget._UIDEFAULFS.groupValue,
                        contactIds:delData.join()
                    }
                }).done(function(data){
                    if(data){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "移除客户成功"
                        });
                        $('.del').removeClass('delToRed');
                        $('.del').attr('disabled',true);
//                        if( $('#haveConTable tbody tr').size() > 0){
                            var thData = [];
                            $('#haveConTable thead tr th').each(function(i){
                                var name = $(this).attr('name');
                                var text = $(this).html();
                                var obj = {};
                                if(name != undefined){
                                    obj.columnName = name;
                                    thData.push(obj);
                                }
                            });

                            widget._UIDEFAULFS.contact_PAGE_NOW = 1;
                            widget._renderConTable(thData);
//                        }else{
//                            $('.pageForm.contactNumPage').hide();
//                            $('.sure button').attr('disabled',true);
//                            $('.empty').show();
//                            $('.selAll').attr('disabled',true);
//                            return false;
//                        }

                        //删除客户的动态信息---type为5
                        $.each(finalDelName,function(key,obj){
                            //客户群方
                            trace._delToGroupGroTrace(obj,Iptools.DEFAULTS.currentViewValue);
                        });
                        $.each(delData,function(key,obj){
                            //客户方
                            trace._delToGroupTrace(Iptools.DEFAULTS.userId,$('.ti-left p').html(),obj);
                        });
                        widget._getGroupTraceList();

                        $('#myModal').modal('hide');
                    }
                })
                $('.selAll').prop('checked',false);
            }
        })
    },
    _sureAddToGroup: function(){
        widget._addEventListener({
            container: "body.groupDetailBody",
            target: " #addToContactGroupModal #addGroup",
            type: "click",
            event: function (e) {
//                console.log($(this).html());
                if($(".contactGroupListTbody tr td:first-child input:checked").size() == 0){
                    return false;
                }
                $(this).css({"pointer-events":"none"});
                $(this).button("loading");
                $('.pageForm.contactNumPage').show();
                $(".middle>p").remove();
                $(".top .right ul.list p").remove();
                $(".groupActionPage").show();
                var newCon = [];
                var finalSelName = [];
                var thData = [];
                $('#haveConTable thead tr th').each(function(i){
                    var name = $(this).attr('name');
                    var text = $(this).html();
                    var obj = {};
                    if(name != undefined){
                        obj.columnName = name;
                        thData.push(obj);
                    }
                });
                var groupId = Iptools.DEFAULTS.currentViewValue;
                //往客户群里添加客户时post到8144客户群动态
                var havaConId = widget._getHaveConId();
//    console.log(havaConId)
                $(".contactGroupListTbody tr td:first-child input:checked").each(function(i){
                    var flag = '';
                    flag = $.inArray(Number($(this).attr('data-id')), havaConId);//如果不在返回-1
//        console.log(flag);
                    if (flag == -1) {
                        var con_name = $(this).parent().siblings().html();//没有客户名称时，用电话
                        if(con_name){

                        }else{
                            con_name = $(this).parent().siblings('td:nth-child(3)').html();
                        };
                        var con_id = $(this).attr('data-id');
                        //客户群方
                        trace._addToGroupGroTrace(con_name,groupId,con_id);
                        //客户方
                        trace._addToGroupTrace(Iptools.DEFAULTS.userId,$('.ti-left p').html(),con_id,groupId);
                        newCon.push(Number($(this).attr('data-id')));
//            havaConId.push(Number($(this).attr('data-id')));
                        finalSelName.push($(this).parent().siblings().html());
                    };

                });
                //重新铺设客户群动态
                widget._getGroupTraceList();
                var paramData={
                    "token":Iptools.DEFAULTS.token,
                    "contactgroupId": groupId,
                    "contactIds":newCon.join()
                }
                Iptools.PostJson({
                    url:"basic/linkContactgroup",
                    data:paramData
                }).done(function(data){
                    if(data){
                        //重新捞取客户列表
                        widget._renderConTable(thData);
                        //重新铺设报表
                        widget._reportGroupNum();
                        widget._reportConChannel();
                        widget._reportConType();
                        widget._contactGroupTagsReport()

                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "添加客户成功"
                        });
                        $("#addToContactGroupModal").modal("hide");
                    }
                })
                $(this).button("reset");
                $(this).css("pointer-events","auto");
            }
        })
    },
    _gotoThisView: function(){
        widget._addEventListener({
            container: "body",
            target: ".right .demo .person",
            type: "click",
            event: function (e) {
                var me = $(this);
                var type = $(this).attr('data-type');
                var value_id = $(this).attr('data-id');
                var data = '';
                if(type == '4'){//跳到客户肖像页
                    Iptools.uidataTool._getCustomizeView({
                        nameList: "'contact_profit'"
                    }).done(function(data){
                        if (data.views.length) {
                            Iptools.uidataTool._getView({
//            async: false,
                                view: data.views[0].view
                            }).done(function(r){
                                Iptools.Tool._jumpView({
                                    view: data.views[0].view,
                                    name: r.view.name+' > '+ me.attr('data-name'),
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
//            async: false,
                                view: data.views[0].view
                            }).done(function(r){
                                Iptools.Tool._jumpView({
                                    view: data.views[0].view,
                                    name: r.view.name+' > '+ me.attr('data-name'),
                                    valueId:value_id,
                                    type: r.view.type,
                                    url: r.view.url,
                                    bread: true
                                });
                            })
                        }
                    })
                };
            }
        })
    },
    _gotoGroupEdit : function(){
        widget._addEventListener({
            container: "body",
            target: ".editBtn a",
            type: "click",
            event: function (e) {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_group_edit'"
                }).done(function(data){
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
//                async: false,
                            view: data.views[0].view
                        }).done(function(r){
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name+' > '+$('.editBtn a').attr('data-name'),
                                valueId:widget._UIDEFAULFS.groupValue,
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
    _clickChangeReportTime : function(){
        widget._addEventListener({
            container: "body",
            target: ".bottom .report-time-btn",
            type: "click",
            event: function (e) {
                var me = $(this);
                $(".report-time-btn").removeClass("report-btn-selected");
                me.addClass("report-btn-selected");
                Iptools.uidataTool._getCustomizeApplet({
                    nameList: "'Contact Group ContactnewNum Line Report'"
                }).done(function(data){
                    if (data.applets.length) {
                        Iptools.uidataTool._buildReport({
                            viewId:widget._UIDEFAULFS.currentView,
                            applet: data.applets[0].applet,
                            valueId:widget._UIDEFAULFS.groupValue,
                            container: "groupNumAcount",
                            date: (new Date()).format("yyyyMMdd"),
                            timeType: me.data("type"),
                            showReport: true
                        });
                    }
                })
            }
        })
    }
};