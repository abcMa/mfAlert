var widget = {};
widget = {
    DEFAULT: {
        //问卷相关变量
        questionObj: {},
        //问题显示arr
        showQuestionArr: [],
        //问题必填arr
        isRequiredQuestionArr: [],
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
        campaignAppletDetail: "",
        answerAppletList: "",
        answerAppletDetail: "",
        contactDetailApplet: "",
        campaignResponseListApplet: "",
        campaignResponseDetailApplet: "",
        form_applet: "",
        ContactTraceDetail: "",

        address: "",
        campaign_scene_id: "",
        surveyId: "",//问卷id
        campaignId: "",
        campaign_template_id: "",
        campaignH5Id: "",

        channel: "",
        ytk_tId: "",

        historyForm: "",
        contactId: "",
        campaign:"1",//1,未开始，2，进行中，3，已结束，4，已关闭
        loadtime:""
    },
    loadingProgress: function (span) {
        progressNo += 4;
        $(".progress-bar").attr("aria-valuenow", progressNo + "%").css("width", progressNo + "%");
        $(".progressPrecent").html(progressNo + "%");
        if (progressNo < 100) {
            widget.DEFAULT.loadtime = setTimeout(function () {
                widget.loadingProgress();
            }, 100);
        } else {
            var r = setTimeout(function () {
                $(".loading").hide();
                $(".progress").hide();
                if(widget.DEFAULT.campaign !== "4"){
                    $(".container-wrapper").show();
                }

            }, 100);
            clearTimeout(widget.DEFAULT.loadtime);
        }
    },
    initDefaultsVars: function () {
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": '\"or_survey_detail\",' +
            '\"or_survey_detail\",' +
            '\"or_survey_item_list\",' +
            '\"or_survey_item_detail\",' +
            '\"or_survey_question_detail\",' +
            '\"or_survey_question_list\",' +
            '\"or_survey_choice_list\",' +
            '\"or_survey_choice_detail\",' +
            '\"or_survey_show_rule_detail\",' +
            '\"or_survey_show_rule_list\",' +
            '\"Campaign_H5 Detail Applet\",' +
            '\"Campaign Detail Applet\",' +
            '\"contact\",' +
            '\"Campaign Response List Applet\",' +
            '\"Campaign Response Detail Applet\",' +
            '\"Contact Trace Detail\",' +
            '\"Campaign Statistic Detail Applet\",' +
            '\"Campaign Response Detail Applet\"'
        }).done(function (data) {
            if (data) {
                for (var i = 0; i < data.applets.length; i++) {
                    var name = data.applets[i].name;
                    switch (name) {
                        case "or_survey_detail":
                            widget.DEFAULT.surveyAppletDetail = data.applets[i].applet;
                            break;
                        case "or_survey_item_list":
                            widget.DEFAULT.itemAppletList = data.applets[i].applet;
                            break;
                        case "or_survey_item_detail":
                            widget.DEFAULT.itemAppletDetail = data.applets[i].applet;
                            break;
                        case "or_survey_question_detail":
                            widget.DEFAULT.questionAppletDetail = data.applets[i].applet;
                            break;
                        case "or_survey_question_list":
                            widget.DEFAULT.questionAppletList = data.applets[i].applet;
                            break;
                        case "or_survey_choice_list":
                            widget.DEFAULT.choiceAppletList = data.applets[i].applet;
                            break;
                        case "or_survey_choice_detail":
                            widget.DEFAULT.choiceAppletDetail = data.applets[i].applet;
                            break;
                        case "or_survey_show_rule_detail":
                            widget.DEFAULT.logicAppletDetail = data.applets[i].applet;
                            break;
                        case "or_survey_show_rule_list":
                            widget.DEFAULT.logicAppletList = data.applets[i].applet;
                            break;
                        case "Campaign_H5 Detail Applet":
                            widget.DEFAULT.campaignH5AppletDetail = data.applets[i].applet;
                            break;
                        case "Campaign Detail Applet":
                            widget.DEFAULT.campaignAppletDetail = data.applets[i].applet;
                            break;
                        case "contact":
                            widget.DEFAULT.contactDetailApplet = data.applets[i].applet;
                            break;
                        case "Campaign Response List Applet":
                            widget.DEFAULT.campaignResponseListApplet = data.applets[i].applet;
                            break;
                        case "Campaign Response Detail Applet":
                            widget.DEFAULT.campaignResponseDetailApplet = data.applets[i].applet;
                            break;
                        case "Contact Trace Detail":
                            widget.DEFAULT.ContactTraceDetail = data.applets[i].applet;
                            break;
                        case "Campaign Statistic Detail Applet":
                            widget.DEFAULT.CampaignStatisticDetail = data.applets[i].applet;
                            break;
                        case "Campaign Response Detail Applet":
                            widget.DEFAULT.CampaignResponseDetail = data.applets[i].applet;
                            break;

                    }
                }
                //渲染页面
                if (widget.DEFAULT.campaignH5Id) {
                    widget.buildPage();
                }
                widget.bindEvent();
                widget.map();
                //widget.myLocation();
                widget.device();
                /*$("#loadModal").modal("hide");*/
            }
        });
    },
    init: function () {
        widget.loadingProgress();
        widget.DEFAULT.campaignH5Id = getUrlParameter("h5Id");
        Iptools.DEFAULTS.tenantId = getUrlParameter("tenantId");
        widget.DEFAULT.channel = getUrlParameter("channel");
        widget.DEFAULT.ytk_tId = getUrlParameter("ytk_tenant_id");
        widget.DEFAULT.historyForm = getUrlParameter("form");
        //初始化customApplet
        widget.initDefaultsVars();
    },
    buildPage: function () {
        widget.getH5Info();
    },
    bindEvent: function () {
        //radio
        $("body").on("click", ".qradio-label", function (e) {
            e.stopPropagation();
            var $this = $(this), $on = $this.find("i"), qid = $(this).closest(".que-main").attr("id");
            var $allOn = $this.closest(".qinputs").find(".qradio-label i");
            //反选
            if ($on.hasClass("on")) {
                $on.removeClass("on");
                $on.addClass("off");
                widget.hideSomeQuestion({"type": "radio", "qid": qid, "$this": $(this)});
            } else {
                $allOn.removeClass("on").addClass("off");
                $on.addClass("on");
                $on.removeClass("off");
                widget.showSomeQuestion({"type": "radio", "qid": qid, "$this": $(this)});
            }
        })
        //checkbox
        $("body").on("click", ".qcheckbox-label", function (e) {
            e.stopPropagation();
            var $this = $(this), $on = $this.find("i"), qid = $(this).closest(".que-main").attr("id");
            //反选
            if ($on.hasClass("on")) {
                $on.removeClass("on");
                $on.addClass("off");
                widget.hideSomeQuestion({"type": "checkbox", "qid": qid, "$this": $(this)});
            } else {
                $on.removeClass("off");
                $on.addClass("on");
                widget.showSomeQuestion({"type": "checkbox", "qid": qid, "$this": $(this)});
            }
        })
        //select
        $("body").on("change", ".select-qinputs-item", function (e) {
            var $this = $(this).find("option:selected"), qid = $(this).closest(".que-main").attr("id");

            //反选
            if ($this.val() === "-1") {
                return false;
            } else {
                widget.showSomeQuestion({"type": "select", "qid": qid, "$this": $(this)});
            }
        })
        //提交
        $("body").on("click", ".commitSurvey", function () {
            $(this).button('loading');
            //widget.clickCount();
            widget.timeCounter(time);
            widget.postAnswers();
        })
        //选中、填写input时相应的题型提示需要隐藏
        $(".qcheckbox-label").on("click", function () {
            $(this).closest(".que-main").find(".que-note").removeClass("shake").hide();
        })
        $(".qradio-label").on("click", function () {
            $(this).closest(".que-main").find(".que-note").removeClass("shake").hide();
        })
        $(".select-qinputs-item").on("change", function () {
            $(this).closest(".que-main").find(".que-note").removeClass("shake").hide();
        })

        $("textarea.qinputs-item").on("input propertychange", function () {
            $(this).closest(".que-main").find(".que-note").removeClass("shake").hide();
        })

        $("input.qinputs-item").on("input propertychange", function () {
            $(this).closest(".que-main").find(".que-note").removeClass("shake").hide();
        })
        //用户提交表单隐藏错误提示
        $("#userName,#email,#phone").on("input propertychange", function () {
            $(this).siblings(".msg-note").html("");
        })
        //提示框的确认按钮
        $("body").on("click",".close-dialog", function () {
            $(".dialog").hide();
            $(".dialog-modal").hide();
        })
    },
    clickCount:function(channelFrom){
        var data =  '{"campaign_statistic:campaign_id":"'+widget.DEFAULT.campaignId.id+'","campaign:campaign_response_type":"1","campaign:campaign_scene_id":"'+widget.DEFAULT.campaign_scene_id+'"';
        if(channelFrom){
            data += ',"'+staRootId+':channel":"'+channelFrom+'","'+staRootId+':yuntui_tenant_id":"'+ytk_id+'"';
        }
        data += '}';
        Iptools.uidataTool._addAppletData({
            appletId:widget.DEFAULT.CampaignStatisticDetail,
            data:data
        }).done(function(data){
            console.log("吸引点击量加1");
            // console.log(data.id);
        })
    },
    //把回答问卷所需要时间post到不记名表里
    timeCounter: function (paramTime, channelFrom, ytk_id) {
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.CampaignStatisticDetail,
            //async:false,
        }).done(function (data) {
            var staRootId = data.rootLink;
            var data = '{"' + staRootId + ':campaign_id":"' + widget.DEFAULT.campaignId.id + '","' + staRootId + ':campaign_response_type":"5","' + staRootId + ':campaign_scene_id":"' + widget.DEFAULT.campaign_scene_id + '","' + staRootId + ':stay_time":"' + paramTime + '"';
            if (channelFrom) {
                data += ',"' + staRootId + ':channel":"' + channelFrom + '","' + staRootId + ':yuntui_tenant_id":"' + ytk_id + '"';
            }
            data += '}';
            Iptools.uidataTool._addAppletData({
                appletId: widget.DEFAULT.CampaignStatisticDetail,
                data: data
            }).done(function (data) {
                console.log('你呆了' + paramTime + '秒');
            })
            //浏览量
            var data1 = '{"' + staRootId + ':campaign_id":"' + widget.DEFAULT.campaignId.id + '","' + staRootId + ':campaign_response_type":"2","' + staRootId + ':campaign_scene_id":"' + widget.DEFAULT.campaign_scene_id + '"';
            if (channelFrom) {
                data1 += ',"' + staRootId + ':channel":"' + channelFrom + '","' + staRootId + ':yuntui_tenant_id":"' + ytk_id + '"';
            }
            data1 += '}';
            Iptools.uidataTool._addAppletData({
                appletId: widget.DEFAULT.CampaignStatisticDetail,
                data: data1
            }).done(function (data) {
                console.log('浏览加1');
            })
        })
    },
    detectDevice: function () {
        var str = "";
        if (screen.width > 480) {
            str = "pc";
        } else {
            str = "phone";
        }
        return str;
    },
    getQuestionTypeByDom: function ($dom) {
        if ($dom.hasClass("que-control-radio")) {
            return "radio";
        } else if ($dom.hasClass("que-control-checkbox")) {
            return "checkbox";
        } else if ($dom.hasClass("que-control-select")) {
            return "select";
        } else if ($dom.hasClass("que-control-input")) {
            return "input";
        } else if ($dom.hasClass("que-control-textarea")) {
            return "textarea";
        } else if ($dom.hasClass("que-control-description")) {
            return "description";
        } else {
            return "";
        }
    },
    showSomeQuestion: function (ops) {
        var cid = "";
        if (ops.type === "select") {
            cid = ops.$this.val();
        } else {
            cid = ops.$this.attr("cid");
        }
        var qObj = widget.DEFAULT.questionObj["" + ops.qid];
        var thisCObj = widget.DEFAULT.questionObj["" + ops.qid]["" + cid];
        if (ops.type === "radio") {
            $.each(qObj, function (j, jval) {
                if (jval) {
                    //当前选项的跳转题
                    if (j !== cid) {//隐藏其他选项跳转题
                        $.each(qObj["" + j], function (g, gval) {
                            $("#" + g).removeClass("active");
                        })
                    }
                }
            })
            //显示跳转到对应题:先隐藏其他选项的对应题，再显示本选项要跳转的题（index问题）
            if (thisCObj) {
                $.each(thisCObj, function (i, ival) {
                    $("#" + i).addClass("active");
                })
            }

        } else if (ops.type === "checkbox") {
            //显示跳转到对应题:不考虑其他选项
            if (thisCObj) {
                $.each(thisCObj, function (i, ival) {
                    $("#" + i).addClass("active");
                })
            }
        } else if (ops.type === "select") {
            $.each(qObj, function (j, jval) {
                if (jval) {
                    //当前选项的跳转题
                    if (j !== cid) {//隐藏其他选项跳转题
                        $.each(qObj["" + j], function (g, gval) {
                            $("#" + g).removeClass("active");
                        })
                    }
                }

            })
            //显示跳转到对应题:先隐藏其他选项的对应题，再显示本选项要跳转的题（index问题）
            if (thisCObj) {
                $.each(thisCObj, function (i, ival) {
                    $("#" + i).addClass("active");
                })
            }

        }
        //把显示的题目重新排列顺序
        var $active = $(".que-main.active:not(.que-control-description)");
        for (var ii = 0; ii < $active.length; ii++) {
            $($active[ii]).find(".qtitle-index").html(ii + 1 + ".");
        }
    },
    hideSomeQuestion: function (ops) {
        var cid = ops.$this.attr("cid");
        var qObj = widget.DEFAULT.questionObj["" + ops.qid];
        var thisCObj = widget.DEFAULT.questionObj["" + ops.qid]["" + cid];
        if (ops.type === "radio") {
            $.each(qObj, function (j, jval) {
                //当前选项的跳转题
                if (j === cid) {
                    //显示跳转到对应题
                    $.each(thisCObj, function (i, ival) {
                        var index = $(".que-main.active").length + 1;
                        $("#" + i).find(".qtitle-index").html(index + ".");
                        $("#" + i).removeClass("active");
                    })

                }
            })
        } else if (ops.type === "checkbox") {
            $.each(qObj, function (j, jval) {
                //当前选项的跳转题
                if (j === cid) {
                    //显示跳转到对应题
                    $.each(thisCObj, function (i, ival) {
                        var index = $(".que-main.active").length + 1;
                        $("#" + i).find(".qtitle-index").html(index + ".");
                        $("#" + i).removeClass("active");
                    })

                }
            })
        }
    },
    //展示初始题
    initShowQuestion: function () {
        if (widget.DEFAULT.showQuestionArr.length != 0) {
            for (var i = 0; i < widget.DEFAULT.showQuestionArr.length; i++) {
                $("#" + widget.DEFAULT.showQuestionArr[i]).addClass("active").find(".qtitle-index").html(i + 1 + ".");
            }
        }
    },
    getSurveyInfo: function () {
        //构建全局变量
        widget.buildSurveyVars();
    },
    buildSurveyVars: function () {
        //Iptools.uidataTool._getApplet({
        //    applet: widget.DEFAULT.itemAppletList,
        //    //async:false,
        //}).done(function (data) {
        //    var prefix = data.rootLink;
            var condition = '{"or_survey_item:survey_id":"=' + widget.DEFAULT.surveyId + '"}';
            Iptools.uidataTool._getUserlistAppletData({
                //async:false,
                "appletId": widget.DEFAULT.itemAppletList,
                "condition": condition,
                "orderByColumn": "or_survey_item:sequence",
                "orderByAscDesc": "asc"
            }).done(function (data) {
                if (data.data) {
                    var iprefix = "or_survey_item",qprefix = "or_question";
                    var records = data.data.records;

                    //获取问题
                    for (var i = 0; i < records.length; i++) {
                        var itemId = records[i][iprefix + ":id"];
                        //显示的问题
                        if (!records[i][iprefix + ":is_initial_hidden"]) {
                            widget.DEFAULT.showQuestionArr.push(records[i][qprefix + ":id"]);
                        }
                        //必填的问题
                        if (records[i][iprefix + ":is_required"]) {
                            widget.DEFAULT.isRequiredQuestionArr.push(records[i][qprefix + ":id"]);
                        }
                        var qObj = widget.DEFAULT.questionObj;
                        qObj[records[i][qprefix + ":id"]] = {};
                        widget.getQuestionDetailById({
                            id: records[i][qprefix + ":id"],
                            i: i,
                            itemId: itemId,
                            isRequired: records[i][iprefix + ":is_required"]
                        });
                    }
                    //根据全局变量显示题目
                    widget.initShowQuestion();
                }
            })
        //})
    },
    getQuestionItemDetail:function(re,index){
        if(re.length>index){
            widget.getQuestionDetailById(re[index]).done(function(){
                widget.getQuestionItemDetail(re,index+1);
            });
        }
    },
    //获取question详情
    getQuestionDetailById: function (options) {
        var promise= $.Deferred();
        Iptools.uidataTool._getUserDetailAppletData({
            async:false,
            "appletId": widget.DEFAULT.questionAppletDetail,
            "valueId": options.id,
        }).done(function (data) {
            if (data) {
                var qobj = data;
                var qid = "", qType = "", qtext = "";
                if (qobj.data) {
                    var qprefix = qobj.rootLink;
                    qid = qobj.data[qprefix + ":id"];
                    qType = qobj.data[qprefix + ":type"].id;
                    qtext = qobj.data[qprefix + ":name"];
                    //构建问题dom
                    $(".que-wrap").append(widget.buildEuestionDom({
                        "type": qType,
                        "isRequired": options.isRequired,
                        "id": qid,
                        "text": qtext,
                        "index": options.i + 1,
                        "itemId": options.itemId
                    }));
                    widget.getItemDetailByItemId({
                        id: options.itemId,
                        qid: qid,
                        qType: qType,
                        quesId: options.id
                    });
                    promise.resolve();
                }
            }else{

            }
        })
        return promise;
    },
    //获取item详情
    getItemDetailByItemId: function (options) {
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULT.itemAppletDetail,
            "valueId": options.id,
        }).done(function (data) {
            if (data) {
                var iobj = data;
                if (iobj.data) {
                    widget.getChoiceListByQuestionId({
                        id: options.quesId,
                        qid: options.qid,
                        qType: options.qType,
                    });
                }
            }
        })
    },
    ////获取choice详情
    //getChoiceDetailById: function (id) {
    //    var obj = {};
    //    Iptools.uidataTool._getUserDetailAppletData({
    //        "appletId": widget.DEFAULT.choiceAppletDetail,
    //        "valueId": id,
    //        "async": false
    //    }).done(function (data) {
    //        if (data) {
    //            var prefix = data.rootLink;
    //            obj = data;
    //        }
    //    })
    //    return obj;
    //},
    getChoiceListByQuestionId: function (options) {
        var condition = '{"or_choices:question_id":"=' + options.id + '"}';
        var qid = options.qid;
        var qType = options.qType;
        Iptools.uidataTool._getUserlistAppletData({
            appletId: widget.DEFAULT.choiceAppletList,
            condition: condition,
            "orderByColumn": "or_choices:sequence",
            "orderByAscDesc": "asc"
        }).done(function (json) {
            if (json.data && json.data.records) {
                var prefix = json.rootLink;
                var cobj = json;

                if (cobj.data) {
                    var cobjItem = cobj.data.records;
                    var cPrefix = cobj.rootLink;
                    //获取选项
                    for (var j = 0; j < cobjItem.length; j++) {
                        var cid = cobjItem[j][cPrefix + ":id"], cText = cobjItem[j][cPrefix + ":text"];
                        if (qType === "select") {
                            $("#" + qid).find(".qinputs select").append(widget.buildChoicesDom({
                                "index": j + 1,
                                "type": qType,
                                "text": cText,
                                "id": cid
                            }));
                        } else {
                            $("#" + qid).find(".qinputs").append(widget.buildChoicesDom({
                                "index": j + 1,
                                "type": qType,
                                "text": cText,
                                "id": cid
                            }));
                        }

                        widget.getRuleDetailByChoiceId({
                            index: j,
                            count: cobjItem.length,
                            qid: options.qid,
                            cid: cid
                        }).done(function () {
                            ////根据全局变量显示题目
                            //widget.initShowQuestion();
                        });

                    }
                }
            } else {
                if (qType !== "description") {
                    $("#" + qid).find(".qinputs").append(widget.buildChoicesDom({
                        "index": 0,
                        "type": qType
                    }));
                }

            }
        })
    },
    //获取Rules详情
    getRuleDetailByChoiceId: function (options) {
        var promise = $.Deferred();
        var qObj = widget.DEFAULT.questionObj;
        Iptools.uidataTool._getUserlistAppletData({
            appletId: widget.DEFAULT.logicAppletList,
            condition: '{"or_choices_show_rule:choice_id":"=' + options.cid + '"}'
        }).done(function (r) {
            if (r && r.data && r.data.records && r.data.records.length) {
                var cqprefix = r.rootLink;
                var cqid = r.data.records[0][cqprefix + ":question_id"];
                var ruleItem = {};
                ruleItem[cqid] = {
                    logicId: r.data.records[0][cqprefix + ":id"],
                    status: "init"
                }
                //ruleItem["logicId"] = r.data.records[0][cqprefix + ":id"];
                //ruleItem["status"] = "init";


                qObj[options.qid][options.cid] = {};
                qObj[options.qid][options.cid] = ruleItem;
                //深拷贝
                //widget.DEFAULT.questionObj = $.extend({}, qObj);
                if (options.index >= options.count) {
                    promise.resolve();
                } else {
                    widget.getRuleDetailByChoiceId({
                        index: options.index + 1,
                        count: options.count,
                        cid: options.cid,
                        qid: options.qid
                    }).done(function () {
                        promise.resolve();
                    });
                }
            }else{
                //深拷贝
                //widget.DEFAULT.questionObj = $.extend(true, {}, qObj);
            }
        });
        return promise;
    },
    buildEuestionDom: function (ops) {
        var type = ops.type, isReauired = ops.isRequired;
        text = ops.text, index = ops.index, id = ops.id, itemId = ops.itemId;
        var html = "";
        switch (type) {
            case "radio":
                html = '<div class="que-main que-control-radio" id="' + id + '" data-sid="' + itemId + '">' +
                    '<div class="que-control">' +
                    '<div class="qtitle">';
                if (isReauired) {
                    html += '<span class="qtitle-require">*</span>';
                } else {
                    html += '<span class="qtitle-require"></span>';
                }

                html += '<span class="qtitle-index">' + index + '.</span>' +
                    '<span class="qtitle-text">' + text + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="que-note">此问题必答</div>' +
                    '<div class="qinputs"></div>' +
                    '</div>';
                break;
            case "checkbox":
                html = '<div class="que-main que-control-checkbox" id="' + id + '" data-sid="' + itemId + '">' +
                    '<div class="que-control">' +
                    '<div class="qtitle">';
                if (isReauired) {
                    html += '<span class="qtitle-require">*</span>';
                } else {
                    html += '<span class="qtitle-require"></span>';
                }

                html += '<span class="qtitle-index">' + index + '.</span>' +
                    '<span class="qtitle-text">' + text + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="que-note">此问题必答</div>' +
                    '<div class="qinputs"></div>' +
                    '</div>';
                break;
            case "select":
                html = '<div class="que-main que-control-select" id="' + id + '" data-sid="' + itemId + '">' +
                    '<div class="que-control ">' +
                    '<div class="qtitle">';
                if (isReauired) {
                    html += '<span class="qtitle-require">*</span>';
                } else {
                    html += '<span class="qtitle-require"></span>';
                }

                html += '<span class="qtitle-index">' + index + '.</span>' +
                    '<span class="qtitle-text">' + text + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="que-note">此问题必答</div>' +
                    '<div class="qinputs"><select name="qinputs-item" class="form-control qinputs-item select-qinputs-item"> ' +
                    '<option value="-1" class="qselect-label">--请选择--</option></div>' +
                    '</div>';
                break;
            case "input":
                html = '<div class="que-main que-control-input" id="' + id + '" data-sid="' + itemId + '">' +
                    '<div class="que-control">' +
                    '<div class="qtitle">';
                if (isReauired) {
                    html += '<span class="qtitle-require">*</span>';
                } else {
                    html += '<span class="qtitle-require"></span>';
                }

                html += '<span class="qtitle-index">' + index + '.</span>' +
                    '<span class="qtitle-text">' + text + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="que-note">此问题必答</div>' +
                    '<div class="qinputs"></div>' +
                    '</div>';
                break;
            case "textarea":
                html = '<div class="que-main que-control-textarea" id="' + id + '" data-sid="' + itemId + '">' +
                    '<div class="que-control">' +
                    '<div class="qtitle">';
                if (isReauired) {
                    html += '<span class="qtitle-require">*</span>';
                } else {
                    html += '<span class="qtitle-require"></span>';
                }

                html += '<span class="qtitle-index">' + index + '.</span>' +
                    '<span class="qtitle-text">' + text + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="que-note">此问题必答</div>' +
                    '<div class="qinputs"></div>' +
                    '</div>';
                break;
            case "description":
                html = '<div class="que-main que-control-description" id="' + id + '" data-sid="' + itemId + '">' +
                    '<div class="que-control">' +
                    '<span class="qtitle-text">' + text + '</span>' +
                    '</div>' +
                    '<div class="qinputs"></div>' +
                    '</div>';
                break;
        }
        return html;
    },
    buildChoicesDom: function (ops) {
        var type = ops.type, choiceId = ops.id, text = ops.text, index = ops.index;
        var html = "";
        switch (type) {
            case "radio":
                html = '<div class="qinputs-item"><span class="qradio-label" cid="' + choiceId + '"><i class="off"></i><input type="radio" name="qradio"><span class="choiceText">' + text + '</span></span></div>';
                break;
            case "checkbox":
                html = '<div class="qinputs-item"><span class="qcheckbox-label" cid="' + choiceId + '"><i class="off"></i><input type="checkbox" name="qcheckbox"><span class="choiceText">' + text + '</span></span></div>';
                break;
            case "select":
                html = '<option cid="' + choiceId + '" value="' + choiceId + '" class="qselect-label"> ' + text + ' </option> ';
                break;
            case "input":
                html = '<input class="form-control qinputs-item">';
                break;
            case "textarea":
                html = '<textarea class="form-control qinputs-item"></textarea>';
                break;
            case "description":
                html = '<p>这段是说明题</p>';
                break;
        }
        return html;
    },
    //
    //getQuestionList: function (id) {
    //    var obj = {};
    //    Iptools.uidataTool._getUserlistAppletData({
    //        "appletId": widget.DEFAULT.questionAppletList,
    //        "async": false
    //    }).done(function (data) {
    //        if (data) {
    //            var prefix = data.rootLink;
    //            obj = data;
    //        }
    //    })
    //    return obj;
    //},
    _getNowDate:function(){
        //获取时间
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;

        var strDate = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        ////获取下一天
        //if(str === "nextday"){
        //    strDate = strDate + 1;
        //}
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hour >= 1 && hour <= 9) {
            hour = "0" + hour;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }
        if (sec >= 0 && sec <= 9) {
            sec = "0" + sec;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + min
            + seperator2 + sec;
        return currentdate;
    },

    getH5Info: function () {
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULT.campaignH5AppletDetail,
            "valueId": widget.DEFAULT.campaignH5Id,
            //"async":false
        }).done(function (data) {
            if (data) {
                var prefix = data.rootLink;
                var noteStr = "";
                var now = widget._getNowDate();
                //判断开始时间和结束时间，是否被关闭
                if(data.data[prefix + ":is_canelled"]){
                    $(".campaign_status_container").show();
                    widget.DEFAULT.campaign = "4";
                    noteStr = "活动已经关闭<br>更多活动请关注我们";
                    $(".campaign_status_container p").html(noteStr);
                    $(".campaign_status_container .notice_img").attr("src","../img/noStarted_closed.png");
                    $(".container-wrapper").hide();
                    return false;
                }


                widget.DEFAULT.surveyId = data.data[prefix + ":survey_id"];
                widget.DEFAULT.campaignId = data.data[prefix + ":campaign_id"];
                widget.getCampaignInfo().done(function(){
                    widget.DEFAULT.campaign = "2";
                    $(".title").html(data.data[prefix + ":title"]);
                    $(".subtitle").html(data.data[prefix + ":sub_title"]);
                    //结束页
                    if (data.data[prefix + ":rich_text"]) {
                        $('#end_summernote').html(data.data[prefix + ":rich_text"]);
                    }

                    if (data.data[prefix + ":back_img"]) {
                        $("body").css("background-image", "url(" + data.data[prefix + ":back_img"] + ")");
                    }else{
                        $("body").css("background-image", "url('img/campaign_base_bg.jpg')");
                    }
                    //用户提交表单
                    if (data.data[prefix + ":form_applet"]) {
                        $(".userInfo-container").show();
                        widget.DEFAULT.form_applet = data.data[prefix + ":form_applet"];
                        widget.buildFormApplet(data.data[prefix + ":form_applet"]);
                    }
                    if (!widget.DEFAULT.surveyId) {
                        widget.DEFAULT.surveyId = data.data[prefix + ":survey_id"];
                    }

                    widget.getSurveyInfo();
                });

            }
        })
    },
    getCampaignInfo: function () {
        var p = $.Deferred();
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULT.campaignAppletDetail,
            "valueId": widget.DEFAULT.campaignId.id,
            //"async":false
        }).done(function (data) {
            if (data) {
                var prefix = data.rootLink;
                if (data.data[prefix + ":campaign_scene_id"]) {
                    widget.DEFAULT.campaign_scene_id = data.data[prefix + ":campaign_scene_id"];
                }
                if (data.data[prefix + ":status"]) {
                    var status = data.data[prefix + ":status"].id;
                    switch(status){
                        case "1"://未开始
                            noteStr = "活动还未开始<br>数据将无法提交";
                            $(".dialog-body").html(noteStr);
                            $(".dialog-modal").show();
                            $(".dialog").show();
                            widget.DEFAULT.campaign = "1";
                            $(".campaign_status_container").css({"user-select":"none", "-webkit-user-select":"none"," -moz-user-select":"none","-ms-user-select":"none"});
                            $(".commitSurvey").attr("disabled","disabled");
                            progressNo = 100;
                            break;

                        case "3"://已结束
                            widget.DEFAULT.campaign = "3";
                            noteStr = "活动已经结束<br>数据将无法提交";
                            $(".dialog-modal").show();
                            $(".dialog").show();
                            $(".campaign_status_container").css({"user-select":"none", "-webkit-user-select":"none"," -moz-user-select":"none","-ms-user-select":"none"});
                            $(".commitSurvey").attr("disabled","disabled");
                            $(".dialog-body").html(noteStr);
                            progressNo = 100;
                            break;
                        default:
                            break;
                    }
                }
                p.resolve();
            }
        })
        return p;
    },
    buildFormApplet: function (appletId) {
        Iptools.uidataTool._getApplet({
            "applet": appletId,
            //async: false,
        }).done(function (data) {
            if (data) {
                var html = "";
                for (var i = 0; i < data.controls.length; i++) {
                    html += widget.buildFormDom(data.controls[i].name);
                }
                ;
                $(".formApplet").html(html);
                widget.formValidator();
            }
        })
    },
    buildFormDom: function (name) {
        var html = "";
        switch (name) {
            case "姓名":
                html += '<div class="form-group">' +
                    '<label for="userName">姓名</label>' +
                    '<input type="text" class="form-control" id="userName" name="userName" placeholder="姓名">' +
                    '<span class="msg-note"></span>' +
                    '</div>';
                break;
            case "电话":
                html += '<div class="form-group">' +
                    '<label for="phone">电话</label>' +
                    '<input type="text" class="form-control" id="phone" name="phone" placeholder="电话">' +
                    '<span class="msg-note"></span>' +
                    '</div>';
                break;
            case "邮箱":
                html += '<div class="form-group">' +
                    '<label for="email">邮箱</label>' +
                    '<input type="text" class="form-control" id="email" name="email" placeholder="邮箱">' +
                    '<span class="msg-note"></span>' +
                    '</div>';
                break;
        }
        return html;
    },
    device: function () {
        var browser = {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1 //是否iPad
                };
            }()
        };
        if (browser.versions.trident || browser.versions.presto || browser.versions.webKit || browser.versions.gecko) {
            deviceType = "pc";
//				     console.log("iphone");
        }
        ;
        if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
            deviceType = "iPhone";
//				     console.log("iphone");
        }
        ;
        if (browser.versions.android) {
            deviceType = "android";
//				   console.log("android");
        }
        ;
        return deviceType;
    },
    map: function () {
        var myCity = new BMap.LocalCity();
        myCity.get(myLocation);
    },

    postAnswers: function () {
        var result = widget.checkQuestionRequired();
        if (!result) {
            return false;
        }
        if (!widget.checkSubmitInfoAndSubmit()) {
            return false;
        }
        var allQuestions = $(".que-main.active:not(.que-control-description)");
        var paramStr = "";
        paramStr += "[";
        for (var i = 0; i < allQuestions.length; i++) {
            paramStr += widget.buildAnswerVar($(allQuestions[i]));
            if (i < allQuestions.length - 1) {
                paramStr += ",";
            }
        }
        paramStr += "]";
        Iptools.PostJson({
            url: "basic/submit",
            data: {
                "token": Iptools.DEFAULTS.token,
                "type": widget.detectDevice(),
                "surveyId": widget.DEFAULT.surveyId,
                "answers": paramStr,
                "contactId": widget.DEFAULT.contactId
            }
        }).done(function (r) {
            if (r.retcode == "ok") {
                console.log("提交成功");
                $(".commitSurvey").button('reset');
                $(".ques-container .row").hide();
                $(".container .title").html("提交成功,<br/>感谢您的参与");
                $(".endPage-container").show();
            }
        }).fail(function (r) {
            console.log(r);
        });
    },
    buildAnswerVar: function ($dom) {
        var paramStr = "";

        var qtype = widget.getQuestionTypeByDom($dom);
        switch (qtype) {
            case "radio":
                var cid = $dom.find(".qinputs-item i.on").closest(".qradio-label").attr("cid");
                paramStr += '{';
                paramStr += "\"surveyItemId\":" + $dom.attr("data-sid") + ",";
                paramStr += "\"choiceId\":" + cid + "";
                paramStr += "}";
                break;
            case "checkbox":
                var cid;
                var choices = $dom.find(".qinputs-item i.on");
                for (var i = 0; i < choices.length; i++) {
                    cid = $(choices[i]).closest(".qcheckbox-label").attr("cid");
                    paramStr += '{';
                    paramStr += "\"surveyItemId\":" + $dom.attr("data-sid") + ",";
                    paramStr += "\"choiceId\":" + cid + "";
                    if (i < choices.length - 1) {
                        paramStr += "},";
                    } else {
                        paramStr += "}";
                    }
                }

                break;
            case "select":
                var cid = $dom.find(".select-qinputs-item").val();
                paramStr += '{';
                paramStr += "\"surveyItemId\":" + $dom.attr("data-sid") + ",";
                paramStr += "\"choiceId\":" + cid + "";
                paramStr += "}";
                break;
            case "input":
                var text = $dom.find(".qinputs-item").val();
                paramStr += '{';
                paramStr += "\"surveyItemId\":" + $dom.attr("data-sid") + ",";
                paramStr += "\"textAnswer\":\"" + text + "\"";
                paramStr += "}";
                break;
            case "textarea":
                var text = $dom.find(".qinputs-item").val();
                paramStr += '{';
                paramStr += "\"surveyItemId\":" + $dom.attr("data-sid") + ",";
                paramStr += "\"textAnswer\":\"" + text + "\"";
                paramStr += "}";
                break;
        }

        return paramStr;
    },
    checkQuestionRequired: function () {
        var result = true;
        var questions = $(".que-main.active:not(.que-control-description)");
        for (var i = 0; i < questions.length; i++) {
            if ($(questions[i]).find(".qtitle-require").html() === "*") {
                var type = widget.getQuestionTypeByDom($(questions[i]));
                switch (type) {
                    case "radio":
                        if ($(questions[i]).find(".qradio-label").find(".on").length === 0) {
                            $(questions[i]).find(".que-note").css("display", "inline-block").addClass('shake');
//						return false;
                            result = false;
                        }
                        break;
                    case "checkbox":
                        if ($(questions[i]).find(".qcheckbox-label").find(".on").length === 0) {
                            $(questions[i]).find(".que-note").css("display", "inline-block").addClass('shake');
//						return false;
                            result = false;
                        }
                        break;
                    case "select":
                        if ($(questions[i]).find(".qinputs-item").val() === "-1") {
                            $(questions[i]).find(".que-note").css("display", "inline-block").addClass('shake');
//						return false;
                            result = false;
                        }
                        break;
                    case "input":
                        if ($(questions[i]).find(".qinputs-item").val() === "") {
                            $(questions[i]).find(".que-note").css("display", "inline-block").addClass('shake');
//						return false;
                            result = false;
                        }
                        break;
                    case "textarea":
                        if ($(questions[i]).find(".qinputs-item").val() === "") {
                            $(questions[i]).find(".que-note").css("display", "inline-block").addClass('shake');
//						return false;
                            result = false;
                        }
                        break;
                }
            }
        }
        return result;
    },
    formValidator:function(){
        $("#userForm").bootstrapValidator({
            fields: {
                userName: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                    }
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                        regexp: {
                            regexp: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                            message: '请填写正确的电话号码'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                        regexp: {
                            regexp: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/,
                            message: '请填写正确的邮箱地址'
                        }
                    }
                },
            }
        })
    },
    //表单非空校验和提交时显示奖品信息
    checkSubmitInfoAndSubmit: function () {
        var result = true;
        var readOnly = false;
        //电话号码和邮箱的验证
        var nameVal = $("#userName").val();

        //var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        //var emailReg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/;
        var count = 0;
        if ($("#userName").length !== 0) {
            count++;
            $("#userForm").bootstrapValidator('validate');
            if (!$("#userForm").data("bootstrapValidator").isValid()){
                return false;
            }
        }
        var telVal = $("#phone").val();
        var emailVal = $("#email").val();
        //
        //if (telVal !== "") {
        //    if (!telReg.test(telVal)) {
        //        $("#phone").closest(".form-group").find(".msg-note").html("电话格式不正确");
        //        result = false;
        //        return false;
        //    } else {
        //        count++;
        //    }
        //} else {
        //    $("#phone").closest(".form-group").find(".msg-note").html("电话必填");
        //    result = false;
        //    return false;
        //}
        //
        //if (emailVal !== "") {
        //    if (!emailReg.test(emailVal)) {
        //        $("#email").closest(".form-group").find(".msg-note").html("邮箱格式不正确");
        //        result = false;
        //        return false;
        //    } else {
        //        count++;
        //    }
        //} else {
        //    $("#email").closest(".form-group").find(".msg-note").html("邮箱必填");
        //    result = false;
        //    return false;
        //}
        if (!readOnly) {
            if (count > 0) {
                //提交表单时的数据统计  记名
                //查看所填的电话号码是否存在
                Iptools.GetJson({
                    //async: false,
                    ajaxCounting: false,
                    url: "basic/contacts",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        phone: telVal
                    }
                }).done(function (data) {
                    if (data.length > 0) {
                        var contact_id = data[0].id;
                        widget.DEFAULT.contactId = contact_id;
                        if (nameVal != data[0].title) {//证明姓名变了，要post一条动态
                            var title = "姓名:" + nameVal;
                            widget.editConTrace("姓名", contact_id);
                        }
                        Iptools.uidataTool._getApplet({
                            applet: widget.DEFAULT.surveyAppletDetail,
                            //async: false,
                        }).done(function (data) {
                            var qprefix = data.rootLink;
                            var paramStr = "";
                            var paramData = {};
                            paramStr += '{';

                            if (telVal) {
                                paramStr += "\"" + qprefix + ":phone\":\"" + telVal + "\",";
                            }
                            if (emailVal) {
                                paramStr += "\"" + qprefix + ":email\":\"" + emailVal + "\",";
                            }
                            if (nameVal) {
                                paramStr += "\"" + qprefix + ":title\":\"" + nameVal + "\"";
                            }

                            paramStr += "}";
                            paramData["data"] = paramStr;
                            paramData["appletId"] = widget.DEFAULT.contactDetailApplet;
                            paramData["valueId"] = contact_id;
                            //新建问题
                            Iptools.uidataTool._saveAppletData(paramData).done(function (json) {
                                console.log('老用户的新信息put成功---' + contact_id);
                                //老用户在提交之前先查重，没有重复在提交到response中
                                Iptools.uidataTool._getApplet({
                                    applet: widget.DEFAULT.campaignResponseListApplet,
                                    async: false,
                                }).done(function (data) {
                                    var resListRootId = data.rootLink;
                                    Iptools.uidataTool._getUserlistAppletData({
                                        appletId: widget.DEFAULT.campaignResponseListApplet,//8049
                                        pageNow: 1,
                                        pageSize: 1,
                                        condition: '{"' + resListRootId + ':contact_id":"=' + contact_id + '","' + resListRootId + ':campaign_id":"=' + widget.DEFAULT.campaignId.id + '"}'
                                    }).done(function (s) {
                                        if (s.data) {
                                            if (s.data.records.length == 1) {
                                                //显示活动报名成功
                                                console.log("已经报过名");
                                                return true;
                                            }
                                        } else {
                                            widget.recoverCustomerInfo(0, contact_id, widget.DEFAULT.channel, widget.DEFAULT.ytk_tId);
                                            widget.createContactTrace("问卷调查", contact_id);
                                            return true;
                                        }
                                        ;
                                    })
                                })
                            })
                        })

                    } else {
                        Iptools.uidataTool._getApplet({
                            applet: widget.DEFAULT.form_applet,
                            //async: false,
                        }).done(function (data) {
                            var qprefix = data.rootLink;
                            //新用户
                            var paramStr = "";
                            // var paramData={};
                            paramStr += '{';
                            paramStr += "\"" + qprefix + ":contacttype\":\"2\",";
                            paramStr += "\"" + qprefix + ":title\":\"" + nameVal + "\",";
                            paramStr += "\"" + qprefix + ":phone\":\"" + telVal + "\",";
                            paramStr += "\"" + qprefix + ":email\":\"" + emailVal + "\"";
                            paramStr += "}";
                            // paramData["data"] = paramStr;

                            //新客户的话需要先往formApplet里post一条数据，然后拿着得到的id在往resAppId---8045里post一条数据
                            Iptools.uidataTool._addAppletData({
                                //async: false,
                                appletId: widget.DEFAULT.form_applet,
                                data: paramStr
                            }).done(function (data) {
                                var contact_id = data.id;
                                widget.DEFAULT.contactId = contact_id;
                                widget.createConTrace(nameVal, contact_id);//新客户被创建时的动态
                                widget.recoverCustomerInfo(1, contact_id, widget.DEFAULT.channel, widget.DEFAULT.ytk_tId);
                                widget.createContactTrace("问卷调查", contact_id);
                            });
                        })
                    }
                    ;
                });
            }
        } else {//readonly开启之后，不做任何数据的上传
            //awardShow(awardLeft,awardName,awardTel);
        }
        return result;
    },
    //编辑客户的动态
    editConTrace: function (editName, contact_id) {
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.ContactTraceDetail,
            // async: false,
        }).done(function (data) {
            var contactTraceRootId = data.rootLink;
            Iptools.uidataTool._addAppletData({
                appletId: widget.DEFAULT.ContactTraceDetail,
                data: '{"' + contactTraceRootId + ':title":"' + editName + '","' + contactTraceRootId + ':contact_id":"' + contact_id + '","' + contactTraceRootId + ':trace_type":"5"}'
            }).done(function (data) {
                console.log('编辑客户的动态已post')
            });
        })
    },
    //创建客户的动态
    createConTrace: function (conName, contact_id) {
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.ContactTraceDetail,
            //async: false,
        }).done(function (data) {
            var contactTraceRootId = data.rootLink;
            Iptools.uidataTool._addAppletData({
                appletId: widget.DEFAULT.ContactTraceDetail,
                data: '{"' + contactTraceRootId + ':title":"' + conName + '","' + contactTraceRootId + ':contact_id":"' + contact_id + '","' + contactTraceRootId + ':trace_type":"4"}'
            }).done(function (data) {
                console.log('新客户被创建的动态已post')
            });
        })
    },
    //客户参加活动动态
    createContactTrace: function (marketName, contact_id) {
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.ContactTraceDetail,
            //async: false,
        }).done(function (data) {
            var contactTraceRootId = data.rootLink;
            Iptools.uidataTool._addAppletData({
                appletId: widget.DEFAULT.ContactTraceDetail,
                data: '{"' + contactTraceRootId + ':title":"' + marketName + '","' + contactTraceRootId + ':contact_id":"' + contact_id + '","' + contactTraceRootId + ':trace_type":"1","' + contactTraceRootId + ':value_id":"' + widget.DEFAULT.campaignId.id + '"}'
            }).done(function (data) {
                console.log('客户参加活动的动态post成功')
            })
        })
    },
    //客户提交表单参加活动后，报名量加1
    recoverCustomerInfo: function (isJoin, contactId, channelFrom, ytk_id) {
        Iptools.uidataTool._getApplet({
            applet: widget.DEFAULT.campaignResponseDetailApplet,
            //async: false,
        }).done(function (data) {
            var resRootId = data.rootLink;
            var postToResData = '';
            postToResData = '{"' + resRootId + ':campaign_id":"' + widget.DEFAULT.campaignId.id + '","' +
                resRootId + ':campaign_response_type":"3","' +
                resRootId + ':campaign_scene_id":"' + widget.DEFAULT.campaign_scene_id + '","' +
                resRootId + ':is_new":"' + isJoin + '","' +
                resRootId + ':device":"' + widget.device() + '","' +
                resRootId + ':location":"' + address + '","' +
                resRootId + ':contact_id":"' + contactId + '"';
            if (channelFrom) {
                postToResData += ',"' + resRootId + ':channel":"' + channelFrom + '","' + resRootId + ':yuntui_tenant_id":"' + ytk_id + '"';
            }
            postToResData += '}';
            //	    console.log(postToResData);
            Iptools.uidataTool._addAppletData({
                appletId: widget.DEFAULT.campaignResponseDetailApplet,
                data: postToResData
            }).done(function (data) {
                console.log("参加活动成功---");
            });
        })
    },
    //计算在该页面的停留时间
    stayTime: function () {
        widget.DEFAULT.time++;
    }
}