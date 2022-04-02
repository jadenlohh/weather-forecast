function getWeatherData() {
    $('.loading-icon').css('display', 'block');
    setTimeout(() => { $('.loading-icon').css('display', 'none'); }, 800);

    $.get('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast', (body) => {
        const data = body.items[0].general;

        $('.weather-forecast-24h').html(data.forecast);

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

        var template = document.querySelector('.weather-template-4D');
        var content = document.querySelector('.weather-content-4D');
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
};


window.onload = getWeatherData();

setInterval(() => { getWeatherData(); }, 60000);


function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 1.390, lng: 103.80 },
        zoom: 11,
        disableDefaultUI: true,
    });
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