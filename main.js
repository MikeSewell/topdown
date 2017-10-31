window.addEventListener("load", e => {

    let assign = new Run();


});


class Run {
    constructor() {
        let data = {};
        this.tempLow = ""
        this.tempHigh = ""
        this.tempNow = ""

        this.getdata2()
        this.getdata3()
        this.getdata4()
        geoFindMe()
    }
    getdata2() {
        let url = "http://api.wunderground.com/api/47e6f06078fb48ae/forecast/q/CA/San_Francisco.json"

        // "http://api.wunderground.com/api/47e6f06078fb48ae/hourly/q/CA/San_Francisco.json"
        // "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/CA/San_Francisco.json"

        fetch(url).then(function (response) {
            // Convert to JSON
            return response.json();
        }).then(function (j) {

            let sec = document.querySelector("#sec")
            
            sec.insertAdjacentHTML('beforeend',`<p>Low: ${j.forecast.simpleforecast.forecastday[0].low.fahrenheit}</p>`)
            sec.insertAdjacentHTML('beforeend',`<p>High: ${j.forecast.simpleforecast.forecastday[0].high.fahrenheit}</p>`)
        })
    }
    getdata3() {
        let url = "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/CA/San_Francisco.json"
        // "http://api.wunderground.com/api/47e6f06078fb48ae/forecast/q/CA/San_Francisco.json"
        // "http://api.wunderground.com/api/47e6f06078fb48ae/hourly/q/CA/San_Francisco.json"

        fetch(url).then(function (response) {
            // Convert to JSON
            return response.json();
        }).then(function (j) {
            let sec = document.querySelector("#sec")

            sec.insertAdjacentHTML('beforeend', `<p>Temp Now: ${j.current_observation.feelslike_f}</p>`)
        })
    }
    getdata4() {
        let url = "http://api.wunderground.com/api/47e6f06078fb48ae/hourly/q/CA/San_Francisco.json"
        // "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/CA/San_Francisco.json"
        // "http://api.wunderground.com/api/47e6f06078fb48ae/forecast/q/CA/San_Francisco.json"

        fetch(url).then(function (response) {
            // Convert to JSON
            return response.json();
        }).then(function (j) {
            let sec = document.querySelector("#loop")
            let data = j.hourly_forecast[0]

            sec.insertAdjacentHTML('beforeend', `<p>Time: ${data.FCTTIME.civil}</p>`)
            sec.insertAdjacentHTML('beforeend', `<p>Temp: ${data.temp.english}</p>`)
            sec.insertAdjacentHTML('beforeend', `<p>Windspeed: ${data.wspd.english}</p>`)
            sec.insertAdjacentHTML('beforeend', `<p>WindDir: ${data.wdir.degrees}</p>`)
        })
    }
}


function geoFindMe() {
    var output = document.getElementById("out");

    if (!navigator.geolocation) {
        // send to zip enter
        return;
    }
    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

        var img = new Image();
        img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

        output.appendChild(img);
    }

    function error() {
        // send to enter zip
    }

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
}