var mymap;

$(document).ready(function(){
    console.log('IM IN CONTACTS PAGE!!')
    init_map();
    showRead();

    // $('ul.navbar-nav').append('li').attr('class', 'nav-item')
    //                 .append('a').attr('class', 'nav-link').text('Create');
    //$('a').text('create').appendTo('#main-nav');
    $('#main-nav').append( "<li class = 'nav-item'> <a class = 'nav-link' id = 'create'> Create </li> ")
    

    $('.tabledata').each(function(){
        console.log($(this).data('details'));
        plot($(this).data('details'));
    })

    $('.tabledata').click(function(){
        var lat = $(this).data('details').Longitude;
        var lon = $(this).data('details').Latitude;
        console.log(lat + ", " + lon);
        var lt = L.latLng(lat, lon);
        mymap.flyTo(lt, 10);
    });

    $('tbody').on('click','#update' ,function(){
        var data = $(this).parent();
        data = data.parent();
        data = data.data('details');
        console.log('data'+ JSON.stringify(data));
        
        setUpdateFields(data);
        
        showUpdate();

    });

    $('#delete').click(function(){
        showDelete();
    });

    $('#create').click(function(){
        showCreate();
    });
})

function init_map(){
    mymap = L.map('contactmap').setView([0, 0], 1);
    
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
    var dat = data.name;
    L.marker([lat, lon]).bindPopup(dat).addTo(mymap);
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
    mask(false, true, false, false);
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