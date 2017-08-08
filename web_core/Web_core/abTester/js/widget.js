var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        dHelper: "<div class='drag-helper default'><span class='iconfont'>&#xe90c;</span></div>",
        events: {
            bimg: {
                title: "背景图",
                icon: "&#xe759;",
                template: "<div class='panel panel-default'><div class='panel-heading event'>测试变量：背景图<div class='tool-right'>" +
                    "<span class='icon-trash remove-container'></span></div></div><div class='panel-body'><div class='new-condition col-sm-12'>" +
                    "<span class='icon-minus-sign'></span><div class='condition-item'><div><select class='selectpicker' data-width='auto'>" +
                    "<option value=''>请选择需要加入A/B测试的营销活动</option></select></div><div class='item-bimg-container'><div class='item-bimg left'>" +
                    "<p>主方案</p><img src='' alt='' /></div><div class='item-bimg right'><p>对比方案</p><div class='item-bimg-add'><input type='file' />" +
                    "<span class='iconfont'>&#xe741;</span></div></div><div class='item-ranger'><p>A/B测试投放时间</p><div class='dateRanger'></div>" +
                    "</div></div></div></div><div class='new-condition adding col-sm-12'><span class='icon-plus-sign'></span>" +
                    "<div class='condition-item'>添加新的条件</div></div></div></div>",
                helper: "<div class='drag-helper event'><span class='iconfont'>&#xe759;</span></div>",
                imgSrc: "http://wangze0516.qiniudn.com/%E8%90%A5%E9%94%80%E6%B4%BB%E5%8A%A8%E7%B4%A0%E6%9D%90.jpg",
                disDateRange: [
                    {
                        abTester: {
                            id: "1",
                            name: "双十一促销"
                        },
                        start: new Date("2016-01-05"),
                        end: new Date("2016-02-03")
                    }, {
                        abTester: {
                            id: "2",
                            name: "双十二促销"
                        },
                        start: new Date("2016-07-05"),
                        end: new Date("2016-09-24")
                    }, {
                        abTester: {
                            id: "3",
                            name: "新年促销"
                        },
                        start: new Date("2016-10-11"),
                        end: new Date("2016-11-24")
                    }
                ],
                dateBounds: {
                    start: new Date("2016-01-01"),
                    end: new Date("2016-12-31"),
                },
                defaultDate: {
                    min: new Date("2016-04-03"),
                    max: new Date("2016-07-05")
                },
                loaded: function (options) {
                    $("#" + options.target + " .selectpicker").selectpicker();
                    $("#" + options.target + " .item-bimg img").attr("src", this.imgSrc);
                    $("#" + options.target + " .dateRanger").dateRangeSlider({
                        arrows: false,
                        bounds: {
                            min: new Date(this.dateBounds.start.getFullYear(), this.dateBounds.start.getMonth(), this.dateBounds.start.getDate()),
                            max: new Date(this.dateBounds.end.getFullYear(), this.dateBounds.end.getMonth(), this.dateBounds.end.getDate(), 12, 59, 59),
                        },
                        defaultValues: { min: this.defaultDate.min, max: this.defaultDate.max },
                        formatter: function (val) {
                            return val.format("yyyy-MM-dd");
                        }
                    });
                    this.addboundsDateTool(options);
                    this.addDisDate(options);
                },
                addboundsDateTool: function (options) {
                    var sdiv = document.createElement("div");
                    $(sdiv).addClass("date-toolbar");
                    $(sdiv).css("left", "-45px");
                    $(sdiv).append("<div>" + this.dateBounds.start.format("yyyy-MM-dd") + "</div><div class='angle'></div>");
                    var ediv = document.createElement("div");
                    $(ediv).css("right", "-45px");
                    $(ediv).addClass("date-toolbar");
                    $(ediv).append("<div>" + this.dateBounds.end.format("yyyy-MM-dd") + "</div><div class='angle'></div>");
                    $("#" + options.target + " .dateRanger").append(sdiv, ediv);
                },
                addDisDate: function (options) {
                    var container = $("#" + options.target + " .dateRanger .ui-rangeSlider-container");
                    var baseRange = this.dateBounds.end.diff(this.dateBounds.start);
                    for (var i = 0; i < this.disDateRange.length; i++) {
                        var di = this.disDateRange[i];
                        var range = di.end.diff(di.start);
                        var lrange = di.start.diff(this.dateBounds.start);
                        var div = document.createElement("div");
                        $(div).addClass("disRanger");
                        $(div).data("rangerTool", "ranger_toolbar_" + options.target + "_" + di.abTester.id);
                        $(div).css({
                            left: lrange * 100 / baseRange + "%",
                            width: range * 100 / baseRange + "%"
                        });
                        container.append(div);
                        var tdiv = document.createElement("div");
                        $(tdiv).addClass("tester-toolbar");
                        $(tdiv).attr("id", "ranger_toolbar_" + options.target + "_" + di.abTester.id);
                        $(tdiv).css({
                            "left": (lrange * 100 / baseRange + (range * 100 / baseRange) / 2 - 10) + "%",
                            "width": "200px",
                        });
                        $(tdiv).append("<div>已添加：" + di.abTester.name + "</div><div class='angle'></div>");
                        $("#" + options.target + " .dateRanger").append(tdiv);
                    }
                }
            },
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
        widget._enableRangerToolon();
        widget._enableRangerTooloff();
        widget._enableConditionImageCrop();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
    },
    _setNewActionItem: function (options) {
        if (Iptools.Tool._checkNull(options.item) && widget._UIDEFAULFS.actions[options.item]) {
            var content = "<div class='operation-item-container col-sm-12'>" +
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
            var uid = "oitem_" + new Date().getTime();
            var content = "<div class='operation-item-container col-sm-12' id='" + uid + "'>" +
                "<div class='item-header col-sm-1'><span class='event'><i class='iconfont'>" +
                widget._UIDEFAULFS.events[options.item].icon + "</i></span></div>" +
                "<div class ='item-body col-sm-11'>" + widget._UIDEFAULFS.events[options.item].template + "</div></div>";
            $(content).insertBefore(widget._UIDEFAULFS.dragDesContainer);
            if (widget._UIDEFAULFS.events[options.item].loaded) {
                widget._UIDEFAULFS.events[options.item].loaded({
                    target: uid
                });
            }
        }
    },
    _enableRangerToolon: function () {
        widget._addEventListener({
            container: "body",
            target: ".disRanger",
            type: "mouseover",
            event: function () {
                var me = $(this);
                $("#" + me.data("rangerTool")).show();
            }
        });
    },
    _enableRangerTooloff: function () {
        widget._addEventListener({
            container: "body",
            target: ".disRanger",
            type: "mouseleave",
            event: function () {
                var me = $(this);
                $("#" + me.data("rangerTool")).hide();
            }
        });
    },
    _enableConditionImageCrop: function () {
        widget._addEventListener({
            container: "body",
            target: ".item-bimg-add input[type=file]",
            type: "change",
            event: function () {
                var me = $(this);
                var files = me[0].files;
                if (files && files.length) {
                    var f = files[0];
                    component._crop({
                        file: f,
                        aspectRatio: 16 / 9,
                        getCanvas: function (canvas) {
                            me.parent().find(".iconfont").remove();
                            me.parent().find("canvas").remove();
                            me.parent().append(canvas);
                        }
                    });
                }
                me.val("");
            }
        });
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