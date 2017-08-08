/**
 * Created by sks on 2017/8/6.
 */

var widget = {};
widget = {
    _UIDEFAULFS: {
        carTypeDetailApplet:"",
        carTypeDetailRoot:"",
        carTypeId:"",
        partsTypeDetailApplet:"",
        partsTypeDetailRoot:"",
        partsTypeId:""
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        //widget._delCarType();
        //widget._delPartsType()
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._getCarTypeAppletAndRoot();
        widget._getpartsTypeAppletAndRoot();
        widget._getCarType();
        widget._getpartsType();
    },
//------------------------------------事件-------------------------------
    /*获得车辆类型详情的applet和root*/
    _getCarTypeAppletAndRoot:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'car-type-detail'"
        }).done(function(data) {
            if(data && data.applets){
                widget._UIDEFAULFS.carTypeDetailApplet = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:widget._UIDEFAULFS.carTypeDetailApplet
                }).done(function(w){
                    if(w){
                        widget._UIDEFAULFS.carTypeDetailRoot = w.rootLink;
                    }
                })
            }
        })
    },
    _getCarType:function(){
        Iptools.Tool._pushListen("car_type_list", function (ms) {
            if(ms.channel == "car_type_list"){
                widget._getCarType();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'car_type_list'"
        }).done(function(data) {
            Iptools.uidataTool._getApplet({
                applet: widget._UIDEFAULFS.carTypeDetailApplet
            }).done(function(s) {
                var root = s.rootLink;//bc_modify_log
                component._table("#carType", {
                    asyan:false,
                    applet: data.applets[0].applet,
                    emptyImage: "../../../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: '暂无车辆类型',
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    showChecks: true,
                    jumpType: "template",
                    jumpTemplate: "<a class='edit-car-type' style='margin-right:10px;'><span class='fa fa-pencil-square-o'></span></a>",
                    dataModify: function (r) {
                        var promise = $.Deferred();
                        if (r) {
                            r.columns.splice(1, 0, {
                                type: "text",
                                column: root + ":count",
                                name: "编号"
                            });
                        };
                        if (r.data && r.data.records && r.data.records.length) {
                            $.each(r.data.records,function(key,obj){
                                if(key+1 < 10){
                                    obj[root + ":count"] = "<span>0"+(key+1)+"</span>";
                                }else{
                                    obj[root + ":count"] = "<span>"+(key+1)+"</span>";
                                }

                            });
                        }
                        promise.resolve(r);
                        return promise;
                    },
                    events:[
                        {
                            target: ".add-car-type",
                            type: "click",
                            event: function (e) {
                                var a = component._unit("#car-type",{
                                    applet: widget._UIDEFAULFS.carTypeDetailApplet,
                                    type:"modal",
                                    modal: {
                                        width: 600,
                                        maxHeight: 600,
                                        title:"创建车辆类型",
                                    },
                                    mode:'new',
                                    afterSave:function(r){
                                        var promise= $.Deferred();
                                        $("#carType").data("stable")._refresh();
                                        promise.resolve(r);
                                        return promise;
                                    }
                                });
                            }
                        },
                        {
                            target: ".edit-car-type",
                            type: "click",
                            event: function (e) {
                                var data = $("#carType").data("stable").options.data.records[0];
                                var id = data[widget._UIDEFAULFS.carTypeDetailRoot+":id"]
                                var a = component._unit("#edit-car-type-detail",{
                                    applet: widget._UIDEFAULFS.carTypeDetailApplet,
                                    mode:'edit',
                                    type:"modal",
                                    valueId:id,
                                    modal:{
                                        width: 600,
                                        maxHeight: 600,
                                        title:"编辑车辆类型",
                                    },
                                    afterSave:function(r){
                                        var promise= $.Deferred();
                                        $("#carType").data("stable")._refresh();
                                        promise.resolve(r);
                                        return promise;
                                    }
                                });
                            }
                        },
                        //{
                        //    target: ".del-car-type",
                        //    type: "click",
                        //    event: function (e) {
                        //        $('#myModalRate .sureDelRate').addClass("del-car-btn");
                        //        var me = $(this);
                        //        $('#myModalRate').modal('show');
                        //        var index = me.parent().attr('data-index');
                        //        var data = $("#carType").data("stable").options.data.records[index];
                        //        var title = "";
                        //        if(data[widget._UIDEFAULFS.carTypeDetailRoot+":value"]){
                        //            title = data[widget._UIDEFAULFS.carTypeDetailRoot+":value"];
                        //        }
                        //        $('#myModalRate .modal-body').html('确认删除此车辆类型-('+title+')？');
                        //        widget._UIDEFAULFS.carTypeId = me.parent().data("key");
                        //    }
                        //}
                    ]

                });
            })
        })
    },
    _delCarType:function(){
        //console.log(id)
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".del-car-btn",
            event:function(){
                var me = $(this);
                me.css({"pointer-events":"none"});
                me.button("loading");
                Iptools.uidataTool._deleteAppletData({
                    para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget._UIDEFAULFS.carTypeDetailApplet
                    + "&valueIds=" + widget._UIDEFAULFS.carTypeId
                }).done(function (data) {
                    if(data && data.retcode == 'ok'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "删除成功"
                        });
                        me.css({"pointer-events":"auto"});
                        me.button("reset");
                        Iptools.uidataTool._pushMessage({
                            channel: "car_type_list"
                        });
                        $('#myModalRate .sureDelRate').removeClass("del-car-btn");
                        $("#carType").data("stable")._refresh();
                        $('#myModalRate').modal('hide');
                    }
                });
            }
        })
    },
    _getpartsTypeAppletAndRoot:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'parts_type_detail'"
        }).done(function(data) {
            if(data && data.applets){
                widget._UIDEFAULFS.partsTypeDetailApplet = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:widget._UIDEFAULFS.partsTypeDetailApplet
                }).done(function(w){
                    if(w){
                        widget._UIDEFAULFS.partsTypeDetailRoot = w.rootLink;
                    }
                })
            }
        })
    },
    _getpartsType:function(){
        Iptools.Tool._pushListen("parts_type_list", function (ms) {
            if(ms.channel == "parts_type_list"){
                widget._getpartsType();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'part_type_list'"
        }).done(function(data) {
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet
            }).done(function(s) {
                var root = s.rootLink;//bc_modify_log
                component._table("#partsType", {
                    applet: data.applets[0].applet,
                    emptyImage: "../../../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: '暂无配件类型',
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    showChecks: true,
                    jumpType: "template",
                    jumpTemplate: "<a class='edit-parts-type' style='margin-right:10px;'><span class='fa fa-pencil-square-o'></span></a>",
                    dataModify: function (r) {
                        var promise = $.Deferred();
                        if (r) {
                            r.columns.splice(1, 0, {
                                type: "text",
                                column: root + ":count",
                                name: "编号"
                            });
                        };
                        if (r.data && r.data.records && r.data.records.length) {
                            $.each(r.data.records,function(key,obj){
                                if(key+1 < 10){
                                    obj[root + ":count"] = "<span>0"+(key+1)+"</span>";
                                }else{
                                    obj[root + ":count"] = "<span>"+(key+1)+"</span>";
                                }

                            });
                        }
                        promise.resolve(r);
                        return promise;
                    },
                    events:[
                        {
                            target: ".add-part-type",
                            type: "click",
                            event: function (e) {
                                var a = component._unit("#parts-type",{
                                    applet: widget._UIDEFAULFS.partsTypeDetailApplet,
                                    type:"modal",
                                    mode:'new',
                                    modal:{
                                        width: 600,
                                        maxHeight: 600,
                                        title:"创建配件类型",
                                    },
                                    afterSave:function(r){
                                        var promise= $.Deferred();
                                        $("#partsType").data("stable")._refresh();
                                        promise.resolve(r);
                                        return promise;
                                    }
                                });
                            }
                        },
                        {
                            target: ".edit-parts-type",
                            type: "click",
                            event: function (e) {
                                var data = $("#partsType").data("stable").options.data.records[0];
                                var id = data[widget._UIDEFAULFS.partsTypeDetailRoot+":id"]
                                var a = component._unit("#edit-parts-type-detail",{
                                    applet: widget._UIDEFAULFS.partsTypeDetailApplet,
                                    mode:'edit',
                                    type:"modal",
                                    valueId:id,
                                    modal:{
                                        width: 600,
                                        maxHeight: 600,
                                        title:"编辑配件类型",
                                    },
                                    afterSave:function(r){
                                        var promise= $.Deferred();
                                        $("#partsType").data("stable")._refresh();
                                        promise.resolve(r);
                                        return promise;
                                    }
                                });
                            }
                        },
                        //{
                        //    target: ".del-parts-type",
                        //    type: "click",
                        //    event: function (e) {
                        //        $('#myModalRate .sureDelRate').addClass("del-parts-btn");
                        //        var me = $(this);
                        //        $('#myModalRate').modal('show');
                        //        var index = me.parent().attr('data-index');
                        //        var data = $("#partsType").data("stable").options.data.records[index];
                        //        var title = "";
                        //        if(data[widget._UIDEFAULFS.partsTypeDetailRoot+":value"]){
                        //            title = data[widget._UIDEFAULFS.partsTypeDetailRoot+":value"];
                        //        }
                        //        $('#myModalRate .modal-body').html('确认删除此配件类型-('+title+')？');
                        //        widget._UIDEFAULFS.partsTypeId = me.parent().data("key");
                        //    }
                        //}
                    ]

                });
            })
        })
    },
    _delPartsType:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".del-parts-btn",
            event:function(){
                var me = $(this);
                me.css({"pointer-events":"none"});
                me.button("loading");
                Iptools.uidataTool._deleteAppletData({
                    para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget._UIDEFAULFS.partsTypeDetailApplet
                    + "&valueIds=" + widget._UIDEFAULFS.partsTypeId
                }).done(function (data) {
                    if(data.retcode == 'ok'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "删除成功"
                        });
                        me.css({"pointer-events":"auto"});
                        me.button("reset");
                        Iptools.uidataTool._pushMessage({
                            channel: "parts_type_list"
                        });
                        $('#myModalRate .sureDelRate').removeClass("del-parts-btn");
                        $("#partsType").data("stable")._refresh();
                        $('#myModalRate').modal('hide');
                    }
                });
            }
        })
    }
}
