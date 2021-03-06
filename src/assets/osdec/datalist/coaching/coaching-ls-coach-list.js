var DatatableRecordSelectionDemo = function() {
    var t = function() {
        var t = $(".m_datatable").mDatatable({
                data: {
                    type: "remote",
                    source: {
                        read: {
                            
                            url: "http://localhost:8080/api/coaching/coach/list"
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
                    scroll: !1,
                    height: 550,
                    footer: !1
                },
                sortable: !0,
                pagination: !0,
                columns: [{
                    field: "id",
                    title: "#",
                    sortable: !1,
                    width: 40,
                    textAlign: "center",
                    selector: {
                        class: "m-checkbox--solid m-checkbox--brand"
                    }
                }, {
                    field: "name",
                    title: "Nama",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.coaching.name;
                    }
                }, {
                    field: "agency",
                    title: "Agensi",
                    width: 150,
                    template: function(row){
                        return row.coaching.agency.code;
                    }
                }, {
                    field: "status",
                    title: "Status",
                    template: function(t) {
                        var newStatus = t.coaching.status;
                        var e = {
                            1: {
                                title: "Baharu",
                                class: "m-badge--brand"
                            },
                            2: {
                                title: "Val1",
                                class: " m-badge--metal"
                            },
                            3: {
                                title: "Val2",
                                class: " m-badge--primary"
                            },
                            4: {
                                title: "Approve",
                                class: " m-badge--success"
                            },
                            6: {
                                title: "Reject",
                                class: " m-badge--danger"
                            }
                        };
                        return '<span class="m-badge ' + e[newStatus].class + ' m-badge--wide">' + e[newStatus].title + "</span>"
                    }
                }, {
                    field: "attendance",
                    width: 110,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t){
                         return '<a href="/coaching/valuation/'+ t.coaching.id +'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Penilaian TEST">\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</a>\t\t\t\t\t'   
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
        }).val(void 0 !== e.Type ? e.Type : ""), $("#m_form_status, #m_form_type").selectpicker(), $(".m_datatable").on("m-datatable--on-check", function(e, a) {
            var l = t.setSelectedRecords().getSelectedRecords().length;
            $("#m_datatable_selected_number").html(l), l > 0 && $("#m_datatable_group_action_form").collapse("show")
        }).on("m-datatable--on-uncheck m-datatable--on-layout-updated", function(e, a) {
            var l = t.setSelectedRecords().getSelectedRecords().length;
            $("#m_datatable_selected_number").html(l), 0 === l && $("#m_datatable_group_action_form").collapse("hide")
        })
    };
    return {
        init: function() {
            t()
        }
    }
}();
jQuery(document).ready(function() {
    DatatableRecordSelectionDemo.init()
});
