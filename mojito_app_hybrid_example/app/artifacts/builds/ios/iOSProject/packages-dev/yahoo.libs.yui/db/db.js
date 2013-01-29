YUI.add('db', function (Y, NAME) {

/**
 * The implementation of the DB Store API for SQL DBs. This class is mixed
 * into the `DB` class, and the `DB.Transaction` class when sitting on top of
 * SQL Databases.
 *
 * @class SQL
 * @namespace DB
 * @module db
 * @static
 */

function SQL() {}

var TEMPLATES,
    CONSTRAINTS;

TEMPLATES = SQL._TEMPLATES = {

    CREATE_TABLE : 'CREATE TABLE IF NOT EXISTS {storeId} ({schema});',
    DROP_TABLE : 'DROP TABLE IF EXISTS {storeId};',
    
    UPDATE : 'UPDATE {storeId} SET {updates};',
    UPDATE_WHERE : 'UPDATE {storeId} SET {updates} WHERE {selector};',
    
    SELECT : 'SELECT {keys} from {storeId};',
    SELECT_WHERE : 'SELECT {keys} from {storeId} WHERE {selector};',

    DELETE : 'DELETE FROM {storeId};',
    DELETE_WHERE : 'DELETE FROM {storeId} WHERE {selector};',

    INSERT : 'INSERT INTO {storeId} ({keys}) VALUES ({values});'
};

CONSTRAINTS = SQL._CONSTRAINTS = {
    primary: 'PRIMARY KEY',
    required: 'NOT NULL'
};

SQL.prototype = {

    /**
     * Add a new store to the database.
     *
     *     dbOrTx.addStore("cars", {
     *         brand: '',
     *         model: {
     *             asc: true,
     *             text: true
     *         },
     *         year: {
     *             number: true    
     *         },
     *         id: {
     *             primary: true,
     *             required: true
     *         }
     *     },
     *
     *     // Only supports one at a time currently. This sucks. Will Fix.
     *     [{brand:"Honda", model: "Civic", year:2012, id:"hc12"}],
     *
     *     function(o) {
     *         var addedTable = true;       
     *     },
     * 
     *     function(o) {
     *         var err = o.code + ", " + o.message; 
     *     });
     *
     * @method addStore
     * @param {String} storeId A unique identifier for the store.
     * @param {Object} schema The schema to apply to the new store.
     * @param {Object} data The data to populate the store with. 
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    addStore: function(storeId, schema, data, success, failure) {

        var addSuccess = success,

            sql = Y.substitute(TEMPLATES.CREATE_TABLE, {
                storeId : storeId,
                schema : this._parseSchema(schema)
            });

        if (data) {
            addSuccess = function(o) {
                this.addObjects(storeId, data, success, failure);
            };
        }

        this.executeSql(sql, null, addSuccess, failure);
    },

    /**
     * Remove a store from database.
     *
     *       dbOrTx.removeStore("cars", function(o) {
     *           var removed = true;
     *       },
     *       function(o) {
     *           var err = o.code + ", " + o.message;     
     *       });
     *
     * @method removeStore
     * @param {String} storeId The unique identifier for the store.
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    removeStore: function(storeId, success, failure) {

        var sql = Y.substitute(TEMPLATES.DROP_TABLE, {
            storeId : storeId
        });

        this.executeSql(sql, null, success, failure);
    },

    /**
     * Add objects to the given store.
     *
     *     // Only supports one at a time currently. This sucks. Will Fix.
     *
     *     dbOrTx.addObjects("cars", [{
     *         brand: 'Honda',
     *         model: 'Civic',
     *         year: 2012
     *         id: 'hc12'
     *     }], function(o) {
     *         var carsAdded = o.rowsAffected;
     *     }, function(o) {
     *         var err = o.code + ", " + o.message;
     *     });
     *
     * @method addObjects
     * @param {String} storeId The unique identifier for the store.
     * @param {Object} objs The objects to add. 
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    addObjects: function(storeId, objs, success, failure) {
        this.executeSql(this._objs2sqlInsert(storeId, objs).join(''), null, success, failure);
    },

    /**
     * Get objects from the given store.
     *
     *     dbOrTx.getObjects("cars", {
     *   
     *         brand: "Honda", // Implies AND. Richer syntax coming soon.
     *         model: "Civic"
     *
     *     }, function(o) {
     *   
     *         var foundCars = o.result,
     *             i, car, brand, model, year;
     *
     *         for (i = 0; i < foundCars.length; i++) {
     *
     *            car = foundCars[i];
     *            brand = car.brand;
     *            model = car.model;
     *            year = car.year;
     *
     *         }
     *
     *     }, function(o) {
     *         var err = o.code + ", " + o.message;
     *     });
     *
     * @method getObjects
     * @param {String} storeId The unique identifier for the store.
     * @param {Object} selector The keys used to retrieve the objects.
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    getObjects: function(storeId, selector, success, failure) {

        // TODO: fields - Is this something we can even do/makes sense for noSQL?
        // TODO: Signature needs to support opts used to get back stepped results, vs all results, when supported

        var sql;

        // if (!opts.stepped) {

        if (selector) {
            sql = Y.substitute(TEMPLATES.SELECT_WHERE, {
                storeId : storeId,
                keys : "*",
                selector : this._parseSelector(selector)
            });
        } else {
            sql = Y.substitute(TEMPLATES.SELECT, {
                storeId : storeId,
                keys : "*"
            });
        }

        this.executeSql(sql, null, success, failure);

        /*
        }

        else {

            // Next Sprint? Maybe post 1.0.
            invokeMethod(dbHandle, "exectuteSQL", {
                query:
                parameters:
                stepped: queryHandle
            }, success(o) {
                o.getResult();
            });

            // 1.0
            - Create Transaction
            - Hold onto Transaction Id
            - Create tQuery from Transaction, DB
            - Execute getResults against tQuery, multiple times
            - destroyHandle for tQuery, tTransaction when done (when are we done?)
        }
        */
    },

    /**
     * Update objects in the given store.
     *
     *     dbOrTx.updateObjects("cars", {
     *         year : "2012"   
     *     }, {
     *         brand : "Honda",  // Implies AND. Richer syntax support coming soon.
     *         model : "Civic"    
     *     }, function(o) {
     *         var carsUpdated = o.rowsAffected;
     *     }, function(o) {
     *         var err = o.code + ", " + o.message;
     *     });
     *
     * @method updateObjects
     * @param {String} storeId The unique identifier for the store.
     * @param {Object} data The data to update the store with. 
     * @param {Object} selector The keys use to find the objects to update.
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    updateObjects: function(storeId, data, selector, success, failure) {
        var sql;

        if (selector) {
            sql = Y.substitute(TEMPLATES.UPDATE_WHERE, {
                storeId : storeId,
                updates : this._objs2sqlUpdate(data),
                selector : this._parseSelector(selector)
            });
        } else {
            sql = Y.substitute(TEMPLATES.UPDATE, {
                storeId : storeId,
                updates : this._objs2sqlUpdate(data)
            });
        }

        this.executeSql(sql, null, success, failure);
    },

    /**
     * Remove objects from the given store.
     *
     *     dbOrTx.removeObjects("cars", {
     *         brand: "Honda", // Implies AND. Richer syntax coming soon.
     *         model: "Civic"
     *     }, function(o) {
     *         var removedCount = o.result.rowsAffected;
     *     }, function(o) {
     *         var err = o.code + ", " + o.message;
     *     });
     *
     * @method removeObjects
     * @param {String} storeId The unique identifier for the store.
     * @param {Object} selector The keys use to find the objects to remove.
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    removeObjects: function(storeId, selector, success, failure) {
        var sql;

        if (selector) {
            sql = Y.substitute(TEMPLATES.DELETE_WHERE, {
                storeId : storeId,
                selector : this._parseSelector(selector)
            });
        } else {
            sql = Y.substitute(TEMPLATES.DELETE, {
                storeId : storeId
            });
        }

        this.executeSql(sql, null, success, failure);
    },

    /**
     * Low level SQL execution method which sits below the `getObjects`, `addObjects` etc. sugar APIs.
     *
     * This can be invoked directly if you need to do something which the sugar methods don't expose,
     * however it means your code won't port across SQL and noSQL DBs.
     *
     *     dbOrTx.executeSQL("select brand, model, year from cars", null, function(o) {
     *
     *        var selected = o.result, 
     *            car, i, brand;
     *
     *        for (i = 0; i < selected.length; i++) {
     *            car = selected[i];
     *            brand = car.brand;
     *        }
     *
     *     }, function(o) {
     *        var err = o.code + ", " + o.message;    
     *     });
     *
     * @method executeSQL
     * @param sql {String} The sql string to execute
     * @param [parameters] {Array} The list of parameter values (in order of appearance) to be passed to applied to the sql string.
     * @param success {Function} Invoked on successful execution of the SQL statement.
     * @param failure {Function} Invoked if the SQL statement execution failed.
     */
    executeSql: function(sql, parameters, success, failure) {

        // TODO: Remove once parameters is optional in IDL
        parameters = parameters || [];

        this._invoke('executeQuery', {
            query: sql,
            parameters: parameters
        },  success, failure);

    },

    _objs2sqlUpdate: function(data) {
        var query = '',
            key,
            i,
            len = data.length;

        for (key in data) {
            if (data.hasOwnProperty(key)) {
                query += (query) ? ', ' : '';
                query += key + '="' +
                data[key].replace(/\"/g, '\\') + '"';
            }
        }
        return query;
    },

    _objs2sqlInsert: function(storeId, data) {
        var query = [],
            fields,
            values = '',
            key,
            i,
            len = data.length;

        for (i = 0; i < len; i++) {
            fields = '';
            values = '';

            for (key in data[i]) {
                if (data[i].hasOwnProperty(key)) {
                    fields += (fields === '' ? '' : ', ') + key;
                    values += (values == '' ? '' : ', ') + '"' + data[i][key].replace(/\"/g, '\\') + '"';
                }
            }

            query.push(Y.substitute(TEMPLATES.INSERT, {
                storeId : storeId,
                keys : fields,
                values : values
            }));
        }

        return query;
    },

    _parseSelector: function(selector) {
        var key,
            query = '';

        for (key in selector) {
            if (selector.hasOwnProperty(key)) {
                query += key + '="' + String(selector[key]).replace(/\"/g, '\\') + '"';
            }
        }

        return query;
    },

    _parseSchema: function(schema) {
        //schema = schema || this._options.schema[schema];

        var query = '',
            field,
            key,
            constraint,
            constraintVal;

        for (key in schema) {
            if (schema.hasOwnProperty(key)) {
                query += (query === '' ? '' : ', ') + key;
                for (constraint in schema[key]) { // field
                    if (schema[key].hasOwnProperty(constraint)) { // constraint
                        constraintVal = schema[key][constraint];
                        if (typeof constraintVal == 'boolean') { // just dump uppercase key
                            query += ' ' + (CONSTRAINTS[constraint] || constraint.toUpperCase());
                        } else { // include value TODO: support function, regex, etc?
                            query += ' ' + (CONSTRAINTS[constraint] || constraint.toUpperCase() + ' ' +
                                constraintVal);
                        }
                    }
                }
            }
        }

        return query;
    },

    _serviceId : 'sSQLite'
};
/**
 * Provides an asynchronous database interface, along with a SQL implementation and transaction
 * implementation. 
 *
 * TODO: Once the implementation of noSQL is done, we'll break out both the SQL and noSQL implementations
 * into an optional modules, loaded based on the environment.
 *
 * @module db
 * @main
 */

/**
 * The DB class provides interfaces for working with asynchronous datastores, by providing
 * an object representing a connection to the named DB. 
 * 
 *      var db = new Y.DB({
 *          name: 'users',
 *          displayName: 'Application Users',
 *          version: 1,
 *          on : {
 *
 *              success: function(db) { 
 *                  // Opened DB connection. It's version 1.
 *
 *                  // Regular read/write operations - either on the DB or in a transaction.
 *
 *                  db.addObjects(...);
 *                  db.getObjects(...);
 *
 *                  var tx = db.transaction(..., function() {
 *                      tx.addObjects(...);
 *                      tx.commit(...);
 *                  });
 *              },
 *
 *              failure: function(o) { 
 *                  // Failed to open DB with the schema version specified
 *                  var err = o.message;
 *              },
 *
 *              upgrade: function(upgradeTx) { 
 *
 *                  // Add/Remove/Update tables, to reflect the new schema
 *                  // The above success handler will be called if upgrade transaction
 *                  // was committed successfully. 
 *                  
 *                  upgradeTx.addStore(...);
 *                  upgradeTx.removeStore(...);
 *                  upgradeTx.commit(...);
 *              }
 *          }
 *      });
 *
 * @class DB
 * @extends Handle
 * @constructor
 * @uses DB.SQL
 * @param {Object} config An object containing any of the following fields:
 * <dl>
 *     <dt>name {String}</dt>
 *     <dd>The unique name for the DB, within the current context</dd>
 *
 *     <dt>displayName {String}</dt>
 *     <dd>The display name for the DB</dd>
 *
 *     <dt>version {Int}</dt>
 *     <dd>The schema version of the DB required. If the existing DB does not match this version, the upgrade callback will be invoked, else if successfully
 *     opened, the success callback will be invoked. The success callback will also be invoked after the upgrade transaction has been successfully committed.
 *     </dd>
 *
 *     <dt>on</dt>
 *     <dd>
 *        Callbacks, for success, failure or upgrade.
 *        <ul>
 *           <li>`success(db)`. Receives the DB instance as the only argument.</li>
 *           <li>`failure(o)`. Receives the standard error object as the only argument, with message and id properties.</li>
 *           <li>`upgrade(upgradeTx)`. Receives an upgrade transaction as the only argument. This transaction will block any other transactions on the DB connection, until it's committed. 
 *           The transaction should be used to updated the schema (add/remove objects). The success handler above will be invoked when the upgrade transaction is successfully committed.</li>
 *        </ul>
 *     </dd>
 * </dl>
 */
function DB() {
    this.init.apply(this, arguments);
}

Y.extend(DB, Y.Handle, {

    _tId : 'tDatabase',

    _options : {

        /**
         * @config name
         * @type {String}
         */
        name : '',

        /**
         * @config displayName
         * @type {String}
         */
        displayName : '',

        /**
         * @config version
         * @type {Number}
         */
        version : 0,

        /**
         * The location to store the database file.
         * 
         * Currently the only valid locations are 'SDCard' and 'InternalFlash'.
         *
         * For all other environments, this configuration is unused.
         *
         * TODO : Can we make this a little more generically usable, e.g. by also accepting file/dir paths? 
         *
         * @config [location]
         * @type {String}
         */
         location : ''
    },

    _events : {
        success : null,
        failure : null,
        upgrade : null
    },

    init : function(config) {

        /*  TODO: wait until we can fulfill upfront creation
        if (config && !('schema' in config)) { 
            this._options.schema = {};
        }
        */

        DB.superclass.init.call(this, config);
    },

    _initEvents : function(config) {

        DB.superclass._initEvents.call(this, config);

        this._wrap("success", this._onSuccess, true);
        this._wrap("upgrade", this._onUpgrade);
    },

    /**
     * Utility method to wrap the user provided callbacks with internal implementation code.
     *
     * @method _wrap
     * @private
     * @param cbName {String} The callback to wrap.
     * @param wrapper {Function} The wrapper function to register as the internal callback. It gets passed the callback arg as the first argument and
     * the user callback as the second argument.
     * @param always {Boolean} If we should always provide an internal callback - even if the user didn't provide one.
     */
    _wrap : function(cbName, wrapper, always) {
        var userCb = this._events[cbName],
            db = this;

        if (always || userCb) {
            this._events[cbName] = function(o) {
                wrapper.call(db, o, userCb);
            };
        }
    },

    /**
     * Internal _onSuccess callback, which does it's thing, and then
     * invokes the users success callback
     * @method _onSuccess
     * @private
     */
    _onSuccess : function(o, userSuccessCb) {

        if (userSuccessCb) {
            userSuccessCb(this);
        }
    },

    /**
     * Internal _onUpgrade callback, which sets up a new Upgrade Transaction,
     * and passes it to the users upgrade callback, to execute upgrade schema
     * updates against.
     *
     * @method _onSuccess
     * @private
     * @param o {Object} Payload from the service, with the connectionId
     * @param userUpgradeCb {Function} User callback
     */
    _onUpgrade : function(o, userUpgradeCb) {

        var tx = this._upgradeTransaction(function(o) {
            userUpgradeCb(tx);
        }, function() {
            if (this._events.failure) {
                this._events.failure(o);
            }
        });

    },

    /**
     * @method _upgradeTransaction
     * @private
     * @return {DB.Transaction} A new upgrade transaction object, which is passed to the user's upgrade callback
     */
    _upgradeTransaction : function(success, failure) {
        return new DB.Transaction({
            db: this,
            type: "upgrade",
            on: {
                success: success,
                failure: failure
            }
        });
    },

    /**
     * Returns a new transaction object bound to this DB. 
     * The user is responsible for committing or rolling back the transaction.
     * There is currnetly no auto-commit or rollback support.
     *
     *     var tx = db.transaction(function(tx) {
     *         tx.addObjects(...);
     *     })
     *
     * @method transaction
     * @return {DB.Transaction} A new transaction object
     * @param success {Function} The success callback.
     * @param failure {Function} The failure callback.
     */
    transaction : function(success, failure) {
        return new DB.Transaction({
            db: this,
            on: {
                success: success,
                failure: failure
            }
        });
    }
});

Y.DB = DB;

// TODO: Repackage db-sql.js separately
Y.mix(Y.DB.prototype, SQL.prototype, true);
/**
 * The constructor for the transaction class.
 *
 * This should not be instantiated directly by the end user. Use the `db.transaction()` 
 * factory method to obtain transactions bound to a specific DB instance.
 *
 * @class Transaction
 * @namespace DB
 * @constructor
 * @private
 * @uses DB.SQL
 * @module db
 * @param {DB} db The DB instance the transaction should be bound to.
 */
function Transaction() {
    this.init.apply(this, arguments);
}

Y.extend(Transaction, Y.Handle, {

    _tId : 'tTransaction',

    _options : {
        connectionId: null,

        // To get around IDL not accepting type:null. 
        // Ideally we shouldn't even pass a type, if it's not provided (or in general optional options). 
        // TODO: Needs Handle update for this since currently it passes all options.
        type: ""
    },

    _events : {
        success : null,
        failure : null
    },

    init : function(config) {

        this.db = config.db;

        config.connectionId = this.db._handleId;

        Transaction.superclass.init.call(this, config);
    },

    _initEvents : function(config) {
        DB.superclass._initEvents.call(this, config);

        this._wrap("success", this._onSuccess);
    },

    /**
     * Utility method to wrap the user provided callbacks with internal implementation code.
     *
     * @method _wrap
     * @private
     * @param cbName {String} The callback to wrap.
     * @param wrapper {Function} The wrapper function to register as the internal callback. It gets passed the callback arg as the first argument and
     * the user callback as the second argument.
     * @param always {Boolean} If we should always provide an internal callback - even if the user didn't provide one.
     */
    _wrap : function(cbName, wrapper, always) {
        var userCb = this._events[cbName],
            tx = this;

        if (always || userCb) {
            this._events[cbName] = function(o) {
                wrapper.call(tx, o, userCb);
            };
        }
    },

    /**
     * Internal _onSuccess callback, which does it's thing, and then
     * invokes the users success callback
     *
     * @method _onSuccess
     * @private
     */
    _onSuccess : function(o, userSuccessCb) {
        // We want the user callback to get the transaction object,
        // not the service payload - o.transactionId - which isn't really useful
        userSuccessCb(this);
    },

    /**
     * Commit changes made in this transaction. This can only be called once per transaction.
     *
     * @method commit
     * @param success {Function} Invoked if the commit() completed successfully
     * @param failure {Function} Invoked if the commit() failed to commit the transaction.
     */
    commit : function(success, failure) {
        this._invoke("commit", null, success, failure);
    },

    /**
     * Rollback changes made in this transaction. This can only be called once per transaction.
     *
     * @method rollback
     * @param success {Function} Invoked if the commit() completed successfully
     * @param failure {Function} Invoked if the commit() failed to commit the transaction.
     */
    rollback : function(success, failure) {
        this._invoke("rollback", null, success, failure);
    }

});

Y.mix(Transaction.prototype, SQL.prototype, true);

Y.DB.Transaction = Transaction;
function ResultSet() {
    this.init.apply(this, arguments);
}

/**
 * Provides an API for dealing with large result sets.
 * 
 * @class ResultSet
 */
Y.extend(ResultSet, Y.Handle, {

    _serviceId: 'sResultSet',
    _tId: 'tResultSet',

    _options: {
        transactionId: null,
        connectionId: null
    },

    _events: {
        success: null,
        failure: null
    },

    init: function(config) {
        var options = {};

        // connectionId is required, transactionId is optional.
        if (config.transaction) { // try transaction first
            options.transactionId = config.transaction._handleId;
            // a tranasaction requires a db, so grab connectionId from there
            options.connectionId = config.transaction.db._handleId;
        } else { // if no transaction, a db reference is required
            options.connectionId = config.db._handleId;
        }

        this._connectionId = options.connectionId;
        this._transactionId = options.transactionId;

        ResultSet.superclass.init.call(this, options);
    },

    /**
     * Get the total number or keys in the RecordSet instance.
     *
     * @method getKeyCount
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     *      @param {String} success.result.count  The number of keys in the
     *      ResultSet instance.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    getKeyCount: function(success, failure) {
        this._invoke('getColumnCount', null, success, failure);
    },

    /**
     * Get the next N number of results.
     *
     * @method next
     * @param {Number} count The number of results to include 
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     *      @param {Array} success.result.result  The next set of results.
     *      @param {Boolean} success.result.done  Whether or not this is the final
     *      set of results.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    next: function(count, success, failure) {
        this._invoke('next', {count: count}, success, failure);
    },

    /**
     * Skip over the next N number of results.
     *
     * @method skip
     * @param {Number} count The number of results to include 
     * @param {Function} success The callback to run when the call succeeds.
     *  @param {Object} success.result The argument passed to the success callback.
     *      @param {Array} success.result.result  The next set of results.
     *      @param {Boolean} success.result.done  Whether or not this is the final
     *      set of results.
     * @param {Function} [failure] The callback run when the call fails.
     *  @param {Object} failure.error The argument passed to the failure callback.
     *      @param {Number} failure.error.code The error code.
     *      @param {String} failure.error.message A message explaining the error.
     *      @param {Object} failure.error.detail Additional error information.
     * @return {String} The invocationId returned from the bridge.
     */
    skip: function(count, success, failure) {
        this._invoke('skip', {count: count}, success, failure);
    }

    /* TODO: should this be part of the service API?
     * If not, how should we unit test?
    each : function(success, failure) {

        var _success = function(o) {

            success(o.items[0]);

            if (!o.done) {
                this.next(1, _success, failure);
            }
        }

        this.next(1, _success, failure);
    }
    */

});

Y.DB.ResultSet = ResultSet;


}, '@VERSION@', {"requires": ["handle", "substitute"]});
