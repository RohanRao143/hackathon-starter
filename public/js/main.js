$(document).ready(function() {

  // Place JavaScript code here...

    $("#update").click(function () {
        $(".sportForm").hide();
        $(".updateForm").show();
    });

    $("#updateServer").click(function (e) {

        e.preventDefault();
       var request= $.ajax({
            url:'/updatesport',
            type:'POST',
            data:{_csrf:$("#_csrf").val(),name:$("#name").val(),type:$("#type").val(),id:$("#id").val()}
        });

        request.done(function (msg) {

             $("#name1").html(msg.name);
             $("#type").html(msg.type);
             $(".updateForm").hide();
             $(".sportForm").show();

        });

      /*  $("button").click(function() {
            alert($(this).attr('id'))
        });
*//*
        function deletesport(x){
            alert(x);
        }
*/


    });




  /*  var buttons = document.getElementsByTagName("button");
    for(var i = 0; i <= buttons.length; i ++)
        $("button["+i+"]").click(function (e) {$(".show").hide()});
        /!*buttons[i].onclick = function(e) {
            alert(this.id);
        };*!/

*/




    // req.body = {name:1,type:2}
});