
var widget = {};
widget = {
    _UIDEFAULFS: {
        personInfoPane: $("#personInfoPane"),
        bindWX: $("#bindWX"),
        pwdUpdatePane: $("#pwdUpdatePane"),
        bindWXImg: $(".wx_mobile_qr"),
        avatar: "../Content/Image/defaultHead2.svg",
        userName: "",
        phone: "",
        email: "",
        wxUrl: "",//得到二维码的url
        timeLimit: "",//时间的间隔
        channel:"qrCode_channel_"+new Date().getTime(),
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _init: function () {
        widget._UIDEFAULFS.personInfoPane.show();
        widget._UIDEFAULFS.bindWX.hide();
        widget._UIDEFAULFS.pwdUpdatePane.hide();
        widget._setPersonInfo();
        widget._bindingDomEvent();
        $(".bindSuccess").css("display", "none");
        $("#userNameField").focus();
    },
    _setPersonInfo: function () {
        Iptools.GetJson({
            url: "basic/getEmployee",
            data: {
                token: Iptools.DEFAULTS.token,
                id: Iptools.DEFAULTS.userId,
            },
        }).done(function (r) {
            if (r && r.retcode == "ok") {
                var $avatarSec = $("#avatarSec");
                if (r.employee.name == "" || r.employee.name == undefined || r.employee.name == null) {
                    $("#userNameField").attr("placeholder", "请完善姓名");
                    $avatarSec.find("#userName").html(r.employee.phone);
                } else {
                    $avatarSec.find("#userName").html(r.employee.name);
                    $("#userNameField").val(r.employee.name);
                };
                $("#loginNameField").val(r.employee.loginName);
                $("#phoneField").val(r.employee.phone);
                $("#emailField").val(r.employee.email);

                $("#loginName").html(r.loginName);


                if (r.employee.headPic) {
                    $avatarSec.find("img").attr("src", r.employee.headPic);
                    widget._UIDEFAULFS.avatar = r.employee.headPic;
                } else {
                    $avatarSec.find("img").attr("src", widget._UIDEFAULFS.avatar);
                };

                widget._UIDEFAULFS.userName = r.employee.name;
                widget._UIDEFAULFS.phone = r.employee.phone;
                widget._UIDEFAULFS.email = r.employee.email;
            }
        });
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        widget._blurForInput();
        widget._enableUlItemChange();
        widget._enableAvatarChange();
        widget._enableInfoSave();
        widget._enablePwdReset();
        widget._showEWM(); //没有绑定微信时,鼠标滑上显示二维码
        widget._hideEWM(); //没有绑定微信时,鼠标滑下，二维码消失
        widget._wxisSubscribe(); //判断是否绑定微信
        widget._closeModalonTitle(); //手动删除模态框 让时间变位300
        widget._closeModalonMarsk();
        widget._qrCode();
        widget._unbindWx();
    },
    //点击左侧的三个模块
    _enableUlItemChange: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".left-pane ul li",
            event: function () {
                $(this).addClass('current').siblings('li').removeClass('current');
                var personInfoPane = $("#personInfoPane");
                var bindWx = $("#bindWX");
                var pwdUpdatePane = $("#pwdUpdatePane");
                var block1 = '个人设置';
                var block2 = '绑定微信';
                if ($(this).text().indexOf(block1) != -1) {
                    personInfoPane.show();
                    bindWx.hide();
                    pwdUpdatePane.hide();
                } else if ($(this).text().indexOf(block2) != -1) {
                    personInfoPane.hide();
                    bindWx.show();
                    pwdUpdatePane.hide();
                } else {
                    personInfoPane.hide();
                    bindWx.hide();
                    pwdUpdatePane.show();
                }
            }
        });
    },
    //点击头像，更换头像
    _enableAvatarChange: function () {
        widget._addEventListener({
            container: "body",
            type: "change",
            target: "#avatarSec input[type=file]",
            event: function () {
                var control = $(this);
                var imgFile = control[0].files[0];
                var src = window.URL.createObjectURL(imgFile);
                var imgPath = src;
                var $avatarSec = $("#avatarSec");
                $avatarSec.find("img").attr("src", src);
                if (control[0].files && control[0].files.length) {
                    component._crop({
                        file: control[0].files[0],
                        aspectRatio: 1 / 1, //图片裁剪框比例
                        getCanvas: function (canvas) { //点击确定触发
                            Iptools.uidataTool._uploadCanvasData({ //上传裁剪的图片到服务器，得到图片路径
                                canvas: canvas,
                                type: "picture"
                            }).done(function (path) {
                                imgPath = Iptools.DEFAULTS.serviceUrl + path;
                                $avatarSec.find("img").attr("src", imgPath);
                                Iptools.PutJson({
                                    url: "basic/employees",
                                    data: {
                                        token: Iptools.DEFAULTS.token,
                                        id: Iptools.DEFAULTS.userId,
                                        headPic: imgPath
                                    },
                                }).done(function (r) {
                                    if (r) {
                                        if (r.retcode === "ok") {
                                            widget._UIDEFAULFS.avatar = imgPath;
                                            Iptools.Tool._setUserInfo();
                                        } else if (r.retcode === "fail") {
                                            Iptools.Tool.pAlert({
                                                type: "danger",
                                                title: "系统提示：",
                                                content: r.retmsg,
                                                delay: 1000
                                            });
                                        };
                                    }
                                });
                            });
                        }
                    });
                    $(this).val("");
                }
                return false;
            }
        });
    },
    _blurForInput:function(){
        widget._addEventListener({
            container:"body",
            type:"blur",
            target:".phone input",
            event:function(){
                var telRegExp = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if($(this).val().length == 0){
                    $(".form-group.phone .wrong-msg").html("电话号码不可为空");
                    $(this).css("border-color","#f66");
                }else if($(this).val().length>0 && !telRegExp.test($(this).val())){
                    $(".form-group.phone .wrong-msg").html("请输入有效的手机号码");
                    $(this).css("border-color","#f66");
                }else if($(this).val().length>0 && telRegExp.test($(this).val())){
                    $(".form-group.phone .wrong-msg").html("");
                    $(this).css("border-color","#ccc");
                }
            }
        });
        widget._addEventListener({
            container:"body",
            type:"blur",
            target:"#currentPwdField",
            event:function(){
                if($(this).val().length == 0){
                    $(".current-password .wrong-msg").html("原始密码不可为空");
                    $(this).css("border-color","#f66");
                }else if($(this).val() > 0){
                    $(".current-password .wrong-msg").html("");
                    $(this).css("border-color","#ccc");
                }
            }
        });
        widget._addEventListener({
            container:"body",
            type:"blur",
            target:"#newPwdField",
            event:function(){
                if($(this).val().length == 0){
                    $(".new-password .wrong-msg").html("新密码不可为空");
                    $(this).css("border-color","#f66");
                }else if($(this).val() == $("#currentPwdField").val()){
                    $(".new-password .wrong-msg").html("新密码与原密码一致");
                    $(this).css("border-color","#f66");
                }else if($(this).val() > 0 && $(this).val()!= $("#currentPwdField").val()){
                    $(".new-password .wrong-msg").html("");
                    $(this).css("border-color","#ccc");
                }
            }
        });
        widget._addEventListener({
            container:"body",
            type:"blur",
            target:"#confirmPwdField",
            event:function(){
                if($(this).val().length == 0){
                    $(".repeate-password .wrong-msg").html("重复输入密码不能为空");
                    $(this).css("border-color","#f66");
                }else if($(this).val() != $("#newPwdField").val()){
                    $(".repeate-password .wrong-msg").html("两次输入密码不一致");
                    $(this).css("border-color","#f66");
                }else if($(this).val() > 0 && $(this).val()== $("#newPwdField").val()){
                    $(".repeate-password .wrong-msg").html("");
                    $(this).css("border-color","#ccc");
                }
            }
        });
    },
    //点击保存按钮
    _enableInfoSave: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#savePersonInfoBtn",
            event: function (event) {
                var $userNameField = $("#userNameField");
                var $phoneField = $("#phoneField");
                var $emailField = $("#emailField");

                var phoneFieldVal = $phoneField.val().replace(Iptools.DEFAULTS.blankReg, "");
                var userNameFieldVal = $userNameField.val().replace(Iptools.DEFAULTS.blankReg, "");
                var emailFieldVal = $emailField.val().replace(Iptools.DEFAULTS.blankReg, "");

                var telRegExp = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                //var emailRegExp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/;
                if (phoneFieldVal === "") {
                    event.preventDefault();
                    $(".form-group.phone .wrong-msg").html("电话号码不可为空");
                    $phoneField.css("border-color","#f66");
                    $phoneField.focus();
                } else if (!telRegExp.test(phoneFieldVal)) {
                    event.preventDefault();
                    $(".form-group.phone .wrong-msg").html("请输入有效的手机号码");
                    $phoneField.css("border-color","#f66");
                    $phoneField.val("");
                    $phoneField.focus();
                }
                    //else if (!emailRegExp.test(emailFieldVal)) {
                    //    event.preventDefault();
                    //    Iptools.Tool.pAlert({
                    //        title: "系统提示",
                    //        content: "请输入有效的电子邮箱地址！"
                    //    });
                    //    $emailField.focus();
                    //}
                else {
                    if (phoneFieldVal !== widget._UIDEFAULFS.phone ||
                        userNameFieldVal !== widget._UIDEFAULFS.userName ||
                        emailFieldVal !== widget._UIDEFAULFS.email) {
                        Iptools.PutJson({
                            url: "basic/employees",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                id: Iptools.DEFAULTS.userId,
                                loginName: phoneFieldVal,
                                name: userNameFieldVal,
                                phone: phoneFieldVal,
                                email: emailFieldVal
                            },
                        }).done(function (r) {
                            if (r) {
                                if (r.retcode === "ok") {
                                    Iptools.Tool.pAlert({
                                        type: "info",
                                        title: "系统提示：",
                                        content: "个人信息更新完成！",
                                        delay: 1000
                                    });
                                    widget._UIDEFAULFS.userName = userNameFieldVal;
                                    widget._UIDEFAULFS.phone = phoneFieldVal;
                                    widget._UIDEFAULFS.email = emailFieldVal;

                                    $("#avatarSec").find("#userName").html(userNameFieldVal);
                                    $("#loginName").html(phoneFieldVal);
                                    Iptools.Tool._setUserInfo();
                                } else if (r.retcode === "fail") {
                                    Iptools.Tool.pAlert({
                                        type: "danger",
                                        title: "系统提示：",
                                        content: r.retmsg,
                                        delay: 1000
                                    });
                                }
                            }
                        });
                    } else {
                        Iptools.Tool.pAlert({
                            type: "info",
                            title: "系统提示：",
                            content: "您未更新任何信息！",
                            delay: 1000
                        });
                    }
                    $userNameField.focus();
                }
                return false;
            }
        });
    },
    //点击修改密码的保存按钮
    _enablePwdReset: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#submitPwdUpdateBtn",
            event: function (event) {
                var $currentPwdField = $("#currentPwdField");
                var $newPwdField = $("#newPwdField");
                var $confirmPwdField = $("#confirmPwdField");

                var oldPwd = $currentPwdField.val().replace(Iptools.DEFAULTS.blankReg, "");
                var newPwd = $newPwdField.val().replace(Iptools.DEFAULTS.blankReg, "");
                var confirmPwd = $confirmPwdField.val().replace(Iptools.DEFAULTS.blankReg, "");

                if (oldPwd == "") {
                    event.preventDefault();
                    $(".current-password .wrong-msg").html("原始密码不可为空");
                    $currentPwdField.focus();
                } else if(newPwd == ""){
                    event.preventDefault();
                    $(".new-password .wrong-msg").html("新密码不可为空");
                    $newPwdField.focus();
                } else if (oldPwd === newPwd) {
                    event.preventDefault();
                    $(".new-password .wrong-msg").html("新密码与原密码一致");
                    $newPwdField.focus();
                }else if (newPwd !== confirmPwd) {
                    event.preventDefault();
                    $(".repeate-password .wrong-msg").html("两次输入密码不一致");
                    $confirmPwdField.focus();
                } else {
                    Iptools.PostJson({
                        url: "basic/changeEmpPwd",
                        data: {
                            id: Iptools.DEFAULTS.userId,
                            token: Iptools.DEFAULTS.token,
                            originPwd: $.md5(oldPwd),
                            newPwd: $.md5(newPwd)
                        },
                    }).done(function (r) {
                        $("#currentPwdField").val("");
                        $("#newPwdField").val("");
                        $("#confirmPwdField").val("");
                        if (Iptools.Tool._checkNull(r.success)) {
                            Iptools.Tool.pAlert({
                                type: "info",
                                title: "系统提示：",
                                content: "密码修改成功！1秒后跳转到登录页面。。。",
                                delay: 1000
                            });
                            setTimeout(function () {
                                Iptools.Tool._logOut();
                            }, 1000);
                        } else {
                            Iptools.Tool.pAlert({
                                type: "danger",
                                title: "系统提示：",
                                content: "当前密码输入错误！",
                                delay: 1000
                            });
                        }
                    });
                    $currentPwdField.focus();
                }
                return false;
            }
        });
    },
    //鼠标滑出，二维码消失
    _hideEWM: function () {
        widget._addEventListener({
            container: "body",
            type: "mouseout",
            target: ".yizhang",
            event: function () {
                $(".unbindStatus .img").css({
                    "display": "none",
                });
            },
        });
    },
    //鼠标滑上，二维码出现
    _showEWM: function () {
        widget._addEventListener({
            container: "body",
            type: "mouseover",
            target: ".yizhang",
            event: function () {
                $(".unbindStatus .img").css({
                    "display": "block",
                });
            },
        });
    },
    //点击删除符号，蒙版以及模态框消失
    _closeModalonTitle: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".closeModal",
            event: function () {
                clearInterval(widget._UIDEFAULFS.timeLimit);
                $(".wx_mobile_qr").attr("src", " ");
                $(".wxWord .limitTime").html(300);
            },
        });
    },
    //点击蒙版处，蒙版以及模态框消失
    _closeModalonMarsk: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#modalBindWX",
            event: function () {
                clearInterval(widget._UIDEFAULFS.timeLimit);
                $(".wx_mobile_qr").attr("src", " ");
                $(".wxWord .limitTime").html(300);
            },
        });
    },
    //判断是否绑定微信
    _wxisSubscribe: function () {
        Iptools.GetJson({
            url: "wx/server/isSubscribe",
            data: {
                tenantId: Iptools.DEFAULTS.tenantId,
                employeeId: Iptools.DEFAULTS.userId,
            },
        }).done(function (data) {
            if (data && data.isSubscribe == 0) {
                $(".unbindStatus").css("display", "block");
                $(".bindStatus").css("display", "none");
            } else {
                $(".unbindStatus").css("display", "none");
                $(".bindStatus").css("display", "block");
                $(".bindHeader .wxNickName").html(data.nickName);
            }
        });
    },
    //生成二维码
    _qrCode: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".unbindToBind",
            event:function(){
                widget._wxTimeLimit();
                var parm = {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    employeeId: Iptools.DEFAULTS.userId,
                    channel:widget._UIDEFAULFS.channel,
                };
                Iptools.PostJson({
                    url: "wx/server/qrCode",
                    data:parm
                }).done(function(r){
                    if(r && r.qrCodeUrl){
                        wxUrl = r.qrCodeUrl
                        $(".wx_mobile_qr").attr("src",wxUrl);
                        widget._UIDEFAULFS.timeLimit = setInterval(function(){
                            widget._timeReduce();
                        },1000);
                    }else{
                        Iptools.Tool.pAlert({
                            type: "info",
                            title: "系统提示：",
                            content: "服务器未响应！",
                            delay: 1000
                        });
                    };
                })
            }
        })
    },
    //解除绑定
    _unbindWx: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "button.unbindWX",
            event:function(){
                Iptools.GetJson({
                    url: "wx/server/unSubscribe",
                    data: {
                        tenantId: Iptools.DEFAULTS.tenantId,
                        employeeId: Iptools.DEFAULTS.userId,
                    },
                });
                //console.log("解绑");
                $("#modalUnBindWX").modal("hide");
                Iptools.Tool.pAlert({
                    type: "info",
                    title: "系统提示：",
                    content: "解绑成功！",
                    delay: 1000
                });
                setTimeout(function(){widget._wxisSubscribe()},300);
                $("#modalBindWX .modal-title").html("扫一扫绑定微信");
                $("#modalBindWX .bindSuccess").css("display","none");
                $("#modalBindWX .wxWord").css("display","block");
            }
        })
    },
    //时间限制
    _wxTimeLimit: function () {
        Iptools.Tool._pushListen(widget._UIDEFAULFS.channel, function (ms) {
            if(ms && ms.retcode == "ok"){
                clearInterval(widget._UIDEFAULFS.timeLimit);
                $("#modalBindWX .modal-title").html("绑定成功");
                $(".wx_mobile_qr").attr("src","../../Content/Image/bindsuccess.png");
                $("#modalBindWX .bindSuccess").css("display","block");
                $("#modalBindWX .wxWord").css("display","none");
                setTimeout(function(){
                    $("#modalBindWX").modal("hide");
                    $(".wx_mobile_qr").attr("src","");
                    $(".wxWord .limitTime").html(300);
                },2000);
                widget._wxisSubscribe();
            }
        });
    },
    _timeReduce:function(){
        var limitTimeNum = $(".limitTime").html();
        if(limitTimeNum == 1){
            clearInterval(widget._UIDEFAULFS.timeLimit);
            $("#modalBindWX").modal("hide");
            $(".wx_mobile_qr").attr("src"," ");
            $(".wxWord .limitTime").html(300);
            widget._wxisSubscribe();
        }else{
            $(".wxWord .limitTime").text(limitTimeNum-1);
        }
    }
}