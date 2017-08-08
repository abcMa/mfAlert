/**
 * Created by sks on 2017/5/12.
 */
/*搜索全部客户的代码*/
var Comwidget = {};
Comwidget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        listPageSize: 5,
        liLength:"",
        contactListApplet:"",
        contactListRootId:"",
        allConPageSize:10,
        haveSelectedContact:[],
    },
    _rebuildUiDefaults: function (options) {
        Comwidget._UIDEFAULFS = Iptools.Tool._extend(Comwidget._UIDEFAULFS, options);
    },
    /*
     container :
     type :
     target :
     event :
     */
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        //Comwidget._clickAddOtherContact();
        Comwidget._focusConSearch();
        Comwidget._contactMultiSearch();
        Comwidget._clickSelectDemoLi();
        Comwidget._focusOwnerSearch();
        Comwidget._ownertMultiSearch();
        Comwidget._clickSelectOwnerDemoLi();
    },
    _bindingEventAfterLoad: function () {

    },
    _init: function () {
        Comwidget._bindingDomEvent();
        Comwidget._getContactApplet();
        Comwidget._getAllConListData();
        Comwidget._showOwner();
        Comwidget._getAllEmply();//owner
        Comwidget._getAllEmplyForInsure();//保险专员
        Comwidget._getAllEmplyForAgent();//客服专员
    },
    //添加客户
    //点击添加另外一个客户
    _clickAddOtherContact:function(){
        Comwidget._addEventListener({
            container:"body",
            type:"click",
            target:".add_contant_btn button,.s-header-bar .add-deal",
            event:function(){
                $('.input-group .searchConInput').val("");
                //加载客户list
                Comwidget._getContactApplet();
                Comwidget._getAllConListData();
            },
        })
    },
    //获取applet
    _getContactApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list_all'"
        }).done(function(r) {
            Comwidget._UIDEFAULFS.contactListApplet = r.applets[0].applet;//2866
            Iptools.uidataTool._getApplet({
                applet:r.applets[0].applet
            }).done(function(data) {
                Comwidget._UIDEFAULFS.contactListRootId = data.rootLink;//39
            });
        });
    },
    //搜索所有的客户
    _getAllConListData: function(param){
        Iptools.uidataTool._getUserlistAppletData({
            appletId: Comwidget._UIDEFAULFS.contactListApplet,
            pageNow:1,
            condition:param,
            pageSize:Comwidget._UIDEFAULFS.allConPageSize
        }).done(function(s) {
            //console.log(s)
            $('.conListBySearch').html("");
            $.each(s.data.records, function (key, obj) {
                var RootId = Comwidget._UIDEFAULFS.contactListRootId;
                var name = obj[RootId + ':title'] ? obj[RootId + ':title'] : "";
                var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                //if(Comwidget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
                var html = '<li role="presentation" class="demoLi">'+
                    '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                    '</li>';
                $('.conListBySearch').append(html);
                //};
            });
        })
    },
    //聚焦搜索的框
    _focusConSearch: function(){
        Comwidget._addEventListener({
            container: "body",
            target: ".input-group .searchConInput",
            type: "click",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                Comwidget._getContactApplet();
                Comwidget._getAllConListData();
                var me=$(this);
                me.parent().find(".input-group-btn").addClass("open");
                me.parent().find("button").attr("aria-expanded", "true");
            }
        });
    },
    //条件搜索
    _contactMultiSearch: function(){
        Comwidget._addEventListener({
            container: "body",
            target: ".input-group .searchConInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = Comwidget._UIDEFAULFS.contactListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"'+rootId +':phone":" like \'%'+inputText+'%\'"}';
                }else{
                    condition = '{"'+rootId+':title":" like \'%'+inputText+'%\'"}';
                };
                Comwidget._getAllConListData(condition);
                return false;
            }
        });
    },
    //选择搜索出来的客户
    _clickSelectDemoLi: function(){
        Comwidget._addEventListener({
            container: "body",
            target: "ul.conListBySearch .demoLi",
            type: "click",
            event: function () {
                var me=$(this);
                //Comwidget._UIDEFAULFS.mergeConArr.push(Number(me.find('a').attr('data-id')));
                $('.form-control.searchConInput').val(me.find('a').html());
                $('.form-control.searchConInput').attr("data-id",me.find('a').attr("data-id"));
                var selText = me.find('a').html();
                var html = '<li><span><span class="head-img"><img src="../../Content/Image/defaultHead.svg" alt=""></span><span class="contant-name">'+selText.substr(0,selText.indexOf("-"))+'</span><span class="icon-remove"></span></span></li>'
                $(".selected_contant_list ul").append(html);
            }
        });
    },
    //所有者显示
    _showOwner:function(){
        Iptools.GetJson({
            url: "basic/getEmployee",
            data: {
                token: Iptools.DEFAULTS.token,
                id:Iptools.getDefaults({ key: "selectUser" })
            },
        }).done(function (r) {
            //console.log(r)
            $("#owner").val(r.name);
            $("#owner").attr("data-id", r.id);
            $("#assignedInsurance").val(r.name);
            $("#assignedInsurance").attr("data-id", r.id);
            $("#agent").val(r.name);
            $("#agent").attr("data-id", r.id);
        })
    },
    //聚焦到所有者的输入框时
    _focusOwnerSearch: function(){
        widget._addEventListener({
            container: "body",
            target: ".input-group #owner,#assignedInsurance,#agent",
            type: "click",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                var me=$(this);
                $('.input-group-owner .input-group-btn,.input-group-insure .input-group-btn,.input-group-agent .input-group-btn').removeClass("open");
                $('.input-group-owner button,.input-group-insure button,.input-group-agent button').attr("aria-expanded", "false");
                me.parent().find(".input-group-btn").addClass("open");
                me.parent().find("button").attr("aria-expanded", "true");
            }
        });
    },
    //搜索该登录者权限下的员工
    _getAllEmply:function(param){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'employee_list'"
        }).done(function(r) {
            widget._UIDEFAULFS.employListApplet = r.applets[0].applet;
            //console.log(widget._UIDEFAULFS.employListApplet)
            Iptools.uidataTool._getApplet({
                applet:r.applets[0].applet
            }).done(function(data) {
                widget._UIDEFAULFS.employListRootId = data.rootLink;
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: widget._UIDEFAULFS.employListApplet,
                    pageNow:1,
                    condition:param,
                    pageSize:widget._UIDEFAULFS.allConPageSize
                }).done(function(s) {
                    $('.searchOwnerListInput').html("");
                    //console.log(s)
                    $.each(s.data.records, function (key, obj) {
                        var RootId = widget._UIDEFAULFS.employListRootId;
                        var name = obj[RootId + ':name'] ? obj[RootId + ':name'] : "";
                        var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                        //if(widget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
                        var html = '<li role="presentation" class="demoLi">'+
                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                            '</li>';
                        $('.searchOwnerListInput').append(html);
                        //};
                    });
                })
            });
        });
    },
    _getAllEmplyForInsure:function(param){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'employee_list'"
        }).done(function(r) {
            widget._UIDEFAULFS.employListApplet = r.applets[0].applet;
            //console.log(widget._UIDEFAULFS.employListApplet)
            Iptools.uidataTool._getApplet({
                applet:r.applets[0].applet
            }).done(function(data) {
                widget._UIDEFAULFS.employListRootId = data.rootLink;
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: widget._UIDEFAULFS.employListApplet,
                    pageNow:1,
                    condition:param,
                    pageSize:widget._UIDEFAULFS.allConPageSize
                }).done(function(s) {
                    $('.searchInsureListInput').html("");
                    //console.log(s)
                    $.each(s.data.records, function (key, obj) {
                        var RootId = widget._UIDEFAULFS.employListRootId;
                        var name = obj[RootId + ':name'] ? obj[RootId + ':name'] : "";
                        var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                        //if(widget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
                        var html = '<li role="presentation" class="demoLi">'+
                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                            '</li>';
                        $('.searchInsureListInput').append(html);
                        //};
                    });
                })
            });
        });
    },
    _getAllEmplyForAgent:function(param){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'employee_list'"
        }).done(function(r) {
            widget._UIDEFAULFS.employListApplet = r.applets[0].applet;
            //console.log(widget._UIDEFAULFS.employListApplet)
            Iptools.uidataTool._getApplet({
                applet:r.applets[0].applet
            }).done(function(data) {
                widget._UIDEFAULFS.employListRootId = data.rootLink;
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: widget._UIDEFAULFS.employListApplet,
                    pageNow:1,
                    condition:param,
                    pageSize:widget._UIDEFAULFS.allConPageSize
                }).done(function(s) {
                    $('.searchAgentListInput').html("");
                    //console.log(s)
                    $.each(s.data.records, function (key, obj) {
                        var RootId = widget._UIDEFAULFS.employListRootId;
                        var name = obj[RootId + ':name'] ? obj[RootId + ':name'] : "";
                        var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                        //if(widget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
                        var html = '<li role="presentation" class="demoLi">'+
                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                            '</li>';
                        $('.searchAgentListInput').append(html);
                        //};
                    });
                })
            });
        });
    },
    //所有者的条件搜索
    _ownertMultiSearch: function(){
        Comwidget._addEventListener({
            container: "body",
            target: ".input-group #owner,.input-group #assignedInsurance,.input-group #agent",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var id = $(this).attr('id');
//                console.log(id)
                var inputText = $(this).val();
                var rootId = widget._UIDEFAULFS.employListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"'+rootId +':phone":" like \'%'+inputText+'%\'"}';
                }else{
                    condition = '{"'+rootId+':name":" like \'%'+inputText+'%\'"}';
                };
                if(id == 'owner'){
                    Comwidget._getAllEmply(condition);
                }else if(id =='assignedInsurance'){
                    Comwidget._getAllEmplyForInsure(condition);
                }else if(id == "agent"){
                    Comwidget._getAllEmplyForAgent(condition);
                }

                return false;
            }
        });
    },
    _clickSelectOwnerDemoLi: function(){
        widget._addEventListener({
            container: "body",
            target: "ul.searchOwnerListInput .demoLi,ul.searchInsureListInput .demoLi,ul.searchAgentListInput .demoLi",
            type: "click",
            event: function () {
                var me=$(this);
                me.parent().parent().siblings('.searchOwnerInput').val(me.find('a').html()).attr("data-id",me.find('a').attr("data-id"));
                if($("#formTask").size() > 0){
                    $("#formTask").data("bootstrapValidator").updateStatus($('#owner').attr("name"), "NOT_VALIDATED").validateField($('#owner').attr("name"));
                };
//                console.log(me.parent().parent().siblings('.searchOwnerInput').attr('data-id'));
//                $('.form-control.searchOwnerInput').val(me.find('a').html());
//                $('.form-control.searchOwnerInput').attr("data-id",me.find('a').attr("data-id"));
            }
        });
    },
}