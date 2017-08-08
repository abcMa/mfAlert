/**
 * Created by sks on 2017/7/25.
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
        btnStatus:"",
        recordId:""
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
        Iptools.Tool._pushListen('importFile_import_list', function (ms) {
            if(ms){
                $("#imporList").data("stable")._refresh();
                widget._canClick();
            }
        });
        widget._canClick();
        widget._getImportList();
        widget._clickImportFile({
            container:".car-owner",
            applet:"6d2b4deb-9368-4187-b02e-2dd9bca1fe17",
            controls:"0,d36440d0-5ed0-4a28-840b-8762815ad642,eee65201-b116-4497-8b51-96dc556fe5d1,55152f14-8567-4621-b7da-38002b420a34,640878b7-5210-4e9b-87d4-bb7775a5e56c,c6dd16c8-50b5-4a72-a676-273ce3902e13,6f8d1a1f-e54e-4aa1-a300-9b4c9b2b6f50,4645ce85-ee7c-476e-a46c-1642fc194ad0,55bb2c1a-da04-492e-832c-cb5cb1ae125e,c76bf2b1-870a-4ca4-8e5f-1a9fcca1c4eb,3264ff49-4a05-4b4e-9564-f20db50c907a,d13946c3-55b8-4373-b0ab-71b04315e964,600f4989-cb48-4b15-8b41-6bd11b6fc537,77559860-5cdf-4564-9d23-618bcede128c,9c5a0dc7-399e-47a0-a88c-9194d2895057,1be13ae1-ce34-4692-8086-2de15843c5cf,24ce773f-34c4-4ccd-aca2-6763b775d2a7,3870b98d-9860-4cdd-a164-8a4a8693b6da,4df07ef5-bd74-43d8-8298-cc95d7ae84ee,408d2be9-4a9d-449a-86c4-155bf10056a0,791795fc-7f08-44d6-8c97-715b974c3769,79066770-f960-4cd4-8d2c-0ed3cb26e807,50c05a9b-ee16-4d84-9a87-6b2d434b64f0,0c61e6e7-6e10-419e-b5b0-23c10b09f92a,be1904d6-14d9-4e3e-aba3-294b6e969db0,e2533903-289d-4314-875b-a9c4fbdb099b,a080ec21-aaa1-4344-b089-e133f9d805dd,0,302ae7e1-dd83-4c90-81a4-75185850b5c7,a8e4b873-734a-46dd-a664-52986d83a105,6d3feb4f-79a8-47f6-9dd4-758fae7b36dc,f573f839-d809-44b4-add1-220b7762af67,57e5ef7d-c700-47f6-be91-9341d3a81eeb,e4a282e8-554a-4dfc-816a-11bfe624a8ae,acc4c315-9af9-4e19-ac07-316a7455bb5b,26edab39-f58d-47a8-9e82-5e2c6cb6e2aa,a3b5369a-cf7a-49f1-abbc-21dd8434597c,b6743c4a-a7bd-477a-ab51-09ddee9f288d,5d34cd55-087e-4f55-8ea9-63925a297805,e0b583b0-966c-4433-88e4-6554c6f46926,69045eca-214c-404e-949b-6e07c3dda73c,cdf9ab4a-8a39-4554-9231-9c628f47e421,9f170bca-0f80-4db0-bf3f-6a75451412d8,9e93269d-1116-4d76-9ac2-a10b6bb78338,bf1841bb-1bfa-4989-9f2c-7cc97f5469c8,58cbe3f4-cb37-49ba-832f-dfd777172a99,b131db14-6254-4c69-a80d-fe6e63b70a32,a406d368-3850-4d0b-a6bb-8d297bcc7195,8efac31a-93b9-4525-882a-44521d21619b,5e52265b-156f-4b5d-8bc4-71c9d3ee37b6,22ee0f1d-99eb-43d4-9663-3368709a18d4,262e7407-a0c6-473c-975d-d7d50a77df14,55f5c7b4-df67-47ed-b6de-db7ec78843a3,d0667abc-52d8-4cd2-b450-634ace6cc693,dca9b8e1-da96-4a85-8681-3a84e4d46ec3,88bc4df2-7b2e-4b8d-b00c-60175fdb29f3,4b647139-c70c-41e1-8958-80ed48d505c4,2e609dcd-115d-44d3-93ee-af3e0f90bb0f,e1adfc89-4320-4ed6-a7c3-839eab6f78d5,21bae578-9df8-4463-a5fb-07a5bb6d2c52,1dd9da31-bc33-4db2-9eed-368aac6c3ddc,8c7ce5ea-aac2-4961-ad5f-9ecafd323b67,c4c8c8a3-22d0-4a60-bab6-4d8f5981aeb9,2cb19b40-990c-4329-bfb9-405d28cab678,17261e83-0475-446b-a3e2-a6f5f24a0079,7277f088-65a0-4280-8368-4ce592b7c387,b60ea800-d8f8-461f-8b8b-d99b371dc290,fe09c8ad-aecb-4ec4-8ff8-d9983a6771c7,b126e1ea-b952-4a8b-8ab6-7363c739ce1f,0,f49d53b2-4e2b-463a-8acd-30f468db01f7,a5568913-70c9-42ea-a871-89d11cec180d",
            type:"carAndContacts",
        });
        widget._clickImportFile({
            container:".service",
            applet:"f98e6fe4-f51f-4396-9942-b3dc7bde90b5",
            controls:"0,e618749c-205a-48e7-8346-c01bee0246de,a3e962fb-affc-4b96-a566-1baac7328cf8,fbd1d7a9-ddb8-4ba9-bcf9-0ac8f2059308,d558b65d-8fe2-4d6d-8804-81af6910e554,318e2fbc-c7bf-4e7b-81d3-df1b69674ec8,10eedbcb-3ac0-49b2-80f1-bbbbcf567fbc,912bda4d-310c-48ea-a34c-1989045ef101,aa995bbe-166e-40f5-910d-dd7a92c9b1f8,efef6feb-6165-4fdf-a76d-98e94d6b9ba5,058ff46f-5030-46da-9feb-c3e08e878a97,bfade905-5b48-40d9-8c90-8d4a27664bd3,40954326-9f0e-4bb7-a1e0-a12e5ec7f8cb,3002557c-2d26-4942-aa79-9de73c07dd2e,efc8aa9b-9623-43fb-a660-e02d43c687e9,a6ccf1bc-3f57-4ab2-bdd1-a422092852e5,78edffdd-9cf4-4a39-b551-b0211201f22f,bca6efa0-c72f-407d-a877-d5fda670605e,30e249a9-ccd9-4825-b66a-a952c9570a04,44c2965e-6628-41b7-b5b7-6ab4e38c27b0,be258289-c976-456e-9cc2-7928699ab6c3,ebef0dec-4218-4ae8-9065-516599e55066,50365738-fe62-423f-9763-9b2ddcfd27b5,8dcf767b-7648-4551-878c-1b448846667f,64ce79d2-3462-44d7-9936-43aabb9f4df3,adedaacd-cde1-4e32-8420-f08e84ba8081,aabd90e5-ba72-4999-b5b5-202dcf9ed681,948d5b9e-8493-40c7-b990-17be448bcb2d",
            type:"sr",
        });
        widget._clickImportFile({
            container:".parts",
            applet:"dde0e047-7341-435d-b1f4-4b62703518ce",
            controls:"0,3c181711-c99d-4d69-a0fd-07f3ac79e54b,6ec44d96-21fe-4865-85c0-67d837b09752,a622dd31-9040-4c4c-9bcd-f07751cf3b61,aa58478a-2010-4fb5-8fd8-6989fa46f684,06066a7e-633a-41c0-86b4-7aef99747279,1b93a1f4-276b-4ba0-a157-e87a580487ef,96b890f5-0993-406a-b368-ca536fa54e28,6ba59d27-e851-4c87-97c1-fb3e588b97a9,1db66f37-6ff4-4d14-b8f8-3d733d36055b,7752559d-8f54-48db-8dbd-7517261cf761,3f15ad79-bfad-4c6c-9a88-c77fb88464de,a2a18ddb-2382-4eec-a2b0-9753b1f73165,b597b2d6-3462-48f3-b996-99354c97ea06,e13cfeda-d2a4-4f4c-b045-efb3b5451473,9c2f5e0e-4945-4636-bc5c-b89031a15e77,f493c88b-ffe8-4fac-b121-07cc49bc3bde,947e5acd-18a7-432d-802e-e6a2f99dd42d,29bb13be-6efc-43ad-9d2a-80b5dec6c146,b183a7c3-5cce-4404-9eac-aeb0006c9760,c130e86a-9caf-464b-8537-16704cbb8d9d,b2192130-ee01-4229-b82e-e627399d55e9,9331e8fc-07c9-4fbc-b5a6-104863ff7424,56747edb-a099-4446-9013-82f2b11b1bf2,1b87484a-0ecf-4713-a5fc-496663793c38",
            type:"accessory",
        });
        widget._clickImportFile({
            container:".new-car-sale",
            applet:"e1d54b0f-0248-4ade-aa34-a4d366d47f24",
            controls:"be7b783d-fb41-4f87-b94f-6ddbb06ebf71,d5a287c2-f7cd-467d-95d1-0b67ef5b851f,a5c2948b-f924-497d-8dd7-88cd1d29292b,50be4303-1624-431b-b19e-f07f87faf9be,3cf1c4a4-5f05-490d-b1e9-54d17610d9c4,93d48d03-d837-451e-8e89-b9dd90f52ac3",
            type:"soldCar",
        });
        widget._showTime({
            con:'{"'+widget._UIDEFAULFS.importRoot+':type":"=\'sr\'"}',
            container:".service"
        })
        widget._showTime({
            con:'{"'+widget._UIDEFAULFS.importRoot+':type":"=\'carAndContacts\'"}',
            container:".car-owner"
        })
        widget._showTime({
            con:'{"'+widget._UIDEFAULFS.importRoot+':type":"=\'accessory\'"}',
            container:".parts"
        })
        widget._showTime({
            con:'{"'+widget._UIDEFAULFS.importRoot+':type":"=\'soldCar\'"}',
            container:".new-car-sale"
        })
        widget._bindingDomEvent();
        widget._bindingEventAfterLoad();
    },
    /*加载导入列表*/
    _getImportList:function(){
        Iptools.uidataTool._getCustomizeApplet({
            async:false,
            nameList: "'import_records_list'"
        }).done(function(data){
            widget._UIDEFAULFS.importAppletId = data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                async:false,
                applet: widget._UIDEFAULFS.importAppletId,
            }).done(function(r){
                widget._UIDEFAULFS.importRoot = r.rootLink;
                component._table("#imporList", {
                    applet: data.applets[0].applet,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "没有导入记录",
                    emptyClick: function () {
                    },
                    jumpType: "template",
                    jumpTemplate: '<a class="fa original-file" title="下载原始数据文件" href=""></a>&nbsp;&nbsp;<span class="fa fa-spin fa-spinner iconFile"></span><a class="fa wrong-file" href=""></a>',
                    //点击自己配置的按钮后的事件
                    events: [
                        {
                            target: ".start-import-btn",
                            type: "click",
                            event: function () {
                                Iptools.PostJson({
                                    url:"/basic/import/4s/runThread",
                                    data:{
                                        token:Iptools.DEFAULTS.token
                                    }
                                }).done(function(r){
                                    if(r){
                                        if(r.retcode == "ok"){
                                            widget._UIDEFAULFS.recordId = r.recordId;
                                            Iptools.uidataTool._pushMessage({
                                                channel: r.recordId, //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                                            });
                                        }else if(r.retcode == "fail"){
                                            Iptools.Tool.pAlert({
                                                title: "系统提示",
                                                content: r.retmsg
                                            });
                                        }
                                    }
                                })
                            }
                        },
                    ],
                    multiPanel: false,
                    afterLoad: function () {
                        var counts = $("#imporList .s-table .s-column span.iconFile");
                        var index = "";
                        var data=$("#imporList").data("stable").options.data;
                        $(counts).parent().find(".original-file").addClass("fa-file-text-o").css("color","#09f");
                        if(data && data.records){
                            counts.each(function (key, obj) {
                                index = key;
                                $(obj).parent().find(".original-file").attr("href",Iptools.DEFAULTS.serviceUrl+data.records[key][widget._UIDEFAULFS.importRoot+":file_original_path"]);
                                if(data.records[key][widget._UIDEFAULFS.importRoot+":status"]["id"] == 1){
                                    //导入中
                                }else if(data.records[key][widget._UIDEFAULFS.importRoot+":status"]["id"] == 2){
                                    //导入完成
                                    if(data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"]){
                                        if(data.records[key][widget._UIDEFAULFS.importRoot+":fail_rows"] > 0){
                                            $(obj).parent().find(".wrong-file").addClass("fa-file-o").css("color","#f66").attr({
                                                "href":Iptools.DEFAULTS.serviceUrl+data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"],
                                                "title":"下载错误数据文件"
                                            });
                                        }
                                    }
                                }else if(data.records[key][widget._UIDEFAULFS.importRoot+":status"]["id"] == 3){
                                    //导入失败
                                    if(data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"]){
                                        $(obj).parent().find(".wrong-file").addClass("fa-file-o").css("color","#f66").attr({
                                            "href":Iptools.DEFAULTS.serviceUrl+data.records[key][widget._UIDEFAULFS.importRoot+":file_records_path"],
                                            "title":"下载错误数据文件"
                                        });
                                    }
                                }
                            })
                        }
                        $(counts).remove();
                    }
                })
            });
        })
    },
    //点击上传文件
    _clickImportFile:function(option){
        $(option.container)[0].addEventListener('change', function(e){
            var me = $(this);
            me.parent().find(".file-click").css({"pointer-events":"none"});
            me.parent().find(".file-click").button("loading");
            //点击之后按钮的状态设置为1;
            window.localStorage.setItem(me.parent().find("h5").attr("data-text"),"1");

            var file = $(this).find("input")[0].files[0];
            var fileName = file.name;
            $(option.container).addClass("active");
            var paraData = new FormData();
            paraData.append("file", file);
            $.ajax({
                async: false,
                url: (Iptools.DEFAULTS.API_URL + "basic/import/?token=" + Iptools.DEFAULTS.token+"&appletId="+ option.applet+"&controls="+option.controls+"&filename="+fileName+"&channel=importFile_import_list&type="+option.type+"&isHangup=true"),
                type: "POST",
                data: paraData,
                processData: false,
                contentType: false,
                success:function(r){
                    if(r){
                        $(option.container).removeClass("active");
                        me.parent().find(".file-click").css({"pointer-events":"auto"});
                        me.parent().find(".file-click").button("reset");
                        window.localStorage.setItem(me.parent().find("h5").attr("data-text"),"0");
                        $("#imporList").data("stable")._refresh();
                        widget._canClick();
                    };
                },
                error:function(r){

                },
            })
            $(".uploadFile input.importFile").val("");
        }, false);
    },
    /*每一种类型的文件显示的最近上传时间*/
    _showTime:function(option){
        Iptools.uidataTool._getUserlistAppletData({
            appletId:widget._UIDEFAULFS.importAppletId,
            condition:option.con,
            pageNow:1,
            pageSize:1
        }).done(function(r){
            if(r && r.data && r.data.records){
                var textHtml = r.data.records[0][widget._UIDEFAULFS.importRoot+':create_time'].split(" ")[0]
                $(option.container).find(".import-time .time").html(textHtml)
            }else{
                $(option.container).find(".import-time .time").html("没有上传文件")
            }
        })
    },
    /*判断上传按钮是否可点击*/
    _canClick:function(){
        Iptools.GetJson({
            url:"/basic/import/4s/selectImportCount",
            data:{
                token:Iptools.DEFAULTS.token
            }
        }).done(function(r){
            //console.log(r)
            if(r){
                if(window.localStorage.getItem("is_parts") == "1"){
                    $(".parts a.file-click").css({"pointer-events":"none"});
                    $(".parts a.file-click").button("loading");
                }else{
                    if(r.accessory == 0){
                        //表示的是配件发料
                        $(".parts a.file-click").css({"pointer-events":"auto"});
                        $(".parts a.file-click").button("reset");
                        $(".parts input[type='file']").removeAttr("disabled");
                    }else if(r.accessory > 0) {
                        $(".parts input[type='file']").attr("disabled","true");
                    }
                }
                if(window.localStorage.getItem("is_car") == "1"){
                    $(".car-owner a.file-click").css({"pointer-events":"none"});
                    $(".car-owner a.file-click").button("loading");
                }else{
                    if(r.carAndContacts == 0){
                        $(".car-owner a.file-click").css({"pointer-events":"auto"});
                        $(".car-owner a.file-click").button("reset");
                        //车辆车主导入
                        $(".car-owner input[type='file']").removeAttr("disabled");
                    }else if(r.carAndContacts> 0){
                        $(".car-owner input[type='file']").attr("disabled","true");
                    }
                }
                if(window.localStorage.getItem("is_service") == "1"){
                    $(".service a.file-click").css({"pointer-events":"none"});
                    $(".service a.file-click").button("loading");
                }else{
                    if(r.sr == 0){
                        //维修记录导入
                        $(".service a.file-click").css({"pointer-events":"auto"});
                        $(".service a.file-click").button("reset");
                        $(".service input[type='file']").removeAttr("disabled");
                    }else if(r.sr > 0){
                        $(".service input[type='file']").attr("disabled","true");
                    }
                }
                if(window.localStorage.getItem("is_service") == "1"){
                    $(".new-car-sale a.file-click").css({"pointer-events":"none"});
                    $(".new-car-sale a.file-click").button("loading");
                }else{
                    if(r.soldCar == 0){
                        //新车销售导入
                        $(".new-car-sale a.file-click").css({"pointer-events":"auto"});
                        $(".new-car-sale a.file-click").button("reset");
                        $(".new-car-sale input[type='file']").removeAttr("disabled");
                    }else if(r.soldCar > 0){
                        $(".new-car-sale input[type='file']").attr("disabled","true");
                    }
                }
            }
        })
    }
}
