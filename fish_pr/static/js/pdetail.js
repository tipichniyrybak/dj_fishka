function reloadProfile(profile_user_id) {
    $.ajax({
        type: "POST",
        url: "/get_profile_info/",
        data: {
            'userID': profile_user_id
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
            console.log('profile_photos');
            console.log(profile_photos);
            updateData.append('profile_files', profile_photos[0]);
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
                reloadProfile(currUserID);
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
            'receive_user_id': receive_user_id
        },

        success: function(response) {
            console.log('response_add_request_for_friendship:  ');
            console.log(response);

            if (response == 1) {

                $('#messageID').html('Заявка в друзья отправлена!');
                $('#messageID').bPopup({
                    autoClose: 1000
                });
            } else if (response == 2) {
                $('#messageID').html(profile_first_name + ' стал(а) вашим другом!');
                $('#messageID').bPopup({
                    autoClose: 1000
                });
            } else if (response == 3) {
                $('#messageID').html(profile_first_name + ' еще не решил, стать ли вашим другом!');
                $('#messageID').bPopup({
                    autoClose: 2000
                });
            }


        },
        error: function(error) {
            console.log('add_request_for_friendship_ERROR:');
            console.log(error);
        }
    });
}

function send_message_to_user() {
    $.ajax({
        type: "POST",
        url: "/send_message/",
        data:  {
            'user_id': receive_user_id,
            'content': $('#text_messageID').val()
        },
        type: 'POST',
        success: function(response) {
            console.log('response send_message_to_profile:  ');
            console.log(response);
            if (response == 2) {
                $('#text_messageID').val('');
                closeForm('send_message');
                $('#messageID').html('Сообщение отправлено!');
                $('#messageID').bPopup({
                    autoClose: 1000
                });

            }
        },
        error: function(error) {
            console.log('send_message_error:');
            console.log(error);
        }
    });
}
