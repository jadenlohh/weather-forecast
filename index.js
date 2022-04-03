function getWeatherData() {
    $('.loading-icon').css('display', 'block');

    setTimeout(() => {
        $.get('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast', (body) => {
            const data = body.items[0].general;

            $('.weather-forecast').html(data.forecast)

            $('.temperature-24h-low').html(data.temperature.low);
            $('.temperature-24h-high').html(data.temperature.high);

            $('.humidity-24h-low').html(data.relative_humidity.low);
            $('.humidity-24h-high').html(data.relative_humidity.high);


            $('.wind-24h-low').html(data.wind.speed.low);
            $('.wind-24h-high').html(data.wind.speed.high);
        });


        $.get('https://api.data.gov.sg/v1/environment/4-day-weather-forecast', (body) => {
            const data = body.items[0].forecasts;
            $('.temperature-24h-low').html(data[0].temperature.low);
            $('.temperature-24h-high').html(data[0].temperature.high);

            $('.humidity-24h-low').html(data[0].relative_humidity.low);
            $('.humidity-24h-high').html(data[0].relative_humidity.high);


            $('.wind-24h-low').html(data[0].wind.speed.low);
            $('.wind-24h-high').html(data[0].wind.speed.high);

            $('.weather-day1').html(data[0].forecast);

            var template = document.querySelector('.weather-template-4d');
            var content = document.querySelector('.weather-content-4d');
            content.innerHTML = '';

            for (let x = 0; x <= 3; x++) {
                var clone = template.content.cloneNode(true);
                var temperature = clone.querySelector('.temperature-4d');
                var humidity = clone.querySelector('.humidity-4d');
                var weather = clone.querySelector('.weather-4d');
                var day = clone.querySelector('.day-4d');

                var date = new Date(data[x].date);
                var d = date.getDay();
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                day.textContent = days[d];
                temperature.textContent = `${data[x].temperature.low} - ${data[x].temperature.high}`;
                humidity.textContent = `${data[x].relative_humidity.low} - ${data[x].relative_humidity.high}`;
                weather.textContent = data[x].forecast;

                content.append(clone);
            };
        });

        $('.loading-icon').css('display', 'none');
    }, 500);
};


forecastType = '24h';

window.onload = getWeatherData();
setInterval(() => { forecastType == '24h' ? getWeatherData() : viewLocationWeather(); }, 60000);


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 1.390, lng: 103.80 },
        zoom: 11,
        disableDefaultUI: true,
    });
};


var markers = [];

function setMarker(position) {
    const marker = new google.maps.Marker({
        position: position,
    });

    markers.push(marker);
    markers[0].setMap(map);
};


function removeMarker() {
    markers[0].setMap(null);
    markers = [];
};


$.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', (body) => {
    var ul = document.querySelector('.location-list');
    locations = [];

    for (i in body.area_metadata) {
        var li = document.createElement('li');

        li.appendChild(document.createTextNode(body.area_metadata[i].name));
        li.classList.add('dropdown-item');
        li.onclick = viewLocationWeather;

        ul.appendChild(li);
    };
});


document.getElementById('search').addEventListener('input', (e) => {
    var value = e.target.value.toLowerCase();
    var li = $('li').get();

    if (value != '') {
        $('.location-list').css('display', 'block');

        for (x in li) {
            var location = li[x].innerHTML.toLowerCase();

            if (location.includes(value)) {
                li[x].classList.remove('hidden');
            }
            else {
                li[x].classList.add('hidden');
            };

            if ($('.hidden').get().length > 47) {
                $('.no-location').css('display', 'block');
            }
            else {
                $('.no-location').css('display', 'none');
            };
        };
    }
    else {
        $('.location-list').css('display', 'none');

        for (x in li) {
            li[x].classList.remove('hidden');
        };
    };
});


function viewLocationWeather() {
    $('.loading-icon').css('display', 'block');
    $('.location-list').css('display', 'none');

    setTimeout(() => {
        $.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', (body) => {
            var weatherLocations = body.items[0].forecasts;
            var areaMetadata = body.area_metadata;

            for (x in weatherLocations) {
                if (weatherLocations[x].area == this.innerHTML) {
                    $('#location').html(weatherLocations[x].area);
                    $('.weather-forecast').html(weatherLocations[x].forecast);
                    $('.forecast-type').html('2-hour weather forecast');

                    for (i in areaMetadata) {
                        if (areaMetadata[i].name == this.innerHTML) {

                            if (markers.length == 0) {
                                setMarker({ lat: areaMetadata[i].label_location.latitude, lng: areaMetadata[i].label_location.longitude });
                            }
                            else {
                                removeMarker();
                                setMarker({ lat: areaMetadata[i].label_location.latitude, lng: areaMetadata[i].label_location.longitude });
                            };
                        };
                    };
                };
            };
        });

        forecastType = '2h';
        $('.loading-icon').css('display', 'none');
    }, 500);
};


function showReadings() {
    $('.arrow-down').css('display', 'none');
    $('.weather-readings-container').css('animation', 'slideDown 500ms forwards');

    setTimeout(() => {
        $('.more-readings').css('display', 'block');
        $('.weather-readings-container').css('overflow-y', 'scroll');
        $('.cross').css('display', 'block');
    }, 500);
};


function hideReadings() {
    document.getElementsByClassName('weather-readings-container')[0].scrollTo(0, 0);
    $('.arrow-down').css('display', 'block');
    $('.cross').css('display', 'none');
    $('.weather-readings-container').css({ 'overflow': 'hidden', 'animation': 'slideUp 500ms forwards' });
    $('.more-readings').css('display', 'none');
};