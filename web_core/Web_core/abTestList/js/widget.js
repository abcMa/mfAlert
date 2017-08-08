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
        widget._enableAddNewTest();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setReport();
    },
    _setReport: function () {
        $('#report1').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: [
                    '浏览',
                    '点击',
                    '报名'
                ],
                crosshair: true
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            legend: {
                enabled: true,
                layout: "vertical",
                align: "right",
                verticalAlign: "top",
                floating: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: '主方案',
                data: [49.9, 71.5, 106.4]
            }, {
                name: '对比方案',
                data: [83.6, 78.8, 98.5]
            }]
        });
        $('#report2').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: [
                    '浏览',
                    '点击',
                    '报名'
                ]
            },
            yAxis: [{
                title: {
                    text: null
                }
            }, {
                title: {
                    text: null
                },
                opposite: true
            }],
            legend: {
                shadow: false,
                enabled: true,
                layout: "vertical",
                align: "center",
                verticalAlign: "top",
                floating: true
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
            series: [{
                name: '浏览',
                color: 'rgba(165,170,217,1)',
                data: [150, 73, 20],
                pointPadding: 0.3,
                pointPlacement: -0.2
            }, {
                name: '点击',
                color: 'rgba(126,86,134,.9)',
                data: [140, 90, 40],
                pointPadding: 0.4,
                pointPlacement: -0.2
            }, {
                name: '报名',
                color: 'rgba(248,161,63,1)',
                data: [183.6, 178.8, 198.5],
                pointPadding: 0.3,
                pointPlacement: 0.2,
                yAxis: 1
            }]
        });
    },
    _enableAddNewTest: function () {
        widget._addEventListener({
            container: "body",
            target: "#add_new_test",
            type: "click",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'abTester'"
                }).done(function (data) {
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
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
            }
        });
    }
};