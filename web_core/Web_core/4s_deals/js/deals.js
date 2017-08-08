/**
 * Created by sks on 2017/5/5.
 */
var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        dealsListApplet:"", //交易列表的applet
        dealsListRootId:"", //交易列表的rootid
        dealsDetailInsuranceApplet:"",
        dealsDetailInsuranceRootId:"",
        dealsArray:[]
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
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

    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._getDealsList(); //获取交易列表
        widget._bindingDomEvent();
    },
    //获取交易列表的list页面
    _getDealsList:function(){
        Iptools.Tool._pushListen("deals_list", function (ms) {
            if(ms.channel == "deals_list"){
                widget._getDealsList();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'deal_list'"
        }).done(function(data){
            widget._UIDEFAULFS.dealsListApplet = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:widget._UIDEFAULFS.dealsListApplet
            }).done(function (s) {
                if(s && s.rootLink){
                    widget._UIDEFAULFS.dealsListRootId = s.rootLink;
                    component._table("#deals", {
                        applet: data.applets[0].applet,
                        emptyImage: "../Content/Image/nodetail.png",
                        emptySize: "150",
                        emptyText: "没有线索数据",
                        emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                        emptyClick: function () {

                        },
                        showChecks:true,
                        jumpType: "template",
                        jumpTemplate: "<a class='deals-detail' title='点击进入交易详情'><span class='fa fa-pencil-square-o'></span></a>",
                        //点击自己配置的按钮后的事件
                        events: [
                            {
                                target: ".deals-detail",
                                type: "click",
                                event: function () {
                                    var me=$(this);
                                    //需要跳转到新建的view时，拿到客户新建的view
                                    Iptools.uidataTool._getCustomizeView({
                                        nameList: "'deals_detail_view'"
                                    }).done(function(data){
                                        var id=me.parent().data("key");
                                        var index = me.parent().attr('data-index');
                                        var name= "";
                                        if($("#deals").data("stable").options.data.records[index][widget._UIDEFAULFS.dealsListRootId+":title"]){
                                            name = $("#deals").data("stable").options.data.records[index][widget._UIDEFAULFS.dealsListRootId+":title"];
                                        };
                                        if (data.views.length) {
                                            Iptools.uidataTool._getView({
                                                view: data.views[0].view
                                            }).done(function(r){
                                                Iptools.Tool._jumpView({
                                                    view: data.views[0].view,
                                                    name: r.view.name + '->'+name,
                                                    valueId:id,
                                                    type: r.view.type,
                                                    url: r.view.url,
                                                    bread: true
                                                });
                                            })
                                        }
                                    })
                                }
                            },
                            {
                                target: ".assign",
                                type: "click",
                                event: function () {
                                    var index = $("#deals").data("stable")._getCheckIndex();
                                    var data = $("#deals").data("stable").options.data;
                                    var dealsArray = [];
                                    for(var i = 0;i < index.length;i++){
                                        var dealsData = data.records[index[i]];
                                        dealsArray.push(dealsData[widget._UIDEFAULFS.dealsListRootId+":id"]);
                                    }
                                    Iptools.uidataTool._getCustomizeApplet({
                                        async:false,
                                        nameList: "'deals_detail_insurance'"
                                    }).done(function(data) {
                                        widget._UIDEFAULFS.dealsDetailInsuranceApplet = data.applets[0].applet;
                                        var a = component._unit("#assign-owner", {
                                            applet: widget._UIDEFAULFS.dealsDetailInsuranceApplet,
                                            mode:'new',
                                            type:"modal",
                                            modal:{
                                                title:"批量指派",
                                                onSave:function(){
                                                    var personId = a.data("unit").options.DataCurrentSets["deal:responsible_person"];
                                                    widget._dealsForOwner(personId,dealsArray);
                                                    $("#"+a.data("unit").options.modal.id).modal("hide");
                                                }
                                            },
                                            cusControls: {

                                            },
                                        });
                                    })
                                }
                            },
                            {
                                target: ".refresh-btn",
                                type: "click",
                                event: function () {
                                    Iptools.PostJson({
                                        url:"/4s/createDeal",
                                        data:{
                                            token:Iptools.DEFAULTS.token
                                        }
                                    }).done(function(r){
                                        if(r && r.retcode == "ok"){
                                            $("#deals").data("stable")._refresh();
                                        }
                                    })
                                }
                            },
                        ],
                        dataModify: null,
                        mainSecOnshow:function(){
                            $("#deals").data("stable").options.condition={};
                            $("#deals").data("stable")._refresh();
                        },
                        multiPanel: true,
                        panels: [
                            {
                                name: "跟进中",
                                type:"button",
                                icon: "fa-th",
                                onShow: function () {
                                    $("#deals").data("stable").options.condition={"deal:status":" =\'1\'"};
                                    $("#deals").data("stable")._refresh();
                                }
                            },
                            {
                                name: "成功",
                                type:"button",
                                icon: "fa-th",
                                onShow: function () {
                                    $("#deals").data("stable").options.condition={"deal:status":" =\'2\'"};
                                    $("#deals").data("stable")._refresh();
                                }
                            },
                            {
                                name: "战败",
                                type:"button",
                                icon: "fa-th",
                                onShow: function () {
                                    $("#deals").data("stable").options.condition={"deal:status":" =\'3\'"};
                                    $("#deals").data("stable")._refresh();
                                }
                            }
                        ],
                        searchEvent: function (condition) {
                            if (condition) {
                                $("#test_panel").append(JSON.stringify(condition) + "<br/>");
                            }
                        }
                    })
                }
            })
        })
    },
    //批量生成线索
    /*
     ** id:指的负责人id
     ** array:保险id的数组
     * */
    _dealsForOwner:function(id,arry){
        Iptools.PostJson({
            url: "4s/batchAssignDeal",
            data: {
                token: Iptools.DEFAULTS.token,
                responsiblePerson:id,
                dealIds:arry.join()
            }
        }).done(function (r) {
            if(r && r.retcode == "ok"){
                Iptools.Tool.pAlert({
                    type: "info",
                    title: "系统提示：",
                    content: "线索批量指派负责人成功",
                    delay: 1000
                });
                Iptools.uidataTool._pushMessage({
                    channel: "deals_list"
                });
            }
        });
    },
}