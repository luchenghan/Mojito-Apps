YUI.add("device-events",function(b){var a=b.config.doc;b.DeviceEvents={deviceready:function(){b.fire("jsbridgeready");},pause:function(){b.fire("background");},resume:function(){b.fire("foreground");}};if(a.addEventListener){b.each(b.DeviceEvents,function(d,c){a.addEventListener(c,d,false);});}},"@VERSION@",{requires:["event-custom"]});