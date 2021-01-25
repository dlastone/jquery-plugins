/* 
*	jquery-sessionStatus jQuery plugin 
*	© Daniel Last 2018
*   Shows the status of the current logged in session or if the session has been timed out.
*
*   Options:
*       - session:      the session timeout in minutes ( default: 20 )
*       - interval:     inteval at which the status is updated in milliseconds ( default: 1000 )
*       - auto:         does the status show automatically or only after the warning time has passed. ( default: true )
*       - warningTime:  time before session expiry to warn in milliseconds. ( default: 2 minutes - 120000ms )
*       - statusText:   message displayed before timeout. include {0}:{1} place holders for {minutes}:{seconds}
*       - timeoutText:  message displayed after timeout.
*
*   Requires:
*       - jQuery 
*/

(function($) {

    var _base_class = 'sessionStatus'
        i = 0,
        sih=null,
        opts = null,
        elementId = '',
        className = '',
        sessionTimeout = 0;


    
    var methods = {
        init: function(options) {
            var $this = $(this);
            var _defaults = {
                index: i++,
                running: (sih?true:false),
                session: 20,
                interval: 1000,
                auto: true,
                warningTime: 2*60*1000,
                timeout:0,
                statusText: 'Session expires in {0}:{1} minutes.',
                timeoutText: 'Your session has expired. Please log in again.'
            };
            opts = $.extend({}, _defaults, options);
        
            return $this.each(function(index) {

                elementId = $this.attr('id') + '-' + _base_class + '-' + opts.index + '' + index;
                $this.attr('id',elementId);
                className = _base_class;
                var date = new Date();
                sessionTimeout = date.setTime(date.getTime() + opts.session*60*1000);
                    
                if(!$this.hasClass(className)){
                    $this
                        .addClass(className)
                        .html('<span class="hide"><a href="#">hide</a></span><div></div>');
                }

                if(opts.auto)
                    $('#'+elementId+' div').html(String.format(opts.statusText,opts.session<10?'0'+opts.session:''+opts.session,"00"));
                else
                    $('#'+elementId+'.'+className+'').hide();

                if(!opts.running)
                    sih = $this.sessionStatus('setInterval');
            
                $('#'+elementId+'.'+className+' span.hide a').click(function(){
                    $('#'+elementId+'.'+className+'').hide('fast');
                    return false;
                });

            });
        },
        setInterval: function(){
            return window.setInterval(function () {
                var timeout = sessionTimeout - new Date();
                if( timeout <= opts.warningTime ){
                    $('#'+elementId+'.'+className+'').addClass('warning');
                    $('#'+elementId+'.'+className+'').show('fast');
                    $('#'+elementId+'.'+className+' span.hide').hide();
                }
                if (timeout<0){
                    $('#'+elementId+'.'+className+' div').html(opts.timeoutText);
                    $('#'+elementId+'.'+className+'').show('fast');
                    $('#'+elementId+'.'+className+' span.hide').hide();
                    clearInterval(sih[opts.index]);
                    return;
                }
                
                var mm = Math.floor(timeout/ 1000 / 60);
                var ss = Math.ceil(((timeout / 1000 / 60) - Math.floor(timeout / 1000 / 60)) * 60);
                if(ss===60){mm++;ss=0;}
                var text = String.format(opts.statusText,mm<10?'0'+mm:''+mm,ss<10?'0'+ss:''+ss);
                $('#'+elementId+'.'+className+' div').html(text);
                
                opts.timeout = timeout;

            }, opts.interval);
        
            $('#'+elementId+'.'+className+' span.hide a').click(function(){
                $('#'+elementId+'.'+className+'').hide('fast');
                return false;
            });
        },
        clearInterval: function(){
            window.clearInterval(sih);
        },
        reset: function(){
            var date = new Date();
            sessionTimeout = date.setTime(date.getTime() + opts.session*60*1000);
        },
        reload: function(){
            window.location.href = window.location.href;
        }
    };

    //String.format(string,arguments[n])
    if (!String.format) {
        String.format = function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }


    $.fn.sessionStatus = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sessionStatus');
        }
    };

})(jQuery);
