var FormControls = function () {
  var e = function () {
    $("#belowForm")
      .validate(
      {

        rules:
        {
          admin_remarks: {
            required: !0
          },
          cstart: {
            required: !0
          },
          cendo:{
            required: !0
          },
          reservedManday:{
            required: !0,
            number: !0
          }
        },
        invalidHandler: function (e, r) {
          var i = $("#below_form_msg");
          i.removeClass("m--hide")
            .show()
        },
        submitHandler: function (e) {

        }
    }),
    $("#activityForm")
      .validate(
      {

        rules:
        {
          name:{
            required:!0
          },
          place:{
            required:!0
          },
          start:{
            required:!0
          },
          endo:{
            required:!0
          },
          attendance:{
            required:!0
          }
        },
        invalidHandler: function (e, r) {
          var i = $("#activity_form_msg");
          i.removeClass("m--hide")
            .show()
        },
        submitHandler: function (e) {

        }
    })
  };

  return {
    init: function () {
      e()
    }
  }
}();
jQuery(document)
  .ready(function () {
    FormControls.init()
  });