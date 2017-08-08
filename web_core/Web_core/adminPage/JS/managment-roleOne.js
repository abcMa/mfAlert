//var serviceUrl = window.sessionStorage.getItem("serviceUrl");
//var API_URL = window.sessionStorage.getItem("API_URL");
// Iptools.Tool._initClientHeight(c

setTimeout(function () {
    getRolelist();
    //setInterval(Iptools.Tool._initClientHeight, 500);
}, 200);
function getRolelist() {
    Iptools.GetJson({
        url: "basic/responsibilitys",
        data: {
            token: Iptools.DEFAULTS.token
        },
    }).done(function (r) {
        if(r){
            buildRoleLit(r);
        }
    })
}
//buildtable数据（权限管理数据）
function buildRoleLit(data) {
    var max = data.length;
    var tablehtml = "";
    $(".roleListBody").html("");
    for (var i = 0; i < max; i++) {
        //console.log(data[i].id)
        tablehtml = '<tr>'+
                        '<td class="roleNameArea" style="cursor:pointer">'+
                            '<span class="item_info">'+
                                '<a href="editRole.html?id=' + data[i].id + '&uuid='+ data[i].uuid+'" data-id="' +data[i].id + '" >' + data[i].name + '</a>'+
                            '</span>'+
                        '</td>'+
                        '<td class="text-right">'+
                             '<a href="editRole.html?id=' + data[i].id + '&uuid='+ data[i].uuid+'" data-id="'+data[i].id+'" class="btn closeBtn" >编辑</a>'+
//                             '<button data-toggle="modal" class="btn btn-delete" data-id="' + data[i].id + '" onclick="openDeleteModal(this)" ><i class="icon-trash"></i></button>'+
                        '</td>'+
                     '</tr>';
        $(".roleListBody").append(tablehtml);
    }
};

//打开确认删除modal
function openDeleteModal(e) {
    $('#delModal').modal('show');
    $('#delModal').find("#commitDel").attr("data-id", $(e).attr("data-id"));
}

//删除一条数据
function confirmDel(e) {
    var id = $(e).attr("data-id");
    Iptools.DeleteJson({
        url: "basic/responsibilitys/" + id + "?token=" + Iptools.DEFAULTS.token,
    }).done(function (data) {
        if(data){
            $('#delModal').modal('hide');
            getRolelist();
        };
    }).fail(function (r) {
        if(r){
            $('#delModal').modal('hide');
            getRolelist();
        }
    })
}

//编辑数据
//function openEditRoleItem(e) {
//    //    $("#editRoleDiv").find("iframe").attr("src", "../../adminPage/page/editRole.html");
//    //    $("#editModal").modal("show");
//    //    var deptName = $(e).parents("tr").find(".item_info").html();
//    //    $("#editModal").find("#commitEditData").attr("data-id",$(e).attr("data-id"));
//    //    $("#editModal").find(".name").val(deptName);
//}