/**
 * Created by sks on 2017/5/5.
 */
var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        pipelineListApplet:"", //销售阶段的applet
        pipelineListRootId:"",//销售阶段的rootID
        stageListApplet:"", //交易阶段的applet
        stageListRootId:"", //交易阶段的rootID
        dealSDetailApplet:"", //交易详情的applet
        dealSDetailRoot:"", //交易详情的rootid
        dealsListApplet:"", //交易列表的applet
        dealsListRootId:"", //交易列表的rootid
        stageArray : [],//获取交易阶段数组
        stageIdArray:[], //获取交易阶段id的数组
        dealParamJson:"",
        contactParamJson:""
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
        widget._addNewDeals();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        //var d = new Date();
        //var year = d.getFullYear();
        //var month = (d.getMonth()+1) > 10 ? (d.getMonth()+1) : "0"+(d.getMonth()+1)
        //var str = year+"-"+month+"-"+d.getDate();
        widget._check();
        widget._getDealsApplet();//获取新建交易相关的applet
        widget._getDealsList(); //获取交易列表
        widget._getStage();//获取交易阶段
        widget._getDealsForStage();  //获取交易阶段对应的交易
        widget._bindingDomEvent();
        $('#newDeals').on('hide.bs.modal', function (e) {
            $("#deals-modal").data('bootstrapValidator').resetForm(true);
        });
    },
    //获取交易列表的list页面
    _getDealsList:function(){
        Iptools.Tool._pushListen("standart_deals_list", function (ms) {
            if(ms.channel == "standart_deals_list"){
                widget._getDealsList();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'deal_list'"
        }).done(function(data){
            widget._UIDEFAULFS.dealsListApplet = data.applets[0].applet;
            component._table("#deals-list", {
                applet: data.applets[0].applet,
                emptyImage: "../Content/Image/emptyReport.png",
                emptySize: "150",
                emptyText: "没有线索记录",
                showChecks: false,
                emptyClick: function () {

                },
                jumpType: "template",
                jumpTemplate: "<a class='deal-detail' title='点击进入线索详情页面'><span class='fa fa-pencil-square-o'></span></a>",
                //点击自己配置的按钮后的事件
                events: [
                    {
                        target: ".s-header-bar .s-manage .add-deals",
                        type: "click",
                        event: function () {
                            $('#newDeals').modal('show');
                            $('#newDeals .commonBtn').addClass("add-new-deals");
                        }
                    },
                    {
                        target: ".deal-detail",
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
                                if($("#deals-list").data("stable").options.data.records[index][widget._UIDEFAULFS.dealSDetailRoot+":title"]){
                                    name = $("#deals-list").data("stable").options.data.records[index][widget._UIDEFAULFS.dealSDetailRoot+":title"];
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
                    }
                ],
                multiPanel: false,
                panels: [
                    {
                        name: "面板",
                        icon: "icon-th",
                        container: "test_panel"
                    }],
                searchEvent: function (condition) {
                    if (condition) {
                        $("#test_panel").append(JSON.stringify(condition) + "<br/>");
                    }
                }
            })
        }).then(function(){

        })
    },
    //获取销售流程applet
    //_getPipeline: function(){
    //    Iptools.uidataTool._getCustomizeApplet({
    //        nameList: "'deal_pipeline_list'"
    //    }).done(function(r) {
    //        widget._UIDEFAULFS.pipelineListApplet = r.applets[0].applet;
    //        Iptools.uidataTool._getApplet({
    //            applet:r.applets[0].applet
    //        }).done(function(data) {
    //            widget._UIDEFAULFS.pipelineListRootId = data.rootLink;
    //            Iptools.uidataTool._getUserlistAppletData({
    //                appletId:widget._UIDEFAULFS.pipelineListApplet,
    //            }).done(function(r){
    //                if(r && r.data){
    //                    for(var i = 0;i < r.data.records.length;i++){
    //                        var pipelineRoot = r.data.records[i];
    //                        var id = widget._UIDEFAULFS.pipelineListRootId+':id';
    //                        var title = widget._UIDEFAULFS.pipelineListRootId+':title';
    //                        var html = "<option value="+pipelineRoot[id]+">"+pipelineRoot[title]+"</option>";
    //                        $(".pipeline-list").append(html);
    //                    }
    //                }
    //            })
    //        });
    //    });
    //},
    //获得交易阶段
    _getStage: function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'deal_stage_list'"
        }).done(function(r) {
            widget._UIDEFAULFS.stageListApplet = r.applets[0].applet;
            Iptools.uidataTool._getApplet({
                async:false,
                applet:r.applets[0].applet
            }).done(function(data) {
                widget._UIDEFAULFS.stageListRootId = data.rootLink;
                Iptools.uidataTool._getUserlistAppletData({
                    async:false,
                    appletId:widget._UIDEFAULFS.stageListApplet,
                    orderByColumn:"deal_stage:sequence",
                }).done(function(r){
                    if(r && r.data && r.data.records){
                        for(var i = 0;i < r.data.records.length;i++){
                            var stageRoot = r.data.records[i];
                            var id = widget._UIDEFAULFS.stageListRootId+':id';
                            var title = widget._UIDEFAULFS.stageListRootId+':title';
                            var html = "<option value="+stageRoot[id]+">"+stageRoot[title]+"</option>";
                            $("#deals-stage").append(html);
                            //var obj = {};
                            //obj.stageId = stageRoot[id];
                            //obj.stageTile= stageRoot[title];
                            //widget._UIDEFAULFS.stageArray.unshift(obj);
                            //widget._UIDEFAULFS.stageIdArray.unshift(stageRoot[id]);
                        }
                    }
                })
            });
        });
    },
    //获取交易详情的applet
    _getDealsApplet:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'deal_detail'"
        }).done(function(r) {
            widget._UIDEFAULFS.dealSDetailApplet = r.applets[0].applet;
            Iptools.uidataTool._getApplet({
                async:false,
                applet:r.applets[0].applet,
            }).done(function(o){
                if(o && o.rootLink){
                    widget._UIDEFAULFS.dealSDetailRoot = o.rootLink;
                    for(var i = 0;i < o.controls.length;i++){
                        var columnName = o.controls[i].column;
                        var array = o.controls[i].pickList;
                        switch (columnName){
                            case "deal:source":
                                widget._buildDom(array,$("#deals-source"));
                                break;
                            case "deal:type":
                                widget._buildDom(array,$("#deals-type"));
                                break;
                        }
                    }
                }
            })
        })
    },
    _buildDom:function(array,container){
        for(var i = 0;i < array.length;i++){
            var html = "<option value='"+array[i].id+"'>"+array[i].name+"</option>";
            $(container).append(html)
        }
    },
    _check:function(){
        $('#deals-modal').bootstrapValidator({
            fields: {/*验证：规则*/
                dealsName: {
                    validators: {
                        notEmpty: {
                            message: '线索名称不能为空'
                        }
                    }
                },
                dealsSource: {
                    validators: {
                        notEmpty: {
                            message: '线索来源不能为空'
                        }
                    }
                },
                dealsType: {
                    validators: {
                        notEmpty: {
                            message: '类型不能空'
                        }
                    }
                },
                dealsMoney: {
                    validators: {
                        notEmpty: {
                            message: '金额不能为空'
                        }
                    }
                },
                dealsStage: {
                    validators: {
                        notEmpty: {
                            message: '阶段不能为空'
                        }
                    }
                },
                dealsRate: {
                    validators: {
                        notEmpty: {
                            message: '可能性不能为空'
                        }
                    }
                },
                dealsCreate: {
                    validators: {
                        notEmpty: {
                            message: '创建人不能为空'
                        }
                    }
                },
                dealsContactName: {
                    validators: {
                        notEmpty: {
                            message: '客户姓名不能为空'
                        }
                    }
                },
                dealsCellphone: {
                    validators: {
                        notEmpty: {
                            message: '客户电话名不能为空'
                        }
                    }
                },
            }
        })
    },
    //根据选择的客户得到电话号码
    _getContactPhone:function(){
        if(Comwidget._UIDEFAULFS.contactIdForDeal){
            Iptools.uidataTool._getCustomizeApplet({
                nameList:"'contact'",
            }).done(function(r){
                Iptools.uidataTool._getUserDetailAppletData({
                    appletId: r.applets[0].applet,
                    valueId:Comwidget._UIDEFAULFS.contactIdForDeal
                }).done(function(s){
                    if(s && s.data){
                        $("#deals-contact-cellphone").val(s.data[Comwidget._UIDEFAULFS.contactListRootId+":phone"]);
                        $("#deals-modal").data("bootstrapValidator").updateStatus($('#deals-contact-cellphone').attr("name"), "NOT_VALIDATED").validateField($('#deals-contact-cellphone').attr("name"));
                    }
                })
            })
        }else{
           $("#deals-contact-cellphone").val();
        }
    },
    //获得提交的表单数据
    _getDataForNewDeal:function(){
        var dealParam = {};
        var a = $("#deals-modal input.type-text");
        var c = $("#deals-modal select.choose");
        var d = $("#deals-modal input.type-search");
        var textContent  = $("#deals-modal textarea").val();
        var money = $(".money").val();
        for(var i = 0;i < a.length;i++){
            if(Iptools.Tool._checkNull($(a[i]).val())){
                dealParam[widget._UIDEFAULFS.dealSDetailRoot+":"+$(a[i]).attr("data-field")] = $(a[i]).val();
            }else{
                delete dealParam[widget._UIDEFAULFS.dealSDetailRoot+":"+$(a[i]).attr("data-field")];
            }
        }
        for(var w = 0; w < c.length;w++){
            if($(c[w]).find("option:selected").val()){
                dealParam[widget._UIDEFAULFS.dealSDetailRoot+":"+$(c[w]).attr("data-field")] = $(c[w]).find("option:selected").val();
            }else {
                delete dealParam[widget._UIDEFAULFS.dealSDetailRoot+":"+$(c[w]).attr("data-field")];
            }
        }
        for(var j = 0;j< d.length;j++){
            if($(d[j]).val()){
                dealParam[widget._UIDEFAULFS.dealSDetailRoot+":"+$(d[j]).attr("data-field")] =$(d[j]).attr("data-id");
            }else{
                delete dealParam[widget._UIDEFAULFS.dealSDetailRoot+":"+$(d[j]).attr("data-field")];
            }
        }
        if(Iptools.Tool._checkNull(textContent)){
            dealParam[widget._UIDEFAULFS.dealSDetailRoot+":description"] = textContent;
        }else{
            delete  dealParam[widget._UIDEFAULFS.dealSDetailRoot+":description"];
        }
        if(Iptools.Tool._checkNull(money)){
            dealParam[widget._UIDEFAULFS.dealSDetailRoot+":pre_amount"] = Number(money).toFixed(2);
        }else{
            dealParam[widget._UIDEFAULFS.dealSDetailRoot+":pre_amount"]
        }
        widget._UIDEFAULFS.dealParamJson = JSON.stringify(dealParam);
        //console.log(widget._UIDEFAULFS.dealParamJson);
    },
    //新建交易
    _addNewDeals:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"#newDeals .modal-footer .add-new-deals",
            event:function(){
                var me = $(this);
                $('#deals-modal').bootstrapValidator('validate');
                if(!$('#deals-modal').data("bootstrapValidator").isValid()){
                    return false;
                }else{
                    widget._getDataForNewDeal();
                    me.css({"pointer-events":"none"});
                    me.button("loading");
                    Iptools.uidataTool._addAppletData({
                        appletId:widget._UIDEFAULFS.dealSDetailApplet,
                        data:widget._UIDEFAULFS.dealParamJson
                    }).done(function(r){
                        if(r && r.retcode == "ok"){
                            Iptools.Tool.pAlert({
                                type: "info",
                                title: "提示框标题：",
                                content: "线索新建成功",
                                delay: 1000
                            });
                            me.button("reset");
                            me.css("pointer-events","auto");
                            $('#newDeals .commonBtn').removeClass("add-new-deals");
                            $("#deals-modal").data('bootstrapValidator').resetForm(true);
                            //trace._createDealTrace(title,pipeline,dealStage,pre_amount,due_time,owner,contact_id);
                            Iptools.uidataTool._pushMessage({
                                channel: "standart_deals_list", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                            });
                            $('#newDeals').modal('hide');
                        }
                    })
                }
            }
        })
    },
    //交易面板
    //获取相对应的交易阶段的交易
    _getDealsForStageList:function(id){
        Iptools.uidataTool._getApplet({
            applet:widget._UIDEFAULFS.dealsListApplet,
        }).done(function(o){
            widget._UIDEFAULFS.dealsListRootId = o.rootLink;
            Iptools.uidataTool._getUserlistAppletData({
                async:false,
                appletId:widget._UIDEFAULFS.dealsListApplet,
                condition:'{"'+widget._UIDEFAULFS.dealsListRootId+':deal_stage":"='+id+'"}'
            }).done(function(r){
                if(r){
                    if(r.data != "undefined"){
                        var money = 0;
                        for(var i = 0;i< r.data.records.length;i++){
                            var html =  '<li class="portlet">'+
                                '<div class="portlet-header" data-id="'+r.data.records[i][widget._UIDEFAULFS.dealsListRootId+":id"]+'"><a>￥<span class="money">'+r.data.records[i][widget._UIDEFAULFS.dealsListRootId+":pre_amount"]+'</span>  <span class="dealsTitle">'+r.data.records[i][widget._UIDEFAULFS.dealsListRootId+":title"]+'</span><br><span class="time">交易关闭：<span class="date_time">'+r.data.records[i][widget._UIDEFAULFS.dealsListRootId+":due_time"]+'</span></span></a></div>'+
                                '</li>'
                            $(".stageBlock:nth-child("+id+") .column").append(html);
                            money = money+Number(r.data.records[i][widget._UIDEFAULFS.dealsListRootId+":pre_amount"])
                        }
                        $(".stageBlock:nth-child("+id+") .bottom .money").html(money);
                        $(".stageBlock:nth-child("+id+") .header .num").html(r.data.records.length);
                    }else if(r.data == "undefined"){

                    }
                }
            })
        });
    },
    //交易阶段的进度
    _dealsPregress:function(length,id){
        for(var i = 0;i<length;i++){
            var stageHtml = "<div><span></span></div>";
            $(".stageBlock:nth-child("+id+") .header .stage").append(stageHtml);
        }
    },
    //获取交易阶段对应的交易
    _getDealsForStage:function(){
        for(var i = 0;i<widget._UIDEFAULFS.stageArray.length;i++){
            var id = widget._UIDEFAULFS.stageArray[i].stageId;
            var html = '<li class="stageBlock">'+
                '<div class="header" data-id="'+id+'">'+
                '<div class="title"><h3>'+widget._UIDEFAULFS.stageArray[i].stageTile+'</h3><span class="num"></span></div>'+
                '<div class="stage">'+

                '</div>'+
                '</div>'+
                '<ul class="column">'+

                '</ul>'+
                '<div class="bottom">'+
                'Total:<span class="money"></span>'+
                '</div>'+
                '</li>';
            $(".stageContent").append(html);
            var length = widget._UIDEFAULFS.stageArray.length;
            $('.stageContent').width((261 * length));
        }
        for(var i = 0;i<widget._UIDEFAULFS.stageIdArray.length;i++){
            var stageId =widget._UIDEFAULFS.stageIdArray[i];
            widget._getDealsForStageList(stageId);
            widget._dealsPregress(stageId,stageId);
        }
        $(".stageBlock .header .stage div").css("width",(100/+widget._UIDEFAULFS.stageIdArray.length)+'%');
        widget._enableDrag();
    },
    //拖拽
    _enableDrag:function(){

        $( ".column" ).sortable({
            connectWith: ".column",
            handle: ".portlet-header",
            cancel: ".portlet-toggle",
            placeholder: "portlet-placeholder ui-corner-all",
            receive:function(event,ui){
                //console.log(ui.item.parent().siblings(".header").data("id"))
                Iptools.uidataTool._getUserDetailAppletData({
                    appletId: widget._UIDEFAULFS.dealSDetailApplet,
                    valueId:ui.item.children("div").data("id"),
                }).done(function(r){
                    var pre_amount = r.data[widget._UIDEFAULFS.dealSDetailRoot+":pre_amount"];
                    //console.log(ui.item.parent().siblings(".bottom").children("span"))
                    //console.log(ui.item.parent().siblings(".bottom").children("span")[0].innerHTML)
                    //console.log(ui.item.parent().siblings(".header").children("div")[0].lastChild.innerHTML)
                    ui.item.parent().siblings(".bottom").children("span")[0].innerHTML = Number(ui.item.parent().siblings(".bottom").children("span")[0].innerHTML)+Number(pre_amount);
                    ui.item.parent().siblings(".header").children("div")[0].lastChild.innerHTML = Number(ui.item.parent().siblings(".header").children("div")[0].lastChild.innerHTML) + 1;
                    //console.log(ui.item.parent().siblings(".header").data("id"))
                    var param = {};
                    param[widget._UIDEFAULFS.dealSDetailRoot+":deal_stage"] = ui.item.parent().siblings(".header").data("id");
                    var paramStr = JSON.stringify(param);
                    //console.log(paramStr)
                    Iptools.uidataTool._saveAppletData({
                        appletId:widget._UIDEFAULFS.dealSDetailApplet,
                        valueId:ui.item.children("div").data("id"),
                        data:paramStr
                    }).done(function(data){
                        if(data && data.retcode == "ok"){
                            Iptools.Tool.pAlert({
                                type: "info",
                                title: "提示框标题：",
                                content: "交易阶段更新成功",
                                delay: 1000
                            });
                        }
                    });
                })
            },
        });
        $( ".portlet" )
            .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
            .find( ".portlet-header" )
            .addClass( "ui-corner-all" )
    },

}