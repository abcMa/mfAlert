/**
 * Created by 1 on 2017/1/23.
 */
//if (typeof jQuery === 'undefined' || typeof Iptools === 'undefined') {
//    throw new Error('缺少必要JS');
//}
var componentMobile = {};
componentMobile = {
    _UIDEFAULFS: {
        cropModal: "cropImgModal",
        cropDefaults: {
            init: false,
            src: "",
            file: null,
            aspectRatio: 16 / 10,
            showRatioFree: true,
            canvas: null,
            getCanvas: function () { }
        },
        cropImageCanvas: {},
        fat:0
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _crop: function (options) {
        componentMobile._UIDEFAULFS.cropDefaults = Iptools.Tool._extend(componentMobile._UIDEFAULFS.cropDefaults, options);
        componentMobile._UIDEFAULFS.fat=options.fat;
        if (!componentMobile._UIDEFAULFS.cropDefaults.init) {
            componentMobile._buildCropModal();
            componentMobile._addEventListener({
                container: "body",
                target: "#" + componentMobile._UIDEFAULFS.cropModal + " .modal-footer .wxkeepBtn",
                type: "click",
                event: function () {
                    if (!$(this).hasClass("disable")) {
                        componentMobile._UIDEFAULFS.cropDefaults.canvas = $("#" + componentMobile._UIDEFAULFS.cropModal + " #imgshow").cropper("getCroppedCanvas");
                        try {
                            componentMobile._UIDEFAULFS.cropDefaults.getCanvas(componentMobile._UIDEFAULFS.cropDefaults.canvas);
                        } catch (e) {
                            console.log(e);
                        }
                        $("#" + componentMobile._UIDEFAULFS.cropModal).css("display","none");
                        $("#serviceApointment").css("display","block");
                        componentMobile._UIDEFAULFS.fat=0;
                    }
                }
            });
            componentMobile._addEventListener({
                container: "body",
                target: "#" + componentMobile._UIDEFAULFS.cropModal + " .modal-footer .wxcloseBtn",
                type: "click",
                event: function () {
                    $("#" + componentMobile._UIDEFAULFS.cropModal).css("display","none");
                    $("#serviceApointment").css("display","block");
                }
            });
            if(componentMobile._UIDEFAULFS.fat==1){
                $("#" + componentMobile._UIDEFAULFS.cropModal + " #imgshow").cropper("destroy");
                $("#" + componentMobile._UIDEFAULFS.cropModal + " #imgshow").removeAttr("src");
                $("#" + componentMobile._UIDEFAULFS.cropModal + " .modal-footer .wxkeepBtn").addClass("disable");
                $("#serviceApointment").css("display","block");
            }
            if(componentMobile._UIDEFAULFS.fat==0){
                $("#serviceApointment").css("display","none");
                if (Iptools.Tool._checkNull(componentMobile._UIDEFAULFS.cropDefaults.src)) {
                    $("#" + componentMobile._UIDEFAULFS.cropModal + " #imgshow").attr("src", src);
                    $("#" + componentMobile._UIDEFAULFS.cropModal + " #imgshow").cropper("destroy").cropper({
                        aspectRatio: componentMobile._UIDEFAULFS.cropDefaults.aspectRatio,
                        preview: "#" + componentMobile._UIDEFAULFS.cropModal + " .img-preview",
                        resizable:false,
                        movable:false
                    });
                    $("#" + componentMobile._UIDEFAULFS.cropModal + " .modal-footer .wxkeepBtn").removeClass("disable");
                } else if (Iptools.Tool._checkNull(componentMobile._UIDEFAULFS.cropDefaults.file)) {
                    var fasrc = window.URL.createObjectURL(componentMobile._UIDEFAULFS.cropDefaults.file);
                    $("#" + componentMobile._UIDEFAULFS.cropModal + " #imgshow").attr("src", fasrc);
                    $("#" + componentMobile._UIDEFAULFS.cropModal + " #imgshow").cropper("destroy").cropper({
                        aspectRatio: componentMobile._UIDEFAULFS.cropDefaults.aspectRatio,
                        preview: "#" + componentMobile._UIDEFAULFS.cropModal + " .img-preview",
                        cropBoxResizable:false,
                        movable:false,
                        dragCrop:false,
                        mouseWheelZoom:false,
                        guides:false,
                        toggleDragModeOnDblclick:false,
                        dragMode:"move"
                    });
                    $("#" + componentMobile._UIDEFAULFS.cropModal + " .modal-footer .wxkeepBtn").removeClass("disable");
                }
            }
            componentMobile._UIDEFAULFS.cropDefaults.init = true;
            $("#" + componentMobile._UIDEFAULFS.cropModal).css("display","block");
            componentMobile._UIDEFAULFS.fat=1;
        } else {
            $("#" + componentMobile._UIDEFAULFS.cropModal).css("display","block");
            componentMobile._UIDEFAULFS.fat=1;
        }
    },
    _buildCropModal: function () {
        $("body").append("<div class='modal-photo' id='" + componentMobile._UIDEFAULFS.cropModal + "' >" +
            "<div class='modal-dialog' style='height: 100%;width: 100%;margin: 0 auto;'>" +
            "<div class='modal-content' style='height: 100%'>" +
            "<div class='modal-body' style='height: 85%'>" +
            "<div class='crop-show' style='height: 100%'>" +
            "<img id='imgshow' class='crop-img' alt='' style='min-height: 600px' />" +
            "</div>" +
            "</div>" +
            "<div class='modal-footer' style='height: 15%'>" +
            "<div class='f-left-btn'><button type='button' class='btn wxkeepBtn disable'>确认</button></div>" +
            "<div class='f-right-btn'><button type='button' class='btn wxcloseBtn' data-dismiss='modal'>关闭</button></div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>");
    }
};