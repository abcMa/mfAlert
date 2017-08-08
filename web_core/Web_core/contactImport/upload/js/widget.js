/**
 * Created by sks on 2017/3/1.
 */

var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        contactDetaiApplet:"",
        contactTypeVal:"",
        excelContactArray:[],
        groupDeAppletId:"",
        groupDeRoot:"",
        isGropu:"",
        contactGroupName:"",
        contactGroupReason:"",
        contantGroupDes:"",
        signText:"电话号码",
        btn3:$(".step3 .next.sure")
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
        widget._goToStepTwo();  //第一步点击进入第二步
        widget._goToStepOne();  //第二步返回第一步
        widget._goToStepthree();  //第二步确认到第三步
        widget._fromStepThreeGoStepTwo(); //第二步返回岛上一步
        widget._contactGroup(); // 将导入的客户数据建群分群
        widget._selectOption(); //匹配属性之后，选框就处于选中状态
        widget._chooseInput();  //当input可以选择的时候，选择checkbox，全选按钮变化
        widget._allChecked(); //全选
        widget._importFile();  //第三步点击导入数据
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
    },
    _goToStepTwo:function(){
        widget._addEventListener({
            container:"body",
            type: "click",
            target:".step1 button.next",
            event:function(e){
                $(".step1").css("display","none");
                $(".step2").css("display","block");
                $(".step3").css("display","none");
                $(".step2 .fileName").val(CommonWidget._UIDEFAULFS.fileName);
                $(".excel .fileNum").html( CommonWidget._UIDEFAULFS.fileNum);
                widget._chooseCustomerType();
            }
        })
    },
    //获取客户类型
    _chooseCustomerType:function(){
        widget._addEventListener({
            container:"body",
            type:"change",
            target:".step2 select#contact-type",
            event:function(){
                if($(".step2 select#contact-type option:selected").val() != ""){
                    $(".excel .customerType").html($(".step2 select#contact-type option:selected").text());
                    widget._UIDEFAULFS.contactTypeVal = $(".step2 select#contact-type option:selected").val();
                    $(".step2 .button button.next").attr("disabled",false).removeClass("disableBtn").addClass("commonBtn");
                }else{
                    $(".excel .customerType").html("--");
                    $(".step2 .button button.next").attr("disabled",true).removeClass("commonBtn").addClass("disableBtn");
                }
            }
        })
    },
    _goToStepthree:function(){
        widget._addEventListener({
            container:"body",
            type: "click",
            target:".step2 button.next",
            event:function(e){
                if($("#chooseContactGrounp[type='checkbox']").is(":checked") == true){
                    widget._UIDEFAULFS.isGropu = true;
                    widget._UIDEFAULFS.contactGroupName = $(".contactGrounpName").val();
                    //widget._UIDEFAULFS.contactGroupReason = $("#group-basic option:selected").val();
                    widget._UIDEFAULFS.contantGroupDes = $(".contantGroupDes").val();
                    if(widget._UIDEFAULFS.contactGroupName == ''){
                        $(".form-group.name span.wrong-msg").html("客户群名称为必填");
                        $(".contactGrounpName").css("border-color","#f66");
                        return false;
                    }
                        // else if(widget._UIDEFAULFS.contactGroupReason == '' ){
                    //    $(".form-group.basic span.wrong-msg").html("分群依据为必填");
                    //    $("#group-basic select").css("border-color","#f66");
                    //    return false;
                    //}
                    else if( widget._UIDEFAULFS.contantGroupDes == ''){
                        $(".form-group.des span.wrong-msg").html("客户群描述为必填");
                        $(".contantGroupDes").css("border-color","#f66");
                        return false;
                    }
                }else {
                    widget._UIDEFAULFS.isGropu = false;
                }
                $("table tbody").html(" ");
                if($(".step2 .checkbox input[type='checkbox']").is(":checked")){
                    $(".step3 .headerContent").css("display","block");
                }else{
                    $(".step3 .headerContent").css("display","none");
                }
                $(".step1").css("display","none");
                $(".step2").css("display","none");
                $(".step3").css("display","block");
                var html = "";
                for(var i = 0; i<CommonWidget._UIDEFAULFS.titleResult.length;i++){
                    var title = CommonWidget._UIDEFAULFS.titleResult[i];
                    var optionString = "请选择客户属性";
                    html = '<tr>'+
                        '<td><label><input class ="blueCheckbox" type="checkbox"><span>'+title+'</span></label></td>'+
                        '<td>'+CommonWidget._UIDEFAULFS.firstLine[i]+'</td>'+
                        '<td>'+
                        '<select name="" id="">'+
                        '<option value="">'+optionString+'</option>' +
                        '</select></td>'+
                        '</tr>'
                    $("table tbody").append(html);
                };
                widget._getCustomerType();
                CommonWidget._autoMatching();
            }
        })
    },
    //关于新建客户群的的错误信息提示方法
    _wrongForGroup:function(){
        widget._addEventListener({
            container: "body",
            type: "blur",
            target: ".contactGrounpName",
            event: function () {
                var that = $(this);
                if($(that).val().length == 0){
                    $(".form-group.name span.wrong-msg").html("客户群名称为必填");
                    $(".form-group.name .contactGrounpName").css("border-color","#f66");
                }else if($(that).val().length > 0){
                    $(".form-group.name span.wrong-msg").html("");
                    $(".form-group.name input").css("border-color","#ccc");
                }
            }
        });
        //widget._addEventListener({
        //    container: "body",
        //    type: "change",
        //    target: "#group-basic",
        //    event: function () {
        //        var that = $(this);
        //        if($(that).find("option:selected").val() == ""){
        //            $(".form-group.basic span.wrong-msg").html("分群依据为必填");
        //            $(".form-group.basic select").css("border-color","#f66");
        //        }else{
        //            $(".form-group.basic span.wrong-msg").html("");
        //            $(".form-group.basic select").css("border-color","#ccc");
        //        }
        //    }
        //});
        widget._addEventListener({
            container: "body",
            type: "blur",
            target: ".contantGroupDes",
            event: function () {
                var that = $(this);
                if($(that).val().length == 0){
                    $(".form-group.des span.wrong-msg").html("客户群描述为必填");
                    $(".form-group.des input.contantGroupDes").css("border-color","#f66");
                }else if($(that).val().length > 0){
                    $(".form-group.des span.wrong-msg").html("");
                    $(".form-group.des input.contantGroupDes").css("border-color","#ccc");
                }
            }
        })

    },
    //电话号码被匹配之后，按钮点亮
    _imporBtnActived:function(){
        var optionSeclectedArray = [];
        for(var i = 0;i < $(".step3 select option:selected").length;i++){
            var optionSeclected = $(".step3 select option:selected")[i];
            optionSeclectedArray.push($(optionSeclected).text());
        }
        if(optionSeclectedArray.indexOf(widget._UIDEFAULFS.signText) != -1){
            widget._UIDEFAULFS.btn3.removeAttr("disabled").removeClass("disableBtn").addClass("commonBtn");
        }else{
            widget._UIDEFAULFS.btn3.attr("disabled","disabled").removeClass("commonBtn").addClass("disableBtn");
        }
    },
    //获得客户属性
    _getCustomerType:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList:"'contact'",
        }).done(function(data){
            if(data){
                widget._UIDEFAULFS.contactDetaiApplet = data.applets[0].applet;
                var dataObj = {
                    async: false,
                    applet: widget._UIDEFAULFS.contactDetaiApplet,
                };
                Iptools.uidataTool._getApplet(dataObj).done(function(r){
                    if(r && r.controls){
                        for(var i = 0;i < r.controls.length;i++){
                            var html = "";
                            html = '<option value="'+r.controls[i].id+'">'+r.controls[i].name+'</option>';
                            $(".step3 select").append(html);
                        }
                    }
                })
            }
        }).fail(function(){

        })
    },
    _goToStepOne:function(){
        widget._addEventListener({
            container:"body",
            type: "click",
            target:".step2 button.before",
            event:function(){
                $(".step1").css("display","block");
                $(".step2").css("display","none");
                $(".step3").css("display","none");
            }
        })
    },
    _fromStepThreeGoStepTwo:function(){
        widget._addEventListener({
            container:"body",
            type: "click",
            target:".step3 button.before",
            event:function(){
                $(".step1").css("display","none");
                $(".step2").css("display","block");
                if(widget._UIDEFAULFS.btn3.hasClass("commonBtn")){
                    widget._UIDEFAULFS.btn3.removeClass("commonBtn").addClass("disableBtn");
                };
                $(".step3").css("display","none");
            }
        })
    },
    //点击导入数据
    _importFile:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".step3 button.sure",
            event:function(){
                var btn = $(this);
                var array = [];
                var arrayText = [];
                var string;
                for(var i = 0;i < $(".step3 tbody tr input").length;i++){
                    var arrayDom = $(".step3 tbody tr input")[i];
                    if(!($(arrayDom).is(":checked"))){
                        $(arrayDom).attr({
                            "data-id":0,
                            "data-text":0
                        });
                    }
                    array.push($(arrayDom).attr("data-id"));
                    arrayText.push($(arrayDom).attr("data-text"))
                };
                var nary = arrayText.sort();
                for(var i=0;i<arrayText.length;i++){
                    if (nary[i]==nary[i+1] && nary[i] !=0){
                        Iptools.Tool.pAlert({
                            type: "info",
                            title:"'"+nary[i]+"'",
                            content: "的客户属性重复匹配了",
                            delay: 1000
                        });
                        widget._UIDEFAULFS.btn3.removeClass("no-events").button('reset').removeAttr("disabled");
                        return false;
                    }
                };
                string = array.toString();
                var paraData = new FormData();
                paraData.append("file", CommonWidget._UIDEFAULFS.files);
                $.ajax({
                    async: false,
                    url: (Iptools.DEFAULTS.API_URL + "basic/import/contactGroup/?token=" + Iptools.DEFAULTS.token+"&appletId="+ widget._UIDEFAULFS.contactDetaiApplet+"&controls="+string+"&filename="+CommonWidget._UIDEFAULFS.fileName+"&contactType="+widget._UIDEFAULFS.contactTypeVal+"&channel=importFile_import_list"+"&isGroup="+widget._UIDEFAULFS.isGropu+"&groupName="+widget._UIDEFAULFS.contactGroupName+"&groupDes="+widget._UIDEFAULFS.contantGroupDes),
                    type: "POST",
                    data: paraData,
                    processData: false,
                    contentType: false,
                    success:function(r){
                        if(r){
                            widget._UIDEFAULFS.btn3.attr("disabled",false);
                            window.location.href = "../index.html";
                        };
                    },
                    error:function(r){

                    },
                })
                btn.removeClass("no-events").button("reset");
            },
        })
    },
    //5月16日新增加的代码，分群，并且字段匹配
    _contactGroup:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"#chooseContactGrounp",
            event:function(){
                if($("#chooseContactGrounp[type='checkbox']").is(":checked") == true){
                    $(".content .right").css("display","block");
                    $(".contactGrounpName").removeAttr("disabled");
                    $("#group-basic").removeAttr("disabled");
                    $(".contact-group-word input.contantGroupDes").removeAttr("disabled");
                    widget._wrongForGroup();
                }else if($("#chooseContactGrounp[type='checkbox']").is(":checked") == false){
                    $(".content .right").css("display","none");
                    $(".contactGrounpName").val("");
                    $(".contactGrounpName").attr("disabled",true);
                    for(var i = 0;i< $("#group-basic option").length;i++){
                        var text = $("#group-basic option")[i];
                        if($(text).val() ==""){
                            $(text).attr("selected","true");
                        }
                    }
                    $("#group-basic").attr("disabled",true);
                    $(".contact-group-word input.contantGroupDes").val("");
                    $(".contact-group-word input.contantGroupDes").attr("disabled",true);
                    $(".form-group.name span.wrong-msg").html("");
                    $(".form-group.basic span.wrong-msg").html("");
                    $(".form-group.des span.wrong-msg").html("");
                }
            }
        })
    },
    //匹配属性之后，选框就处于选中状态
    _selectOption:function(){
        widget._addEventListener({
            container:"body",
            type:"change",
            target:".step3 select",
            event:function(event){
                event.stopPropagation();
                var text = $(this).find("option:selected").text();
                if($(this).find("option:selected").val() != ""){
                    var dataId = $(this).find("option:selected").val();
                    var dataText = $(this).find("option:selected").text();
                    $(this).parent().siblings().find("label input").attr({
                        "disabled":false,
                        "data-value":"checked",
                        "data-id":dataId,
                        "data-text":dataText
                    }).prop("checked",true);
                }else{
                    if(text = widget._UIDEFAULFS.signText){
                        if(widget._UIDEFAULFS.btn3.hasClass("commonBtn")){
                            widget._UIDEFAULFS.btn3.removeClass("commonBtn").addClass("disableBtn");
                        };
                    };
                    $(this).parent().siblings().find("label input").attr("disabled",true).prop("checked",false).removeAttr("data-value");
                    if($(this).parent().siblings().find("label input").attr("data-text") == widget._UIDEFAULFS.signText){
                        widget._UIDEFAULFS.btn3.removeClass("commonBtn").addClass("disableBtn");
                    }
                };
                //如果全部选择就第一行也选上
                CommonWidget._allSelected();
                //按钮点亮
                widget._imporBtnActived();
            }
        })
    },
    //当input可以选择的时候，选择checkbox，全选按钮变化
    _chooseInput:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".step3 tbody tr",
            event:function(){
                event.stopPropagation();
                if($(this).find("input").prop("checked") == true){
                    $(this).find("input").prop("checked",false).removeAttr("data-value");
                    $(".step thead input").prop("checked",false);
                    if($(this).find("select option:selected").text() == widget._UIDEFAULFS.signText){
                        widget._UIDEFAULFS.btn3.removeClass("commonBtn").addClass("disableBtn");
                    };
                    $(this).find("select option:selected").attr("selected",false);
                }else if($(this).find("input").prop("checked") == false){
                    if($(this).find("select option:selected").val() == ""){
                        return false;
                    }else{
                        if($(this).find("select option:selected").text() == widget._UIDEFAULFS.signText){
                            widget._UIDEFAULFS.btn3.removeClass("disableBtn").addClass("commonBtn");
                        };
                        var selectedNeedArray = [];
                        for(var i = 0; i < $(".step3 tbody input").length;i++) {
                            var selectedDom = $(".step3 tbody input")[i];
                            if ($(selectedDom).attr("data-value") == "checked") {
                                selectedNeedArray.push($(selectedDom).attr("data-value"));
                                if (selectedNeedArray.length == $(".step3 tbody input").length) {
                                    $(this).find("input").prop("checked",true).attr("data-value","checked");
                                    $(".step3 thead input").prop("checked",true);
                                } else if (selectedNeedArray.length < $(".step3 tbody input").length) {
                                    $(this).find("input").prop("checked",true).attr("data-value","checked");
                                }
                            } else if ($(selectedDom).attr("data-value") != "checked") {
                                $(this).find("input").prop("checked",true).attr("data-value","checked");
                            }
                        };
                        var needArray = [];
                        for(var i = 0;i < $(".step3 select option:selected").length;i++){
                            var domSeleced = $(".step3 select option:selected")[i];
                            if($(domSeleced).val() != ""){
                                needArray.push($(domSeleced).text());
                                if(needArray.length == $(".step3 select option:selected").length){
                                    $('.step3 thead input').attr("disabled",false);
                                }else if(needArray.length < $(".step3 select option:selected").length){
                                    $('.step3 thead input').attr("disabled",true);
                                }
                            }else if($(domSeleced).val() == ""){
                                $('.step3 thead input').attr("disabled",true);
                            }
                        }
                    }
                }
            }
        })
    },
    //点击列表的第一列和第二列，都会是选款有所改变,同时选择第一个th的checkbox就是全选状态
    _allChecked:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".step3 thead>tr input",
            event:function(event){
                event.stopPropagation();
                if( $('.step3 thead tr th:first-child input').prop('checked') == true){
                    $('.step3 tbody tr td:first-child input').prop('checked',false).removeAttr("data-value");
                }else if($('.step3 thead tr th:first-child input').prop('checked') == false){
                    var needArray = [];
                    for(var i = 0;i < $(".step3 select option:selected").length;i++){
                        var domSeleced = $(".step3 select option:selected")[i];
                        if($(domSeleced).val() != ""){
                            needArray.push($(domSeleced).text());
                            if(needArray.length == $(".step3 select option:selected").length){
                                $('.step3 tbody tr td:first-child input').prop('checked',true).attr("data-value","checked");
                            }else if(needArray.length < $(".step3 select option:selected").length){

                            }
                        }else if($(domSeleced).val() == ""){

                        }
                    }
                }
            }
        })
    },
};
