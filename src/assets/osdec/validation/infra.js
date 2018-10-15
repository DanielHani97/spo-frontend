var FormControls=function(){
  var e=function(){
    $("#infraForm").validate(
      {
        rules:
        {
          remarks:{
            required:!0
          },
          
          os:{
            required:!0
          },
          
          vcpu:{
            required:!0
          },

          memori:{
            required:!0
          },

          rootDisk:{
            required:!0
          },

          ephemeralDisk:{
            required:!0
          },

          swapDisk:{
            required:!0
          },

          webServer:{
            required:!0
          },

          framework:{
            required:!0
          },

          persistentDisk:{
            required:!0
          },

          database:{
            required:!0
          },

          language:{
            required:!0
          },

          type:{
            required:!0
          }
          
          
          

        },
        invalidHandler:function(e,r){
          var i=$("#infra_form_msg");
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
