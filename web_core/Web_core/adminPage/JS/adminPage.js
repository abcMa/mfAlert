$(".admin-view-link").on("click", function () {
    var me = $(this);
    Iptools.uidataTool._getCustomizeView({
        nameList: "'" + me.data("viewname") + "'"
    }).done(function(data){
        if (data.views.length) {
            Iptools.uidataTool._getView({
                async: false,
                view: data.views[0].view
            }).done(function (r) {
                Iptools.Tool._jumpView({
                    view: data.views[0].view,
                    name: r.view.name,
                    type: r.view.type,
                    url: r.view.url,
                    bread: true
                });
            });
        }
    });
});
