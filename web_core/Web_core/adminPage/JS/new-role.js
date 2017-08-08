var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        Tree: "#res_Tree",
        resPanel: "#applet_res_panel",
        resDataColumnPanel: ".res-data-columns",
        resDataAppletPanel: ".data-res-panel",
        PAGE_SIZE: 50,
        treeData: [{
            id: 'bs-node',
            text: "业务权限",
            icon: "icon-desktop",
            state: {
                opened: true
            },
            children: []
        }, {
            id: 'fs-node',
            text: "功能权限",
            icon: "icon-cog",
            state: {
                opened: true
            },
            children: []
        }],
        saveData: {
            screen: [],
            view: [],
            applet: [],
            setting: [],
        },
        treeViewData: [],
        orgTreeViewData: [],
        treeView: "#org_tree",
        orgResData: {
            add: []
        },
        currentResColumn: 0,
        resAppletData: {}
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
        widget._enableSaveTreeData();
        widget._enableAddResOrgListItemMouseOver();
        widget._enableAddResOrgListItemMouseLeave();
        widget._enableAddResOrgSelect();
        widget._enableAddResOrgListItemRemove();
        widget._enableAppletShowProperty();
        widget._enableAppletResPanelHide();
        widget._enableAppletResTypeChange();
        widget._enableAppletResAdd();
        widget._enableResDataColumnItemClick();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        $("#commitData").attr("data-loading-text", "<span class='icon-spinner icon-spin' style='margin-right:4px'></span>保存中");
        $("#res_applet_conclusive_box").bootstrapSwitch({
            state: true,
            size: "small",
            handleWidth: "100",
            labelWidth: "50"
        });
        widget._bindingDomEvent();
        widget._setResponsibilityTree();
        widget._setTreeViewData();
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
                widget._UIDEFAULFS.treeViewData.push(widget._setOrgNode(nodes[i], true));
                widget._UIDEFAULFS.orgTreeViewData.push(widget._setOrgNode(nodes[i], false));
            }
        }
    },
    _setTreeViewData: function () {
        Iptools.GetJson({
            url: "basic/organization/treeviewPos",
            data: {
                token: Iptools.DEFAULTS.token,
            }
        }).done(function (r) {
            widget._setTreeNode(r);
            $(widget._UIDEFAULFS.treeView).jstree({
                'core': {
                    'data': widget._UIDEFAULFS.orgTreeViewData,
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, ndata) {
                if (ndata.node.original) {
                    $("#org_tree_select").data("id", ndata.node.original.oid);
                    $("#org_tree_select").data("text", ndata.node.original.text);
                    $("#org_tree_select").html(ndata.node.original.text + "<span class='caret'></span>");
                }
            });
            $(".applet_org_tree").jstree({
                'core': {
                    'data': widget._UIDEFAULFS.orgTreeViewData,
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, ndata) {
                if (ndata.node.original) {
                    $("#applet_org_tree_select").data("id", ndata.node.original.oid);
                    $("#applet_org_tree_select").data("text", ndata.node.original.text);
                    $("#applet_org_tree_select").html(ndata.node.original.text + "<span class='caret'></span>");
                }
            });
            $(".applet_pos_tree").jstree({
                'core': {
                    'data': widget._UIDEFAULFS.treeViewData,
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, ndata) {
                if (ndata.node.original && ndata.node.original.type == "pos") {
                    $("#applet_pos_tree_select").data("id", ndata.node.original.pid);
                    $("#applet_pos_tree_select").data("text", ndata.node.original.text);
                    $("#applet_pos_tree_select").html(ndata.node.original.text + "<span class='caret'></span>");
                } else {
                    $("#applet_pos_tree_select").data("id", 0);
                    $("#applet_pos_tree_select").html("无<span class='caret'></span>");
                }
            });
        }).done(function () {
            Iptools.GetJson({
                url: "basic/applets",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletType: "list"
                }
            }).done(function (r) {
                if (r && r.length) {
                    $(widget._UIDEFAULFS.resDataAppletPanel).html("");
                    for (var i = 0; i < r.length; i++) {
                        var a = document.createElement("a");
                        $(a).addClass("list-group-item");
                        var btn = document.createElement("button");
                        $(btn).addClass("btn commonBtn revert init-data-res-target");
                        $(btn).text("编辑权限");
                        $(btn).data("applet", r[i].uuid);
                        var h5 = document.createElement("h5");
                        $(h5).append(r[i].displayName + "<small>" + r[i].name + "</small>", btn);
                        $(a).append(h5);
                        $(widget._UIDEFAULFS.resDataAppletPanel).append(a);
                    }
                }
            });
        });
    },
    _setResponsibilityTree: function () {
        Iptools.GetJson({
            url: "basic/perSetting_paging",
            data: {
                token: Iptools.DEFAULTS.token,
                pageNow: 1,
                pagesize: widget._UIDEFAULFS.PAGE_SIZE
            }
        }).done(function (data) {
            if (data && data.pageView && data.pageView.records.length) {
                for (var i = 0; i < data.pageView.records.length; i++) {
                    var odata = data.pageView.records[i];
                    widget._UIDEFAULFS.treeData[1].children.push({
                        icon: odata.icon,
                        rid: odata.uuid,
                        text: odata.title,
                        type: "setting"
                    });
                };
            }
        }).done(function () {
            Iptools.GetJson({
                url: "basic/getResTree",
                data: {
                    token: Iptools.DEFAULTS.token,
                    channel: "web"
                }
            }).done(function (data) {
                for (var d = 0; d < data.length; d++) {
                    var snode = {
                        sid: data[d].uuid,
                        text: data[d].displayName,
                        state: { "opened": false },
                        type: "screen",
                        icon: data[d].iconUrl,
                        children: []
                    };
                    for (var c = 0; c < data[d].children.length; c++) {
                        var vnode = {
                            vid: data[d].children[c].uuid,
                            text: data[d].children[c].displayName,
                            state: { "opened": false },
                            icon: "icon-columns",
                            type: "view",
                            children: []
                        };
                        for (var a = 0; a < data[d].children[c].children.length; a++) {
                            var anode = {
                                aid: data[d].children[c].children[a].uuid,
                                text: data[d].children[c].children[a].displayName,
                                state: { "opened": false },
                                type: "applet",
                                icon: "icon-tablet"
                            };
                            vnode.children.push(anode);
                        }
                        snode.children.push(vnode);
                    }
                    widget._UIDEFAULFS.treeData[0].children.push(snode);
                };
            }).done(function () {
                $(widget._UIDEFAULFS.Tree).jstree({
                    "core": {
                        "data": widget._UIDEFAULFS.treeData
                    },
                    "plugins": ["checkbox"]
                });
            });
        });
    },
    _setNodeData: function (node) {
        if (node && node.original) {
            switch (node.original.type) {
                case "screen":
                    if (widget._UIDEFAULFS.saveData.screen.indexOf(node.original.sid) == -1) {
                        widget._UIDEFAULFS.saveData.screen.push(node.original.sid);
                    }
                    break;
                case "view":
                    if (widget._UIDEFAULFS.saveData.view.indexOf(node.original.vid) == -1) {
                        widget._UIDEFAULFS.saveData.view.push(node.original.vid);
                    }
                    break;
                case "applet":
                    if (widget._UIDEFAULFS.saveData.applet.indexOf(node.original.aid) == -1) {
                        widget._UIDEFAULFS.saveData.applet.push(node.original.aid);
                    }
                    break;
                case "setting":
                    if (widget._UIDEFAULFS.saveData.setting.indexOf(node.original.rid) == -1) {
                        widget._UIDEFAULFS.saveData.setting.push(node.original.rid);
                    }
                    break;
            }
        }
    },
    _enableSaveTreeData: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#commitData",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                btn.css("pointer-events", "none");
                btn.button("loading");
                var roleName = $("#roleName").val();
                if (!Iptools.Tool._checkNull(roleName)) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "请输入权限名"
                    });
                    setTimeout(function () {
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    }, 1000);
                } else {
                    Iptools.PostJson({
                        url: "basic/responsibilitys",
                        data: {
                            token: Iptools.DEFAULTS.token,
                            name: roleName,
                            description: ""
                        }
                    }).done(function (data) {
                        var nodes = $(widget._UIDEFAULFS.Tree).jstree().get_selected();
                        for (var i = 0; i < nodes.length; i++) {
                            widget._setNodeData($(widget._UIDEFAULFS.Tree).jstree().get_node(nodes[i]));
                            var pnode = $(widget._UIDEFAULFS.Tree).jstree().get_parent(nodes[i]);
                            while (pnode) {
                                widget._setNodeData($(widget._UIDEFAULFS.Tree).jstree().get_node(pnode));
                                pnode = $(widget._UIDEFAULFS.Tree).jstree().get_parent(pnode);
                            }
                        }
                        if (widget._UIDEFAULFS.saveData.screen.length || widget._UIDEFAULFS.saveData.setting.length) {
                            Iptools.PostJson({
                                url: "basic/linkResScreen",
                                data: {
                                    token: Iptools.DEFAULTS.token,
                                    resId: data.uuid,
                                    screenIdList: widget._UIDEFAULFS.saveData.screen.join(",")
                                }
                            }).done(function () {
                                if (widget._UIDEFAULFS.saveData.view.length) {
                                    Iptools.PostJson({
                                        url: "basic/linkResView",
                                        data: {
                                            token: Iptools.DEFAULTS.token,
                                            resId: data.uuid,
                                            viewIdList: widget._UIDEFAULFS.saveData.view.join(",")
                                        }
                                    });
                                }
                            }).done(function () {
                                if (widget._UIDEFAULFS.saveData.applet.length) {
                                    Iptools.PostJson({
                                        url: "basic/linkResApplet",
                                        data: {
                                            token: Iptools.DEFAULTS.token,
                                            resId: data.uuid,
                                            appletIdList: widget._UIDEFAULFS.saveData.applet.join(",")
                                        }
                                    });
                                }
                            }).done(function () {
                                if (widget._UIDEFAULFS.saveData.setting.length) {
                                    Iptools.PostJson({
                                        url: "basic/linkResSetting",
                                        data: {
                                            token: Iptools.DEFAULTS.token,
                                            resId: data.uuid,
                                            settingIdList: widget._UIDEFAULFS.saveData.setting.join(",")
                                        }
                                    });
                                }
                            }).done(function () {
                                if (widget._UIDEFAULFS.orgResData.add.length) {
                                    Iptools.PostJson({
                                        url: "/basic/resOrgLinks/link",
                                        data: {
                                            token: Iptools.DEFAULTS.token,
                                            resId: data.uuid,
                                            idList: widget._UIDEFAULFS.orgResData.add.join(",")
                                        }
                                    });
                                }
                            }).done(function () {
                                for (var item in widget._UIDEFAULFS.resAppletData) {
                                    var adata = widget._UIDEFAULFS.resAppletData[item];
                                    switch (adata.type) {
                                        case 1:
                                            for (var oi = 0; oi < adata.orgList.length; oi++) {
                                                Iptools.PostJson({
                                                    async: false,
                                                    url: "/basic/resDataLinks",
                                                    data: {
                                                        token: Iptools.DEFAULTS.token,
                                                        resId: data.uuid,
                                                        columnId: item,
                                                        type: adata.type,
                                                        organization: adata.orgList[oi].id,
                                                        isConcluedeChild: adata.orgList[oi].conclusive
                                                    }
                                                });
                                            }
                                            break;
                                        case 3:
                                            for (var pi = 0; pi < adata.posList.length; pi++) {
                                                Iptools.PostJson({
                                                    async: false,
                                                    url: "/basic/resDataLinks",
                                                    data: {
                                                        token: Iptools.DEFAULTS.token,
                                                        resId: data.uuid,
                                                        columnId: item,
                                                        type: adata.type,
                                                        position: adata.posList[pi].id,
                                                        isConcluedeChild: adata.posList[pi].conclusive
                                                    }
                                                });
                                            }
                                            break;
                                        case 2:
                                        case 4:
                                            Iptools.PostJson({
                                                async: false,
                                                url: "/basic/resDataLinks",
                                                data: {
                                                    token: Iptools.DEFAULTS.token,
                                                    resId: data.uuid,
                                                    columnId: item,
                                                    type: adata.type,
                                                    isConcluedeChild: true
                                                }
                                            });
                                            break;
                                        case 5:
                                            Iptools.PostJson({
                                                async: false,
                                                url: "/basic/resDataLinks",
                                                data: {
                                                    token: Iptools.DEFAULTS.token,
                                                    resId: data.uuid,
                                                    columnId: item,
                                                    type: adata.type,
                                                }
                                            });
                                            break;
                                    }
                                }
                            }).done(function () {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "权限添加完成"
                                });
                                self.location = "managmentOfRole.html";
                            });
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "权限添加完成"
                            });
                            self.location = "managmentOfRole.html";
                        }
                    }).fail(function () {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "添加失败"
                        });
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    });
                }
            }
        });
    },
    _enableAddResOrgSelect: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".btn-org-add",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var id = $("#org_tree_select").data("id").toString();
                if (id != "0") {
                    var li = document.createElement("li");
                    var span = document.createElement("span");
                    $(span).addClass("org-minus-icon fa fa-minus");
                    $(span).attr("data-id", $("#org_tree_select").data("id"));
                    $(li).append($("#org_tree_select").data("text"), span);
                    if (widget._UIDEFAULFS.orgResData.add.indexOf(id) == -1) {
                        $("#choose_res_org_list").append(li);
                        widget._UIDEFAULFS.orgResData.add.push(id);
                    } else {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "节点已存在"
                        });
                    }
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "请选择节点"
                    });
                }
            }
        });
    },
    _enableAddResOrgListItemMouseOver: function () {
        widget._addEventListener({
            container: "body",
            type: "mouseover",
            target: "#choose_res_org_list li",
            event: function () {
                $(this).find(".org-minus-icon").show();
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mouseover",
            target: "#choose_res_applet_org_list li",
            event: function () {
                $(this).find(".applet-org-minus-icon").show();
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mouseover",
            target: "#choose_res_applet_pos_list li",
            event: function () {
                $(this).find(".applet-pos-minus-icon").show();
            }
        });
    },
    _enableAddResOrgListItemMouseLeave: function () {
        widget._addEventListener({
            container: "body",
            type: "mouseout",
            target: "#choose_res_org_list li",
            event: function () {
                $(this).find(".org-minus-icon").hide();
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mouseout",
            target: "#choose_res_applet_org_list li",
            event: function () {
                $(this).find(".applet-org-minus-icon").hide();
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mouseout",
            target: "#choose_res_applet_pos_list li",
            event: function () {
                $(this).find(".applet-pos-minus-icon").hide();
            }
        });
    },
    _enableAddResOrgListItemRemove: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".org-minus-icon",
            event: function () {
                $(this).parent().remove();
                var id = $(this).data("id").toString();
                widget._UIDEFAULFS.orgResData.add.splice(widget._UIDEFAULFS.orgResData.add.indexOf(id), 1);
            }
        });
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".applet-org-minus-icon",
            event: function () {
                var index = -1;
                for (var i = 0; i < widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].orgList.length; i++) {
                    var odata = widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].orgList[i];
                    if (odata.id == $(this).data("id")) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].orgList.splice(index, 1);
                }
                $(this).parent().remove();
            }
        });
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".applet-pos-minus-icon",
            event: function () {
                var index = -1;
                for (var i = 0; i < widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].posList.length; i++) {
                    var pdata = widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].posList[i];
                    if (pdata.id == $(this).data("id")) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].posList.splice(index, 1);
                }
                $(this).parent().remove();
            }
        });
    },
    _showAppletResDataPanel: function (options) {
        $(widget._UIDEFAULFS.resDataColumnPanel).html("");
        Iptools.uidataTool._getApplet({
            applet: options.applet
        }).done(function (r) {
            if (r && r.columns && r.columns.length) {
                var rcn = false;
                for (var ci = 0; ci < r.columns.length; ci++) {
                    if (r.columns[ci].allowInnerQuery && r.columns[ci].innerQueryFormula == "={res}") {
                        var a = document.createElement("a");
                        $(a).addClass("list-group-item res-data-column-item");
                        $(a).data("key", r.columns[ci].id);
                        $(a).html(r.columns[ci].name);
                        $(widget._UIDEFAULFS.resDataColumnPanel).append(a);
                        rcn = true;
                    }
                }
                if (!rcn) {
                    $(widget._UIDEFAULFS.resDataColumnPanel).append("<p>无可用项</p>");
                }
            }
        });
        widget._UIDEFAULFS.currentResColumn = 0;
        $("#res_data_type").selectpicker("val", "");
        $("#res_data_type").trigger("changed.bs.select");
        $("#res_data_type").prop('disabled', true);
        $("#res_data_type").selectpicker('refresh');
        $(widget._UIDEFAULFS.resPanel).css({
            "overflow": "auto",
            "margin-top": options.top
        });
        $(widget._UIDEFAULFS.resPanel).show();
        $(widget._UIDEFAULFS.resPanel).animate({ "height": "600px" }, 300);
    },
    _enableResDataColumnItemClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".res-data-column-item",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if (!$(this).hasClass("active")) {
                    $(widget._UIDEFAULFS.resDataColumnPanel).find("a").removeClass("active");
                    $(this).addClass("active");
                    $("#res_data_type").prop('disabled', false);
                    $("#res_data_type").selectpicker('refresh');
                    if (Iptools.Tool._checkNull($(this).data("key"))) {
                        $("#choose_res_applet_org_list ul").html("");
                        $("#choose_res_applet_pos_list ul").html("");
                        widget._UIDEFAULFS.currentResColumn = $(this).data("key");
                        var data = widget._UIDEFAULFS.resAppletData[$(this).data("key")];
                        if (data) {
                            switch (data.type) {
                                case 1:
                                    for (var i = 0; i < data.orgList.length; i++) {
                                        var oli = document.createElement("li");
                                        var spano = document.createElement("span");
                                        $(spano).addClass("applet-org-minus-icon fa fa-minus");
                                        $(spano).data("id", data.orgList[i].id);
                                        $(oli).append(data.orgList[i].name);
                                        if (data.orgList[i].conclusive) {
                                            $(oli).append("(包含子节点)", spano);
                                        } else {
                                            $(oli).append("(不包含子节点)", spano);
                                        }
                                        $("#choose_res_applet_org_list ul").append(oli);
                                    }
                                    break;
                                case 3:
                                    for (var j = 0; j < data.posList.length; j++) {
                                        var pli = document.createElement("li");
                                        var spanp = document.createElement("span");
                                        $(spanp).addClass("applet-pos-minus-icon fa fa-minus");
                                        $(spanp).data("id", data.posList[j].id);
                                        $(pli).append(data.posList[j].name);
                                        if (data.posList[j].conclusive) {
                                            $(pli).append("(包含子节点)", spanp);
                                        } else {
                                            $(pli).append("(不包含子节点)", spanp);
                                        }
                                        $("#choose_res_applet_pos_list ul").append(pli);
                                    }
                                    break;
                            }
                            $("#res_data_type").selectpicker("val", data.type);
                            $("#res_data_type").trigger("changed.bs.select");
                        } else {
                            $("#res_data_type").selectpicker("val", "");
                            $("#res_data_type").trigger("changed.bs.select");
                        }
                    }
                }
            }
        });
    },
    _enableAppletShowProperty: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".init-data-res-target",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var top = parseInt($(this).parent().parent()[0].offsetTop);
                if (top > 150) {
                    top -= 100;
                }
                widget._showAppletResDataPanel({
                    top: top,
                    applet: $(this).data("applet")
                });
            }
        });
    },
    _enableAppletResPanelHide: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".res-panel .hidebar",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $(widget._UIDEFAULFS.resPanel).css({
                    "overflow": "hidden",
                });
                $(widget._UIDEFAULFS.resPanel).animate({
                    height: 0
                }, 300, function () {
                    $(widget._UIDEFAULFS.resPanel).hide();
                });
            }
        });
    },
    _enableAppletResTypeChange: function () {
        widget._addEventListener({
            container: "body",
            type: "changed.bs.select",
            target: "#res_data_type",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $("#res_applet_org_select").hide();
                $("#res_applet_pos_select").hide();
                $("#res_applet_node_check").hide();
                $("#add_applet_res").hide();
                $("#choose_res_applet_org_list").hide();
                $("#choose_res_applet_pos_list").hide();
                if (widget._UIDEFAULFS.currentResColumn != 0) {
                    if (!Iptools.Tool._checkNull(widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn])) {
                        widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn] = {
                            type: parseInt($("#res_data_type").selectpicker("val")),
                            orgList: [],
                            posList: [],
                            originalList: []
                        };
                    } else {
                        widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].type = parseInt($("#res_data_type").selectpicker("val"));
                    }
                }
                switch ($("#res_data_type").selectpicker("val")) {
                    default:
                        if (widget._UIDEFAULFS.currentResColumn != 0) {
                            widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].type = 0;
                        }
                        break;
                    case "1":
                        $("#res_applet_org_select").show();
                        $("#res_applet_node_check").show();
                        $("#add_applet_res").show();
                        $("#choose_res_applet_org_list").show();
                        break;
                    case "3":
                        $("#res_applet_pos_select").show();
                        $("#res_applet_node_check").show();
                        $("#add_applet_res").show();
                        $("#choose_res_applet_pos_list").show();
                        break;
                    case "2":
                    case "4":
                    case "5":
                        break;
                }
            }
        });
    },
    _enableAppletResAdd: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#add_applet_res button",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var conclusive = $('#res_applet_conclusive_box').bootstrapSwitch('state');
                var conText = conclusive ? "(包含子节点)" : "(不包含子节点)";
                var hasData = false;
                switch ($("#res_data_type").selectpicker("val")) {
                    case "1":
                        for (var i = 0; i < widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].orgList.length; i++) {
                            var odata = widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].orgList[i];
                            if (odata.id == $("#applet_org_tree_select").data("id")) {
                                hasData = true;
                                break;
                            }
                        }
                        if (hasData) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "节点已存在"
                            });
                        } else if ($("#applet_org_tree_select").data("id") == 0) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "为选择节点"
                            });
                        } else {
                            var oli = document.createElement("li");
                            var spano = document.createElement("span");
                            $(spano).addClass("applet-org-minus-icon fa fa-minus");
                            $(spano).data("id", $("#applet_org_tree_select").data("id"));
                            $(oli).append($("#applet_org_tree_select").data("text"), conText, spano);
                            $("#choose_res_applet_org_list ul").append(oli);
                            widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].orgList.push({
                                id: $("#applet_org_tree_select").data("id"),
                                conclusive: conclusive,
                                name: $("#applet_org_tree_select").data("text")
                            });
                        }
                        break;
                    case "3":
                        for (var j = 0; j < widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].posList.length; j++) {
                            var pdata = widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].posList[j];
                            if (pdata.id == $("#applet_pos_tree_select").data("id")) {
                                hasData = true;
                                break;
                            }
                        }
                        if (hasData) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "节点已存在"
                            });
                        } else {
                            var pli = document.createElement("li");
                            var spanp = document.createElement("span");
                            $(spanp).addClass("applet-pos-minus-icon fa fa-minus");
                            $(spanp).data("id", $("#applet_pos_tree_select").data("id"));
                            $(pli).append($("#applet_pos_tree_select").data("text"), conText, spanp);
                            $("#choose_res_applet_pos_list ul").append(pli);
                            widget._UIDEFAULFS.resAppletData[widget._UIDEFAULFS.currentResColumn].posList.push({
                                id: $("#applet_pos_tree_select").data("id"),
                                conclusive: conclusive,
                                name: $("#applet_pos_tree_select").data("text")
                            });
                        }
                        break;
                }
            }
        });
    }
};
