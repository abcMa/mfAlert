//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :New
/**
 ui element styles and placement
 this widget is only adapted to CRM workspace for PC
 style :tag panels listing and horizend placements style
 **/
var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        nodePanel: "#tree",
        newOrgModal: "#org_new",
        newPosModal: "#pos_new",
        selectOrgPanel: ".org_select_tree",
        selectPosPanel: ".pos_select_tree",
        personPanel: "#person_list_panel",
        //personContainer: "#person_list_page_container",
        personForm: "#person_form",
        nodeId: 1,
        snodeId: 1,
        spnodeId: 1,
        nomatch: false,
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
        widget._enableNewpersonLink();
        widget._enableCheckboxAll();
        widget._enableListItemClick();
        widget._enableListItemCheckboxClick();
        widget._enablePersonListSearch();
        widget._enableNoMatchClick();
        widget._enableUpdateLink();
    },
    _bindingEventAfterLoad: function () {
        widget._focusSearchInput();
        widget._blurSearchInput();
        widget._clickSearchIcon();
    },
    _init: function () {
        Iptools.Tool._coverWindowShow();
        setTimeout(function () {
            widget._bindingDomEvent();
            widget._setPersonsTree();
            widget._bindingEventAfterLoad();
        }, 1000);
    },
    _clickSearchIcon:function(){
        widget._addEventListener({
            container: "body",
            target: ".searchIcon",
            type: "click",
            event: function () {
                var $e = $(this);
                //$e.closest(".settings-bar").hide();
                var searchInput = $e.closest(".settings-bar").next("#searchPanel");
                if(searchInput.css("display") == "none"){
                    searchInput.slideDown();;
                }else{
                    searchInput.slideUp();;
                }

            }
        });
    },
    _focusSearchInput: function(){
        widget._addEventListener({
            container: "body",
            target: ".search_list input",
            type: "focus",
            event: function () {
                $('.search_list .search_icon').hide();
                $('.search_list button').show();
            }
        });
    },
    _blurSearchInput: function(){
        widget._addEventListener({
            container: "body",
            target: ".search_list input",
            type: "blur",
            event: function () {
                $('.search_list .search_icon').show();
                $('.search_list button').hide();
            }
        });
    },
    _getCurrentNode: function () {
        var cnode = $(".jsnode_selected_single");
        if (cnode && cnode.length > 0) {
            return $(widget._UIDEFAULFS.nodePanel).jstree().get_node(cnode.attr("id"));
        }
        return false;
    },
    //得到职位节点
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
    _setOrgTreeNode: function (data, type) {
        var res = [];
        if (data && data.length) {
            $.each(data, function (key, obj) {
                var node = {
                    "id": (type == "select" ? (widget._UIDEFAULFS.snodeId++) :
                        (type == "selectorgnew" ? (widget._UIDEFAULFS.spnodeId++) : (widget._UIDEFAULFS.nodeId++))),
                    "oid": obj.id,
                    "text": obj.viewName,
                    "state": { "opened": false },
                    "icon": "icon-sitemap org-node",
                    "type": "org",
                    "children": []
                };
                if (obj.nodes && obj.nodes.length) {
                    var onodes = widget._setOrgTreeNode(obj.nodes, type);
                    for (var j = 0; j < onodes.length; j++) {
                        node.children.push(onodes[j]);
                    }
                }
                res.push(node);
            });
        }
        return res;
    },
    _setPersonsTree: function () {
        $(widget._UIDEFAULFS.personForm).data("searchCondition", []);
        var nodesdata;
        Iptools.GetJson({
            url: "basic/organization/treeview",
            data: {
                token: Iptools.DEFAULTS.token,
            },
        }).done(function (r) {
            if(r){
                nodesdata = widget._setOrgTreeNode(r);
                $(widget._UIDEFAULFS.nodePanel).jstree({
                    'core': {
                        'data': nodesdata,
                        "check_callback": true,
                    },
                }).bind("loaded.jstree", function () {
                    var nodeId = 1;
                    var node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(nodeId);
                    //console.log(node)
                    if (node && node.original.type == "org" && nodeId < widget._UIDEFAULFS.nodeId) {
                        var data;
                        //console.log(node)
                        Iptools.GetJson({
                            url: "basic/positions/treeview",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                //orgId: node.original.oid
                            },
                        }).done(function (r) {
                            if(r){
                                data = widget._setPosTreeNode(r);
                                if (data && data.length > 0) {
                                    for (var i = data.length - 1; i >= 0; i--) {
                                        $(widget._UIDEFAULFS.nodePanel).jstree().create_node(nodeId, data[i], "first");
                                    }
                                }
                                node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(++nodeId);
                            }
                        });
                        Iptools.Tool._coverWindowHide();//取消遮罩
                    }
                    try {
                        //console.log($(widget._UIDEFAULFS.nodePanel).jstree().get_node(1).original.oid)
                        widget._setPersonsList({
                            type: $(widget._UIDEFAULFS.nodePanel).jstree().get_node(1).original.type,
                            oid: $(widget._UIDEFAULFS.nodePanel).jstree().get_node(1).original.oid,
                            pid: $(widget._UIDEFAULFS.nodePanel).jstree().get_node(1).original.pid,
                            pageNow: 1,
                        });
                    } catch (e) {
                        Iptools.Tool._coverWindowHide();//取消遮罩
                    }
                }).bind("changed.jstree", function (e, data) {
                    $("#person_name_search").val("");
                    $("#person_phone_search").val("");
                    $("#remove_node").removeAttr("disabled");
                    $(".jsnode_selected_single").removeClass("jsnode_selected_single");
                    $(widget._UIDEFAULFS.nodePanel).find("#" + data.node.a_attr.id).addClass("jsnode_selected_single");
                    widget._setPersonsList({
                        type: data.node.original.type,
                        oid: data.node.original.oid,
                        pid: data.node.original.pid,
                        pageNow: 1,
                    });
                });
            }
        }).fail(function(){
            Iptools.Tool._coverWindowHide();//取消遮罩
        });
    },
    //筛选条件为姓名手机
    _setNoMatchPersonList: function (options) {
        $(widget._UIDEFAULFS.personPanel).html("");
        var data = {
            token: Iptools.DEFAULTS.token,
            pageNow: options.pageNow,
            pagesize: 10,
        };
        if (Iptools.Tool._checkNull(options.name)) {
            data["name"] = options.name;
        }
        if (Iptools.Tool._checkNull(options.phone)) {
            data["phone"] = options.phone;
        }
        //console.log(data)
        Iptools.GetJson({
            url: "basic/getEmpsWithoutValidOP",
            data: data,
        }).done(function (r) {
            if(r){
                if (r.records && r.records.length > 0) {
                    $("#pager-example-panel").css("display","block");
                    component._pager({
                        container: "pager-example-panel",//ID选择器
                        pageSize: r.pageSize,
                        pageCount: r.pageCount,
                        rowCount: r.rowCount,
                        pageNow: r.pageNow,
                        jump: function (page) {
                            var name = $("#person_name_search").val().trim();
                            var phone = $("#person_phone_search").val().trim();
                            if ($(".jsnode_selected_single").length) {
                                node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node($(".jsnode_selected_single").attr("id"));
                            } else {
                                node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(1);
                            };
                            if (widget._UIDEFAULFS.nomatch) {
                                widget._setNoMatchPersonList({
                                    pageNow: page,
                                    name: name,
                                    phone: phone
                                });
                            } else {
                                widget._setPersonsList({
                                    type: node.original.type,
                                    oid: node.original.oid,
                                    pid: node.original.pid,
                                    pageNow: page,
                                    name: name,
                                    phone: phone,
                                });
                            }
                        }
                    });
                    widget._setPersonPanel({
                        data: r,
                    });
                }else{
                    $("#pager-example-panel").css("display","none");
                    var html="<tr style='background-color:white;'><th></th><th style='text-align: right;'>暂时没有数据</th><th></th><th></th></tr>";
                    $("#person_list_panel").html(html);
                }
            }
        });
    },
    //筛选条件  未分配人员、分配人员和姓名手机
    _setPersonsList: function (options) {
        //console.log(options)
        widget._UIDEFAULFS.nomatch = false;
        $(widget._UIDEFAULFS.personPanel).html("");
        var data = {
            token: Iptools.DEFAULTS.token,
            pageNow: options.pageNow,
            pagesize: 10,
        };
        if (options.type == "org") {
            data["organization"] = options.oid;
        }
        if (options.type == "pos") {
            data["position"] = options.pid;
        }
        if (Iptools.Tool._checkNull(options.name)) {
            data["name"] = options.name;
        }
        if (Iptools.Tool._checkNull(options.phone)) {
            data["phone"] = options.phone;
        }
        //console.log(data)
        Iptools.GetJson({
            url: "basic/searchEmps",
            data: data,
        }).done(function (r) {
            if(r){
                //console.log(r)
                if (r.records && r.records.length > 0) {
                    $("#pager-example-panel").css("display","block");
                    component._pager({
                        container: "pager-example-panel",//ID选择器
                        pageSize: r.pageSize,
                        pageCount: r.pageCount,
                        rowCount: r.rowCount,
                        pageNow: r.pageNow,
                        jump: function (page) {
                            var name = $("#person_name_search").val().trim();
                            var phone = $("#person_phone_search").val().trim();
                            var node;
                            if ($(".jsnode_selected_single").length) {
                                node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node($(".jsnode_selected_single").attr("id"));
                            } else {
                                node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(1);
                            };
                            if (widget._UIDEFAULFS.nomatch) {
                                widget._setNoMatchPersonList({
                                    pageNow: page,
                                    name: name,
                                    phone: phone
                                });
                            } else {
                                widget._setPersonsList({
                                    type: node.original.type,
                                    oid: node.original.oid,
                                    pid: node.original.pid,
                                    pageNow: page,
                                    name: name,
                                    phone: phone,
                                });
                            }
                        }
                    });
                    widget._setPersonPanel({
                        data: r,
                    });
                }else{
                    $("#pager-example-panel").css("display","none");
                    var html="<tr style='background-color:white;'><th></th><th style='text-align: right;'>暂时没有数据</th><th></th><th></th></tr>";
                    $("#person_list_panel").html(html);
                }
            }
        });
    },
    _setPersonPanel: function (options) {
        for (var i = 0; i < options.data.records.length; i++) {
            var tr = document.createElement("tr");
            $(tr).addClass("person-row");
            var tdi = document.createElement("td");
            var ipc = document.createElement("input");
            $(ipc).attr("type", "checkbox");
            $(ipc).attr("name", "selectListCheckbox");
            $(ipc).data("id", options.data.records[i].id);
            $(tdi).append(ipc);
            $(tr).append(tdi);
            $(tr).append("<td>" + options.data.records[i].name + "</td>");
            $(tr).append("<td>" + options.data.records[i].phone + "</td>");
            var tde = document.createElement("td");
            var ae = document.createElement("a");
            $(ae).attr("href", "javascript:;");
            $(ae).addClass("update_person_link");
            $(ae).data("id", options.data.records[i].id);
            $(ae).html("编辑");
            $(tde).append(ae);
            $(tr).append(tde);
            $(widget._UIDEFAULFS.personPanel).append(tr);
        }
    },
    _setListPaginationPanel: function (options) {
        //var pag = document.createElement("div");
        //$(pag).attr("class", "pagination");
        //var paf = document.createElement("div");
        //$(paf).attr("class", "pageForm");
        //var bsp = document.createElement("span");
        //$(bsp).attr("class", "base");
        //var bspa = document.createElement("span");
        //$(bspa).attr("class", "arrow-left");
        //$(bspa).attr("data-page", options.pageNow);
        //$(bspa).attr("data-total", options.data.pageCount);
        //$(bspa).attr("data-type", options.type);
        //$(bspa).attr("data-oid", options.oid);
        //$(bspa).attr("data-pid", options.pid);
        //$(bspa).attr("data-rowcount", options.data.rowCount);
        //var pagpre = document.createElement("a");
        //$(pagpre).attr("class", "pageSkip");
        //$(pagpre).attr("title", "上一页");
        //$(bspa).append(pagpre);
        //var pagnum = document.createElement("a");
        //$(pagnum).attr("class", "pagenum");
        //$(pagnum).html(options.pageNow + "/" + options.data.pageCount);
        //var bspn = document.createElement("span");
        //$(bspn).attr("class", "arrow-right");
        //$(bspn).attr("data-page", options.pageNow);
        //$(bspn).attr("data-total", options.data.pageCount);
        //$(bspn).attr("data-type", options.type);
        //$(bspn).attr("data-oid", options.oid);
        //$(bspn).attr("data-pid", options.pid);
        //$(bspn).attr("data-rowcount", options.data.rowCount);
        //var pagnxt = document.createElement("a");
        //$(pagnxt).attr("class", "pageNext");
        //$(pagnxt).attr("title", "下一页");
        //$(bspn).append(pagnxt);
        //$(bsp).append(bspa, pagnum, bspn);
        //var psp = document.createElement("span");
        //$(psp).addClass("pageCountCalText");
        //var pageNowCount = options.data.pageSize;
        //if (options.pageNow >= options.data.pageCount) {
        //    pageNowCount = options.data.rowCount - (options.pageNow - 1) * options.data.pageSize;
        //}
        //$(psp).html("本页" + pageNowCount + "条，共" + options.data.rowCount + "条");
        //var pagip = document.createElement("input");
        //$(pagip).attr("class", "pageInput");
        //$(pagip).attr("type", "text");
        //$(pagip).attr("maxlength", "4");
        //var pagbtn = document.createElement("button");
        //$(pagbtn).attr("class", "pageButton btn-sm");
        //$(pagbtn).attr("data-parent", options.container);
        //$(pagbtn).attr("data-type", options.type);
        //$(pagbtn).attr("data-oid", options.oid);
        //$(pagbtn).attr("data-pid", options.pid);
        //$(pagbtn).attr("data-rowcount", options.data.rowCount);
        //$(pagbtn).html("跳转");
        //$(paf).append(bsp, psp, pagip, pagbtn);
        //$(pag).append(paf);
        //return pag;
    },
    //编辑或者新建员工
    _setValidate: function (options) {
        var track = false;
        var vdr = {};
        if (!options.control.empty && options.control.empty != undefined) {
            vdr["notEmpty"] = {
                message: "不可为空"
            }
            track = true;
        }
        switch (options.control.type) {
            case "time":
                vdr["regexp"] = {
                    regexp: /(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2}:\d{2})/,
                    message: "请输入正确的时间格式（YYYY-mm-dd hh:mm:ss）"
                }
                track = true;
                break;
            case "date":
                vdr["regexp"] = {
                    regexp: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                    message: "请输入正确的日期格式（YYYY-mm-dd）"
                }
                track = true;
                break;
            case "percent":
                vdr["regexp"] = {
                    regexp: /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/,
                    message: "请输入0-100内的数值，小数不超过两位"
                }
                track = true;
                break;
            case "rmb":
                vdr["regexp"] = {
                    regexp: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                    message: "请输入非负的数值，小数不超过两位"
                }
                track = true;
                break;
        }
        if (options.control.reg != undefined) {
            vdr["regexp"] = {
                regexp: eval(options.control.reg),
                message: options.control.regInfo
            }
            track = true;
        }
        if (track) {
            options.validations[options.control.column] = {
                validators: vdr,
            }
        }
        return { validation: options.validations, valid: track };
    },
    //时间日期插件
    _enableTimeOrDateField: function () {
        $(".timeStampPicker").datetimepicker({
            format: "yyyy-mm-dd hh:ii:ss",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
        }).on('hide', function () {
            var me = $(this);
            $("#" + me.data("form")).data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
        $(".dateStampPicker").datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: "month"
        }).on('hide', function () {
            var me = $(this);
            $("#" + me.data("form")).data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
    },
    _enableLightbox: function () {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        });
        lightbox.init();
    },
    //_enablePaginationNext: function () {
    //    widget._addEventListener({
    //        container: "body",
    //        type: "click",
    //        target: ".pagination .arrow-right",
    //        event: function (e) {
    //            e = e || event;
    //            e.stopPropagation();
    //            var me = $(this);
    //            var pageNow = parseInt(me.data("page"));
    //            var pageTotal = parseInt(me.data("total"));
    //            var type = me.data("type");
    //            var oid = me.data("oid");
    //            var pid = me.data("pid");
    //            var name = $("#person_name_search").val().trim();
    //            var phone = $("#person_phone_search").val().trim();
    //            if (pageNow < pageTotal) {
    //                if (widget._UIDEFAULFS.nomatch) {
    //                    widget._setNoMatchPersonList({
    //                        pageNow: pageNow + 1,
    //                        name: name,
    //                        phone: phone,
    //                    });
    //                } else {
    //                    widget._setPersonsList({
    //                        pageNow: pageNow + 1,
    //                        type: type,
    //                        oid: oid,
    //                        pid: pid,
    //                        name: name,
    //                        phone: phone,
    //                    });
    //                }
    //            }
    //        }
    //    });
    //},
    //_enablePaginationPre: function () {
    //    widget._addEventListener({
    //        container: "body",
    //        type: "click",
    //        target: ".pagination .arrow-left",
    //        event: function (e) {
    //            e = e || event;
    //            e.stopPropagation();
    //            var me = $(this);
    //            var pageNow = parseInt(me.data("page"));
    //            var type = me.data("type");
    //            var oid = me.data("oid");
    //            var pid = me.data("pid");
    //            var name = $("#person_name_search").val().trim();
    //            var phone = $("#person_phone_search").val().trim();
    //            if (pageNow > 1) {
    //                if (widget._UIDEFAULFS.nomatch) {
    //                    widget._setNoMatchPersonList({
    //                        pageNow: pageNow - 1,
    //                        name: name,
    //                        phone: phone,
    //                    });
    //                } else {
    //                    widget._setPersonsList({
    //                        pageNow: pageNow - 1,
    //                        type: type,
    //                        oid: oid,
    //                        pid: pid,
    //                        name: name,
    //                        phone: phone,
    //                    });
    //                }
    //            }
    //        }
    //    });
    //},
    //_enablePaginationClick: function () {
    //    widget._addEventListener({
    //        container: "body",
    //        type: "click",
    //        target: ".pagination .pageButton",
    //        event: function (e) {
    //            e = e || event;
    //            e.stopPropagation();
    //            var me = $(this);
    //            var pageNow = parseInt(me.parent().find("input").val());
    //            var pageCurrent = parseInt(me.parent().find(".arrow-right").data("page"));
    //            var pageTotal = parseInt(me.data("total"));
    //            var type = me.data("type");
    //            var oid = me.data("oid");
    //            var pid = me.data("pid");
    //            var name = $("#person_name_search").val().trim();
    //            var phone = $("#person_phone_search").val().trim();
    //            if (pageNow > 0 && pageNow != pageCurrent && !(pageNow > pageTotal)) {
    //                if (widget._UIDEFAULFS.nomatch) {
    //                    widget._setNoMatchPersonList({
    //                        pageNow: pageNow,
    //                        name: name,
    //                        phone: phone,
    //                    });
    //                } else {
    //                    widget._setPersonsList({
    //                        pageNow: pageNow,
    //                        type: type,
    //                        oid: oid,
    //                        pid: pid,
    //                        name: name,
    //                        phone: phone,
    //                    });
    //                }
    //            }
    //            return false;
    //        }
    //    });
    //},
    _enableNewpersonLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".person_new_link",
            event: function () {
                Iptools.setDefaults({ key: "selectUser", value: "" });
                window.location.href = "person.html";
            },
        });
    },
    _enableUpdateLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".update_person_link",
            event: function () {
                Iptools.setDefaults({ key: "selectUser", value: $(this).data("id") });
                window.location.href = "person.html";
            },
        });
    },
    _enableCheckboxAll: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".checkAll",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = this;
                var pan = $(this).parents("table");
                if (btn.checked) {
                    pan.find("input[name='selectListCheckbox']").each(function () {
                        this.checked = true;
                    });
                    $(".person_delete_link").removeClass("input-disabled");
                } else {
                    pan.find("input[name='selectListCheckbox']").each(function () {
                        this.checked = false;
                    });
                    $(".person_delete_link").addClass("input-disabled");
                }
            }
        });
    },
    _enableListItemClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".person-row",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var row = $(this);
                var pan = row.parent().parent();
                var check = row.find("input[name='selectListCheckbox']")[0];
                if (check.checked) {
                    check.checked = false;
                    if (!pan.find("input[name='selectListCheckbox']:checked").length) {
                        $(".person_delete_link").addClass("input-disabled");
                    }
                    pan.find(".checkAll")[0].checked = false;
                } else {
                    check.checked = true;
                    $(".person_delete_link").removeClass("input-disabled");
                    if (pan.find("input[name='selectListCheckbox']:checked").length == pan.find("input[name='selectListCheckbox']").length) {
                        pan.find(".checkAll")[0].checked = true;
                    }
                }
            }
        });
    },
    _enableListItemCheckboxClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "input[name='selectListCheckbox']",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = this;
                var pan = $(this).parents("table").parent().parent();
                if (me.checked) {
                    $(".person_delete_link").removeClass("input-disabled");
                    if (pan.find("input[name='selectListCheckbox']:checked").length == pan.find("input[name='selectListCheckbox']").length) {
                        pan.find(".checkAll")[0].checked = true;
                    }
                } else {
                    if (!pan.find("input[name='selectListCheckbox']:checked").length) {
                        $(".person_delete_link").addClass("input-disabled");
                    }
                    pan.find(".checkAll")[0].checked = false;
                }
            }
        });
    },
    //点击搜索按钮
    _enablePersonListSearch: function () {
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: widget._UIDEFAULFS.personForm,
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var name = $("#person_name_search").val().trim();
                var phone = $("#person_phone_search").val().trim();
                var node;
                if ($(".jsnode_selected_single").length) {
                    node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node($(".jsnode_selected_single").attr("id"));
                } else {
                    node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(1);
                }
                if (widget._UIDEFAULFS.nomatch) {
                    widget._setNoMatchPersonList({
                        pageNow: 1,
                        name: name,
                        phone: phone
                    });
                } else {
                    widget._setPersonsList({
                        type: node.original.type,
                        oid: node.original.oid,
                        pid: node.original.pid,
                        pageNow: 1,
                        name: name,
                        phone: phone,
                    });
                }
                return false;
            }
        });
    },
    //点击未分配人员
    _enableNoMatchClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#search_without_match",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                widget._UIDEFAULFS.nomatch = true;
                widget._setNoMatchPersonList({
                    pageNow: 1,
                });
            }
        });
    },
};