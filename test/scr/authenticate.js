var token = getToken();

function authenticateUser() {
    var username = sessionStorage.getItem("username");
    var password = sessionStorage.getItem("password");
    var body = {
        'username': username,
        'password': password
    };

    $.post({
        url: rootIP + '/auth',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: body,
        complete: function(result) {
          
        },

        success: function(result) {
            if (result.access_token.length == 291){
                access_token = result.access_token;
                refresh_token = result.refresh_token;
                sessionStorage.setItem("access_token", access_token);
                sessionStorage.setItem("refresh_token", refresh_token);

                token = getToken();
                getAccessLevel(username);
                

                try{
                    loadProffesions();
                    load_UserColumns();
                    $('#user_name').html("Hi " + username);
                }
                catch(err) {
                    
                  }
                
                return true;
            }

        },
        error: function(result) {
          var msg = 'Wrong username or password!';
          document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
        },
    });
    return false;
}

function getAccessLevel(username){
    sessionStorage.setItem("access_level","");
    var acc_level;
    
    $('#firstLoader').show();
    $.ajax({
        url: rootIP + '/users',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
          "Authorization": 'Bearer ' + token.access_token },
        complete: function(result) {
        },
  
        success: function(result) {
         var jsonData = JSON.stringify(result);
              var myOptions = {
                val1 : 'text1',
                val2 : 'text2'
            };
  
            data = $.parseJSON(jsonData);
                $.each(data["Users"], function(a,b) {
                    if (username.toUpperCase() == b.username.toUpperCase()){
                      sessionStorage.setItem("access_level",b.access_level);
                    }
                });
  
        },
  
        error: function(result) {
            
        },
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
        document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
  
      },
      error: function(result) {
     
        var msg = 'Wrong username or password!';
        document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
      },
  });
  
  }