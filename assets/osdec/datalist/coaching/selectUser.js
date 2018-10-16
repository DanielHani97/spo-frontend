var DefaultDatatableDemo = function() {
    var t = function() {
        var t = {
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: "http://localhost:8080/api/usergetall",
                            headers: {
                                "Authorization": this.bearToken
                             }
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
                    class: "",
                    scroll: !0,
                    height: 550,
                    footer: !1
                },
                sortable: !0,
                pagination: !0,
                columns: [{
                    field: "id",
                    title: "#",
                    width: 40,
                    textAlign: "center",
                    selector: {
                        class: "m-checkbox--solid m-checkbox--brand"
                    }
                    
                }, {
                    field: "name",
                    title: "Nama",
                    filterable: !1,
                    width: 150
                }, {
                    field: "email",
                    title: "Email",
                    width: 150
                }]
            },
            var datatable = $('.m_datatable').mDatatable(t);

        $("#m_datatable_get").on("click", function() {
            var t = datatable.setSelectedRecords().getColumn("id").getValue();
            "" === t && (t = "Select checbox"), $("#datatable_value").html(t)
        }), $("#m_datatable_check").on("click", function() {
            var t = $("#m_datatable_check_input").val();
            datatable.setActive(t)
            
        })
    };
    return {
        init: function() {
            t()
        }
    }
}();
jQuery(document).ready(function() {
    DefaultDatatableDemo.init()
});