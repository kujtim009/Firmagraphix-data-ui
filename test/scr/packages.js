$(document).ready(function(){
    
    authenticateUser();
    try{
      const username = sessionStorage.getItem("username");
      $('#user_name').html("Hi " + username);
      getCoins();
    }
    catch{
      $('#user_name').html("Processing...");
    }
    
  });


function addCoins(num){
  $('#loading-indicator').show();
  $.ajax({
      url: rootIP + '/addUserCoins?pck_type=' + num,
      type: 'GET',
      dataType: 'json',
      contentType:'application/json; charset=utf-8',
      headers: {
          "Authorization": 'Bearer ' + token.access_token },
      complete: function(result) {
      },
  
      success: function(result) {

        var jsonData = JSON.stringify(result);

        data = $.parseJSON(jsonData);
        console.log(data.coins);
        console.log(data);
        getCoins();
        $('#loading-indicator').hide();    
      },
  
      error: function(result) {
        writeerrors(result);
        $('#loading-indicator').hide();
      },
  });
}
