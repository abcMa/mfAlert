
var widget = {};
widget = {
    _UIDEFAULFS: {
        equal:0
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {

    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        Iptools.DEFAULTS.pageSize = 10;
        widget._bindingDomEvent();
        widget._initPage({
            pageNow: 1
        });
        Iptools.Tool._pushListen("contact_list", function (ms) {
            widget._initPage();
        });
        Iptools.Tool._pushListen("contact_edit", function (ms) {
            widget._initPage();
        });
        Iptools.Tool._pushListen("importFile_import_list", function (ms) {
            widget._initPage();
        });
    },
    _initPage: function () {
        Iptools.uidataTool._getView({
            view: Iptools.DEFAULTS.currentView,
        }).done(function (data) {
            if (data) {
                Iptools.DEFAULTS.currentViewApplet = data.view.primary;
                var viewName = data.view.name;
                var emptyWord = "";
                if(viewName == '我的客户'){
                    emptyWord = '没有指派给你的客户';
                }else if(viewName == '全部客户'){
                    emptyWord = '没有客户，可通过Excel表格批量导入客户';
                }
                Iptools.uidataTool._getApplet({
                    applet: data.view.primary
                }).done(function (s) {
                    var root = s.rootLink;
                    //       --------------最重要的是applet       options.primary
                    component._table("#contentPanel", {
                        applet:data.view.primary,
                        emptyImage: "../Content/Image/nodetail.png",
                        emptySize: "150",
                        emptyText: emptyWord,
                        emptySearch:"没有搜索到数据，请更换关键词后再次搜索",
                        emptyClick: function () {

                        },
                        dataModify: function (rs) {
                            //console.log(rs)
                            var promise = $.Deferred();
                            if (rs) {
                                if (rs.columns && rs.columns.length) {
                                    rs.columns.splice(4, 0, {
                                        type: "text",
                                        column: rs.rootLink + ":contactCount",
                                        name: "标签",
                                    });
                                    if (rs.data && rs.data.records && rs.data.records.length) {
                                        for (var i = 0; i < rs.data.records.length; i++) {
                                            var rec = rs.data.records[i];
                                            rec[rs.rootLink + ":contactCount"] = "<span class='fa fa-spin fa-spinner groupCount'></span>";
                                        }
                                    }
                                }
                            }
                            promise.resolve(rs);
                            return promise;
                        },
                        afterLoad: function(){
                            var counts = $("#contentPanel .s-table .s-column span.groupCount");
                            counts.each(function (key, obj) {
                                var data = $("#contentPanel").data("stable").options.data.records[$(obj).closest(".s-cell").attr("data-index")];
                                if(data["contact:id"]){
                                    Iptools.GetJson({
                                        url:"basic/contactTagLinks",
                                        data:{
                                            token:Iptools.DEFAULTS.token,
                                            contactId:data["contact:id"]
                                        }
                                    }).done(function(w){
                                        if (w) {
                                            var count;
                                            if( w.length>0){
                                                count = [];
                                                for(var i = 0;i< w.length;i++){
                                                    count.push(w[i].tagValue);
                                                }
                                                var countObj = count.toString()
                                                $(obj).before(countObj);
                                                $(obj).remove();
                                            }else{
                                                count ="无标签";
                                                $(obj).before(count);
                                                $(obj).remove();
                                            }
                                        }
                                    })
                                }
                            });
                            var width = "";
                            $('.s-column').each(function(index,ele){
                                var content = $(this).find('.header .content');
                                if(content.hasClass('sort')){
                                    widget._UIDEFAULFS.equal = index;
                                    width = $(this).find('.header').width();
                                    return false;
                                }
                            });
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
                                        element: ".btn-group .dropdown-toggle",
                                        title: "客户筛选",
                                        placement: "bottom",
                                        content: "根据姓名、类型等条件筛选客户",
                                        onShown: function () {
                                            $(".tour-step-background").css("width","63px").css("height","33px").css("border-radius","4px");
                                        }
                                    },
                                    {
                                        element: ".s-column:nth-child("+(widget._UIDEFAULFS.equal+1)+") .header",
                                        title: "客户排序",
                                        placement: "bottom",
                                        content: "带有上下三角的列，可点击进行排序",
                                        onShown: function () {
                                            $(".tour-step-background").css("width",width).css("height","43px").css("border-radius","0px");
                                        }
                                    },
                                    {
                                        element: ".s-manage-freeze .s-cell:nth-child(2)",
                                        title: "查看客户画像",
                                        placement: "bottom",
                                        content: "点击操作一列中的图标，或客户姓名，即可进入客户画像页面，查看客户详细信息  ",
                                        onShown: function () {
                                            $(".tour-step-background").css("width","66px").css("height","41px").css("border-radius","0px");
                                        }
                                    }
                                ],
                                onEnd:function(){
                                    $(".commonBtn").removeClass("disabled");
                                    $('.s-cell.header').removeClass("disabled");
                                    $('.s-cell.vlink').removeClass("disabled");
                                }
                            });
                            if(viewName == '我的客户'){
                                if(window.localStorage.getItem("myContact_tour")!="yes"){
                                    tour.init();
                                    window.localStorage.setItem("myContact_tour","yes");
                                    $(".commonBtn").addClass("disabled");
                                    $('.s-cell.header').addClass("disabled");
                                    $('.s-cell.vlink').addClass("disabled");
                                    tour.start(true);
                                    tour.goTo(0);
                                }
                            }else if(viewName == '全部客户'){
                                if(window.localStorage.getItem("allContact_tour")!="yes"){
                                    tour.init();
                                    window.localStorage.setItem("allContact_tour","yes");
                                    $(".commonBtn").addClass("disabled");
                                    $('.s-cell.header').addClass("disabled");
                                    $('.s-cell.vlink').addClass("disabled");
                                    tour.start(true);
                                    tour.goTo(0);
                                }
                            }

                        },
                        showChecks:false,
//                        jumpType: "template",
//                        jumpTemplate: "<a class='contactDetail'><span class='fa fa-sign-in' title='查看客户画像'></span></a>",
                        //点击自己配置的按钮后的事件
//                        events: [{
//                            target: ".contactDetail",
//                            type: "click",
//                            event: function () {
//                                var me=$(this);
//                                //需要跳转到新建的view时，拿到客户新建的view
//                                Iptools.uidataTool._getCustomizeView({
//                                    nameList: "'contact_profit'"
//                                }).done(function(data){
//                                    var id=me.parent().data("key");
//                                    var index = me.parent().attr('data-index');
//                                    var name= "";
//                                    if($("#contentPanel").data("stable").options.data.records[index][root+":title"]){
//                                        name = $("#contentPanel").data("stable").options.data.records[index][root+":title"];
//                                    };
////                                        console.log(id);
//                                    if (data.views.length) {
//                                        Iptools.uidataTool._getView({
//                                            view: data.views[0].view
//                                        }).done(function(r){
//                                            Iptools.Tool._jumpView({
//                                                view: data.views[0].view,
//                                                name: r.view.name + '->'+name,
//                                                valueId:id,
//                                                type: r.view.type,
//                                                url: r.view.url,
//                                                bread: true
//                                            });
//                                        })
//                                    }
//                                })
//                            }
//                        }]
                    });
                })
            }
        })
    }



//    --------------------------------------------------------带标签的铺设-----------------------------------------------------------
//之前的逻辑是（触发搜索的条件都是submit，但是现在版本还不确定，标签可能会变成面板选择）
// 1:选定标签后，回车后，获得按标签搜索的condition----_getConditionSearchByTag
//2:然后_initpage-------一路到了 _initListApplet   走--标签的值不为空的---分支，铺设标签搜索的结果

}