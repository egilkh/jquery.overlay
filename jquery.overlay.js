/*
 * jquery.overlay.js, a simple overlay lib for jQuery
 *
 * Author: Egil Hanger (egilkh@gmail.com)
 * 
 * Licensed under the {some_license}.
 *
 * TODO:
	ESC Keylistener
		I'm a little in doubt on this one
 */
(function($){

	var methods = {
		init : function (options) {
			var settings = $.extend({ },
			{
				'background-color' : '#000',
				'opacity' : 0.2,
				'z-index' : 100,
				'removeonclick' : true,
				'click' : function (e) {}
			}, options);

			return this.each(function () {
			
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (!data) {
					
					var ol = $('<div />')
					.hide()
					.css({
						position : 'absolute',
						backgroundColor : settings['background-color'],
						opacity : settings['opacity'],
						zIndex : settings['z-index']
					})
					.bind('click.overlay', {o : $this}, methods.click);
					
					$this.data('overlay', {
						'ol' : ol,
						'settings' : settings
					});
					
					$('body').append(ol);
				}

				$this.overlay('show');
			});
		},
		show : function ( ) {

			return this.each(function (e) {
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (!data) {
					return;
				}
				
				var ol = data.ol;
				
				if ($this[0].nodeName && $this[0].nodeName === "#document") {
					ol.css({
						left : 0,
						top : 0
					});
				} else {
					ol.css( {
						left: $this.offset().left,
						top : $this.offset().top
					});
				}
				
				ol.width($this.width())
				.height($this.height())
				.fadeIn();
			});
		},
		hide : function ( ) {

			return this.each(function (e) {
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (data.ol) {
					data.ol.fadeOut();
				}
			});
		},
		destroy : function ( ) {

			return this.each(function (e) {
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (data) {
					data.unbind('.overlay');
					data.ol.remove();
					$this.removeData('data');
				}
			});
		},
		click : function (e) {
			var $this = e.data.o; // jQuery object we called .overlay() on.
			
			var data = $this.data('overlay');
			if (data) {
				if (data.settings['removeonclick']) {
					$this.overlay('hide');
				}

				data.settings['click'].call($this, e);
			}
		}
	};
	
	$.fn.overlay = function(method) { // method wrapper
		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof(method) === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.Overlay');
		}
	};
	
	// shorthand for $(document) overlay
	$.overlay = function (options) {
		$(document).overlay(options);
	};

})(jQuery);
