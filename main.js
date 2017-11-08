window.addEventListener("load", e => {

    let assign = new Run();


});

class Run {
    constructor() {
        this.getGeo()
        this.getHL()
        this.getCurrTemp()
        this.getHourly()
        this.showData()
        this.init_map()
        this.changeZip()
        this.zipArr = []

    }
    // get high and low temp
    getHL() {
        let url = 'http://api.wunderground.com/api/47e6f06078fb48ae/forecast/q/' + localStorage.getItem("lat") + ',' + localStorage.getItem("lng") + '.json'
        fetch(url).then(function (response) {
            // Convert to JSON
            return response.json();
        }).then(function (j) {
            localStorage.setItem('lowF', j.forecast.simpleforecast.forecastday[0].low.fahrenheit);
            localStorage.setItem('highF', j.forecast.simpleforecast.forecastday[0].high.fahrenheit);
            localStorage.setItem('lowC', j.forecast.simpleforecast.forecastday[0].low.celsius);
            localStorage.setItem('highC', j.forecast.simpleforecast.forecastday[0].high.celsius);
            localStorage.setItem('tempformat', true);

        })
    }
    // get current temp
    getCurrTemp() {
        let url = "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/" + localStorage.getItem("lat") + "," + localStorage.getItem("lng") + ".json"
        fetch(url).then(function (response) {
            // Convert to JSON
            return response.json();
        }).then(function (j) {
            console.log(j);
            localStorage.setItem('currIcon', j.current_observation.icon);
            localStorage.setItem('currTempF', j.current_observation.feelslike_f);
            localStorage.setItem('currTempC', j.current_observation.feelslike_c);
        })
    }
    // get hourly data
    getHourly() {
        let url = "http://api.wunderground.com/api/47e6f06078fb48ae/hourly/q/" + localStorage.getItem("lat") + "," + localStorage.getItem("lng") + ".json"
        fetch(url).then(function (response) {
            // Convert to JSON
            return response.json();
        }).then(function (j) {
            console.log(j);
            localStorage.setItem("tempList", JSON.stringify(j))
        })
    }
    //display data
    showData() {
        let dash = document.querySelector("#main")
        dash.insertAdjacentHTML("afterbegin", `<p id="high">${localStorage.getItem("highF")}</p>`)
        dash.insertAdjacentHTML("afterbegin", `<p id="currTemp">${localStorage.getItem("currIcon")}</p>`)
        dash.insertAdjacentHTML("afterbegin", `<p id="low">${localStorage.getItem("lowF")}</p>`)

        let list = document.querySelector("#hourTable")
        let hour = JSON.parse(localStorage.getItem("tempList"))
        for (var i = 0; i < 9; i++) {
            list.insertAdjacentHTML("beforeend", `<tr>
                        <td id="hrt${i}">${hour.hourly_forecast[i].FCTTIME.civil}</td>
                        <td id="temp${i}">${hour.hourly_forecast[i].temp.english}</td>
                        <td><img src="${hour.hourly_forecast[i].icon_url}" alt="weathericon"></td>
                        <td>${hour.hourly_forecast[i].wspd.english} ${hour.hourly_forecast[i].wdir.dir}</td>
                    </tr>`)
        }


        let tempSelect = document.querySelector("#tempSelect")
        tempSelect.addEventListener("click", e => {
            if (tempSelect.checked) {
                localStorage.setItem('tempformat', false);

                document.querySelector("#low").innerHTML = localStorage.getItem("lowC")
                document.querySelector("#currTemp").innerHTML = localStorage.getItem("currIcon")
                document.querySelector("#high").innerHTML = localStorage.getItem("highC")


                for (var i = 0; i < 9; i++) {
                    document.querySelector(`#temp${i}`).innerHTML = hour.hourly_forecast[i].temp.metric
                }
            } else {
                localStorage.setItem('tempformat', true);

                document.querySelector("#low").innerHTML = localStorage.getItem("lowF")
                document.querySelector("#currTemp").innerHTML = localStorage.getItem("currIcon")
                document.querySelector("#high").innerHTML = localStorage.getItem("highF")
                for (var i = 0; i < 9; i++) {
                    document.querySelector(`#temp${i}`).innerHTML = hour.hourly_forecast[i].temp.english
                }
            }
        })
        let timeSelect = document.querySelector("#timeSelect")
        timeSelect.addEventListener("click", e => {
            if (timeSelect.checked) {
                for (var i = 0; i < 9; i++) {
                    if (hour.hourly_forecast[i].FCTTIME.hour < 10) {
                        document.querySelector(`#hrt${i}`).innerHTML = "0" + hour.hourly_forecast[i].FCTTIME.hour + "00"
                    } else {
                        document.querySelector(`#hrt${i}`).innerHTML = hour.hourly_forecast[i].FCTTIME.hour + "00"

                    }
                }
            } else {
                for (var i = 0; i < 9; i++) {
                    document.querySelector(`#hrt${i}`).innerHTML = hour.hourly_forecast[i].FCTTIME.civil

                }
            }
        })
    }


    // get geoLocation
    getGeo() {
        let url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAKTaI3tOSjLN-HO2XC0BOKbSWHa1zHWdY"

        function reqListener() {
            let d = JSON.parse(this.responseText);
            localStorage.setItem('lat', d.location.lat.toFixed(1))
            localStorage.setItem('lng', d.location.lng.toFixed(1))
        }
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("POST", url);
        oReq.send();
    }
    changeZip() {
        let zipInput = document.querySelector("#zipChange")
        zipInput.addEventListener("keyup", e => {
            if (zipInput.value.length == 5) {
                console.log(zipInput.value);
            }
        })
        let addZip = document.querySelector("#addZip")
        document.querySelector("#favZip button").addEventListener("click", e => {
            console.log('click');
            if (addZip.value.length == 5) {
                this.zipArr.push(addZip.value)
                console.log(this.zipArr);
            }


        })


    }
    init_map() {
        var var_location = new google.maps.LatLng(localStorage.getItem("lat"), localStorage.getItem("lng"))
        var var_mapoptions = {
            center: var_location,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            panControl: false,
            rotateControl: false,
            streetViewControl: false
        }
        var var_map = new google.maps.Map(
            document.getElementById("map"),
            var_mapoptions
        )


        var marker = new google.maps.Marker({
            position: var_location,
            map: var_map
        })


    }

}