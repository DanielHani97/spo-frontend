var FormControls=function(){
  var e=function(){
    $("#certForm").validate(
      {
        rules:
        {
          
          status:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#cert_form_msg");
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
