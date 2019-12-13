function getToken(){
  const access_token = sessionStorage.getItem("access_token");
  const refresh_token = sessionStorage.getItem("refresh_token");
  const token = {
    'access_token': access_token,
    'refresh_token': refresh_token
  }
  
  return token
}

function getCredencialToken(){
    const token = getToken().access_token;
    const tokenData = {
        "requestHeader": { "Authorization": 'Bearer ' + token },
        "requestBody": null
      }
    
    return tokenData
  }