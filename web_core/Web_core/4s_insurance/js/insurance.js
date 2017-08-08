/**
 * Created by sks on 2017/7/24.
 */
/**
 * Created by sks on 2017/7/4.
 */

/**
 * Created by sks on 2017/5/5.
 */
var insurance = {};
insurance = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        insuranceListApplet:"",
        insuranceListRootId:"",
        insuranceDetailApplet:"",
        dealsDetailInsuranceApplet:"",
        insuranceId:"",
        carListApplet:"",
        carListRootId:"",
        insuranceCarId:"",
        paramJson:"",
        title:"",
        editInsuranceId:"",
        insuCompanyRootId:"",
        dealApplet:"",
        dealRoot:"",
        dealSatus:"",
        carId:""
    },
    _rebuildUiDefaults: function (options) {
        insurance._UIDEFAULFS = Iptools.Tool._extend(insurance._UIDEFAULFS, options);
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
        insurance._showInsuranCompany();
        insurance._calculate();
        insurance._calFujiaTotal();
        insurance._aboutCarVin();
        insurance._clickSelectpalteCar();
        insurance._clickSelectvin();
        //insurance._buildDealStatus();
        insurance._removeClassName();
        insurance._editInsurance();
        insurance._saveInsurance();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = (d.getMonth()+1) > 9 ? (d.getMonth()+1) : "0"+(d.getMonth()+1)
        var str = year+"-"+month+"-"+d.getDate();
        $("#order-time").val(str);
        //insurance._getINsuCompany();
        insurance._getCarApplet();
        insurance._getDealAppletAndRoot();
        insurance._getAppletAndRootID();
        insurance._getSelectOption();
        insurance._getTime($("#register-time"));
        insurance._getTime($("#start-time"));
        insurance._getTime($("#end-time"));
        insurance._getTime($("#order-time"));
        insurance._checkForm();
        $('#insurance-edit').on('hide.bs.modal', function (e) {
            insurance._formReset();
            $("#new-insurance").data('bootstrapValidator').resetForm(true);
        });
        $('#myModalCom,#myDeal').on('hide.bs.modal', function (e) {
            $("#insurance-edit").css({
                "z-index":"1050",
                "overflow":"auto"
            });
        });
        insurance._bindingDomEvent();
    },
    /*获得数据*/
    _getAppletAndRootID:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'insurance_list'"
        }).done(function(data) {
            insurance._UIDEFAULFS.insuranceListApplet = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet: insurance._UIDEFAULFS.insuranceListApplet
            }).done(function (r) {
                insurance._UIDEFAULFS.insuranceListRootId = r.rootLink;
            })
        })
    },
    _removeClassName:function(){
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#insurance-edit .cancel",
            event:function(){
                if($("#insurance-edit .commonBtn").hasClass("save-new-insurance")){
                    $("#insurance-edit .commonBtn").removeClass("save-new-insurance")
                }else{
                    $("#insurance-edit .commonBtn").removeClass("edit-new-insurance")
                }
            }
        })
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#insurance-edit .close",
            event:function(){
                if($("#insurance-edit .commonBtn").hasClass("save-new-insurance")){
                    $("#insurance-edit .commonBtn").removeClass("save-new-insurance")
                }else{
                    $("#insurance-edit .commonBtn").removeClass("edit-new-insurance")
                }
            }
        })
    },
    //编辑保险详情
    _editInsuranceDetail:function(id){
        insurance._formReset();
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": insurance._UIDEFAULFS.insuranceDetailApplet,
            "valueId":id
        }).done(function(w){
            if(w){
                var a = w.data;
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":type"]){
                    for(var i = 1;i < $("#type option").length;i++){
                        var b = $("#type option:nth-child("+i+")").val();
                        if(b == a[insurance._UIDEFAULFS.insuranceListRootId+":type"].id){
                            $("#type option:nth-child("+i+")").prop("selected","selected");
                        }
                    }
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("select#type").attr("name"), "NOT_VALIDATED").validateField($("select#type").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":customer_source"]){
                    $("input#customer-source").val(a[insurance._UIDEFAULFS.insuranceListRootId+":customer_source"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#customer-source").attr("name"), "NOT_VALIDATED").validateField($("input#customer-source").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":register_date"]){
                    $("input#register-time").val(a[insurance._UIDEFAULFS.insuranceListRootId+":register_date"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#register-time").attr("name"), "NOT_VALIDATED").validateField($("input#register-time").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":plate_number"]){
                    $("input#plate-number").val(a[insurance._UIDEFAULFS.insuranceListRootId+":plate_number"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#plate-number").attr("name"), "NOT_VALIDATED").validateField($("input#plate-number").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":vin"]){
                    $("input#vin").val(a[insurance._UIDEFAULFS.insuranceListRootId+":vin"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#vin").attr("name"), "NOT_VALIDATED").validateField($("input#vin").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":customer_name"]){
                    $("input#car-name").val(a[insurance._UIDEFAULFS.insuranceListRootId+":customer_name"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#car-name").attr("name"), "NOT_VALIDATED").validateField($("input#car-name").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":car_brand"]){
                    $("input#car-brand").val(a[insurance._UIDEFAULFS.insuranceListRootId+":car_brand"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#car-brand").attr("name"), "NOT_VALIDATED").validateField($("input#car-brand").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":car_model_name"]){
                    $("input#car-model").val(a[insurance._UIDEFAULFS.insuranceListRootId+":car_model_name"]);
                    //$("#new-insurance").data("bootstrapValidator").updateStatus($("input#car-model").attr("name"), "NOT_VALIDATED").validateField($("input#car-model").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":insured_person"]){
                    $("input#insuranced-name").val(a[insurance._UIDEFAULFS.insuranceListRootId+":insured_person"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#insuranced-name").attr("name"), "NOT_VALIDATED").validateField($("input#insuranced-name").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":insured_person_identiy"]){
                    $("input#insuranced-id").val(a[insurance._UIDEFAULFS.insuranceListRootId+":insured_person_identiy"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":cellphone"]){
                    $("input#cellphone").val(a[insurance._UIDEFAULFS.insuranceListRootId+":cellphone"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#cellphone").attr("name"), "NOT_VALIDATED").validateField($("input#cellphone").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":cellphone2"]){
                    $("input#other-phone").val(a[insurance._UIDEFAULFS.insuranceListRootId+":cellphone2"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":order_date"]){
                    $("input#order-time").val(a[insurance._UIDEFAULFS.insuranceListRootId+":order_date"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#order-time").attr("name"), "NOT_VALIDATED").validateField($("input#order-time").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":insurance_company"]){
                    $("input#insuranced-company").val(a[insurance._UIDEFAULFS.insuranceListRootId+":insurance_company"].name);
                    $("input#insuranced-company").attr("data-id",a[insurance._UIDEFAULFS.insuranceListRootId+":insurance_company"].id);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#insuranced-company").attr("name"), "NOT_VALIDATED").validateField($("input#insuranced-company").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":insurance_start_date"]){
                    $("input#start-time").val(a[insurance._UIDEFAULFS.insuranceListRootId+":insurance_start_date"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#start-time").attr("name"), "NOT_VALIDATED").validateField($("input#start-time").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":insurance_end_date"]){
                    $("input#end-time").val(a[insurance._UIDEFAULFS.insuranceListRootId+":insurance_end_date"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#end-time").attr("name"), "NOT_VALIDATED").validateField($("input#end-time").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":is_jiaoqiang"] == true){
                    $("input#is-jiaoqiang").attr("checked","checked");
                    $("#jiaoqiang-order").removeAttr("disabled");
                    $("#jiaoqiang-money").removeAttr("disabled");
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":jiaoqiangxian_number"]){
                    $("input#jiaoqiang-order").val(a[insurance._UIDEFAULFS.insuranceListRootId+":jiaoqiangxian_number"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":jiaoqiang_amount"]){
                    $("input#jiaoqiang-money").val(a[insurance._UIDEFAULFS.insuranceListRootId+":jiaoqiang_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":is_chechuan"] == true){
                    $("input#is-chechuan").attr("checked","true");
                    $("#chechuan-money").removeAttr("disabled");
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":chechuanshui_amount"]){
                    $("input#chechuan-money").val(a[insurance._UIDEFAULFS.insuranceListRootId+":chechuanshui_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":is_shangye"] == true){
                    $("input#is-shangye").attr("checked","checked");
                    $(".shangye-check").removeAttr("disabled");
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":shangyexian_number"]){
                    $("input#shangye-order").val(a[insurance._UIDEFAULFS.insuranceListRootId+":shangyexian_number"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":shangye_amount"]){
                    $("input#shangye-money").val(a[insurance._UIDEFAULFS.insuranceListRootId+":shangye_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":sanzhexian_amount"]){
                    $("input#disanfang").val(a[insurance._UIDEFAULFS.insuranceListRootId+":sanzhexian_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":chesunxian_amount"]){
                    $("input#chasun").val(a[insurance._UIDEFAULFS.insuranceListRootId+":chesunxian_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":daoqiangxian_amount"]){
                    $("input#daoqiang").val(a[insurance._UIDEFAULFS.insuranceListRootId+":daoqiangxian_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":chezuoxian_amount"]){
                    $("input#cheshang").val(a[insurance._UIDEFAULFS.insuranceListRootId+":chezuoxian_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":is_bujimianpei"] == true){
                    $("input#buji").attr("checked","checked");
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":bolixian_amount"]){
                    for(var i = 1;i < $("#boli option").length;i++){
                        var b = $("#boli option:nth-child("+i+")").val();
                        if(b == a[insurance._UIDEFAULFS.insuranceListRootId+":bolixian_amount"].id){
                            $("#boli option:nth-child("+i+")").prop("selected","selected");
                        }
                    }
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":ziranxian_amount"]){
                    $("input#ziran").val(a[insurance._UIDEFAULFS.insuranceListRootId+":ziranxian_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":huahenxian_amount"]){
                    $("input#huaheng").val(a[insurance._UIDEFAULFS.insuranceListRootId+":huahenxian_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":is_wusanfang"] == true){
                    $("input#teyue").attr("checked","checked");
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":is_sheshuixian"] == true){
                    $("input#sheshui").attr("checked","checked");
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":xinzengshebei_amount"]){
                    $("input#shebei").val(a[insurance._UIDEFAULFS.insuranceListRootId+":xinzengshebei_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":fujiaxian_quantity"]){
                    $("input#insuranced-total").val(a[insurance._UIDEFAULFS.insuranceListRootId+":fujiaxian_quantity"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":discount_rate"]){
                    $("input#discount").val(a[insurance._UIDEFAULFS.insuranceListRootId+":discount_rate"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":total_amount"]){
                    $("input#total").val(a[insurance._UIDEFAULFS.insuranceListRootId+":total_amount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":shangyexian_rate"]){
                    $("input#shangye-rate").val(a[insurance._UIDEFAULFS.insuranceListRootId+":shangyexian_rate"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":shangyexian_commission"]){
                    $("input#shangye-charge").val(a[insurance._UIDEFAULFS.insuranceListRootId+":shangyexian_commission"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":jiaoqiang_commission"]){
                    $("input#jiaoqiang-charge").val(a[insurance._UIDEFAULFS.insuranceListRootId+":jiaoqiang_commission"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":total_commission"]){
                    $("input#total-profit").val(a[insurance._UIDEFAULFS.insuranceListRootId+":total_commission"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":pay_method"]){
                    for(var i = 1;i < $("#pay-method option").length;i++){
                        var b = $("#pay-method option:nth-child("+i+")").val();
                        if(b == a[insurance._UIDEFAULFS.insuranceListRootId+":pay_method"].id){
                            $("#pay-method option:nth-child("+i+")").prop("selected","selected");
                        }
                    }
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("select#pay-method").attr("name"), "NOT_VALIDATED").validateField($("select#pay-method").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":discount_type"]){
                    for(var i = 1;i < $("#profer-type option").length;i++){
                        var b = $("#profer-type option:nth-child("+i+")").val();
                        if(b == a[insurance._UIDEFAULFS.insuranceListRootId+":discount_type"].id){
                            $("#profer-type option:nth-child("+i+")").prop("selected","selected");
                        }
                    }
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("select#profer-type").attr("name"), "NOT_VALIDATED").validateField($("select#profer-type").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":cash_discount"]){
                    $("input#cash").val(a[insurance._UIDEFAULFS.insuranceListRootId+":cash_discount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":voucher_discount"]){
                    $("input#coupus").val(a[insurance._UIDEFAULFS.insuranceListRootId+":voucher_discount"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":sales_rep"]){
                    $("input#sales").val(a[insurance._UIDEFAULFS.insuranceListRootId+":sales_rep"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":responsible_person"]){
                    $("input#owner").val(a[insurance._UIDEFAULFS.insuranceListRootId+":responsible_person"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#owner").attr("name"), "NOT_VALIDATED").validateField($("input#owner").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":chudanren"]){
                    $("input#issuer").val(a[insurance._UIDEFAULFS.insuranceListRootId+":chudanren"]);
                    $("#new-insurance").data("bootstrapValidator").updateStatus($("input#issuer").attr("name"), "NOT_VALIDATED").validateField($("input#issuer").attr("name"));
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":is_telesales"] == true){
                    $("input#is-dianxiao").attr("checked","checked");
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":note"]){
                    $("input#remarks").val(a[insurance._UIDEFAULFS.insuranceListRootId+":note"]);
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":car_id"]){
                    insurance._UIDEFAULFS.insuranceCarId = a[insurance._UIDEFAULFS.insuranceListRootId+":car_id"].id;
                }
                if(a[insurance._UIDEFAULFS.insuranceListRootId+":id"]){
                    insurance._UIDEFAULFS.editInsuranceId = a[insurance._UIDEFAULFS.insuranceListRootId+":id"];
                }
            }
        })
    },
    /*新建保险的处理*/
    _checkForm:function(){
        $('#new-insurance').bootstrapValidator({
            fields: {/*验证：规则*/
                type: {
                    validators: {
                        notEmpty: {
                            message: '保险类别不能为空'
                        }
                    }
                },
                customerSource: {
                    validators: {
                        notEmpty: {
                            message: '客户来源不能为空'
                        },
                    }
                },
                registerTime: {
                    validators: {
                        notEmpty: {
                            message: '初登日期不能为空'
                        },
                    }
                },
                plateNum: {
                    validators: {
                        notEmpty: {
                            message: '车牌号不能为空'
                        },
                    }
                },
                vin: {
                    validators: {
                        notEmpty: {
                            message: 'VIN不能为空'
                        },
                    }
                },
                carName: {
                    validators: {
                        notEmpty: {
                            message: '车主姓名不能为空'
                        },
                    }
                },
                brand: {
                    validators: {
                        notEmpty: {
                            message: '车辆品牌不能为空'
                        }
                    }
                },
                insurancedName: {
                    validators: {
                        notEmpty: {
                            message: '被保险人不能为空'
                        }
                    }
                },
                cellphone: {
                    validators: {
                        notEmpty: {
                            message: '联系电话不能为空'
                        }
                    }
                },
                orderTime: {
                    validators: {
                        notEmpty: {
                            message: '出单日期不能为空'
                        }
                    }
                },
                insurancedCompany: {
                    validators: {
                        notEmpty: {
                            message: '承保公司不能为空'
                        },
                    }
                },
                startTime: {
                    validators: {
                        notEmpty: {
                            message: '承保日期不能为空'
                        }
                    }
                },
                endTime: {
                    validators: {
                        notEmpty: {
                            message: '终止日期不能为空'
                        }
                    }
                },
                payMethod: {
                    validators: {
                        notEmpty: {
                            message: '缴费方式不能为空'
                        }
                    }
                },
                proType: {
                    validators: {
                        notEmpty: {
                            message: '优惠类型不能为空'
                        }
                    }
                },
                owner: {
                    validators: {
                        notEmpty: {
                            message: '责任人不能为空'
                        }
                    }
                },
                user: {
                    validators: {
                        notEmpty: {
                            message: '出单人不能为空'
                        }
                    }
                },
                jiaoqiangOrder: {
                    validators: {
                        notEmpty: {
                            message: '交强保单不能为空'
                        },
                    }
                },
                jiaoqiangMoney:{
                    validators: {
                        notEmpty: {
                            message: '交强保费不能为空'
                        },
                    }
                },
                chechuanMon:{
                    validators: {
                        notEmpty: {
                            message: '车船保费不能为空'
                        },
                    }
                },
                shangyeOrder:{
                    validators: {
                        notEmpty: {
                            message: '商业保单不能为空'
                        },
                    }
                },
                shangyeMoney:{
                    validators: {
                        notEmpty: {
                            message: '商业保费不能为空'
                        },
                    }
                },
                cash:{
                    validators: {
                        notEmpty: {
                            message: '现金不能为空'
                        },
                    }
                },
                coupus:{
                    validators: {
                        notEmpty: {
                            message: '代金券不能为空'
                        },
                    }
                },
            }
        })
            // Add button click handler
         .on('click', '#is-jiaoqiang', function() {
            var $clone = $(".jiaoqiang-row");
            var $option1 = $clone.find('[name="jiaoqiangOrder"]');
            var $option2 = $clone.find('[name="jiaoqiangMoney"]');
            if($("#is-jiaoqiang").prop("checked")){
                $("#jiaoqiang-order").removeAttr("disabled").focus();
                $("#jiaoqiang-money").removeAttr("disabled");
                $('#new-insurance').bootstrapValidator('addField', $option1);
                $('#new-insurance').bootstrapValidator('addField', $option2);
            }else {
                $("#jiaoqiang-order").attr("disabled","true").val("").blur();
                $("#jiaoqiang-money").attr("disabled","true").val("").blur();
                $('#new-insurance').bootstrapValidator('removeField', $option1);
                $('#new-insurance').bootstrapValidator('removeField', $option2);
            }
        })
        .on('click', '#is-chechuan', function() {
            var $clone = $(".chechuan-row");
            var $option1 = $clone.find('[name="chechuanMon"]');
            if($("#is-chechuan").prop("checked")){
                $("#chechuan-money").removeAttr("disabled").focus();
                $('#new-insurance').bootstrapValidator('addField', $option1);
            }else {
                $("#chechuan-money").attr("disabled","true").val("");
                $('#new-insurance').bootstrapValidator('removeField', $option1);
            }
        })
        .on('click', '#is-shangye', function() {
            var $clone = $(".shangye-row");
            var $option1 = $clone.find('[name="shangyeOrder"]');
            var $option2 = $clone.find('[name="shangyeMoney"]');
            if($("#is-shangye").prop("checked")){
                $("#shangye-order").removeAttr("disabled").focus();
                $("#shangye-money").removeAttr("disabled");
                $('#new-insurance').bootstrapValidator('addField', $option1);
                $('#new-insurance').bootstrapValidator('addField', $option2);
            }else {
                $("#shangye-order").val("").attr("disabled",true).blur();
                $(".insurance-type-thr .shangye-check").attr("disabled",true).val("").blur();
                $('#new-insurance').bootstrapValidator('removeField', $option1);
                $('#new-insurance').bootstrapValidator('removeField', $option2);
            }
        })
        .on('change', '#profer-type', function() {
            var $clone = $("#profer-type");
            var $option1 = $clone.find('[name="cash"]');
            var $option2 = $clone.find('[name="coupus"]');
            if($("#profer-type option:selected").val() == 2){
                $("#coupus").removeAttr("disabled").focus();
                $("#cash").val("").blur().attr("disabled","true");
                $('#new-insurance').bootstrapValidator('addField', $option1);
                $('#new-insurance').bootstrapValidator('removeField', $option2);
            }else if($("#profer-type option:selected").val() == 3){
                $("#cash").removeAttr("disabled").focus();
                $("#coupus").val("").blur().attr("disabled","true");
                $('#new-insurance').bootstrapValidator('addField', $option2);
                $('#new-insurance').bootstrapValidator('removeField', $option1);
            }else{
                $("#coupus").attr("disabled","true");
                $("#cash").attr("disabled","true");
                $('#new-insurance').bootstrapValidator('removeField', $option1);
                $('#new-insurance').bootstrapValidator('removeField', $option2);
            }
        })
    },
    /*获取本年相对应的投保公司*/
    _getINsuCompany:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'insurance_company'"
        }).done(function(data) {
            if(data && data.applets){
                var applet = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:data.applets[0].applet
                }).done(function(s) {
                    insurance._UIDEFAULFS.insuCompanyRootId= s.rootLink;//bc_modify_log
                    component._table(".insu-company", {
                        applet: applet,
                        emptyImage: "../Content/Image/nodetail.png",
                        emptySize: "150",
                        emptyText: "没有承保公司，可去管理中心设置",
                        emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                        emptyClick: function () {

                        },
                        jumpType: "template",
                        checkType:"radio",
                        dataModify: null,
                        multiPanel: false,
                        afterLoad:function(){
                            insurance._addEventListener({
                                container:"body",
                                type:"click",
                                target:".selectInsuCom",
                                event:function(){
                                    var comData = $(".insu-company").data("stable").options.data;
                                    var radio = $(".insu-company").data("stable")._getRadio();
                                    if (radio && radio.id) {
                                        for(var i = 0;i < comData.records.length;i++){
                                            if(radio.id == comData.records[i][insurance._UIDEFAULFS.insuCompanyRootId+":id"]){
                                                $("#myModalCom").modal("hide");
                                                $("#insuranced-company").val(comData.records[i][insurance._UIDEFAULFS.insuCompanyRootId+":name"]);
                                                $("#new-insurance").data("bootstrapValidator").updateStatus($("input#insuranced-company").attr("name"), "NOT_VALIDATED").validateField($("input#insuranced-company").attr("name"));
                                                $("#insuranced-company").attr("data-id",comData.records[i][insurance._UIDEFAULFS.insuCompanyRootId+":id"]);
                                                $("#insuranced-company").attr("data-rate",comData.records[i][insurance._UIDEFAULFS.insuCompanyRootId+":rate"]);
                                                $("#shangye-rate").val(($("#insuranced-company").attr("data-rate"))*100);
                                                var rate = comData.records[i][insurance._UIDEFAULFS.insuCompanyRootId+":rate"];
                                                if(Iptools.Tool._checkNull($("#shangye-money").val())){
                                                    var a = Number($("#shangye-money").val());
                                                    $("#shangye-charge").val((a*rate).toFixed(2));
                                                    $("#total-profit").val((Number(a*rate)+Number($("#jiaoqiang-charge").val())).toFixed(2))
                                                }
                                                $("#insurance-edit").css({
                                                    "z-index":"1050",
                                                    "overflow":"auto"
                                                });
                                            }
                                        }
                                    } else {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "未选择"
                                        });
                                    }
                                }
                            })
                        },
                        searchEvent: function (condition) {
                            if (condition) {
                                $("#test_panel").append(JSON.stringify(condition) + "<br/>");
                            }
                        }
                    })
                })
            }
        })
    },
    //点击承保公司再次出来承保公司的模态框
    _showInsuranCompany:function(){
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#insuranced-company",
            event:function(){
                $("#insurance-edit").css("z-index","1000");
                $("#myModalCom").modal("show");
                $('#myModalCom').on('hide.bs.modal', function (e) {
                    $("#insurance-edit").css("z-index","1050");
                });
                insurance._getINsuCompany();
            }
        })
    },
    /*获得相对应的选项*/
    _getSelectOption:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'insurance_detail'"
        }).done(function(data) {
            if(data && data.applets){
                insurance._UIDEFAULFS.insuranceDetailApplet = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:insurance._UIDEFAULFS.insuranceDetailApplet,
                }).done(function(r){
                    if(r && r.controls){
                        for(var i = 0;i < r.controls.length;i++){
                            var columnName = r.controls[i].column;
                            var array = r.controls[i].pickList;
                            switch (columnName){
                                case "insurance:type":
                                    insurance._buildDom(array,$("#type"));
                                    break;
                                case "insurance:pay_method":
                                    insurance._buildDom(array,$("#pay-method"));
                                    break;
                                case "insurance:discount_type":
                                    insurance._buildDom(array,$("#profer-type"));
                                    break;
                                case "insurance:bolixian_amount":
                                    insurance._buildDom(array,$("#boli"));
                                    break;
                            }
                        }
                    }
                })
            }
        })
    },
    /*获取时间插件*/
    _getTime:function(container){
        $(container).datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: "month"
        }).on('hide', function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            var me = $(this);
            $("#new-insurance").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
    },
    /*相对应的计算方式*/
    _calculate:function(){
        insurance._addEventListener({
            container:"body",
            type:"change",
            target:"#type",
            event:function(){
                $("#customer-source").val($("#type option:selected").text());
                $("#new-insurance").data("bootstrapValidator").updateStatus($("#customer-source").attr("name"), "NOT_VALIDATED").validateField($("#customer-source").attr("name"));
            }
        })
        var shangyeAmount = Number(0);
        var jiaoqiangAmount = Number(0);
        var chechuanAmount = Number(0);
        var shangyeRate = Number(0);
        var shangyeCharge = Number(0);
        var jiaoqiangCharge = Number(0);
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#is-jiaoqiang",
            event:function(){
                if($("#is-jiaoqiang").prop("checked")){
                    insurance._addEventListener({
                        container:"body",
                        type:"blur",
                        target:"#jiaoqiang-money",
                        event:function(){
                            jiaoqiangAmount = Number($("#jiaoqiang-money").val());
                            $("#total").val(shangyeAmount+jiaoqiangAmount+chechuanAmount);
                            if(jiaoqiangAmount && jiaoqiangAmount != 0){
                                $("#jiaoqiang-charge").val((jiaoqiangAmount * 0.04).toFixed(2));
                                jiaoqiangCharge = Number((jiaoqiangAmount * 0.04).toFixed(2));
                                $("#total-profit").val((shangyeCharge+jiaoqiangCharge).toFixed(2))
                            }
                        }
                    })
                }else {
                    jiaoqiangAmount = Number(0);
                    $("#total").val(shangyeAmount+chechuanAmount+jiaoqiangAmount);
                    $("#jiaoqiang-charge").val((jiaoqiangAmount * 0.04).toFixed(2));
                    jiaoqiangCharge = Number((jiaoqiangAmount * 0.04).toFixed(2));
                    $("#total-profit").val((shangyeCharge+jiaoqiangCharge).toFixed(2))
                }
            }
        })
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#is-chechuan",
            event:function(){
                if($("#is-chechuan").prop("checked")){
                    $("#chechuan-money").removeAttr("disabled").focus();
                    insurance._addEventListener({
                        container:"body",
                        type:"blur",
                        target:"#chechuan-money",
                        event:function(){
                            chechuanAmount = Number($("#chechuan-money").val());
                            $("#total").val(shangyeAmount+jiaoqiangAmount+chechuanAmount)
                        }
                    })
                }else {
                    chechuanAmount = Number(0);
                    $("#total").val(shangyeAmount+jiaoqiangAmount+chechuanAmount)
                }
            }
        })
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#is-shangye",
            event:function(){
                if($("#is-shangye").prop("checked")){
                    $("#shangye-order").removeAttr("disabled").focus();
                    $(".shangye-check").removeAttr("disabled");
                    insurance._addEventListener({
                        container:"body",
                        type:"blur",
                        target:"#shangye-money",
                        event:function(){
                            shangyeAmount = Number($("#shangye-money").val());
                            $("#total").val(shangyeAmount+jiaoqiangAmount+chechuanAmount);
                            shangyeRate =Number($("#shangye-rate").val());
                            if(shangyeRate && shangyeRate != 0){
                                $("#shangye-charge").val((shangyeAmount *(shangyeRate/100)).toFixed(2));
                                shangyeCharge = Number((shangyeAmount *(shangyeRate/100)).toFixed(2));
                                $("#total-profit").val((shangyeCharge+jiaoqiangCharge).toFixed(2))
                            }
                        }
                    })
                }else {
                    $(".insurance-type-thr .shangye-check.blueCheckbox").removeAttr("checked");
                    $(".insurance-type-thr select.shangye-check option:nth-child(1)").prop("selected");
                    $("#insuranced-total").val("");
                    shangyeAmount = Number(0);
                    $("#total").val(shangyeAmount+jiaoqiangAmount+chechuanAmount);
                    $("#shangye-charge").val((shangyeAmount *shangyeRate).toFixed(2));
                    shangyeCharge = Number((shangyeAmount *shangyeRate).toFixed(2));
                    $("#total-profit").val(shangyeCharge+jiaoqiangCharge)
                }
            }
        })
    },
    /*遍历附件的险种*/
    _FujiaTotal:function(){
        var fujiaTatol = Number(0);
        for(var i = 0;i< $(".insurance-type-thr .fujia-add").length;i++){
            var dex = $(".insurance-type-thr .fujia-add")[i];
            var num = Number($(dex).attr("data-add"));
            fujiaTatol = fujiaTatol+num;
        }
        $("#insuranced-total").val(fujiaTatol);
    },
    _calFujiaTotal:function(){
        insurance._addEventListener({
            container:"body",
            type:"blur",
            target:"#ziran,#huaheng,#shebei",
            event:function(){
                if($(this).val().length>0){
                    $(this).attr("data-add","1");
                }else{
                    $(this).attr("data-add","0");
                }
                insurance._FujiaTotal();
            }
        })
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#teyue,#sheshui",
            event:function(){
                if($(this).prop("checked")){
                    $(this).attr("data-add","1");
                }else {
                    $(this).attr("data-add","0");
                }
               insurance._FujiaTotal();
            }
        })
        insurance._addEventListener({
            container:"body",
            type:"change",
            target:"#boli",
            event:function(){
                var a = $("#boli option:selected").val();
                if(a){
                    $(this).attr("data-add","1");
                }else{
                    $(this).attr("data-add","0");
                }
                insurance._FujiaTotal();
            }
        })
    },
    _getCarApplet:function(){
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "\"car_list\""
        }).done(function (r) {
            if (r && r.applets) {
                insurance._UIDEFAULFS.carListApplet = r.applets[0].applet;
                Iptools.uidataTool._getUserlistAppletData({
                    "appletId": r.applets[0].applet,
                }).done(function (s) {
                    insurance._UIDEFAULFS.carListRootId = s.rootLink;
                })
            }
        })
    },
    /*搜索车牌号和vin*/
    _searchCarPlate:function(option){
        Iptools.uidataTool._getUserlistAppletData({
            "appletId": insurance._UIDEFAULFS.carListApplet,
            condition:option.condition
        }).done(function(s) {
            $(option.container).html("");
            if (s && s.data && s.data.records) {
                var RootId = insurance._UIDEFAULFS.carListRootId;
                $.each(s.data.records, function (key, obj) {
                    var carPlate = obj[RootId + ':plate_number'];
                    var Vin = obj[RootId + ':vin'];
                    var Livalue = "";
                    if(option.container.indexOf("vin") > 0){
                        Livalue = Vin;
                    }else {
                        Livalue = carPlate;
                    }
                    var html = '<li role="presentation" class="demoLi">'+
                        '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' +Livalue +'</a>'+
                        '</li>';
                    $(option.container).append(html);
                });
            }else{
                var html ='<li role="presentation" class="disabled"><a role="menuitem" tabindex="-1" class="hint-link">请输入正确关键字...</a> </li>';
                $(option.container).append(html);
            }
        })
    },
    _aboutCarVin:function(){
        insurance._addEventListener({
            container: "body",
            type: "click",
            target: "#plate-number",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                $("#chepai .input-group-btn.chepai").addClass("open");
                $("#chepai button.chepai").attr("aria-expanded", "true");
                $("#vinList .input-group-btn.vin-list").removeClass("open");
                $("#vinList button.chepai").attr("aria-expanded", "false");
            }
        });
        insurance._addEventListener({
            container: "body",
            type: "click",
            target: "#vin",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                $("#vinList .input-group-btn.vin-list").addClass("open");
                $("#vinList button.chepai").attr("aria-expanded", "true");
                $("#chepai .input-group-btn.chepai").removeClass("open");
                $("#chepai button.chepai").attr("aria-expanded", "false");
            }
        });
        insurance._addEventListener({
            container: "body",
            type: "input",
            target: "#plate-number",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var carPlate = $(this).val();
                if(carPlate.length > 1){
                    var condition = '{"'+insurance._UIDEFAULFS.carListRootId+':plate_number":" like \'%'+carPlate+'%\'"}';
                    insurance._searchCarPlate({
                        condition:condition,
                        container:"#palteList"
                    })
                    return false;
                }else if(carPlate.length < 2){
                    $("#palteList").html('<li role="presentation" class="disabled"><a role="menuitem" tabindex="-1" class="hint-link">请输入至少2个关键字...</a></li>')
                }
            }
        });
        insurance._addEventListener({
            container: "body",
            type: "input",
            target: "#vin",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var vin = $(this).val();
                if(vin.length>5){
                    var condition = '{"'+insurance._UIDEFAULFS.carListRootId+':vin":" like \'%'+vin+'%\'"}';
                    insurance._searchCarPlate({
                        condition:condition,
                        container:"#vin-List-search"
                    })
                    return false;
                }else if(vin.length<6){
                    $("#vin-List-search").html('<li role="presentation" class="disabled"><a role="menuitem" tabindex="-1" class="hint-link">请输入至少6个关键字...</a> </li>')
                }
            }
        });
    },
    /*选中相对应的值并显示出来*/
    _clickSelectpalteCar: function(){
        insurance._addEventListener({
            container: "body",
            target: "ul#palteList li.demoLi",
            type: "click",
            event: function (e) {
                var me=$(this);
                $('#plate-number').val(me.find('a').html());
                $("#new-insurance").data("bootstrapValidator").updateStatus($("input#plate-number").attr("name"), "NOT_VALIDATED").validateField($("input#plate-number").attr("name"));
                $('#plate-number').attr("data-id",me.find('a').attr("data-id"));
                var id = $('#plate-number').attr("data-id");
                insurance._UIDEFAULFS.carId = id;
                insurance._showCarData(id);
                insurance._getDeal(id);
                insurance._selecDeal(id);
            }
        });
    },
    _clickSelectvin: function(){
        insurance._addEventListener({
            container: "body",
            target: "ul#vin-List-search .demoLi",
            type: "click",
            event: function (e) {
                var me=$(this);
                $('#vin').val(me.find('a').html());
                $("#new-insurance").data("bootstrapValidator").updateStatus($("input#vin").attr("name"), "NOT_VALIDATED").validateField($("input#vin").attr("name"));
                $('#vin').attr("data-id",me.find('a').attr("data-id"));
                var id = $('#vin').attr("data-id");
                insurance._UIDEFAULFS.carId = id;
                insurance._showCarData($('#vin').attr("data-id"));
                insurance._getDeal($('#vin').attr("data-id"));
                insurance._selecDeal(id);
            }
        });
    },
    /*根据车牌号或者是id带出来相关的车的信息*/
    _showCarData:function(id){
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "\"car_Detail\""
        }).done(function (r) {
            if(r && r.applets){
                Iptools.uidataTool._getUserDetailAppletData({
                    "appletId": r.applets[0].applet,
                    "valueId":id
                }).done(function(w){
                    if(w && w.data){
                        var a = w.data;
                        if(a["customer:customer_name"]){
                            $("input#car-name").val(a["customer:customer_name"]);
                            $("#new-insurance").data("bootstrapValidator").updateStatus($("input#car-name").attr("name"), "NOT_VALIDATED").validateField($("input#car-name").attr("name"));
                        }
                        if(a[insurance._UIDEFAULFS.carListRootId+":vin"]){
                            $("input#vin").val(a[insurance._UIDEFAULFS.carListRootId+":vin"]);
                            $("#new-insurance").data("bootstrapValidator").updateStatus($("input#vin").attr("name"), "NOT_VALIDATED").validateField($("input#vin").attr("name"));
                        }
                        if(a[insurance._UIDEFAULFS.carListRootId+":brand"]){
                            $("input#car-brand").val(a[insurance._UIDEFAULFS.carListRootId+":brand"].name);
                            $("#new-insurance").data("bootstrapValidator").updateStatus($("input#car-brand").attr("name"), "NOT_VALIDATED").validateField($("input#car-brand").attr("name"));
                        }
                        if(a[insurance._UIDEFAULFS.carListRootId+":plate_number"]){
                            $("input#plate-number").val(a[insurance._UIDEFAULFS.carListRootId+":plate_number"]);
                            $("#new-insurance").data("bootstrapValidator").updateStatus($("input#plate-number").attr("name"), "NOT_VALIDATED").validateField($("input#rplate-number").attr("name"));
                        }
                        insurance._UIDEFAULFS.insuranceCarId = id;
                    }
                })
            }
        })
    },
    /*得到deal的applet和root*/
    _getDealAppletAndRoot:function(){
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "\"deal_list_insu\""
        }).done(function (r) {
            if(r && r.applets){
                insurance._UIDEFAULFS.dealApplet = r.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:insurance._UIDEFAULFS.dealApplet
                }).done(function(s){
                    if(s && s.rootLink){
                        insurance._UIDEFAULFS.dealRoot = s.rootLink;
                    }
                })

            }
        })
    },
    _getDeal:function(id){
        $("#insuranced-deal").val("");
        $("#insuranced-deal").attr("data-id","");
        var conditionOP = {"insurance:car_id":" like \'%"+id+"%\'"};
        //console.log(conditionOP);
        Iptools.uidataTool._getUserlistAppletData({
            appletId:insurance._UIDEFAULFS.dealApplet,
            condition:conditionOP
        }).done(function(w){
            if(w && w.data && w.data.records){
                var a = w.data.records;
                var dealSatus = [];
                for(var i = 0;i< a.length;i++){
                    if(a[i][insurance._UIDEFAULFS.dealRoot+":status"]){
                        if(a[i][insurance._UIDEFAULFS.dealRoot+":status"].id == 1){
                            $("#myDeal").modal("show");
                            $("#insurance-edit").css("z-index","1000");
                            var obj = {
                                dealId:a[i][insurance._UIDEFAULFS.dealRoot+":id"],
                                statusId:a[i][insurance._UIDEFAULFS.dealRoot+":status"].id,
                                dealNmae:a[i][insurance._UIDEFAULFS.dealRoot+":title"]
                            };
                            dealSatus.push(obj)
                        }
                    }
                }
                insurance._addEventListener({
                    container:"body",
                    type:"click",
                    target:".set-deal",
                    event:function(){
                        $("#myDeal").modal("hide");
                        $("#insuranced-deal").val(dealSatus[0].dealNmae);
                        $("#insuranced-deal").attr("data-id",dealSatus[0].dealId);
                        $("#insurance-edit").css({
                            "z-index":"1050",
                            "overflow":"auto"
                        });
                    }
                })
            }
        })
    },
    /*手动选择线索*/
    _selecDeal:function(id){
        insurance._getDealAppletAndRoot();
        var conditionOP = {"insurance:car_id":" like \'%"+id+"%\'"};
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:"#insuranced-deal",
            event:function(){
                $("#insurance-edit").css("z-index","1000");
                $("#selectDeal").modal("show");
                $('#selectDeal').on('hide.bs.modal', function (e) {
                    $("#insurance-edit").css("z-index","1050");
                });
                component._table(".deal-list", {
                    applet: insurance._UIDEFAULFS.dealApplet,
                    condition:conditionOP,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "此车没有线索",
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    emptyClick: function () {

                    },
                    jumpType: "template",
                    checkType:"radio",
                    dataModify: null,
                    multiPanel: false,
                    afterLoad:function(){
                        var comData = $(".deal-list").data("stable").options.data;
                        insurance._addEventListener({
                            container:"body",
                            type:"click",
                            target:".selectDeal",
                            event:function(){
                                var comData = $(".deal-list").data("stable").options.data;
                                var radio = $(".deal-list").data("stable")._getRadio();
                                if (radio && radio.id) {
                                    for(var i = 0;i < comData.records.length;i++){
                                        if(radio.id == comData.records[i][insurance._UIDEFAULFS.dealRoot+":id"]){
                                            $("#selectDeal").modal("hide");
                                            $("#myDeal").modal("hide");
                                            $("#insuranced-deal").val(comData.records[i][insurance._UIDEFAULFS.dealRoot+":title"]);
                                            $("#insuranced-deal").attr("data-id",comData.records[i][insurance._UIDEFAULFS.dealRoot+":id"]);
                                            $("#insurance-edit").css({
                                                "z-index":"1050",
                                                "overflow":"auto"
                                            });
                                        }
                                    }
                                } else {
                                    Iptools.Tool.pAlert({
                                        title: "系统提示",
                                        content: "未选择"
                                    });
                                }
                            }
                        })
                    },
                    searchEvent: function (condition) {
                        if (condition) {
                            $("#test_panel").append(JSON.stringify(condition) + "<br/>");
                        }
                    }
                })
            }
        })
    },
    _buildDom:function(array,container){
        for(var i = 0;i < array.length;i++){
            var html = "<option value='"+array[i].id+"'>"+array[i].name+"</option>";
            $(container).append(html)
        }
    },
    /*新建保险*/
    _saveNewInsurance:function(){
        var param = {};
        var a = $("#new-insurance input.type-text");
        var b = $("#new-insurance input.blueCheckbox");
        var c = $("#new-insurance select.choose");
        var d = $("#new-insurance input.type-search");
        for(var i = 0;i < a.length;i++){
            if($(a[i]).val()){
                param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(a[i]).attr("data-field")] = $.trim($(a[i]).val());
            }else{
                delete param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(a[i]).attr("data-field")];
            }
        }
        for(var j = 0; j < b.length;j++){
            if($(b[j]).prop("checked")){
                param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(b[j]).attr("data-field")] = 1;
            }else{
                param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(b[j]).attr("data-field")] = 0;
            }
        }
        for(var w = 0; w < c.length;w++){
            if($(c[w]).find("option:selected").val()){
                param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(c[w]).attr("data-field")] = $.trim($(c[w]).find("option:selected").val());
            }else {
                delete param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(c[w]).attr("data-field")];
            }
        }
        for(var j = 0;j< d.length;j++){
            if($(d[j]).val()){
                param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(d[j]).attr("data-field")] =$(d[j]).attr("data-name");
            }else{
                delete param[insurance._UIDEFAULFS.insuranceListRootId+":"+$(d[j]).attr("data-field")];
            }
        }
        if($("input.type-button").val()){
            param[insurance._UIDEFAULFS.insuranceListRootId+":"+$("input.type-button").attr("data-field")] = $("input.type-button").attr("data-id");
        }else{
            delete param[insurance._UIDEFAULFS.insuranceListRootId+":"+$("input.input-button").attr("data-field")];
        }
        if($("#shangye-order").val()){
            insurance._UIDEFAULFS.title = $("#shangye-order").val();
        }else if($("#jiaoqiang-order").val()){
            insurance._UIDEFAULFS.title = $.trim($("#jiaoqiang-order").val());
        }
        insurance._UIDEFAULFS.paramJson = JSON.stringify(param);
        //console.log(insurance._UIDEFAULFS.paramJson);
    },
    /*新建保险调用接口*/
    _saveInsurance:function(){
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:".save-new-insurance",
            event:function(){
                var btn = $(this);
                $('#new-insurance').bootstrapValidator('validate');
                if(!$('#new-insurance').data("bootstrapValidator").isValid()){
                    return false;
                }else{
                    insurance._saveNewInsurance();
                    var dealIndex = "";
                    if($("input.deal-input").val()){
                        dealIndex = $("input.deal-input").attr("data-id");
                    }
                    btn.css({"pointer-events":"none"});
                    btn.button("loading");
                    Iptools.PostJson({
                        url: "4s/insurance/checkInsurancePolicy",
                        data: {
                            token: Iptools.DEFAULTS.token,
                            appletId:insurance._UIDEFAULFS.insuranceDetailApplet,
                            fileData:insurance._UIDEFAULFS.paramJson,
                            dealId:dealIndex
                        }
                    }).done(function(r){
                        if(r && r.retcode == "ok"){
                            Iptools.Tool.pAlert({
                                type: "info",
                                title: "系统提示：",
                                content: "新建保险成功",
                                delay: 1000
                            });
                            insurance._formReset();
                            $("#insurance-edit .commonBtn").removeClass("save-new-insurance");
                            btn.removeClass("no-events").button("reset");
                            btn.css("pointer-events","auto");
                            $("#new-insurance").data('bootstrapValidator').resetForm(true);
                            $("#insurance-edit").modal("hide");
                            if(insurance._UIDEFAULFS.insuranceCarId){
                                var carId = insurance._UIDEFAULFS.insuranceCarId;
                                var title = insurance._UIDEFAULFS.title;
                                InsuTrace._createInsuranceTrace(carId,title);
                            }
                            if(btn.parent().hasClass("deals")){
                                widget._changeDealStage({
                                    status:"2"
                                });
                            }
                            Iptools.uidataTool._pushMessage({
                                channel: "insurance_list"
                            });
                        }
                    })
                }
            }
        })
    },
    /*编辑保险*/
    _editInsurance:function(){
        insurance._addEventListener({
            container:"body",
            type:"click",
            target:".edit-new-insurance",
            event:function(){
                var btn = $(this);
                $('#new-insurance').bootstrapValidator('validate');
                if(!$('#new-insurance').data("bootstrapValidator").isValid()){
                    return false;
                }else{
                    insurance._saveNewInsurance();
                    if($("input.deal-input").val()){
                        dealIndex = $("input.deal-input").attr("data-id");
                    }
                    btn.css({"pointer-events":"none"});
                    btn.button("loading");
                    Iptools.PostJson({
                        url: "4s/insurance/checkInsurancePolicy",
                        data: {
                            token: Iptools.DEFAULTS.token,
                            appletId:insurance._UIDEFAULFS.insuranceDetailApplet,
                            fileData:insurance._UIDEFAULFS.paramJson,
                            valueId:insurance._UIDEFAULFS.editInsuranceId,
                            dealId:dealIndex
                        }
                    }).done(function(r){
                        if(r && r.retcode == "ok"){
                            Iptools.Tool.pAlert({
                                type: "info",
                                title: "系统提示：",
                                content: "编辑保险成功",
                                delay: 2000
                            });
                            insurance._formReset();
                            $("#insurance-edit .commonBtn").removeClass("edit-new-insurance");
                            btn.removeClass("no-events").button("reset");
                            btn.css("pointer-events","auto");
                            $("#new-insurance").data('bootstrapValidator').resetForm(true);
                            $("#insurance-edit").modal("hide");
                            if(btn.parent().hasClass("deals")){
                                widget._changeDealStage({
                                    status:"2"
                                });
                            }
                            Iptools.uidataTool._pushMessage({
                                channel: "insurance_list"
                            });
                        }
                    })
                }
            }
        })
    },
    _formReset:function(){
        document.getElementById("new-insurance").reset();
        $("#vin-List-search").html('<li role="presentation" class="disabled"><a role="menuitem" tabindex="-1" class="hint-link">请输入至少6个关键字...</a> </li>');
        $("#palteList").html('<li role="presentation" class="disabled"><a role="menuitem" tabindex="-1" class="hint-link">请输入至少2个关键字...</a></li>');
        //$("#new-insurance .blueCheckbox").removeAttr("checked")
    },
}
