widget = {}
widget = {
    DEFAULT: {
        optionsNewItemObj: [],
        optionsDeleteItemObj: [],
        //问卷相关变量
        questionObj: {},
        //问题选项临时删除变量
        curChoiceArr: [],
        //逻辑设置新增临时变量
        curLogicObj: {},
        //编辑逻辑时删除逻辑的临时变量
        curDeleteLogicArr: {},
        surveyAppletDetail: "",
        itemAppletList: "",
        itemAppletDetail: "",
        questionAppletDetail: "",
        questionAppletList: "",
        choiceAppletList: "",
        choiceAppletDetail: "",
        logicAppletDetail: "",
        logicAppletList: "",
        campaignH5AppletDetail: "",
        questionarieId: "",//问卷id
        campaignId: "",
        campaign_template_id: getThisTabVars("campaign_template_id"),
        campaignH5Id: getThisTabVars("H5ValueId"),
        bgImgObj: "",
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    init: function () {
        //初始化customApplet
        widget.initDefaultsVars();
        //绑定页面事件
        widget.bindEvent();
        //结束时间初始化
        widget.initDateTimePicker();
        //结束页初始化
        widget.initEndPage();
        //用户提交表单
        widget.getViewId();
        //编辑
        if (widget.DEFAULT.campaignH5Id) {
            widget.DEFAULT.questionarieId = getThisTabVars("questionarieId");
            widget.DEFAULT.campaignId = getThisTabVars("campaignValueId");
            //widget.DEFAULT.campaignH5Id = getThisTabVars("h5ValueId");
            widget.buildEditPage();
        } else {//新建
            //新建survey
            widget.newSurvey();
        }

    },
    initDefaultsVars: function () {
        //问卷详情
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_detail\"'
        }).done(function (data) {
            widget.DEFAULT.surveyAppletDetail = data.applets[0].applet;//06cfd670-12b0-11e7-b902-00163e2eea54
        });
        //问卷项list
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_item_list\"'
        }).done(function (data) {
            widget.DEFAULT.itemAppletList = data.applets[0].applet;//2ad858ec-12b5-11e7-b902-00163e2eea54
        });
        //问卷项详情
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_item_detail\"'
        }).done(function (data) {
            widget.DEFAULT.itemAppletDetail = data.applets[0].applet;//bfbdc4b4-12c4-11e7-b902-00163e2eea54
        });
        //问卷问题详情
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_question_detail\"'
        }).done(function (data) {
            widget.DEFAULT.questionAppletDetail = data.applets[0].applet;//c12d86d9-12c9-11e7-b902-00163e2eea54
            //"or_survey_question_list" ----689010db-12b9-11e7-b902-00163e2eea54
        })
        //问卷问题list
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_question_list\"'
        }).done(function (data) {
            widget.DEFAULT.questionAppletList = data.applets[0].applet;//689010db-12b9-11e7-b902-00163e2eea54
        })
        //问卷问题的选项list
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_choice_list\"'
        }).done(function (data) {
            widget.DEFAULT.choiceAppletList = data.applets[0].applet;//14cfc6d8-12be-11e7-b902-00163e2eea54
        })
        //问卷问题的选项详情
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_choice_detail\"'
        }).done(function (data) {
            widget.DEFAULT.choiceAppletDetail = data.applets[0].applet;//3f54a264-12cc-11e7-b902-00163e2eea54
        })
        //问卷问题逻辑详情
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_show_rule_detail\"'
        }).done(function (data) {
            widget.DEFAULT.logicAppletDetail = data.applets[0].applet;//95d7ae62-12d3-11e7-b902-00163e2eea54
        })
        //问卷问题逻辑list
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"or_survey_show_rule_list\"'
        }).done(function (data) {
            widget.DEFAULT.logicAppletList = data.applets[0].applet;//92176b6b-12c1-11e7-b902-00163e2eea54
        })
        //campaignH5Dtail
        Iptools.uidataTool._getCustomizeApplet({
            async: false,
            "nameList": '\"Campaign_H5 Detail Applet\"'
        }).done(function (data) {
            widget.DEFAULT.campaignH5AppletDetail = data.applets[0].applet;//3b3d5569-ee96-11e6-bf5f-00163e0052f2
        })

    },
    bindEvent: function () {
        //绑定hover出右侧工具栏
        widget.bindUiEvent();
        //拖动
        //widget.bindDragulaEvent();
        //编辑问题-增删选项
        widget.bindEditQuestionItems();
        //工具栏
        widget.bindQuestionType();
        //绑定编辑取消和保存按钮事件
        widget.editBtnEvent();
        //添加题型
        widget.bindAddRadioQuestionEvent();
        widget.bindAddCheckboxQuestionEvent();
        widget.bindAddSelectQuestionEvent();
        widget.bindAddInputQuestionEvent();
        widget.bindAddTextareaQuestionEvent();
        widget.bindAddDescriptionQuestionEvent();

        //逻辑控制弹窗事件
        widget.bindLogicOptionAndQeuEvent();

        //结束页富文本编辑器
        widget.editor();

        //左侧预览
        //widget.phonePreview();
        //y右侧保存
        widget.saveQuestionEvent();
        //微信预览
        widget.wxPreviewEvent();
        //结束时间开关
        widget.endTimeEvent();
        //设置表单开关
        widget.formAppletEvent();
        //绑定上传图片
        widget.uploadbgImgEvent();
        //标题和副标题oninput时间
        widget.titlesInputEvent();
    },
    newSurvey: function () {
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.surveyAppletDetail,
            async: false,
        }).done(function (data) {
            qprefix = data.rootLink;
            var paramStr = "";
            var paramData = {};
            paramStr += '{';
//			  //paramStr += "\""+qprefix+":sub_type\":\""++"\",";
            paramStr += "\"" + qprefix + ":name\":\"" + $(".title-content").val() + "\",";
//			  paramStr += "\""+qprefix+":type\":\""+queType+"\"";
            paramStr += "}";
            paramData["data"] = paramStr;
            paramData["async"] = false;
            paramData["appletId"] = widget.DEFAULT.surveyAppletDetail;
            //新建问题
            Iptools.uidataTool._addAppletData(paramData).done(function (json) {
                widget.DEFAULT.questionarieId = json.id;
                setThisTabVars("questionarieId", json.id);
            })
        })
    },
    initEndPage: function () {
        $('#end_summernote').summernote("code", '<p style="text-align:center"><img src="http://enterpriseserver.yizhangke.com/upload/33/jpg/1491527270690.png"></p>');
    },
    initDateTimePicker: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        $("#tab1-panel .endTime").datetimepicker({
            format: "yyyy-mm-dd hh:00:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView:1
        });
        //设置结束时间的开始时间
        $("#tab1-panel .endTime").datetimepicker('setStartDate', currentdate);
        $("#tab1-panel .endTime").val(currentdate);
    },
    //获取viewid
    getViewId: function () {
        Iptools.GetJson({
            url: "basic/customizeViewsByNameList",
            data: {"tenantId": Iptools.DEFAULTS.tenantId, "nameList": '\"campaign_form\"'},
            async: false,
        }).done(function (data) {
            widget.getAppletIdByViewId(data[0].viewId);
        })
    },
    //根据viewId获取applet[]
    getAppletIdByViewId: function (ViewId) {
        $("#tab1-panel .user-fill-inputs").html("");
        Iptools.GetJson({
            url: "service/views",
            data: {"token": Iptools.DEFAULTS.token, "viewId": ViewId},
            async: false,
        }).done(function (data) {
            for (var i = 0; i < data.applets.length; i++) {
                widget.getFormByAppletId(data.applets[i].uuid);
            }
            ;
        })
    },
    //根据appletId获取表单字段
    getFormByAppletId: function (AppletId) {

        var formStr = "";
        Iptools.uidataTool._getApplet({
            "applet": AppletId,
            async: false,
        }).done(function (data) {
            for (var i = 0; i < data.controls.length; i++) {
                formStr += data.controls[i].name;
                if (i < data.controls.length - 1) {
                    formStr += "/";
                }
            }
            ;
        })

        var html = '' +
            '<label><input type="radio"  id="' + AppletId + '" name="optionsRadios" id="optionsRadios2">' + formStr + '</label>' +
            '';
        $("#tab1-panel .user-fill-inputs").append(html);
        $("#tab1-panel .user-fill-inputs").find("input[name=optionsRadios]").prop("checked", true);
    },
    //构建编辑页
    buildEditPage: function () {
        widget.buildEditH5Info();
        widget.buildEditQuestionVar();
    },
    buildEditH5Info: function () {
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULT.campaignH5AppletDetail,
            "valueId": widget.DEFAULT.campaignH5Id,
            "async": false
        }).done(function (data) {
            if (data) {
                var prefix = data.rootLink;
                $(".tab-content .title-content").html(data.data[prefix + ":title"]);
                $(".tab-content .prefix-content").html(data.data[prefix + ":sub_title"]);
                //结束页
                if (data.data[prefix + ":rich_text"]) {
                    $('#end_summernote').summernote("code", data.data[prefix + ":rich_text"]);
                }
                if (data.data[prefix + ":back_img"]) {
                    $(".tab-content").css("background-image", "url(" + data.data[prefix + ":back_img"] + ")");
                    $(".preview-area").css("background-image", "url(" + data.data[prefix + ":back_img"] + ")");
                }
                //结束时间
                if (data.data[prefix + ":end_time"]) {
                    $("#tab1-panel #cb1").trigger("click");
                    //$("#tab1-panel #cb1").prop("checked",true);

                    $("#tab1-panel .endTime").val(data.data[prefix + ":end_time"]);
                }
                //用户提交表单
                if (data.data[prefix + ":form_applet"]) {
                    $("#tab1-panel #cb3").trigger("click");
                    //$("#tab1-panel #cb3").prop("checked",true);
                    $("#" + data.data[prefix + ":form_applet"] + "").prop("checked", true);
                    //$("#tab1-panel .endTime").val(data.data[prefix+":form_applet"]);
                }
                if (!widget.DEFAULT.questionarieId) {
                    widget.DEFAULT.questionarieId = data.data[prefix + ":survey_id"];
                }

            }
        })
    },
    buildEditQuestionInfo: function (queType, qobj) {
        switch (queType) {
            case "radio":
                $(".que-container").append(widget.addRadioQuestion({"isPreview": false, "_this": null, "data": qobj}));
                break;
            case "checkbox":
                $(".que-container").append(widget.addCheckboxQuestion({
                    "isPreview": false,
                    "_this": null,
                    "data": qobj
                }));
                break;
            case "select":
                $(".que-container").append(widget.addSelectQuestion({"isPreview": false, "_this": null, "data": qobj}));
                break;
            case "input":
                $(".que-container").append(widget.addInputQuestion({"isPreview": false, "_this": null, "data": qobj}));
                break;
            case "textarea":
                $(".que-container").append(widget.addTextareaQuestion({
                    "isPreview": false,
                    "_this": null,
                    "data": qobj
                }));
                break;
            case "description":
                $(".que-container").append(widget.addDescriptionQuestion({
                    "isPreview": false,
                    "_this": null,
                    "data": qobj
                }));
                break;
        }
    },
    buildEditQuestionVar: function () {
        var questiionObj = {};
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.itemAppletList,
            async: false,
        }).done(function (data) {
            var prefix = data.rootLink;
            var condition = '{"' + prefix + ':survey_id":"=' + widget.DEFAULT.questionarieId + '"}';
            Iptools.uidataTool._getUserlistAppletData({
                async: false,
                "appletId": widget.DEFAULT.itemAppletList,
                "condition": condition,
                "orderByColumn": prefix + ":sequence",
                "orderByAscDesc": "asc"
            }).done(function (data) {
                if (data && data.data && data.data.records.length !== 0) {
                    var iprefix = "or_survey_item";
                    var records = data.data.records;
                    //获取问题
                    for (var i = 0; i < records.length; i++) {
                        var iobj = data.data.records[i];
                        var qobj = data.data.records[i];
                        var qid = "", qType = "";
                        var qprefix = "or_question";
                        qid = qobj[qprefix + ":id"];
                        qType = qobj[qprefix + ":type"].id;
                        //回显题
                        widget.buildEditQuestionInfo(qobj[qprefix + ":type"].id, qobj);
                        $("#tab0-panel .que-main[data-qid=" + records[i][iprefix + ":question_id"].id + "]").attr("data-surveyid", records[i][iprefix + ":id"]);
                        if (iobj) {
                            questiionObj["" + qid] = {};
                            var cobj = widget.getChoiceListByQuestionId(records[i][iprefix + ":question_id"].id);
                            if (cobj.data) {
                                var cobjItem = cobj.data.records;
                                var cPrefix = cobj.rootLink;
                                var chtml = "";
                                var selectCHtml = '';
                                selectCHtml += '<select name="qinputs-item" class="qinputs-item"><option class="defaultVal" value="-1">--请选择--</option>';
                                //获取选项
                                for (var j = 0; j < cobjItem.length; j++) {
                                    var cid = cobjItem[j][cPrefix + ":id"], cText = cobjItem[j][cPrefix + ":text"];
                                    questiionObj["" + qid]["" + cid] = {};

                                    //回显选项,构建dom
                                    if (qType == "radio") {
                                        chtml += '<div class="qinputs-item" cid="' + cid + '"><input type="radio"><label>' + cText + '</label></div>';
                                    } else if (qType == "checkbox") {
                                        chtml += '<div class="qinputs-item" cid="' + cid + '"><input type="checkbox"><label>' + cText + '</label></div>';
                                    } else if (qType == "select") {
                                        chtml += '<option id="' + cid + '" value="' + cid + '" class="">' + cText + '</option>';
                                    }

                                    var choiceLogicObj = widget.getRuleDetailByChoiceId(cid);
                                    if (choiceLogicObj.data) {
                                        var cqprefix = choiceLogicObj.rootLink;
                                        var cqid = choiceLogicObj.data.records[0][cqprefix + ":question_id"];
                                        var ruleItem = {};
                                        ruleItem["logicId"] = choiceLogicObj.data.records[0][cqprefix + ":id"];
                                        ruleItem["status"] = "init";
                                        questiionObj["" + qid]["" + cid]["" + cqid] = ruleItem;
                                        //给此题设置标识
                                        $("#tab0-panel .que-main[data-qid=" + records[i][iprefix + ":question_id"].id + "]").attr("isSetLogic", "true");
                                    }

                                }
                                if (qType == "select") {
                                    chtml = selectCHtml + chtml + '</select>';
                                }
                                $("#tab0-panel .que-main[data-qid=" + records[i][iprefix + ":question_id"].id + "]").find(".qinputs").html(chtml);
                            }

                        }

                    }
                    widget.DEFAULT.questionObj = $.extend(true, {}, questiionObj);
                    ;
                }
            })
        })
        widget.phonePreview();
    },
    buildChoice: function (data) {
        var html = "";
        html += '<div class="qinputs-item"><input type="radio"><label>选项一</label></div>';
    },
    //获取item详情
    getItemDetailByItemId: function (id) {
        var obj = {};
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULT.itemAppletDetail,
            "valueId": id,
            "async": false
        }).done(function (data) {
            if (data) {
                var prefix = data.rootLink;
                obj = data;
            }
        })
        return obj;
    },
    //获取question详情
    getQuestionDetailById: function (id) {
        var obj = {};
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULT.questionAppletDetail,
            "valueId": id,
            "async": false
        }).done(function (data) {
            if (data) {
                var prefix = data.rootLink;
                obj = data;

            }
        })
        return obj;
    },
    getQuestionList: function (id) {
        var obj = {};
        Iptools.uidataTool._getUserlistAppletData({
            "appletId": widget.DEFAULT.questionAppletList,
            "async": false
        }).done(function (data) {
            if (data) {
                var prefix = data.rootLink;
                obj = data;
            }
        })
        return obj;
    },
    //获取choice详情
    getChoiceDetailById: function (id) {
        var obj = {};
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULT.choiceAppletDetail,
            "valueId": id,
            "async": false
        }).done(function (data) {
            if (data) {
                var prefix = data.rootLink;
                obj = data;
            }
        })
        return obj;
    },
    getChoiceListByQuestionId: function (id) {
        var obj = {};
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.choiceAppletList,
            async: false,
        }).done(function (data) {
            var prefix = data.rootLink;
            var condition = '{"' + prefix + ':question_id":"=' + id + '"}';
            Iptools.uidataTool._getUserlistAppletData({
                async: false,
                appletId: widget.DEFAULT.choiceAppletList,
                condition: condition,
                "orderByColumn": prefix + ":sequence",
                "orderByAscDesc": "asc"
            }).done(function (json) {
                if (json.data) {
                    if (json.data.records) {
                        var prefix = data.rootLink;
                        obj = json;
                    }
                }
            })
        })
        return obj;
    },
    //获取Rules详情
    getRuleDetailByChoiceId: function (id) {
        var obj = {};
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.logicAppletList,
            async: false,
        }).done(function (data) {
            var prefix = data.rootLink;
            var condition = '{"' + prefix + ':choice_id":"=' + id + '"}';
            Iptools.uidataTool._getUserlistAppletData({
                async: false,
                appletId: widget.DEFAULT.logicAppletList,
                condition: condition
            }).done(function (json) {
                if (json.data) {
                    obj = json;
                }
            })
        })
        return obj;
    },
    //绑定hover出右侧工具栏
    bindUiEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".que-main",
            type: "mouseover mouseout",
            event: function (event) {
                if (event.type == "mouseover") {
                    $(this).find(".controls").css({
                        "-webkit-transform": "translateX(0px)",
                        "transform": "translateX(0px)",
                        "-webkit-transition": "-webkit-transform 0.2s",
                        "transition": "transform 0.2s"
                    });
                } else if (event.type == "mouseout") {
                    $(this).find(".controls").css({
                        "-webkit-transform": "translateX(50px)",
                        "transform": "translateX(50px)",
                        "-webkit-transition": "-webkit-transform 0.2s",
                        "transition": "transform 0.2s"
                    });
                }
            }
        })

        widget._addEventListener({
            container: "body",
            target: ".prefix-content",
            type: "mouseover mouseout",
            event: function (event) {
                if (event.type == "mouseover") {
                    $(this).attr("contenteditable", "true");
                } else if (event.type == "mouseout") {
                    $(this).attr("contenteditable", "false");
                }
            }
        })

        widget._addEventListener({
            container: "body",
            target: ".title-content",
            type: "mouseover mouseout",
            event: function (event) {
                if (event.type == "mouseover") {
                    $(this).attr("contenteditable", "true");
                } else if (event.type == "mouseout") {
                    $(this).attr("contenteditable", "false");
                }
            }
        })
    },
    //拖动
    bindDragulaEvent: function () {
        var words = document.querySelector('[data-question]');
        //var sentence = document.querySelector('[data-sentence]');

        document.addEventListener('DOMContentLoaded', function () {
            var drag = dragula([
                words
            ]);
            drag.on("drag", function () {
                console.log("drap");
            });
            drag.on("drop", function () {
                console.log();
            });
        });
    },
    //编辑问题-增删选项
    bindEditQuestionItems: function () {
        $("body").on("click", ".qeinputs-item-remove", function () {
            //如果删除已经新建好的选项，需要push到临时变量中，click保存的时候需要删除该选项
            if ($(this).closest(".qeinputs-item").attr("cid")) {
                widget.DEFAULT.curChoiceArr.push($(this).closest(".qeinputs-item").attr("cid"));
            }
            /*
             * 3个选项的时候可以remove，剩下的不能remove；小于2（正常不应该存在此case）return;
             * */
            if ($(this).closest(".que-main-edit").find(".qeinputs-item").length === 3) {
                $(this).closest(".que-main-edit").find(".qeinputs-item .qeinputs-item-remove").hide();
                $(this).closest(".qeinputs-item").remove();
            } else if ($(this).closest(".que-main-edit").find(".qeinputs-item").length <= 2) {
                return false;
            } else {
                $(this).closest(".qeinputs-item").remove();
            }
        })
        //增一项选项,如果大于2项，需要显示减项的图标，小于等于2项不显示减项的图标
        $("body").on("click", ".qeinput-item-add", function () {
            if ($(this).closest(".que-main-edit").find(".qeinputs-item").length >= 2) {
                $(this).closest(".que-main-edit").find(".qeinputs-item .qeinputs-item-remove").show();
                $(this).before('<div class="qeinputs-item"><input class="form-control" type="text"><span class="iconfont qeinputs-item-remove">&#xe75e;</span></div>');
            } else {
                $(this).before('<div class="qeinputs-item"><input class="form-control" type="text"><span class="iconfont qeinputs-item-remove" style="display: none">&#xe75e;</span></div>');
            }
        })
    },
    //工具栏操作
    bindQuestionType: function () {
        widget._addEventListener({
            container: "body",
            target: ".controls .edit",
            type: "click",
            event: function () {
                widget.editThisQuestion(this);
            }
        })
        widget._addEventListener({
            container: "body",
            target: ".controls .copy",
            type: "click",
            event: function () {
                widget.copyThisQuestion(this);
            }
        })
        widget._addEventListener({
            container: "body",
            target: ".controls .logic",
            type: "click",
            event: function () {
                widget.logicThisQuestion(this);
            }
        })
        widget._addEventListener({
            container: "body",
            target: ".controls .delete",
            type: "click",
            event: function () {
                $("#deleteQuestionModal").modal("show");
                $("#deleteQuestionModal").find(".confirmDelete").attr("data-qid", $(this).closest(".que-main").attr("data-qid"));
                $("#deleteQuestionModal").find(".confirmDelete").attr("data-sid", $(this).closest(".que-main").attr("data-surveyid"));
                //widget.deleteThisQuestion(this);
            }
        })
        widget._addEventListener({
            container: "body",
            target: ".confirmDelete",
            type: "click",
            event: function () {
                widget.deleteThisQuestion(this);
            }
        })
    },
    editThisQuestion: function (e) {
        $(e).closest(".que-wrapper").find(".que-main-edit").removeClass("shake");
        if ($(e).closest(".que-wrapper").find(".que-main-edit").length > 0 && $(e).closest(".que-wrapper").find(".que-main-edit").css("display") === "block") {
            $(e).closest(".que-wrapper").find(".que-main-edit").addClass("shake");
            return false;
        }
        $(e).closest(".que-main").hide();
        var $queContainer = $(e).closest(".que-main");
        var requeired = $queContainer.find(".qtitle-require").html() === "*" ? 1 : 0;
        var html = '<div class="que-main-edit">' +
            '<div class="qeue-control">' +
            '<div class="qetitle">' +
            '<span class="qetitle-text">题目</span>';
        if ($queContainer.hasClass("que-control-description")) {
            html += '<div class="qetitle-content">' +
                '<textarea class="form-control" type="text" value="' + $queContainer.find(".qtitle-text").html() + '" maxlength="45"></textarea>';
        } else {
            html += '<div class="qetitle-content"><input class="form-control" type="text" value="' + $queContainer.find(".qtitle-text").html() + '" maxlength="45"></div>' +
                '<label> ';

            if (requeired) {
                html += '<input name="qe_required" style="margin-right: 0;" type="checkbox" checked> ';
            } else {
                html += '<input name="qe_required" style="margin-right: 0;" type="checkbox"> ';
            }

            html += '必填' +
                '</label>';
        }

        html += '</div>' +
            '</div>';
        html += '<div class="qeinputs">';
        /*
         * 有选项的有三种-分为两种类型--radio,checkbox和select
         * */
        if ($queContainer.hasClass("que-control-radio") || $queContainer.hasClass("que-control-checkbox")) {
            var options = $queContainer.find(".qinputs-item");
            for (var i = 0; i < options.length; i++) {
                var optsVal = $(options[i]).find("label").html();
                var choiceId = $(options[i]).attr("cid");
                if (options.length > 2) {
                    html += '<div class="qeinputs-item" cid="' + choiceId + '"><input class="form-control" type="text" value="' + optsVal + '"><span class="iconfont qeinputs-item-remove">&#xe75e;</span></div>';
                } else {
                    html += '<div class="qeinputs-item" cid="' + choiceId + '"><input class="form-control" type="text" value="' + optsVal + '"><span class="iconfont qeinputs-item-remove" style="display: none">&#xe75e;</span></div>';
                }
            }
            html += '<div class="qeinput-item-add"><span class="iconfont">&#xe75f;</span></div>';
        } else if ($queContainer.hasClass("que-control-select")) {
            var options = $queContainer.find(".qinputs-item option");

            for (var i = 0; i < options.length; i++) {
                if ($(options[i]).val() === "-1") {
                    continue;
                } else {
                    var optsVal = $(options[i]).html();
                    var choiceId = $(options[i]).attr("id");
                    if (options.length > 3) {
                        html += '<div class="qeinputs-item" cid="' + choiceId + '"><input class="form-control" type="text" value="' + optsVal + '"><span class="iconfont qeinputs-item-remove">&#xe75e;</span></div>';
                    } else {
                        html += '<div class="qeinputs-item" cid="' + choiceId + '"><input class="form-control" type="text" value="' + optsVal + '"><span class="iconfont qeinputs-item-remove" style="display: none">&#xe75e;</span></div>';
                    }
                }
            }
            html += '<div class="qeinput-item-add"><span class="iconfont">&#xe75f;</span></div>';
        }
        html += '</div>'
        html += ' <div class="qeControls-btns">' +
            '<button type="button" class="btn commonBtn qeControls-btns-save">保存</button>' +
            '<button class="btn commonBtn revert qeControls-btns-cancel" type="reset">取消</button> ' +
            '</div>' +
            '</div>';
        $(".que-main-edit").remove();
        $(e).closest(".que-main").after(html);
    },
    //复制
    copyThisQuestion: function (e) {
        var html = $(e).closest(".que-main").clone();
        $(e).closest(".que-main").after(html);
        //$(e).closest(".que-main").fadeIn(1000);
        //$(e).closest(".que-main").slideDown("slow")
        widget.copyAddQuestion(e);
        sortQuestion();
        widget.phonePreview();
    },
    //逻辑
    logicThisQuestion: function (e) {
        $("#logicConfigModal").find(".logic-left ul").html("");
        $("#logicConfigModal").find(".logic-right ul").html("");
        var $thisQuestion = $(e).closest(".que-main");
        var thisQusNo = parseInt($thisQuestion.find(".qtitle-index").html());
        var questionType = widget.getQuestionTypeBy$dom($thisQuestion);
        var allQuesions = "";
        var $thisOptions;
        var leftops = "";

        $("#logicConfigModal").attr("data-target", $thisQuestion.attr("id"));
        //获取所有题目
        allQuesions = $("#tab0-panel .que-container").find(".que-main");
        var allQuesionLen = parseInt(allQuesions.length);
        var rightques = "";
        /*
         * 最后一题没有逻辑可设置
         */
        if (thisQusNo !== allQuesionLen) {
            //根据题型遍历选项
            if (questionType === "radio" || questionType === "checkbox") {
                $thisOptions = $thisQuestion.find(".qinputs-item");
                for (var i = 0; i < $thisOptions.length; i++) {
                    leftops += '<li class="logic-left-option" data-id="' + $($thisOptions[i]).attr("cid") + '">' + (i + 1) + "." + $($thisOptions[i]).find("label").html() + '</li>';
                }
            } else if (questionType === "select") {
                $thisOptions = $thisQuestion.find(".qinputs-item option");
                for (var i = 0; i < $thisOptions.length; i++) {
                    if ($($thisOptions[i]).val() === "-1") {
                        continue;
                    } else {
                        leftops += '<li class="logic-left-option" data-id="' + $($thisOptions[i]).attr("id") + '">' + (i - 1) + "." + $($thisOptions[i]).html() + '</li>';
                    }

                }
            }
            $("#logicConfigModal").find(".logic-left ul").html(leftops);

            //如果之前设计过
            if ($thisQuestion.attr("isSetLogic") !== "true") {
                //右侧所有题
                for (var i = 0; i < allQuesionLen; i++) {
                    if ((i + 1) <= thisQusNo) {
                        rightques += '<li class="logic-right-option disabled" data-id="' + $(allQuesions[i]).attr("data-qid") + '">' + (i + 1) + "." + $(allQuesions[i]).find(".qtitle .qtitle-text").html() + '</li>';
                    } else {
                        rightques += '<li class="logic-right-option enable" data-id="' + $(allQuesions[i]).attr("data-qid") + '">' + (i + 1) + "." + $(allQuesions[i]).find(".qtitle .qtitle-text").html() + '</li>';
                    }
                }
                $("#logicConfigModal").find(".logic-right ul").html(rightques);
//            	var selectedQuestionArr = widget.DEFAULT.OPTIONLOGICARR[0]["target"];
//            	var enableQuestion=$("#logicConfigModal").find(".logic-right .logic-right-option.enable");
//            	for(var j = 0;j < enableQuestion.length;j++){
//            		if( $(enableQuestion[j]).attr("data-id") === selectedQuestionArr[j]){
//            			$(enableQuestion[j]).addClass("active");
//            		}
//            	}
            } else {
                //右侧所有题
                for (var i = 0; i < allQuesionLen; i++) {
                    if ((i + 1) <= thisQusNo) {
                        rightques += '<li class="logic-right-option disabled" data-id="' + $(allQuesions[i]).attr("data-qid") + '">' + (i + 1) + "." + $(allQuesions[0]).find(".qtitle .qtitle-text").html() + '</li>';
                    } else {
                        rightques += '<li class="logic-right-option enable" data-id="' + $(allQuesions[i]).attr("data-qid") + '">' + (i + 1) + "." + $(allQuesions[i]).find(".qtitle .qtitle-text").html() + '</li>';
                    }
                }
                $("#logicConfigModal").find(".logic-right ul").html(rightques);
            }

        }

        //显示当前各个选项跳转 对应题（默认第一个）
        $("#logicConfigModal").modal("show");
        $("#logicConfigModal").find(".logic-left ul li:first").trigger("click");
    },
    //删除
    deleteThisQuestion: function (e) {
        //$(e).closest(".que-main").fadeOut("slow");
        widget.deleteThisQuestion(e);
    },
    //编辑
    editBtnEvent: function () {
        $("body").on("click", ".qeControls-btns-save", function () {
            //构建题目
            if (widget.addQuestion(this) !== false) {
                widget.phonePreview();
            }
        })
        $("body").on("click", ".qeControls-btns-cancel", function () {
            var $e = $(this);
            var $targetQue = $e.closest(".que-main-edit");
            $e.closest(".que-main-edit").hide();
            if ($targetQue.prev().attr("data-isnew") === "true") {
                $targetQue.prev().remove();
                $e.closest(".que-main-edit").remove();
            } else {
                $targetQue.prev().show();
                $e.closest(".que-main-edit").remove();
            }
            //清空临时变量
            widget.DEFAULT.curChoiceArr.length = 0;
        })
    },
    bindAddRadioQuestionEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".que-type-radio",
            type: "click",
            event: function (event) {
                if ($(this).closest(".que-wrapper").find(".que-main-edit").length === 0 || $(this).closest(".que-wrapper").find(".que-main-edit").css("display") === "none") {
                    widget.addRadioQuestion({"_this": this, "isNew": true});
                } else {
                    $(this).closest(".que-wrapper").find(".que-main-edit").addClass("shake");
                    setTimeout(function () {
                        $(".que-main-edit").removeClass("shake");
                    }, 1000);
                    return false;
                }
            }
        })
    },
    bindAddCheckboxQuestionEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".que-type-checkbox",
            type: "click",
            event: function (event) {
                if ($(this).closest(".que-wrapper").find(".que-main-edit").length === 0 || $(this).closest(".que-wrapper").find(".que-main-edit").css("display") === "none") {
                    widget.addCheckboxQuestion({"_this": this, "isNew": true});
                } else {
                    $(this).closest(".que-wrapper").find(".que-main-edit").addClass("shake");
                    setTimeout(function () {
                        $(".que-main-edit").removeClass("shake");
                    }, 1000);
                    return false;
                }
            }
        })
    },
    bindAddSelectQuestionEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".que-type-select",
            type: "click",
            event: function (event) {
                if ($(this).closest(".que-wrapper").find(".que-main-edit").length === 0 || $(this).closest(".que-wrapper").find(".que-main-edit").css("display") === "none") {
                    widget.addSelectQuestion({"_this": this, "isNew": true});
                } else {
                    $(this).closest(".que-wrapper").find(".que-main-edit").addClass("shake");
                    setTimeout(function () {
                        $(".que-main-edit").removeClass("shake");
                    }, 1000);
                    return false;
                }
            }
        })
    },
    bindAddInputQuestionEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".que-type-input",
            type: "click",
            event: function (event) {
                if ($(this).closest(".que-wrapper").find(".que-main-edit").length === 0 || $(this).closest(".que-wrapper").find(".que-main-edit").css("display") === "none") {
                    widget.addInputQuestion({"_this": this, "isNew": true});
                } else {
                    $(this).closest(".que-wrapper").find(".que-main-edit").addClass("shake");
                    setTimeout(function () {
                        $(".que-main-edit").removeClass("shake");
                    }, 1000);
                    return false;
                }
            }
        })
    },
    bindAddTextareaQuestionEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".que-type-textarea",
            type: "click",
            event: function (event) {
                if ($(this).closest(".que-wrapper").find(".que-main-edit").length === 0 || $(this).closest(".que-wrapper").find(".que-main-edit").css("display") === "none") {
                    widget.addTextareaQuestion({"_this": this, "isNew": true});
                } else {
                    $(this).closest(".que-wrapper").find(".que-main-edit").addClass("shake");
                    setTimeout(function () {
                        $(".que-main-edit").removeClass("shake");
                    }, 1000);
                    return false;
                }
            }
        })
    },
    bindAddDescriptionQuestionEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".que-type-description",
            type: "click",
            event: function (event) {
                if ($(this).closest(".que-wrapper").find(".que-main-edit").length === 0 || $(this).closest(".que-wrapper").find(".que-main-edit").css("display") === "none") {
                    widget.addDescriptionQuestion({"_this": this, "isNew": true});
                } else {
                    $(this).closest(".que-wrapper").find(".que-main-edit").addClass("shake");
                    setTimeout(function () {
                        $(".que-main-edit").removeClass("shake");
                    }, 1000);
                    return false;
                }
            }
        })
    },
    addRadioQuestion: function (ops) {
        var isRequired, text, qid, iprefix, qprefix;
        if (ops && ops.data) {
            ops = ops.data;
            iprefix = "or_survey_item";
            qprefix = "or_question";
            qid = ops[iprefix + ":question_id"].id;
            isRequired = ops[iprefix + ":is_required"] ? ops[iprefix + ":is_required"] : 0;
            text = ops[qprefix + ":name"] ? ops[qprefix + ":name"] : "请输入题目";
        } else {
            isRequired = "";
            text = "请输入题目";
        }
        var qesLen = $("#tab0-panel .que-container").find(".que-main").length;
        var isnew = ops.isNew === true ? "true" : "false";
        var html = '<div class="que-main que-control-radio" id="q-' + (qesLen + 1) + '" data-isnew="' + isnew + '" data-qid="' + qid + '">' +
            '<div class="que-control">' +
            '<div class="qtitle">';
        if (isRequired) {
            html += '<span class="qtitle-require">*</span>';
        } else {
            html += '<span class="qtitle-require"></span>';
        }

        html += '<span class="qtitle-index">' + (qesLen + 1) + '.</span>' +
            '<span class="qtitle-text">' + text + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="qinputs">' +
            '<div class="qinputs-item"><input type="radio"><label>选项一</label></div>' +
            '<div class="qinputs-item"><input type="radio"><label>选项二</label></div>' +
            '</div>';
        if (!ops.isPreview) {
            html += '<div class="controls">' +
                '<ul> ' +
                '<li class="control_btn edit">' +
                '<b title="编辑"><i class="iconfont">&#xe7aa;</i></b>' +
                '</li> ' +
                '<li class="control_btn copy">' +
                '<b title="复制"><i class="iconfont">&#xe7ad;</i></b>' +
                '</li> ' +
                '<li class="control_btn logic">' +
                '<b title="设置逻辑"><i class="iconfont">&#xe7ac;</i></b>' +
                '</li> ' +
                '<li class="control_btn delete">' +
                '<b title="删除"><i class="iconfont">&#xe7ab;</i></b>' +
                '</li> ' +
                '</ul> ' +
                '</div>';
        }

        html += '</div>';
        if (ops._this) {
            $(ops._this).closest(".que-wrapper").find(".que-container").append(html);
            $("#q-" + (qesLen + 1)).find(".control_btn.edit").trigger("click");
        } else {
            return html;
        }
    },
    addCheckboxQuestion: function (ops) {
        var isRequired, text, qid, iprefix, qprefix;
        if (ops && ops.data) {
            ops = ops.data;
            iprefix = "or_survey_item";
            qprefix = "or_question";
            qid = ops[iprefix + ":question_id"].id;
            isRequired = ops[iprefix + ":is_required"] ? ops[iprefix + ":is_required"] : 0;
            text = ops[qprefix + ":name"] ? ops[qprefix + ":name"] : "请输入题目";
        } else {
            isRequired = "";
            text = "请输入题目";
        }
        var qesLen = $("#tab0-panel .que-container").find(".que-main").length;
        var isnew = ops.isNew === true ? "true" : "false";
        var html = '<div class="que-main que-control-checkbox" id="q-' + (qesLen + 1) + '" data-isnew="' + isnew + '" data-qid="' + qid + '">' +
            '<div class="que-control que-control-radio">' +
            '<div class="qtitle">';
        if (isRequired) {
            html += '<span class="qtitle-require">*</span>';
        } else {
            html += '<span class="qtitle-require"></span>';
        }
        html += '<span class="qtitle-index">' + (qesLen + 1) + '.</span>' +
            '<span class="qtitle-text">' + text + '</span>' +
            '</div>' +
            ' </div>' +
            '<div class="qinputs">' +
            '<div class="qinputs-item"><input type="checkbox"><label>选项一</label></div>' +
            '<div class="qinputs-item"><input type="checkbox"><label>选项二</label></div>' +
            '</div>';
        if (!ops.isPreview) {
            html += '<div class="controls">' +
                '<ul> ' +
                '<li class="control_btn edit">' +
                '<b title="编辑"><i class="iconfont">&#xe7aa;</i></b>' +
                '</li> ' +
                '<li class="control_btn copy">' +
                '<b title="复制"><i class="iconfont">&#xe7ad;</i></b>' +
                '</li> ' +
                '<li class="control_btn logic">' +
                '<b title="设置逻辑"><i class="iconfont">&#xe7ac;</i></b>' +
                '</li> ' +
                '<li class="control_btn delete">' +
                '<b title="删除"><i class="iconfont">&#xe7ab;</i></b>' +
                '</li> ' +
                '</ul> ' +
                '</div>';
        }

        html += '</div>';
        if (ops._this) {
            $(ops._this).closest(".que-wrapper").find(".que-container").append(html);
            $("#q-" + (qesLen + 1)).find(".control_btn.edit").trigger("click");
        } else {
            return html;
        }
    },
    addSelectQuestion: function (ops) {
        var isRequired, text, qid, iprefix, qprefix;
        if (ops && ops.data) {
            ops = ops.data;
            iprefix = "or_survey_item";
            qprefix = "or_question";
            qid = ops[iprefix + ":question_id"].id;
            isRequired = ops[iprefix + ":is_required"] ? ops[iprefix + ":is_required"] : 0;
            text = ops[qprefix + ":name"] ? ops[qprefix + ":name"] : "请输入题目";
        } else {
            isRequired = "";
            text = "请输入题目";
        }
        var qesLen = $("#tab0-panel .que-container").find(".que-main").length;
        var isnew = ops.isNew === true ? "true" : "false";
        var html = '<div class="que-main que-control-select" id="q-' + (qesLen + 1) + '" data-isnew="' + isnew + '" data-qid="' + qid + '">' +
            '<div class="que-control ">' +
            '<div class="qtitle">';
        if (isRequired) {
            html += '<span class="qtitle-require">*</span>';
        } else {
            html += '<span class="qtitle-require"></span>';
        }
        html += '<span class="qtitle-index">' + (qesLen + 1) + '.</span>' +
            '<span class="qtitle-text">' + text + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="qinputs">' +
            '<select name="qinputs-item" class="form-control qinputs-item">' +
            '<option class="defaultVal" value="-1">--请选择--</option>  ' +
            '<option id="" value="o-100-ABCD" class=""> 选项 </option>' +
            '<option id="" value="o-101-EFGH" class=""> 选项 </option>  ' +
            '</select>' +
            '</div>';
        if (!ops.isPreview) {
            html += '<div class="controls">' +
                '<ul> ' +
                '<li class="control_btn edit">' +
                '<b title="编辑"><i class="iconfont">&#xe7aa;</i></b>' +
                '</li> ' +
                '<li class="control_btn copy">' +
                '<b title="复制"><i class="iconfont">&#xe7ad;</i></b>' +
                '</li> ' +
                '<li class="control_btn logic">' +
                '<b title="设置逻辑"><i class="iconfont">&#xe7ac;</i></b>' +
                '</li> ' +
                '<li class="control_btn delete">' +
                '<b title="删除"><i class="iconfont">&#xe7ab;</i></b>' +
                '</li> ' +
                '</ul> ' +
                '</div>';
        }

        html += '</div>';
        if (ops._this) {
            $(ops._this).closest(".que-wrapper").find(".que-container").append(html);
            $("#q-" + (qesLen + 1)).find(".control_btn.edit").trigger("click");
        } else {
            return html;
        }
    },
    addInputQuestion: function (ops) {
        var isRequired, text, qid, iprefix, qprefix;
        if (ops && ops.data) {
            ops = ops.data;
            iprefix = "or_survey_item";
            qprefix = "or_question";
            qid = ops[iprefix + ":question_id"].id;
            isRequired = ops[iprefix + ":is_required"] ? ops[iprefix + ":is_required"] : 0;
            text = ops[qprefix + ":name"] ? ops[qprefix + ":name"] : "请输入题目";
        } else {
            isRequired = "";
            text = "请输入题目";
        }
        var qesLen = $("#tab0-panel .que-container").find(".que-main").length;
        var isnew = ops.isNew === true ? "true" : "false";
        var html = '<div class="que-main que-control-input" id="q-' + (qesLen + 1) + '" data-isnew="' + isnew + '" data-qid="' + qid + '">' +
            '<div class="que-control ">' +
            '<div class="qtitle">';
        if (isRequired) {
            html += '<span class="qtitle-require">*</span>';
        } else {
            html += '<span class="qtitle-require"></span>';
        }

        html += '<span class="qtitle-index">' + (qesLen + 1) + '.</span>' +
            '<span class="qtitle-text">' + text + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="qinputs">' +
            '<input class="form-control qinputs-item">' +
            '</div>';
        if (!ops.isPreview) {
            html += '<div class="controls">' +
                '<ul> ' +
                '<li class="control_btn edit">' +
                '<b title="编辑"><i class="iconfont">&#xe7aa;</i></b>' +
                '</li> ' +
                '<li class="control_btn copy">' +
                '<b title="复制"><i class="iconfont">&#xe7ad;</i></b>' +
                '</li> ' +
                '<li class="control_btn logic">' +
                '<b title="设置逻辑"><i class="iconfont">&#xe7ac;</i></b>' +
                '</li> ' +
                '<li class="control_btn delete">' +
                '<b title="删除"><i class="iconfont">&#xe7ab;</i></b>' +
                '</li> ' +
                '</ul> ' +
                '</div>';
        }

        html += '</div>';
        if (ops._this) {
            $(ops._this).closest(".que-wrapper").find(".que-container").append(html);
            $("#q-" + (qesLen + 1)).find(".control_btn.edit").trigger("click");
        } else {
            return html;
        }
    },
    addTextareaQuestion: function (ops) {
        var isRequired, text, qid, iprefix, qprefix;
        if (ops && ops.data) {
            ops = ops.data;
            iprefix = "or_survey_item";
            qprefix = "or_question";
            qid = ops[iprefix + ":question_id"].id;
            isRequired = ops[iprefix + ":is_required"] ? ops[iprefix + ":is_required"] : 0;
            text = ops[qprefix + ":name"] ? ops[qprefix + ":name"] : "请输入题目";
        } else {
            isRequired = "";
            text = "请输入题目";
        }
        var qesLen = $("#tab0-panel .que-container").find(".que-main").length;
        var isnew = ops.isNew === true ? "true" : "false";
        var html = '<div class="que-main que-control-textarea" id="q-' + (qesLen + 1) + '" data-isnew="' + isnew + '" data-qid="' + qid + '">' +
            '<div class="que-control">' +
            '<div class="qtitle">';
        if (isRequired) {
            html += '<span class="qtitle-require">*</span>';
        } else {
            html += '<span class="qtitle-require"></span>';
        }

        html += '<span class="qtitle-index">' + (qesLen + 1) + '.</span>' +
            '<span class="qtitle-text">' + text + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="qinputs">' +
            '<textarea class="form-control qinputs-item"></textarea>' +
            '</div>';
        if (!ops.isPreview) {
            html += '<div class="controls">' +
                '<ul> ' +
                '<li class="control_btn edit">' +
                '<b title="编辑"><i class="iconfont">&#xe7aa;</i></b>' +
                '</li> ' +
                '<li class="control_btn copy">' +
                '<b title="复制"><i class="iconfont">&#xe7ad;</i></b>' +
                '</li> ' +
                '<li class="control_btn logic">' +
                '<b title="设置逻辑"><i class="iconfont">&#xe7ac;</i></b>' +
                '</li> ' +
                '<li class="control_btn delete">' +
                '<b title="删除"><i class="iconfont">&#xe7ab;</i></b>' +
                '</li> ' +
                '</ul> ' +
                '</div>';
        }

        html += '</div>';
        if (ops._this) {
            $(ops._this).closest(".que-wrapper").find(".que-container").append(html);
            $("#q-" + (qesLen + 1)).find(".control_btn.edit").trigger("click");
        } else {
            return html;
        }
    },
    addDescriptionQuestion: function (ops) {
        var isRequired, text, qid, iprefix, qprefix;
        if (ops && ops.data) {
            ops = ops.data;
            iprefix = "or_survey_item";
            qprefix = "or_question";
            qid = ops[iprefix + ":question_id"].id;
            isRequired = ops[iprefix + ":is_required"] ? ops[iprefix + ":is_required"] : 0;
            text = ops[qprefix + ":name"] ? ops[qprefix + ":name"] : "请输入题目";
        } else {
            isRequired = "";
            text = "说明文字内容";
        }
        var qesLen = $("#tab0-panel .que-container").find(".que-main").length;
        var isnew = ops.isNew === true ? "true" : "false";
        var html = '<div class="que-main que-control-description" id="q-' + (qesLen + 1) + '" data-isnew="' + isnew + '" data-qid="' + qid + '">' +
            ' <div class="que-control">' +
            ' <div class="qtitle">';
        html += ' <span class="qtitle-require"></span>';
        html += ' <span class="qtitle-index"></span>' +
            ' <span class="qtitle-text">' + text + '</span>' +
            '</div>' +
            '</div>';//+
        //' <div class="qinputs">'+
        //    '<p>这段是说明题</p>'+
        // '</div>';
        if (!ops.isPreview) {
            html += '<div class="controls">' +
                '<ul> ' +
                '<li class="control_btn edit">' +
                '<b title="编辑"><i class="iconfont">&#xe7aa;</i></b>' +
                '</li> ' +
                '<li class="control_btn copy">' +
                '<b title="复制"><i class="iconfont">&#xe7ad;</i></b>' +
                '</li> ' +
                '<li class="control_btn logic">' +
                '<b title="设置逻辑"><i class="iconfont">&#xe7ac;</i></b>' +
                '</li> ' +
                '<li class="control_btn delete">' +
                '<b title="删除"><i class="iconfont">&#xe7ab;</i></b>' +
                '</li> ' +
                '</ul> ' +
                '</div>';
        }

        html += '</div>';
        if (ops._this) {
            $(ops._this).closest(".que-wrapper").find(".que-container").append(html);
            $("#q-" + (qesLen + 1)).find(".control_btn.edit").trigger("click");
        } else {
            return html;
        }

    },
    preview: function (queType) {
        switch (queType) {
            case "radio":
                widget.addRadioQuestion({"isPreview": true, "_this": null});
                break;
            case "checkbox":
                widget.addCheckboxQuestion({"isPreview": true, "_this": null});
                break;
            case "select":
                widget.addSelectQuestion({"isPreview": true, "_this": null});
                break;
            case "input":
                widget.addInputQuestion({"isPreview": true, "_this": null});
                break;
            case "textarea":
                widget.addTextareaQuestion({"isPreview": true, "_this": null});
                break;
            case "description":
                widget.addDescriptionQuestion({"isPreview": true, "_this": null});
                break;
        }
    },
    //获取题型byclassName，（同一个标签上的）
    getQuestionTypeBy$dom: function ($dom) {
        var $queContainer = $dom;
        if ($queContainer.hasClass("que-control-radio")) {
            return "radio";
        } else if ($queContainer.hasClass("que-control-checkbox")) {
            return "checkbox";
        } else if ($queContainer.hasClass("que-control-select")) {
            return "select";
        } else if ($queContainer.hasClass("que-control-input")) {
            return "input";
        } else if ($queContainer.hasClass("que-control-textarea")) {
            return "textarea";
        } else if ($queContainer.hasClass("que-control-description")) {
            return "description";
        } else {
            return "";
        }
    },
    //逻辑设置页绑定事件
    bindLogicOptionAndQeuEvent: function () {
        widget._addEventListener({
            container: "body",
            target: ".logic-left-option",
            type: "click",
            event: function (event) {
                widget.selectedLogicOption(this);
            }
        })
        widget._addEventListener({
            container: "body",
            target: ".logic-right-option.enable",
            type: "click",
            event: function (event) {
                widget.selectedLogicQuestion(this);
            }
        })
        widget._addEventListener({
            container: "body",
            target: "#logicConfigModal .closebtn",
            type: "click",
            event: function (event) {
                //对临时问题的obj清空
                widget.DEFAULT.curLogicObj = {};
                $("#logicConfigModal").modal("hide");
            }
        })
        widget._addEventListener({
            container: "body",
            target: "#logicConfigModal .close",
            type: "click",
            event: function (event) {
                //对临时问题的obj清空
                widget.DEFAULT.curLogicObj = {};
                $("#logicConfigModal").modal("hide");
            }
        })
        widget._addEventListener({
            container: "body",
            target: "#logicConfigModal .comfirmBtn",
            type: "click",
            event: function (event) {
                widget.saveLogic(this);
            }
        })
    },
    //逻辑选择左侧选项
    selectedLogicOption: function (e) {
        $(e).closest(".logic-left-options").find(".logic-left-option").removeClass("active");
        $(e).addClass("active");
        $(e).closest("#logicConfigModal").find(".logic-right-option").removeClass("active");
        var $logicModal = $(e).closest("#logicConfigModal");
        var qid, choiceid;

        qid = $("#" + $logicModal.attr("data-target")).attr("data-qid");
        choiceid = $(e).attr("data-id");
        //编辑逻辑，且第一次进来(切换除外)
        if (!widget.DEFAULT.curLogicObj["" + choiceid] && $("#" + $logicModal.attr("data-target")).attr("isSetLogic") === "true") {
            //把全局变量赋值给临时变量
            widget.DEFAULT.curLogicObj = $.extend(true, {}, widget.DEFAULT.questionObj["" + qid]);
            ;
        }
        var rightOptions = $logicModal.find(".logic-right-option.enable");
        //之前设置过跳转
        if (widget.DEFAULT.curLogicObj["" + choiceid]) {
            $.each(widget.DEFAULT.curLogicObj["" + choiceid], function (i, val) {
                for (var j = 0; j < rightOptions.length; j++) {
                    if (i === $(rightOptions[j]).attr("data-id")) {
                        $(rightOptions[j]).addClass("active");
                    }
                }
            })
        }
    },
    //逻辑选择右侧题目
    selectedLogicQuestion: function (e) {
        var $logicModal = $(e).closest("#logicConfigModal");
        if ($("#" + $logicModal.attr("data-target")).attr("isSetLogic") === "true") {
            widget.buildOptionsLogicArr(e);
        } else {
            widget.buildOptionsLogicArr(e, true);
        }
    },
    //构建选项和跳转题目的数组
    buildOptionsLogicArr: function (event, isNew) {
        var parentQuestionId = $(event).closest("#logicConfigModal").attr("data-target");
        var qid = $("#" + parentQuestionId).attr("data-qid");
        var thisQuesId = $(event).attr("data-id");
        var thisChoicesId = $(event).closest("#logicConfigModal").find(".logic-left-option.active").attr("data-id");
        var choiceExist = false, toquestionExist = false;

        //检查切换的时候是否已经存在临时变量中
        if (widget.DEFAULT.curLogicObj["" + thisChoicesId]) {
            choiceExist = true;
            if (widget.DEFAULT.curLogicObj["" + thisChoicesId]["" + thisQuesId]) {
                toquestionExist = true;
            } else {//创建选项对应的跳转题id
                widget.DEFAULT.curLogicObj["" + thisChoicesId]["" + thisQuesId] = {logicId: null, status: "init"};
            }
        } else {//不存在需要创建
            widget.DEFAULT.curLogicObj["" + thisChoicesId] = {};
            widget.DEFAULT.curLogicObj["" + thisChoicesId]["" + thisQuesId] = {logicId: null, status: "init"};
        }

        //新增逻辑，考虑反选,考虑切换时回显--todo
        if (isNew) {
            //反选,临时变量中已经存在，需要delete
            if ($(event).hasClass("active")) {
                $(event).removeClass("active");
                delete widget.DEFAULT.curLogicObj["" + thisChoicesId]["" + thisQuesId];
            } else {//选择
                $(event).addClass("active");
            }
        } else {//编辑逻辑
            //反选,临时变量中已经存在，需要先push lodicid到临时变量中，然后再delete
            if ($(event).hasClass("active")) {
                $(event).removeClass("active");
                var obj = {};
                obj["" + thisQuesId] = {};
                obj["" + thisQuesId].logicId = widget.DEFAULT.curLogicObj["" + thisChoicesId]["" + thisQuesId].logicId;
                widget.DEFAULT.curDeleteLogicArr["" + thisChoicesId] = obj;
                //.push(widget.DEFAULT.curLogicObj[""+thisChoicesId][""+thisQuesId].logicId);
//				delete widget.DEFAULT.curLogicObj[""+thisChoicesId][""+thisQuesId];
                //widget.DEFAULT.curLogicObj[""+thisChoicesId][""+thisQuesId].status ="delete";
            } else {//选择
                $(event).addClass("active");
            }
        }

        /*
         * 新增逻辑时将临时的全局变量（编辑时可以赋值给临时变量）在点击保存的时候放到全局变量中；
         * 如果是编辑的话考虑是否反选，反选需要把logicid放到临时变量中，保存的时候进行删除；且需要清空临时变量，还需要把logicid放到相应的对象中（全局变量）
         * 新增的话反选需要从临时变量中剔除
         */

    },
    //当问题被设置为跳转题时，此问题要隐藏
    hideQuestionByItemId: function (id) {
        //put--item表的is_initial_hidden
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.itemAppletDetail,
            async: false,
        }).done(function (data) {
            iprefix = data.rootLink;
            if (data) {
                var iparamStr = "";
                var iparamData = {};
                iparamStr += '{';
                iparamStr += "\"" + iprefix + ":is_initial_hidden\":\"1\"";
                iparamStr += "}";
                iparamData["data"] = iparamStr;
                iparamData["async"] = false;
                iparamData["valueId"] = id;
                iparamData["appletId"] = widget.DEFAULT.itemAppletDetail;
                //新建问题
                Iptools.uidataTool._saveAppletData(iparamData).done(function (jsonObj) {
                    console.log("更新item:" + jsonObj);
                })
            }
        })
    },
    //此问题要显示
    showQuestionByItemId: function (id) {
        //put--item表的is_initial_hidden
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.itemAppletDetail,
            async: false,
        }).done(function (data) {
            iprefix = data.rootLink;
            if (data) {
                var iparamStr = "";
                var iparamData = {};
                iparamStr += '{';
                iparamStr += "\"" + iprefix + ":is_initial_hidden\":\"0\"";
                iparamStr += "}";
                iparamData["data"] = iparamStr;
                iparamData["async"] = false;
                iparamData["valueId"] = id;
                iparamData["appletId"] = widget.DEFAULT.itemAppletDetail;
                //新建问题
                Iptools.uidataTool._saveAppletData(iparamData).done(function (jsonObj) {
                    console.log("更新item:" + jsonObj);
                })
            }
        })
    },
    //保存逻辑
    saveLogic: function (e) {
        var $logicModal = $(e).closest("#logicConfigModal");
        var surveyid = $("#" + $logicModal.attr("data-target")).attr("data-surveyid"), qid;
        qid = $("#" + $logicModal.attr("data-target")).attr("data-qid");
        var chiceid, questionIdArr = [], chices = $logicModal.find(".logic-left-options li"), questions = $logicModal.find(".logic-right-quesitons li.enable");

        /*
         * 新增逻辑点击保存，依次post临时变量widget.DEFAULT.curLogicObj
         * 编辑逻辑点击保存，post临时变量widget.DEFAULT.curLogicObj中logicid为null的;delete widget.DEFAULT.curDeleteLogicArr数组
         */
        if (!$("#" + $logicModal.attr("data-target")).attr("isSetLogic")) {
            Iptools.uidataTool._getApplet({
                applet: widget.DEFAULT.logicAppletDetail,
                async: false,
            }).done(function (data) {
                $.each(widget.DEFAULT.curLogicObj, function (i, val) {
                    cprefix = data.rootLink;
                    var cid = i, tqid = "";
                    var cparamStr = "";
                    var cparamData = {};
                    //questionid 相对应的itemId
                    var itemId = "";
                    cparamStr += '{';
                    $.each(widget.DEFAULT.curLogicObj[i], function (j, val) {
                        tqid = j;
                        cparamStr += "\"" + cprefix + ":question_id\":\"" + j + "\",";
                        //questionid 相对应的itemId
                        itemId = $(".que-main[data-qid=" + j + "]").attr("data-surveyid");
                    })
                    if (tqid !== "") {
                        cparamStr += "\"" + cprefix + ":survey_id\":\"" + widget.DEFAULT.questionarieId + "\",";
                        cparamStr += "\"" + cprefix + ":choice_id\":\"" + i + "\"";
                        cparamStr += "}";
                        cparamData["data"] = cparamStr;
                        cparamData["async"] = false;
                        cparamData["appletId"] = widget.DEFAULT.logicAppletDetail;
                        Iptools.uidataTool._addAppletData(cparamData).done(function (cdata) {
                            //把logicid放到临时变量中，再把临时变量替换全局变量中相应的数据
                            widget.DEFAULT.curLogicObj["" + cid]["" + tqid].logicId = cdata.id;
                            //在相应问题上做标记
                            $("#" + $logicModal.attr("data-target")).attr("isSetLogic", true);

                        })
                        //隐藏本题
                        widget.hideQuestionByItemId(itemId);
                    }

                })
            })
            //，再把临时变量替换全局变量中相应的数据;对临时问题的obj清空
            widget.DEFAULT.questionObj["" + qid] = $.extend(true, {}, widget.DEFAULT.curLogicObj);
            widget.DEFAULT.curLogicObj = {};
        } else {
            Iptools.uidataTool._getApplet({
                applet: widget.DEFAULT.logicAppletDetail,
                async: false,
            }).done(function (data) {
                $.each(widget.DEFAULT.curLogicObj, function (i, val) {
                    cprefix = data.rootLink;
                    var cid = i, tqid = "";
                    var cparamStr = "";
                    var cparamData = {};
                    //questionid 相对应的itemId
                    var itemId = "";
                    cparamStr += '{';
                    $.each(widget.DEFAULT.curLogicObj[i], function (j, val) {
                        tqid = j;
                        cparamStr += "\"" + cprefix + ":question_id\":\"" + j + "\",";
                        //questionid 相对应的itemId
                        itemId = $(".que-main[data-qid=" + j + "]").attr("data-surveyid");
                    })
                    if (tqid !== "") {
                        cparamStr += "\"" + cprefix + ":survey_id\":\"" + widget.DEFAULT.questionarieId + "\",";
                        cparamStr += "\"" + cprefix + ":choice_id\":\"" + i + "\"";
                        cparamStr += "}";
                        cparamData["data"] = cparamStr;
                        cparamData["async"] = false;
                        cparamData["appletId"] = widget.DEFAULT.logicAppletDetail;
                        //删除的直接return
//						  if(widget.DEFAULT.curLogicObj[""+cid][""+tqid]){
//							  return false;
//						  }
                        //新增的post
                        if (widget.DEFAULT.curLogicObj["" + cid]["" + tqid]) {
                            if (widget.DEFAULT.curLogicObj["" + cid]["" + tqid].logicId == null) {
                                Iptools.uidataTool._addAppletData(cparamData).done(function (cdata) {
                                    //把logicid放到临时变量中，再把临时变量替换全局变量中相应的数据
                                    widget.DEFAULT.curLogicObj["" + cid]["" + tqid].logicId = cdata.id;
                                    //在相应问题上做标记
                                    $("#" + $logicModal.attr("data-target")).attr("isSetLogic", true);
                                })
                                //隐藏本题
                                widget.hideQuestionByItemId(itemId);
                            }
                        }
                    }
                })
                //delete
                if (widget.DEFAULT.curDeleteLogicArr) {
                    $.each(widget.DEFAULT.curDeleteLogicArr, function (i, val) {
                        if (i) {
                            $.each(widget.DEFAULT.curDeleteLogicArr[i], function (j, jval) {
                                var logicQid = j;
                                var logicQidItemid = $(".que-main[data-qid=" + logicQid + "]").attr("data-surveyid");
                                Iptools.uidataTool._deleteAppletData({
                                    para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget.DEFAULT.logicAppletDetail
                                    + "&valueIds=" + jval.logicId,
                                    async: false
                                }).done(function (data) {
                                    if (data.retcode == "ok") {
                                        //显示本题
                                        widget.showQuestionByItemId(logicQidItemid);
                                        console.log('删除逻辑成功');
                                        widget.DEFAULT.curLogicObj["" + i] = {};
                                    }

                                })
                            })
                        }
                    })

                }
            })
            //，再把临时变量替换全局变量中相应的数据;对临时问题的obj清空
            widget.DEFAULT.questionObj["" + qid] = $.extend(true, {}, widget.DEFAULT.curLogicObj);
            widget.DEFAULT.curLogicObj = {};
            widget.DEFAULT.curDeleteLogicArr = {};
        }

        $("#logicConfigModal").modal("hide");
    },
    editor: function () {
        $("#end_summernote").summernote({
            height: 250, //set editable area's height
            lang: 'zh-CN',
            callbacks: {
                onChange: function () {
                    var value = $(this).summernote("code");
//			            console.log(value);
                    $(".pre-edit").html($(this).summernote("code"));
                }
            },
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                //['fontsize', ['fontsize']],
                ['table', ['table']],
                ['insert', ['link', 'picture']],
                ['para', ['paragraph']]
            ]
        });
    },
    phonePreview: function () {
        $(".preview-area").html("");
        var titles = $(".qus-title").html();
        titles += $(".qus-prefix").html();
        var questions = $(".que-container");
        $(".preview-area").html("<div class='preview-warp'>" + titles + questions.html() + "</div>");
        $(".preview-area").find(".controls").remove();
        if (questions.find(".que-main").length < 5) {
            $(".preview-area").css("overflow-y", "hidden");
        } else {
            $(".preview-area").css("overflow-y", "scroll");
        }

    },
    wxPreviewEvent: function () {
        $("body").on("click", ".wx-preview-btn", function () {
            widget.wxPreview(this);
        })
    },
    saveQuestionEvent: function () {
        $("body").on("click", ".foot-btn-area .comfirm-btn", function () {
            widget.saveQuestionarie(this);
        })
    },
    //保存问卷
    saveQuestionarie: function (e) {
        var me = $(e);
        me.attr("data-loading-text", "<span class='icon-refresh icon-spin'></span> 保存中");
        me.css("pointer-events", "none");
        me.button("loading");
        var itemArr = {};
        itemArr.itemObj = widget.buildSurveyItems();
        //如果没有设置题-return
        if (itemArr.itemObj === "[]") {
            me.button("reset");
            me.css("pointer-events", "auto");
            var options = {
                "title": "提示",
                "content": "至少保存1个问题！"
            }
            parent.Iptools.Tool.Alert(options);
            return false;
        } else {
            //更新survey
            widget.putSurvey();
            //更新itemlist
            Iptools.PostJson({
                url: "basic/itemSequence?token=" + Iptools.DEFAULTS.token,
                data: itemArr
            }).done(function (r) {
                if (r.retcode == "ok") {
                    console.log("更新item-list成功");
                }
            }).fail(function (r) {
                console.log(r);
            });
            //如果时候编辑状态或者已经预览过
            if (widget.DEFAULT.campaignH5Id) {
                //put-campaign
                widget.putCampaign(e);
            } else {
                //post-campaign
                widget.postCampaign(e);
            }
            var options = {
                "title": "提示",
                "content": "保存成功！"
            }
            parent.Iptools.Tool.Alert(options);
            //跳转到详情页

            var viewobj = {
                async: false,
                "nameList": "\"survey_info_in_campaign\""
            }
            //详情页view
            var detailView;
            Iptools.uidataTool._getCustomizeView(viewobj).done(function (data) {
                detailView = data;
            });
            //如果是从详情页进来的不需要关闭之前的详情页
            if (Iptools.Tool._getVersion() == "v1") {
                //关闭当前
                Iptools.uidataTool._getView({
                    view: Iptools.DEFAULTS.currentView,
                    async: false
                }).done(function (data) {
                    Iptools.Tool._CloseTab({
                        view: Iptools.DEFAULTS.currentView,
                        type: data.view.type,
                    });
                    //跳详情
                    Iptools.uidataTool._getView({
                        view: detailView.views[0].view,
                        async: false
                    }).done(function (data) {
                        Iptools.Tool._jumpView({
                            view: detailView.views[0].view,
                            name: "详情" + ">" + $("#tab0-panel .title-content").html(),
                            type: data.view.type,
                            valueId: widget.DEFAULT.campaignId,//h5id
                            primary: data.view.primary,
                            icon: data.view.icon,
                            url: data.view.url,
                            bread: true,
                            refresh: true
                        });
                    })

                })
            } else if (Iptools.Tool._getVersion() == "v2") {
                Iptools.uidataTool._getView({
                    view: Iptools.DEFAULTS.currentView,
                    async: false
                }).done(function (data) {
                    var obj = {
                        view: Iptools.DEFAULTS.currentView,
                        type: data.view.type,
                        //valueId:Iptools.DEFAULTS.currentViewValue
                    }
                    if (Iptools.DEFAULTS.currentViewValue) {
                        obj["valueId"] = Iptools.DEFAULTS.currentViewValue;
                    }
                    Iptools.Tool._CloseTab(obj, function () {
                        Iptools.uidataTool._getView({
                            view: detailView.views[0].view,
                            async: false
                        }).done(function (data) {
                            Iptools.Tool._jumpView({
                                view: detailView.views[0].view,
                                name: data.view.name + ">" + $("#tab0-panel .title-content").html(),
                                type: data.view.type,
                                valueId: widget.DEFAULT.campaignId,//h5id
                                primary: data.view.primary,
                                icon: data.view.icon,
                                url: data.view.url,
                                bread: true,
                                refresh: true
                            });
                        })
                    }, null);
                })

            }

            setTimeout(function () {
                me.button("reset");
                me.css("pointer-events", "auto");
            }, 1000);
        }
    },
    //微信预览
    wxPreview: function (e) {
        var me = $(e);
        me.attr("data-loading-text", "<span class='icon-refresh icon-spin'></span> 保存中");
        me.css("pointer-events", "none");
        me.button("loading");
        var itemArr = {};
        itemArr.itemObj = widget.buildSurveyItems();
        //如果没有设置题-return
        if (itemArr.itemObj === "[]") {
            me.button("reset");
            me.css("pointer-events", "auto");
            var options = {
                "title": "提示",
                "content": "至少保存1个问题！"
            }
            parent.Iptools.Tool.Alert(options);
            return false;
        } else {
            //更新survey
            widget.putSurvey();
            //更新itemlist
            Iptools.PostJson({
                url: "basic/itemSequence?token=" + Iptools.DEFAULTS.token,
                data: itemArr
            }).done(function (r) {
                if (r.retcode == "ok") {
                    console.log("更新item-list成功");
                }
            }).fail(function (r) {
                console.log(r);
            });
            //如果时候编辑状态或者已经预览过
            if (widget.DEFAULT.campaignH5Id) {
                //put-campaign
                widget.putCampaign(e);
            } else {
                //post-campaign
                widget.postCampaign(e);
            }

            //获取预览地址
            Iptools.uidataTool._getUserDetailAppletData({
                "appletId": widget.DEFAULT.campaignH5AppletDetail,
                "valueId": widget.DEFAULT.campaignH5Id
            }).done(function (data) {
                if (data) {
                    var prefix = data.rootLink;
                    var url = data.data[prefix + ":view_address"];
                    //二维码
                    $("#wxPreviewModal").modal("show");
                    $(".wxqrcode").html("");
                    $(".wxqrcode").qrcode({
                        render: "canvas", //table方式
                        width: 165, //宽度
                        height: 165, //高度
                        text: url ? url : "" //任意内容
                    });
                }
            })

            me.button("reset");
            me.css("pointer-events", "auto");
        }

    },
    //构建items-json
    buildSurveyItems: function () {
        var itemArr = [];
        var paramStr = "";
        paramStr += "[";
        var questions = $("#tab0-panel .que-main");
        for (var i = 0; i < questions.length; i++) {
            if ($(questions[i]).css("display") === "block") {
                paramStr += '{';
                paramStr += "\"sequence\":\"" + ($(questions[i]).find(".qtitle-index").html()).split(".")[0] + "\",";
                paramStr += "\"survey_item_id\":\"" + $(questions[i]).attr("data-surveyid") + "\"";
                paramStr += "}";
            }
        }
        paramStr += "]";
        return paramStr;
    },
    //更新survey
    putSurvey: function () {
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.surveyAppletDetail,
            async: false,
        }).done(function (data) {
            qprefix = data.rootLink;
            var paramStr = "";
            var paramData = {};
            paramStr += '{';
//			  //paramStr += "\""+qprefix+":sub_type\":\""++"\",";
            paramStr += "\"" + qprefix + ":name\":\"" + $(".contactInfoTab .title-content").html() + "\",";
            paramStr += "\"" + qprefix + ":description\":\"" + $(".contactInfoTab .prefix-content").html() + "\"";
            paramStr += "}";
            paramData["data"] = paramStr;
            //paramData["async"] = false;
            paramData["appletId"] = widget.DEFAULT.surveyAppletDetail;
            paramData["valueId"] = widget.DEFAULT.questionarieId;
            //新建问题
            Iptools.uidataTool._saveAppletData(paramData).done(function (json) {
                console.log("更新survey成功");
            })
        })
    },

    postCampaign: function (e) {
        var me = $(e);
        var op = {async: false, "nameList": '\"Campaign Detail Applet\"'};
        var campaignApplet, prefix;
        Iptools.uidataTool._getCustomizeApplet(op).done(function (data) {
            campaignApplet = data.applets[0].applet;//3b3d5406-ee96-11e6-bf5f-00163e0052f2
        })
        var paramStr = "";
        var paramData = {
            "appletId": campaignApplet
        }
        //获取前缀。。
        Iptools.uidataTool._getApplet({
            applet: campaignApplet,
            async: false,
        }).done(function (data) {
            prefix = data.rootLink;

            paramStr += '{';
            paramStr += "\"" + prefix + ":title\":\"" + $(".tab-content .title-content").html() + "\",";

            if (!widget.DEFAULT.campaignH5Id) {
                paramStr += "\"" + prefix + ":campaign_scene_id\":\"" + getThisTabVars("campaign_scene_id") + "\",";
            }
            paramStr += "\"" + prefix + ":status\":\"1\"";
            paramStr += "}";
            paramData["data"] = paramStr;
            paramData["async"] = false;
            paramData["appletId"] = campaignApplet;
            // createOrNewH5();
            //新建活动
            Iptools.uidataTool._addAppletData(paramData).done(function (data) {
                if (data.retcode == "ok") {
                    widget.DEFAULT.campaignId = data.id;
                    setThisTabVars("campaignValueId", data.id);
                    widget.postCampaignH5();
                }
            }).fail(function () {
                setTimeout(function () {
                    me.button("reset");
                    me.css("pointer-events", "auto");
                }, 1000);
            })
        })
    },
    //postCampaignH5
    postCampaignH5: function () {
        var prefix = "";
        //获取前缀。。
        Iptools.uidataTool._getApplet({
            "applet": widget.DEFAULT.campaignH5AppletDetail,
            async: false
        }).done(function (data) {
            var paramData = {};
            prefix = data.rootLink;
            var paramStr = "";
            paramStr += "{";
            //用户提交表单
            if ($("#cb3").prop("checked")) {
                var radios = $("input[name=optionsRadios]");
                var formappletId;
                for (var i = 0; i < radios.length; i++) {
                    if ($(radios[i]).prop("checked")) {
                        formappletId = $(radios[i]).attr("id");
                    }
                }
                ;
                paramStr += "\"" + prefix + ":form_applet\":\"" + formappletId + "\",";
            }
            var bgImgUrl = "";
            //背景图片
            if (widget.DEFAULT.bgImgObj) {
                bgImgUrl = widget.getCanvasImgUrl(widget.DEFAULT.bgImgObj);
            }

            //结束时间
            if ($("#cb1").prop("checked")) {
                paramStr += "\"" + prefix + ":end_time\":\"" + $(".endTime").val() + "\",";
            }
            //结束页
            var richText = $("#end_summernote").summernote('code');
            if (richText !== "") {
                paramStr += "\"" + prefix + ":rich_text\":\'" + $("#end_summernote").summernote('code') + "\',";
            }
            //构建提交参数--基本信息
            paramStr += "\"" + prefix + ":back_img\":\"" + bgImgUrl + "\",";
            paramStr += "\"" + prefix + ":campaign_id\":\"" + widget.DEFAULT.campaignId + "\",";
            paramStr += "\"" + prefix + ":survey_id\":\"" + widget.DEFAULT.questionarieId + "\",";
            paramStr += "\"" + prefix + ":campaign_template_id\":\"" + widget.DEFAULT.campaign_template_id + "\",";
            paramStr += "\"" + prefix + ":title\":\"" + $(".tab-content .title-content").html() + "\",";
            paramStr += "\"" + prefix + ":sub_title\":\"" + $(".tab-content .prefix-content").html() + "\"";
            paramStr += "}";
            paramData["data"] = paramStr;
            paramData["async"] = false;
            paramData["appletId"] = widget.DEFAULT.campaignH5AppletDetail;
            //ajax提交
            Iptools.uidataTool._addAppletData(paramData).done(function (json) {
                if (json) {
                    widget.DEFAULT.campaignH5Id = json.id;
                    setThisTabVars("H5ValueId", json.id);
                }
                console.log(json);
            })
        })
    },
    putCampaign: function (e) {
        var me = $(e);
        var op = {async: false, "nameList": '\"Campaign Detail Applet\"'};
        var campaignApplet, prefix;
        Iptools.uidataTool._getCustomizeApplet(op).done(function (data) {
            campaignApplet = data.applets[0].applet;
        })
        var paramStr = "";
        var paramData = {
            "appletId": campaignApplet
        }
        //获取前缀。。
        Iptools.uidataTool._getApplet({
            applet: campaignApplet,
            async: false,
        }).done(function (data) {
            prefix = data.rootLink;

            paramStr += '{';
            paramStr += "\"" + prefix + ":title\":\"" + $(".tab-content .title-content").html() + "\",";
            if (!widget.DEFAULT.campaignH5Id) {
                paramStr += "\"" + prefix + ":campaign_scene_id\":\"" + getThisTabVars("campaign_scene_id") + "\",";
            }
            paramStr += "\"" + prefix + ":status\":\"1\"";
            paramStr += "}";
            paramData["data"] = paramStr;
            paramData["async"] = false;
            paramData["valueId"] = getThisTabVars("campaignValueId");
            paramData["appletId"] = campaignApplet;
            // createOrNewH5();
            //新建活动
            Iptools.uidataTool._saveAppletData(paramData).done(function (data) {
                if (data.retcode == "ok") {
                    // widget.DEFAULT.campaignId = data.id;
                    //setThisTabVars("campaignValueId",data.id);
                    widget.putCampaignH5();
                }
            }).fail(function () {
                setTimeout(function () {
                    me.button("reset");
                    me.css("pointer-events", "auto");
                }, 1000);
            })
        })
    },
    //putCampaignH5
    putCampaignH5: function () {
        var prefix = "";
        //获取前缀。。
        Iptools.uidataTool._getApplet({
            "applet": widget.DEFAULT.campaignH5AppletDetail,
            async: false
        }).done(function (data) {
            var paramData = {};
            prefix = data.rootLink;
            var paramStr = "";
            paramStr += "{";
            var bgImgUrl = "";
            //背景图片
            if (widget.DEFAULT.bgImgObj) {
                bgImgUrl = widget.getCanvasImgUrl(widget.DEFAULT.bgImgObj);
            } else {
                bgImgUrl = "http://enterpriseserver.intopalm.com/upload/12816/jpg/1492753509786.jpg";
            }
            //用户提交表单
            if ($("#cb3").prop("checked")) {
                var radios = $("input[name=optionsRadios]");
                var formappletId;
                for (var i = 0; i < radios.length; i++) {
                    if ($(radios[i]).prop("checked")) {
                        formappletId = $(radios[i]).attr("id");
                    }
                }
                ;
                paramStr += "\"" + prefix + ":form_applet\":\"" + formappletId + "\",";
            }
            //结束时间
            if ($("#cb1").prop("checked")) {
                paramStr += "\"" + prefix + ":end_time\":\"" + $(".endTime").val() + "\",";
            }
            //结束页
            var richText = $("#end_summernote").summernote('code');
            if (richText !== "") {
                paramStr += "\"" + prefix + ":rich_text\":\'" + $("#end_summernote").summernote('code') + "\',";
            }
            //构建提交参数--基本信息
            paramStr += "\"" + prefix + ":back_img\":\"" + bgImgUrl + "\",";
            paramStr += "\"" + prefix + ":campaign_id\":\"" + widget.DEFAULT.campaignId + "\",";
            paramStr += "\"" + prefix + ":survey_id\":\"" + widget.DEFAULT.questionarieId + "\",";
            paramStr += "\"" + prefix + ":campaign_template_id\":\"" + widget.DEFAULT.campaign_template_id + "\",";
            paramStr += "\"" + prefix + ":title\":\"" + $(".tab-content .title-content").html() + "\",";
            paramStr += "\"" + prefix + ":sub_title\":\"" + $(".tab-content .prefix-content").html() + "\"";
            paramStr += "}";
            paramData["data"] = paramStr;
            paramData["valueId"] = getThisTabVars("H5ValueId");
            paramData["async"] = false;
            paramData["appletId"] = widget.DEFAULT.campaignH5AppletDetail;
            //ajax提交
            Iptools.uidataTool._saveAppletData(paramData).done(function (json) {
                if (json) {
                    //widget.DEFAULT.campaignH5Id = json.id;
                    //setThisTabVars("H5ValueId",json.id);
                }
                console.log(json);
            })
        })
    },
    getisInitialHiddenByQuestion: function (qid) {
        var initHidden = 0;
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.itemAppletList,
            async: false,
        }).done(function (data) {
            var prefix = data.rootLink;
            var condition = '{"' + prefix + ':question_id":"=' + qid + '"}';
            Iptools.uidataTool._getUserlistAppletData({
                "appletId": widget.DEFAULT.itemAppletList,
                "condition": condition,
                "async": false
            }).done(function (json) {
                if (json.data) {
                    if (json.data.records) {
                        initHidden = json.data.records[0][prefix + ":is_initial_hidden"];
                    }
                }
            })
        })
        return initHidden;
    },
    //复制问题
    copyAddQuestion: function (e) {
        var pqid, qid, surveyId, $parentQue, qtext, queType, qindex, isrequried = 0;
        var $e = $(e);
        $parentQue = $(e).closest(".que-main");
        pqid = $parentQue.attr("data-qid");
        qtext = $parentQue.find(".qtitle-text").html();
        qindex = parseInt($parentQue.find(".qtitle-index").html().split(".")[0]) + 1;
        queType = widget.getQuestionTypeBy$dom($parentQue);

        if ($parentQue.find(".qtitle-require").html() === "*") {
            isrequried = 1;
        }

        if (queType == "radio" || queType == "checkbox" || queType == "select") {
            if (queType == "radio" || queType == "checkbox") {
                choices = $parentQue.find(".qinputs .qinputs-item");
            } else {
                choices = $parentQue.find(".qinputs .qinputs-item option");
            }

        } else {
            choices = [];
        }
        //post-question相关
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.questionAppletDetail,
            async: false,
        }).done(function (data) {
            qprefix = data.rootLink;
        }).done(function (data) {
            if (data) {
                $parentQue.next().attr("data-isnew", false);
                var paramStr = "";
                var paramData = {};
                paramStr += '{';
                //paramStr += "\""+qprefix+":sub_type\":\""++"\",";
                paramStr += "\"" + qprefix + ":name\":\"" + qtext + "\",";
                paramStr += "\"" + qprefix + ":type\":\"" + queType + "\"";
                paramStr += "}";
                paramData["data"] = paramStr;
                paramData["async"] = false;
                paramData["appletId"] = widget.DEFAULT.questionAppletDetail;
                //新建问题
                Iptools.uidataTool._addAppletData(paramData).done(function (json) {
                    qid = json.id;
                    widget.DEFAULT.questionObj["" + qid] = {};
                    $parentQue.next().attr("data-qId", qid);
                    //回显题目
                    $parentQue.next().find(".qtitle-text").html(qtext);
                    if (isrequried) {
                        $parentQue.next().find(".qtitle-require").html("*");
                    }
                    var initHidden = widget.getisInitialHiddenByQuestion(pqid);
                    if (initHidden) {
                        initHidden = 1;
                    } else {
                        initHidden = 0;
                    }
                    //post--item表
                    Iptools.uidataTool._getApplet({
                        applet: widget.DEFAULT.itemAppletDetail,
                        async: false,
                    }).done(function (data) {
                        iprefix = data.rootLink;
                        if (data) {
                            var iparamStr = "";
                            var iparamData = {};
                            iparamStr += '{';
                            //paramStr += "\""+qprefix+":sub_type\":\""++"\",";
                            iparamStr += "\"" + iprefix + ":question_id\":\"" + qid + "\",";
//							  iparamStr += "\""+iprefix+":":\""+qtext+"\",";
//							  iparamStr += "\""+iprefix+":name\":\""+qtext+"\",";
                            iparamStr += "\"" + iprefix + ":sequence\":\"" + qindex + "\",";
                            iparamStr += "\"" + iprefix + ":is_initial_hidden\":\"" + initHidden + "\",";
                            iparamStr += "\"" + iprefix + ":survey_id\":\"" + widget.DEFAULT.questionarieId + "\",";
                            iparamStr += "\"" + iprefix + ":is_required\":\"" + isrequried + "\"";
                            iparamStr += "}";
                            iparamData["data"] = iparamStr;
                            iparamData["async"] = false;
                            iparamData["appletId"] = widget.DEFAULT.itemAppletDetail;
                            //新建问题
                            Iptools.uidataTool._addAppletData(iparamData).done(function (jsonObj) {
                                surveyId = jsonObj.id;
                                $parentQue.next().attr("data-surveyId", surveyId);
                                console.log("新建item:" + jsonObj);
                            })
                        }
                    })
                    //没有选项的不post
                    if (queType == "radio" || queType == "checkbox" || queType == "select") {
                        //新建问题相对应的选项
                        Iptools.uidataTool._getApplet({
                            applet: widget.DEFAULT.choiceAppletDetail,
                            async: false,
                        }).done(function (data) {
                            cprefix = data.rootLink;
                            var selectHtml = '';//'<option class="defaultVal" value="-1">--请选择--</option> ';
                            var radioHtml = '';
                            for (var i = 0; i < choices.length; i++) {
                                var cparamStr = "";
                                var cparamData = {};
                                cparamStr += '{';
                                cparamStr += "\"" + cprefix + ":question_id\":\"" + qid + "\",";
                                if (queType == "radio" || queType == "checkbox") {
                                    cparamStr += "\"" + cprefix + ":text\":\"" + $(choices[i]).find("label").html() + "\",";
                                } else {
                                    cparamStr += "\"" + cprefix + ":text\":\"" + $(choices[i]).html() + "\",";
                                }

                                cparamStr += "\"" + cprefix + ":sequence\":\"" + i + "\"";
                                cparamStr += "}";
                                cparamData["data"] = cparamStr;
                                cparamData["async"] = false;
                                cparamData["appletId"] = widget.DEFAULT.choiceAppletDetail;
                                Iptools.uidataTool._addAppletData(cparamData).done(function (cdata) {
                                    //构建全局问卷相关对象
//									  var obj = {};
//									  obj[""+cdata.id] = {};
                                    widget.DEFAULT.questionObj["" + qid]["" + cdata.id] = {};

                                    $parentQue.next().find(".qtitle-text").html();
                                    if (queType == "radio") {
                                        radioHtml += '<div class="qinputs-item" cid="' + cdata.id + '"><input type="radio"><label>' + $(choices[i]).find("label").html() + '</label></div>';
                                    } else if (queType == "checkbox") {
                                        radioHtml += '<div class="qinputs-item" cid="' + cdata.id + '"><input type="checkbox"><label>' + $(choices[i]).find("label").html() + '</label></div>';
                                    } else {
                                        selectHtml += '<option id="' + cdata.id + '" value="' + cdata.id + '" class="">' + $(choices[i]).html() + ' </option>';
                                    }
                                }).fail(function (dataObj) {
                                    console.log(dataObj);
                                })
                            }

                            if (queType == "radio" || queType == "checkbox") {
                                $parentQue.next().find(".qinputs").html(radioHtml);
                            } else if (queType == "select") {
                                $parentQue.next().find(".qinputs .qinputs-item").html(selectHtml);
                            }
                        })
                    }
                })
            }
        })
        widget.DEFAULT.curLogicObj = $.extend({}, widget.DEFAULT.questionObj["" + pqid]);
        //post--逻辑相关
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.logicAppletDetail,
            async: false,
        }).done(function (data) {
            $.each(widget.DEFAULT.curLogicObj, function (i, val) {
                cprefix = data.rootLink;
                var cid = i, tqid = "";
                var cparamStr = "";
                var cparamData = {};
                //questionid 相对应的itemId
                var itemId = "";
                cparamStr += '{';
                $.each(widget.DEFAULT.curLogicObj[i], function (j, val) {
                    tqid = j;
                    cparamStr += "\"" + cprefix + ":question_id\":\"" + j + "\",";
                    //questionid 相对应的itemId
                    itemId = $(".que-main[data-qid=" + j + "]").attr("data-surveyid");
                })
                if (tqid !== "") {
                    cparamStr += "\"" + cprefix + ":survey_id\":\"" + widget.DEFAULT.questionarieId + "\",";
                    cparamStr += "\"" + cprefix + ":choice_id\":\"" + i + "\"";
                    cparamStr += "}";
                    cparamData["data"] = cparamStr;
                    cparamData["async"] = false;
                    cparamData["appletId"] = widget.DEFAULT.logicAppletDetail;
                    Iptools.uidataTool._addAppletData(cparamData).done(function (cdata) {
                        //把logicid放到临时变量中，再把临时变量替换全局变量中相应的数据
                        widget.DEFAULT.curLogicObj["" + cid]["" + tqid].logicId = cdata.id;
                        //在相应问题上做标记
                        $("#" + $parentQue.next().attr("data-target")).attr("isSetLogic", true);

                    })
                    //隐藏本题
                    widget.hideQuestionByItemId(itemId);
                }

            })
        })
        //，再把临时变量替换全局变量中相应的数据;对临时问题的obj清空
        widget.DEFAULT.questionObj["" + qid] = $.extend(true, {}, widget.DEFAULT.curLogicObj);
        widget.DEFAULT.curLogicObj = {};
    },
    addQuestion: function (e) {
        var qid, surveyId;
        var $e = $(e);
        var $targetQue = $e.closest(".que-main-edit");
        var qtext, isrequried = false, choices;

        isrequried = $e.closest(".que-main-edit").find("input[name=qe_required]").prop("checked") ? 1 : 0;
        var queType = widget.getQuestionTypeBy$dom($targetQue.prev());

        qtext = $e.closest(".que-main-edit").find(".qetitle-content .form-control").val();
        if (qtext.length === 0) {
            $e.closest(".que-main-edit").find(".qetitle-content .form-control").addClass("error");
            return false;
        }
        if (queType == "radio" || queType == "checkbox" || queType == "select") {
            choices = $e.closest(".que-main-edit").find(".qeinputs .qeinputs-item");
            //判断是否有选项
            if (choices.length === 0) {
                Iptools.Tool.pAlert({
                    type: "danger",
                    title: "系统提示：",
                    content: "请设置问题的选项",
                    delay: 1000
                });
                return false;
            } else {
                var result = 0;
                choices.each(function (index, item) {
                    if ($(item).find("input").val().length === 0) {
                        $(item).find("input").addClass("error");
                        result++;
                        return false;
                    }
                })
            }
            if (result !== 0) {
                return false;
            }
        } else {
            choices = [];
        }


        var qprefix = "", cprefix = "", iprefix = "";

        //如果是新建状态
        if ($targetQue.prev().attr("data-isnew") === "true") {
            Iptools.uidataTool._getApplet({
                applet: widget.DEFAULT.questionAppletDetail,
                async: false,
            }).done(function (data) {
                qprefix = data.rootLink;
            }).done(function (data) {
                if (data) {
                    $targetQue.prev().attr("data-isnew", false);
                    var paramStr = "";
                    var paramData = {};
                    paramStr += '{';
                    //paramStr += "\""+qprefix+":sub_type\":\""++"\",";
                    paramStr += "\"" + qprefix + ":name\":\"" + qtext + "\",";
                    paramStr += "\"" + qprefix + ":type\":\"" + queType + "\"";
                    paramStr += "}";
                    paramData["data"] = paramStr;
                    paramData["async"] = false;
                    paramData["appletId"] = widget.DEFAULT.questionAppletDetail;
                    //新建问题
                    Iptools.uidataTool._addAppletData(paramData).done(function (json) {
                        qid = json.id;
                        widget.DEFAULT.questionObj["" + qid] = {};
                        $targetQue.prev().attr("data-qId", qid);
                        //回显题目
                        $targetQue.prev().find(".qtitle-text").html(qtext);
                        if (isrequried) {
                            $targetQue.prev().find(".qtitle-require").html("*");
                        }
                        //post--item表
                        Iptools.uidataTool._getApplet({
                            applet: widget.DEFAULT.itemAppletDetail,
                            async: false,
                        }).done(function (data) {
                            iprefix = data.rootLink;
                            if (data) {
                                var iparamStr = "";
                                var iparamData = {};
                                iparamStr += '{';
                                //paramStr += "\""+qprefix+":sub_type\":\""++"\",";
                                iparamStr += "\"" + iprefix + ":question_id\":\"" + qid + "\",";
//								  iparamStr += "\""+iprefix+":":\""+qtext+"\",";
//								  iparamStr += "\""+iprefix+":name\":\""+qtext+"\",";
                                iparamStr += "\"" + iprefix + ":sequence\":\"" + $targetQue.prev().attr("id").split("-")[1] + "\",";
                                iparamStr += "\"" + iprefix + ":is_initial_hidden\":\"0\",";
                                iparamStr += "\"" + iprefix + ":survey_id\":\"" + widget.DEFAULT.questionarieId + "\",";
                                iparamStr += "\"" + iprefix + ":is_required\":\"" + isrequried + "\"";
                                iparamStr += "}";
                                iparamData["data"] = iparamStr;
                                iparamData["async"] = false;
                                iparamData["appletId"] = widget.DEFAULT.itemAppletDetail;
                                //新建问题
                                Iptools.uidataTool._addAppletData(iparamData).done(function (jsonObj) {
                                    surveyId = jsonObj.id;
                                    $targetQue.prev().attr("data-surveyId", surveyId);
                                    console.log("新建item:" + jsonObj);
                                })
                            }
                        })
                        //没有选项的不post
                        if (queType == "radio" || queType == "checkbox" || queType == "select") {
                            //新建问题相对应的选项
                            Iptools.uidataTool._getApplet({
                                applet: widget.DEFAULT.choiceAppletDetail,
                                async: false,
                            }).done(function (data) {
                                cprefix = data.rootLink;
                                var selectHtml = '<option class="defaultVal" value="-1">--请选择--</option> ';
                                var radioHtml = '';
                                for (var i = 0; i < choices.length; i++) {
                                    var cparamStr = "";
                                    var cparamData = {};
                                    cparamStr += '{';
                                    cparamStr += "\"" + cprefix + ":question_id\":\"" + qid + "\",";
                                    cparamStr += "\"" + cprefix + ":text\":\"" + $(choices[i]).find(".form-control").val() + "\",";
                                    cparamStr += "\"" + cprefix + ":sequence\":\"" + i + "\"";
                                    cparamStr += "}";
                                    cparamData["data"] = cparamStr;
                                    cparamData["async"] = false;
                                    cparamData["appletId"] = widget.DEFAULT.choiceAppletDetail;
                                    Iptools.uidataTool._addAppletData(cparamData).done(function (cdata) {
                                        //构建全局问卷相关对象
//										  var obj = {};
//										  obj[""+cdata.id] = {};
                                        widget.DEFAULT.questionObj["" + qid]["" + cdata.id] = {};

                                        $targetQue.prev().find(".qtitle-text").html();
                                        if (queType == "radio") {
                                            radioHtml += '<div class="qinputs-item" cid="' + cdata.id + '"><input type="radio"><label>' + $(choices[i]).find(".form-control").val() + '</label></div>';
                                        } else if (queType == "checkbox") {
                                            radioHtml += '<div class="qinputs-item" cid="' + cdata.id + '"><input type="checkbox"><label>' + $(choices[i]).find(".form-control").val() + '</label></div>';
                                        } else {
                                            selectHtml += '<option id="' + cdata.id + '" value="' + cdata.id + '" class="">' + $(choices[i]).find(".form-control").val() + ' </option>';
                                        }
                                    }).fail(function (dataObj) {
                                        console.log(dataObj);
                                    })
                                }

                                if (queType == "radio" || queType == "checkbox") {
                                    $targetQue.prev().find(".qinputs").html(radioHtml);
                                } else if (queType == "select") {
                                    $targetQue.prev().find(".qinputs .qinputs-item").html(selectHtml);
                                }
                            })
                        }
                    })
                }
            })
        } else {
            qid = $targetQue.prev().attr("data-qid");
            surveyId = $targetQue.prev().attr("data-surveyid");
            Iptools.uidataTool._getApplet({
                applet: widget.DEFAULT.questionAppletDetail,
                async: false,
            }).done(function (data) {
                qprefix = data.rootLink;
            }).done(function (data) {
                if (data) {
                    var paramStr = "";
                    var paramData = {};
                    paramStr += '{';
                    //paramStr += "\""+qprefix+":sub_type\":\""++"\",";
                    paramStr += "\"" + qprefix + ":name\":\"" + qtext + "\",";
                    paramStr += "\"" + qprefix + ":type\":\"" + queType + "\"";
                    paramStr += "}";
                    paramData["data"] = paramStr;
                    paramData["valueId"] = qid;
                    paramData["async"] = false;
                    paramData["appletId"] = widget.DEFAULT.questionAppletDetail;
                    //更新问题
                    Iptools.uidataTool._saveAppletData(paramData).done(function (json) {
                        $targetQue.prev().find(".qtitle-text").html(qtext);
                        if (isrequried) {
                            $targetQue.prev().find(".qtitle-require").html("*");
                        }
                        //post--item表
                        Iptools.uidataTool._getApplet({
                            applet: widget.DEFAULT.itemAppletDetail,
                            async: false,
                        }).done(function (data) {
                            iprefix = data.rootLink;
                            if (data) {
                                var iparamStr = "";
                                var iparamData = {};
                                iparamStr += '{';
                                iparamStr += "\"" + iprefix + ":question_id\":\"" + qid + "\",";
                                iparamStr += "\"" + iprefix + ":sequence\":\"" + $targetQue.prev().attr("id").split("-")[1] + "\",";
                                //iparamStr += "\""+iprefix+":is_initial_hidden\":\"0\",";
                                iparamStr += "\"" + iprefix + ":is_required\":\"" + isrequried + "\"";
                                iparamStr += "}";
                                iparamData["data"] = iparamStr;
                                iparamData["async"] = false;
                                iparamData["valueId"] = surveyId;
                                iparamData["appletId"] = widget.DEFAULT.itemAppletDetail;
                                //新建问题
                                Iptools.uidataTool._saveAppletData(iparamData).done(function (jsonObj) {
                                    console.log("更新item:" + jsonObj);
                                })
                            }
                        })
                        //更新,新增，删除问题相对应的选项
                        Iptools.uidataTool._getApplet({
                            applet: widget.DEFAULT.choiceAppletDetail,
                            async: false,
                        }).done(function (data) {
                            cprefix = data.rootLink;
                            var selectHtml = '<option class="defaultVal" value="-1">--请选择--</option> ';
                            var radioHtml = '';
                            //此时的choices为更改后的choices
                            var choices = $e.closest(".que-main-edit").find(".qeinputs .qeinputs-item");
                            for (var i = 0; i < choices.length; i++) {
                                var cparamStr = "";
                                var cparamData = {};
                                cparamStr += '{';
                                cparamStr += "\"" + cprefix + ":question_id\":\"" + qid + "\",";
                                cparamStr += "\"" + cprefix + ":text\":\"" + $(choices[i]).find(".form-control").val() + "\",";
                                cparamStr += "\"" + cprefix + ":sequence\":\"" + i + "\"";
                                cparamStr += "}";
                                cparamData["data"] = cparamStr;
                                cparamData["async"] = false;
                                cparamData["appletId"] = widget.DEFAULT.choiceAppletDetail;
                                //存在即更新
                                if (Iptools.Tool._checkNull($(choices[i]).attr("cid"))) {
                                    cparamData["valueId"] = $(choices[i]).attr("cid");
                                    Iptools.uidataTool._saveAppletData(cparamData).done(function (cdata) {
                                        $targetQue.prev().find(".qtitle-text").html();
                                        if (queType == "radio") {
                                            radioHtml += '<div class="qinputs-item" cid="' + $(choices[i]).attr("cid") + '"><input type="radio"><label>' + $(choices[i]).find(".form-control").val() + '</label></div>';
                                        } else if (queType == "checkbox") {
                                            radioHtml += '<div class="qinputs-item" cid="' + $(choices[i]).attr("cid") + '"><input type="checkbox"><label>' + $(choices[i]).find(".form-control").val() + '</label></div>';
                                        } else {
                                            selectHtml += '<option id="" value="' + $(choices[i]).attr("cid") + '" class="">' + $(choices[i]).find(".form-control").val() + ' </option>';
                                        }
                                    }).fail(function (dataObj) {
                                        console.log(dataObj);
                                    })
                                } else {
                                    Iptools.uidataTool._addAppletData(cparamData).done(function (cdata) {
                                        $targetQue.prev().find(".qtitle-text").html();
                                        //增加新增的选项向全局变量中
                                        widget.DEFAULT.questionObj["" + qid]["" + cdata.id] = {};
                                        if (queType == "radio") {
                                            radioHtml += '<div class="qinputs-item" id="' + cdata.id + '"><input type="radio"><label>' + $(choices[i]).find(".form-control").val() + '</label></div>';
                                        } else if (queType == "checkbox") {
                                            radioHtml += '<div class="qinputs-item" cid="' + cdata.id + '"><input type="checkbox"><label>' + $(choices[i]).find(".form-control").val() + '</label></div>';
                                        } else {
                                            selectHtml += '<option id="" value="' + cdata.id + '" class="">' + $(choices[i]).find(".form-control").val() + ' </option>';
                                        }
                                    }).fail(function (dataObj) {
                                        console.log(dataObj);
                                    })
                                }


                            }
                            //删除的选项
                            if (widget.DEFAULT.curChoiceArr.length > 0) {
                                Iptools.uidataTool._deleteAppletData({
                                    para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget.DEFAULT.choiceAppletDetail
                                    + "&valueIds=" + widget.DEFAULT.curChoiceArr.join(","),
                                }).done(function (data) {
                                    if (data.retcode == "ok") {
                                        console.log('删除成功');
                                        //删除全据变量中被删除的选项
                                        for (var i = 0; i < widget.DEFAULT.curChoiceArr.length; i++) {
                                            delete widget.DEFAULT.questionObj["" + qid]["" + widget.DEFAULT.curChoiceArr[i]];
                                        }
                                        //清空临时变量
                                        widget.DEFAULT.curChoiceArr.length = 0;
                                    }

                                })
                            }
                            if (queType == "radio" || queType == "checkbox") {
                                $targetQue.prev().find(".qinputs").html(radioHtml);
                            } else if (queType == "select") {
                                $targetQue.prev().find(".qinputs .qinputs-item").html(selectHtml);
                            }

                        })
                    })
                }
            })
        }

        $e.closest(".que-main-edit").removeClass("shake").hide();
        $targetQue.prev().show();
        //是否必填
        if (!isrequried) {
            $targetQue.prev().find(".qtitle-require").html("");
        }
    },

    getItemIdByquestionId: function (qid) {
        var itemid = null;
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.itemAppletList,
            async: false,
        }).done(function (data) {
            var prefix = data.rootLink;
            var condition = '{"' + prefix + ':question_id":"=' + qid + '"}';
            Iptools.uidataTool._getUserlistAppletData({
                async: false,
                appletId: widget.DEFAULT.itemAppletList,
                condition: condition
            }).done(function (json) {
                if (json.data) {
                    var obj = json.data.records;
                    itemid = obj[0][prefix + ":id"];
                }
            })
        })
        return itemid;
    },
    deleteLogicByChoiceId: function (cid) {

        //删除logic表中相关qid的数据
        var delLogicIdArr = [];
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.logicAppletList,
            async: false,
        }).done(function (data) {
            var prefix = data.rootLink;
            var condition = '{"' + prefix + ':choice_id":"=' + cid + '"}';
            Iptools.uidataTool._getUserlistAppletData({
                async: false,
                appletId: widget.DEFAULT.logicAppletList,
                condition: condition
            }).done(function (json) {
                if (json.data) {
                    var records = json.data.records;
                    for (var i = 0; i < records.length; i++) {
                        delLogicIdArr.push(records[i][prefix + ":id"]);
                        widget.showQuestionByItemId(widget.getItemIdByquestionId(records[i][prefix + ":question_id"]));
                    }
                }
            })
        })
        //删除的逻辑选项
        if (delLogicIdArr.length > 0) {
            Iptools.uidataTool._deleteAppletData({
                para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget.DEFAULT.logicAppletDetail
                + "&valueIds=" + delLogicIdArr.join(","),
            }).done(function (data) {
                if (data.retcode == "ok") {
                    console.log('删除问题后删除对应逻辑成功');
                }
            })
        }
    },
    deleteThisQuestion: function (e) {
        var qid = $(e).attr("data-qid"), itemId = $(e).attr("data-sid");
        var qType = widget.getQuestionTypeBy$dom($(e));
        if (qType == "radio" || qType == "checkbox") {
            var choices = $(e).find(".qinputs-item");
            for (var i = 0; i < opts.length; i++) {
                var cid = $(opts[i]).attr("cid");
                widget.deleteLogicByChoiceId(cid);

            }
        } else if (qType == "select") {
            var opts = $(e).find(".qinputs-item option:not(.defaultVal)");
            for (var i = 0; i < opts.length; i++) {
                var cid = $(opts[i]).val();
                widget.deleteLogicByChoiceId(cid);

            }
        }

//		//删除logic表中相关qid的数据
//		var delLogicIdArr = [];
//		Iptools.uidataTool._getApplet({
//			applet:widget.DEFAULT.logicAppletList,
//		    async:false,
//		}).done(function(data){
//			var prefix = data.rootLink;
//			var condition = '{"'+prefix+':question_id":"='+qid+'"}';
//			Iptools.uidataTool._getUserlistAppletData({
//				async: false,
//                appletId: widget.DEFAULT.logicAppletList,
//                condition: condition
//			}).done(function(json){
//				if(json.data){
//					var records = json.data.records;
//					for(var i = 0;i<records.length;i++){
//						delLogicIdArr.push(records[i][prefix+":id"]);
//					}
//				}
//			})
//		})
//		//删除的选项
//		if(delLogicIdArr.length > 0){
//			Iptools.uidataTool._deleteAppletData({
//                	para: "?token="+Iptools.DEFAULTS.token+"&appletId=" + widget.DEFAULT.logicAppletDetail
//                    + "&valueIds=" + delLogicIdArr.join(","),
//            }).done(function(data){
//            	if(data.retcode == "ok"){
//            		 console.log('删除问题后删除对应逻辑成功');
//            	}
//            })
//		}
        //删除question表中qid数据
        Iptools.uidataTool._deleteAppletData({
            para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget.DEFAULT.questionAppletDetail
            + "&valueIds=" + qid,
        }).done(function (data) {
            if (data.retcode == "ok") {
                console.log('删除问题后删除问题成功');
            }
        })
        //删除item表中qid相关数据
        Iptools.uidataTool._deleteAppletData({
            para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget.DEFAULT.itemAppletDetail
            + "&valueIds=" + itemId,
        }).done(function (data) {
            if (data.retcode == "ok") {
                console.log('删除问题后删除item成功');
            }
        })

        //维护全局变量
        //删除问题
        delete widget.DEFAULT.questionObj["" + qid];
        //删除跳转到此题的选项关系
        $.each(widget.DEFAULT.questionObj, function (i, val) {
            $.each(widget.DEFAULT.questionObj["" + i], function (j, jval) {
                $.each(widget.DEFAULT.questionObj["" + i]["" + j], function (h, hval) {
                    if (h === qid) {
                        delete widget.DEFAULT.questionObj["" + i]["" + j]["" + h];
                    }
                })
            })
        })
        $(".que-main[data-qid=" + qid + "]").remove();
        sortQuestion();
    },
    endTimeEvent: function () {
        $("body").on("click", ".endTimeSwitch", function () {
            if ($("#cb1").prop("checked")) {
                $(".endTime").slideDown();
            } else {
                $(".endTime").slideUp();
            }
        })
    },
    formAppletEvent: function () {
        $("body").on("click", ".formAppletSwitch", function () {
            if ($("#cb3").prop("checked")) {
                $(".user-fill-inputs").slideDown();
            } else {
                $(".user-fill-inputs").slideUp();
            }
        })
    },
    titlesInputEvent: function () {
        //标题
        $(".title-content").on("input propertychange", function () {
            $(".preview-area .title-content").html($(this).html());
        })
        //福标题
        $(".prefix-content").on("input propertychange", function () {
            $(".preview-area .prefix-content").html($(this).html());
        })
    },
    uploadbgImgEvent: function () {
        $("#bgphoto").on('change', function (e) {
            var me = $(this);
            if (me[0].files && me[0].files.length) {
                component._crop({
                    file: me[0].files[0],
                    aspectRatio: 9 / 16, //图片裁剪框比例
                    minCanvasWidth: 360,
                    minContainerHeight: 200,
                    getCanvas: function (canvas) { //点击确定触发
                        widget.DEFAULT.bgImgObj = canvas;

                        var localUrl = canvas.toDataURL("image/png");
                        $(".tab-content").css("background-image", "url(" + localUrl + ")");
                        $(".preview-area").css("background-image", "url(" + localUrl + ")");
                        $("#bgphoto").val(me[0].files[0].name);
                        $("#bgphoto").val("");
                    }
                });
            }
        })
    },
    //获取裁剪过后的图片地址
    getCanvasImgUrl: function (canObj) {
        var url = "";
        Iptools.uidataTool._uploadCanvasData({ //上传裁剪的图片到服务器，得到图片路径
            canvas: canObj,
            type: "picture"
        }).done(function (path) {
            //$("#crop-test-container").append(Iptools.DEFAULTS.serviceUrl + path);
            url = Iptools.DEFAULTS.serviceUrl + path;
        });
        return url;
    },
}