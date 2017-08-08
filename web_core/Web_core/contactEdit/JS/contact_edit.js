
var widget = {};
widget = {
    _UIDEFAULFS: {
        conId : "",
        contactApplet: "",
        contactRoot : "",
        allConApplet : "",
        allConRoot : "",
        groupApplet : "",
        groupRoot : "",
        groupLinkApplet : "",
        groupLinkRoot : "",
        oldGroup : [],
        hasConMultiOption : [],
        addNewArray : [],
        currentTagWrap : [],
        currentTagValue:[],
        currentTagObj : [],
        oldDataArray:[],
        oldOwner:{},
        oldAgent:{},
        oldInsurance:{}

    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//监听事件
        widget._clickCreateTag();
        widget._addPhone();
        widget._removePhone();
        widget._onInputforSearch();
//        widget._clickhasTagsFocus();//点击已有的客户标签块就聚焦
    },
    _bindingEventAfterLoad: function () {//初始化插件
        widget._enableMultSel();
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._UIDEFAULFS.conId = Iptools.DEFAULTS.currentViewValue;
        //铺设编辑页面
        widget._getContactApplet();
        //拿到客户所带的标签
        widget._getConTags();
        //获得客户群和客户link的applet
        widget._getGroupLinkConApplet();
        //获得客户群applet并展示相关
        widget._getGroupApplet();
        //拿到‘所有客户’applet---手机号去重
        widget._getAllConListApplet();
    },
    _delFromGroup: function(delArray){
        var promise= $.Deferred();
        if(delArray.length > 0){
            Iptools.PostJson({
                url: "basic/delContactFromGroup",
                data: {
                    token: Iptools.DEFAULTS.token,
                    contactgroupIds: delArray.join(),
                    contactIds: widget._UIDEFAULFS.conId
                }
            }).done(function (data) {
//                $.each(delArray,function(k,o){
//                    trace._delToGroupTrace(Iptools.DEFAULTS.userId,$('#example-getting-started option[value="' + o + '"]').text(), widget._UIDEFAULFS.conId);//客户方
//                });
                promise.resolve();
            }).fail(function(){
                promise.reject();
            });
        }else{
            promise.resolve();
        }
        return promise;
    },
    _addFromGroup: function(addArray){
        var promise= $.Deferred();
        if(addArray.length > 0){
            Iptools.PostJson({
                url: "basic/linkContactgroup",
                data: {
                    token: Iptools.DEFAULTS.token,
                    contactgroupId: addArray.join(),
                    contactIds: widget._UIDEFAULFS.conId
                }
            }).done(function (data) {
                Iptools.uidataTool._pushMessage({//编辑客户时推送一条通知
                    channel: "contact_edit_"+Iptools.DEFAULTS.currentViewValue
                });
//                $.each(addArray,function(k,o){
//                    var groupName = $('#example-getting-started option[value="' + o + '"]').text();
//                    var groupId = o;
                    //客户添加到客户群的动态
//                    trace._addToGroupTrace(Iptools.DEFAULTS.userId,groupName, widget._UIDEFAULFS.conId, groupId);//客户方
//                });
                promise.resolve();
            }).fail(function(){
                promise.reject();
            });
        }else{
            promise.resolve();
        }
        return promise;
    },
    _delTag: function(delArray,delTagVal){
        var promise= $.Deferred();
        if(delArray.length > 0){
            Iptools.DeleteJson({
                url:"basic/contactTagLinks?token="+ Iptools.DEFAULTS.token + '&ids=' +delArray.join()
            }).done(function(data){
                if(data.retcode == 'ok'){
                    $.each(delTagVal,function(ke,ob){
//                        trace._deleteTagTrace(Iptools.DEFAULTS.userId,ob,Iptools.DEFAULTS.currentViewValue);
                        Iptools.uidataTool._pushMessage({//编辑客户时推送一条通知
                            channel: "contact_edit_tag"+Iptools.DEFAULTS.currentViewValue
                        });
                    });
                    promise.resolve();
                };
            }).fail(function(){
                promise.reject();
            });
        }else{
            promise.resolve();
        };
        return promise;
    },
    _addTag: function(addArray){
        var promise= $.Deferred();
        if(addArray.length > 0){
            Iptools.PostJson({
                url:"basic/tags",
                data:{
                    token:Iptools.DEFAULTS.token,
                    tagValues:addArray.join()
                }
            }).done(function(){
                Iptools.PostJson({
                    url:"basic/contactMultiTagLinks",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        contactId:Iptools.DEFAULTS.currentViewValue,
                        tagValues:addArray.join()
                    }
                }).done(function(){
                    $.each(addArray,function(ke,ob){
//                        trace._createTagTrace(Iptools.DEFAULTS.userId,ob,Iptools.DEFAULTS.currentViewValue);
                        Iptools.uidataTool._pushMessage({//编辑客户时推送一条通知
                            channel: "contact_edit_tag"+Iptools.DEFAULTS.currentViewValue
                        });
                    });
                    promise.resolve();
                }).fail(function(){
                    promise.reject();
                });
            });
        }else{
            promise.resolve();
        };
        return promise;
    },
    _beforeSaveCheckPhone: function(){
        var promise= $.Deferred();
        Iptools.uidataTool._getUserlistAppletData({
            appletId:widget._UIDEFAULFS.allConApplet,
            pageNow:1,
            pageSize:1,
            condition:'{"'+widget._UIDEFAULFS.allConRoot+':phone":"='+$('.firstPhone').val()+'"}'
        }).done(function(s) {
            if (s && s.data && s.data.records) {
                Iptools.Tool.pAlert({
                    title: "系统提示",
                    content: "客户已存在"
                });
                promise.reject();
            } else {
                promise.resolve();
            };
        });
        return promise;
    },
    _getContactApplet:function(){
        $('#collapseOne .panel-body .waitDiv').loading();
        $('#collapseTwo .panel-body .waitDiv').loading();
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact'"
        }).done(function(r) {
            widget._UIDEFAULFS.contactApplet = r.applets[0].applet;//2046
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.contactApplet
                }).done(function (s) {
                    var root = s.rootLink;
                    var oldOwner = "";
                    var oldAgent = "";
                    var insurance = "";
                    widget._UIDEFAULFS.contactRoot = root;
                    component._unit("#mainContent", {
                        applet:  widget._UIDEFAULFS.contactApplet,
                        mode: 'edit',
                        sectionMargin:20,
                        valueId: widget._UIDEFAULFS.conId,
                        cusControls: {
                            "4":{
                                controls:[{
                                    size:2,
                                    dom:'#groupList'
                                },
                                    {
                                        size:3,
                                        dom:'#phoneList'
                                    },
                                    {
                                        size:8,
                                        dom:'#tagList'
                                    }
                                ]
                            }
                        },
                        afterLoad:function(r){
                            oldOwner = $('input[name="contact:owner"]').val();
                            oldAgent = $('input[name="contact:assigned_to_agent"]').val();
                            insurance = $('input[name="contact:assigned_to_insurance"]').val();
                            widget._getPhone();
                        },
                        beforeSave:function(r){
                            var promise= $.Deferred();
                            var getData = $("#mainContent").data("unit").options.data;//如果将客户经理等pickapplet改为了空，则在这里将老的客户经理等数据保存下来
                            if(getData[root+':phone2']){
                                if(getData[root+':phone2'] != $('.twoPhone').val()) {r[root + ":phone2"] = $('.twoPhone').val();}
                            }else{
                                if($('.twoPhone').val()){r[root + ":phone2"] = $('.twoPhone').val();}
                            };
                            if(getData[root+':phone3']){
                                if(getData[root+':phone3'] != $('.threePhone').val()) {r[root + ":phone3"] = $('.threePhone').val();}
                            }else{
                                if($('.threePhone').val()){r[root + ":phone3"] = $('.threePhone').val();}
                            };
                            if(getData[root+':phone4']){
                                if(getData[root+':phone4'] != $('.fourPhone').val()) {r[root + ":phone4"] = $('.fourPhone').val();}
                            }else{
                                if($('.fourPhone').val()){r[root + ":phone4"] = $('.fourPhone').val();}
                            };
                            //判断下手机是否存在
                            if($('.firstPhone').val() != getData[root+':phone']){
                                $.when(widget._beforeSaveCheckPhone())
                                    .done(function(){
                                        r[root+":phone"]= $('.firstPhone').val();
                                        promise.resolve(r);
                                    }).fail(function(){
                                        promise.reject();
                                    })
                            }else{
                                promise.resolve(r);
                            }
                            return promise;
                        },
                        afterSave:function(r){
                            //保存时保存标签和客群最好是在对这些元素操作时就对一个数组操作，而不是保存的时候在去判断哪些该post哪些该delete，尽量让保存的操作简洁
                            var promise= $.Deferred();
                            var newObj = $("#mainContent").data("unit").options.DataCurrentSets;//
                            if(newObj){
                                $.each(newObj,function(name, value){
//                                console.log(name);//value是新的改动的值
                                    var oVal = $("#mainContent").data("unit").options.DataOriginalSets[name];
                                    var newVal = value;
                                    if(newVal == ""){
                                        newVal = '空';
                                    }
                                    var oCon = $("#mainContent").data("unit").options.allControls[name];

                                    var editTitle = "";
                                    if(name == 'contact:headpic'){
                                        editTitle += '更新了头像';
                                    }else{
                                        if(oCon.type=="select" && oCon.pickList && oCon.pickList.length){
                                            for(var i=0;i<oCon.pickList.length;i++){
                                                if(oCon.pickList[i].id==value){
                                                    newVal = oCon.pickList[i].name;
                                                }else if(oCon.pickList[i].id==oVal){
                                                    oVal = oCon.pickList[i].name;
                                                }
                                            }
                                        };
                                        if(oCon.type == 'pickApplet' && oCon.pickApplet) {
                                            if(value != ''){
                                                if(name == 'contact:owner'){
                                                    newVal = $('input[name="contact:owner"]').val();
                                                    oVal = oldOwner;
                                                }else if(name == 'contact:assigned_to_agent'){
                                                    newVal = $('input[name="contact:assigned_to_agent"]').val();
                                                    oVal = oldAgent;
                                                }else if(name == 'contact:assigned_to_insurance'){
                                                    newVal = $('input[name="contact:assigned_to_insurance"]').val();
                                                    oVal = insurance;
                                                };
                                            }else{
                                                if(name == 'contact:owner'){
                                                    oVal = oldOwner;
                                                }else if(name == 'contact:assigned_to_agent'){
                                                    oVal = oldAgent;
                                                }else if(name == 'contact:assigned_to_insurance'){
                                                    oVal = insurance;
                                                }
                                            }

                                        }
                                        var label = oCon.name;
                                        if(oVal != ""){
                                            editTitle += '将 '+label + ' 字段由 ' +oVal+  ' 改为了 ' + newVal;
                                        }else{
                                            editTitle += '将 '+label + ' 字段更新为 ' + newVal;
                                        };
                                    }
//                                    trace._editConTrace(Iptools.DEFAULTS.userId,editTitle, Iptools.DEFAULTS.currentViewValue);
                                });
                            };
                            //自定义之-----客户群和标签的更改
                            var changeTagFlag = widget._checkTagChange();
                            var changeGroupFlag = widget._checkGroupChange();
                            var addGroup = [];
                            var delGroup = [];
                            var delTag = [];
                            var delTagVal = [];
                            var addTag = [];
                            if (changeGroupFlag != 1) {//证明客户群改了
                                var groupArr = [];
                                $('#example-getting-started option:selected').each(function () {
                                    groupArr.push(Number($(this).val()));
                                });
                                //客户群的更改分两类情况考虑1：之前有的现在没有做del 2：之前没有的现在有了做post操作
                                $.each(widget._UIDEFAULFS.oldGroup, function (key, obj) {
                                    var indexOld = $.inArray(obj, groupArr);
                                    if (indexOld == -1) {//老的不在新的里面，证明要删除
                                        delGroup.push(Number(obj));
                                    }
                                });

                                $.each(groupArr, function (key, obj) {//obj是新选的客群的id
                                    var index = $.inArray(Number(obj), widget._UIDEFAULFS.oldGroup);
                                    if (index == -1) {//新的不在老的里面----做客户群和客户的添加关联
                                        addGroup.push(Number(obj));
                                    }
                                });
                            };
                            Iptools.uidataTool._pushMessage({//编辑客户时推送一条通知
                                channel: "contact_edit_"+Iptools.DEFAULTS.currentViewValue
                            });
                            if(changeTagFlag != 1){
                                var newTag = [];
                                $('#eventTags li').each(function () {
                                    if($(this).find('span').size() > 0){
                                        newTag.push($(this).find('span').html());
                                    }
                                });
                                //标签的更改分两类情况考虑1：之前有的现在没有做del 2：之前没有的现在有了做post操作
                                $.each(widget._UIDEFAULFS.currentTagObj,function(key,obj){
                                    var index = $.inArray(obj.name,newTag);
                                    if (index == -1) {//老的不在新的里面，证明要删除
                                        delTag.push(obj.id);
                                        delTagVal.push(obj.name);
                                    }
                                });
                                $.each(newTag,function(key,obj){
                                    var index = $.inArray(obj, widget._UIDEFAULFS.currentTagValue);
                                    if (index == -1) {//新的不在老的里面----做客户群和客户的post关联
                                        addTag.push(obj);
                                    }
                                });
                            };
                            //优化后的代码
                            $.when(widget._addFromGroup(addGroup), widget._delFromGroup(delGroup),widget._addTag(addTag),widget._delTag(delTag,delTagVal))
                                .done(function(){
                                    promise.resolve(r);
                                })
                                .fail(function(){
                                    promise.reject();
                                });

                            if(changeTagFlag == 1 && changeGroupFlag == 1){
                                promise.resolve();
                            }
                            return promise;
                        },
                        autoRefresh:true//编辑完后是否刷新
                    });
                });
        });
    },
    _getPhone:function(){
        if($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone']){
            $('.firstPhone').val($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone']);
        };
        if($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone2']){
            $('#phone2').show();
            $('.twoPhone').val($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone2']);
        };
        if($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone3']){
            $('#phone3').show();
            $('.threePhone').val($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone3']);
        };
        if($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone4']){
            $('#phone4').show();
            $('.fourPhone').val($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone4']);
        };
        if($("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone2'] &&
           $("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone3'] &&
           $("#mainContent").data("unit").options.data[widget._UIDEFAULFS.contactRoot+':phone4']){
            $('.addPhone').hide();
        }
    },
    _getAllTags: function(){//铺设客,户可选的标签，即除了选过的都在这里
        Iptools.GetJson({
            url: "basic/tags",
            data: {
                token: Iptools.DEFAULTS.token
            }
        }).done(function(data){
            if(data){
                for(var t = 0;t<data.length;t++){
                    var flag = $.inArray(data[t].tagValue, widget._UIDEFAULFS.currentTagValue);
                    if(flag == -1){//不在里面说明客户还可以选这个标签
                        var html =  '<span class="label label-info"  id="'+data[t].id+'">'+data[t].tagValue+'</span>';
                        $(".allTags").append(html);
                    }
                };
                new IScroll('#wrapper', {
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: 'scale',
                    fadeScrollbars: true
                });
            }
        });
    },
    _getConTags : function(){
        Iptools.GetJson({
            url:"basic/contactTagLinks",
            data:{
                token:Iptools.DEFAULTS.token,
                contactId:Iptools.DEFAULTS.currentViewValue
            }
        }).done(function(data){
            if(data)
                var selTag = [];
            for(var t = 0;t<data.length;t++){
                var obj = {}
                var html = "<li id='"+data[t]['id']+"'>"+data[t].tagValue+"</li>";
                $("#eventTags").append(html);
                widget._UIDEFAULFS.currentTagWrap.push(data[t]['id']);
                selTag.push(data[t].tagValue);
                widget._UIDEFAULFS.currentTagValue = selTag;
                obj.id = data[t]['id'];
                obj.name = data[t].tagValue;
                widget._UIDEFAULFS.currentTagObj.push(obj);
            };
            //拿到所有的标签
            widget._getAllTags();
            $("#eventTags").tagit({
                afterTagRemoved: function(evt, ui) {
                    var span = '<span class="label label-info" id="">'+$("#eventTags").tagit('tagLabel', ui.tag)+'</span>';
                    $('.allTags').prepend(span);
                }
            });
            new IScroll('#hasTags', {
                scrollbars: true,
                mouseWheel: true,
                interactiveScrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true
            });
        })
    },
    _getGroupApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contactgroup List Applet'"
        }).done(function(r){
            if(r){
                var groupApplet = r.applets[0].applet;//4770
                widget._UIDEFAULFS.groupApplet = r.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:groupApplet,
                }).done(function(data){
                    if(data){
                        var groupRootId = data.rootLink;//51
                        widget._UIDEFAULFS.groupRoot = data.rootLink;
                        Iptools.uidataTool._getUserlistAppletData({
                            appletId:groupApplet,
                            pageSize:10
                        }).done(function(s){
                            widget._getConInGroup();//获得客户所在的客户群
                            //初始化input多选框
                            widget._enableMultSel();//稍后补全数据
                            if(s && s.data){
                                var options = [];
                                $.each(s.data.records,function(key,obj){
                                    var index = $.inArray(obj[groupRootId + ':id'],widget._UIDEFAULFS.oldGroup);  //判断当下的客户群在不在之前的
                                    if(index == -1) {
                                        var groupObj = {};
                                        groupObj.label = obj[groupRootId + ':title'];
                                        groupObj.title = obj[groupRootId + ':title'];
                                        groupObj.value = obj[groupRootId + ':id'];
                                        options.push(groupObj);
                                    }
                                });
                                options = options.concat(widget._UIDEFAULFS.hasConMultiOption);
                                $('#example-getting-started').multiselect('dataprovider', options);
                                $(".multiselect-container.dropdown-menu").niceScroll({
                                    cursorborder:"",
                                    cursorcolor:"#c1d6f0",
                                    horizrailenabled:false
                                })
                            }
                        })
                    }
                })
            }
        });
    },
    _getGroupLinkConApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Group Link List Applet'"
        }).done(function(data) {
            if (data) {
                widget._UIDEFAULFS.groupLinkApplet = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: data.applets[0].applet//4771
                }).done(function (data) {
                    if (data) {
                        widget._UIDEFAULFS.groupLinkRoot = data.rootLink;//52
                    }
                })
            }
        });
    },
    _getAllConListApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'contact_list_all'"
        }).done(function(data){
            widget._UIDEFAULFS.allConApplet = data.applets[0].applet;//2866
            Iptools.uidataTool._getApplet({
                applet:data.applets[0].applet
            }).done(function(data){
                widget._UIDEFAULFS.allConRoot = data.rootLink;//39
            })
        })
    },
    _getConInGroup: function(){
        Iptools.uidataTool._getUserlistAppletData({
            appletId:widget._UIDEFAULFS.groupLinkApplet,//4771
            async:false,
            condition:'{"'+widget._UIDEFAULFS.groupLinkRoot+':contactid":"='+ widget._UIDEFAULFS.conId+'","contactlinkgroup:valid_to":" is null"}'
        }).done(function(s){
            if(s){
                var rootId = widget._UIDEFAULFS.groupLinkRoot;
                if(s.data){
                    $.each(s.data.records,function(key,obj){
                        if(obj[rootId+':groupid']){
                            var selObj = {};
                            selObj.label = obj[rootId+':groupid']['name'];
                            selObj.title = obj[rootId+':groupid']['name'];
                            selObj.value = obj[rootId+':groupid']['id'];
                            selObj.selected = true;
                            widget._UIDEFAULFS.hasConMultiOption.push(selObj);//保存之前客户所在客群的obj信息
                            widget._UIDEFAULFS.oldGroup.push(obj[rootId+':groupid']['id']);//保存之前客户所在客群的id
                        }
                    });
                };
            }
        });
    },
    _enableMultSel:function(){
        $('#example-getting-started').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            nonSelectedText:"未选择",
            onChange: function(option, checked) {
                if (checked) {
                    var selObj = {};
                    selObj.label = $(option).html()
                    selObj.title = $(option).html()
                    selObj.value = Number($(option).val());
                    selObj.selected = true;
                    widget._UIDEFAULFS.hasConMultiOption.push(selObj);
                    widget._UIDEFAULFS.addNewArray.push(Number($(option).val()));
                }else{
                }
            },
            buttonText: function(options) {
                if (options.length === 0) {
                    return '请选择';
                }
                else if (options.length > 2) {
                    return options.length + ' 已选择';
                }
                else {
                    var selected = [];
                    options.each(function() {
                        selected.push([$(this).text(), $(this).data('order')]);
                    });
                    selected.sort(function(a, b) {
                        return a[1] - b[1];
                    });
                    var text = '';
                    for (var i = 0; i < selected.length; i++) {
                        text += selected[i][0] + ', ';
                    }
                    return text.substr(0, text.length -2);
                }
            }
        });
    },
    _checkTagChange: function(){
        var count = 1;
        if($('#eventTags li.tagit-choice').size() == widget._UIDEFAULFS.currentTagWrap.length){//长度不相等，肯定与之前不同了
            $('#eventTags li.tagit-choice').each(function(){
                var index = $.inArray(Number($(this).attr('id')),widget._UIDEFAULFS.currentTagWrap);  //判断当下的标签在不在之前的所选标签里
                if(index == -1){//有不在的就证明跟之前不同了
                    count++;
                }
            });
        }else{
            count = 2;
        }
        return count;
    },
    _checkGroupChange: function(){
        var count = 1;
        if( $('#example-getting-started option:selected').size() == widget._UIDEFAULFS.oldGroup.length){
            $('#example-getting-started option:selected').each(function() {
                var index = $.inArray(Number($(this).val()),widget._UIDEFAULFS.oldGroup);  //判断当下的客户群在不在之前的
                if(index == -1){//新的不在老的里面----做客户群和客户的post关联
                    count++;
                }
            });
        }else{//长度都不同肯定变化了
            count = 2;
        };
        return count;
    },




//  ----------------------------------------------------  监听事件----------------------------------------------------------------------

    _clickCreateTag: function(){
        widget._addEventListener({
            container: "body",
            target: ".allTags .label-info",
            type: "click",
            event: function () {
                var textBottom = $(this).html();
                $("#eventTags").tagit('createTag',textBottom);
                $(this).remove();
            }
        })
    },
    _addPhone: function(){
        widget._addEventListener({
            container: "body",
            target: ".addPhone",
            type: "click",
            event: function () {
                if($('#phone2').is(':visible')){
                    if($('#phone3').is(':visible')){
                        $('#phone4').show();
                        $('#phone4 input').show();
                        $('.delPhone4').show();
                        //加号按钮消失
                        if($('#phone2').is(':visible') && $('#phone3').is(':visible')){
                            $('.addPhone').hide();
                        }
                    }else{
                        $('#phone3').show();
                        $('#phone3 input').show();
                        $('.delPhone3').show();
                        if($('#phone2').is(':visible') && $('#phone4').is(':visible')){
                            $('.addPhone').hide();
                        }
                    }
                }else{
                    $('#phone2').show();
                    $('#phone2 input').show();
                    $('.delPhone2').show();
                    if($('#phone3').is(':visible') && $('#phone4').is(':visible')){
                        $('.addPhone').hide();
                    }
                }
            }
        })
    },
    _removePhone: function(){
        widget._addEventListener({
            container: "body",
            target: ".delPhone2,.delPhone3,.delPhone4",
            type: "click",
            event: function () {
                $('.addPhone').show();
                if($(this).attr('class') == 'delPhone2'){
                    $('#phone2 .form-group input').val('');
                    $('#phone2').hide();
                }else if($(this).attr('class') == 'delPhone3'){
                    $('#phone3 .form-group input').val('');
                    $('#phone3').hide();
                }else{
                    $('#phone4 .form-group input').val('');
                    $('#phone4').hide();
                };
                $(this).hide();
            }
        })
    },
    _onInputforSearch:function(){
        widget._addEventListener({
            container: "body",
            target: ".multiselect-filter .input-group .multiselect-search",
            type: "input",
            event: function (e) {
                var inputText = $('.input-group .multiselect-search').val();
                var condition = '{"'+widget._UIDEFAULFS.groupRoot+':title":" like \'%'+inputText+'%\'"}';

                Iptools.uidataTool._getUserlistAppletData({
                    appletId:widget._UIDEFAULFS.groupApplet,
                    pageSize:10,
                    condition:condition
                }).done(function(s){//拿着condition找到所搜的数据
//                    initMult();//稍后补全数据
                    if(s){
                        var options = [];
                        if(s&& s.data&& s.data.records&& s.data.records.length) {
//                            conInGroup();//找到所选的客户群
                            $.each(s.data.records, function (key, obj) {
//                                判断新的搜索结果在不在已选的客群里，在的话就不显示了
                                var index = $.inArray(obj[widget._UIDEFAULFS.groupRoot + ':id'],widget._UIDEFAULFS.oldGroup);  //判断当下的客户群在不在之前的
                                var index_new = $.inArray(obj[widget._UIDEFAULFS.groupRoot + ':id'],widget._UIDEFAULFS.addNewArray); //在不在新选的里面
                                if(index == -1){//新的不在老的里面----做客户群和客户的post关联
                                    if(index_new == -1){
                                        var groupObj = {};
                                        groupObj.label = obj[widget._UIDEFAULFS.groupRoot + ':title'];
                                        groupObj.title = obj[widget._UIDEFAULFS.groupRoot + ':title'];
                                        groupObj.value = obj[widget._UIDEFAULFS.groupRoot + ':id'];
                                        options.push(groupObj);
                                    }

                                }
                            });
                            options = options.concat(widget._UIDEFAULFS.hasConMultiOption);
//                            console.log(options)
//                            $('#example-getting-started').multiselect('rebuild');
                            $('#example-getting-started').multiselect('dataprovider', options);

                            $('.input-group .multiselect-search').val(inputText);
                            $('.input-group .multiselect-search').focus();
                        };
                        return false;
                    }
                    return false;
                })
                return false;
            }
        });
    },
//    _clickhasTagsFocus: function(){
//        widget._addEventListener({
//            container: "body",
//            target: "#hasTags",
//            type: "click",
//            event: function (e) {
//                var me = $(this);
//                me.find('#eventTags .tagit-new input').focus();
//            }
//        });
//    }
}