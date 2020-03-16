class YandexMap {
    map = null;
    PlacemarkArray = [];
    d = 7;

    constructor() {
        var that = this;
        ymaps.ready(function () {
            that.map = new ymaps.Map('map', {
                center: [59.939095, 30.315961],
                zoom: 10,
                controls: []
            });
        });
    }

    get_place_info(place_id) {
        $.ajax({
            type: "POST",
            url: "/get_place_info/",
            data: {
                'data_type': "info",
                'place_id': place_id,
            },
            type: 'POST',
            success: function(get_place_info_response) {
                console.log('get_place_info_response:  ');
                console.log(get_place_info_response);
                $('#place_name').html(get_place_info_response[0].name);
                $('#place_user').html('ИД Рыбака: ' + get_place_info_response[0].user_id);    //TODO link to Profile
                $('#place_isBame').html('Это база: ' + get_place_info_response[0].is_Base);
                $('#place_lant').html('lant: ' + get_place_info_response[0].lant);
                $('#place_long').html('long: ' + get_place_info_response[0].long);
                $('#place_decription').html('Описание: ' + get_place_info_response[0].description);
                $('#place_bus_accessibility').html('Доступ на общественном: ' + get_place_info_response[0].bus_accessibility);
                $('#place_car_accessibility').html('Доступ на машине: ' + get_place_info_response[0].car_accessibility);
                $('#place_id').html(get_place_info_response[0].id);
                console.log(currUserID);
                console.log( get_place_info_response[0].user_id);
                if (currUserID == get_place_info_response[0].user_id) {
                    $('#RemovePlaceButtonID').css('display', 'block');
                    // $('#RemovePlaceButtonID').click(function() {
                    //     deletePlace(get_place_info_response[0].id);
                    // });
                } else {
                    $('#RemovePlaceButtonID').css('display', 'none');
                }
            },
            error: function(error) {
                console.log('get_place_info_error:');
                console.log(error);
            }
        });

        $.ajax({
            type: "POST",
            url: "/get_place_info/",
            data: {
                'data_type': "photos",
                'place_id': place_id,
            },
            type: 'POST',
            success: function(get_place_photos_response) {
                console.log('get_place_photos_response:  ');
                console.log(get_place_photos_response);
                var photo_html = "";
                get_place_photos_response.forEach((photo, i) => {
                    console.log(photo.image);
                    photo_html = photo_html + '<a href="/media/' + photo.image +  '" data-lightbox="image-1" data-title="' + photo.caption + '"><img class="img_place" src="/media/' + photo.image +  '" /></a>';
                });
                console.log(photo_html);
                $("#place_photos").html(photo_html);

            },
            error: function(error) {
                console.log('get_place_photos_error:');
                console.log(error);
            }
        });



    }

    set_places() {
        var that = this;
        console.log('__set_places:');
        var userdata = null;
        $.ajax({
            type: "POST",
            url: "/get_places/",
            data:  {
                'userID': currUserID
            },
            type: 'POST',
            success: function(response) {
                console.log('response:  ');
                console.log(response);
                ymaps.ready(function () {
                    that.map.geoObjects.removeAll();
                    that.PlacemarkArray = [];
                    response.forEach(function(place) {
                        console.log(place['name']);
                        var myPlacemark1 = new ymaps.Placemark([place['lant'], place['long']], {
                            iconContent: place['name']
                        }, {
                            preset: 'islands#darkOrangeStretchyIcon'
                        });
                        myPlacemark1.events.add(['click'],  function (e) {
                            console.log('click cluck');
                            $('#place_contentID').hide();
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
}
