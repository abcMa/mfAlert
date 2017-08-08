var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        selectPosPanel: ".pos_select_tree",
        personForm: "#person_edit_form",
        nodeId: 1,
        uuId:"",
        res:"",
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
    _setOrgTreeNode: function (data) {
        var res = [];
        if (data && data.length) {
            $.each(data, function (key, obj) {
                var node = {
                    "id": widget._UIDEFAULFS.nodeId++,
                    "oid": obj.id,
                    "text": obj.viewName,
                    "state": { "opened": false },
                    "icon": "icon-sitemap org-node",
                    "type": "org",
                    "children": []
                };
                if (obj.nodes && obj.nodes.length) {
                    var onodes = widget._setOrgTreeNode(obj.nodes);
                    for (var j = 0; j < onodes.length; j++) {
                        node.children.push(onodes[j]);
                    }
                }
                res.push(node);
            });
        }
        return res;
    },
    _setPosTreeNode: function (data) {
        var res = [];
        if (data && data.length) {
            $.each(data, function (key, obj) {
                var node = {
                    "id": widget._UIDEFAULFS.nodeId++,
                    "pid": obj.id,
                    "text": obj.viewName,
                    "state": { "opened": false },
                    "icon": "icon-group pos-node",
                    "type": "pos",
                    "children": []
                };
                if (obj.nodes && obj.nodes.length) {
                    node.children = widget._setPosTreeNode(obj.nodes);
                }
                res.push(node);
            });
        }
        return res;
    },
    _bindingDomEvent: function () {
        widget._enableBackWard();
        widget._enableSaving();
        widget._enablePhoneToLogin();
    },
    _bindingEventAfterLoad: function () {

    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setFormValidate();
        widget._setPersonInfo();
        widget._setPosNewSelectTree();
        widget._bindingEventAfterLoad();
    },
    _setFormValidate: function () {
        $(widget._UIDEFAULFS.personForm).bootstrapValidator({
            fields: {
                person_name: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                    }
                },
                person_phone: {
                    validators: {
                        notEmpty: {
                            message: '请输入手机号码'
                        },
                        //regexp: {
                        //    regexp: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                        //    message: "请输入正确的手机号码"
                        //}
                    }
                },
                person_org: {
                    validators: {
                        notEmpty: {
                            message: '请选择职位'
                        },
                    }
                },
                person_res: {
                    validators: {
                        notEmpty: {
                            message: '请选择权限'
                        },
                    }
                },
                person_login: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                    }
                },
                person_pwd: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                    }
                }
            }
        });
    },
    //得到该员工的基本信息
    _setPersonInfo: function () {
        if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "selectUser" }))) {
            Iptools.GetJson({
                url: "basic/getEmployee",
                data: {
                    token: Iptools.DEFAULTS.token,
                    id:Iptools.getDefaults({ key: "selectUser" })
                },
            }).done(function (r) {
                if(r){
                    //console.log(r);
                    $("#person_name").val(r.name);
                    $("#person_phone").val(r.phone);
                    $("#person_email").val(r.email);
                    $("#person_login").val(r.loginName);
                    $("#person_identity").val(r.identity);
                    $("#person_pwd").parent().hide();
                    if (Iptools.Tool._checkNull(r.headPic)) {
                        $("#person_head_pic").attr("src", r.headPic);
                    }
                    $("#person_status option").each(function (key, obj) {
                        if ($(obj).attr("value") == r.status) {
                            $(obj).attr("selected", "selected");
                        }
                    });
                    $("#person_gender option").each(function (key, obj) {
                        if ($(obj).attr("value") == r.gender) {
                            $(obj).attr("selected", "selected");
                        }
                    });

                    Iptools.DEFAULTS.organization = r.organization;
                    Iptools.DEFAULTS.position = r.position;
                    Iptools.GetJson({
                        url: "basic/queryResListByEmpId",
                        data: {
                            token: Iptools.DEFAULTS.token,
                        },
                    }).done(function (s) {
                        if(s){
                            if (s && s.length) {
                                Iptools.DEFAULTS.res = s[0].resId; // uuid
                                widget._UIDEFAULFS.res = s[0].resId
                                Iptools.DEFAULTS.resId = s[0].linkId;
                                Iptools.GetJson({
                                    url: "basic/responsibilitys",
                                    data: {
                                        token: Iptools.DEFAULTS.token,
                                    },
                                }).done(function (r) {
                                    if(r){
                                        $.each(r, function (key, obj) {
                                            var op = document.createElement("option");
                                            $(op).attr("value", obj.uuid);
                                            if (obj.uuid == widget._UIDEFAULFS.res) {
                                                $(op).attr("selected", "selected");
                                            }
                                            widget._UIDEFAULFS.uuId = obj.uuid;
                                            $(op).html(obj.name);
                                            $("#person_res").append(op);
                                        });
                                    };
                                });
                            }
                        };
                    });
                };
            });
        }else{
            widget._setResponsibility();
        }
    },
    //获得员工权限
    _setResponsibility: function () {
        Iptools.GetJson({
            url: "basic/responsibilitys",
            data: {
                token: Iptools.DEFAULTS.token,
            },
        }).done(function (r) {
            if(r){
                //console.log(r);
                $.each(r, function (key, obj) {
                    var op = document.createElement("option");
                    $(op).attr("value", obj.uuid);
                    widget._UIDEFAULFS.uuId = obj.uuid;
                    $(op).html(obj.name);
                    $("#person_res").append(op);
                });
            };
        });
    },
    //得到部门
    _setPosNewSelectTree: function () {
        var nodesdata;
        //得到1级数据
        Iptools.GetJson({
            url: "basic/organization/treeview",
            data: {
                token: Iptools.DEFAULTS.token,
                userId: Iptools.DEFAULTS.userId,
            },
        }).done(function (r) {
            if(r){
                //console.log(r)
                nodesdata = widget._setOrgTreeNode(r, "selectorgnew");
                //console.log(nodesdata);
                $(widget._UIDEFAULFS.selectPosPanel).jstree({
                    'core': {
                        'data': nodesdata,
                        "check_callback": true,
                    },
                }).bind("loaded.jstree", function () {
                    var nodeId = 1;
                    var node = $(widget._UIDEFAULFS.selectPosPanel).jstree().get_node(nodeId);
                    //console.log(node)
                    if (node && node.original.type == "org" && nodeId < widget._UIDEFAULFS.nodeId) {
                        var data;
                        //得到二级数据
                        //console.log(node.original.oid)
                        Iptools.GetJson({
                            url: "basic/positions/treeview",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                //orgId: node.original.oid
                            },
                        }).done(function (r) {
                            //console.log(r)
                            if(r){
                                data = widget._setPosTreeNode(r);
                                if (data && data.length > 0) {
                                    for (var i = data.length - 1; i >= 0; i--) {
                                        $(widget._UIDEFAULFS.selectPosPanel).jstree().create_node(nodeId, data[i], "first");
                                    }
                                }
                                node = $(widget._UIDEFAULFS.selectPosPanel).jstree().get_node(++nodeId);
                                if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "selectUser" }))) {
                                    nodeId = 1;
                                    while (nodeId < widget._UIDEFAULFS.nodeId) {
                                        node = $(widget._UIDEFAULFS.selectPosPanel).jstree().get_node(nodeId);
                                        //console.log(node)
                                        if (node && node.original.type == "org" && node.original.oid == Iptools.DEFAULTS.organization) {
                                            $("#person_org").data("id", node.original.oid);
                                            $("#person_org").val(node.original.text);
                                        } else if (node && node.original.type == "pos" && node.original.pid == Iptools.DEFAULTS.position) {
                                            $("#person_pos").data("id", node.original.pid);
                                            $("#person_pos").html(node.original.text + "<span class='caret'></span>");
                                        }
                                        nodeId++;
                                    }
                                }
                            };
                        });
                    }
                }).bind("changed.jstree", function (e, data) {
                    //console.log(data)
                    if (data.node.original.type == "pos") {
                        $("#person_pos").data("id", data.node.original.pid);
                        $("#person_pos").html(data.node.original.text + "<span class='caret'></span>");
                        if (data.node.parents.length) {
                            for (var i = 0; i < data.node.parents.length; i++) {
                                var node = $(widget._UIDEFAULFS.selectPosPanel).jstree().get_node(data.node.parents[i]);
                                if (node && node.original.type == "org") {
                                    $("#person_org").data("id", node.original.oid);
                                    $("#person_org").val(node.original.text);
                                    break;
                                }
                            }
                        }
                    } else {
                        $("#person_pos").data("id", 0);
                        $("#person_pos").html("无<span class='caret'></span>");
                        $("#person_org").data("id", 0);
                        $("#person_org").val("");
                    }
                });
            };
        });
    },
    //点击返回按钮
    _enableBackWard: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#backward",
            event: function () {
                window.location.href = "index.html";
            },
        });
    },
    _enablePhoneToLogin: function () {
        widget._addEventListener({
            container: "body",
            type: "input",
            target: "#person_phone",
            event: function () {
                var me = $(this);

                $("#person_login").val(me.val());
                $("#person_edit_form").data('bootstrapValidator').validateField("person_phone");
                $("#person_edit_form").bootstrapValidator('validate');

            },
        });
    },
    //点击保存按钮
    _enableSaving: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#save_person",
            event: function () {
                $(widget._UIDEFAULFS.personForm).bootstrapValidator('validate');
                if ($(widget._UIDEFAULFS.personForm).data("bootstrapValidator").isValid()) {
                    if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "selectUser" }))) {
                        Iptools.PutJson({
                            url: "basic/employees",
                            data: {
                                id: Iptools.getDefaults({ key: "selectUser" }),
                                token: Iptools.DEFAULTS.token,
                                name: $("#person_name").val(),  //姓名
                                position: $("#person_pos").data("id"), //职位
                                organization: $("#person_org").data("id"),  //组织
                                loginName: $("#person_login").val(),  //登录名
                                phone: $("#person_phone").val(), //电话号码
                                email: $("#person_email").val(),  //邮箱
                                responsibilityId:widget._UIDEFAULFS.uuId, //uuid
                                status: $("#person_status").val(),   //状态
                                identity: $("#person_identity").val(),  //身份证
                                gender: $("#person_gender").val()  //性别
                            },
                        }).done(function (r) {
                            if(r){
                                if (r && r.retcode == "ok") {
                                    if (Iptools.Tool._checkNull(Iptools.DEFAULTS.resId)) {
                                        Iptools.PutJson({
                                            url: "basic/empResLinks",
                                            data: {
                                                token: Iptools.DEFAULTS.token,
                                                tenantId: Iptools.DEFAULTS.tenantId,
                                                empId: r.employeeId,
                                                resId: widget._UIDEFAULFS.uuId,
                                            },
                                        })
                                        Iptools.Tool.pAlert({
                                            type: "info",
                                            title: "系统提示",
                                            content: "保存完成",
                                            delay: 1000
                                        });
                                    } else {
                                        Iptools.PostJson({
                                            url: "basic/empResLinks",
                                            data: {
                                                token: Iptools.DEFAULTS.token,
                                                tenantId: Iptools.DEFAULTS.tenantId,
                                                empId: r.employeeId,
                                                resId: widget._UIDEFAULFS.uuId,
                                            },
                                        })
                                        Iptools.Tool.pAlert({
                                            type: "info",
                                            title: "系统提示",
                                            content: "保存完成",
                                            delay: 1000
                                        })
                                    }
                                } else if (r && r.retcode == "fail") {
                                    Iptools.Tool.pAlert({
                                        type: "danger",
                                        title: "系统提示",
                                        content: "登录名重复",
                                        delay: 1000
                                    });
                                }
                            };
                        }).fail(function () {
                            Iptools.Tool.pAlert({
                                type: "warning",
                                title: "系统提示",
                                content: "保存失败",
                                delay: 1000
                            });
                        })
                    } else {
                        Iptools.PostJson({
                            url: "basic/employees",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                name: $("#person_name").val(),
                                position: $("#person_pos").data("id"),
                                organization: $("#person_org").data("id"),
                                loginName: $("#person_login").val(),
                                loginPwd: $.md5($("#person_pwd").val()),
                                phone: $("#person_phone").val(),
                                email: $("#person_email").val(),
                                responsibilityId:Iptools.DEFAULTS.res,
                                status: $("#person_status").val(),
                                identity: $("#person_identity").val(),
                                gender: $("#person_gender").val()
                            },
                        }).done(function (r) {
                            if(r){
                                if (r && r.retcode == "ok") {
                                    Iptools.PostJson({
                                        url: "basic/empResLinks",
                                        data: {
                                            token: Iptools.DEFAULTS.token,
                                            tenantId: Iptools.DEFAULTS.tenantId,
                                            empId: r.employeeId,
                                            resId: widget._UIDEFAULFS.uuId,
                                        },
                                    }).done(function () {
                                        Iptools.Tool.pAlert({
                                            type: "info",
                                            title: "系统提示",
                                            content: "创建成功",
                                            delay: 1000
                                        })
                                        window.location.href = "index.html";
                                    });
                                } else if (r && r.retcode == "fail") {
                                    Iptools.Tool.pAlert({
                                        type: "danger",
                                        title: "系统提示",
                                        content: "登录名重复",
                                        delay: 1000
                                    });
                                }
                            };
                        }).fail(function () {
                            Iptools.Tool.pAlert({
                                type: "warning",
                                title: "系统提示",
                                content: "创建失败",
                                delay: 1000
                            });
                        })
                    }
                }
            },
        });
    }
}