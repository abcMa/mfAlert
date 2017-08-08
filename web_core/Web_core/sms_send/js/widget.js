var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        pageSize: 20,
        sPhone: "#sms_search_phone",
        sPhoneValue: "",
        sStatus: "#sms_search_status",
        sStatusValue: "",
        sTableBody: "#sms_table_body",
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
        widget._enableListSearch();
        widget._enableListFormSubmit();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setSmsList({
            pageNow: 1
        });
    },
    _setSmsList: function (options) {
        var data = {
            token: Iptools.DEFAULTS.token,
            pageNow: options.pageNow,
            pagesize: widget._UIDEFAULFS.pageSize
        }
        if (Iptools.Tool._checkNull(widget._UIDEFAULFS.sPhoneValue)) {
            data.phone = widget._UIDEFAULFS.sPhoneValue;
        }
        if (Iptools.Tool._checkNull(widget._UIDEFAULFS.sStatusValue)) {
            data.status = widget._UIDEFAULFS.sStatusValue;
        }
        Iptools.GetJson({
            url: "basic/getSmsSendRecord",
            data: data
        }).done(function (r) {
            if (r && r.retcode == "ok") {
                $(widget._UIDEFAULFS.sTableBody).html("");
                for (var i = 0; i < r.data.length; i++) {
                    var sTime = new Date();
                    if (Iptools.Tool._checkNull(r.data[i].submitTime)) {
                        sTime.setTime(r.data[i].submitTime);
                    }
                    $(widget._UIDEFAULFS.sTableBody).append(
                        "<tr>" +
                        "<td>" + Iptools.Tool._GetProperValue(r.data[i].recordId) + "</td>" +
                        "<td>" + Iptools.Tool._GetProperValue(r.data[i].phone) + "</td>" +
                        "<td>" + Iptools.Tool._GetProperValue(r.data[i].msgContent) + "</td>" +
                        "<td>" + widget._getSmsSignature(Iptools.Tool._GetProperValue(r.data[i].msgContent)) + "</td>" +
                        "<td>" + sTime.format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "<td  class='" + (Iptools.Tool._GetProperValue(r.data[i].submitStat) == "suc" ? "ok" : "fail") + "'>"
                        + (Iptools.Tool._GetProperValue(r.data[i].submitStat) == "suc" ? "发送成功" : "发送失败") + "</td>" +
                        "</tr>");
                }
                component._pager({
                    container: "pagination",
                    pageSize: r.page.pageSize,
                    pageCount: r.page.pageCount,
                    rowCount: r.page.rowCount,
                    pageNow: options.pageNow,
                    jump: function (page) {
                        widget._setSmsList({
                            pageNow: page
                        });
                    }
                });
            }
        });
    },
    _getSmsSignature: function (content) {
        var index1 = content.indexOf("【");
        var index2 = content.indexOf("】");
        if (index1 != -1 && index2 != -1) {
            return content.substr(index1, index2 - index1 + 1);
        } else {
            return "";
        }
    },
    _enableListSearch: function () {
        widget._addEventListener({
            container: "body",
            target: "#sms_list_search",
            type: "click",
            event: function () {
                widget._UIDEFAULFS.sPhoneValue = Iptools.Tool._GetProperValue($(widget._UIDEFAULFS.sPhone).val());
                widget._UIDEFAULFS.sStatusValue = Iptools.Tool._GetProperValue($(widget._UIDEFAULFS.sStatus).val());
                widget._setSmsList({
                    pageNow: 1
                });
            }
        });
    },
    _enableListFormSubmit: function () {
        widget._addEventListener({
            container: "body",
            target: "#sms_list_form",
            type: "submit",
            event: function () {
                var me = $(this);
                me.find("#sms_list_search").click();
                return false;
            }
        });
    }
};