// converts 24h to 12h time
function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // if time format correct
      time = time.slice(1);  // remove full string match value
      time[5] =+ time[0] < 12 ? 'AM' : 'PM'; // set AM/PM
      time[0] =+ time[0] % 12 || 12; // adjust hours
    }
    return time.join (''); // return adjusted time or original string
}


// 24h forecasts
$.get('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast', function(body, status){
    var data = body.items[0].general;

    $('#24hForecast').html(data.forecast);
    $('#24hTemperature').html(data.temperature.low + ' - ' + data.temperature.high + '&deg;C');
    $('#humidity').html(data.relative_humidity.low + ' - ' + data.relative_humidity.high + '%');
    $('#windSpeed').html(data.wind.direction + ' ' + data.wind.speed.low + ' - ' + data.wind.speed.high + 'km/h');
});
  

// 6h forecasts
var north_forecast, central_forecast, south_forecast, east_forecast, west_forecast;
$.ajax({
    async: false,
    url: 'https://api.data.gov.sg/v1/environment/24-hour-weather-forecast',
    type: "GET",
    success: function(data){ 
        var region = data.items[0].periods[0].regions;

        // gets string from json and removing '+08:00'
        var start_time = data.items[0].periods[0].time.start.replace('+08:00', '');
        var end_time = data.items[0].periods[0].time.end.replace('+08:00', '');
        var updated_timestamp = data.items[0].timestamp.replace('+08:00', '');

        // split date and time from string
        start_array = start_time.split('T');
        end_array = end_time.split('T');
        updatedTime_array = updated_timestamp.split('T');

        $('#timestamp').html(`From ${start_array[0]} ${tConvert(start_array[1])} to ${end_array[0]} ${tConvert(end_array[1])}`);
        $('#updated_timestamp').html(`2) Last updated on ${updatedTime_array[0]} ${tConvert(updatedTime_array[1])}`);

        north_forecast = region.north;
        central_forecast = region.central;
        south_forecast = region.south;
        east_forecast = region.east;
        west_forecast = region.west;
    }
});


// configure map
var mymap = L.map('mapid').setView([1.3521, 103.8198], 11.2);

// set map markers cordinate
var north_marker = L.marker([1.43, 103.82]).addTo(mymap);
var east_marker = L.marker([1.345, 103.946]).addTo(mymap);
var south_marker = L.marker([1.28, 103.815]).addTo(mymap);
var west_marker = L.marker([1.33, 103.7]).addTo(mymap);
var central_marker = L.marker([1.35, 103.815]).addTo(mymap);

// set map marker cordinate description
north_marker.bindPopup(`<b>North</b><br>Forecast: ${north_forecast}`).openPopup();
east_marker.bindPopup(`<b>East</b><br>Forecast: ${east_forecast}`).openPopup();
south_marker.bindPopup(`<b>South</b><br>Forecast: ${south_forecast}`).openPopup();
west_marker.bindPopup(`<b>West</b><br>Forecast: ${west_forecast}`).openPopup();
central_marker.bindPopup(`<b>Central</b><br>Forecast: ${central_forecast}`).openPopup();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 11.2,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY29sZGZyb3N0IiwiYSI6ImNrc245cGs5aTNmN2QydXF0eWU4Y25odGQifQ.YHD8A7B7WW10JJAh4B50aw'
}).addTo(mymap);


// 4 day forecasts
$.get('https://api.data.gov.sg/v1/environment/4-day-weather-forecast', function(body, status){
    var data = body.items[0].forecasts;
    for (i in data) {
        var date = new Date(data[i].date);
        var day = date.getDay();

        if (day == 0) {day = 'Sun'}
        else if (day == 1) {day = 'Monday'}
        else if (day == 2) {day = 'Tuesday'}
        else if (day == 3) {day = 'Wednesday'}
        else if (day == 4) {day = 'Thursday'}
        else if (day == 5) {day = 'Friday'}
        else if (day == 6) {day = 'Saturday'}

        $(`#day${i}`).html(day);
        $(`#day${i}_humidity`).html(`${data[i].relative_humidity.low} - ${data[i].relative_humidity.high}%`);
        $(`#day${i}_temperature`).html(`${data[i].temperature.low} - ${data[i].temperature.high}&deg;C`);
        $(`#day${i}_windSpeed`).html(`${data[i].wind.direction} ${data[i].wind.speed.low} - ${data[i].wind.speed.high}km/h`);
        $(`#day${i}_forecast`).html(body.items[0].forecasts[i].forecast);
    }
});


$.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', function(body, status){
    for (i in body.items[0].forecasts) {
        var h4tag = document.createElement('h4');
        var ptag = document.createElement('p');

        var h4text = document.createTextNode(body.items[0].forecasts[i].area);
        var ptext = document.createTextNode(body.items[0].forecasts[i].forecast);

        h4tag.appendChild(h4text);
        ptag.appendChild(ptext);

        var container = document.getElementById('2h-north-regions');
        container.appendChild(h4tag);
        container.appendChild(ptag);
    }
});