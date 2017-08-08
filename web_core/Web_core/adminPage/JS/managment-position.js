//var serviceUrl = window.sessionStorage.getItem("serviceUrl");
//var API_URL = window.sessionStorage.getItem("API_URL");
setTimeout(
    function(){
        getDeptlist()
    },300);

function getDeptlist(){
    Iptools.GetJson({
        url: "basic/positions",
        data: {
            token: Iptools.DEFAULTS.token
        },
    }).done(function(data){
        if(data){
            buildDeptLit(data);
        };
    })
//	$.ajax({
//		url:API_URL + "basic/positions?t=" + new Date().getTime(),
//		type:"get",
//		data:{tenantId:parseInt(parseInt(window.sessionStorage.getItem('tenantId')))},
//		success:function(data){
//			buildDeptLit(data);
//		}
//	});
}
//buildtable数据
function buildDeptLit(data){
	var max = data.length;
	var tablehtml = "";
	$(".deptListBody").html("");
	for(var i=0;i<max;i++){
		tablehtml += '<tr>';
		tablehtml += '<td class="deptNameArea">';
		tablehtml += '<span class="item_info">'+data[i].name+'</span>';
		tablehtml += '<td class="text-right">';
		tablehtml += '<button  data-toggle="modal" class="btn" data-id="'+data[i].id+'" onclick="openEditDeptItem(this)">编辑</button>';
		tablehtml += '<button data-toggle="modal" class="btn btn-delete" data-id="'+data[i].id+'" onclick="openDeleteModal(this)" ><i class="icon-trash"></i></button>';
		tablehtml += '</td>';
		tablehtml += '</tr>';
		tablehtml += '</td>';
	}
	$(".deptListBody").append(tablehtml);
    
}

//打开确认删除modal
function openDeleteModal(e){
	$('#delModal').modal('show');
	$('#delModal').find("#commitDel").attr("data-id",$(e).attr("data-id"));
}

//删除一条数据
function confirmDel(e){
	var id = $(e).attr("data-id");
    Iptools.DeleteJson({
        url: "basic/positions/"+id +"?token="+Iptools.DEFAULTS.token,
//        data: {
//           tenantId:Iptools.DEFAULTS.tenantId,
        //    id :id
//        },
    }).done(function(){
        $('#delModal').modal('hide');
        getDeptlist();
    }).fail(function(r){
//            alert(r);
        $('#delModal').modal('hide');
        getDeptlist();
    })
//	$.ajax({
//		type:'DELETE',
//		url:API_URL + "basic/positions/"+id +"?tenantId="+parseInt(window.sessionStorage.getItem('tenantId')),
//		data:{
//			tenantId:parseInt(window.sessionStorage.getItem('tenantId')),
//			id :id
//			},
//		success:function(data){
//			$('#delModal').modal('hide');
//			getDeptlist();
//		}
//	})
}

//新建一条数据
function commitData(e){
	var name=$(e).parents(".modal").find(".name").val();
    if(name == "" ){
        Iptools.Tool.pAlert({
            type: "danger",
            title: "系统提示：",
            content: "请输入完整信息！",
            delay: 1000
        });
        return false;
    }else{
        var ajaxType = "post";
        var paraObj={
            token:widget.DEFAULFS.token,
            name : name
        };
        if($(e).attr("id") === "commitEditData"){
            ajaxType = "put";
            paraObj.id = parseInt($(e).attr("data-id"));
        }
        if(ajaxType == "put"){
            Iptools.PutJson({
                url: "basic/positions",
                data: paraObj,
            }).done(function(){
                getDeptlist();
                $('#newModal').modal('hide');
                $("#newModal .name").val("");
                $('#editModal').modal('hide');
                Iptools.Tool.pAlert({
                    type: "success",
                    title: "系统提示",
                    content: "更新完成",
                    delay: 1000
                });
            })
        }else{
            Iptools.PostJson({
                url: "basic/positions",
                data: paraObj,
            }).done(function(){
                getDeptlist();
                $('#newModal').modal('hide');
                $("#newModal .name").val("");
                $('#editModal').modal('hide');
                Iptools.Tool.pAlert({
                    type: "success",
                    title: "系统提示",
                    content: "新建完成",
                    delay: 1000
                });
            })
        }
//        $.ajax({
//            url:API_URL + "basic/positions",
//            type: ajaxType,
//            data:paraObj,
//            success:function(data){
//                getDeptlist();
//                $('#newModal').modal('hide');
//                $("#newModal .name").val("");
//                $('#editModal').modal('hide');
//                if(ajaxType === "put"){
//                    //调用父页面方法
//                    window.parent.window.lobiAlert("系统提示", "更新完成");
//                }else{
//                    //调用父页面方法
//                    window.parent.window.lobiAlert("系统提示", "新建完成");
//                }
//            }
//        })
    }

}
//编辑数据
function openEditDeptItem(e){
	$("#editModal").modal("show");
	var deptName = $(e).parents("tr").find(".item_info").html();
	$("#editModal").find("#commitEditData").attr("data-id",$(e).attr("data-id"));
	$("#editModal").find(".name").val(deptName);
}