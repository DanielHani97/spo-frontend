var FormControls=function(){
  var e=function(){
    $("#agencyForm").validate(
      {
        rules:
        {
          name:{
            required:!0
          },
          code:{
            required:!0
          },
          phoneNo:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#agency_form_msg");
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
