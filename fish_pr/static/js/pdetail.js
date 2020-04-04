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
                    autoClose: 1000
                });
            }
        },
        error: function(error) {
            console.log('updateProfile_ERROR:');
            console.log(error);
        }
    });
}

function add_request_for_friendship() {
    console.log();
    $.ajax({
        type: "POST",
        url: "/add_request_for_friendship/",
        data: {
            'profile_user_id': prof_user_id
        },

        success: function(response) {
            console.log('response_add_request_for_friendship:  ');
            console.log(response);

            if (response == 1) {

                $('#messageID').html('Заявка в друзья отправлена!');
                $('#messageID').bPopup({
                    autoClose: 1000
                });
            }
        },
        error: function(error) {
            console.log('add_request_for_friendship_ERROR:');
            console.log(error);
        }
    });
}
