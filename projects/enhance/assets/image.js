var BASE64;
var LIMIT_SIZE = 20 * 1024 * 1024;
var TEXT = {
    error: "不可预知的错误！",
    noDir: "不可以上传文件夹！",
    overMaxSize: "超过最大支持文件大小！",
    noSupport: "不支持文件格式！",
    overSize: "单边尺寸超出限制！",
    origin: "原图",
    result: "结果图",
    download: "下载",
    compare: "原图/结果图 对比：",
    invalidUrl: "无效的返回图片地址！",
};
var IMG_W;
var IMG_H;
var IS_DEAL = false;
var TWENTYTWENTY_OPTION = {
    default_offset_pct: 0.5, // How much of the before image is visible when the page loads
    orientation: 'horizontal', // Orientation of the before and after images ('horizontal' or 'vertical')
    before_label: TEXT.origin, // Set a custom before label
    after_label: TEXT.result, // Set a custom after label
    no_overlay: false, //Do not show the overlay with before and after
    move_slider_on_hover: false, // Move slider on mouse hover?
    move_with_handle_only: true, // Allow a user to swipe anywhere on the image to control slider movement.
    click_to_move: false // Allow a user to click (or tap) anywhere on the image to move the slider to that location.
};
var FACE_LIST;

if (!window.URL.createObjectURL) {
    window.URL = window.webkitURL;
}

$(function () {
    dropZoneInit('fileContainer');

    if (!is_weChat()) {
        $('#fileupload1').attr('accept', '.png,.jpg,.jpeg,.bmp,.webp');
    }
});

$(window).resize(function() {
    $('.twentytwenty-select-li').css('height', $('.twentytwenty-select-li').css('width'));
});

function dropZoneInit(id) {
    // 获得拖拽文件的回调函数
    function getDropFileCallBack (dropFiles) {
        console.log(dropFiles, dropFiles.length);
    }

    var dropZone = document.querySelector("#" + id);
    dropZone.addEventListener("dragenter", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
    dropZone.addEventListener("dragover", function (e) {
        e.dataTransfer.dropEffect = 'copy'; // 兼容某些三方应用，如圈点
        e.preventDefault();
        e.stopPropagation();
    }, false);
    dropZone.addEventListener("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
    dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var df = e.dataTransfer;
        var dropFiles = []; // 拖拽的文件，会放到这里
        var dealFileCnt = 0; // 读取文件是个异步的过程，需要记录处理了多少个文件了
        var allFileLen = df.files.length; // 所有的文件的数量，给非Chrome浏览器使用的变量

        // 检测是否已经把所有的文件都遍历过了
        function checkDropFinish () {
            if ( dealFileCnt === allFileLen-1 ) {
                getDropFileCallBack(dropFiles);
            }
            dealFileCnt++;
        }

        if(df.items !== undefined){
            // Chrome拖拽文件逻辑
            for(var i = 0; i < df.items.length; i++) {
                var item = df.items[i];
                if(item.kind === "file" && item.webkitGetAsEntry().isFile) {
                    var file = item.getAsFile();
                    dropFiles.push(file);
                }
            }
        } else {
            // 非Chrome拖拽文件逻辑
            for(var i = 0; i < allFileLen; i++) {
                var dropFile = df.files[i];
                if ( dropFile.type ) {
                    dropFiles.push(dropFile);
                    checkDropFinish();
                } else {
                    try {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(dropFile.slice(0, 3));

                        fileReader.addEventListener('load', function (e) {
                            console.log(e, 'load');
                            dropFiles.push(dropFile);
                            checkDropFinish();
                        }, false);

                        fileReader.addEventListener('error', function (e) {
                            console.log(e, TEXT.noDir);
                            checkDropFinish();
                        }, false);

                    } catch (e) {
                        console.log(e, TEXT.noDir);
                        checkDropFinish();
                    }
                }
            }
        }

        jsReadFiles(dropFiles);
    }, false);
}

//js 读取文件
function jsReadFiles(files) {
    if (files.length) {
        try {
            let file = files[0];

            if (file.size > LIMIT_SIZE) {
                throw TEXT.overMaxSize;
            }
            if (!/image+/.test(file.type)) {
                throw TEXT.noSupport;
            }
            if (file.type.indexOf('jpg') < 0
                && file.type.indexOf('jpeg') < 0
                && file.type.indexOf('png') < 0
                && file.type.indexOf('bmp') < 0
                && file.type.indexOf('webp') < 0) {
                throw TEXT.noSupport;
            }

            $('.uploadWrap').css('cursor', 'default');
            $('.uploadWrap').attr('onclick', '');
            let reader = new FileReader();
            reader.onload = function(e) {
                let base64Img = e.target.result;

                var img = new Image();
                img.src = base64Img.toString();
                img.onload = function() {
                    if (img.width < 64 || img.width > 9216
                        || img.height < 64 || img.height > 9216) {
                        $('.uploadWrap').css('cursor', 'pointer');
                        $('.uploadWrap').attr('onclick', '$(\'#fileupload1\').click()');
                        new Noty({
                            type: 'error',
                            layout: 'topCenter',
                            text: TEXT.overSize,
                            timeout: '2000'
                        }).show();
                        return;
                    }

                    IMG_W = img.width;
                    IMG_H = img.height;
                    img_resize(base64Img, 'base64', file.name);
                }
            };

            reader.readAsDataURL(file);
        } catch (e) {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: e,
                timeout: '2000'
            }).show();
        }
    }
}

function img_resize(source, type, filename) {
    if (IS_DEAL) {
        return;
    }
    let uploadWrap = $($('.upload-wrap').find('.uploadWrap'));
    uploadWrap.find('#filePlaceholder').hide();
    let fileHtml = $('#fileList').children().clone();
    let img_id = new Date().getTime();
    let imgHtml = '<img id="' + img_id + '" draggable="false"/>';
    fileHtml.find('.file-preview').append(imgHtml);
    uploadWrap.find('.fileBox').html(fileHtml);
    $('.loading').show();

    IS_DEAL = true;
    $('#' + img_id).attr('src', source);
    dealImages(filename, source);
    // ImageResizer({
    //     resizeMode: 'auto',
    //     dataSource: source,
    //     dataSourceType: type,
    //     maxWidth: 3840,
    //     maxHeight: 2160,
    //     onTmpImgGenerate: function (img) {
    //     },
    //     success: function (resizeImgBase64, canvas, _canvas, oriImgInfo) {
    //         $('#' + img_id).attr('src', resizeImgBase64);
    //         IMG_W = oriImgInfo.w;
    //         IMG_H = oriImgInfo.h;
    //
    //         dealImages(filename, resizeImgBase64);
    //     }
    // });
}

function dealImages(filename, base64) {
    var index = filename.lastIndexOf('.');
    filename = new Date().getTime() + filename.substring(index, filename.length);

    $.ajax({
        type: 'post',
        url: '/api/transcode/image',
        data: {
            filename: filename,
            ImgBase64_1: base64,
        },
        success: function (result) {
            try {
                if (result && result.code == 0) {
                    var data = result.data;

                    if (data.status == 4) {
                        recovery_upload(true, data, base64);
                    } else if (data.status == 5) {
                        throw data.errormsg;
                    } else {
                        setTimeout(function () {
                            fetch_task_info(data.taskid, base64);
                        }, 1000);
                    }
                } else {
                    throw result.msg;
                }
            } catch (e) {
                console.log(e);
                recovery_upload();

                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: e,
                    timeout: '2000'
                }).show();
            }
        },
        error: function (error) {
            console.log(error);
            recovery_upload();

            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: TEXT.error,
                timeout: '2000'
            }).show();
            return;
        },
    });
}

function fetch_task_info(taskid, base64) {
    $.ajax({
        type: 'post',
        url: '/api/transcode/image/fetch',
        data: {
            taskid: taskid,
        },
        success: function (result) {
            try {
                if (result && result.code == 0) {
                    var data = result.data;

                    if (data.status == 4) {
                        recovery_upload(true, data, base64);
                    } else if (data.status == 5) {
                        throw data.errormsg;
                    } else {
                        setTimeout(function () {
                            fetch_task_info(data.taskid, base64);
                        }, 1000);
                    }
                } else {
                    throw result.msg;
                }
            } catch (e) {
                console.log(e);
                recovery_upload();

                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: e,
                    timeout: '2000'
                }).show();
            }
        },
        error: function (error) {
            console.log(error);
            recovery_upload();

            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: TEXT.error,
                timeout: '2000'
            }).show();
            return;
        },
    });
}

function check_img_exists(imgurl) {
    var ImgObj = new Image(); //判断图片是否存在
    ImgObj.src = imgurl;
    //存在图片
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
    } else {
        return false;
    }
}

function recovery_upload(flag, data, base64) {
    function complete() {
        $('.loading').hide();
        $('.uploadWrap').css('cursor', 'pointer');
        $('.uploadWrap').attr('onclick', '$(\'#fileupload1\').click()');

        IS_DEAL = false;
    }

    if (flag) {
        var times = 0;
        var interval = setInterval(function () {
            times += 1;
            if (times > 10) {
                complete();
                clearInterval(interval);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: TEXT.invalidUrl,
                    timeout: '2000'
                }).show();
                return;
            }

            if (check_img_exists(data.outputurl)) {
                complete();
                BASE64 = base64;
                FACE_LIST = data.facelist;
                twentytwenty_init(base64, data.outputurl, 2);
                clearInterval(interval);
            }
        }, 1000);
    } else {
        complete();
    }
}

function twentytwenty_init(url_origin, url_result, times, face_flag) {
    var html =
        '<p class="description">' + TEXT.compare + '</p>' +
        '<div id="container1" class="twentytwenty-container">' +
        '    <img id="img_origin" src="' + url_origin + '" />' +
        '    <img id="img_result" src="' + url_result + '" />' +
        '</div>';

    $('#twentytwenty_box').html(html);
    $('.twentytwenty-container').css('width', IMG_W * times + 'px');
    $('.twentytwenty-container').css('height', IMG_H * times + 'px');
    $('#container1').twentytwenty(TWENTYTWENTY_OPTION);
    $('.twentytwenty-after-label').append(
        '<div class="twentytwenty-btn-div">' +
        '    <div class="twentytwenty-btn-box">' +
        '        <div class="twentytwenty-btn twentytwenty-btn-left" onclick="twentytwenty_init(\'' + url_origin + '\', \'' + url_result + '\', 1, true)">X1</div>' +
        '        <div class="twentytwenty-btn twentytwenty-btn-left" onclick="twentytwenty_init(\'' + url_origin + '\', \'' + url_result + '\', 2, true)">X2</div>' +
        '        <div class="twentytwenty-btn twentytwenty-btn-left" onclick="twentytwenty_init(\'' + url_origin + '\', \'' + url_result + '\', 3, true)">X3</div>' +
        '        <div class="twentytwenty-btn twentytwenty-btn-right" onclick="download(\'' + url_result + '\')">' + TEXT.download + '</div>' +
        '    </div>' +
        '</div>'
    );

    if (face_flag) {
        return;
    }
    var html_select =
        '<div class="col-md-2 col-xs-3">' +
        '    <div class="twentytwenty-select-li active">' +
        '        <img onclick="face_click(this, true)" src="' + url_origin + '" name="' + url_result + '" />' +
        '    </div>' +
        '</div>';

    FACE_LIST && FACE_LIST.map(item => {
        html_select +=
            '<div class="col-md-2 col-xs-3">' +
            '    <div class="twentytwenty-select-li">' +
            '        <img onclick="face_click(this)" src="' + item.inputurl + '" name="' + item.outputurl + '" />' +
            '    </div>' +
            '</div>';
    });

    $('.twentytwenty-select-ul').html(html_select);
    $('.twentytwenty-select-li').css('height', $('.twentytwenty-select-li').css('width'));
    $('.twentytwenty-select-li').click(function () {
        $('.twentytwenty-select-li').removeClass('active');
        $(this).addClass('active');
    });
}

function face_click(obj, is_main) {
    var url_origin = $(obj).attr('src');
    var url_result = $(obj).attr('name');
    if (is_main) {
        IMG_W = $(obj)[0].naturalWidth;
        IMG_H = $(obj)[0].naturalHeight;
    } else {
        IMG_W = 256;
        IMG_H = 256;
    }

    twentytwenty_init(url_origin, url_result, 2, true);
}

function img_demo_deal(el) {
    var url = $(el).attr('src');
    var url_split = url.split('.');
    var url_result = url_split[0] + '_result.' + url_split[1];
    IMG_W = $(el)[0].naturalWidth;
    IMG_H = $(el)[0].naturalHeight;

    FACE_LIST = [];
    var face_num = 0;
    switch (url_split[0].replace(/\/images\/web\/transcode\//, '')) {
        case 'demo_old':
            face_num = 2;
            break;

        case 'demo_network':
            face_num = 7;
            break;

        case 'demo_fuzzy':
            face_num = 3;
            break;

        case 'demo_low':
            face_num = 2;
            break;
    }
    for (var i = 0; i < face_num; i++) {
        FACE_LIST.push({
            inputurl: url_split[0] + '_' + i + '.' + url_split[1],
            outputurl: url_split[0] + '_' + i + '_result.' + url_split[1]
        });
    }

    twentytwenty_init(url, url_result, 2);
}