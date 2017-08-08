var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        dHelper: "<div class='drag-helper default'><span class='iconfont'>&#xe90c;</span></div>",
        events: {
            afterAddContact: {
                title: "新增客户后",
                icon: "&#xe736;",
                template: "<div class='panel panel-default'><div class='panel-heading event'>新建客户后" +
                    "<div class='tool-right'><span class='icon-trash remove-container'></span></div></div><div class='panel-body'>" +
                    "<div class='new-condition'><span class='icon-minus-sign'></span><div class='condition-item'>" +
                    "<span>客户属性</span><select class='selectpicker'><option value=''>属性</option></select>" +
                    "<select class='selectpicker'><option value=''>比较</option><option value='equal'>等于</option>" +
                    "<option value='more'>大于</option><option value='less'>小于</option></select><select class='selectpicker'>" +
                    "<option value=''>性别</option><option value='male'>男</option><option value='female'>女</option>" +
                    "</select></div></div><div class='new-condition adding'><span class='icon-plus-sign'></span>" +
                    "添加新的条件</div></div></div>",
                helper: "<div class='drag-helper event'><span class='iconfont'>&#xe736;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            },
            afterAddContactGroup: {
                title: "新增客户群后",
                icon: "&#xe752;",
                template: "<div class='panel panel-default'><div class='panel-heading event'>新建客户群后<div class='tool-right'>" +
                    "<span class='icon-trash remove-container'></span></div></div><div class='panel-body'><div class='new-condition'>" +
                    "<span class='icon-minus-sign'></span><div class='condition-item'><span>分群依据&nbsp;&nbsp;&nbsp;为</span>" +
                    "<select class='selectpicker'><option value=''>消费频次</option><option value=''>1-10</option>" +
                    "<option value=''>10-50</option><option value=''>50-200</option><option value=''>>200</option></select>" +
                    "</div></div><div class='new-condition adding'><span class='icon-plus-sign'></span>添加新的条件</div></div></div>",
                helper: "<div class='drag-helper event'><span class='iconfont'>&#xe752;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            },
            afterSubmitForm: {
                title: "提交表单后",
                icon: "&#xe90b;",
                template: "<div class='panel panel-default'><div class='panel-heading event'>提交表单后" +
                    "<div class='tool-right'><span class='icon-trash remove-container'></span></div></div><div class='panel-body'>" +
                    "<div class='new-condition'><span class='icon-minus-sign'></span><div class='condition-item'>" +
                    "<select class='selectpicker'><option value=''>属性</option></select><select class='selectpicker'>" +
                    "<option value=''>比较</option><option value='equal'>等于</option><option value='more'>大于</option>" +
                    "<option value='less'>小于</option></select><select class='selectpicker'><option value=''>更多</option>" +
                    "<option value='1'>1</option><option value='2'>2</option></select></div></div><div class='new-condition adding'>" +
                    "<span class='icon-plus-sign'></span>添加新的条件</div></div> </div>",
                helper: "<div class='drag-helper event'><span class='iconfont'>&#xe90b;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            },
            afterPayment: {
                title: "消费支付后",
                icon: "&#xe694;",
                template: "<div class='panel panel-default'><div class='panel-heading event'>消费支付后" +
                    "<div class='tool-right'><span class='icon-trash remove-container'></span></div></div><div class='panel-body'>" +
                    "<div class='new-condition'><span class='icon-minus-sign'></span><div class='condition-item'>" +
                    "<select class='selectpicker'><option value=''>属性</option></select><select class='selectpicker'>" +
                    "<option value=''>比较</option><option value='equal'>等于</option><option value='more'>大于</option>" +
                    "<option value='less'>小于</option></select><select class='selectpicker'><option value=''>更多</option>" +
                    "<option value='1'>1</option><option value='2'>2</option></select></div></div><div class='new-condition adding'>" +
                    "<span class='icon-plus-sign'></span>添加新的条件</div></div> </div>",
                helper: "<div class='drag-helper event'><span class='iconfont'>&#xe694;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            },
            afterRegistWebSite: {
                title: "注册网站后",
                icon: "&#xe67b;",
                template: "<div class='panel panel-default'><div class='panel-heading event'>注册网站后" +
                    "<div class='tool-right'><span class='icon-trash remove-container'></span></div></div><div class='panel-body'>" +
                    "<div class='new-condition'><span class='icon-minus-sign'></span><div class='condition-item'>" +
                    "<select class='selectpicker'><option value=''>属性</option></select><select class='selectpicker'>" +
                    "<option value=''>比较</option><option value='equal'>等于</option><option value='more'>大于</option>" +
                    "<option value='less'>小于</option></select><select class='selectpicker'><option value=''>更多</option>" +
                    "<option value='1'>1</option><option value='2'>2</option></select></div></div><div class='new-condition adding'>" +
                    "<span class='icon-plus-sign'></span>添加新的条件</div></div> </div>",
                helper: "<div class='drag-helper event'><span class='iconfont'>&#xe67b;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            }
        },
        actions: {
            sms: {
                title: "发送短信",
                icon: "&#xe705;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>" +
                    "发送短信<div class='tool-right'><span class='icon-edit'></span>" +
                    "<span class='icon-trash remove-container'></span></div></div><div class='panel-body'>" +
                    "<p class='item-sms-content'>短信内容</p><div class='sms-info'>" +
                    "<p>发送方式：直接发送</p><p>发送时间：2017-01-15 12:18</p></div></div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe74c;</span></div>",
                loaded: null
            },
            mail: {
                title: "发送邮件",
                icon: "&#xe753;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>" +
                    "发送邮件<div class='tool-right'><span class='icon-edit'></span>" +
                    "<span class='icon-trash remove-container'></span></div></div><div class='panel-body'>" +
                    "<p class='item-sms-content'>邮件内容</p><div class='sms-info'>" +
                    "<p>发送方式：直接发送</p><p>发送时间：2017-01-15 12:18</p></div></div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe753;</span></div>",
                loaded: null
            },
            changeContact: {
                title: "修改客户属性",
                icon: "&#xe695;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>修改客户属性" +
                    "<div class='tool-right'><span class='icon-edit'></span><span class='icon-trash remove-container'></span></div></div><div class='panel-body'>" +
                    "<div class='new-condition'><span class='icon-minus-sign'></span><div class='condition-item'>" +
                    "<select class='selectpicker'><option value=''>属性</option><option value=''>姓名</option></select>" +
                    "<input class='form-control condition-input' type='text' placeholder='请输入' /></div></div>" +
                    "<div class='new-condition adding'><span class='icon-plus-sign'></span>添加新的条件</div></div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe695;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            },
            addContactGroup: {
                title: "加入客户群",
                icon: "&#xe640;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>加入客户群" +
                    "<div class='tool-right'><span class='icon-edit'></span><span class='icon-trash remove-container'></span></div>" +
                    "</div><div class='panel-body'><div class='new-condition'><span class='icon-minus-sign'></span>" +
                    "<div class='condition-item'><span>客户群名称&nbsp;&nbsp;&nbsp;为</span><select class='selectpicker'>" +
                    "<option value=''>请选择...</option><option value='1'>高端客户群</option></select></div></div>" +
                    "<div class='new-condition adding'><span class='icon-plus-sign'></span>添加新的条件</div></div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe640;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            },
            removeContactGroup: {
                title: "移出客户群",
                icon: "&#xe754;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>移出客户群" +
                    "<div class='tool-right'><span class='icon-edit'></span><span class='icon-trash remove-container'></span></div>" +
                    "</div><div class='panel-body'><div class='new-condition'><span class='icon-minus-sign'></span>" +
                    "<div class='condition-item'><span>客户群名称&nbsp;&nbsp;&nbsp;为</span><select class='selectpicker'>" +
                    "<option value=''>请选择...</option><option value='1'>高端客户群</option></select></div></div>" +
                    "<div class='new-condition adding'><span class='icon-plus-sign'></span>添加新的条件</div></div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe754;</span></div>",
                loaded: function () {
                    $(".selectpicker").selectpicker();
                }
            },
            addTag: {
                title: "增加标签",
                icon: "&#xe68c;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>增加标签" +
                    "<div class='tool-right'><span class='icon-edit'></span><span class='icon-trash remove-container'></span></div>" +
                    "</div><div class='panel-body'><div class='col-sm-6'><div class='form-group'><label>待增加的标签</label>" +
                    "<textarea class='form-control condition-tag-text-area' placeholder='可输入自定义标签，以空格分隔'></textarea>" +
                    "</div></div><div class='col-sm-1 consition-tag-arrow'><span class='iconfont'>&#xe757;</span></div>" +
                    "<div class='col-sm-5'><div class='form-group'><label>系统标签库</label><div class='condition-tag-select-area'>" +
                    "<button class='tag'>奢华</button><button class='tag'>朴素</button><button class='tag'>时尚</button>" +
                    "<button class='tag'>奢华</button><button class='tag'>朴素</button><button class='tag'>时尚</button>" +
                    "<button class='tag'>奢华</button></div></div></div></div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe68c;</span></div>",
                loaded: null
            },
            removeTag: {
                title: "移除标签",
                icon: "&#xe68d;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>移除标签" +
                    "<div class='tool-right'><span class='icon-edit'></span><span class='icon-trash remove-container'></span></div>" +
                    "</div><div class='panel-body'><div class='col-sm-6'><div class='form-group'><label>待移除的标签</label>" +
                    "<textarea class='form-control condition-tag-text-area' placeholder='可输入自定义标签，以空格分隔'></textarea>" +
                    "</div></div><div class='col-sm-1 consition-tag-arrow'><span class='iconfont'>&#xe757;</span></div>" +
                    "<div class='col-sm-5'><div class='form-group'><label>客户现有标签</label><div class='condition-tag-select-area'>" +
                    "<button class='tag'>奢华</button><button class='tag'>朴素</button><button class='tag'>时尚</button>" +
                    "<button class='tag'>奢华</button><button class='tag'>朴素</button><button class='tag'>时尚</button>" +
                    "<button class='tag'>奢华</button></div></div></div></div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe68d;</span></div>",
                loaded: null
            },
            setDelay: {
                title: "设置延时",
                icon: "&#xe755;",
                template: "<div class='panel panel-default'><div class='panel-heading action'>设置延时" +
                    "<div class='tool-right'><span class='icon-edit'></span><span class='icon-trash remove-container'></span></div>" +
                    "</div><div class='panel-body'><input class='form-control condition-input small' type='number' />天" +
                    "<input class='form-control condition-input small' type='number' />小时" +
                    "<input class='form-control condition-input small' type='number' />分" +
                    "<input class='form-control condition-input small' type='number' />秒</div></div>",
                helper: "<div class='drag-helper action'><span class='iconfont'>&#xe755;</span></div>",
                loaded: null
            }
        },
        dragDes: "#drag-destination-add",
        dragDesContainer: "#des-operation-container",
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
        widget._enableDragAction();
        widget._enableDragEvent();
        widget._enableContainerRemove();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
    },
    _setNewActionItem: function (options) {
        if (Iptools.Tool._checkNull(options.item) && widget._UIDEFAULFS.actions[options.item]) {
            var content = "<div class='operation-item-container'>" +
                "<div class='item-header col-sm-1'><span class='action'><i class='iconfont'>" +
                widget._UIDEFAULFS.actions[options.item].icon + "</i></span></div>" +
                "<div class ='item-body col-sm-11'>" + widget._UIDEFAULFS.actions[options.item].template + "</div></div>";
            $(content).insertBefore(widget._UIDEFAULFS.dragDesContainer);
            if (widget._UIDEFAULFS.actions[options.item].loaded) {
                widget._UIDEFAULFS.actions[options.item].loaded();
            }
        }
    },
    _setNewEventItem: function (options) {
        if (Iptools.Tool._checkNull(options.item) && widget._UIDEFAULFS.events[options.item]) {
            var content = "<div class='operation-item-container'>" +
                "<div class='item-header col-sm-1'><span class='event'><i class='iconfont'>" +
                widget._UIDEFAULFS.events[options.item].icon + "</i></span></div>" +
                "<div class ='item-body col-sm-11'>" + widget._UIDEFAULFS.events[options.item].template + "</div></div>";
            $(content).insertBefore(widget._UIDEFAULFS.dragDesContainer);
            if (widget._UIDEFAULFS.events[options.item].loaded) {
                widget._UIDEFAULFS.events[options.item].loaded();
            }
        }
    },
    _enableContainerRemove: function () {
        widget._addEventListener({
            container: "body",
            target: ".remove-container",
            type: "click",
            event: function () {
                var me = $(this);
                me.parents(".operation-item-container:first").remove();
            }
        });
    },
    _enableDragAction: function () {
        $(".action-item").draggable({
            handle: ".drag-bar",
            helper: function () {
                var item = $(this).find(".drag-bar").data("action");
                if (Iptools.Tool._checkNull(item) && widget._UIDEFAULFS.actions[item]) {
                    return $(widget._UIDEFAULFS.actions[item].helper);
                } else {
                    return $(widget._UIDEFAULFS.dHelper);
                }
            },
            start: function () {
                $(widget._UIDEFAULFS.dragDes).addClass("action-highlight");
            },
            drag: function (e) {
                var x = e.clientX, y = e.clientY;
                try {
                    var of = $(widget._UIDEFAULFS.dragDes)[0].getBoundingClientRect();
                    if (of.top < y && (of.top + of.height) > y && of.left < x && (of.left + of.width) > x) {
                        $(widget._UIDEFAULFS.dragDes).addClass("action-entered");
                    } else {
                        $(widget._UIDEFAULFS.dragDes).removeClass("action-entered");
                    }
                } catch (ex) { }
            },
            stop: function (e) {
                var x = e.clientX, y = e.clientY;
                try {
                    var of = $(widget._UIDEFAULFS.dragDes)[0].getBoundingClientRect();
                    if (of.top < y && (of.top + of.height) > y && of.left < x && (of.left + of.width) > x) {
                        var item = $(this).find(".drag-bar").data("action");
                        if (Iptools.Tool._checkNull(item)) {
                            widget._setNewActionItem({
                                item: item
                            });
                        }
                    }
                } catch (ex) { }
                $(widget._UIDEFAULFS.dragDes).removeClass("action-highlight").removeClass("action-entered");
            }
        });
    },
    _enableDragEvent: function () {
        $(".event-item").draggable({
            handle: ".drag-bar",
            helper: function () {
                var item = $(this).find(".drag-bar").data("event");
                if (Iptools.Tool._checkNull(item) && widget._UIDEFAULFS.events[item]) {
                    return $(widget._UIDEFAULFS.events[item].helper);
                } else {
                    return $(widget._UIDEFAULFS.dHelper);
                }
            },
            start: function () {
                $(widget._UIDEFAULFS.dragDes).addClass("event-highlight");
            },
            drag: function (e) {
                var x = e.clientX, y = e.clientY;
                try {
                    var of = $(widget._UIDEFAULFS.dragDes)[0].getBoundingClientRect();
                    if (of.top < y && (of.top + of.height) > y && of.left < x && (of.left + of.width) > x) {
                        $(widget._UIDEFAULFS.dragDes).addClass("event-entered");
                    } else {
                        $(widget._UIDEFAULFS.dragDes).removeClass("event-entered");
                    }
                } catch (ex) { }
            },
            stop: function (e) {
                var x = e.clientX, y = e.clientY;
                try {
                    var of = $(widget._UIDEFAULFS.dragDes)[0].getBoundingClientRect();
                    if (of.top < y && (of.top + of.height) > y && of.left < x && (of.left + of.width) > x) {
                        var item = $(this).find(".drag-bar").data("event");
                        if (Iptools.Tool._checkNull(item)) {
                            widget._setNewEventItem({
                                item: item
                            });
                        }
                    }
                } catch (ex) { }
                $(widget._UIDEFAULFS.dragDes).removeClass("event-highlight").removeClass("event-entered");
            }
        });
    },
};