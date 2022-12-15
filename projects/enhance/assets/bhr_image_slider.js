var IMG_W;
var IMG_H;


function twentytwenty_init(url_origin, url_result, times) {
    
    var TWENTYTWENTY_OPTION = {
        default_offset_pct: 0.5, // How much of the before image is visible when the page loads
        orientation: 'horizontal', // Orientation of the before and after images ('horizontal' or 'vertical')
        before_label: "输入图", // Set a custom before label
        after_label: "结果图", // Set a custom after label
        no_overlay: false, //Do not show the overlay with before and after
        move_slider_on_hover: false, // Move slider on mouse hover?
        move_with_handle_only: true, // Allow a user to swipe anywhere on the image to control slider movement.
        click_to_move: false // Allow a user to click (or tap) anywhere on the image to move the slider to that location.
    };

    var html =
        '<p class="description"> 输入图/结果图 对比： </p>' +
        '<div id="container1" class="twentytwenty-container">' +
        '    <img id="img_origin" src="' + url_origin + '" />' +
        '    <img id="img_result" src="' + url_result + '" />' +
        '</div>';

    $('#twentytwenty_box').html(html);
    $('.twentytwenty-container').css('width', '1000px');
    // $('.twentytwenty-container').css('height', IMG_H * times + 'px');
    $('#container1').twentytwenty(TWENTYTWENTY_OPTION);

}

function img_demo_deal(el) {
    var url_input = $(el).attr('src');
    var url_result = $(el).attr('res');
    // IMG_W = $(el)[0].naturalWidth;
    // IMG_H = $(el)[0].naturalHeight;
    twentytwenty_init(url_input, url_result, 2);
}


function twentytwenty_init_face(url_origin, url_result, times) {
    
    var TWENTYTWENTY_OPTION = {
        default_offset_pct: 0.5, // How much of the before image is visible when the page loads
        orientation: 'horizontal', // Orientation of the before and after images ('horizontal' or 'vertical')
        before_label: "输入图", // Set a custom before label
        after_label: "结果图", // Set a custom after label
        no_overlay: false, //Do not show the overlay with before and after
        move_slider_on_hover: false, // Move slider on mouse hover?
        move_with_handle_only: true, // Allow a user to swipe anywhere on the image to control slider movement.
        click_to_move: false // Allow a user to click (or tap) anywhere on the image to move the slider to that location.
    };

    var html =
        '<p class="description"> 输入图/结果图 对比： </p>' +
        '<div id="container1" class="twentytwenty-container">' +
        '    <img id="img_origin" src="' + url_origin + '" />' +
        '    <img id="img_result" src="' + url_result + '" />' +
        '</div>';

    $('#twentytwenty_box').html(html);
    $('.twentytwenty-container').css('width', '1000px');
    // $('.twentytwenty-container').css('height', IMG_H * times + 'px');
    $('#container1').twentytwenty(TWENTYTWENTY_OPTION);

}

function img_demo_deal_face(el) {
    var url_bbox = './assets/facerec/input-bbox.png';
    var url_root_inputs = './assets/facerec/input/';
    var url_root_res = './assets/facerec/res/';
    
    var TWENTYTWENTY_OPTION = {
        default_offset_pct: 0.5, // How much of the before image is visible when the page loads
        orientation: 'horizontal', // Orientation of the before and after images ('horizontal' or 'vertical')
        before_label: "输入图", // Set a custom before label
        after_label: "结果图", // Set a custom after label
        no_overlay: false, //Do not show the overlay with before and after
        move_slider_on_hover: false, // Move slider on mouse hover?
        move_with_handle_only: true, // Allow a user to swipe anywhere on the image to control slider movement.
        click_to_move: false // Allow a user to click (or tap) anywhere on the image to move the slider to that location.
    };

    var html_bbox =
        '<img id="img_bbox" src="' + url_bbox + '" />' +
        '<p style="color:#6F747A; font-size:16px; margin: 0">人脸检测结果</p>';

    var html =
        '<p class="description" style="color:#6F747A; font-size:18px"> 人脸增强结果对比，<span style="font-weight:bold">点击图片可进行人脸识别</span>： </p>' +
        '<div id="container1" class="twentytwenty-container" onclick="img_demo_deal_face_rec_3(this)">' +
        '    <img id="img_origin" src="' + url_root_inputs + '3.png" />' +
        '    <img id="img_result" src="' + url_root_res + '3.png" />' +
        '</div>' +
        '<div id="container2" class="twentytwenty-container" onclick="img_demo_deal_face_rec_no(this)">' +
        '    <img id="img_origin" src="' + url_root_inputs + '4.png" />' +
        '    <img id="img_result" src="' + url_root_res + '4.png" />' +
        '</div>' +
        '<div id="container3" class="twentytwenty-container" onclick="img_demo_deal_face_rec_no(this)">' +
        '    <img id="img_origin" src="' + url_root_inputs + '5.png" />' +
        '    <img id="img_result" src="' + url_root_res + '5.png" />' +
        '</div>' +
        '<div id="container4" class="twentytwenty-container" onclick="img_demo_deal_face_rec_7(this)">' +
        '    <img id="img_origin" src="' + url_root_inputs + '7.png" />' +
        '    <img id="img_result" src="' + url_root_res + '7.png" />' +
        '</div>' +
        '<div id="container5" class="twentytwenty-container" onclick="img_demo_deal_face_rec_no(this)">' +
        '    <img id="img_origin" src="' + url_root_inputs + '9.png" />' +
        '    <img id="img_result" src="' + url_root_res + '9.png" />' +
        '</div>' +
        '<p/>';

    $('#rec-bbox').html(html_bbox);
    $('#twentytwenty_box').html(html);
    $('.twentytwenty-container').css('width', '17%');
    $('.twentytwenty-container').css('display', 'block');
    $('.twentytwenty-container').css('float', 'left');
    $('.twentytwenty-container').css('margin', '10px');
    $('.twentytwenty-container:hover').css('cursor', 'pointer');
    // $('.twentytwenty-container').css('height', IMG_H * times + 'px');
    $('#container1').twentytwenty(TWENTYTWENTY_OPTION);
    $('#container2').twentytwenty(TWENTYTWENTY_OPTION);
    $('#container3').twentytwenty(TWENTYTWENTY_OPTION);
    $('#container4').twentytwenty(TWENTYTWENTY_OPTION);
    $('#container5').twentytwenty(TWENTYTWENTY_OPTION);
}

function img_demo_deal_face_rec_3(el) {
    var url_root_rec = './assets/facerec/rec/';

    var html_rec_res =
        '<img id="img_rec_res" src="' + url_root_rec + '3.png" />' +
        '<p style="color:#6F747A; font-size:16px">人脸识别结果</p>';

    $('#rec-res').html(html_rec_res);
}

function img_demo_deal_face_rec_7(el) {
    var url_root_rec = './assets/facerec/rec/';

    var html_rec_res =
        '<img id="img_rec_res" src="' + url_root_rec + '7.png" />' +
        '<p style="color:#6F747A; font-size:16px">人脸识别结果</p>';

    $('#rec-res').html(html_rec_res);
}

function img_demo_deal_face_rec_no(el) {
    var url_root_rec = './assets/facerec/rec/';

    var html_rec_res =
        '<img id="img_rec_res" src="' + url_root_rec + 'no.png" />' +
        '<p style="color:#6F747A; font-size:16px">此人未注册！</p>';

    $('#rec-res').html(html_rec_res);
}