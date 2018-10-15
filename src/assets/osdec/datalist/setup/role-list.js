var DefaultDatatableDemo = function() {
    var t = function() {
        var t = {
                data: {
                  type: "remote",
                  source: {
                      read: {
                          url: "http://localhost:8080/api/role/list",
                          headers: {
                                      "Authorization": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6IndlYiIsImV4cCI6MTUxNTE1NzQ0MywiaWF0IjoxNTE0NTUyNjQzfQ.XUkGJWvqd8-PdpNb784omwpFJJQPETd8CuyVkXhvRQXTrFY-ATLJok9Yv_IVs-y6mJls83s31rISYl419sjJMQ"
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
                  field: "user",
                  title: "Nama",
                  sortable: "asc",
                  filterable: !1,
                  width: 150,
                  template : function(row){
                    return row.user.name
                  }
              }, {
                  field: "agency",
                  title: "Agensi",
                  width: 150,
                  template : function(row){
                    return row.user.agency.name
                  }
              }, {
                  field: "Emel",
                  title: "Emel",
                  sortable: !1,
                  template : function(row){
                    return row.user.email
                  }
              }, {
                  field: "Peranan",
                  title: "Peranan",
                  width: 100,
                  template : function(row){
                    return row.authority.rolename
                  }
              }, {
                  field: "status",
                  title: "Status",
                  template : function(row){
                    var status = row.status;
                    if(status === 'NEW'){
                      status = '<span class="m-badge m-badge--primary m-badge--wide">Permohonan Baru</span>';
                    }else if(status === 'REJECT'){
                      status = '<span class="m-badge m-badge--danger m-badge--wide">Ditolak</span>';
                    }else if(status === 'APPROVE'){
                      status = '<span class="m-badge m-badge--success m-badge--wide">Lulus</span>';
                    }
                    return status;
                  }
              },{
                  field: "Actions",
                  width: 110,
                  title: "Actions",
                  sortable: !1,
                  overflow: "visible",
                  template: function(t) {

                    var html = '<a href="/role/application/approval/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Edit details">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>'+
                    '\t\t\t\t\t\t<button id="'+t.id+'" class="approveFn m-portlet__nav-link btn m-btn m-btn--hover-success m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Delete">\t\t\t\t\t\t\t<i class="la la-check"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'+
                    '\t\t\t\t\t\t<button id="'+t.id+'" class="rejectFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-times"></i>\t\t\t\t\t\t</button>\t\t\t\t\t';

                      return html;
                  }
              }]
            },
            e = $(".m_datatable").mDatatable(t),
            a = e.getDataSourceQuery();
        $("#m_form_search").on("keyup", function(t) {
            var a = e.getDataSourceQuery();
            a.generalSearch = $(this).val().toLowerCase(), e.setDataSourceQuery(a), e.load()
        }).val(a.generalSearch), $("#m_form_status, #m_form_type").selectpicker(), $("#m_datatable_destroy").on("click", function() {
            e.destroy()
        }), $("#m_datatable_init").on("click", function() {
            e = $(".m_datatable").mDatatable(t)
        }), $("#m_datatable_reload").on("click", function() {
            e.reload()
        }), $("#m_datatable_sort").on("click", function() {
            e.sort("ShipCity")
        }), $("#m_datatable_get").on("click", function() {
            var t = e.setSelectedRecords().getColumn("id").getValue();
            "" === t && (t = "Select checbox"), $("#datatable_value").html(t)
        }), $("#m_datatable_check").on("click", function() {
            var t = $("#m_datatable_check_input").val();
            e.setActive(t)
        }), $("#m_datatable_check_all").on("click", function() {
            e.setActiveAll(!0)
        }), $("#m_datatable_uncheck_all").on("click", function() {
            e.setActiveAll(!1)
        })
    };
    return {
        init: function() {
            t()
        }
    }
}();
jQuery(document).ready(function() {
  alert("test");
    DefaultDatatableDemo.init()
});
