var common = {};
common = {
    _UIDEFAULFS: {
        msgSig:"",
        taskDetail:"",
        taskDetailRoot:"",
        noteDetail:"",
        noteDetailRoot:"",
//        owner:window.sessionStorage.getItem('userTitle')

    },
    _rebuildUiDefaults: function (options) {
        common._UIDEFAULFS = Iptools.Tool._extend(common._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
        common._inputMsgText();//在发送短信的textarea上输入时，字数的变化随时更改
        common._clickSendMsg();//发送短信给客户
        common._clickSaveInteract();//记录互动----手动添加动态
        common._inputInteract();//记录互动的输入监听
        common._focusTipsText();
        common._cancelSaveNote();
        common._saveNote();//保存笔记
    },
    _bindingEventAfterLoad: function () {//插件的初始化

        $('.titleMonth span.currentTime').html(common._changeNumToText(trace._UIDEFAULFS.month) +'月  ' + trace._UIDEFAULFS.year);
        $('#time_1').attr('data-time',trace._UIDEFAULFS.year+'-'+trace._StandardTime(trace._UIDEFAULFS.month));

        if(trace._UIDEFAULFS.month - 1 <= 0){
            $('.beforeTime').html(common._changeNumToText(trace._UIDEFAULFS.month - 1 +12)+'月  ' +(trace._UIDEFAULFS.year-1));
            $('#time_2').attr('data-time',(trace._UIDEFAULFS.year-1)+'-'+trace._StandardTime(trace._UIDEFAULFS.month - 1 +12));
        }else{
            $('.beforeTime').html(common._changeNumToText(trace._UIDEFAULFS.month - 1)+'月  ' +trace._UIDEFAULFS.year);
            $('#time_2').attr('data-time',trace._UIDEFAULFS.year+'-'+trace._StandardTime(trace._UIDEFAULFS.month - 1));
        }
        if(trace._UIDEFAULFS.month - 2 <= 0){
            $('.threeTime').html(common._changeNumToText(trace._UIDEFAULFS.month - 2 +12)+'月  ' + (trace._UIDEFAULFS.year-1));
            $('#time_3').attr('data-time',(trace._UIDEFAULFS.year-1)+'-'+trace._StandardTime(trace._UIDEFAULFS.month - 2 +12));
        }else{
            $('.threeTime').html(common._changeNumToText(trace._UIDEFAULFS.month - 2)+'月  '+trace._UIDEFAULFS.year);
            $('#time_3').attr('data-time',trace._UIDEFAULFS.year+'-'+trace._StandardTime(trace._UIDEFAULFS.month - 2));
        }

//        var three = common._getAfterDay(trace._UIDEFAULFS.year+'/'+trace._UIDEFAULFS.month+'/'+trace._UIDEFAULFS.day,3);
//        $('#endDay').val(three);
        $("#recordDay").val(trace._UIDEFAULFS.year+'-'+trace._StandardTime(trace._UIDEFAULFS.month)+'-'+trace._StandardTime(trace._UIDEFAULFS.day)+' 12:00')
//        $("#endDay").datetimepicker({
//            format: "yyyy-mm-dd hh:00",
//            autoclose: true,
//            todayBtn: true,
//            language: "zh-CN",
//            minView: 1
//        }).on('hide', function (e) {
//            e = e || event;
//            event.preventDefault();
//            e.stopPropagation();
//            var me = $(this);
//            $("#formTask").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
//        });
        $("#recordDay").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: 1
        });

        $('#taskInfo,#baseInfo,#carInfo,#insuranceInfo,#maintain').on('hidden.bs.collapse', function () {
            $(this).siblings().find('.taskIcon').removeClass('fa-angle-up').addClass('fa-angle-down');
        });
        $('#taskInfo,#baseInfo,#carInfo,#insuranceInfo,#maintain').on('show.bs.collapse', function () {
            $(this).siblings().find('.taskIcon').removeClass('fa-angle-down').addClass('fa-angle-up');
        })
        $('#time_1,#time_2,#time_3').on('hidden.bs.collapse', function () {//隐藏
            $(this).siblings().find('.traceIcon').removeClass('fa-angle-up').addClass('fa-angle-down');
        })
        $('#time_1,#time_2,#time_3').on('show.bs.collapse', function () {//展开----加载数据
            $(this).siblings().find('.traceIcon').removeClass('fa-angle-down').addClass('fa-angle-up');
            //先判断下展开时里面有没有经过数据铺设，即是否是第一次展开---只有第一次展开才捞取下数据，以后都是只做单纯的展开，点击加载更多才加载数据
//            var parent = '#'+$(this).attr('id');
//            var time = $(this).attr('data-time');
//            if($(this).find('.panel-body').children().length == 0){
//                if(widget._UIDEFAULFS.filterTraceType){
//                    widget._getConActionList(parent,time,widget._UIDEFAULFS.filterTraceType);
//                }else{
//                    widget._getConActionList(parent,time);
//                }
//            };
        })
    },
    _check: function(){
        $('#formTask').bootstrapValidator({
            fields: {
                title: {
                    validators: {
                        notEmpty: {
                            message: '请填写任务名称'
                        }
                    }
                },
                dueTime: {
                    validators: {
                        notEmpty: {
                            message: '请选择截止日期'
                        }
                    }
                },
                taskOwner:{
                    validators: {
                        notEmpty: {
                            message: '请选择负责人'
                        }
                    }
                },
                taskDes: {
                    validators: {
                        notEmpty: {
                            message: '请填写任务描述'
                        }
                    }
                },
                taskType: {
                    validators: {
                        notEmpty: {
                            message: '请选择任务类型'
                        }
                    }
                }
            }
        });
    },
    _init: function () {
        common._bindingDomEvent();
        common._getMsgSig();//获得短信签名
        common._getTaskApplet()//获得任务的detailApplet
        common._getNoteApplet();//获得笔记的detailApplet
        common._check();
        common._bindingEventAfterLoad();
    },
    _changeNumToText: function(month){
        var text = "";
        var obj = [
            {"num":1,"text":"一"},
            {"num":2,"text":"二"},
            {"num":3,"text":"三"},
            {"num":4,"text":"四"},
            {"num":5,"text":"五"},
            {"num":6,"text":"六"},
            {"num":7,"text":"七"},
            {"num":8,"text":"八"},
            {"num":9,"text":"九"},
            {"num":10,"text":"十"},
            {"num":11,"text":"十一"},
            {"num":12,"text":"十二"}
        ];
        $.each(obj,function(key,o){
            if(o.num == month){
                text = o.text;
            }
        });
        return text;
    },
    _getMsgSig:function(){
        Iptools.GetJson({
            url:"basic/queryByDictId",
            data:{
                "dictId":"smsSignature",
                "token":Iptools.DEFAULTS.token
            }
        }).done(function(data){
            if(data.retcode === "ok"){
                $('.signature').html(data.result.dictValue);
                common._UIDEFAULFS.msgSig = data.result.dictValue;
            }else{
                $('.signature').html("");
            }
        })
    },
    _getTaskApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'task_detail'"
        }).done(function (data) {
            common._UIDEFAULFS.taskDetail =  data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:common._UIDEFAULFS.taskDetail
            }).done(function(data){
                if(data)
                    common._UIDEFAULFS.taskDetailRoot = data.rootLink;
            });
        });
    },
    _getNoteApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'note_detail'"
        }).done(function (data) {
            common._UIDEFAULFS.noteDetail =  data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:common._UIDEFAULFS.noteDetail
            }).done(function(data){
                if(data)
                    common._UIDEFAULFS.noteDetailRoot = data.rootLink;
            });
        });
    },
//    click event----------------------------------------------------------------------

//
    _cancelSaveNote: function(){
        common._addEventListener({
            container: "body",
            target: ".interactBtnList .cancelNote,#tips .cancelNote",
            type: "click",
            event: function (e) {
                $('.tipBtnList button:first-child').removeClass('saveNote').addClass('notSaveNote').attr('disabled',false);
                $('.interactBtnList button:first-child').removeClass('saveNote').addClass('notSaveNote').attr('disabled',false);
                $('.interact-content textarea').val("");
                $('#tips textarea').val("");
            }
        })
    },
    _saveTask: function(){
        common._addEventListener({
            container: "body",
            target: "#profile .modal-footer .saveTask",
            type: "click",
            event: function (e) {
                var me = $(this);
                var put = me.data('type');
                var id =  me.data('task');
                $('#formTask').bootstrapValidator('validate');
                if(!$('#formTask').data("bootstrapValidator").isValid()){
                    return false;
                }else{
                    var taskTitle = $('.profile-name input').val();
                    var taskDes = $('.profile-des textarea').val();
                    var taskType = $('.profile-type option:selected').val();
                    var taskOwner = $('#owner').attr('data-id');
//                    var taskLevel = $('.profileLevel option:selected').val();
                    var taskDue = $('#endDay').val();//暂时默认是三天后吧
//                var remindDay = $('.profile-remind option:selected').val();//获取提前几天提醒
//                var taskRemind = common._getBeforeDay(taskDue,remindDay);
                    var data = '{"'+common._UIDEFAULFS.taskDetailRoot + ':title":"'+taskTitle+'","'+
                        common._UIDEFAULFS.taskDetailRoot+':contact_id":"'+widget._UIDEFAULFS.conId+'",';
                    if(taskDes){data += '"'+common._UIDEFAULFS.taskDetailRoot+':description":"'+taskDes+'",'};
                    if(taskType){data += '"'+common._UIDEFAULFS.taskDetailRoot+':type":"'+taskType+'",'};
//                    if(taskLevel){data += '"'+common._UIDEFAULFS.taskDetailRoot+':priority":"'+taskLevel+'",'};
                    if(taskDue){data += '"'+common._UIDEFAULFS.taskDetailRoot+':due_time":"'+taskDue+'",'};
//                if(taskRemind){data += '"'+common._UIDEFAULFS.taskDetailRoot+':remind_time":"'+taskRemind+'",'}
                    if(taskOwner){data += '"'+common._UIDEFAULFS.taskDetailRoot+':owner":"'+taskOwner+'",'}
//                    console.log(taskOwner);
                    if(put == 'edit'){
                        data += '}';
//                        console.log(data)
                        Iptools.uidataTool._saveAppletData({
                            appletId:common._UIDEFAULFS.taskDetail,
                            valueId: id,
                            data:data
                        }).done(function(data){
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "任务更新成功"
                            });
                        })
                    }else{
//                                    默认将任务的状态定为进行中
                    data += '"'+common._UIDEFAULFS.taskDetailRoot+':status":"1","'+common._UIDEFAULFS.taskDetailRoot+':creator":"1"';
                    data += '}';
                        Iptools.uidataTool._addAppletData({
                            appletId:common._UIDEFAULFS.taskDetail,
                            data:data
                        }).done(function(data){
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "任务创建成功"
                            });
                            trace._createTaskForContact(Iptools.DEFAULTS.userId,taskTitle,widget._UIDEFAULFS.conId)//客户创建任务的动态
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
                    };
                    widget._getContactTasks();//重新加载客户下挂的任务
                    widget._getContactTasksOfUnFinsh();//获得该客户的未完成任务
                    widget._getContactTasksOfFinshed();//获得该客户的已完成任务
                    $('#addToTask').modal('hide');
                }
            }
        });
    },
    _saveNote: function(){
        common._addEventListener({
            container: "body",
            target: "#tips .btnList .saveNote",
            type: "click",
            event: function (e) {
                var me = $(this);
                me.css({
                    "pointer-events":"none"
                });
                me.button("loading");
                var text =  $('#tips textarea').val()
                var data = '{"'+common._UIDEFAULFS.noteDetailRoot + ':content":"'+text+'","'+common._UIDEFAULFS.noteDetailRoot+':contact_id":"'+widget._UIDEFAULFS.conId+'"}';
                Iptools.uidataTool._addAppletData({
                    appletId:common._UIDEFAULFS.noteDetail,
                    data:data
                }).done(function(data){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "笔记创建成功"
                    });
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
                    $('#tips textarea').val("");
                    setTimeout(function(){
                        me.button("reset");
                        me.css("pointer-events","auto");
                    },1000);
                    $('.tipBtnList button:first-child').removeClass('saveNote').addClass('notSaveNote').attr('disabled',false);
                })
            }
        });
    },
    _focusTipsText: function(){
        common._addEventListener({
            container: "body",
            target: "#tips textarea",
            type: "input",
            event: function (e) {
                if($(this).val().length > 0){
                    $('.tipBtnList button:first-child').removeClass('notSaveNote').addClass('saveNote').attr('disabled',false);
                }else{
                    $('.tipBtnList button:first-child').removeClass('saveNote').addClass('notSaveNote').attr('disabled',true);
                }
            }
        })
    },
    _inputMsgText: function(){
        common._addEventListener({
            container: "body",
            target: ".msg-content textarea",
            type: "input",
            event: function (e) {
                $('.msg-count').html($(this).val().length);
                if($(this).val().length > 0){
                    $('.sendMess .btn').addClass('startSend').removeClass('notSend').attr('disabled',false);
                }else{
                    $('.sendMess .btn').addClass('notSend').removeClass('startSend').attr('disabled',true);
                };
                if(50-$(this).val().length > 0){
                    $('.msg-left').html(50-$(this).val().length);
                }else{
                    $('.msg-left').html(0);
                }
            }
        })
    },
    _clickSendMsg:function(){
        common._addEventListener({
            container: "body",
            target: ".startSend",
            type: "click",
            event: function (e) {
                var me = $(this);
                me.css({
                    "pointer-events":"none"
                });
                me.button("loading");
                if(widget._UIDEFAULFS.phone){
                    Iptools.PostJson({
                        url:"basic/sendSms",
                        data:{
                            token:Iptools.DEFAULTS.token,
                            phoneList:widget._UIDEFAULFS.phone,
                            content:$('.msg-content textarea').val()+'【'+common._UIDEFAULFS.msgSig+'】'
                        }
                    }).done(function(data){
                        if(data.retcode == 'ok'){
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "短信发送成功"
                            });
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
                            $('.msg-content textarea').val("");
                            $('.msg-count').html(0);
                            $('.msg-left').html(50);
                            me.button("reset");
                            me.css("pointer-events","auto");
                            $('.sendMess .btn').addClass('notSend').removeClass('startSend').attr('disabled',true);
                        }
                    })
                }else{
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "短信发送失败"
                    });
                    $('.msg-content textarea').val("");
                    me.button("reset");
                    me.css("pointer-events","auto");
                    $('.sendMess .btn').addClass('notSend').removeClass('startSend').attr('disabled',true);
                }

            }
        })
    },
    _inputInteract : function(){
        common._addEventListener({
            container: "body",
            target: "#recordInteract textarea",
            type: "input",
            event: function (e) {
                var me = $(this);
                if(me.val().length == 0){
                   $('.interactBtnList button:first-child').removeClass('saveNote').addClass('notSaveNote').attr('disabled',true);
                }else if(me.val().length > 0){
                    $('.interactBtnList button:first-child').removeClass('notSaveNote').addClass('saveNote').attr('disabled',false);
                }
            }
        })
    },
    _clickSaveInteract: function () {//记录互动的保存
        common._addEventListener({
            container: "body",
            target: ".interactBtnList .saveNote ",
            type: "click",
            event: function (e) {
                var me = $(this);
                me.css({
                    "pointer-events":"none"
                });
                me.button("loading");
                //                客户来电---19----属于客户事件
                //                外呼记录----18---属于外呼事件大类
                //                客户回访----17---属于外呼事件大类
                //                客户到店---21----属于客户事件
                var interactType = $('.interact-type option:selected').val();
                var category = $('.interact-type option:selected').data('category');
                var title = $('.interact-content  textarea').val();
                var time = $('#recordDay').val();
                var data = '{"'+trace._UIDEFAULFS.contactTraceDeRoot+':title":"'+title+'","'+
                    trace._UIDEFAULFS.contactTraceDeRoot+':owner":"'+Iptools.DEFAULTS.userId+'","'+
                    trace._UIDEFAULFS.contactTraceDeRoot+':contact_id":"'+widget._UIDEFAULFS.conId+'","'+
                    trace._UIDEFAULFS.contactTraceDeRoot+':trace_time":"'+time+'","'+
                    trace._UIDEFAULFS.contactTraceDeRoot+':trace_category":"'+category+'","'+
                    trace._UIDEFAULFS.contactTraceDeRoot+':trace_type":"'+interactType+'"}';
                //手动创建一条动态，post到客户动态中
//                console.log(data)
                Iptools.uidataTool._addAppletData({
                    appletId:trace._UIDEFAULFS.contactTraceDeApplet,
                    data:data
                }).done(function(data){
//                    console.log('手动创建动态成功');
//                    console.log(interactType)
                    $('.interact-content textarea').val("");
                    //只有当动态大类型为 5 或者6 客户事件和活动事件  时需要去调接口更新活跃度等信息
//                    if(interactType == 18 || interactType == 19 || interactType == 21 ){
//                        Iptools.PostJson({
//                            url:"/basic/updateInteractValue?token="+Iptools.DEFAULTS.token+'&contactTrace='+data.id,
//                        }).done(function(data){
////                            console.log(data.retcode)
//                            if(data.retcode == 'ok'){
//                                widget._getInteractInfo();
//                            }
//                        });
//                    };
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
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "互动记录创建成功"
                    });
                    setTimeout(function(){
                        me.button("reset");
                        me.css("pointer-events","auto");
                    },1000);
                    $('.interactBtnList button:first-child').removeClass('saveNote').addClass('notSaveNote').attr('disabled',true);
                });
            }
        });
    }

}