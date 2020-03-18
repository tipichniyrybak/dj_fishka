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

    $('#orders_contentID').css('display', 'grid');
}

function addOrder() {
    addOrderData = new FormData();
    addOrderData.append('user_id', currUserID);
    addOrderData.append('place_id', $('#place_id')[0].innerText);
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
                reloadPlaces();
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
    var place_id = $('#order_id').text();
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

function reloadOrders() {
    console.log('__reload_orders:');

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
            ymaps.ready(function () {
                    response.forEach(function(order) {

                        var key =
                        orders_list
                    var myPlacemark1 = new ymaps.Placemark([place['lant'], place['long']], {
                        iconContent: place['name']
                    }, {
                        preset: 'islands#darkOrangeStretchyIcon'
                    });
                    myPlacemark1.events.add(['click'],  function (e) {
                        console.log('click cluck');
                        $('#place_contentID').hide();
                        $('#orders_contentID').hide();
                        that.get_place_info(place['id']);
                        $('#place_contentID').slideToggle(200);

                    });
                    that.PlacemarkArray.push(myPlacemark1);
                    that.map.geoObjects.add(myPlacemark1);
                });
            });
        },
        error: function(error) {
            console.log('set_places_error:');
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
