var Autosize = function() {
    var t = function() {
        var t = $(".m_autosize")
        autosize(t)
    };
    return {
        init: function() {
            t()
        }
    }
}();
jQuery(document).ready(function() {
    Autosize.init()
});
