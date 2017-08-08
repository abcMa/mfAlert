// IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :Login
/**
 ui element styles and placement
 this widget is only adapted to CRM workspace for PC
 style :tag panels listing and horizend placements style
 **/
var widget = {};
widget = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        login: "#login_name",
        pwd: "#login_pwd",
        rem: "#check_remember",
        phone:"#resetPhone",
        validates:"#usercode",
        pwds:"#password",
        form: "#login_form",
        forms: "#resetForm",
        setReset: ".setReset",
        setLogin: ".setLogin",
        setRegister: ".setRegister",
        getPhoneCode: "#getPhoneCode",
        iconNewPwd: ".iconNewPwd",
        resetBtn: ".resetBtn",
        registerBtn: ".registerBtn",
        phoneCodeCycleLimit: 60,
        phoneCodeCycleInterval: "",
        phoneCodeCycleLimitR: 60,
        phoneCodeCycleIntervalR: "",
        valPage: "",
        authToken: "",
        authTokenR: "",
        tenantId: "",
        option: "",
        phoneCode: "#getempliyPhoneCode",
        captchaToken:""

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
        widget._enableLoginSubmit();//点击登录按钮，登录易掌客CRM端
        widget._enableResetSubmit();//点击重置按钮，重置基本信息
        widget._enableValidate();//点击获取验证码，获取重置验证码
        widget._setResetSwitch();//点击眼睛，显示或者隐藏密码
        widget._checkAgreement();//易掌客注册协议，点击事件
        widget._getPhoneCode();//获得验证码，验证手机号
        widget._enableSubmitRegister();//点击免费试用，提交试用用户
        widget._enableGotoLogin();//点击直接登录，进入到登录页面
        widget._enableGotoAgreement();//点击注册协议，在新窗口打开注册协议
        widget._enableClickImg();//点击注册协议，在新窗口打开注册协议
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {

        widget._getLocationValue();//初始化获得url的值，显示登录或者申请试用页面
        widget._bindingDomEvent();
//        widget._setDomain();
        widget._autoLogin();//是否url携带参数，携带直接进入CRM端
        widget._echoLoginName();//从session中捞取用户名(手机号码)
        widget._getWindowHeight();//获得屏幕的宽高，设置图片高度
        widget._toReset();//点击进入重置密码页面
        widget._tosetLogin();//点击进入登录页面
        widget._initGetImgCode();//点击进入登录页面
        widget._getIndustryData();//初始化页面铺设行业基本信息
    },
    _getLocationValue: function () {
        var urlDatas = window.location.href.split("?")[1];
        var valPhone = "";
        if(urlDatas){
            var count = urlDatas.match(/=/g).length;
        }
        if(count > 1) {
            var urlData = urlDatas.split("&");
            for (var i = 0, arr = []; i < urlData.length; i++) {
                arr[urlData[i].split("=")[0]] = urlData[i].split("=")[1];
            }
            widget._UIDEFAULFS.valPage = arr.valData;
            valPhone = arr.phone;
        }else if(count == 1){
            widget._UIDEFAULFS.valPage = window.location.href.split("=")[1];
        }
        if(widget._UIDEFAULFS.valPage == "reg"){
            $(".form-login-reset").hide();
            $(".register-area").show();
        }
        if(widget._UIDEFAULFS.valPage == "log"){
            $(".form-login-reset").show();
            $(".register-area").hide();
            if(valPhone != ""){
                $("#login_name").val(valPhone);
            }
        }
    },
//    _getUrlparameter: function (options) {
//        var reg = new RegExp("(^|&)" + options.name + "=([^&]*)(&|$)", "i");
//        var r = window.location.search.substr(1).match(reg);
//        if (r != null) return unescape(r[2]); return null;
//    },
    _autoLogin: function () {
//        var name = widget._getUrlparameter({ name: "loginName" });
//        var pwd = widget._getUrlparameter({ name: "loginPwd" });
//        if (Iptools.Tool._checkNull(name) && Iptools.Tool._checkNull(pwd)) {
//            $(widget._UIDEFAULFS.login).val(name);
//            widget._loginAuto({
//                loginName: name,
//                loginPwd: pwd
//            });
//        }
    },
    _loginAuto: function (options) {
//        if (Iptools.getDefaults({ key: "tenantId" })) {
        Iptools.GetJson({
            url: "service/login",
            data: {
                loginName: options.loginName,
                loginPwd: options.loginPwd,
//                    tenantId: Iptools.getDefaults({ key: "tenantId" })
            }
        }).done(function (r) {
            if (r.employee == undefined) {
                Iptools.Tool.pAlert({
                    type: "danger",
                    title: "系统提示：",
                    content: "用户名或密码错误！",
                    delay: 1000
                });
            } else {
                Iptools.setDefaults({ key: "tenantId", value: r.employee.tenantId });
                Iptools.setDefaults({ key: "userId", value: r.employee.id });
                Iptools.setDefaults({ key: "loginName", value: options.loginName });
                Iptools.setDefaults({ key: "userTitle", value: r.employee.name });
                self.location = "../Mainleft";
            }
        });
//        } else {
//            Iptools.Tool.Alert({
//                title: "系统提示",
//                content: "域名未解析"
//            });
//        }
    },
    _setDomain: function () {
//        Iptools.setDefaults({ key: "domain", value: "standard" });
//        Iptools.setDefaults({ key: "tenantId", value: "33" });
//        var domain = window.location.host.split('.')[0];
//        Iptools.GetJson({
//            async: false,
//            url: "basic/tenants/getByDomain",
//            data: {
//                domain: domain,
//            }
//        }).done(function (r) {
//            if (r && r.tenantId) {
//                Iptools.setDefaults({ key: "domain", value: r.domain });
//                Iptools.setDefaults({ key: "tenantId", value: r.tenantId });
//                Iptools.DEFAULTS.domain = domain;
//                Iptools.DEFAULTS.tenantId = r.tenantId;
//                if (r.companyInfo) {
//                    document.title = r.companyInfo + "——登录页";
//                }
//                widget._checkCookies();
//            }
//        }).fail(function () {
//            Iptools.Tool.Alert({
//                title: "系统提示",
//                content: "域名错误"
//            });
//        });
//        if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "loginName" }))) {
//            $(widget._UIDEFAULFS.login).val(Iptools.getDefaults({ key: "loginName" }));
//        }
    },
    _checkCookies: function () {
        var cookieLogin = window.localStorage.getItem("loginName");
        var cookiePwd = window.localStorage.getItem("loginPwd");
        if (Iptools.Tool._checkNull(cookieLogin) && Iptools.Tool._checkNull(cookiePwd)) {
            widget._autoLogin({
                loginName: cookieLogin,
                loginPwd: cookiePwd
            });
        }
    },
    _login: function (options) {
//        if (Iptools.getDefaults({ key: "tenantId" })) {
        Iptools.GetJson({
            url: "service/login",
            data: {
                loginName: options.loginName,
                loginPwd: $.md5(options.loginPwd),
//                    tenantId: Iptools.getDefaults({ key: "tenantId" })
            }
        }).done(function (r) {
            if (r.retcode != "ok") {
                Iptools.Tool.pAlert({
                    type: "danger",
                    title: "系统提示：",
                    content: r.retmsg,
                    delay: 1000
                });
            } else {
                Iptools.setDefaults({ key: "tenantId", value: r.employee.tenantId });
                Iptools.setDefaults({ key: "token", value: r.token });
                Iptools.setDefaults({ key: "userId", value: r.employee.id });
                Iptools.setDefaults({ key: "userName", value: options.loginName });
                Iptools.setDefaults({ key: "userTitle", value: r.employee.name });
                self.location = "../Mainleft";
            }
        });
//        } else {
//            Iptools.Tool.Alert({
//                title: "系统提示",
//                content: "域名未解析"
//            });
//        }
    },
    _enableLoginSubmit: function () {
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: widget._UIDEFAULFS.form,
            event: function () {
                var loginName = $(widget._UIDEFAULFS.login).val().trim();
                var loginPwd = $(widget._UIDEFAULFS.pwd).val().trim();
                if (Iptools.Tool._checkNull(loginName) && Iptools.Tool._checkNull(loginPwd)) {
                    if ($(widget._UIDEFAULFS.rem + ":checked").length) {
                        window.localStorage.setItem("loginName", loginName);
                        window.localStorage.setItem("loginPwd", $.md5(loginPwd));
                    }
                    widget._login({
                        loginName: loginName,
                        loginPwd: loginPwd
                    });
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "用户名和密码不可为空"
                    });
                }
                return false;
            }
        });
    },
    _echoLoginName: function () {
        var cookieloginName = Iptools.getDefaults({ key: "userName" });
        if( Iptools.Tool._checkNull(cookieloginName) ){
            $("#login_name").val(cookieloginName);
        }
    },
    _getWindowHeight: function () {
        var sp = (-576);
        var ztopsp = sp/2;
        if($(window).width() <= 1550){
            $(".register-area").css("margin-top",ztopsp);
        }
        $(window).resize(function () {
            var h = (377 - $(".form-left img").height());
            var zh = ($(window).height() - $(".form-login-reset").height());
            var zhs = ($(window).height() - $(".register-area").height());
            var top = h/2;
            var ztop = zh/2;
            var ztops = zhs/2;
            if($(window).width() <= 1550){
                $("body").addClass("minWidth");
            }else{
                $("body").removeClass("minWidth");
            }
            $(".form-login-reset").css("margin-top",ztop);
            $(".register-area").css("margin-top",ztops);
            $(".register-area").css("top",0);
            $(".form-login-reset").css("top",0);
        });
    },
    _toReset: function () {
        widget._addEventListener({
            container: "body",
            target: widget._UIDEFAULFS.setReset,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $(".form-login-login").hide();
                $(".form_reset").show();
            }
        });
    },
    _tosetLogin: function () {
        widget._addEventListener({
            container: "body",
            target: widget._UIDEFAULFS.setLogin,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $(".form-login-login").show();
                $(".form_reset").hide();
            }
        });
        widget._addEventListener({
            container: "body",
            target: widget._UIDEFAULFS.setRegister,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                window.location.href=window.location.href.split("?")[0] + "?valData=reg";
            }
        });
    },
    _enableResetSubmit: function () {
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: widget._UIDEFAULFS.forms,
            event: function () {
                var resetPhone = $(widget._UIDEFAULFS.phone).val().trim();
                var resetValidate = $(widget._UIDEFAULFS.validates).val().trim();
                var resetPwd = $(widget._UIDEFAULFS.pwds).val().trim();
                if (Iptools.Tool._checkNull(resetPhone)) {
                    if(Iptools.Tool._checkNull(resetValidate)){
                        if(Iptools.Tool._checkNull(resetPwd)){
                            $(widget._UIDEFAULFS.resetBtn).attr("data-loading-text", "<span class='icon-refresh icon-spin' style='margin-right:10px'></span>正在处理");
                                    var me = $(widget._UIDEFAULFS.resetBtn);
                                        me.css("pointer-events", "none");
                                        me.button("loading");
                                        var para = {
                                            tenantId: widget._UIDEFAULFS.tenantId,
                                            authToken: widget._UIDEFAULFS.authToken,
                                            phoneCode: $("#usercode").val(),
                                            newPwd: $.md5($("#password").val())
                                        };
                                        Iptools.PostJson({
                                            url: "basic/resetEmpPwd",
                                            data: para
                                        }).done(function (r) {
                                            if (r && r.retcode == "ok") {
                                                Iptools.Tool.pAlert({
                                                    type: "info",
                                                    title: "系统提示",
                                                    content: "修改成功",
                                                    delay: 1000
                                                });
                                                setTimeout(function(){
                                                    $(".form-login-login").show();
                                                    $(".form_reset").hide();
                                                    var phone = $("#resetPhone").val();
                                                    $("#login_name").val(phone);
                                                },1000);
                                                me.button('reset');
                                                me.html("已完成");
                                                me.css("pointer-events", "auto");
                                            } else {
                                                Iptools.Tool.pAlert({
                                                    type: "danger",
                                                    title: "系统提示",
                                                    content: r.retmsg,
                                                    delay: 1000
                                                });
                                                me.button('reset');
                                                me.css("pointer-events", "auto");
                                            }
                                        }).fail(function () {
                                            Iptools.Tool.pAlert({
                                                type: "danger",
                                                title: "系统提示",
                                                content: "连接无响应",
                                                delay: 1000
                                            });
                                            me.button('reset');
                                            me.html("请刷新页面重试");
                                            me.css("pointer-events", "auto");
                                        });
//                                }
//                            });
                        }else{
                            Iptools.Tool.pAlert({
                                type: "danger",
                                title: "系统提示",
                                content: "密码不可为空",
                                delay: 1000
                            });
                        }
                    }else{
                        Iptools.Tool.pAlert({
                            type: "danger",
                            title: "系统提示",
                            content: "验证码不可为空",
                            delay: 1000
                        });
                    }
                } else {
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示",
                        content: "手机号不可为空",
                        delay: 1000
                    });
                }
                return false;
            }
        });
    },
    _enableValidate: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: widget._UIDEFAULFS.getPhoneCode,
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var resetPhone = $(widget._UIDEFAULFS.phone).val().trim();
                var PhoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if(Iptools.Tool._checkNull(resetPhone)){
                    var r = resetPhone.match(PhoneReg);
                    if(r == null){
                        Iptools.Tool.pAlert({
                            type: "danger",
                            title: "系统提示",
                            content: "请输入正确手机号",
                            delay: 1000
                        });
                    }else{
                        $(widget._UIDEFAULFS.getPhoneCode).addClass("disable-code");
                        $(widget._UIDEFAULFS.getPhoneCode).html("处理中...");
                        Iptools.PostJson({
                            url: "service/getDomainByPhone",
                            data: {
                                phone: $("#resetPhone").val()
                            }
                        }).done(function (data) {
                            if($("#company-reset-code").val() == ""){
                                setTimeout(function(){
                                    $("#getPhoneCode").removeClass("disable-code").html("获取验证码");
                                },1000);
                                Iptools.Tool.pAlert({
                                    type: "danger",
                                    title: "系统提示：",
                                    content: "请输入图形验证码",
                                    delay: 1000
                                });
                                return;
                            }
                            if(data.domain != ""){
                                widget._UIDEFAULFS.tenantId = data.tenantId;
                                Iptools.PostJson({
                                    url: "basic/getRestPwdPhoneCode",
                                    data: {
                                        phone: $("#resetPhone").val(),
                                        captcha: $("#company-reset-code").val(),
                                        captchaToken: widget._UIDEFAULFS.captchaToken
                                    }
                                }).done(function (r) {
                                    if (r && r.retcode == "ok") {
                                        Iptools.Tool.pAlert({
                                            type: "info",
                                            title: "系统提示",
                                            content: r.retmsg,
                                            delay: 1000
                                        });
                                        widget._UIDEFAULFS.authToken = r.authToken;
                                        $(widget._UIDEFAULFS.getPhoneCode).addClass("disable-code");
                                        widget._UIDEFAULFS.phoneCodeCycleInterval = setInterval(function () {
                                            if (widget._UIDEFAULFS.phoneCodeCycleLimit < 0) {
                                                widget._UIDEFAULFS.phoneCodeCycleLimit = 60;
                                                clearInterval(widget._UIDEFAULFS.phoneCodeCycleInterval);
                                                $(widget._UIDEFAULFS.getPhoneCode).html("获取验证码");
                                                $(widget._UIDEFAULFS.getPhoneCode).removeClass("disable-code");
                                            } else {
                                                $(widget._UIDEFAULFS.getPhoneCode).html((widget._UIDEFAULFS.phoneCodeCycleLimit--) + "秒后重新发送");
                                            }
                                        }, 1000);
                                    } else if (r && r.retcode == "fail") {
                                        Iptools.Tool.pAlert({
                                            type: "danger",
                                            title: "系统提示",
                                            content: r.retmsg,
                                            delay: 1000
                                        });
                                        setTimeout(function(){
                                            $(widget._UIDEFAULFS.getPhoneCode).removeClass("disable-code");
                                            $(widget._UIDEFAULFS.getPhoneCode).html("获取验证码");
                                        },1000);
                                    } else {
                                        Iptools.Tool.pAlert({
                                            type: "danger",
                                            title: "系统提示",
                                            content: "发送失败，请稍后重试",
                                            delay: 1000
                                        });
                                    }
                                }).fail(function () {
                                    Iptools.Tool.pAlert({
                                        type: "danger",
                                        title: "系统提示",
                                        content: "发送失败，请稍后重试",
                                        delay: 1000
                                    });
                                });
                            }else{
                                setTimeout(function(){
                                    $(widget._UIDEFAULFS.getPhoneCode).removeClass("disable-code");
                                    $(widget._UIDEFAULFS.getPhoneCode).html("获取验证码");
                                },1000);
                                Iptools.Tool.pAlert({
                                    type: "danger",
                                    title: "系统提示",
                                    content: "用户不存在",
                                    delay: 1000
                                });
                            }
                        });
                    }
                }else{
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示",
                        content: "手机号不可为空",
                        delay: 1000
                    });
                }
                return false;
            }
        });
    },
    _setResetSwitch: function () {
        widget._addEventListener({
            container: "body",
            target: widget._UIDEFAULFS.iconNewPwd,
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if ($("#password").attr("type") == "password") {
                    $("#password").attr("type", "text");
                    $(".iconNewPwd").html("&#xe7cb;");
                    $(".iconNewPwd").css("right","10px");
                } else {
                    $("#password").attr("type", "password");
                    $(".iconNewPwd").html("&#xe9b0;");
                    $(".iconNewPwd").css("right","20px");
                }
            }
        });
    },
    _checkAgreement: function () {
        widget._addEventListener({
            container: "body",
            target: ".checkLeft",
            type: "change",
            event: function () {
                var value = this.checked ? "true" : "false";
                if(value == "true"){
                    widget._registerButtonEnable();
                }else{
                    widget._registerButtonDisable();
                }
            }
        });
    },
    _registerButtonEnable: function () {
        $(".registerBtn").removeAttr("disabled");
    },
    _registerButtonDisable: function () {
        $(".registerBtn").attr("disabled",true);
    },
    _getIndustryData: function () {
        Iptools.GetJson({
            url: "basic/industrys_open"
        }).done(function (data) {
            widget._UIDEFAULFS.option = '<option value='+data[0].id + '>'+data[0].displayName + '</option>';
            for(var i = 1; i < data.length;i++){
                widget._UIDEFAULFS.option += '<option value='+data[i].id + '>' + data[i].displayName + '</option>';
            };
            $("#industry").append(widget._UIDEFAULFS.option);
        });
    },
    _getPhoneCode: function () {
        widget._addEventListener({
            container: "body",
            target: "#getempliyPhoneCode",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                $(widget._UIDEFAULFS.phoneCode).addClass("disable-code");
                $(widget._UIDEFAULFS.phoneCode).html("处理中...");
                var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if($("#employPhone").val() == ""){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "手机号不能为空",
                        delay: 1000
                    });
                    setTimeout(function () {
                        $(widget._UIDEFAULFS.phoneCode).removeClass("disable-code");
                        $(widget._UIDEFAULFS.phoneCode).html("获取验证码");
                    },1000);
                    return;
                }else if(!reg.test($("#employPhone").val())){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "请输入正确的手机号",
                        delay: 1000
                    });
                    setTimeout(function(){
                        $(widget._UIDEFAULFS.phoneCode).removeClass("disable-code");
                        $(widget._UIDEFAULFS.phoneCode).html("获取验证码");
                    },1000);
                    return;
                }else if($("#company-img-code").val() == ""){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "请输入图形验证码",
                        delay: 1000
                    });
                    setTimeout(function(){
                        $(widget._UIDEFAULFS.phoneCode).removeClass("disable-code");
                        $(widget._UIDEFAULFS.phoneCode).html("获取验证码");
                    },1000);
                    return;
                }else{
                    Iptools.PostJson({
                        url: "basic/getTrialAuthCode",
                        data: {
                            phone: $("#employPhone").val(),
                            captcha: $("#company-img-code").val(),
                            captchaToken: widget._UIDEFAULFS.captchaToken
                        }
                    }).done(function (r) {
                        if (r && r.retcode == "ok") {
                            Iptools.Tool.pAlert({
                                type: "info",
                                title: "系统提示",
                                content: r.retmsg,
                                delay: 1000
                            });
                            widget._UIDEFAULFS.authTokenR = r.authToken;
                            widget._UIDEFAULFS.phoneCodeCycleIntervalR = setInterval(function () {
                                if (widget._UIDEFAULFS.phoneCodeCycleLimitR < 0) {
                                    widget._UIDEFAULFS.phoneCodeCycleLimitR = 60;
                                    clearInterval(widget._UIDEFAULFS.phoneCodeCycleIntervalR);
                                    $(widget._UIDEFAULFS.phoneCode).removeClass("disable-code");
                                    $(widget._UIDEFAULFS.phoneCode).html("获取验证码");
                                } else {
                                    $(widget._UIDEFAULFS.phoneCode).html((widget._UIDEFAULFS.phoneCodeCycleLimitR--) + "秒后重新发送");
                                }
                            }, 1000);
                        } else if (r && r.retcode == "fail") {
                            Iptools.Tool.pAlert({
                                type: "danger",
                                title: "系统提示",
                                content: r.retmsg,
                                delay: 1000
                            });
                            setTimeout(function () {
                                $(widget._UIDEFAULFS.phoneCode).removeClass("disable-code");
                                $(widget._UIDEFAULFS.phoneCode).html("获取验证码");
                            },1000);
                        }
                    }).fail(function () {
                        Iptools.Tool.pAlert({
                            type: "danger",
                            title: "系统提示",
                            content: "发送失败，请稍后重试",
                            delay: 1000
                        });
                        setTimeout(function () {
                            $(widget._UIDEFAULFS.phoneCode).removeClass("disable-code");
                            $(widget._UIDEFAULFS.phoneCode).html("获取验证码");
                        },1000);
                    });
                }
            }
        });
    },
    _enableSubmitRegister: function () {
        widget._addEventListener({
            container: "body",
            target: widget._UIDEFAULFS.registerBtn,
            type: "click",
            event: function () {
                var me = $(this);
                $(widget._UIDEFAULFS.registerBtn).attr("data-loading-text", "<span class='icon-refresh icon-spin'></span>");
                me.css("pointer-events", "none");
                me.button("loading");
                if($("#employName").val() == ""){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "姓名不能为空",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }
                var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if($("#employPhone").val() == ""){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "手机号不能为空",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }else if( !reg.test( $("#employPhone").val() ) ){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "请输入正确的手机号",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }
                if($("#employCode").val() == ""){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "验证码不能为空",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }
                var RegExp = /^[\u4e00-\u9fa5A-Za-z0-9]{2,8}$/;
                if($("#companyName").val() == ""){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "企业简称不能为空",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }else if( $("#companyName").val().length < 2 ){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "企业简称至少2个字符",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }else if( $("#companyName").val().length > 8 ){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "企业简称最多8个字符",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }else if( !RegExp.test( $("#companyName").val() ) ){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "企业简称只能汉字，数字和字母",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }
                if($("#industry option:selected").val() == ""){
                    Iptools.Tool.pAlert({
                        type: "danger",
                        title: "系统提示：",
                        content: "请选择所属行业",
                        delay: 1000
                    });
                    setTimeout(function () {
                        me.button('reset');
                        me.css("pointer-events", "auto");
                    },1000);
                    return;
                }
                    var para = {
                        authToken: widget._UIDEFAULFS.authTokenR,
                        phoneCode: $("#employCode").val(),
                        name: $("#employName").val(),
                        shortName: $("#companyName").val(),
                        industry: $("#industry option:selected").text(),
                        channel: "pc"
                    };
                    Iptools.PostJson({
                        url: "basic/trial",
                        data: para
                    }).done(function (r) {
                        if(r.retcode == "ok"){
                            Iptools.Tool.pAlert({
                                type: "info",
                                title: "系统提示：",
                                content: r.retmsg+"   体验账号及密码已发送至您的手机，系统将自动带您去登陆…",
                                delay: 3000
                            });
                            setTimeout(function () {
                                $("#login_name").val("");
                                window.location.href = window.location.href.split("?")[0] + "?valData=log" + "&phone=" + $("#employPhone").val();
                                $("#login_name").val($("#employPhone").val());
                                me.button('reset');
                                me.css("pointer-events", "auto");
                            },1000);
                        }else if(r.retcode == "fail"){
                            Iptools.Tool.pAlert({
                                type: "danger",
                                title: "系统提示：",
                                content: r.retmsg,
                                delay: 3000
                            });
                            setTimeout(function () {
                                me.button('reset');
                                me.css("pointer-events", "auto");
                            },1000);
                        }
                    }).fail(function () {//没有网络提示信息
                        Iptools.Tool.pAlert({
                            type: "danger",
                            title: "系统提示",
                            content: "连接无响应",
                            delay: 1000
                        });
                        setTimeout(function () {
                            me.button('reset');
                            me.css("pointer-events", "auto");
                        },1000);
                        me.html("请刷新页面重试");
                    });
                return false;
            }
        });
    },
    _enableGotoLogin: function () {
        widget._addEventListener({
            container: "body",
            target: ".gotoLogin",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                window.location.href = window.location.href.split("?")[0] + "?valData=log";
            }
        });
    },
    _enableGotoAgreement: function () {
        widget._addEventListener({
            container: "body",
            target: ".checkCenter",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                window.open("registerAgreement");
            }
        });
    },
    _initGetImgCode: function () {
        Iptools.PostJson({
            url: "basic/captcha",
            data: {
                tenantId: Iptools.DEFAULTS.tenantId,
                clientIp: "1.1.1.1"
            }
        }).done(function (r) {
            if (r && r.retcode == "ok") {
                widget._UIDEFAULFS.captchaToken = r.captchaToken;
                $(".company-code img").attr("src", "data:image/png;base64,"+r.captchaImage);
            }
        })
    },
    _enableClickImg: function () {
        widget._addEventListener({
            container: "body",
            target: ".company-code img",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                widget._initGetImgCode();
            }
        });
    }
};