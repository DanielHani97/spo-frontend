var DatatableRecordSelectionDemo = function() {
    var t = function() {
        var t = $(".m_datatable").mDatatable({
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: "http://localhost:8080/api/training"
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
                    filterable: !1,
                    width: 150
                }, {
                    field: "technology",
                    title: "Teknologi",
                    width: 150
                }, {
                    field: "start_date",
                    title: "Tarikh Mula",
                    sortable: !1
                }, {
                    field: "duration",
                    title: "Tempoh Latihan",
                    width: 100
                }, {
                    field: "place",
                    title: "Tempat Latihan",
                    sortable: !1
                }, {
                    field: "Tahap",
                    title: "Tahap Kesukaran",
                    sortable: !1,
                    template: function (row){
                        var level = row.level;
                        if(level != null){
                            if(level == "BEGIN"){
                                return "Permulaan";
                            }else if(level == "INTER"){
                                return "Pertengahan";
                            }if(level == "EXP"){
                                return "Mahir";
                            }
                        }else{
                            return "";
                        }
                    }
                }, 
                {
                    field: "Status",
                    title: "Status",
                    template: function(t) {

                        var result = t.status;
                        if(result == "Aktif"){
                            return '<span class="m-badge m-badge--success m-badge--wide">Aktif</span>';
                        }else if(result == "Tidak Aktif"){
                            return '<span class="m-badge m-badge--danger m-badge--wide">Tidak Aktif</span>';
                        }


                    }
                },
                {
                    field: "Actions",
                    width: 110,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t) {
                        return '<a href="/training/edit/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kemaskini">\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Padam">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</a>\t\t\t\t\t'
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
