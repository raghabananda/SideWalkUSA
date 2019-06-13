function FilterRecord() {
    $.ajax({
        type: "GET",
        url: "/ViewDevice/GetDeviceDetails",
        success: GetDisplayRecords,
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}



function DeleteDeviceRecord(id) {
    console.log(id);
    $.ajax({
        type: "Post",
        url: "/ViewDevice/DeleteDeviceDetailsRecord",
        data: { iD: id },        
        success: function (res) {
            console.log(res); 
            location.reload();
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function UpdateRecord(formdata) {

    console.log(formdata);
    //$.ajax({
    //    type: "Post",
    //    url: "/ViewDevice/UpdateDevice",
    //    data: formdata,
    //    success: GetDisplayRecords,
    //    error: function (xhr, status, error) {
    //        alert(error);
    //    }
    //});
}


function GetDisplayRecords(ResultData) {

    var keys = Object.keys(ResultData[0]);
    var thead = keys.map(key => '<th>' + key + '</th>');
    var tbody = [];
    for (var i = 0; i < ResultData.length; i++) {
        tbody = [...tbody,
        (`<tr>
               <td><button id="btnEdit" class="btn btn-default"><i class="fa fa-edit"></i>Edit<button></td>` +
            `<td><button id="btnDelete" class="btn btn-danger">Delete<button></td>` +
            keys.map(key => `<td>` + ResultData[i][key] + `</td>`) +
            `</tr>`)];
    }

    //table header
    $('#tableDiv').append(`
       <thead>
         <tr>
             <th colspan='2'>Action</th>
            `+ thead.join('') + `
         </tr>
        </thead>
     `);

    //table body
    $('#tableDiv').append(`
       <tbody>           
            `+ tbody.join('') + `         
        </tbody>
     `);

    //Edit functionality
    $('button').on('click', function (e) {
        e.preventDefault();
        if (e.target.innerText == 'Edit') {
            var mydom = this.parentElement.parentElement.children;

            //console.log(mydom[3].innerText);
           
            getEditRecord();
            $("#modalBody").empty();
            function getEditRecord() {
                $.ajax({
                    type: "Post",
                    url: "/ViewDevice/GetSuperAdminClientAndWorkers",
                    success: function (responce) {
                        console.log(responce);

                        //var optionSuperAdminName = responce.filter(res => res.roleId == 1);
                        //var optionSuperAdminHtml = optionSuperAdminName.map(r => '<option value="' + r.userId + '">' + r.firstName + ' ' + r.lastName + '</option>');


                        var optionclientName = responce.filter(res => res.roleId == 2);
                        var optionclientHtml = optionclientName.map(r => '<option value="' + r.userId+'">' + r.firstName+' '+ r.lastName+'</option>');

                        var optionWorkerName = responce.filter(res => res.roleId == 3);
                        var optionWorkerHtml = optionWorkerName.map(r => '<option value="' + r.userId + '">' + r.firstName + ' ' + r.lastName + '</option>');

                        for (var i = 0, j = 2; i < keys.length && j < mydom.length; i++ , j++) {
                            switch (keys[i]) {

                                case 'id':
                                    $("#modalBody").append(`                     
                                      <div class="form-group" style="display: none;">
                                         <label>`+ keys[i] + `</label>
                                         <input class="form-control" type="hidden" name="`+ keys[i] + `" value="` + mydom[j].innerText + `">
                                      </div>
                                    `);
                                    break;
                                case 'deviceID':
                                    $("#modalBody").append(`                     
                                      <div class="form-group">
                                         <label>`+ keys[i] + `</label>
                                         <input class="form-control" type="text" name="`+ keys[i] + `" value="` + mydom[j].innerText + `" readonly>
                                      </div>
                                    `);
                                    break;

                                case 'clientName':                                   
                                    $("#modalBody").append(`                     
                                      <div class="form-group" style="display: none;">
                                         <label>`+ keys[i] + `</label>
                                          <select id="`+ keys[i]+`" name="`+ keys[i] + `" class="form-control">
                                             `+ optionclientHtml.join('') +`
                                          </select                                         
                                      </div>
                                    `);
                                    var cn = mydom[j].innerText.split(' ');
                                    var ob = responce.filter(res => res.firstName == cn[0] && res.lastName == cn[1]);
                                    $('#' + keys[i]).val(ob[0].userId);
                                    break;

                                case 'workerName':
                                    $("#modalBody").append(`                     
                                      <div class="form-group" style="display: none;">
                                         <label>`+ keys[i] + `</label>
                                          <select id="`+ keys[i] + `" name="` + keys[i] + `" class="form-control">
                                             `+ optionWorkerHtml.join('') + `
                                          </select                                         
                                      </div>
                                    `);
                                    var cn = mydom[j].innerText.split(' ');
                                    var ob = responce.filter(res => res.firstName == cn[0] && res.lastName==cn[1]);
                                    $('#' + keys[i]).val(ob[0].userId);
                                   
                                    break;

                                case 'serialNo':
                                    $("#modalBody").append(`                     
                                      <div class="form-group" style="display: none;">
                                         <label>`+ keys[i] + `</label>
                                         <input class="form-control" type="text" name="`+ keys[i] + `" value="` + mydom[j].innerText + `" readonly>
                                      </div>
                                    `);
                                    break;

                                case 'status':
                                    const htmlradio = mydom[j].innerText == 'true' ? `<input class="" type="radio" name="` + keys[i] + `"
                                                                value="true" checked="true">Active
                                                               <input class="" type="radio" name="`+ keys[i] + `" 
                                                                value="false">Inactive`:
                                        `<input class="" type="radio" name="` + keys[i] + `"
                                                                value="true">Active
                                                               <input class="" type="radio" name="`+ keys[i] + `" 
                                                                value="false" checked="true">Inactive`;
                                    $("#modalBody").append(`                     
                                      <div class="form-group">
                                         <label>`+ keys[i] + `</label>
                                         `+ htmlradio+`
                                      </div>
                                    `);
                                    break;

                                case 'lastUsedBy':
                                    $("#modalBody").append(`                     
                                         <div class="form-group" style="display: none;">
                                           <label>`+ keys[i] + `</label>
                                           <input class="form-control" type="text" name="`+ keys[i] + `" value="` + mydom[j].innerText + `">
                                         </div>
                                      `);
                                    break;
                                case 'describtion':
                                    $("#modalBody").append(`                     
                                         <div class="form-group">
                                           <label>`+ keys[i] + `</label>
                                            <textarea class="form-control" name="`+ keys[i] + `">`+ mydom[j].innerText +`</textarea>                                          
                                         </div>
                                      `);
                                    break;
                                case 'maximumDevieces':

                                    const htmlmaxdevice = mydom[j].innerText != 'null' ?
                                        ` <input class="form-control" type="text" name="` + keys[i] + `" value="` + mydom[j].innerText + `">` :
                                        ` <input class="form-control" type="text" name="` + keys[i] + `" value="N/A" readonly>`;

                                    $("#modalBody").append(`                     
                                         <div class="form-group">
                                           <label>`+ keys[i] + `</label>
                                          `+ htmlmaxdevice+`
                                         </div>
                                      `);
                                    
                                    break;
                                default:
                                    $("#modalBody").append(`                     
                                         <div class="form-group">
                                           <label>`+ keys[i] + `</label>
                                           <input class="form-control" type="text" name="`+ keys[i] + `" value="` + mydom[j].innerText + `">
                                         </div>
                                      `);
                            }  

                            
                        }
                    },
                    error: function (xhr, status, error) {
                        alert(error);
                    }
                });
            }

            $("#myModal").modal();
        }

        if (e.target.innerText == 'Delete') {
            var deleteID = this.parentElement.parentElement.children;

            $("#myModalDeleteBody").empty();
            $("#myModalDeleteBody").append(`
                   <input type="hidden" name="hiddenID" value="`+ deleteID[2].innerText + `">
                   <p>Are you sure to delete this record ?</p>`);
            $("#myModalDelete").modal();
        }
    });


    //Update functionality

    $('#btnUpdate').on('click', function (e) {
        e.preventDefault();
        var jsonArray = [];

        var splittedFormData = $("#updateForm").serialize().split('&');

        $.each(splittedFormData, function (key, value) {

            item = {};
            var splittedValue = value.split('=');
            //item["name"] = splittedValue[0];
            //item["value"] = splittedValue[1];
            item[splittedValue[0]] = splittedValue[1];
            jsonArray.push(item);
        });
        
        //console.log(jsonArray)
        console.log(JSON.stringify(jsonArray));

        $('#myModal').modal('toggle');
    });


    // Delete functionality

    $('#OkDelete').on('click', function (e) {
        e.preventDefault();        
        var id = $('#deleteForm').serialize().split('=')[1]; 
        $("#myModalDelete").modal('toggle');
         DeleteDeviceRecord(id);        
        
        
    });

    ////




}




