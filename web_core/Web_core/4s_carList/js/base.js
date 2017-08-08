/**
 * Created by sks on 2017/7/3.
 */
widget={}
widget={
    buildList:function() {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'car_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                component._table(".list-container", {
                    pageNow: 1,
                    pageSize: 10,
                    showChecks: false,
                    applet: r.applets[0].applet,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "还没有车辆呦",
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    jumpType: "template",//操作列跳转类型
                    jumpTemplate: "<a class='car-edit' title='查看车辆详情'><span class='fa fa-edit'></span></a>",////操作列dom
                    events: [//table中的事件
                    ],
                    afterLoad:function(rs){
                        var editDoms = $(".list-container .s-table .s-column .car-edit");
                        var options = $(".list-container").data("stable").options;
                        var records;
                        if(options){
                            var data=$(".list-container").data("stable").options.data;
                            if(data && data.records && data.records.length){
                                records = data.records;
                            }
                        }
                        editDoms.each(function (key, obj) {
                            var id = records[key]["car:id"];
                            $(editDoms[key]).attr("data-id",id);
                        })
                        widget._enableSendDetail();
                    }
                })
            }
        })
    },
    _enableSendDetail:function(){
        $("body").on("click", ".car-edit", function () {
            var $this = $(this);
            var carId = $this.attr("data-id");
            var viewobj = {
                "nameList":'\"car_detail_view\"'
            };
            Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
                Iptools.uidataTool._getView({
                    view: thisView.views[0].view,
                    async: false
                }).done(function (data) {
                    Iptools.Tool._jumpView({
                        view: thisView.views[0].view,
                        name: data.view.name,
                        type: data.view.type,
                        primary: data.view.primary,
                        icon: data.view.icon,
                        url: data.view.url,
                        valueId: carId,
                        bread: true
                    }, function () {
                    })
                })
            });
        })
    },
}