$(document).ready(function () {

    /*
    $('#bttnLogin').on('click',function () {
        var user=$.trim($("#username").val());
        if(user !=''){
            $.post("/service/login", { user:user} ,function(data){
                if(data.status=='Success'){
                    window.open('htmls/dashboard.html','_self')
                }
            });
        }else{
            alert("Please enter User Name")
        }


    })
    */


    $('#bttnLogin').on('click', function () {
        window.open('/dashboard', '_self')
    });


});


