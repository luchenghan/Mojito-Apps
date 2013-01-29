YUI.applyConfig({
    filter: ((window.location.search.match(/[?&]debug=([^&]+)/) || [])[1]) ? "debug" : "min",

    aliases : {
        "bridge" : ["transport"]
    },

    groups : {
        ychromelib : {
            base: "/yahoo.crt.lib/",
            modules : {
                "transport" : {
                    requires: ["bridge-bell"],
                    condition : {
                        trigger: "bridge-base"
                    }
                }
            }
        }
    }
});
