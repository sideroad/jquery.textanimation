/*!
 * Text Animation v1.2.0
 * http://sideroad.secret.jp/
 *
 * Copyright (c) 2009 sideroad
 *
 * licensed under the MIT licenses.
 * Date: 2009-03-01
 */
//TextAnimation Plugin
(function($) {  
      
    $.fn.textAnimation = function(settings) {  
      
        var container = this;
        settings = $.extend({  
            mode : "roll"
        }, settings);
            
        function parse(e){
            if(e.hasClass("isTextAnimated")) return;
            var text = e.text();
            e.html("");
            for(var i=0;i< text.length;i++) {
                var span = $("<span></span>").text(text.charAt(i));
                e.append(span);
            }
            e.addClass("isTextAnimated");
        }
            
        function parseDiv(e,width,verticalAlign){
            if(e.hasClass("isTextAnimated")) return;
            var text = e.text();
            e.html("");
			
			//css setting
			var css = {position:"absolute"};
			verticalAlign = verticalAlign || "bottom";
			css[verticalAlign] = "0px";
            
			//width setting
			if(width === false) width = e.css("fontSize").replace(/px/,"")/1.25;
			
			for(var i=0;i< text.length;i++) {
				css.left = width*i;
                var div = $("<div></div>").text(text.charAt(i)).css(css);
				e.append(div);
            }
            e.addClass("isTextAnimated").css({position:"relative"});
        }
		
		function execute(options,start,finish){
			var time  = options.time;
			var interval = options.interval;
            var repeat = options.repeat;
            var startId;
			var amountInterval = interval + time;
			if(finish) amountInterval*=2;
			var e = options.e;
			
			if (options.onStart) {
				e.bind(options.onStart, function(){
					if (startId) return;
					start();
					if (repeat) {
						startId = setInterval(start, amountInterval);
						if (finish) {
							setTimeout(function(){
								finish();
								if (repeat) 
									setInterval(finish, amountInterval);
							}, amountInterval / 2);
						}
					}
				});
			} else {
                start();
                if(repeat) setInterval(start, amountInterval);
				if(finish) {
					setTimeout(function(){
                        finish();
                        if(repeat) setInterval(finish, amountInterval);
					},amountInterval/2);
				}
			}
			if (options.onFinish) {
                e.bind(options.onFinish, function(){
                    if (startId && repeat) {
						clearInterval(startId);
						startId = false;
					}
					if(finish) finish();
					
                });
			}
		}
			
        
		var f = {
			roll: function(e){
                var options = $.extend({
                    e : e,
					minsize : 15,
					magnification:15,
					delay : 30,
					interval : 0,
					repeat : true,
                    onStart : false,
					onFinish : false,
					onToggle : false,
					stuff : 1,
					fixed : "bottom",
					top : 1
                },settings);
                
                parseDiv(e,options.minsize/options.stuff,options.fixed);
				var i = 0;
                var minsize = options.minsize;
                var magnification = options.magnification;
                e.css({height:minsize+magnification+"px",textAlign:"center"});
				var elements = e.children();
				var de = options.delay;
                var duration = de * elements.length;
                var keepExec = false;
                var start = function(){
                    elements.each(function( i, elem ){
                        elem.style.width=minsize+"px";
                        $(elem).transition({ 
                                fontSize: minsize + magnification,
                                duration : duration,
                                easing : "in-out",
                                delay : de*i
                            })
                            .transition({ 
                                fontSize : minsize,
                                duration : duration,
                                easing : "in-out"
                            });
                    });
                }
				
                options.time = (duration*3);
                execute( options, start );
				
			},
			
			step : function(e) {
                var options = $.extend({
                    e : e,
                    minsize : 12,
                    maxsize :35,
					fixed : "bottom",
					upper : true,
					stuff: 2.0,
                    delay : 50,
                    interval : 3000,
                    duration : 300,
					repeat: true,
                    onStart : false,
                    onFinish : false
                },settings);
                
                parseDiv(e,options.minsize,options.fixed);
                e.css({height:options.maxsize+"px",textAlign:"center"});
				var elements = e.children().css({
					fontSize: "0px",
					width: "0px",
					left: "0px",
					opacity: 0
				});
				var length = elements.length;
				var m = (options.maxsize-options.minsize) / (length-1);
			    var ba = options.minsize;
				var upper = options.upper;
				if (!upper) {
					m *= -1;
					ba = options.maxsize;
				}
                var du = options.duration;
                var de = options.delay;
				var st = options.stuff;
				var interval = options.interval;
				
                var start = function(){
                    var left = 0;
                    elements.each(function( i, elem ){
                        
                        var fs = ba + (m * i);
                        $(elem).transition({
                            fontSize: fs+"px",
                            width : fs,
                            left: left,
                            opacity:1.0,
                            duration : du,
                            delay : de * i
                        });
                        left += (fs / st);
                    });
                };
                var finish = function(){
                    elements.each(function( i, elem ){
                        $(elem).transition({
                            fontSize: "0px",
                            width: 0,
                            left: 0,
                            opacity:0,
                            delay : de*i,
                            duration: du
                        });
                    });
                };
				
				options.time = (options.delay * length)+du;
				execute(options,start, finish);
			},
            
            highlight:function(e){
                var options = $.extend({
                    e : e,
                    baseColor : "#AAAAAA",
                    highlightColor : "#FDFF00",
                    delay : 50,
                    interval : 100,
                    duration : 300,
                    repeat: true,
                    onStart : false,
                    onFinish : false
                },settings);
                
                parse(e);
                var i = 0;
                var elements = e.children().css({color:options.baseColor});
                var length = elements.length;
                if(!options.interval && !options.delay) options.interval = 100;
                var hc = options.highlightColor;
                var bc = options.baseColor;
                var du = options.duration;
                var de = options.delay;
                
                var start = function(){
                    elements.each(function( i, elem ){
                        $(elem).transition({
                            color : hc,
                            delay : de*i,
                            duration : du
                        }).transition({
                            color : bc,
                            duration : du
                        });
                    });
                };
                
                options.time = (options.delay * length)+(du*3);
                execute(options,start);
            },
            
            jump:function(e){
                var options = $.extend({
                    e : e,
                    altitude : 30,
					bound : true,
                    delay : 400,
                    interval : 300,
                    duration : 600,
                    fixed : "bottom",
                    repeat: true,
                    onStart : false,
                    onFinish : false
                },settings);
                
                parseDiv(e,false,options.fixed);
                e.css({height:e.css("fontSize")});
                var i = 0;
                var elements = e.children();
                var length = elements.length;
                if(!options.interval && !options.delay) options.interval = 100;
                var al = options.altitude;
                var bo = options.bound;
                var du = options.duration;
                var de = options.delay;
				var ea = options.bound ? "in" : "in-out";
				var fi = options.fixed;
                
                var start = function(){
                    elements.each(function( i, elem ){
                        var cssleave = {
                            duration: du,
                            delay : de*i,
                            easing : "out"
                        };
                        cssleave[fi] = al;
                        var cssarrive = {
                            duration: du,
                            easing : ea
                        };
                        cssarrive[fi] = 0;
                        $(elem).transition(cssleave)
                               .transition(cssarrive);
                        
                    });
                };
                
                options.time = (options.delay * length)+(du*2);
                execute(options,start);
            } ,
            
            puff : function( e ) {
                var options = $.extend({
                    e : e,
                    duration : 600,
                    interval : 600,
                    onStart : false,
                    onFinish : false,
                    repeat : true,
                    percent : 300,
                    color : false,
					times : 1
                },settings);
                
                var start = function(){
					var position = e.position();
                    var css = {
                        "position": "absolute",
                        "left": position.left + "px",
                        "top": position.top + "px",
                        "z-index": -1000
                    };
                    
                    if (options.color) 
                        css.color = options.color;
                    if (options.backgroundColor) 
                        css.backgroundColor = options.backgroundColor;
					e.clone().attr("id", "").insertBefore(e).css(css).transition({
                        opacity: 0,
                        scale: 1.6,
                        duration : options.duration
                    }, function(){
                        $(this).remove();
                    });
					
                };
                options.time = options.duration;
                execute(options,start);
            }
		};
		
        return container.each(function(){  
            f[settings.mode]($(this));
        });
    };
  
})(jQuery);