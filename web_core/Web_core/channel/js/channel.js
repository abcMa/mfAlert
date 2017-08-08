/**
 * Created by 1 on 2017/4/9.
 */
var channelWidget = {};
channelWidget = {
    _UIDEFAULFS: {
        customSource: ".customSource",
        enterInput: ".enterInput",
        importsInput: ".importsInput",
        importsInputTwo: ".importsInputTwo",
        weekIcon: ".weekIcon",
        mouthIcon: ".mouthIcon",
        yearIcon: ".yearIcon",
        newlyIcon: ".newlyIcon",
        openLink: ".openLink",
        link: false
    },
    _rebuildUiDefaults: function (options) {
        channelWidget._UIDEFAULFS = Iptools.Tool._extend(channelWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        channelWidget._courceData();//导入记录和客户来源切换样式改变
        channelWidget._dropDownList();//导入记录左边框点击部分显示隐藏和全部显示隐藏
        channelWidget._switchSourceInput();//客户源概况页面输入框获得焦点和失去焦点样式改变
        channelWidget._switchImportInput();//导入记录输入框获得焦点和失去焦点样式改变
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        channelWidget._settableDatas(1);//table数据铺设
        channelWidget._bindingDomEvent();//事件函数
        channelWidget._bindingEventAfterLoad();//初始化插件后触发的函数事件
    },
    _switchSourceInput: function(){
        channelWidget._addEventListener({
            container: "body",
            target: channelWidget._UIDEFAULFS.customSource,
            type:" focus",
            event: function () {
                $(".baceIcon").hide();
                $(".customSource").attr("placeholder","").css("padding-left","10px");
                $(".enter").show();
            }
        });
        channelWidget._addEventListener({
            container: "body",
            target: channelWidget._UIDEFAULFS.customSource,
            type: "blur",
            event: function () {
                $(".baceIcon").show();
                $(".customSource").attr("placeholder","搜索你想要输入的客户数据源").css("padding-left","25px");
                $(".enter").hide();
            }
        });
    },
    _switchImportInput: function () {
        channelWidget._addEventListener({
            container: "body",
            target: channelWidget._UIDEFAULFS.importsInput,
            type: "focus",
            event: function () {
                $(".baceIcons").hide();
                $(".importsInput").attr("placeholder","");
                $(".importsInput").css("padding-left","10px");
                $(".enters").show();
            }
        });
        channelWidget._addEventListener({
            container: "body",
            target: channelWidget._UIDEFAULFS.importsInput,
            type: "blur",
            event: function () {
                $(".baceIcons").show();
                $(".importsInput").attr("placeholder","搜索");
                $(".importsInput").css("padding-left","25px");
                $(".enters").hide();
            }
        });
    },
    _courceData: function () {
        $(function(){
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var activeTab = $(e.target).text();
                if(activeTab == "导入记录"){
                    $(".headerOne").hide();
                    $(".headerTwo").show();
                    $(".dataSource").hide();
                    $(".importData").show();
                }else{
                    $(".headerOne").show();
                    $(".headerTwo").hide();
                    $(".dataSource").show();
                    $(".importData").hide();
                }
            });
        });
    },
    _dropDownList: function () {
        channelWidget._addEventListener({
            container: "body",
            target: ".importDateTerm",
            type: "click",
            event: function () {
                $(this).next().show();
                $(this).hide();
            }
        });
        channelWidget._addEventListener({
            container: "body",
            target: ".importTitle",
            type: "click",
            event: function () {
                $(this).parent().hide();
                $(this).parent().prev().show();
            }
        });
        channelWidget._addEventListener({
            container: "body",
            target: channelWidget._UIDEFAULFS.openLink,
            type: "click",
            event: function () {
                if(channelWidget._UIDEFAULFS.link == false){
                    $(".week").show();
                    $(".importWeek").hide();
                    $(".importnewly").hide();
                    $(".newly").show();
                    $(".importMouth").hide();
                    $(".mouth").show();
                    $(".importYear").hide();
                    $(".year").show();
                    $(".openLink").html("隐藏全部");
                    channelWidget._UIDEFAULFS.link = true;
                }else{
                    $(".week").hide();
                    $(".importWeek").show();
                    $(".importnewly").hide();
                    $(".newly").show();
                    $(".importMouth").show();
                    $(".mouth").hide();
                    $(".importYear").show();
                    $(".year").hide();
                    $(".openLink").html("展开全部");
                    channelWidget._UIDEFAULFS.link = false;
                }
            }
        });
    },
    _settableDatas: function (data) {
        component._pager({
            container: "dataPager",//ID选择器
            pageSize: 8,
            pageCount: 8,
            rowCount: 60,
            pageNow: data,
            jump: function (page) {
                channelWidget._settableDatas(page);
            }
        });
    }
};