var FormControls=function(){
  var e=function(){
    $("#projectForm").validate(
      {
        rules:
        {
          id:{
            required:!0
          },
          
          name:{
            required:!0
          },
          
          tech:{
            required:!0
          },
          role:{
            required:!0
          },
          duration:{
            required:!0
          },
          description:{
            required:!0
          },
          type:{
            required:!0
          }
          
          
          

        },
        invalidHandler:function(e,r){
          var i=$("#project_form_msg");
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
