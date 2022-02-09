const html = document.querySelector('html');
const body = document.querySelector('body');

var Header = {
	init : function(){
		this.menu();
	},
	menu: function(e){
		$('.btn-hamburger').on('click', function (e) {
			e.preventDefault();
			$('html').toggleClass('is-collapsed');
		})
	},
}

var Aside = {
	init : function(){
		this.quickmenu();
		this.lnb();
	},
	quickmenu : function(){
		$(".btn-quick-expand, .quick-menu > strong").on("click", function (e) {
			e.preventDefault();
			$(".quick-menu").toggleClass("active");
		});
	},
	lnb: function () {
		//페이지 타이틀명과 비교하여 활성화
		let title = $('h2.title').text();
		let $active = '';
		$('.sidebar a').each(function () {
			if ($(this).text() == title) {
				$active = $(this);
			}
		})
		$($active).parents('li').addClass('active');
		$($active).parents('.has-treeview').addClass('open');
		$('.sidebar').css('opacity', '1');

		$('.sidebar .has-treeview > a').on('click', function (e) {
			e.preventDefault();
			$(this).closest('li').toggleClass('open');
		});

	}
};

var Common = {
	init : function(){
		this.scrolling();
		this.splitGird();
		this.event();
		window.addEventListener('mousewheel', Common.scrolling);
		window.addEventListener('touchmove', Common.scrolling);
		$(window).scroll(function(){
			Common.scrolling();
		});
	},
	scrolling : function(e){
		var scrollTop = $(window).scrollTop();
		var gnbTop = $('#header').height();
		gnbTop = Number(gnbTop);

		if(scrollTop > 0){
			$('html').addClass('is-scrolled');
		}else{
			$('html').removeClass('is-scrolled');
		}

		//scrollbar bottom check
		if($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
			$('html').addClass('is-bottom');
		}else{
			$('html').removeClass('is-bottom');
		}
	},
	splitGird: function () {
		var verticalItems = [];
		var horizontalItems = [];
		if ($('[id^="split-vertical"]').length > 0) {
			$('[id^="split-vertical"]').each(function(){
				var item = '#'+ $(this).attr('id');
				verticalItems.push(item);
			});
			Split(verticalItems, {
				direction: 'vertical',
				gutterSize: 8,
				minSize: 0,
				snapOffset: 0,
				onDrag: function(){
					//pane의 높이를 auto로 지정이 불가능하여 클래스로 제어
					$('.split.vertical').css('height', $('.split.vertical').outerHeight())
					$('.split.vertical .init').removeClass('init');
				}
			});
		}
		if ($('[id^="split-horizontal"]').length > 0) {
			$('[id^="split-horizontal"]').each(function(){
				var item = '#'+ $(this).attr('id');
				horizontalItems.push(item);
			});
			Split(horizontalItems, {
				direction: 'horizontal',
				gutterSize: 8,
				minSize: 435,
				snapOffset: 0,
			});
		}
	},
	event: function () {
		//custom scroll
		$(".overflow-y-scroll").mCustomScrollbar({
			theme:"dark"
		});

		//datepicker
		$('.form-datepicker').datepicker({
			changeMonth: true,
			changeYear: true,
			monthNames: ["01","02","03","04","05","06","07","08","09","10","11","12"],
            monthNamesShort: ["01","02","03","04","05","06","07","08","09","10","11","12"],
            dayNamesMin: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            showMonthAfterYear:true,
            showOtherMonths: true,
            changeMonth: true,
            changeYear: true,
			dateFormat: "yy-mm-dd",
			gotoCurrent: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('datepicker-box');
			}
		});

		//중첩된 모달이 닫힐때 스타일 삭제 방지
        $('[data-overlap="true"]').on('hidden.bs.modal', function (e) {
            $('body').addClass('modal-open');
        });
        //열려있는 모달 갯수 파악하여 3중 모달 이상일때 가장 최근 모달 z-index 올림 처리
        $('.modal').on('show.bs.modal', function (e) {
            if($('.modal.show').length > 1){
                $(this).css('z-index','1600');
            }
		});

		$('[data-event="checkAll"]').on('change', function (e) {
			e.preventDefault();
			var target = $(this).attr('data-target')
			if ($(this).is(':checked')) {
				$('[name=' + target + ']').prop('checked', true)
			} else {
				$('[name=' + target + ']').prop('checked', false)
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
	}
};

Header.init();
Aside.init();
Common.init();
