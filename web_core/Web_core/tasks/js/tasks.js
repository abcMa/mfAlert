/**
 * Created by 1 on 2017/5/4.
 */
var taskWidget = {};
taskWidget = {
    _UIDEFAULFS: {
        newConfirmBtn: ".newConfirmBtn",
        searchInput: ".searchInput",
        uploadTask: ".uploadTask",
        addLeft: ".addLeft",
        addRight: ".addRight",
        contactListApplet: "",
        contactListRootId: "",
        employListApplet: "",
        employListRootId: "",
        haveMergeContact: [],
        taskBodyHtml: "",
        addTaskCustomerId: "",
        addTaskContactId: "",
        addNewTaskCustomerId: "",
//        addTaskCarOwnerId: "",
//        addTaskNewCarOwnerId: "",
        contactTraceDeApplet: "",
        contactTraceDeRoot: "",
        id: 1,
        statusId: "",
        task: "task",
        taskStatus: "",
        tourNewBulid: false,
        taskSortable: true,
        taskApplet: "",
        taskDetailApplet: "",
        traceDetailApplet: "",
        taskListEmpty: "",
        carOwnerListApplet: "",
        carOwnerListRootId: ""
    },
    _rebuildUiDefaults: function (options) {
        taskWidget._UIDEFAULFS = Iptools.Tool._extend(taskWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        taskWidget._confirmTaskPopup();//点击简易表单,确定按钮事件
        taskWidget._enableGhangeDeal();//选择交易
        taskWidget._enableUploadForm();//点击保存按钮，提交任务数据
        taskWidget._enableAddCustomerAndDeal();//编辑弹窗点击添加关系，切换添加客户和添加交易输入框和样式
        taskWidget._enableAddNewCustomerAndDeal();//新建弹窗点击添加关系，切换添加客户和添加交易输入框和样式
        taskWidget._enableDownMultiSearch();//点击添加关系的输入框获取查询数据
//        taskWidget._enableDownCarOwnerSearch();//点击查询车主姓名或电话
        taskWidget._enableFocusSearch();//点击输入框获取数据
        taskWidget._enableClickSearchPushData();//点击输入框获取数据
//        taskWidget._enableClickSearchCarOwnerData();//点击下拉列表的单个数据
        taskWidget._enableDrags();//拖拽块
        taskWidget._enableTaskIconList();//点击任务类型
        taskWidget._ownertMultiTaskSearch();//责任人条件搜索
        taskWidget._clickSelectTaskOwnerDemoLi();//责任人条件搜索
        taskWidget._enablePanelTaskName();//点击面板中任务名称，弹出编辑当前任务
        taskWidget._enableHiddenModal();//隐藏模态框事件
        taskWidget._enableClickImgEditTask();//隐藏模态框事件
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        taskWidget._initEndTime();//初始化新建任务日期
        taskWidget._initValidatorForm();//初始化验证表单
        taskWidget._getTaskList();//获取任务列表的list页面
        taskWidget._initGetContactList();//获得客户list的applet
        taskWidget._getAllConListDatas();//获得所有客户的数据
//        taskWidget._initGetCarOwnerList();//获得车主的applet
        taskWidget._focusTaskOwnerSearch();//获得所有员工的数据
        taskWidget._boardBars();//显示滚动条
        taskWidget._showTaskOwner();//责任人显示
        taskWidget._getTaskAllEmply();//获得权限下员工，任务中是负责人
        taskWidget._setPanel();//铺设面板数据
        taskWidget._enableGetOwner();//获得责任人
        taskWidget._enableAllTaskType();//初始化任务类型
        taskWidget._enableListenMessageTask();//监听消息铺设数据
        taskWidget._toSendContactNews();//获取推送客户信息依赖的appletID和参数
        taskWidget._bindingDomEvent();//初始化事件函数
        taskWidget._bindingEventAfterLoad();//初始化插件的事件函数
    },
    _getTaskList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'task_list'"
        }).done(function (data) {
            taskWidget._UIDEFAULFS.taskApplet = data.applets[0].applet;
            component._table("#test", {
                applet: data.applets[0].applet,
                emptyImage: "../Content/Image/nodetail.png",
                emptySize: "150",
                searchModalTitle: "选择负责人",
                emptyText: "没有任务记录",
                emptyClick: function () {
                    $("#editNewTaskForm").data('bootstrapValidator').destroy();
                    $('#editNewTaskForm').data('bootstrapValidator', null);
                    taskWidget._initValidatorForm();//初始化验证表单
                    taskWidget._initGetContactList();
                    taskWidget._getAllConListDatas();
                    $(".addCustomerData").hide();
                    $(".addHeight").css("height","70px");
                    $("#newTaskModal").modal("show");
                },
                showChecks: false,
                jumpType: "template",
                jumpTemplate: "<a class='test'><span class='fa fa-pencil-square-o icon-edit editStyle'></span></a>",
                //点击自己配置的按钮后的事件
                events: [
                    {
                        target: ".s-header-bar .s-manage .add-task",
                        type: "click",
                        event: function () {
                            $("#editNewTaskForm").data('bootstrapValidator').destroy();
                            $('#editNewTaskForm').data('bootstrapValidator', null);
                            taskWidget._initValidatorForm();//初始化验证表单
                            taskWidget._initGetContactList();
                            taskWidget._getAllConListDatas();
                            taskWidget._enableAllTaskType();
//                            $(".newBuildCarOwnerData").hide();
//                            $(".newBuildCarOwner").hide();
                            $(".addNewRight").show();
                            $(".addCustomerData").hide();
                            $(".searchOwnerTaskNewInput").removeAttr("disabled");
                            $(".addModal").hide();
                            $(".addHeight").css("height","70px");
                            $("#newTaskModal").modal("show");
                        }
                    },
                    {
                        target: ".test",
                        type: "click",
                        event: function () {
                            var me = $(this);
                            taskWidget._UIDEFAULFS.id = me.parent().data("key");
                            taskWidget._editTaskFunction();//编辑任务弹窗函数
                        }
                    },
                    {
                        target: ".taskCheck",
                        type: "click",
                        event: function () {
                            var me=$(this),param={},index=me.parent().parent().attr("data-index"),taskId=me.parent().data("id"),data=$("#test").data("stable").options.data;
                            $("#test .s-column").each(function (key, obj) {
                                $(obj).find(".s-cell").eq(parseInt(index) + 1).css("color", "#c3c3c3");
                            });
                            if($(this).is(":checked") == true){
                                taskWidget._UIDEFAULFS.taskStatus = "已完成";
                                $(this).parent().attr("data-task","true");
                                $("#test .s-column").each(function (key, obj) {
                                    $(obj).find(".s-cell").eq(parseInt(index) + 1).css("color", "#c3c3c3");
                                });
                                param[taskWidget._UIDEFAULFS.task + ":status"] = "2";
                                    Iptools.uidataTool._getUserDetailAppletData({
                                        appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                                        valueId: taskId
                                    }).done(function (r) {
                                        taskWidget._pushMessageContact(me.parent().next().html(),r.data[taskWidget._UIDEFAULFS.task + ":contact_id"].id,14);//向客户页发送消息
                                        taskWidget._pushMessageCustomer(me.parent().next().html(),r.data[taskWidget._UIDEFAULFS.task + ":customer_id"].id,14,false);//向车主推送任务消息
                                    });
                            }else{
                                taskWidget._UIDEFAULFS.taskStatus = "重新开启";
                                Iptools.uidataTool._getUserDetailAppletData({
                                    appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                                    valueId: taskId
                                }).done(function (r) {
                                    taskWidget._pushMessageContact(me.parent().next().html(),r.data[taskWidget._UIDEFAULFS.task + ":contact_id"].id,22);//向客户页发送消息
                                    taskWidget._pushMessageCustomer(me.parent().next().html(),r.data[taskWidget._UIDEFAULFS.task + ":customer_id"].id,22,false);//向车主推送任务消息
                                });
                                $(this).parent().attr("data-task","false");
                                $("#test .s-column").each(function (key, obj) {
                                    $(obj).find(".s-cell").eq(parseInt(index) + 1).css("color", "#333");
                                });
                                param[taskWidget._UIDEFAULFS.task+":status"] = "1";
                            }
                            var paramStr = JSON.stringify(param);
                            Iptools.uidataTool._saveAppletData({
                                appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                                valueId: taskId,
                                data: paramStr
                            }).done(function (r) {
                                if(r && r.retcode == "ok"){
                                    Iptools.Tool.pAlert({
                                        type: "info",
                                        title: "系统提示：",
                                        content: me.parent().next().html() + " " + " " + taskWidget._UIDEFAULFS.taskStatus,
                                        delay: 2500
                                    });
                                    taskWidget._pushMessageTask();//发送任务消息
                                    taskWidget._pushMessageMyTask();//发送我的任务消息
                                }
                            });
                        }
                    }
                ],
                dataModify: function (r) {
                    Iptools.uidataTool._getCustomizeApplet({
                        nameList: "'task_detail'"
                    }).done(function (data) {
                        taskWidget._UIDEFAULFS.taskDetailApplet = data.applets[0].applet;
                    });
                    var promise = $.Deferred();
                    if (r) {
                        if (r.data && r.data.records && r.data.records.length) {
                            for (var i = 0; i < r.data.records.length; i++) {
                                var rec = r.data.records[i];
                                if(rec[r.rootLink + ":status"] && rec[r.rootLink + ":status"].id){
                                    if(rec[r.rootLink + ":status"].id == "2"){
                                        rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='true' data-id='" + rec[r.rootLink + ":id"]+"'><input type='checkbox' class='taskCheck blueCheckbox'/></span>" + "<span class='taskNameTitle' data-id='" + rec[r.rootLink + ":id"] + "'>" + rec["task:title"] + "</span>";
                                    }else{
                                        rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='false' data-id='" + rec[r.rootLink + ":id"]+"'><input type='checkbox' class='taskCheck blueCheckbox'/></span>" + "<span class='taskNameTitle' data-id='" + rec[r.rootLink + ":id"] + "'>" + rec["task:title"] + "</span>";
                                    }
                                }else{
                                    rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='false' data-id='" + rec[r.rootLink + ":id"]+"'><input type='checkbox' class='taskCheck blueCheckbox'/></span>" + "<span class='taskNameTitle' data-id='" + rec[r.rootLink + ":id"] + "'>" + rec["task:title"] + "</span>";
                                }
                            }
                        }else{
                            taskWidget._UIDEFAULFS.taskListEmpty = "emp";
                        }
                    }
                    promise.resolve(r);
                    return promise;
                },
                afterLoad: function () {
                    var tour = new Tour({
                        backdrop: true,
                        template:"<div class='popover tour' style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
                            +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
                            +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
                            +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
                        steps: [
                            {
                                element: ".add-task",
                                title: "添加任务",
                                placement: "bottom",
                                content: "点击按钮即可给自己或同事创建任务，支持设置截止时间、关联客户",
                                onShown: function () {
                                    $(".tour-step-background").css({"width":"87px","height":"33px","border-radius":"4px"});
                                }
                            },
                            {
                                element: ".btn-group .dropdown-toggle",
                                title: "任务筛选",
                                placement: "bottom",
                                content: "根据任务状态、任务类型、负责人筛选任务",
                                onShown: function () {
                                    $(".tour-step-background").css({"width":"63px","height":"33px","border-radius":"4px"});
                                }
                            },
                            {
                                element: ".s-btn-group",
                                title: "视图切换",
                                placement: "bottom",
                                content: "按列表或统计面板视图查看任务",
                                onShown: function () {
                                    $(".tour-step-background").css({"width":"156px","height":"33px","border-radius":"4px"});
                                }
                            }
                        ],
                        onEnd: function () {
                            $(".commonBtn").removeClass("disabled");
                        }
                    });
                    var tourOneTask = new Tour({
                        backdrop: true,
                        template:"<div class='popover tour'  style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
                            +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
                            +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
                            +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
                        steps: [
                            {
                                element: ".taskCheckStyle:first",
                                title: "完成任务",
                                placement: "right",
                                content: "勾选即表示完成任务，也可去掉勾选重新打开任务",
                                onShown: function () {
                                    $(".tour-step-background").css({"width":"15px","height":"14px","top":"114px","border-radius":"50%"});
                                }
                            },
                            {
                                element: ".s-table .s-column .s-cell.header:eq(6)",
                                title: "任务排序",
                                placement: "bottom",
                                content: "点击列表表头即可按列排序，如按任务截止时间排序",
                                onShown: function () {
                                    $(".tour-step-background").css({"width":"176px","height":"43px","border-radius":"4px"});
                                }
                            },
                            {
                                element: ".s-manage-freeze",
                                title: "编辑任务",
                                placement: "left",
                                content: "点击操作一列按钮，可编辑任务内容",
                                onShown: function () {
                                    $(".tour-step-background").css({"border-radius":"2px"});
                                }
                            }
                        ],
                        onEnd: function () {
                            $(".s-table .s-column .s-cell.header").removeClass("disabled");
                            $(".s-manage-freeze").removeClass("disabled");
                            $(".taskCheckStyle input.taskCheck").removeClass("disabled");
                        }
                    });
                    if(window.localStorage.getItem("task_tour_one") != "yes"){
                        tour.init();
                        window.localStorage.setItem("task_tour_one","yes");
                        $(".commonBtn").addClass("disabled");
                        tour.start(true);
                        tour.goTo(0);
                    }
                    if(taskWidget._UIDEFAULFS.tourNewBulid == true && window.localStorage.getItem("task_tour_two") != "yes"){
                        tourOneTask.init();
                        window.localStorage.setItem("task_tour_two","yes");
                        $(".s-table .s-column .s-cell.header").addClass("disabled");
                        $(".s-manage-freeze").addClass("disabled");
                        $(".taskCheckStyle input.taskCheck").addClass("disabled");
                        tourOneTask.start(true);
                        tourOneTask.goTo(0);
                    }
                    taskWidget._addEventListener({
                        container: "body",
                        target: ".s-manage-freeze .test",
                        type: "mouseover",
                        event: function () {
                            var me = $(this);
                            me.attr("title","编辑任务");
                        }
                    });
                    var indexs = [];
                    $("#test" + " .s-table .s-column .s-cell .taskCheckStyle").each(function (key, obj) {
                        var taskStatus = $(obj).attr("data-task");
                        if(taskStatus == "true"){
                            var index = parseInt($(obj).parent().attr("data-index")) + 1;
                            $(obj).find("input").attr("checked",true);
                            indexs.push(index);
                        }
                    });
                    for(var i = 0; i < indexs.length;i++){
                        $(".s-column").each(function (key,obj) {
                            $(obj).find(".s-cell").eq(indexs[i]).css("color", "#c3c3c3");
                        });
                    }
                },
                multiPanel: true,
                panels: [
                    {
                        name: "面板",
                        icon: "icon-th",
                        container: "test_panel",
                        onShow: function () {
                            taskWidget._setPanel();//铺设面板数据
                            $(".s-manage").hide();
                        }
                    }],
                searchEvent: function (condition) {
                    if (condition) {$("#test_panel").append(JSON.stringify(condition) + "<br/>");}
                }
            });
        })
    },
    _initEndTime: function () {
        $("#modalTimeDay").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: 1,
            startDate: (new Date()).format("yyyy-MM-dd hh:00")
        }).on('hide',function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            $('#editTaskForm').data('bootstrapValidator')
                .updateStatus('modalTimeDay','NOT_VALIDATED',null)
                .validateField('modalTimeDay');
        });
        $("#modalNewTimeDay").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: 1,
            startDate: (new Date()).format("yyyy-MM-dd hh:00")
        }).on('hide',function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            $('#editNewTaskForm').data('bootstrapValidator')
                .updateStatus('modalNewTimeDay','NOT_VALIDATED',null)
                .validateField('modalNewTimeDay');
        });
    },
    _initValidatorForm: function () {
        $("#editNewTaskForm").bootstrapValidator({
            fields: {
                modalNewTaskName: {
                    validators: {
                        notEmpty: {
                            message: '请输入任务名称'
                        }
                    }
                },
                modalNewTimeDay: {
                    validators: {
                        notEmpty: {
                            message: '请选择截止日期'
                        }
                    }
                }
            }
        });
        $("#editTaskForm").bootstrapValidator({
            fields: {
                modalTaskName: {
                    validators: {
                        notEmpty: {
                            message: '请输入任务名称'
                        }
                    }
                },
                modalTimeDay: {
                    validators: {
                        notEmpty: {
                            message: '请选择截止日期'
                        }
                    }
                }
            }
        });
    },
    _initGetContactList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list'"
        }).done(function (r) {
            taskWidget._UIDEFAULFS.contactListApplet = r.applets[0].applet;//2866
            Iptools.uidataTool._getApplet({
                applet: r.applets[0].applet
            }).done(function (data) {
                taskWidget._UIDEFAULFS.contactListRootId = data.rootLink;//39
            });
        });
    },
//    _initGetCarOwnerList: function () {
//        Iptools.uidataTool._getCustomizeApplet({
//            nameList: "'customer_list'"
//        }).done(function (r) {
//            taskWidget._UIDEFAULFS.carOwnerListApplet = r.applets[0].applet;//2866
//            Iptools.uidataTool._getApplet({
//                applet: r.applets[0].applet
//            }).done(function (data) {
//                taskWidget._UIDEFAULFS.carOwnerListRootId = data.rootLink;//39
//                taskWidget._initGetAllCarOwnerListData();//获得所有车主的数据信息
//            });
//        });
//    },
    _getAllConListDatas: function (param) {
        Iptools.uidataTool._getUserlistAppletData({
            appletId: taskWidget._UIDEFAULFS.contactListApplet,
            pageNow: 1,
            condition: param
        }).done(function (s) {
            $('.conListBySearch').html("");
            $('.conListBySearchs').html("");
            if (s && s.data && s.data.records) {
                $.each(s.data.records, function (key, obj) {
                    var RootId = taskWidget._UIDEFAULFS.contactListRootId;
                    var name = obj[RootId + ':title'] ? obj[RootId + ':title'] : "";
                    var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                    if(taskWidget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
                        var html = '<li role="presentation" class="demoLi">'+
                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                            '</li>';
                        var taskHtml = '<li role="presentation" class="TaskLi">'+
                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                            '</li>';
                        $('.conListBySearch').append(html);
                        $('.conListBySearchs').append(taskHtml);
                    }
                });
            }
        })
    },
//    _initGetAllCarOwnerListData: function (carOwnerData) {
//        Iptools.uidataTool._getUserlistAppletData({
//            appletId: taskWidget._UIDEFAULFS.carOwnerListApplet,
//            pageNow: 1,
//            condition: carOwnerData
//        }).done(function (s) {
//            $('.carListBySearch').html("");
//            $('.newBuildCarOwnerListBySearch').html("");
//            if (s && s.data && s.data.records) {
//                $.each(s.data.records, function (key, obj) {
//                    var RootId = taskWidget._UIDEFAULFS.carOwnerListRootId;
//                    var name = obj[RootId + ':customer_name'] ? obj[RootId + ':customer_name'] : "";
//                    var phone = obj[RootId + ':customer_cellphone'] ? obj[RootId + ':customer_cellphone'] : "";
//                    if(taskWidget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的车主不展示了
//                        var carHtml = '<li role="presentation" class="carOwnerLi">'+
//                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
//                            '</li>';
//                        var newBuildCarOwnerHtml = '<li role="presentation" class="newBuildCarOwnerLi">'+
//                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
//                            '</li>';
//                        $('.carListBySearch').append(carHtml);
//                        $('.newBuildCarOwnerListBySearch').append(newBuildCarOwnerHtml);
//                    }
//                });
//            }
//        })
//    },
    _enableGetOwner: function () {
        Iptools.GetJson({
            url: "basic/employees",
            data:{
                token: Iptools.DEFAULTS.token
            }
        }).done(function (data) {
            taskWidget._UIDEFAULFS.addownerId = Iptools.DEFAULTS.userId;
            var optionHtml = "<option value='" + Iptools.DEFAULTS.userId + "'>孙何辉（店长）</option>";
            $("#modalTaskOwner").html("");
            $("#modalNewTaskOwner").html("");
            for(var i = 0; i < data.length;i++){
                if(data[i].name){
                    if(data[i].id != Iptools.DEFAULTS.userId){
                        optionHtml += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                }
            }
            $("#modalTaskOwner").append(optionHtml);
            $("#modalNewTaskOwner").append(optionHtml);
        });
    },
    _enableAllTaskType: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'task_list'"
        }).done(function (data) {
            Iptools.GetJson({
                url: "service/appletConfig",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: data.applets[0].applet
                }
            }).done(function (datas) {
                if (datas && datas.listColumns) {
                    var columnsHtml = '<option value="">请选择...</option>';
                    var statusHtml = '<option value="">请选择...</option>';
                    $("#modalTaskType").html("");
                    $("#modalTaskStatus").html("");
                    $("#modalNewTaskType").html("");
                    for (var k = 0; k < datas.listColumns.length; k++) {
                        if (datas.listColumns[k].columnName == "task:type") {
                            for (var i = 0, j = 1; i < datas.listColumns[k].pickList.length; i++, j++) {
                                columnsHtml += '<option value="' + j + '">' + datas.listColumns[k].pickList[i].name + '</option>';
                            }
                            $("#modalTaskType").html(columnsHtml);
                            $("#modalNewTaskType").html(columnsHtml);
                        }
                        if (datas.listColumns[k].columnName == "task:status") {
                            for (var p = 0; p < datas.listColumns[k].pickList.length; p++) {
                                statusHtml += '<option value="' + datas.listColumns[k].pickList[p].id + '">' + datas.listColumns[k].pickList[p].name + '</option>';
                            }
                            $("#modalTaskStatus").html(statusHtml);
                            $("#modalNewTaskStatus").html(statusHtml);
                        }
                    }
                }
            });
        });
    },
    _enableListenMessageTask: function () {
        Iptools.Tool._pushListen("send_message_task_list", function () {
            $("#test").data("stable")._refresh();
        });
    },
    _toSendContactNews: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Trace Detail'"
        }).done(function (data) {
            taskWidget._UIDEFAULFS.contactTraceDeApplet =  data.applets[0].applet;//8143
            Iptools.uidataTool._getApplet({
                applet: taskWidget._UIDEFAULFS.contactTraceDeApplet
            }).done(function (data) {
                if(data)
                    taskWidget._UIDEFAULFS.contactTraceDeRoot = data.rootLink;//225
            });
        });
    },
    //显示滚动条
    _boardBars: function () {
        var arr = $('.stageContent li.stageBlock');
        var wth = (261 * (arr.length)) - 1;
        $('.stageContent').width(wth);
        $('.panelTour').width(wth);
    },
    //---------------------------------------------------------------------------------------------责任人逻辑铺设
    _showTaskOwner: function () {
        Iptools.GetJson({
            url: "basic/getEmployee",
            data: {
                token: Iptools.DEFAULTS.token,
                id: Iptools.getDefaults({ key: "selectUser" })
            }
        }).done(function (r) {
            $("#owner").val(r.employee.name);
            $("#owner").attr("data-id", r.employee.id);
            taskWidget._focusTaskOwnerSearch();
//            if(r){
//                if(r.organization == 1){
//                    taskWidget._focusTaskOwnerSearch();
//                }else{
//                    $("#owner").attr("disabled",true);
//                }
//            }
        })
    },
    //-----------------------------------------------------------------------------------------------铺设责任人数据
    _getTaskAllEmply: function (param) {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'employee_list'"
        }).done(function (r) {
            taskWidget._UIDEFAULFS.employListApplet = r.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet: r.applets[0].applet
            }).done(function (data) {
                taskWidget._UIDEFAULFS.employListRootId = data.rootLink;
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: taskWidget._UIDEFAULFS.employListApplet,
                    pageNow: 1,
                    condition: param
                }).done(function (s) {
                    $('.searchOwnerListInput').html("");
                    $('.searchOwnerListNewInput').html("");
                    if (s && s.data && s.data.records) {
                        $.each(s.data.records, function (key, obj) {
                            var RootId = taskWidget._UIDEFAULFS.employListRootId;
                            var name = obj[RootId + ':name'] ? obj[RootId + ':name'] : "";
                            var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                            var html = '<li role="presentation" class="demoLis">'+
                                '<a role="menuitem" tabindex="-1" class="hint-link" data-id="' + obj[RootId + ':id'] + '">' + name+ '-' + phone + '</a>'+
                                '</li>';
                            var htmlList = '<li role="presentation" class="demoList">'+
                                '<a role="menuitem" tabindex="-1" class="hint-link" data-id="' + obj[RootId + ':id'] + '">' + name+ '-' + phone + '</a>'+
                                '</li>';
                            $('.searchOwnerListInput').append(html);
                            $('.searchOwnerListNewInput').append(htmlList);
                        });
                    }
                })
            });
        });
    },
    _setPanel: function () {
        if($(".stage_main_content").width() < 1042){
            $(".stage_main_content").css("overflow-x","scroll");
        }else{
            $(".stage_main_content").css("overflow-x","hidden");
        }
        $(window).resize(function () {
            if($(".stage_main_content").width() < 1042){
                $(".stage_main_content").css("overflow-x","scroll");
            }else{
                $(".stage_main_content").css("overflow-x","hidden");
            }
        });
            Iptools.uidataTool._getCustomizeApplet({
                nameList: "'task_list'"
            }).done(function (data) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: data.applets[0].applet,
                    pageSize: 10000
                }).done(function (r) {
                    $("#addTaskDeals").html("");
                    var columnsHtml="",statusHtml="",statusWHtml="",statusNotHtml="",task= r.rootLink,Taskid="",taskTitle="",taskOwner="",taskTime="",num=0,numT=0,numW= 0,numK = 0;
                    var emptyImg = '<div  class="emptyImg"><img src="../Content/Image/noTaskNew.png"/><div class="emptyWord">该阶段任务已全部完成！</div></div>';
                    $(".status").html("");
                    $(".statusT").html("");
                    $(".statusW").html("");
                    $(".statusNot").html("");
                    $(".numS").html("");
                    $(".numT").html("");
                    $(".numW").html("");
                    $(".numNot").html("");
                    if(r && r.data && r.data.records){
                        for(var i = 0,j = 1; i < r.data.records.length;i++,j++){
                            if(r.data.records[i][task + ':status']){
                                Taskid = r.data.records[i][task + ':id'];
                                taskTitle = r.data.records[i][task + ':title'];
                                if(r.data.records[i][task + ':owner']){taskOwner = r.data.records[i][task + ':owner'].name + " - ";}else{taskOwner = "";}
                                taskTime = r.data.records[i][task + ':due_time'];
                                taskTime = taskTime.substring(5,taskTime.length);
                                taskTime = taskTime.substring(0,taskTime.length - 3);
                                if(r.data.records[i][task+':status'].id == "1"){
                                    num++;
                                    columnsHtml = '<li class="portlet "><div class="portlet-header" data-id="' + Taskid + '"><a ><span class="taskTitle">'
                                        + taskTitle + '</span><br><span class="time">' + taskOwner + '<span class="date_time">' + taskTime + '</span></span></a></div></li>';
                                    $(".status").append(columnsHtml);
                                }else if(r.data.records[i][task + ':status'].id == "2"){
                                    numT++;
                                    statusHtml = '<li class="portlet " data-id="' + Taskid + '"><div class="portlet-header"  data-id="' + Taskid
                                        + '"><a ><span class="taskTitle">' + taskTitle + '</span><br><span class="time">' + taskOwner + '<span class="date_time">' + taskTime
                                        + '</span></span></a></div></li>';
                                    $(".statusT").append(statusHtml);
                                }else if(r.data.records[i][task + ':status'].id == "0"){
                                    numW++;
                                    statusWHtml = '<li class="portlet " data-id="' + Taskid + '"><div class="portlet-header"  data-id="' + Taskid
                                        + '"><a ><span class="taskTitle">' + taskTitle + '</span><br><span class="time">' + taskOwner + '<span class="date_time">' + taskTime
                                        + '</span></span></a></div></li>';
                                    $(".statusW").append(statusWHtml);
                                }else if(r.data.records[i][task + ':status'].id == "3"){
                                    numK++;
                                    statusNotHtml = '<li class="portlet " data-id="' + Taskid + '"><div class="portlet-header"  data-id="' + Taskid
                                        + '"><a ><span class="taskTitle">' + taskTitle + '</span><br><span class="time">' + taskOwner + '<span class="date_time">' + taskTime
                                        + '</span></span></a></div></li>';
                                    $(".statusNot").append(statusNotHtml);
                                }
                            }
                        }
                        if(num > 0){$(".numS").html(num);}else{$(".status").append(emptyImg);$(".numS").html(0);}
                        if(numT > 0){$(".numT").html(numT);}else{$(".statusT").append(emptyImg);$(".numT").html(0);}
                        if(numW > 0){$(".numW").html(numW);}else{$(".statusW").append(emptyImg);$(".numW").html(0);}
                        if(numK > 0){$(".numNot").html(numK);}else{$(".statusNot").append(emptyImg);$(".numNot").html(0);}
                        var arr = [num,numT,numW,numK];
                        var compare = function (x, y) {//比较函数
                            if (x < y) {
                                return -1;
                            } else if (x > y) {
                                return 1;
                            } else {
                                return 0;
                            }
                        };
                        var height = (arr.sort(compare)[3] + 3)*74 + "px";
                        if(arr.sort(compare)[3] > 10){
                            $(".stageContent").css("height",height);
                            $(".stage_main_content").css("overflow-y","scroll");
                        }else{
                            $(".stageContent").css("height","825px");
                            $(".stage_main_content").css("overflow-y","hidden");
                        }
                    }
                    if(!r.data){
                        $(".numS").html(0);
                        $(".numT").html(0);
                        $(".numW").html(0);
                        $(".numK").html(0);
                        $(".status").append(emptyImg);
                        $(".statusT").append(emptyImg);
                        $(".statusW").append(emptyImg);
                        $(".statusNot").append(emptyImg);
                        $(".stage_main_content").css("overflow-y","hidden");
                    }
                    taskWidget._UIDEFAULFS.taskSortable = true;
                })
            });
    },
    _pushMessageTask: function () {
        Iptools.uidataTool._pushMessage({channel: "send_message_task_list"});
    },
    _pushMessageMyTask: function () {
        Iptools.uidataTool._pushMessage({channel: "send_message_my_task_list"});
    },
    _pushMessageContact: function (taskName,contactId,traceType,type) {//依次是：任务名称，推送的客户，客户模块任务状态值，是否异步请求
        Iptools.uidataTool._addAppletData({
            async: type == false ? false : true,
            appletId: taskWidget._UIDEFAULFS.contactTraceDeApplet,
            data:'{"'+ taskWidget._UIDEFAULFS.contactTraceDeRoot + ':title":"' + taskName + '","'
                + taskWidget._UIDEFAULFS.contactTraceDeRoot + ':trace_category":"2","'
                + taskWidget._UIDEFAULFS.contactTraceDeRoot + ':trace_time":"' + (new Date()).format("yyyy-MM-dd hh:mm:ss") + '","'
                + taskWidget._UIDEFAULFS.contactTraceDeRoot + ':contact_id":"' + contactId + '","'
                + taskWidget._UIDEFAULFS.contactTraceDeRoot + ':owner":"' + Iptools.DEFAULTS.userId + '","'
                + taskWidget._UIDEFAULFS.contactTraceDeRoot + ':trace_type":"' + traceType + '"}'
        }).done(function () {
            Iptools.uidataTool._pushMessage({
                channel: "send_message_task_list_" + contactId
            });
        });
    },
    _pushMessageCustomer: function (taskName,customerId,traceType,type) {//依次是：任务名称，推送的车主，车主模块任务状态值，是否异步请求
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Trace Detail'"
        }).done(function (datas) {
            taskWidget._UIDEFAULFS.traceDetailApplet = datas.applets[0].applet;
            var prefix = "contact_trace";
            var paramData = {};
            var param = {};
            param[prefix + ":title"] = taskName;
            param[prefix + ":customer_id"] = customerId;
            param[prefix + ":trace_time"] = (new Date()).format("yyyy-MM-dd hh:mm:ss");
            param[prefix + ":owner"] = Iptools.DEFAULTS.userId;
            param[prefix + ":trace_category"] = "2";
            param[prefix + ":trace_type"] = traceType;
//        param[prefix + ":car_id"] = ;
//        paramData["async"] = type + "== false ? false : true";
            paramData["data"] = JSON.stringify(param);
            paramData["appletId"] = taskWidget._UIDEFAULFS.traceDetailApplet;
            Iptools.uidataTool._addAppletData(paramData).done(function(){
                Iptools.uidataTool._pushMessage({
                    channel: "task_detail_trace_listener" + customerId
                });
            });
        })
    },
//    事件函数
    _confirmTaskPopup: function () {
        taskWidget._addEventListener({
            container: "body",
            target: taskWidget._UIDEFAULFS.newConfirmBtn,
            type: "click",
            event: function () {
                $("#editNewTaskForm").bootstrapValidator('validate');
                if ($("#editNewTaskForm").data("bootstrapValidator").isValid()) {
                    var taskDatas ="task";
                    var valStatus = "0";
                    var valcreator = "1";
                    var taskStr = {};
                    taskStr[taskDatas+":title"] = $("#modalNewTaskName").val();
                    taskStr[taskDatas+":due_time"] = $("#modalNewTimeDay").val();
                    taskStr[taskDatas+":status"] = valStatus;
                    taskStr[taskDatas+":creator"] = valcreator;
                    if(taskWidget._UIDEFAULFS.addNewTaskCustomerId != ""){taskStr[taskDatas+":contact_id"] = taskWidget._UIDEFAULFS.addNewTaskCustomerId;}
//                    if(taskWidget._UIDEFAULFS.addTaskCarOwnerId != ""){taskStr[taskDatas+":customer_id"] = taskWidget._UIDEFAULFS.addTaskCarOwnerId;}
                    if($("#modalNewTaskDepict").val() && $("#modalNewTaskDepict").val() !=""){taskStr[taskDatas+":description"] = $("#modalNewTaskDepict").val();}
                    if($("#modalNewTaskStatus option:selected").val() != ""){taskStr[taskDatas+":status"] = $("#modalNewTaskStatus option:selected").val();}
                    if($("#modalNewTaskType option:selected").val() != ""){ taskStr[taskDatas+":type"] = $("#modalNewTaskType option:selected").val();}
                    taskStr[taskDatas+":owner"] = taskWidget._UIDEFAULFS.addownerId;
                    var taskString = JSON.stringify(taskStr);
                        Iptools.uidataTool._addAppletData({
                            appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                            data: taskString
                        }).done(function(r){
                            if(r && r.retcode == "ok"){
                                Iptools.Tool.pAlert({
                                    type: "info",
                                    title: "系统提示：",
                                    content: r.retmsg,
                                    delay: 1000
                                });
                                taskWidget._pushMessageTask();//发送任务消息
                                taskWidget._pushMessageMyTask();//发送我的任务消息
                                if(taskWidget._UIDEFAULFS.addNewTaskCustomerId != ""){
                                    taskWidget._pushMessageContact($("#modalNewTaskName").val(),taskWidget._UIDEFAULFS.addNewTaskCustomerId,9,false);//向客户页发送消息
                                }
//                                if(taskWidget._UIDEFAULFS.addTaskCarOwnerId != ""){
//                                    taskWidget._pushMessageCustomer($("#modalNewTaskName").val(),taskWidget._UIDEFAULFS.addTaskCarOwnerId,9,false);//向车主推送任务消息
//                                }
                                $("#modalNewTaskName").val("");
                                $(".addNewLeft").removeAttr("style");
                                $(".addNewCustomerData").show();
                                $(".modal-body .dropdown-toggle").show();
                                $("#addNewTaskDeals").hide();
                                $(".newNewCustomer").hide();
                                $(".addNewDealsData").show();
                                $(".addHeight").css("height","105px");
                                $(".addNewTaskCustomer").show().val("").attr("data-id","");
                                $("#modalNewTaskDepict").val("");
                                $("#modalNewTaskType").attr("data-id","");
                                $("#modalNewTaskOwner").val("");
                                $("#modalNewTaskType option:selected").val("");
                                $("#modalNewTaskOwner option:selected").val("");
                                taskWidget._UIDEFAULFS.tourNewBulid = true;
                            }
                        });
                    taskWidget._setPanel();//铺设面板数据
                    $("#newTaskModal").modal("hide");
                };
            }
        });
    },
    _enableUploadForm: function () {
        taskWidget._addEventListener({
            container: "body",
            target: taskWidget._UIDEFAULFS.uploadTask,
            type: "click",
            event: function () {
                $("#editTaskForm").bootstrapValidator('validate');
                if ($("#editTaskForm").data("bootstrapValidator").isValid()) {
                    var taskDatas = "task";
                    var statusId = "";
                    var param = {};
                    Iptools.uidataTool._getUserDetailAppletData({
                        async: false,
                        appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                        valueId: taskWidget._UIDEFAULFS.id
                    }).done(function (k) {
                        if(k.data){ statusId = k.data[k.rootLink+':status'].id;}
                    });
                    param[taskDatas+":title"] = $("#modalTaskName").val();
                    param[taskDatas+":due_time"] = $("#modalTimeDay").val();
                    if($("#modalTaskStatus option:selected").val() != ""){param[taskDatas+":status"] = $("#modalTaskStatus option:selected").val();}
                    if($("#modalTaskType option:selected").val() != ""){param[taskDatas+":type"] = $("#modalTaskType option:selected").val();}
                    if($("#modalTaskOwner option:selected").val() != ""){param[taskDatas+":owner"] = taskWidget._UIDEFAULFS.addownerId;}
                    if(taskWidget._UIDEFAULFS.addTaskCustomerId != ""){param[taskDatas+":contact_id"] = taskWidget._UIDEFAULFS.addTaskCustomerId;}
//                    if(taskWidget._UIDEFAULFS.addTaskCarOwnerId != ""){param[taskDatas+":customer_id"] = taskWidget._UIDEFAULFS.addTaskCarOwnerId;}
                    if($("#modalTaskDepict").val() != ""){param[taskDatas+":description"] = $("#modalTaskDepict").val();}
                    var paramStr = JSON.stringify(param);
                        Iptools.uidataTool._saveAppletData({
                            appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                            valueId: taskWidget._UIDEFAULFS.id,
                            data: paramStr
                        }).done(function (r) {
                            if(r && r.retcode == "ok"){
                                Iptools.Tool.pAlert({
                                    type: "info",
                                    title: "系统提示：",
                                    content: r.retmsg,
                                    delay: 1000
                                });
                                taskWidget._setPanel();//铺设面板数据
                                taskWidget._pushMessageTask();//发送任务消息
                                taskWidget._pushMessageMyTask();//发送我的任务消息
                                if(taskWidget._UIDEFAULFS.addTaskCustomerId != "" && taskWidget._UIDEFAULFS.addTaskCustomerId != taskWidget._UIDEFAULFS.addTaskContactId){
                                    taskWidget._pushMessageContact($("#modalTaskName").val(),taskWidget._UIDEFAULFS.addTaskCustomerId,9);//向客户页发送消息
                                }
//                                if(taskWidget._UIDEFAULFS.addTaskCarOwnerId != "" && taskWidget._UIDEFAULFS.addTaskCarOwnerId != taskWidget._UIDEFAULFS.addTaskNewCarOwnerId){
//                                    taskWidget._pushMessageCustomer($("#modalTaskName").val(),taskWidget._UIDEFAULFS.addTaskCarOwnerId,9,false);//向车主推送任务消息
//                                }
                                Iptools.uidataTool._getUserDetailAppletData({
                                    appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                                    valueId: taskWidget._UIDEFAULFS.id
                                }).done(function (m) {
                                    if(m.data){
                                        if(statusId != "2" && m.data[m.rootLink+':status'].id == "2"){
                                            taskWidget._pushMessageContact($("#modalTaskName").val(),taskWidget._UIDEFAULFS.addTaskCustomerId,14);//向客户页发送消息
//                                            taskWidget._pushMessageCustomer($("#modalTaskName").val(),taskWidget._UIDEFAULFS.addTaskCarOwnerId,14,false);//向车主推送任务消息
                                        }
                                    }
                                });
                                $('#owner').removeAttr("data-id");
                                $(".addCustomerVal").removeAttr("data-id");
                                $(".addTransactionVal").removeAttr("data-id");
                            }
                        });
                    $("#myTaskModal").modal("hide");
                }
            }
        });
    },
    _enableAddCustomerAndDeal: function () {
        taskWidget._addEventListener({
            container: "body",
            target: taskWidget._UIDEFAULFS.addLeft,
            type: "click",
            event: function () {
                $(".addCustomerData").show();
                $(".modal-body .dropdown-toggle").show();
                $(".addTaskCustomer").show();
                $(".carOwner").hide();
                $(".addHeight").css("height","105px");
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: taskWidget._UIDEFAULFS.addRight,
            type: "click",
            event: function () {
                $(".addCustomerData").hide();
                $(".modal-body .dropdown-toggle").show();
                $(".carOwner").show();
                $(".addHeight").css("height","105px");
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: ".addNewCustomer",
            type: "click",
            event: function () {
                $(".addLeft").show();
                $(".addCustomerData").show();
                $(".modal-body .dropdown-toggle").show();
                $(".newCustomer").hide();
                $(".carOwner").hide();
                $(".addHeight").css("height","105px");
                $(".addTaskCustomer").val("").attr("data-id","");
            }
        });
//        taskWidget._addEventListener({
//            container: "body",
//            target: ".addNewCarOwner",
//            type: "click",
//            event: function () {
//                $(".addRight").show();
//                $(".carOwner").show();
//                $(".newCarOwner").hide();
//                $(".addCustomerData").hide();
//                $(".addHeight").css("height","105px");
//                $(".addCarOwnerName").val("").attr("data-id","");
//                $(".searchCarOwnerInput").val("");
//                $(".modal-body .dropdown-toggle").show();
//            }
//        });
    },
    _enableAddNewCustomerAndDeal: function () {
        taskWidget._addEventListener({
            container: "body",
            target: ".addNewLeft",
            type: "click",
            event: function () {
                $(".addCustomerData").show();
//                $(".newBuildCarOwnerData").hide();
                $(".addNewDealsData").hide();
                $(".addHeight").css("height","105px");


                $(".addCustomerData .dropdown-toggle").show();
                $(".addNewTaskCustomer").show();

//                $(".newBuildTaskCarOwner").hide();
//                $(".newBuildCarOwnerData .dropdown-toggle").hide();
            }
        });
        taskWidget._addEventListener({
            container :"body",
            target: ".addNewRight",
            type: "click",
            event: function () {
                $(".addNewRight").show();
//                $(".newBuildCarOwnerData").show();
//                $(".newBuildCarOwner").hide();
                $(".addCustomerData").hide();
                $(".addHeight").css("height","105px");

                $(".addCustomerData .dropdown-toggle").hide();
                $(".addNewTaskCustomer").hide();
//                $(".newBuildTaskCarOwner").show();
//                $(".newBuildCarOwnerData .dropdown-toggle").show();
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: ".addNewCustomers",
            type: "click",
            event: function () {
                $(".addNewLeft").show();
                $(".addCustomerData").show();
//                $(".newBuildCarOwnerData").hide();
                $(".newNewCustomer").hide();
                $(".addHeight").css("height","105px");
                $(".addNewTaskCustomer").val("");
                taskWidget._UIDEFAULFS.addNewTaskCustomerId = "";


                $(".addCustomerData .dropdown-toggle").show();
                $(".addNewTaskCustomer").show();
//                $(".newBuildTaskCarOwner").hide();
//                $(".newBuildCarOwnerData .dropdown-toggle").hide();
            }
        });
//        taskWidget._addEventListener({
//            container: "body",
//            target: ".addNewNewCarOwner",
//            type: "click",
//            event: function () {
//                $(".addCustomerData").hide();
//                $(".addNewRight").show();
//                $(".newBuildCarOwner").hide();
//                $(".newBuildCarOwnerData").show();
//                taskWidget._UIDEFAULFS.addTaskCarOwnerId = "";
//
//
//                $(".addCustomerData .dropdown-toggle").hide();
//                $(".addNewTaskCustomer").hide();
//                $(".newBuildTaskCarOwner").show();
//                $(".newBuildCarOwnerData .dropdown-toggle").show();
//
//                $(".addHeight").css("height","105px");
//            }
//        });
    },
    _enableDownMultiSearch: function () {
        taskWidget._addEventListener({
            container: "body",
            target: ".input-group .searchConInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = taskWidget._UIDEFAULFS.contactListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"'+rootId +':phone":" like \'%'+inputText+'%\'"}';
                }else{
                    condition = '{"'+rootId+':title":" like \'%'+inputText+'%\'"}';
                }
                taskWidget._getAllConListDatas(condition);
                return false;
            }
        });
    },
//    _enableDownCarOwnerSearch: function () {
//        taskWidget._addEventListener({
//            container: "body",
//            target: ".input-group .searchCarOwnerInput",
//            type: "input",
//            event: function (e) {
//                e = e || event;
//                e.stopPropagation();
//                var inputText = $(this).val();
//                var rootId = taskWidget._UIDEFAULFS.carOwnerListRootId;
//                var condition = "";
//                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
//                    condition = '{"'+rootId +':customer_cellphone":" like \'%'+inputText+'%\'"}';
//                }else{
//                    condition = '{"'+rootId+':customer_name":" like \'%'+inputText+'%\'"}';
//                };
//                taskWidget._initGetAllCarOwnerListData(condition);//获得搜索的车主的数据信息
//                return false;
//            }
//        });
//        taskWidget._addEventListener({
//            container: "body",
//            target: ".input-group .newBuildTaskCarOwner",
//            type: "input",
//            event: function (e) {
//                e = e || event;
//                e.stopPropagation();
//                var inputText = $(this).val();
//                var rootId = taskWidget._UIDEFAULFS.carOwnerListRootId;
//                var condition = "";
//                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
//                    condition = '{"'+rootId +':customer_cellphone":" like \'%'+inputText+'%\'"}';
//                }else{
//                    condition = '{"'+rootId+':customer_name":" like \'%'+inputText+'%\'"}';
//                };
//                taskWidget._initGetAllCarOwnerListData(condition);//获得搜索的车主的数据信息
//                return false;
//            }
//        });
//    },
    _enableFocusSearch: function () {
        taskWidget._addEventListener({
            container: "body",
            target: ".input-group .searchConInput",
            type: "click",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                var me = $(this);
                me.parent().find(".input-group-btn").addClass("open");
                me.parent().find("button").attr("aria-expanded", "true");
            }
        });
    },
//    _enableClickSearchCarOwnerData: function () {
//        taskWidget._addEventListener({
//            container: "body",
//            target: "ul .carOwnerLi",
//            type: "click",
//            event: function () {
//                var me = $(this);
//                $('.form-control.searchCarOwnerInput').val(me.find('a').html());
//                if(me.find('a').html().split("-")[0] == ""){
//                    $(".addCarOwnerName").html(me.find('a').html().split("-")[1]);
//                }else{
//                    $(".addCarOwnerName").html(me.find('a').html().split("-")[0]);
//                }
//                $(".addCarOwnerName").attr("data-id",me.find('a').attr("data-id"));
//                $('.form-control.searchCarOwnerInput').attr("data-id",me.find('a').attr("data-id"));
//                taskWidget._UIDEFAULFS.addTaskCarOwnerId = me.find('a').attr("data-id");
//                $(".carOwner").hide();
//                $(".addRight").hide();
//                $(".newCarOwner").show();
//                $(".addHeight").css("height","70px");
//            }
//        });
//        taskWidget._addEventListener({
//            container: "body",
//            target: "ul .newBuildCarOwnerLi",
//            type: "click",
//            event: function () {
//                var me = $(this);
//                if(me.find('a').html().split("-")[0] == ""){
//                    $(".newBuildCarOwnerVal").html(me.find('a').html().split("-")[1]);
//                }else{
//                    $(".newBuildCarOwnerVal").html(me.find('a').html().split("-")[0]);
//                }
//                taskWidget._UIDEFAULFS.addTaskCarOwnerId = me.find('a').attr("data-id");
//                $(".addNewRight").hide();
//                $(".newBuildCarOwnerData").hide();
//                $(".newBuildCarOwner").show();
//                $(".addHeight").css("height","70px");
//            }
//        });
//    },
    _enableClickSearchPushData: function () {
        taskWidget._addEventListener({
            container: "body",
            target: "ul .demoLi",
            type: "click",
            event: function () {
                var me = $(this);
                $('.form-control.addTaskCustomer').val(me.find('a').html());
                if(me.find('a').html().split("-")[0] == ""){
                    $(".addCustomerVal").html(me.find('a').html().split("-")[1]);
                }else{
                    $(".addCustomerVal").html(me.find('a').html().split("-")[0]);
                }
                $(".addCustomerVal").attr("data-id",me.find('a').attr("data-id"));
                $('.form-control.addTaskCustomer').attr("data-id",me.find('a').attr("data-id"));
                taskWidget._UIDEFAULFS.addTaskCustomerId = me.find('a').attr("data-id");
                $(".addCustomerData").hide();
                $(".addLeft").hide();
                $(".newCustomer").removeAttr("style");
                $(".addHeight").css("height","60px");
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: "ul .TaskLi",
            type: "click",
            event: function () {
                var me = $(this);
                $('.form-control.addNewTaskCustomer').val(me.find('a').html());
                if(me.find('a').html().split("-")[0] == ""){
                    $(".addNewCustomerVal").html(me.find('a').html().split("-")[1]);
                }else{
                    $(".addNewCustomerVal").html(me.find('a').html().split("-")[0]);
                }
                $(".addNewCustomerVal").attr("data-id",me.find('a').attr("data-id"));
                $('.form-control.addNewTaskCustomer').attr("data-id",me.find('a').attr("data-id"));
                taskWidget._UIDEFAULFS.addNewTaskCustomerId = me.find('a').attr("data-id");
                $(".addNewCustomerData").hide();
                $(".addNewTaskCustomer").hide();
                $(".addNewLeft").hide();
                $(".modal-body .dropdown-toggle").hide();
                $(".newNewCustomer").removeAttr("style");
                $(".addHeight").css("height","60px");
            }
        });
    },
    _enableDrags: function () {
        $( ".column" ).sortable({
            connectWith: ".column",
            handle: ".portlet-header",
            cancel: ".portlet-toggle",
            scroll: true,
            placeholder: "portlet-placeholder ui-corner-all",
            receive: function (event,ui) {
                if(taskWidget._UIDEFAULFS.taskSortable == true){
                    taskWidget._UIDEFAULFS.taskSortable = false;
                    Iptools.uidataTool._getUserDetailAppletData({
                        appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                        valueId: ui.item.children("div").data("id")
                    }).done(function (r) {
                        var param = {};
                        param[r.rootLink+":status"] = ui.item.parent().prev().data("id");
                        var paramStr = JSON.stringify(param);
                        Iptools.uidataTool._saveAppletData({
                            appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                            valueId: ui.item.children("div").data("id"),
                            data: paramStr
                        }).done(function (data) {
                            if(r.data[r.rootLink+":status"].id == "2"){
                                taskWidget._pushMessageContact(ui.item.children("div").children("a").children("span").html(),r.data[taskWidget._UIDEFAULFS.task+":contact_id"].id,22);//向客户页发送消息
//                                taskWidget._pushMessageCustomer(ui.item.children("div").children("a").children("span").html(),r.data[taskWidget._UIDEFAULFS.task+":customer_id"].id,22,false);//向车主推送任务消息
                            }
                            if(ui.item.parent().prev().data("id") == 2){
                                Iptools.uidataTool._getUserDetailAppletData({
                                    appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                                    valueId: ui.item.children("div").data("id")
                                }).done(function (r) {
                                    taskWidget._pushMessageContact(ui.item.children("div").children("a").children("span").html(),r.data[taskWidget._UIDEFAULFS.task+":contact_id"].id,14);//向客户页发送消息
//                                    taskWidget._pushMessageCustomer(ui.item.children("div").children("a").children("span").html(),r.data[taskWidget._UIDEFAULFS.task+":customer_id"].id,14,false);//向车主推送任务消息
                                });
                            }
                            if(data && data.retcode == "ok"){
                                taskWidget._setPanel();//铺设面板数据
                                taskWidget._pushMessageTask();//发送任务消息
                                taskWidget._pushMessageMyTask();//发送我的任务消息
                            }
                        });
                    });
                }
            }
        });
        $( ".portlet" )
            .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
            .find( ".portlet-header" )
            .addClass( "ui-corner-all" )
    },
    _enableGhangeDeal: function () {
        $('#addTaskDeals').change(function () {
            $("#addTaskDeals").attr("data-id",$("#addTaskDeals option:selected").val());
            $(".addTransactionVal").html($("#addTaskDeals option:selected").text());
            $(".addTransactionVal").attr("data-id",$("#addTaskDeals option:selected").val());
            if($("#addTaskDeals option:selected").val() != ""){
                $(".addDealsData").hide();
                $(".addRight").hide();
                $(".addHeight").css("height","70px");
                $(".newDeal").removeAttr("style");
            }
        });
        $('#addNewTaskDeals').change(function () {
            $("#addNewTaskDeals").attr("data-id",$("#addNewTaskDeals option:selected").val());
            $(".addNewTransactionVal").html($("#addNewTaskDeals option:selected").text());
            $(".addNewTransactionVal").attr("data-id",$("#addNewTaskDeals option:selected").val());
            if($("#addNewTaskDeals option:selected").val() != ""){
                $(".addNewDealsData").hide();
                $(".addNewRight").hide();
                $(".addHeight").css("height","70px");
                $(".newNewDeal").removeAttr("style");
            }
        });
        $('#modalTaskOwner').change(function () {
            $("#modalTaskOwner").attr("data-id",$("#modalTaskOwner option:selected").val());
        })
    },
    //-------------------------------------------------------------------------------------------------责任人铺设
    _ownertMultiTaskSearch: function () {
        taskWidget._addEventListener({
            container: "body",
            target: ".input-group .searchOwnerTaskInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = taskWidget._UIDEFAULFS.employListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"'+rootId +':phone":" like \'%'+inputText+'%\'"}';
                }else{
                    condition = '{"'+rootId+':name":" like \'%'+inputText+'%\'"}';
                };
                taskWidget._getTaskAllEmply(condition);
                return false;
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: ".input-group .searchOwnerTaskNewInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = taskWidget._UIDEFAULFS.employListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"'+rootId +':phone":" like \'%'+inputText+'%\'"}';
                }else{
                    condition = '{"'+rootId+':name":" like \'%'+inputText+'%\'"}';
                };
                taskWidget._getTaskAllEmply(condition);
                return false;
            }
        });
    },
    //------------------------------------------------------------------------------------------------负责人搜索
    _focusTaskOwnerSearch: function(){
        taskWidget._addEventListener({
            container: "body",
            target: ".input-group #owner",
            type: "click",
            event: function (e) {
                e = e||event;
                e.stopPropagation();
                var me = $(this);
                me.parent().find(".input-group-btn").addClass("open");
                me.parent().find("button").attr("aria-expanded", "true");
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: ".input-group #ownerTwo",
            type: "click",
            event: function (e) {
                e = e||event;
                e.stopPropagation();
                var me = $(this);
                me.parent().find(".input-group-btn").addClass("open");
                me.parent().find("button").attr("aria-expanded", "true");
            }
        });
    },
    //---------------------------------------------------------------------------------------点击列表铺设员工数据
    _clickSelectTaskOwnerDemoLi: function () {
        taskWidget._addEventListener({
            container: "body",
            target: ".demoLis",
            type: "click",
            event: function () {
                var me = $(this);
                $('.searchOwnerTaskInput').val(me.find('a').html());
                $('.searchOwnerTaskInput').attr("data-id",me.find('a').attr("data-id"));
                taskWidget._UIDEFAULFS.addownerId = me.find('a').attr("data-id");
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: ".demoList",
            type: "click",
            event: function () {
                var me = $(this);
                $('.searchOwnerTaskNewInput').val(me.find('a').html());
                $('.searchOwnerTaskNewInput').attr("data-id",me.find('a').attr("data-id"));
                taskWidget._UIDEFAULFS.addownerId = me.find('a').attr("data-id");
            }
        });
    },
    _enableTaskIconList: function(){
        taskWidget._addEventListener({
            container: "body",
            target: ".s-btn-group .commonBtn",
            type: "click",
            event:function () {
                var me = $(this);
                if($(me.children()[0]).attr("class") == "fa fa-list"){
                    $(".s-manage").show();
                }else{
                    var tourThTask = new Tour({
                        backdrop: true,
                        template:"<div class='popover tour' style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
                            +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
                            +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
                            +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
                        steps: [
                            {
                                element: ".panelTour",
                                title: "任务分类",
                                placement: "bottom",
                                content: "面板视图按任务状态分类",
                                onShow: function () {
                                    $(".panelTour").show();
                                },
                                onShown: function () {
                                    $(".tour-step-background").css("border-radius","4px");
                                    $(".stageContent li .tourHead").css("border","none");
                                },
                                onHide: function () {
                                    $(".panelTour").hide();
                                }
                            },
                            {
                                element: ".stageBlock .header:eq(1)",
                                title: "分类统计",
                                placement: "bottom",
                                content: "将每个状态的任务进行统计",
                                onShown: function () {
                                    $(".tour-step-background").css("border-radius","4px");
                                }
                            },
                            {
                                element: ".ui-sortable .portlet-header:first",
                                title: "拖拽操作",
                                placement: "bottom",
                                content: "简单拖拽即可快速变更任务状态",
                                onShow: function () {
                                    $("li.portlet").css("cursor","default");
                                    $( ".column" ).sortable({ disabled: true });
                                    $(".stageContent .column .portlet a").addClass("disabled");
                                },
                                onShown: function () {
                                    $(".tour-step-background").css("border-radius","4px");
                                }
                            }
                        ],
                        onEnd: function () {
                            $(".panelTour").hide();
                            $( ".column" ).sortable({ disabled: false });
                            $(".stageContent .column .portlet a").removeClass("disabled");
                            $(".stageContent li .tourHead").css("border","1px solid #dfe3eb");
                            $("li.portlet").css("cursor","move");
                        }
                    });
                    var tourThTaskEmpty = new Tour({
                        backdrop: true,
                        template:"<div class='popover tour' style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
                            +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
                            +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
                            +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
                        steps: [
                            {
                                element: ".panelTour",
                                title: "任务分类",
                                placement: "bottom",
                                content: "面板视图按任务状态分类",
                                onShow: function () {
                                    $(".panelTour").show();
                                },
                                onShown: function () {
                                    $(".tour-step-background").css("border-radius","4px");
                                    $(".stageContent li .tourHead").css("border","none");
                                },
                                onHide: function () {
                                    $(".panelTour").hide();
                                }
                            },
                            {
                                element: ".stageBlock .header:eq(1)",
                                title: "分类统计",
                                placement: "bottom",
                                content: "将每个状态的任务进行统计",
                                onShown: function () {
                                    $(".tour-step-background").css("border-radius","4px");
                                }
                            }
                        ],
                        onEnd: function () {
                            $(".panelTour").hide();
                            $( ".column" ).sortable({ disabled: false });
                            $(".stageContent .column .portlet a").removeClass("disabled");
                            $(".stageContent li .tourHead").css("border","1px solid #dfe3eb");
                            $("li.portlet").css("cursor","move");
                        }
                    });
                    if(window.localStorage.getItem("task_tour_three") != "yes"){
                        if(taskWidget._UIDEFAULFS.taskListEmpty == "emp"){
                            taskWidget._UIDEFAULFS.taskListEmpty = "";
                            tourThTaskEmpty.init();
                            window.localStorage.setItem("task_tour_three","yes");
                            $( ".column" ).sortable({ disabled: true });
                            $(".stageContent .column .portlet a").addClass("disabled");
                            $("li.portlet").css("cursor","default");
                            tourThTaskEmpty.start(true);
                            tourThTaskEmpty.goTo(0);
                        }else{
                            tourThTask.init();
                            window.localStorage.setItem("task_tour_three","yes");
                            $( ".column" ).sortable({ disabled: true });
                            $(".stageContent .column .portlet a").addClass("disabled");
                            $("li.portlet").css("cursor","default");
                            tourThTask.start(true);
                            tourThTask.goTo(0);
                        }
                    }
                }
            }
        });
    },
    _enablePanelTaskName: function () {
        taskWidget._addEventListener({
            container: "body",
            target: ".taskTitle",
            type: "click",
            event:function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                taskWidget._UIDEFAULFS.id = me.parent().parent().data("id");
                taskWidget._editTaskFunction();//编辑任务弹窗函数
            }
        });
        taskWidget._addEventListener({
            container: "body",
            target: ".taskNameTitle",
            type: "click",
            event:function (e) {
                e = e || event;
                e.stopPropagation();
                taskWidget._UIDEFAULFS.id = $(this).data("id");
                taskWidget._editTaskFunction();//编辑任务弹窗函数
            }
        });
    },
    _editTaskFunction: function () {
        $("#editTaskForm").data('bootstrapValidator').destroy();
        $('#editTaskForm').data('bootstrapValidator', null);
        taskWidget._initValidatorForm();//初始化验证表单
        Iptools.GetJson({
            url: "service/appletDataGetDetail",
            data:{
                token: Iptools.DEFAULTS.token,
                appletId: taskWidget._UIDEFAULFS.taskDetailApplet,
                valueId: taskWidget._UIDEFAULFS.id
            }
        }).done(function (r) {
            var task=r.rootAliasName,owerns="",owernname="",statuss="",statusname="",types="",typename="",contact_ids="",contact_idHtml="",carOwner_ids="",carOwner_idHtml="",deal_ids="",deal_idHtml="",due_times="",due_timet="",due_timename="",remind_times="",remind_timet="",remind_timename="",descriptions="";
            var titles = r.detailData[task+':title'];
            if(r.detailData[task+':status']){statuss = r.detailData[task+':status'].id;}
            if(r.detailData[task+':owner']){owerns = r.detailData[task+':owner'].id;owernname = r.detailData[task+':owner'].name;}
            if(r.detailData[task+':type']){types = r.detailData[task+':type'].id;}
            if(r.detailData[task+':contact_id']){contact_ids = r.detailData[task+':contact_id'].id;contact_idHtml = r.detailData[task+':contact_id'].name;}
            if(r.detailData[task+':customer_id']){carOwner_ids = r.detailData[task+':customer_id'].id;carOwner_idHtml = r.detailData[task+':customer_id'].name;}
            if(r.detailData[task+':deal_id']){deal_ids = r.detailData[task+':deal_id'].id;deal_idHtml = r.detailData[task+':deal_id'].name;}
            due_times = r.detailData[task+':due_time'];
            remind_times = r.detailData[task+':remind_time'];
            descriptions = r.detailData[task+':description'];
            $("#modalTaskName").val(titles);
            $("#modalTaskStatus").val(statuss).attr("data-id",statuss);
            taskWidget._UIDEFAULFS.statusId = statuss;
            $(".addCustomerVal").attr("data-id",contact_ids).html(contact_idHtml);
//            $(".addCarOwnerName").attr("data-id",carOwner_ids).html(carOwner_idHtml);
            $(".addTaskCustomer").attr("data-id",contact_ids);
            $(".addTaskCustomer").val(contact_idHtml);
            taskWidget._UIDEFAULFS.addTaskCustomerId = contact_ids;
            taskWidget._UIDEFAULFS.addTaskContactId = contact_ids;
//            taskWidget._UIDEFAULFS.addTaskCarOwnerId = carOwner_ids;
//            taskWidget._UIDEFAULFS.addTaskNewCarOwnerId = carOwner_ids;
            if(taskWidget._UIDEFAULFS.addTaskCustomerId != ""){
                $(".addLeft").hide();
                $("#addTaskDeals").hide();
                $(".newCustomer").removeAttr("style");
                $(".addCustomerData").hide();
            }else{
                $(".newCustomer").hide();
                $(".addLeft").removeAttr("style");
                $(".addDealsData").hide();
                $(".addCustomerData").hide();
                $(".addTaskCustomer").hide();
                $(".modal-body .dropdown-toggle").hide();
            }
//            if (taskWidget._UIDEFAULFS.addTaskCarOwnerId != "") {
//                $(".addRight").hide();
//                $(".newCarOwner").show();
//                $(".carOwner").hide();
//            } else {
//                $(".addRight").show();
//                $(".newCarOwner").hide();
//                $(".carOwner").hide();
//            }
            $(".addHeight").css("height","70px");
            $(".addTransactionVal").attr("data-id",deal_ids).html(deal_idHtml);
            $("#addTaskDeals").attr("data-id",deal_ids);
            $("#addTaskDeals").val(deal_ids);
            $("#modalTimeDay").val(due_times);
            $("#modalTimehour").val(due_timename);
            $("#modalRemindTime").val(remind_times);
            $("#modalRemindTimehour").val(remind_timename);
            $("#modalTaskDepict").val(descriptions);
            $("#modalTaskType").attr("data-id",types).val(types);
            $("#ownerTwo").val(owernname).attr("data-id",owerns);
            taskWidget._UIDEFAULFS.addownerId = owerns;
            if(r.detailData && r.detailData[task+':status']){
                if(r.detailData[task+':status'].id == "2"){
                    $("#myTaskModal input").attr("readOnly","true");
                    $("#myTaskModal select").attr("disabled","disabled");
                    $("#myTaskModal textarea").attr("disabled","disabled");
                    $("#myTaskModal .uploadTask").attr("disabled","disabled");
                    $("#myModalLabel").html("查看任务");
                    $(".addModal").show();
                }else{
                    $("#myTaskModal input").removeAttr("readOnly");
                    $("#myTaskModal select").removeAttr("disabled");
                    $("#myTaskModal textarea").removeAttr("disabled");
                    $("#myTaskModal .uploadTask").removeAttr("disabled");
                    $("#myModalLabel").html("编辑任务");
                    $(".addModal").hide();
                }
            }
        });
        $(".addTaskCustomer").val("");
//        $(".searchCarOwnerInput").val("");
        $("#modalTimeDay").attr("readonly","readonly");
        $("#modalTimehour").attr("readonly","readonly");
        $("#myTaskModal").modal("show");
    },
    _enableHiddenModal: function () {
        $('#newTaskModal').on('hidden.bs.modal', function (e) {
            taskWidget._enableAllTaskType();//初始化任务类型
            $("#modalNewTaskName").val("");
            $("#modalNewTaskStatus").val("").removeClass("disabled").css("background-color","#fff");
            $(".addNewTaskCustomer").val("").css("data-id","").hide().val("").removeAttr("data-id");
            $("#modalNewTimeDay").val("");
            $("#modalNewTimehour").val("");
            $("#modalNewTaskDepict").val("");
            $("#modalNewTaskType").val("").css("data-id","");
            taskWidget._enableGetOwner();
            $(".addNewLeft").removeAttr("style");
            $(".addCustomerData").show();
            $(".addNewCustomerData").show();
            $(".modal-body .dropdown-toggle").hide();
            $("#addNewTaskDeals").hide();
            $(".newNewCustomer").hide();
            $(".addNewDealsData").show();
            $(".addHeight").css("height","70px");
            taskWidget._showTaskOwner();//责任人显示
            taskWidget._UIDEFAULFS.addNewTaskCustomerId = "";
//            taskWidget._UIDEFAULFS.addTaskCarOwnerId = "";
        });
    },
    _enableClickImgEditTask: function () {
        taskWidget._addEventListener({
            container: "body",
            target: ".emptyImg img",
            type: "click",
            event: function () {
                var me = $(this);
                $("#editNewTaskForm").data('bootstrapValidator').destroy();
                $('#editNewTaskForm').data('bootstrapValidator', null);
                taskWidget._initValidatorForm();//初始化验证表单
                taskWidget._initGetContactList();
                taskWidget._getAllConListDatas();
                $(".addCustomerData").hide();
                $(".addModal").hide();
                $(".addHeight").css("height","70px");
//                $(".newBuildCarOwnerData").hide();
                $("#modalNewTaskStatus").addClass("disabled").css("background-color","#eee").val(me.parent().parent().prev().data("id"));
                $(".searchOwnerTaskNewInput").removeAttr("disabled");
                $("#newTaskModal").modal("show");
            }
        });
    }
};