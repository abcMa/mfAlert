/*
 * edit by ma
 * 2017.1.12
 */
var widget = {};
widget = {
    DEFAULFS: {
        appletId: channelAppletId,
        channelValueId: getThisTabVars("channelValueId"),
        groupValueId: "",
        newSMSMarketing: getThisTabVars("newSMSMarketing"),//是否从营销活动详情跳转，是：”no“；否：undefined
        campaignList: [],
        campaignValueId: "",
        selectedCampaign: "",
        GroupappletName: {
            async: false,
            "nameList": '"Contactgroup Trace Detail"'
        },
        contactGroupTraceApplet: "",
        GroupRootId: '',
        //短信签名value作为全局变量
        magSignature: "",
        magSignatureId: "",
        //支付相关变量
        payObj: {
            "msgNum": 50,
            "msgMoney": 5,
            "orderNo": ""
        },
        sessionObj: {},
        //短信模板数量
        msgTemplateNo: 5,
        msgTemplateList: ["悄悄告诉你，我们打折了！详情戳：",
            "什么？大家都在参与的活动，你竟然不知道？赶紧来：",
            "小主，一别数月，近来可好？最新活动，记得来看看哦",
            "双十一狂甩，错过再等一年，速来：",
            "家是幸福的港湾，过年回家，给爸妈带点心意，送上祝福："],
        //当前短信内容
        currentMsg: "",
        conditionApplet: "",
        setGroupPhone: [],//发送对象手机号
        groupPhone: [],//抄送手机号
        conditionStr: [],
        channelType: 1,//渠道，1，短信 2，微信
        sendType: 1,//发送方式,1，直接发送 2,定时发送
        loopType: 1,//循环类型，1,不循环，2，循环
        commitDataObj: {},//群发时的部分参数
        directPostNo: 2,//直接发送+循环需要post两次
    },
    init: function () {
        //debugger
        widget.getSessionVals();
        widget.domReady();
        widget.preViewMsg();
        widget.preViewWXcontent();
        widget.previewPhoneNoValidator();
        widget.putMsgTemplateItem();
        widget.copyMsgTemplateItem();
        //widget.changeContantType();
        widget.changeTargetType();
        widget.getMsgRecordList();
        var signature = widget.DEFAULFS.magSignature != "" ? widget.DEFAULFS.magSignature : "短信签名";
        //短信营销入口
        if (widget.DEFAULFS.newSMSMarketing !== "no" || !getThisTabVars("campaignName")) {
            $(".campaignName").hide();
            widget.getAllCampaigns();
            $(".shareType").hide();
            $(".shareTypeTitle").hide();
            widget.DEFAULFS.sessionObj.campaignUrl = "";
            //$(".msgBox").html('小主，你好久没有来看我了呢！双十二活动开始啦，来看看我吧 '+ " 退订回T<span>【"+signature+"】</span>");
        } else {
            $(".QRCode").qrcode({
                render: "canvas", //table方式
                width: 120, //宽度
                height: 120, //高度
                text: getThisTabVars("campaignUrlstr") //任意内容
            });
            //从properties.xml中获取云推客的地址
            var para = {
                async: false,
                type: "GET"
            };
            para["url"] = "../Content/JS/properties.xml";
            $.ajax(para).done(function (r) {
                Iptools.DEFAULTS.wxyuntuikePath = $(r).find("Configs root wxyuntuike").text();
            });
            //console.log("云推url"+"http://"+Iptools.DEFAULTS.wxyuntuikePath+"/createTask/?token="+Iptools.getDefaults({key:'token'})+"&tenantId="+Iptools.getDefaults({key:'tenantId'})+"&campaiginId="+widget.DEFAULFS.sessionObj.campaignValueId+"&h5Id="+widget.DEFAULFS.sessionObj.valueId);
            var longWebsite = "http://" + Iptools.DEFAULTS.wxyuntuikePath + "/createTask/?token=" + Iptools.getDefaults({key: 'token'}) + "&tenantId=" + Iptools.getDefaults({key: 'tenantId'}) + "&campaiginId=" + widget.DEFAULFS.sessionObj.campaignValueId + "&h5Id=" + widget.DEFAULFS.sessionObj.valueId; //任意内容
            var shortWebsite;
            //长链接转短连接
            Iptools.GetJson({
                url: "service/contact/get_sina_short_url",
                data: {
                    shortUrl: longWebsite,
                }
            }).done(function (data) {
                if (data && data.retcode == "ok") {
                    shortWebsite = data.retmsg;
                    $(".yuntuiQRCode").qrcode({
                        render: "canvas", //table方式
                        width: 120, //宽度
                        height: 120, //高度
                        text: shortWebsite
                    });
                }
            });
            $(".contentTypeArea").hide();
            $(".viewDress").html(getThisTabVars("campaignUrlstr"));
            $(".campaignName").html(getThisTabVars("campaignName"));
            widget.DEFAULFS.sessionObj.campaignUrl = getThisTabVars("campaignUrlstr");
            widget.DEFAULFS.campaignValueId = getThisTabVars("campaignValueId");
            //$(".msgBox").html("小主，你好久没有来看我了呢！双十二活动开始啦，来看看我吧<a href='"+widget.DEFAULFS.sessionObj.campaignUrl+"' target='_blank'>"+widget.DEFAULFS.sessionObj.campaignUrl+"</a>"+ " 退订回T<span>【"+signature+"】</span");
        }
        widget.initPhoneTag();
        widget.msgSginature();
        widget.wxContentInput();
        widget.contactTypeChange();
        widget.sendLoppChange();
        widget.channelChange();

    },
    channelChange: function () {
        $("body").on("click", "input[name=send-channel]", function () {
            var thisVal = $(this).data("val");
            $(".msgBox").html("");
            $(".showWordNum i").html(0);
            //发送对象置初始值
            $(".targetType").val("-1");
            $(".targetNum").html(0);
            $(".conditionArea").empty();
            if (thisVal === 1) {//短信
                widget.DEFAULFS.channelType = 1;
                $(".msg-content-area").show();
                $(".wx-content-area").hide();
                $(".mobilePreview").show();
                $(".sendLoop").show();
                //发送对象的全部微信粉丝更换为全部客户
                $(".targetType").find("option[value=1]").html("全部客户");
                $(".conditionsArea").empty();
                $(".msgSignature").show();
                $(".btnleft").css("visibility", "visible");
                $(".btnRight.mobilePreview").show();
                $("#msg_content").trigger("input");
                //抄送
                $(".sendByPhones").show();
            } else {
                widget.DEFAULFS.channelType = 0;
                $(".msg-content-area").hide();
                $(".wx-content-area").show();
                $(".mobilePreview").hide();
                $(".sendLoop").hide();
                //发送对象的全部客户更换为全部微信粉丝
                $(".targetType").find("option[value=1]").html("全部微信粉丝");
                $(".conditionsArea").empty();
                $(".msgSignature").hide();
                $(".btnleft").css("visibility", "hidden");
                $(".btnRight.mobilePreview").hide();
                $(".wx-content-input").trigger("input");
                //抄送
                $(".sendByPhones").hide();
            }
        })
    },
    wxContentInput: function () {
        $("body").on("input propertychange", ".wx-content-input", function () {
            var len = $(this).val().length;
            if (len > 600) {
                return false;
            } else {
                $(".wx-content-no span").html(600 - len);
            }

        })
    },
    sendLoppChange: function () {
        $("body").on("click", "input[name=sendLoop]", function () {
            var thisVal = $(this).data("val");
            if (thisVal === 1) {//不循环
                widget.DEFAULFS.loopType = 1;
                $(".loop-select").hide();
                $(".control-loop-time").hide();
            } else {
                widget.DEFAULFS.loopType = 0;
                $(".loop-select").css("display", 'inline-block');
                if (widget.DEFAULFS.sendType === 0) {
                    $(".control-loop-time").css("display", "inline-block");
                    $(".control-loop-time .loop-time").html($(".sendTiming").val());
                }
            }
        })
    },
    contactTypeChange: function () {
        $("body").on("click", "input[name=content-type]", function () {
            var thisVal = $(this).data("val");
            //不嵌入活动
            if (thisVal === 1) {
                $(".allCampaigns").hide();
                widget.DEFAULFS.sessionObj.campaignUrl = "";
                if (widget.DEFAULFS.channelType === 1) {
                    $("#msg_content").trigger("input");
                } else {
                    $(".wx-content-input").trigger("input");
                }
            } else {
                if ($(".allCampaigns").html() === "") {
                    widget.getAllCampaigns(".allCampaigns");
                }
                $(".allCampaigns").show();
            }
        })
    },
    //获取session中所有参数
    getSessionVals: function () {
        Iptools.uidataTool._getView({
            view: Iptools.DEFAULTS.currentView,
            async: false
        }).done(function (json) {
            //debugger
            //获得tab下的局部变量
            var curViewVal = Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewValue) ? Iptools.DEFAULTS.currentViewValue : 0;
            widget.DEFAULFS.sessionObj = Iptools.Tool._getTabData({
                view: Iptools.DEFAULTS.currentView,
                valueId: curViewVal,
                type: json.view.type
            });
        });
    },
    //--document.ready
    domReady: function () {
        //初始化全局变量
        Iptools.uidataTool._getCustomizeApplet(widget.DEFAULFS.GroupappletName).done(function (data) {
            widget.DEFAULFS.contactGroupTraceApplet = data.applets[0].applet;//8144
        });
        Iptools.uidataTool._getApplet({
            async: false,
            applet: widget.DEFAULFS.contactGroupTraceApplet
        }).done(function (d) {
            widget.DEFAULFS.GroupRootId = d.rootLink;
        });

        $(".sendTiming").datetimepicker({
            format: "yyyy-mm-dd hh:00:00",
            minView: 1,
            autoclose: true,
            todayBtn: true,
            language: "zh-CN"
        }).on('hide', function () {
            $(this).trigger("input");
        }).on('changeDate', function (ev) {
            //定时时间即循环时间
            if (widget.DEFAULFS.loopType === 1) {
                $(".control-loop-time").css("display", "none");
                return false;
            } else {
                $(".control-loop-time .loop-time").html($(this).val());
                $(".control-loop-time").css("display", "inline-block");
            }

        });
        var d = widget.getTimeByTimeType({"isNow": true});
        var formatd = d.split(" ")[0];
        if (formatd !== "") {
            $('.sendTiming').datetimepicker('setStartDate', formatd);
        }


        //短信条数
        widget.getMsgNum();
        //短信签名
        widget.getMsgSignature(Iptools.DEFAULTS.tenantId);
        $(".msgSig").val(widget.DEFAULFS.magSignature);

        //click当前充值加上蒙版
        $(".recharge").on("click", function () {
            //$(".recharge-mask").css("display","none");
            $(".recharge-mask").removeClass("active");
            //选择短信充值条目
            widget.DEFAULFS.payObj.msgNum = parseInt($(this).find(".messageNum span").html());
            widget.DEFAULFS.payObj.msgMoney = parseInt($(this).find(".total span").html());
            if ($(this).hasClass("active")) {
                $(this).parent().find(".recharge-mask").removeClass("active");
            } else {
                $(this).parent().find(".recharge-mask").addClass("active");
            }
        });
        //点击当前蒙版要被清除
        $(".recharge-mask").on("click", function () {
            //支付btn不能点击
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active");
            }
        });
        widget.getMagTemplateList();
    },

    initPhoneTag: function () {
        $("#phoneEventTags").tagit({
            tagLimit: 20,
            placeholderText: "输入手机号，以'空格'分隔",
            beforeTagAdded: function (event, ui) {
                if (ui.tagLabel.length === 11) {
                    var isPhoneNum = checkPhoneNum(parseInt(ui.tagLabel));
                    if (!isPhoneNum) {
                        $(event.target).css("color", "red");
                        return false;
                    }
                } else {
                    $(event.target).find(".ui-autocomplete-input:last").css("color", "red");
                    return false;
                }
            },
            afterTagAdded: function (event, ui) {
                widget.DEFAULFS.groupPhone.push(ui.tagLabel);
                $(".contactCount").html(parseInt($(".targetNum").html()) + widget.DEFAULFS.groupPhone.length);
            },
            afterTagRemoved: function (event, ui) {
                var index = widget.DEFAULFS.groupPhone.indexOf(ui.tagLabel);
                if (index !== -1) {
                    widget.DEFAULFS.groupPhone.splice(index, 1);
                    $(".contactCount").html(parseInt($(".targetNum").html()) + widget.DEFAULFS.groupPhone.length);
                } else {
                    return false
                }

            }
        });
        $(".ui-autocomplete-input").on("input", function () {
            $(this).css("color", "#555");
            $(".target_note").css("color", "rgb(160, 150, 150)");
        })
    },
    //查询租户的剩余短信数量
    getMsgNum: function () {
        var msgNum;
        Iptools.GetJson({
            url: "basic/getSmsRemain",
            data: {tenantId: Iptools.DEFAULTS.tenantId, token: Iptools.DEFAULTS.token},
            async: false,
        }).done(function (data) {
            $(".msgNum").html(data);
        })
    },
    //get短信签名
    getMsgSignature: function () {
        var sigStr = "";
        Iptools.GetJson({
            url: "basic/queryByDictId",
            data: {
                "dictId": "smsSignature",
                "token": Iptools.DEFAULTS.token
            },
            async: false,
        }).done(function (data) {
            if (data.retcode === "ok") {
                widget.DEFAULFS.magSignature = data.result.dictValue;
                widget.DEFAULFS.magSignatureId = data.result.id;
                sigStr = data.result.dictValue;
            } else {
                widget.DEFAULFS.magSignature = "";
                widget.DEFAULFS.magSignatureId = "";
            }
        })
        return sigStr;
    },
    //所有客户群下拉
    getContactGroup: function () {
        var rt = "";
        Iptools.GetJson({
            url: "basic/queryContactgroups",
            data: {"token": Iptools.DEFAULTS.token},
            async: false,
        }).done(function (data) {
            var html = "";
            html += '<div class="yz-col-230"><select class="form-control contactGroupList"><option value="-1" selected="selected">请选择客户群</option>';
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].id + '" data-val="' + data[i].contactCount + '">' + data[i].title + '</option>';
            }
            html += '</select></div>';
            rt = html;
        })
        return rt;
    },
//-------------------------------------------------------------------------------------------------
    //右侧预览短信
    preViewMsg: function () {
        $(".msg_content").on("input", function () {
            widget.syncPreviewContent();
        })
    },
    //实时预览
    syncPreviewContent: function () {
        //提交按钮绑定click事件
        $(".com-commit").css("background-color", "rgb(51, 176, 149)");
        $(".com-commit").attr('onclick', "comCommit();");
        var msg = Iptools.Tool._checkNull($("#msgSig").val()) ? $("#msgSig").val() : "短信签名";
        msg = Iptools.Tool._checkNull(widget.DEFAULFS.magSignature) ? widget.DEFAULFS.magSignature : msg;
        var url = Iptools.Tool._checkNull(widget.DEFAULFS.sessionObj.campaignUrl) ? widget.DEFAULFS.sessionObj.campaignUrl : '';
        //校验内容的链接
        var con = $("#msg_content").val();
        var re = /^(http:\/\/|https:\/\/).*$/;
        if (re.test(url)) {
            url = url.replace(/^(https?|http):\/\//, " ");
        }
        $(".msgBox").html(con + " " + url + " 退订回T【" + msg + "】");
        widget.showMsgContentNum();
    },
    preViewWXcontent: function () {
        $(".wx-content-input").on("input", function () {
            //var preUrl = widget.DEFAULFS.sessionObj.campaignUrl;//之前的url需要删除
            //$(".wx-content-input").val($(".wx-content-input").val().split(preUrl).join(""));
            var content = $(".wx-content-input").val();
            $(".msgBox").html(content);
            $(".showWordNum i").html(600 - Number($(".wx-content-no span").html()));
        })
    },
    //显示已经输入短信字数
    showMsgContentNum: function () {
        var msgCon = "";
        var con;

        con = $(".msgBox").text().trim().length;
        $(".showWordNum i").html(con);
        return msgCon;
    },
    //选择某一条短信模板
    copyMsgTemplateItem: function () {
        $(".selectMsgTemplateItem").on("click", function () {
            $("#messageExample").modal("hide");
            $(".msg_content").val($(this).closest(".list-group-item").find("input").val());
            $(".msg_content").trigger("input");
            $(".content_note").hide();
        })
    },
    //短信签名实时
    msgSginature: function () {
        $("#msgSig").on("input", function () {
            if ($(this).val().length > 8 || $(this).val().length < 3) {
                $(".msgSignature .sig_note").css("color", "red");
                return false;
            } else {
                $(".msgSignature .sig_note").css("color", "rgb(160, 150, 150)");
                widget.DEFAULFS.magSignature = $("#msgSig").val();
                widget.syncPreviewContent();
            }
        })
    },
//-------------------------------------------------------------------------------------------------
    //动态校验手机号
    previewPhoneNoValidator: function () {
        $(".phoneNum").on("input", function () {
            if (checkPhoneNum($(".phoneNum").val())) {
                $(".telError").hide();
                return false;
            } else {
                $(".telError").show();
                return false;
            }
            ;
        })
    },
    getMagTemplateList: function () {
        //debugger
        $("#messageExample .list-group").html("");
        /*
         * msgTemplate0代表第一条短信模板，0以此类推
         */
        Iptools.GetJson({
            url: "/basic/queryByDictId",
            async: false,
            data: {
                "dictId": "msgTemplate0",
                "token": Iptools.DEFAULTS.token
            },
        }).done(function (data) {
            //存在模板--显示
            if (data.retcode === "ok") {
                for (var i = 0; i < 5; i++) {
                    widget.buildMsgTemplateList("msgTemplate" + i);
                }
            } else {//不存在--post
                for (var j = 0; j < widget.DEFAULFS.msgTemplateList.length; j++) {
                    widget.postMsgTemplateList("msgTemplate" + j, widget.DEFAULFS.msgTemplateList[j]);
                }
                widget.getMagTemplateList();
            }
        }).fail(function (data) {
            console.log(data);
        })
    },
    postMsgTemplateList: function (dictid, dictIdName) {
        var paramStr = "";
        var paramData = {
            tenantId: Iptools.DEFAULTS.tenantId,
            "dictId": dictid,
            "dictIdName": dictIdName,
            "dictValue": dictIdName,
            token: Iptools.DEFAULTS.token
            //async:false
        }
        Iptools.PostJson({
            url: "/basic/tenantDictConfs",
            data: paramData,
            async: false,
        }).done(function (data) {
            if (data) {
                console.log("新建" + dictid + "短信模板列表成功");
            } else {
                console.log("新建" + dictid + "短信模板列表失败");
            }
        })
    },
    buildMsgTemplateList: function (dictId) {
        Iptools.GetJson({
            url: "basic/queryByDictId",
            data: {
                "dictId": dictId,
                //"tenantId":Iptools.DEFAULTS.tenantId,
                "token": Iptools.DEFAULTS.token
            },
            async: false,
        }).done(function (data) {
            //存在模板--更新
            if (data.retcode === "ok") {
                $("#messageExample .list-group").append('<li class="list-group-item"><input class="form-control" value="' + data.result.dictValue + '" data-id="' + data.result.id + '" data-dictId="' + data.result.dictId + '"><button type="button" class="btn commonBtn selectMsgTemplateItem">选择</button></li>');
            }
        })

    },
    //put模板内容
    putMsgTemplateItem: function () {
        $(".list-group .list-group-item input").on("input", function () {
            var paramStr = "";
            var paramData = {
                //tenantId:Iptools.DEFAULTS.tenantId,
                token: Iptools.DEFAULTS.token,
                "id": $(this).attr("data-id"),
                "dictId": $(this).attr("data-dictid"),
                "dictIdName": $(this).val(),
                "dictValue": $(this).val()
            }
            Iptools.PutJson({
                url: "/basic/tenantDictConfs",
                data: paramData,
            }).done(function (data) {
                if (data) {
                    console.log("更新" + $(this).attr("data-dictid") + "短信模板列表成功");
                } else {
                    console.log("更新" + $(this).attr("data-dictid") + "短信模板列表失败");
                }
            }).fail(function (data) {
                if (data) {
                    console.log("更新" + $(this).attr("data-dictid") + "短信模板列表成功");
                } else {
                    console.log("更新" + $(this).attr("data-dictid") + "短信模板列表失败");
                }
            })
        })
    },
    //获取所有营销活动
    getAllCampaigns: function (parentDom) {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign_H5 List Applet'"//8047
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    applet: data.applets[0].applet,
                    async: false
                }).done(function (json) {
                    Iptools.uidataTool._getUserlistAppletData({
                        appletId: data.applets[0].applet,
                        async: false,
                        condition: '{"' + json.rootLink + ':is_cancelled": " is null"}',
                        pageNow: 1,
                        pageSize: 100
                    }).done(function (ds) {
                        if (ds.data && ds.data.records) {
                            var sopts = [];
                            var html = "";
                            html += '<option value="-1" selected="selected">请选择活动</option>';
                            for (var i = 0; i < ds.data.records.length; i++) {
                                var odata = ds.data.records[i];
                                html += '<option value="' + odata[ds.rootLink + ":id"] + '" data-pid="' + odata[ds.rootLink + ":campaign_id"].id + '" data-val="' + odata[ds.rootLink + ":title"] + '" data-url="' + odata[ds.rootLink + ":view_address"] + '">' + odata[ds.rootLink + ":title"] + '</option>';
                            }
                            widget.DEFAULFS.campaignList.push(sopts);
                        }
                        $(parentDom).append('<select class="form-control" style="width: auto;display: inline-block;" onchange="selecttThisCampaign(this)">' + html + '</select>');
                    });
                })


            }
        });
    },
    //选择内容类型
    changeContantType: function () {
        var $ct = $(".contentType");
        var $ac = $(".allCampaigns");
        $ct.change(function () {
            var $this = $(this);
            //不选
            if ($this.val() === "-1") {
                if ($(".msgBox a").length !== 0) {
                    $(".msgBox a").remove();
                }
                $ac.hide();
                return false;
            } else if ($this.val() === "1") {//选择自定义内容
                $ac.hide();
                if ($(".msgBox a").length !== 0) {
                    $(".msgBox a").remove();
                }
            } else {//选择嵌入系统活动
                if ($ac.find("select").length >= 1) {
                    $ac.show();
                    $ac.find("select").val("-1");
                    $(".msgBox").find("a").remove();
                } else {
                    widget.getAllCampaigns(".allCampaigns");
                }

            }
        })
    },
    //change发送对象
    changeTargetType: function () {
        var $tt = $(".targetType");
        var isShowCondition;//是否显示二级下拉菜单
        var isAllFans = false;//全部粉丝需要请求定制接口获取客户数量
        $tt.change(function () {
            $(".conditionArea").html("");
            $(".target_note").css("color", "rgb(160, 150, 150)");
            var $this = $(this);
            widget.DEFAULFS.setGroupPhone.length = 0;
            $(".targetNum").html(0);
            $(".contactCount").html(0);
            //不选
            if ($this.val() === "-1") {
                return false;
            } else if ($this.val() === "1") {//选择全部用户

                //微信
                if (widget.DEFAULFS.channelType === 0) {
                    isShowCondition = false;
                    isAllFans = true;
                } else {
                    widget.getAllContacts();
                    isShowCondition = true;
                    isAllFans = false;
                }

            } else { //选择客户群筛选
                isAllFans = false;
                var allcontactGroup = widget.getContactGroup();
                $(".conditionArea").append(allcontactGroup);
                widget.changeContactGroupItem();
                isShowCondition = false;
            }
            //如果是全部粉丝请求定制接口获取客户数量
            if (isAllFans) {

                Iptools.uidataTool._getCustomizeApplet({"nameList": '\"wx_fans_list\"'}).done(function (data) {
                    allFansListApplet = data.applets[0].applet;
                    Iptools.uidataTool._getUserlistAppletData({
                        appletId: allFansListApplet,
                        async: false,
                    }).done(function (rt) {
                        if (rt.data) {
                            var obj = rt.data.records;
                            var len = obj.length;
                            //显示已经选择的人数
                            $(".targetNum").html(rt.data.rowCount);
                        } else {
                            $(".targetNum").html(0);
                        }
                    })
                })
            } else {
                var op1 = {async: false, "nameList": '\"contact_group_linkcontact_list\"'};
                var contactGroupApplet;
                Iptools.uidataTool._getCustomizeApplet(op1).done(function (data) {
                    contactGroupApplet = data.applets[0].applet;
                })
                var allCondition =
                    widget.getAllConditionByAppletId({
                        "container": ".conditionArea",
                        "appletid": contactGroupApplet,
                        "showCondition": isShowCondition,
                        "onChangetrigger": true,
                        "afterChange": function (rt) {
                            if (rt.data) {
                                widget.DEFAULFS.setGroupPhone.length = 0;
                                var obj = rt.data.records;
                                //for (var i = 0; i < obj.length; i++) {
                                //    widget.DEFAULFS.setGroupPhone.push(obj[i]["contact:phone"]);
                                //}
                                //显示已经选择的人数
                                $(".targetNum").html(rt.data.rowCount);
                                $(".contactCount").html(parseInt(rt.data.rowCount) + widget.DEFAULFS.groupPhone.length);
                            } else {
                                //显示已经选择的人数
                                $(".targetNum").html(0);
                                $(".contactCount").html(0);
                            }

                        }
                    });
            }


        })
    },
    //获取全部客户
    getAllContacts: function () {
        var op1 = {async: false, "nameList": '\"contact_list\"'};
        var contactApplet;
        Iptools.uidataTool._getCustomizeApplet(op1).done(function (data) {
            contactApplet = data.applets[0].applet;
            Iptools.uidataTool._getUserlistAppletData({
                appletId: contactApplet,
                async: false,
            }).done(function (rt) {
                if (rt.data) {
                    widget.DEFAULFS.setGroupPhone.length = 0;
                    var obj = rt.data.records;
                    var len = obj.length;
                    //for (var i = 0; i < len; i++) {
                    //    widget.DEFAULFS.setGroupPhone.push(obj[i]["contact:phone"]);
                    //}
                    //显示已经选择的人数
                    $(".targetNum").html(rt.data.rowCount);
                    $(".contactCount").html(parseInt(rt.data.rowCount) + widget.DEFAULFS.groupPhone.length);
                }
            })
        })

    },
    //获取数据by applet
    getAllConditionByAppletId: function (ops) {
        var result = "";
        widget.DEFAULFS.conditionApplet = ops.appletid;
        if (ops.showCondition) {
            Iptools.uidataTool._getUserlistAppletData({
                appletId: ops.appletid,
                async: false
            }).done(function (rt) {
                if (rt) {
                    result = widget.getConditionByData(rt);
                }
            })
            $(ops.container).append(result);
        }

        //所有select onchange时触发搜索
        if (ops.onChangetrigger) {
            widget.changeCondtionSelect({"callBack": ops.afterChange});
        }
        //构建完搜索按钮给搜索按钮绑定回调事件
        //return result;
    },
    //获取每个条件
    getConditionByData: function (data) {
        var ret = "";
        if (data.columns) {
            var cobjs = data.columns;
            for (var i = 0; i < cobjs.length; i++) {
                if (cobjs[i].allowOutterQuery) {
                    ret += widget.renderConditionByColumns(cobjs[i]);
                }

            }
        }
        return ret;
    },
    //根据类型渲染条件
    renderConditionByColumns: function (columnItem) {
        var html = "";
        if (columnItem) {
            var colObj = columnItem;
            var $d = $(document.createElement("div")),
                $lab = $(document.createElement("lable")),
                $sl = $(document.createElement("select")),
                $it = $(document.createElement("input"));
            $d.attr("class", "yz-col-230 cds-item");
            $sl.addClass("form-control cds-select");
            $it.addClass("form-control cds-input");
            var colType = columnItem.type;
            var html = "";
            switch (colType) {
                //case "text"://input
                //$it.attr("data-column", colObj.column);
                //$it.attr("placeHolder", colObj.name);
                //$d.append($it);
                //html = $d[0].outerHTML;
                //break;
                case "select"://select
                    $sl.attr("data-column", colObj.column);
                    var picobj = colObj.pickList;
                    $sl.append('<option value="-1">请选择' + colObj.name + '</option>');
                    for (var i = 0; i < picobj.length; i++) {
                        $sl.append('<option value="' + picobj[i].id + '">' + picobj[i].name + '</option>');
                    }
                    $d.append($sl);
                    html = $d[0].outerHTML;
                    break;
                case "count":
                    break;
            }
        }
        return html;
    },
    //onchange触发筛选
    changeCondtionSelect: function (obj) {
        var $slct = $(".cds-item .cds-select");
        $slct.change(function () {
            widget.searchByCondition({"condition": widget.buildSearchCondition(), "callBack": obj.callBack});
        })
    },
    //拼condition
    buildSearchCondition: function () {
        var condition = {};
        var ipts = $(".cds-item .cds-input");
        var selets = $(".cds-item .cds-select");
        for (var i = 0; i < ipts.length; i++) {
            var key = $(ipts[i]).attr("data-column");
            var val = $(ipts[i]).val();
            if (val !== "") {
                condition[key] = " like '%" + val + "%'";
            }
        }
        for (var j = 0; j < selets.length; j++) {
            var key = $(selets[j]).attr("data-column");
            var val = $(selets[j]).val();
            if (val !== "-1") {
                condition[key] = "='" + val + "'";
            }
        }
        return condition;
    },
    changeContactGroupItem: function () {
        var $slct = $(".contactGroupList");
        $slct.change(function () {
            $(".target_note").css("color", "rgb(160, 150, 150)");
            var $this = $(this);
            var ob = widget.searchByCondition({"valueId": $this.val()});
            widget.DEFAULFS.setGroupPhone.length = 0;
            if (ob.data) {
                var obj = ob.data.records;
                //for (var i = 0; i < obj.length; i++) {
                //    widget.DEFAULFS.setGroupPhone.push(obj[i]["contact:phone"]);
                //}
                $(".targetNum").html(ob.data.rowCount);
                $(".contactCount").html(parseInt(ob.data.rowCount) + widget.DEFAULFS.groupPhone.length);
            } else {
                $(".targetNum").html(0);
                $(".contactCount").html(widget.DEFAULFS.groupPhone.length);
            }
            widget.DEFAULFS.groupValueId = $this.val();

        })
    },
    //搜索
    searchByCondition: function (optsObj) {
        var result;
        var condition = optsObj.condition ? optsObj.condition : widget.buildSearchCondition();
        var value;
        //客户群触发
        if (optsObj.valueId) {
            condition["contactlinkgroup:groupid"] = "='" + optsObj.valueId + "'";
        } else {
            if ($(".contactGroupList").val() && $(".contactGroupList").val() != "-1") {
                condition["contactlinkgroup:groupid"] = "='" + $(".contactGroupList").val() + "'";
            }
        }
        Iptools.uidataTool._getUserlistAppletData({
            appletId: widget.DEFAULFS.conditionApplet,
            async: false,
            //valueId:value,
            condition: JSON.stringify(condition)
        }).done(function (rt) {
            if (rt) {
                if (optsObj.callBack) {
                    optsObj.callBack(rt);
                    return;
                } else {
                    result = rt;
                }
            }
        })
        return result;
    },
    //构建筛选条件字符串
    buildConditionStr: function () {
        widget.DEFAULFS.conditionStr.length = 0;
        var ipts = $(".conditionsArea").find(".col-md-2 .form-control");
        for (var i = 0; i < ipts.length; i++) {
            widget.DEFAULFS.conditionStr.push(widget.getValByTag(ipts[i]));
        }

    },
    //根据标签类型活动标签的value
    getValByTag: function (tag) {
        var val = "";
        var tagType = tag.localName;
        switch (tagType) {
            case "select":
                if ($(tag).val() === "-1") {
                    return "";
                } else {
                    val = $(tag).find("option:selected").text();
                }
                break;
            case "input":
                val = $(tag).val();
                break;
            default:
                break;
        }
        return val;
    },
    getMsgRecordList: function () {
        $(".msg_record_list").on("click", function () {
            var viewobj = {};
            var thisView;
            viewobj["async"] = false;
            viewobj["nameList"] = '\"sms_record\"';//查看全部短信记录
            Iptools.uidataTool._getCustomizeView(viewobj).done(
                function (data) {
                    thisView = data;
                });
            // debugger
            Iptools.uidataTool._getView({
                view: thisView.views[0].view,
                async: false
            }).done(
                function (data) {
                    Iptools.Tool._jumpView({
                        view: thisView.views[0].view,
                        name: data.view.name,
                        type: data.view.type,
                        primary: data.view.primary,
                        icon: data.view.icon,
                        url: data.view.url,
                        bread: true
                    }, function () {
                    })
                })
        })
    },
    showComfirmModal: function () {
        $("#confirmMass .val-send-type").closest(".row").find(".row").html("");
        $("#confirmMass .view-time-row").empty();
        var html = "";
        var sendTypeStr = "";
        var sendTypeVal = "";
        var top = $("#confirmMass").height() / 2 - $("#confirmMass .modal-content").height();
        $("#confirmMass .modal-content").css("margin-top", "425px");
        //短信
        if (widget.DEFAULFS.channelType === 1) {

            $("#confirmMass").find(".val-channel-title").html($("#title").val());
            $("#confirmMass").find(".val-channel-type").html("短信");
            $("#confirmMass").find(".val-content").html($(".msgBox").html());
            //判断是全部客户还是客户群
            if ($(".targetType").val() === "1") {
                if ($(".conditionArea select[data-column='contact:contacttype']").val() !== "-1") {
                    $("#confirmMass").find(".val-send-target").html("全部客户/" + $(".conditionArea select[data-column='contact:contacttype']").find("option:selected").text());
                } else {
                    $("#confirmMass").find(".val-send-target").html("全部客户");
                }
            } else if ($(".targetType").val() === "2") {
                $("#confirmMass").find(".val-send-target").html($(".contactGroupList").find("option:selected").text());
            }

            $("#confirmMass").find(".val-signatrue").closest(".row").show();
            $("#confirmMass").find(".val-signatrue").html($("#msgSig").val());


            if (widget.DEFAULFS.sendType === 1) {//直接发送
                if (widget.DEFAULFS.loopType === 1) {//不循环
                    sendTypeStr = "直接发送&nbsp;&nbsp;不循环";
                } else {
                    sendTypeStr = "直接发送&nbsp;&nbsp;";
                    sendTypeVal = $(".loopType").val();
                    sendTypeStr += $(".loopType").find("option:selected").text();

                    html += '<div class="view-time-row"><span class="confirm-key"></span>' +
                        '<span class="confirm-value direct-first-send-time" data-time="' + widget.getTimeByTimeType({"isNow": true}) + '">' +
                        '首次发送时间：' + widget.getTimeByTimeType({"isNow": true}) +
                        '</span>' +
                        '</div>';
                    html += '<div class="view-time-row"><span class="confirm-key"></span>' +
                        '<span class="confirm-value direct-second-send-time" data-time="' + widget.getTimeByTimeType({"sendTypeVal": sendTypeVal}) + '">' +
                        '二次发送时间：' + widget.getTimeByTimeType({"sendTypeVal": sendTypeVal}) +
                        '</span>' +
                        '</div>';
                }
            } else {
                var startTime = $(".sendTiming").val();
                if (widget.DEFAULFS.loopType === 1) {//不循环
                    sendTypeStr = "定时发送&nbsp;&nbsp;不循环";

                    html += '<div class="view-time-row"><span class="confirm-key"></span>' +
                        '<span class="confirm-value">' +
                        '发送时间：' + startTime +
                        '</span>' +
                        '</div>';
                } else {
                    sendTypeStr = "定时发送&nbsp;&nbsp;";
                    sendTypeVal = $(".loopType").val();
                    sendTypeStr += $(".loopType").find("option:selected").text();

                    html += '<div class="view-time-row"><span class="confirm-key"></span>' +
                        '<span class="confirm-value timing-first-send-time" data-time="' + startTime + '">' +
                        '首次发送时间：' + startTime +
                        '</span>' +
                        '</div>';
                    html += '<div class="view-time-row"><span class="confirm-key"></span>' +
                        '<span class="confirm-value timing-seconed-send-time">' +
                        '二次发送时间：' + widget.getTimeByTimeType({"startTime": startTime, "sendTypeVal": sendTypeVal}) +
                        '</span>' +
                        '</div>';
                }
            }
            $("#confirmMass").find(".val-send-type").after(html);
            $("#confirmMass").find(".val-send-type").html(sendTypeStr);
            $("#confirmMass").modal("show");
        } else {
            $("#confirmMass").find(".val-signatrue").closest(".row").hide();
            $("#confirmMass").find(".val-channel-title").html($("#title").val());
            $("#confirmMass").find(".val-content").html($(".wx-content-input").val());
            $("#confirmMass").find(".val-channel-type").html("微信");
            //判断是全部客户还是客户群
            if ($(".targetType").val() === "1") {

                $("#confirmMass").find(".val-send-target").html("全部微信粉丝");

            } else if ($(".targetType").val() === "2") {
                $("#confirmMass").find(".val-send-target").html($(".contactGroupList").find("option:selected").text());
            }
            var startTime = $(".sendTiming").val();
            if (widget.DEFAULFS.sendType === 1) {//直接发送
                sendTypeStr = "直接发送";
                //html += '<div class="row"><span class="confirm-key"></span>' +
                //    '<span class="confirm-value">' +
                //    '发送时间：' + widget.getTimeByTimeType({"isNow": true}) +
                //    '</span>' +
                //    '</div>';
            } else {
                var startTime = $(".sendTiming").val();
                if (widget.DEFAULFS.loopType === 1) {//不循环
                    sendTypeStr = "定时发送";

                    html += '<div class="row"><span class="confirm-key"></span>' +
                        '<span class="confirm-value">' +
                        '发送时间：' + startTime +
                        '</span>' +
                        '</div>';
                }
            }

            $("#confirmMass").find(".val-send-type").after(html);
            $("#confirmMass").find(".val-send-type").html(sendTypeStr);
            $("#confirmMass").modal("show");
        }
    },
    getTimeByTimeType: function (options) {
        var no = 0;
        switch (options.sendTypeVal) {
            case "day":
                no = 1;
                break;
            case "week":
                no = 7;
                break;
            case "month":
                no = 30;
                break;
        }
        var date = new Date();
        var hour = "";
        //设置开始时间
        if (options.startTime) {
            var y = options.startTime.split(" ")[0];
            var t = options.startTime.split(" ")[1];
            var year = Number(y.split("-")[0]);
            var month = Number(y.split("-")[1]);
            var day = Number(y.split("-")[2]);
            hour = Number(t.split(":")[0]);
            date.setFullYear(year);
            date.setMonth(month - 1);
            date.setDate(day + no);
        } else {
            hour = date.getHours();
            date.setDate(date.getDate() + no);
        }

        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;

        var strDate = date.getDate();
        if (options.isNow) {
            var min = date.getMinutes();
            var sec = date.getSeconds();
        } else {
            var min = 0;
            var sec = 0;
        }
        if (hour >= 1 && hour <= 9) {
            hour = "0" + hour;
        }

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
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
    }
}


//---------------------------------------支付相关----------------
function openRechargeModal() {
    $("#rechargeModal").modal("show");
    $("#payQRArea").hide();
    $("#payState").hide();
    $("#rechargeItems").show();
    for (var i = 0; i < $(".recharge-mask").length; i++) {
        $($(".recharge-mask")[i]).removeClass("active");
    }
    //$("#rechargeModal .recharge-mask").removeClass("actvie");
    $("#rechargeModal .recharge-mask:first").addClass("active");
    //支付相关变量
    widget.DEFAULFS.payObj = {
        "msgNum": 50,
        "msgMoney": 5,
        "orderNo": ""
    }
}
var ip = returnCitySN["cip"];
var timer;
//click支付
function goPay(e) {
    //todo需要乘以100
    //var money = (widget.DEFAULFS.payObj.msgMoney)*100;
    var money = 10;
    var paramObj = {
        "tenantId": Iptools.DEFAULTS.tenantId,
        "channel": "wx_pub_qr",
        "clientIp": ip,
        "amount": money,
        "subject": "易掌客短信充值",
        "payBody": "易掌客短信充值" + widget.DEFAULFS.payObj.msgNum + "条",
        "item.name": "msg",
        "item.counter": widget.DEFAULFS.payObj.msgNum,
        "token": Iptools.DEFAULTS.token
    }
    Iptools.PostJson({
        url: "basic/createOrder",
        data: paramObj,
        async: false,
    }).done(function (data) {
        if (data.retcode === "ok") {
            $(".wx_mobile_qr").empty();
            //生成支付二维码
            $(".wx_mobile_qr").qrcode({
                render: "canvas", //table方式
                width: 150, //宽度
                height: 150, //高度
                correctLevel: 3,
                text: data.charge.credential.wx_pub_qr //任意内容
            });
            widget.DEFAULFS.payObj.orderNo = data.charge.orderNo;
            $("#rechargeModal .modal-title").html("支付方式");
            $("#payQRArea").show();
            $("#rechargeItems").hide();
            //调用支付是否成功接口查看支付状态
            timer = setInterval(function () {
                getPayState(widget.DEFAULFS.payObj.orderNo)
            }, 2000);
        }
    })
}

//查看是否完成付款
function getPayState(orderNo) {
    Iptools.GetJson({
        url: "basic/tenantOrders/isPaid",
        data: {
            "tenantId": Iptools.DEFAULTS.tenantId,
            //"token":Iptools.DEFAULTS.token,
            "orderNo": orderNo
        },
        async: false,
    }).done(function (data) {
        if (data === false) {
        } else {
            $("#payQRArea").hide();
            $("#payState").show();
            $(".pay_success").show();
            //关闭计时器
            clearInterval(timer);
            //刷新短信剩余条数
            widget.getMsgNum();
            $(".group_note").html("");
        }
    })
}
//取消支付
function preStep() {
    $("#rechargeModal .modal-title").html("短信充值");
    $("#payQRArea").hide();
    $("#payState").hide();
    $("#rechargeItems").show();
    //关闭计时器--不在调取是否支付成功接口
    clearInterval(timer);
}
//---------------------------------------支付相关-end---------------
//打开预览modal
function openPreviewModal() {
    //标题
    var title = $("#title").val();
    if (title === "" || title.length === 0 || title.length > 49) {
        $("#title").closest("div").find(".title_note").css("color", "red");
        return false;
    }
    if ($(".sendContent").val() === "") {
        $(".content_note").show();
        return false;
    }
    var top = $("#preview").height() / 2 - $("#preview .modal-content").height();
    $("#preview .modal-content").css("margin-top", "425px");
    //短信签名为空或短信签名字符大于5
    if ($(".msgSig").val() === "" || $(".msgSig").val().length < 3 || $(".msgSig").val().length > 8) {
        $(".msgSignature .sig_note").css("color", "red");
        return false;
    } else {
        $(".msgSignature .sig_note").css("color", "rgb(160, 150, 150)");
    }
    //剩余短信条数大于本次发送条数
    if (parseInt($(".msgNum").html()) === 0) {
        Iptools.Tool.pAlert({
            type: "danger",
            title: "系统提示：",
            content: "剩余短信条数不足，请充值！",
            delay: 1000
        });
        return false;
    } else if (parseInt($(".contactCount").html()) > parseInt($(".msgNum").html())) {
        Iptools.Tool.pAlert({
            type: "danger",
            title: "系统提示：",
            content: "剩余短信条数不足，请充值！",
            delay: 1000
        });
        return false;
    }
    $("#preview").modal("show");
}
//重写checkfocus 获取焦点方法，需要把.checkfocus的border更改颜色
$(".checkfocus").focus(function () {
    //$(this).css("border","1px solid rgb(169, 169, 169)");
    if ($(this).hasClass("sendContent")) {
        //$(this).parent().find(".showWordNum").show();
        $(this).parent().find(".content_note").hide();
    } else {
        $(this).closest("div").find("span").css("color", "rgb(160, 150, 150)");
    }
})
$(".sendTiming").focus(function () {
    $(this).closest(".col-md-4").find(".sendTime_note").html("&nbsp;");
    var d = widget.getTimeByTimeType({"isNow": true});
    var formatd = d.split(" ")[0];
    if (formatd !== "") {
        $('.sendTiming').datetimepicker('setStartDate', formatd);
    }
})
//更新or新增活动
function updateAndNewAct(e, phoneNum, isPreview) {
    if (!isPreview) {
        //标题
        var title = $("#title").val();
        if (title === "" || title.length === 0 || title.length > 49) {
            $("#title").closest("div").find(".title_note").css("color", "red");
            return false;
        }
        var channelType = widget.DEFAULFS.channelType;//1,短信，0，微信
        if (channelType === 1) {
            //check发送内容和短信签名是否都填写
            if ($(".sendContent").val() === "") {
                $(".content_note").show();
                return false;
            }
        } else {
            //check群发文本
            if ($(".wx-content-input").val() === "" || $(".wx-content-input").val().length > 599) {
                $(".wx_content_note").show();
                return false;
            }
        }

        //短信签名为空或短信签名字符大于3小于8
        if ($(".msgSig").val() === "" || $(".msgSig").val().length < 3 || $(".msgSig").val().length > 8) {
            //$(".msgSig").css("border","1px solid red");
            $(".msgSignature .sig_note").css("color", "red");
            return false;
        }

        //群发
        //发送对象和抄送对象的手机号不能都为空
        if (Number($(".targetNum").html()) === 0 && widget.DEFAULFS.groupPhone.length === 0) {
            $(".target_note").css("color", "red");
            return false;
        }
        //剩余短信条数大于本次发送条数
        if (parseInt($(".msgNum").html()) === 0) {
            //$(".group_note").html("剩余短信条数不足，请充值");
            Iptools.Tool.pAlert({
                type: "danger",
                title: "系统提示：",
                content: "剩余短信条数不足，请充值！",
                delay: 1000
            });
            return false;
        } else if (parseInt($(".contactCount").html()) > parseInt($(".msgNum").html())) {
            //$(".group_note").html("剩余短信条数不足，请充值");
            Iptools.Tool.pAlert({
                type: "danger",
                title: "系统提示：",
                content: "剩余短信条数不足，请充值！",
                delay: 1000
            });
            return false;
        }
        //直接发送or定时发送
        var sendNow = widget.DEFAULFS.sendType;
        // 定时发送传递发送时间
        var release_time = "";
        if (sendNow === 0) {
            release_time = $(".sendTiming").val();
            if (release_time === "") {
                $(".sendTime_note").html("必填");
                return false;
            }
        } else {
            release_time = "";
            $(".sendTiming").val("");
        }
    }

    //构建筛选条件
    widget.DEFAULFS.conditionStr.length = 0;
    widget.buildConditionStr();


    if (!isPreview) {
        widget.showComfirmModal();
    }

    widget.DEFAULFS.commitDataObj = {
        "e": e,
        "sendNow": sendNow,
        "release_time": release_time,
        "phoneNum": phoneNum,
        "isPreview": isPreview
    };
}
//提交群发
function commitData() {
    var options = widget.DEFAULFS.commitDataObj;
    var paramStr = "";
    var paramData = {
        "appletId": widget.DEFAULFS.appletId,
        //async: false,
    }
    //获得前缀
    Iptools.uidataTool._getApplet({
        "applet": widget.DEFAULFS.appletId,
        async: false,
    }).done(function (data) {
        prefix = data.rootLink;
    })

    paramStr += '{';
    //如果是预览只post--title，content
    if (!options.isPreview) {
        //定时
        if (options.sendNow === 0) {
            paramStr += "\"" + prefix + ":sendnow\":\"0\",";
            if (options.release_time !== "") {
                paramStr += "\"" + prefix + ":release_time\":\"" + options.release_time + "\",";
            }
            //短信群发可以设置是否循环
            if (widget.DEFAULFS.channelType === 1) {
                //循环
                if (widget.DEFAULFS.loopType === 0) {
                    paramStr += "\"" + prefix + ":is_repeat\":\"1\",";
                    var loopVal = $(".loopType").val();
                    if (loopVal === "day") {
                        paramStr += "\"" + prefix + ":repeat_type\":\"1\",";//1,每天，2，每周，3，每月
                    } else if (loopVal === "week") {
                        paramStr += "\"" + prefix + ":repeat_type\":\"2\",";//1,每天，2，每周，3，每月
                    } else if (loopVal === "month") {
                        paramStr += "\"" + prefix + ":repeat_type\":\"3\",";//1,每天，2，每周，3，每月
                    }
                } else if (widget.DEFAULFS.loopType === 1) {
                    paramStr += "\"" + prefix + ":is_repeat\":\"0\",";
                }
            }

        } else if (options.sendNow === 1) { //直接
            /*
             * releaseTime精确到小时，分钟和秒都置为0
             * */
            var now = $(".direct-first-send-time").attr("data-time");
            //短信群发可以设置是否循环，直接发送且循环的群发比较特殊
            if (widget.DEFAULFS.channelType === 1) {
                //循环
                if (widget.DEFAULFS.loopType === 0) {
                    widget.DEFAULFS.directPostNo--;
                    paramStr += "\"" + prefix + ":sendnow\":\"0\",";
                    var date = now.split(" ")[0];
                    var time = now.split(" ")[1];
                    var hour = time.split(":")[0];
                    var releaseTime = date + " " + hour + ":00:00";
                    paramStr += "\"" + prefix + ":release_time\":\"" + releaseTime + "\",";

                    paramStr += "\"" + prefix + ":is_repeat\":\"1\",";
                    var loopVal = $(".loopType").val();
                    if (loopVal === "day") {
                        paramStr += "\"" + prefix + ":repeat_type\":\"1\",";//1,每天，2，每周，3，每月
                    } else if (loopVal === "week") {
                        paramStr += "\"" + prefix + ":repeat_type\":\"2\",";//1,每天，2，每周，3，每月
                    } else if (loopVal === "month") {
                        paramStr += "\"" + prefix + ":repeat_type\":\"3\",";//1,每天，2，每周，3，每月
                    }
                } else if (widget.DEFAULFS.loopType === 1) {
                    paramStr += "\"" + prefix + ":sendnow\":\"" + options.sendNow + "\",";
                    paramStr += "\"" + prefix + ":release_time\":\"" + widget.getTimeByTimeType({"isNow": true}) + "\",";
                    paramStr += "\"" + prefix + ":is_repeat\":\"0\",";
                }
            } else {
                paramStr += "\"" + prefix + ":sendnow\":\"" + options.sendNow + "\",";
                paramStr += "\"" + prefix + ":release_time\":\"" + widget.getTimeByTimeType({"isNow": true}) + "\",";
            }

        }
    }
    paramStr += "\"" + prefix + ":msg_status\":\"1\",";
    //channel_type 1，短信，2，微信
    if (widget.DEFAULFS.channelType === 1) {
        paramStr += "\"" + prefix + ":channel_type\":\"1\",";
        paramStr += "\"" + prefix + ":msg_content\":\'" + $(".msgBox").html() + "\',";
    } else {
        paramStr += "\"" + prefix + ":channel_type\":\"2\",";
        paramStr += "\"" + prefix + ":msg_content\":\'" + $(".wx-content-input").val() + "\',";
    }

    paramStr += "\"" + prefix + ":title\":\"" + $("#title").val() + "\",";

    if (widget.DEFAULFS.campaignValueId !== "") {
        paramStr += "\"" + prefix + ":campaign_id\":\"" + widget.DEFAULFS.campaignValueId + "\",";
    }


    var targetType = $(".targetType").val();
    if (!options.isPreview) {
        //全部用户
        if (targetType === "1") {
            var contactType = $("[data-column='contact:contacttype']").val();
            var conditionJsonStr = "";
            if (contactType === "-1") {
                conditionJsonStr += "{";
                conditionJsonStr += "\'contactType\':\' in (2,3,4)\'";
                conditionJsonStr += "}";
            } else if (contactType === "2") {
                conditionJsonStr += "{";
                conditionJsonStr += "\'contactType\':\' =2\'";
                conditionJsonStr += "}";
            } else if (contactType === "3") {
                conditionJsonStr += "{";
                conditionJsonStr += "\'contactType\':\' =3\'";
                conditionJsonStr += "}";
            } else if (contactType === "4") {
                conditionJsonStr += "{";
                conditionJsonStr += "\'contactType\':\' =4\'";
                conditionJsonStr += "}";
            }
            //channel_type 1，短信，2，微信
            if (widget.DEFAULFS.channelType === 1) {
                widget.DEFAULFS.conditionStr.splice(0, 0, "全部客户");
            } else {
                widget.DEFAULFS.conditionStr.splice(0, 0, "全部微信粉丝");
                paramStr += "\"" + prefix + ":is_all_wxfans\":\"1\",";
            }
            if (conditionJsonStr !== "") {
                paramStr += "\"" + prefix + ":filter_condition_json\":\"" + conditionJsonStr + "\",";
            }

        } else if (targetType === "2") {//按客户群筛选
            paramStr += "\"" + prefix + ":target_group\":\"" + widget.DEFAULFS.groupValueId + "\",";
        }
        //发送对象
        //paramStr += "\""+prefix+":target_phone_list\":\""+widget.DEFAULFS.setGroupPhone.join(",")+"\",";
        //筛选条件
        paramStr += "\"" + prefix + ":filter_condition\":\"" + widget.DEFAULFS.conditionStr.join("/") + "\",";
        //短信才会有抄送
        if (widget.DEFAULFS.channelType === 1) {
            //抄送手机号
            paramStr += "\"" + prefix + ":cc_phone_list\":\"" + widget.DEFAULFS.groupPhone.join(",") + "\"";
        } else {
            //抄送手机号
            paramStr += "\"" + prefix + ":cc_phone_list\":\"\"";
        }

    } else {
        paramStr += "\"" + prefix + ":cc_phone_list\":\"" + options.phoneNum + "\"";
    }
    paramStr += "}";
    paramData["fieldData"] = paramStr;
    // return false;
    var ajaxType;
    if (!widget.DEFAULFS.channelValueId) {
        ajaxType = "post";
    } else {
        ajaxType = "put";
        paramData["valueId"] = widget.DEFAULFS.channelValueId;
    }
    paramData["token"] = Iptools.DEFAULTS.token;
    //跟新或者提交短信签名
    updateAndNewMsgSignature($(".msgSig").val());
    $.ajax({
        url: API_URL + "service/appletData",
        data: paramData,
        async: false,
        type: ajaxType,
        success: function (data) {

            if (data.retcode !== "fail") {
                valueId = data.id;
                channelValueId = data.id ? data.id : channelValueId;
                //推送短信start
                if ($(options.e).hasClass("sendGroup")) {
                    widget.DEFAULFS.conditionStr;

                    if (widget.DEFAULFS.campaignValueId !== "") {
                        //客户群里插入一条动态
                        Iptools.uidataTool._addAppletData({
                            appletId: widget.DEFAULFS.contactGroupTraceApplet,
                            data: '{"' + widget.DEFAULFS.GroupRootId + ':title":"' + getThisTabVars("campaignName") + '","' + widget.DEFAULFS.GroupRootId + ':contactgroup_id":"' + widget.DEFAULFS.groupValueId + '","' + widget.DEFAULFS.GroupRootId + ':trace_type":"1","' + widget.DEFAULFS.GroupRootId + ':value_id":"' + widget.DEFAULFS.campaignValueId + '"}',
                            async: false,
                        }).done(function (data) {

                        })
                    }

                    //直接发送循环，需要post两次，先post循环的，再post一条直接发送的时间，且不循环
                    if (widget.DEFAULFS.directPostNo === 1) {
                        widget.DEFAULFS.loopType = 1;
                        widget.DEFAULFS.directPostNo--;
                        commitData();
                    } else {
                        //直接发送，且不循环
                        if (widget.DEFAULFS.sendType === 1 && widget.DEFAULFS.loopType === 1) {
                            sendNow(valueId);
                        }
                        //微信直接发送
                        if (widget.DEFAULFS.sendType === 1 && widget.DEFAULFS.channelType === 0) {
                            sendNow(valueId);
                        }
                        if (widget.DEFAULFS.directPostNo === 0) {
                            widget.DEFAULFS.loopType = 0;
                        }

                        Iptools.Tool.pAlert({
                            type: "info",
                            title: "系统提示：",
                            content: "发送成功",
                            delay: 1000
                        });
                        widget.getMsgNum();
                        widget.DEFAULFS.commitDataObj = {};
                        widget.DEFAULFS.directPostNo = 2;
                        $("#confirmMass").modal("hide");


                        jumpListView();
                    }

                } else {
                    //commitSend(channelValueId, options.phoneNum);
                    sendNow(valueId);
                    widget.getMsgNum();
                    Iptools.Tool.pAlert({
                        type: "info",
                        title: "系统提示：",
                        content: "发送成功",
                        delay: 1000
                    });

                    $("#confirmMass").modal("hide");
                    jumpListView();
                }
            } else {
                $("#confirmMass").modal("hide");

                Iptools.Tool.pAlert({
                    type: "danger",
                    title: "系统提示：",
                    content: data.retmsg,
                    delay: 1000
                });
            }
        }
    })
}
function jumpListView() {
    var viewobj = {
        "nameList": "\"campaign publish page\"",
        async: false
    }
    if (Iptools.Tool._getVersion() == 'v1') {
        var valId;
        if (Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewValue)) {
            valId = Iptools.DEFAULTS.currentViewValue;
        }
        //跳详情
        Iptools.uidataTool._getView({
            view: Iptools.DEFAULTS.currentView,
            //async: false
        }).done(function (r) {
            Iptools.Tool._CloseTab({
                view: Iptools.DEFAULTS.currentView,
                name: r.view.name,
                valueId: valId,
                type: r.view.type,
                url: r.view.url,
                bread: true
            });

            Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
                Iptools.uidataTool._getView({
                    view: thisView.views[0].view,
                }).done(function (data) {
                    Iptools.Tool._jumpView({
                        view: thisView.views[0].view,
                        name: data.view.name,// + ">" + title,
                        type: data.view.type,
                        valueId: campaignId,
                        primary: data.view.primary,
                        icon: data.view.icon,
                        url: data.view.url,
                        bread: true,
                        refresh: true
                    });
                });
            })

        })

    } else {
        Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
            Iptools.uidataTool._getView({
                view: thisView.views[0].view,
                async: false
            }).done(function (json) {
                Iptools.uidataTool._getView({
                    view: Iptools.DEFAULTS.currentView,
                    //async:false
                }).done(function (data) {
                    var valId;
                    if (Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewValue)) {
                        valId = Iptools.DEFAULTS.currentViewValue;
                    }
                    Iptools.Tool._CloseTab({
                        view: Iptools.DEFAULTS.currentView,
                        name: data.view.name,
                        valueId: valId,
                        type: data.view.type,
                        url: data.view.url,
                        //valueId:Iptools.DEFAULTS.currentViewValue
                    }, null, {
                        //Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
                        //    Iptools.uidataTool._getView({
                        //        view: thisView.views[0].view,
                        //        async: false
                        //    }).done(function (data) {
                        //Iptools.Tool._jumpView({
                            view: thisView.views[0].view,
                            name: json.view.name,// + ">" + title,
                            type: json.view.type,
                            primary: json.view.primary,
                            icon: json.view.icon,
                            url: json.view.url,
                            bread: true,
                            refresh: true
                        //});
                        //    })
                        //})
                    });
                })
            })
        })

    }
    ;
}
function sendNow(channelId) {
    var paramData = {
        "token": Iptools.DEFAULTS.token,
        "channelId": channelId
    }
    Iptools.PostJson({
        url: "basic/sendNow",
        data: paramData,
    }).done(function (data) {
        if (data) {
            console.log("直接发送成功");
        }
    })
}
//更新此活动的客户群
function updateContactGroupToCampaign() {
    var groupId = $(".target_group").val();
    if (groupId === "-1") {
        $(".group_note").html("请选择客户群");
        return false;
    }
    var op = {async: false, "nameList": '\"Campaign Detail Applet\"'};
    var campaignApplet;
    Iptools.uidataTool._getCustomizeApplet(op).done(function (data) {
        campaignApplet = data.applets[0].applet;
    })
    var prefix;
    //更新or新增活动
    var paramStr = "";
    var paramData = {
        "appletId": campaignApplet
    }
    //获取前缀。。
    Iptools.uidataTool._getApplet({
        "appletId": campaignApplet,
        async: false,
    }).done(function (data) {
        prefix = data.rootLink;
    })

    paramStr += '{';
    paramStr += "\"" + prefix + ":target_group\":" + groupId + "";
    paramStr += "}";
    paramData["data"] = paramStr;
    paramData["async"] = false;
    var ajaxType;

    ajaxType = "put";
    isCreate = false;
    paramData["valueId"] = widget.DEFAULFS.campaignValueId;
    // createOrNewH5();
    //新建活动
    Iptools.uidataTool._saveAppletData(paramData).done(function (data) {
        if (data) {

        }
    })
}
//clear forminput
function clearFormInput() {
    $(".sendContent").val("");
    $(".sendTiming").val("");
}
//预览一下
function mobilePreview(e) {
    var phoneNum = $(e).parents("#preview").find(".phoneNum").val();
    if (checkPhoneNum(phoneNum)) {
        //true表示预览
        updateAndNewAct(e, phoneNum, true);
        $("#commitData").trigger("click");
        $("#preview").modal("hide");
    } else {
        $(".telError").show();
        return false;
    }
    ;
}
$(".phoneNum").focus(function () {
    $(".telError").hide();
})
//给单一号码发送短信进行预览
//function commitSend(channelValueId, phoneNum) {
//    var paramData = {
//        "token": Iptools.DEFAULTS.token,
//        "campaignChannelId": channelValueId,
//        "phone": phoneNum
//    }
//    Iptools.PostJson({
//        //ajaxCounting:false,
//        url: "basic/campaigns/preSend",
//        data: paramData,
//        async: false,
//    }).done(function (data) {
//        if (data) {
//            $("#preview").modal("hide");
//        }
//    })
//}

//put or post 短信签名
function updateAndNewMsgSignature(sigVal) {
    var successFlag = true;
    var ajaxType;
    var paramStr = "";
    var paramData = {
        //tenantId:Iptools.DEFAULTS.tenantId,
        token: Iptools.DEFAULTS.token,
        "dictId": "smsSignature",
        "dictIdName": sigVal,
        "dictValue": sigVal
    }
    if (widget.DEFAULFS.magSignatureId === "") {
        ajaxType = "post";
    } else {
        //如果没有改变短信签名的值,则不做更新
        if (sigVal === "magSignature") {
            return false;
        }
        ajaxType = "put";
        paramData["id"] = widget.DEFAULFS.magSignatureId;
    }
    $.ajax({
        url: API_URL + "basic/tenantDictConfs",
        data: paramData,
        type: ajaxType,
        async: false,
        success: function (data) {
            if (data) {
                widget.DEFAULFS.magSignature = data.dictValue;
                widget.DEFAULFS.magSignatureId = data.id;
                successFlag = true;
            } else {
                successFlag = false;
            }
        }
    })
    return successFlag;
}

//点击直接群发短信
function sendGroupMag() {
    if (checkFormItems()) {
        //检查所选客户群人数是否小于短信剩余条数
        var groupCount = $(".target_group option[value=" + $(".target_group").val() + "]").attr("data-val");
        var msgNum = $(".msgNum").html();
        if (parseInt(groupCount) > parseInt(msgNum)) {
            $(".sendType").find(".errorNote").html("*短信条数不足");
            return false;
        }
        $("#confirmMass .modal-body").html("");
        var html = "";
        //如果定时发送是选中状态且发送时间无值
        if ($(".sendTiming").val() === "" && $(".timing").prop("checked") === true) {
            alert("请填写发送时间");
            return false;
        } else if ($(".sendTiming").val() != "" && $(".timing").prop("checked") === true) {

            html = '<div style="color:red">' +
                '活动信息将于' +
                '<span style="margin:0 3px">' + $(".sendTiming").val() + '</span>自动发送，是否发送？</div>' +
                '</div>';
            $("#confirmMass .modal-body").append(html);
            $("#confirmMass").modal('show');
        } else {
            html = "活动信息将直接群发，是否继续？";
            $("#confirmMass .modal-body").append(html);
            $("#confirmMass").modal('show');
        }
    }
}

//点击定时发送和直接发送隐藏相关input
$("input[name=sendNow]").on("click", function () {
    if ($(this).hasClass("timing")) {//定时
        widget.DEFAULFS.sendType = 0;
        $(".sendTime").show();
    } else {
        widget.DEFAULFS.sendType = 1;
        $(".control-loop-time .loop-time").html("");
        $(".sendTime").hide();
    }
})
//点击短信和微信切换
$("input[name=channel]").on("click", function () {
    if ($(this).hasClass("wx")) {
        $(".redcolor").show();
        $(".msgSignature").hide();
    } else {
        $(".redcolor").hide();
        $(".msgSignature").show();
    }
})
//选择某一活动
function selecttThisCampaign(e) {
    var preUrl = widget.DEFAULFS.sessionObj.campaignUrl;//之前的url需要删除
    widget.DEFAULFS.selectedCampaign = $(e).val();
//    $(".viewDress").empty();
    var campaignUrl = $(e).find("option:selected").attr("data-url");
    var campaignId = $(e).find("option:selected").attr("data-pid");
    widget.DEFAULFS.campaignValueId = campaignId;

    //判断h5是哪种类型
    var data = {
        async: false,
        "nameList": '\"Campaign Detail Applet\"'
    }

    var msgContent = $("#msg_content").val();
    var url = campaignUrl.replace("http://", "");
    widget.DEFAULFS.sessionObj.campaignUrl = url;
    //短信
    if (widget.DEFAULFS.channelType === 1) {
        widget.syncPreviewContent();
    } else {
        //var re = new RegExp(preUrl, 'g');
        $(".wx-content-input").val($(".wx-content-input").val().split(preUrl).join(""));
        $(".wx-content-input").val($(".wx-content-input").val() + url);
        $(".wx-content-input").trigger("input");
    }

}
//获取所选客户群人数
function getContactGroupNum() {
    var groupId = getThisTabVars("target_groupId");
    //全部
    if (groupId === "0") {
        Iptools.GetJson({
            url: "basic/contactsCount?token=" + Iptools.DEFAULTS.token,
        }).done(function () {
            if (data) {
                $(".contactCount").html(data);
            }
        })
    } else if (groupId === "-1") {
        $(".contactCount").html("0");
    } else {
        Iptools.GetJson({
            url: "basic/contactgroups/" + groupId + "?token=" + Iptools.DEFAULTS.token,
        }).done(function (data) {
            if (data) {
                $(".contactCount").html(data.contactCount);
            }
        })
    }

}
//复制链接
function copyUrl() {
    //var Url2=document.getElementById("tenantNum");
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(".viewDress").text()).select();
    document.execCommand("copy");
    $temp.remove()
}
//选择要发送的客户群
function choseThisContactGroup(e) {
    setThisTabVars("target_groupId", $(e).val());
    widget.DEFAULFS.groupValueId = $(e).val();
    getContactGroupNum();
    $(".group_note").html("&nbsp;");
}