var FormControls=function(){
  var e=function(){
    $("#coachingForm").validate(
      {
        rules:
        {
          name:{
            required:!0
          },
          frontend:{
            required:!0
          },
          backend:{
            required:!0
          },
          database:{
            required:!0
          },
          remarks:{
            required:!0
          },
          frontendlevel:{
            required:!0
          },
          backendlevel:{
            required:!0
          },
          databaselevel:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#coaching_form_msg");
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
