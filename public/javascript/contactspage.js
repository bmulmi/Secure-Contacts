var mymap;

$(document).ready(function(){
    console.log('IM IN CONTACTS PAGE!!')
    init_map();

    $('.tabledata').click(function(){

    })
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
