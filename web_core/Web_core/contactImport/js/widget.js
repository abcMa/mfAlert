/**
 * Created by sks on 2017/3/1.
 */
/**
 * Created by sks on 2017/3/1.
 */

var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        importAppletId:"",

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
        widget._startImport();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._getImportList();
        widget._bindingDomEvent();
        Iptools.Tool._pushListen("importFile_import_list", function (ms) {
            $("#imporList").data("stable")._refresh();
        });
    },
    _startImport:function(){
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".right button.startImport",
            event: function () {
                window.location.href = "upload"
            }
        })
    },
    _getImportList:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'import_records_list'"
        }).done(function(data){
            widget._UIDEFAULFS.importAppletId = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                async:false,
                applet: widget._UIDEFAULFS.importAppletId,
            }).done(function(r){
                widget._UIDEFAULFS.importRoot = r.rootLink;
                var condition = {};
                condition[widget._UIDEFAULFS.importRoot+':type'] = " like '%contact%'";
                component._table("#imporList", {
                    applet: data.applets[0].applet,
                    condition:condition,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "没有导入记录",
                    emptyClick: function () {
                    },
                    showChecks:false,
                    jumpType: "template",
                    jumpTemplate: '<a class="fa original-file" title="下载原始数据文件" href=""></a>&nbsp;&nbsp;<span class="fa fa-spin fa-spinner iconFile"></span><a class="fa wrong-file" href=""></a>',
                    //点击自己配置的按钮后的事件
                    events: [
                        {
                            target: ".s-header-bar .s-manage .upload-file",
                            type: "click",
                            event: function () {
                                window.location.href = "upload/";
                            }
                        },
                    ],
                    multiPanel: false,
                    afterLoad: function () {
                        var counts = $("#imporList .s-table .s-column span.iconFile");
                        var index = "";
                        var data=$("#imporList").data("stable").options.data;
                        //console.log(data)
                        $(counts).parent().find(".original-file").addClass("fa-file-text-o").css("color","#09f");
                        if(data && data.records){
                            counts.each(function (key, obj) {
                                index = key;
                                $(obj).parent().find(".original-file").attr("href",Iptools.DEFAULTS.serviceUrl+data.records[key][widget._UIDEFAULFS.importRoot+":file_original_path"]);
                                if(data.records[key][widget._UIDEFAULFS.importRoot+":status"]["id"] == 1){
                                    //导入中
                                }else if(data.records[key][widget._UIDEFAULFS.importRoot+":status"]["id"] == 2){
                                    //导入完成
                                    if(data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"]){
                                        if(data.records[key][widget._UIDEFAULFS.importRoot+":fail_rows"] > 0){
                                            $(obj).parent().find(".wrong-file").addClass("fa-file-o").css("color","#f66").attr({
                                                "href":Iptools.DEFAULTS.serviceUrl+data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"],
                                                "title":"下载错误数据文件"
                                            });
                                        }
                                    }
                                }else if(data.records[key][widget._UIDEFAULFS.importRoot+":status"]["id"] == 3){
                                    //导入失败
                                    if(data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"]){
                                        $(obj).parent().find(".wrong-file").addClass("fa-file-o").css("color","#f66").attr({
                                            "href":Iptools.DEFAULTS.serviceUrl+data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"],
                                            "title":"下载错误数据文件"
                                        });
                                    }
                                }
                            })
                        }
                        $(counts).remove();
                    }
                })
            });
        })
    },
}
