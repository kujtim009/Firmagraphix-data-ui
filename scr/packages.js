$(document).ready(function(){
  const token = getToken();
  const rootIP = sessionStorage.getItem("rootIP")
  
  makeAjaxCall(rootIP + '/test', 'GET', getCredencialToken())
    .then((result)=>{
        console.log(result.message)
      })
    .catch((result)=>{
  
      const msg = 'Wrong username or password!';
      console.log("WRONG USERNAME OR PASSWORD", result.status)
  
    document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
  });

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
  const rootIP = sessionStorage.getItem("rootIP")
  console.log("ROOT IP:", rootIP);

  
  const credencials = getCredencialToken();
  console.log("GET CREDENCIALS TOKEN:", credencials);
  makeAjaxCall(rootIP + "/addUserCoins?pck_type=" + toString(num), "GET", credencials).then((result) => {
    var jsonData = JSON.stringify(result);
    data = $.parseJSON(jsonData);
    console.log(data.coins);
    console.log(data);
    getCoins();
    $('#loading-indicator').hide(); 
  } ).catch((result) => {
    writeerrors(result);
    $('#loading-indicator').hide();
  });
}
