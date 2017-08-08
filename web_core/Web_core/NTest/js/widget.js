var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
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
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        $.ajax({
            type: "get",
            url: "http://eisst.63home.cn/upload/33/1/index.html",
            dataType: "jsonp",
            jsonp: "callback",
            success: function (r) {
                $("body").append(r);
            }
        });
    }
};