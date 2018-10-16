var DatatableRecordSelectionDemo = function() {
    var t = function() {
        var t = $(".m_datatable").mDatatable({
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: "http://localhost:8080/api/training/user/list"
                        }
                    },
                    pageSize: 10,
                    saveState: {
                        cookie: false,
                        webstorage: false
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
                    field: "title",
                    title: "Nama Latihan",
                    width: 150,
                    template: function(row){
                        return row.training.title;
                    }
                }, {
                    field: "technology",
                    title: "Teknologi",
                    template: function(row){
                        return row.training.technology;
                    }
                }, {
                    field: "start_date",
                    title: "Tarikh Mula",
                    template: function(row){
                        return row.training.start_date;
                    }
                }, {
                    field: "duration",
                    title: "Tempoh Latihan",
                    template: function(row){
                        return row.training.duration;
                    }
                
                }, 
                {
                    field: "status",
                    title: "Status",
                    template: function(t) {
                        var newStatus = t.training.status;
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
                            5: {
                                title: "Reject",
                                class: " m-badge--danger"
                            }
                        };
                        return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + "</span>"
                    }
                }, 

                {
                    field: "Tindakan",
                    width: 110,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t) {
                        var e = {
                            1: {
                                title1: "/training/view/",
                                title2: "Lihat Maklumat",
                                class: "m-badge--brand"
                            },
                            2: {
                                title1: "/training/view/",
                                title2: "Lihat Maklumat",
                                class: " m-badge--metal"
                            },
                            3: {
                                title: "/training/view/",
                                title2: "Lihat Maklumat",
                                class: " m-badge--primary"
                            },
                            4: {
                                title: "/training/attendance/confirmation",
                                title2: "Kehadiran Latihan",
                                class: " m-badge--success"
                            },
                            5: {
                                title: "/training/view/",
                                title2: "Lihat Maklumat",
                                class: " m-badge--danger"
                            }
                        };
                        return '<a href="" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kehadiran">\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t'
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
