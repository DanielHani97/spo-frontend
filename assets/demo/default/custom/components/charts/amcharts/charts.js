var amChartsChartsDemo = function() {
    var e = function() {
            AmCharts.makeChart("graf_pembangunan", {
                type: "serial",
                theme: "light",
                dataProvider: [{
                    country: "USA",
                    visits: 2025
                }, {
                    country: "China",
                    visits: 1882
                }, {
                    country: "Japan",
                    visits: 1809
                }, {
                    country: "Germany",
                    visits: 1322
                }, {
                    country: "UK",
                    visits: 1122
                }, {
                    country: "France",
                    visits: 1114
                }, {
                    country: "India",
                    visits: 984
                }, {
                    country: "Spain",
                    visits: 711
                }, {
                    country: "Netherlands",
                    visits: 665
                }, {
                    country: "Russia",
                    visits: 580
                }, {
                    country: "South Korea",
                    visits: 443
                }, {
                    country: "Canada",
                    visits: 441
                }, {
                    country: "Brazil",
                    visits: 395
                }],
                valueAxes: [{
                    gridColor: "#FFFFFF",
                    gridAlpha: .2,
                    dashLength: 0
                }],
                gridAboveGraphs: !0,
                startDuration: 1,
                graphs: [{
                    balloonText: "[[category]]: <b>[[value]]</b>",
                    fillAlphas: .8,
                    lineAlpha: .2,
                    type: "column",
                    valueField: "visits"
                }],
                chartCursor: {
                    categoryBalloonEnabled: !1,
                    cursorAlpha: 0,
                    zoomable: !1
                },
                categoryField: "country",
                categoryAxis: {
                    gridPosition: "start",
                    gridAlpha: 0,
                    tickPosition: "start",
                    tickLength: 20
                },
                export: {
                    enabled: !0
                }
            })
        },
             
       
        };
    return {
        init: function() {
            e()
        }
    }
}();
jQuery(document).ready(function() {
    amChartsChartsDemo.init()
});