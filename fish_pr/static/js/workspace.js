//-------Profile-----

function updateFilters() {

    if (currUserID != "None") {
        updateData = new FormData();
        updateData.append("userID", currUserID);
        updateData.append("typeInfo", "filters");
        updateData.append("is_selfPlaces",
            $("#is_selfPlacesID").prop("checked"));
        updateData.append("is_Base",
            $("#is_BaseID").prop("checked"));
        updateData.append("is_carAccessibility",
            $("#is_carAccessibilityID").prop("checked"));
        updateData.append("is_busAccessibility",
            $("#is_busAccessibilityID").prop("checked"));

        $.ajax({
            type: "POST",
            url: "/update_profile/",
            data: updateData,
            contentType: false, // NEEDED, DON"T OMIT THIS
            processData: false, // NEEDED, DON"T OMIT THIS
            success: function(response) {
                console.log("response_update_profile:  ");
                console.log(response);

                if (response == 1) {
                    console.log("ok");

                }
            },
            error: function(error) {
                console.log("updateProfile_ERROR:");
                console.log(error);
            }
        });
    } else {
        console.log("none");
    }
}

//-------Place-----------

function addPlace() {

    addPlaceData = new FormData();
    addPlaceData.append("userID", currUserID);
    addPlaceData.append("name",
        $("#fPlaceAdd_nameID").val());
    addPlaceData.append("lant",
        $("#fPlaceAdd_lantID").val());
    addPlaceData.append("long",
        $("#fPlaceAdd_longID").val());
    addPlaceData.append("isBase",
        $("#fPlaceAdd_isBaseID").prop("checked"));
    addPlaceData.append("description",
        $("#fPlaceAdd_descriptionID").val());
    addPlaceData.append("busAccessability",
        $("#fPlaceAdd_busAccessabilityID").prop("checked"));
    addPlaceData.append("carAccessability",
        $("#fPlaceAdd_carAccessabilityID").prop("checked"));

    var place_photos = $("#place_photosID")[0].files;
    console.log(place_photos);
    Array.from(place_photos).forEach((place_photo) => {
        console.log(place_photo);
        addPlaceData.append("place_files[]", place_photo);
    });


    $.ajax({
        type: "POST",
        url: "/add_place/",
        data: addPlaceData,
        contentType: false, // NEEDED, DON"T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON"T OMIT THIS
        success: function(response) {
            console.log("response_addPlaceData:  ");
            console.log(response);

            if (response > 0) {
                console.log("place added!");
                document.getElementById("PlaceAddID").reset();
                closeForm("place_add");
                $("#messageID").html("Место успешно добавлено!");
                $("#messageID").bPopup({
                    autoClose: 2000
                });
                reloadPlaces();
            } else {
                $("#messageID").html("Место с таким названием уже существует!");
                $("#messageID").bPopup({
                    autoClose: 2000
                });
            }
        },
        error: function(error) {
            console.log("addPlaceData_ERROR:");
            console.log(error);
        }
    });
}

function deletePlace() {

    console.log("currPlaceID::");
    console.log(currPlaceID);
    if (confirm("Вы увепены, что хотите удалить данное место?")) {
        $.ajax({
            type: "POST",
            url: "/delete_place/",
            data: {
                "place_id": currPlaceID
            },
            success: function(response) {
                console.log("response_DeletePlace:  ");
                console.log(response);
                if (response == 1) {
                    console.log("place deleted!");
                    hidePlaceContent();
                    $("#messageID").html("Место удалено!");
                    $("#messageID").bPopup({
                        autoClose: 2000//Auto closes after 1000ms/1sec
                    });
                    $('#place_contentID').modal('hide');
                    reloadPlaces();
                } else {
                    $("#messageID").html("Место не было удалено!");
                    $("#messageID").bPopup({
                        autoClose: 2000 //Auto closes after 1000ms/1sec
                    });
                }
            },
            error: function(error) {
                console.log("response_DeletePlace_ERROR:");
                console.log(error);
            }
        });
    }
}

function reloadPlaces() {
    set_places();
}

function set_places() {

    // filters = { is_selfPlaces :
    //                 $("#is_selfPlacesID").prop("checked"),
    //             is_Base :
    //                 $("#is_BaseID").prop("checked"),
    //             is_carAccessibility :
    //                 $("#is_carAccessibilityID").prop("checked"),
    //             is_busAccessibility :
    //                 $("#is_busAccessibilityID").prop("checked") }

    filters = { is_selfPlaces :
                    false,
                is_Base :
                    false,
                is_carAccessibility :
                    false,
                is_busAccessibility :
                    false }



    filters_json = JSON.stringify(filters);

    $.ajax({
        type: "POST",
        url: "/get_places/",
        data:  {
            "filters": filters_json
        },
        success: function(response) {
            console.log("response:  ");
            console.log(response);
            ymaps.ready(function () {
                map.geoObjects.removeAll();
                response.forEach(function(place) {
                    console.log(place.name);
                    let myPlacemark1 = new ymaps.Placemark(
                        [place.lant,
                        place.long],
                        {
                            iconContent: place.name
                        }, {
                            preset: "islands#darkOrangeStretchyIcon"
                        });
                    myPlacemark1.events.add('click',  function(e) {
                        console.log("click cluck");
                        // $("#place_contentID").hide();
                        // $("#orders_contentID").hide();

                        currPlaceID = place.id;
                        console.log(currPlaceID);


                        get_place_info();

                    });
                    map.geoObjects.add(myPlacemark1);
                });
            });
        },
        error: function(error) {
            console.log("set_places_error:");
            console.log(error);
        }
    });
    }

function get_place_info() {
    $.ajax({
        type: "POST",
        url: "/get_place_info/",
        data: {
            "data_type": "info",
            "place_id": currPlaceID,
        },
        type: "POST",
        success: function(get_place_info_response) {
            console.log("get_place_info_response:  ");
            console.log(get_place_info_response);
            $("#place_id").html(get_place_info_response[0].id);
            $("#place_name").html(get_place_info_response[0].name);
            $("#place_user").html("ИД Рыбака: " +
                // TODO link to Profile
                get_place_info_response[0].user_id);
            $("#place_isBame").html("Это база: " +
                get_place_info_response[0].is_Base);
            $("#place_lant").html("lant: " +
                get_place_info_response[0].lant);
            $("#place_long").html("long: " +
                get_place_info_response[0].long);
            $("#place_decription").html("Описание: " +
                get_place_info_response[0].description);
            $("#place_bus_accessibility").html("Доступ на общественном: " +
                get_place_info_response[0].bus_accessibility);
            $("#place_car_accessibility").html("Доступ на машине: " +
                get_place_info_response[0].car_accessibility);
            console.log(currUserID);
            console.log( get_place_info_response[0].user_id);
            if (currUserID == get_place_info_response[0].user_id) {
                $("#RemovePlaceButtonID").css("display", "block");
            } else {
                $("#RemovePlaceButtonID").css("display", "none");
            }
            $('#place_contentID').modal();
        },
        error: function(error) {
            console.log("get_place_info_error:");
            console.log(error);
        }
    });

    $.ajax({
        type: "POST",
        url: "/get_place_info/",
        data: {
            "data_type": "photos",
            "place_id": currPlaceID,
        },
        type: "POST",
        success: function(get_place_photos_response) {
            console.log("get_place_photos_response:  ");
            console.log(get_place_photos_response);
            var photo_html = "";
            get_place_photos_response.forEach((photo, i) => {
                console.log(photo.image);
                photo_html = photo_html +
                    '<a href="http://fishkadata.s3.amazonaws.com/media/' +
                    photo.image +
                    '" data-lightbox="image-1" data-title="' +
                    photo.caption + '"><img class="img_place" ' +
                    'src="http://fishkadata.s3.amazonaws.com/media/' +
                    photo.image +  '" /></a>';
            });
            console.log(photo_html);
            $("#place_photos").html(photo_html);

        },
        error: function(error) {
            console.log("get_place_photos_error:");
            console.log(error);
        }
    });
}

//------Order-----------

function show_orders() {
    $("#place_contentID").modal('hide');
    reloadOrders();
    $("#orders_contentID").modal('show');
}

function addOrder() {
    addOrderData = new FormData();
    addOrderData.append("user_id", currUserID);
    addOrderData.append("place_id", currPlaceID);
    addOrderData.append("date_begin", $("#fOrderAdd_dateBeginID").val());
    addOrderData.append("date_end", $("#fOrderAdd_dateEndID").val());
    addOrderData.append("description", $("#fOrderAdd_descriptionID").val());


    var order_photos = $("#fOrderAdd_photosID")[0].files;
    console.log(order_photos);
    Array.from(order_photos).forEach((order_photo, i) => {
        console.log(order_photo);
        addOrderData.append("order_files[]", order_photo);
    });

    console.log("addOrderData");
    console.log(addOrderData);

    $.ajax({
        type: "POST",
        url: "/add_order/",
        data: addOrderData,
        contentType: false, // NEEDED, DON"T OMIT THIS
        processData: false, // NEEDED, DON"T OMIT THIS
        success: function(response) {
            console.log("response_addOrdreData:  ");
            console.log(response);

            if (response > 0) {
                console.log("order added!");

                document.getElementById("OrderAddID").reset();
                closeForm("order_add");
                $("#messageID").html("Отчет успешно добавлен!");
                $("#messageID").bPopup({
                    autoClose: 2000
                });
                reloadOrders();
            } else {
                $("#messageID").html("Отчет не добавлен!");
                $("#messageID").bPopup({
                    autoClose: 2000
                });
            }
        },
        error: function(error) {
            console.log("addOrderData_ERROR:");
            console.log(error);
        }
    });
}

function deleteOrder() {

    if (confirm("Вы увепены, что хотите удалить данный отчет?")) {
        $.ajax({
            type: "POST",
            url: "/delete_order/",
            data: {
                "order_id": currOrderID
            },
            success: function(response) {
                console.log("response_DeleteOrder:  ");
                console.log(response);
                if (response == 1) {
                    console.log("order deleted!");
                    $("#messageID").html("Отчет удален!");
                    $("#messageID").bPopup({
                        autoClose: 1000
                    });
                    reloadOrders();
                } else {
                    $("#messageID").html("Отчет не был удален!");
                    $("#messageID").bPopup({
                        autoClose: 1100
                    });
                }
            },
            error: function(error) {
                console.log("response_DeleteOrder_ERROR:");
                console.log(error);
            }
        });
    }
}

function reloadOrders() {
    console.log("__reload_orders:");
    $("#orders_place_nameID").html("ИД Базы: " + currPlaceID);
    $("#select_orders_listID").empty();
    reset_order_content();

    $.ajax({
        type: "POST",
        url: "/get_orders/",
        data:  {
            "place_id": currPlaceID
        },
        type: "POST",
        success: function(response) {
            console.log("response get_orders:  ");
            console.log(response);
            if (response.length > 0) {
                var value = "";
                response.forEach(function(order) {
                    var key = order.user + " : " + order.date_begin;
                    value = order.id;
                    $("#select_orders_listID").append(
                        '<option value="' + value + '"> ' + key + ' </option>');
                });
            } else {
                $("#orders_place_nameID").html("ИД Базы: " + currPlaceID +
                    "  <br>Пока нет ни одного отчета. Будьте первым!");
            }

        },
        error: function(error) {
            console.log("get_orders_error:");
            console.log(error);
        }
    });
}

function reset_order_content() {
    $("#order_userID").html("ИД Юзера: ");
    $("#order_periodID").html("Период: ");
    $("#order_descriptionID").html("Описание: ");
    $("#RemoveOrderButtonID").css("display", "none");
    $("#order_photosID").html("");

}

function get_order_info() {
    // TODO: JQuery?
    selectBox = document.getElementById("select_orders_listID");
    currOrderID = selectBox.options[selectBox.selectedIndex].value;
    console.log(currOrderID);

    $.ajax({
        type: "POST",
        url: "/get_order_info/",
        data: {
            "data_type": "info",
            "order_id": currOrderID,
        },
        type: "POST",
        success: function(get_order_info_response) {
            console.log("get_order_info_response:  ");
            console.log(get_order_info_response);

            $("#order_userID").html("ИД Юзера: " +
                get_order_info_response[0].user_id);
            $("#order_periodID").html("Период: " +
                get_order_info_response[0].date_begin +
                " - " + get_order_info_response[0].date_end);
            $("#order_descriptionID").html("Описание: " +
                get_order_info_response[0].description);
            if (currUserID == get_order_info_response[0].user_id) {
                $("#RemoveOrderButtonID").css("display", "block");
            } else {
                $("#RemoveOrderButtonID").css("display", "none");
            }
        },
        error: function(error) {
            console.log("get_order_info_ERROR:");
            console.log(error);
        }
    });

    $.ajax({
        type: "POST",
        url: "/get_order_info/",
        data: {
            "data_type": "photos",
            "order_id": currOrderID,
        },
        type: "POST",
        success: function(get_order_photos_response) {
            console.log("get_order_photos_response:  ");
            console.log(get_order_photos_response);
            var photo_html = "";
            get_order_photos_response.forEach((photo, i) => {
                console.log(photo.image);
                photo_html = photo_html +
                '<a href="http://fishkadata.s3.amazonaws.com/media/' +
                photo.image +
                '" data-lightbox="image-2" data-title="' +
                photo.caption +
                '"><img class="img_place" ' +
                'src="http://fishkadata.s3.amazonaws.com/media/' +
                photo.image +
                '" /></a>';
            });
            console.log(photo_html);
            $("#order_photosID").html(photo_html);

        },
        error: function(error) {
            console.log("get_order_photos_ERROR:");
            console.log(error);
        }
    });

}

//------Workspace-------------

function hidePlaceContent() {
    $("#place_contentID").hide();
}

function hideOrderContent() {
    $("#orders_contentID").modal('hide');
    $("#place_contentID").modal('show');
}

function openFormAddPlace(lant, long) {
    $("#fPlaceAdd_lantID").val(lant);
    $("#fPlaceAdd_longID").val(long);
    $("#formPlaceAddID").bPopup();
    map.balloon.close();
}

function openFormAddOrder(lant, long) {
    $("#fOrderAdd_lantID").val(lant);
    $("#fOrderAdd_longID").val(long);
    $("#formOrderAddID").bPopup();
    map.balloon.close();
}
