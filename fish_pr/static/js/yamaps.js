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
                'place_id': place_id
            },

            type: 'POST',
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

    set_places() {
        var that = this;
        console.log('__set_places:');
        $.ajax({
            type: "POST",
            url: "/get_places/",
            type: 'POST',
            success: function(response) {
                console.log('response:  ');
                console.log(response);
                ymaps.ready(function () {
                    response.forEach(function(place) {
                        console.log(place['name']);
                        var myPlacemark1 = new ymaps.Placemark([place['lant'], place['long']], {
                            iconContent: place['name']
                        }, {
                            preset: 'islands#darkOrangeStretchyIcon'
                        });
                        myPlacemark1.events.add(['click'],  function (e) {
                            console.log('click cluck');
                            that.get_place_info(place['id']);
                        });
                        that.PlacemarkArray.push(myPlacemark1);
                        that.map.geoObjects.add(myPlacemark1);
                    });
                });
            },
            error: function(error) {
                console.log('error:');
                console.log(error);
            }
        });
    }
}
