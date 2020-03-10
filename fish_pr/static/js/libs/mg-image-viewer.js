/**
 * @company MG Technologies
 * @link http://www.mgtechnologies.co.in
 * @author SE Manu Mahesh
 * @date 01 April 2016
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
(function( $ ) {
    $.fn.mg_image_viewer = function( options ) {
        var settings = $.extend({
            bgColor: "#fff",
            restImagesHeight: 50
        }, options );
        
        if(settings.bgColor == 'transparent') {
            settings.bgColor = 'rgba(0, 0, 0, 0.5)';
        }
        
        var mg_other_images = '';
        var i = 0;
        $( '.mg-iv-image' ).each(function (){
            i++;
            $( this ).data('mg-image-no', i);
            mg_other_images += '<img class="mg-other-image-' + i + '" data-mg-image-no="' + i + '" src="' + $( this ).prop('src') + '" />';
        });
        
        var html = '<div style="display: none; background-color: ' + settings.bgColor + ';" class="mg-image-viewer"><span class="mg-iv-close-btn">&times;</span><a class="mg-iv-load-prev-image" href="#"><span></span></a><a class="mg-iv-load-next-image" href="#"><span></span></a><div class="mg-iv-main-image"></div><div class="mg-iv-other-images"><div class="mg-iv-inner"><span class="mg-iv-image-highlighter" style="display: none;"></span>' + mg_other_images + '</div></div></div>';
        $("body").append( html );
        
        $( '.mg-iv-image' ).click(function (){
            $(".mg-iv-selected-image").removeClass("mg-iv-selected-image");
            $( '.mg-other-image-' + $( this ).data('mg-image-no') ).addClass('mg-iv-selected-image');
                        
            $(".mg-image-viewer").fadeIn('slow');
            $(".mg-iv-main-image").html('<span class="mg-iv-vertical-align"></span><img src="' + $( this ).prop('src') + '" />');
            $("body").addClass('mg-iv-open');
            
            var mgivInnerWidth = 4;
            $( '.mg-iv-other-images > .mg-iv-inner > img' ).each(function (){
                mgivInnerWidth += +$( this ).width() + 20;
            });
            $('.mg-iv-other-images > .mg-iv-inner').css({width: mgivInnerWidth});
            
            $('.mg-iv-image-highlighter').css({width: $(".mg-iv-selected-image").width(), top: (10 + $(".mg-iv-selected-image").position().top), left: (10 + $(".mg-iv-selected-image").position().left)});
//            $('.mg-iv-image-highlighter').show();
        });
        
        $( '.mg-iv-other-images > .mg-iv-inner > img' ).click(function (){
            $(".mg-iv-selected-image").removeClass("mg-iv-selected-image");
            $( this ).addClass("mg-iv-selected-image");
            $(".mg-iv-main-image > img").prop('src', $( this ).prop('src'));
            $('.mg-iv-image-highlighter').css({width: $(".mg-iv-selected-image").width(), top: (10 + $(".mg-iv-selected-image").position().top), left: (10 + $(".mg-iv-selected-image").position().left)});
//            $('.mg-iv-image-highlighter').show();
        });
        
        $( '.mg-iv-load-prev-image' ).click(function ( e ){
            e.preventDefault();
            var currentImageIndex = $(".mg-iv-selected-image").data('mg-image-no');
            var prevImageIndex = (+currentImageIndex - 1);
            if(prevImageIndex == 0) {
                prevImageIndex = i;
            }
            $('.mg-other-image-' + prevImageIndex).trigger('click');
        });
        
        $( '.mg-iv-load-next-image' ).click(function ( e ){
            e.preventDefault();
            var currentImageIndex = $(".mg-iv-selected-image").data('mg-image-no');
            var nextImageIndex = (+currentImageIndex + 1);
            if(nextImageIndex > i) {
                nextImageIndex = 1;
            }
            $('.mg-other-image-' + nextImageIndex).trigger('click');
        });
        
        $(".mg-iv-main-image").mousewheel(function (event, delta) {
            if ((delta * 30) > 0) {
                $( '.mg-iv-load-prev-image' ).trigger('click');
            } else {
                $( '.mg-iv-load-next-image' ).trigger('click');
            }
            event.preventDefault();
        });
        
        $(document).keydown(function(e) {
            if (e.keyCode == 27 && $("body").hasClass('mg-iv-open')) {
                $( ".mg-image-viewer .mg-iv-close-btn" ).trigger('click');
            }
            if (e.keyCode == 39 && $("body").hasClass('mg-iv-open')) {
                $( '.mg-iv-load-next-image' ).trigger('click');
            }
            if (e.keyCode == 37 && $("body").hasClass('mg-iv-open')) {
                $( '.mg-iv-load-prev-image' ).trigger('click');
            }
        });
        
        $( ".mg-image-viewer .mg-iv-close-btn" ).click(function (){
            $(".mg-image-viewer").fadeOut('slow');
            $("body").removeClass('mg-iv-open');
        });
        
        return true;
    };
}( jQuery ));