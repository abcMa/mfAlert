/**
 * Created by 1 on 2017/5/4.
 */
var myTaskWidget = {};
myTaskWidget = {
    _UIDEFAULFS: {
        newConfirmBtn: ".newConfirmBtn",
        searchInput: ".searchInput",
        uploadTask: ".uploadTask",
        taskName: ".taskName",
        addLeft: ".addLeft",
        addRight: ".addRight",
        contactListApplet: "",
        contactListRootId: "",
        employListApplet: "",
        employListRootId: "",
        haveMergeContact: [],
        taskBodyHtml: "",
        addTaskCustomerId: "",
        addMyCarOwnerId: "",
        addMyNewCarOwnerId: "",
        addMyTaskContactId: "",
        addNewTaskCustomerId: "",
        contactTraceDeApplet: "",
        contactTraceDeRoot: "",
        addownerId: "",
        id: 1,
        task: "task",
        taskStatus: "",
        myTourNewBulid: false,
        taskSortable: true,
        myTaskApplet: "",
        myTaskDetailApplet: "",
        traceDetailApplet: "",
        myTaskListEmpty: "",
        myCarListApplet: "",
        myCarListRootId: ""
    },
    _rebuildUiDefaults: function (options) {
        myTaskWidget._UIDEFAULFS = Iptools.Tool._extend(myTaskWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        myTaskWidget._confirmMyTaskPopup();//点击简易表单,确定按钮事件
        myTaskWidget._enableGhangeMyDeal();//选择交易
        myTaskWidget._enableUploadMyForm();//点击保存按钮，提交任务数据
        myTaskWidget._enableAddMyCustomerAndDeal();//编辑弹窗点击添加关系，切换添加客户和添加交易输入框和样式
        myTaskWidget._enableAddMyNewCustomerAndDeal();//新建弹窗点击添加关系，切换添加客户和添加交易输入框和样式
        myTaskWidget._enableDownMultiMySearch();//点击添加关系的输入框获取查询数据
        myTaskWidget._enableClickCarMySearch();//点击添加关系的关联车主输入框获取查询数据
        myTaskWidget._enableClickCarListMySearch();//点击下拉框的数据，生成标签
        myTaskWidget._enableMyFocusSearch();//点击输入框获取数据
        myTaskWidget._enableClickMySearchPushData();//点击输入框获取数据
        myTaskWidget._enableMyDrags();//拖拽块
        myTaskWidget._enableMyTaskIconList();//点击显示和隐藏新建任务按钮
        myTaskWidget._ownertMultiMyTaskSearch();//责任人条件搜索
        myTaskWidget._clickSelectMyTaskOwnerDemoLi();//责任人条件搜索
        myTaskWidget._enablePanelMyTaskName();//点击面板中任务名称，弹出编辑当前任务
        myTaskWidget._enableMyHiddenModal();//隐藏模态框事件
        myTaskWidget._enableClickImgEditMyTask();//隐藏模态框事件
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        myTaskWidget._initEndMyTime();//初始化新建任务日期
        myTaskWidget._initValidatorMyForm();//初始化验证表单
        myTaskWidget._getMyTaskList();//获取任务列表的list页面
        myTaskWidget._initGetContactMyList();//获得客户list的applet
        myTaskWidget._getAllConListMyDatas();//获得所有客户的数据
        myTaskWidget._initGetMyCarListApplet();//获得车主的list的applet
        myTaskWidget._focusTaskOwnerSearch();//获得所有员工的数据
        myTaskWidget._boardMyBars();//显示滚动条
        myTaskWidget._showMyTaskOwner();//责任人显示
        myTaskWidget._getMyTaskAllEmply();//获得权限下员工，任务中是负责人
        myTaskWidget._setMyPanel();//铺设面板数据
        myTaskWidget._enableGetMyOwner();//获得责任人
        myTaskWidget._enableAllMyTaskType();//初始化任务类型
        myTaskWidget._enableListenMessageMyTask();//监听消息铺设数据
        myTaskWidget._toSendMyContactNews();//我的任务获取发送客户的appletID和参数
        myTaskWidget._bindingDomEvent();//初始化事件函数
        myTaskWidget._bindingEventAfterLoad();//初始化插件的事件函数
    },
    _getMyTaskList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'mytask_list'"
        }).done(function (data) {
            myTaskWidget._UIDEFAULFS.myTaskApplet = data.applets[0].applet;
            component._table("#myTest", {
                applet: data.applets[0].applet,
                emptyImage: "../../Content/Image/nodetail.png",
                emptySize: "150",
                searchModalTitle: "选择负责人",
                emptyText: "还没有指派给你的任务",
                emptyClick: function () {
                    $("#editNewTaskForm").data('bootstrapValidator').destroy();
                    $('#editNewTaskForm').data('bootstrapValidator', null);
                    myTaskWidget._initValidatorMyForm();//初始化验证表单
                    myTaskWidget._initGetContactMyList();
                    myTaskWidget._getAllConListMyDatas();
                    myTaskWidget._enableAllMyTaskType();
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
                        target: ".s-header-bar .s-manage .add-myTask",
                        type: "click",
                        event: function () {
                            $("#editNewTaskForm").data('bootstrapValidator').destroy();
                            $('#editNewTaskForm').data('bootstrapValidator', null);
                            myTaskWidget._initValidatorMyForm();//初始化验证表单
                            myTaskWidget._initGetContactMyList();
                            myTaskWidget._getAllConListMyDatas();
                            $(".newBuildCarOwnerData").hide();
                            $(".addCustomerData").hide();
                            $(".addModal").hide();
                            $(".addHeight").css("height","70px");
                            $(".searchOwnerTaskNewInput").removeAttr("disabled");
                            $("#newTaskModal").modal("show");
                        }
                    },
                    {
                        target: ".test",
                        type: "click",
                        event: function () {
                            var me = $(this);
                            myTaskWidget._UIDEFAULFS.id = me.parent().data("key");
                            myTaskWidget._editMyTaskFunction();//编辑任务弹窗函数
                        }
                    },
                    {
                        target: ".taskMyCarNameTitle",
                        type: "click",
                        event: function () {
                            var me = $(this);
                            var viewobj = {
                                "nameList": '\"car_detail_view\"'
                            };
                            var carId = me.attr("data-car-id");
                            var linkId = me.attr("data-id");
                            Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
                                Iptools.uidataTool._getView({
                                    view: thisView.views[0].view,
                                    async: false
                                }).done(function (data) {
                                    Iptools.Tool._jumpView({
                                        view: thisView.views[0].view,
                                        name: data.view.name,
                                        type: data.view.type,
                                        primary: data.view.primary,
                                        icon: data.view.icon,
                                        url: data.view.url,
                                        valueId: carId,
                                        bread: true
                                    }, null, function () {
                                        if (linkId != 0) {
                                            Iptools.Tool._setTabData({
                                                view: thisView.views[0].view,
                                                valueId: carId,
                                                type: data.view.type,
                                                key: "contactLinkId",
                                                value: linkId
                                            });
                                        }
                                    })
                                })
                            });
                        }
                    },
                    {
                        target: ".taskCheck",
                        type: "click",
                        event: function () {
                            var me = $(this);
                            var param = {};
                            var index = me.parent().parent().attr("data-index");
                            var taskId = me.parent().data("id");
                            var data = $("#myTest").data("stable").options.data;
                            $("#myTest .s-column").each(function (key, obj) {
                                $(obj).find(".s-cell").eq(parseInt(index) + 1).css("color", "#c3c3c3");
                            });
                            if($(this).is(":checked") == true){
                                myTaskWidget._UIDEFAULFS.taskStatus = "已完成";
                                $(this).parent().attr("data-task","true");
                                $("#myTest .s-column").each(function (key, obj) {
                                    $(obj).find(".s-cell").eq(parseInt(index) + 1).css("color", "#c3c3c3");
                                });
                                param[myTaskWidget._UIDEFAULFS.task+":status"] = "2";
                                    Iptools.uidataTool._getUserDetailAppletData({
                                        appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                                        valueId: taskId
                                    }).done(function (r) {
                                        myTaskWidget._pushMessageMyContact(me.parent().next().html(),r.data[myTaskWidget._UIDEFAULFS.task+":contact_id"].id,14);//向客户发送任务信息
                                        myTaskWidget._pushMessageMyCustomer(me.parent().next().html(),r.data[myTaskWidget._UIDEFAULFS.task+":customer_id"].id,14,false);//向客户发送任务信息
                                    });
                            }else{
                                myTaskWidget._UIDEFAULFS.taskStatus = "重新开启";
                                Iptools.uidataTool._getUserDetailAppletData({
                                    appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                                    valueId: taskId
                                }).done(function (r) {
                                    myTaskWidget._pushMessageMyContact(me.parent().next().html(),r.data[myTaskWidget._UIDEFAULFS.task+":contact_id"].id,22);//向客户发送任务信息
                                    myTaskWidget._pushMessageMyCustomer(me.parent().next().html(),r.data[myTaskWidget._UIDEFAULFS.task+":customer_id"].id,22,false);//向客户发送任务信息
                                });
                                $(this).parent().attr("data-task","false");
                                $("#myTest .s-column").each(function (key, obj) {
                                    $(obj).find(".s-cell").eq(parseInt(index) + 1).css("color", "#333");
                                });
                                param[myTaskWidget._UIDEFAULFS.task + ":status"] = 1;
                            }
                            var paramStr = JSON.stringify(param);
                                Iptools.uidataTool._saveAppletData({
                                    appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                                    valueId: taskId,
                                    data: paramStr
                                }).done(function (r) {
                                    if(r && r.retcode == "ok"){
                                        Iptools.Tool.pAlert({
                                            type: "info",
                                            title: "系统提示：",
                                            content: me.parent().next().html() + " " + " " + myTaskWidget._UIDEFAULFS.taskStatus,
                                            delay: 2500
                                        });
                                        myTaskWidget._pushMessageMyTasks();//发送全部任务信息
                                        myTaskWidget._pushMessageMyTaskLists();//发送我的任务信息
                                    }
                                });
                        }
                    }
                ],
                dataModify: function (r) {
                    Iptools.uidataTool._getCustomizeApplet({
                        nameList: "'task_detail'"
                    }).done(function (data) {
                        myTaskWidget._UIDEFAULFS.myTaskDetailApplet = data.applets[0].applet;
                    });
                    var promise = $.Deferred();
                    if (r) {
                        if (r.data && r.data.records && r.data.records.length) {
                            for (var i = 0; i < r.data.records.length; i++) {
                                var rec = r.data.records[i];
                                if(rec[r.rootLink + ":status"] && rec[r.rootLink + ":status"].id){
                                    if(rec[r.rootLink + ":status"].id == "2"){
                                        rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='true' data-id='" + rec[r.rootLink + ":id"] + "'><input type='checkbox' class='taskCheck blueCheckbox'/></span>" + "<span class='taskNameTitle' data-id='"+rec[r.rootLink + ":id"]+"'>" + rec["task:title"] + "</span>";
                                    }else{
                                        rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='false' data-id='" + rec[r.rootLink + ":id"] + "'><input type='checkbox' class='taskCheck blueCheckbox'/></span>" + "<span class='taskNameTitle' data-id='"+rec[r.rootLink + ":id"]+"'>" + rec["task:title"] + "</span>";
                                    }
                                }else{
                                    rec[r.rootLink + ":title"] = "<span class='taskCheckStyle' data-task='false' data-id='" + rec[r.rootLink + ":id"] + "'><input type='checkbox' class='taskCheck blueCheckbox'/></span>" + "<span class='taskNameTitle' data-id='"+rec[r.rootLink + ":id"]+"'>" + rec["task:title"] + "</span>";
                                }
                                if (rec[r.rootLink + ":car_id"] && rec[r.rootLink + ":car_id"]["id"]) {
                                    var linkId = 0;
                                    if (rec[r.rootLink + ":contact_link_group_id"] && rec[r.rootLink + ":contact_link_group_id"]["id"]) {
                                        linkId = rec[r.rootLink + ":contact_link_group_id"]["id"];
                                    }
                                    rec[r.rootLink + ":car_id"] = "<span class='taskMyCarNameTitle' data-id='" + linkId + "' data-car-id=" + rec[r.rootLink + ":car_id"]["id"] + ">" + rec[r.rootLink + ":car_id"]["name"] + "</span>";
                                }
                            }
                        }else{
                            myTaskWidget._UIDEFAULFS.myTaskListEmpty = "emp";
                        }
                    }
                    promise.resolve(r);
                    return promise;
                },
                afterLoad: function () {
//                    var myTour = new Tour({
//                        backdrop: true,
//                        template:"<div class='popover tour' style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
//                            +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
//                            +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
//                            +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
//                        steps: [
//                            {
//                                element: ".add-myTask",
//                                title: "添加任务",
//                                placement: "bottom",
//                                content: "点击按钮即可给自己或同事创建任务，支持设置截止时间、关联客户",
//                                onShown: function () {
//                                    $(".tour-step-background").css({"width":"87px","height":"33px","border-radius":"4px"});
//                                }
//                            },
//                            {
//                                element: ".btn-group .dropdown-toggle",
//                                title: "任务筛选",
//                                placement: "bottom",
//                                content: "根据任务状态、任务类型、负责人筛选任务",
//                                onShown: function () {
//                                    $(".tour-step-background").css({"width":"63px","height":"33px","border-radius":"4px"});
//                                }
//                            },
//                            {
//                                element: ".s-btn-group",
//                                title: "视图切换",
//                                placement: "bottom",
//                                content: "按列表或统计面板视图查看任务",
//                                onShown: function () {
//                                    $(".tour-step-background").css({"width":"142px","height":"33px","border-radius":"4px"});
//                                }
//                            }
//                        ],
//                        onEnd: function () {
//                            $(".commonBtn").removeClass("disabled");
//                        }
//                    });
//                    var tourOneMyTask = new Tour({
//                        backdrop: true,
//                        template:"<div class='popover tour' style='border-radius: 3px;'><div class='arrow'></div><h3 class='popover-title'></h3>"
//                            +"<div class='popover-content'></div><div class='popover-navigation'><button class='prveNew btnNew' data-role='prev'>上一步</button>"
//                            +"<button class='nextNew btnNew' data-role='next'>下一步</button>"
//                            +"<button class='endNew btnNew' data-role='end'>结束引导</button></div></div>",
//                        steps: [
//                            {
//                                element: ".taskCheckStyle:first",
//                                title: "完成任务",
//                                placement: "right",
//                                content: "勾选即表示完成任务，也可去掉勾选重新打开任务",
//                                onShown: function () {
//                                    $(".tour-step-background").css({"width":"15px","height":"14px","top":"114px","border-radius":"50%"});
//                                }
//                            },
//                            {
//                                element: ".s-table .s-column .s-cell.header:eq(6)",
//                                title: "任务排序",
//                                placement: "bottom",
//                                content: "点击列表表头即可按列排序，如按任务截止时间排序",
//                                onShown: function () {
//                                    $(".tour-step-background").css({"width":"176px","height":"43px","border-radius":"4px"});
//                                }
//                            },
//                            {
//                                element: ".s-manage-freeze",
//                                title: "编辑任务",
//                                placement: "left",
//                                content: "点击操作一列按钮，可编辑任务内容",
//                                onShown: function () {
//                                    $(".tour-step-background").css({"border-radius":"2px"});
//                                }
//                            }
//                        ],
//                        onEnd: function () {
//                            $(".s-table .s-column .s-cell.header").removeClass("disabled");
//                            $(".s-manage-freeze").removeClass("disabled");
//                            $(".taskCheckStyle input.taskCheck").removeClass("disabled");
//                        }
//                    });
//                    if(window.localStorage.getItem("myTask_tour_one") != "yes"){
//                        myTour.init();
//                        window.localStorage.setItem("myTask_tour_one","yes");
//                        $(".commonBtn").addClass("disabled");
//                        myTour.start(true);
//                        myTour.goTo(0);
//                    }
//                    if(myTaskWidget._UIDEFAULFS.myTourNewBulid == true && window.localStorage.getItem("myTask_tour_two") != "yes"){
//                        tourOneMyTask.init();
//                        window.localStorage.setItem("myTask_tour_two","yes");
//                        $(".s-table .s-column .s-cell.header").addClass("disabled");
//                        $(".s-manage-freeze").addClass("disabled");
//                        $(".taskCheckStyle input.taskCheck").addClass("disabled");
//                        tourOneMyTask.start(true);
//                        tourOneMyTask.goTo(0);
//                    }
                    myTaskWidget._addEventListener({
                        container: "body",
                        target: ".s-manage-freeze .test",
                        type: "mouseover",
                        event: function () {
                            var me = $(this);
                            me.attr("title","编辑任务");
                        }
                    });
                    var count = $("#myTest" + " .s-table .s-column .s-cell .taskCheckStyle");
                    var indexs = [];
                    count.each(function (key, obj) {
                        var taskStatus=$(obj).attr("data-task");
                        if(taskStatus == "true"){
                            var index = parseInt($(obj).parent().attr("data-index")) + 1;
                            $(obj).find("input").attr("checked",true);
                            indexs.push(index);
                        }
                    });
                    for(var i = 0; i < indexs.length;i++){
                        $(".s-column").each(function(key,obj){
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
                        onShow:function () {
                            myTaskWidget._setMyPanel();//铺设面板数据
                            $(".s-manage").hide();
                        }
                    }],
                searchEvent: function (condition) {
                    if (condition) {
                        $("#test_panel").append(JSON.stringify(condition) + "<br/>");
                    }
                }
            });
        })
    },
    _initEndMyTime: function () {
        $("#modalTimeDay").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: 1,
            startDate:  (new Date()).format("yyyy-MM-dd hh:00")
        }).on('hide',function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            $('#editTaskForm').data('bootstrapValidator')
                .updateStatus('modalTimeDay', 'NOT_VALIDATED',null)
                .validateField('modalTimeDay');
        });
        $("#modalNewTimeDay").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            todayHeighlight: true,
            minView: 1,
            startDate:  (new Date()).format("yyyy-MM-dd hh:00")
        }).on('hide',function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            $('#editNewTaskForm').data('bootstrapValidator')
                .updateStatus('modalNewTimeDay', 'NOT_VALIDATED',null)
                .validateField('modalNewTimeDay');
        });
    },
    _initValidatorMyForm: function () {
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
    _initGetContactMyList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list_all'"
        }).done(function (r) {
            myTaskWidget._UIDEFAULFS.contactListApplet = r.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet: r.applets[0].applet
            }).done(function (data) {
                myTaskWidget._UIDEFAULFS.contactListRootId = data.rootLink;
            });
        });
    },
    _initGetMyCarListApplet: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'customer_list'"
        }).done(function (r) {
            myTaskWidget._UIDEFAULFS.myCarListApplet = r.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet: r.applets[0].applet
            }).done(function (data) {
                myTaskWidget._UIDEFAULFS.myCarListRootId = data.rootLink;
            });
        });
        myTaskWidget._getAllMyCarOwnerData();//获得所有车主的姓名和电话
    },
    _getAllConListMyDatas: function (param) {
        Iptools.uidataTool._getUserlistAppletData({
            appletId: myTaskWidget._UIDEFAULFS.contactListApplet,
            pageNow: 1,
            condition: param
        }).done(function (s) {
            $('.conListBySearch').html("");
            $('.conListBySearchs').html("");
            if (s && s.data && s.data.records) {
                $.each(s.data.records, function (key, obj) {
                    var RootId = myTaskWidget._UIDEFAULFS.contactListRootId;
                    var name = obj[RootId + ':title'] ? obj[RootId + ':title'] : "";
                    var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                    if(myTaskWidget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
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
    _getAllMyCarOwnerData: function (myCarData) {
        Iptools.uidataTool._getUserlistAppletData({
            appletId: myTaskWidget._UIDEFAULFS.myCarListApplet,
            pageNow: 1,
            condition: myCarData
        }).done(function (s) {
            $('.myCarListBySearch').html("");
            $('.newBuildCarOwnerListBySearch').html("");
            if (s && s.data && s.data.records) {
                $.each(s.data.records, function (key, obj) {
                    var RootId = myTaskWidget._UIDEFAULFS.myCarListRootId;
                    var name = obj[RootId + ':customer_name'] ? obj[RootId + ':customer_name'] : "";
                    var phone = obj[RootId + ':customer_cellphone'] ? obj[RootId + ':customer_cellphone'] : "";
                    if(myTaskWidget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
                        var myCarHtml = '<li role="presentation" class="myCarLi">'+
                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                            '</li>';
                        var newBuildCarOwnerHtml = '<li role="presentation" class="newBuildCarOwnerLi">'+
                            '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                            '</li>';
                        $('.myCarListBySearch').append(myCarHtml);
                        $('.newBuildCarOwnerListBySearch').append(newBuildCarOwnerHtml);
                    }
                });
            }
        });
    },
    //显示滚动条
    _boardMyBars: function () {
        var arr = $('.stageContent li.stageBlock');
        var myWth = (261 * (arr.length)) - 1;
        $('.stageContent').width(myWth);
        $('.panelTour').width(myWth);
    },
    //责任人逻辑铺设
    _showMyTaskOwner: function () {
        Iptools.GetJson({
            url: "basic/getEmployee",
            data: {
                token: Iptools.DEFAULTS.token,
                id: Iptools.getDefaults({ key : "selectUser" })
            }
        }).done(function (r) {
            $("#owner").val(r.employee.name).attr("data-id", r.employee.id);
            myTaskWidget._focusTaskOwnerSearch();
//            if(r){
//                if(r.organization == 1){
//                    myTaskWidget._focusTaskOwnerSearch();
//                }else{
//                    $("#owner").attr("disabled",true);
//                }
//            }
        })
    },
    _enableGetMyOwner: function () {
        Iptools.GetJson({
            url: "basic/employees",
            data:{
                token: Iptools.DEFAULTS.token
            }
        }).done(function (data) {
            myTaskWidget._UIDEFAULFS.addownerId = Iptools.DEFAULTS.userId;
            var optionHtml = "<option value='" + Iptools.DEFAULTS.userId + "'>Iptools.DEFAULTS.userTitle</option>";
            $("#modalTaskOwner").html("");
            $("#modalNewTaskOwner").html("");
            if(data){
                for(var i = 0; i < data.length;i++){
                    if(data[i].name){
                        if(data[i].id != Iptools.DEFAULTS.userId){
                            optionHtml += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                        }
                    }
                }
            }
            $("#modalTaskOwner").append(optionHtml);
            $("#modalNewTaskOwner").append(optionHtml);
        });
    },
    _enableAllMyTaskType: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'mytask_list'"
        }).done(function (data) {
            Iptools.GetJson({
                url: "service/appletConfig",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: data.applets[0].applet
                }
            }).done(function (datas) {
                if(datas && datas.listColumns){
                    var columnsHtml = '<option value="">请选择...</option>';
                    $("#modalNewTaskType").html("");
                    for(var k = 0; k < datas.listColumns.length;k++){
                        if(datas.listColumns[k].columnName =="task:type"){
                            for(var i = 0,j = 1; i < datas.listColumns[k].pickList.length;i++,j++){
                                columnsHtml += '<option value="' + j + '">' + datas.listColumns[k].pickList[i].name + '</option>';
                            }
                            $("#modalNewTaskType").attr("data-id",1).html(columnsHtml);
                        }
                    }
                }
            });
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'mytask_list'"
        }).done(function (data) {
            Iptools.GetJson({
                url: "service/appletConfig",
                data:{
                    token: Iptools.DEFAULTS.token,
                    appletId: data.applets[0].applet
                }
            }).done(function (datas) {
                if(datas && datas.listColumns){
                    var columnsHtml = '<option value="">请选择...</option>';
                    var statusHtml = '<option value="">请选择...</option>';
                    $("#modalTaskType").html("");
                    $("#modalTaskStatus").html("");
                    $("#modalNewTaskType").html("");
                    for(var k = 0; k < datas.listColumns.length;k++){
                        if(datas.listColumns[k].columnName == "task:type"){
                            for(var i = 0,j = 1; i < datas.listColumns[k].pickList.length;i++,j++){
                                columnsHtml += '<option value="' + j + '">' + datas.listColumns[k].pickList[i].name + '</option>';
                            }
                            $("#modalTaskType").html(columnsHtml);
                            $("#modalNewTaskType").html(columnsHtml);
                        }
                        if(datas.listColumns[k].columnName == "task:status"){
                            for(var p = 0; p < datas.listColumns[k].pickList.length;p++){
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
    _enableListenMessageMyTask: function () {
        Iptools.Tool._pushListen("send_message_my_task_list", function () {
            $("#myTest").data("stable")._refresh();
        });
    },
    _toSendMyContactNews: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Trace Detail'"
        }).done(function (data) {
            myTaskWidget._UIDEFAULFS.contactTraceDeApplet =  data.applets[0].applet;//8143
            Iptools.uidataTool._getApplet({
                applet: myTaskWidget._UIDEFAULFS.contactTraceDeApplet
            }).done(function (data) {
                if(data)
                    myTaskWidget._UIDEFAULFS.contactTraceDeRoot = data.rootLink;//225
            });
        });
    },
    _pushMessageMyTasks: function (){
        Iptools.uidataTool._pushMessage({channel: "send_message_task_list"});
    },
    _pushMessageMyTaskLists: function () {
        Iptools.uidataTool._pushMessage({channel: "send_message_my_task_list"});
    },
    _pushMessageMyContact: function (taskName,contactId,traceType,type) {//依次是：任务名称，推送的客户，客户模块任务状态值，是否异步请求
        Iptools.uidataTool._addAppletData({
            async: type == false ? false : true,
            appletId: myTaskWidget._UIDEFAULFS.contactTraceDeApplet,
            data:'{"'+myTaskWidget._UIDEFAULFS.contactTraceDeRoot + ':title":"' + taskName + '","'
                +myTaskWidget._UIDEFAULFS.contactTraceDeRoot + ':trace_category":"2","'
                +myTaskWidget._UIDEFAULFS.contactTraceDeRoot + ':trace_time":"' + (new Date()).format("yyyy-MM-dd hh:mm:ss") + '","'
                +myTaskWidget._UIDEFAULFS.contactTraceDeRoot + ':contact_id":"' + contactId + '","'
                +myTaskWidget._UIDEFAULFS.contactTraceDeRoot + ':owner":"' + Iptools.DEFAULTS.userId + '","'
                +myTaskWidget._UIDEFAULFS.contactTraceDeRoot + ':trace_type":"' + traceType + '"}'
        }).done(function () {
            Iptools.uidataTool._pushMessage({
                channel: "send_message_task_list_" + contactId
            });
        });
    },
    _pushMessageMyCustomer: function (taskName,customerId,traceType,type) {//依次是：我的任务名称，推送的车主，车主模块任务状态值，是否异步请求
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Trace Detail'"
        }).done(function (datas) {
            myTaskWidget._UIDEFAULFS.traceDetailApplet = datas.applets[0].applet;
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
            paramData["appletId"] = myTaskWidget._UIDEFAULFS.traceDetailApplet;
            Iptools.uidataTool._addAppletData(paramData).done(function(){
                Iptools.uidataTool._pushMessage({
                    channel: "task_detail_trace_listener" + customerId
                });
            });
        });
    },
//    事件函数
    _confirmMyTaskPopup: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: myTaskWidget._UIDEFAULFS.newConfirmBtn,
            type: "click",
            event:function () {
                $("#editNewTaskForm").bootstrapValidator('validate');
                if ($("#editNewTaskForm").data("bootstrapValidator").isValid()) {
                    var taskDatas = "task";
                    var valStatus = "0";
                    var valcreator = "1";
                    var taskStr = {};
                    taskStr[taskDatas + ":title"] = $("#modalNewTaskName").val();
                    taskStr[taskDatas + ":due_time"] = $("#modalNewTimeDay").val();
                    taskStr[taskDatas + ":status"] = valStatus;
                    taskStr[taskDatas + ":creator"] = valcreator;
                    if(myTaskWidget._UIDEFAULFS.addNewTaskCustomerId != ""){
                        taskStr[taskDatas + ":contact_id"] = myTaskWidget._UIDEFAULFS.addNewTaskCustomerId;
                    }
                    if(myTaskWidget._UIDEFAULFS.addMyCarOwnerId != ""){
                        taskStr[taskDatas + ":customer_id"] = myTaskWidget._UIDEFAULFS.addMyCarOwnerId;
                    }
                    if($("#modalNewTaskDepict").val() && $("#modalNewTaskDepict").val() != ""){
                        taskStr[taskDatas + ":description"] = $("#modalNewTaskDepict").val();
                    }
                    if($("#modalNewTaskStatus option:selected").val() != ""){
                        taskStr[taskDatas + ":status"] = $("#modalNewTaskStatus option:selected").val();
                    }
                    if($("#modalNewTaskType option:selected").val() != ""){
                        taskStr[taskDatas + ":type"] = $("#modalNewTaskType option:selected").val();
                    }
                    taskStr[taskDatas + ":owner"] = myTaskWidget._UIDEFAULFS.addownerId;
                    var taskString = JSON.stringify(taskStr);
                        Iptools.uidataTool._addAppletData({
                            appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                            data: taskString
                        }).done(function (r) {
                            if(r && r.retcode == "ok"){
                                Iptools.Tool.pAlert({
                                    type: "info",
                                    title: "系统提示：",
                                    content: r.retmsg,
                                    delay: 1000
                                });
                                myTaskWidget._pushMessageMyTasks();//发送全部任务信息
                                myTaskWidget._pushMessageMyTaskLists();//发送我的任务信息
                                if(myTaskWidget._UIDEFAULFS.addNewTaskCustomerId != ""){
                                    myTaskWidget._pushMessageMyContact($("#modalNewTaskName").val(),myTaskWidget._UIDEFAULFS.addNewTaskCustomerId,9,false);//向客户发送任务信息
                                }
                                if(myTaskWidget._UIDEFAULFS.addMyCarOwnerId != ""){
                                    myTaskWidget._pushMessageMyCustomer($("#modalNewTaskName").val(),myTaskWidget._UIDEFAULFS.addMyCarOwnerId,9,false);//向车主发送任务信息
                                }
                                $("#modalNewTaskName").val("");
                                $(".addNewLeft").removeAttr("style");
                                $(".addNewCustomerData").show();
//                                $(".modal-body .dropdown-toggle").show();
//                                $("#addNewTaskDeals").hide();
                                $(".newNewCustomer").hide();
//                                $(".addNewDealsData").show();
                                $(".addHeight").css("height","105px");
                                $(".addNewTaskCustomer").val("").attr("data-id","");
                                $("#modalNewTaskDepict").val("");
                                $("#modalNewTaskType").attr("data-id","");
                                $("#modalNewTaskOwner").val("");
                                $("#modalNewTaskType option:selected").val("");
                                $("#modalNewTaskOwner option:selected").val("");
                                myTaskWidget._UIDEFAULFS.myTourNewBulid = true;
                            }
                        });
                    myTaskWidget._setMyPanel();//铺设面板数据
                    $("#newTaskModal").modal("hide");
                }
            }
        });
    },
    _enableUploadMyForm: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: myTaskWidget._UIDEFAULFS.uploadTask,
            type: "click",
            event: function () {
                $("#editTaskForm").bootstrapValidator('validate');
                if ($("#editTaskForm").data("bootstrapValidator").isValid()) {
                    var taskDatas = "task";
                    var statusId = "";
                    var param = {};
                    Iptools.uidataTool._getUserDetailAppletData({
                        async: false,
                        appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                        valueId: myTaskWidget._UIDEFAULFS.id
                    }).done(function (k) {
                        if(k.data){
                            statusId = k.data[k.rootLink+':status'].id;
                        }
                    });
                    param[taskDatas + ":title"] = $("#modalTaskName").val();
                    param[taskDatas + ":due_time"] = $("#modalTimeDay").val();
                    if($("#modalTaskStatus option:selected").val() != ""){
                        param[taskDatas + ":status"] = $("#modalTaskStatus option:selected").val();
                    }
                    if($("#modalTaskType option:selected").val() != ""){
                        param[taskDatas + ":type"] = $("#modalTaskType option:selected").val();
                    }
                    if($("#modalTaskOwner option:selected").val() != ""){
                        param[taskDatas + ":owner"] = myTaskWidget._UIDEFAULFS.addownerId;
                    }
                    if(myTaskWidget._UIDEFAULFS.addTaskCustomerId != ""){
                        param[taskDatas + ":contact_id"] = myTaskWidget._UIDEFAULFS.addTaskCustomerId;
                    }
                    if(myTaskWidget._UIDEFAULFS.addMyCarOwnerId != ""){
                        param[taskDatas + ":customer_id"] = myTaskWidget._UIDEFAULFS.addMyCarOwnerId;
                    }
                    if($("#modalTaskDepict").val() != ""){
                        param[taskDatas+":description"] = $("#modalTaskDepict").val();
                    }
                    var paramStr = JSON.stringify(param);
                        Iptools.uidataTool._saveAppletData({
                            appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                            valueId: myTaskWidget._UIDEFAULFS.id,
                            data: paramStr
                        }).done(function (r) {
                            if(r && r.retcode == "ok"){
                                Iptools.Tool.pAlert({
                                    type: "info",
                                    title: "系统提示：",
                                    content: r.retmsg,
                                    delay: 1000
                                });
                                myTaskWidget._pushMessageMyTasks();//发送全部任务信息
                                myTaskWidget._pushMessageMyTaskLists();//发送我的任务信息
                                if(myTaskWidget._UIDEFAULFS.addTaskCustomerId != "" && myTaskWidget._UIDEFAULFS.addTaskCustomerId != myTaskWidget._UIDEFAULFS.addMyTaskContactId){
                                    myTaskWidget._pushMessageMyContact($("#modalTaskName").val(),myTaskWidget._UIDEFAULFS.addTaskCustomerId,9);//向客户发送任务信息
                                }
                                if(myTaskWidget._UIDEFAULFS.addMyCarOwnerId != "" && myTaskWidget._UIDEFAULFS.addMyNewCarOwnerId != myTaskWidget._UIDEFAULFS.addMyCarOwnerId){
                                    myTaskWidget._pushMessageMyCustomer($("#modalTaskName").val(),myTaskWidget._UIDEFAULFS.addMyCarOwnerId,9,false);//向车主发送任务信息
                                }
                                Iptools.uidataTool._getUserDetailAppletData({
                                    appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                                    valueId: myTaskWidget._UIDEFAULFS.id
                                }).done(function (m) {
                                    if(m.data){
                                        if(statusId != "2" && m.data[m.rootLink + ':status'].id == "2"){
                                            myTaskWidget._pushMessageMyContact($("#modalTaskName").val(),myTaskWidget._UIDEFAULFS.addTaskCustomerId,14);//向客户发送任务信息
                                            myTaskWidget._pushMessageMyCustomer($("#modalTaskName").val(),myTaskWidget._UIDEFAULFS.addTaskCustomerId,14,false);//向客户发送任务信息
                                        }
                                    }
                                });
                                $('#owner').removeAttr("data-id");
                                $(".addCustomerVal").removeAttr("data-id");
                                $(".addTransactionVal").removeAttr("data-id");
                            }
                        });
                    $("#myTaskModal").modal("hide");
                    myTaskWidget._setMyPanel();//铺设面板数据
                };
            }
        });
    },
    _enableAddMyCustomerAndDeal: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: myTaskWidget._UIDEFAULFS.addLeft,
            type: "click",
            event: function () {
                $(".addLeft").show();
                $(".newCustomer").hide();
                $(".addCustomerData").show();
                $(".addMyCarOwnerData").hide();
                $(".addHeight").css("height","105px");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: myTaskWidget._UIDEFAULFS.addRight,
            type: "click",
            event: function () {
                $(".addCustomerData").hide();
                $(".addMyCarOwnerData").show();
                $(".addMyCarOwner").show();
                $(".addRight").show();
                $(".newMyCarOwner").hide();
                $(".addHeight").css("height", "105px");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".addNewCustomer",
            type: "click",
            event: function () {
                $(".addLeft").show();
                $(".newCustomer").hide();
                $(".addCustomerData").show();
                $(".addMyCarOwnerData").hide();
                $(".addHeight").css("height","105px");
                $(".addTaskCustomer").val("").attr("data-id","");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".addNewMyCarOwner",
            type: "click",
            event: function () {
                $(".addRight").show();
                $(".newMyCarOwner").hide();
                $(".addCustomerData").hide();
                $(".addMyCarOwnerData").show();
                $(".addHeight").css("height","105px");
                $(".addMyCarOwner").val("").attr("data-id","");
            }
        });
    },
    _enableAddMyNewCustomerAndDeal: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".addNewLeft",
            type: "click",
            event:function () {
                $(".addNewLeft").show();
                $(".addCustomerData").show();
                $(".addNewCustomerData").show();
                $(".newBuildCarOwnerData").hide();
                $(".addHeight").css("height","105px");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".addNewRight",
            type: "click",
            event: function () {
                $(".addNewRight").show();
                $(".newBuildCarOwner").hide();
                $(".newBuildCarOwnerData").show();
                $(".addCustomerData").hide();
                $(".addHeight").css("height","105px");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".addNewCustomers",
            type: "click",
            event: function () {
                $(".addNewLeft").show();
                $(".addCustomerData").show();
//                $(".addNewCustomerData").show();
//                $(".modal-body .dropdown-toggle").hide();
                $(".newNewCustomer").hide();
                $(".newBuildCarOwnerData").hide();
                $(".addHeight").css("height","105px");
                $(".addNewTaskCustomer").val("").attr("data-id","");
                myTaskWidget._UIDEFAULFS.addNewTaskCustomerId = "";
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".addNewNewCarOwner",
            type: "click",
            event: function () {
                $(".addCustomerData").hide();
                $(".addNewRight").show();
                $(".newBuildCarOwner").hide();
                $(".newBuildCarOwnerData").show();
                $(".newBuildTaskCarOwner").val("");
                $(".addHeight").css("height","105px");
                myTaskWidget._UIDEFAULFS.addMyCarOwnerId = "";
            }
        });
    },
    _enableDownMultiMySearch: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".input-group .searchConInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = myTaskWidget._UIDEFAULFS.contactListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"' + rootId + ':phone":" like \'%' + inputText + '%\'"}';
                }else{
                    condition = '{"' + rootId + ':title":" like \'%' + inputText + '%\'"}';
                };
                myTaskWidget._getAllConListMyDatas(condition);
                return false;
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".input-group .newBuildTaskCarOwner",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = myTaskWidget._UIDEFAULFS.contactListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"' + rootId + ':customer_cellphone":" like \'%' + inputText + '%\'"}';
                }else{
                    condition = '{"' + rootId + ':customer_name":" like \'%' + inputText + '%\'"}';
                };
                myTaskWidget._getAllMyCarOwnerData(condition);
                return false;
            }
        });
    },
    _enableClickCarMySearch: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".input-group .addMyCarOwner",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = myTaskWidget._UIDEFAULFS.myCarListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"' + rootId + ':customer_cellphone":" like \'%' + inputText + '%\'"}';
                }else{
                    condition = '{"' + rootId + ':customer_name":" like \'%' + inputText + '%\'"}';
                }
                myTaskWidget._getAllMyCarOwnerData(condition);//获得所有车主的姓名和电话
                return false;
            }
        });
    },
    _enableMyFocusSearch: function () {
        myTaskWidget._addEventListener({
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
    _enableClickMySearchPushData: function () {
        myTaskWidget._addEventListener({
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
                myTaskWidget._UIDEFAULFS.addTaskCustomerId = me.find('a').attr("data-id");
                $(".addCustomerData").hide();
                $(".addLeft").hide();
                $(".newCustomer").show();
                $(".addHeight").css("height","60px");
            }
        });
        myTaskWidget._addEventListener({
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
                myTaskWidget._UIDEFAULFS.addNewTaskCustomerId = me.find('a').attr("data-id");
                $(".addNewCustomerData").hide();
                $(".addCustomerData").hide();
//                $(".addNewTaskCustomer").hide();
                $(".addNewLeft").hide();
//                $(".modal-body .dropdown-toggle").hide();
                $(".newNewCustomer").show();
                $(".addHeight").css("height","60px");
            }
        });
    },
    _enableClickCarListMySearch: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: "ul .myCarLi",
            type: "click",
            event: function () {
                var me = $(this);
                $('.form-control.addMyCarOwner').val(me.find('a').html());
                if(me.find('a').html().split("-")[0] == ""){
                    $(".addMyCarOwnerWord").html(me.find('a').html().split("-")[1]);
                }else{
                    $(".addMyCarOwnerWord").html(me.find('a').html().split("-")[0]);
                }
                $(".addMyCarOwnerWord").attr("data-id",me.find('a').attr("data-id"));
                $('.form-control.addMyCarOwner').attr("data-id",me.find('a').attr("data-id"));
                myTaskWidget._UIDEFAULFS.addMyCarOwnerId = me.find('a').attr("data-id");
                $(".addRight").hide();
                $(".newMyCarOwner").show();
                $(".addMyCarOwnerData").hide();
                $(".addHeight").css("height","60px");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: "ul .newBuildCarOwnerLi",
            type: "click",
            event: function () {
                var me = $(this);
                if(me.find('a').html().split("-")[0] == ""){
                    $(".newBuildCarOwnerVal").html(me.find('a').html().split("-")[1]);
                }else{
                    $(".newBuildCarOwnerVal").html(me.find('a').html().split("-")[0]);
                }
                myTaskWidget._UIDEFAULFS.addMyCarOwnerId = me.find('a').attr("data-id");
                $(".addNewRight").hide();
                $(".newBuildCarOwnerData").hide();
                $(".newBuildCarOwner").show();
                $(".addHeight").css("height","70px");
            }
        });
    },
    _enableMyDrags: function () {
        $( ".column" ).sortable({
            connectWith: ".column",
            handle: ".portlet-header",
            cancel: ".portlet-toggle",
            scroll: true,
            placeholder: "portlet-placeholder ui-corner-all",
            receive: function (event,ui) {
                if(myTaskWidget._UIDEFAULFS.taskSortable == true){
                    myTaskWidget._UIDEFAULFS.taskSortable = false;
                    Iptools.uidataTool._getCustomizeApplet({
                        nameList: "'task_detail'"
                    }).done(function (data) {
                        myTaskWidget._UIDEFAULFS.myTaskDetailApplet = data.applets[0].applet;
                        Iptools.uidataTool._getUserDetailAppletData({
                            appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                            valueId: ui.item.children("div").data("id")
                        }).done(function (r) {
                            var param = {};
                            param[r.rootLink + ":status"] = ui.item.parent().prev().data("id");
                            var paramStr = JSON.stringify(param);
                            Iptools.uidataTool._saveAppletData({
                                appletId: data.applets[0].applet,
                                valueId: ui.item.children("div").data("id"),
                                data: paramStr
                            }).done(function (data) {
                                if(r.data[r.rootLink + ":status"].id == "2"){
                                    myTaskWidget._pushMessageMyContact(ui.item.children("div").children("a").children("span").html(),r.data[myTaskWidget._UIDEFAULFS.task+":contact_id"].id,22);//向客户发送任务信息
                                    myTaskWidget._pushMessageMyCustomer(ui.item.children("div").children("a").children("span").html(),r.data[myTaskWidget._UIDEFAULFS.task+":customer_id"].id,22,false);//向客户发送任务信息
                                }
                                if(ui.item.parent().prev().data("id") == "2"){
                                    myTaskWidget._pushMessageMyContact(ui.item.children("div").children("a").children("span").html(),r.data[myTaskWidget._UIDEFAULFS.task+":contact_id"].id,14);//向客户发送任务信息
                                    myTaskWidget._pushMessageMyCustomer(ui.item.children("div").children("a").children("span").html(),r.data[myTaskWidget._UIDEFAULFS.task+":customer_id"].id,14,false);//向客户发送任务信息
                                }
                                if(data && data.retcode == "ok"){
                                    myTaskWidget._setMyPanel();//铺设面板数据
                                    myTaskWidget._pushMessageMyTasks();//发送全部任务信息
                                    myTaskWidget._pushMessageMyTaskLists();//发送我的任务信息
                                }
                            });
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
    _enableGhangeMyDeal: function(){
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
    //------------------------------------------------------------------------------------------------------负责人的铺设
    _getMyTaskAllEmply: function (param) {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'employee_list'"
        }).done(function(r) {
            myTaskWidget._UIDEFAULFS.employListApplet = r.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet: r.applets[0].applet
            }).done(function (data) {
                myTaskWidget._UIDEFAULFS.employListRootId = data.rootLink;
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: myTaskWidget._UIDEFAULFS.employListApplet,
                    pageNow: 1,
                    condition: param
                }).done(function (s) {
                    $('.searchOwnerListInput').html("");
                    $('.searchOwnerListNewInput').html("");
                    if (s && s.data && s.data.records) {
                        $.each(s.data.records, function (key, obj) {
                            var RootId = myTaskWidget._UIDEFAULFS.employListRootId;
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
    _setMyPanel: function () {
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
            Iptools.uidataTool._getUserlistAppletData({
                appletId: myTaskWidget._UIDEFAULFS.myTaskApplet,
                pageSize: 10000
            }).done(function (r) {
                $("#addTaskDeals").html("");
                var columnsHtml="",statusHtml="",statusWHtml="",statusNotHtml="",task= r.rootLink,Taskid="",taskTitle="",taskOwner="",taskTime="",num=0,numT=0,numW=0,numNot=0;
                var emptyImg = '<div  class="emptyImg"><img src="../../Content/Image/noTaskNew.png"/><div class="emptyWord">该阶段任务已全部完成！</div></div>';
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
                        if(r.data.records[i][task+':status']){
                            Taskid = r.data.records[i][task + ':id'];
                            taskTitle = r.data.records[i][task + ':title'];
                            if(r.data.records[i][task + ':owner']){
                                taskOwner = r.data.records[i][task + ':owner'].name + " - ";
                            }else{
                                taskOwner = "";
                            }
                            taskTime = r.data.records[i][task + ':due_time'];
                            taskTime = taskTime.substring(5,taskTime.length);
                            taskTime = taskTime.substring(0,taskTime.length - 3);
                            if(r.data.records[i][task + ':status'].id == "1"){
                                num++;
                                columnsHtml = '<li class="portlet "><div class="portlet-header" data-id="' + Taskid + '"><a><span class="taskTitle">'
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
                                    + '"><a><span class="taskTitle">' + taskTitle + '</span><br><span class="time">' + taskOwner + '<span class="date_time">' + taskTime
                                    + '</span></span></a></div></li>';
                                $(".statusW").append(statusWHtml);
                            }
                        }
                    }
                    if(num > 0){$(".numS").html(num);}else{$(".status").append(emptyImg);$(".numS").html(0);}
                    if(numT > 0){$(".numT").html(numT);}else{$(".statusT").append(emptyImg);$(".numT").html(0);}
                    if(numW > 0){$(".numW").html(numW);}else{$(".statusW").append(emptyImg);$(".numW").html(0);}
                    var arr=[num,numT,numW];
                    var compare = function (x, y) {//比较函数
                        if (x < y) {
                            return -1;
                        } else if (x > y) {
                            return 1;
                        } else {
                            return 0;
                        }
                    };
                    var height = (arr.sort(compare)[2] + 3)*74 + "px";
                    if(arr.sort(compare)[2] > 10){
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
                    $(".status").append(emptyImg);
                    $(".statusT").append(emptyImg);
                    $(".statusW").append(emptyImg);
                    $(".stage_main_content").css("overflow-y","hidden");
                }
                myTaskWidget._UIDEFAULFS.taskSortable = true;
            })
    },
    //---------------------------------------------------------------------------------------------------搜索电话或者名字
    _ownertMultiMyTaskSearch: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".input-group .searchOwnerTaskInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = myTaskWidget._UIDEFAULFS.employListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"' + rootId + ':phone":" like \'%' + inputText + '%\'"}';
                }else{
                    condition = '{"' + rootId + ':name":" like \'%' + inputText + '%\'"}';
                };
                myTaskWidget._getMyTaskAllEmply(condition);
                return false;
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".input-group .searchOwnerTaskNewInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = myTaskWidget._UIDEFAULFS.employListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"' + rootId + ':phone":" like \'%' + inputText + '%\'"}';
                }else{
                    condition = '{"' + rootId + ':name":" like \'%' + inputText + '%\'"}';
                };
                myTaskWidget._getMyTaskAllEmply(condition);
                return false;
            }
        });
    },
    //---------------------------------------------------------------------------------------------------------------获得和失去焦点
    _focusTaskOwnerSearch: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".input-group #owner",
            type: "click",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                var me = $(this);
                me.parent().find(".input-group-btn").addClass("open");
                me.parent().find("button").attr("aria-expanded", "true");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".input-group #ownerTwo",
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
    //-----------------------------------------------------------------------------------------------点击数据列表，铺设表单数据
    _clickSelectMyTaskOwnerDemoLi: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".demoLis",
            type: "click",
            event: function () {
                var me = $(this);
                $('.searchOwnerTaskInput').val(me.find('a').html()).attr("data-id",me.find('a').attr("data-id"));
                myTaskWidget._UIDEFAULFS.addownerId = me.find('a').attr("data-id");
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".demoList",
            type: "click",
            event: function () {
                var me = $(this);
                $('.searchOwnerTaskNewInput').val(me.find('a').html()).attr("data-id",me.find('a').attr("data-id"));
                myTaskWidget._UIDEFAULFS.addownerId = me.find('a').attr("data-id");
            }
        });
    },
    _enableMyTaskIconList: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".s-btn-group .commonBtn",
            type: "click",
            event: function () {
                var me = $(this);
                if($(me.children()[0]).attr("class") == "fa fa-list"){
                    $(".s-manage").show();
                }else{
                    var tourThMyTask = new Tour({
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
                    var tourThMyTaskEmpty = new Tour({
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
                    if(window.localStorage.getItem("myTask_tour_three") != "yes"){
                        if(myTaskWidget._UIDEFAULFS.myTaskListEmpty == "emp"){
                            myTaskWidget._UIDEFAULFS.myTaskListEmpty = "";
                            tourThMyTaskEmpty.init();
                            window.localStorage.setItem("myTask_tour_three","yes");
                            $( ".column" ).sortable({ disabled: true });
                            $(".stageContent .column .portlet a").addClass("disabled");
                            $("li.portlet").css("cursor","default");
                            tourThMyTaskEmpty.start( true );
                            tourThMyTaskEmpty.goTo( 0 );
                        }else{
                            tourThMyTask.init();
                            window.localStorage.setItem("myTask_tour_three","yes");
                            $( ".column" ).sortable({ disabled: true });
                            $(".stageContent .column .portlet a").addClass("disabled");
                            $("li.portlet").css("cursor","default");
                            tourThMyTask.start( true );
                            tourThMyTask.goTo( 0 );
                        }
                    }
                }
            }
        });
    },
    _enablePanelMyTaskName: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".taskTitle",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                myTaskWidget._UIDEFAULFS.id = me.parent().parent().data("id");
                myTaskWidget._editMyTaskFunction();//编辑任务弹窗函数
            }
        });
        myTaskWidget._addEventListener({
            container: "body",
            target: ".taskNameTitle",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                myTaskWidget._UIDEFAULFS.id = me.data("id");
                myTaskWidget._editMyTaskFunction();//编辑任务弹窗函数
            }
        });
    },
    _editMyTaskFunction: function(){
        $("#editTaskForm").data('bootstrapValidator').destroy();
        $('#editTaskForm').data('bootstrapValidator', null);
        myTaskWidget._initValidatorMyForm();//初始化验证表单
        Iptools.GetJson({
            url: "service/appletDataGetDetail",
            data:{
                token: Iptools.DEFAULTS.token,
                appletId: myTaskWidget._UIDEFAULFS.myTaskDetailApplet,
                valueId: myTaskWidget._UIDEFAULFS.id
            }
        }).done(function(r){
            var task=r.rootAliasName,owerns="",owernname="",statuss="",statusname="",types="",typename="",contact_ids="",contact_idHtml="",myCar_ids="",myCar_idHtml="",deal_ids="",deal_idHtml="",due_times="",due_timet="",due_timename="",remind_times="",remind_timet="",remind_timename="",descriptions="";
            var titles = r.detailData[task + ':title'];
            if(r.detailData[task + ':status']){
                statuss = r.detailData[task + ':status'].id;
                statusname = r.detailData[task + ':status'].name;
            }
            if(r.detailData[task + ':owner']){
                owerns = r.detailData[task + ':owner'].id;
                owernname = r.detailData[task + ':owner'].name;
            }
            if(r.detailData[task + ':type']){
                types = r.detailData[task + ':type'].id;
                typename = r.detailData[task + ':type'].name;
            }
            if(r.detailData[task + ':contact_id']){
                contact_ids = r.detailData[task + ':contact_id'].id;
                contact_idHtml = r.detailData[task + ':contact_id'].name;
            }
            if(r.detailData[task + ':customer_id']){
                myCar_ids = r.detailData[task + ':customer_id'].id;
                myCar_idHtml = r.detailData[task + ':customer_id'].name;
            }
            due_times = r.detailData[task + ':due_time'];
            remind_times = r.detailData[task + ':remind_time'];
            descriptions = r.detailData[task + ':description'];
            $("#modalTaskName").val(titles);
            $("#modalTaskStatus").val(statuss);
            $(".addCustomerVal").attr("data-id",contact_ids);
            $(".addCustomerVal").html(contact_idHtml);
            $(".addTaskCustomer").val(contact_idHtml);
            $(".addTaskCustomer").attr("data-id",contact_ids);
            $(".addMyCarOwnerWord").html(myCar_idHtml);
            myTaskWidget._UIDEFAULFS.addMyTaskContactId = contact_ids;
            myTaskWidget._UIDEFAULFS.addTaskCustomerId = contact_ids;
            myTaskWidget._UIDEFAULFS.addMyCarOwnerId = myCar_ids;
            myTaskWidget._UIDEFAULFS.addMyNewCarOwnerId = myCar_ids;
            if(myTaskWidget._UIDEFAULFS.addTaskCustomerId != ""){
                $(".addLeft").hide();
                $(".newCustomer").show();
                $(".addCustomerData").hide();
            }else{
                $(".addLeft").show();
                $(".newCustomer").hide();
                $(".addCustomerData").hide();
            }
            if(myTaskWidget._UIDEFAULFS.addMyCarOwnerId != ""){
                $(".addRight").hide();
                $(".newMyCarOwner").show();
                $(".addMyCarOwnerData").hide();
            }else{
                $(".addRight").show();
                $(".newMyCarOwner").hide();
                $(".addMyCarOwnerData").hide();
            }
            $(".addHeight").css("height","70px");
            $(".addTransactionVal").attr("data-id",deal_ids).html(deal_idHtml);
            $("#addTaskDeals").attr("data-id",deal_ids).val(deal_ids);
            $("#modalTimeDay").val(due_times);
            $("#modalTimehour").val(due_timename);
            $("#modalRemindTime").val(remind_times);
            $("#modalRemindTimehour").val(remind_timename);
            $("#modalTaskDepict").val(descriptions);
            $("#modalTaskType").attr("data-id",types).val(types);
            $("#ownerTwo").val(owernname).attr("data-id",owerns);
            myTaskWidget._UIDEFAULFS.addownerId = owerns;
            if(r.detailData && r.detailData[task + ':status']){
                if(r.detailData[task + ':status'].id == "2"){
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
        $("#modalTimeDay").attr("readonly","readonly");
        $("#modalTimehour").attr("readonly","readonly");
        $("#myTaskModal").modal("show");
    },
    _enableMyHiddenModal: function () {
        $('#newTaskModal').on('hidden.bs.modal', function () {
            $("#editNewTaskForm").data("bootstrapValidator").resetForm();
            myTaskWidget._enableAllMyTaskType();//初始化任务类型
            $("#modalNewTaskName").val("");
            $("#modalNewTaskStatus").val("").removeClass("disabled").css("background-color","#fff");
            $("#modalNewTimeDay").val("");
            $("#modalNewTimehour").val("");
            $("#modalNewTaskDepict").val("");
            $("#modalNewTaskType").val("").css("data-id","");
            myTaskWidget._enableGetMyOwner();
            $(".addNewLeft").removeAttr("style");
            $(".addCustomerData").show();
            $(".addNewCustomerData").show();
//            $(".modal-body .dropdown-toggle").hide();
            $("#addNewTaskDeals").hide();
            $(".newNewCustomer").hide();
            $(".addNewDealsData").show();
            $(".addHeight").css("height","70px");
            $(".addNewTaskCustomer").val("").attr("data-id","");
            $(".searchOwnerTaskNewInput").removeClass("disabled").css("background-color","#fff");
            $("#newTaskModal .dropdowns-toggle").removeClass("disabled");
            myTaskWidget._showMyTaskOwner();//责任人显示
            myTaskWidget._UIDEFAULFS.addNewTaskCustomerId = "";
        });
    },
    _enableClickImgEditMyTask: function () {
        myTaskWidget._addEventListener({
            container: "body",
            target: ".emptyImg img",
            type: "click",
            event: function () {
                var me = $(this);
                $("#editNewTaskForm").data('bootstrapValidator').destroy();
                $('#editNewTaskForm').data('bootstrapValidator', null);
                myTaskWidget._initValidatorMyForm();//初始化验证表单
                myTaskWidget._initGetContactMyList();
                myTaskWidget._getAllConListMyDatas();
                $(".addCustomerData").hide();
                $(".addModal").hide();
                $(".addHeight").css("height","70px");
                $(".newBuildCarOwnerData").hide();
                $("#modalNewTaskStatus").addClass("disabled").css("background-color","#eee").val(me.parent().parent().prev().data("id"));
                $(".searchOwnerTaskNewInput").addClass("disabled").css("background-color","#eee");
                $("#newTaskModal .dropdowns-toggle").addClass("disabled");
                $("#newTaskModal").modal("show");
            }
        });
    }
};