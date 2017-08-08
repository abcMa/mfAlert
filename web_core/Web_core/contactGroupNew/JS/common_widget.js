//客户公共引用的widget.js  2017-04-12
var common = {};
common = {
    _UIDEFAULFS: {
        groupDetailApplet: "",
        allContactApplet: "",
        allContactRoot: "",//----------之前的groupRootId
        searchContactStr: "",
        searchTagStr: "",
        searchParam: "",
        haveExistCon : [],
        contact_page_now: 1,
        contact_page_size: 10
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
        common._addToGroup();
        common._finalSelectAll();
        common._searchContact();
        common._checkAllContact();
        common._comfirmAddToGroup();
        common._closeAllSelect();
        common._stopPro();
        common._jumpAddCon();
    },
    _bindingEventAfterLoad: function () {//插件的初始化
        common._check();
    },
    _init: function () {
        common._bindingDomEvent();
        common._getGroupDetailApplet();//客户群详情的applet
        common._getAllContactApplet();//‘所有客户’的applet
    },
    //客户群编辑和新建和详情页的公共函数
    _getGroupDetailApplet: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contactgroup Detail Applet'"
        }).done(function (data) {
            common._UIDEFAULFS.groupDetailApplet = data.applets[0].applet;//4767
        });
    },
    _getAllContactApplet: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list'"
        }).done(function (data) {
            common._UIDEFAULFS.allContactApplet = data.applets[0].applet;//2047
        });
    },
    _getContactList: function (param) {//获得客户列表
        var condition = {};
        if (param == '{}' || param == '') {
            condition = '{"' + common._UIDEFAULFS.allContactRoot + ':contacttype":" in (2,3,4)"}';
        } else {
            condition = param;
        }
        ;
        Iptools.uidataTool._getUserlistAppletData({
            appletId: common._UIDEFAULFS.allContactApplet,
            pageNow: common._UIDEFAULFS.contact_page_now,
            pageSize: common._UIDEFAULFS.contact_page_size,
            condition: condition
        }).done(function (s) {
            if (s) {
                var realData = s;
                if (s.data) {
                    if (s.data.records) {
                        $('.allCheck').attr('disabled',false);
                        $(".none").hide();
                        common._renderContactList(realData);
                    }
                } else {
                    $(".contactGroupListTbody").html("");
                    $('#pager-example-panel-allConList').hide();
                    $(".none").show();
                    $('.allCheck').attr('disabled',true);
                }
            }
        })
    },
    _renderContactList: function (s) {//铺设客户列表
        $("#pager-example-panel-allConList").show();
        component._pager({
            container: "pager-example-panel-allConList",
            pageSize: s.data.pageSize,
            pageCount: s.data.pageCount,//总页数
            rowCount: s.data.rowCount,//总条数
            pageNow: s.data.pageNow,
            jump: function (page) {
                common._UIDEFAULFS.contact_page_now = page;
                $('.allCheck').prop('checked', false);
                if (common._UIDEFAULFS.searchContactStr == '') {
                    if (common._UIDEFAULFS.searchTagStr == '') {
                        common._getContactList();
                    } else {
                        common._UIDEFAULFS.searchParam['pageNow'] = common._UIDEFAULFS.contact_page_now = page;
                        common._renderConListByQueryTag(common._UIDEFAULFS.searchParam);
                    }
                } else {
                    common._getContactList(common._UIDEFAULFS.searchContactStr);
                }
            }
        });
        common._UIDEFAULFS.allContactRoot = s.rootLink;
        var groupRootId = s.rootLink;
        var listobj = s.data.records;
        $(".contactGroupListTbody").html("");
        $.each(listobj, function (key, obj) {
            //拿到每个contact的标签
            Iptools.GetJson({
                url: "basic/contactTagLinks",
//                async:false,
                data: {
                    token: Iptools.DEFAULTS.token,
                    contactId: obj[groupRootId + ':id']
                }
            }).done(function (data) {
                var tagArr = [];
//                    console.log(data)
                $.each(data, function (key, objT) {
                    tagArr.push(objT.tagValue);
                });
                var conName = '';
                if (obj[groupRootId + ':title']) {
                    if (obj[groupRootId + ':title'] == 'undefined') {
                        conName = '';
                    } else {
                        conName = obj[groupRootId + ':title'];
                    }

                }
                var html = '<tr><lable for="contactItem">' +
                    '<td><input type="checkbox" class="blueCheckbox" isconnew="new" data-id="' + obj[groupRootId + ':id'] + '"></td>' +
//                        '<td>'+(i+1)+'</td>'+
                    '<td>' + conName + '</td>';
                if (obj[groupRootId + ':phone']) {
                    html += '<td>' + obj[groupRootId + ':phone'] + '</td>';
                } else {
                    html += '<td></td>';
                }
                ;
                if (tagArr) {
                    html += '<td style="padding:0;">';
                    $.each(tagArr, function (key, obj) {
                        if (tagArr.indexOf(obj) < 3) {
                            var tagValue = obj;
                            if (obj.length > 9) {
                                tagValue = obj.substring(0, 9) + '...';
                            }
                            html += '<span class="label tag label-info" style="">' + tagValue + '</span>';
                        }
                    });
                    html += '</td>';
                } else {
                    html += '<td></td>';
                }
                if (obj[groupRootId + ':contacttype']) {
                    html += '<td>' + obj[groupRootId + ':contacttype']['name'] + '</td>';
                } else {
                    html += '<td></td>';
                }
                if (obj[groupRootId + ':channel']) {
                    html += '<td>' + obj[groupRootId + ':channel'] + '</td>';
                } else {
                    html += '<td></td>';
                }
                html += '</lable></tr>';
                $(".contactGroupListTbody").append(html);
            })
        })
    },
    _renderConListByQueryTag: function(s){
        Iptools.GetJson({
            url:"basic/queryContactsByTags",
            async:false,
            data:s
        }).done(function(data){
            if(data.records.length == 0){
                $(".contactGroupListTbody").html("");
                $('#pager-example-panel-allConList').hide();
                $(".none").show();
                return false;
            };
            //铺设带标签的搜索结果
            $(".contactGroupListTbody").html("");
            $(".none").hide();
            $("#pager-example-panel-allConList").show();
            var listobj = data.records;
            component._pager({
                container: "pager-example-panel-allConList",
                pageSize: data.pageSize,
                pageCount: data.pageCount,//总页数
                rowCount: data.rowCount,//总条数
                pageNow: data.pageNow,
                jump: function (page) {}
            });
            $.each(listobj,function(key,obj){
                Iptools.GetJson({
                    url:"basic/contactTagLinks",
//                async:false,
                    data:{
                        token:Iptools.DEFAULTS.token,
                        contactId:obj["contactId"]
                    }
                }).done(function(data){
                    var tagArr = [];
//                    console.log(data)
                    $.each(data,function(key,objT){
                        tagArr.push(objT.tagValue);
                    });
                    var html = '<tr><lable >'+
                        '<td><input  type="checkbox" data-id="'+obj['contactId']+'"></td>'+
                        //                        '<td>'+(i+1)+'</td>'+
                        '<td>'+obj['title']+'</td>';
                    if(obj['phone']){
                        html += '<td>'+obj['phone']+'</td>';
                    }else{
                        html += '<td></td>';
                    };
                    if(tagArr){
                        html += '<td style="padding:0;">';
                        $.each(tagArr,function(key,obj){
                            if(tagArr.indexOf(obj)<3){
                                var tagValue = obj;
                                if(obj.length > 9){
                                    tagValue = obj.substring(0,9)+'...';
                                }
                                html +=  '<span class="label tag label-info">'+tagValue+'</span>';

                            }
                        });
                        html +=  '</td>';
                    }else{
                        html += '<td></td>';
                    }

                    if(obj["contactType"]){
                        var typeStr = '';
                        if(obj["contactType"] == 2){
                            typeStr = '潜在客户'
                        };
                        if(obj["contactType"] == 3){
                            typeStr = '消费客户'
                        };
                        if(obj["contactType"] == 4){
                            typeStr = '会员客户'
                        };
                        html += '<td>'+typeStr+'</td>';
                    }else{
                        html += '<td></td>';
                    }
                    if(obj['Channel']){
                        html += '<td>'+obj['Channel']+'</td>';
                    }else{
                        html += '<td></td>';
                    };
                    html += '</lable></tr>';
                    $(".contactGroupListTbody").append(html);
                })
            });
        })
    },
    _getPersonCount: function(){
        var shu = $('.selContactContent tbody tr').size();
        $(".onlineCount i").html(shu);
    },
    _check: function(){
        $('form').bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                groupname: {
                    message: '客户群验证失败',
                    validators: {
                        notEmpty: {
                            message: '客户群不能为空'
                        }
                    }
                },
                groupreson: {
                    validators: {
                        notEmpty: {
                            message: '分群依据不能为空'
                        }
                    }
                },
                groupdescri: {
                    message: '客户群描述验证失败',
                    validators: {
                        notEmpty: {
                            message: '客户群描述不能为空'
                        }
                    }
                }
            }
        });
    },


//    -------------------点击才会出发的函数-------------------------------------
    _comfirmAddToGroup: function(){//确认添加至客户群内
        widget._addEventListener({
            container: "body",
            target: "#addGroup",
            type: "click",
            event: function () {
                if($(".contactGroupListTbody tr td:first-child input:checked").size() == 0 ){
                    return false;
                }else{
                    $(this).css({"pointer-events":"none"});
                    $(this).button("loading");
                    $('.nodata').hide();
                    $(".contactGroupListTbody tr td:first-child input:checked").each(function(i){  //这个each方法是遍历dom元素，为每个dom元素做些操作。
                        //存下选中的dataid,防止一会再重复选
                        var flag = $.inArray(Number($(this).attr('data-id')),  common._UIDEFAULFS.haveExistCon);//如果不在返回-1
                        if (flag == -1) {
                            common._UIDEFAULFS.haveExistCon.push(Number($(this).attr('data-id')));
                            var tr = '<tr>'+$(this).parent().parent().html()+'</tr>';
                            if($('.selContactContent tbody tr').size() > 0){
                                $('.selContactContent tbody tr:first-child').before(tr);
                            }else{
                                $('.selContactContent tbody').append(tr);
                            }
                        }
                    });
                    $('.allCheck').prop('checked',false);
                    $('.finalAll').attr('disabled',false);
                    common._getPersonCount();
                    $("#addToContactGroupModal").modal("hide");
                        //释放重复点击
                    $(this).button("reset");
                    $(this).css("pointer-events","auto");
                }

            }
        })
    },
    _addToGroup: function () {//出现客户list的模态框
        widget._addEventListener({
            container: "body",
            target: "#AddPanelHeader .addCon,.nodata img,.middle .btn-list .add",
            type: "click",
            event: function () {
                $("#addToContactGroupModal").modal("show");
                $('.allCheck').prop('checked', false);
                $(".con-tag").val('');
                $(".con-name").val('');
                $(".con-phone").val('');
                $('.con-type').val('');
                $('.con-channel').val('');
                $('.none').hide();
                common._UIDEFAULFS.searchContactStr = '';
                common._UIDEFAULFS.searchTagStr = '';
                common._UIDEFAULFS.contact_page_now = 1;
                common._getContactList();
            }
        })
    },
    _searchContact: function () {
        widget._addEventListener({
            container: "body",
            target: ".addGroup .btn-search,.addGroup .row .btn-primary",
            type: "click",
            event: function () {
                common._UIDEFAULFS.searchTagStr = $(".con-tag").val();
                common._UIDEFAULFS.searchContactStr = '';
                var queryName = $(".con-name").val();
                var queryPhone = $(".con-phone").val();
                var queryConType = $('.con-type').val();
                var queryChannel = $('.con-channel').val();
                if (common._UIDEFAULFS.searchTagStr == '' && queryName == '' && queryPhone == '' && queryConType == '' && queryChannel == '') {
                    $('.none').hide();
                    common._getContactList();
                    return false;
                };
                common._UIDEFAULFS.contact_page_now = 1;
                if (common._UIDEFAULFS.searchTagStr) {
                    common._UIDEFAULFS.searchParam = {
                        token: Iptools.DEFAULTS.token,
                        tags: common._UIDEFAULFS.searchTagStr,
                        pageNow: common._UIDEFAULFS.contact_page_now,
                        pageSize: common._UIDEFAULFS.contact_page_size
                    };
                    if (queryName) {
                        common._UIDEFAULFS.searchParam['title'] = queryName;
                    }
                    if (queryPhone) {
                        common._UIDEFAULFS.searchParam['phone'] = queryPhone;
                    }
                    if (queryConType) {
                        common._UIDEFAULFS.searchParam['contactType'] = queryConType;
                    }
                    if (queryChannel) {
                        common._UIDEFAULFS.searchParam['channel'] = queryChannel;
                    }
                    common._renderConListByQueryTag(common._UIDEFAULFS.searchParam);
                } else {
                    common._UIDEFAULFS.searchContactStr += '{';
                    if (queryName) {
                        common._UIDEFAULFS.searchContactStr += '"' + common._UIDEFAULFS.allContactRoot + ':title":" like \'%' + queryName + '%\'",';
                    }
                    if (queryPhone) {
                        common._UIDEFAULFS.searchContactStr += '"' + common._UIDEFAULFS.allContactRoot + ':phone":" like \'%' + queryPhone + '%\'",';
                    }
                    if (queryConType) {
                        common._UIDEFAULFS.searchContactStr += '"' + common._UIDEFAULFS.allContactRoot + ':contacttype":"=' + queryConType + '",';
                    }
                    if (queryChannel) {
                        common._UIDEFAULFS.searchContactStr += '"' + common._UIDEFAULFS.allContactRoot + ':channel":" like \'%' + queryChannel + '%\'",';
                    }
                    common._UIDEFAULFS.searchContactStr += '}';
                    common._getContactList(common._UIDEFAULFS.searchContactStr);
                };
            }
        })
    },
    _closeAllSelect : function(){//在客群编辑页的点击已有客户的tr
        widget._addEventListener({
            container: "body",
            target: ".contactGroupListTbody tr,.selContactContent tr",
            type: "click",
            event: function () {
                var everyPageSize_final = $('.selContactContent tbody tr td:first-child input').size();
                var everyPageSize_reserve = $('.contactGroupListTbody tr td:first-child input').size();
                //点击每一行数据时，判断下是在客户列表模态框里点击的还是最后铺出来的客户列表里点击的
                if($(this).parent().attr('class') == 'contactGroupListTbody'){//客户列表模态框
                    if($(this).find('input').prop("checked")){
                        $(this).find('input').prop("checked",false);
                        //全选不打勾
                        $('.allCheck').prop('checked',false);
                    }else{
                        $(this).find('input').prop("checked",true);
                        if($('.contactGroupListTbody tr td:first-child input:checked').size() == everyPageSize_reserve){//所有都选上了
                            //全选打勾
                            $('.allCheck').prop('checked',true);
                        };
                    }
                }else{
                    if($(this).find('input').prop("checked")){
                        $(this).find('input').prop("checked",false);
                        //全选不打勾
                        $('.finalAll').prop('checked',false);
                    }else{
                        $(this).find('input').prop("checked",true);
                        $('.del').addClass('delToRed');
                        $('.del button').attr('disabled',false);
                        if($('.selContactContent tbody tr td:first-child input:checked').size() == everyPageSize_final){//所有都选上了
                            //全选打勾
                            $('.finalAll').prop('checked',true);
                        };
                    }
                }
                if($('.selContactContent tbody tr td:first-child input:checked').size() == 0){
                    $('.onlineCount.del').removeClass("delToRed");
                    $('.onlineCount.del button').attr('disabled',true);
                }
            }
        })
    },
    _checkAllContact: function(){//客户列表的模态框上的全选
        widget._addEventListener({
            container: "body",
            target: ".addGroup .allCheck",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if($(this).prop('checked')){
                    $('#addToContactGroupModal table tbody tr td:first-child input').prop('checked',true);
                }else{
                    $('#addToContactGroupModal table tbody tr td:first-child input').prop('checked',false);
                }
            }
        })
    },
    _finalSelectAll:function(){//最终在页面e上的全选
        widget._addEventListener({
            container: "body",
            target: ".selContactContent .finalAll",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if($(this).prop('checked')){
                    $('.selContactContent tbody tr td:first-child input').prop('checked',true);
                    $('.del').addClass('delToRed');
                    $('.del button').attr('disabled',false);
                }else{
                    $('.selContactContent tbody tr td:first-child input').prop('checked',false);
                    $('.del').removeClass('delToRed');
                    $('.del button').attr('disabled',true);
                }
            }
        })
    },
    _stopPro: function(){//阻止点击checkbox时冒泡到他的父级tr
        widget._addEventListener({
            container: "body",
            target: ".contactGroupListTbody tr td:first-child input,.selContactContent tr td:first-child input",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if($(this).parent().parent().parent().attr('class') == 'contactGroupListTbody'){//模态框
                    if(!$(this).prop('checked')){
                        //全选不打勾
                        $('.allCheck').attr('checked',false);
                    }else{
                        var everyPageSize = $('.contactGroupListTbody tr td:first-child input').size();
                        if($('.contactGroupListTbody tr td:first-child input:checked').size() == everyPageSize){//所有都选上了
                            //全选打勾
                            $('.allCheck').prop('checked',true);
                        }
                    };
                }else{
                    if(!$(this).prop('checked')){
                        //全选不打勾
                        $('.finalAll').attr('checked',false);
                    }else{
                        var everyPageSize = $('.selContactContent tbody tr td:first-child input').size();
                        if($('.selContactContent tbody tr td:first-child input:checked').size() == everyPageSize){//所有都选上了
                            //全选打勾
                            $('.finalAll').prop('checked',true);
                        }
                    };
                };
                if($('.selContactContent tbody tr td:first-child input:checked').size() == 0){
                    $('.onlineCount.del').removeClass("delToRed");
                    $('.onlineCount.del button').attr('disabled',true);
                }else{
                    $('.del').addClass('delToRed');
                    $('.del').attr('disabled',false);
                }
            }
        })
    },
    _jumpAddCon: function(){
        widget._addEventListener({
            container: "body",
            target: ".none .addGroup",
            type: "click",
            event: function () {
                //需要跳转到新建的view时，拿到客户新建的view
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_new'"
                }).done(function(data){
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            async: false,
                            view: data.views[0].view
                        }).done(function (r) {
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true
                            });
                        });
                    }
                })
            }
        })
    }
}