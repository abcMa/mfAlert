var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        pageSize: 10,
        pageNow:1,
        paramData:{},
        channelHtml:"",
        statusHtml:"",
        timeHtml:""
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
        widget._differentTime();
        widget._differentCondition();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._getOrderList({
            pageNow: 1,
        });
        widget._bindingDomEvent();

    },
   _getOrderList:function(param){

       $("#orderContent").html("");
       widget._UIDEFAULFS.paramData = {
           //"tenantId":Iptools.DEFAULTS.tenantId,
           "token":Iptools.DEFAULTS.token,
           "pageSize":widget._UIDEFAULFS.pageSize,
           "pageNow":param.pageNow,
           'channel':param.channel,
           'status':param.status,
           'nearlyDays':param.nearlyDays
       }
       //console.log(widget._UIDEFAULFS.paramData);
        Iptools.GetJson({
            url:"basic/tenantOrders/query",
            data:widget._UIDEFAULFS.paramData,
        }).done(function(data){
            //console.log(data)
            if(data){
                if(data.records.length > 0){
                    //console.log(4)
                    $.each(data.records,function(key,obj) {
                        var Status = "";
                        var Ways = "";
                        var Time = "";
                        if(obj['channel'] == "wx_pub_qr"){
                            Ways = "微信公众号扫码支付";
                        }else if(obj['channel'] == "alipay_pc_direct"){
                            Ways = "支付宝PC网页支付";
                        }else if(obj['channel'] == "alipay_qr"){
                            Ways = "支付宝扫码支付";
                        };
                        if(obj['status'] == 2){
                            Status = "支付成功";
                            Time = obj['payTime']
                        }else if(obj['status'] == 1){
                            Status = "待支付";
                            Time = "";
                        }
                        var html = '<tr>' +
                            '<td>'+obj['orderNo'] +'</td>' +
                            '<td>'+obj['ammount']+'</td>' +
                            '<td>'+obj['orderDesc']+'</td>' +
                            '<td>'+Status+'</td>' +
                            '<td>'+Time+'</td>' +
                            '<td>'+Ways+'</td>' +
                            '</tr>';
                        $("#orderContent").append(html);
                    });
                    $("#pager-example-panel").css("display","block");
                    component._pager({
                        container: "pager-example-panel",
                        pageSize: widget._UIDEFAULFS.pageSize,
                        pageCount:data.pageCount,//总页数
                        rowCount: data.rowCount,//总条数
                        pageNow: param.pageNow,
                        jump: function (page) {
                            widget._UIDEFAULFS.channelHtml = $("#channel").val();
                            widget._UIDEFAULFS.statusHtml  = $("#status").val();
                            //console.log(widget._UIDEFAULFS.channelHtml);
                            //console.log( widget._UIDEFAULFS.statusHtml)
                            //console.log($(".payTime li a.time span").text())
                            if($(".payTime li a.days span").hasClass("btnColor") && $(".payTime li a.days span").text() == "7天"){
                                widget._getOrderList({
                                    pageNow: page,
                                    'channel':widget._UIDEFAULFS.channelHtml,
                                    'status':widget._UIDEFAULFS.statusHtml,
                                    nearlyDays:7,
                                })
                            }else if($(".payTime li a.month span").hasClass("btnColor") && $(".payTime li a.month span").text() == "30天"){
                                //console.log(77)
                                widget._getOrderList({
                                    pageNow: page,
                                    'channel':widget._UIDEFAULFS.channelHtml,
                                    'status':widget._UIDEFAULFS.statusHtml,
                                    nearlyDays:30,
                                })
                            }else if($(".payTime li a.all span").hasClass("btnColor") && $(".payTime li a.all span").text() == "全部"){
                                //console.log(99)
                                widget._getOrderList({
                                    pageNow: page,
                                    'channel':widget._UIDEFAULFS.channelHtml,
                                    'status':widget._UIDEFAULFS.statusHtml,
                                    nearlyDays:undefined,
                                })
                            }
                        }
                    });
                }else if(data.records.length == 0){
                    var html = '<tr style="background-color:#fff;">' +
                        '<td style="border:none;"></td>' +
                        '<td style="border:none;"></td>' +
                        '<td style="border:none;"></td>' +
                        '<td style="font-size: 20px;padding: 80px;padding-bottom:0px;text-align: left;border:none;"><img src="../img/nodetail.png" style="width:150px;height: 150px;"></td>' +
                        '<td style="border:none;"></td>' +
                        '<td style="border:none;"></td>' +
                        '</tr>'+
                        '<tr style="background-color:#fff;">' +
                        '<td style="border: none;"></td>' +
                        '<td style="border: none;"></td>' +
                        '<td style="border: none;"></td>' +
                        '<td style="border: none;padding-left: 100px;padding-bottom: 20px;color:#333;">没有短信充值记录</td>' +
                        '<td style="border: none;"></td>' +
                        '<td style="border: none;"></td>' +
                        '</tr>';
                    $("#orderContent").append(html);
                    $("#pager-example-panel").css("display","none");
                };
            }
        })
   },
    //订单管理查询时间条件
   _differentTime:function(){
        widget._addEventListener({
            container: "body",
            target: ".payTime li a.time span",
            type: "click",
            event: function (e) {
                //widget._UIDEFAULFS.sPhoneValue = Iptools.Tool._GetProperValue($(widget._UIDEFAULFS.sPhone).val());
                //widget._UIDEFAULFS.sStatusValue = Iptools.Tool._GetProperValue($(widget._UIDEFAULFS.sStatus).val());
                //widget._setSmsList({
                //    pageNow: 1
                //});
                widget._UIDEFAULFS.channelHtml = $("#channel").val();
                widget._UIDEFAULFS.statusHtml  = $("#status").val();
                if(e.target.innerText == "7天"){
                    $(".payTime li a.days span").addClass("btnColor");
                    $(".payTime li a.month span").removeClass("btnColor");
                    $(".payTime li a.all span").removeClass("btnColor");
                    widget._getOrderList({
                        pageNow: 1,
                        nearlyDays:7,
                        'channel':widget._UIDEFAULFS.channelHtml,
                        'status':widget._UIDEFAULFS.statusHtml,
                    })
                }else if(e.target.innerText == "30天"){
                    $(".payTime li a.month span").addClass("btnColor");
                    $(".payTime li a.days span").removeClass("btnColor");
                    $(".payTime li a.all span").removeClass("btnColor");
                    widget._getOrderList({
                        pageNow: 1,
                        nearlyDays:30,
                        'channel':widget._UIDEFAULFS.channelHtml,
                        'status':widget._UIDEFAULFS.statusHtml,
                    })
                }else{
                    $(".payTime li a.month span").removeClass("btnColor");
                    $(".payTime li a.days span").removeClass("btnColor");
                    $(".payTime li a.all span").addClass("btnColor");
                    widget._getOrderList({
                        pageNow: 1,
                        nearlyDays:undefined,
                        'channel':widget._UIDEFAULFS.channelHtml,
                        'status':widget._UIDEFAULFS.statusHtml,
                    })
                }
            }

        })
    },
    //不同的条件
    _differentCondition:function(){
        widget._addEventListener({
            container: "body",
            target: "#reseach",
            type: "click",
            event: function () {
                widget._UIDEFAULFS.channelHtml = $("#channel").val();
                widget._UIDEFAULFS.statusHtml  = $("#status").val();
                if($(".payTime li a.days span").hasClass("btnColor") && $(".payTime li a.days span").text() == "7天"){
                    widget._getOrderList({
                        pageNow: 1,
                        'channel':widget._UIDEFAULFS.channelHtml,
                        'status':widget._UIDEFAULFS.statusHtml,
                        nearlyDays:7,
                    })
                }else if($(".payTime li a.month span").hasClass("btnColor") && $(".payTime li a.month span").text() == "30天"){
                    widget._getOrderList({
                        pageNow: 1,
                        'channel':widget._UIDEFAULFS.channelHtml,
                        'status':widget._UIDEFAULFS.statusHtml,
                        nearlyDays:30,
                    })
                }else{
                    widget._getOrderList({
                        pageNow: 1,
                        'channel':widget._UIDEFAULFS.channelHtml,
                        'status':widget._UIDEFAULFS.statusHtml,
                        nearlyDays:undefined,
                    })
                }

            }
        })
    },
};