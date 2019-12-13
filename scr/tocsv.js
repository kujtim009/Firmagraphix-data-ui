$(document).ready(function(){
    $('#toCSV').click(function(){
        JSONToCSVConvertor(GLB_JSONData, "MLF_sample_data_", true);
    });
});

$(document).ready(function(){
    $('#toJSON').click(function(){
        downloadJsonData(GLB_JSONData, "MLF_sample_data_", true);
    });
});

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    if (ShowLabel) {
        var row = "";
        for (var index in arrData[0]) {
            row += index + ',';
        }

        row = row.slice(0, -1);

        CSV += row + '\r\n';
    }

    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }
    var fileName = "FGX_report_";
    fileName += ReportTitle.replace(/ /g,"_");

    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function downloadJsonData(JSONData, ReportTitle, ShowLabel) {
    myJson = JSON.stringify(JSONData);
    if (myJson == '') {
        alert("Invalid data");
        return;
    }
    var fileName = "FGX_report_";
    fileName += ReportTitle.replace(/ /g,"_");
    var uri = 'data:text/JSON;charset=utf-8,' + myJson;

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = fileName + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
