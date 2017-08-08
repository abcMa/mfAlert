/**
 * Created by sks on 2017/5/5.
 */
var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        dealId:"",
        dealsDetailApplet:"",
        dealsDetailRootId:"",
        dealStageListApplet:"",
        dealStageListRootId:"",
        msgSignName:"",
        contactTraceDetail:"",
        contactTraceRootId:"",
        traceListApplet:"",
        traceListRootId:"",
        carListApplet:"",
        carListRootId:"",
        noteDetailApplet:"",
        noteDetailRootId:"",
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
        widget._clickDealsStage();
        widget._btnActive();
        widget._interactiveRecord();
        widget._msgSend();
    },
    _bindingEventAfterLoad: function () {
        var day = new Date();
        var month = day.getMonth()+1;
        var year = day.getFullYear();
        $(".trace-content li.title.this-month h3 span.month").html(trace._getMonthAndYears(month));
        $(".trace-content li.title.this-month h3 span.year").html(year+"年");
        $("#month-1").attr("data-time",year+"-"+month);
        if(month == 1){
            $(".trace-content li.title.before-month h3 span.month").html(trace._getMonthAndYears(month+11));
            $(".trace-content li.title.before-month h3 span.year").html((year-1)+"年");
            $(".trace-content li.title.that-month h3 span.month").html(trace._getMonthAndYears(month+10));
            $(".trace-content li.title.that-month h3 span.year").html((year-1)+"年");
            $("#month-2").attr("data-time",(year-1)+"-"+(month+11));
            $("#month-3").attr("data-time",(year-1)+"-"+(month+10))
        }else if(month == 2){
            $(".trace-content li.title.before-month h3 span.month").html(trace._getMonthAndYears(month-1));
            $(".trace-content li.title.before-month h3 span.year").html(year+"年");
            $(".trace-content li.title.that-month h3 span.month").html(trace._getMonthAndYears(month+10));
            $(".trace-content li.title.that-month h3 span.year").html((year-1)+"年");
            $("#month-2").attr("data-time",year+"-0"+(month-1));
            $("#month-3").attr("data-time",(year-1)+"-"+(month+10))
        }else{
            $(".trace-content li.title.before-month h3 span.month").html(trace._getMonthAndYears(month-1));
            $(".trace-content li.title.before-month h3 span.year").html(year+"年");
            $(".trace-content li.title.that-month h3 span.month").html(trace._getMonthAndYears(month-2));
            $(".trace-content li.title.that-month h3 span.year").html(year+"年");
            if(month < 10){
                $("#month-2").attr("data-time",year+"-0"+(month-1));
                $("#month-3").attr("data-time",year+"-0"+(month-2))
            }else{
                $("#month-2").attr("data-time",year+"-"+(month-1));
                $("#month-3").attr("data-time",year+"-"+(month-2))
            }

        }
    },
    _init: function () {
        widget._UIDEFAULFS.dealId = Iptools.DEFAULTS.currentViewValue;
        var d = new Date();
        var year = d.getFullYear();
        var month = (d.getMonth()+1) > 9 ? (d.getMonth()+1) : "0"+(d.getMonth()+1);
        var hour = d.getHours();
        var min = d.getMinutes();
        var str = year+"-"+month+"-"+d.getDate()+" "+hour+":"+min;
        $("#interaction-time").val(str);
        widget._getId();
        widget._getLeftDealsDeatil();
        widget._timePicker();
        widget._getMsgSign();
        widget._bindingDomEvent();
        widget._bindingEventAfterLoad();
        widget._getDealStage();
        widget._checkform();
        $('.collapse').collapse('show');
    },
    //获取左侧的线索详情
    _getLeftDealsDeatil:function(){
        Iptools.Tool._pushListen("deals_status_detail", function (ms) {
            if(ms.channel == "deals_status_detail"){
                widget._getLeftDealsDeatil();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'deal_detail'"
        }).done(function(r) {
            if(r && r.applets){
                widget._UIDEFAULFS.dealsDetailApplet = r.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    async:false,
                    applet:widget._UIDEFAULFS.dealsDetailApplet
                }).done(function(data) {
                    if(data){
                        widget._UIDEFAULFS.dealsDetailRootId = data.rootLink;
                        component._panel(".left-top", {
                            applet: widget._UIDEFAULFS.dealsDetailApplet,
                            valueId: widget._UIDEFAULFS.dealId,
                            afterLoad: function () {
                                var dealStage = widget._UIDEFAULFS.dealsDetailRootId+":deal_stage";
                                var dealStatusId = $(".left-top").data("panel").options.data[dealStage].id;
                                var dataDetail = $(".left-top").data("panel").options.data;
                                //console.log($(".left-top").data("panel").options.data)
                                Iptools.uidataTool._getCustomizeApplet({
                                    nameList: "'contact'"
                                }).done(function(w) {
                                    widget._UIDEFAULFS.dealStageListApplet = r.applets[0].applet;
                                    Iptools.uidataTool._getApplet({
                                        applet:w.applets[0].applet
                                    }).done(function(data) {
                                        if(data){
                                            var linkId = data.rootLink;
                                            $(".cellphone").val(dataDetail[linkId+":phone"]);
                                        }
                                    })
                                })
                                widget._activeStage(dealStatusId);
                            },
                            autoRefresh: true,
                            allowEdit:true,
                        });
                    }
                })
            }
        })
    },
    //获得所有的销售流程
    _getDealStage:function(){
        $(".choice_stage").html(" ");
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'deal_stage_list'"
        }).done(function(r) {
            widget._UIDEFAULFS.dealStageListApplet = r.applets[0].applet;
            Iptools.uidataTool._getApplet({
                async:false,
                applet:r.applets[0].applet
            }).done(function(data) {
                widget._UIDEFAULFS.dealStageListRootId = data.rootLink;
                Iptools.uidataTool._getUserlistAppletData({
                    async:false,
                    appletId:widget._UIDEFAULFS.dealStageListApplet,
                    orderByColumn:"deal_stage:sequence",
                    //orderByAscDesc:"desc",
                }).done(function(r){
                    //console.log(r)
                    if(r && r.data && r.data.records){
                        for(var i = 0;i < r.data.records.length;i++){
                            var dealStage = r.data.records[i];
                            var html =  '<li class="first" data-id="'+dealStage[widget._UIDEFAULFS.dealStageListRootId+':id']+'" data-percent="'+dealStage[widget._UIDEFAULFS.dealStageListRootId+':finish_percent']+'">'+
                                '<span class="line left_line">'+
                                '<i></i>'+
                                '</span>'+
                                '<span class="circle">'+
                                '<i class="fa font_icon fa-check-circle"></i>'+
                                '</span>'+
                                '<span class="line right_line">'+
                                '<i></i>'+
                                '</span>'+
                                '<div>'+dealStage[widget._UIDEFAULFS.dealStageListRootId+':title']+'</div>'+
                                '</li>';
                            $(".choice_stage").append(html);
                        };
                        widget._UIDEFAULFS.liLength = r.data.records.length;
                        $(".choice_stage li").css("width",100/+Number(widget._UIDEFAULFS.liLength)+"%");
                        //$("[data-toggle='popover']").popover();
                        $(".choice_stage li:first-child span.line.left_line i").css("display","none");
                        $(".choice_stage li:last-child span.line.right_line i").css("display","none");
                    }
                })
            });
        });
    },
    //线索阶段点亮
    _activeStage:function(id){
        $(".choice_stage li span.circle i").css("color","rgb(203, 214, 226)");
        $(".choice_stage span.line.left_line i").css("border-color","rgb(203, 214, 226)");
        $(".choice_stage li:nth-child("+id+") span.circle i").css("color","#09f");
        $(".choice_stage li:nth-child("+id+") span.line.left_line i").css("border-color","#09f");
        $(".choice_stage li:nth-child("+id+") span.line.right_line i").css("border-color","rgb(203, 214, 226)");
        var me = $(".choice_stage li:nth-child("+id+")");
        $(me).prevAll().find("span.circle i").css("color","#09f");
        $(me).prevAll().find("span.line i").css("border-color","#09f");
        if(id == 5){
            $(".choice_stage li:nth-child("+4+") span.circle i").css("color","rgb(203, 214, 226)");
            $(".choice_stage li:nth-child("+3+") span.line.right_line i").css("border-color","rgb(203, 214, 226)");
            $(".choice_stage li:nth-child("+4+") span.line.left_line i").css("border-color","rgb(203, 214, 226)");
        }
    },
    //改变线索阶段（线索状态）
    _clickDealsStage:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".choice_stage li",
            event:function(){
                var id = Number($(this).attr("data-id"));
                var percent = $(this).attr("data-percent");
                if(percent == "100%"){
                    $("#myModalsucc").modal("show");
                    widget._dealSucc(id);
                }else if(percent == "0%"){
                    $("#myModalFail").modal("show");
                    widget._dealFail(id);
                }else{
                    widget._changeDealStage({
                        stage:id
                    })
                }

            }
        });
    },
    //时间插件
    _timePicker:function(){
        $('#interaction-time').datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            autoclose: true,
            todayBtn: true,
            todayHighlight: 1,
            minView: 1,
            language: "zh-CN",
        });
        $('#next-follow-time').datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            autoclose: true,
            todayBtn: true,
            todayHighlight: 1,
            minView: 1,
            language: "zh-CN",
        });
        $('#select-first-trace-time').datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            autoclose: true,
            todayBtn: true,
            todayHighlight: 1,
            minView: 1,
            language: "zh-CN",
        });
        $('#select-end-trace-time').datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            autoclose: true,
            todayBtn: true,
            todayHighlight: 1,
            minView: 1,
            language: "zh-CN",
        });
        $('#fail-time').datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            autoclose: true,
            todayBtn: true,
            todayHighlight: 1,
            minView: 1,
            language: "zh-CN",
        }).on('hide', function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            var me = $(this);
            $("#failForm").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
        $('#succ-time').datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            autoclose: true,
            todayBtn: true,
            todayHighlight: 1,
            minView: 1,
            language: "zh-CN",
        }).on('hide', function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            var me = $(this);
            $("#succForm").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
    },
    /*状态更改*/
    _changeDealStage:function(options){
        $(options.target).css("pointer-events","none");
        $(options.target).button("loading");
        var param = {};
        if(options.stage){
            param[widget._UIDEFAULFS.dealsDetailRootId+":deal_stage"] = options.stage;
        }else{
            param[widget._UIDEFAULFS.dealsDetailRootId+":deal_stage"];
        }
        if(options.fail){
            param[widget._UIDEFAULFS.dealsDetailRootId+":fail_reason"] = options.fail;
        }else{
        }
        if(options.failTime){
            param[widget._UIDEFAULFS.dealsDetailRootId+":close_fail_time"] = options.failTime;
        }else{
            delete param[widget._UIDEFAULFS.dealsDetailRootId+":close_fail_time"]
        }
        if(options.succ){
            param[widget._UIDEFAULFS.dealsDetailRootId+":win_reason"] = options.failTime;
        }else{
            delete param[widget._UIDEFAULFS.dealsDetailRootId+":win_reason"]
        }
        if(options.succTime){
            param[widget._UIDEFAULFS.dealsDetailRootId+":close_win_time"] = options.failTime;
        }else{
            delete param[widget._UIDEFAULFS.dealsDetailRootId+":close_win_time"]
        }
        if(options.nextTime){
            param[widget._UIDEFAULFS.dealsDetailRootId+":next_follow_up_date"] = options.nextTime;
        }else{
            delete param[widget._UIDEFAULFS.dealsDetailRootId+":next_follow_up_date"]
        }
        var paramStr = JSON.stringify(param);
        Iptools.uidataTool._saveAppletData({
            appletId:widget._UIDEFAULFS.dealsDetailApplet,
            valueId:widget._UIDEFAULFS.dealId,
            data:paramStr
        }).done(function(data){
            if(data && data.retcode == "ok"){
                Iptools.Tool.pAlert({
                    type: "info",
                    title: "提示框标题：",
                    content: "线索更新成功",
                    delay: 1000
                });
                $(options.target).css("pointer-events","auto");
                $(options.target).button("reset");
                //Iptools.uidataTool._pushMessage({
                //    channel: "deals_status_detail", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                //});
                widget._getLeftDealsDeatil();
            }
        });
    },
    _checkform:function(){
        $('#failForm').bootstrapValidator({
            fields: {/*验证：规则*/
                failTime: {
                    validators: {
                        notEmpty: {
                            message: '失败时间不能为空'
                        }
                    }
                },
            }
        })
        $('#succForm').bootstrapValidator({
            fields: {/*验证：规则*/
                succTime: {
                    validators: {
                        notEmpty: {
                            message: '成功时间不能为空'
                        }
                    }
                },
            }
        })
    },
    /*战败的原因提交*/
    _dealFail:function(id){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".deal-fail-btn",
            event:function(){
                var me = $(this);
                $('#failForm').bootstrapValidator('validate');
                if(!$('#failForm').data("bootstrapValidator").isValid()){
                    return false;
                }else{
                    if(Iptools.Tool._checkNull($(".fail-content").val())){
                        var failContent = ($(".fail-content").val());
                    }
                    if(Iptools.Tool._checkNull($(".fail-time").val())){
                        var failTime = $(".fail-time").val();
                    }
                    widget._changeDealStage({
                        target:".deal-fail-btn",
                        stage:id,
                        fail:failContent,
                        failTime:failTime
                    });
                    var dealId = widget._UIDEFAULFS.dealId;
                    InDetailDeal._createDealsFailReason(failContent,dealId,failTime);
                    $("#myModalFail").modal('hide');
                }
            }
        })
    },
    /*战败的成功提交*/
    _dealSucc:function(id){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".deal-succ-btn",
            event:function(){
                var me = $(this);
                $('#succForm').bootstrapValidator('validate');
                if(!$('#succForm').data("bootstrapValidator").isValid()){
                    return false;
                }else{
                    if(Iptools.Tool._checkNull($(".succ-content").val())){
                        var succlContent =  $(".succ-content").val();
                    }
                    if(Iptools.Tool._checkNull($(".succ-time").val())){
                        var succTime =  $(".succ-time").val();
                    }
                    widget._changeDealStage({
                        target:".deal-succ-btn",
                        stage:id,
                        succ:succlContent,
                        succTime:succTime
                    });
                    var dealId = widget._UIDEFAULFS.dealId;
                    InDetailDeal._createDealsSuccReason(succlContent,dealId,succTime);
                    $("#myModalsucc").modal('hide');
                }
            }
        })
    },
    /*动态相关*/
    /*按钮点亮*/
    _btnActive:function(){
        widget._addEventListener({
            container:"body",
            type:"input",
            target:".trace-content",
            event:function(){
                if(!Iptools.Tool._checkNull($.trim($(this).val()))){
                    $(".trace-btn").attr("disabled",true).removeClass("commonBtn").addClass("disableBtn");
                }else{
                    $(".trace-btn").removeAttr("disabled").removeClass("disableBtn").addClass("commonBtn");
                }
            }
        });
        widget._addEventListener({
            container:"body",
            type:"input",
            target:".msg-content",
            event:function(){
                $(".msg-count").html($(this).val().length);
                if(!Iptools.Tool._checkNull($.trim($(this).val()))){
                    $(".send-msg-btn").attr("disabled",true).removeClass("commonBtn").addClass("disableBtn");
                }else{
                    $(".send-msg-btn").removeAttr("disabled").removeClass("disableBtn").addClass("commonBtn");
                }
            }
        })
        widget._addEventListener({
            container:"body",
            type:"input",
            target:".note-content",
            event:function(){
                $(".msg-count").html($(this).val().length);
                if(!Iptools.Tool._checkNull($.trim($(this).val()))){
                    $(".note-btn").attr("disabled",true).removeClass("commonBtn").addClass("disableBtn");
                }else{
                    $(".note-btn").removeAttr("disabled").removeClass("disableBtn").addClass("commonBtn");
                }
            }
        })
    },
    /*互动记录*/
    /*获取动态的appletid、rootid*/
    _getId:function(){
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "'Contact Trace Detail'"
        }).done(function (thisApplet) {
            if(thisApplet && thisApplet.applets){
                widget._UIDEFAULFS.contactTraceDetail = thisApplet.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.contactTraceDetail
                }).done(function(r){
                    if(r && r.rootLink){
                        widget._UIDEFAULFS.contactTraceRootId = r.rootLink;
                    }
                })
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "'note_detail'"
        }).done(function (thisApplet) {
            if(thisApplet && thisApplet.applets){
                widget._UIDEFAULFS.noteDetailApplet = thisApplet.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.noteDetailApplet
                }).done(function(r){
                    if(r && r.rootLink){
                        widget._UIDEFAULFS.noteDetailRootId = r.rootLink;
                    }
                })
            }
        })
    },
    _interactiveRecord:function(){
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "button.trace-btn",
            event: function () {
                var that = $(this);
                that.css({
                    "pointer-events":"none"
                });
                that.button("loading");
                var paramData = {};
                paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_type"] = $(".trace-type option:selected").val();
                paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_category"] = $(".trace-type option:selected").attr("data-bigtype");
                paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_time"] = $("#interaction-time").val();
                if(Iptools.Tool._checkNull($(".trace-content").val())){
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":title"] = $(".trace-content").val();
                }else{
                    delete paramData[widget._UIDEFAULFS.contactTraceRootId+":title"];
                }
                paramData[widget._UIDEFAULFS.contactTraceRootId+":owner"] = Iptools.DEFAULTS.userId;
                paramData[widget._UIDEFAULFS.contactTraceRootId+":deal_id"] = widget._UIDEFAULFS.dealId;
                var paramJson = JSON.stringify(paramData);
                var dealNextTime = $("#next-follow-time").val();
                Iptools.uidataTool._addAppletData({
                    appletId:widget._UIDEFAULFS.contactTraceDetail,
                    data:paramJson
                }).done(function(data){
                    if(data.retcode == 'ok'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "互动记录创建成功"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "standard_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                        });
                        that.button("reset");
                        that.css("pointer-events","auto");
                        $(".trace-type option.no-type").prop("selected","selected");
                        $("#interaction-time").val("");
                        $(".trace-content").val("");
                    }
                });
                if(dealNextTime != ""){
                    widget._changeDealStage({
                        nextTime:dealNextTime,
                    })
                }
            }
        })
    },
    /*获取短信签名*/
    _getMsgSign:function(){
        Iptools.GetJson({
            url:"basic/queryByDictId",
            data:{
                "dictId":"smsSignature",
                "token":Iptools.DEFAULTS.token
            }
        }).done(function(data){
            if(data.retcode === "ok"){
                $('.msg-sign-name').html(data.result.dictValue);
                widget._UIDEFAULFS.msgSignName = data.result.dictValue;
            }else{
                $('.msg-sign-name').html("");
                widget._UIDEFAULFS.msgSignName = "";
            }
        })
    },
    /*发送短信*/
    _msgSend:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"button.send-msg-btn",
            event:function(){
                var me = $(this);
                me.css({
                    "pointer-events":"none"
                });
                me.button("loading");
                if(Iptools.Tool._checkNull($(".insuranced_cellphone").val())){
                    var phone = $(".insuranced_cellphone").val();
                }
                Iptools.PostJson({
                    url:"basic/sendSms",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        phoneList:phone,
                        content:$('.msg-content').val()+'【'+widget._UIDEFAULFS.msgSignName+'】'
                    }
                }).done(function(data){
                    if(data.retcode == 'ok'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "短信发送成功"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "standard_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                        });
                        me.button("reset");
                        me.css("pointer-events","auto");
                        $('.msg-content').val("");
                    }
                })
            }
        })
    },
    /*新建笔记*/
    _msgSend:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"button.note-btn",
            event:function(){
                var me = $(this);
                me.css({
                    "pointer-events":"none"
                });
                me.css({"pointer-events":"none"});
                me.button("loading");
                var param = {};
                param[widget._UIDEFAULFS.noteDetailRootId+":content"] = $(".note-content").val();
                param[widget._UIDEFAULFS.noteDetailRootId+":deal_id"] = widget._UIDEFAULFS.dealId;
                param[widget._UIDEFAULFS.noteDetailRootId+":creator"] = Iptools.DEFAULTS.userId;
                var paramData = JSON.stringify(param);
                Iptools.uidataTool._addAppletData({
                    appletId:widget._UIDEFAULFS.noteDetailApplet,
                    data:paramData
                }).done(function(r){
                    if(r.retcode == 'ok'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "笔记新建成功"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "standard_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                        });
                        me.button("reset");
                        me.css("pointer-events","auto");
                        $(".note-content").val("");
                    }
                })
            }
        })
    },

}