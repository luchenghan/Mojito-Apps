YUI.add('db-result-handle', function(Y) {


function ResultHandle() {
    ResultHandle.superclass.init.apply(this, arguments);
}

Y.extend(ResultHandle, Y.Handle, { // prototype members

    _serviceId: 'sDBResult',
    _tId: 'tDBResult',

    size: function(success, failure) {
        this._invoke('size', success, failure);
    },

    next: function(count, success, failure) {
        this.invoke('next', {count: count}, success, failure);
    },

    items: function(start, count, success, failure) {
        this.invoke('items', {start: start, count: count}, success, failure);
    }
});

Y.DB.ResultHandle = ResultHandle;


}, '@VERSION@' ,{requires:['db', 'handle']});
