YUI.add('transport', function(Y) {
    Y.Bridge = new Y.BridgeBase({type:"bell", url:"crt://bell"});
}, '@VERSION@' ,{requires:['bridge-bell']});
