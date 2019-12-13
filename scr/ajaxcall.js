function makeAjaxCall(url, methodType, data = null, callback){
console.log("Requested url:", encodeURI(url))
    // console.log("method", methodType, "body", data.requestBody, "header", data.requestHeader)
    if (methodType == "POST"){
        // console.log("METHOD POST")
        return $.ajax({
            url : url,
            method : methodType,
            dataType : "json",
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data.requestBody,
         })
    }else{
        // console.log("METHOD GET")
        return $.ajax({
            url : url,
            method : methodType,
            dataType : "json",
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: data.requestHeader
         })
    }
    
   }