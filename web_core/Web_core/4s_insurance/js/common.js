/**
 * Created by sks on 2017/5/12.
 */
/*搜索全部客户的代码*/
var Comwidget = {};
Comwidget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        listPageSize: 5,
        liLength:"",
        employListApplet:"",
        employListRootId:"",
        allConPageSize:10,
        haveSelectedContact:[],
    },
    _rebuildUiDefaults: function (options) {
        Comwidget._UIDEFAULFS = Iptools.Tool._extend(Comwidget._UIDEFAULFS, options);
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
        Comwidget._focusConSearch();
        Comwidget._contactMultiSearch();
        Comwidget._clickSelectDemoLi();
        Comwidget._clickSelectDemoLi1();
        //Comwidget._blusInput();
    },
    _bindingEventAfterLoad: function () {

    },
    _init: function () {
        Comwidget._bindingDomEvent();
        Comwidget._getContactApplet();
        Comwidget._getAllConListData();
    },
    //获取applet
    _getContactApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'employee_list'"
        }).done(function(r) {
            Comwidget._UIDEFAULFS.employListApplet = r.applets[0].applet;//2866
            Iptools.uidataTool._getApplet({
                applet:r.applets[0].applet
            }).done(function(data) {
                Comwidget._UIDEFAULFS.employListRootId = data.rootLink;//39
            });
        });
    },
    //搜索所有的客户
    _getAllConListData: function(param,container){
        Iptools.uidataTool._getUserlistAppletData({
            appletId: Comwidget._UIDEFAULFS.employListApplet,
            condition:param,
        }).done(function(s) {
            $(container).html("");
            if (s && s.data && s.data.records) {
                $.each(s.data.records, function (key, obj) {
                    var RootId = Comwidget._UIDEFAULFS.employListRootId;
                    var name = obj[RootId + ':name'] ? obj[RootId + ':name'] : "";
                    var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
                    var html = '<li role="presentation" class="demoLi">'+
                        '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '" data-name="'+ obj[RootId + ':name'] + '">' + name+'-' + phone +'</a>'+
                        '</li>';
                    $(container).append(html);
                });
            }else{
                var html ='<li role="presentation" class="disabled"><a role="menuitem" tabindex="-1" class="hint-link">请输入正确关键字...</a> </li>';
                $(container).append(html);
            }
        })
    },
    //聚焦搜索的框
    _focusConSearch: function(){
        Comwidget._addEventListener({
            container: "body",
            target: ".input-group #issuer",
            type: "click",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                $("#chudan .input-group-btn.issuer").addClass("open");
                $("#chudan button.issuer").attr("aria-expanded", "true");
                $("#zeren .input-group-btn.owner").removeClass("open");
                $("#zeren button.owner").attr("aria-expanded", "false");
            }
        });
        Comwidget._addEventListener({
            container: "body",
            target: ".input-group #owner",
            type: "click",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                $("#zeren .input-group-btn.owner").addClass("open");
                $("#zeren button.owner").attr("aria-expanded", "true");
                $("#chudan .input-group-btn.issuer").removeClass("open");
                $("#chudan button.issuer").attr("aria-expanded", "false");
            }
        });
    },
    //条件搜索
    _contactMultiSearch: function(){
        Comwidget._addEventListener({
            container: "body",
            target: ".input-group #owner,.input-group #issuer",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = Comwidget._UIDEFAULFS.employListRootId;
                var conditionq = "";
                if(!isNaN(inputText) && inputText.length>2){//是数字搜索电话否则搜索名字
                    conditionq = '{"'+rootId +':phone":" like \'%'+inputText+'%\'"}';
                }else{
                    conditionq = '{"'+rootId+':name":" like \'%'+inputText+'%\'"}';
                };
                Comwidget._getAllConListData(conditionq,$(this).parent().find("ul")
                );
                return false;
            }
        });
    },
    //选择搜索出来的客户
    _clickSelectDemoLi: function(){
        Comwidget._addEventListener({
            container: "body",
            target: "ul.conListBySearch .demoLi",
            type: "click",
            event: function () {
                var me=$(this);
                $('#issuer').val(me.find('a').attr("data-name"));
                $('#issuer').attr("data-id",me.find('a').attr("data-id"));
                $('#issuer').attr("data-name",me.find('a').attr("data-name"));
                $("#new-insurance").data("bootstrapValidator").updateStatus($("input#issuer").attr("name"), "NOT_VALIDATED").validateField($("input#issuer").attr("name"));
            }
        });
    },
    _clickSelectDemoLi1: function(){
        Comwidget._addEventListener({
            container: "body",
            target: "ul.ownerBySearch .demoLi",
            type: "click",
            event: function () {
                var me=$(this);
                $('#owner').val(me.find('a').attr("data-name"));
                $('#owner').attr("data-id",me.find('a').attr("data-id"));
                $('#owner').attr("data-name",me.find('a').attr("data-name"));
                $("#new-insurance").data("bootstrapValidator").updateStatus($("input#owner").attr("name"), "NOT_VALIDATED").validateField($("input#owner").attr("name"));
            }
        });
    },
    //责任人和出单人默认显示登录人名字
    _showOwner:function(){
        Iptools.GetJson({
            url: "basic/getEmployee",
            data: {
                token: Iptools.DEFAULTS.token,
                id:Iptools.getDefaults({ key: "selectUser" })
            },
        }).done(function (r) {
            if(r && r.employee){
                $("#new-insurance #owner").val(r["employee"].name);
                $("#new-insurance #owner").attr("data-name", r["employee"].name);
                $("#new-insurance #issuer").val(r["employee"].name);
                $("#new-insurance #issuer").attr("data-name", r["employee"].name);
                $("#new-insurance").data("bootstrapValidator").updateStatus($("input#owner").attr("name"), "NOT_VALIDATED").validateField($("input#owner").attr("name"));
                $("#new-insurance").data("bootstrapValidator").updateStatus($("input#issuer").attr("name"), "NOT_VALIDATED").validateField($("input#issuer").attr("name"));
            }
        })
    },
}