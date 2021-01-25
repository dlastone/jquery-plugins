
(function ($) {
	$.fn.shadow = function (settings) {

		if (!$.browser.msie) {
			$(this).css('-moz-box-shadow', '0 0 1em 0.1em');
			$(this).css('-webkit-box-shadow', '0 0 1em 0.1em');
			$(this).css('box-shadow', '0 0 1em 0.1em');
			return $(this);
		}

		if (settings == 'resize') {
			$(this).find(".jq-shadow").remove();
			$(this).shadow();
			return $(this);
		}
		if (settings == 'remove') {
			$(this).unbind('resize');
			$(this).find(".jq-shadow").remove();
			return $(this);
		}
		if (settings == 'hide') {
			$(this).find(".jq-shadow").addClass('hide');
			return $(this);
		}
		if (settings == 'show') {
			$(this).find(".jq-shadow").removeClass('hide');
			return $(this);
		}

		var options = {
			includeMargin: true
		}

		if (settings) jQuery.extend(options, settings);

		return $(this).each(function (index) {
			var $this = $(this);
			var _baseid = $this.attr('id');
			var h = $this.outerHeight(options.includeMargin) - 2;
			var w = $this.outerWidth(options.includeMargin) - 2;

			if ($this.find('.jq-shadow').length > 0) {
				$this.find(".jq-shadow").removeClass('hide');
				return $this;
			}

			$this.css({ position: 'absolute' });
			$this.append('<div class="jq-shadow jq-shadow-tl" style="top:-8px;left:-8px;"></div>');
			$this.append('<div class="jq-shadow jq-shadow-tc" style="top:-8px;left:0;width:' + w + 'px;"></div>');
			$this.append('<div class="jq-shadow jq-shadow-tr" style="top:-8px;left:' + w + 'px;"></div>');

			$this.append('<div class="jq-shadow jq-shadow-ml" style="top:0;left:-8px;height:' + h + 'px;"></div>');
			$this.append('<div class="jq-shadow jq-shadow-mr" style="top:0;left:' + w + 'px;height:' + h + 'px;"></div>');

			$this.append('<div class="jq-shadow jq-shadow-bl" style="top:' + h + 'px;left:-8px;"></div>');
			$this.append('<div class="jq-shadow jq-shadow-bc" style="top:' + h + 'px;left:0;width:' + w + 'px;"></div>');
			$this.append('<div class="jq-shadow jq-shadow-br" style="top:' + h + 'px;left:' + w + 'px;"></div>');

			$this.unbind('resize').bind('resize', function (event) {
				event.stopPropagation();
				$(this).find(".jq-shadow").remove();
				$(this).shadow();
			});

		});
	}
})(jQuery);
