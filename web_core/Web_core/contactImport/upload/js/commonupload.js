/**
 * Created by sks on 2017/5/20.
 */
/**
 * Created by sks on 2017/5/5.
 */
var CommonWidget = {};
CommonWidget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        files:"",
        fileName:"",
        fileNum:"",
        result:"",
        titleResult:[],
        firstLine:[],
    },
    _rebuildUiDefaults: function (options) {
        CommonWidget._UIDEFAULFS = Iptools.Tool._extend(CommonWidget._UIDEFAULFS, options);
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
        CommonWidget._goToImportList(); //点击第一部的取消按钮返回到列表页面
        CommonWidget._clickImportFile();  //点击上传文件
        CommonWidget._drop();  //拖拽上传
        CommonWidget._dragover(); //拖拽的阻止事件
        CommonWidget._dragenter(); //拖拽的阻止事件
        CommonWidget._clickSelect();  //点击select框的时候，防止事件冒泡
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        CommonWidget._bindingDomEvent();

    },
    //点击取消按钮，返回到导入列表页面
    _goToImportList:function(){
        widget._addEventListener({
            container:"body",
            type: "click",
            target:".step button.cancel",
            event:function(){
                window.location.href  = "../"
            }
        })
    },
    //文件上传之后，框内样式改变
    _afterImportFile:function(){
        $(".step1 .button button.next").attr("disabled",false);
        $(".step1 .button button.next").removeClass("disableBtn").addClass("commonBtn");
    },
    //点击上传文件
    _clickImportFile:function(){
        $(".importIcon span.chooseFile")[0].addEventListener('change', function(e){
            CommonWidget._UIDEFAULFS.files = $(this).find("input")[0].files[0];
            var files = e.target.files;
            $("p.importIcon").addClass("next");
            $("p br").css("display","none");
            $("p span.line2").css("display","none");
            $("p span.line1").css("padding-right","10px");
            $("p span.again").html("重新选择");
            $(".step .uploadFile").css("border-color","#09f");
            $("p span.line1").html(files[0].name);
            CommonWidget._afterImportFile();
            CommonWidget._UIDEFAULFS.fileName = files[0].name;
            var i,f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    CommonWidget._UIDEFAULFS.fileNum = 0;
                    CommonWidget._UIDEFAULFS.result = {};
                    var result = [];
                    workbook.SheetNames.forEach(function (sheetName) {
                        if(sheetName == workbook.SheetNames[0]){
                            var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            if (roa.length > 0) {
                                CommonWidget._UIDEFAULFS.result[sheetName] = roa;
                                CommonWidget._UIDEFAULFS.fileNum = Number(CommonWidget._UIDEFAULFS.fileNum)+Number(CommonWidget._UIDEFAULFS.result[sheetName].length);
                            };
                            if (csv.length > 0) {
                                result.push("SHEET: " + sheetName);
                                result.push("");
                                result.push(csv);
                            };
                            return result.join("\n");
                        };
                    });
                    /* DO SOMETHING WITH workbook HERE */
                    CommonWidget._UIDEFAULFS.titleResult = result[2].split("\n")[0].split(",");
                    CommonWidget._UIDEFAULFS.firstLine = result[2].split("\n")[1].split(",");

                };
                reader.readAsBinaryString(f);
            }
            $(".importIcon input.importFile").val("");
        }, false);
    },
    //拖拽事件，停止拖拽
    _drop:function(){
        $("section")[0].addEventListener('drop', function(e){
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;
            CommonWidget._UIDEFAULFS.files = files[0];
            var f = files[0];
            $("p.importIcon").addClass("next");
            $("p br").css("display","none");
            $("p span.line2").css("display","none");
            $("p span.line1").css("padding-right","10px");
            $("p span.again").html("重新选择");
            $(".step .uploadFile").css("border-color","#09f");
            CommonWidget._afterImportFile();
            $(".step1 span.line1").html(f.name);
            CommonWidget._UIDEFAULFS.fileName = f.name;
            var i,f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function(e) {
                    var data = e.target.result;
                    /* if binary string, read with type 'binary' */
                    var workbook = XLSX.read(data, {type: 'binary'});
                    CommonWidget._UIDEFAULFS.fileNum = 0;
                    CommonWidget._UIDEFAULFS.result = {};
                    var result = [];
                    workbook.SheetNames.forEach(function (sheetName) {
                        if(sheetName == workbook.SheetNames[0]){
                            var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            if (roa.length > 0) {
                                CommonWidget._UIDEFAULFS.result[sheetName] = roa;
                                CommonWidget._UIDEFAULFS.fileNum = Number(CommonWidget._UIDEFAULFS.fileNum)+Number(CommonWidget._UIDEFAULFS.result[sheetName].length);
                            };
                            if (csv.length > 0) {
                                result.push("SHEET: " + sheetName);
                                result.push("");
                                result.push(csv);
                            };
                            return result.join("\n");
                        };
                    });
                    /* DO SOMETHING WITH workbook HERE */
                    CommonWidget._UIDEFAULFS.titleResult = result[2].split("\n")[0].split(",");
                    CommonWidget._UIDEFAULFS.firstLine = result[2].split("\n")[1].split(",");
                };
                reader.readAsBinaryString(f);
            }
            $(".importIcon input.importFile").val("");
        }, false);
    },
    //拖拽进入
    _dragenter:function(){
        $("section")[0].addEventListener('dragenter', function(e){
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }, false);
    },
    //移动拖拽
    _dragover:function(){
        $("section")[0].addEventListener('dragover', function(e){
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }, false);
    },
    //第三步的匹配相关代码
    //自动匹配
    _autoMatching:function(){
        for(var i = 0; i<$("tbody tr").length;i++){
            var title = $("tbody tr:nth-child("+(i+1)+")");
            var select = $("tbody tr:nth-child("+(i+1)+") select option");
            for(var j = 0;j<$(select).length;j++){
                var selected = $("tbody tr:nth-child("+(i+1)+") select option:nth-child("+(j+1)+")");
                var checked = $("tbody tr:nth-child("+(i+1)+") td label input");
                if($(title).find("span").html() == $(selected).text()){
                    $(selected).attr("selected","selected");
                    var dataUUid = $(selected).val();
                    var dataText = $(selected).text();
                    $(checked).attr({
                        "disabled":false,
                        "data-value":"checked",
                        "data-id":dataUUid,
                        "data-text":dataText
                    }).prop("checked",true);
                    widget._imporBtnActived();
                    CommonWidget._allSelected();
                }
            }
        }
    },
    //所有的复选框选中之后，上面的第一也复选框作为全选也选中
    _allSelected:function(){
        var selectedNeedArray = [];
        for(var i = 0; i < $(".step3 tbody input").length;i++){
            var selectedDom = $(".step3 tbody input")[i];
            if($(selectedDom).attr("data-value") == "checked"){
                selectedNeedArray.push($(selectedDom).attr("data-value"));
                if(selectedNeedArray.length ==  $(".step3 tbody input").length){
                    $('.step3 thead tr th:first-child input').attr("disabled",false).prop("checked",true);
                    widget._allChecked();
                }else if(selectedNeedArray.length <  $(".step3 tbody input").length){
                    $('.step3 thead tr th:first-child input').attr("disabled",true).prop("checked",false);
                }
            }else if($(selectedDom).attr("data-value") != "checked"){
                $('.step3 thead tr th:first-child input').attr("disabled",true).prop("checked",false);
            }
        };
    },
    //点击select框的时候，放置事件冒泡
    _clickSelect:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".step3 select",
            event:function(event){
                event.stopPropagation();
            }
        })
    },
}