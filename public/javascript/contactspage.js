var mymap;
var mypopups = [];

init_map();

addremovebuttons();
showRead();

/*---------------add and remove buttons on the nav bar for ajax calls------------*/
function addremovebuttons() {
  $("#main-contact-btn").remove();

  $("#main-form-btn").remove();

  $("#main-nav").append(
    '<li class = "nav-item"/> <a class = "nav-link" id = "read"> Contacts '
  );

  $("#main-nav").append(
    "<li class = 'nav-item'/> <a class = 'nav-link' id = 'create'> Create"
  );

  $("#main-nav").append(
    "<li class = 'nav-item'/> <a class = 'nav-link' id = 'logout' href='logout'> Logout"
  );
}

/*---------------table row update button handler------------*/
$("tbody").on("click", "#update", function () {
  var data = $(this).parent();
  data = data.parent();
  data = data.data("details");

  setUpdateFields(data);

  showUpdate();
});

/*------------update form submit button handler-------------*/
$("#update_page button").click(function () {
  var myform = $("#update-form").serializeArray();
  var formdata = getFormData(myform);

  var jax = $.post("contacts/update", { formdata: formdata });
  jax.done(function (data) {
    console.log("done updating in database.");
    showRead();
  });
});

/*--------------table row on click response---------------*/
$("tbody").on("click", "#delete", function () {
  var data = $(this).parent();
  data = data.parent();
  data = data.data("details");
  var id = data._id;

  // make ajax call to delete and show read page
  var j = $.post("contacts/delete", { id: id });
  j.done(function () {
    console.log("done deleting!");
    showRead();
  });
});

/*-----------nav bar create button handler----------------*/
$("#main-nav").on("click", "#create", function () {
  showCreate();
});

/*-----------nav bar contacts button handler--------------*/
$("#main-nav").on("click", "#read", function () {
  showRead();
});

/*-----------create page submit button handler-----------*/
$("#create_page button").click(function () {
  var myform = $("#create-form").serializeArray();
  var formdata = getFormData(myform);

  //reset the form data
  $("#create-form").each(function () {
    this.reset();
  });

  var ja = $.post("contacts/create", { formdata: formdata });
  ja.done(function (data) {
    console.log("done creating in database.");
    showRead();
  });
  //console.log("herererererere");
});

/*-----------search by name-------------- */
$("#search_name").keyup(function () {
  var val = this.value.split(" ");
  var rows = $("#contactbody").find("tr");

  if (this.value == "") {
    rows.show();
    return;
  }

  //first hide the table body
  rows.hide();
  //only show the filtered data
  rows
    .filter(function (i, v) {
      var $obj = $(this);
      for (var j = 0; j < val.length; ++j) {
        if ($obj.text().toLowerCase().indexOf(val[j]) > -1) {
          return true;
        }
      }
      return false;
    })
    .show();
});

/*---------------initialize map------------------- */
function init_map() {
  mymap = L.map("contactmap").setView([0, 0], 2);

  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data & copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken:
        "pk.eyJ1IjoiYm11bG1pIiwiYSI6ImNqcGZ0bnF2cDAxc2MzcnBqeTc2YXhpNjcifQ.xy8SiaohlWlETvM0INXpKg",
    }
  ).addTo(mymap);
}

/*-----------------plots markers------------------- */
function plot(data) {
  var lat = data.Latitude;
  var lon = data.Longitude;
  var dat = data.FirstName + " " + data.LastName;
  var popup = L.marker([lat, lon]);
  popup.bindPopup(dat).addTo(mymap);
  mypopups.push(popup);
}

/*------------------get the form data from update and create contacts---------------*/
function getFormData(data) {
  var dat = {};
  for (each of data) {
    dat[each.name] = each.value;
  }

  //set unchecked 'contact by' boxes to false
  var temp = $("#update-form input:checkbox:not(:checked)").each(function () {
    var name = $(this).attr("name");
    dat[name] = false;
    console.log($(this).attr("name"));
  });

  return dat;
}

/*-----------------fill up input fields in the update page-------------------*/
function setUpdateFields(data) {
  $("#update_page input[name=firstname]").val(data.FirstName);
  $("#update_page input[name=lastname").val(data.LastName);
  $("#update_page input[name=street]").val(data.Street);
  $("#update_page input[name=city]").val(data.City);
  $("#update_page input[name=state]").val(data.State);
  $("#update_page input[name=zip]").val(data.Zip);
  $("#update_page input[name=phone]").val(data.Phone);
  $("#update_page input[name=email]").val(data.Email);
  $("#update_page input[name=id]").val(data._id);

  if (data.Prefix == "Mr")
    $('#update_page input[value="Mr"]').attr("checked", "checked");
  if (data.Prefix == "Mrs")
    $('#update_page input[value="Mrs"]').attr("checked", "checked");
  if (data.Prefix == "Ms")
    $('#update_page input[value="Ms"]').attr("checked", "checked");
  if (data.Prefix == "Dr")
    $('#update_page input[value="Dr"]').attr("checked", "checked");

  if (data.State == "NJ")
    $('.selState option[value="NJ"]').attr("selected", "selected");
  if (data.State == "NY")
    $('.selState option[value="NY"]').attr("selected", "selected");
  if (data.State == "PA")
    $('.selState option[value="PA"]').attr("selected", "selected");
  if (data.State == "CT")
    $('.selState option[value="CT"]').attr("selected", "selected");

  if (data.ContactbyMail) $("input[name=mailchk]").attr("checked", "checked");
  if (data.ContactbyPhone) $("input[name=phonechk]").attr("checked", "checked");
  if (data.ContactbyEmail) $("input[name=emailchk]").attr("checked", "checked");
}

function showCreate() {
  mask(true, false, false);
}

function showRead() {
  var jax = $.post("contacts/read", {});
  jax.done(function (data) {
    //remove the earlier table rows
    $("#contactbody tr").remove();

    //add the most recent data to the table rows
    for (i in data) {
      var row = $("<tr>").addClass("tabledata");

      var name =
        data[i].Prefix + ". " + data[i].FirstName + " " + data[i].LastName;
      var address =
        data[i].Street +
        ", " +
        data[i].City +
        ", " +
        data[i].State +
        ", " +
        data[i].Zip;
      var phone = data[i].Phone;
      var email = data[i].Email;

      var tdname = $("<td>").text(name);
      var tdaddress = $("<td>").text(address);
      var tdphone = $("<td>").text(phone);
      var tdemail = $("<td>").text(email);
      var delbtn = $("<button>")
        .attr("id", "delete")
        .addClass("btn btn-danger")
        .text("delete");
      var upbtn = $("<button>")
        .attr("id", "update")
        .addClass("btn btn-info")
        .text("update");
      var tddel = $("<td>").append(delbtn);
      var tdup = $("<td>").append(upbtn);

      row.attr("data-details", JSON.stringify(data[i]));
      row.append(tdname);
      row.append(tdaddress);
      row.append(tdphone);
      row.append(tdemail);
      row.append(tddel);
      row.append(tdup);

      $("#contactbody").append(row);
    }

    //show the read section
    mask(false, true, false);

    //unplot the earlier markers
    for (i in mypopups) {
      console.log("removing");
      console.log(mypopups[i]);
      mypopups[i].unbindPopup();
      mymap.removeLayer(mypopups[i]);
    }

    //reset mypopus
    mypopups = [];
    console.log("popups reset successful!!");

    //plot the updated map
    $(".tabledata").each(function () {
      plot($(this).data("details"));
    });

    //assign on click fucntion to each table row
    $(".tabledata").click(function () {
      var lat = $(this).data("details").Latitude;
      var lon = $(this).data("details").Longitude;
      console.log(lat + ", " + lon);
      var lt = L.latLng(lat, lon);
      mymap.flyTo(lt, 12);
    });
  });
}

function showUpdate() {
  mask(false, false, true);
}

function mask(create, read, updated) {
  create ? $("#create_page").show() : $("#create_page").hide();
  read ? $("#read_page").show() : $("#read_page").hide();
  updated ? $("#update_page").show() : $("#update_page").hide();
}
