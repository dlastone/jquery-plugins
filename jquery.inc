	<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />
	<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/ui-lightness/jquery-ui.css" rel="stylesheet" type="text/css" />
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
	<script>window.jQuery || document.write('<link href="//code.jquery.com/ui/1.9.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />' +
											'<link href="//code.jquery.com/ui/1.9.1/themes/ui-lightness/jquery-ui.css" rel="stylesheet" type="text/css" />' +
											'<script src="//code.jquery.com/jquery-1.8.2.js"><\/script>')</script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js" type="text/javascript"></script>
	<script>window.jQuery.ui || document.write('<script src="//code.jquery.com/ui/1.9.1/jquery-ui.js"><\/script>')</script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/i18n/jquery-ui-i18n.min.js"  type="text/javascript"></script>
	<script type="text/javascript">
		//localize jquery-ui datepicker<% if isEmpty(cc) or isNull(cc) then cc = "" %>
		(function (jQueryCC, $, undefined) { var cc = '<%=cc%>'; switch (cc) { case 'en': cc = ''; break; case 'dk': cc = 'da'; break; case 'ge': cc = 'de'; break; case 'pt': cc = 'pt-BR'; break; case 'zh': cc = 'zh-CN'; break; } jQueryCC.cc = cc; } (window.jQueryCC = window.jQueryCC || {}, jQuery));
		$(document).ready(function(){
			$.datepicker.setDefaults($.extend({ showMonthAfterYear: false }, $.datepicker.regional[jQueryCC.cc]));
		});
	</script>
