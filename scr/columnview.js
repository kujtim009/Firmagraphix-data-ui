let GLB_JSONData = ""
// var rootIP = "http://127.0.0.1:5000";
// const rootIP = "https://firmagraphix-api.com";
let rootIP = sessionStorage.getItem("rootIP");
var UserFieldLIst = new Array();
var deleteList = new Array();
var appendList = new Array();


function openviewcol(){
    load_UserColumns();
    if ($("#showcolumns").is(":visible") == false){
        $('#contentDiv').hide();
        
        if ($.fn.DataTable.isDataTable( '#mainTable' ) ) {
            destroyTable = false;
            var table = $('#mainTable').DataTable();
            table.destroy();
            $('#mainTable').empty();
            table.clear();

        }else {
            destroyTable = true;
        } 
    }
    $("#showcolumns").toggle();
}  


function loadUsers(){
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
                    $('#users').append($('<option>', {value:b.id, text:b.username}));
                });
        showApimessage(result.message);
        },
  
        error: function(result) {
            showApimessage(result.message);
            
        },
    });
}


function get_user_fields(){
    removeCheckBoxes();
    load_UserColumns();
}

function addCheckbox(name) {
    var container = $('#showcolumns');
    var inputs = container.find('input');
    var id = inputs.length + 1;
    var checkbox_name = '#cb' + id;

    if ($(":checkbox[value=" + name + "]").length == 0){
        $('<input />', { type: 'checkbox', id: 'cb'+id, value: name}).appendTo(container);  
        $('<label />', { 'for': 'cb' + id, text: name }).appendTo(container);
        $('#showcolumns').append("<br>");
        
    }

    if (if_field_exists_in_user(name) != "-1"){
        $(":checkbox[value=" + name + "]").prop('checked', true);
    }else{
        $(":checkbox[value=" + name + "]").prop('checked', false);
    }

    
    
}

function getCheckbox_count(){
    var container = $('#FieldsDiv');
    var inputs = container.find('input');
    var checkbox_count = inputs.length;
    return checkbox_count;
}

function removeCheckBoxes(){    
    for (x=1; x<=getCheckbox_count(); x++){
        checkBoxID = "cb" + x;
        $("#" + checkBoxID).prop('checked', false);
    }
        
}

function checkallChecks(){    
    for (x=1; x<=getCheckbox_count(); x++){
        checkBoxID = "cb" + x;
        $("#" + checkBoxID).prop('checked', true);
    }
        
}

function delete_user_fields(){
    deleteList = [];
    for (x=0; x<= UserFieldLIst.length-1; x++){
        deleteList.push({"id":UserFieldLIst[x][2]},);
    }
    json_deleteList = JSON.stringify({"deletes":deleteList});
    $.ajax({
        url: rootIP + '/removeusrfields',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: json_deleteList,
        headers: {
            "Authorization": 'Bearer ' + token.access_token },
        complete: function(result) {
          
        },

        success: function(result) {
            showApimessage(result.message);
            console.log("Message: " + result.message);
            append_user_fields();
        },
        error: function(result) {
            showApimessage(result.message);
        },
    });

}

function append_user_fields(){
    var appendList = [];
    var selectedID = $('#users').val();
    if (selectedID != "null"){

        var checkbox_name = "";
        var Order;
        var myval = "";
        for (ch = 0; ch <= UserFieldLIst.length-1; ch ++){
            checkbox_name = UserFieldLIst[ch][0];
            Order = UserFieldLIst[ch][3];
            
            if ($(":checkbox[value=" + checkbox_name + "]").is(':checked')) {
                appendList.push({"View_state":1,"File_name":"MLF","Field_name":checkbox_name, "Order":Order},);
                }else{
                appendList.push({"View_state":0,"File_name":"MLF","Field_name":checkbox_name, "Order":Order},);
                }
            }
    if (appendList.length >=1){
        var json_appendList = JSON.stringify(appendList);
        $.ajax({
                url: rootIP + '/addUserFields',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: json_appendList,
                headers: {
                    "Authorization": 'Bearer ' + token.access_token },
                complete: function(result) {
                
                },

                success: function(result) {
                    
                    showApimessage(result.message);
                    loadUserColumns();
                },
                error: function(result) {
                    
                    showApimessage(result.message);
                },
            });
        }
    }else{
        alert("You have to select the user first!");
    }
    
}

function update(){

    delete_user_fields();
    //append_user_fields(); Running inside the delete User field method
    //loadUserColumns(); //Reloading user_column with changes, Running inside the append_user_fields method
}

function loadAllFields(){
    var token = getToken();
    // console.log("LOAD ALL FILDS");
    makeAjaxCall(rootIP + '/usersField', "GET", tokenData).then((result) => {


        const jsonData = JSON.stringify(result);
    
            const parsedData = $.parseJSON(jsonData);
                $.each(parsedData["User_fields"], function(a,b) {
                    fieldname = b.Field_name;
                    
                    fieldname = fieldname.replace(/ /g,"_");
                    fieldname = fieldname.replace(/-/g,"");
                    fieldname = fieldname.replace("/","");
                    fieldname = fieldname.replace("__","_");
                    fieldname = fieldname.trim();
                    char = fieldname.substring(fieldname.length -1, fieldname.length);
                    if (char == "_") {
                        fieldname = fieldname.substring(0, fieldname.length - 1);
                    }
                    
                    if (fieldname.substring(0, 3) == "dbo") fieldname = "Business_zip_5"
                    addCheckbox(fieldname);
                });
        showApimessage(result.message);  
      } ).catch((result) => {
        showApimessage(result.message); 
        handleHttpErrors(result); 
      });
    }

function showApimessage(message){
    
    try {
        $("#showHideColMSG").html(message);
    } catch (error) {
        $("#showHideColMSG").append("Something went wrong!, try again later");
    }

}    

function load_UserColumns(){
    // console.log("Load User Columns")
    var token = getToken();
    var lifOfColumns = new Array();
    UserFieldLIst = [];
      makeAjaxCall(rootIP + '/usersField', "GET", tokenData).then((result) => {
            const jsonData = JSON.stringify(result);
            const parsedData = $.parseJSON(jsonData);
            $.each(parsedData["User_fields"], function(a,b) {
                UserFieldLIst.push([b.Field_name,b.View_state,b.ID,b.Order]);
            });
            loadAllFields();
            showApimessage(result.message);
            // console.log("Load User Columns END")
      } ).catch((result) => {
        if (result.status == 404) {
            loadAllFields();
            showApimessage(result.message);
            handleHttpErrors(result);
          }
      });



    }

function if_field_exists_in_user(fieldname){
        var i=0, len = UserFieldLIst.length, target = fieldname.trim();
        for(; i<len; i++) {
            
            if (UserFieldLIst[i][0] == target) {
                if (UserFieldLIst[i][1] == 1)
                return 1;
            }
        }
        return -1;
    }


    $(document).ready(function(){
     
  });

