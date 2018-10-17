var FormControls=function(){
  var e=function(){
    $("#capForm").validate(
      {
        rules:
        {
          name:{
            required:!0
          },
          kepakaran:{
            required:!0
          },
          remarks:{
            required:!0
          },
          limitation:{
            required:!0,
            digits: true
          },
          starting_date:{
            required:!0
          },
          ending_date:{
            required:!0
          },
          status:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#cap_form _msg");
          i.removeClass("m--hide").show(),
          mApp.scrollTo(i,-200)
        },
        submitHandler:function(e){

        }}),
  $("#activityForm")
      .validate(
      {

        rules:
        {
          name:{
            required:!0
          },
          venue:{
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

        return{
          init:function(){
            e()
          }}
      }();
          jQuery(document).ready(function(){
            FormControls.init()
          });
