"use strict";
try {
  let token = getToken();
} catch (error) {
  
}

let userCredencials = null;
let tokenData = {}

let getStoredCredencials = () => {
  // console.log("GET STORED CREDENCIALS");
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  const body = {
    "requestHeader": {},
    "requestBody": {
      "username": username,
      "password": password
    }
  };

  return body
}

$(document).ready(function(){
    // const rootIP = "https://firmagraphix-api.com";
    // let rootIP = "http://127.0.0.1:5000";
    let rootIP = "https://firmagraphix-api.com";
    sessionStorage.setItem("rootIP", rootIP);
    userCredencials = getStoredCredencials();
    
    // const rootIP = sessionStorage.getItem("rootIP")
    // console.log(userCredencials);
    const ajaxPromise = makeAjaxCall(rootIP + '/auth', 'POST', userCredencials);

    ajaxPromise.then(authenticateUser).catch((result)=>{
      const msg = 'Wrong username or password!';
      // console.log("WRONG USERNAME OR PASSWORD", result.status)
    
      // document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
    });

    ajaxPromise.then(()=>{
      // console.log("SECOND PROMISE EXECUTING")
      try{
        $('#user_name').html("Hi " + userCredencials.requestBody.username);
        
      }
      catch{
        $('#user_name').html("Processing...");
      }
    })
});





function authenticateUser(result) {
  console.log("authenticating! for user ", userCredencials.requestBody.username, result);
  
            if (result.access_token.length == 291){
                const access_token = result.access_token;
                const refresh_token = result.refresh_token;

                sessionStorage.setItem("access_token", access_token);
                sessionStorage.setItem("refresh_token", refresh_token);
                token = getToken();
                tokenData = getCredencialToken();

                rootIP = sessionStorage.getItem("rootIP");
                makeAjaxCall(rootIP + '/users', 'GET', tokenData).then((result)=>{
                    getAccessLevel(result);
                    
                    getAllowedLicenseTypes();
                    loadProffesions();
                    load_UserColumns();
                    
                    $('#user_name').html("Hi " + userCredencials.requestBody.username);
                }).catch( () =>console.log("REQUEST FAILD", result));
                return true;
            }
        }


function getAccessLevel(result){
  // console.log("GETTING ACCESS LEVEL");
  sessionStorage.setItem("access_level","");
  $('#firstLoader').show();
      const jsonData = JSON.stringify(result);
      const data = $.parseJSON(jsonData);
      $.each(data["Users"], function(a,b) {
          if (userCredencials.requestBody.username.toUpperCase() == b.username.toUpperCase()){
          sessionStorage.setItem("access_level",b.access_level);
        }
      });
}


  function logout(){
    $.post({
      url: rootIP + '/logout',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      dataType: 'json',
      headers: {
        "Authorization": 'Bearer ' + token.access_token },
      complete: function(result) {
        
      },
  
      success: function(result) {
        var msg = 'You are loged out!';
        sessionStorage.clear();
        document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
  
      },
      error: function(result) {
     
        var msg = 'Wrong username or password!';
        document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
      },
  });
  
  }