/* 
*	jquery-statusMessage jQuery plugin 
*	Daniel Last 2014
*
*/

(function($) {

    var _base_class = 'statusMessage';
    var zi = 1000;



    var methods = {
        init: function(options) {
            return this.each(function(index) {

                var _defaults = {
                    id: "",
                    headerText: "",
                    footerText:"",
                    messageText: "default message.",
                    show: true,
                    animated: false,
                    closeOnClick: true
                };
                var opts = $.extend({}, _defaults, options);
                var uniqueId = (this.id||this.name);
                if(uniqueId == "" ){
                    uniqueId = new Date().valueOf();
                    this.id = uniqueId;
                }
                opts.id = _base_class + '_' + uniqueId + '_' + index;

                if ($(this).data(_base_class)){ 
                    if(opts.show) $(this).statusMessage('show');
                    return;
                }

                $(this).data(_base_class, opts);

                var h = '<div id="' + opts.id + '" class="ui-corner-all ' + _base_class + '">';
                if (opts.headerText.length > 0) h += '<div class="header' + (opts.animated?' animated':'') + '">' + opts.headerText + '</div>';
                h += '<div class="message">' + opts.messageText + '</div>';
                if(opts.footerText.length>0) h += '<div class="footer' + (opts.animated?' animated':'') + '">' + opts.footerText + '</div>';
                h += '</div>';
                $(this).after(h);

                if(opts.show) $(this).statusMessage('show');

                $(document).on('click', '#' + opts.id, function() {
                    if (!opts.closeOnClick) return;
                    $(this).hide();
                });

            });
        },
        show: function(){
            return this.each(function() {
                var opts = $(this).data(_base_class);
                if(opts){
                    var elementid = '#' + opts.id;
                    var top = parseInt(($(window).height() > $(elementid).height()) ? (($(window).height() - $(elementid).height()) / 2) : 40, 10) + $(document).scrollTop();
                    $(elementid).css('top', top + 'px');
                    var left = parseInt(($(document).width() - $(elementid).width()) / 2, 10);
                    $(elementid).css('left', left + 'px');
                    zi++;
                    $(elementid).css('z-index', zi);
                    $(elementid).show();
                }
            });
        },
        hide: function() {
            return this.each(function () {
                var opts = $(this).data(_base_class);
                if(opts)
                    $("#" + opts.id).hide();
            });
        },
        animated: function (s){
            return this.each(function () {
                var opts = $(this).data(_base_class);
                if(opts){
                    switch(s){
                        case true : $("#" + opts.id + ' .header').addClass('animated'); $("#" + opts.id + ' .footer').addClass('animated'); break;
                        default: $("#" + opts.id + ' .header').removeClass('animated'); $("#" + opts.id + ' .footer').removeClass('animated'); break;
                    }
                    opts.animated = s;
                    $(this).data(_base_class,opts);
                }
            });
        },
        messageText: function(m){
            return this.each(function () {
                var opts = $(this).data(_base_class);
                if(opts){
                    $("#" + opts.id + ' .message').html(m);
                    opts.messageText = m;
                    $(this).data(_base_class,opts);
                }
            });
        },
        headerText: function(m){
            return this.each(function () {
                var opts = $(this).data(_base_class);
                if(opts){
                    $("#" + opts.id + ' .header').html(m);
                    opts.headerText = m;
                    $(this).data(_base_class,opts);
                }
            });
        },
        footerText: function(m){
            return this.each(function () {
                var opts = $(this).data(_base_class);
                if(opts){
                    $("#" + opts.id + ' .footer').html(m);
                    opts.footerText = m;
                    $(this).data(_base_class,opts);
                }
            });
        },
        destroy: function() {
            return this.each(function () {
                var opts = $(this).data(_base_class);
                $("#" + opts.id).remove();
                $(this).removeData(_base_class);
            });
        }
    };

    $.fn.statusMessage = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.statusMessage');
        }
    };

})(jQuery);
