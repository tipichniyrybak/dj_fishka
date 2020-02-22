var myYandexMap = null;
var currProfile_json = "";

function getProfileInfo(userID){
    $.ajax({
        type: "POST",
        url: "/get_profile_info/",
        data: {
            'userID': userID
        },
        success: function(response) {
            console.log('response3:  ');
            console.log(response);
            return response;
        },
        error: function(error) {
            console.log('get_profile_info_error:');
            console.log(error);
        }
    });
}

function reloadProfile(userID) {

    $.ajax({
        type: "POST",
        url: "/get_profile_info/",
        data: {
            'userID': userID
        },
        success: function(currProfile_json) {
            console.log('currProfile_json:  ');
            console.log(currProfile_json);

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

        },
        error: function(error) {
            console.log('get_profile_info_error:');
            console.log(error);
        }
    });

}

function openForm(currProfile_json) {

    $("#popupForm").show();

    $("#form_first_nameID").val(currProfile_json[0].first_name);
    $("#form_last_nameID").val(currProfile_json[0].last_name);

    $("#form_home_pondID").val(currProfile_json[0].home_pond);
    $("#form_lovely_pondID").val(currProfile_json[0].lovely_pond);
    $("#form_fishing_objectID").val(currProfile_json[0].fishing_object);
    $("#form_tackleID").val(currProfile_json[0].tackle);
    $("#form_fishing_styleID").val(currProfile_json[0].fishing_style);
}

function changeProfile() {
    $.ajax({
        type: "POST",
        url: "/get_place_info/",
        data: {
            'place_id': place_id
        },
        success: function(response) {
            console.log('response2:  ');
            console.log(response);

            $("#base_name").html('<b>Place name:</b> ' + response[0]['name']);
            $("#lant").html('<b>Place lant:</b> ' + response[0]['lant']);
            $("#long").html('<b>Place long:</b> ' + response[0]['long']);
            $("#decription").html('<b>Place description:</b> ' + response[0]['description']);

            console.log('photos str:  ');
            console.log(response[0]['photos']);
            var photo_names = response[0]['photos'].split('|');
            console.log('photo_names:  ');
            console.log(photo_names);
            var photosHTML = '<b>Place photos:</b> <br> ';
            photo_names.forEach(function(photo_name) {
                photosHTML = photosHTML + '<br>' + photo_name;
            });

            $("#photos").html(photosHTML);
        },
        error: function(error) {
            console.log('get_place_info_error:');
            console.log(error);
        }
    });
}

function closeForm() {
    $("#popupForm").hide();
}

$('#openAddPlaseFormID').click(function(e){
    e.preventDefault();
    console.log("openAddPlaseFormID");
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    console.log('myYandexMap:  ');
    console.log(myYandexMap);
});

$('#closeAddPlaceFormID').click(function(e){
    e.preventDefault();
    console.log("closeAddPlaceFormID");
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    console.log('myYandexMap:  ');
    console.log(myYandexMap);
});

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
