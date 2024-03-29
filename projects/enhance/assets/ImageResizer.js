/**
 * 这是基于html5的前端图片工具，压缩工具。
 */
var ImageResizer = function (opts) {
    var settings = {
        resizeMode: "auto",                    //压缩模式，总共有三种  auto,width,height auto表示自动根据最大的宽度及高度等比压缩，width表示只根据宽度来判断是否需要等比例压缩，height类似。
        dataSource: "",                         //数据源。数据源是指需要压缩的数据源，有三种类型，image图片元素，base64字符串，canvas对象，还有选择文件时候的file对象。。。
        dataSourceType: "image",               //image  base64 canvas
        maxWidth: 500,                           //允许的最大宽度
        maxHeight: 500,                          //允许的最大高度。
        onTmpImgGenerate: function(img) {
        },                                        //当中间图片生成时候的执行方法。。这个时候请不要乱修改这图片，否则会打乱压缩后的结果。
        success: function(resizeImgBase64, canvas){
        }                                         //压缩成功后图片的base64字符串数据。
    };
    var appData = {};
    $.extend(settings, opts);

    var innerTools = {
        getBase4FromImgFile: function(file, callBack) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var base64Img = e.target.result;
                if (callBack) {
                    callBack(base64Img);
                }
            };
            reader.readAsDataURL(file);
        },

        //--处理数据源。。。。将所有数据源都处理成为图片对象，方便处理。
        getImgFromDataSource: function (datasource, dataSourceType, callback) {
            var _me = this;
            var img1 = new Image();
            if (dataSourceType == "img" || dataSourceType == "image") {
                img1.src = $(datasource).attr("src");
                img1.onload = function() {
                    if (callback) {
                        callback(img1);
                    }
                }
            } else if (dataSourceType == "base64") {
                img1.src = datasource;
                img1.onload = function() {
                    if(callback){
                        callback(img1);
                    }
                };
            } else if (dataSourceType == "canvas") {
                img1.src = datasource.toDataURL("image/jpeg");
                img1.onload = function() {
                    if (callback) {
                        callback(img1);
                    }
                }
            } else if (dataSourceType=="file") {
                _me.getBase4FromImgFile(function (base64str) {
                    img1.src = base64str;
                    img1.onload = function() {
                        if (callback) {
                            callback(img1);
                        }
                    }
                });
            }
        },

        //计算图片的需要压缩的尺寸。当然，压缩模式，压缩限制直接从setting里面取出来。
        getResizeSizeFromImg: function(img) {
            var _img_info = {
                w: $(img)[0].naturalWidth,
                h: $(img)[0].naturalHeight
            };

            var _resize_info = {
                w: 0,
                h: 0
            };

            if (_img_info.w <= settings.maxWidth && _img_info.h <= settings.maxHeight) {
                return _img_info;
            }
            if (settings.resizeMode == "auto") {
                var _percent_scale = parseFloat(_img_info.w / _img_info.h);
                var _size1 = {
                    w: 0,
                    h: 0
                };
                var _size_by_mw = {
                    w: settings.maxWidth,
                    h: parseInt(settings.maxWidth / _percent_scale)
                };
                var _size_by_mh = {
                    w: parseInt(settings.maxHeight * _percent_scale),
                    h: settings.maxHeight
                };
                if(_size_by_mw.h <= settings.maxHeight){
                    return _size_by_mw;
                }
                if(_size_by_mh.w <= settings.maxWidth){
                    return _size_by_mh;
                }

                return {
                    w: settings.maxWidth,
                    h: settings.maxHeight
                };
            }
            if (settings.resizeMode == "width") {
                if (_img_info.w <= settings.maxWidth) {
                    return _img_info;
                }
                var _size_by_mw = {
                    w: settings.maxWidth,
                    h: parseInt(settings.maxWidth / _percent_scale)
                };
                return _size_by_mw;
            }
            if (settings.resizeMode == "height") {
                if (_img_info.h <= settings.maxHeight) {
                    return _img_info;
                }
                var _size_by_mh = {
                    w: parseInt(settings.maxHeight * _percent_scale),
                    h: settings.maxHeight
                };
                return _size_by_mh;
            }
        },

        //--将相关图片对象画到canvas里面去。
        drawToCanvas: function(img, theW, theH, realW, realH, callback) {

            var canvas = document.createElement("canvas");
            canvas.width = theW;
            canvas.height = theH;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img,
                0,//sourceX,
                0,//sourceY,
                realW,//sourceWidth,
                realH,//sourceHeight,
                0,//destX,
                0,//destY,
                theW,//destWidth,
                theH//destHeight
            );

            //获取中间部分 高宽比1:1
            var length = 150;
            var def = Math.abs((realW - realH) / 2);
            var _canvas = document.createElement("canvas");
            _canvas.width = length;
            _canvas.height = length;
            var _ctx = _canvas.getContext('2d');
            _ctx.drawImage(img,
                realW <= realH ? 0 : def,//sourceX,
                realW >= realH ? 0 : def,//sourceY,
                realW <= realH ? realW : realW - 2 * def,//sourceWidth,
                realW >= realH ? realH : realH - 2 * def,//sourceHeight,
                0,//destX,
                0,//destY,
                length,//destWidth,
                length//destHeight
            );

            //--获取base64字符串及canvas对象传给success函数。
            var base64str = canvas.toDataURL("image/png");
            if(callback){
                callback(base64str, canvas, _canvas);
            }
        }
    };

    //--开始处理。
    (function(){
        innerTools.getImgFromDataSource(settings.dataSource, settings.dataSourceType, function(_tmp_img) {
            var __tmpImg = _tmp_img;
            settings.onTmpImgGenerate(_tmp_img);

            //--计算尺寸。
            var _limitSizeInfo = innerTools.getResizeSizeFromImg(__tmpImg);
            var _img_info = {
                w:$(__tmpImg)[0].naturalWidth,
                h:$(__tmpImg)[0].naturalHeight
            };

            innerTools.drawToCanvas(__tmpImg, _limitSizeInfo.w, _limitSizeInfo.h, _img_info.w, _img_info.h, function(base64str, canvas, _canvas){
                settings.success(base64str, canvas, _canvas, _img_info);
            });
        });
    })();

    var returnObject={
    };

    return returnObject;
};

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}