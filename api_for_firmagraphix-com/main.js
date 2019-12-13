var GLB_JSONData = ""
var rootIP = "https://firmagraphix-api.com";
var myArray = new Array();
var destroyTable = true;

// $(document).ajaxSend(function(event, request, settings) {
//   $('#loading-indicator').show();
// });

// $(document).ajaxComplete(function(event, request, settings) {
//   $('#loading-indicator').hide();
// });

function getAccessLevel(username){
  sessionStorage.setItem("access_level","");
  var acc_level;
  var token = getToken();
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


function loadProffesions(){
  var token = getToken();
  $('#firstLoader').show();
  $.ajax({
      url: rootIP + '/professions',
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

          $.each(jsonData, function(val, text) {
              $('#profesion').append( new Option(val + " (" + text + ")",val));
          });
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


function authenticateUser() {
    $('#loading-indicator').show();
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
                loadProffesions();
                load_UserColumns();
                
            }
            $('#loading-indicator').hide();
        },
        error: function(result) {
          $('#loading-indicator').hide();
          var msg = 'Wrong username or password!';
          document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
        },
    });
    return true;
}

function loadUserColumns(){
  $('#loading-indicator').show();
  var token = getToken();
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
  authenticateUser()
          
    });


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
    //fetch all records from JSON result and make row data set.
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

    
function get_all_records(){
  var token = getToken();
  $.ajax({
      url: rootIP + '/all_records',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      headers: {
        "Authorization": 'Bearer ' + token.access_token },
      complete: function(result) {
      },

      success: function(result) {
            var jsonData = result.Records[0];
            
            renderTable(jsonData)
            writeNoRecordMsg(result.Records[0].length);
      },

      error: function(result) {
      },
  });
}

function get_LSP_COUNT(){
  $('#firstLoader').show();
  var license = $('#license').val();
  var state = $('#states').val();
  var proff = $('#profesion').val();

  if (license == "" && state == "" && proff == ""){
  }else{
        var token = getToken();
        var myurl = "";

        if (license != "" && state != "" && proff != ""){
            myurl = rootIP + '/get_counts_lsp?license=' + license + '&state=' + state + '&profession=' + proff;
        }else if (license != "" && state == "" && proff == "") {
            myurl = rootIP + '/get_counts_lsp?license=' + license;
        }else if (license == "" && state != "" && proff == "") {
            myurl = rootIP + '/get_counts_lsp?state=' + state;
        }else if (license == "" && state == "" && proff != ""){
            myurl = rootIP + '/get_counts_lsp?profession=' + proff;
        }else if (license != "" && state == "" && proff != ""){
            myurl = rootIP + '/get_counts_lsp?license=' + license + '&profession=' + proff;
        }else if (license == "" && state != "" && proff != ""){
            myurl = rootIP + '/get_counts_lsp?state=' + state + '&profession=' + proff;
        }else if (license != "" && state != "" && proff == ""){
          myurl = rootIP + '/get_counts_lsp?state=' + state + '&license=' + license;
      }
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
              var jsonData = result.count;
              write_rec_count_msg(jsonData);
              $('#firstLoader').hide();
            },

            error: function(result) {
   
              //writeerrors(result);
            },
        });
  }
}

function get_LON_COUNT(){
  $('#firstLoader').show();
  var lic_owner = $('#license_owner').val();
  var srch_type = $('#lic_srch_type').val();

  if (lic_owner != ""){
        var token = getToken();
        var myurl = rootIP + '/get_counts_LON/' + lic_owner + '?src_tp=' + srch_type;

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
              //writeerrors(result);
            },
        });
  }
}

function get_CPN_COUNT(){
  $('#firstLoader').show();
  var company_name = $('#company_name').val();
  var srch_type = $('#comp_srch_type').val();

  if (company_name != ""){
        var token = getToken();
        var myurl = rootIP + '/get_counts_CPN/' + company_name + '?src_tp=' + srch_type;
        
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
              //var msg = 'The token has expired!';
              //document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
            },
        });
  }
}


function get_lic_and_state(){
  $('#loading-indicator').show();
  var license = $('#license').val();
  var state = $('#states').val();
  var proff = $('#profesion').val();

  if (license == "" && state == "" && proff == ""){
    alert("At least one field is required!")
  }else{
        var token = getToken();
        var myurl = "";
        get_LSP_COUNT();
        if (license != "" && state != "" && proff != ""){
            myurl = rootIP + '/lic_state?license=' + license + '&state=' + state + '&profession=' + proff;
        }else if (license != "" && state == "" && proff == "") {
            myurl = rootIP + '/lic_state?license=' + license;
        }else if (license == "" && state != "" && proff == "") {
            myurl = rootIP + '/lic_state?state=' + state;
        }else if (license == "" && state == "" && proff != ""){
            myurl = rootIP + '/lic_state?profession=' + proff;
        }else if (license != "" && state == "" && proff != ""){
            myurl = rootIP + '/lic_state?license=' + license + '&profession=' + proff;
        }else if (license == "" && state != "" && proff != ""){
            myurl = rootIP + '/lic_state?state=' + state + '&profession=' + proff;
        }else if (license != "" && state != "" && proff == ""){
          myurl = rootIP + '/lic_state?state=' + state + '&license=' + license;
      }
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
        var token = getToken();
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
        var token = getToken();
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
    $('#mainDiv').hide();
    $('#msgdiv').html("<span class='no_records'> No records found!</span>");

  }else{
    // $('#msgdiv').html("");
    $('#mainDiv').show();
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



