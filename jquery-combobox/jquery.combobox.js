/*!
 * jQuery ComboBox Javascript Library v0.1b
 * 
 * Description: Replaces an HTML SELECT element and creates a customizable div based drop-down-list
 * 
 * Copyright 2010, Daniel Last
 * 
 * Date: Friday, 5 February 2010, 12:30 CET (GMT +1)
 * 
 * OPTIONS:
 *  autoClose:       does the combobox close on click. (Default: true)
 *  defaultValue:    use to set the default selected value.
 *  displayText:     the default text that displays in the closed state. this only applies where no values are selected.
 *  multiple:        is the combobox multi-select. (Default: current html-select 'multiple' value)
 *  scollable:       is the combobox scrollable. (Default: false)
 *  scrollHeight:    the max-height (in pixels) of the combobox if 'scrollable' is set to true. (Default: 200)
 *  maxRows:         the max number of rows in the combobox (sets scrollable=true). (Default: null) 
 *  sticky:          ctrl key is not required to select multiple items. (Default: false)
 *  width:           specify the width (in pixels) of the combobox. (Default: current html-select width)
 *  listWidth:       specify the width (in pixel) of the combobox.
 *	openDirection:   direction to open combobox. (Default: 'down')
 *	filterKeys:      filter the values by typing in a textbox. (Default: false)
 *	showNotFiltered: display non-filtered results? (Default: true)
 *
 */
(function ($) {

	var methods = {

		init: function (options) {
			return this.each(function (idx) {

				var $this = $(this);

				var _defaults = {
					baseid: '',
					id: '',
					name: '',
					inst: '',
					itemCount: 0,
					itemHeight: 0,

					autoClose: true,
					defaultValue: '',
					displayText: '-- select --',
					height: 30,
					multiple: false,
					scrollable: false,
					scrollHeight: 200,
					maxRows: null,
					sticky: false,
					width: -1,
					listWidth: -1,
					openDirection: 'down',
					filterKeys: false,
					showNotFiltered: true
				};


				var opts = $.extend({}, _defaults, options);
				//var _config = $.meta ? $.extend({}, opts, $this.data()) : opts;
				var selected_values = {};

				var _baseid = 'jquery-combobox';
				var _id = $this.attr("id");
				var _name = $this.attr("name");
				var _inst = _baseid + '' + _id + '' + _name + idx;
				var _itemCount = 0;
				var _itemHeight = 0;

				opts.baseid = _baseid;
				opts.id = _id;
				opts.name = _name;
				opts.inst = _inst;
				opts.itemCount = _itemCount;
				opts.itemHeight = _itemHeight;

				// return if object is created
				if ($this.data('jquery-combobox')) { return this; };

				//save settings for later use
				$this.data('jquery-combobox', opts);


				// set default displaytext
				var _firstVal = $this.get(0).options[0].value;
				if (_firstVal == opts.defaultValue) {
					opts.displayText = $this.get(0).options[0].text;
				}

				//check if multi-select
				if ($this.attr("multiple")) {
					opts.multiple = $this.attr("multiple");
					opts.autoClose = false;
					opts.sticky = true;
				}
				$this.attr("multiple", opts.multiple);

				//hide original select
				$this.wrap('<div id="' + _inst + '-hide" class="' + _baseid + ' ' + _baseid + '-hide" />');
				if (opts.width == -1) {
					opts.width = $('#' + _inst + '-hide').width() + 15;
				}
				if (opts.listWidth == -1) {
					opts.listWidth = opts.width;
				}

				//create custom select
				$('#' + _inst + '-hide').after('<div id="' + _inst + '-text" class="' + _baseid + ' ' + _baseid + '-text" >' + opts.displayText + '</div>');
				$('#' + _inst + '-text').css({ width: opts.width, height: opts.height });
				if (this.selectedIndex >= 0) {
					$('#' + _inst + '-text').html(this.options[this.selectedIndex].text);
				}
				var l = $('#' + _inst + '-text').position().left;
				$('#' + _inst + '-text').after('<div id="' + _inst + '-options" class="' + _baseid + ' ' + _baseid + '-options" ></div>');
				$('#' + _inst + '-options').append('<ul id="' + _inst + '-ul" class="' + _baseid + ' ' + _baseid + '-ul"></ul>');
				$('#' + _inst + '-options').css('left', l);

				if (opts.scrollable || opts.maxRows) {
					$('#' + _inst + '-options').addClass("scrollable");
					$('#' + _inst + '-options').css("height", opts.scrollHeight);
					$('#' + _inst + '-options').css("width", opts.listWidth);
					$('#' + _inst + '-options ul').css("width", opts.listWidth - 22);
				} else {
					$('#' + _inst + '-options ul').css("width", opts.listWidth);
				}

				$this.data("selected_values", selected_values);
				$this.data('jquery-combobox', opts);
				//rebuildList($this);
				$this.combobox('rebuildList');


				var displaytext = displayText($this);
				$('#' + _inst + '-text').html(displaytext);



				// --- WIRE UP EVENTS ---
				$(this).change(function (event) {
					const _displaytext = displayText($this);
					$('#' + _inst + '-text').html(_displaytext);
				});
				// show dropdown 
				$('#' + _inst + '-text').click(function (event) {
					if ($this.data('disable')) { return; }
					var $text = $(this);
					var optionsId = this.id.replace('text', 'options')

					if ($('#' + optionsId).not(':visible')) {
						$('#' + optionsId + ' ul').html('');
						//rebuildList($this);
						$this.combobox('rebuildList');
					}


					if (opts.openDirection == 'up') { $('#' + optionsId).css({ bottom: 0 }); }
				    $('#' + optionsId).css({ left: $('#' + _inst + '-text').position().left });
					$('#' + optionsId).slideToggle(100, function () {
						if ($(this).css('display') != 'none') {

							$('#' + _inst + '-options').css('left', $('#' + _inst + '-text').position().left);
							if (opts.scrollable || opts.maxRows) {
								var rowheight = $('#' + _inst + '-options ul li:first').outerHeight(true);
								var maxrows = (opts.maxRows) ? opts.maxRows : Math.ceil(opts.scrollHeight / rowheight);
								var rows = $('#' + _inst + '-options ul li').length;
								if (!opts.showNotFiltered) {
									rowheight = (rowheight < 20) ? 20 : rowheight;
									$('#' + _inst + '-options').addClass("scrollable");
									$('#' + _inst + '-options').css("height", rowheight * maxrows + 2);
									$('#' + _inst + '-options').css("width", opts.listWidth);
									$('#' + _inst + '-options ul').css("width", opts.listWidth - 22);
								}
								else {
									if ((rows > maxrows)) {
										$('#' + _inst + '-options').addClass("scrollable");
										$('#' + _inst + '-options').css("height", rowheight * maxrows + 2);
										$('#' + _inst + '-options').css("width", opts.listWidth);
										$('#' + _inst + '-options ul').css("width", opts.listWidth - 22);
									}
									else {
										$('#' + _inst + '-options').removeClass("scrollable");
										$('#' + _inst + '-options ul').css("width", "");
										$('#' + _inst + '-options').css("height", "");
									}
								}
							}
							if (opts.openDirection == 'up') { $(this).css({ top: $text.offset().top - ($(this).outerHeight(true) + 10) }); }


							if (opts.filterKeys) {
								$('#' + _inst + '-text').html('<input type="text" id="' + _inst + '-search" name="' + _inst + '-search" value="" />');
								$('#' + _inst + '-search').css({ width: opts.listWidth - 22 }).focus();
								var s = '', t = null;
								$('#' + _inst + '-search').unbind('keyup').bind('keyup', function (e) {
									if (t) { clearTimeout(t); }
									var c = e.which;
									s = $('#' + _inst + '-search').val();
									if (c == 37 || c == 39 || c == 27 || c == 13) {
										e.preventDefault();
										return false;
									}
									t = setTimeout(function () {
										//rebuildList($this, s);
										$this.combobox('rebuildList', s);
									}, 700);
								});
							}

						}
						else {
							$('#' + _inst + '-search').unbind('keyup').remove();
						}


					});
					//$('#' + optionsId + ':visible').css("left", $(this).offset().left);


				});

				// select list item(s)
				$(document).on('click', '#' + _inst + '-options ul li', function (event) {
					var sel = $this.get(0);
					var id = String($(this).attr("id")).replace(_inst + '-item-', '');
					var val = $(this).text();
					if (!opts.multiple || (!opts.sticky && !event.ctrlKey)) {
						$(this).parent().find(".selected").removeClass("selected");
						for (var i = 0; i < sel.options.length; i++) {
							sel.options[i].selected = false;
						}
						selected_values = {};
					}
					if (selected_values[id]) {
						delete selected_values[id];
						$(this).removeClass("selected");
					}
					else {
						if (id != '') {
							selected_values[id] = val;
							$(this).addClass("selected");
						}
					}
					$(sel).data("selected_values", selected_values);

					for (var j = 0; j < sel.options.length; j++) {
						sel.options[j].selected = (selected_values[sel.options[j].value] && sel.options[j].value != '');
					}

					$('#' + _inst + '-text').html(displayText($(sel)));
					if (opts.autoClose) {
						$('#' + _inst + '-options').slideUp(100);
						$('#' + _inst + '-search').unbind('keyup').remove();
					}
					$(sel).change();
				});

				$(document).click(function (e) {
					if ((e.target.id.indexOf(_inst) < 0)) {
						$('#' + _inst + '-options').slideUp(100);
						$('#' + _inst + '-search').unbind('keyup').remove();
						$('#' + _inst + '-text').html(displayText($this));
					}
				});
			});
		},
		rebuildList: function (f) {
			return this.each(function () {
				var $this = $(this);
				var filter = f;
				var sel = $this.get(0);
				var opts = $this.data('jquery-combobox');
				var selected_values = $this.data('selected_values');
				var _itemCount = sel.options.length;
				var _class = '', _text = '', _value = '', selected = '';

				if (opts) {
					$('#' + opts.inst + '-options ul').html('');
					if (filter) {
						for (var i = 0; i < _itemCount; i++) {
							_value = String(sel.options[i].value);
							_text = String(sel.options[i].text);
							_class = String($(sel.options[i]).attr("class"));
							selected = ' selected';
							if (sel.options[i].selected) {
								//selected = ' selected';
								selected_values[sel.options[i].value] = sel.options[i].text;
								$('#' + opts.inst + '-options ul').append('<li id="' + opts.inst + '-item-' + _value + '" class="' + _class + ' ' + opts.baseid + ' ' + opts.baseid + '-li' + selected + '">' + _text + '</li>');
							}
						}
					}

					for (var j = 0; j < _itemCount; j++) {
						_value = String(sel.options[j].value);
						_text = String(sel.options[j].text);
						_class = String($(sel.options[j]).attr("class"));
						selected = '';
						if (sel.options[j].value == opts.defaultValue && sel.options[j].value != '') {
							sel.options[j].selected = true;
						}
						if (sel.options[j].selected) {
							selected = ' selected';
							selected_values[sel.options[j].value] = sel.options[j].text;
							if (filter) { continue; }
						}
						if (filter) {
							var re = new RegExp(filter, 'gi');
							if (re.test(_text)) {
								var r = new RegExp(filter, 'gi');
								_text = _text.replace(re, '<b>' + r.exec(_text) + '</b>');
								$('#' + opts.inst + '-options ul').append('<li id="' + opts.inst + '-item-' + _value + '" class="' + _class + ' ' + opts.baseid + ' ' + opts.baseid + '-li' + selected + '">' + _text + '</li>');
							}
						}
						else {
							if (opts.showNotFiltered || selected != '' || !opts.multiple) {
								$('#' + opts.inst + '-options ul').append('<li id="' + opts.inst + '-item-' + _value + '" class="' + _class + ' ' + opts.baseid + ' ' + opts.baseid + '-li' + selected + '">' + _text + '</li>');
							}
						}
					}
					$this.data('selected_values', selected_values);
				}
			});
		},
		destroy: function () {
			return this.each(function () {
				var $this = $(this);
				var opts = $this.data('jquery-combobox');
				$('#' + opts.inst + '-text').remove();
				$('#' + opts.inst + '-options').remove();
				if ($('.' + opts.baseid + '-hide').length > 0) {
					$this.unwrap();
				}
				$this.removeData('jquery-combobox');
			});
		}

	};


	function displayText($obj) {
		var sel = $obj.get(0);
		var opts = $obj.data('jquery-combobox');
		var dt = '';
		for (var i = 0; i < sel.options.length; i++) {
			if (sel.options[i].selected) {
				dt += (dt == '') ? '' + (sel.options[i].text) : ', ' + (sel.options[i].text);
			}
		}
		if (opts) {
			$('#' + opts.inst + '-text').after('<span id="calculatetextsize" style="position:absolute;z-index:-1;visibility:hidden;">' + dt + '</span>');
			var _maxWidth = opts.width - 30;
			var _currentWidth = $('#calculatetextsize').width();
			var _textSizeRatio = _currentWidth / dt.length;
			if (_currentWidth > _maxWidth) {
				$('#' + opts.inst + '-text').attr("title", dt);
				dt = dt.substr(0, parseInt(_maxWidth / _textSizeRatio)) + '...';
			}
			$('#calculatetextsize').remove();
			return (dt) ? dt : opts.displayText;
		}
		return dt;
	}



	$.fn.combobox = function (method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	}

})(jQuery); 
