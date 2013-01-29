YUI.add('db-cursor', function(Y) {


function Cursor() {
    Cursor.superclass.init.apply(this, arguments);
}

Y.extend(Cursor, Y.Handle, {

    _serviceId : 'sDBCursor',

    _tId : 'tDBCursor',

    _options : {
        range: null,
        direction: 'next' // 'prev', 'nextunique', 'prevunique'
    },

    count : function(success, failure) {
        this._invoke('count', success, failure);
    },

    advance: function(count, success, failure) {
        this._invoke('advance', {count: count}, success, failure);
    },

    update: function(val, success, failure) {
        this._invoke('update', {value: val}, success, failure);
    },

    'continue': function(key, success, failure) {
        this._invoke('continue', {key: key}, success, failure);
    }
});

Y.DB.Cursor = Cursor;


}, '@VERSION@' ,{requires:['db', 'handle']});
