function reloadProfile() {
    $.ajax({
        type: "POST",
        url: "/get_profile_info/",
        data: {
            'userID': currUserID
        },
        success: function(response) {
            console.log('Profile_json:  ');
            console.log(response);
            currProfile_json = response;

            $("#name").html('<em><h4>' + currProfile_json[0].first_name + ' ' +currProfile_json[0].last_name + '</h4></em>');
            if (currProfile_json[0].is_professional) {
                $("#is_professional").html('<em>Профессионал</em>');
            } else {
                $("#is_professional").html('<em>Любитель</em>');
            }
            $("#home_pond").html('<b><em>Домашний водоем: </b>' + currProfile_json[0].home_pond + '</em>');
            $("#lovely_pond").html('<b><em>Любимый водоем: </b>' + currProfile_json[0].lovely_pond + '</em>');
            $("#fishing_object").html('<b><em>Любимый объект ловли: </b>' + currProfile_json[0].fishing_object + '</em>');
            $("#tackle").html('<b><em>Любимая снасть: </b>' + currProfile_json[0].tackle + '</em>');
            $("#fishing_style").html('<b><em>Любимый стиль ловли: </b>' + currProfile_json[0].fishing_style + '</em>');
            $("#profile_photo").html('<img class="img_profile" src="/media/img/profile/' + currProfile_json[0].photo.replace(/^.*[\\\/]/, '') +  '"/>');

            $("#form_first_nameID").val(currProfile_json[0].first_name);
            $("#form_last_nameID").val(currProfile_json[0].last_name);
            $("#form_home_pondID").val(currProfile_json[0].home_pond);
            $("#form_lovely_pondID").val(currProfile_json[0].lovely_pond);
            $("#form_fishing_objectID").val(currProfile_json[0].fishing_object);
            $("#form_tackleID").val(currProfile_json[0].tackle);
            $("#form_fishing_styleID").val(currProfile_json[0].fishing_style);

            var filters = JSON.parse(currProfile_json[0].filters);
            $('#is_selfPlacesID').prop('checked', (filters["is_selfPlaces"] == 'true'));
            $('#is_BaseID').prop('checked', (filters["is_Base"] == 'true'));
            $('#is_carAccessibilityID').prop('checked', (filters["is_carAccessibility"] == 'true'));
            $('#is_busAccessibilityID').prop('checked', (filters["is_busAccessibility"] == 'true'));
        },
        error: function(error) {
            console.log('get_profile_info_error:');
            console.log(error);
        }
    });
}

function updateProfile(typeInfo) {
    var updateData = null;
    switch (typeInfo) {
        case 'main':
            updateData = new FormData();
            updateData.append('userID', currUserID);
            updateData.append('typeInfo', 'main');
            updateData.append('first_name', $('#form_first_nameID').val());
            updateData.append('last_name', $('#form_last_nameID').val());
            updateData.append('home_pond', $('#form_home_pondID').val());
            updateData.append('lovely_pond', $('#form_lovely_pondID').val());
            updateData.append('fishing_object', $('#form_fishing_objectID').val());
            updateData.append('tackle', $('#form_tackleID').val());
            updateData.append('fishing_style', $('#form_fishing_styleID').val());

            var profile_photos = $('#profile_photoID')[0].files;
            console.log(profile_photos);

            // Array.from(profile_photos).forEach((profile_photo, i) => {
            console.log(profile_photo);
            updateData.append('profile_files', profile_photos[0]);
            // });

            break;

        case 'filters':
            updateData = new FormData();
            updateData.append('userID', currUserID);
            updateData.append('typeInfo', 'filters');
            updateData.append('is_selfPlaces', $('#is_selfPlacesID').prop('checked'));
            updateData.append('is_Base', $('#is_BaseID').prop('checked'));
            updateData.append('is_carAccessibility', $('#is_carAccessibilityID').prop('checked'));
            updateData.append('is_busAccessibility', $('#is_busAccessibilityID').prop('checked'));

            break;
        default:
            break;
    }

    $.ajax({
        type: "POST",
        url: "/update_profile/",
        data: updateData,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        success: function(response) {
            console.log('response_update_profile:  ');
            console.log(response);

            if (response == 1) {
                console.log('ok');
                reloadProfile();
                closeForm('profile_update');
                document.getElementById("ProfileEditID").reset();
                $('#messageID').html('Профиль успешно обновлен!');
                $('#messageID').bPopup({
                    autoClose: 1000 //Auto closes after 1000ms/1sec
                });
            }
        },
        error: function(error) {
            console.log('updateProfile_ERROR:');
            console.log(error);
        }
    });
}

function updateFilters() {
    updateProfile('filters');
}

function addPlace() {
    addPlaceData = new FormData();
    addPlaceData.append('userID', currUserID);
    addPlaceData.append('name', $('#fPlaceAdd_nameID').val());
    addPlaceData.append('lant', $('#fPlaceAdd_lantID').val());
    addPlaceData.append('long', $('#fPlaceAdd_longID').val());
    addPlaceData.append('isBase', $('#fPlaceAdd_isBaseID').prop('checked'));
    addPlaceData.append('description', $('#fPlaceAdd_descriptionID').val());
    addPlaceData.append('busAccessability', $('#fPlaceAdd_busAccessabilityID').prop('checked'));
    addPlaceData.append('carAccessability', $('#fPlaceAdd_carAccessabilityID').prop('checked'));

    var place_photos = $('#place_photosID')[0].files;
    console.log(place_photos);
    Array.from(place_photos).forEach((place_photo, i) => {
        console.log(place_photo);
        addPlaceData.append('place_files[]', place_photo);
    });


    $.ajax({
        type: "POST",
        url: "/add_place/",
        data: addPlaceData,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        success: function(response) {
            console.log('response_addPlaceData:  ');
            console.log(response);

            if (response > 0) {
                console.log('place added!');
                //reloadProfile();
                // $("#PlaceAddID").reset();
                document.getElementById("PlaceAddID").reset();
                closeForm('place_add');
                $('#messageID').html('Место успешно добавлено!');
                $('#messageID').bPopup({
                    autoClose: 2000 //Auto closes after 1000ms/1sec
                });
                reloadPlaces();
            } else {
                $('#messageID').html('Место с таким названием уже существует!');
                $('#messageID').bPopup({
                    autoClose: 2000 //Auto closes after 1000ms/1sec
                });
            }
        },
        error: function(error) {
            console.log('addPlaceData_ERROR:');
            console.log(error);
        }
    });
}

function deletePlace() {
    var place_id = $('#place_id').text();
    console.log('deletePlace id:');
    console.log(place_id);
    if (confirm('Вы увепены, что хотите удалить данное место?')) {
        $.ajax({
            type: "POST",
            url: "/delete_place/",
            data: {
                'place_id': place_id
            },
            success: function(response) {
                console.log('response_DeletePlace:  ');
                console.log(response);
                if (response == 1) {
                    console.log('place deleted!');
                    hidePlaceContent();
                    $('#messageID').html('Место удалено!');
                    $('#messageID').bPopup({
                        autoClose: 2000 //Auto closes after 1000ms/1sec
                    });
                    reloadPlaces();
                } else {
                    $('#messageID').html('Место не было удалено!');
                    $('#messageID').bPopup({
                        autoClose: 2000 //Auto closes after 1000ms/1sec
                    });
                }
            },
            error: function(error) {
                console.log('response_DeletePlace_ERROR:');
                console.log(error);
            }
        });
    }
}

function reloadPlaces() {
     myYandexMap.set_places();
}


function show_orders() {
    $('#place_contentID').hide();
    reloadOrders();
    $('#orders_contentID').css('display', 'grid');
}

function addOrder() {
    addOrderData = new FormData();
    addOrderData.append('user_id', currUserID);
    addOrderData.append('place_id', currPlaceID);
    addOrderData.append('date_begin', $('#fOrderAdd_dateBeginID').val());
    addOrderData.append('date_end', $('#fOrderAdd_dateEndID').val());
    addOrderData.append('description', $('#fOrderAdd_descriptionID').val());


    var order_photos = $('#fOrderAdd_photosID')[0].files;
    console.log(order_photos);
    Array.from(order_photos).forEach((order_photo, i) => {
        console.log(order_photo);
        addOrderData.append('order_files[]', order_photo);
    });

    console.log('addOrderData');
    console.log(addOrderData);

    $.ajax({
        type: "POST",
        url: "/add_order/",
        data: addOrderData,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        success: function(response) {
            console.log('response_addOrdreData:  ');
            console.log(response);

            if (response > 0) {
                console.log('order added!');

                document.getElementById("OrderAddID").reset();
                closeForm('order_add');
                $('#messageID').html('Отчет успешно добавлен!'); $('#messageID').bPopup({
                    autoClose: 2000 //Auto closes after 1000ms/1sec
                });
                reloadOrders();
            } else {
                $('#messageID').html('Отчет не добавлен!');
                $('#messageID').bPopup({
                    autoClose: 2000 //Auto closes after 1000ms/1sec
                });
            }
        },
        error: function(error) {
            console.log('addOrderData_ERROR:');
            console.log(error);
        }
    });
}

function deleteOrder() {
    if (confirm('Вы увепены, что хотите удалить данный отчет?')) {
        $.ajax({
            type: "POST",
            url: "/delete_order/",
            data: {
                'order_id': currOrderID
            },
            success: function(response) {
                console.log('response_DeleteOrder:  ');
                console.log(response);
                if (response == 1) {
                    console.log('order deleted!');
                    $('#messageID').html('Отчет удален!');
                    $('#messageID').bPopup({
                        autoClose: 1000 //Auto closes after 1000ms/1sec
                    });
                    reloadOrders();
                } else {
                    $('#messageID').html('Отчет не был удален!');
                    $('#messageID').bPopup({
                        autoClose: 1000 //Auto closes after 1000ms/1sec
                    });
                }
            },
            error: function(error) {
                console.log('response_DeleteOrder_ERROR:');
                console.log(error);
            }
        });
    }
}

function reloadOrders() {
    console.log('__reload_orders:');
    $('#orders_place_nameID').html('ИД Базы: ' + currPlaceID);
    $('#select_orders_listID').empty();
    reset_order_content();

    $.ajax({
        type: "POST",
        url: "/get_orders/",
        data:  {
            'place_id': currPlaceID
        },
        type: 'POST',
        success: function(response) {
            console.log('response get_orders:  ');
            console.log(response);
            if (response.length > 0) {
                var value = '';
                response.forEach(function(order) {
                    var key = order['user'] + ' : ' + order['date_begin'];
                    value = order['id'];
                    $('#select_orders_listID').append('<option value="' + value + '"> ' + key + ' </option>');
                });
            } else {
                $('#orders_place_nameID').html('ИД Базы: ' + currPlaceID + '  <br>Пока нет ни одного отчета. Будьте первым!');
            }

        },
        error: function(error) {
            console.log('get_orders_error:');
            console.log(error);
        }
    });
}

function reset_order_content() {
    $('#order_userID').html('ИД Юзера: ');
    $('#order_periodID').html('Период: ');
    $('#order_descriptionID').html('Описание: ');
    $('#RemoveOrderButtonID').css('display', 'none');
    $("#order_photosID").html('');

}

function get_order_info() {
    selectBox = document.getElementById("select_orders_listID");                //TODO  JQuery - ???
    currOrderID = selectBox.options[selectBox.selectedIndex].value;
    console.log(currOrderID);

    $.ajax({
        type: "POST",
        url: "/get_order_info/",
        data: {
            'data_type': "info",
            'order_id': currOrderID,
        },
        type: 'POST',
        success: function(get_order_info_response) {
            console.log('get_order_info_response:  ');
            console.log(get_order_info_response);

            $('#order_userID').html('ИД Юзера: ' + get_order_info_response[0].user_id);
            $('#order_periodID').html('Период: ' + get_order_info_response[0].date_begin + ' - ' + get_order_info_response[0].date_end);
            $('#order_descriptionID').html('Описание: ' + get_order_info_response[0].description);
            if (currUserID == get_order_info_response[0].user_id) {
                $('#RemoveOrderButtonID').css('display', 'block');
            } else {
                $('#RemoveOrderButtonID').css('display', 'none');
            }
        },
        error: function(error) {
            console.log('get_order_info_ERROR:');
            console.log(error);
        }
    });

    $.ajax({
        type: "POST",
        url: "/get_order_info/",
        data: {
            'data_type': "photos",
            'order_id': currOrderID,
        },
        type: 'POST',
        success: function(get_order_photos_response) {
            console.log('get_order_photos_response:  ');
            console.log(get_order_photos_response);
            var photo_html = "";
            get_order_photos_response.forEach((photo, i) => {
                console.log(photo.image);
                photo_html = photo_html + '<a href="/media/' + photo.image +  '" data-lightbox="image-1" data-title="' + photo.caption + '"><img class="img_place" src="/media/' + photo.image +  '" /></a>';
            });
            console.log(photo_html);
            $("#order_photosID").html(photo_html);

        },
        error: function(error) {
            console.log('get_order_photos_ERROR:');
            console.log(error);
        }
    });

}

function hidePlaceContent() {
    $('#place_contentID').hide();
}

function hideOrderContent() {
    $('#orders_contentID').hide();
    $('#place_contentID').slideToggle(200);
}

function openForm(form) {
    console.log(form);
    switch (form) {
        case 'profile_update':
            $('#formProfileEditID').bPopup();
            break;
        case 'place_add':
            $('#formPlaceAddID').bPopup();
            break;
        case 'order_add':
                $('#formOrderAddID').bPopup();
                break;
        default:

    }
}

function closeForm(form) {
    switch (form) {
        case 'profile_update':
            $('#formProfileEditID').bPopup().close();
            break;
        case 'place_add':
            $('#formPlaceAddID').bPopup().close();
            break;
        case 'order_add':
                $('#formOrderAddID').bPopup().close();
                break;
        default:

    }
}
