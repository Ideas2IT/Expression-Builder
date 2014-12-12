/*
popModal - 1.10 [07.10.14]
Author: vadimsva
Github: https://github.com/vadimsva/popModal
*/
/* popModal */
(function($) {
	$.fn.popModal = function(method) {
		var elem = $(this),
		elemObj,
		isFixed = '',
		expandView = true,
		closeBut = '',
		elemClass = 'popModal',
		overflowContentClass,
		_options,
		animTime,
		effectIn = 'fadeIn',
		effectOut = 'fadeOut',
		bl = 'bottomLeft',
		bc = 'bottomCenter',
		br = 'bottomRight',
		lt = 'leftTop',
		lc = 'leftCenter',
		rt = 'rightTop',
		rc = 'rightCenter';
		
		var currentID;
	
		var methods = {
			init : function(params) {
				var _defaults = {
					html: '',
					placement: bl,
					showCloseBut: true,
					onDocumentClickClose : true,
          onDocumentClickClosePrevent : '',
					overflowContent : false,
					inline : true,
					beforeLoadingContent : 'Please, waiting...',
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);
				
				if ( $('body').find('.' + elemClass).length != 0 && $('body').find('.' + elemClass).attr('data-popmodal_id') == elem.attr('data-popmodal_id') ) {
					popModalClose();
				} else {
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
					$('.' + elemClass + '_source').replaceWith($('.' + elemClass + '_content').children());
					$('.' + elemClass).remove();

					if (_options.showCloseBut) {
						closeBut = $('<button type="button" class="close">&times;</button>');
					}
					if (elem.css('position') == 'fixed') {
						isFixed = 'position:fixed;';
					}
					if (_options.overflowContent) {
					overflowContentClass = elemClass + '_contentOverflow';
					} else {
						overflowContentClass = '';
					}
					
					var newEleWidth = "max-width:700px;"
					
					currentID = new Date().getMilliseconds();
					elem.attr('data-popmodal_id', currentID);

					
					var tooltipContainer = $('<div class="' + elemClass + ' animated" style="' + isFixed + newEleWidth + '" data-popmodal_id="' + currentID + '"></div>');
					var tooltipContent = $('<div class="' + elemClass + '_content ' + overflowContentClass + '"></div>');
					tooltipContainer.append(closeBut, tooltipContent);
					
					if ($.isFunction(_options.html)) {
						var beforeLoadingContent = _options.beforeLoadingContent;
						tooltipContent.append(beforeLoadingContent);
						_options.html(function(loadedContent) {
							tooltipContent.empty().append(loadedContent);
							elemObj = $('.' + elemClass);
							expandView = true;
							getPlacement();
						});
					} else {
						if ($.type(_options.html) == 'object') {
							_options.html.after($('<div class="popModal_source"></div>'));
						}
						tooltipContent.append(_options.html);
					}
					if (_options.inline) {
						elem.after(tooltipContainer);
					} else {
						$('body').append(tooltipContainer);
					}
					
					elemObj = $('.' + elemClass);
					if (elemObj.find('.' + elemClass + '_footer')) {
						elemObj.find('.' + elemClass + '_content').css({marginBottom: elemObj.find('.' + elemClass + '_footer').outerHeight() + 'px'});
					}
					
					if (!$.isFunction(_options.html)) {
						if ($.type(_options.html) == 'string') {
							var htmlStr = _options.html;
						} else {
							var htmlStr = _options.html[0].outerHTML;
						}
					}
					

					if (_options.onLoad && $.isFunction(_options.onLoad)) {
						_options.onLoad();
					}

					elemObj.on('destroyed', function() {
						if (_options.onClose && $.isFunction(_options.onClose)) {
							_options.onClose();
						}
					});

					getView();
					getPlacement();

					if (_options.onDocumentClickClose) {
						$('html').on('click.' + elemClass + 'Event', function(event) {
							$(this).addClass(elemClass + 'Open');
							if (elemObj.is(':hidden')) {
								popModalClose();
							}
              var target = $(event.target);
							if (!target.parents().andSelf().is('.' + elemClass) && !target.parents().andSelf().is(elem)) {
								var zIndex = parseInt(target.parents().filter(function() {
									return $(this).css('zIndex') !== 'auto';
								}).first().css('zIndex'));
								if (isNaN(zIndex)) {
									zIndex = 0;
								}
                if (_options.onDocumentClickClosePrevent != '' && target.is(_options.onDocumentClickClosePrevent)) {
                  zIndex = 9999;
                }
								var target_zIndex = target.css('zIndex');
								if (target_zIndex == 'auto') {
									target_zIndex = 0;
								}
								if (zIndex < target_zIndex) {
									zIndex = target_zIndex;
								}
								if (zIndex <= elemObj.css('zIndex')) {
									popModalClose();
								}
							}
						});
					}
					
					$(window).resize(function() {
						getPlacement();
					});
					
					elemObj.find('.close').on('click', function() {
						popModalClose();
						$(this).off('click');
					});
					
					elemObj.find('[data-popmodal-but="close"]').on('click', function() {
						popModalClose();
						$(this).off('click');
					});

					elemObj.find('[data-popmodal-but="ok"]').on('click', function(event) {
						var ok;
						if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
							ok = _options.onOkBut(event);
						}
						if (ok !== false) {
							popModalClose();
						}
						$(this).off('click');
					});

					elemObj.find('[data-popmodal-but="cancel"]').on('click', function() {
						if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
							_options.onCancelBut();
						}
						popModalClose();
						$(this).off('click');
					});

					$('html').on('keydown.' + elemClass + 'Event', function(event) {
						if (event.keyCode == 27) {
							popModalClose();
						}
					});

				}
				
			},
			hide : function() {
				popModalClose();
			}
		};
		
		function getView() {
			expandView = true;
			if (elem.parent().css('position') != 'absolute' || elem.parent().css('position') != 'fixed') {
				if (elemObj.find('.' + elemClass + '_content').width() < 270 && elemObj.find('.' + elemClass + '_content').height() <= 20 && elemObj.find('.' + elemClass + '_footer').length == 0) {
					expandView = false;
				}
			}
		}
		
		function getPlacement() {
			if (_options.inline) {
				var eLeft = elem.position().left;
				var eTop = elem.position().top;
			} else {
				var eLeft = elem.offset().left;
				var eTop = elem.offset().top;
			}
			var offset = 10,
			eMLeft = parseInt(elem.css('marginLeft')),
			ePLeft = parseInt(elem.css('paddingLeft')),
			eMTop = parseInt(elem.css('marginTop')),
			eHeight = elem.outerHeight(),
			eWidth = elem.outerWidth(),
			eObjMaxWidth = parseInt(elemObj.css('maxWidth')),
			eObjMinWidth = parseInt(elemObj.css('minWidth')),
			eObjWidth,
			eObjHeight = elemObj.outerHeight();
			
			if (expandView) {
				if (isNaN(eObjMaxWidth)) {
					eObjMaxWidth = 300;
				}
				eObjWidth = eObjMaxWidth;
			} else {
				if (isNaN(eObjMinWidth)) {
					eObjMinWidth = 180;
				}
				eObjWidth = eObjMinWidth;
			}
			elemObj.css({width: eObjWidth + 'px'});
			
			var placement,
			eOffsetLeft = elem.offset().left,
			eOffsetRight = $(window).width() - elem.offset().left - eWidth,
			eOffsetTop = elem.offset().top,
			deltaL = eOffsetLeft - offset - eObjWidth,
			deltaBL = eWidth + eOffsetLeft - eObjWidth,
			deltaR = eOffsetRight - offset - eObjWidth,
			deltaBR = eWidth + eOffsetRight - eObjWidth,
			deltaCL = eWidth / 2 + eOffsetLeft - eObjWidth / 2,
			deltaCR = eWidth / 2 + eOffsetRight - eObjWidth / 2,
			deltaC = Math.min(deltaCR, deltaCL),
			deltaCT = eOffsetTop - eObjHeight / 2;

			function optimalPosition(current) {
				var optimal;
				var maxDelta = Math.max(deltaBL, deltaBR, deltaC);
				if (isCurrentFits(current)) {
				  optimal = current;
				} else if (deltaBR > 0 && deltaBR == maxDelta) {
					optimal = bl;
				} else if (deltaBL > 0 && deltaBL == maxDelta) {
					optimal = br;
				} else if (deltaC > 0 && deltaC == maxDelta) {
					optimal = bc;
				} else {
					optimal = current;
				}
				return optimal;
			}
			
			function isCurrentFits(current) {
			  return current == bl ? deltaBR > 0 
				: current == br ? deltaBL > 0 
				: deltaC > 0;
			}
			
			if ((/^bottom/).test(_options.placement)) {
				placement = optimalPosition(_options.placement);
			} else if ((/^left/).test(_options.placement)) {
				if (deltaL > 0) {
					if (_options.placement == lc && deltaCT > 0) {
						placement = lc;
					} else {
						placement = lt;
					}
				} else {
					placement = optimalPosition(bl);
				}
			} else if ((/^right/).test(_options.placement)) {
				if (deltaR > 0) {
					if (_options.placement == rc && deltaCT > 0) {
						placement = rc;
					} else {
						placement = rt;
					}
				} else {
					placement = optimalPosition(br);
				}
			}
			
			elemObj.removeAttr('class').addClass(elemClass + ' animated ' + placement);
			switch (placement){
				case (bl):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + 'px'
					}).addClass(effectIn + 'Bottom');
				break;
				case (br):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + eWidth - eObjWidth + 'px'
					}).addClass(effectIn + 'Bottom');
				break;
				case (bc):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + (eWidth - eObjWidth) / 2 + 'px'
					}).addClass(effectIn + 'Bottom');
				break;
				case (lt):
					elemObj.css({
						top: eTop + eMTop + 'px',
						left: eLeft + eMLeft - eObjWidth - offset + 'px'
					}).addClass(effectIn + 'Left');
				break;
				case (rt):
					elemObj.css({
						top: eTop + eMTop + 'px',
						left: eLeft + eMLeft + eWidth + offset + 'px'
					}).addClass(effectIn + 'Right');
				break;
				case (lc):
					elemObj.css({
						top: eTop + eMTop + eHeight / 2 - eObjHeight / 2 + 'px',
						left: eLeft + eMLeft - eObjWidth - offset + 'px'
					}).addClass(effectIn + 'Left');
				break;
				case (rc):
					elemObj.css({
						top: eTop + eMTop + eHeight / 2 - eObjHeight / 2 + 'px',
						left: eLeft + eMLeft + eWidth + offset + 'px'
					}).addClass(effectIn + 'Right');
				break;
			}
		}
		
		function popModalClose() {
			elemObj = $('.' + elemClass);
			if (elemObj.length) {
				reverseEffect();
				getAnimTime();
				setTimeout(function () {
					$('.' + elemClass + '_source').replaceWith($('.' + elemClass + '_content').children());
					elemObj.remove();
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
				}, animTime);
			}
		}
		
		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('animationDuration');
				if (animTime != undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
		}
		
		function reverseEffect() {
			var animClassOld = elemObj.attr('class'),
			animClassNew = animClassOld.replace(effectIn, effectOut);
			elemObj.removeClass(animClassOld).addClass(animClassNew);
		}

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}

	}

	$('* [data-popmodal-bind]').bind('click', function() {
		var elemBind = $(this).attr('data-popmodal-bind');
		var params = {html: $(elemBind)};
		if ($(this).attr('data-placement') != undefined) {
			params['placement'] = $(this).attr('data-placement');
		}
		if ($(this).attr('data-showclose-but') != undefined) {
			params['showCloseBut'] = (/^true$/i).test($(this).attr('data-showclose-but'));
		}
		if ($(this).attr('data-overflowcontent') != undefined) {
			params['overflowContent'] = (/^false$/i).test($(this).attr('data-overflowcontent'));
		}
		if ($(this).attr('data-ondocumentclick-close') != undefined) {
			params['onDocumentClickClose'] = (/^true$/i).test($(this).attr('data-ondocumentclick-close'));
		}
		if ($(this).attr('data-ondocumentclick-close-prevent') != undefined) {
			params['onDocumentClickClosePrevent'] = $(this).attr('data-ondocumentclick-close-prevent');
		}
		if ($(this).attr('data-inline') != undefined) {
			params['inline'] = (/^true$/i).test($(this).attr('data-inline'));
		}
		if ($(this).attr('data-beforeloading-content') != undefined) {
			params['beforeLoadingContent'] = $(this).attr('data-beforeloading-content');
		}
		$(this).popModal(params);
	});
	
  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler();
      }
    }
  }
})(jQuery);


/* notifyModal */
(function($) {
	$.fn.notifyModal = function(method) {
		var elem = $(this),
		elemObj,
		elemClass = 'notifyModal',
		onTopClass = '',
		_options,
		animTime;
		
		var methods = {
			init : function(params) {
				var _defaults = {
					duration: 2500,
					placement: 'center',
					type: 'notify',
					overlay : true,
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);
				
				if (_options.overlay) {
					onTopClass = 'overlay';
				}
				
				$('.' + elemClass).remove();
				var notifyContainer = $('<div class="' + elemClass + ' ' + _options.placement + ' ' + onTopClass + ' ' + _options.type + '"></div>');
				var notifyContent = $('<div class="' + elemClass + '_content"></div>');
				var closeBut = $('<button type="button" class="close">&times;</button>');
				if (elem[0] == undefined) {
					elem = elem['selector'];
				} else {
					elem = elem[0].innerHTML;
				}
				notifyContent.append(closeBut, elem);
				notifyContainer.append(notifyContent);
				$('body').append(notifyContainer);

				elemObj = $('.' + elemClass);
				getAnimTime();
				
				setTimeout(function() {
					elemObj.addClass('open');
				}, animTime);

				elemObj.click(function() {
					notifyModalClose();
				});
				if (_options.duration != -1) {
					notifDur = setTimeout(notifyModalClose, _options.duration);
				}

			},
			hide : function() {
				notifyModalClose();
			}
		};
		
		function notifyModalClose() {
			var elemObj = $('.' + elemClass);
			setTimeout(function() {
				elemObj.removeClass('open');
				setTimeout(function() {
					elemObj.remove();
					if (_options.duration != -1) {
						clearTimeout(notifDur);
					}
					if (_options.onClose && $.isFunction(_options.onClose)) {
						_options.onClose();
					}
				}, animTime);
			}, animTime);

		}

		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('transitionDuration');
				if (animTime != undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
		}
		
		$('html').keydown(function(event) {
			if (event.keyCode == 27) {
				notifyModalClose();
			}
		});

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}

	}
	
	$('* [data-notifymodal-bind]').bind('click', function() {
		var elemBind = $(this).attr('data-notifymodal-bind');
		var params = {};
		if ($(this).attr('data-duration') != undefined) {
			params['duration'] = parseInt($(this).attr('data-duration'));
		}
		if ($(this).attr('data-placement') != undefined) {
			params['placement'] = $(this).attr('data-placement');
		}
		if ($(this).attr('data-ontop') != undefined) {
			params['onTop'] = (/^true$/i).test($(this).attr('data-ontop'));
		}
		$(elemBind).notifyModal(params);
	});
	
})(jQuery);


/* hintModal */
(function($) {
	$.fn.hintModal = function(method){
	
		var methods = {
			init : function(params) {

				$(this).mouseenter(function() {
					var elem = $(this).find('> .hintModal_container');
					elem.addClass('animated fadeInBottom');
					getPlacement($(this), elem);
				});
				
				$(this).mouseleave(function() {
					var elem = $(this).find('> .hintModal_container');
					elem.removeClass('animated fadeInBottom');
				});

				function getPlacement(elemObj, elem) {
					var placement,
					placementDefault,
					eObjWidth = elemObj.outerWidth(),
					eWidth = elem.outerWidth(),
					eOffsetLeft = elemObj.offset().left,
					eOffsetRight = $(window).width() - elemObj.offset().left - eObjWidth,
					deltaBL = eObjWidth + eOffsetLeft - eWidth,
					deltaBR = eObjWidth + eOffsetRight - eWidth,
					deltaCL = eObjWidth / 2 + eOffsetLeft - eWidth / 2,
					deltaCR = eObjWidth / 2 + eOffsetRight - eWidth / 2,
					deltaC = Math.min(deltaCR, deltaCL),
					bl = 'bottomLeft',
					bc = 'bottomCenter',
					br = 'bottomRight';
					
					if (elemObj.hasClass(bl)) {
						placementDefault = bl;
					} else if (elemObj.hasClass(bc)) {
						placementDefault = bc;
					} else if (elemObj.hasClass(br)) {
						placementDefault = br;
					} else {
						placementDefault = bl;
					}
					
					if (elemObj.data('placement') == undefined) {
						elemObj.data('placement', placementDefault);
					}

					function optimalPosition(current) {
						var optimal;
						var maxDelta = Math.max(deltaBL, deltaBR, deltaC);
						if (isCurrentFits(current)) {
							optimal = current;
						} else if (deltaBR > 0 && deltaBR == maxDelta) {
							optimal = bl;
						} else if (deltaBL > 0 && deltaBL == maxDelta) {
							optimal = br;
						} else if (deltaC > 0 && deltaC == maxDelta) {
							optimal = bc;
						} else {
							optimal = current;
						}
						return optimal;
					}
					
					function isCurrentFits(current) {
						return current == bl ? deltaBR > 0 
						: current == br ? deltaBL > 0 
						: deltaC > 0;
					}
					
					placement = optimalPosition(elemObj.data('placement'));
					elemObj.removeAttr('class').addClass('hintModal ' + placement);
				}
			
			}
		};

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		
	};
	$('.hintModal').hintModal();
})(jQuery);


/* dialogModal */
(function($) {
	$.fn.dialogModal = function(method) {
		var elem = $(this),
		elemObj,
		elemContObj,
		elemClass = 'dialogModal',
		prevBut = 'dialogPrev',
		nextBut = 'dialogNext',
		_options,
		animTime;
	
		var methods = {
			init : function(params) {
				var _defaults = {
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);

				$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
				$('.' + elemClass + ' .' + prevBut + ', .' + elemClass + ' .' + nextBut).off('click');
				$('.' + elemClass).remove();

				var currentDialog = 0,
				maxDialog = elem.length - 1;

				dialogMain = $('<div class="' + elemClass + '"></div>'),
				dialogContainer = $('<div class="' + elemClass + '_container"></div>'),
				dialogCloseBut = $('<button type="button" class="close">&times;</button>'),
				dialogBody = $('<div class="' + elemClass + '_body"></div>');
				dialogMain.append(dialogContainer);
				dialogContainer.append(dialogCloseBut, dialogBody);
				dialogBody.append(elem[currentDialog].innerHTML);
				
				if (maxDialog > 0) {
					dialogContainer.prepend($('<div class="' + prevBut + ' notactive"></div><div class="' + nextBut + '"></div>'));
				}
				$('body').append(dialogMain);
				elemObj = $('.' + elemClass);
				elemContObj = $('.' + elemClass + '_container');
				getAnimTime();

				if (_options.onLoad && $.isFunction(_options.onLoad)) {
					_options.onLoad();
				}

				elemObj.on('destroyed', function() {
					if (_options.onClose && $.isFunction(_options.onClose)) {
						_options.onClose();
					}
				});
				
				var getScrollBarWidth = window.innerWidth - $(window).outerWidth();
				$('body').css({paddingRight: getScrollBarWidth + 'px'}).addClass(elemClass + 'Open');
				
				centerDialog();
				
				function centerDialog() {
					var dialogHeight = elemContObj.outerHeight(),
					windowHeight = $(window).height();
					if (windowHeight > dialogHeight + 80) {
						elemContObj.css({
							marginTop: ($(window).height() - dialogHeight) / 2 - 100 + 'px'
						});	
					} else {
						elemContObj.css({
							marginTop: '60px'
						});						
					}

					setTimeout(function() {
						elemObj.addClass('open');
					}, animTime);
					
					bindFooterButtons();
				}
				
				function bindFooterButtons() {
					elemObj.find('[data-dialogmodal-but="close"]').on('click', function() {
						dialogModalClose();
						$(this).off('click');
					});

					elemObj.find('[data-dialogmodal-but="ok"]').on('click', function(event) {
						var ok;
						if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
							ok = _options.onOkBut(event);
						}
						if (ok !== false) {
							dialogModalClose();
						}
						$(this).off('click');
					});

					elemObj.find('[data-dialogmodal-but="cancel"]').on('click', function() {
						if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
							_options.onCancelBut();
						}
						dialogModalClose();
						$(this).off('click');
					});
				}

				elemObj.find('.' + prevBut).on('click', function() {
					if (currentDialog > 0) {
						--currentDialog;
						if (currentDialog < maxDialog) {
							elemObj.find('.' + nextBut).removeClass('notactive');
						}
						if (currentDialog == 0) {
							elemObj.find('.' + prevBut).addClass('notactive');
						}
						dialogBody.empty().append(elem[currentDialog].innerHTML);
						centerDialog();
					}
				});
				
				elemObj.find('.' + nextBut).on('click', function() {
					if (currentDialog < maxDialog) {
						++currentDialog;
						if (currentDialog > 0) {
							elemObj.find('.' + prevBut).removeClass('notactive');
						}
						if (currentDialog == maxDialog) {
							elemObj.find('.' + nextBut).addClass('notactive');
						}
						dialogBody.empty().append(elem[currentDialog].innerHTML);
						centerDialog();
					}
				});

				elemObj.find('.close').on('click', function() {
					dialogModalClose();
					$(this).off('click');
				});
				
				$('html').on('keydown.' + elemClass + 'Event', function(event) {
					if (event.keyCode == 27) {
						dialogModalClose();
					} else if (event.keyCode == 37) {
						elemObj.find('.' + prevBut).click();
					} else if (event.keyCode == 39) {
						elemObj.find('.' + nextBut).click();
					}
				});
					
			},
			hide : function() {
				dialogModalClose();
			}
		};
		
		function dialogModalClose() {
		var elemObj = $('.' + elemClass);
			setTimeout(function() {
				elemObj.removeClass('open');
				setTimeout(function() {
					elemObj.remove();
					$('body').removeClass(elemClass + 'Open').css({paddingRight:''});
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
					elemObj.find('.' + prevBut).off('click');
					elemObj.find('.' + nextBut).off('click');
				}, animTime);
			}, animTime);
		}
		
		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('transitionDuration');
				if (animTime != undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
		}

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		}

	}
	
	$('* [data-dialogmodal-bind]').bind('click', function() {
		var elemBind = $(this).attr('data-dialogmodal-bind');
		$(elemBind).dialogModal();
	});

  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler();
      }
    }
  }
})(jQuery);


/* titleModal */
(function($) {
	$.fn.titleModal = function(method) {
		var methods = {
			init : function(params) {
				var elem,
				elemObj,
				elemClass = 'titleModal',
				getElem = $('*[data-titlemodal]'),
				animTime,
				effectIn = 'fadeIn',
				effectOut = 'fadeOut';
				
				getElem.mouseenter(function() {
					elem = $(this);
					titleAttr =	elem.attr('title');
					elem.removeAttr('title');
					elem.attr('data-title', titleAttr);
					titleModal = $('<div class="' + elemClass + ' animated"></div>');
					elemObj = $('.' + elemClass);
					placement = elem.attr('data-placement');
					if (placement == undefined) {
						placement = 'bottom';
					}
					if (elemObj) {
						elemObj.remove();
					}
					elem.after(titleModal.append(titleAttr));
					getPlacement();
				});

				getElem.mouseleave(function() {
					elem = $(this);
					titleAttr =	elem.attr('data-title');
					elem.removeAttr('data-title');
					elem.attr('title', titleAttr);
					reverseEffect();
					getAnimTime();
					setTimeout(function() {
						elemObj.remove();
					},animTime);
				});
				
				function getPlacement() {
					elemObj = $('.' + elemClass);
					var eLeft = elem.position().left,
					eTop = elem.position().top,
					eMLeft = elem.css('marginLeft'),
					eMTop = elem.css('marginTop'),
					eMBottom = elem.css('marginBottom'),
					eHeight = elem.outerHeight(),
					eWidth = elem.outerWidth(),
					eObjMTop = elemObj.css('marginTop'),
					eObjWidth = elemObj.outerWidth(),
					eObjHeight = elemObj.outerHeight();
					switch (placement) {
						case 'bottom':
							elemObj.css({
								marginTop: parseInt(eObjMTop) - parseInt(eMBottom) + 'px',
								left: eLeft + parseInt(eMLeft) + (eWidth - eObjWidth) / 2 + 'px'
							}).addClass(effectIn + 'Bottom');	
						break;
						case 'top':
							elemObj.css({
								top: eTop + parseInt(eMTop) - eObjHeight + 'px',
								left: eLeft + parseInt(eMLeft) + (eWidth - eObjWidth) / 2 + 'px'
							}).addClass('top ' + effectIn + 'Top');	
						break;
						case 'left':
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eObjHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) - eObjWidth - 10 + 'px'
							}).addClass('left ' + effectIn + 'Left');	
						break;
						case 'right':
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eObjHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) + eWidth + 10 + 'px'
							}).addClass('right ' + effectIn + 'Right');	
						break;
					
					}
				}
				
				function getAnimTime() {
					if (!animTime) {
						animTime = elemObj.css('animationDuration');
						if (animTime != undefined) {
							animTime = animTime.replace('s', '') * 1000;
						} else {
							animTime = 0;
						}
					}
				}
				
				function reverseEffect() {
					var animClassOld = elemObj.attr('class'),
					animClassNew = animClassOld.replace(effectIn, effectOut);
					elemObj.removeClass(animClassOld).addClass(animClassNew);
				}

			}
		};

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		}
		
	}();
})(jQuery);
