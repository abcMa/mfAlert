Iptools.Start();
var widget = {};
widget = {
    _UIDEFAULFS: {
        newConApplet : "",//contact---applet
        contactRoot:"",
        groupApplet : "",
        groupRootId: "",
        newConMultiOption : [], //保存当下选择项的每个obj的信息
        currSelGroup : [], //保存当下选择项id的信息
        allConApplet: "",
        allConRoot: ""
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定各种监听事件
        widget._onInputforSearch();//聚焦在客户群的搜索input框上
        widget._createTags();
        widget._addPhone();//点击增加电话
        widget._removePhone();//移除电话
        widget._clickTagFocus();
    },
    _bindingEventAfterLoad: function () {
        widget._initMultiselect();
        widget._initIscroll();
        widget._initTag();
    },
    _init: function () {
        widget._bindingDomEvent();
        //获取客户的applet并铺设新建页面
        widget._getContactApplet();
        //获取客户群的applet。拿到客户群list并初始化插件multiselect
        widget._getGroupList();
        //获得所有的标签
        widget._getAllTags();
        widget._initTag();
        //拿到‘所有客户’的applet ---做手机号去重来用
        widget._getAllConListApplet();
    },
    _aggTagForNewContact: function(tagArray,id){
        var promise = $.Deferred();
        if(tagArray.length > 0){
            Iptools.PostJson({
                url:"basic/tags",
                data:{
                    token:Iptools.DEFAULTS.token,
                    tagValues:tagArray.join()
                }
            }).done(function() {
                Iptools.PostJson({
                    url: "basic/contactMultiTagLinks",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        contactId: id,
                        tagValues: tagArray.join()
                    }
                }).done(function(){
                    promise.resolve();
                }).fail(function(){
                    promise.reject();
                })
            });
        }else{
            promise.resolve();
        }
        return promise;
    },
    _addGroupForNewContact: function(groupArray,id){
        var promise = $.Deferred();
        if(groupArray.length > 0){
            Iptools.PostJson({
                url:"basic/linkContactgroup",
                data:{
                    token:Iptools.DEFAULTS.token,
                    contactgroupId: groupArray.join(),
                    contactIds:id
                }
            }).done(function(data){
//                $.each(groupArray,function(k,o){
//                    var groupName = $('#example-getting-started option[value="' + o + '"]').text();
//                    var groupId = o;
//                    //客户添加到客户群的动态
//                    trace._addToGroupTrace(Iptools.DEFAULTS.userId,groupName, id, groupId);//客户方
//                });
                promise.resolve();
            }).fail(function(){
                promise.reject();
            })
        }else{
            promise.resolve();
        };
        return promise;
    },
    _getContactApplet: function() {
        $('#collapseOne .panel-body .waitDiv').loading();
        $('#collapseTwo .panel-body .waitDiv').loading();
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact'"
        }).done(function(r){
            if(r){
                widget._UIDEFAULFS.newConApplet = r.applets[0].applet;//2046
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.newConApplet
                }).done(function (s) {
                    var root = s.rootLink;
                    widget._UIDEFAULFS.contactRoot = root;
                    component._unit("#mainContent", {
                        applet:  widget._UIDEFAULFS.newConApplet,
                        mode: 'new',
                        sectionMargin:20,
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
                        beforeSave: function(r){
                            var promise= $.Deferred();
                            var getData = $("#mainContent").data("unit").options.data;
                            //判断下手机是否存在
                            Iptools.uidataTool._getUserlistAppletData({
                                appletId:widget._UIDEFAULFS.allConApplet,//新建客户时从全部客户里查找有没有号码相同的客户
                                pageNow:1,
                                pageSize:1,
                                condition:'{"'+widget._UIDEFAULFS.allConRoot+':phone":"='+$('.firstPhone').val()+'"}'
                            }).done(function(s){
                                if(s && s.data && s.data.records){
                                    Iptools.Tool.pAlert({
                                        title: "系统提示",
                                        content: "客户已存在"
                                    });
                                    promise.reject();
                                }else{
                                    if($('.firstPhone').val()){
                                        r[root+":phone"]= $('.firstPhone').val();
                                    };
                                    if($('.twoPhone').val()) {
                                        r[root + ":phone2"] = $('.twoPhone').val();
                                    };
                                    if($('.threePhone').val()) {
                                        r[root + ":phone3"] = $('.threePhone').val();
                                    };
                                    if($('.fourPhone').val()) {
                                        r[root + ":phone4"] = $('.fourPhone').val();
                                    };
                                    promise.resolve(r);
                                }
                            });
                            return promise;
                        },
                        afterSave: function(r){
                            var promise= $.Deferred();
                            var conId = r.id;
                            var postData = $("#mainContent").data("unit").options.DataCurrentSets;
                            //客户保存完之后将标签和客户群保存至该客户下
//                            trace._createConTrace(Iptools.DEFAULTS.userId,postData[root+':title'], conId);
                            var newTag = [];
                            if($('#eventTags li .tagit-label').size() > 0){
                                $('#eventTags li .tagit-label').each(function (i) {
                                    newTag.push($(this).html());
                                });
                            }
                            //获取所选客户群的id
                            var groupArr = [];
                            if($('#example-getting-started option:selected').size() > 0){
                                $('#example-getting-started option:selected').each(function() {
                                    groupArr.push($(this).val());
                                });
                            };

                            $.when(widget._aggTagForNewContact(newTag,conId), widget._addGroupForNewContact(groupArr,conId))
                                .done(function(){
                                    promise.resolve(r);
                                }).fail(function(){
                                    promise.regect(r);
                                })

                            if(newTag.length == 0 && groupArr.length == 0){
                                promise.resolve(r);
                            };
                            Iptools.uidataTool._pushMessage({//新建客户时保存时推送一条通知
                                channel: "contact_list"
                            });
                            return promise;
                        },
                        autoClose:true//新建完后知否关闭
                    });
                })
            }
        });
    },
    _getGroupList: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contactgroup List Applet'"
        }).done(function(r){
            widget._UIDEFAULFS.groupApplet = r.applets[0].applet;//4770
            Iptools.uidataTool._getApplet({
                applet:widget._UIDEFAULFS.groupApplet
            }).done(function(data){
                widget._UIDEFAULFS.groupRootId = data.rootLink;//51
                var rootId = data.rootLink;//51
                Iptools.uidataTool._getUserlistAppletData({
                    appletId:widget._UIDEFAULFS.groupApplet,
                    pageSize:10
                }).done(function(s){
                    //初始化input多选框
                    widget._initMultiselect();
                    if(s){
                        var options = [];
                        $.each(s.data.records,function(key,obj){
                            var index = $.inArray(obj[rootId + ':id'],widget._UIDEFAULFS.newConMultiOption);  //判断当下的客户群在不在之前的
                            if(index == -1) {
                                var groupObj = {};
                                groupObj.label = obj[rootId + ':title'];
                                groupObj.title = obj[rootId + ':title'];
                                groupObj.value = obj[rootId + ':id'];
                                options.push(groupObj);
                            }
                        });
//                options = options.concat(hasConMultiOption);
                        $('#example-getting-started').multiselect('dataprovider', options);
                        $(".multiselect-container.dropdown-menu").niceScroll({
                            cursorborder:"",
                            cursorcolor:"#c1d6f0",
                            horizrailenabled:false
                        })
                    }

                });
            });
        });
    },
    _getAllTags: function(){
        Iptools.GetJson({
            url: "basic/tags",
            data: {
                token: Iptools.DEFAULTS.token
            }
        }).done(function(data){
            for(var t = 0;t<data.length;t++){
                var html =  '<span class="label tag label-info" id="'+data[t].id+'" >'+data[t].tagValue+'</span>';
                $(".allTags").append(html);
            };
            widget._initIscroll();
        })
    },
    _getAllConListApplet: function(){//为了保存时查重用的
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
    _initIscroll: function(){
        new IScroll('#wrapper', {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true
        });
    },
    _initTag:function(){
        $("#eventTags").tagit({
            afterTagRemoved: function(evt, ui) {//新加上的标签删除时执行
                var span = '<span class="label tag label-info" >'+$("#eventTags").tagit('tagLabel', ui.tag)+'</span>';
                $('.allTags').prepend(span);
            }
        });
    },



//------------------------------------------------------初始化插件--------------------------------------------------
    _initMultiselect: function(){
        $('#example-getting-started').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            nonSelectedText:"未选择",
            onChange: function(option, checked, select) {
                if (checked) {
                    var selObj = {};
                    selObj.label = $(option).html()
                    selObj.title = $(option).html()
                    selObj.value = Number($(option).val());
                    selObj.selected = true;
                    widget._UIDEFAULFS.newConMultiOption.push(selObj);
                    widget._UIDEFAULFS.currSelGroup.push(Number($(option).val()));//存储被选择客户群的id
//                console.log(currSelGroup)
                }else{
                    var index = $.inArray($(option).val(),widget._UIDEFAULFS.currSelGroup);
                    widget._UIDEFAULFS.currSelGroup.splice(index-1,1);
                    for(var i =0;i<widget._UIDEFAULFS.newConMultiOption.length;i++){
                        if(widget._UIDEFAULFS.newConMultiOption[i].value == $(option).val()){
                            widget._UIDEFAULFS.newConMultiOption.splice(i,1);//从下标为i的元素开始，连续删除1个元素
                            i--;//因为删除下标为i的元素后，该位置又被新的元素所占据，所以要重新检测该位置
                        }
                    };
//                console.log(currSelGroup)
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


//-----------------------------------------------------监听事件----------------------------------------------------
    _onInputforSearch:function(){
        widget._addEventListener({
            container: "body",
            target: ".multiselect-filter .input-group .multiselect-search",
            type: "input",
            event: function (e) {
                var inputText = $('.input-group .multiselect-search').val();
                var condition = '{"'+ widget._UIDEFAULFS.groupRootId+':title":" like \'%'+inputText+'%\'"}';
                Iptools.uidataTool._getUserlistAppletData({
                    appletId:widget._UIDEFAULFS.groupApplet,
                    pageSize:10,
                    condition:condition
                }).done(function(s){
                    $('#example-getting-started').html("");
                    var options = [];
                    if(s&& s.data&& s.data.records&& s.data.records.length) {
                        $.each(s.data.records,function(key,obj){
                            var index = $.inArray(obj[widget._UIDEFAULFS.groupRootId + ':id'],widget._UIDEFAULFS.currSelGroup);  //判断搜索出来的客户群在不在当下选择过的，不在的话才显示出来，在的以勾选的形式出现
                            if(index == -1) {
                                var groupObj = {};
                                groupObj.label = obj[widget._UIDEFAULFS.groupRootId + ':title'];
                                groupObj.title = obj[widget._UIDEFAULFS.groupRootId + ':title'];
                                groupObj.value = obj[widget._UIDEFAULFS.groupRootId + ':id'];
                                options.push(groupObj);
                            };
                        });
                        options = options.concat(widget._UIDEFAULFS.newConMultiOption);//将搜索出来的结果和本页当下已选择的合起来展示
                        $('#example-getting-started').multiselect('dataprovider', options);
                        $('.input-group .multiselect-search').val(inputText);
                        $('.input-group .multiselect-search').focus();
                    }
                });
                return false;
            }
        });
    },
    _createTags: function(){
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
                        if($('#phone3').is(':visible') && $('#phone2').is(':visible')){
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
    _clickTagFocus: function(){
        widget._addEventListener({
            container: "body",
            target: "#10_tag .tag",
            type: "click",
            event: function (e) {
                var me = $(this);
                me.find('#eventTags .tagit-new input').focus();
            }
        });
    }
}