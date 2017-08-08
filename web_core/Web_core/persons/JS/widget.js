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
        rootUpdateOrgModal: "#root_org_update",
        updateOrgModal: "#org_update",
        updatePosModal: "#pos_update",
        selectOrgPanel: ".org_select_tree",
        selectPosPanel: ".pos_select_tree",
        personPanel: "#person_list_panel",
        personContainer: "person_list_page_container",
        personForm: "#person_form",
        treeSearchForm: "#treeSearch",
        nodeId: 1,
        snodeId: 1,
        spnodeId: 1,
        nomatch: false,
        treeData: [],
        orgTreeData: [],
        openNode: [],
        pageSize: 8,
        statusObj:{}
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
                    searchInput.slideUp();
                }

            }
        });
    },
    _focusSearchInput: function(){
        widget._addEventListener({
            container: "body",
            target: ".search_list input:not(.search_tree_btn)",
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
    _bindingDomEvent: function () {
        widget._enableNewOrgModal();
        widget._enableNewPosModal();
        widget._enableAddNewOrg();
        widget._enableAddNewPos();
        widget._enableRemoveNode();
        widget._enableUpdateNode();
        widget._enableUpdateOrg();
        widget._enableUpdatePos();
        widget._enableUpdateLink();
        widget._enableNewpersonLink();
        widget._enablePaginationNext();
        widget._enablePaginationPre();
        widget._enablePaginationClick();
        //widget._enableCheckboxAll();
        //widget._enableListItemClick();
        //widget._enableListItemCheckboxClick();
        widget._enablePersonDelete();
        widget._enablePersonListSearch();
        widget._enableNoMatchClick();
        widget._enableUpdatePosModal();
        widget._enableRootUpdateOrgModal();
        widget._enableRootUpdateOrg();
        widget._enableUpdateOrgModal();
        widget._enableTreeSearch();

    },
    _bindingEventAfterLoad: function () {
        widget._focusSearchInput();
        widget._blurSearchInput();
        widget._clickSearchIcon();
        //回车提交
        widget.editRootSubmit();
        widget.editOrgSubmit();
        widget.newOrgSubmit();
        widget.editPosSubmit();
        widget.newPosSubmit();
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setBaseData();
        widget._setPersonsTree();
        widget._bindingEventAfterLoad();
    },
    editRootSubmit:function(){
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".form_root_org_update",
            event: function (e) {
                $(".rootorgupdate").trigger("click");
                return false;
            }
        })
    },
    editOrgSubmit:function(){
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".form_org_update",
            event: function (e) {
                $(".orgupdate").trigger("click");
                return false;
            }
        })
    },
    newOrgSubmit:function(){
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".form_org_new",
            event: function (e) {
                $(".addNewOrg").trigger("click");
                return false;
            }
        })
    },
    editPosSubmit:function(){
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".form_pos_update",
            event: function (e) {
                $(".posupdate").trigger("click");
                return false;
            }
        })
    },
    newPosSubmit:function(){
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".form_pos_new",
            event: function (e) {
                $(".addNewPos").trigger("click");
                return false;
            }
        })
    },

    _setBaseData: function () {
        $(".addNewPos").attr("data-loading-text", "<span class='icon-spinner icon-spin' style='margin-right:4px'></span>执行中");
        $(".posupdate").attr("data-loading-text", "<span class='icon-spinner icon-spin' style='margin-right:4px'></span>执行中");
        $(".addNewOrg").attr("data-loading-text", "<span class='icon-spinner icon-spin' style='margin-right:4px'></span>执行中");
        $(".orgupdate").attr("data-loading-text", "<span class='icon-spinner icon-spin' style='margin-right:4px'></span>执行中");
        $(".rootorgupdate").attr("data-loading-text", "<span class='icon-spinner icon-spin' style='margin-right:4px'></span>执行中");
        Iptools.uidataTool._getView({
            async: false,
            view: Iptools.DEFAULTS.currentView,
        }).done(function (data) {
            var openNodes = Iptools.Tool._getTabData({
                view: Iptools.DEFAULTS.currentView,
                type: data.view.type,
            })["nodeTreeSelected"];
            if (openNodes) {
                widget._UIDEFAULFS.openNode = Iptools.Tool._getTabData({
                    view: Iptools.DEFAULTS.currentView,
                    type: data.view.type,
                })["nodeTreeSelected"];
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
            try {
                if (widget._UIDEFAULFS.openNode.indexOf(node.id) != -1) {
                    rnode.state.opened = true;
                }
            } catch (e) { }
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
                widget._UIDEFAULFS.orgTreeData.push(widget._setOrgNode(nodes[i], false));
            }
        }
    },
    _setPersonsTree: function () {
        $(widget._UIDEFAULFS.personForm).data("searchCondition", []);
        Iptools.GetJson({
            url: "basic/organization/treeviewPos",
            data: {
                token: Iptools.DEFAULTS.token,
                userId: Iptools.DEFAULTS.userId,
            }
        }).done(function (r) {
            widget._setTreeNode(r);
            $(widget._UIDEFAULFS.nodePanel).jstree({
                'core': {
                    'data': widget._UIDEFAULFS.treeData,
                    "check_callback": true,
                },
                "plugins": ["search"]
            }).bind("changed.jstree", function (e, data) {
                $("#search_without_match").removeClass("active");
                $("#person_name_search").val("");
                $("#person_phone_search").val("");
                $("#remove_node").removeAttr("disabled");
                $(".jsnode_selected_single").removeClass("jsnode_selected_single");
                if (data && data.node) {
                    $(widget._UIDEFAULFS.nodePanel).find("#" + data.node.a_attr.id).addClass("jsnode_selected_single");
                    widget._setPersonsList({
                        type: data.node.original.type,
                        oid: data.node.original.oid,
                        pid: data.node.original.pid,
                        pageNow: 1,
                    });
                }
            }).bind("after_open.jstree", function (e, data) {
                try {
                    if (data && data.node && data.node.original && data.node.original.type == "org") {
                        if (widget._UIDEFAULFS.openNode.indexOf(data.node.original.oid) == -1) {
                            widget._UIDEFAULFS.openNode.push(data.node.original.oid);
                            Iptools.uidataTool._getView({
                                view: Iptools.DEFAULTS.currentView,
                            }).done(function (rv) {
                                Iptools.Tool._setTabData({
                                    view: Iptools.DEFAULTS.currentView,
                                    type: rv.view.type,
                                    key: "nodeTreeSelected",
                                    value: widget._UIDEFAULFS.openNode
                                });
                            });
                        }
                    }
                } catch (e) { }
            }).bind("after_close.jstree", function (e, data) {
                try {
                    if (data && data.node && data.node.original && data.node.original.type == "org") {
                        var index = widget._UIDEFAULFS.openNode.indexOf(data.node.original.oid);
                        if (index != -1) {
                            widget._UIDEFAULFS.openNode.splice(index, 1);
                            Iptools.uidataTool._getView({
                                view: Iptools.DEFAULTS.currentView,
                            }).done(function (rv) {
                                Iptools.Tool._setTabData({
                                    view: Iptools.DEFAULTS.currentView,
                                    type: rv.view.type,
                                    key: "nodeTreeSelected",
                                    value: widget._UIDEFAULFS.openNode
                                });
                            });
                        }
                    }
                } catch (e) { }
            }).bind("search.jstree", function (e, data) {
                try {
                    if (data && data.nodes && data.nodes.length) {
                        $("#" + $(data.nodes[0]).find("a:first").attr("id")).trigger("changed.jstree");
                    }else{
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "搜索结果不存在"
                        });
                    }
                } catch (e) { }
            }).bind("loaded.jstree", function () {
                $(widget._UIDEFAULFS.nodePanel + " a.jstree-anchor").eq(0).trigger("click");
            });
            $(widget._UIDEFAULFS.selectPosPanel).jstree({
                'core': {
                    'data': widget._UIDEFAULFS.treeData,
                    "check_callback": true,
                },
            }).bind("changed.jstree", function (e, data) {
                $("#search_without_match").removeClass("active");
                if (data.node.original.type == "pos") {
                    $("#new_pos_parent").data("id", data.node.original.pid);
                    $("#new_pos_parent").html(data.node.original.text + "<span class='caret'></span>");
                    $("#update_pos_parent").data("id", data.node.original.pid);
                    $("#update_pos_parent").html(data.node.original.text + "<span class='caret'></span>");
                } else {
                    $("#new_pos_parent").data("id", 0);
                    $("#new_pos_parent").html("无<span class='caret'></span>");
                    $("#update_pos_parent").data("id", 0);
                    $("#update_pos_parent").html("无<span class='caret'></span>");
                }
            });
            $(widget._UIDEFAULFS.selectOrgPanel).jstree({
                'core': {
                    'data': widget._UIDEFAULFS.orgTreeData,
                    'check_callback': true,
                },
            }).bind("changed.jstree", function (e, data) {
                $("#new_org_parent").data("id", data.node.original.oid);
                $("#new_org_parent").html(data.node.original.text + "<span class='caret'></span>");
                $("#new_pos_org_parent").data("id", data.node.original.oid);
                $("#new_pos_org_parent").html(data.node.original.text + "<span class='caret'></span>");
                $("#update_org_parent").data("id", data.node.original.oid);
                $("#update_org_parent").html(data.node.original.text + "<span class='caret'></span>");
                $("#update_pos_org_parent").data("id", data.node.original.oid);
                $("#update_pos_org_parent").html(data.node.original.text + "<span class='caret'></span>");
            });
        });
    },
    _setNoMatchPersonList: function (options) {
        $(widget._UIDEFAULFS.personPanel).html("");
        var data = {
            token: Iptools.DEFAULTS.token,
            pageNow: options.pageNow,
            pagesize: widget._UIDEFAULFS.pageSize,
        };
        if (Iptools.Tool._checkNull(options.name)) {
            data["name"] = options.name;
        }
        if (Iptools.Tool._checkNull(options.phone)) {
            data["phone"] = options.phone;
        }
        //未分配人员
        Iptools.GetJson({
            url: "basic/getEmpsWithoutValidOP",
            data: data
        }).done(function (r) {
            if (r.records && r.records.length) {
                widget._setPersonPanel({
                    data: r,
                });
            }else{
                $(".table-responsive").css("text-align","center");
                $(".table-responsive").append("<img src='../Content/Image/nodetail.png'><p>没有搜索到数据，请更换关键词后再次搜索</p>")
            }
            component._pager({
                container: widget._UIDEFAULFS.personContainer,
                pageSize: widget._UIDEFAULFS.pageSize,
                pageCount: r.pageCount,
                rowCount: r.rowCount,
                pageNow: options.pageNow,
                jump: function (page) {
                    widget._setPersonsList(Iptools.Tool._extend(options, {
                        pageNow: page
                    }));
                }
            });
        });
    },
    _setPersonsList: function (options) {
        widget._UIDEFAULFS.nomatch = false;
        $(widget._UIDEFAULFS.personPanel).html("");
        var data = {
            token: Iptools.DEFAULTS.token,
            pageNow: options.pageNow,
            pagesize: widget._UIDEFAULFS.pageSize,
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
        Iptools.GetJson({
            url: "basic/searchEmps",
            data: data
        }).done(function (r) {
            if (r.records && r.records.length) {
                widget._setPersonPanel({
                    data: r,
                });
            }else{
                $(".table-responsive").css("text-align","center");
                $(".table-responsive").append("<img src='../Content/Image/nodetail.png'><p>没有搜索到数据，请更换关键词后再次搜索</p>")
            }
            component._pager({
                container: widget._UIDEFAULFS.personContainer,
                pageSize: widget._UIDEFAULFS.pageSize,
                pageCount: r.pageCount,
                rowCount: r.rowCount,
                pageNow: options.pageNow,
                jump: function (page) {
                    widget._setPersonsList(Iptools.Tool._extend(options, {
                        pageNow: page
                    }));
                }
            });
        });
    },
    _setPersonPanel: function (options) {
        for (var i = 0; i < options.data.records.length; i++) {
            var tr = document.createElement("tr");
            $(tr).addClass("person-row");
            //var tdi = document.createElement("td");
            //var ipc = document.createElement("input");
            //$(ipc).attr("type", "checkbox");
            //$(ipc).attr("name", "selectListCheckbox");
            //$(ipc).data("id", options.data.records[i].id);
            //$(tdi).append(ipc);
            //$(tr).append(tdi);
            $(tr).append("<td>" + options.data.records[i].id + "</td>");
            $(tr).append("<td>" + options.data.records[i].name + "</td>");
            $(tr).append("<td>" + options.data.records[i].phone + "</td>");
            //部门
            var tdOr = document.createElement("td");
            if(options.data.records[i].organizationName){
                $(tdOr).html(options.data.records[i].organizationName);
                //$(tdOr).html(widget._setOrganizationById(options.data.records[i].organization));

            }
            $(tr).append(tdOr);
            //职位
            var tdpo = document.createElement("td");
            if(options.data.records[i].positionName){
                $(tdpo).html(options.data.records[i].positionName);
                //$(tdpo).html(widget._setPositionById(options.data.records[i].position));

            }
            $(tr).append(tdpo);

            //权限
            var tdre = document.createElement("td");
            if(options.data.records[i].responsibilityName){
               // $(tdre).html(widget._setResponsibility(options.data.records[i].responsibilityID));
                $(tdre).html(options.data.records[i].responsibilityName);

            }
            $(tr).append(tdre);


            var tdlo = document.createElement("td");
            $(tdlo).html(options.data.records[i].loginName);
            $(tr).append(tdlo);
            //状态
            var tdst = document.createElement("td");
            var status = widget._setStatus(options.data.records[i].status);
            $(tdst).html(status);
            $(tr).append(tdst);

            var tde = document.createElement("td");
            var ae = document.createElement("a");
            $(ae).attr("href", "javascript:;");
            $(ae).addClass("update_person_link");
            $(ae).attr("data-id", options.data.records[i].id);
            $(ae).html('<span class="fa fa-edit editPerson"></span>');
            //如果id和当前登陆人id一致
            //if(options.data.records[i].id != parseInt(Iptools.DEFAULTS.userId)){
                var ad = document.createElement("a");
                $(ad).addClass("del_person_link");
                $(ad).html('<span class="fa fa-trash-o person_delete_link" id="'+options.data.records[i].id+'"></span>');
                $(tde).append(ad);
            //}
            $(tde).append(ae);
            $(tr).append(tde);
            $(widget._UIDEFAULFS.personPanel).append(tr);
        }
    },
    _setOrganizationById:function(id){
        var res = "";
        Iptools.GetJson({
            async:false,
            url: "basic/organizations/"+id+"?token="+Iptools.DEFAULTS.token,
            //data: {
            //    token: Iptools.DEFAULTS.token,
            //    id:id
            //}
        }).done(function (r) {
            if(r){
                res = r.name;
            }

        });
        return res;
    },
    _setPositionById:function(id){
        var res = "";
        Iptools.GetJson({
            async:false,
            url: "basic/positions/"+id+"?token="+Iptools.DEFAULTS.token,
            //data: {
            //    token: Iptools.DEFAULTS.token,
            //    id:id
            //}
        }).done(function (r) {
            if(r){
                res = r.name;
            }

        });
        return res;
    },
    //权限
    _setResponsibility: function (uuid) {
        var res = "";
        Iptools.GetJson({
            async:false,
            url: "basic/getResponsibilitys",
            data: {
                token: Iptools.DEFAULTS.token,
                id:uuid
            }
        }).done(function (r) {
            if(r){
                res = r.name;
            }

        });
        return res;
    },
    //员工的状态
    _setStatus:function(statusVal){
        var res = "";
        switch(statusVal){
            case "1":
                res = "正常";
                break;
            case "2":
                res = "离职";
                break;
            case "3":
                res = "禁用";
                break;
        }
        return res;
    },
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
    _enablePaginationNext: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".pagination .arrow-right",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var pageNow = parseInt(me.data("page"));
                var pageTotal = parseInt(me.data("total"));
                var type = me.data("type");
                var oid = me.data("oid");
                var pid = me.data("pid");
                var name = $("#person_name_search").val().trim();
                var phone = $("#person_phone_search").val().trim();
                if (pageNow < pageTotal) {
                    if (widget._UIDEFAULFS.nomatch) {
                        widget._setNoMatchPersonList({
                            pageNow: pageNow + 1,
                            name: name,
                            phone: phone,
                        });
                    } else {
                        widget._setPersonsList({
                            pageNow: pageNow + 1,
                            type: type,
                            oid: oid,
                            pid: pid,
                            name: name,
                            phone: phone,
                        });
                    }
                }
            }
        });
    },
    _enablePaginationPre: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".pagination .arrow-left",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var pageNow = parseInt(me.data("page"));
                var type = me.data("type");
                var oid = me.data("oid");
                var pid = me.data("pid");
                var name = $("#person_name_search").val().trim();
                var phone = $("#person_phone_search").val().trim();
                if (pageNow > 1) {
                    if (widget._UIDEFAULFS.nomatch) {
                        widget._setNoMatchPersonList({
                            pageNow: pageNow - 1,
                            name: name,
                            phone: phone,
                        });
                    } else {
                        widget._setPersonsList({
                            pageNow: pageNow - 1,
                            type: type,
                            oid: oid,
                            pid: pid,
                            name: name,
                            phone: phone,
                        });
                    }
                }
            }
        });
    },
    _enablePaginationClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".pagination .pageButton",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var pageNow = parseInt(me.parent().find("input").val());
                var pageCurrent = parseInt(me.parent().find(".arrow-right").data("page"));
                var pageTotal = parseInt(me.data("total"));
                var type = me.data("type");
                var oid = me.data("oid");
                var pid = me.data("pid");
                var name = $("#person_name_search").val().trim();
                var phone = $("#person_phone_search").val().trim();
                if (pageNow > 0 && pageNow != pageCurrent && !(pageNow > pageTotal)) {
                    if (widget._UIDEFAULFS.nomatch) {
                        widget._setNoMatchPersonList({
                            pageNow: pageNow,
                            name: name,
                            phone: phone,
                        });
                    } else {
                        widget._setPersonsList({
                            pageNow: pageNow,
                            type: type,
                            oid: oid,
                            pid: pid,
                            name: name,
                            phone: phone,
                        });
                    }
                }
                return false;
            }
        });
    },
    _enableNewOrgModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: widget._UIDEFAULFS.newOrgModal,
            event: function () {
                $("#new_org_name").val("");
                $("#new_org_code").selectpicker("val", "");
                $("#new_org_parent").data("id", 0);
                $("#new_org_parent").html("无<span class='caret'></span>");
                var node = widget._getCurrentNode();
                if (node) {
                    if (node.original.type == "org") {
                        $("#new_org_parent").data("id", node.original.oid);
                        $("#new_org_parent").html(node.original.text + "<span class='caret'></span>");
                    }
                }
            },
        });
    },
    _enableNewPosModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: widget._UIDEFAULFS.newPosModal,
            event: function () {
                $("#new_pos_name").val("");
                $("#new_pos_job_code").selectpicker("val", "");
                $("#new_pos_parent").data("id", 0);
                $("#new_pos_parent").html("无<span class='caret'></span>");
                $("#new_pos_org_parent").data("id", 0);
                $("#new_pos_org_parent").html("无<span class='caret'></span>");
                var node = widget._getCurrentNode();
                if (node) {
                    if (node.original.type == "org") {
                        $("#new_pos_org_parent").data("id", node.original.oid);
                        $("#new_pos_org_parent").html(node.original.text + "<span class='caret'></span>");
                    } else if (node.original.type == "pos") {
                        $("#new_pos_parent").data("id", node.original.pid);
                        $("#new_pos_parent").html(node.original.text + "<span class='caret'></span>");
                        if (node.parents.length > 0) {
                            for (var i = 0; i < node.parents.length; i++) {
                                var pnode = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(node.parents[i]);
                                if (pnode.original) {
                                    if (pnode.original.type == "org") {
                                        $("#new_pos_org_parent").data("id", pnode.original.oid);
                                        $("#new_pos_org_parent").html(pnode.original.text + "<span class='caret'></span>");
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
    },
    _enableAddNewOrg: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".addNewOrg",
            event: function () {
                var btn = $(this);
                btn.css("pointer-events", "none");
                btn.button("loading");
                if ($("#new_org_parent").data("id").toString() == "0") {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "上级组织不可为空"
                    });
                    setTimeout(function () {
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    }, 1000);
                } else {
                    var para = {
                        token: Iptools.DEFAULTS.token,
                        name: $("#new_org_name").val()
                    };
                    if ($("#new_org_parent").data("id").toString() != "0") {
                        para["parentOrganization"] = $("#new_org_parent").data("id");
                    }
                    Iptools.PostJson({
                        url: "basic/organizations",
                        data: para
                    }).done(function () {
                        $.jstree.destroy();
                        widget._UIDEFAULFS.treeData = [];
                        widget._UIDEFAULFS.orgTreeData = [];
                        widget._setPersonsTree();
                        $(widget._UIDEFAULFS.newOrgModal).modal("hide");
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    });
                }
            },
        });
    },
    _enableAddNewPos: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".addNewPos",
            event: function () {
                var btn = $(this);
                btn.css("pointer-events", "none");
                btn.button("loading");
                if ($("#new_pos_org_parent").data("id").toString() == "0") {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "上级组织不可为空"
                    });
                    setTimeout(function () {
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    }, 1000);
                } else {
                    var para = {
                        token: Iptools.DEFAULTS.token,
                        name: $("#new_pos_name").val(),
                        parentPosition: 0
                    };
                    if ($("#new_pos_parent").data("id").toString() != "0") {
                        para["parentPosition"] = $("#new_pos_parent").data("id");
                    }
                    if ($("#new_pos_org_parent").data("id").toString() != "0") {
                        para["organization"] = $("#new_pos_org_parent").data("id");
                    }
                    Iptools.PostJson({
                        url: "basic/positions",
                        data: para
                    }).done(function () {
                        $.jstree.destroy();
                        widget._UIDEFAULFS.treeData = [];
                        widget._UIDEFAULFS.orgTreeData = [];
                        widget._setPersonsTree();
                        $(widget._UIDEFAULFS.newPosModal).modal("hide");
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    });
                }
            },
        });
    },
    _enableRemoveNode: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#remove_node",
            event: function () {
                var cnode = widget._getCurrentNode();
                if (!cnode) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "未选中节点"
                    });
                } else {
                    if (cnode.children && cnode.children.length) {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "请先删除子节点"
                        });
                    } else {
                        if (confirm("确认删除选中节点？")) {
                            if (cnode.original.type == "org") {
                                Iptools.DeleteJson({
                                    url: "basic/organizations/" + cnode.original.oid + "?token=" + Iptools.DEFAULTS.token,
                                    data: {
                                        //id: cnode.original.oid,
                                        token:Iptools.DEFAULTS.token
                                    }
                                });
                            } else if (cnode.original.type == "pos") {
                                Iptools.DeleteJson({
                                    url: "basic/positions/" + cnode.original.pid + "?token=" + Iptools.DEFAULTS.token,
                                    data: {
                                        //id: cnode.original.pid ,
                                        token:Iptools.DEFAULTS.token
                                    }
                                });
                            }
                            $(widget._UIDEFAULFS.nodePanel).jstree().delete_node(cnode);
                        }
                    }
                }
            },
        });
    },
    _enableUpdateNode: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#update_node",
            event: function () {
                var node = widget._getCurrentNode();
                if (node) {
                    if (node.original.type == "org") {
                        if (node.parents.length == 1 && node.parents[0] == "#") {
                            $(widget._UIDEFAULFS.rootUpdateOrgModal).modal("show");
                        } else {
                            $(widget._UIDEFAULFS.updateOrgModal).modal("show");
                        }
                    } else {
                        $(widget._UIDEFAULFS.updatePosModal).modal("show");
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
    _enableUpdateOrg: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".orgupdate",
            event: function () {
                var btn = $(this);
                btn.css("pointer-events", "none");
                btn.button("loading");
                var node = widget._getCurrentNode();
                var para = {
                    id: node.original.oid,
                    token: Iptools.DEFAULTS.token,
                    name: $("#update_org_name").val(),
                };
                if ($("#update_org_parent").data("id").toString() != "0") {
                    para["parentOrganization"] = $("#update_org_parent").data("id");
                }
                Iptools.PutJson({
                    url: "basic/organizations",
                    data: para
                }).done(function (r) {
                    if (r) {
                        $.jstree.destroy();
                        widget._UIDEFAULFS.treeData = [];
                        widget._UIDEFAULFS.orgTreeData = [];
                        widget._setPersonsTree();
                        $(widget._UIDEFAULFS.updateOrgModal).modal("hide");
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    } else {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: r.retmsg
                        });
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    }
                });
            },
        });
    },
    _enableUpdatePos: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".posupdate",
            event: function () {
                var btn = $(this);
                btn.css("pointer-events", "none");
                btn.button("loading");
                var node = widget._getCurrentNode();
                if ($("#update_pos_parent").data("id") == node.original.pid) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "上级职位不可为自身"
                    });
                    setTimeout(function () {
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    }, 1000);
                } else {
                    var para = {
                        id: node.original.pid,
                        token: Iptools.DEFAULTS.token,
                        name: $("#update_pos_name").val(),
                        jobCode: $("#update_pos_job_code").selectpicker("val"),
                    };
                    if ($("#update_pos_parent").data("id").toString() != "0") {
                        para["parentPosition"] = $("#update_pos_parent").data("id");
                    }
                    if ($("#update_pos_org_parent").data("id").toString() != "0") {
                        para["organization"] = $("#update_pos_org_parent").data("id");
                    }
                    Iptools.PutJson({
                        url: "basic/positions",
                        data: {
                            id: node.original.pid,
                            token: Iptools.DEFAULTS.token,
                            name: $("#update_pos_name").val(),
                            parentPosition: $("#update_pos_parent").data("id"),
                            organization: $("#update_pos_org_parent").data("id"),
                        }
                    }).done(function (r) {
                        if (r) {
                            $.jstree.destroy();
                            widget._UIDEFAULFS.treeData = [];
                            widget._UIDEFAULFS.orgTreeData = [];
                            widget._setPersonsTree();
                            $(widget._UIDEFAULFS.updatePosModal).modal("hide");
                            btn.button("reset");
                            btn.css("pointer-events", "auto");
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: r.retmsg
                            });
                            btn.button("reset");
                            btn.css("pointer-events", "auto");
                        }
                    });
                }
            },
        });
    },
    _enableUpdatePosModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: widget._UIDEFAULFS.updatePosModal,
            event: function () {
                $("#update_pos_parent").data("id", 0);
                $("#update_pos_parent").html("无<span class='caret'></span>");
                $("#update_pos_org_parent").data("id", 0);
                $("#update_pos_org_parent").html("无<span class='caret'></span>");
                $("#update_pos_name").val("");
                $("#update_pos_job_code").selectpicker("val", "");
                var node = widget._getCurrentNode();
                if (node) {
                    if (node.original.type == "pos") {
                        Iptools.GetJson({
                            url: "basic/positions/" + node.original.pid,
                            data: {
                                token: Iptools.DEFAULTS.token
                            }
                        }).done(function (r) {
                            if (r) {
                                $("#update_pos_name").val(Iptools.Tool._GetProperValue(r.name));
                                $("#update_pos_job_code").selectpicker("val", Iptools.Tool._GetProperValue(r.jobCode));
                                if (Iptools.Tool._checkNull(r.parentPosition)) {
                                    Iptools.GetJson({
                                        url: "basic/positions/" + r.parentPosition,
                                        data: {
                                            token: Iptools.DEFAULTS.token
                                        }
                                    }).done(function (pr) {
                                        $("#update_pos_parent").data("id", pr.id);
                                        $("#update_pos_parent").html(pr.name + "<span class='caret'></span>");
                                    });
                                }
                            }
                            if (node.parents.length > 0) {
                                for (var i = 0; i < node.parents.length; i++) {
                                    var pnode = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(node.parents[i]);
                                    if (pnode.original) {
                                        if (pnode.original.type == "org" && pnode.original.oid == r.organization) {
                                            $("#update_pos_org_parent").data("id", pnode.original.oid);
                                            $("#update_pos_org_parent").html(pnode.original.text + "<span class='caret'></span>");
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            },
        });
    },
    _enableUpdateOrgModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: widget._UIDEFAULFS.updateOrgModal,
            event: function () {
                $("#update_org_name").val("");
                $("#update_org_parent").data("id", 0);
                $("#update_org_code").selectpicker("val", "");
                $("#update_org_parent").html("无<span class='caret'></span>");
                var node = widget._getCurrentNode();
                if (node) {
                    if (node.original.type == "org") {
                        Iptools.GetJson({
                            url: "basic/organizations/" + node.original.oid,
                            data: {
                                token: Iptools.DEFAULTS.token
                            }
                        }).done(function (r) {
                            $("#update_org_name").val(r.name);
                            $("#update_org_code").selectpicker("val", r.orgCode);
                            for (var i = 0; i < node.parents.length; i++) {
                                var pnode = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(node.parents[i]);
                                if (pnode.original) {
                                    if (pnode.original.type == "org") {
                                        $("#update_org_parent").data("id", pnode.original.oid);
                                        $("#update_org_parent").html(pnode.original.text + "<span class='caret'></span>");
                                        break;
                                    }
                                }
                            }
                        });
                    }
                }
            },
        });
    },
    _enableRootUpdateOrgModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: widget._UIDEFAULFS.rootUpdateOrgModal,
            event: function () {
                $("#root_update_org_name").val("");
                var node = widget._getCurrentNode();
                if (node) {
                    if (node.original.type == "org") {
                        $("#root_update_org_name").val(node.original.text);
                    }
                }
            },
        });
    },
    _enableRootUpdateOrg: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".rootorgupdate",
            event: function () {
                var btn = $(this);
                btn.css("pointer-events", "none");
                btn.button("loading");
                var node = widget._getCurrentNode();
                Iptools.PutJson({
                    url: "basic/organizations",
                    data: {
                        id: node.original.oid,
                        token: Iptools.DEFAULTS.token,
                        name: $("#root_update_org_name").val(),
                    }
                }).done(function (r) {
                    if (r) {
                        $.jstree.destroy();
                        widget._UIDEFAULFS.treeData = [];
                        widget._UIDEFAULFS.orgTreeData = [];
                        widget._setPersonsTree();
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    } else {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: r.retmsg
                        });
                        btn.button("reset");
                        btn.css("pointer-events", "auto");
                    }
                    $(widget._UIDEFAULFS.rootUpdateOrgModal).modal("hide");
                });
            },
        });
    },
    _enableNewpersonLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".person_new_link",
            event: function () {
                Iptools.setDefaults({ key: "selectUser", value: "" });
                Iptools.setDefaults({ key: "selectOrg", value: "" });
                Iptools.setDefaults({ key: "selectPos", value: "" });
                var node = widget._getCurrentNode();
                if (node && node.original) {
                    switch (node.original.type) {
                        case "org":
                            Iptools.setDefaults({ key: "selectOrg", value: node.original.oid });
                            break;
                        case "pos":
                            Iptools.setDefaults({ key: "selectPos", value: node.original.pid });
                            if (node.parents.length) {
                                for (var i = 0; i < node.parents.length; i++) {
                                    var pnode = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(node.parents[i]);
                                    if (pnode && pnode.original.type == "org") {
                                        Iptools.setDefaults({ key: "selectOrg", value: pnode.original.oid });
                                        break;
                                    }
                                }
                            }
                            break;
                    }
                }
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
                Iptools.setDefaults({ key: "selectUser", value: $(this).attr("data-id") });
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
    _enablePersonDelete: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".person_delete_link",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if (confirm("确定删除选中人员？")) {
                   // var target = $(widget._UIDEFAULFS.personPanel).find("input[name='selectListCheckbox']:checked");
                    var target = $(this);
                   // target.each(function (key, obj) {
                        Iptools.DeleteJson({
                            async: false,
                            url: "basic/employees/" + target.attr("id") + "?token=" + Iptools.DEFAULTS.token,
                            data: {
                                token: Iptools.DEFAULTS.token,
                                id: target.attr("id"),
                            }
                        }).done(function(r){
                            if(r.retcode == "ok"){
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "删除完成"
                                });
                                widget._setPersonsList({
                                    type: $(widget._UIDEFAULFS.nodePanel).jstree().get_node($("#tree .jstree-anchor:first").attr("id")).original.type,
                                    oid: $(widget._UIDEFAULFS.nodePanel).jstree().get_node($("#tree .jstree-anchor:first").attr("id")).original.oid,
                                    pid: $(widget._UIDEFAULFS.nodePanel).jstree().get_node($("#tree .jstree-anchor:first").attr("id")).original.pid,
                                    pageNow: 1,
                                });
                            }else{
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: r.retmsg
                                });
                            }
                        });

                }
            }
        });
    },
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
                //var node = widget._getCurrentNode();
                var node;
                if ($(".jsnode_selected_single").length) {
                    node = widget._getCurrentNode();
                } else {
                    var firstNode = $("#tree .jstree-anchor:first").attr("id");
                    node = $(widget._UIDEFAULFS.nodePanel).jstree().get_node(firstNode);
                }
                if (node) {
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
                }
                return false;
            }
        });
    },
    _enableNoMatchClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#search_without_match",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $(this).addClass("active");
                $(".jstree-anchor").removeClass("jsnode_selected_single");
                $(".jstree-anchor").removeClass("jstree-clicked");
                widget._UIDEFAULFS.nomatch = true;
                widget._setNoMatchPersonList({
                    pageNow: 1,
                });
            }
        });
    },
    _enableTreeSearch: function () {
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: widget._UIDEFAULFS.treeSearchForm,
            event: function () {
                $('.search_list .search_icon').show();
                $('.search_list button').hide();
                $(widget._UIDEFAULFS.nodePanel).jstree().search($("#search_key_words").val());
                return false;
            }
        });
        //click事件和搜索框的blur事件冲突
        //widget._addEventListener({
        //    container: "body",
        //    type: "click",
        //    target: ".search_tree_btn",
        //    event: function () {
        //        $('.search_list .search_icon').show();
        //        $('.search_list button').hide();
        //        $(widget._UIDEFAULFS.nodePanel).jstree().search($("#search_key_words").val());
        //        return false;
        //    }
        //});
    },
};