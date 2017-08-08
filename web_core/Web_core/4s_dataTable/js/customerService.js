var customerServiceWidget ={};
customerServiceWidget = {
    _UIDEFAULFS: {
        excelUUID: "2261633d-727d-11e7-8c68-00163e2eea54"
    },
    _rebuildUiDefaults: function (options) {
        customerServiceWidget._UIDEFAULFS = Iptools.Tool._extend(customerServiceWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        customerServiceWidget._enableOnMouseOver();//移动到元素上的hour事件
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        customerServiceWidget._bindingDomEvent();//DOM元素加载前绑定事件
        customerServiceWidget._initLoadingCustomerData();//初始化铺设客服数据
        customerServiceWidget._bindingEventAfterLoad();//插件绑定函数
    },
    _initLoadingCustomerData: function () {
        $(".table-head-tr").loading();
        Iptools.PostJson({
            url:"service/getExcelData",
            data:{
                token: Iptools.DEFAULTS.token,
                excelUUID: customerServiceWidget._UIDEFAULFS.excelUUID
            }
        }).done(function (data) {
            var tableThHtml = '';
            var tableTdHtml = '';
            var tdArr = [];
            var numArr = [];
            if (data && data.excelData) {
                $(".exportBtn").show();
                $(".word").html(data.title);
                if (data.excelData[0]) {
                    tableThHtml += '<div class="table-th th-one table-size'+data.excelData[0][0].width+data.excelData[0][0].height+'"><span class="table-name-one">'+data.excelData[0][0].title.split("|")[1]
                        +'</span><span class="table-name-two">'+data.excelData[0][0].title.split("|")[0]+'</span></div>';
                    for (var j = 1;j < data.excelData[0].length; j++) {
                        if (data.excelData[0][j].isHidden != true) {
                            tableThHtml += '<div class="table-th table-size'+data.excelData[0][j].width+data.excelData[0][j].height+'">'+data.excelData[0][j].title+'</div>';
                        }
                    }
                }
                $(".table-head-tr").html(tableThHtml);
                for (var i = 2,p = 2; i <data.excelData.length; i++,p++) {
                    if (data.excelData[i][0].isHidden != true) {
                        tdArr.push(data.excelData[i][0].height);
                        if (data.excelData[i][1].height == 0) {
                            numArr.push(data.excelData[i][0].title.length);
                            p--;
                            tableTdHtml += '<div class="table-body-tr"><div class="table-td td-one table-size'+data.excelData[i][0].width+data.excelData[i][0].height
                                +'">'+data.excelData[i][0].title+'</div>';
                        } else {
                            numArr.push(data.excelData[i][0].title.length);
                            tableTdHtml += '<div class="table-body-tr"><div class="table-td td-one table-size'+data.excelData[i][0].width+data.excelData[i][0].height
                                +'">'+data.excelData[i][0].title+'</div>';
                        }
                    } else {
                        if (data.excelData[i][1].height == 0) {
                            p--;
                            tableTdHtml += '<div class="table-body-tr table-position'+data.excelData[i][0].width+'"><div class="table-td table-size'+data.excelData[i][0].width+data.excelData[i][0].height
                                +'">'+' '+'</div>';
                        } else {
                            tableTdHtml += '<div class="table-body-tr tr-float table-float'+p+' table-position'+data.excelData[i][0].width+'"><div class="table-empty"></div><div class="table-td table-size'+data.excelData[i][0].width+data.excelData[i][0].height
                                +'">'+' '+'</div>';
                        }
                    }
                    for (var k = 1; k < data.excelData[i].length; k++) {
                        if (data.excelData[i][k].height != 0) {
                            numArr.push(data.excelData[i][k].title.length);
                            tableTdHtml +='<div class="table-td table-td-color table-size'+data.excelData[i][k].width+data.excelData[i][k].height
                                +'">'+data.excelData[i][k].title+'</div>';
                        }
                    }
                    tableTdHtml +='</div>';
                }
                $(".table-container-content").html(tableTdHtml);
                for (var v=2;v<data.excelData.length;v++) {
                    $('.table-float'+v).css("top",40*(v-2)+'px');
                }
                var compare = function (x, y) {//比较函数
                    if (x < y) {
                        return -1;
                    } else if (x > y) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
                for (var t=1;t<=tdArr.sort(compare)[tdArr.length-1];t++) {
                    $('.table-size1'+t).css({"height":40*t+"px","line-height":40*t+"px"});
                }
                var unitW = numArr.sort(compare)[numArr.length-1]*14 + "px";
                var unitW2 = numArr.sort(compare)[numArr.length-1]*28 + "px";
                $(".table-th").css("width",unitW);
                $(".table-td").css("width",unitW);
                $(".table-empty").css("width",unitW);
                $(".table-size21").css("width",unitW2);
                $(".table-size22").css("width",unitW2);
                var wth = data.excelData[0].length*unitW+15 + "px";
                $(".customer-table-container").css("width",wth);
            }
        });
        customerServiceWidget._enableCustomerServiceOnClick();//点击导出按钮，导出表格
    },
    _enableOnMouseOver: function () {
        customerServiceWidget._addEventListener({
            container: "body",
            target: ".table-td",
            type: "mouseover",
            event:function (e) {
                $(this).parent().find(".table-td-color").css("background-color","#f7f7f7");
            }
        });
        customerServiceWidget._addEventListener({
            container: "body",
            target: ".table-td",
            type: "mouseout",
            event:function (e) {
                $(this).parent().find(".table-td-color").css("background-color","#fff");
            }
        });
    },
    _enableCustomerServiceOnClick: function () {
        $(".exportBtn").attr("data-loading-text", "<span class='icon-refresh icon-spin'></span> 导出中...");
        customerServiceWidget._addEventListener({
            container: "body",
            target: ".exportBtn",
            type: "click",
            event:function () {
                $(".exportBtn").addClass("no-events").button("loading").css("pointer-events","none");
                Iptools.PostJson({
                    url:"service/exportExcelByExcelData",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        excelUUID: customerServiceWidget._UIDEFAULFS.excelUUID,
                        fileName:"客服月报"
                    }
                }).done(function (data) {
                    if (data && data.retcode == "ok") {
                        window.location.href = Iptools.DEFAULTS.serviceUrl + data.filePath;
                        Iptools.Tool.pAlert({
                            type: "info",
                            title: "系统提示：",
                            content: "导出成功",
                            delay: 1000
                        });
                        $(".exportBtn").removeClass("no-events").button("reset").css("pointer-events", "auto");
                    } else {
                        Iptools.Tool.pAlert({
                            type: "danger",
                            title: "系统提示：",
                            content: "导出失败",
                            delay: 1000
                        });
                        $(".exportBtn").removeClass("no-events").button("reset").css("pointer-events", "auto");
                    }
                }).fail(function () {
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "导出失败",
                        delay: 1000
                    });
                    $(".exportBtn").removeClass("no-events").button("reset").css("pointer-events", "auto");
                });
            }
        });
    }
};