var widget = {};
widget = {
    _UIDEFAULFS: {
        appId:"",
        codeImg:"",
        contactListApplet:"",
        contactListRootId:"",
        pageNow_fans:1,
        authUrl:"",
        mergeConArr:[],
        haveMergeContact:[],
        allConPageSize:10
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//定义事件，如click
        widget._getConApplet();//获得客户list的applet
        widget._getAllConListData();//获得所有客户的数据
        widget._clickBindButton();//未授权时-----开始授权
        widget._cancelBind();//解除绑定
        widget._sureCancel();//确定解绑
        widget._clickMerge();//点击合并
        widget._clickIsAuto();//点击开启自动同步
        widget._clickIsAutoInput();//点击同步的checkbox
        widget._bulrAutoForData();//select框不聚焦后与后台通信
        widget._clickSync();//点击 同步粉丝数据
        widget._sureMerge();//开始同步
        widget._focusSearchInput();//聚焦在搜索框时
        widget._blurSearchInput();//搜索框失焦
        widget._submitSearch();//搜索粉丝list
        widget._focusConSearch();
        widget._clickDemoLi();
        widget._kewDownMultiSearch();//
        widget._hoverCode();//划过二维码
    },
    _bindingEventAfterLoad: function () {
        widget._enableTimeChange();
    },
    _init: function () {
        widget._bindingDomEvent();
        //加载内容
        widget._getGzhInfo();//获取公众号的信息---如果有则证明授权过了
    },
    _getGzhInfo: function(){
        $('section .waitDiv').loading();
        Iptools.GetJson({
            url:"wx/server/getTenantWx3rdInfo",
            data:{
                token:Iptools.DEFAULTS.token,
                pageNow:1,
                pageSize:1//暂时只支持一个公众号
            }
        }).done(function(data){
            $('section .waitDiv .load-data-container').remove();
            if(data.records.records && data.records.records.length > 0) {
                if (data.records.records[0].tenantWx3rdInfo.isAuthorizationCanceled) {
                    $('.not_bind').show();
                    $('section .row').hide();
                } else {
                    $('html,body').css('background','#eff3f8');
                    Iptools.Tool._coverWindowShow();//没有绑定才会出现模态框
                    $('.not_bind').hide();
                    $('section .row').show();
                    //appid很重要，保存起来
                    widget._UIDEFAULFS.appId = data.records.records[0].tenantWx3rdInfo.authorizerAppid;
                    var headImg = Iptools.DEFAULTS.serviceUrl + data.records.records[0].tenantWx3rdInfo.qrcodeUrl;

//                    var headImgLast = headImg.substr(headImg.length-1,1);
//                    if(headImgLast == '0'){
//                        headImg = headImg.substr(0,headImg.length-1);
//                    }
                    widget._UIDEFAULFS.codeImg = widget._showWxCode(headImg);
                    $('.iconList img').attr('src',widget._UIDEFAULFS.codeImg);
//                    console.log(widget._UIDEFAULFS.codeImg)
                    var isSync = data.records.records[0].tenantWx3rdInfo.isFansSyncOpened;
                    if(isSync){//开了自动同步
                        var time = data.records.records[0].tenantWx3rdInfo.fansSyncPeriod;
                        $('.isAuto input').prop('checked',true);
                        $('.autoSync .sel select').attr('disabled',false);
                        $('.autoSync .sel select option[value='+time+']').attr('selected',"selected");
                    }else{
                        $('.isAuto input').prop('checked',false);
                        $('.autoSync .sel select').attr('disabled',true);
                    };
                    $('#table_title span').html(data.records.records[0].tenantWx3rdInfo.nickName);
                    $('.gzh-nikeName').html(data.records.records[0].tenantWx3rdInfo.nickName);
                    $('.gzh-title .gzh-img img').attr('src', data.records.records[0].tenantWx3rdInfo.headImg);
                    $('.allFans span').html(data.records.records[0].fansTotalNumber.number);
                    $('.existFans span').html(data.records.records[0].fansMergedNumber.number);
                    widget._syncFansToMine();//手动同步粉丝到
                    widget._getWxFansList();////先同步粉丝到我们的库里,,再获得微信粉丝
                }
            }else{
                $('.not_bind').show();
                $('section .row').hide();
            }
        })
    },
    _clickMerge: function(){
        widget._addEventListener({
            container: "body",
            target: ".merge",
            type: "click",
            event: function () {
                $('.input-group .searchConInput').val("");
                $('.mergeTips span:last-child').html("客户名字")
                var wx_name = $(this).siblings('.wx-name').html();
                var wx_img = $(this).siblings('.wx-img').find('img').attr('src');
                $('.modal-gzh-title').data('fansId',$(this).attr('data-fansId'));
                $('.modal-gzh-title').data('openId',$(this).attr('data-openId'));
                $('.mergeTips span:first-child').html(wx_name);
                $('.modal-gzh-img img').attr('src',wx_img);
                $('.modal-gzh-title p').html(wx_name);
                $('#myModal').modal('show');
                //加载客户list
                widget._getConApplet();
                widget._getAllConListData();
            }
        });
    },
    _getConApplet: function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list_all'"
        }).done(function(r) {
            widget._UIDEFAULFS.contactListApplet = r.applets[0].applet;//2866
                Iptools.uidataTool._getApplet({
                    applet:r.applets[0].applet
                }).done(function(data) {
                    widget._UIDEFAULFS.contactListRootId = data.rootLink;//39
                });
        });
    },
    _getAllConListData: function(param){
        Iptools.uidataTool._getUserlistAppletData({
            appletId: widget._UIDEFAULFS.contactListApplet,
            pageNow:1,
            condition:param,
            pageSize:widget._UIDEFAULFS.allConPageSize
        }).done(function(s) {
            $('.conListBySearch').html("");
            $.each(s.data.records, function (key, obj) {
                var RootId = widget._UIDEFAULFS.contactListRootId;
                var name = obj[RootId + ':title'] ? obj[RootId + ':title'] : "";
                var phone = obj[RootId + ':phone'] ? obj[RootId + ':phone'] : "";
//                if(widget._UIDEFAULFS.haveMergeContact.indexOf(obj[RootId + ':id']) == -1){//已经被合并过的客户不展示了
                    var html = '<li role="presentation" class="demoLi">'+
                        '<a role="menuitem" tabindex="-1" class="hint-link" data-id="'+ obj[RootId + ':id'] + '">' + name+'-' + phone +'</a>'+
                        '</li>';
                    $('.conListBySearch').append(html);
//                };
            });
        })
    },
    _sureMerge: function(){
        widget._addEventListener({
            container: "body",
            target: ".sureMerge",
            type: "click",
            event: function () {
                if($('.input-group .searchConInput').val() == ''){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "请选择一个客户"
                    });
                    return false;
                };
//                console.log(widget._UIDEFAULFS.mergeConArr)
//                console.log(widget._UIDEFAULFS.mergeConArr[widget._UIDEFAULFS.mergeConArr.length-1]);
                var lastData = widget._UIDEFAULFS.mergeConArr[widget._UIDEFAULFS.mergeConArr.length-1]
                Iptools.PostJson({
                    url:"wx/server/mergeTenantWxFans",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        wxFanId:$('.modal-gzh-title').data('fansId'),
                        wxOpenId:$('.modal-gzh-title').data('openId'),
                        contactId:lastData
                    }
                }).done(function(data){
                    widget._UIDEFAULFS.mergeConArr = [];
                    if(data.retcode == "ok"){
                        widget._getWxFansList();
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "合并成功"
                        });
                        $('#myModal').modal('hide');
                    }else{
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: data.retmsg
                        });
                    }
                })
            }
        });
    },
    _clickBindButton: function(){
        widget._addEventListener({
            container: "body",
            target: ".start-bind",
            type: "click",
            event: function () {
                //跳转到微信授权页面
                $('#authModal').modal('show');
                Iptools.GetJson({
                    url:"wx/server/getTenantWxAuthUrl",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        url:self.location.href.replace("http://","").replace(new RegExp("/", "gm"),"|")
                    }
                }).done(function(data){
//                    console.log(self.location.href.replace("http://","").replace(new RegExp("/", "gm"),"|"))
//                    console.log(data)
                    widget._UIDEFAULFS.authUrl = data.authUrl;
                    $('.sureAuth').attr('href',widget._UIDEFAULFS.authUrl);
                });
            }
        });
    },
    _cancelBind: function(){
        widget._addEventListener({
            container: "body",
            target: ".cancelBind",
            type: "click",
            event: function () {
                $('#cancelModal').modal('show');
            }
        });
    },
    _sureCancel: function(){
        widget._addEventListener({
            container: "body",
            target: ".cancelAuth",
            type: "click",
            event: function () {
                Iptools.PostJson({
                    url:"wx/server/cancelTenantWxAuth",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        appId:widget._UIDEFAULFS.appId
                    }
                }).done(function(data){
//                    console.log('解绑成功')
                    $('section .row').hide();
                    $('.not_bind').show();
                    $('#cancelModal').modal('hide');
                })
            }
        });
    },
    _clickIsAuto: function(){
        widget._addEventListener({
            container: "body",
            target: ".isAuto",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if($(this).find('input').prop('checked')){
                    $(this).find('input').prop('checked',false);
                    $('.autoSync .sel select').attr('disabled',true);
                    Iptools.PostJson({
                        url:"wx/server/updateTenantWx3rdInfo",
                        data:{
                            token:Iptools.DEFAULTS.token,
                            appId:widget._UIDEFAULFS.appId,
                            isFansSyncOpened:false
                        }
                    }).done(function(data){
                        if(data.retcode == 'ok'){
//                            console.log('同步取消');
                        }
                    })
                }else{
                    $(this).find('input').prop('checked',true);
                    $('.autoSync .sel select').attr('disabled',false);
                    Iptools.PostJson({
                        url:"wx/server/updateTenantWx3rdInfo",
                        data:{
                            token:Iptools.DEFAULTS.token,
                            appId:widget._UIDEFAULFS.appId,
                            isFansSyncOpened:true,
                            fansSyncPeriod:$('.autoSync .sel select option:selected').val()
                        }
                    }).done(function(data){
                        if(data.retcode == 'ok'){
//                            console.log('默认同步成功'+$('.autoSync .sel select option:selected').val());
                        }
                    })

                };
            }
        });
    },
    _clickIsAutoInput: function(){
        widget._addEventListener({
            container: "body",
            target: ".isAuto input",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if($(this).prop('checked')){
                    $('.autoSync .sel select').attr('disabled',false);
                    Iptools.PostJson({
                        url:"wx/server/updateTenantWx3rdInfo",
                        data:{
                            token:Iptools.DEFAULTS.token,
                            appId:widget._UIDEFAULFS.appId,
                            isFansSyncOpened:true,
                            fansSyncPeriod:$('.autoSync .sel select option:selected').val()
                        }
                    }).done(function(data){
                        if(data.retcode == 'ok'){
//                            console.log('默认de同步成功'+$('.autoSync .sel select option:selected').val());
                        }
                    })
                }else{
                    $('.autoSync .sel select').attr('disabled',true);
                    Iptools.PostJson({
                        url:"wx/server/updateTenantWx3rdInfo",
                        data:{
                            token:Iptools.DEFAULTS.token,
                            appId:widget._UIDEFAULFS.appId,
                            isFansSyncOpened:false
                        }
                    }).done(function(data){
                        if(data.retcode == 'ok'){
//                            console.log('同步取消');
                        }
                    })
                }
            }
        });
    },
    _bulrAutoForData: function(){
        widget._addEventListener({
            container: "body",
            type: "change",
            target: ".sel select",
            event: function () {
//                console.log('同步--周期是'+$('.autoSync .sel select option:selected').val())
                    Iptools.PostJson({
                        url:"wx/server/updateTenantWx3rdInfo",
                        data:{
                            token:Iptools.DEFAULTS.token,
                            appId:widget._UIDEFAULFS.appId,
                            isFansSyncOpened:true,
                            fansSyncPeriod:$('.autoSync .sel select option:selected').val()
                        }
                    }).done(function(data){
                        if(data.retcode == 'ok'){
//                            console.log('同步成功');
                        }
                    })
            }
        });
    },
    _clickSync: function(){
        widget._addEventListener({
            container: "body",
            target: ".syncData",
            type: "click",
            event: function () {
                $('.search input').val("");
                Iptools.Tool._coverWindowShow();
                Iptools.PostJson({
                    url:"wx/server/syncTenantWxFans",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        appId:widget._UIDEFAULFS.appId
                    }
                }).done(function(data){
                    if(data.retcode == 'ok'){
                        widget._UIDEFAULFS.pageNow_fans = 1;
                        widget._getWxFansList();
                    }
                });

                setTimeout(function(){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "同步数据成功"
                    });
                },1500)
            }
        });
    },
    _syncFansToMine: function(){
        Iptools.PostJson({
            url:"wx/server/syncTenantWxFans",
            data:{
                token:Iptools.DEFAULTS.token,
                appId:widget._UIDEFAULFS.appId
            }
        }).done(function(data){
            if(data.retcode == 'ok'){
//                console.log('sync ok')
            }
        });
    },
    _getWxFansList: function(par){
                Iptools.PostJson({
                    url:"wx/server/getTenantWxFansList",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        appId:widget._UIDEFAULFS.appId,
                        keywords:par,
                        pageNow:widget._UIDEFAULFS.pageNow_fans,
                        pageSize:10
                    }
                }).done(function(data){
//                    console.log(data.records)
                    component._pager({
                        container: "pager-example-panel-allFans",
                        pageSize: data.records.records.length,
                        pageCount: data.records.pageCount,//总页数
                        rowCount: data.records.rowCount,//总条数
                        pageNow: data.records.pageNow,
                        jump: function (page) {
                            widget._UIDEFAULFS.pageNow_fans = page;
                            widget._getWxFansList();
                        }
                    });
                    $('.fansList').html('');
                    $('.emptyFans').remove();
                    if(data.records && data.records.records.length >0){
                        $('#pager-example-panel-allFans').show();
                        $.each(data.records.records,function(key,obj){
                            var sex = "";
                            if(obj.gender == 1){sex = "男";}
                            if(obj.gender == 2){sex = "女";}
                            if(obj.gender == 0){sex = "未知";}
                            var isSubscribe = obj.isSubscribe ? "已关注" :"未关注";
//                            if(obj)
                            var loca = "";
                            if(obj.country == '' && obj.province == '' && obj.city == ''){
                                loca = "";
                            }else{
                                loca =  obj.country+'/'+obj.province+'/'+obj.city;
                            };
                            var tags = obj.tags ? obj.tags :"";
                            var tagHtml = "";
                            if(tags != ""){
                                var tagArr = tags.split('|');
                                $.each(tagArr,function(key,obj){
                                    var html = '<span class="label tag label-info">'+obj+'</span>';
                                    tagHtml += html;
                                })
                            };
                            var mergeIcon = "";//是否同步过
                            var flagIcon = "";
                            if(!obj.isMerged){
                                mergeIcon = '<td class="merge" data-openId="'+obj.openId+'" data-fansId="'+obj.id+'"><i class="iconfontyyy" title="链接微信粉丝">&#xe792;</i></td>';
                            }else{//同步过的
                                widget._UIDEFAULFS.haveMergeContact.push(Number(obj.contactId));
                                mergeIcon = '<td class="jumpConDe" onclick="widget._jumpConDetail(this)" data-id="'+obj.contactId+'" data-name="'+widget._getConName(obj.contactId)+'"><i class="iconfontyyy jumpConDe" title="查看客户画像">&#xe79c;</i></td>';
//                                flagIcon = '<i class="iconfontyyy flagIcon">&#xe79b;</i>';
                                flagIcon = '<span class="wx-merge-icon"><img src="Images/Wicon.png" /></span>';
                            };
                            var time = widget._enableTimeChange(obj.subscribeTime);
                            time = time.substr(0,time.indexOf(" "));
                            var language = obj.language ? obj.language : "";
                            var group = obj.group ? obj.group : "";
                            var html = '<tr class="hyperTr groupList">'+
                                '<td class="wx-img">'+
                                '<img src="'+obj.headImg+'" alt=""/>'+
                                flagIcon+
                                '</td>'+
                                '<td class="wx-name">'+obj.nickName+'</td>'+
                                '<td>'+sex+'</td>'+//值为1时是男性，值为2时是女性，值为0时是未知
                                '<td>'+isSubscribe+'</td>'+
                                '<td>'+loca+'</td>'+
                                '<td>'+language+'</td>'+
                                '<td>'+group+'</td>'+
                                '<td>'+tagHtml+'</td>'+
                                '<td>'+time+'</td>'+
                                 mergeIcon+
                                '</tr>';
                            $('.fansList').append(html);

                        });

                    }else{
                        $('#pager-example-panel-allFans').hide();
                        var empty = '<div style="text-align: center;margin:50px 0;" class="emptyFans">' +
                            '<img src="../wx-fans/Images/nofans.png" style="width:100px;margin-bottom: 20px;">'+
                            '<p>没有粉丝关注，建议进行几次活动或文章的群发</p>' +
                            '</div>';
                        $('.fansInner').after(empty);
                    }
                });
        setTimeout(function(){
//            console.log(widget._UIDEFAULFS.haveMergeContact)
            Iptools.Tool._coverWindowHide();
        },1000)

    },
    _getConName: function(id){
        var name = "";
        Iptools.GetJson({
            url:"basic/contacts/"+id+"?token="+Iptools.DEFAULTS.token,
            async:false
        }).done(function(data){
            name = data.title;
        })
        return name;
    },
    _focusSearchInput: function(){
        widget._addEventListener({
            container: "body",
            target: ".search input",
            type: "focus",
            event: function () {
                $('.search_icon').hide();
                $('.search button').show();
                $(this).attr('placeholder',"");
            }
        });
    },
    _focusConSearch: function(){
        widget._addEventListener({
            container: "body",
            target: ".input-group .searchConInput",
            type: "click",
            event: function (e) {
                e=e||event;
                e.stopPropagation();
                var me=$(this);
                me.parent().find(".input-group-btn").addClass("open");
                me.parent().find("button").attr("aria-expanded", "true");
            }
        });
    },
    _clickDemoLi: function(){
        widget._addEventListener({
            container: "body",
            target: "ul .demoLi",
            type: "click",
            event: function () {
                var me=$(this);
                widget._UIDEFAULFS.mergeConArr.push(Number(me.find('a').attr('data-id')));
                $('.form-control.searchConInput').val(me.find('a').html());
                var selText = me.find('a').html();
                $('.mergeTips span:last-child').html(selText.substr(0,selText.indexOf("-")))
            }
        });
    },
    _blurSearchInput: function(){
        widget._addEventListener({
            container: "body",
            target: ".search input",
            type: "blur",
            event: function () {
                $('.search_icon').show();
                $('.search button').hide();
                $(this).attr('placeholder',"昵称、分组、标签等");
            }
        });
    },
    _submitSearch: function(){
        widget._addEventListener({
            container: "body",
            target: ".search",
            type: "submit",
            event: function () {
                widget._getWxFansList($('.search input').val());
                return false;
            }
        });
    },
    _enableTimeChange: function(nS){
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    },
    _showWxCode: function(url){
        var frameid = 'frameimg' + Math.random();
        var code = url + '?' + Math.random();
        return code;
//        console.log(url + '?' + Math.random())
//        window.img = '<img id="img" style="wid    th:50%" src=\'' + url + '?' + Math.random() + '\' /><script>window.onload = function() { parent.document.getElementById(\'' + frameid + '\').height = document.getElementById(\'img\').height+\'px\'; }<' + '/script>';
//        document.write('<iframe id="' + frameid + '" src="javascript:parent.img;" frameBorder="0" scrolling="no" width="50%"></iframe>');
    },
    _kewDownMultiSearch: function(){
        widget._addEventListener({
            container: "body",
            target: ".input-group .searchConInput",
            type: "input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var inputText = $(this).val();
                var rootId = widget._UIDEFAULFS.contactListRootId;
                var condition = "";
                if(!isNaN(inputText)){//是数字搜索电话否则搜索名字
                    condition = '{"'+rootId +':phone":" like \'%'+inputText+'%\'"}';
                }else{
                    condition = '{"'+rootId+':title":" like \'%'+inputText+'%\'"}';
                };
                widget._getAllConListData(condition);
                return false;
            }
        });
    },
    _hoverCode: function(){
        $(".iconList .codeImg").hover(function () {
//            $('.iconList img').attr('src',widget._UIDEFAULFS.codeImg);
            $('.iconList img').show();
        }, function () {
            $('.iconList img').hide();
        });
    },
    _jumpConDetail: function(e){
        Iptools.uidataTool._getCustomizeView({
            nameList: "'contact_profit'"
        }).done(function(data){
            if (data.views.length) {
                Iptools.uidataTool._getView({
//            async: false,
                    view: data.views[0].view
                }).done(function(r){
                    Iptools.Tool._jumpView({
                        view: data.views[0].view,
                        name: r.view.name+' > '+$(e).attr('data-name'),
                        valueId:$(e).attr('data-id'),
                        type: r.view.type,
                        url: r.view.url,
                        bread: true
                    });
                })
            }
        });
    }
};