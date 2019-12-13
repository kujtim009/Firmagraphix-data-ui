function getCoins(){
  $('#loading-indicator').show();
    const root = sessionStorage.getItem("rootIP");
    makeAjaxCall(root + '/getcoins', "GET", getCredencialToken()).then((result) => {
      var jsonData = JSON.stringify(result);
        parsedData = $.parseJSON(jsonData);
        $("#coins").html("Available Coins: <span class='coinIco'>C</span>" + parsedData.coins);
        $('#loading-indicator').hide();
        // console.log("GET COINS ENDED")    
    } ).catch(() => {
          writeerrors(result);
          $('#loading-indicator').hide();
    });
}