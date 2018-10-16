var DatatableRemoteAjaxDemo = function() {
    var t = function() {
        var t = $(".m_datatable").mDatatable({
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: "http://keenthemes.com/metronic/preview/inc/api/datatables/demos/default.php"
                        }
                    },
                    pageSize: 10,
                    saveState: {
                        cookie: !0,
                        webstorage: !0
                    },
                    serverPaging: !0,
                    serverFiltering: !0,
                    serverSorting: !0
                },
                layout: {
                    theme: "default",
                    class: "",
                    scroll: !1,
                    footer: !1
                },
                sortable: !0,
                pagination: !0,
                columns: [{
                    field: "RecordID",
                    title: "#",
                    sortable: !1,
                    width: 40,
                    selector: !1,
                    textAlign: "center"
                }, {
                    field: "OrderID",
                    title: "Order ID",
                    filterable: !1,
                    width: 150,
                    template: "{{OrderID}} - {{ShipCountry}}"
                }, {
                    field: "ShipCountry",
                    title: "Ship Country",
                    width: 150,
                    template: function(t) {
                        return t.ShipCountry + " - " + t.ShipCity
                    }
                }, {
                    field: "ShipCity",
                    title: "Ship City"
                }, {
                    field: "Currency",
                    title: "Currency",
                    width: 100
                }, {
                    field: "ShipDate",
                    title: "Ship Date",
                    sortable: "asc",
                    type: "date",
                    format: "MM/DD/YYYY"
                }, {
                    field: "Latitude",
                    title: "Latitude",
                    type: "number"
                }, {
                    field: "Status",
                    title: "Status",
                    template: function(t) {
                        var e = {
                            1: {
                                title: "Pending",
                                class: "m-badge--brand"
                            },
                            2: {
                                title: "Delivered",
                                class: " m-badge--metal"
                            },
                            3: {
                                title: "Canceled",
                                class: " m-badge--primary"
                            },
                            4: {
                                title: "Success",
                                class: " m-badge--success"
                            },
                            5: {
                                title: "Info",
                                class: " m-badge--info"
                            },
                            6: {
                                title: "Danger",
                                class: " m-badge--danger"
                            },
                            7: {
                                title: "Warning",
                                class: " m-badge--warning"
                            }
                        };
                        return '<span class="m-badge ' + e[t.Status].class + ' m-badge--wide">' + e[t.Status].title + "</span>"
                    }
                }, {
                    field: "Type",
                    title: "Type",
                    template: function(t) {
                        var e = {
                            1: {
                                title: "Online",
                                state: "danger"
                            },
                            2: {
                                title: "Retail",
                                state: "primary"
                            },
                            3: {
                                title: "Direct",
                                state: "accent"
                            }
                        };
                        return '<span class="m-badge m-badge--' + e[t.Type].state + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + e[t.Type].state + '">' + e[t.Type].title + "</span>"
                    }
                }, {
                    field: "Actions",
                    width: 110,
                    title: "Actions",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t) {
                        return '\t\t\t\t\t\t<div class="dropdown ' + (t.getDatatable().getPageSize() - t.getIndex() <= 4 ? "dropup" : "") + '">\t\t\t\t\t\t\t<a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">                                <i class="la la-ellipsis-h"></i>                            </a>\t\t\t\t\t\t  \t<div class="dropdown-menu dropdown-menu-right">\t\t\t\t\t\t    \t<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\t\t\t\t\t\t    \t<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\t\t\t\t\t\t    \t<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\t\t\t\t\t\t  \t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</a>\t\t\t\t\t'
                    }
                }]
            }),
            e = t.getDataSourceQuery();
        $("#m_form_search").on("keyup", function(e) {
            var a = t.getDataSourceQuery();
            a.generalSearch = $(this).val().toLowerCase(), t.setDataSourceQuery(a), t.load()
        }).val(e.generalSearch), $("#m_form_status").on("change", function() {
            var e = t.getDataSourceQuery();
            e.Status = $(this).val().toLowerCase(), t.setDataSourceQuery(e), t.load()
        }).val(void 0 !== e.Status ? e.Status : ""), $("#m_form_type").on("change", function() {
            var e = t.getDataSourceQuery();
            e.Type = $(this).val().toLowerCase(), t.setDataSourceQuery(e), t.load()
        }).val(void 0 !== e.Type ? e.Type : ""), $("#m_form_status, #m_form_type").selectpicker()
    };
    return {
        init: function() {
            t()
        }
    }
}();
jQuery(document).ready(function() {
    DatatableRemoteAjaxDemo.init()
});
