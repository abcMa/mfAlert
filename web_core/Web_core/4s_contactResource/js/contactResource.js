var contactResourceWidget ={};
contactResourceWidget = {
    _UIDEFAULFS: {
    },
    _rebuildUiDefaults: function (options) {
        contactResourceWidget._UIDEFAULFS = Iptools.Tool._extend(contactResourceWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        contactResourceWidget._bindingDomEvent();//DOM元素加载前绑定事件
        contactResourceWidget._initLoadingContactResource();//初始化铺设客户资源列表
        contactResourceWidget._bindingEventAfterLoad();//插件绑定函数
    },
    _initLoadingContactResource: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_resource_list'"
        }).done(function (data) {
            component._table("#contactResource", {
                applet: data.applets[0].applet,
                emptyImage: "../Content/Image/nodetail.png",
                emptySize: "150",
                emptyText: "没有客户资源记录",
                emptyClick: function () {
                },
                showChecks: false,
                jumpType: "template",
                //点击自己配置的导出按钮后的事件
                events: [
                ]
            });
        })
    }
};