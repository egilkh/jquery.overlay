/*
 * jquery.overlay.js, jQuery plugin to create overlay over any element
 *
 * Copyright 2011, Egil Hanger (egilkh@gmail.com)
 * 
 * Licensed under the MIT license.
 *
 */
(function($){

	var methods = {
		init : function (options, c) {
			var settings = $.extend({ },
			{
				'backgroundColor' : '#000',
				'opacity' : 0.2,
				'zIndex' : 100,
				'autoClick' : true,
				'fadeSpeed' : 400,
				'click' : function (e) {},
				'onShow' : function (e) {}, 	// Event at the same time as it will show
				'onHide' : function (e) {},		// Event at the same time as it will hide
				'onShown' : function (e) {},	// Event (chained) after fadeIn
				'onHidden' : function (e) {},	// Event (chained) after fadeOut
			}, options);

			return this.each(function () {
			
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (!data) {
					
					var ol = $('<div />')
					.hide()
					.css({
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

				$this.overlay('show', c);
			});
		},
		show : function (c) {

			return this.each(function (e) {
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (!data) {
					// do init
					$this.overlay('init');
					return;
				}
				
				var ol = data.ol;
				
				var w = 0;
				var h = 0;
				
				if ($this[0].nodeName && $this[0].nodeName === "#document") {
					var w = '100%';
					var p = 'fixed';
					if (!self.innerWidth) { // Special case for IE8
						w = document.body.clientWidth;
						p = 'absolute';
					}
					ol.css({
						left : 0,
						top : 0,
						width : w,
						height : '100%',
						position : p
					});
				} else {
					// this might be wrong for some browsers?
					ol.css( {
						left: $this.offset().left,
						top : $this.offset().top,
						width : $this.outerWidth(),
						height : $this.outerHeight(),
						position : 'absolute'
					});
				}
				
				setTimeout(function() {
					ol.fadeIn(data.settings['fadeSpeed'], function (e) {
						setTimeout(function() {
							data.settings['onShown'].call($this);
						}, 25);
						
						if (c) {
							setTimeout(function() {
								c.call($this);
							}, 25);
						}
					});
				}, 25);
				
				setTimeout(function() {
					data.settings.onShow.call($this);
				}, 25);

			});
		},
		hide : function (c) {

			return this.each(function (e) {
				var $this = $(this);
				var data = $this.data('overlay');
				
				if (data && data.ol) {
				
					setTimeout(function() {
						data.ol.fadeOut(data.settings['fadeSpeed'], function (e) {
							setTimeout(function() {
								data.settings['onHidden'].call($this);
							}, 25);
						
							if (c) {
								setTimeout(function() {
									c.call($this);
								}, 25);
							}
						});
						
					}, 25);
				
					setTimeout(function() {
						data.settings.onHide.call($this);
					}, 25);
					
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
