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
          },
          state:{
            required:!0
          },
          city:{
            required:!0
          },
          address:{
            required:!0
          },
          postcode:{
            required:!0,
            number: !0,
            minlength: 5,
            maxlength: 5
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
