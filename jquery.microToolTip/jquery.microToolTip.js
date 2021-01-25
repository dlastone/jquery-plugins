/*
	Micro Tool Tip  - jQuery plugin
	By: Daniel  Last (2014-03-07)
*/

(function ($) {
    var methods = {
        init: function (options) {
            return this.each(function (index) {

                var defaults = {
                    backgroundColor: "#ffe",
                    borderColor: "#999",
                    borderWidth: "1px",
                    width: "200px",
                    sticky: false,
                    header: "",
                    title: "",
                    style: "",
                    headerStyle: "font-weight:bold;background:#eed;padding:.1em;",
                    tooltipId: "",
                    tooltip: ""
                };
                var opts = $.extend({}, defaults, options);

                opts.title = $(this).attr("title").length > 0 ? $(this).attr("title") : opts.title;
                opts.style = 'position:absolute;' +
                    'font-family: Calabri, Arial, Helvetica, sans-serif;' +
                    'font-size:9pt;' +
                    'background-color: ' + opts.backgroundColor + ';' +
                    'border:solid ' + opts.borderWidth + ' ' + opts.borderColor + ';' +
                    'padding:.2em .4em;' +
                    'width:200px;' +
                    'display:none;';

                opts.tooltipId = 'microToolTip_' + index;
                opts.tooltip = '<div id="' + opts.tooltipId + '" class="microToolTip ui-corner-all" style="' + opts.style + '">' +
                    ((opts.header.length > 1) ? '<div style="' + opts.headerStyle + '">' + opts.header + '</div>' : '') +
                    opts.title +
                    '</div>';

                $(this).data("options", opts);


                $(this).hover(
                    function (event) {
                        var opt = $(this).data("options");
                        var x = event.pageX + 20;
                        var y = event.pageY + 15;

                        this.title = "";

                        if ($("#" + opt.tooltipId).length == 0) $(this).after(opt.tooltip);
                        $("#" + opt.tooltipId).fadeIn("fast").css({ "top": y + "px", "left": x + "px" });
                    },
                    function (event) {
                        var opt = $(this).data("options");
                        $("#" + opt.tooltipId).fadeOut("fast").remove();
                        this.title = opt.title;
                    });

                $(this).mousemove(function (event) {
                    var opt = $(this).data("options");
                    if (opt.sticky) return;
                    var x = event.pageX + 20;
                    var y = event.pageY + 15;
                    $("#" + opt.tooltipId).css({ "top": y + "px", "left": x + "px" });
                });

            });
        }
    };

    $.fn.microToolTip = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.microToolTip');
        }
    };

})(jQuery);
