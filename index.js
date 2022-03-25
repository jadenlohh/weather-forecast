$.get('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast', (body) => {
    const data = body.items[0].general;

    $('.weather-24h').html(data.forecast);

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
});


$.get('https://api.data.gov.sg/v1/environment/4-day-weather-forecast', (body) => {
        const data = body.items[0].forecasts;
        var num = 1;
        
        for (i in data) {
            var date = new Date(data[i].date);
            var day = date.getDay();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


            $(`.day${num}`).html(days[day]);
            $(`.weather-d${num}`).html(data[i].forecast);
            $(`.humidity-d${num}`).html(`${data[i].relative_humidity.low} - ${data[i].relative_humidity.high}`);
            $(`.temperature-d${num}`).html(`${data[i].temperature.low} - ${data[i].temperature.high}`);
            
            num ++;
        };
    });


function showMoreReadings() {
    $('.arrow-down').css('display', 'none');
    $('.weather-readings').css('animation', 'slideDown 500ms forwards');

    setTimeout(() => {
        $('.more-readings').css('display', 'block');
        $('.weather-readings').css('overflow-y', 'scroll');
    }, 500);
};


mapboxgl.accessToken = 'pk.eyJ1IjoiY29sZGZyb3N0IiwiYSI6ImNsMTNyOW85bjAwYTgzb3A4eWNvcjJ2N2gifQ.nQs70edcWpUaUMWuXEBg2w';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [103.82, 1.35],
    zoom: 10.5
});
// new mapboxgl.Marker().setLngLat([103.839, 1.375]).addTo(map);


var lastScrollTop = 0;

$('.weather-readings').scroll((event) => {
    var st = $(this).scrollTop();

    if (st > lastScrollTop) {
        $('.weather-readings-container').css('animation', 'slideDown 500ms forwards');
        $('.weather-readings').css('height', '20vh');

    } else {
        $('.weather-readings-container').css('animation', 'slideUp 500ms forwards');
        $('.weather-readings').css('height', '100vh');
    }

    lastScrollTop = st;
});