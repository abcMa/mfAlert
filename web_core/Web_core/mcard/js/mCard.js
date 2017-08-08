/**
 * Created by 1 on 2016/12/28.
 */
var mCardWidget = {};
mCardWidget = {
    _UIDEFAULFS: {
        id: 0,
        tab1Full: 1,
        url: "",
        ImgObj: "",
        bgImgObj: "",
        checkVal: true,
        value: "",
        show: false,
        tenantId: "",
        paramStr: "",
        nameFontColor: "#fff",
        introductionFontColor: "#ccc",
        iconColor: "#09f",
        imgurl: "",
        imgName: "",
        imgurlBg: "",
        href: "",
        qrCodeMaxLocation: false,
        website: "",
        websites: "",
        isWebsiteShow: true,
        imgNameBg: "",
        merchantLogo: "",
        qrCodeMaxTime: 0,
        noMcardImgurl: "",
        noMcardMerchantName: "",
        noMcardBriefIntroduction: "",
        noMcardContactPhone: "",
        noMcardAddress: "",
        introduction: "",
        token: ""
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        mCardWidget._uploadPhoto();
        mCardWidget._placeCompanyInfo();
    },
    _initColorpicker: function () {
        //初始化颜色选择器插件
        $("#nameColor").colorpicker({
            color: mCardWidget._UIDEFAULFS.nameFontColor,
            defaultPalette: 'theme',
            history: false,
            transparentColor: true,
            strings: "主题颜色,标准颜色,web颜色,主题颜色,返回调色板,历史记录, 没有历史记录."
        });
        $("#propagandaColor").colorpicker({
            color: mCardWidget._UIDEFAULFS.introductionFontColor,
            defaultPalette: 'theme',
            history: false,
            transparentColor: true,
            strings: "主题颜色,标准颜色,web颜色,主题颜色,返回调色板,历史记录, 没有历史记录."
        });
        $("#iconColor").colorpicker({
            color: mCardWidget._UIDEFAULFS.iconColor,
            defaultPalette: 'theme',
            history: false,
            transparentColor: true,
            strings: "主题颜色,标准颜色,web颜色,主题颜色,返回调色板,历史记录, 没有历史记录."
        });
        $("#nameColor").parent().css("width","55px");
        $("#propagandaColor").parent().css("width","55px");
        $("#iconColor").parent().css("width","55px");
        $("#nameColor").on("change.color", function (event, color) {
            $("#nameColor+.evo-colorind").attr("style", "background-color:" + color);
            $("#order").attr("style", "color:" + color);
            mCardWidget._UIDEFAULFS.nameFontColor = color;
        });
        $("#propagandaColor").on("change.color", function (event, color) {
            $("#propagandaColor+.evo-colorind").attr("style", "background-color:" + color);
            $("#orders").attr("style", "color:" + color);
            mCardWidget._UIDEFAULFS.introductionFontColor = color;
        });
        $("#iconColor").on("change.color", function (event, color) {
            $("#iconColor+.evo-colorind").attr("style", "background-color:" + color);
            $(".iconColor").attr("style", "color:" + color);
            mCardWidget._UIDEFAULFS.iconColor = color;
        });
    },
    _getCanvasImgUrl: function (canObj) {
        var url = "";
        var promise= "";
        Iptools.uidataTool._uploadCanvasData({ //上传裁剪的图片到服务器，得到图片路径
            async: false,
            canvas: canObj,
            type: "picture"
        }).done( function (path) {
            url = Iptools.DEFAULTS.serviceUrl + path;
            promise = url;
        }).fail( function(){
            Iptools.Tool.pAlert({
                type: "danger",
                title: "系统提示",
                content: "上传图片过大",
                delay: 1000
            });
        });
        return promise;
    },
    _uploadPhoto: function () {
        $("#photo").on('change',function () {
            var me = $(this);
            if (me[0].files && me[0].files.length) {
                component._crop({
                    file: me[0].files[0],
                    aspectRatio: 9 / 9, //图片裁剪框比例
                    minCanvasWidth: 360,
                    minContainerHeight: 200,
                    getCanvas: function (canvas) { //点击确定触发
                        mCardWidget._UIDEFAULFS.ImgObj = canvas;
                        $("#inputEmail").val(me[0].files[0].name);
                        $(canvas).css("display","inline-block");
                        $("#campamnyLogo").html(canvas);
                        $("#campamnyLogo").find("canvas").css({"height":"100%","width":"100%"});
                        $("#enrollActivityForm").data("bootstrapValidator").updateStatus("inputEmail", "NOT_VALIDATED").validateField("inputEmail");
                    }
                });
            }
        });
        $("#photoTop").on('change',function (e) {
            var me = $(this);
            if (me[0].files && me[0].files.length) {
                component._crop({
                    file: me[0].files[0],
                    aspectRatio: 9 / 5, //图片裁剪框比例
                    minCanvasWidth: 360,
                    minContainerHeight: 200,
                    getCanvas: function (canvas) { //点击确定触发
                        mCardWidget._UIDEFAULFS.bgImgObj = canvas;
                        $("#inputEmailTop").val(me[0].files[0].name);
                        $(canvas).css("display","inline-block");
                        $("#bgPhoto").html(canvas);
                        $("#bgPhoto").find("canvas").css({"height":"100%","width":"100%"});
                    }
                });
            }
        });
    },
    _placeCompanyInfo: function () {
        //上传企业名称
        $("#uploadName")[0].addEventListener("input", campanyName);
        function campanyName(){
            $("#order").html($("#uploadName").val());
        }
//上传企业宣传语
        $("#propagate")[0].addEventListener("input", campanyPropagate);
        function campanyPropagate(){
            $("#orders").html($("#propagate").val());
        }
//上传业务详情
        $("#business")[0].addEventListener("input", campanyBusiness);
        function campanyBusiness(){
            $(".section-found-second-code").html($("#business").val());
        }
//上传企业网站
        $("#webSite")[0].addEventListener("input", campanyWebSite);
        function campanyWebSite(){
            $("#web").html($("#webSite").val());
        }
//上传手机号码
        $("#tel")[0].addEventListener("input", campanyTel);
        function campanyTel(){
            $("#ptel").html($("#tel").val());
        }
//上传企业地址
        $("#address")[0].addEventListener("input", campanyAddress);
        function campanyAddress(){
            $("#paddress").html($("#address").val());
        }
        //是否显示在"易掌客企业圈"
        $("#sideCircle").on("change",function () {
            mCardWidget._UIDEFAULFS.checkVal = this.checked ? "true" : "false";
            return mCardWidget._UIDEFAULFS.checkVal;
        });
//是否显示网站
        $(".checkLeft").on("change",function () {
            mCardWidget._UIDEFAULFS.value = this.checked ? "true" : "false";
            if(mCardWidget._UIDEFAULFS.value == "true"){
                $(".webActive").removeAttr("style");
            }else{
                $(".webActive").attr("style","display:none;");
            }
        });
    },
    _init: function () {
        mCardWidget._UIDEFAULFS.token = Iptools.DEFAULTS.token;
        mCardWidget._UIDEFAULFS.tenantId = Iptools.DEFAULTS.tenantId;
        mCardWidget._bindingDomEvent();
        mCardWidget._bindingEventAfterLoad();
    },
    _bindingEventAfterLoad: function () {
        mCardWidget._getPersonInfo();
        mCardWidget._checkFormItems();
        mCardWidget._postPersonInfo();
        mCardWidget._qrCodeMax();
        mCardWidget._toValidatorFullForm();
    },
    _toValidatorFullForm: function () {
        $(".tabSwitch").on("show.bs.tab",function () {
            //校验基本信息是否填写完整
            $("#enrollActivityForm").bootstrapValidator('validate');
            if ( !$("#enrollActivityForm").data("bootstrapValidator").isValid() ){
                $("#baseInfo-tablink").css("color","black").html("基本信息");
                $("#baseInfo-tablink").css("color","#a94442").html("基本信息");
                mCardWidget._UIDEFAULFS.tab1Full = 0 ;
            }else{
                $("#baseInfo-tablink").css("color","black").html("基本信息");
                mCardWidget._UIDEFAULFS.tab1Full = 1 ;
            }
        });
//        $("#enrollActivityForm input").on("input",function () {
//            $("#enrollActivityForm").data('bootstrapValidator')
//                .validateField($(this).attr("name"));
//            $("#enrollActivityForm").bootstrapValidator('validate');
//            if ( !$("#enrollActivityForm").data("bootstrapValidator").isValid() ){
//                $("#baseInfo-tablink").css("color","black").html("基本信息");
//                $("#baseInfo-tablink").css("color","#a94442").html("基本信息");
//                mCardWidget._UIDEFAULFS.tab1Full = 0 ;
//            }else{
//                $("#baseInfo-tablink").css("color","black").html("基本信息");
//                mCardWidget._UIDEFAULFS.tab1Full = 1 ;
//            }
//        });
    },
    _qrCodeMax: function () {
        var para = {
            async: false,
            type: "GET"
        };
        para["url"] = "../../Content/JS/properties.xml";
        $.ajax(para).done( function (r) {
            Iptools.DEFAULTS.wxAppidPath = $(r).find("Configs root wxappid").text();
            Iptools.DEFAULTS.wxserverUrlPath = $(r).find("Configs root wxserverUrl").text();
        });
        var qrcodeHref = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + Iptools.DEFAULTS.wxAppidPath + "&redirect_uri=http%3A%2F%2F" + Iptools.DEFAULTS.wxserverUrlPath + "%2Feis%2Fv1%2Fwx%2Fserver%2Fmcard&response_type=code&scope=snsapi_base&state=C" + mCardWidget._UIDEFAULFS.tenantId + "#wechat_redirect";
        Iptools.GetJson({
            url: "service/contact/get_sina_short_url",
            data: {
                shortUrl: qrcodeHref
            }
        }).done( function (data) {
            if(data.retcode == "ok"){
                qrcodeHref = data.retmsg;
            }
            $("#qrcodeCanvas").html("");
            $("#qrcodeCanvas").qrcode({
                render: "canvas", //canvas方式
                width: 180, //宽度
                height: 180, //高度
                background: "#fafafa",//背景颜色
                text: qrcodeHref//任意内容
            });
        });
        mCardWidget._addEventListener({
            container: "body",
            type: "click",
            target: ".unbindToBind",
            event:function(){
                clearInterval(mCardWidget._UIDEFAULFS.qrCodeMaxTime);
                mCardWidget._UIDEFAULFS.qrCodeMaxTime = setInterval(function () {
                    mCardWidget._wxTimeLimit()
                },1000)
            }
        })
    },
    _wxTimeLimit: function () {
        var limitTimeNum = $(".limitTime").html();
        if(limitTimeNum == 0){
            clearInterval(mCardWidget._UIDEFAULFS.qrCodeMaxTime);
            $("#modalBindWX").modal("hide");
            $(".wxWord .limitTime").html(300);
        }else{
            $(".wxWord .limitTime").text(limitTimeNum - 1);
        }
    },
    _getPersonInfo: function () {
//        没有微名片默认获得个人信息里的头像
        Iptools.GetJson({
            url: "basic/getMerchantInfoByTenantId",
            data: {
                tenantId: mCardWidget._UIDEFAULFS.tenantId
            }
        }).done( function (data) {
            mCardWidget._UIDEFAULFS.merchantLogo = data.merchantLogo;
            mCardWidget._UIDEFAULFS.noMcardImgurl = data.merchantLogo;
            mCardWidget._UIDEFAULFS.imgurl = data.merchantLogo;
            mCardWidget._UIDEFAULFS.noMcardMerchantName = data.shortName;
            mCardWidget._UIDEFAULFS.noMcardBriefIntroduction = data.briefIntroduction;
            mCardWidget._UIDEFAULFS.noMcardContactPhone = data.contactPhone;
            mCardWidget._UIDEFAULFS.noMcardAddress = data.address;
            mCardWidget._UIDEFAULFS.website = data.website;
            mCardWidget._UIDEFAULFS.introduction = data.introduction;
        });
        Iptools.GetJson({
            url: "basic/tenantMicroCard/detail",
            data: {
                token: mCardWidget._UIDEFAULFS.token,
                cardTenantId: window.sessionStorage.getItem("tenantId")
            }
        }).done( function( data) {
            if(data){
                placeTenantIdInfo();
            }
        }).fail( function () {
            noMcardPlaceTenantInfo();
        });
//没有微名片铺设基本信息
     function noMcardPlaceTenantInfo () {
         if(mCardWidget._UIDEFAULFS.merchantLogo == null){
             mCardWidget._UIDEFAULFS.merchantLogo = "images/companyLogo.jpg";
         }
         $(".titlePhoto img").attr("src",mCardWidget._UIDEFAULFS.merchantLogo);
         $("#inputEmail").val(mCardWidget._UIDEFAULFS.noMcardImgurl);
         if(mCardWidget._UIDEFAULFS.noMcardMerchantName == null){
             mCardWidget._UIDEFAULFS.noMcardMerchantName = "未添加企业简称";
         }
         $("#order").html(mCardWidget._UIDEFAULFS.noMcardMerchantName);
         $("#uploadName").val(mCardWidget._UIDEFAULFS.noMcardMerchantName);
         var noMcardBriefIntroduction = "";
         if(mCardWidget._UIDEFAULFS.noMcardBriefIntroduction == null){
             noMcardBriefIntroduction = "";
             mCardWidget._UIDEFAULFS.noMcardBriefIntroduction = "未添加企业宣传语";
         }else{
             noMcardBriefIntroduction = mCardWidget._UIDEFAULFS.noMcardBriefIntroduction;
         };
         $("#orders").html(mCardWidget._UIDEFAULFS.noMcardBriefIntroduction);
         $("#propagate").val(noMcardBriefIntroduction);
         if(mCardWidget._UIDEFAULFS.introduction == null){
             $(".section-found-second-code").html("未添加企业业务详情");
         }else{
             $(".section-found-second-code").html(mCardWidget._UIDEFAULFS.introduction);
             $("#business").val(mCardWidget._UIDEFAULFS.introduction);
         };
         if(mCardWidget._UIDEFAULFS.website == null){
             $("#web").html("未添加企业网址");
             $("#webSite").val("http://");
         }else{
             $("#web").html(mCardWidget._UIDEFAULFS.website);
             $("#webSite").val(mCardWidget._UIDEFAULFS.website);
         };
         $("#ptel").html(mCardWidget._UIDEFAULFS.noMcardContactPhone);
         $("#tel").val(mCardWidget._UIDEFAULFS.noMcardContactPhone);
         var noMcardAddress = "";
         if(mCardWidget._UIDEFAULFS.noMcardAddress == null){
             noMcardAddress = "";
             mCardWidget._UIDEFAULFS.noMcardAddress = "未添加企业地址";
         }else{
             noMcardAddress = mCardWidget._UIDEFAULFS.noMcardAddress;
         };
         $("#paddress").html(mCardWidget._UIDEFAULFS.noMcardAddress);
         $("#address").val(noMcardAddress);
         $("#order").attr("style","color:" + mCardWidget._UIDEFAULFS.nameFontColor);
         $("#orders").attr("style","color:" + mCardWidget._UIDEFAULFS.introductionFontColor);
         $(".iconColor").attr("style","color:" + mCardWidget._UIDEFAULFS.iconColor);
         $("#nameColor").val(mCardWidget._UIDEFAULFS.nameFontColor);
         $("#propagandaColor").val(mCardWidget._UIDEFAULFS.introductionFontColor);
         $("#iconColor").val(mCardWidget._UIDEFAULFS.iconColor);
         mCardWidget._initColorpicker();
     };
//有微名片铺设租户基本信息
        function placeTenantIdInfo () {
            Iptools.GetJson({
                url: "basic/tenantMicroCard/detail",
                data: {
                    token: mCardWidget._UIDEFAULFS.token,
                    cardTenantId: window.sessionStorage.getItem("tenantId")
                }
            }).done( function (data) {
                if(mCardWidget._UIDEFAULFS.noMcardMerchantName == ""){
                    mCardWidget._UIDEFAULFS.noMcardMerchantName = data.shortName;
                }
                $("#order").html(mCardWidget._UIDEFAULFS.noMcardMerchantName);
                    if(data.merchantLogo == ""){
                        mCardWidget._UIDEFAULFS.merchantLogo = "images/companyLogo.jpg";
                    }else{
                        mCardWidget._UIDEFAULFS.merchantLogo = data.merchantLogo;
                    }
                $(".titlePhoto img").attr("src",mCardWidget._UIDEFAULFS.merchantLogo);
                if(data.backImg == ""){
                    data.backImg = "images/myCardBg.png";
                }
                $(".bgPhoto img").attr('src',data.backImg);
                if(mCardWidget._UIDEFAULFS.noMcardBriefIntroduction == ""){
                    mCardWidget._UIDEFAULFS.noMcardBriefIntroduction = data.briefIntroduction;
                }
                $("#orders").html(mCardWidget._UIDEFAULFS.noMcardBriefIntroduction);
                $(".section-found-second-code").html(data.description);
                if(data.website != ""){
                    mCardWidget._UIDEFAULFS.website=data.website;
                };
                $("#web").html(mCardWidget._UIDEFAULFS.website);
                if(mCardWidget._UIDEFAULFS.noMcardContactPhone == ""){
                    mCardWidget._UIDEFAULFS.noMcardContactPhone = data.contactPhone;
                }
                $("#ptel").html(mCardWidget._UIDEFAULFS.noMcardContactPhone);
                if(mCardWidget._UIDEFAULFS.noMcardAddress == ""){
                    mCardWidget._UIDEFAULFS.noMcardAddress = data.address;
                }
                $("#paddress").html(mCardWidget._UIDEFAULFS.noMcardAddress);
                $(".all_public_cnt").html(data.all_public_cnt);
                $(".favourite_cnt").html(data.favourite_cnt);
                $(".zanCounter").html(data.zanCounter);
//                右半部分
                if(mCardWidget._UIDEFAULFS.noMcardImgurl == ""){
                    mCardWidget._UIDEFAULFS.noMcardImgurl = data.merchantLogo;
                }
                $("#inputEmail").val(mCardWidget._UIDEFAULFS.noMcardImgurl);
                $("#inputEmailTop").val(data.backImg);
                mCardWidget._UIDEFAULFS.imgurl = data.merchantLogo;
                mCardWidget._UIDEFAULFS.imgurlBg = data.backImg;
                $("#uploadName").val(data.shortName);
                $("#propagate").val(data.briefIntroduction);
                $("#business").val(data.description);
                if(data.isWebsiteShow == true){
                    $(".webActive").removeAttr("style");
                    $("#sideCheck").attr("checked",'true');
                }else{
                    $(".webActive").attr("style","display:none;");
                    $("#sideCheck").removeAttr("checked");
                };
                if(data.isPublic == true){
                    $("#sideCircle").attr("checked",'true');
                }else{
                    $("#sideCircle").removeAttr("checked");
                };
                if (mCardWidget._UIDEFAULFS.website != "") {
                    $("#webSite").val(mCardWidget._UIDEFAULFS.website);
                }else{
                    $("#webSite").val("http://");
                }
                $("#tel").val(data.contactPhone);
                $("#address").val(data.address);
                $("#order").attr("style","color:" + data.nameFontColor);
                $("#orders").attr("style","color:" + data.introductionFontColor);
                $(".iconColor").attr("style","color:" + data.iconColor);
                mCardWidget._UIDEFAULFS.nameFontColor = data.nameFontColor;
                mCardWidget._UIDEFAULFS.introductionFontColor = data.introductionFontColor;
                mCardWidget._UIDEFAULFS.iconColor = data.iconColor;
                $("#nameColor").val(data.nameFontColor);
                $("#propagandaColor").val(data.introductionFontColor);
                $("#iconColor").val(data.iconColor);
                mCardWidget._UIDEFAULFS.checkVal = data.isPublic;
                mCardWidget._initColorpicker();
            });
        };
    },
    _checkFormItems: function () {
        $("#enrollActivityForm").bootstrapValidator({
            fields: {
                inputEmailTop: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        }
                    }
                },
                inputEmail: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        }
                    }
                },
                uploadName: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        }
                    }
                },
                propagate: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        }
                    }
                },
                business: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        }
                    }
                },
                tel: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        }
                    }
                },
                address: {
                    validators: {
                        notEmpty: {
                            message: '必填'
                        }
                    }
                }
            }
        });
    },
    _postPersonInfo: function () {
        $("#postBtn").on("click",function () {
            if(!mCardWidget._UIDEFAULFS.tab1Full){
                $('#baseInfo-tablink').tab('show');
                $("#baseInfo-tablink").css("color","#a94442").html("基本信息（待完善）");
                return false;
            }
            $("#enrollActivityForm").bootstrapValidator('validate');
            if ($("#enrollActivityForm").data("bootstrapValidator").isValid()) {
                if(mCardWidget._UIDEFAULFS.ImgObj != ""){
                    mCardWidget._UIDEFAULFS.imgurl = mCardWidget._getCanvasImgUrl(mCardWidget._UIDEFAULFS.ImgObj);
                }
                if(mCardWidget._UIDEFAULFS.bgImgObj != ""){
                    mCardWidget._UIDEFAULFS.imgurlBg = mCardWidget._getCanvasImgUrl(mCardWidget._UIDEFAULFS.bgImgObj);
                }
                Iptools.GetJson({
                    url: "basic/tenantMicroCard/detail",
                    data: {
                        token: mCardWidget._UIDEFAULFS.token,
                        cardTenantId: window.sessionStorage.getItem("tenantId")
                    }
                }).done(function (data) {
                    if($("small").attr("style") == "display: block;"){
                        $("#todolist-tablink").attr("style","color:#a94442;");
                    }else{
                        $("#todolist-tablink").removeAttr("style");
                        if(data){
                            mCardWidget._putTenantIdInfo();
                        }
                    }
                }).fail( function () {
                    mCardWidget._postTenantIdInfo();
                });
                $(".section-acticle-bar").removeClass("section-acticle-bar-change");
                $(".section-event .nav-left").removeClass("nav-left-change");
            }else{
                Iptools.Tool.pAlert({
                    type: "danger",
                    title: "系统提示",
                    content: "请填写完整信息",
                    delay: 1000
                });
            }
        });
        $(".revertRevise").attr("data-loading-text", "<span class='icon-refresh icon-spin icon-upload-Btn'></span>");
        mCardWidget._addEventListener({
            container: "body",
            target: ".revertRevise",
            type: "click",
            event: function () {
                var me = $(this);
                me.button("loading");
                me.css("pointer-events", "auto");
                Iptools.Tool.pAlert({
                    type: "info",
                    title: "系统提示：",
                    content: "更改已取消",
                    delay: 1000
                });
                setTimeout(function () {
                    me.button("reset");
                    me.css("pointer-events", "none");
                    window.location.reload();//刷新当前页面
                }, 1500);
            }
        });
    },
    _postTenantIdInfo: function () {
        Iptools.GetJson({
            url: "basic/getMerchantInfoByTenantId",
            data: {
                tenantId: mCardWidget._UIDEFAULFS.tenantId
            }
        }).done( function (data) {
            mCardWidget._UIDEFAULFS.id = data.id;
            Iptools.PutJson({
                url: "basic/tenantMerchantInfos",
                data: {
                    id: mCardWidget._UIDEFAULFS.id,
                    token: mCardWidget._UIDEFAULFS.token,
                    shortName: $("#uploadName").val(),
                    briefIntroduction: $("#propagate").val(),
                    merchantLogo: mCardWidget._UIDEFAULFS.imgurl,
                    introduction: $("#business").val,
                    website: $("#webSite").val(),
                    address: $("#address").val(),
                    contactPhone: $("#tel").val()
                }
            }).done( function (data) {
                if(data){
//                    console.log("上传成功了2");
                }
            });
        });
        if ($("#sideCheck").is(':checked') == true) {
            mCardWidget._UIDEFAULFS.isWebsiteShow = true;
        }else{
            mCardWidget._UIDEFAULFS.isWebsiteShow = false;
        }
        Iptools.PostJson({
            url: "basic/tenantMicroCard",
            data: {
                token: mCardWidget._UIDEFAULFS.token,
                description: $("#business").val(),
                website: $("#webSite").val(),
                isWebSiteShow: mCardWidget._UIDEFAULFS.isWebsiteShow,
                isPublic: mCardWidget._UIDEFAULFS.checkVal,
                backImg: mCardWidget._UIDEFAULFS.imgurlBg,
                nameFontColor: mCardWidget._UIDEFAULFS.nameFontColor,
                introductionFontColor: mCardWidget._UIDEFAULFS.introductionFontColor,
                iconColor: mCardWidget._UIDEFAULFS.iconColor
            }
        }).done( function (data) {
            if(data){
                Iptools.Tool.pAlert({
                    type: "info",
                    title: "系统提示",
                    content: "保存成功",
                    delay: 1000
                });
                $("#todolist-tablink").attr("aria-expanded","true");
                $(".nav-tabs > li:nth-child(1)").addClass("active");
                $(".nav-tabs > li:nth-child(2)").removeClass("active");
                mCardWidget._UIDEFAULFS.qrCodeMaxLocation=true;
                window.location.reload();
            }
        }).fail( function () {
            Iptools.Tool.pAlert({
                type: "danger",
                title: "系统提示",
                content: "保存失败",
                delay: 1000
            });
        });
    },
    _putTenantIdInfo: function () {
        Iptools.GetJson({
            url: "basic/getMerchantInfoByTenantId",
            data: {
                tenantId: mCardWidget._UIDEFAULFS.tenantId
            }
        }).done( function (data) {
            mCardWidget._UIDEFAULFS.id = data.id;
            Iptools.PutJson({
                url: "basic/tenantMerchantInfos",
                data: {
                    id: mCardWidget._UIDEFAULFS.id,
                    token: mCardWidget._UIDEFAULFS.token,
                    shortName: $("#uploadName").val(),
                    briefIntroduction: $("#propagate").val(),
                    merchantLogo: mCardWidget._UIDEFAULFS.imgurl,
                    introduction: $("#business").val,
                    website: $("#webSite").val(),
                    address: $("#address").val(),
                    contactPhone: $("#tel").val()
                }
            }).done( function (data) {
                if(data){
//                    console.log("修改成功了2");
                }
            });
        });
        if($("#sideCheck").is(':checked') == true){
            mCardWidget._UIDEFAULFS.isWebsiteShow = true;
        }else{
            mCardWidget._UIDEFAULFS.isWebsiteShow = false;
        }
        Iptools.PutJson({
            url: "basic/tenantMicroCard",
            data:{
                token: mCardWidget._UIDEFAULFS.token,
                description: $("#business").val(),
                website: $("#webSite").val(),
                isWebSiteShow: mCardWidget._UIDEFAULFS.isWebsiteShow,
                isPublic: mCardWidget._UIDEFAULFS.checkVal,
                backImg: mCardWidget._UIDEFAULFS.imgurlBg,
                nameFontColor: mCardWidget._UIDEFAULFS.nameFontColor,
                introductionFontColor: mCardWidget._UIDEFAULFS.introductionFontColor,
                iconColor: mCardWidget._UIDEFAULFS.iconColor
            }
        }).done( function () {
            Iptools.Tool.pAlert({
                type: "info",
                title: "系统提示",
                content: "保存成功",
                delay: 1000
            });
            $("#todolist-tablink").attr("aria-expanded","true");
            $(".nav-tabs > li:nth-child(1)").addClass("active");
            $(".nav-tabs > li:nth-child(2)").removeClass("active");
            mCardWidget._UIDEFAULFS.qrCodeMaxLocation = true;
            window.location.reload();
        }).fail( function () {
            Iptools.Tool.pAlert({
                type: "danger",
                title: "系统提示",
                content: "保存失败",
                delay: 1000
            });
        });
    }
};