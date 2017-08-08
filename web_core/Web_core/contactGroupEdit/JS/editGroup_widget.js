//客户群详情页widget.js  2017-04-12
var widget = {};
widget = {
    _UIDEFAULFS: {
        groupId : "",
        conGroupPageNow : 1,
        conGroupPageSize : 10,
        oldGroupTitle : "",//编辑前的客户群名称
        oldGroupDes : "",//编辑前客群的描述
        oldGroupReson : "",//编辑前客群的分群依据
        oldConLen : ""//已有客户的数量---为了判断是否客户 编辑前与编辑后有更改
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
        widget._clickDel();
        widget._saveEditGroup();
    },
    _bindingEventAfterLoad: function () {//插件的初始化

    },
    _init: function () {
        widget._bindingDomEvent();
//        var options = {
//            view: Iptools.DEFAULTS.currentView,//
//            valueId: Iptools.DEFAULTS.currentViewValue,//客户群的id
//            userId:Iptools.DEFAULTS.userId
//        };
        widget._UIDEFAULFS.groupId = Iptools.DEFAULTS.currentViewValue;
        common._check();
        widget._getGroupInContact(widget._UIDEFAULFS.groupId);//获得该客群下的客户
    },
    _getGroupInContact: function(groupId){
        Iptools.GetJson({
            ajaxCounting:false,
            url:"basic/queryContactgroupDetail",
            data:{
                token:Iptools.DEFAULTS.token,
                id:groupId,
                pageNow:widget._UIDEFAULFS.conGroupPageNow,
                pagesize:widget._UIDEFAULFS.conGroupPageSize
            }
        }).done(function(data){
            widget._UIDEFAULFS.oldGroupTitle = data.cg.title;
            widget._UIDEFAULFS.oldGroupDes = data.cg.description;
            var resStr = '';
            if(data.cg.groupReason){
                var resType = data.cg.groupReason;

                switch(resType){
                    case '消费频次': resStr = "1";
                        break;
                    case '客户价值': resStr = "2";
                        break;
                    case '接触渠道': resStr = "3";
                        break;
                    case '客户运营阶段': resStr = "4";
                        break;
                }

            }
            widget._UIDEFAULFS.oldGroupReson = data.cg.groupReason;
//            console.log(typeof(data.cg.groupReason));
            if(data.cg.groupReason == '1' || data.cg.groupReason == '2' || data.cg.groupReason == '3' || data.cg.groupReason == '4'){
                $('.divide select').val(data.cg.groupReason);
            }else{
                $('.divide select').val(resStr);
            }
            $('.name .content input').val(widget._UIDEFAULFS.oldGroupTitle);
            $('.detial-des .content textarea').val(widget._UIDEFAULFS.oldGroupDes);
            widget._renderContentPage(data);
        })
    },
    _renderContentPage: function(dataParam){
        if(dataParam.contacts.records.length > 0){
            component._pager({
                container: "pager-example-panel",
                pageSize: dataParam.contacts.records.length,
                pageCount: dataParam.contacts.pageCount,//总页数
                rowCount: dataParam.contacts.rowCount,//总条数
                pageNow: dataParam.contacts.pageNow,
                jump: function (page) {
                    widget._UIDEFAULFS.conGroupPageNow = page;
                    widget._getGroupInContact(widget._UIDEFAULFS.groupId);
                }
            });
            $(".tool-text.tool-size .num").html(dataParam.contacts.records.length);
            widget._UIDEFAULFS.oldConLen =  dataParam.contacts.records.length;

            $('.onlineCount i').html(dataParam.contacts.rowCount);
            var conatctData = dataParam.contacts.records;
            $(".selContactContent tbody").html('');
            var listobj = conatctData;
            $.each(listobj,function(key,obj){
                Iptools.GetJson({
                    url:"basic/contactTagLinks",
                    data:{
                        token:Iptools.DEFAULTS.token,
                        contactId:obj["id"]
                    }
                }).done(function(data){
                    common._UIDEFAULFS.haveExistCon.push(obj['id']);
//                    oldConId.push(obj['id']);
                    var tagArr = [];
                    $.each(data,function(key,objT){
                        tagArr.push(objT.tagValue);
                    });
                    var conName = "";
                    if(obj['title'] && obj['title'] != 'undefined'){
                        conName = obj['title'];
                    }

                    var html = '<tr><lable for="contactItem">'+
                        '<td><input type="checkbox" class="blueCheckbox" name="contactItem" data-id="'+obj['id']+'"></td>'+
                        //                        '<td>'+(i+1)+'</td>'+
                        '<td>'+conName+'</td>';
                    if(obj['phone']){
                        html += '<td>'+obj['phone']+'</td>';
                    }else{
                        html += '<td></td>';
                    }

                    if(tagArr){
                        html += '<td>';
                        $.each(tagArr,function(key,obj){
                            if(tagArr.indexOf(obj)<3){
                                html +=  '<span class="label tag label-info">'+obj+'</span>';
                            }
                        });
                        html +=  '</td>';
                    }else{
                        html += '<td></td>';
                    };
                    if(obj['contactType']){
                        var typeStr = '';
                        if(obj['contactType'] == '2'){
                            typeStr = '潜在客户'
                        }else if(obj['contactType'] == '3'){
                            typeStr = '消费客户'
                        }else{
                            typeStr = '会员客户'
                        }
                        html += '<td>'+typeStr+'</td>';
                    }else{
                        html += '<td></td>';
                    };
                    if(obj['Channel']){
                        html += '<td>'+obj['Channel']+'</td>';
                    }else{
                        html += '<td></td>';
                    };
                    html += '</lable></tr>';
                    $(".selContactContent tbody").append(html);
                })
            });
        }else{
            $('.finalAll').attr('disabled',true);
            $('.nodata').show();
        }
    },
    _checkConLength: function(){//判断编辑后客户的数量变没变
        var count = 1;
        $(".selContactContent tr td:first-child input").each(function(){
            var index = $.inArray(Number($(this).attr('data-id')),common._UIDEFAULFS.haveExistCon);  //判断
            if(index == -1){//有不在的就证明跟之前不同了
                count++;
            }
        });
        return count;
    },





//    ----------------------事件监听--------------------------------------------------------------------------------
    _saveEditGroup: function(){
        widget._addEventListener({
            container: "body",
            target: "#buttonListPanel .newDataBtn",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $('form').bootstrapValidator('validate');
                if(!$('form').data("bootstrapValidator").isValid()){
                    return false;
                }
                $(this).css({
                    "pointer-events":"none"
                });
                $(this).button("loading");
                var conSize = $('.selContactContent tbody tr').size();
                var finalSelData = [];
                var finalSelName = [];
                var groupTitle = $('.name .content input').val();
                var groupDes = $('.detial-des .content textarea').val();
                var groupRes = $('.divide .content select').val();
                //下面所选客户的数组
                $(".selContactContent tr td:first-child input").each(function(i){
                    if($(this).attr('isconnew') == 'new'){
                        finalSelData.push($(this).attr('data-id'));
                        finalSelName.push($(this).parent().siblings().html());
                    }

                });

                //如果没有改动的话，不需要put，有改动则put
                if(groupTitle == widget._UIDEFAULFS.oldGroupTitle && groupDes == widget._UIDEFAULFS.oldGroupDes && groupRes == widget._UIDEFAULFS.oldGroupReson){
                    if(conSize == widget._UIDEFAULFS.oldConLen){
                        if(widget._checkConLength() == 1 || conSize == 0){
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "客户群更新成功"
                            });
                            if (Iptools.Tool._getVersion() == 'v1') {
                                Iptools.Tool._redirectToParent();
                            } else {
                                Iptools.uidataTool._getView({
//            async: false,
                                    view: Iptools.DEFAULTS.currentView
                                }).done(function(r){
                                    Iptools.Tool._CloseTab({
                                        view: Iptools.DEFAULTS.currentView,
                                        name: r.view.name,
                                        valueId:widget._UIDEFAULFS.groupId,
                                        type: r.view.type,
                                        url: r.view.url,
                                        refresh:true,
                                        bread: true
                                    });
                                })
                            };
                            return false;
                        }
                    }
                    //与之前的相同，不做put
                }else{
                    //拿到rootGroupId
                    var rootId;
                    Iptools.uidataTool._getApplet({
                        applet:common._UIDEFAULFS.groupDetailApplet//4767
                    }).done(function(data){
                        if(data){
                            rootId = data.rootLink;
                            var difColumn = '';
                            var disText = '';
                            var title = '';
                            Iptools.uidataTool._saveAppletData({
                                appletId:common._UIDEFAULFS.groupDetailApplet,//4767
                                valueId:widget._UIDEFAULFS.groupId,
                                data:'{"'+rootId+':title":"'+groupTitle+'","'+rootId+':description":"'+groupDes+'","'+rootId+':group_reason":"'+groupRes+'"}'
                            }).done(function(data){
                                if(data.retcode == 'ok'){
                                    //客户群更新成功后，将客户群动态---更新---动作post到动态里
                                    //判断哪个字段进行了更新
                                    if(groupTitle != widget._UIDEFAULFS.oldGroupTitle){
                                        difColumn = $('.name .content label').html();
                                        disText = groupTitle;
                                        title = difColumn+':'+disText;
                                        Iptools.uidataTool._addAppletData({
                                            appletId:trace._UIDEFAULFS.groupTraceDeApplet,//8144
                                            data:'{"'+trace._UIDEFAULFS.groupTraceDeRoot+':title":"'+title+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':contactgroup_id":"'+widget._UIDEFAULFS.groupId+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':trace_type":"3"}'
                                        }).done(function(data){
//                            console.log('客户群的名称更改动态')
                                        })
                                    }
                                    if(groupRes != widget._UIDEFAULFS.oldGroupReson){
                                        difColumn = $('.divide .content label').html();
                                        disText = $('.divide .content option:selected').text();
                                        title = difColumn+':'+disText;
                                        Iptools.uidataTool._addAppletData({
                                            appletId:trace._UIDEFAULFS.groupTraceDeApplet,//8144
                                            data:'{"'+trace._UIDEFAULFS.groupTraceDeRoot+':title":"'+title+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':contactgroup_id":"'+widget._UIDEFAULFS.groupId+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':trace_type":"3"}'
                                        }).done(function(data){
//                            console.log('客户群的分群依据更改动态')
                                        })
                                    }
                                    if(groupDes != widget._UIDEFAULFS.oldGroupDes){
                                        difColumn = $('.detial-des .content label').html();
                                        disText = groupDes;
                                        title = difColumn+':'+disText;
                                        Iptools.uidataTool._addAppletData({
                                            appletId:trace._UIDEFAULFS.groupTraceDeApplet,//8144
                                            data:'{"'+trace._UIDEFAULFS.groupTraceDeRoot+':title":"'+title+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':contactgroup_id":"'+widget._UIDEFAULFS.groupId+'","'+trace._UIDEFAULFS.groupTraceDeRoot+':trace_type":"3"}'
                                        }).done(function(data){
//                            console.log('客户群的描述更改动态')
                                        })
                                    };
//                    console.log('客户群编辑陈宫----不包含增删客户');
                                }
                            })
                        }
                    })
                };
                var paramData={
                    "token":Iptools.DEFAULTS.token,
                    "contactgroupId": widget._UIDEFAULFS.groupId,
                    "contactIds":finalSelData.join()
                }
                //将客户添加到客户群
                Iptools.PostJson({
                    ajaxCounting:false,
                    url:"basic/linkContactgroup",
                    data:paramData
                }).done(function(data){
                    if(data){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "客户群更新成功"
                        });
                        //下面所选客户的数组
                        $(".selContactContent tr td:first-child input").each(function(i){
                            if($(this).attr('isconnew') == 'new'){
                                var con_name = $(this).parent().siblings().html();
                                if(!con_name){
                                    con_name = $(this).parent().siblings('td:nth-child(3)').html();
                                }
                                var con_id = $(this).attr('data-id');
                                //客户群方
                                trace._addToGroupGroTrace(con_name,widget._UIDEFAULFS.groupId,con_id);
                                //客户方
                                trace._addToGroupTrace(Iptools.DEFAULTS.userId,$('.name .content input').val(),con_id,widget._UIDEFAULFS.groupId);
                            }

                        });
                    }
                });
                setTimeout(function(){
                    //返回上一页
                    if (Iptools.Tool._getVersion() == 'v1') {
                        Iptools.Tool._redirectToParent();
                    } else {
                        Iptools.uidataTool._getView({
//            async: false,
                            view: Iptools.DEFAULTS.currentView
                        }).done(function(r){
                            Iptools.Tool._CloseTab({
                                view: Iptools.DEFAULTS.currentView,
                                name: r.view.name,
                                valueId:widget._UIDEFAULFS.groupId,
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
    },
    _clickDel: function () {
        widget._addEventListener({
            container: "body",
            target: ".del",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                //下面所选客户的数组
                $(".selContactContent tr td:first-child input:checked").each(function(i){
                    if($(this).attr('isconnew') == 'new'){
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "移除客户成功"
                        });
                    }else{
                        var conId = $(this).attr('data-id');
                        //删除客户的动态信息---type为5
                        //客户群方
                        trace._delToGroupGroTrace($(this).parent().siblings().html(),widget._UIDEFAULFS.groupId);
                        //客户方
                        trace._delToGroupTrace(Iptools.DEFAULTS.userId,$('.name .content input').val(),conId);
                        //老客户需要删除---在该客户群中
                        Iptools.PostJson({
                            ajaxCounting:false,
                            url:"basic/delContactFromGroup",
                            data:{
                                token:Iptools.DEFAULTS.token,
                                contactgroupId:widget._UIDEFAULFS.groupId,
                                contactIds:conId
                            }
//                    async:false
                        }).done(function(data){
                            if(data){
                                $('input[data-id="'+conId+'"]').parent().parent().remove();
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "移除客户成功"
                                });
                            }
                        })
                    };
                    //移除后，將移除的客戶id從selData里去掉，不然再移就添加不進去
                    for(var i=0;i<common._UIDEFAULFS.haveExistCon.length;i++){
                        if(common._UIDEFAULFS.haveExistCon[i] == $(this).attr('data-id')){
                            common._UIDEFAULFS.haveExistCon.splice(i,1);//从下标为i的元素开始，连续删除1个元素
                            i--;//因为删除下标为i的元素后，该位置又被新的元素所占据，所以要重新检测该位置
                        }
                    };
                    $(this).parent().parent().remove();//新客户只是隐藏，不与后台交互
                });
                if($('.selContactContent tbody tr').size() == 0){
                    $('.finalAll').attr('disabled',true);
                    $('.finalAll').prop('checked',false);
                    $('.onlineCount.del').removeClass("delToRed");
                    $('.onlineCount.del button').attr('disabled',true);
                    $('#pager-example-panel').hide();
                    $('.nodata').show();
                }
                //重新鋪設客戶數據
                common._getPersonCount();
                $('.del').removeClass('delToRed');
                $('.finalAll').prop('checked',false);
            }
        });
    }
};