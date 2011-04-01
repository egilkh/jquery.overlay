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
				'backgroundColor' : '#000',
				'opacity' : 0.2,
				'zIndex' : 100,
				'autoClick' : true,
				'fadeSpeed' : 400,
				'click' : function (e) {},
				'onShow' : function () {},
				'onHide' : function () {}
			}, options);

			return this.each(function () {
			
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (!data) {
					
					var ol = $('<div />')
					.hide()
					.css({
						position : 'absolute',
						backgroundColor : settings['backgroundColor'],
						opacity : settings['opacity'],
						zIndex : settings['zIndex']
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
		show : function (c) {

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
					// this might be wrong for some browsers?
					ol.css( {
						left: $this.offset().left,
						top : $this.offset().top
					});
				}
				
				ol.width($this.width())
				.height($this.height())
				.fadeIn(data.settings['fadeSpeed'], function (e) {
					data.settings['onShow'].call($this);
					if (c) {
						c.call($this);
					}
				});
				
				
			});
		},
		hide : function (c) {

			return this.each(function (e) {
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (data.ol) {
					data.ol.fadeOut(data.settings['fadeSpeed'], function (e) {
						data.settings['onHide'].call($this);
						if (c) {
							c.call($this);
						}
					});
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
				if (data.settings['autoClick']) {
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
