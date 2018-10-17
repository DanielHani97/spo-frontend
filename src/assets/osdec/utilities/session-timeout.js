var SessionTimeoutDemo = function() {
    var e = function() {
        $.sessionTimeout({
            title: "Session Timeout Notification",
            message: "Your session is about to expire.",
            keepAliveUrl: "http://keenthemes.com/metronic/preview/inc/api/session-timeout/keepalive.php",
            redirUrl: "/logout",
            logoutUrl: "/logout",
            warnAfter: 3e3,
            redirAfter: 10e3,
            ignoreUserActivity: !0,
            countdownMessage: "Redirecting in {timer} seconds.",
            countdownBar: !0
        })
    };
    return {
        init: function() {
            e()
        }
    }
}();
jQuery(document).ready(function() {
    SessionTimeoutDemo.init()
});
