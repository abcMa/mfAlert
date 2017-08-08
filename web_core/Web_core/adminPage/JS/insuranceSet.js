
var widget = {};
widget = {
    _UIDEFAULFS: {
        rateDeApplet : "",
        rateDeRoot : "",
        carTypeDetailApplet:"",
        carTypeDetailRoot:"",
        carTypeId:"",
        partsTypeDetailApplet:"",
        partsTypeDetailRoot:"",
        partsTypeId:""
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        widget._clickNewSale();//点击新建优惠类型
        widget._clickNewInsType();//新建投保类型
        widget._saveInsType();//保存投保类型
        widget._saveSaleType();//保存优惠类型
        widget._saveRate();//保存费率
        widget._editInsType();//编辑投保类型
        widget._editSale();//编辑优惠类型
        widget._delInsType();//删除投保类型
        widget._delSale();//删除优惠类型
        widget._sureInsType();//确认删除投保类型
        widget._sureDelSale();//确认删除优惠类型
        widget._sureDelRate();//确认删除费率
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._getSaleType();
        widget._getInsType();
        widget._check();
        widget._initPage();
        widget._getRateDeApplet();
    },
    _getRateDeApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'insurance_company_detail'"
        }).done(function(data) {
            widget._UIDEFAULFS.rateDeApplet = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet: data.applets[0].applet
            }).done(function (allData) {
                widget._UIDEFAULFS.rateDeRoot = allData.rootLink;
            })
        });
    },
    //铺设投保类型
    _getInsType: function(){
        Iptools.GetJson({
            url:"basic/pickItemWithParent",
            data:{
                token:Iptools.DEFAULTS.token,
                parentId:"05907e42-fa05-4a5a-a64b-1d33255e80b5"
            }
        }).done(function(data){
            $('#insuranceType .fansList').html("")
            $.each(data,function(k,obj){
                var k = k+1;
                var td = "";
                if(k < 10){
                    td += '<td>0'+k+'</td>'
                }else{
                    td += '<td>'+k+'</td>'
                }
                var html ='<tr class="hyperTr groupList">'+td+
                    '<td class="">'+obj.key+'</td>'+
                    '<td>'+obj.value+'</td>'+
                    '<td>'+
                    '<i class="fa fa-pencil-square-o editInsType" aria-hidden="true" data-key="'+obj.key+'" data-value="'+obj.value+'" data-id="'+obj.id+'"></i>'+
                    '<i class="fa fa-trash-o delInsType" aria-hidden="true" data-key="'+obj.key+'" data-value="'+obj.value+'" data-id="'+obj.id+'"></i>'+
                    '</td>'+
                    '</tr>';
                $('#insuranceType .fansList').append(html);
            })
        });
    },
    //铺设优惠类型
    _getSaleType : function(){
        Iptools.GetJson({
            url:"basic/pickItemWithParent",
            data:{
                token:Iptools.DEFAULTS.token,
                parentId:"04131d55-349e-4cc4-9099-b9e5750ff7be"
            }
        }).done(function(data){
            $('#saleType .fansList').html("")
            $.each(data,function(k,obj){
                var k = k+1;
                var td = "";
                if(k < 10){
                    td += '<td>0'+k+'</td>'
                }else{
                    td += '<td>'+k+'</td>'
                }
                var html ='<tr class="hyperTr groupList">'+td+
                '<td class="">'+obj.key+'</td>'+
                '<td>'+obj.value+'</td>'+
                '<td>'+
                '<i class="fa fa-pencil-square-o editSale" aria-hidden="true"  data-key="'+obj.key+'" data-value="'+obj.value+'" data-id="'+obj.id+'"></i>'+
                '<i class="fa fa-trash-o delSale" aria-hidden="true"  data-key="'+obj.key+'" data-value="'+obj.value+'" data-id="'+obj.id+'"></i></td>'+
                '</tr>';
                $('#saleType .fansList').append(html);
            })
        });
    },
    //铺设保险费率
    _initPage: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'insurance_company_list'"
        }).done(function(data) {
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet
            }).done(function(s) {
                var root = s.rootLink;//bc_modify_log
                component._table("#rate", {
                    applet: data.applets[0].applet,
                    emptyImage: "../../../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: '暂无追踪',
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    showChecks: false,
                    jumpType: "template",
                    jumpTemplate: "<a class='editRate'><span class='fa fa-pencil-square-o'></span></a><a class='delCom'><span class='fa fa-trash-o'></span></a>",
                    dataModify: function (r) {
                        var promise = $.Deferred();
                        if (r) {
                            r.columns.splice(1, 0, {
                                type: "text",
                                column: root + ":count",
                                name: "编号"
                            });
                        };
                        if (r.data && r.data.records && r.data.records.length) {
                            $.each(r.data.records,function(key,obj){
                                if(key+1 < 10){
                                    obj[root + ":count"] = "<span>0"+(key+1)+"</span>";
                                }else{
                                    obj[root + ":count"] = "<span>"+(key+1)+"</span>";
                                }

                            });
                        }
                        promise.resolve(r);
                        return promise;
                    },
                    events:[
                        {
                            target: ".editRate",
                            type: "click",
                            event: function (e) {
                                var me = $(this);
                                $('#addToRate').modal('show');
                                $('#formTask_rate').bootstrapValidator('resetForm');
                                $('#addToRate .modal-footer .saveTask').data('type','edit');
                                var rateId = me.parent().data("key");
                                var index = me.parent().attr('data-index');
                                var data = $("#rate").data("stable").options.data.records[index];
                                var title = "";
                                if(data[root+":name"]){
                                    title = data[root+":name"];
                                }
                                var rate = "";
                                if(data[root+":rate"]){
                                    rate = data[root+":rate"];
                                };
                                var year = "";
                                if(data[root+":year"]){
                                    year = data[root+":year"];
                                };
                                $('.com-name input').val(title);
                                $('.year-name input').val(year);
                                $('.rate-name input').val(rate);
                                $('#addToRate .modal-footer .saveTask').data('rate-id', rateId);
                            }
                        },
                        {
                            target: ".delCom",
                            type: "click",
                            event: function (e) {
                                var me = $(this);
                                $('#myModalRate').modal('show');
                                var index = me.parent().attr('data-index');
                                var data = $("#rate").data("stable").options.data.records[index];
                                var title = "";
                                if(data[root+":name"]){
                                    title = data[root+":name"];
                                }
                                $('#myModalRate .modal-body').html('确认删除投保公司费率-('+title+')？');
                                var rateId = me.parent().data("key");
                                $('#myModalRate .sureDelRate').data('delId',rateId);
                            }
                        },
                        {
                            target: ".new-rate",
                            type: "click",
                            event: function (e) {
                                $('#addToRate').modal('show');
                                $('#addToRate .modal-footer .saveTask').data('type','new');
                                $('.com-name input').val("");
                                $('.year-name input').val("");
                                $('.rate-name input').val("");
                                $('#formTask_rate').bootstrapValidator('resetForm');
                            }
                        }
                    ]

                });
            })
        })

    },
    _check: function(){
        $('#formTask').bootstrapValidator({
            fields: {
                key: {
                    validators: {
                        notEmpty: {
                            message: '请填写key'
                        }
                    }
                },
                valueType: {
                    validators: {
                        notEmpty: {
                            message: '请填写类型值'
                        }
                    }
                }
            }
        });
        $('#formTask_rate').bootstrapValidator({
            fields: {
                conName: {
                    validators: {
                        notEmpty: {
                            message: '请填写公司名称'
                        }
                    }
                },
                yearName: {
                    validators: {
                        notEmpty: {
                            message: '请填写年份'
                        }
                    }
                },
                rateName: {
                    validators: {
                        notEmpty: {
                            message: '请填写费率'
                        }
                    }
                }
            }
        });
        $('#formTask_insType').bootstrapValidator({
            fields: {
                insKey: {
                    validators: {
                        notEmpty: {
                            message: '请填写key'
                        }
                    }
                },
                insValueType: {
                    validators: {
                        notEmpty: {
                            message: '请填写类型值'
                        }
                    }
                }
            }
        });
    },
//------------------------------------事件-------------------------------
    _clickNewInsType: function(){
        widget._addEventListener({
            container: "body",
            target: "#insuranceType .syncData",
            type: "click",
            event: function () {
                $('#addToInsType').modal('show');
                $('#formTask_insType').bootstrapValidator('resetForm');
                $('#addToInsType .modal-footer .saveTask').data('type','new');
                $('#formTask_insType .key-name input').val("");
                $('#formTask_insType .value-name input').val("");
            }
        });
    },
    _clickNewSale: function(){
        widget._addEventListener({
            container: "body",
            target: "#saleType .syncData",
            type: "click",
            event: function () {
                $('#addToSale').modal('show');
                $('#formTask').bootstrapValidator('resetForm');
                $('#addToSale .modal-footer .saveTask').data('type','new');
                $('#formTask .key-name input').val("");
                $('#formTask .value-name input').val("");
            }
        });
    },
    _editInsType: function(){
        widget._addEventListener({
            container: "body",
            target: "#insuranceType .editInsType",
            type: "click",
            event: function (e) {
                var me = $(this);
                $('#addToInsType').modal('show');
                $('#addToInsType .modal-footer .saveTask').data('type','edit');
                $('#formTask_insType .key-name input').val(me.data('key'));
                $('#formTask_insType .value-name input').val(me.data('value'));
                $('#addToInsType .modal-footer .saveTask').data('edit-id',me.data('id'));
                $('#formTask_insType').bootstrapValidator('resetForm');
            }
        })
    },
    _delInsType: function(){
        widget._addEventListener({
            container: "body",
            target: "#insuranceType .delInsType",
            type: "click",
            event: function (e) {
                var me = $(this);
                $('#myModal').modal('show');
                $('#myModal .modal-body').html('确认删除投保类型-('+me.data('value')+')？');
                $('#myModal .modal-footer .sureDelInsType').data('edit-id',me.data('id'));
            }
        })
    },
    _delSale: function(){
        widget._addEventListener({
            container: "body",
            target: "#saleType .delSale",
            type: "click",
            event: function (e) {
                var me = $(this);
                $('#myModalSale').modal('show');
                $('#myModalSale .modal-body').html('确认删除优惠类型-('+me.data('value')+')？');
                $('#myModalSale .modal-footer .sureDelSale').data('edit-id',me.data('id'));
            }
        })
    },
    _sureDelRate: function(){
        widget._addEventListener({
            container: "body",
            target: "#myModalRate .sureDelRate",
            type: "click",
            event: function (e) {
                var me = $(this);
                Iptools.uidataTool._deleteAppletData({
                    para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + widget._UIDEFAULFS.rateDeApplet
                        + "&valueIds=" + me.data('delId')
                }).done(function (data) {
                    if(data.retcode == 'ok'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "删除成功"
                        });
                        $("#rate").data("stable")._refresh();
                        $('#myModalRate').modal('hide');
                    }
                });
            }
        });
    },
    _sureDelSale: function(){
        widget._addEventListener({
            container: "body",
            target: "#myModalSale .sureDelSale",
            type: "click",
            event: function (e) {
                var me = $(this);
                Iptools.DeleteJson({
                    url:'basic/pickItems/'+me.data('edit-id')+'?token='+Iptools.DEFAULTS.token
                }).done(function(){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "删除成功"
                    });
                    widget._getSaleType();
                    $('#myModalSale').modal('hide');
                }).fail(function(){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "删除成功"
                    });
                    widget._getSaleType();
                    $('#myModalSale').modal('hide');
                })

            }
        })
    },
    _sureInsType: function(){
        widget._addEventListener({
            container: "body",
            target: "#myModal .sureDelInsType",
            type: "click",
            event: function (e) {
                var me = $(this);
                Iptools.DeleteJson({
                    url:'basic/pickItems/'+me.data('edit-id')+'?token='+Iptools.DEFAULTS.token
                }).done(function(){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "删除成功"
                    });
                    widget._getInsType();
                    $('#myModal').modal('hide');
                }).fail(function(){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "删除成功"
                    });
                    widget._getInsType();
                    $('#myModal').modal('hide');
                })

            }
        })
    },
    _editSale : function(){
        widget._addEventListener({
            container: "body",
            target: "#saleType .editSale",
            type: "click",
            event: function (e) {
                var me = $(this);
                $('#addToSale').modal('show');
                $('#addToSale .modal-footer .saveTask').data('type','edit');
                $('#formTask .key-name input').val(me.data('key'));
                $('#formTask .value-name input').val(me.data('value'));
                $('#addToSale .modal-footer .saveTask').data('edit-id',me.data('id'));
                $('#formTask').bootstrapValidator('resetForm');
            }
        })
    },
    _saveInsType : function(){
        widget._addEventListener({
            container: "body",
            target: "#addToInsType .modal-footer .saveTask",
            type: "click",
            event: function (e) {
                var me = $(this);
                var key = $('#formTask_insType .key-name input').val();
                var value = $('#formTask_insType .value-name input').val();
                $('#formTask_insType').bootstrapValidator('validate');
                if (!$('#formTask_insType').data("bootstrapValidator").isValid()) {
                    return false;
                } else {
                    if(me.data('type') == 'new'){
                        Iptools.PostJson({
                            url:"basic/pickItems",
                            data:{
                                token:Iptools.DEFAULTS.token,
                                key:key,
                                value:value,
                                pickList:'05907e42-fa05-4a5a-a64b-1d33255e80b5'
                            }
                        }).done(function(data){
                            if(data.retcode == 'ok'){
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "新建成功"
                                });
                                widget._getInsType();
                                $('#addToInsType').modal('hide');
                            }
                        });
                    }else{
                        Iptools.PutJson({
                            url:"basic/pickItems",
                            data:{
                                token:Iptools.DEFAULTS.token,
                                id:me.data('edit-id'),
                                key:key,
                                value:value,
                                pickList:'05907e42-fa05-4a5a-a64b-1d33255e80b5'
                            }
                        }).done(function(data){
                            if(data.retcode == 'ok'){
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "编辑成功"
                                });
                                widget._getInsType();
                                $('#addToInsType').modal('hide');
                            }
                        });
                    }

                }
            }
        })
    },
    _saveSaleType: function() {
        widget._addEventListener({
            container: "body",
            target: "#addToSale .modal-footer .saveTask",
            type: "click",
            event: function (e) {
                var me = $(this);
                var key = $('#formTask .key-name input').val();
                var value = $('#formTask .value-name input').val();
                    $('#formTask').bootstrapValidator('validate');
                if (!$('#formTask').data("bootstrapValidator").isValid()) {
                    return false;
                } else {
                    if(me.data('type') == 'new'){
                        Iptools.PostJson({
                            url:"basic/pickItems",
                            data:{
                                token:Iptools.DEFAULTS.token,
                                key:key,
                                value:value,
                                pickList:'04131d55-349e-4cc4-9099-b9e5750ff7be'
                            }
                        }).done(function(data){
                            if(data.retcode == 'ok'){
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "新建成功"
                                });
                                widget._getSaleType();
                                $('#addToSale').modal('hide');
                            }
                        });
                    }else{
                        Iptools.PutJson({
                            url:"basic/pickItems",
                            data:{
                                token:Iptools.DEFAULTS.token,
                                id:me.data('edit-id'),
                                key:key,
                                value:value,
                                pickList:'04131d55-349e-4cc4-9099-b9e5750ff7be'
                            }
                        }).done(function(data){
                            if(data.retcode == 'ok'){
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "编辑成功"
                                });
                                widget._getSaleType();
                                $('#addToSale').modal('hide');
                            }
                        });
                    }

                }
            }
        })
    },
    _saveRate: function(){
        widget._addEventListener({
            container: "body",
            target: "#addToRate .modal-footer .saveTask",
            type: "click",
            event: function (e) {
                var me = $(this);
                var company = $('.com-name input').val();
                var year = $('.year-name input').val();
                var rate = $('.rate-name input').val();
                var id =  me.data('rate-id');
                $('#formTask_rate').bootstrapValidator('validate');
                if (!$('#formTask_rate').data("bootstrapValidator").isValid()) {
                    return false;
                } else {
                    var data = '{"'+widget._UIDEFAULFS.rateDeRoot+':name":"'+company+'","'+widget._UIDEFAULFS.rateDeRoot+':year":"'+year+'","'+widget._UIDEFAULFS.rateDeRoot+':rate":"'+rate+'"}';
                    if (me.data('type') == 'new') {
                        Iptools.uidataTool._addAppletData({
                            appletId:widget._UIDEFAULFS.rateDeApplet,
                            data:data
                        }).done(function(data) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "保险公司费率创建成功"
                            });
                        });
                    }else{
                        Iptools.uidataTool._saveAppletData({
                            appletId:widget._UIDEFAULFS.rateDeApplet,
                            valueId: id,
                            data:data
                        }).done(function(data){
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "保险公司费率更新成功"
                            });
                        })
                    };
                    $("#rate").data("stable")._refresh();
                    $('#addToRate').modal('hide');
                }
            }
        })
    },
}