GLB_JSONData = ""
rootIP = sessionStorage.getItem("rootIP")

let myArray = new Array();
let destroyTable = true;
token = getToken();

writeError = (msg) => {
  showErrors(msg);
}


function getAllowedLicenseTypes() {
    console.log("ROOT IP: ", rootIP);
    makeAjaxCall(rootIP + "/getuserprm?prmname=Lic_types", "GET", tokenData, ()=>$('#firstLoader').show()).then((result)=>{
    
      var container = $('#chckBox');
      var jsonData = result;
      // myLicList = jsonData.prm_value.split(',')
      const entries = Object.entries(jsonData.prm_value)

      entries.forEach(element => {
          $('<input />', { type: 'checkbox',class: 'licTypeCheckbox', id: element[0], value: element[1], width: "200", onClick: "loadProffesions()"}).appendTo(container);  
          $('<label />', { 'for': element[0], text: element[1] }).appendTo(container);
          $('#showcolumns').append("<br>");
      });
      $('#firstLoader').hide();
      hideGrayArea()
    }).catch((result)=>{
      console.log("GETTING ALLOWERD LICENSE TYPES ERROR")
      
      handleHttpErrors(result)
      showGrayArea()
    });
}

function printChecked(){
  var items=document.getElementsByClassName('licTypeCheckbox');
  var selectedLicensis ="";
  for(var i=0; i<items.length; i++){
    if(items[i].type=='checkbox' && items[i].checked==true)
      selectedLicensis +=items[i].id + ",";
  }
  return selectedLicensis 
}	

function getSelectedLiceseTypes(){
  let serchPrm = "";
  serchPrm = printChecked()
  return serchPrm.substring(0, serchPrm.length -1)
}

function loadProffesions(){

  let licenseType = getSelectedLiceseTypes();
  let srchState = $('#states').val();
  let endpoint = "";
  if (srchState == 'all'){
    endpoint = '/professions?license_type=' + licenseType;
  }else{
    endpoint = '/professions?license_type=' + licenseType + '&state=' + srchState;
  }

  $('#firstLoader').show();
  showGrayArea()
  makeAjaxCall(rootIP + endpoint, "GET", tokenData, ()=>$('#firstLoader').show()).then((result)=>{

    var jsonData = result;
    $('#profesion').empty();
    $('#profesion').append( new Option("All profesions",""));
    $.each(jsonData, function(val, text) {
        $('#profesion').append( new Option(val + " (" + text + ")",val));
    });
    getCoins();
    $('#firstLoader').hide();
    hideGrayArea()
  }).catch((result)=>{
    handleHttpErrors(result)
    showGrayArea()
  });

}


function loadUserColumns(){
  $('#loading-indicator').show();
  var lifOfColumns = new Array();
  myArray = [];
  showGrayArea()
    makeAjaxCall(rootIP + '/usersField', "GET", tokenData).then((result) => {
      var jsonData = JSON.stringify(result);         
            const parsedData = $.parseJSON(jsonData);
                $.each(parsedData["User_fields"], function(a,b) {
                    myArray.push([b.Field_name,b.ID]);
                    
                });
                $('#loading-indicator').hide();
                hideGrayArea()

    } ).catch((result) => {
          handleHttpErrors(result)
          $('#loading-indicator').hide();
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
  getSelectedLiceseTypes();
  // var license_type = $('#lic_type').val();
  var license_type = getSelectedLiceseTypes();
  var license = $('#license').val();
  var state = $('#states').val();
  var proff = $('#profesion').val();
  var city = $('#city').val();
  var zipcode = $('#zipcode').val();
  var county = $('#county').val();
  var phone = $('#phone').val();
  // var email = $('#email').val();
  // var employees = $('#employees').val();

  var lic_owner = $('#license_owner').val();
  var srch_type_licO = $('#lic_srch_type').val();

  var company_name = $('#company_name').val();
  var srch_type_comp = $('#comp_srch_type').val();

    if (license != "") { license = "&license=" + license;}
    if (license_type != "") { license_type = "&license_type=" + license_type;}
    if (state != "") { state = "&state=" + state;}
    if (proff != "") { proff = "&profession=" + proff;}

    if (city != "") { city = "&city=" + city;}
    if (zipcode != "") { zipcode = "&zipcode=" + zipcode;}
    if (county != "") { county = "&county=" + county;}
    if (phone != "") { phone = "&phone=" + phone;}
    // if (email != "") { email = "&email=" + email;}
    // if (employees != "") { employees = "&employees=" + employees;}

    if (lic_owner != "") { lic_owner = "&lic_owner=" + lic_owner + "&srch_type_licO=" + srch_type_licO;}
    if (company_name != "") { company_name = "&company_name=" + company_name + "&srch_type_comp=" + srch_type_comp;}

      myurl =  license_type + state + license + proff + city + zipcode + 
      county + phone + lic_owner + company_name ;
      myurl = myurl.slice(1, myurl.length);
      myurl = endPoint + myurl;

      makeAjaxCall(myurl, 'GET', tokenData).then((result)=>{
        if ("count" in result){
              var jsonData = result.count;
                } else {
                  var jsonData = "0";
                }
                
                write_rec_count_msg(jsonData);
                
                $('#firstLoader').hide();
    }).catch( (result)=>{
      handleHttpErrors(result);
    }
  );
  }

function get_LON_COUNT(){
  $('#firstLoader').show();
  var lic_owner = $('#license_owner').val();
  var srch_type = $('#lic_srch_type').val();

  if (lic_owner != ""){
        var myurl = rootIP + '/get_counts_LON/' + lic_owner + '?src_tp=' + srch_type;
        makeAjaxCall(myurl, 'GET', tokenData).then((result)=>{
              const jsonData = result.count;
              write_rec_count_msg(jsonData);
              $('#firstLoader').hide();
      }).catch( (result)=>{
        handleHttpErrors(result)
      }
  );
}
}

function get_CPN_COUNT(){
  $('#firstLoader').show();
  var company_name = $('#company_name').val();
  var srch_type = $('#comp_srch_type').val();

  if (company_name != ""){
        
        var myurl = rootIP + '/get_counts_CPN/' + company_name + '?src_tp=' + srch_type;
        makeAjaxCall(myurl, 'GET', tokenData).then((result)=>{
          const jsonData = result.count;
          write_rec_count_msg(jsonData);
          $('#firstLoader').hide();
        }).catch( (result)=>{
          handleHttpErrors(result);
        }
    );  
  }
}

function mlf_filter(){
  var license_type = getSelectedLiceseTypes()
  if (license_type != ""){
      var myurl = "";
      var state = $('#states').val();
      if (state == "all"){
        writeError("You did not select the state, search procces will take longer!");
      }

      var endPoint = rootIP + "/mlf_filter?";
      $('#loading-indicator').show();
      var license = $('#license').val();
      var proff = $('#profesion').val();
      var city = $('#city').val();
      var zipcode = $('#zipcode').val();
      var county = $('#county').val();
      var phone = $('#phone').val();
      // var email = $('#email').val();
      // var employees = $('#employees').val();
      var lic_owner = $('#license_owner').val();
      var srch_type_licO = $('#lic_srch_type').val();
      var company_name = $('#company_name').val();
      var srch_type_comp = $('#comp_srch_type').val();

        mlf_count();

        if (license != "") { license = "&license=" + license;}
        if (license_type != "") { license_type = "&license_type=" + license_type;}
        if (state != "") { state = "&state=" + state;}
        if (proff != "") { proff = "&profession=" + proff;}

        if (city != "") { city = "&city=" + city;}
        if (zipcode != "") { zipcode = "&zipcode=" + zipcode;}
        if (county != "") { county = "&county=" + county;}
        if (phone != "") { phone = "&phone=" + phone;}
        // if (email != "") { email = "&email=" + email;}
        // if (employees != "") { employees = "&employees=" + employees;}

        if (lic_owner != "") { lic_owner = "&lic_owner=" + lic_owner + "&srch_type_licO=" + srch_type_licO;}
        if (company_name != "") { company_name = "&company_name=" + company_name + "&srch_type_comp=" + srch_type_comp;}

          myurl =  license_type + state + license + proff + city + zipcode + 
          county + phone + lic_owner + company_name ;
          myurl = myurl.slice(1, myurl.length);
          myurl = endPoint + myurl;

          if (myurl.length == endPoint.length){
            alert("At least one field is required!")
          }else{
          makeAjaxCall(myurl, 'GET', tokenData).then((result)=>{
                if (result.Records[0].length >= 1){
                  const jsonData = result.Records[0];            
                  renderTable(jsonData)
                }
                writeNoRecordMsg(result.Records[0].length);
                $('#loading-indicator').hide();
          }).catch( (result)=>{
                  $('#loading-indicator').hide();
      
                  handleHttpErrors(result)
          }); 
      }

  }else{
    writeError("You have to select a license type first!");
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
        makeAjaxCall(myurl, 'GET', tokenData).then((result)=>{
          const countrec = result.Records[0].length;
                if (countrec >= 1){
                  const jsonData = result.Records[0];
                  renderTable(jsonData);
                }
                writeNoRecordMsg(countrec);
                $('#loading-indicator').hide();
    }).catch( (result)=>{
            $('#loading-indicator').hide();

            handleHttpErrors(result)
    });
  }
}

showApimessage = (msg = "") => {

}

closeApiMessage = () => $( "#errorbox" ).hide()




closeErrorBox = () => {
  const status = $( "#importance" ).val();
  if (status == 401 || status== 500) {
    logout()
  }else{
    $( "#errorbox" ).hide();
    hideGrayArea();
  }
  
}

showErrors = (msg, status=200) =>{
  showGrayArea();
  $( "#errobox_content" ).html(msg + ", status: " + status);
  $( "#importance" ).val(status);
  $( "#errorbox" ).show();
}



showGrayArea = () => $( "#grayback" ).show()
hideGrayArea = () => $( "#grayback" ).hide()

const handleHttpErrors = (response) =>{
  switch (response.status) {
    case 401:
      showErrors("You are not authorized to access this data or your token has expired!", response.status)
      break;
    case 404:
      showErrors("Url you requested does not exist!", response.status)
      break;
    case 500:
      showErrors("Something went wrong, internal server error!", response.status)
      break;
    case 404:
      showErrors("Bad request!", response.status)
      break;
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
        makeAjaxCall(myurl, 'GET', tokenData).then((result)=>{
          if (result.Records[0].length >= 1){
              var jsonData = result.Records[0];
              renderTable(jsonData);      
            }
          writeNoRecordMsg(result.Records[0].length);
          $('#loading-indicator').hide();
    }).catch( (result)=>{
      $('#loading-indicator').hide();
            var msg = 'The token has expired!';
            handleHttpErrors(result);
            document.location.href = 'login.html?code=' + result.status + '&msg=' + msg;
            
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

function goPackages(){
  document.location = "packages.html";
}

