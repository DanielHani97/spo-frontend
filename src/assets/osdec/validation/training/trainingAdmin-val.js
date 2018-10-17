var FormControls=function(){
  var e=function(){
    $("#belowForm").validate(
      {
        rules:
        {
          admin_remarks:{
            required:!0
          },
          status:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#below_form_msg");
          i.removeClass("m--hide").show(),
          mApp.scrollTo(i,-200)
        },
        submitHandler:function(e){

        }})};

        return{
          init:function(){
            e()
          }}
      }();
          jQuery(document).ready(function(){
            FormControls.init()
          });
