YUI.add('db-result', function(Y) {

    function Result(config) {
        this.init(config);
    }

    Result.prototype = {

        constructor: Result,

        init: function(config) {
            this.added = config.added || [];
            this.removed = config.removed || [];
            this._items = config.items || [];
        },

        added: null, // []
        removed: null, // []

        _items: null // []
    };

    Y.mix(Result.prototype, Y.ArrayList.prototype);

    // Hack
    Y.namespace("DB").Result = Result;


}, '@VERSION@' ,{requires:['arraylist']});
