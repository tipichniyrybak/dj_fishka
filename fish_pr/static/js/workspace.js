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
            $("#profile_photo").html('<img class="img_resize" src="/static/img/profile/' + currProfile_json[0].photo.replace(/^.*[\\\/]/, '') +  '"/>');

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

function openForm() {
    $('#formProfileEditID').bPopup();
}

function closeForm() {
    // $("#popupForm").hide();
    $('#formProfileEditID').bPopup().close();
}

function updateFilters() {
    updateProfile('filters');
}

function hideMapContent() {
    $('#map_contentID').hide();
}

function reloadPlaces() {
     myYandexMap.set_places();
}

function updateProfile(typeInfo) {
    var updateData = null;
    switch (typeInfo) {
        case 'main':
            updateData = {
                'userID': currUserID,
                'typeInfo': 'main',
                'first_name': $('#form_first_nameID').val(),
                'last_name': $('#form_last_nameID').val(),

                'home_pond': $('#form_home_pondID').val(),
                'lovely_pond': $('#form_lovely_pondID').val(),
                'fishing_object': $('#form_fishing_objectID').val(),
                'tackle': $('#form_tackleID').val(),
                'fishing_style': $('#form_fishing_styleID').val()
            };
            break;

        case 'filters':
            updateData = {
                'userID': currUserID,
                'typeInfo': 'filters',
                'is_selfPlaces': $('#is_selfPlacesID').is(":checked"),
                'is_Base': $('#is_BaseID').is(":checked"),
                'is_carAccessibility': $('#is_carAccessibilityID').is(":checked"),
                'is_busAccessibility': $('#is_busAccessibilityID').is(":checked")
            };
            break;
        default:
            break;
    }

    $.ajax({
        type: "POST",
        url: "/update_profile/",
        data: updateData,
        success: function(response) {
            console.log('response_update_profile:  ');
            console.log(response);

            if (response == 1) {
                console.log('ok');
                reloadProfile();
                closeForm();
                $('#messageID').html('Профиль успешно обновлен!');
                $('#messageID').bPopup({
                    autoClose: 3500 //Auto closes after 1000ms/1sec
                });
            }
        },
        error: function(error) {
            console.log('updateProfile_ERROR:');
            console.log(error);
        }
    });
}

$('#confirmAddPlaseID').click(function(e){
    e.preventDefault();
    console.log("confirmAddPlaseID");

    var files = $('#upload_imagesID')[0].files;
    var pPhotos ='';
    console.log($('form').get(0));
    formData = new FormData();
    console.log($('#place_nameID').val());

    formData.append('place_name', $('#place_nameID').val());
    formData.append('place_lant', $('#lantID').val());
    formData.append('place_long', $('#longID').val());
    formData.append('place_description', $('#descriptionID').val());

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('files[]', file);
        pPhotos = pPhotos + file.name + '|';
        console.log('files name:' + file.name);
    }
    pPhotos = pPhotos.substring(0, pPhotos.length - 1);
    formData.append('place_photos', pPhotos);
    console.log(formData);

    $.ajax({
        url: '/add_place/',
        type: 'POST',
        // data:{
        //     place_name: $('#place_nameID').val(),
        //     place_lant: $('#lantID').val(),
        //     place_long: $('#longID').val(),
        //     place_description: $('#descriptionID').val(),
        //     place_photos:pPhotos,
        //     files: files,
        // },
        data: formData,
        processData: false,
        contentType: false,

        success: function(response){

            console.log(response);
            if (response == 0) {
                console.log('no!!!');
            } else {
                myYandexMap.set_places();
                myYandexMap.map.container.fitToViewport();
                document.getElementById("add_plase_formID").reset();
                var modal = document.getElementById("myModal");
                modal.style.display = "none";
            }
        },
        error: function(error){
            console.log(error);
        }
    });
});
