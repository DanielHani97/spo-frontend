var FormControls=function(){
  var e=function(){
    $("#feedbackForm").validate(
      {
        rules:
        {
          question:{
            required:!0
          },
          category:{
            required:!0
          },
          program_type:{
            required:!0
          },
          answer:{
            required:!0
          },
          instance_id:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#feedback_form_msg");
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
