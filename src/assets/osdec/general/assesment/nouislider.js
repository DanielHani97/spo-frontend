var noUiSliderDemos = function() {
    var e = function() {
            var e = document.getElementById("limit-slider");
            noUiSlider.create(e, {
                connect: [!0, !1],
                tooltips: true,
                start: [0],
                step: 1,
                range: {
                    min: [0],
                    max: [100]
                },
                format: wNumb({
                    decimals: 0
                })
            });
            var n = document.getElementById("limit");
            e.noUiSlider.on("update", function(e, t) {
                n.value = e[t]
            }), n.addEventListener("change", function() {
                e.noUiSlider.set(this.value)
            })
        };
    return {
        init: function() {
            e()
        }
    }
}();
jQuery(document).ready(function() {
    noUiSliderDemos.init()
});
