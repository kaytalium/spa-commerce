/* ===========================================================
 * jquery-loadingbar.js v1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Add a Youtube-like loading bar  
 * to all your AJAX links 
 *
 * https://github.com/peachananr/loading-bar
 *
 * ========================================================== */

!function($){
  
  var defaults = {
		replaceURL: false,
		target: ".item_result_holder",
    direction: "right",
    
		
		/* Deafult Ajax Parameters  */
		async: true,
		complete: function(xhr, text) {},
		cache: true,
		error: function(xhr, text, e) {},
		global: true,
    headers: {},
    data: {},
		statusCode: {},
		success: function(data, text, xhr) {},
    dataType: "JSON",
    type: 'POST',

  };
  filterGroup = [];
	
	$.fx.step.textShadowBlur = function(fx) {
    $(fx.elem).prop('textShadowBlur', fx.now).css({textShadow: '0 0 ' + Math.floor(fx.now) + 'px black'});
  };
  
	
  $.fn.loadingbar = function(options){
    console.log('From Loader: ',$(this))
    var data = $(this).data(),
        settings = $.extend({}, defaults, options, data),
        el = $(this),
        href = el.attr("href"),
        filterFound = false

    filterGroup.forEach(filter => {
        if (filter.filter == settings.filter) {
            filterFound = true
        }

        if (filterFound) {
            filter.value = settings.name
        }
    })

       //if current filter was not found than add it to the array
       if (!filterFound)
       filterGroup.push({ filter: settings.filter, value: settings.name })

       settings.data = {'filterGroup': JSON.stringify(filterGroup)}

    return this.each(function(){
      el.click(function (){
        $.ajax({
          type: settings.type,
          url: "/filter_search/",
          async: settings.async,
          complete: settings.complete,
          cache: settings.cache,
          error: settings.error,
          global: settings.global,
          headers: settings.headers,
          data: settings.data,
          statusCode: settings.statusCode,
          success: settings.success,
          dataType : datatype,
          beforeSend: function() {
            if ($("#loadingbar").length === 0) {
              $("body").append("<div id='loadingbar'></div>")
              $("#loadingbar").addClass("waiting").append($("<dt/><dd/>"));
              
              switch (settings.direction) { 
                case 'right':
                   $("#loadingbar").width((50 + Math.random() * 30) + "%");
                  break;
                case 'left':
                   $("#loadingbar").addClass("left").animate({
                     right: 0,
                     left: 100 - (50 + Math.random() * 30) + "%"
                   }, 200);
                  break;
                case 'down':
                   $("#loadingbar").addClass("down").animate({
                     left: 0,
                     height: (50 + Math.random() * 30) + "%"
                   }, 200);
                  break;
                case 'up':
                   $("#loadingbar").addClass("up").animate({
                     left: 0,
                     top: 100 - (50 + Math.random() * 30) + "%"
                   }, 200);
                  break;
              }
             
            }
          }
        }).always(function() {
          switch (settings.direction) { 
            case 'right':
               $("#loadingbar").width("101%").delay(200).fadeOut(400, function() {
                   $(this).remove();
               });
              break;
            case 'left':
               $("#loadingbar").css("left","0").delay(200).fadeOut(400, function() {
                    $(this).remove();
                });
              break;
            case 'down':
                $("#loadingbar").height("101%").delay(200).fadeOut(400, function() {
                     $(this).remove();
                 });
               break;
            case 'up':
                $("#loadingbar").css("top", "0").delay(200).fadeOut(400, function() {
                     $(this).remove();
                 });
               break;
          }
          
        }).done(function(data) {
          if ( history.replaceState && settings.replaceURL == true ) history.pushState( {}, document.title, href );
          if (settings.done) {
            settings.done(data, target)
          } else {
            $(target).html(data)
          }
          
        });
        return false
      });
      
      
    });
  }
  
}(window.jQuery);


