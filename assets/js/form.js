$(document).ready(function () {
  $("#pickup").autocomplete({
    source: function (e, t) {
      $.ajax({
        type: "GET",
        url: "https://booking.londontaxi247.co.uk/Home/Indextwo",
        dataType: "json",
        data: { Prefix: e.term },
        success: function (e) {
          var a = e.list;
          t(
            $.map(a, function (e) {
              return { label: e.address, value: e.address };
            })
          );
        },
      });
    },
  }),
    $("#dropof").autocomplete({
      source: function (e, t) {
        $.ajax({
          type: "GET",
          url: "https://booking.londontaxi247.co.uk/Home/Indextwo",
          dataType: "json",
          data: { Prefix: e.term },
          success: function (e) {
            var a = e.list;
            t(
              $.map(a, function (e) {
                return { label: e.address, value: e.address };
              })
            );
          },
        });
      },
    });
});

// ADDVIA();

var count = 0;
var via_list = $("#via-list");
let originalFields = [];
let tempFields = [];
const maxFields = 7;
let validAddresses = [];

$("#cusVias").click(function () {
    tempFields = [...originalFields];
    renderFields();
    $("#myModalvias").show();
});

function renderFields() {
    $(via_list).html("");
    tempFields.forEach((value, index) => {
        $(via_list).append(`
            <div class="field">
                <span class="error-message" id="emptyError-${index}">This field cannot be empty.</span>
                <span class="error-message" id="invalidError-${index}">Invalid value. Please select from the list.</span>
                <input value="${value}" data-index="${index}" class="fieldInput form-control viadata custom-via-input ui-autocomplete-input" type="text" placeholder="Enter a Location" autocomplete="off">
                <div class="inputListLoader">
                    <div class="inputListLoaderInner"></div>
                </div>
                <button class="removeField" data-index="${index}">X</button>
            </div>
        `);
    });
    toggleAddButton();
    applyAutocomplete();
}

function toggleAddButton() {
    if (tempFields.length >= maxFields) {
        $("#add-via").hide();
    } else {
        $("#add-via").show();
    }
}

function applyAutocomplete() {
    $(".fieldInput").each(function() {
        const listLoader = $(this).next('.inputListLoader');
        
        $(this).autocomplete({
            source: function (request, response) {
                listLoader.show();
                $.ajax({
                    type: "GET",
                    url: "https://booking.taxisnetwork.com/Home/Indextwo",
                    dataType: "json",
                    data: { Prefix: request.term },
                    success: function (data) {
                        let liveResults = data.list.map(item => item.address);
                        let combinedResults = [...new Set([...validAddresses, ...liveResults])];
                        let filteredResults = combinedResults.filter(addr => addr.toLowerCase().includes(request.term.toLowerCase()));
                        validAddresses = combinedResults;
                        response(filteredResults.map(address => ({ label: address, value: address })));
                    },
                    complete: function () {
                        listLoader.hide();
                    }
                });
            },
            select: function(event, ui) {
                let index = $(this).data("index");
                tempFields[index] = ui.item.value;
                $(this).val(ui.item.value);
                $(this).blur();
                $(`#emptyError-${index}`).hide();
                $(`#invalidError-${index}`).hide();
                return false;
            }
        });

        
    });
}

$(document).on("click", ".removeField", function () {
    let index = $(this).data("index");
    tempFields.splice(index, 1);
    renderFields();
});

$("#add-via").click(function () {
    if (tempFields.length < maxFields) {
        tempFields.push("");
        renderFields();
    }
});


$(document).on("input", ".fieldInput", function () {
    let index = $(this).data("index");
    tempFields[index] = $(this).val();
    $(`#emptyError-${index}`).hide();
    $(`#invalidError-${index}`).hide();
});

$("#updateVia").click(function () {
    let allValid = true;

    tempFields.forEach((field, index) => {
        let trimmedField = field.trim();

        if (trimmedField === "") {
            $(`#emptyError-${index}`).show();
            allValid = false;
        } else if (!validAddresses.some(addr => addr.toLowerCase() === trimmedField.toLowerCase())) {
            $(`#invalidError-${index}`).show();
            allValid = false;
        }
    });

    if (allValid) {
        originalFields = [...tempFields];
        document.getElementById("via").value = originalFields.length + " Vias";
        $('#myModalvias').modal('hide');
    }
});

$('#cusCloseModal').on('hidden.bs.modal', function () {
    $(".error-message").hide();
});

get_date_time_in_inputs();

function get_date_time_in_inputs() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  var hours = today.getHours();
  var min = today.getMinutes();

  var min_2 = 60 - min;

  if (min_2 < 15 || min_2 == 60) {
    if (min_2 == 60) {
      hours = hours;
      min = 15;
    } else {
      hours = hours + 1;
      min = 15 - min_2;
    }
  } else {
    min = min + 15;
    if (min == 60) {
      hours = hours + 1;
      min = 0;
    }
  }

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (min < 10) {
    min = "0" + min;
  }

  var time = hours + ":" + min;

  //today = mm + '-' + dd + '-' + yyyy;
  //today = mm + '/' + dd + '/' + yyyy;
  //today = dd + '-' + mm + '-' + yyyy;
  today = yyyy + "-" + mm + "-" + dd;
  $("#book_pick_date").val(today);
  $("#book_pick_time").val(time);
}

function TDate() {
  var ToDate = new Date();
  var userdate = new Date(document.getElementById("book_pick_date").value)
    .toJSON()
    .slice(0, 10);
  var today = new Date().toJSON().slice(0, 10);

  if (userdate < today) {
    //alert("The Date must be Bigger or Equal to today date");
    alert("Do Not Select the Previous Data");

    document.getElementById("book_pick_date").value = ToDate.getDate();
    $("#book_pick_date").val("");
  } else {
    getTime();
  }
}

function iswaitnreturn(e) {
  if ($(e).val() == "WR") {
    $("#myModalitem").modal({
      show: true,
      keyboard: false,
      backdrop: "static",
    });
  } else {
    waitingtime = 0;
  }
}

function savewaitnreturn() {
  $("#myModalitem").modal("toggle");
  waitingtime = $("#minwaittime").val();
}

var accuserdb = "";

    function addvalue(e) {
        var mytext = $(e).text();
        var mytype = $(e).attr("luggagetype");
        $('#number').val("");
        $('#nameid').val(mytext);
        $('#nametype').val(mytype);
        if (accuserdb.includes(mytext)) {
            var s = accuserdb.split(mytext)[0];
            var ss = s.substr(s.length - 3).trim();
            var ssss = ss[0];
            $('#number').val(ssss);
        }
        $('#moreModalitem').modal('hide');
        $('#itemcount').modal('show');
    }
    
    function removeitem(e) {
        var arr = accuserdb.split(',');
        var le = $(e).parent().parent().text().trim();
        var ind = arr.indexOf(le)
        arr.splice(ind, 1);
        accuserdb = arr.join();
        $(e).parent().parent().parent().remove();
    }
    
    
    function additem(e, val, type) {
        var text = e.trim();
        var myid = text.replace(/\s/g, '').replace(/[^\w]/g, '');
    
        if (accuserdb.includes(text)) {
            var accuser = accuserdb.split(",");
            var tempacc = [];
            accuser.forEach(function (item) {
                if (item.includes(text)) {
                    var newVal = parseInt(val);
                    var newItem = `${newVal} ${text}`;
                    tempacc.push(newItem);
                    var myidd = `id_${myid}`;
                    $(`#${myidd}`).html(`
                        <input class="form-control holddatainput" data-sendval="${newVal}@${text}" value="${newItem}" disabled data-type="${val} ${type}">
                        <div class="input-group-addon">
                            <button type="button" class="btn input-grp-btns" onclick="removeitem(this)">
                                <img class="form-icons" src="assets/images/delete.png" alt="luggage delete" width="20">
                            </button>
                        </div>`);
                } else {
                    tempacc.push(item);
                }
            });
            accuserdb = tempacc.join(',');
            return;
        }
        insertitem(text, val, type);
    }
    
    function insertitem(text, val, type) {
        var myid = text.replace(/\s/g, '').replace(/[^\w]/g, '');
        var newItem = `${val} ${text}`;
    
        var tag = `
            <div class="col-lg-3 col-md-4 col-xs-12">
                <div id="id_${myid}" class="input-group mb-2" data-type="${val} ${type}">
                    <input class="form-control holddatainput" data-sendval="${val}@${text}" value="${newItem}" disabled data-type="${val} ${type}">
                    <div class="input-group-addon">
                        <button type="button" class="btn input-grp-btns del-btn_" onclick="removeitem(this)">
                            <img class="form-icons" src="assets/images/delete.png" alt="luggage delete" width="20">
                        </button>
                    </div>
                </div>
            </div>`;
    
        if (!accuserdb.includes(newItem)) {
            if (accuserdb) {
                accuserdb += ",";
            }
            accuserdb += newItem;
        }
        console.log(accuserdb)
        $('#holdabledata').append(tag);
    }

$(".close-luggage").click(function () {
  if ($(".collapse").hasClass("in")) {
    $(".collapse").removeClass("in");
    $(".luggage-btns").addClass("collapsed");
  }
});

function addHoursToDate(date, hours) {
  return new Date(new Date(date).setHours(date.getHours() + hours));
}

var listvias = [];
var inputsvalues, arrcheckincabin, Array_Luggage_text;
$(document).ready(function () {
  var arr2 = [
    "TV(lessthan30inches)",
    "Ironingboard",
    "Musicspeaker(Large)",
    "Mirror(upto60x36inches)",
    "Rug(upto24x84inches)",
    "SingleMattress",
    "Bedsidetable(45x55cm)",
    "Microwaveoven",
    "Vacuumcleaner",
    "TVstand",
    "Largemusicalinstrumentcase(upto60x24inches)",
    "TV(30to60inches)",
  ];

  $("#get-quotes").click(function () {
    var date = $("#book_pick_date").val();
    var time = $("#book_pick_time").val();
    var d = date + " " + time;
    let myDate = new Date();
    var currrent = addHoursToDate(myDate, 1); //.getTime() / 1000;
    // const currentDate = ((Math.round(currrent.getTime() / 1000)) - 100);
    // var v = toTimestamp(d);
    // if (v < (currentDate-1)) {
    //     alert('ERROR!\nInvalid Date Time\nRequired One Hour Notice To book Online');
    //     return;
    // }

    function toTimestamp(strDate) {
      var datum = Date.parse(strDate);
      return datum / 1000;
    }

    inputsvalues = new Array();
    itemsValues = new Array();
    Array_Luggage_text = new Array();
    arrcheckincabin = new Array();
    var inputs = $(".holddatainput");
    for (var i = 0; i < inputs.length; i++) {
      itemsValues.push(inputs.data("sendval"));
      inputsvalues.push($(inputs[i]).data("sendval"));
      // arrcheckincabin.push($(inputs[i]).parent().attr('id'));
      arrcheckincabin.push($(inputs[i]).data("type"));
    }

    var cabinfinal = 0;
    var checkinfinal = 0;
    var passengerfinal = 0;
    for (var j = 0; j < arrcheckincabin.length; j++) {
      var ret = arrcheckincabin[j].split(" ");
      ret = ret.filter(function (el) {
        return el != null && el != "";
      });
      if (ret[1] == "cabin") {
        cabinfinal += parseInt(ret[0]);
      } else if (ret[1] == "checkin") {
        checkinfinal += parseInt(ret[0]);
      } else if (ret[1] == "passenger") {
        passengerfinal += parseInt(ret[0]);
      }
    }

    console.log(cabinfinal);
    console.log(checkinfinal);
    console.log(passengerfinal);

    var pickup = $("#pickup").val();
    var dropoff = $("#dropof").val();
    var datetxt = $("#book_pick_date").val();
    var hm = time.split(":");
    var hourstxt = hm[0];
    var minutstxt = hm[1];
    var passengers = $("#Passenger").val();
    var TripFlag = $("#journeytype").val();
    var WaitingMints = $("#minwaittime").val();
    var frmDrNmbr = $("#book_pick_from_doorno").val();
    var toDrNmbr = $("#book_pick_to_doorno").val();

    // var pickup = $("#pickup").val();
    // var dropoff = $("#dropof").val();
    // var datetxt = $("#book_pick_date").val();
    // var hm = time.split(':');
    // var hourstxt = hm[0];
    // var minutstxt = hm[1];
    // var passengers = $('#Passenger').val();
    // var TripFlag = $('#journeytype').val();
    // var WaitingMints = $('#minwaittime').val();

    // debugger;
    // listvias = $('.viadata').map((_, el) => el.value + "@").get();

    // let listvias = $('.viadata').map((_, el) => el.value.replace(/[|,]/g, '')).get();
    // let listvias = $('.viadata').map((_, el) => el.value.replace(/[|,]/g, '@')).get();
    //listvias = $('.viadata').map((_, el) => el.value.replace(/[|,]/g, '@')).get();
    let listvias = $(".viadata")
      .map((_, el) => el.value.replace(/\|,/g, "@"))
      .get();

    listvias = listvias.filter(function (v) {
      return v !== "";
    });

    let finalList = listvias.join("@");

    passengers = parseFloat(passengers) + parseInt(passengerfinal);
    var isContains = false;
    var obj = [];
    obj.push(cabinfinal);
    obj.push(checkinfinal);
    obj.push(passengers);
    obj.push(datetxt);
    obj.push(hourstxt);
    obj.push(minutstxt);
    //-------------------ajax call--------------
    var office_name = "LNT";
    var color_code = "1a3a6d";
    var office_details = "LNT,Cheap London Taxi,https://cheaplondontaxi.co.uk/,02037403527";

    // for (let j = 0; j < itemsValues.length; j++) {
    //    console.log(String(itemsValues[j]).replaceAll(' ',''));
    //   isContains=   arr2.includes(itemsValues[j].replaceAll(' ',''))
    //  console.log(isContains);
    //   }

    if (
      pickup == "" ||
      pickup == null ||
      dropoff == "" ||
      dropoff == null ||
      datetxt == "" ||
      passengers == NaN ||
      minutstxt == "" ||
      hourstxt == ""
    ) {
      alert("ERROR!\nPlease select all things correctly.");
    } else {
      $(".loading-div").css("display", "block");
      $(document.body).css("overflow", "hidden");

      // window.location.href = "https://booking.londontaxi247.co.uk/OurVehicle/OurVehicle?luggage_text=" + inputsvalues + "&pickup=" + pickup + "&checkurl=" + true + "&dropoff=" + dropoff + "&office_details=" + office_details + "&luggageobject=" + obj + "&listviasaddress=" + listvias +"&tripFlag=" +TripFlag +"&mints="+WaitingMints;

      // window.location.href = "https://booking.londontaxi247.co.uk/OurVehicle/OurVehicle?luggage_text=" + inputsvalues + "&pickup=" + pickup + "&checkurl=" + true + "&dropoff=" + dropoff + "&office_details=" + office_details + "&luggageobject=" + obj + "&listviasaddress=" + listvias + "&tripFlag=" + TripFlag + "&mints=" + WaitingMints + "&fromDoorNumber=" + frmDrNmbr + "&toDoorNumber=" + toDrNmbr;
      // window.location.href = "http://localhost:52716//OurVehicle/OurVehicle?luggage_text=" + inputsvalues + "&pickup=" + pickup + "&checkurl=" + true + "&dropoff=" + dropoff + "&office_details=" + office_details + "&luggageobject=" + obj + "&listviasaddress=" + listvias + "&tripFlag=" + TripFlag + "&mints=" + WaitingMints + "&fromDoorNumber=" + frmDrNmbr + "&toDoorNumber=" + toDrNmbr +"&showVehicle="+isContains;
      window.location.href =
        "https://booking.londontaxi247.co.uk/OurVehicle/OurVehicle?luggage_text=" +
        inputsvalues +
        "&pickup=" +
        pickup +
        "&checkurl=" +
        true +
        "&dropoff=" +
        dropoff +
        "&office_details=" +
        office_details +
        "&luggageobject=" +
        obj +
        "&listviasaddress=" +
        `${finalList}` +
        "&tripFlag=" +
        TripFlag +
        "&mints=" +
        WaitingMints +
        "&fromDoorNumber=" +
        frmDrNmbr +
        "&toDoorNumber=" +
        toDrNmbr +
        "&showVehicle=" +
        isContains +
        "&colorCode=" +
        color_code;

      $(window).bind("pageshow", function (event) {
        $(".loading-div").css("display", "none");
        $(document.body).css("overflow", "");
      });
    }
  });
});

// $(document).ready(function(event) {
//     $('.loading-div').css('transform', 'scale(0)');
//             $(document.body).css('overflow', '');
// });

$("#pickup").select2({
  placeholder: "Select pickup address",
  ajax: {
    url: "https://booking.londontaxi247.co.uk/Home/Indextwo",

    data: function (data) {
      return {
        Prefix: data.term, // search term
      };
    },
    processResults: function (response) {
      return {
        results: $.map(response.list, function (obj) {
          return { id: obj.address, text: obj.address };
        }),
      };
    },
  },
  minimumInputLength: 3,
});
$("#dropof").select2({
  placeholder: "Select dropoff address",
  ajax: {
    url: "https://booking.londontaxi247.co.uk/Home/Indextwo",

    data: function (data) {
      return {
        Prefix: data.term, // search term
      };
    },
    processResults: function (response) {
      return {
        results: $.map(response.list, function (obj) {
          return { id: obj.address, text: obj.address };
        }),
      };
    },
  },
  minimumInputLength: 3,
});

//   my-JS Start

//   my-JS End

// airport icon JS

document.addEventListener("DOMContentLoaded", function () {
  // Function to handle dropdown selections
  function setupModal(modalId, outputId) {
    const modal = document.getElementById(modalId);
    const modalItems = modal.querySelectorAll(".airportNames button");
    const selectedElement = document.getElementById(outputId);

    modalItems.forEach((item) => {
      item.addEventListener("click", function (event) {
        selectedElement.innerHTML = "";
        event.preventDefault(); // Prevent the default link behavior
        const valuedrop = item.getAttribute("data-value");
        console.log(valuedrop);
        // selectedElement.textContent = 'Selected: ' + valuedrop;
        var option = document.createElement("option");
        option.value = valuedrop;
        option.text = valuedrop;
        selectedElement.appendChild(option);
      });
    });
  }

  // Setup both modals
  setupModal("airportListModal1", "pickup");
  setupModal("airportListModal2", "dropof");
});

$("button").click(function () {
  event.preventDefault();
});

// airport icon JS