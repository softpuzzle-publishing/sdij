"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var html = document.querySelector('html');
var body = document.querySelector('body');
var Header = {
  init: function init() {
    this.menu();
    if ($('h2.title').length > 0) {
      $('title').text($('h2.title').text() + ' | 시대인재N 관리자');
    }
  },
  menu: function menu(e) {
    $('.btn-hamburger').on('click', function (e) {
      e.preventDefault();
      $('html').toggleClass('is-collapsed');
    });
  }
};
var Aside = {
  init: function init() {
    this.quickmenu();
    this.lnb();
  },
  quickmenu: function quickmenu() {
    $(".btn-quick-expand, .quick-menu > strong").on("click", function (e) {
      e.preventDefault();
      $(".quick-menu").toggleClass("active");
    });
  },
  lnb: function lnb() {
    //페이지 타이틀명과 비교하여 활성화
    if ($('.sidebar').length > 0) {
      var title = $('h2.title').text();
      var $active = '';
      var $activeDep1 = '';
      $('.sidebar a').each(function () {
        if ($(this).text() == title) {
          $active = $(this);
          $activeDep1 = $(this).closest('.dep1');
          $activeDep1.show();
          $(".gnb a").each(function () {
            if ($(this).attr("data-gnb-code") == $activeDep1.attr("data-gnb-code")) {
              $(this).parent("li").addClass("active");
            }
          });
          $active.parents("li").addClass("active");
          $active.parents(".has-treeview").addClass("open");
          $(".dep1").css("opacity", "1");
          $(".sidebar .has-treeview > a").on("click", function (e) {
            e.preventDefault();
            $(this).closest("li").toggleClass("open");
          });
        }
      });
    }
  }
};
var Common = {
  splitH: '',
  init: function init() {
    this.scrolling();
    this.splitGird();
    this.datePicker();
    this.timePicker();
    this.event();
    window.addEventListener('mousewheel', Common.scrolling);
    window.addEventListener('touchmove', Common.scrolling);
    $(window).scroll(function () {
      Common.scrolling();
    });
  },
  scrolling: function scrolling(e) {
    var scrollTop = $(window).scrollTop();
    var gnbTop = $('#header').height();
    gnbTop = Number(gnbTop);
    if (scrollTop > 0) {
      $('html').addClass('is-scrolled');
    } else {
      $('html').removeClass('is-scrolled');
    }

    //scrollbar bottom check
    if ($('html').hasClass('is-scrolled')) {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
        $('html').addClass('is-bottom');
      } else {
        $('html').removeClass('is-bottom');
      }
    }
  },
  splitGird: function splitGird() {
    // 좌우 split
    var horizontalItems = [];
    if ($('[id^="split-horizontal"]').length > 0) {
      $('[id^="split-horizontal"]').each(function () {
        var item = '#' + $(this).attr('id');
        horizontalItems.push(item);
      });
      this.splitH = Split(horizontalItems, {
        direction: 'horizontal',
        gutterSize: 8,
        minSize: 435,
        snapOffset: 0,
        onDrag: function onDrag() {
          window.dispatchEvent(new Event('resize'));
        }
      });
    }
  },
  datePicker: function datePicker() {
    //datepicker
    var currentDate = new Date();
    $(document).on('focus', '.form-datepicker', function () {
      var _$$datepicker;
      $(this).datepicker((_$$datepicker = {
        defaultDate: +7,
        changeMonth: true,
        changeYear: true,
        monthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        monthNamesShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
        showMonthAfterYear: true,
        showOtherMonths: true
      }, _defineProperty(_$$datepicker, "changeMonth", true), _defineProperty(_$$datepicker, "changeYear", true), _defineProperty(_$$datepicker, "dateFormat", "yy-mm-dd"), _defineProperty(_$$datepicker, "gotoCurrent", true), _defineProperty(_$$datepicker, "beforeShow", function beforeShow(input, inst) {
        $('#ui-datepicker-div').addClass('datepicker-box');
      }), _$$datepicker));
    });
    $(document).on('focusout', '.form-datepicker', function () {
      $(this).datepicker('destroy');
    });
  },
  timePicker: function timePicker() {
    //timepicker
    $('.form-timepicker').each(function () {
      $(this).timepicker({
        showMeridian: false,
        defaultTime: '00:00'
      });
    });
  },
  event: function event() {
    $('[data-toggle="tooltip"]').tooltip();

    //custom scroll
    $(".overflow-y-scroll").mCustomScrollbar({
      theme: "dark"
    });

    //모달 중첩 z-index 조정
    $('.modal').on('show.bs.modal', function (e) {
      var zIndex = 1040 + 10 * $('.modal:visible').length;
      $(this).css('z-index', zIndex);
      setTimeout(function () {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
      }, 0);
    }).on('hidden.bs.modal', function () {
      if ($('.modal:visible').length > 0) {
        setTimeout(function () {
          $(document.body).addClass('modal-open');
        }, 0);
      }
    });

    //테이블 내 체크박스 전체 선택
    $('[data-event="checkAll"]').on('change', function (e) {
      e.preventDefault();
      var target = $(this).attr('data-target');
      if ($(this).is(':checked')) {
        $('[name=' + target + ']').prop('checked', true);
      } else {
        $('[name=' + target + ']').prop('checked', false);
      }
    });

    //입력폼 max 체크
    $('textarea, input').on("input", function () {
      if ($(this).attr('maxlength') !== "") {
        var maxlength = $(this).attr("maxlength");
        var content = $(this).val();
        $($(this).attr('data-byte-target')).html(content.length);
        if (content.length > maxlength) {
          $(this).val(content.substring(0, maxlength));
          $($(this).attr('data-byte-target')).html();
        }
      }
    });

    //accordion style
    $('.list-group-toggle a.list-group-item').on('click', function (e) {
      e.preventDefault();
      $(this).closest('.item-wrap').siblings('.item-wrap').removeClass('active');
      $(this).closest('.item-wrap').addClass('active');
    });
  }
};
Header.init();
Aside.init();
Common.init();