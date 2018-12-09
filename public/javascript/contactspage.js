var mymap;

$(document).ready(function(){
    console.log('IM IN CONTACTS PAGE!!')
    init_map();

    $('.tabledata').each(function(){
        console.log($(this).data());
        plot($(this).data());
    })

    $('.tabledata').click(function(){
        var lat = $(this).data("latitude");
        var lon = $(this).data("longitude");
        console.log(lat + ", " + lon);
        var lt = L.latLng(lat, lon);
        mymap.flyTo(lt, 10);
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
    var lat = data.latitude;
    var lon = data.longitude;
    var dat = data.name + "\n" + data.address + "\n" + data.phone;
    L.marker([lat, lon]).bindPopup(dat).addTo(mymap);
}
