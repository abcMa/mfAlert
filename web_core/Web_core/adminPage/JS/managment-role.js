function getRolelist() {
    Iptools.GetJson({
        url: "basic/responsibilitys",
        data: {
            token: Iptools.DEFAULTS.token
        }
    }).done(function (r) {
        buildRoleLit(r);
    });
}
//buildtable数据
function buildRoleLit(data) {
    var max = data.length;
    var tabItem = "";
    $(".tabsettings").empty();
    for (var i = 0; i < max; i++) {
        var editObj = $("#tab-panel-modal").clone();
        if (i === 0) {
            editObj.addClass("active");
            tabItem += '<li role="presentation" class="active"><a class="tab-a" href="#' + data[i].uuid + '" data-id="' + data[i].id + '" aria-controls="' + data[i].uuid + '" data-uuid="' + data[i].uuid + '" role="tab" data-toggle="tab">' + data[i].name + '</a></li>';
        } else {
            tabItem += '<li role="presentation"><a class="tab-a" href="#' + data[i].uuid + '" data-id="' + data[i].id + '" aria-controls="' + data[i].uuid + '" data-uuid="' + data[i].uuid + '" role="tab" data-toggle="tab">' + data[i].name + '</a></li>';
        }

        editObj.attr("id", data[i].uuid);
        $(".tabsettings").append(editObj);
        editObj.find("a[href=#viewsanddata]").attr("href", "#" + data[i].id + "viewsanddata");
        editObj.find("#viewsanddata").attr("id", data[i].id + "viewsanddata");
        editObj.find("a[href=#humanresource]").attr("href", "#" + data[i].id + "humanresource");
        editObj.find("#humanresource").attr("id", data[i].id + "humanresource");
        editObj.find("a[href=#dataresponsibility]").attr("href", "#" + data[i].id + "dataresponsibility");
        editObj.find("#dataresponsibility").attr("id", data[i].id + "dataresponsibility");
    }
    $("#tab-panel-modal").hide();
    $(".tabList").html(tabItem);
    $(".tab-a:first").trigger("click");
};

//打开确认删除modal
function openDeleteModal() {
    $('#delModal').modal('show');
    var id = $(".tabList .active").find("a").attr("data-id");
    $('#delModal').find("#commitDel").attr("data-id", id);
}

//删除一条数据
function confirmDel(e) {
    var id = $(e).attr("data-id");
    var uuid = $("a[data-id=" + id + "]").attr("data-uuid");
    Iptools.DeleteJson({
        url: "basic/responsibilitys/?token=" + Iptools.DEFAULTS.token + "&uuid=" + uuid
    }).done(function (data) {
        if (data.retcode === "ok") {
            $('#delModal').modal('hide');
            window.location.reload();
        } else {
            Iptools.Tool.pAlert({
                type: "danger",
                title: "系统提示",
                content: data.retmsg
            });
        }
    }).fail(function () {
        $('#delModal').modal('hide');
        window.location.reload();
    });
}

//新建一条数据
function commitData(e) {
    var name = $(e).parents(".modal").find(".name").val();
    var ajaxType = "post";
    var paraObj = {
        token: Iptools.DEFAULTS.token,
        name: name
    };
    if ($(e).attr("id") === "commitEditData") {
        ajaxType = "put";
        paraObj.id = parseInt($(e).attr("data-id"));
    }
    Iptools.DoJson({
        type: ajaxType,
        url: API_URL + "basic/organizations",
        data: paraObj,
    }).done(function () {
        $('#newModal').modal('hide');
        $("#newModal .name").val("");
        $('#editModal').modal('hide');
        if (ajaxType === "put") {
            Iptools.Tool.pAlert({
                title: "系统提示",
                content: "更新完成"
            });
        } else {
            Iptools.Tool.pAlert({
                title: "系统提示",
                content: "新建完成"
            });
        }
        window.location.reload();
    });
}
function changeName(e) {
    var uuid = $(e).closest(".setting-modal-item").attr("id");
    $("a[href=#" + uuid + "]").html($(e).val());
}

var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        valId: "",
        Tree: "#res_Tree",
        resPanel: "#applet_res_panel",
        resDataColumnPanel: ".res-data-columns",
        resDataAppletPanel: ".data-res-panel",
        PAGE_SIZE: 50,
        treeData: [
            {
                id: 'bs-node',
                text: "业务权限",
                icon: "icon-desktop",
                type: "bsrNode",
                state: {
                    opened: true
                },
                children: []
            }, {
                id: 'fs-node',
                text: "功能权限",
                icon: "icon-cog",
                type: "bfrNode",
                state: {
                    opened: true
                },
                children: []
            }
        ],
        saveData: {
            //screen: {//一级
            //    original: [],
            //    add: [],
            //    del: []
            //},
            //view: {//二级
            //    original: [],
            //    add: [],
            //    del: []
            //},
            //applet: {//三级
            //    original: [],
            //    add: [],
            //    del: []
            //},
            //setting: {//管理中心
            //    original: [],
            //    add: [],
            //    del: []
            //},
        },
        treeViewData: {},
        orgTreeViewData: {},
        treeView: "#org_tree",
        orgResData: {//人事架构相关
            //original: [],
            //add: [],
            //del: []
        },
        currentResColumn: 0,
        resAppletData: {}//数据源相关
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
        widget._switchTab();
        widget._enableOpenDelModal();
        widget._bindHoverToolTip();
    },
    _bindingEventAfterLoad: function () {

    },
    _switchTab: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".tab-a",
            event: function () {
                var uuid = $(this).data("uuid");
                if ($("#" + uuid).find("#res_Tree li").length === 0) {
                    widget._setBaseData(uuid, "#" + uuid);
                }
                widget._UIDEFAULFS.valKey = uuid;
                $(this).tab('show');
            }
        });
    },
    _enableOpenDelModal: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".del-managmen",
            event: function () {
                openDeleteModal();
            }
        });
    },
    _bindHoverToolTip: function () {
        widget._addEventListener({
            container: "body",
            type: "mouseover",
            target: "[data-toggle='popover']",
            event: function () {
                $(this).popover('show');
                //$(this).tooltip({"placement":"auto"});
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mouseout",
            target: "[data-toggle='popover']",
            event: function () {
                $(this).popover('hide');

            }
        });
    },
    _init: function () {
        widget._bindingDomEvent();
        //widget._setBaseData();
        //widget._setPerSetting();
        //widget._setTreeViewData();
        //widget._setResOrgList();
        widget._bindingEventAfterLoad();
    },
    _setResOrgList: function (container) {
        widget._UIDEFAULFS.orgResData[container] = {};
        widget._UIDEFAULFS.orgResData[container].original = [];
        widget._UIDEFAULFS.orgResData[container].del = [];
        widget._UIDEFAULFS.orgResData[container].add = [];
        Iptools.GetJson({
            url: "basic/resOrgLinks/queryByResId",
            data: {
                token: Iptools.DEFAULTS.token,
                resId: widget._UIDEFAULFS.valId
            }
        }).done(function (r) {
            if (r && r.length) {
                for (var i = 0; i < r.length; i++) {
                    var li = document.createElement("li");
                    var span = document.createElement("span");
                    $(span).addClass("org-minus-icon fa fa-minus");
                    $(span).data("id", r[i].orgId);
                    $(li).append(r[i].orgName, span);
                    $(container + " #choose_res_org_list").append(li);
                    widget._UIDEFAULFS.orgResData[container].original.push(r[i].orgId.toString());
                }
            }
        }).done(function () {
            Iptools.Tool._scrollToTop();
        });
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
    //构建人事架构data
    _setTreeNode: function (nodes, container) {
        if (nodes && nodes.length) {
            widget._UIDEFAULFS.treeViewData[container] = [];
            widget._UIDEFAULFS.orgTreeViewData[container] = [];
            for (var i = 0; i < nodes.length; i++) {
                widget._UIDEFAULFS.treeViewData[container].push(widget._setOrgNode(nodes[i], true));
                widget._UIDEFAULFS.orgTreeViewData[container].push(widget._setOrgNode(nodes[i], false));
            }
        }
    },
    //构建人事架构视图
    _setTreeViewData: function (container) {
        Iptools.GetJson({
            url: "basic/organization/treeviewPos",
            data: {
                token: Iptools.DEFAULTS.token,
            }
        }).done(function (r) {
            widget._setTreeNode(r, container);
            $(container + " " + widget._UIDEFAULFS.treeView).jstree({
                'core': {
                    'data': widget._UIDEFAULFS.orgTreeViewData[container],
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, ndata) {
                if (ndata.node.original) {
                    $(container + " " + "#org_tree_select").data("id", ndata.node.original.oid);
                    $(container + " " + "#org_tree_select").data("text", ndata.node.original.text);
                    $(container + " " + "#org_tree_select").html(ndata.node.original.text + "<span class='caret'></span>");
                }
            });
            $(container + " " + ".applet_org_tree").jstree({
                'core': {
                    'data': widget._UIDEFAULFS.orgTreeViewData[container],
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, ndata) {
                if (ndata.node.original) {
                    $(container + " " + "#applet_org_tree_select").data("id", ndata.node.original.oid);
                    $(container + " " + "#applet_org_tree_select").data("text", ndata.node.original.text);
                    $(container + " " + "#applet_org_tree_select").html(ndata.node.original.text + "<span class='caret'></span>");
                }
            });
            $(container + " " + ".applet_pos_tree").jstree({
                'core': {
                    'data': widget._UIDEFAULFS.treeViewData[container],
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, ndata) {
                if (ndata.node.original && ndata.node.original.type == "pos") {
                    $(container + " " + "#applet_pos_tree_select").data("id", ndata.node.original.pid);
                    $(container + " " + "#applet_pos_tree_select").data("text", ndata.node.original.text);
                    $(container + " " + "#applet_pos_tree_select").html(ndata.node.original.text + "<span class='caret'></span>");
                } else {
                    $(container + " " + "#applet_pos_tree_select").data("id", 0);
                    $(container + " " + "#applet_pos_tree_select").html("无<span class='caret'></span>");
                }
            });
        }).done(function () {
            Iptools.GetJson({
                url: "basic/resDataLinks/queryByResId",
                data: {
                    token: Iptools.DEFAULTS.token,
                    resId: widget._UIDEFAULFS.valId
                }
            }).done(function (r) {
                var parentId = container.split("#")[1];
                widget._UIDEFAULFS.resAppletData[parentId] = {};
                if (r && r.length) {
                    for (var i = 0; i < r.length; i++) {
                        if (!Iptools.Tool._checkNull(widget._UIDEFAULFS.resAppletData[parentId][r[i].columnId])) {
                            widget._UIDEFAULFS.resAppletData[parentId][r[i].columnId] = {
                                type: r[i].type,
                                orgList: [],
                                posList: [],
                                originalList: []
                            };
                        }
                        switch (r[i].type) {
                            case 1:
                                widget._UIDEFAULFS.resAppletData[parentId][r[i].columnId].orgList.push({
                                    id: r[i].organization,
                                    conclusive: r[i].isConcluedeChild,
                                    name: r[i].orgName
                                });
                                break;
                            case 3:
                                widget._UIDEFAULFS.resAppletData[parentId][r[i].columnId].posList.push({
                                    id: r[i].position,
                                    conclusive: r[i].isConcluedeChild,
                                    name: r[i].posName
                                });
                                break;
                            case 2:
                            case 4:
                            case 5:
                            default:
                                break;
                        }
                        widget._UIDEFAULFS.resAppletData[parentId][r[i].columnId].originalList.push(r[i].id);
                    }
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
                    $(container + " " + widget._UIDEFAULFS.resDataAppletPanel).html("");
                    for (var i = 0; i < r.length; i++) {
                        var a = document.createElement("a");
                        $(a).addClass("list-group-item");
                        var btn = document.createElement("button");
                        $(btn).addClass("btn commonBtn revert btn-xs init-data-res-target");
                        $(btn).text("编辑权限");
                        $(btn).data("applet", r[i].uuid);
                        var h5 = document.createElement("h5");
                        $(h5).append(r[i].displayName + "<small>" + r[i].name + "</small>", btn);
                        $(a).append(h5);
                        $(container + " " + widget._UIDEFAULFS.resDataAppletPanel).append(a);
                    }
                }
            });
        });
    },
    _setBaseData: function (uuid, container) {
        $(container + " #commitData").attr("data-loading-text", "<span class='icon-spinner icon-spin' style='margin-right:4px'></span>保存中");
        $(container + " #res_applet_conclusive_box").bootstrapSwitch({
            state: true,
            size: "small",
            handleWidth: "100",
            labelWidth: "50"
        });
        //widget._UIDEFAULFS.valId = location.search.replace("?id=", "");
        widget._UIDEFAULFS.valId = uuid;
        Iptools.GetJson({
            url: "basic/getResponsibilitys",
            data: {
                token: Iptools.DEFAULTS.token,
                id: widget._UIDEFAULFS.valId
            }
        }).done(function (data) {
            widget._UIDEFAULFS.valKey = data.id;
            var containerId = container.split("#")[1];
            $("a[href=#" + containerId + "]").attr("data-uuid", containerId);
            $("" + container + " #roleName").val(data.name);
        });
        widget._setPerSetting(container);
        widget._setTreeViewData(container);
        widget._setResOrgList(container);
    },
    _setPerSetting: function (container) {
        widget._UIDEFAULFS.saveData["" + container] = {};
        Iptools.GetJson({
            url: "basic/querySettingByResId",
            data: {
                token: Iptools.DEFAULTS.token,
                resId: widget._UIDEFAULFS.valId
            }
        }).done(function (r) {
            //管理中心的screen
            Iptools.GetJson({
                url: "basic/perSetting_paging",
                data: {
                    token: Iptools.DEFAULTS.token,
                    pageNow: 1,
                    pagesize: widget._UIDEFAULFS.PAGE_SIZE
                }
            }).done(function (rs) {
                if (rs && rs.pageView && rs.pageView.records && rs.pageView.records.length) {
                    for (var i = 0; i < rs.pageView.records.length; i++) {
                        var odata = rs.pageView.records[i];
                        var node = {
                            icon: odata.icon,
                            rid: odata.uuid,
                            text: odata.title,
                            type: "setting"
                        }
                        if (r && r.length) {
                            widget._UIDEFAULFS.saveData["" + container].setting = {};
                            widget._UIDEFAULFS.saveData["" + container].setting.original = [];
                            widget._UIDEFAULFS.saveData["" + container].setting.del = [];
                            widget._UIDEFAULFS.saveData["" + container].setting.add = [];
                            for (var j = 0; j < r.length; j++) {
                                if (widget._UIDEFAULFS.saveData["" + container].setting.original.indexOf(r[j].setId) == -1) {
                                    widget._UIDEFAULFS.saveData["" + container].setting.original.push(r[j].setId);
                                }
                                if (r[j].setId == odata.uuid) {
                                    node.state = {
                                        selected: true
                                    }
                                }
                            }
                        }
                        widget._UIDEFAULFS.treeData[0] = {
                            id: 'bs-node',
                            text: "业务权限",
                            icon: "icon-desktop",
                            type: "bsrNode",
                            state: {
                                opened: true
                            },
                            children: []
                        };
                        widget._UIDEFAULFS.treeData[1] = {
                            id: 'fs-node',
                            text: "功能权限",
                            icon: "icon-cog",
                            type: "bfrNode",
                            state: {
                                opened: true
                            },
                            children: []
                        }

                        widget._UIDEFAULFS.treeData[1].children.push(node);
                    }
                }
            }).done(function () {
                widget._setTreeNodeData(container);
            });
        });
    },
    //构建视图权限tree---screen
    _setTreeNodeData: function (container) {
        widget._UIDEFAULFS.saveData["" + container].screen = {};
        widget._UIDEFAULFS.saveData["" + container].screen.original = [];
        widget._UIDEFAULFS.saveData["" + container].screen.del = [];
        widget._UIDEFAULFS.saveData["" + container].screen.add = [];
        widget._UIDEFAULFS.saveData["" + container].view = {};
        widget._UIDEFAULFS.saveData["" + container].view.original = [];
        widget._UIDEFAULFS.saveData["" + container].view.del = [];
        widget._UIDEFAULFS.saveData["" + container].view.add = [];
        widget._UIDEFAULFS.saveData["" + container].applet = {};
        widget._UIDEFAULFS.saveData["" + container].applet.original = [];
        widget._UIDEFAULFS.saveData["" + container].applet.del = [];
        widget._UIDEFAULFS.saveData["" + container].applet.add = [];
        widget._UIDEFAULFS.saveData["" + container].setting = {
            original: [],
            del: [],
            add: []
        }
        Iptools.GetJson({
            url: "basic/getResTree",
            data: {
                token: Iptools.DEFAULTS.token,
                channel: "web",
                resId: widget._UIDEFAULFS.valId
            }
        }).done(function (data) {
            for (var d = 0; d < data.length; d++) {
                var snode = {
                    sid: data[d].uuid,
                    text: data[d].displayName,
                    type: data[d].type,
                    icon: data[d].iconUrl,
                    children: [],
                    state: {
                        opened: false
                    }
                };
                if (data[d].selected) {

                    widget._UIDEFAULFS.saveData["" + container].screen.original.push(data[d].uuid);
                    widget._UIDEFAULFS.saveData["" + container].screen.del.push(data[d].uuid);
                }
                for (var c = 0; c < data[d].children.length; c++) {
                    var vnode = {
                        vid: data[d].children[c].uuid,
                        text: data[d].children[c].displayName,
                        icon: "icon-columns",
                        type: data[d].children[c].type,
                        children: [],
                        state: {
                            opened: false
                        }
                    };
                    if (data[d].children[c].selected) {

                        widget._UIDEFAULFS.saveData["" + container].view.original.push(data[d].children[c].uuid);
                        widget._UIDEFAULFS.saveData["" + container].view.del.push(data[d].children[c].uuid);
                        vnode.state.selected = true;
                    }
                    for (var a = 0; a < data[d].children[c].children.length; a++) {
                        var anode = {
                            aid: data[d].children[c].children[a].uuid,
                            text: data[d].children[c].children[a].displayName,
                            type: "applet",
                            icon: "icon-tablet",
                            state: {
                                selected: false,
                                opened: false
                            }
                        };
                        if (data[d].children[c].children[a].selected) {

                            widget._UIDEFAULFS.saveData["" + container].applet.original.push(data[d].children[c].children[a].uuid);
                            widget._UIDEFAULFS.saveData["" + container].applet.del.push(data[d].children[c].children[a].uuid);
                            anode.state.selected = true;
                        }
                        vnode.children.push(anode);
                    }
                    snode.children.push(vnode);
                }
                widget._UIDEFAULFS.treeData[0].children.push(snode);
            };
        }).done(function () {
            $(container + " " + widget._UIDEFAULFS.Tree).html("");
            $(container + " " + widget._UIDEFAULFS.Tree).jstree({
                "core": {
                    data: widget._UIDEFAULFS.treeData
                },
                "checkbox": {
                    keep_selected_style: false
                },
                "plugins": ["checkbox"]
            });
        });
    },
    //当前和初始化对比
    _setNodeData: function (options) {
        switch (options.node.original.type) {
            case "screen":
                if (widget._UIDEFAULFS.saveData["" + options.container].screen.original.indexOf(options.node.original.sid) == -1) {
                    if (widget._UIDEFAULFS.saveData["" + options.container].screen.add.indexOf(options.node.original.sid) == -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].screen.add.push(options.node.original.sid);
                    }
                } else {
                    if (widget._UIDEFAULFS.saveData["" + options.container].screen.del.indexOf(options.node.original.sid) != -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].screen.del.splice(widget._UIDEFAULFS.saveData["" + options.container].screen.del.indexOf(options.node.original.sid), 1);
                    }
                }
                break;
            case "view":
                if (widget._UIDEFAULFS.saveData["" + options.container].view.original.indexOf(options.node.original.vid) == -1) {
                    if (widget._UIDEFAULFS.saveData["" + options.container].view.add.indexOf(options.node.original.vid) == -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].view.add.push(options.node.original.vid);
                    }
                } else {
                    if (widget._UIDEFAULFS.saveData["" + options.container].view.del.indexOf(options.node.original.vid) != -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].view.del.splice(widget._UIDEFAULFS.saveData["" + options.container].view.del.indexOf(options.node.original.vid), 1);
                    }
                }
                widget._setNodeData({
                    node: $(options.container + " " + widget._UIDEFAULFS.Tree).jstree().get_node(options.node.parent),
                    container: options.container
                });
                break;
            case "applet":
                if (widget._UIDEFAULFS.saveData["" + options.container].applet.original.indexOf(options.node.original.aid) == -1) {
                    if (widget._UIDEFAULFS.saveData["" + options.container].applet.add.indexOf(options.node.original.aid) == -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].applet.add.push(options.node.original.aid);
                    }
                } else {
                    if (widget._UIDEFAULFS.saveData["" + options.container].applet.del.indexOf(options.node.original.aid) != -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].applet.del.splice(widget._UIDEFAULFS.saveData["" + options.container].applet.del.indexOf(options.node.original.aid), 1);
                    }
                }
                var apnode = $(options.container + " " + widget._UIDEFAULFS.Tree).jstree().get_node(options.node.parent);
                widget._setNodeData({
                    node: apnode,
                    container: options.container
                });
                widget._setNodeData({
                    node: $(options.container + " " + widget._UIDEFAULFS.Tree).jstree().get_node(apnode.parent),
                    container: options.container
                });
                break;
            case "setting":
                if (widget._UIDEFAULFS.saveData["" + options.container].setting.original.indexOf(options.node.original.rid) == -1) {
                    if (widget._UIDEFAULFS.saveData["" + options.container].setting.add.indexOf(options.node.original.rid) == -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].setting.add.push(options.node.original.rid);
                    }
                } else {
                    if (widget._UIDEFAULFS.saveData["" + options.container].setting.del.indexOf(options.node.original.rid) != -1) {
                        widget._UIDEFAULFS.saveData["" + options.container].setting.del.splice(widget._UIDEFAULFS.saveData.setting.del.indexOf(options.node.original.rid), 1);
                    }
                }
                break;
        }
    },
    //保存
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
                var parentId = btn.closest(".tab-pane").attr("id");
                var roleName = $("#" + parentId + " #roleName").val();
                //return false;
                if (!Iptools.Tool._checkNull(roleName)) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "权限名称不可为空"
                    });
                    setTimeout(function () {
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    }, 800);
                    return false;
                } else {
                    if (roleName.length > 15) {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "权限名称长度小于15"
                        });
                        setTimeout(function () {
                            btn.button("reset");
                            btn.css("pointer-events", "auto");
                        }, 800);
                        return false;
                    }
                    Iptools.PutJson({
                        url: "basic/responsibilitys",
                        data: {
                            id: widget._UIDEFAULFS.valKey,
                            token: Iptools.DEFAULTS.token,
                            name: roleName
                        }
                    }).done(function () {
                        var nodes = $("#" + parentId + " " + widget._UIDEFAULFS.Tree).jstree().get_selected();
                        for (var n = 0; n < nodes.length; n++) {
                            widget._setNodeData({
                                node: $("#" + parentId + " " + widget._UIDEFAULFS.Tree).jstree().get_node(nodes[n]),
                                container: "#" + parentId
                            });
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].setting.add.length) {
                            Iptools.PostJson({
                                url: "basic/linkResSetting",
                                data: {
                                    token: Iptools.DEFAULTS.token,
                                    resId: widget._UIDEFAULFS.valId,
                                    settingIdList: widget._UIDEFAULFS.saveData["#" + parentId].setting.add.join(",")
                                }
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].setting.add.length = 0;
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].setting.del.length) {
                            Iptools.DeleteJson({
                                url: "basic/deleteByResAndSettingId" + "?token=" + Iptools.DEFAULTS.token + "&resId="
                                + widget._UIDEFAULFS.valId + "&settingIdList=" + widget._UIDEFAULFS.saveData["#" + parentId].setting.del.join(","),
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].setting.del.length = 0;
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].screen.add.length) {
                            Iptools.PostJson({
                                url: "basic/linkResScreen",
                                data: {
                                    token: Iptools.DEFAULTS.token,
                                    resId: widget._UIDEFAULFS.valId,
                                    screenIdList: widget._UIDEFAULFS.saveData["#" + parentId].screen.add.join(",")
                                }
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].screen.add.length = 0;
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].screen.del.length) {
                            Iptools.DeleteJson({
                                url: "basic/deleteByResAndScreenId" + "?token=" + Iptools.DEFAULTS.token + "&resId="
                                + widget._UIDEFAULFS.valId + "&screenIdList=" + widget._UIDEFAULFS.saveData["#" + parentId].screen.del.join(","),
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].screen.del.length = 0;
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].view.add.length) {
                            Iptools.PostJson({
                                url: "basic/linkResView",
                                data: {
                                    token: Iptools.DEFAULTS.token,
                                    resId: widget._UIDEFAULFS.valId,
                                    viewIdList: widget._UIDEFAULFS.saveData["#" + parentId].view.add.join(",")
                                }
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].view.add.length = 0;
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].view.del.length) {
                            Iptools.DeleteJson({
                                url: "basic/deleteByResAndViewId" + "?token=" + Iptools.DEFAULTS.token + "&resId="
                                + widget._UIDEFAULFS.valId + "&viewIdList=" + widget._UIDEFAULFS.saveData["#" + parentId].view.del.join(",")
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].view.del.length = 0;
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].applet.add.length) {
                            Iptools.PostJson({
                                url: "basic/linkResApplet",
                                data: {
                                    token: Iptools.DEFAULTS.token,
                                    resId: widget._UIDEFAULFS.valId,
                                    appletIdList: widget._UIDEFAULFS.saveData["#" + parentId].applet.add.join(",")
                                }
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].applet.add.length = 0;
                        }
                        if (widget._UIDEFAULFS.saveData["#" + parentId].applet.del.length) {
                            Iptools.DeleteJson({
                                url: "basic/deleteByResAndAppletId" + "?token=" + Iptools.DEFAULTS.token + "&resId="
                                + widget._UIDEFAULFS.valId + "&appletIdList=" + widget._UIDEFAULFS.saveData["#" + parentId].applet.del.join(","),
                            });
                            widget._UIDEFAULFS.saveData["#" + parentId].applet.del.length = 0;
                        }
                        if (widget._UIDEFAULFS.orgResData["#" + parentId].add.length) {
                            Iptools.PostJson({
                                url: "/basic/resOrgLinks/link",
                                data: {
                                    token: Iptools.DEFAULTS.token,
                                    resId: widget._UIDEFAULFS.valId,
                                    idList: widget._UIDEFAULFS.orgResData["#" + parentId].add.join(",")
                                }
                            });
                            widget._UIDEFAULFS.orgResData["#" + parentId].add.length = 0;
                        }
                        if (widget._UIDEFAULFS.orgResData["#" + parentId].del.length) {
                            Iptools.DeleteJson({
                                url: "basic/resOrgLinks/deleteByResId" + "?token=" + Iptools.DEFAULTS.token + "&resId="
                                + widget._UIDEFAULFS.valId + "&idList=" + widget._UIDEFAULFS.orgResData["#" + parentId].del.join(","),
                            });
                            widget._UIDEFAULFS.orgResData["#" + parentId].del.length = 0;
                        }
                        //数据权限相关
                        for (var item in widget._UIDEFAULFS.resAppletData[parentId]) {
                            var adata = widget._UIDEFAULFS.resAppletData[parentId][item];
                            for (var i = 0; i < adata.originalList.length; i++) {
                                Iptools.DeleteJson({
                                    async: false,
                                    url: "basic/resDataLinks/" + adata.originalList[i] + "?token=" + Iptools.DEFAULTS.token
                                });
                            }
                            switch (adata.type) {
                                case 1:
                                    for (var oi = 0; oi < adata.orgList.length; oi++) {
                                        Iptools.PostJson({
                                            async: false,
                                            url: "/basic/resDataLinks",
                                            data: {
                                                token: Iptools.DEFAULTS.token,
                                                resId: widget._UIDEFAULFS.valId,
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
                                                resId: widget._UIDEFAULFS.valId,
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
                                            resId: widget._UIDEFAULFS.valId,
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
                                            resId: widget._UIDEFAULFS.valId,
                                            columnId: item,
                                            type: adata.type,
                                        }
                                    });
                                    break;
                            }
                        }
                        setTimeout(function () {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "权限编辑成功"
                            });
                            self.location = self.location;
                        }, 1000);
                    });
                }
                return false;
            }
        });
    },
    //增加人事架构btn
    _enableAddResOrgSelect: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".btn-org-add",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var $selected = $(this).closest(".col-sm-12").find("#org_tree_select");
                var id = $selected.data("id").toString();
                var parentId = $(this).closest(".setting-modal-item").attr("id");
                if (id != "0") {
                    var li = document.createElement("li");
                    var span = document.createElement("span");
                    $(span).addClass("org-minus-icon fa fa-minus");
                    $(span).data("id", $selected.data("id"));
                    $(li).append($selected.data("text"), span);
                    if (widget._UIDEFAULFS.orgResData["#" + parentId].original.indexOf(id) == -1) {
                        if (widget._UIDEFAULFS.orgResData["#" + parentId].add.indexOf(id) == -1) {
                            $(this).closest(".tab-pane").find("#choose_res_org_list").append(li);
                            widget._UIDEFAULFS.orgResData["#" + parentId].add.push(id);
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "节点已存在"
                            });
                        }
                    } else {
                        if (widget._UIDEFAULFS.orgResData["#" + parentId].del.indexOf(id) != -1) {
                            $(this).closest(".tab-pane").find("#choose_res_org_list").append(li);
                            widget._UIDEFAULFS.orgResData["#" + parentId].del.splice(widget._UIDEFAULFS.orgResData["#" + parentId].del.indexOf(id), 1);
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "节点已存在"
                            });
                        }
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
        //删除已经选择的节点
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".org-minus-icon",
            event: function () {
                var parentId = $(this).closest(".setting-modal-item").attr("id");
                if (widget._UIDEFAULFS.orgResData["#" + parentId].original.indexOf($(this).data("id").toString()) != -1) {

                    widget._UIDEFAULFS.orgResData["#" + parentId].del.push($(this).data("id"));
                }
                $(this).parent().remove();
            }
        });
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".applet-org-minus-icon",
            event: function () {
                var index = -1;
                var parentId = $(this).closest(".setting-modal-item").attr("id");
                for (var i = 0; i < widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].orgList.length; i++) {
                    var odata = widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].orgList[i];
                    if (odata.id == $(this).data("id")) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].orgList.splice(index, 1);
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
                var parentId = $(this).closest(".setting-modal-item").attr("id");
                for (var i = 0; i < widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].posList.length; i++) {
                    var pdata = widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].posList[i];
                    if (pdata.id == $(this).data("id")) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].posList.splice(index, 1);
                }
                $(this).parent().remove();
            }
        });
    },
    //配置某个表的数据弹窗
    _showAppletResDataPanel: function (options) {
        var parentId = options.$this.closest(".setting-modal-item").attr("id");
        $("#" + parentId + " " + widget._UIDEFAULFS.resDataColumnPanel).html("");
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
                        $("#" + parentId + " " + widget._UIDEFAULFS.resDataColumnPanel).append(a);
                        rcn = true;
                    }
                }
                if (!rcn) {
                    $("#" + parentId + " " + widget._UIDEFAULFS.resDataColumnPanel).append("<p>无可用项</p>");
                }
            }
        });
        widget._UIDEFAULFS.currentResColumn = 0;

        $("#" + parentId + " .res_data_types").selectpicker("val", "");
        if ($("#" + parentId + " button[data-id=res_data_type]").length > 1) {
            $("#" + parentId + " button[data-id=res_data_type]:first").remove();
            $("#" + parentId + " .input-group-btn").css({ "border": "none", "box-shadow": "initial" });
        }
        $("#" + parentId + " .res_data_types").trigger("changed.bs.select");
        $("#" + parentId + " .res_data_types").prop('disabled', true);
        $("#" + parentId + " .res_data_types").selectpicker('refresh');
        $("#" + parentId + " " + widget._UIDEFAULFS.resPanel).css({
            "overflow": "auto",
            "margin-top": options.top
        });
        $("#" + parentId + " " + widget._UIDEFAULFS.resPanel).show();
        $("#" + parentId + " " + widget._UIDEFAULFS.resPanel).animate({ "height": "600px" }, 300);
    },
    //可过滤选项--click
    _enableResDataColumnItemClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".res-data-column-item",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var parentId = $(this).closest(".setting-modal-item").attr("id");
                if (!$(this).hasClass("active")) {
                    $("#" + parentId + " " + widget._UIDEFAULFS.resDataColumnPanel).find("a").removeClass("active");
                    $(this).addClass("active");
                    $("#" + parentId + " .res_data_types").prop('disabled', false);
                    //$(".res_data_types").selectpicker('refresh');
                    if (Iptools.Tool._checkNull($(this).data("key"))) {
                        $("#" + parentId + " #choose_res_applet_org_list ul").html("");
                        $("#" + parentId + " #choose_res_applet_pos_list ul").html("");
                        widget._UIDEFAULFS.currentResColumn = $(this).data("key");
                        var data = widget._UIDEFAULFS.resAppletData[parentId][$(this).data("key")];
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
                                        $("#" + parentId + " #choose_res_applet_org_list ul").append(oli);
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
                                        $("#" + parentId + " #choose_res_applet_pos_list ul").append(pli);
                                    }
                                    break;
                            }
                            $("#" + parentId + " .res_data_types").selectpicker("val", data.type);
                            $("#" + parentId + " .res_data_types").selectpicker('refresh');
                            $("#" + parentId + " .res_data_types").trigger("changed.bs.select");
                        } else {
                            $("#" + parentId + " .res_data_types").selectpicker("val", "");
                            $("#" + parentId + " .res_data_types").selectpicker('refresh');
                            $("#" + parentId + " .res_data_types").trigger("changed.bs.select");
                        }
                    }
                }
            }
        });
    },
    //数据权限--每个表的编辑按钮
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
                    applet: $(this).data("applet"),
                    $this: $(this)
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
                var parentId = $(this).closest(".setting-modal-item").attr("id");
                $("#" + parentId + " " + widget._UIDEFAULFS.resPanel).css({
                    "overflow": "hidden",
                });
                $("#" + parentId + " " + widget._UIDEFAULFS.resPanel).animate({
                    height: 0
                }, 300, function () {
                    $("#" + parentId + " " + widget._UIDEFAULFS.resPanel).hide();
                });
            }
        });
    },
    //配置过滤规则-change
    _enableAppletResTypeChange: function () {
        widget._addEventListener({
            container: "body",
            type: "changed.bs.select",
            target: ".res_data_types",
            event: function (e) {
                e = e || event;
                e.stopPropagation();

                var parentId = $(this).closest(".setting-modal-item").attr("id");
                //$("#"+parentId+" .res_data_types").selectpicker('refresh');
                $(this).closest(".type-select").find(".dropdown-toggle").removeClass("btn-default").addClass("commonBtn").addClass("revert");
                $("#" + parentId + " #res_applet_org_select").hide();
                $("#" + parentId + " #res_applet_pos_select").hide();
                $("#" + parentId + " #res_applet_node_check").hide();
                $("#" + parentId + " #add_applet_res").hide();
                $("#" + parentId + " #choose_res_applet_org_list").hide();
                $("#" + parentId + " #choose_res_applet_pos_list").hide();
                //widget._UIDEFAULFS.resAppletData[parentId]={};
                if (widget._UIDEFAULFS.currentResColumn != 0) {
                    if (!Iptools.Tool._checkNull(widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn])) {
                        widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn] = {
                            type: parseInt($("#" + parentId + " .res_data_types").selectpicker("val")),
                            orgList: [],
                            posList: [],
                            originalList: []
                        };
                    } else {
                        widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].type = parseInt($("#" + parentId + " .res_data_types").selectpicker("val"));
                    }
                }
                switch ($("#" + parentId + " .res_data_types").selectpicker("val")) {
                    default:
                        if (widget._UIDEFAULFS.currentResColumn != 0) {
                            widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].type = 0;
                        }
                        break;
                    case "1":
                        $("#" + parentId + " #res_applet_org_select").show();
                        $("#" + parentId + " #res_applet_node_check").show();
                        $("#" + parentId + " #add_applet_res").show();
                        $("#" + parentId + " #choose_res_applet_org_list").show();
                        break;
                    case "3":
                        $("#" + parentId + " #res_applet_pos_select").show();
                        $("#" + parentId + " #res_applet_node_check").show();
                        $("#" + parentId + " #add_applet_res").show();
                        $("#" + parentId + " #choose_res_applet_pos_list").show();
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
                var parentId = $(this).closest(".setting-modal-item").attr("id");
                var conclusive = $("#" + parentId + ' #res_applet_conclusive_box').bootstrapSwitch('state');
                var conText = conclusive ? "(包含子节点)" : "(不包含子节点)";
                var hasData = false;
                switch ($("#" + parentId + " .res_data_types").selectpicker("val")) {
                    case "1":
                        for (var i = 0; i < widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].orgList.length; i++) {
                            var odata = widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].orgList[i];
                            if (odata.id == $("#" + parentId + " #applet_org_tree_select").data("id")) {
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
                            var oli = document.createElement("li");
                            var spano = document.createElement("span");
                            $(spano).addClass("applet-org-minus-icon fa fa-minus");
                            $(spano).data("id", $("#" + parentId + " #applet_org_tree_select").data("id"));
                            $(oli).append($("#" + parentId + " #applet_org_tree_select").data("text"), conText, spano);
                            $("#" + parentId + " #choose_res_applet_org_list ul").append(oli);
                            widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].orgList.push({
                                id: $("#" + parentId + " #applet_org_tree_select").data("id"),
                                conclusive: conclusive,
                                name: $("#" + parentId + " #applet_org_tree_select").data("text")
                            });
                        }
                        break;
                    case "3":
                        for (var j = 0; j < widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].posList.length; j++) {
                            var pdata = widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].posList[j];
                            if (pdata.id == $("#" + parentId + " #applet_pos_tree_select").data("id")) {
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
                            $(spanp).data("id", $("#" + parentId + " #applet_pos_tree_select").data("id"));
                            $(pli).append($("#" + parentId + " #applet_pos_tree_select").data("text"), conText, spanp);
                            $("#" + parentId + " #choose_res_applet_pos_list ul").append(pli);
                            widget._UIDEFAULFS.resAppletData[parentId][widget._UIDEFAULFS.currentResColumn].posList.push({
                                id: $("#" + parentId + " #applet_pos_tree_select").data("id"),
                                conclusive: conclusive,
                                name: $("#" + parentId + " #applet_pos_tree_select").data("text")
                            });
                        }
                        break;
                }
            }
        });
    },
};
