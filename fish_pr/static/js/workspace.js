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

function updateFilters() {
    updateProfile('filters');
}

function show_orders() {
    $('#place_contentID').hide();
    var place_id = $('#place_id')[0].innerText;
    console.log(place_id);
    $('#orders_contentID').css('display', 'grid');
}

function addOrder()
{
    addOrderData = new FormData();
    addOrderData.append('userID', currUserID);
    addOrderData.append('name', $('#fPlaceAdd_nameID').val());
    addOrderData.append('lant', $('#fPlaceAdd_lantID').val());
    addOrderData.append('long', $('#fPlaceAdd_longID').val());
    addOrderData.append('isBase', $('#fPlaceAdd_isBaseID').prop('checked'));


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
}


function hidePlaceContent() {
    $('#place_contentID').hide();
}

function hideOrderContent() {
    $('#orders_contentID').hide();
    $('#place_contentID').slideToggle(200);
}

function reloadPlaces() {
     myYandexMap.set_places();
}
