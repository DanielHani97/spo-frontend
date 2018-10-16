var FormControls=function(){
  var e=function(){
    $("#gradeForm").validate(
      {
        rules:
        {
          name:{
            required:!0
          },
          seniority:{
            required:!0
          },
          status:{
            required:!0
          }
        },
        invalidHandler:function(e,r){
          var i=$("#grade_form_msg");
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
