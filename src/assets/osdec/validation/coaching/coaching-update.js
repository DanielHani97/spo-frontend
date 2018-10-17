var FormControls=function(){
  var e=function(){
    $("#activityForm").validate(
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
        invalidHandler:function(e,r){
          var i=$("#activity_form_msg");
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
