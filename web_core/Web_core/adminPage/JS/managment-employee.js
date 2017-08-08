//var serviceUrl = window.sessionStorage.getItem("serviceUrl");
//var API_URL = window.sessionStorage.getItem("API_URL");
var PAGE_SIZE = 6;
var PAGE_NOW = 1;
setTimeout(function(){
    getEmployeesData();
},400);
//getEmployeesData();
//获取列表数据
function getEmployeesData(){
//    alert(1);
    Iptools.GetJson({
        url: "basic/list_employee_paging",
        data: {
            token: Iptools.DEFAULTS.token,
            pageNow: PAGE_NOW,
            pagesize: PAGE_SIZE
        },
    }).done(function(data){
        if(data){
            buildTable(data);
        };
    });
//	var param={
//	    //tenantId: window.sessionStorage.getItem('tenantId'),
//	    tenantId: window.sessionStorage.getItem('tenantId'),
//		pageNow: PAGE_NOW,
//		pagesize: PAGE_SIZE
//	}
//	var url = API_URL + "basic/list_employee_paging";
//	$.ajax({
//		url: url,
//		data: param,
//		success:function(data){
//			buildTable(data);
//			//alert(data);
//		}
//
//	});
};


//构建table
function buildTable(data){
	$("#pagenumber").html(data.pageNow+"/"+data.pageCount);
	$(".pageSkip").attr("max-page",data.pageCount);
	$(".pageNext").attr("max-page",data.pageCount);
	$("#toPage").attr("max-page",data.pageCount);
	$("tbody").html("");
	var max = data.records.length;
	var tableData = data.records;
	var tableHtml = '<tr>';
	for(var i = 0;i < max;i++){
		var jobtitle;
		var email;
        var responsibilityName;
		if(tableData[i].jobTitle === null || tableData[i].jobTitle === ""){
			jobtitle = "";
		}else{
			jobtitle = tableData[i].jobTitle;
		};
		if(tableData[i].email === null || tableData[i].email === ""){
			email = "";
		}else{
			email = tableData[i].email;
		};
        if( tableData[i].responsibilityName == null ||  tableData[i].responsibilityName == ""){
            responsibilityName = "点击添加权限";
        }else{
            responsibilityName = tableData[i].responsibilityName;
        }
		tableHtml += '<td>'+(i+1)+'</td>'+
               '<td>'+tableData[i].name+'</td>'+
//               '<td>'+email+'</td>'+
               '<td>'+tableData[i].organizationName+'</td>'+
               '<td>'+tableData[i].positionName+'</td>'+
//               '<td>'+jobtitle+'</td>'+
               '<td>'+tableData[i].phone+'</td>'+
               '<td>'+tableData[i].loginName+'</td>'+
            '</td>'+
            '<td  style="text-align:center;cursor:pointer">'+
            '<a class="selRole" data-toggle="modal" data-id="'+tableData[i].id+'" onclick="openRoleModal(this)" style="color: #3276b1">'+
            responsibilityName+'</a>'+
            '</td>'+
               '<td style="text-align:center">'+
                   '<button class="btn btn-primary btn-sm" data-toggle="modal" data-id="'+tableData[i].id+'" onclick="openUpdateModal(this)" style="background-color: #ffffff;color: #3276b1;margin-right: 10px;">'+
               '更新</button>'+
                   '<button class="btn btn-danger btn-sm" data-toggle="modal" data-id="'+tableData[i].id+'" onclick="openDeleteModal(this)" style="background-color: #ffffff;color: #D9534F;margin-right: 10px;">'+
		       '删除</button>'+
           '</tr>';
	}
	$(".table-area table tbody").append(tableHtml);
}

//打开权限的modal
function openRoleModal(e){
    getRoleList($(e).attr("data-id"));
    setTimeout(function(){
        $('#roleModal').modal('show');
    },300);

}
function getRoleList(id){
    $("ul").html("");
    $("#setRole").attr("data-id",id);
//    var param={
//        //tenantId: window.sessionStorage.getItem('tenantId'),
//        tenantId: window.sessionStorage.getItem('tenantId'),
//        empId:id
////        pageNow: PAGE_NOW,
////        pagesize: PAGE_SIZE
//    };
//    var url = API_URL + "basic/queryResListByEmpId?tenantId="+param.tenantId+"&empId="+param.empId;
    //列出所有的权限
    Iptools.GetJson({
        url: "basic/responsibilitys",
        data: {
            token: Iptools.DEFAULTS.token
        },
    }).done(function(data){
        if(data){
            for(var r=0;r<data.length;r++){
                var htmlObj =
                    '<li onclick="selRes(this)">'+
                    '<input type="radio" name="role" data-id="'+data[r].id+'"/>'+
                    '<span>'+data[r].name+'</span>'+
                    '</li>';
                $("#roleModal .modal-body ul").append(htmlObj);
            };
            //找出该员工已选的权限,该员工可能有多个权限，目前只显示他所选的第一个权限
            Iptools.GetJson({
                url: "basic/queryResListByEmpId",
                data: {
                    token: Iptools.DEFAULTS.token,
                    empId:id
                },
            }).done(function(data){
                if(data){
                    if(data.length == 0){
                        return;
                    }else{
//                            empSelRole = data[0].resName;
//                       console.log(data[0].resId);
                        $('input:radio[data-id="'+data[0].resId+'"]').prop("checked",true);
                    }
                };
            })
        }
    })
//    $.ajax({
//        url:API_URL+"basic/responsibilitys?tenantId="+param.tenantId,
//        data:param.tenantId,
//        success:function(data){
//            console.log(data);
//                for(var r=0;r<data.length;r++){
//                    var htmlObj =
//                        '<li onclick="selRes(this)">'+
//                        '<input type="radio" name="role" data-id="'+data[r].id+'"/>'+
//                        '<span>'+data[r].name+'</span>'+
//                        '</li>';
//                    $("#roleModal .modal-body ul").append(htmlObj);
//                };
//            //找出该员工已选的权限,该员工可能有多个权限，目前只显示他所选的第一个权限
//                $.ajax({
//                    url: url,
//                    data: param,
//                    success:function(data){
//                        if(data.length == 0){
//                            return;
//                        }else{
////                            empSelRole = data[0].resName;
//                            $('input:radio[data-id="'+data[0].resId+'"]').prop("checked",true);
//                        }
//
//                    }
//
//                });
//        }
//    })

}
//点击li使radio选中
function selRes(e){
     $(e).find("input:radio[name='role']").prop("checked",true);
}



//打开新建modal，动态填充select
function openNewModal(e){
	$('#newModal').modal('show');
    //密码打开时永远为空
    $(".loginPwd").val("");
	buildSelectArea();
}

//构建新建modal的select
function buildSelectArea(){
    //权限
    Iptools.GetJson({
        url: "basic/responsibilitys",
        data: {
            token: Iptools.DEFAULTS.token
//            id : id
        },
    }).done(function(data){
        if(data){
            $("#newModal .role").html("");
            $("#updateModal .role").html("");
            var optionHtml = "";
            optionHtml = '<option value="" selected="selected" label=""></option>';
            var max = data.length;
            for(var i = 0;i < max ;i++){
                optionHtml += '<option value="'+data[i].id+'" label="'+data[i].name+'">'+data[i].name+'</option>';

            }
            $("#newModal .role").append(optionHtml);
            $("#updateModal .role").append(optionHtml);
        };
    });
//    $.ajax({
//        url:API_URL+"basic/responsibilitys?tenantId="+window.sessionStorage.getItem('tenantId'),
//        //data:{tenantId: window.sessionStorage.getItem('tenantId')},
//        data: {tenantId: window.sessionStorage.getItem('tenantId')},//test
//        type: "get",
//        success:function(data){
//            $("#newModal .role").html("");
//            $("#updateModal .role").html("");
//            var optionHtml = "";
//            optionHtml = '<option value="" selected="selected" label=""></option>';
//            var max = data.length;
//            for(var i = 0;i < max ;i++){
//                optionHtml += '<option value="'+data[i].id+'" label="'+data[i].name+'">'+data[i].name+'</option>';
//
//            }
//            $("#newModal .role").append(optionHtml);
//            $("#updateModal .role").append(optionHtml);
//        }
//    });
	//部门
    Iptools.GetJson({
        url: "basic/organizations",
        data: {
            token: Iptools.DEFAULTS.token
//            id : id
        },
    }).done(function(data){
        if(data){
            $("#newModal .organization").html("");
            $("#updateModal .organization").html("");
            var optionHtml = "";
            optionHtml = '<option value="" selected="selected" label=""></option>';
            var max = data.length;
            for(var i = 0;i < max ;i++){
                optionHtml += '<option value="'+data[i].id+'" label="'+data[i].name+'">'+data[i].name+'</option>';
            }
            $("#newModal .organization").append(optionHtml);
            $("#updateModal .organization").append(optionHtml);
        };
    });
//	$.ajax({
//		url: API_URL + "basic/organizations",
//		//data:{tenantId: window.sessionStorage.getItem('tenantId')},
//		data: {tenantId: window.sessionStorage.getItem('tenantId')},//test
//		async: false,
//		success:function(data){
//			$("#newModal .organization").html("");
//            $("#updateModal .organization").html("");
//			var optionHtml = "";
//			optionHtml = '<option value="" selected="selected" label=""></option>';
//		    var max = data.length;
//			for(var i = 0;i < max ;i++){
//				optionHtml += '<option value="'+data[i].id+'" label="'+data[i].name+'">'+data[i].name+'</option>';
//		    }
//			$("#newModal .organization").append(optionHtml);
//            $("#updateModal .organization").append(optionHtml);
//		}
//	})
	//职位
    Iptools.GetJson({
        url: "basic/positions",
        data: {
            token: Iptools.DEFAULTS.token
//            id : id
        },
    }).done(function(data){
        if(data){
            $("#newModal .position").html("");
            $("#updateModal .position").html("");
            var optionHtml = "";
            optionHtml = '<option value="" selected="selected" label=""></option>';
            var max = data.length;
            for(var i = 0;i < max ;i++){
                optionHtml += '<option value="'+data[i].id+'" label="'+data[i].name+'">'+data[i].name+'</option>';
            }
            $("#newModal .position").append(optionHtml);
            $("#updateModal .position").append(optionHtml);
        };
    });
//	$.ajax({
//		url:API_URL + "basic/positions",
//		//data:{tenantId: window.sessionStorage.getItem('tenantId')},
//		data: {tenantId: window.sessionStorage.getItem('tenantId')},//test
//		async: false,
//		success:function(data){
//			$("#newModal .position").html("");
//            $("#updateModal .position").html("");
//			var optionHtml = "";
//			optionHtml = '<option value="" selected="selected" label=""></option>';
//			var max = data.length;
//			for(var i = 0;i < max ;i++){
//				optionHtml += '<option value="'+data[i].id+'" label="'+data[i].name+'">'+data[i].name+'</option>';
//		    }
//			$("#newModal .position").append(optionHtml);
//            $("#updateModal .position").append(optionHtml);
//		}
//	});

}

//打开更新模态框
function openUpdateModal(e){
//    $("h4#empTitle").html("编辑员工");
    buildSelectArea();
    buildUpdateModal($(e).attr("data-id"));

    setTimeout(function(){
        $("#updateModal").modal('show');
    },500);
}

//构建更新modal
var uname = "";
var uposi = "";
var uorg = "";
var uloginName = "";
var uphone = "";
var ures = "";
function buildUpdateModal(id){
    $(".loginPwd").val("");
    Iptools.GetJson({
        url: "basic/employees/"+id,
        data: {
            token: Iptools.DEFAULTS.token,
            id : id
        },
    }).done(function(data){
        if(data){
            uname = data.name;
            uposi = data.position;
            uorg = data.organization;
            uloginName = data.loginName;
            uphone = data.phone;
            ures = data.responsibilityId;
//            console.log(API_URL + "basic/employees/"+id);

//			var modalBodyObj = $("#newModal .modal-body").clone();
//			modalBodyObj.find(".name").val(data.name);
            if(data.jobTitle == null || data.jobTitle === ""){
                $("#jobTitle").val("");
            }else{
//				modalBodyObj.find(".jobTitle").val(data.jobTitle);
                $("#jobTitle").val(data.jobTitle);
            }
            $("#name").val(data.name);
            $("#position").val(data.position);
            $("#org").val(data.organization);
            $("#loginName").val(data.loginName);
            $("#phone").val(data.phone);
            $("#role").val(data.responsibilityId);

            $("#upData").attr("data-id",data.id);
        };
    })
//	$.ajax({
//		url:API_URL + "basic/employees/"+id,
//		//data:{tenantId: window.sessionStorage.getItem('tenantId')},
//		data: {
//			tenantId: window.sessionStorage.getItem('tenantId'),
//			id : id
//			},
//		success:function(data){
////            console.log(data);
//            uname = data.name;
//            uposi = data.position;
//            uorg = data.organization;
//            uloginName = data.loginName;
//            uphone = data.phone;
//            ures = data.responsibilityId;
//            console.log(API_URL + "basic/employees/"+id);
//
////			var modalBodyObj = $("#newModal .modal-body").clone();
////			modalBodyObj.find(".name").val(data.name);
//			if(data.jobTitle == null || data.jobTitle === ""){
//				$("#jobTitle").val("");
//			}else{
////				modalBodyObj.find(".jobTitle").val(data.jobTitle);
//                $("#jobTitle").val(data.jobTitle);
//			}
//            $("#name").val(data.name);
//            $("#position").val(data.position);
//            $("#org").val(data.organization);
//            $("#loginName").val(data.loginName);
//            $("#phone").val(data.phone);
//            $("#role").val(data.responsibilityId);
//
//			$("#upData").attr("data-id",data.id);
////			$("#updateModal .modal-content").append(modalFooterObj);
//		}
//	});
	
};

//提交新建数据
function commitData(e){
        var name = $("input.name").val();
        var position = $(".form-group select.position").val();
        var org = $(".form-group select.org").val();
        var phone = $("input.phone").val();
        var loginName = $("input.loginName").val();
        var loginPwd = $("input.loginPwd").val();
        var res = $(".form-group select.role").val();
//        console.log(name);
//        console.log(position);
        if (name == "" || position == "" || org == "" || phone == "" || loginName == "" || loginPwd == "" || res == "") {
            Iptools.Tool.pAlert({
                type: "danger",
                title: "系统提示",
                content: "请输入完整信息",
                delay: 1000
            });
            return false;
        } else {
            saveData(e);
        }

}
//提交更新数据
function upData(e){
//    var loginPwd = $("input#loginPwd").val();
//    console.log(loginPwd);
//    console.log(uposi);
    if(uname == "" || uposi == "" || uorg == "" || uloginName == "" || uphone == "" || ures == ""){
        Iptools.Tool.pAlert({
            type: "danger",
            title: "系统提示",
            content: "请输入完整信息",
            delay: 1000
        });
        return false;
    }else{
        saveData(e);
    }
}
function saveData(e){
    var ajaxType;
    var paramStr="";
    paramStr += '{';
    paramStr += '"token":'+window.sessionStorage.getItem('token')+',';

    if($(e).parents(".modal").attr("id") === "newModal"){
        ajaxType = "post"
    }else{
        ajaxType = "put";
        paramStr += '"id":'+$(e).attr("data-id")+',';
    }

    $(e).parents(".modal").find(".form-group input").each(function(index){
        //如果密码为空，则不做更新
        if(ajaxType === "put" && $(this).attr("data-column") === "loginPwd"&& $(this).val() === ""){
            return false;
        }
        paramStr +='\"'+ $(this).attr("data-column")+'\"';
        paramStr += ":";
        paramStr += "\""+$(this).val()+'\"';
        if(index > $(e).parents(".modal").find(".form-group input").length){
            return false;
        }else{
            paramStr += ",";
        }

    });

    $(e).parents(".modal").find(".form-group select").each(function(index){
        //paramStr += ",";
        paramStr += '\"'+ $(this).attr("data-column")+'\"';
        paramStr += ":";
        paramStr += $(this).val();

        if(index === $(e).parents(".modal").find(".form-group select").length -1 ){
            return ;
        }else{
            paramStr += ",";
        }



    });

    paramStr += "}";
    var paramObj = JSON.parse(paramStr);
//    console.log(paramStr);

    if(ajaxType == "put"){
        Iptools.PutJson({
            url: "basic/employees",
            data: paramObj,
        }).done(function(data){
            if(data){
                Iptools.GetJson({
                    url: "basic/queryResListByEmpId"+"?token="+Iptools.DEFAULTS.token+"&empId="+$(e).attr("data-id"),
                    data:{
                        token:Iptools.DEFAULTS.token,
                        empId:$(e).attr("data-id")
                    },
                }).done(function(data){
                    if(data){
                        var linkId = data[0].linkId;
                        Iptools.PutJson({
                            url: "basic/empResLinks",
                            data:{
                                token:Iptools.DEFAULTS.token,
                                resId:paramObj.responsibilityId,
                                id:linkId,
                                empId:$(e).attr("data-id")
                            },
                        }).done(function(){
//                                console.log("权限更改成功");
                        })
                    };
                })
            };
        })
    }else{
        //除权限外将员工的信息post
        Iptools.PostJson({
            url: "basic/employees",
            data: paramObj,
        }).done(function(data){
            if(data){
                Iptools.PostJson({
                    async: false,
                    ajaxCounting:false,
                    url: "basic/empResLinks",
                    data: {
                        token:Iptools.DEFAULTS.token,
                        empId:data.id,
                        resId:data.responsibilityId
                    },
                }).done(function(){
//                            console.log("新建权限成功");
                })
            };
        })
    };
    setTimeout(function(){
        getEmployeesData();
    },500);
    $('#newModal').modal('hide');
    $("#updateModal").modal('hide');
    if(ajaxType === "put"){
        //调用父页面方法
        Iptools.Tool.pAlert({
            type: "success",
            title: "系统提示",
            content: "更新完成",
            delay: 1000
        });
    }else{
        //调用父页面方法
        Iptools.Tool.pAlert({
            type: "success",
            title: "系统提示",
            content: "新建完成",
            delay: 1000
        });
    }

}
//open删除确认modal
function openDeleteModal(e){
	$("#delModal").modal("show");
	var id = $(e).attr("data-id");
	$("#commitDel").attr("data-id",id);
	//confirmDel(id);
}

//删除一条数据
function confirmDel(e){
	var id = $(e).attr("data-id");
	//alert(this);
    Iptools.DeleteJson({
        async: false,
        ajaxCounting:false,
        url: "basic/employees/"+id +"?token=" + Iptools.DEFAULTS.token,
//        data: {
//            tenantId: Iptools.DEFAULTS.tenantId,
//            id:id
//        },
    }).done(function () {
        $("#delModal").modal("hide");
        getEmployeesData();//刷新当前页面
    }).fail(function(r){
        $("#delModal").modal("hide");
        getEmployeesData();//刷新当前页面
    })
//	$.ajax({
//		type:'DELETE',
//		url:  API_URL + "basic/employees/"+id +"?tenantId=" + parseInt(window.sessionStorage.getItem('tenantId')),
//		data:{
//			tenantId :parseInt(window.sessionStorage.getItem('tenantId')),
//			id :id
//		},
//	    success:function(data){
//	    	$("#delModal").modal("hide");
//	    	getEmployeesData();//刷新当前页面
//	    }
//	})
	
}
//上一页
function pageSkip(e){
	PAGE_NOW = PAGE_NOW - 1;
	if(PAGE_NOW < 1){
		return;
	}
	getEmployeesData();
}
//下一页
function pageNext(e){
	PAGE_NOW = PAGE_NOW + 1;
	if(PAGE_NOW > parseInt($(e).attr("max-page"))){
		return;
	}
	getEmployeesData();
}

//跳转
function toPage(e){
	var pageNum = parseInt($(".pageInput").val());
	if(pageNum < 1 || pageNum > parseInt($(e).attr("max-page"))){
		return;
    }
	PAGE_NOW = pageNum;
	getEmployeesData();
	//清空跳转页数
	$(".pageInput").val("");
}


//get部门byid
function getOrganizationById(oid){
	var oname = '';
	Iptools.GetJson({
		url: API_URL + "basic/organizations/"+oid,
		//data:{tenantId: window.sessionStorage.getItem('tenantId')},
		data: {
			token:  Iptools.DEFAULTS.token,
			id : oid
        },
	}).done(function(data){
        if(data){
            oname = data.name
        };
        return oname;
    })
}

//get职位byid
function getPositionById(pid){
	var pname;
    Iptools.GetJson({
		url:API_URL + "basic/positions"+pid,
		//data:{tenantId: window.sessionStorage.getItem('tenantId')},
		data: {
            token:  Iptools.DEFAULTS.token,
			id :pid
        },
	}).done(function(data){
        if(data){
            pname = data.name;
        };
        return pname;
    })
}

function getSelRole(e){
    var val=$('input:radio[name="role"]:checked').attr("data-id");
//    var param = {
//        tenantId: window.sessionStorage.getItem('tenantId'),
//        empId:$(e).attr("data-id"),
//        resId:val
//    };

    //更新前拿到linkid
    Iptools.GetJson({
        url: "basic/queryResListByEmpId",
        data: {
            token: Iptools.DEFAULTS.token,
            empId : $(e).attr("data-id")
        },
    }).done(function(data){
        if(data){
            var linkId = data[0].linkId;
            //往emp与res的link 中put权限的的更改
            Iptools.PutJson({
                url: "basic/empResLinks",
                data: {
                    token: Iptools.DEFAULTS.token,
                    id:linkId,
                    resId:val,
                    empId : $(e).attr("data-id")
                },
            }).done(function(){
                Iptools.Tool.pAlert({
                    type: "success",
                    title: "系统提示",
                    content: "权限更改成功",
                    delay: 1000
                });
            });
            //往emp中put res的更改,这样不点击更新对权限更改后。更改的数据可以跑到第一行
            Iptools.PutJson({
                url: "basic/employees",
                data: {
                    token: Iptools.DEFAULTS.token,
                    id:$(e).attr("data-id"),
                    responsibilityId:val
                },
            }).done(function(data){
//                    console.log("权限的更改同步到emp中了");
            });
            setTimeout(function(){
                getEmployeesData();
            },200);
        };
    })
//    $.ajax({
//        url:API_URL+"basic/queryResListByEmpId"+"?tenantId="+param.tenantId+"&empId="+param.empId,
//        type:"get",
//        success:function(data){
//           var linkId = data[0].linkId;
//            //往emp与res的link 中put权限的的更改
//
//            $.ajax({
//                url:API_URL+"basic/empResLinks?id="+linkId+"&tenantId="+param.tenantId+"&empId="+param.empId+"&resId="+param.resId,
//                type:"put",
//                success:function(){
////                   alert("权限更改成功");
//                    Iptools.Tool.pAlert({
//                        title: "系统提示",
//                        content: "权限更改成功"
//                    });
//                }
//            });
//            //往emp中put res的更改,这样不点击更新对权限更改后。更改的数据可以跑到第一行
//            $.ajax({
//                url:API_URL+"basic/employees"+"?id="+param.empId+"&tenantId="+param.tenantId+"&responsibilityId="+param.resId,
//                type:"put",
//                success:function(){
//                    console.log("权限的更改同步到emp中了")
//                }
//            })
//            setTimeout(function(){
//                getEmployeesData();
//            },200);
//        }
//    });


    $("#roleModal").modal("hide");
};
