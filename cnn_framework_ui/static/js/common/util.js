var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


$('#user').on('click',function(){
    window.open('/index.html','_self');
});


function showAlert(msg,type){

    if(type==undefined){
        type='alert-success';
    }else if(type=='success'){
        type='alert-success';
    }else if(type=='error'){
        type='alert-danger';
    }else if(type=='warning'){
        type='alert-warning';
    }else{
        type='success'
    }

    $('#alert-msg').html(msg);
    $('.alert').addClass(type);
    $('.alert').addClass('show');

    setTimeout(function(){
        $('.alert').removeClass("show");
        $('.alert').removeClass(type);
    },2000);
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}