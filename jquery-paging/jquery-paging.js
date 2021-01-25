/* 
*	jquery-paging jQuery plugin 
*	Daniel Last 2011
*
*	NOTE: basic client-side paging functionality done
*	TODO: add funtionallity for prev / next and page-groups ( if there are more than maxPages )
*/



(function ($) {

	var _base_class = 'jquery-paging';
	var _info_class = 'paging-info';
	var _data_class = 'paging-data';
	var _active_class = 'paging-active';

	var methods = {
		init: function (options) {
			return this.each(function () {
				var $this = $(this);
				$this.children().addClass(_data_class);

				var _defaults = {
					pageSize: -1,
					recordCount: -1,
					recordTagName: '',
					pageCount: -1,
					currentPage: 1,
					maxPages: 10
				};
				var opts = $.extend({}, _defaults, options);

				opts.recordTagName = $this[0].tagName;
				opts.recordCount = $this.children().length;
				opts.pageCount = Math.ceil(opts.recordCount / opts.pageSize);
				$this.data(_base_class, opts);

				var h = '<div class="' + _base_class + '"><ul>';
				for (var i = 0; i < opts.pageCount; i++) {
					if (i == 0) { h += '<li class="' + _active_class + '">'; } else { h += '<li>'; }
					h += '<a href="#' + (i + 1) + '">' + (i + 1) + '</a></li>';
				}
				h += '</ul>';
				h += '<div class="' + _info_class + '">page: ' + opts.currentPage + ' of ' + opts.pageCount + ' </div><br style="clear:both;" /></div>';
				$this.prepend(h);

				$this.paging('page', 1);


				$this.find("a").unbind('click').bind('click', function () {
					var cp = $(this).text();
					opts.currentPage = cp;
					$this.find('li').removeClass(_active_class);
					$(this).parent().addClass(_active_class);
					$this.paging('page', cp);
					$this.find("." + _info_class).html('page: ' + cp + ' of ' + opts.pageCount + ' ');

					return false;
				});
			});
		},
		page: function (p) {
			return this.each(function () {
				var $this = $(this);
				var opts = $this.data(_base_class);
				var r = opts.recordCount;
				var s = opts.pageSize;
				$this.children(opts.recordTagName + '.' + _data_class).each(function (i) {
					if (i < (s * p) && i >= ((s * p) - s)) { $(this).show(); } else { $(this).hide(); }
				});


			});
		}
	};

	$.fn.paging = function (method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	};

})(jQuery); 
