function getUrlParameter(sParam) {
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

function storeData(){
  var username = $('#username').val();
  var password = $('#password').val();
  sessionStorage.setItem("username", username);
  sessionStorage.setItem("password", password);
  document.location.href = 'index.html';
}



$(document).ready(function(){
          var code = getUrlParameter('code');
          var msg = getUrlParameter('msg');
          if (code==401){
            $('#DIVMSG').html('Unauthorized access! \n' + msg)
          }else{
            $('#DIVMSG').html(msg)
          }
    });
