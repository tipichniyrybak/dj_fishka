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
            // <img class="img_place" src="/media/' + photo.image +  '" />
            $("#profile_photo").html('<img class="img_profile" src="http://fishkadata.s3.amazonaws.com/media/' + currProfile_json[0].photo  + '"/>');

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

function closeForm(form) {
    switch (form) {
        case 'profile_update':
            $('#formProfileEditID').bPopup().close();
            break;

        default:

    }
}
