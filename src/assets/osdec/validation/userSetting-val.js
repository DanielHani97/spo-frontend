var FormControls=function(){
  var e=function(){
    $("#settingForm").validate(
      {
        rules:
        {
          new_password: 
          {
            required:!0
          },
          old_password:{
            required:!0
          }
          
          
          
          
          

        },
        invalidHandler:function(e,r){
          var i=$("#setting_form_msg");
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
