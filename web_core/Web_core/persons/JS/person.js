var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        selectPosPanel: ".pos_select_tree",
        personForm: "#person_edit_form",
        nodeId: 1,
        treeData: []
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
    _personPhoneChange:function(){

        widget._addEventListener({
            container:"body",
            type:"input",
            target:"#person_phone",
            "event":function(){
                $("#person_login").val($(this).val());
            }
        })
    },
    _setPosNode: function (node) {
        if (node) {
            var rnode = {
                pid: node.id,
                text: node.viewName,
                state: { "opened": true },
                icon: "icon-user",
                type: "pos",
                children: []
            }
            if (Iptools.Tool._checkNull(node.posNodes) && node.posNodes.length) {
                for (var i = 0; i < node.posNodes.length; i++) {
                    rnode.children.push(widget._setPosNode(node.posNodes[i]));
                }
            }
            return rnode;
        }
        return {};
    },
    _setOrgNode: function (node, hasPos) {
        if (node) {
            var rnode = {
                oid: node.id,
                text: node.viewName,
                state: { "opened": false },
                icon: "icon-building",
                type: "org",
                children: []
            }
            if (hasPos && Iptools.Tool._checkNull(node.posNodes) && node.posNodes.length) {
                for (var i = 0; i < node.posNodes.length; i++) {
                    rnode.children.push(widget._setPosNode(node.posNodes[i]));
                }
            }
            if (Iptools.Tool._checkNull(node.orgNodes) && node.orgNodes.length) {
                for (var j = 0; j < node.orgNodes.length; j++) {
                    rnode.children.push(widget._setOrgNode(node.orgNodes[j], hasPos));
                }
            }
            return rnode;
        }
        return {};
    },
    _setTreeNode: function (nodes) {
        if (nodes && nodes.length) {
            for (var i = 0; i < nodes.length; i++) {
                widget._UIDEFAULFS.treeData.push(widget._setOrgNode(nodes[i], true));
            }
        }
    },
    _bindingDomEvent: function () {
        widget._enableBackWard();
        widget._enableSaving();
    },
    _bindingEventAfterLoad: function () {
       widget._clickPersonPosition();
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setFormValidate();
        widget._setPersonInfo();
        widget._setPosNewSelectTree();
        widget._bindingEventAfterLoad();
        widget._personPhoneChange();
    },
    _clickPersonPosition:function(){
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#person_pos",
            event: function () {
                var $this = $(this);
                var $parent = $this.closest(".form-group");

                if($parent.find(".help-block").length >0){
                    $parent.find(".help-block").remove();
                    $parent.removeClass("has-error");
                }
            }
        })
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
                        regexp: {
                            regexp: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                            message: "请输入正确的手机号码"
                        }
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
                //person_login: {
                //    validators: {
                //        notEmpty: {
                //            message: '必填'
                //        },
                //    }
                //},
                person_pwd: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                    }
                },
                person_campagin_code: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        },
                    }
                }
            }
        });
    },
    _setPersonInfo: function () {
        //编辑
        if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "selectUser" }))) {
            Iptools.GetJson({
                url: "basic/getEmployee",
                data: {
                    token: Iptools.DEFAULTS.token,
                    id: Iptools.getDefaults({ key: "selectUser" })
                }
            }).done(function (r) {
                r = r.employee;
                $(".person_id_area").show();
                $("#person_id").val(r.id);
                $("#person_name").val(r.name);
                $("#person_phone").val(r.phone);
                $("#person_email").val(r.email);
                $("#person_login").val(r.phone);
                $("#person_identity").val(r.identity);
                $("#person_pwd").val("password");
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
                        empId: Iptools.getDefaults({ key: "selectUser" }),
                    }
                }).done(function (s) {
                    if (s && s.length) {
                        Iptools.DEFAULTS.res = s[0].resId;
                        Iptools.DEFAULTS.resId = s[0].linkId;
                    }
                }).done(function () {
                    widget._setResponsibility();
                }).done(function () {
                    if (Iptools.Tool._checkNull(Iptools.DEFAULTS.organization)) {
                        Iptools.GetJson({
                            url: "basic/organizations/" + Iptools.DEFAULTS.organization,
                            data: {
                                token: Iptools.DEFAULTS.token,
                                id: Iptools.DEFAULTS.organization
                            }
                        }).done(function (s) {
                            $("#person_org").data("id", s.id);
                            $("#person_org").val(s.name);
                        });
                    }
                    if (Iptools.Tool._checkNull(Iptools.DEFAULTS.position)) {
                        Iptools.GetJson({
                            url: "basic/positions/" + Iptools.DEFAULTS.position,
                            data: {
                                token: Iptools.DEFAULTS.token,
                                id: Iptools.DEFAULTS.position
                            }
                        }).done(function (s) {
                            $("#person_pos").data("id", s.id);
                            $("#person_pos").html(s.name + "<span class='caret'></span>");
                        });
                    }
                });
            });
        } else {
            if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "selectOrg" }))) {
                Iptools.GetJson({
                    url: "basic/organizations/" + Iptools.getDefaults({ key: "selectOrg" }),
                    data: {
                        token: Iptools.DEFAULTS.token,
                        id: Iptools.getDefaults({ key: "selectOrg" })
                    }
                }).done(function (s) {
                    $("#person_org").data("id", s.id);
                    $("#person_org").val(s.name);
                });
            }
            if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "selectPos" }))) {
                Iptools.GetJson({
                    url: "basic/positions/" + Iptools.getDefaults({ key: "selectPos" }),
                    data: {
                        token: Iptools.DEFAULTS.token,
                        id: Iptools.getDefaults({ key: "selectPos" })
                    }
                }).done(function (s) {
                    $("#person_pos").data("id", s.id);
                    $("#person_pos").html(s.name + "<span class='caret'></span>");
                });
            }
            widget._setResponsibility();
        }
    },
    _setResponsibility: function () {
        Iptools.GetJson({
            url: "basic/responsibilitys",
            data: {
                token: Iptools.DEFAULTS.token,
            }
        }).done(function (r) {
            $.each(r, function (key, obj) {
                var op = document.createElement("option");
                $(op).attr("value", obj.uuid);
                if (obj.uuid == Iptools.DEFAULTS.res) {
                    $(op).attr("selected", "selected");
                }
                $(op).html(obj.name);
                $("#person_res").append(op);
            });
        });
    },
    _setPosNewSelectTree: function () {
        Iptools.GetJson({
            url: "basic/organization/treeviewPos",
            data: {
                token: Iptools.DEFAULTS.token,
                userId: Iptools.DEFAULTS.userId
            }
        }).done(function (r) {
            widget._setTreeNode(r);
            $(widget._UIDEFAULFS.selectPosPanel).jstree({
                'core': {
                    'data': widget._UIDEFAULFS.treeData,
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, data) {
                if (data.node.original && data.node.original.type == "pos") {
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
        });
    },
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
    _enableSaving: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#save_person",
            event: function () {
                $(widget._UIDEFAULFS.personForm).bootstrapValidator('validate');
                if ($(widget._UIDEFAULFS.personForm).data("bootstrapValidator").isValid()) {
                    //校验职位是否填写
                    var posVal = $("#person_pos").text().trim();
                    if(posVal === "无"){
                        if($("#person_pos").closest(".form-group").hasClass("has-error")){
                            return false;
                        }else{
                            $("#person_pos").closest(".form-group").addClass("has-error");
                            $("#person_pos").after('<small data-bv-validator="notEmpty" data-bv-validator-for="person_phone" class="help-block" style="">请输入职位</small>');
                            return false;
                        }
                    }
                    if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "selectUser" }))) {
                        var data = {
                            id: Iptools.getDefaults({ key: "selectUser" }),
                            token: Iptools.DEFAULTS.token,
                            name: $("#person_name").val(),
                            position: $("#person_pos").data("id"),
                            organization: $("#person_org").data("id"),
                            //loginName: $("#person_login").val(),
                            phone: $("#person_phone").val(),
                            email: $("#person_email").val(),
                            status: $("#person_status").val(),
                            identity: $("#person_identity").val(),
                            gender: $("#person_gender").val()
                        };
                        if ($("#person_pwd").val() != "password") {
                            data["loginPwd"] = $.md5($("#person_pwd").val());
                        }
                        Iptools.PutJson({
                            url: "basic/employees",
                            data: data
                        }).done(function (r) {
                            if (r && r.retcode == "ok") {
                                if (Iptools.Tool._checkNull(Iptools.DEFAULTS.resId)) {
                                    Iptools.PutJson({
                                        url: "basic/empResLinks",
                                        data: {
                                            id: Iptools.DEFAULTS.resId,
                                            token: Iptools.DEFAULTS.token,
                                            empId: r.employeeId,
                                            resId: $("#person_res").val(),
                                        }
                                    }).done(function () {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "保存完成"
                                        });
                                    }).fail(function () {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "保存失败"
                                        });
                                    });
                                } else {
                                    Iptools.PostJson({
                                        url: "basic/empResLinks",
                                        data: {
                                            token: Iptools.DEFAULTS.token,
                                            empId: r.employeeId,
                                            resId: $("#person_res").val(),
                                        }
                                    }).done(function () {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "保存完成"
                                        });
                                    }).fail(function () {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "保存失败"
                                        });
                                    });
                                }
                            } else if (r && r.retcode == "fail") {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "登录名重复"
                                });
                            }
                        }).fail(function () {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "保存失败"
                            });
                        });
                    } else {
                        Iptools.PostJson({
                            url: "basic/employees",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                name: $("#person_name").val(),
                                position: $("#person_pos").data("id"),
                                organization: $("#person_org").data("id"),
                                //loginName: $("#person_login").val(),
                                loginPwd: $.md5($("#person_pwd").val()),
                                phone: $("#person_phone").val(),
                                email: $("#person_email").val(),
                                status: $("#person_status").val(),
                                identity: $("#person_identity").val(),
                                gender: $("#person_gender").val()
                            }
                        }).done(function (r) {
                            if (r && r.retcode == "ok") {
                                Iptools.PostJson({
                                    url: "basic/empResLinks",
                                    data: {
                                        token: Iptools.DEFAULTS.token,
                                        empId: r.employeeId,
                                        resId: $("#person_res").val(),
                                    }
                                }).done(function () {
                                    Iptools.Tool.pAlert({
                                        title: "系统提示",
                                        content: "创建成功"
                                    });
                                    window.location.href = "index.html";
                                });
                            } else if (r && r.retcode == "fail") {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "登录名重复"
                                });
                            }
                        }).fail(function () {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "创建失败"
                            });
                        });
                    }
                }
            },
        });
    }
}