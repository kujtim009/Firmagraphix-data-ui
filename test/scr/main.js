var GLB_JSONData = ""
// var rootIP = "http://127.0.0.1:5000";
var rootIP = "https://firmagraphix-api.com";
var myArray = new Array();
var destroyTable = true;
var token = getToken();

function loadProffesions(state=null){
  
  var endpoint = "";
  if (state == null){
    endpoint = '/professions';
  }else{
    endpoint = '/professions?state=' + state;
  }
     
  $('#firstLoader').show();
  $.ajax({
      url: rootIP + endpoint,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      headers: {
        "Authorization": 'Bearer ' + token.access_token },
      complete: function(result) {
      },

      success: function(result) {
            var jsonData = result;
            var myOptions = {
              val1 : 'text1',
              val2 : 'text2'
          };
          $('#profesion').empty();
          $('#profesion').append( new Option("All profesions",""));
          $.each(jsonData, function(val, text) {
            
              $('#profesion').append( new Option(val + " (" + text + ")",val));
          });
          getCoins();
          $('#firstLoader').hide();
         
      },

      error: function(result) {
         writeerrors(result);
      },
  });
}

function clearStorage(){
  sessionStorage.setItem("username","");
  sessionStorage.setItem("password","");
}




function loadUserColumns(){
  $('#loading-indicator').show();
  
  var lifOfColumns = new Array();
  myArray = [];
  $.ajax({
      url: rootIP + '/usersField',
      type: 'GET',
      dataType: 'json',
      contentType:'application/json; charset=utf-8',
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
              $.each(data["User_fields"], function(a,b) {
                  myArray.push([b.Field_name,b.ID]);
                  
              });
              $('#loading-indicator').hide();    
      },
  
      error: function(result) {
        writeerrors(result);
        $('#loading-indicator').hide();
      },
  });

  }

function getToken(){
  var access_token = sessionStorage.getItem("access_token");
  var refresh_token = sessionStorage.getItem("refresh_token");
  var token = {
    'access_token': access_token,
    'refresh_token': refresh_token
  }
  return token
}

$(document).ready(function(){
      authenticateUser();
      try{
        $('#user_name').html("Hi " + username);
        
      }
      catch{
        $('#user_name').html("Processing...");
      }
      
    });

function getCoins(){
  $('#loading-indicator').show();
  $.ajax({
      url: rootIP + '/getcoins',
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
        $("#coins").html("Available Coins: <span class='coinIco'>C</span>" + data.coins);
        $('#loading-indicator').hide();    
      },
  
      error: function(result) {
        writeerrors(result);
        $('#loading-indicator').hide();
      },
  });
}


function renderTable(myjsondata){


  var parseJSONResult = myjsondata;

  if (parseJSONResult!= null && parseJSONResult.length > 0) {
    //Get dynmmic column.
    var dynamicColumns = [];
    var i = 0;
    $.each(parseJSONResult[0], function (key, value) {
        var obj = { sTitle: key };
        dynamicColumns[i] = obj;
        i++;
    });
    var rowDataSet = [];
    var i = 0;
    $.each(parseJSONResult, function (key, value) {
        var rowData = [];
        var j = 0;
        $.each(parseJSONResult[i], function (key, value) {
            rowData[j] = value;
            j++;
        });
        rowDataSet[i] = rowData;

        i++;
    });


//PROCEDURE FOR COLUMN ORDERING
var fieldOrder = new Array();
var NewfieldOrder = new Array();
var tempColOrder = new Array();


for (x = 0; x <= UserFieldLIst.length-1; x ++){
fieldOrder.push(UserFieldLIst[x][0]);
}


$.each(dynamicColumns, function (key, value) {       
  tempColOrder.push(value.sTitle)
});


for(x=0; x<= fieldOrder.length-1; x++){
    for(y=0; y<= fieldOrder.length-1; y++){
      if (fieldOrder[x] == tempColOrder[y]){
          NewfieldOrder.push(y); 
      }
        
    }
}
///////END OF THE PROCEDURE

$('#mainTable').dataTable({
    "bDestroy": destroyTable,
    "scrollCollapse": true,
    "bJQueryUI": true,
    "bPaginate": false,
    "bInfo": true,
    "bFilter": true,
    "bSort": true,
    // "responsive": true,
        colReorder: {
         order: NewfieldOrder
        },
    "aaData": rowDataSet,
    "aoColumns": dynamicColumns,
    "processing": true,
    scroller: {
      rowHeight: 10
    },
    dom: 'Bfrtip',
  buttons: [
    { extend: 'copy', className: 'btn btn-primary glyphicon glyphicon-duplicate' },
    { extend: 'csv', className: 'btn btn-primary glyphicon glyphicon-save-file' },
    { extend: 'excel', className: 'btn btn-primary glyphicon glyphicon-list-alt' },
    { extend: 'pdf', className: 'btn btn-primary glyphicon glyphicon-file' },
    { extend: 'print', className: 'btn btn-primary glyphicon glyphicon-print' }
  ]


});


}
// var table = "mainTable";
// $(table.column(1).header()).text('My title');
destroyTable = true;
}


function mlf_count(){

  $('#firstLoader').show();
  
  var myurl = "";
  var endPoint = rootIP + "/mlf_count?";

  var license = $('#license').val();
  var state = $('#states').val();
  var proff = $('#profesion').val();
  var city = $('#city').val();
  var zipcode = $('#zipcode').val();
  var county = $('#county').val();
  var phone = $('#phone').val();
  var email = $('#email').val();
  var employees = $('#employees').val();

  var lic_owner = $('#license_owner').val();
  var srch_type_licO = $('#lic_srch_type').val();

  var company_name = $('#company_name').val();
  var srch_type_comp = $('#comp_srch_type').val();

    if (license != "") { license = "&license=" + license;}
    if (state != "") { state = "&state=" + state;}
    if (proff != "") { proff = "&profession=" + proff;}

    if (city != "") { city = "&city=" + city;}
    if (zipcode != "") { zipcode = "&zipcode=" + zipcode;}
    if (county != "") { county = "&county=" + county;}
    if (phone != "") { phone = "&phone=" + phone;}
    if (email != "") { email = "&email=" + email;}
    if (employees != "") { employees = "&employees=" + employees;}

    if (lic_owner != "") { lic_owner = "&lic_owner=" + lic_owner + "&srch_type_licO=" + srch_type_licO;}
    if (company_name != "") { company_name = "&company_name=" + company_name + "&srch_type_comp=" + srch_type_comp;}

      myurl =  state + license + proff + city + zipcode + 
      county + phone + email + employees + lic_owner + company_name ;
      myurl = myurl.slice(1, myurl.length);
      myurl = endPoint + myurl;
      console.log(myurl);
        $.ajax({
            url: myurl,
            type: 'GET',
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            headers: {
              "Authorization": 'Bearer ' + token.access_token,
               },
            complete: function(result) {

            },

            success: function(result) {
              if ("count" in result){
                var jsonData = result.count;
              } else {
                var jsonData = "0";
              }
              
              write_rec_count_msg(jsonData);
              
              $('#firstLoader').hide();
            },

            error: function(result) {
              //writeerrors(result);
              // console.log(result.message);
            },
        });
  }


function get_LON_COUNT(){
  $('#firstLoader').show();
  var lic_owner = $('#license_owner').val();
  var srch_type = $('#lic_srch_type').val();

  if (lic_owner != ""){
        
        var myurl = rootIP + '/get_counts_LON/' + lic_owner + '?src_tp=' + srch_type;
        console.log(myurl);
        $.ajax({
            url: myurl,
            type: 'GET',
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            headers: {
              "Authorization": 'Bearer ' + token.access_token,
              "Access-Control-Allow-Origin":true },
            complete: function(result) {

            },

            success: function(result) {
              var jsonData = result.count;
              write_rec_count_msg(jsonData);
              $('#firstLoader').hide();
            },

            error: function(result) {
              // writeerrors(result);
            },
        });
  }
}

function get_CPN_COUNT(){
  $('#firstLoader').show();
  var company_name = $('#company_name').val();
  var srch_type = $('#comp_srch_type').val();

  if (company_name != ""){
        
        var myurl = rootIP + '/get_counts_CPN/' + company_name + '?src_tp=' + srch_type;
        console.log(myurl);
        $.ajax({
            url: myurl,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: {
              "Authorization": 'Bearer ' + token.access_token,
              "Access-Control-Allow-Origin":true },
            complete: function(result) {

            },

            success: function(result) {
              var jsonData = result.count;
              write_rec_count_msg(jsonData);
              $('#firstLoader').hide();
            },

            error: function(result) {
              // var msg = 'The token has expired!';
              // document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
            },
        });
  }
}


function mlf_filter(){
  
  var myurl = "";
  var endPoint = rootIP + "/mlf_filter?";

  $('#loading-indicator').show();
  var license = $('#license').val();
  var state = $('#states').val();
  var proff = $('#profesion').val();
  var city = $('#city').val();
  var zipcode = $('#zipcode').val();
  var county = $('#county').val();
  var phone = $('#phone').val();
  var email = $('#email').val();
  var employees = $('#employees').val();

  var lic_owner = $('#license_owner').val();
  var srch_type_licO = $('#lic_srch_type').val();

  var company_name = $('#company_name').val();
  var srch_type_comp = $('#comp_srch_type').val();

  
  
    mlf_count();

    if (license != "") { license = "&license=" + license;}
    if (state != "") { state = "&state=" + state;}
    if (proff != "") { proff = "&profession=" + proff;}

    if (city != "") { city = "&city=" + city;}
    if (zipcode != "") { zipcode = "&zipcode=" + zipcode;}
    if (county != "") { county = "&county=" + county;}
    if (phone != "") { phone = "&phone=" + phone;}
    if (email != "") { email = "&email=" + email;}
    if (employees != "") { employees = "&employees=" + employees;}

    if (lic_owner != "") { lic_owner = "&lic_owner=" + lic_owner + "&srch_type_licO=" + srch_type_licO;}
    if (company_name != "") { company_name = "&company_name=" + company_name + "&srch_type_comp=" + srch_type_comp;}

      myurl =  state + license + proff + city + zipcode + 
      county + phone + email + employees + lic_owner + company_name ;
      myurl = myurl.slice(1, myurl.length);
      myurl = endPoint + myurl;

      if (myurl.length == endPoint.length){
        alert("At least one field is required!")
      }else{

      console.log(myurl);
        $.ajax({
            url: myurl,
            type: 'GET',
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            headers: {
              "Authorization": 'Bearer ' + token.access_token,
               },
            complete: function(result) {

            },

            success: function(result) {
 
                if (result.Records[0].length >= 1){
                  var jsonData = result.Records[0];
                  
                  renderTable(jsonData)
          
              
              }
              writeNoRecordMsg(result.Records[0].length);
              $('#loading-indicator').hide();
            },

            error: function(result) {
              $('#loading-indicator').hide();
              writeerrors(result);
            },
        });
  }
}

function get_record_by_lic_owner(){
  $('#loading-indicator').show();
  var lic_owner = $('#license_owner').val();
  var srch_type = $('#lic_srch_type').val();

  if (lic_owner == ""){
    alert("Individual name field is required!")
  }else{
        
        var myurl = rootIP + '/license_owner/' + lic_owner + '?src_tp=' + srch_type;
        get_LON_COUNT();
        $.ajax({
            url: myurl,
            type: 'GET',
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            headers: {
              "Authorization": 'Bearer ' + token.access_token,
              "Access-Control-Allow-Origin":true },
            complete: function(result) {

            },

            success: function(result) {
              
              var countrec = result.Records[0].length;
                if (countrec >= 1){
                  var jsonData = result.Records[0];
                  renderTable(jsonData);
                  
              }
              writeNoRecordMsg(countrec);
              $('#loading-indicator').hide();
            },
            error: function(result) {
              writeerrors(result);
              $('#loading-indicator').hide();
            },
        });
  }
}

function get_record_by_coName(){
  $('#loading-indicator').show();
  var company_name = $('#company_name').val();
  var srch_type = $('#comp_srch_type').val();

  if (company_name == ""){
    alert("Company name field is required!")
  }else{
        
        var myurl = rootIP + '/company_name/' + company_name + '?src_tp=' + srch_type;
        get_CPN_COUNT();
        $.ajax({
            url: myurl,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: {
              "Authorization": 'Bearer ' + token.access_token,
              "Access-Control-Allow-Origin":true },
            complete: function(result) {

            },

            success: function(result) {
                if (result.Records[0].length >= 1){
                  var jsonData = result.Records[0];
                  renderTable(jsonData);
                  
              }
              writeNoRecordMsg(result.Records[0].length);
              $('#loading-indicator').hide();
            },

            error: function(result) {
              $('#loading-indicator').hide();
              var msg = 'The token has expired!';
              document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
            },
        });
  }
}


function writeNoRecordMsg(countrec){
  if (countrec <= 0){
    $('#contentDiv').hide();
    $('#msgdiv').html("<span class='no_records'> No records found!</span>");

  }else{
    // $('#msgdiv').html("");
    $('#contentDiv').show();
  }
}

function write_rec_count_msg(countrec){
  if (countrec > 100) {
    $('#msgdiv').html("<span class='Count_records'> Your search returned: " + countrec + " records, we will display only 100.</span>");
  } else{
    $('#msgdiv').html("<span class='Count_records'> Your search returned: " + countrec + " records.</span>");
  }
   

}

function writeerrors(result){
    if (result.status == 401){
      document.location.href = 'login.html?code=' + result.status + '&msg=' + result.message;
    }else{
      $('#msgdiv').html("<span class='no_records'>"+ result.message +"!</span>");
    }
}

function goPackages(){
  console.log("GO PACKAGES");
  document.location = "packages.html";
}

