var URL = window.location.href;
var IS_BLACK = false;
if (URL.indexOf('/web/result') >= 0
    || URL.indexOf('/web/yizhaoyixi') >= 0) {
    IS_BLACK = true;
}

$(document).ready(function () {
    var pre = '';
    if (location.pathname.indexOf('/en') === 0) {
        pre = '/en';
    }
    $('#header').load(pre + '/web/part/header', function () {
        if (location.pathname.indexOf('/en') === 0) {
            $('#news').hide();
            $('#lan').attr('href', 'http://www.imperial-vision.com/');
            $('#lan').find('img').attr('src', '/images/en.png');
            $('#developer').attr('href', 'https://developer.imperial-vision.com/en-US/account/login');
        }

        $('.dropdown').click(function () {
            if ($(this).attr('class').indexOf('open') < 0) {
                $(this).addClass('open');
            } else {
                $(this).removeClass('open');
            }
        });
        $('.lv2').parent().click(function () {
            if (!$(this).attr('class') || $(this).attr('class').indexOf('open') < 0) {
                $(this).addClass('open');
            } else {
                $(this).removeClass('open');
            }

            return false;
        });
        if (document.body.clientWidth < 768) {
            $('.lv2').prev().attr('href', null);
        }
        $('.lv2 a').click(function () {
            location.href = $(this).attr('href');
            return false;
        });

        if (document.body.clientWidth > 1200) {
            $('.dropdown-toggle').dropdownHover();
            $('a.dropdown-toggle').one('click', function () {
                if (document.body.clientWidth < 768) {
                    return
                }
                location.href = $(this).attr('href');
            });
        }

        checkScroll();
    });

    $('#footer').load(pre + '/web/part/footer');
});

$(".dropdown-menu a").on('click', function () {
    $("#bs-example-navbar-collapse-1").collapse('hide')
});

if (!IS_BLACK) {
    $(document).scroll(function () {
        checkScroll();
    });
}

function checkScroll() {
    if (IS_BLACK) {
        $('.navbar').addClass('on');
        return;
    }

    var scroH = $(document).scrollTop();  //滚动高度

    if (scroH > 60) {  //距离顶部大于100px时
        $('.navbar').addClass('on');
    } else {
        $('.navbar').removeClass('on');
    }
}

function is_weChat(){
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/*UC浏览器下拉菜单效果*/
/*$(document).off('.dropdown.data-api')
$(".dropdown").on('touchstart', ".dropdown-toggle",function(event){
  $(this).next(".dropdown-menu").toggle();
  event.stopPropagation();
  return false
})*/