var FormControls=function(){
  var e=function(){
    $("#certForm").validate(
      {
        rules:
        {
          title:{
            required:!0
          },
          technology:{
            required:!0
          },
          remark:{
            required:!0
          },
          place:{
            required:!0
          },
          level:{
            required:!0
          },
          status:{
            required:!0
          },
          startDate:{
            required:!0
          },
          endDate:{
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
