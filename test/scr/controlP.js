var GLB_JSONData = ""
// var rootIP = "http://127.0.0.1:5000";
var rootIP = "https://firmagraphix-api.com";
var myArray = new Array();
var deleteList = new Array();
var appendList = new Array();
var access_level = sessionStorage.getItem("access_level");
var token = getToken();

if (access_level != 1){
    console.log('access Level: ' + access_level);
    // document.location.href = 'index.html';
}
console.log("AccessLevel = " + access_level);
$(document).ajaxSend(function(event, request, settings) {
  $('#loading-indicator').show();
});

$(document).ajaxComplete(function(event, request, settings) {
  $('#loading-indicator').hide();
});






function getToken(){
  var access_token = sessionStorage.getItem("access_token");
  var refresh_token = sessionStorage.getItem("refresh_token");
  var token = {
    'access_token': access_token,
    'refresh_token': refresh_token
  }
  return token
}


function loadUsers(){
    
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
    var selectedID = $('#users').val();
    $('.handles').sortable('destroy');
    
    loadUserColumns(selectedID);
}

function addCheckbox(name) {
    var container = $('#FieldsDiv');
    var inputs = container.find('input');
    var id = inputs.length + 1;
    var checkbox_name = '#cb' + id;
    
    if ($(":checkbox[value=" + name + "]").length == 0){
        // $('<input />', { type: 'checkbox', id: 'cb'+id, value: name}).appendTo(container);  
        // $('<label />', { 'for': 'cb' + id, text: name }).appendTo(container);
        // $('<li />', { 'for': 'cb' + id, text: name }).appendTo(container);


        $("<li id=li"+ id +"><span>:: </span><input type='checkbox' id=cb"+ id +" value="+ name +">" + name + "</li>").appendTo(".handles");  
        // $('#FieldsDiv').append("<br>");
        // console.log("checkbox added for :" + name);
       
    }

    // console.log("################################################");
    // console.log("Array Length: " + myArray.length);
    // console.log("If field exists in user for /" + name + "/ " + if_field_exists_in_user(name));
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
    for (x=0; x<= myArray.length-1; x++){
        deleteList.push({"id":myArray[x][1]},);
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
        var is_checkB_checked="";
        var order = "";
        var myval = "";
        var fieldArray = getSortedCheckboxes();
        console.log("##################################");
        console.log(fieldArray);
        console.log("##################################");
        for (y = 0; y <= fieldArray.length -1; y ++){
            checkbox_name = fieldArray[y][1];
            is_checkB_checked = fieldArray[y][3];
            order = fieldArray[y][4];
            
            appendList.push({"User_id":Number(selectedID),"View_state":is_checkB_checked,"File_name":"MLF","Field_name":checkbox_name,"Order":order},);
            // if ($(checkbox_name).is(':checked')) {
            //     myval = $(checkbox_name).val();
            //     // console.log(appendList.length);
                
            //     appendList.push({"User_id":Number(selectedID),"View_state":1,"File_name":"MLF","Field_name":myval},);
            //     } 
        
            }  
    if (appendList.length >=1){
        var json_appendList = JSON.stringify(appendList);
        $.ajax({
                url: rootIP + '/addUserFields?uid=' + selectedID,
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
    // append_user_fields() : IS RUNNING ON SUCCESS OF DELETE_USER_FIELDS()
    var sortedlist = getSortedCheckboxes();

}

function getSortedCheckboxes(){
    var li_array = [];
    var liValue;
    var checkbox_name;
    var checkbox_status;
    var count=0;
    $('#ul_chckb_list li').each(function () {
        liValue = $(this).text();
        liValue = liValue.substring(3, liValue.length);

        checkbox_name = this.id;
        checkbox_name = "cb" + checkbox_name.substring(2, checkbox_name.length);
        if ($("#"+checkbox_name).is(':checked')) {
            checkbox_status = "1"; 
        li_array.push([this.id, liValue, checkbox_name, checkbox_status, count]);
        count ++;
        }
        // console.log($(this).text());
    });
    // console.log(li_array);
    return li_array;
}  

function loadAllFields(){
    var token = getToken();
    $.ajax({
        url: rootIP + '/all_fields',
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
                $.each(data["Project_fields"], function(a,b) {
                    fieldname = b.ExportField;
                    
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
               
                    if (fieldname == "Primary_Location_Zip_5") fieldname = "Primary_Location_Zip"
                    addCheckbox(fieldname);
                });
         
                $(function() {
                    $('#ul_chckb_list').sortable({
                        handle: 'span'
                    }).bind('sortupdate', function(event, ui) {

                        var id = ui.item.attr("id");
                    });;
                });   
                
               
        showApimessage(result.message);        
        },
    
        error: function(result) {
            showApimessage(result.message);
        },
    });
        
}

function showApimessage(message){
    try {
        $("#msgdiv").html(message);
    } catch (error) {
        $("#msgdiv").append("Something went wrong!, try again later");
    }
}    

function loadUserColumns(userID){
    var token = getToken();
    var lifOfColumns = new Array();
    myArray = [];
    $.ajax({
        url: rootIP + '/usersField?uid=' + userID,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "Authorization": 'Bearer ' + token.access_token },
        complete: function(result) {
        },
    
        success: function(result) {
                var jsonData = JSON.stringify(result);
                // console.log("loadUserColumns : UID =" + userID);
                // console.log(jsonData);
                var myOptions = {
                val1 : 'text1',
                val2 : 'text2'
            };
            
            data = $.parseJSON(jsonData);
                $.each(data["User_fields"], function(a,b) {
                    myArray.push([b.Field_name,b.ID]);
                });
                
                loadAllFields();
               
                showApimessage(result.message);
        },
    
        error: function(result) {
            if (result.status == 404) {
                loadAllFields();
                showApimessage(result.message);
            }else if (result.status == 401){            
            var msg = 'Wrong username or password!';
            document.location.href = 'login.html?code=' + result.status + '&msg=' + result.message;
            }
        },
    });

    }

function if_field_exists_in_user(fieldname){
        var i=0, len = myArray.length, target = fieldname.trim();
        for(; i<len; i++) {
            
            if (myArray[i][0] == target) {
                return 1;
            }
        }
        return -1;
    }


    $(document).ready(function(){
        authenticateUser();         
        token = getToken();
        loadUsers();

  });