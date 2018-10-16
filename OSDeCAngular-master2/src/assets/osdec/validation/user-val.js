var FormControls=function(){
  var e=function(){
    $("#profileForm").validate(
      {
        rules:
        {
          name:{
            required:!0
          },
          username:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#profile_form_msg");
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
            FormControls.init();
          });
