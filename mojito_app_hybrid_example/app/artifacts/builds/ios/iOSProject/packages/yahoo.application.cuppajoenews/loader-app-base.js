YUI.add("loader-app",function(Y){Y.applyConfig({groups:{app:Y.merge(((Y.config.groups&&Y.config.groups.app)||{}),{modules:{"mojito":{"path":"/yahoo.application.cuppajoenews/mojito.js","requires":[]},"mojito-util":{"path":"/yahoo.application.cuppajoenews/mojito-util.js","requires":["array-extras","json-stringify","mojito"]},"mojito-view-renderer":{"path":"/yahoo.application.cuppajoenews/mojito-view-renderer.js","requires":["mojito"]},"mojito-action-context":{"path":"/yahoo.application.cuppajoenews/mojito-action-context.js","requires":["mojito","json-stringify","event-custom-base","mojito-view-renderer","mojito-util"]},"mojito-dispatcher":{"path":"/yahoo.application.cuppajoenews/mojito-dispatcher.js","requires":["mojito-action-context","mojito-util"]},"mojito-mojit-proxy":{"path":"/yahoo.application.cuppajoenews/mojito-mojit-proxy.js","requires":["mojito","mojito-util","querystring-parse","querystring-stringify"]},"mojito-output-handler":{"path":"/yahoo.application.cuppajoenews/mojito-output-handler.js","requires":["mojito","json-parse","node-base","node-event-delegate","node-pluginhost","node-screen","node-style"]},"mojito-route-maker":{"path":"/yahoo.application.cuppajoenews/mojito-route-maker.js","requires":["querystring-stringify-simple","querystring-parse","mojito-util"]},"mojito-client-store":{"path":"/yahoo.application.cuppajoenews/mojito-client-store.js","requires":["mojito-util","querystring-stringify-simple"]},"mojito-tunnel-client":{"path":"/yahoo.application.cuppajoenews/mojito-tunnel-client.js","requires":["mojito","io-base","json-stringify","json-parse"]},"mojito-client":{"path":"/yahoo.application.cuppajoenews/mojito-client.js","requires":["io-base","event-delegate","node-base","querystring-stringify-simple","mojito","mojito-dispatcher","mojito-route-maker","mojito-client-store","mojito-mojit-proxy","mojito-tunnel-client","mojito-output-handler","mojito-util"]},"yahoo_infinite_nav_binder_index":{"path":"/yahoo.application.cuppajoenews/yahoo_infinite_nav_binder_index.js","requires":["mojito-client","transition"]},"yahoo_infinite_nav_binder_loader":{"path":"/yahoo.application.cuppajoenews/yahoo_infinite_nav_binder_loader.js","requires":["mojito-client"]},"mojito-assets-addon":{"path":"/yahoo.application.cuppajoenews/mojito-assets-addon.js","requires":["mojito","mojito-util"]},"mojito-params-addon":{"path":"/yahoo.application.cuppajoenews/mojito-params-addon.js","requires":["mojito"]},"mojito-perf":{"path":"/yahoo.application.cuppajoenews/mojito-perf.js","requires":[]},"mojito-composite-addon":{"path":"/yahoo.application.cuppajoenews/mojito-composite-addon.js","requires":["mojito","mojito-util","mojito-perf","mojito-assets-addon","mojito-params-addon"]},"mojito-models-addon":{"path":"/yahoo.application.cuppajoenews/mojito-models-addon.js","requires":["mojito","mojito-util"]},"yahoo_infinite_nav":{"path":"/yahoo.application.cuppajoenews/yahoo_infinite_nav.js","requires":["mojito","addon-ac-shared_model_addon","mojito-models-addon","mojito-composite-addon"]},"infinitie_feed_binder_index":{"path":"/yahoo.application.cuppajoenews/infinitie_feed_binder_index.js","requires":["mojito-client","node-base","node-event-delegate","node-pluginhost","node-screen","node-style","transition","event-base","event-delegate","event-synthetic","event-mousewheel","event-mouseenter","event-key","event-focus","event-resize","event-hover","event-outside","event-touch","event-move","event-flick","event-valuechange","event-tap"]},"infinitie_feed_binder_selectTopics":{"path":"/yahoo.application.cuppajoenews/infinitie_feed_binder_selectTopics.js","requires":["mojito-client","node-base","node-event-delegate","node-pluginhost","node-screen","node-style"]},"infinitiefeedmodel":{"path":"/yahoo.application.cuppajoenews/infinitiefeedmodel.js","requires":["yql"]},"yahoo_hybrid_app_usermodel":{"path":"/yahoo.application.cuppajoenews/yahoo_hybrid_app_usermodel.js","requires":["cache-base","cache-offline","cache-plugin"]},"mojito-config-addon":{"path":"/yahoo.application.cuppajoenews/mojito-config-addon.js","requires":["mojito"]},"infinitiefeed":{"path":"/yahoo.application.cuppajoenews/infinitiefeed.js","requires":["mojito","yahoo_hybrid_app_usermodel","mojito-composite-addon","mojito-params-addon","mojito-config-addon","mojito-models-addon","infinitiefeedmodel"]},"LazyLoadBinderIndex":{"path":"/yahoo.application.cuppajoenews/LazyLoadBinderIndex.js","requires":["mojito-client","node-base","node-event-delegate","node-pluginhost","node-screen","node-style","json-parse","json-stringify"]},"LazyLoad":{"path":"/yahoo.application.cuppajoenews/LazyLoad.js","requires":["mojito","mojito-composite-addon","mojito-params-addon","json-parse","json-stringify"]},"mojito-meta-addon":{"path":"/yahoo.application.cuppajoenews/mojito-meta-addon.js","requires":["mojito-util"]},"mojito-analytics-addon":{"path":"/yahoo.application.cuppajoenews/mojito-analytics-addon.js","requires":["mojito","mojito-util","mojito-meta-addon"]},"mojito-cookie-addon":{"path":"/yahoo.application.cuppajoenews/mojito-cookie-addon.js","requires":["cookie","mojito","mojito-meta-addon"]},"mojito-intl-addon":{"path":"/yahoo.application.cuppajoenews/mojito-intl-addon.js","requires":["intl","datatype-date-parse","datatype-date-format","datatype-date-math","mojito","mojito-util","mojito-config-addon"]},"mojito-partial-addon":{"path":"/yahoo.application.cuppajoenews/mojito-partial-addon.js","requires":["mojito-util","mojito-params-addon","mojito-view-renderer"]},"mojito-url-addon":{"path":"/yahoo.application.cuppajoenews/mojito-url-addon.js","requires":["mojito-config-addon","mojito-route-maker","querystring-parse-simple","mojito-util"]},"mojito-hb":{"path":"/yahoo.application.cuppajoenews/mojito-hb.js","requires":["io-base","handlebars-compiler"]},"mojito-mu":{"path":"/yahoo.application.cuppajoenews/mojito-mu.js","requires":["mojito-util","io-base"]},"mojito-test":{"path":"/yahoo.application.cuppajoenews/mojito-test.js","requires":["mojito"]},"mojito-rest-lib":{"path":"/yahoo.application.cuppajoenews/mojito-rest-lib.js","requires":["io-base","querystring-stringify-simple","mojito"]},"loader-app":{"path":"/yahoo.application.cuppajoenews/loader-app.js","requires":[]},"loader-app-base":{"path":"/yahoo.application.cuppajoenews/loader-app-base.js","requires":[]},"loader-app-resolved":{"path":"/yahoo.application.cuppajoenews/loader-app-resolved.js","requires":[]},"loader-yui3-base":{"path":"/yahoo.application.cuppajoenews/loader-yui3-base.js","requires":[]},"loader-yui3-resolved":{"path":"/yahoo.application.cuppajoenews/loader-yui3-resolved.js","requires":[]}}})}});},"",{requires:["loader-base"]});