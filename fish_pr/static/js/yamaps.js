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
                            // that.get_place_info(place['id']);
                            $('#map_contentID').hide();
                            $('#map_contentID').slideToggle(200);

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
