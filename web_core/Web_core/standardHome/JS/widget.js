//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :Login
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
        listPageSize: 5
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
        widget._enableContactNewButton();
        widget._enableContactGroupNewButton();
        widget._enableCampaignNewButton();
        widget._enableContactLink();
        widget._enableCampaignLink();
        widget._enableCampaignListLink();
        widget._enableContactListLink();
        widget._enableContactGroupListLink();
        widget._enableStartCampaignButton();
        widget._enableReportTimeChangeButton();
        widget._enableReportMoreAnalysis();
        widget._enableQueryListJumpView();
        widget._enableQueryListHover();
        widget._enableContactDetail();
        widget._enableCampaignDetail();
        widget._enableNewContact();
        widget._enableNewCampaign();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setContactGroupInfo();
        widget._setFirstContact();
        widget._setFirstCampaign();
        widget._setResponseInfo();
        widget._setReport();
        //widget._newCampaignList();
        widget._newContactList();
        widget._bindingEventAfterLoad();
    },
    _setFirstContact: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    applet: data.applets[0].applet
                }).done(function (r) {
                    Iptools.uidataTool._getUserlistAppletData({
                        view: 0,
                        appletId: r.applet.id,
                        pageNow: 1,
                        pageSize: 1,
                        orderByColumn: r.rootLink + ":create_time",
                        orderByAscDesc: "desc"
                    }).done(function (ds) {
                        if (ds.data && ds.data.records && ds.data.records.length) {
                            var length = ds.data.records.length < 10 ? ds.data.records.length : 10;
                            for (var i = 0; i < length; i++) {
                                var rds = ds.data.records[i];
                                $("#contact_name").html(rds[r.rootLink + ":title"]);
                                $("#contact_phone").html(rds[r.rootLink + ":phone"]);
                                $("#contact_link").data("key", rds[r.rootLink + ":id"]);
                                $("#contact_count").zeroTonum(0, ds.data.rowCount);
                                Iptools.GetJson({
                                    url: "basic/contactTagLinks",
                                    data: {
                                        token: Iptools.DEFAULTS.token,
                                        contactId: rds[r.rootLink + ":id"]
                                    }
                                }).done(function (dst) {
                                    if (dst && dst.length) {
                                        for (var j = 0; j < dst.length; j++) {
                                            var btn = document.createElement("button");
                                            $(btn).addClass("btn btn-default btn-sm");
                                            $(btn).attr("disabled", "disabled");
                                            $(btn).text(dst[j].tagValue);
                                            $("#contact_tags_panel").append(btn);
                                        }
                                    }
                                });
                            }
                        } else {
                            $("#contact_link").hide();
                        }
                    });
                });
            }
        });
    },
    _setFirstCampaign: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign List Applet'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    applet: data.applets[0].applet
                }).done(function (r) {
                    Iptools.uidataTool._getUserlistAppletData({
                        view: 0,
                        appletId: r.applet.id,
                        pageNow: 1,
                        pageSize: 1,
                        orderByColumn: r.rootLink + ":create_time",
                        orderByAscDesc: "desc"
                    }).done(function (ds) {
                        if (ds.data && ds.data.records && ds.data.records.length) {
                            var rds = ds.data.records[0];
                            $("#campaign_name").html(rds[r.rootLink + "_title"]);
                            $("#campaign_link").data("key", rds[r.rootLink + "_id"]);
                            widget._setCampaignStatisticData({
                                key: rds[r.rootLink + "_id"],
                            });
                        } else {
                            $("#campaign_link").hide();
                        }
                    });
                });
            }
        });
    },
    _setCampaignStatisticData: function (options) {
        if (Iptools.Tool._checkNull(options.key)) {
            Iptools.uidataTool._getCustomizeApplet({
                nameList: "'Campaign Statistic List'"
            }).done(function (data) {
                if (data.applets.length) {
                    Iptools.uidataTool._getApplet({
                        applet: data.applets[0].applet
                    }).done(function (r) {
                        Iptools.uidataTool._getUserlistAppletData({
                            view: 0,
                            appletId: r.applet.id,
                            pageNow: 1,
                            pageSize: 1,
                            condition: "{'" + r.rootLink + "_campaign_response_type':'=\"2\"'," +
                                "'" + r.rootLink + "_campaign_id':'=" + $("#campaign_link").data("key") + "'}"
                        }).done(function (ds) {
                            if (ds.data && ds.data.records && ds.data.records.length) {
                                $("#cam_sta_count").html(ds.data.rowCount);
                            }
                        });
                    });
                }
            });
            Iptools.uidataTool._getCustomizeApplet({
                nameList: "'Campaign Response List Applet'"
            }).done(function (data) {
                if (data.applets.length) {
                    Iptools.uidataTool._getApplet({
                        applet: data.applets[0].applet
                    }).done(function (r) {
                        Iptools.uidataTool._getUserlistAppletData({
                            view: 0,
                            appletId: r.applet.id,
                            pageNow: 1,
                            pageSize: 1,
                            condition: "{'" + r.rootLink + "_campaign_response_type':'=\"3\"'," +
                                "'" + r.rootLink + "_campaign_id':'=" + $("#campaign_link").data("key") + "'}"
                        }).done(function (ds) {
                            if (ds.data && ds.data.records && ds.data.records.length) {
                                $("#cam_res_count").html(ds.data.rowCount);
                            }
                        });
                    });
                }
            });
        }
    },
    _setContactGroupInfo: function () {
        //Iptools.uidataTool._getCustomizeApplet({
        //    nameList: "'contactgroup'",
        //}).done(function (d) {
        //    Iptools.uidataTool._getApplet({
        //        applet: d.applets[0].applet
        //    }).done(function (r) {
        //        Iptools.uidataTool._getUserlistAppletData({
        //            view: 0,
        //            appletId: r.applet.id,
        //            pageNow: 1,
        //            pageSize: 1,
        //        }).done(function (s) {
        //            if (s.data && s.data.records && s.data.records.length) {
        //                $("#contact_group_count").zeroTonum(0, s.data.rowCount);
        //            }
        //        });
        //    });
        //});
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_group_linkcontact_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var applet = r.applets[0].applet;
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: applet,
                    view: "e0fdec0a-e180-439e-adc7-65d38eb82365",
                    valueId: 186,
                    pageNow: 1,
                    pageSize: 1,
                }).done(function (s) {
                    if (s.data && s.data.records && s.data.records.length) {
                        $("#contact_group_count").zeroTonum(0, s.data.rowCount);
                    }
                });
            }
        });
    },
    _setResponseInfo: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign Statistic List'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    applet: data.applets[0].applet
                }).done(function (r) {
                    Iptools.uidataTool._getUserlistAppletData({
                        view: 0,
                        appletId: r.applet.id,
                        pageNow: 1,
                        pageSize: 1,
                        condition: "{'" + r.rootLink + "_campaign_response_type':'=\"2\"'}"
                    }).done(function (ds) {
                        if (ds.data && ds.data.records && ds.data.records.length) {
                            $("#campaign_response_count").zeroTonum(0, ds.data.rowCount);
                        }
                    });
                });
            }
        });
    },
    _setReport: function () {
        //Iptools.uidataTool._getCustomizeApplet({
        //    nameList: "'Contact Type Report'"
        //}).done(function (data) {
        //    if (data.applets.length) {
        //        Iptools.uidataTool._buildReport({
        //            applet: data.applets[0].applet,
        //            container: "contactChart",
        //            showReport: true
        //        }).done(function (rs) {
        //            var index1 = rs.series[0].categories.indexOf("潜在客户");
        //            var index2 = rs.series[0].categories.indexOf("消费客户");
        //            var index3 = rs.series[0].categories.indexOf("会员客户");
        //            var rdata = rs.series[0].data;
        //            var n1 = parseInt(rdata[index1]), n2 = parseInt(rdata[index2]), n3 = parseInt(rdata[index3]);
        //            if (n1 + n2) {
        //                $("#line_rate_cost").zeroTonum(0, parseInt(n2 / (n1 + n2) * 100), "slow", "%");
        //            } else {
        //                $("#line_rate_cost").text("0%");
        //            }
        //            if (n1 + n2 + n3) {
        //                $("#line_rate_total").zeroTonum(0, parseInt((n2 + n3) / (n1 + n2 + n3) * 100), "slow", "%");
        //            } else {
        //                $("#line_rate_total").text("0%");
        //            }
        //            if (n2 + n3) {
        //                $("#line_rate_member").zeroTonum(0, parseInt(n3 / (n2 + n3) * 100), "slow", "%");
        //            } else {
        //                $("#line_rate_member").text("0%");
        //            }
        //        });
        //    }
        //});
        //Iptools.uidataTool._getCustomizeApplet({
        //    nameList: "'Contact New Count Report'"
        //}).done(function (data) {
        //    if (data.applets.length) {
        //        Iptools.uidataTool._buildReport({
        //            applet: data.applets[0].applet,
        //            container: "stepChart",
        //            date: (new Date()).format("yyyyMMdd"),
        //            timeType: "year",
        //            showReport: true
        //        });
        //    }
        //});
        $("#stepChart").loading();
        Iptools.GetJson({
            url: "basic/contactgroups/getMemberReport",
            data: {
                token: Iptools.DEFAULTS.token,
                contactgroupId: 186
            }
        }).done(function (r) {
            if (r && r.series && r.series.length && r.total) {
                hcThemes.changeTheme({
                    type: "ipCusLight"
                });
                $("#stepChart").highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: '数量趋势'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },
                    series: [
                        {
                            name: '月份统计',
                            colorByPoint: true,
                            data: r.series
                        }
                    ],
                    drilldown: {
                        series: r.drilldown
                    }
                });
            } else {
                var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                    'class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                $("#stepChart").css("position", "relative").html($(emptyHtml).css({
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translateX(-50%) translateY(-60%)"
                }));
            }
        });
    },
    _enableContactNewButton: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#addNewContact",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_new'"
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
    },
    _enableContactGroupNewButton: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#addNewContactGroup",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_group_new'"
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
    },
    _enableCampaignNewButton: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#addNewCampaign",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'campaign_new'"
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
    },
    _enableContactLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#contact_link",
            event: function () {
                var me = $(this);
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_profit'"
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
                                valueId: me.data("key"),
                                bread: true
                            });
                        });
                    }
                });
            }
        });
    },
    _enableCampaignLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#campaign_link",
            event: function () {
                var me = $(this);
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'campaign_detail'"
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
                                valueId: me.data("key"),
                                bread: true
                            });
                        });
                    }
                });
            }
        });
    },
    _enableCampaignListLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".moreCampaign",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'campaign_list'"
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
    },
    _enableContactListLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".moreContact",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_list'"
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
    },
    _enableContactGroupListLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#contact_group_list",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_group_list'"
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
    },
    _enableStartCampaignButton: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#start_campaign",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'campaign_new'"
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
    },
    _enableReportTimeChangeButton: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".report-time-btn",
            event: function () {
                var me = $(this);
                $(".report-time-btn").removeClass("report-btn-selected");
                me.addClass("report-btn-selected");
                Iptools.uidataTool._getCustomizeApplet({
                    nameList: "'Contact New Count Report'"
                }).done(function (data) {
                    if (data.applets.length) {
                        Iptools.uidataTool._buildReport({
                            applet: data.applets[0].applet,
                            container: "stepChart",
                            date: (new Date()).format("yyyyMMdd"),
                            timeType: me.data("type"),
                            showReport: true
                        });
                    }
                });
            }
        });
    },
    _enableReportMoreAnalysis: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#more_analysis",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'reportAnalysis'"
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
    },
    _enableQueryListJumpView: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".tag-content.v-link",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'" + $(this).data("v-name") + "'"
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
    },
    _enableQueryListHover: function () {
        if ($(document).width() > 1024) {
            widget._addEventListener({
                container: "body",
                type: "mouseenter",
                target: ".tag-title",
                event: function () {
                    var me = $(this);
                    me.find(".iconfont").animate({
                        "fontSize": "30px",
                        "paddingTop": "20px"
                    }, 500);
                    me.find(".hint-text").fadeIn(500);
                }
            });
            widget._addEventListener({
                container: "body",
                type: "mouseleave",
                target: ".tag-title",
                event: function () {
                    var me = $(this);
                    me.find(".iconfont").animate({
                        "fontSize": "44px",
                        "paddingTop": "36px"
                    }, 500);
                    me.find(".hint-text").fadeOut(500);
                }
            });
        }
    },
    _newContactList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list_all'",
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    applet: data.applets[0].applet,
                }).done(function (r) {
                    Iptools.uidataTool._getUserlistAppletData({
                        view: 0,
                        appletId: r.applet.id,
                        pageNow: 1,
                        pageSize: widget._UIDEFAULFS.listPageSize,
                        orderByColumn: "" + r.rootLink + ":create_time",
                        orderByAscDesc: "desc",
                    }).done(function (ds) {
                        if (ds.data && ds.data.records && ds.data.records.length) {
                            var prefix = ds.rootLink;
                            var html = "";
                            for (var i = 0, len = ds.data.records.length; i < len; i++) {
                                var name = ds.data.records[i][prefix + ":title"] ? ds.data.records[i][prefix + ":title"] : "";
                                var namestr;
                                if (name.length > 6) {
                                    namestr = name.substring(0, 5) + "...";
                                } else {
                                    namestr = name;
                                }
                                var contactTypeClassName = ds.data.records[i][prefix + ":contacttype"] ? widget._getContactTypeClassNameBytypeId(ds.data.records[i][prefix + ":contacttype"].id) : "";
                                var contactTypeName = ds.data.records[i][prefix + ":contacttype"] ? ds.data.records[i][prefix + ":contacttype"].name : "";
                                html += ' <div class="listArea ' + contactTypeClassName + '" data-id="' + ds.data.records[i][prefix + ":id"] + '">' +
     	                           '<div class="listItem">' +
	                               '<span class="list-item-type">' + contactTypeName + '</span>' +
	                               '<div class="list-item-info">' +
	                                   '<div><span class="contact-name" title="' + name + '">' + namestr + '</span><span class="contact-phone">' + ds.data.records[i][prefix + ":phone"] + '</span></div>' +
	                                   '<div>' + widget._getTagsByContactId(ds.data.records[i][prefix + ":id"]) + '</div>' +
	                               '</div>' +
	                               '<div class="list-item-detail"><span class="contactDetail icon-chevron-right"></span></div>' +
	                               '<div style="clear:both"></div>' +
	                           '</div>' +
	                        '</div>';
                            }
                            html += '<div class="more-list moreContact">更多客户<span class="contactDetail icon-chevron-right"></span></di>';
                            $(".newContactList").append(html);
                        } else {
                            $(".newContactList").html("<div class='noDataArea contactNoData'><img src='../Content/Image/emptyData.png' class='emptyImg'><span>没有客户呢，去创建一个吧~</span></div>");
                        }
                    });
                });
            }
        });
    },
    _getTagsByContactId: function (id) {
        var tagHtml = "";
        Iptools.GetJson({
            url: "basic/contactTagLinks",
            data: {
                "contactId": id,
                "token": Iptools.DEFAULTS.token
            },
        }).done(function (json) {
            if (json.length !== 0) {
                var tag = 0;
                for (var i = 0, len = 3; i < len; i++) {
                    if (json.length <= i) {
                        break;
                    } else {
                        tag += json[i].tagValue.length;
                        if (tag > len * 4) {
                            return;
                        } else {
                            tagHtml += '<span class="contactTag">' + json[i].tagValue + '</span>';
                        }

                    }
                }
            }
        });
        return tagHtml;

    },
    _getContactTypeClassNameBytypeId: function (id) {
        var name = "";
        switch (id) {
            case "2":
                name = "potentialContact";
                break;
            case "3":
                name = "consumeContact";
                break;
            case "4":
                name = "vipContact";
                break;
        }
        return name;
    },
    _newCampaignList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign List Applet Multi'",
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    applet: data.applets[0].applet,
                }).done(function (r) {
                    Iptools.uidataTool._getUserlistAppletData({
                        view: 0,
                        appletId: r.applet.id,
                        pageNow: 1,
                        pageSize: widget._UIDEFAULFS.listPageSize,
                        orderByColumn: "" + r.rootLink + ":create_time",
                        orderByAscDesc: "desc",
                    }).done(function (ds) {
                        if (ds.data && ds.data.records && ds.data.records.length) {
                            var campaignidName = "";
                            var h5IdName = "";
                            var title = "";
                            for (var j = 0, jlen = ds.columns.length; j < jlen; j++) {
                                if (ds.columns[j].name === "活动ID") {
                                    campaignidName = ds.columns[j].column;
                                } else if (ds.columns[j].name === "H5_ID") {
                                    h5IdName = ds.columns[j].column;
                                } else if (ds.columns[j].name === "活动名称") {
                                    title = ds.columns[j].column;
                                }
                            }
                            var html = "";
                            for (var i = 0, len = ds.data.records.length; i < len; i++) {
                                var typeobj = widget._getActivityTypeByCampaignId(ds.data.records[i][campaignidName]);
                                var reObj = widget._getReprotByCampaign(ds.data.records[i][campaignidName]);
                                var name = ds.data.records[i][title];
                                if (name.length > 15) {
                                    name = name.substring(0, 14) + "...";
                                }
                                html += ' <div class="listArea ' + typeobj.className + '" data-campaignId="' + ds.data.records[i][campaignidName] + '" data-h5id="' + ds.data.records[i][h5IdName] + '">' +
 		                           '<div class="listItem">' +
	                               '<span class="list-item-type">' + typeobj.name + '</span>' +
	                               '<div class="list-item-info">' +
	                                   '<div><span class="contact-name" title="' + ds.data.records[i][title] + '">' + name + '</span></div>' +
	                                   '<div class="list-item-report">' +
		                                  ' <span class="iconfont">&#xe660;</span><span class="viewNum">' + reObj.pageView + '</span>' +
		                                  ' <span class="iconfont">&#xe6a8;</span><span class="">' + reObj.responseCnt + '</span>' +
	                                   '</div>' +
	                               '</div>' +
	                               '<div class="list-item-detail"><span class="contactDetail icon-chevron-right"></span></div>' +
	                               '<div style="clear:both"></div>' +
	                           '</div>' +
	                        '</div>';
                            }
                            html += '<div class="more-list moreCampaign">更多活动<span class="contactDetail icon-chevron-right"></span></div>';
                            $(".newCampaignList").append(html);
                        } else {
                            $(".newCampaignList").html("<div class='noDataArea campaignNoData'><img src='../Content/Image/campaignEmpty.png' class='emptyImg'><span>没有活动呢，去创建一个吧~</span></div>");
                        }
                    });
                });
            }
        });
    },
    _getReprotByCampaign: function (id) {
        var reObj = {}
        Iptools.GetJson({
            async: false,
            url: "basic/getReportData",
            data: {
                "campaignId": id,
                "token": Iptools.DEFAULTS.token,
            },
        }).done(function (json) {
            if (json) {
                reObj.responseCnt = json.responseCnt;
                reObj.pageView = json.pageView;
                reObj.clickCnt = json.clickCnt;
            }
        });
        return reObj;
    },
    _getActivityTypeByCampaignId: function (id) {
        var typeObj = {};
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign Detail Applet'",
            async: false
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getUserDetailAppletData({
                    "async": false,
                    "appletId": data.applets[0].applet,
                    "valueId": id
                }).done(function (json) {
                    if (json.data) {
                        var prefix = json.rootLink;
                        typeObj.name = widget._getActivityTypeBySenceId(json.data[prefix + ":campaign_scene_id"]);
                        switch (typeObj.name) {
                            case "服务预约":
                                typeObj.className = "appointService";
                                break;
                            case "活动报名":
                                typeObj.className = "enterActivity";
                                break;
                        }
                    }
                });
            }
        });
        return typeObj;
    },
    _getActivityTypeBySenceId: function (id) {
        var type = "";
        Iptools.GetJson({
            async: false,
            url: "basic/campaignScenes/" + id + "?token=" + Iptools.DEFAULTS.token,

        }).done(function (json) {
            if (json) {
                type = json.title;
            }
        });
        return type;
    },
    _enableNewContact: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".contactNoData",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_new'"
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
    },
    _enableNewCampaign: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".campaignNoData",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'campaign_new'"
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
    },
    _enableCampaignDetail: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".newCampaignList .listArea",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'campaign_detail'"
                }).done(function (json) {
                    if (json.views.length) {
                        Iptools.uidataTool._getView({
                            view: json.views[0].view,
                        }).done(function (data) {
                            Iptools.Tool._jumpView({
                                view: json.views[0].view,
                                name: data.view.name + ">" + btn.find(".contact-name").html(),
                                type: data.view.type,
                                valueId: btn.data("campaignid"),
                                primary: data.view.primary,
                                icon: data.view.icon,
                                url: data.view.url,
                                bread: true
                            });
                            // campaignId
                            Iptools.uidataTool._getView({
                                view: json.views[0].view,
                                async: false
                            }).done(function (jd) {
                                // 设置tab下的局部变量
                                Iptools.Tool._setTabData({
                                    view: jd.views[0].view,
                                    valueId: btn.data("campaignid"),
                                    type: jd.view.type,
                                    key: "campaignValueId",
                                    value: btn.data("campaignid")
                                });
                            });

                        });
                    }
                });
            }
        });
    },
    _enableContactDetail: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".newContactList .listArea",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_detail'"
                }).done(function (json) {
                    if (json.views.length) {
                        Iptools.uidataTool._getView({
                            view: json.views[0].view,
                        }).done(function (data) {
                            Iptools.Tool._jumpView({
                                view: json.views[0].view,
                                name: data.view.name + ">" + btn.find(".contact-name").html(),
                                type: data.view.type,
                                valueId: btn.data("id"),
                                primary: data.view.primary,
                                icon: data.view.icon,
                                url: data.view.url,
                                bread: true
                            });

                        });
                    }
                });
            }
        });
    }
};