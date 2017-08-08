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
        carId:"",
        msgSignName:"",
        contactTraceDetail:"",
        contactTraceRootId:"",
        traceListApplet:"",
        traceListRootId:"",
        noteDetailApplet:"",
        noteDetailRootId:"",
        contactCarLinkListApplet:"",
        contactCarLinkListRoot:"",
        contactApplet:"",
        contactRootId:"",
        taskApplet:"",
        taskRootId:"",
        carNum:"",
        contactId:"",
        cumId:"",
        MsgApplet:"",
        MsgRoot:"",
        msgTemplate:""
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
        widget._selectHUdongTYpe();
        widget._changeIcon();
        widget._selectDealsStage();
        widget._btnActive();
        widget._getObject();
        widget._getObjectMsg();
        widget._gettMsgTemplate();
        widget._interactiveRecord();
        widget._msgSend();
        widget._newNote();
        widget._dealFail();
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
        var day = d.getDate() > 9 ? d.getDate() :"0"+d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        var str = year+"-"+month+"-"+day+" "+hour+":"+min;
        var str1 =  year+"-"+month+"-"+day;
        $("#interaction-time").val(str);
        $("#fail-time").val(str1);
        widget._getId();
        widget._getLeftDealsDeatil();
        widget._getContactLink();
        widget._getContactAppletAndRootId();
        widget._getMsgAppletAndRootId();
        widget._timePicker();
        widget._check();
        widget._getMsgSign();
        widget._bindingDomEvent();
        widget._bindingEventAfterLoad();
        $('.collapse').collapse('show');
    },
    //点击之后上下的图标进行更换
    _changeIcon: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".title .title-header",
            event: function () {
                if ($(this).find("span.fa").hasClass("fa-angle-up")) {
                    $(this).find("span.fa").removeClass("fa-angle-up").addClass("fa-angle-down");
                } else if($(this).find("span.fa").hasClass("fa-angle-down")) {
                    $(this).find("span.fa").removeClass("fa-angle-down").addClass("fa-angle-up");
                }
            },
        });
    },
    //获取左侧的线索详情
    _getLeftDealsDeatil:function(){
        widget._getDealDetail();
        //console.log(widget._UIDEFAULFS.dealsDetailApplet)
        Iptools.Tool._pushListen("4s_deals_status_detail", function (ms) {
            if(ms.channel == "4s_deals_status_detail"){
                widget._getLeftDealsDeatil();
            }
        });
        component._panel(".left-top", {
            applet: widget._UIDEFAULFS.dealsDetailApplet,
            valueId: widget._UIDEFAULFS.dealId,
            afterLoad: function () {

            },
            autoRefresh: false,
            allowEdit:false,
        });
    },
    _getDealDetail:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'deal_detail'"
        }).done(function(r) {
            if (r && r.applets) {
                widget._UIDEFAULFS.dealsDetailApplet = r.applets[0].applet;
                //console.log(widget._UIDEFAULFS.dealsDetailApplet)
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.dealsDetailApplet
                }).done(function (data) {
                    if (data) {
                        widget._UIDEFAULFS.dealsDetailRootId = data.rootLink;
                        Iptools.uidataTool._getUserDetailAppletData({
                            "appletId": widget._UIDEFAULFS.dealsDetailApplet,
                            "valueId":  widget._UIDEFAULFS.dealId
                        }).done(function(w){
                            widget._UIDEFAULFS.carId = w.data["insurance:car_id"].id;
                            widget._UIDEFAULFS.contactId = w.data["insurance:contact_id"].id;
                            widget._UIDEFAULFS.carNum = w.data["insurance:plate_number"];
                            widget._getContactList(widget._UIDEFAULFS.carId);
                            var dealStatusId = w.data[widget._UIDEFAULFS.dealsDetailRootId+":status"].id;
                            $(".choice_stage li button").removeAttr("disabled");
                            $(".choice_stage li:nth-child("+dealStatusId+") button").attr("disabled","disabled");
                            widget._activeStage(dealStatusId);
                        })
                    }
                })
            }
        })
    },
    //改变线索阶段（线索状态）
    _selectDealsStage:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".choice_stage li button",
            event:function(){
                if($(this).attr("data-id") == 1){
                    widget._changeDealStage({
                        status:1,
                    });
                    //$(".choice_stage button").removeAttr("disable");
                    //$(this).attr("disabled","true");
                    Iptools.uidataTool._pushMessage({
                        channel: "4s_deals_status_detail", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                    });
                }
                if($(this).attr("data-id") == 2){
                    widget._changeDealStage({
                        status:2,
                    });
                    //$(".choice_stage button").removeAttr("disable");
                    //$(this).attr("disabled","true");
                    Iptools.uidataTool._pushMessage({
                        channel: "4s_deals_status_detail", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                    });
                }
            }
        });
    },
    //线索阶段点亮
    _activeStage:function(id){
        $(".choice_stage li button").css("color","rgb(203, 214, 226)");
        $(".choice_stage span.line.left_line i").css("border-color","rgb(203, 214, 226)");
        $(".choice_stage span.line.right_line i").css("border-color","rgb(203, 214, 226)");
        $(".choice_stage li:nth-child("+id+") button").css("color","#09f");
        $(".choice_stage li:nth-child("+id+") span.line.left_line i").css("border-color","#09f");
        $(".choice_stage li:nth-child("+id+") span.line.right_line i").css("border-color","rgb(203, 214, 226)");
        var me = $(".choice_stage li:nth-child("+id+")");
        $(me).prevAll().find("button").css("color","#09f");
        $(me).prevAll().find("span.line i").css("border-color","#09f");
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
        }).on('hide', function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            var me = $(this);
            $(".insurance-follow").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });;
        $('#next-follow-time').datetimepicker({
            format: 'yyyy-mm-dd hh:00',
            autoclose: true,
            todayBtn: true,
            todayHighlight: 1,
            minView: 1,
            language: "zh-CN",
        })
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
        });
    },
    /*状态更改*/
    _changeDealStage:function(options){
        if(options.target){
            $(options.target).css({"pointer-events":"none"});
            $(options.target).button("loading");
        }
        var param = {};
        if(options.status){
            param[widget._UIDEFAULFS.dealsDetailRootId+":status"] = options.status;
        }else{
            delete param[widget._UIDEFAULFS.dealsDetailRootId+":status"];
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
                $(options.target).button("reset");
                $(options.target).css("pointer-events","auto");
                Iptools.uidataTool._pushMessage({
                    channel: "4s_deals_status_detail", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                });
            }
        });
    },
    /*战败的原因提交*/
    _dealFail:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".deal-fail-btn",
            event:function(){
                var failContent = $(".fail-content").val();
                var failTime = $(".fail-time").val();
                widget._changeDealStage({
                    target:$(".deal-fail-btn"),
                    status:3,
                    fail:failContent,
                    failTime:failTime
                });
                var dealId = widget._UIDEFAULFS.dealId;
                InsuTrace._createDealsFailReason(failContent,dealId);
                $("#myModal").modal('hide');
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
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "'task_detail'"
        }).done(function (thisApplet) {
            if(thisApplet && thisApplet.applets){
                widget._UIDEFAULFS.taskApplet = thisApplet.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.taskApplet
                }).done(function(r){
                    if(r && r.rootLink){
                        widget._UIDEFAULFS.taskRootId = r.rootLink;
                    }
                })
            }
        })
    },
    _check:function(){
        $('.insurance-follow').bootstrapValidator({
            fields: {/*验证：规则*/
                interactionTime: {
                    validators: {
                        notEmpty: {
                            message: '互动时间不能为空'
                        }
                    }
                },
                traceConten: {
                    validators: {
                        notEmpty: {
                            message: '互动内容不能为空'
                        }
                    }
                },
            }
        })
    },
    /*点击互动类型*/
    _selectHUdongTYpe:function(){
        widget._addEventListener({
            container: "body",
            type: "change",
            target: ".trace-type",
            event:function(){
                if($("select option:selected").attr("data-bigtype") == 4){
                    $(".insurance-follow select option.no-type").prop("selected","selected");
                    $(".telegram-status-row").css("display","block");
                }else if($("select option:selected").attr("data-bigtype") == 5){
                    $(".insurance-follow select option.no-type").prop("selected","selected");
                    $(".telegram-status-row").css("display","none");
                }
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
                $('.insurance-follow').bootstrapValidator('validate');
                if(!$('.insurance-follow').data("bootstrapValidator").isValid()){
                    return false;
                }else{
                    widget._check();
                    $(that).attr("disabled","disabled");
                    $(that).addClass("disableBtn");
                    var paramData = {};
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_type"] = $(".trace-type option:selected").val();
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_category"] = $(".trace-type option:selected").attr("data-bigtype");
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_time"] = $("#interaction-time").val();
                    if(Iptools.Tool._checkNull($(".trace-content").val())){
                        paramData[widget._UIDEFAULFS.contactTraceRootId+":title"] = $(".trace-content").val();
                    }else{
                        delete  paramData[widget._UIDEFAULFS.contactTraceRootId+":title"];
                    }
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":customer_id"] = widget._UIDEFAULFS.cumId;
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":contact_id"] = $("table.object-table tbody tr.active").attr("data-id");;
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":owner"] = Iptools.DEFAULTS.userId;
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":deal_id"] = widget._UIDEFAULFS.dealId;
                    paramData[widget._UIDEFAULFS.contactTraceRootId+":car_id"] = widget._UIDEFAULFS.carId;
                    if($(".trace-type option:selected").attr("data-bigtype") == 4){
                        if($(".connect-status option:selected").val()){
                            paramData[widget._UIDEFAULFS.contactTraceRootId+":is_phone_connected"] = $(".connect-status option:selected").val();
                        }else{
                            delete paramData[widget._UIDEFAULFS.contactTraceRootId+":is_phone_connected"];
                        }
                        if($(".success-status option:selected").val()){
                            paramData[widget._UIDEFAULFS.contactTraceRootId+":is_success"] = $(".success-status option:selected").val();
                        }else{
                            delete paramData[widget._UIDEFAULFS.contactTraceRootId+":is_success"];
                        }
                        if($(".fail-reason option:selected").val()){
                            paramData[widget._UIDEFAULFS.contactTraceRootId+":huifang_fail_reason"] = $(".fail-reason option:selected").val();
                        }else{
                            delete paramData[widget._UIDEFAULFS.contactTraceRootId+":huifang_fail_reason"];
                        }
                    }
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
                            $(".insurance-follow").data('bootstrapValidator').resetForm(true);
                            if(dealNextTime){
                                var task = {};
                                task[widget._UIDEFAULFS.taskRootId+":title"] = widget._UIDEFAULFS.carNum +"跟进";
                                task[widget._UIDEFAULFS.taskRootId+":status"] = 1;
                                task[widget._UIDEFAULFS.taskRootId+":deal_id"] = widget._UIDEFAULFS.dealId;
                                task[widget._UIDEFAULFS.taskRootId+":car_id"] = widget._UIDEFAULFS.carId;
                                task[widget._UIDEFAULFS.taskRootId+":contact_id"] = widget._UIDEFAULFS.contactId;
                                task[widget._UIDEFAULFS.taskRootId+":due_time"] = dealNextTime;
                                task[widget._UIDEFAULFS.taskRootId+":description"] = "上次跟进记录"+$(".trace-content").val();
                                task[widget._UIDEFAULFS.taskRootId+":owner"] = Iptools.DEFAULTS.userId;
                                var taskStr = JSON.stringify(task);
                                Iptools.uidataTool._addAppletData({
                                    appletId:widget._UIDEFAULFS.taskApplet,
                                    data:taskStr
                                }).done(function(data){
                                    if(data && data.retcode == "ok"){
                                        console.log("任务成功创建")
                                    }
                                });
                            }
                            Iptools.uidataTool._pushMessage({
                                channel: "4s_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                            });
                            $(".btn-object").html("请选择<span class='caret'></span>");
                            $(".insurance-follow select option.no-type").prop("selected","selected");
                            $(".trace-content").val("");
                            $("#next-follow-time").val("");
                        }
                    });
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
                var phone = $(".interact-target-btn").text();
                Iptools.PostJson({
                    url:"basic/sendSms",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        phoneList:phone,
                        contactId:$("table.object-msg-table tbody tr.active").attr("data-id"),
                        customerId:widget._UIDEFAULFS.cumId,
                        carId:widget._UIDEFAULFS.carId,
                        content:$('.msg-content').val()+'【'+widget._UIDEFAULFS.msgSignName+'】'
                    }
                }).done(function(data){
                    if(data.retcode == 'ok'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "短信发送成功"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "4s_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                        });
                        me.button("reset");
                        me.css("pointer-events","auto");
                        me.attr("disabled","true");
                        $('.msg-content').val("");
                    }
                })
            }
        })
    },
    /*新建笔记*/
    _newNote:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"button.note-btn",
            event:function(){
                var me = $(this);
                me.css({
                    "pointer-events":"none"
                });
                me.button("loading");
                var param = {};
                if(Iptools.Tool._checkNull($(".note-content").val())){
                    param[widget._UIDEFAULFS.noteDetailRootId+":content"] = $(".note-content").val();
                }else{
                    delete param[widget._UIDEFAULFS.noteDetailRootId+":content"];
                }
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
                            channel: "4s_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                        });
                        me.button("reset");
                        me.css("pointer-events","auto");
                        me.attr("disabled","true");
                        $(".note-content").val("");
                    }
                })
            }
        })
    },
    /*得到关联人的applet和rootId*/
    _getContactLink:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_car_link'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                widget._UIDEFAULFS.contactCarLinkListApplet = r.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.contactCarLinkListApplet
                }).done(function(w){
                    if(w && w.rootLink){
                        widget._UIDEFAULFS.contactCarLinkListRoot = w.rootLink;
                    }
                })
            }
        })
    },
    /*得到联系人的Root*/
    _getContactAppletAndRootId:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'contact'"
        }).done(function(s){
            if(s && s.applets){
                widget._UIDEFAULFS.contactApplet = s.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:widget._UIDEFAULFS.contactApplet,
                }).done(function(w){
                    if(w && w.rootLink){
                        widget._UIDEFAULFS.contactRoot = w.rootLink;
                    }
                })
            }
        })
    },
    /*联系人列表*/
    _getContactList:function(id){
        component._table("#deal-contact-link", {
            pageNow: 1,
            pageSize: 10,
            showChecks: false,
            applet: widget._UIDEFAULFS.contactCarLinkListApplet,
            condition:{"contact_car_link:car_id":" ="+id,"contact_car_link:contact_type":" =3"},
            emptyImage: "../Content/Image/nodetail.png",
            emptySize: "150",
            emptyText: "还没有联系人记录",
            emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
            afterLoad:function(){
                widget._buildInteractOptions(widget._UIDEFAULFS.carId);
            }
        })
    },
    _buildInteractOptions:function(id){
        $("table.interact-target tbody").html(" ");
        Iptools.uidataTool._getUserlistAppletData({
            "appletId": widget._UIDEFAULFS.contactCarLinkListApplet,
            "condition": "{'contact_car_link:car_id':' =" +id + "','contact_car_link:is_obsolete':' =0'}"
        }).done(function (r) {
            if (r && r.data && r.data.records && r.data.records.length) {
                var b = r.data.records;
                for (var i = 0, len = b.length; i < len; i++) {
                    var id = "",name = "",phone = "",typeName = "";
                    if(b[i][widget._UIDEFAULFS.contactCarLinkListRoot+":contact_id"]){
                        name = b[i][widget._UIDEFAULFS.contactCarLinkListRoot+":contact_id"].name;
                        id = b[i][widget._UIDEFAULFS.contactCarLinkListRoot+":contact_id"].id;
                    }
                    if(b[i][widget._UIDEFAULFS.contactRoot+":phone"]){
                        phone = b[i][widget._UIDEFAULFS.contactRoot+":phone"]
                    }
                    if (name.length >= 6) {
                        name = name.substring(0, 5) + "...";
                    }
                    if(b[i][widget._UIDEFAULFS.contactCarLinkListRoot+":contact_type"].name){
                        typeName = b[i][widget._UIDEFAULFS.contactCarLinkListRoot+":contact_type"].name;
                    }
                    if(b[i][widget._UIDEFAULFS.contactCarLinkListRoot+":contact_type"].id == 3){
                        widget._UIDEFAULFS.cumId = b[i][widget._UIDEFAULFS.contactCarLinkListRoot+":contact_id"].id;
                    }
                    var html = "";
                    html = '<tr class="td" data-type="' + id + '" data-id="' + id + '">'+
                    '<td>' + typeName + '</td>'+
                    '<td title="' + name + '">' + name + '</td>'+
                    '<td class="phoneVal">' + phone + '</td>'+
                    '</tr>';
                    $("table.interact-target tbody").append(html);
                }
            }else{
                $("table.interact-target tbody").html("<p>暂无数据</p>");
            }
        })
    },
    _getObject:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"table.object-table tbody tr",
            event:function(){
                var me = $(this);
                $("table.object-table tbody tr").removeClass("active");
                me.addClass("active");
                $(".btn-object").html(me.find(".phoneVal").html()).append('<span class="caret"></span>')
            }
        })
    },
    _getObjectMsg:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"table.object-msg-table tbody tr",
            event:function(){
                var me = $(this);
                $("table.object-msg-table tbody tr").removeClass("active");
                me.addClass("active");
                $(".object-msg-btn").html(me.find(".phoneVal").html()).append('<span class="caret"></span>')
            }
        })
    },
    /*获得短信的模板*/
    _getMsgAppletAndRootId:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'car_sms_templet_list'"
        }).done(function(s){
            if(s && s.applets){
                widget._UIDEFAULFS.MsgApplet = s.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:widget._UIDEFAULFS.MsgApplet,
                }).done(function(w){
                    if(w && w.rootLink){
                        widget._UIDEFAULFS.MsgRoot = w.rootLink;
                        widget._buildMsgOptions();
                    }
                })
            }
        })
    },
    _buildMsgOptions:function(){
        $("table.msg-template tbody").html(" ");
        Iptools.uidataTool._getUserlistAppletData({
            "appletId": widget._UIDEFAULFS.MsgApplet,
            "condition": "{'sms_templet:type':' =33'}"
        }).done(function (r) {
            if (r && r.data && r.data.records && r.data.records.length) {
                var b = r.data.records;
                for (var i = 0, len = b.length; i < len; i++) {
                    var id="",content = "",name = "",allContent;
                    if(b[i][widget._UIDEFAULFS.MsgRoot+":id"]){
                        id = b[i][widget._UIDEFAULFS.MsgRoot+":id"]
                    }
                    if(b[i][widget._UIDEFAULFS.MsgRoot+":name"]){
                        name = b[i][widget._UIDEFAULFS.MsgRoot+":name"]
                    }
                    if(b[i][widget._UIDEFAULFS.MsgRoot+":content"]){
                       allContent = b[i][widget._UIDEFAULFS.MsgRoot+":content"];
                        content = b[i][widget._UIDEFAULFS.MsgRoot+":content"]
                    }
                    if (name.length >= 10) {
                        name = name.substring(0, 9) + "...";
                    }
                    if (content.length >= 20) {
                        content = content.substring(0, 19) + "...";
                    }
                    var html = "";
                    html = '<tr class="td" data-type="' + id + '" data-id="' + id + '">'+
                        '<td>' + name + '</td>'+
                        '<td class="content" data-content="'+allContent+'">' + content + '</td>'+
                        '</tr>';
                    $("table.msg-template tbody").append(html);
                }
            }else{
                $("table.msg-template tbody").html("<p>暂无数据</p>");
            }
        })
    },
    _gettMsgTemplate:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"table.msg-template tbody tr",
            event:function(){
                $(".msg-content").val("");
                var me = $(this);
                if(me.hasClass("active")){
                    me.removeClass("active");
                    $(".msg-content").val("");
                    $(".msg-count").html("0");
                    $(".msg-templet-btn").html("请选择").append('<span class="caret"></span>');
                    $(".msg-sign button").attr("disabled","true");
                    $(".msg-sign button").removeClass("commonBtn").addClass("disableBtn");
                }else{
                    me.addClass("active");
                    $(".msg-content").val($("tr.active .content").attr("data-content"));
                    $(".msg-count").html($("tr.active .content").attr("data-content").length);
                    $(".msg-templet-btn").html("短信模板").append('<span class="caret"></span>');
                    $(".msg-sign button").removeAttr("disabled");
                    $(".msg-sign button").removeClass("disableBtn").addClass("commonBtn");
                }
            }
        })
    },
}