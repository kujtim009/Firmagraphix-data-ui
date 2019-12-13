function writeerrors(result){
    console.log("REQUEST STATUS:", result.status)
    if (result.status == 401){
      // document.location.href = 'login.html?code=' + result.status + '&msg=' + result.message;
    }else{
      $('#msgdiv').html("<span class='no_records'>"+ result.message +"!</span>");
    }
}