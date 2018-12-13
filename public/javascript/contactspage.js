var mymap;

$(document).ready(function(){
    //console.log('IM IN CONTACTS PAGE!!')
    init_map();
    var task = [];

    showRead();

    $('#main-nav').append( "<li class = 'nav-item'> <a class = 'nav-link' id = 'create'> Create </li> ")
    
    //plot the map
    //$('<tr>').each(function(){
         //console.log("PLOTTING");

         //console.log($(this).data('details'));
         //plot($(this).data('details'));
    //});

    //on click listener for each table row
    // $('.tabledata').click(function(){
    //     var lat = $(this).data('details').Latitude;
    //     var lon = $(this).data('details').Longitude;
    //     console.log(lat + ", " + lon);
    //     var lt = L.latLng(lat, lon);
    //     mymap.flyTo(lt, 10);
    // });

    //update button handler 
    $('tbody').on('click','#update' ,function(){
        var data = $(this).parent();
        data = data.parent();
        data = data.data('details');
        //console.log(data.Prefix);
        //console.log('data '+ JSON.stringify(data));
        
        setUpdateFields(data);
        
        showUpdate();
    });

    //update form submit button handler
    $('#update_page button').click(function(){
        //post the form
        //var formdata = new FormData(JSON.stringify(myform[0]));
        //console.log(JSON.stringify(formdata));
        //var myform = document.getElementById('update-form');
        //console.log("OUTPUTTINGGGGG \n" + JSON.stringify(myform));
        var myform = $('#update-form').serializeArray();
        var formdata = getFormData(myform);
                
        var jax = $.post('contacts/update', { formdata : formdata });
        jax.done(function(data){
            console.log("done updating in database.");
            unplot(formdata);
            showRead();
        });
    });

    //handler for delete button on each row
    $('tbody').on('click', '#delete', function(){
        var data = $(this).parent();
        data = data.parent();
        data = data.data('details');
        //console.log(data);
        var id = data._id;
        //console.log("my id is: ");
        //console.log(id);
        var j = $.post('contacts/delete', {id : id});
        j.done(function(){
            console.log("done deleting!");
            unplot(data);
            showRead();
        })
        //showDelete();
    });

    //handler for create button on the nav bar
    $('#main-nav').on('click', '#create', function(){
        showCreate();
    });

    $('#create_page button').click(function(){
        var myform = $('#create-form').serializeArray();
        var formdata = getFormData(myform);

        var ja = $.post('contacts/create', { formdata : formdata });
        ja.done(function(data){
            console.log("done creating in database.");
            showRead();
        });
        //console.log("herererererere");
    })
})

function init_map(){
    mymap = L.map('contactmap').setView([0, 0], 2);
    
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data & copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYm11bG1pIiwiYSI6ImNqcGZ0bnF2cDAxc2MzcnBqeTc2YXhpNjcifQ.xy8SiaohlWlETvM0INXpKg'
    }).addTo(mymap);
}

function plot(data){
    var lat = data.Latitude;
    var lon = data.Longitude;
    console.log("Plotting from:");
    console.log(data);
    var dat = data.name;
    L.marker([lat, lon]).bindPopup(dat).addTo(mymap);
}

function unplot(data){
    var lat = data.Latitude;
    var lon = data.Longitude;console.log("UnPlotting from:");
    console.log(data);
    L.marker([lat, lon]).unbindPopup().addTo(mymap);
}

//to get update-form data as a javascript object
function getFormData(data){
    var dat = {};
    for (each of data) {
        //console.log(each.name +"= "+ each.value);
        dat[each.name] = each.value;
    }
    
    //set unchecked contact by boxes to false
    var temp = $('#update-form input:checkbox:not(:checked)').each(function(){
        var name = $(this).attr('name');
        dat[name] = false;
        console.log($(this).attr('name'));
    });

    return dat;
}

function setUpdateFields(data){
    $('#update_page input[name=firstname]').val(data.FirstName);
    $('#update_page input[name=lastname').val(data.LastName);
    $('#update_page input[name=street]').val(data.Street);
    $('#update_page input[name=city]').val(data.City);
    $('#update_page input[name=state]').val(data.State);
    $('#update_page input[name=zip]').val(data.Zip);
    $('#update_page input[name=phone]').val(data.Phone);
    $('#update_page input[name=email]').val(data.Email);
    $('#update_page input[name=id]').val(data._id);

    if (data.Prefix == "Mr") $('#update_page input[value="Mr"]').attr('checked', 'checked');
    if (data.Prefix == "Mrs") $('#update_page input[value="Mrs"]').attr('checked', 'checked');
    if (data.Prefix == "Ms") $('#update_page input[value="Ms"]').attr('checked', 'checked');
    if (data.Prefix == "Dr")  $('#update_page input[value="Dr"]').attr('checked', 'checked');

    if (data.State == "NJ") $('.selState option[value="NJ"]').attr('selected', 'selected');
    if (data.State == "NY") $('.selState option[value="NY"]').attr('selected', 'selected');
    if (data.State == "PA") $('.selState option[value="PA"]').attr('selected', 'selected');
    if (data.State == "CT") $('.selState option[value="CT"]').attr('selected', 'selected');
    
    if (data.ContactbyMail) $('input[name=mailchk]').attr('checked', 'checked');
    if (data.ContactbyPhone)$('input[name=phonechk]').attr('checked', 'checked');
    if (data.ContactbyEmail) $('input[name=emailchk]').attr('checked', 'checked');
}

function showCreate(){
    mask(true, false, false, false);
}

function showRead(){
    //console.log("in show read");
    var jax = $.post('contacts/read', { });
    jax.done(function(data){
        //console.log(data);
        $('#contactbody tr').remove();
        //$('#contacttable').append('<tbody id = "contactbody">');

        for (i in data){
            var row = $('<tr>').addClass('tabledata');

            var name = data[i].Prefix + '. ' + data[i].FirstName + ' ' + data[i].LastName
            var address = data[i].Street + ', ' + data[i].City + ', ' + data[i].State + ', ' + data[i].Zip
            var phone = data[i].Phone
            var email = data[i].Email

            var tdname = $('<td>').text(name);
            var tdaddress = $('<td>').text(address);
            var tdphone = $('<td>').text(phone);
            var tdemail = $('<td>').text(email);
            var delbtn = $('<button>').attr('id','delete').addClass("btn btn-danger").text("delete");
            var upbtn = $('<button>').attr('id','update').addClass("btn btn-info").text("update");
            var tddel = $('<td>').append(delbtn);
            var tdup = $('<td>').append(upbtn);
            //console.log("AFTER UPDATING");
            //console.log(data[i]);

            row.attr('data-details', JSON.stringify(data[i]));
            row.append(tdname);
            row.append(tdaddress);
            row.append(tdphone);
            row.append(tdemail);
            row.append(tddel);
            row.append(tdup);

            $('#contactbody').append(row);
        }

        //show the read section
        mask(false, true, false, false);

        //plot the updated map
        $('.tabledata').each(function(){
            plot($(this).data('details'));
        });

        //assign on click fucntion to each table row
        $('.tabledata').click(function(){
            var lat = $(this).data('details').Latitude;
            var lon = $(this).data('details').Longitude;
            console.log(lat + ", " + lon);
            var lt = L.latLng(lat, lon);
            mymap.flyTo(lt, 10);
        });
    });
}

function showDelete(){
    mask(false, false, true, false);
}

function showUpdate(){
    mask(false, false, false, true);
}

function mask(create, read, deleted, updated){
    create ? $('#create_page').show() : $('#create_page').hide();
    read ? $('#read_page').show() : $('#read_page').hide();
    deleted ? $('#delete_page').show() : $('#delete_page').hide();
    updated ? $('#update_page').show() : $('#update_page').hide();
}