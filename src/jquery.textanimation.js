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
					delay : 20,
                    onStart : false,
					onFinish : false,
					onToggle : false,
					stuff : 1,
					fixed : "bottom"
                },settings);
                
                parseDiv(e,options.minsize/options.stuff,options.fixed);
				var i = 0;
                var minsize = options.minsize;
                var magnification = options.magnification;
                e.css({height:minsize+magnification+"px",textAlign:"center"});
				var elements = e.children();
				var de = options.delay;
                var r = function(){
                    i--;
                    elements.each(function(j){
                        var fontSize = Math.abs(Math.sin((i+j)/de)*magnification)+minsize;
                        this.style.fontSize = fontSize+"px";
						this.style.width = minsize+"px";
                    });
                };
				
				if (options.onStart) {
					var intervalId;
                    e.bind(options.onStart, function(){
						r();
						intervalId = setInterval(r,30);
					});
					e.bind(options.onFinish,function(){
						if(intervalId) clearInterval(intervalId);
					});
				} else {
					r();
					setInterval(r, 30);
				}
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
                    elements.each(function(i){
                        var c = $(this);
                        
                        setTimeout(function(){
                            var fs = ba + (m * i);
                            c.animate({
                                fontSize:fs+"px",
                                width : fs,
                                left: left,
								opacity:1.0
                            },{
                                duration: du
                            });
                            left += (fs / st);
                            
                        },de*i);
                    });
                };
                var finish = function(){
                    elements.each(function(i){
                        var c = $(this);
                                                
                        setTimeout(function(){
                            c.animate({
                                fontSize: "0px",
                                width: 0,
                                left: 0,
                                opacity:0
                            },{
                                duration: du
                            });
                            
                        },de*i);
                    });
                };
				
				options.time = (options.delay * length);
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
                    elements.each(function(i){
                        var s = $(this);
                        setTimeout(function(){
                            s.animate({
                                color: hc
                            }, {
                                duration: du
                            }).animate({
                                color: bc
                            },{
                                duration: du
                            });
                        },de*i);
                    });
                };
                
                options.time = (options.delay * length);
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
				var ea = options.bound ? "easeOutBounce" : "easeInQuad";
				var fi = options.fixed;
                
                var start = function(){
                    elements.each(function(i){
                        var s = $(this);
                        setTimeout(function(){
							var cssleave = {};
                            cssleave[fi] = al;
							var cssarrive = {};
                            cssarrive[fi] = 0;
                            s.animate(cssleave, {
                                duration: du,
								easing : "swing"
                            }).animate(cssarrive,{
                                duration: du,
								easing : ea
                            });
                        },de*i);
                    });
                };
                
                options.time = (options.delay * length);
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
                
				var times = options.times;
				var du = options.duration/options.times;
                var start = function(){
					var f = function(){
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
                            
                            e.clone().attr("id", "").insertBefore(e).css(css).hide("puff", {
                                percent: options.percent
                            }, options.duration, function(){
                                $(this).remove();
                            });
				    };
					f();
                    for(var i=0;i<times-1;i++) {
						setTimeout(f,du*i);
					}
                };
                options.time = options.duration;
                execute(options,start);
            },
            
            bigMessage : function(e) {
                var options = $.extend({
                    e : e,
                    duration : 700,
                    interval : 5000,
                    onStart : false,
                    onFinish : false,
                    repeat : false,
                    color : false,
					scale : 0.7
                },settings);
                
				var css ={
                    position: "relative",
                    fontStyle: "monospace",
                    top: 0,
                    overflow: "hidden"
                };
				if(options.color) css.color = options.color;
				
				var message = $("<div></div>").text(e.text()).css(css);
				var container = $("<div></div>").css({
                        position:"fixed",
                        overflow:"hidden"
                }).append(message);
                var length = message.text().length;
				var du = options.duration*length;
				var sc = options.scale;
                var start = function(){
                    var bWidth = $(window).width();
                    var bHeight = $(window).height();
                    var fontSize = bHeight*sc;

					container.css({
                        top : (bHeight/2)-(fontSize/2),
                        width : bWidth,
                        height: fontSize
                    });

                    $(document.body).append(container);
                    message.css({
                        fontSize : fontSize+"px",
                        left : bWidth,
                        width : fontSize*length/2,
                        height: fontSize
					}).animate({
						left : -1*fontSize*length/2
					},{
						easing:"linear",
						duration: du,
						complete: function(){
							container.remove();
						}
					});
            };
                options.time = du;
                execute(options,start);
            }
		};
		
        return container.each(function(){  
            f[settings.mode]($(this));
        });
    };
  
})(jQuery);