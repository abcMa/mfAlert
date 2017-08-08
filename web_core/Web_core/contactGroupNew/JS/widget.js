//客户公共引用的widget.js  2017-04-12
var widget = {};
widget = {
    _UIDEFAULFS: {

    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
        widget._clickDel();//点击删除
        widget._saveNewGroup();//保存新建的客群
    },
    _bindingEventAfterLoad: function () {//插件的初始化

    },
    _init: function () {
        widget._bindingDomEvent();
        $('.finalAll').attr('disabled',true);
        common._check();//执行校验
    },
//    -----------------------------绑定事件----------------------------------------------------------
    _clickDel: function(){
        widget._addEventListener({
            container: "body",
            target: ".del",
            type: "click",
            event: function () {
                //下面所选客户的数组
                $(".selContactContent tr td:first-child input:checked").each(function(i){
                    $(this).parent().parent().remove();//如果不在返回-1
                    //將刪除的客戶的id從selData數組裡刪除，省的添加不進來
                    for(var i=0;i<common._UIDEFAULFS.haveExistCon.length;i++){
                        if(common._UIDEFAULFS.haveExistCon[i] == $(this).attr('data-id')){
                            common._UIDEFAULFS.haveExistCon.splice(i,1);//从下标为i的元素开始，连续删除1个元素
                            i--;//因为删除下标为i的元素后，该位置又被新的元素所占据，所以要重新检测该位置
                        }
                    };
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "移除客户成功"
                    });
                });
                if($('.selContactContent tbody tr').size() == 0){
                    $('.finalAll').attr('disabled',true);
                    $('.finalAll').prop('checked',false);
                    $('.nodata').show();
                }
                common._getPersonCount();
                $(this).removeClass("delToRed");
                $(this).find('button').attr('disabled',true);
            }
        })
    },
    _saveNewGroup: function(){
        widget._addEventListener({
            container: "body",
            target: ".newDataBtn",
            type: "click",
            event: function () {
                $('form').bootstrapValidator('validate');
                if(!$('form').data("bootstrapValidator").isValid()){
                    return false;
                };
                $(this).css({
                    "pointer-events":"none"
                });
                $(this).button("loading");
                var finalSelData = [];
                var finalSelName = [];
                var groupTitle = $('.name .content input').val();
                var groupDes = $('.detial-des .content textarea').val();
                var groupRes = $('.divide .content select').val();
//    console.log(groupRes)
                //下面所选客户的数组
                $(".selContactContent tr td:first-child input").each(function(i){
                    finalSelData.push($(this).attr('data-id'));
                    finalSelName.push($(this).parent().siblings().html());
                });
                //拿到rootGroupId
                var rootId;
                var groupId = '';
                Iptools.uidataTool._getApplet({
                    applet:common._UIDEFAULFS.groupDetailApplet//4767
                }).done(function(data){
                    if(data){
                        rootId = data.rootLink;
                        Iptools.uidataTool._addAppletData({
                            appletId:common._UIDEFAULFS.groupDetailApplet,//4767
                            data:'{"'+rootId+':title":"'+groupTitle+'","'+rootId+':description":"'+groupDes+'","'+rootId+':group_reason":"'+groupRes+'"}'
                        }).done(function(data){
                            groupId = data.id;
                            //将新建客户群的动态post到8144客户群动态
                            Iptools.uidataTool._addAppletData({
                                appletId:trace._UIDEFAULFS.groupTraceDeApplet,
                                data:'{"'+trace._UIDEFAULFS.groupTraceDeRoot+':title":"'+groupTitle+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':contactgroup_id":"'+groupId+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':trace_type":"2"}'
                            }).done(function(data){
//                        console.log('创建客户群的动态已post---没有添加客户');
                            });
                            //添加客户的post和添加客户动态的post
                            var paramData={
                                "token":Iptools.DEFAULTS.token,
                                "contactgroupId": groupId,
                                "contactIds":finalSelData.join()
                            };
                            //客户群的客户相关联
                            Iptools.PostJson({
                                ajaxCounting:false,
                                url:"basic/linkContactgroup",
                                data:paramData
                            }).done(function(data){
                                if(data){
                                    $(".selContactContent tr td:first-child input").each(function(i){
                                        var con_name = $(this).parent().siblings().html();
                                        var con_id = $(this).attr('data-id');
                                        //客户群方
                                        trace._addToGroupGroTrace(con_name,groupId,con_id)
                                        //客户方
                                        trace._addToGroupTrace(Iptools.DEFAULTS.userId,$('.name .content input').val(),con_id,groupId)
                                    });
                                    Iptools.Tool.pAlert({
                                        title: "系统提示",
                                        content: "创建客户群成功"
                                    });
                                    setTimeout(function(){
                                        if (Iptools.Tool._getVersion() == 'v1') {
                                            Iptools.Tool._redirectToParent();
                                        } else {
                                            Iptools.uidataTool._getView({
                                                view: Iptools.DEFAULTS.currentView
                                            }).done(function(r){
                                                if(r)
                                                    Iptools.Tool._CloseTab({
                                                        view: Iptools.DEFAULTS.currentView,
                                                        name: r.view.name,
                                                        type: r.view.type,
                                                        url: r.view.url,
                                                        refresh:true,
                                                        bread: true
                                                    });
                                            })
                                        };
                                        //释放重复点击
                                        $(this).button("reset");
                                        $(this).css("pointer-events","auto");
                                    },200)
                                }
                            });

                        })
                    }
                })
            }
        })
    }

}