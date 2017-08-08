/**
 * Created by sks on 2017/7/4.
 */

/**
 * Created by sks on 2017/5/5.
 */
var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        insuranceListApplet:"",
        insuranceListRootId:"",
        insuranceDetailApplet:"",
        dealsDetailInsuranceApplet:"",
        dealsDetailInsuranceRootId:"",
        insuranceId:"",
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

    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = (d.getMonth()+1) > 9 ? (d.getMonth()+1) : "0"+(d.getMonth()+1)
        var str = year+"-"+month+"-"+d.getDate();
        //console.log(str)
        $("#order-time").val(str);
        widget._getInsuranceList();
        widget._bindingDomEvent();
    },
    //获取交易列表的list页面
    _getInsuranceList:function(con){
        Iptools.Tool._pushListen("insurance_list", function (ms) {
            if(ms.channel == "insurance_list"){
                widget._getInsuranceList();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'insurance_list'"
        }).done(function(data){
            widget._UIDEFAULFS.insuranceListApplet = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:widget._UIDEFAULFS.insuranceListApplet
            }).done(function(r){
                widget._UIDEFAULFS.insuranceListRootId = r.rootLink;
                component._table("#insurance-list", {
                    applet: data.applets[0].applet,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "没有保险数据",
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    emptyClick: function () {

                    },
                    jumpType: "template",
                    jumpTemplate: "<a class='edit-insurance' title='编辑保险'><span class='fa fa-pencil-square-o'></span></a>",
                    //点击自己配置的按钮后的事件
                    events: [
                        {
                            target: ".s-header-bar .s-manage .new-insura",
                            type: "click",
                            event: function () {//widget._getInsuranceDetail();
                                insurance._formReset();
                                $("#new-insurance .blueCheckbox").removeAttr("checked");
                                $("#new-insurance .type-dis").attr("disabled","true");
                                $("#insurance-edit").modal("show");
                                $("#insurance-edit .commonBtn").addClass("save-new-insurance");
                                Comwidget._showOwner();
                            }
                        },
                        {
                            target: ".s-header-bar .s-manage .to-cule",
                            type: "click",
                            event: function () {
                                var index = $("#insurance-list").data("stable")._getCheckIndex();
                                var data = $("#insurance-list").data("stable").options.data;
                                var insuranceforCuleArray = [];
                                var insuranceforCarArr = [];
                                for(var i = 0;i<index.length;i++){
                                    var insuranceId = data.records[index[i]];
                                    var insuranceListId = insuranceId[widget._UIDEFAULFS.insuranceListRootId+":id"];
                                    var carIdArr="";
                                    if(insuranceId[widget._UIDEFAULFS.insuranceListRootId+":car_id"]){
                                        carIdArr = insuranceId[widget._UIDEFAULFS.insuranceListRootId+":car_id"].id
                                    }
                                    var carJson = {
                                        carID:carIdArr,
                                        title:insuranceId[widget._UIDEFAULFS.insuranceListRootId+":plate_number"]+"&"+insuranceId[widget._UIDEFAULFS.insuranceListRootId+":type"]
                                    }
                                    insuranceforCuleArray.push(insuranceListId);
                                    insuranceforCarArr.push(carJson)
                                }
                                Iptools.uidataTool._getCustomizeApplet({
                                    async:false,
                                    nameList: "'deals_detail_insurance'"
                                }).done(function(data) {
                                    widget._UIDEFAULFS.dealsDetailInsuranceApplet = data.applets[0].applet;
                                    var a = component._unit("#create-cule", {
                                        applet: widget._UIDEFAULFS.dealsDetailInsuranceApplet,
                                        mode:'new',
                                        type:"modal",
                                        modal:{
                                            title:"生成线索",
                                            onSave:function(){
                                                var personId = a.data("unit").options.DataCurrentSets["deal:responsible_person"];
                                                widget._insuranceTodeals(personId,insuranceforCuleArray);
                                                $("#"+a.data("unit").options.modal.id).modal("hide");
                                            }
                                        },
                                    });
                                })
                            }
                        },
                        {
                            target: ".edit-insurance",
                            type: "click",
                            event: function () {
                                insurance._checkForm();
                                var me = $(this);
                                widget._UIDEFAULFS.insuranceId = me.parent().data("key");
                                var id = Number(widget._UIDEFAULFS.insuranceId);
                                insurance._editInsuranceDetail(id);
                                $("#insurance-edit").modal("show");
                                $("#insurance-edit .commonBtn").addClass("edit-new-insurance");
                            }
                        },
                    ],
                    dataModify: null,
                    mainSecOnshow:function(){
                        $("#insurance-list").data("stable").options.condition={};
                        $("#insurance-list").data("stable")._refresh();
                    },
                    multiPanel: false,
                    panels: [
                        {
                            name: "本月到期",
                            type:"button",
                            icon: "fa-th",
                            onShow: function () {
                                $("#insurance-list").data("stable").options.condition={
                                    'insurance:insurance_end_date':"like \'%"+(new Date()).format("-MM-")+"%\'"
                                };
                                $("#insurance-list").data("stable")._refresh();
                            }
                        }
                    ],
                    searchEvent: function (condition) {
                        if (condition) {
                            $("#test_panel").append(JSON.stringify(condition) + "<br/>");
                        }
                    }
                })
            })
        })
    },
    //批量生成线索
    /*
     ** id:指的负责人id
     ** array:保险id的数组
     * */
    _insuranceTodeals:function(id,arry){
        Iptools.PostJson({
            url: "4s/batchGenerateDeal",
            data: {
                token: Iptools.DEFAULTS.token,
                responsiblePerson:id,
                insuranceIds:arry.join(),
                dealType:1
            }
        }).done(function (r) {
            if(r && r.retcode == "ok"){
                Iptools.Tool.pAlert({
                    type: "info",
                    title: "系统提示：",
                    content: "批量生成线索成功",
                    delay: 1000
                });
                //var dealArr = r.dealIds;
                //InsuTrace._createDealsTrace(carArry,dealArr)
                Iptools.uidataTool._pushMessage({
                    channel: "deals_list"
                });
            }
        });
    },
}