/**
 * Created by mf on 2017/6/28.
 */
widget = {}
widget={
    DEFAULTS:{
        carId:"",
        customer:{},//车主相关
        msgSig:"",//短信签名
        car:{},//车辆相关属性及值
        contact_linker:{},//联系人相关
        contact_repairer:{},//送修人相关
        carDetailApplet:"",//车辆详情
        carMilesArr:[],//车辆历史里程arr
        SRDetailApplet:"",//工单详情
        contactTraceDetail:"",//动态详情
        contactCarLinkListApplet:"",
        newCarLinkListApplet:"",//新车list
        taskDetail:"",//任务详情
        interactTarget:{},
        sendTarget:{},
        curBarDatas:{},
        allBarDatas:{}
    },
    _init:function(){
        widget.DEFAULTS.carId = Iptools.DEFAULTS.currentViewValue;
        widget._getMsgSig();
        widget._getCarInfo();
        widget._enableContract();
        widget._buildInsuranceList();
        widget._buildSRList();
        widget._bindEvent();
        widget._initMonthOrder();
        widget._listenMassage();
        widget._getNewCarList();
        widget._buildInteractOptions();
        widget._buildMsgTemplet();
    },
    _bindEvent:function(){
        $("body").on("click",".interact-save",function(){
            widget._saveContactTrace(this);
        })
        $("body").on("click",".massage-save",function(){
            widget._saveMsg(this);
        })
        $("body").on("input",".interact-content",function(){
           if($(this).val().length === 0 || $(".interact-target .td.active").length === 0){
              $(".interact-save").addClass("disableBtn").attr('disabled',true);
           }else{
               $(".interact-save").removeClass("disableBtn").attr('disabled',false);
           }
        })
        $("body").on("input",".msg-content",function(){
            $(".msg-length span").html($(".msg-content").val().length);
            if($(this).val().length === 0 || $(".send-target .td.active").length === 0){
                $(".massage-save").addClass("disableBtn").attr('disabled',true);
            }else{
                $(".massage-save").removeClass("disableBtn").attr('disabled',false);
            }
        })
        $("body").on("change",".interact-type",function(){
            //客户来电
            if($(this).val() === "18"){
                $(".telegram-status-row").show();
            }else{
                $(".telegram-status-row").hide();
            }
        })
        //互动对象
        $('.interact-target-btn,.send-target-btn').dropdown();
        $("body").on("click",".interact-target .td",function(){
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                if($(".interact-target .td.active").length === 0||$(".interact-content").val().trim().length === 0){
                    $(".interact-save").addClass("disableBtn").attr('disabled',true);
                    $(this).closest(".interact-target-area").find(".interact-target-btn").text("请选择").append('<span class="caret"></span>');
                }

            }else{
                $(".interact-target .td").removeClass("active");
                $(this).addClass("active");
                $(this).closest(".interact-target-area").find(".interact-target-btn").text($(this).find("li:last").html()).append('<span class="caret"></span>');
                widget.DEFAULTS.interactTarget["type"] = $(this).attr("data-type");
                widget.DEFAULTS.interactTarget["id"] = $(this).attr("data-id");
                if($(".interact-content").val().trim().length === 0){
                    $(".interact-save").addClass("disableBtn").attr('disabled',true);
                }else{
                    $(".interact-save").removeClass("disableBtn").attr('disabled',false);
                }
            }
        })
        $("body").on("click",".send-target .td",function(){
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                if($(".send-target .td.active").length === 0||$(".msg-content").val().trim().length === 0){
                    $(".massage-save").addClass("disableBtn").attr('disabled',true);
                    $(this).closest(".send-target-area").find(".send-target-btn").text("请选择").append('<span class="caret"></span>');
                }

            }else{
                $(".send-target .td").removeClass("active");
                $(this).addClass("active");
                $(this).closest(".send-target-area").find(".send-target-btn").text($(this).find("li:last").html()).append('<span class="caret"></span>');
                widget.DEFAULTS.sendTarget["type"] = $(this).attr("data-type");
                widget.DEFAULTS.sendTarget["id"] = $(this).attr("data-id");
                if($(".msg-content").val().trim().length === 0){
                    $(".massage-save").addClass("disableBtn").attr('disabled',true);
                }else{
                    $(".massage-save").removeClass("disableBtn").attr('disabled',false);
                }

            }
        })
        //bar切换
        $("body").on("change",".bar-select-type",function(){
            if($(this).val() === "all"){
                widget._buildBars("all");
            }else{
                widget._buildBars("cur");
            }
        })
        //短信模板
        $("body").on("click",".msg-templet .td",function(){

            if($(this).hasClass("active")){
                $(this).removeClass("active");
                $(this).closest(".send-target-area").find(".msg-templet-btn").text("请选择").append('<span class="caret"></span>');
            }else{
                $(".msg-templet .td").removeClass("active");
                $(this).addClass("active");
                $(this).closest(".send-target-area").find(".msg-templet-btn").text($(this).find("li:first").html()).append('<span class="caret"></span>');
            }
            var templet = $(".msg-templet .td.active").find("li:last").attr("title");
            if(!templet){
                templet = "";
            }
            $(".msg-content").val(templet);
            $(".msg-content").trigger("input");
        })
        //mileLine.item--hover
        //$("body").on("mouseenter mouseleave",".track-item",function(e){
        //    var $this = $(this);
        //    var initHeight = parseInt($(this).attr("data-initwth").split("%")[0])*$(".mileage-track-line").width()/100;
        //    if(e.type == "mouseenter"){
        //        if(parseInt(initHeight) < 50 && !$this.hasClass("firstMile")){
        //            $this.addClass("firstMile");
        //            $this.animate({width:'50px'},"slow");
        //            $(".track-item:last").addClass("lastMile");
        //            $(".track-item:last").animate({width:$(".track-item:last").width()-50 +"px"},"slow");
        //
        //        }
        //    }else if(e.type == "mouseleave"){
        //        if($this.hasClass("firstMile")){
        //            $this.removeClass("firstMile");
        //            $(".track-item:last").removeClass("lastMile");
        //            $this.animate({width:$this.attr("data-initwth")},"slow");
        //            $(".track-item:last").animate({width:(parseInt($(".track-item:last").attr("data-initwth").split("%")[0])*$(".mileage-track-line").width()/100)+"px"},"slow");
        //        }
        //    }
        //})
    },
    _bindSelectEvent:function(){
        $(".search-area").find(".form-control.datePicker").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: 1
        });
        $(".search-area").find(".form-control.timePicker").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: 1
        });
        $(".s-search-bar").click(function(ev){
            ev = ev || event;
            ev.stopPropagation();
        })
        //清空
        $(".search-area .clearForm").on("click",function(){
            widget._clearSelect();
        })
        //筛选
        $(".search-area .search").on("click",function(){
           widget._getTraceByCondition(this);
        })
    },
    _getMsgSig:function(){
        Iptools.GetJson({
            url:"basic/queryByDictId",
            data:{
                "dictId":"smsSignature",
                "token":Iptools.DEFAULTS.token
            }
        }).done(function(data){
            if(data.retcode === "ok"){
                $('.msg-signature-val').html(data.result.dictValue);
                widget.DEFAULTS.msgSig = data.result.dictValue;
            }else{
                $('.msg-signature-val').html("");
            }
        })
    },
    //互动记录
    _saveContactTrace:function(e){
        if($(".interact-target .td.active").length ===0){
            return false;
        }
        $(e).css({
            "pointer-events":"none"
        }).button("loading");
        var nextInteractTime = $(".next-interact-datetime").val();
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "\"Contact Trace Detail\""
        }).done(function (thisApplet) {
            widget.DEFAULTS.contactTraceDetail = thisApplet.applets[0].applet;
            var prefix = "contact_trace";
            var paramStr = "",paramData = {};
//            Iptools.uidataTool._getView({
//                view: Iptools.DEFAULTS.currentView
//            }).done(function (data) {
//                console.log(Iptools.Tool._getTabData({
//                    view: Iptools.DEFAULTS.currentView,
//                    type: data.view.type,
//                    valueId: Iptools.DEFAULTS.currentViewValue
//                })["contactLinkId"]);
//            });
               //从任务列表进入，会存contactLinkId值
                Iptools.uidataTool._getView({
                    view: Iptools.DEFAULTS.currentView
                }).done(function (data) {
                    var value =  Iptools.Tool._getTabData({
                        view: Iptools.DEFAULTS.currentView,
                        type: data.view.type,
                        valueId: Iptools.DEFAULTS.currentViewValue
                    })["contactLinkId"];
                    paramStr += '{';
                    paramStr += "\""+prefix+":customer_id\":\""+widget.DEFAULTS.customer["id"]+"\",";
                    paramStr += "\""+prefix+":contact_id\":\""+$(".interact-target .td.active").attr("data-id")+"\",";

                    paramStr += "\""+prefix+":trace_type\":\""+$(".interact-type").val()+"\",";
                    paramStr += "\""+prefix+":owner\":\""+Iptools.DEFAULTS.userId+"\",";
                    paramStr += "\""+prefix+":title\":\""+$(".interact-content").val()+"\",";
                    paramStr += "\""+prefix+":trace_time\":\""+$(".interact-datetime").val()+"\",";
                    if(value){
                        paramStr += "\""+prefix+":contact_link_group_id\":\""+value+"\",";
                    }

                    //trace_category--3--信息推送
                    if($(".interact-type").val() == "18"){
                        paramStr += "\""+prefix+":trace_category\":\"4\",";
                    }else{
                        paramStr += "\""+prefix+":trace_category\":\"3\",";
                    }
                    //来电状态相关
                    if($('.connect-status').val()){
                        paramStr += "\""+prefix+":is_phone_connected\":\""+$('.connect-status').val()+"\",";
                    }
                    if($('.success-status').val()){
                        paramStr += "\""+prefix+":is_success\":\""+$('.success-status').val()+"\",";
                    }
                    if($(".fail-reason").val()){
                        paramStr += "\""+prefix+":huifang_fail_reason\":\""+$(".fail-reason").val()+"\",";
                    }
                    paramStr += "\""+prefix+":car_id\":\""+widget.DEFAULTS.carId+"\",";


                    paramStr+= "}";
                    paramData["data"] = paramStr;
                    paramData["appletId"] = widget.DEFAULTS.contactTraceDetail;
                    Iptools.uidataTool._addAppletData(paramData).done(function(data){
                        if(data.retcode == 'ok'){
                            $(e).button("reset");
                            $(e).css("pointer-events","auto");
                            //Iptools.uidataTool._pushMessage({
                            //    channel: "car_detail_trace_listener"
                            //});
                            $(".search-area .search").trigger("click");
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "互动记录创建成功"
                            });
                            //如果有下次跟进时间
                            if(nextInteractTime){
                                widget._addTask({
                                    carNo:widget.DEFAULTS.car["plate_number"],
                                    date:nextInteractTime,
                                    content:$(".interact-content").val(),
                                    carId:widget.DEFAULTS.carId,
                                    contactId:$(".interact-target .td.active").attr("data-id")
                                });
                            }

                            $(".interact-content,.next-interact-datetime").val("");
                            $(e).addClass("disableBtn").attr('disabled',true);
                        }else{
                            $(e).button("reset");
                            $(e).css("pointer-events","auto");
                        }

                    })
                })

        })
    },
    //增加任务
    _addTask:function(ops){

        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "\"task_detail\""
        }).done(function (thisApplet) {
            widget.DEFAULTS.taskDetail = thisApplet.applets[0].applet;
            var paramStr = "",paramData ={},prefix = "task",carprefix="car";
            paramStr +="{";
            paramStr += "\""+prefix+":title\":\""+ops.carNo+"+跟进\",";
            paramStr += "\""+prefix+":owner\":\""+Iptools.DEFAULTS.userId+"\",";
            paramStr += "\""+prefix+":status\":\"1\",";
            paramStr += "\""+prefix+":due_time\":\""+ops.date+"\",";
            paramStr += "\""+prefix+":description\":\"上次跟进记录："+ops.content+"\",";
            paramStr += "\""+prefix+":car_id\":\""+ops.carId+"\",";
            paramStr += "\""+prefix+":contact_id\":\""+ops.contactId+"\"";
            paramStr += "}";
            paramData["data"] = paramStr;
            paramData["appletId"] = widget.DEFAULTS.taskDetail;
            Iptools.uidataTool._addAppletData(paramData).done(function(data){
                if(data &&data.retcode == "ok"){
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "下次跟进任务创建成功"
                    });
                }
            })
        })
    },
    //发短信
    _saveMsg:function(e){
        $(e).css({
            "pointer-events":"none"
        });
        $(e).button("loading");
        var phone;
        if($(".send-target .td.active").length != 0){
            phone = $(".send-target .td.active .phoneVal").html();
        }else{
            return false;
        }
        Iptools.PostJson({
            url:"basic/sendSms",
            data:{
                token:Iptools.DEFAULTS.token,
                phoneList:phone,
                contactId:$(".send-target .td.active").attr("data-id"),
                customerId:widget.DEFAULTS.customer["id"],
                carId:widget.DEFAULTS.carId,
                content:$('.msg-content').val()+'【'+widget.DEFAULTS.msgSig+'】'
            }
        }).done(function(data){
            if(data.retcode == 'ok'){
                $(".search-area .search").trigger("click");
                Iptools.Tool.pAlert({
                    title: "系统提示",
                    content: "短信发送成功"
                });
                $(".msg-content").val("");
                $(e).addClass("disableBtn").attr('disabled',true);
                $(e).button("reset");
                $(e).css("pointer-events","auto");
            }else{
                $(e).button("reset");
                $(e).css("pointer-events","auto");
            }
        })
    },
    _enableContract:function(){
       $("body").on("click",".contractSwitch",function(){
           if($(this).hasClass("fa-angle-up")){
               $(this).removeClass("fa-angle-up").addClass("fa-angle-down");
               $(this).closest(".left-block").find(".slide-block").slideDown();
           }else{
               $(this).removeClass("fa-angle-down").addClass("fa-angle-up");
               $(this).closest(".left-block").find(".slide-block").slideUp();
           }
       })
        $("body").on("click",".statusItemSwitch",function(){
            var $this = $(this);
            //下拉
            if($(this).hasClass("fa-angle-up")){

                //如果没有加载过数据
                if($this.closest(".status-track-items").find(".status-block").html().trim() == ""){
                    trace._getInteractInfo({
                        "container":"#"+$this.closest(".status-track-items").attr("id"),
                        "pageNow":1,
                        "thisMonth":$this.closest(".status-track-items").attr("date-time")
                    }).done(function(){
                        $this.removeClass("fa-angle-up").addClass("fa-angle-down");
                        $this.closest(".status-track-items").find(".status-block").slideDown();
                    });
                }else{
                    $this.removeClass("fa-angle-up").addClass("fa-angle-down");
                    $this.closest(".status-track-items").find(".status-block").slideDown();
                }
            }else{
                $this.removeClass("fa-angle-down").addClass("fa-angle-up");
                $this.closest(".status-track-items").find(".status-block").slideUp();
            }
        })
    },
    //获取车辆相关信息
    _getCarInfo:function(){
        var obj = {
            "nameList": "\"car_Detail\""
        }
        Iptools.uidataTool._getCustomizeApplet(obj).done(function (thisView) {
            widget.DEFAULTS.carDetailApplet = thisView.applets[0].applet;
            component._panel(".left-top", {
                applet: widget.DEFAULTS.carDetailApplet,
                valueId: widget.DEFAULTS.carId,
                autoRefresh: false,
                allowEdit:false,
                events:[
                    {
                        target: ".pn-section .button-nav .pn-button.save",
                        type: "click",
                        event:function(e) {
                            e = e || event;
                            e.stopPropagation();
                            var me = $(this);
                            me.addClass("icon-spin icon-spinner");
                            setTimeout(function () {
                                me.removeClass("icon-spin icon-spinner");
                            },3000);
                        }
                    }],
                afterLoad:function(){
                    var data = $(".left-top").data("panel").options.DataOriginalSets;
                    $(".delivery_date").html(data['car'+':sold_date_vir']);
                    widget._buildCarStatusLine();
                }
            });

        })
    },
    //初始化前三个月
    _initMonthOrder:function(){
        var fdate = widget._getMonthBeforeCurrentDate(),
            sdate = widget._getMonthBeforeCurrentDate(1),
            tdate = widget._getMonthBeforeCurrentDate(2);
        $("#first-order").attr("date-time",fdate.yearMonth) ;//当前月份
        $("#second-order").attr("date-time",sdate.yearMonth) ;//当前1个月份
        $("#third-order").attr("date-time",tdate.yearMonth) ;//当前2个月份
        $("#first-order .status-item-title span").html(widget._convertDate(fdate.month)+" "+fdate.year);
        $("#second-order .status-item-title span").html(widget._convertDate(sdate.month)+" "+sdate.year);
        $("#third-order .status-item-title span").html(widget._convertDate(tdate.month)+" "+tdate.year);
        trace._getInteractInfo({
            "container":"#first-order",
            "pageNow":1,
            "thisMonth":fdate.yearMonth
        });
    },
    //日期转中文
    _convertDate:function(month){
        var result = "";
        var dict = {
            "01": "一",
            "02": "二",
            "03": "三",
            "04": "四",
            "05": "五",
            "06": "六",
            "07": "七",
            "08": "八",
            "09": "九",
            "10": "十",
            "11":"十一",
            "12":"十二"}
        result = dict[""+month]+"月";
        return result;
    },
    //构建柱状图
    _buildBars:function(type){
        var consumeArr = [],//消费柱状图
            timesArr = [],//次数柱状图
            parentHight = $(".trend-bar").height();

/*
*全部--
 总消费：total_amount_sum
 消费次数：total_consume_counter_vir
 到店次数：total_arrive_counter
 保养次数：total_baoyang_counter_vir
 当期--
 总消费：1year_consume_sum
 消费次数：1year_consume_counter_vir
 到店次数：1yerar_arrival_counter_vir
 保养次数：1year_baoyang_counter_vir
 */
        if(type === "all"){
            var totalAmount = widget.DEFAULTS.allBarDatas["total_amount_sum"]?widget.DEFAULTS.allBarDatas["total_amount_sum"]:0;//消费总金额
            //总消费
            consumeArr.push(Math.round(totalAmount));
            //自费金额
            consumeArr.push(widget.DEFAULTS.allBarDatas["zifei_amount_vir"]?Math.round(widget.DEFAULTS.allBarDatas["zifei_amount_vir"]):0);


            //到店
            timesArr.push(widget.DEFAULTS.allBarDatas["total_arrive_counter"]?widget.DEFAULTS.allBarDatas["total_arrive_counter"]:0);
            var arriveTimes = widget.DEFAULTS.allBarDatas["total_consume_counter_vir"]?widget.DEFAULTS.allBarDatas["total_consume_counter_vir"]:0;//总到店次数
            //消费次数
            timesArr.push(arriveTimes);
            //自费次数
            timesArr.push(widget.DEFAULTS.allBarDatas["zifei_counter_vir"]?widget.DEFAULTS.allBarDatas["zifei_counter_vir"]:0);
            //保养次数
            timesArr.push(widget.DEFAULTS.allBarDatas["total_baoyang_counter_vir"]?widget.DEFAULTS.allBarDatas["total_baoyang_counter_vir"]:0);


        }else{
            var totalAmount = widget.DEFAULTS.curBarDatas["1year_consume_sum"]?widget.DEFAULTS.curBarDatas["1year_consume_sum"]:0;//消费总金额
            //总消费
            consumeArr.push(Math.round(totalAmount));
            //自费金额
            consumeArr.push(widget.DEFAULTS.curBarDatas["1year_zifei_amount_vir"]?Math.round(widget.DEFAULTS.curBarDatas["1year_zifei_amount_vir"]):0);

            //到店次数
            timesArr.push(widget.DEFAULTS.curBarDatas["1yerar_arrival_counter_vir"]?widget.DEFAULTS.curBarDatas["1yerar_arrival_counter_vir"]:0);
            var arriveTimes = widget.DEFAULTS.curBarDatas["1year_consume_counter_vir"]?widget.DEFAULTS.curBarDatas["1year_consume_counter_vir"]:0;//总到店次数
            //消费次数
            timesArr.push(arriveTimes);
            //自费次数
            timesArr.push(widget.DEFAULTS.curBarDatas["1year_zifei_counter_vir"]?widget.DEFAULTS.curBarDatas["1year_zifei_counter_vir"]:0);
            //保养次数
            timesArr.push(widget.DEFAULTS.curBarDatas["1year_baoyang_counter_vir"]?widget.DEFAULTS.curBarDatas["1year_baoyang_counter_vir"]:0);


        }

        //消费bar
        var sortConsumeArr = widget._selectionSort(consumeArr),
            ConsumerMax = sortConsumeArr[1],
            conStandard = sortConsumeArr[1]*2,
            conFirstBarHeight,conSecondBarHeight;

            conFirstBarHeight = widget._calHeight({no:consumeArr[0],parentHeight:parentHight,baseNo:ConsumerMax});
            conSecondBarHeight = widget._calHeight({no:consumeArr[1],parentHeight:parentHight,baseNo:ConsumerMax});

        //消费额度
        $(".total-consume-bar").height(conFirstBarHeight).css("line-height",conFirstBarHeight+"px");
        $(".total-consume-bar .bar-val").html(consumeArr[0]);
        //自费金额
        $(".zifei_amount_vir").height(conSecondBarHeight).css("line-height",conSecondBarHeight+"px");
        $(".zifei_amount_vir .bar-val").html(consumeArr[1]);

        //次数bar
        var sortTimesArr = widget._selectionSort(timesArr),
            TimesMax = 30,
            //TimesStandard = TimesMax * 2,
            TimesFirstBarHeight,
            TimesSecondBarHeight,
            TimesThirdBarHeight,
            TimesFourBarHeight;
        TimesFirstBarHeight = widget._calHeight({no:timesArr[0],parentHeight:parentHight,baseNo:TimesMax});
        TimesSecondBarHeight = widget._calHeight({no:timesArr[1],parentHeight:parentHight,baseNo:TimesMax});
        TimesThirdBarHeight = widget._calHeight({no:timesArr[2],parentHeight:parentHight,baseNo:TimesMax});
        TimesFourBarHeight = widget._calHeight({no:timesArr[3],parentHeight:parentHight,baseNo:TimesMax});

        //到店次数
        $(".store-no-bar").height(TimesFirstBarHeight).css("line-height",TimesFirstBarHeight+"px");
        $(".store-no-bar .bar-val").html(timesArr[0]);
        //消费次数
        $(".current-consume-bar").height(TimesSecondBarHeight).css("line-height",TimesSecondBarHeight+"px");
        $(".current-consume-bar .bar-val").html(timesArr[1]);

        //自费次数
        $(".zifei_counter_vir").height(TimesFourBarHeight).css("line-height",TimesFourBarHeight+"px");
        $(".zifei_counter_vir .bar-val").html(timesArr[2]);
        //保养次数
        $(".maintain-no-bar").height(TimesThirdBarHeight).css("line-height",TimesThirdBarHeight+"px");
        $(".maintain-no-bar .bar-val").html(timesArr[3]);

    },
    _calHeight:function(ops){

        var no = ops.no,pHeight = ops.parentHeight||null,baseNo = ops.baseNo,result = 0;
        //如果最大数,父元素的高度为0
        if(baseNo === 0 || pHeight === 0){
            return 12;
        }else{
            result = Math.ceil(no/(baseNo*2) *pHeight);
            if(result < 10){
                result = 12;
            }else if(result >= baseNo){
                result = baseNo;
            }
        }
        return result;

    },
    //选择排序
    /*
    * 选择第一个元素，然后一次和第一个元素进行对比，如果有小于第一个的元素，做上标记，继续进行对比，只不过这次要和做上标记的元素进行比较，
    * 如果小于做上标记的元素，则把之前标记过的元素换成现在的，以此类推...，直至遍历完一趟,把小于第一个元素的元素和第一个更换位置
    * */
    _selectionSort:function(arr){
        var res = [];
        res = arr.slice(0);
        var len = res.length,temp,minIndex;
        for(var i = 0 ;i< len-1 ; i++){
            minIndex = i;
           for(var j = i+1;j<len;j++){
              if(res[minIndex]>res[j]){
                  minIndex = j;
              }
           }
            temp = res[minIndex];
            res[minIndex] = res[i];
            res[i] = temp;
        }
        return res;
    },
    //获取当前日期的前interval个月
    _getMonthBeforeCurrentDate: function(interval){
        var date = new Date(),
            year = parseInt(date.getFullYear()),
            curMonth = parseInt(date.getMonth())+1;
        var resultDte = {};
        if(interval){
            if(curMonth - parseInt(interval) <= 0){
                curMonth = curMonth-parseInt(interval)+12;
                year = year-1;
            }else{
                curMonth = curMonth-parseInt(interval);
            }
        }
        resultDte["yearMonth"] = year+"-"+widget._get2SitDecimalNo(curMonth);
        resultDte["year"] = year;
        resultDte["month"] = widget._get2SitDecimalNo(curMonth);
        return resultDte;
    },
    //构建2位十进制串
    _get2SitDecimalNo:function(figure){
        if(figure < 10){
            figure = "0"+figure;
        }
        return figure;
    },
    //监听是否有动态
    _listenMassage:function(){
        Iptools.Tool._pushListen("car_detail_trace_listener",function(ms){
            if(ms.channel === "car_detail_trace_listener"){
                $(".search-area .search").trigger("click");
            }
        })
    },
    //构建车辆动态line
    _buildCarStatusLine:function(){
        Iptools.uidataTool._getUserDetailAppletData({
            "appletId": widget.DEFAULTS.carDetailApplet,
            "valueId":widget.DEFAULTS.carId
        }).done(function(rt){
            if(rt&&rt.data){
                var data = rt.data;
                var carPrefix = "car",customerPrefix = "customer";
                //if(data[carPrefix+":sold_date"]){
                //    $(".sold_date").html(data[carPrefix+":sold_date"]);
                //}
                if(data[carPrefix+":warranty_start_date"]){
                    $(".warranty_start_date").html(data[carPrefix+":warranty_start_date"]);
                }
                if(data[carPrefix+":first_service_date"]){
                    $(".first_service_date").html(data[carPrefix+":first_service_date"]);
                }
                if(data[carPrefix+":first_maintain_date"]){
                    $(".first_maintain_date").html(data[carPrefix+":first_maintain_date"]);
                }
                if(data[carPrefix+":last_maintain_date"]){
                    $(".last_maintain_date").html(data[carPrefix+":last_maintain_date"]);
                }
                if(data[carPrefix+":last_service_date"]){
                    $(".last_service_date").html(data[carPrefix+":last_service_date"]);
                }

                if(data[carPrefix+":last_outreach_date"]){
                    $(".last_outreach_date").html(data[carPrefix+":last_outreach_date"]);
                }
                if(data[carPrefix+":next_maintain_date"]){
                    $(".next_maintain_date").html(data[carPrefix+":next_maintain_date"]);
                }
                if(data[carPrefix+":maintain_times"]){
                    widget.DEFAULTS.car["maintain_times"] = data[carPrefix+":maintain_times"];
                }
                if(data[carPrefix+":plate_number"]){
                    widget.DEFAULTS.car["plate_number"] = data[carPrefix+":plate_number"];
                }
                widget.DEFAULTS.customer["id"] = data[customerPrefix+":id"];
                widget.DEFAULTS.customer["name"] = data[customerPrefix+":customer_name"];
                widget.DEFAULTS.customer["phone"] = data[customerPrefix+":customer_cellphone"];
                //构建总消费次数等数据
                widget.DEFAULTS.allBarDatas["total_amount_sum"] = data[carPrefix+":total_amount_sum"];
                widget.DEFAULTS.allBarDatas["total_consume_counter_vir"] = data[carPrefix+":total_consume_counter_vir"];
                widget.DEFAULTS.allBarDatas["total_arrive_counter"] = data[carPrefix+":total_arrive_counter"];
                widget.DEFAULTS.allBarDatas["total_baoyang_counter_vir"] = data[carPrefix+":total_baoyang_counter_vir"];
                widget.DEFAULTS.allBarDatas["zifei_counter_vir"] = data[carPrefix+":zifei_counter_vir"];
                widget.DEFAULTS.allBarDatas["zifei_amount_vir"] = data[carPrefix+":zifei_amount_vir"];

                //构建当期总消费次数等数据
                widget.DEFAULTS.curBarDatas["1year_consume_sum"] = data[carPrefix+":1year_consume_sum"];
                widget.DEFAULTS.curBarDatas["1year_consume_counter_vir"] = data[carPrefix+":1year_consume_counter_vir"];
                widget.DEFAULTS.curBarDatas["1yerar_arrival_counter_vir"] = data[carPrefix+":1yerar_arrival_counter_vir"];
                widget.DEFAULTS.curBarDatas["1year_baoyang_counter_vir"] = data[carPrefix+":1year_baoyang_counter_vir"];
                widget.DEFAULTS.curBarDatas["1year_zifei_counter_vir"] = data[carPrefix+":1year_zifei_counter_vir"];
                widget.DEFAULTS.curBarDatas["1year_zifei_amount_vir"] = data[carPrefix+":1year_zifei_amount_vir"];

                widget._buildMilesLIne(rt);
                widget._buildBars("all");
                widget._buildContactList();
            }
        })
    },
    //获取车关联的新车销售信息
    _getNewCarList:function(){

//        Iptools.uidataTool._getCustomizeApplet({
//            nameList: "'car_newCar_list'"
//        }).done(function (r) {
//            if (r && r.applets && r.applets.length) {
//                widget.DEFAULTS.newCarLinkListApplet = r.applets[0].applet;
//                Iptools.uidataTool._getUserlistAppletData({
//                    "appletId": widget.DEFAULTS.newCarLinkListApplet,
//                    "condition": "{'car:car_id':' =" + widget.DEFAULTS.carId + "'}",
//                    "orderByColumn":"sold_car:update_time",
//                    "orderByAscDesc":"asc"
//                }).done(function (r) {
//                    if (r && r.data && r.data.records && r.data.records.length !== 0) {
//                       $(".delivery_date").html(r.data.records[0]["sold_car:delivery_date"]);
//                    }
//                })
//            }
//        })
    },
    //构建车辆里程line
    _buildMilesLIne:function(rt){
        $(".mileage-track-line .track-items").loading();
        var data = rt.data;
        var carPrefix = "car";
        //首次进厂里程
        if(data[carPrefix+":first_service_miles"]){
            widget.DEFAULTS.carMilesArr.push(data[carPrefix+":first_service_miles"]);
        }else{
            widget.DEFAULTS.carMilesArr.push(0);
        }
        var obj = {
            "nameList": "\"car_contact_car_service_list\""
        }
        var html = '';
        //获取每一条车对应工单的里程
        Iptools.uidataTool._getCustomizeApplet(obj).done(function (thisView) {
            widget.DEFAULTS.SRDetailApplet = thisView.applets[0].applet;
            Iptools.uidataTool._getUserlistAppletData({
                "appletId": widget.DEFAULTS.SRDetailApplet,
                "condition":"{'contact_car_service_record:car_id':' =" + widget.DEFAULTS.carId + "'}",
                "orderByColumn":"contact_car_service_record:order_date",
                "orderByAscDesc":"asc"
            }).done(function(r){
                $(".mileage-track-line .track-items .load-data-container").remove();
                if(r&&r.data&& r.data.records&&r.data.records.length !== 0){
                    var records = r.data.records;
                    //for(var i = 0,len = records.length;i<len;i++){
                    //    if(records[i]["contact_car_service_record:car_serice_complete_miles"]){
                    //        widget.DEFAULTS.carMilesArr.push(records[i]["contact_car_service_record:car_serice_complete_miles"]);
                    //    }
                    //}
                    //末次进厂里程
                    if(data[carPrefix+":last_service_miles"]){
                        widget.DEFAULTS.carMilesArr.push(data[carPrefix+":last_service_miles"]);
                    }else{
                        widget.DEFAULTS.carMilesArr.push(0);
                    }
                    //当前里程
                    if(data[carPrefix+":1year_predict_miles_vir"]){
                        widget.DEFAULTS.carMilesArr.push(data[carPrefix+":1year_predict_miles_vir"]);
                    }else{
                        widget.DEFAULTS.carMilesArr.push(0);
                    }
                    //构建line
                    var sum = eval(widget.DEFAULTS.carMilesArr.join("+"));

                    for(var j = 0,clen = widget.DEFAULTS.carMilesArr.length;j<clen;j++){
                        if(widget.DEFAULTS.carMilesArr[j] != 0){
                            var pec = widget.DEFAULTS.carMilesArr[j]/sum* 100 +"%";
                            //if(j === 0){
                                html += '<div class="track-item green track'+j+'" style="width:'+pec+'" data-initwth="'+pec+'">';
                            //}else if(j === 1){
                            //    html += '<div class="track-item blue track'+j+'" style="width:'+pec+'" data-initwth="'+pec+'">';
                            //}else{
                            //    html += '<div class="track-item orange track'+j+'" style="width:'+pec+'" data-initwth="'+pec+'">';
                            //}
                            if(j === 0){
                                html +=
                                    '<span title="'+widget.DEFAULTS.carMilesArr[j]+'">'+widget.DEFAULTS.carMilesArr[j]+'</span>'+
                                    '<i>首次进场</i>'+
                                    '</div>';
                            }else if(j === clen-1){
                                html +=
                                    '<span title="'+widget.DEFAULTS.carMilesArr[j]+'">'+widget.DEFAULTS.carMilesArr[j]+'</span>'+
                                    '<i>当前里程</i>'+
                                    '</div>';
                            }else{
                                html +=
                                    '<span title="'+widget.DEFAULTS.carMilesArr[j]+'">'+widget.DEFAULTS.carMilesArr[j]+'</span>'+
                                    '<i>末次进场</i>'+
                                    '</div>';
                            }
                        }
                    }
                    //var titleHtml = "";
                    //titleHtml = '<div class="bottom-title-area"><span class="left-title">首次进场</span><span class="right-title" style="float:right">末次进场</span></div>';
                    $(".mileage-track-line").append(html);
                }else{
                    html += '<div class="track-item blue track0" style="width:100%">';
                    html +=
                        '<span>0</span>'+
                        '<i></i>'+
                        '</div>';
                    $(".mileage-track-line").append(html);
                }
            })
        })
    },
    //构建保险列表
    _buildInsuranceList:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'car_insurance_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                component._table(".insurance-list", {
                    pageNow: 1,
                    pageSize: 10,
                    showChecks: false,
                    applet: r.applets[0].applet,
                    condition:{"insurance:car_id":" ="+widget.DEFAULTS.carId},
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "还没有保险记录",
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    afterLoad:function(){
                        var options = $(".insurance-list").data("stable").options;
                        var record;
                        if(options){
                            var data=$(".insurance-list").data("stable").options.data;
                            if(data && data.records && data.records.length){
                                record = data.records[0];
                                var currInsuranceId = record["insurance:id"];
                                //取最新的保险做展示
                                Iptools.uidataTool._getCustomizeApplet({
                                    nameList: "'car_insurance_detail'"
                                }).done(function (robj) {
                                    //构建左下保险相关信息
                                    component._panel(".left-bottom", {
                                        applet: robj.applets[0].applet,
                                        valueId: currInsuranceId,
                                        autoRefresh: false,
                                        allowEdit:false,
                                        afterLoad:function(){
                                            //投保结束字段
                                            var data = $(".left-bottom").data("panel");
                                            if(data && data.options && data.options.data){
                                                $(".insurance-end-time").html(data.options.data["insurance:insurance_end_date"]);

                                                var height = $(".wrap-left").height();
                                                $(".wrap").css("min-height",height);
                                            }
                                        }
                                    });
                                })

                            }
                        }

                    }
                })
            }
        })
    },
    //构建工单列表
    _buildSRList:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'car_SR_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                component._table(".SR-list", {
                    pageNow: 1,
                    pageSize: 10,
                    showChecks: false,
                    applet: r.applets[0].applet,
                    condition:{"sr:car_id":" ="+widget.DEFAULTS.carId},
                    orderByColumn:"sr:create_time",
                    orderByAscDesc:"desc",
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "还没有工单记录",
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    afterLoad:function(){
                        //末次跟进字段
                        var options = $(".SR-list").data("stable").options;
                        var record;
                        //if(options){
                        //    var data=$(".SR-list").data("stable").options.data;
                        //    if(data && data.records && data.records.length){
                        //        record = data.records[0];
                        //        $(".open-date").html(record["sr:open_date"]);
                        //    }
                        //
                        //}

                    }
                })
            }
        })
    },
    //构建联系人列表
    _buildContactList:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_car_link'"
            }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                widget.DEFAULTS.contactCarLinkListApplet = r.applets[0].applet;
                component._table(".contact-list", {
                    pageNow: 1,
                    pageSize: 10,
                    showChecks: false,
                    applet: r.applets[0].applet,
                    condition:{"contact_car_link:car_id":" ="+widget.DEFAULTS.carId,"contact_car_link:contact_type":" =3"},
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "还没有联系人记录",
                    emptySearch: "没有搜索到数据，请更换关键词后再次搜索",
                    afterLoad:function(){
                        var options = $(".contact-list").data("stable").options;
                        var record;
                        if(options){
                            var data=$(".contact-list").data("stable").options.data;
                            if(data && data.records && data.records.length){
                                for(var i = 0,len = data.records.length;i<len;i++){
                                    if(data.records[i]["contact:is_valid"]){
                                        //送修人
                                        if(data.records[i]["contact:contactType"] === "3"){
                                            widget.DEFAULTS.contact_repairer["id"] = data.records[i]["contact_car_link:contact_id"].id;
                                            widget.DEFAULTS.contact_repairer["name"] = data.records[i]["contact_car_link:contact_id"].name;
                                            widget.DEFAULTS.contact_repairer["phone"] = data.records[i]["contact:phone"];
                                        }else{
                                            widget.DEFAULTS.contact_linker["id"] = data.records[i]["contact_car_link:contact_id"].id;
                                            widget.DEFAULTS.contact_linker["name"] = data.records[i]["contact_car_link:contact_id"].name;
                                            widget.DEFAULTS.contact_linker["phone"] = data.records[i]["contact:phone"];
                                        }

                                    }
                                }
                            }
                        }
                    }
                })
            }
        })
    },
    //构建tab及tabcontent
    _initTabPanel:function(container,ops){
        //声明tabs对象
        var tabs = function(con,options){
            this.$container = $(con);
            this.options = $.extend({},tabs.Default,options);
            this._init();
        }
        tabs.Default ={
            uniqContainer:"",
            initTabActive:null,//初始化tab
            afterLoad:null//自定义点击tab事件
        }
        tabs.prototype ={
          _init:function(){
              //导航tab的显示名称数组
              var  navTabShowName = this.options.navTabShowName,
                  navTabShowNameLen = navTabShowName.length;
              //对应tab的内容dom数组
              var tabContents = this.$container.find(".tab-content-item"),
                  tabContentsLen = tabContents.length;
              this.options.uniqContainer = this.$container.selector.replace(/\.|#/g, "");
              //循环数组
              var arr = [];
              var navDom = "",
                  contentDom = "";
              navDom +='<ul class="nav nav-tabs ip-nav-tabs" role="tablist">';
              contentDom += '<div class="tab-content">';
              if(navTabShowNameLen >= tabContentsLen){
                  arr = navTabShowName;
              }else{
                  arr = tabContents;
              }
              for(var i = 0;i < arr.length;i++){
                  if(navTabShowName[i]){
                      navDom +='<li role="presentation"><a class="ip-nav-tab" href="#'+this.options.uniqContainer+'Contant'+i+'" aria-controls="tabContant'+i+'" role="tab" data-toggle="tab">'+navTabShowName[i]+'</a></li>';
                  }else{
                      navDom +='<li role="presentation"><a class="ip-nav-tab" href="#'+this.options.uniqContainer+'Contant'+i+'" aria-controls="tabContant'+i+'" role="tab" data-toggle="tab">标签页'+i+1+'</a></li>';
                  }
                  if(tabContents[i]){
                      contentDom += '<div role="tabpanel" class="tab-pane" id="'+this.options.uniqContainer+'Contant'+i+'">'+tabContents[i].innerHTML+'</div>';
                  }else{
                      contentDom += '<div role="tabpanel" class="tab-pane" id="'+this.options.uniqContainer+'Contant'+i+'"></div>';
                  }
              }
              navDom +='</ul>';
              contentDom += '</div>';
              this.$container.html(navDom+contentDom);
              //初始化显示的tab
              if (this.options.initTabActive && typeof this.options.initTabActive == "function") {
                  this.options.initTabActive();
              }else{
                  $('a[href=#'+this.options.uniqContainer+'Contant'+'0]').tab('show');
              }

              //构建完dom执行的函数
              if (this.options.afterLoad && typeof this.options.afterLoad == "function") {
                  this.options.afterLoad();
              }

          },
        }
        //实例化tabs对象
        var tabsObj = new tabs(container,ops);
    },
    //构建筛选下拉框
    _buildSelectPanel:function(rs) {
        var div = document.createElement("div");
        $(div).addClass("s-search-bar");
        for (var i = 0; i < rs.columns.length; i++) {
            var col = rs.columns[i];
            if (col.allowOutterQuery && col.searchType) {
                var csd = document.createElement("div");
                $(csd).addClass("s-search-item").data({
                    "type": col.searchType,
                    "column": col.column,
                    "name": col.name,
                    "isNewLine": col.isNewLine,
                    "isSeprate": col.isSeprate,
                    "seprateTitle": col.seprateTitle
                });
                if (Iptools.Tool._checkNull(col.size)) {
                    $(csd).data("size", col.size);
                } else {
                    $(csd).data("size", 12);
                }
                var sgd = document.createElement("div");
                $(sgd).addClass("form-group");
                var searchFlag = false;
                var v1 = "", v2 = "";
                switch (col.searchType) {
                    case "text":
                        //清空操作
                        if (trace.DEFAULTS.selectCondition && trace.DEFAULTS.selectCondition[col.column]) {
                            var tstr = trace.DEFAULTS.selectCondition[col.column];
                            if (Iptools.Tool._checkNull(tstr) && tstr.indexOf("like") != -1) {
                                v1 = tstr.split("%")[1].split("%")[0];
                            }
                        }
                        $(sgd).append("<label>" + col.name + "</label>",
                            $("<input type='text' class='form-control' value='" + v1 + "' />").data("column", col.column));
                        $(csd).append(sgd);
                        searchFlag = true;
                        break;
                    case "select":
                        if (trace.DEFAULTS.selectCondition && trace.DEFAULTS.selectCondition[col.column]) {
                            var sstr = trace.DEFAULTS.selectCondition[col.column];
                            if (Iptools.Tool._checkNull(sstr) && sstr.indexOf("=") != -1) {
                                v1 = sstr.split("=")[1];
                                if (v1.indexOf("'") != -1 || v1.indexOf('"') != -1) {
                                    v1 = Iptools.Tool._search_replacement(v1);
                                }
                            }
                        }
                        $(sgd).append("<label>" + col.name + "</label>");
                        var sel = document.createElement("select");
                        $(sel).addClass("form-control").append("<option value=''>请选择...</option>").data("column", col.column);
                        if (col.pickList && col.pickList.length) {
                            for (var s = 0; s < col.pickList.length; s++) {
                                var pi = col.pickList[s];
                                if (pi.id == v1) {
                                    $(sel).append("<option value='" + pi.id + "' selected='true'>" + pi.name + "</option>");
                                } else {
                                    $(sel).append("<option value='" + pi.id + "'>" + pi.name + "</option>");
                                }
                            }
                        }
                        $(csd).append($(sgd).append(sel));
                        searchFlag = true;
                        break;
                    case "bool":
                        if (trace.DEFAULTS.selectCondition && trace.DEFAULTS.selectCondition[col.column]) {
                            var bstr = trace.DEFAULTS.selectCondition[col.column];
                            if (Iptools.Tool._checkNull(bstr) && bstr.indexOf("=") != -1) {
                                v1 = bstr.split("=")[1];
                                if (v1.indexOf("'") != -1 || v1.indexOf('"') != -1) {
                                    v1 = Iptools.Tool._search_replacement(v1);
                                }
                            }
                        }
                        $(sgd).append("<label>" + col.name + "</label><br />",
                            $("<input type='checkbox' class='s-search-switch' " +
                                (v1 == "1" ? "checked:'checked'" : "") + " />").data("column", col.column));
                        $(csd).append(sgd);
                        searchFlag = true;
                        break;
                    case "date":
                        if (trace.DEFAULTS.selectCondition && trace.DEFAULTS.selectCondition[col.column]) {
                            var dstr = trace.DEFAULTS.selectCondition[col.column];
                            if (Iptools.Tool._checkNull(dstr) && dstr.indexOf("=") != -1) {
                                v2 = dstr.split("=")[1];
                                if (v2.indexOf("'") != -1 || v2.indexOf('"') != -1) {
                                    v2 = Iptools.Tool._search_replacement(v2);
                                }
                            }
                        }
                        $(sgd).append("<label>" + col.name + "</label>",
                            $("<input type='text' class='form-control datePicker low' placeholder='开始日期' />").data("column", col.column),
                            $("<input type='text' class='form-control datePicker high' placeholder='结束日期' />").data("column", col.column));
                        $(csd).append(sgd);
                        searchFlag = true;
                        break;
                    case "time":
                        $(sgd).append("<label>" + col.name + "</label>",
                            $("<input type='text' class='form-control timePicker low' placeholder='开始时间' />").data("column", col.column),
                            $("<input type='text' class='form-control timePicker high' placeholder='结束时间' />").data("column", col.column));
                        $(csd).append(sgd);
                        searchFlag = true;
                        break;
                    case "pickApplet":
                        $(sgd).append("<label>" + col.name + "</label>", $("<div class='input-group'></div>").append(
                            $("<input type='text' class='form-control s-search-applet-ip' disabled='disabled' />").data("column", col.column),
                            $("<span class='input-group-addon s-search-applet'><span class='fa fa-search'></span></span>").data("applet", col.pickApplet)));
                        $(csd).append(sgd);
                        searchFlag = true;
                        break;
                }
                $(div).append(csd);
                $(".search-area li").html(div);
            }
        }
        $(".search-area .s-search-bar").append("<div class='btn-group-right'><button class='btn cancel revert clearForm'>清 空</button>" +
            "<button class='btn commonBtn search' style='margin-left: 15px'>筛 选</button></div>");
        widget._bindSelectEvent();
        trace.DEFAULTS.selectPanel = 1;
    },
    _getTraceByCondition:function(e){
        var condition = widget._buildCondition(e);
        $("#first-order .status-block").html("");
        $("#second-order .status-block").html("");
        $("#third-order .status-block").html("");
        //把构建好的condition对象存放到全局变量中
        trace.DEFAULTS.selectCondition = $.extend(true,{},condition);
        trace._getInteractInfo({
            "container":"#first-order",
            "pageNow":1,
            "thisMonth":$("#first-order").attr("date-time"),
            "condition":condition
        })

    },
    //筛选动态轨迹
    _buildCondition:function(e){
        var $e = $(e),$p = $e.closest(".s-search-bar");
        var condition = {};
        var cons = $p.find(".s-search-item");
        cons.each(function (key, obj) {
            var col = $(obj).data("column"), v1, v2;
            switch ($(obj).data("type")) {
                case "text":
                    v1 = $(obj).find("input").val();
                    if (v1 != "") {
                        condition[col] = " like '%" + v1 + "%'";
                    } else {
                        delete condition[col];
                    }
                    break;
                case "select":
                    v1 = $(obj).find("select").val();
                    if (v1 != "") {
                        condition[col] = " ='" + v1 + "'";
                    } else {
                        delete condition[col];
                    }
                    break;
                case "date":
                case "time":
                    v1 = $(obj).find("input.low").val();
                    v2 = $(obj).find('input.high').val();
                    if (v1 != "" && v2 != "") {
                        condition[col] = " between '" + v1 + "' and '" + v2 + "'";
                    } else if (v1 != "") {
                        condition[col] = " >='" + v1 + "'";
                    } else if (v2 != "") {
                        condition[col] = " <='" + v2 + "'";
                    } else {
                        delete condition[col];
                    }
                    break;
                case "bool":
                    try {
                        v1 = $(obj).find("input.s-search-switch").bootstrapSwitch('state');
                        if (v1) {
                            condition[col] = " =" + 1 + "";
                        } else {
                            delete condition[col];
                        }
                    } catch (ex) {
                        console.log("ERROR: required bootstrap-switch");
                    }
                    break;
                case "pickApplet":
                    try {
                        v1 = $(obj).find(".s-search-applet").data("key");
                        if (Iptools.Tool._checkNull(v1)) {
                            condition[col] = " =" + v1 + "";
                        } else {
                            delete condition[col];
                        }
                    } catch (ex) {
                        console.log("ERROR: Can not Read HTML-DATA value");
                    }
                    break;
            }
        });
        console.log(condition);
        return condition;
    },
    //清空筛选
    _clearSelect:function(){
        //var condition = widget._buildCondition(e);
        $("#first-order .status-block").html("");
        $("#second-order .status-block").html("");
        $("#third-order .status-block").html("");
        //把构建好的condition对象存放到全局变量中
        trace.DEFAULTS.selectCondition = {};
        trace._getInteractInfo({
            "container":"#first-order",
            "pageNow":1,
            "thisMonth":$("#first-order").attr("date-time")
        })
    },
    //构建互动对象的option
    _buildInteractOptions:function(){
        var html = "";
        html +='<ul class="th">'+
            '<li>类型</li>'+
            '<li>姓名</li>'+
            '<li>电话</li>'+
            '</ul>';
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_car_link'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                widget.DEFAULTS.contactCarLinkListApplet = r.applets[0].applet;
                Iptools.uidataTool._getUserlistAppletData({
                    "appletId": widget.DEFAULTS.contactCarLinkListApplet,
                    "condition": "{'contact_car_link:car_id':' =" + widget.DEFAULTS.carId + "','contact_car_link:is_obsolete':' =0'}"
                }).done(function (r) {
                    if (r && r.data && r.data.records && r.data.records.length !== 0) {
                        var r = r.data.records;
                        for (var i = 0, len = r.length; i < len; i++) {
                            var name = r[i]["contact_car_link:contact_id"].name, phone = r[i]["contact:phone"] ? r[i]["contact:phone"] : "";
                            if (name.length >= 6) {
                                name = name.substring(0, 5) + "...";
                            }
                            html += '<ul class="td" data-type="' + r[i]["contact_car_link:contact_type"].id + '" data-id="' + r[i]["contact_car_link:contact_id"].id + '">';
                            html += '<li>' + r[i]["contact_car_link:contact_type"].name + '</li>';
                            html += '<li title="' + r[i]["contact_car_link:contact_id"].name + '">' + name + '</li>';
                            html += '<li class="phoneVal">' + phone + '</li>';
                            html += '</ul>';
                        }
                        $(".send-target,.interact-target").html(html);
                    }
                })
            }
        })
    },
    //构建短信模板
    _buildMsgTemplet:function(){
        var html = "";
        html +='<ul class="th">'+
            '<li>模板名称</li>'+
            '<li>内容</li>'+
            //'<li>电话</li>'+
            '</ul>';
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'car_sms_templet_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                widget.DEFAULTS.contactCarLinkListApplet = r.applets[0].applet;
                Iptools.uidataTool._getUserlistAppletData({
                    "appletId": widget.DEFAULTS.contactCarLinkListApplet,
                    "condition": "{'sms_templet:type':' =33'}"
                }).done(function (r) {
                    if (r && r.data && r.data.records && r.data.records.length !== 0) {
                        var r = r.data.records;
                        for (var i = 0, len = r.length; i < len; i++) {
                            var name = r[i]["sms_templet:name"], content = r[i]["sms_templet:content"] ? r[i]["sms_templet:content"] : "";
                            if (name.length >= 10) {
                                name = name.substring(0, 9) + "...";
                            }
                            if (content.length >= 20) {
                                content = content.substring(0, 19) + "...";
                            }
                            html += '<ul class="td" data-id="' + r[i]["sms_templet:id"] + '">';
                            html += '<li title="' + r[i]["sms_templet:name"] + '">' + name + '</li>';
                            html += '<li title="' + r[i]["sms_templet:content"] + '">' + content + '</li>';
                            //html += '<li class="phoneVal">' + phone + '</li>';
                            html += '</ul>';
                        }
                        $(".msg-templet").html(html);
                    }
                })
            }
        })
    }
}