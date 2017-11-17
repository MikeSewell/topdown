window.addEventListener("load", e => {

    let assign = new Run();

});
// Michael Sewell
// 

class Run {
    constructor() {
        this.map = {}
        this.uniqueId = 0
        this.markers = []
        this.zipArr = []
        this.test = "test"
        this.lat = ""
        this.lng = ""

        localStorage.setItem("tempList", "")
        localStorage.setItem("lowF", "")
        localStorage.setItem("highF", "")
        localStorage.setItem("lowC", "")
        localStorage.setItem("highC", "")
        localStorage.setItem("currTempF", "")
        localStorage.setItem("currTempC", "")
        localStorage.setItem("currIcon", "")
        this.setting()
    }
    // setting screen
    setting() {
        let geo = document.querySelector("#geoLoc")

        // geoLocation toggle switch
        geo.addEventListener("click", e => {
            if (geo.checked) {
                localStorage.setItem("geo", "true")
            } else {
                localStorage.setItem("geo", "false")
            }
        })
        // geo location toggle on return
        if (localStorage.getItem("geo") == "true" || (!localStorage.getItem("geo"))) {
            this.getshowData(true)
            this.nav()
            this.init_map()
            this.changeZip()
        } else {
            geo.checked = false
            this.getshowData(false)
            this.nav()
            this.init_map()
            this.changeZip()
        }
    }

    // navigation 
    nav() {
        let dash = document.querySelector("#dashboard")
        document.querySelector("#setIcon").addEventListener("click", e => {
            dash.classList.add("disableDash");
        })
        document.querySelector("#favIcon").addEventListener("click", e => {
            dash.classList.add("disableDash");
        })
        document.querySelector("#backIcon").addEventListener("click", e => {
            dash.classList.remove("disableDash");
        })
        document.querySelector("#fwdIcon").addEventListener("click", e => {
            dash.classList.remove("disableDash");
        })

    }

    // get geo location and populate data
    getshowData(runGeo) {

        // show data after all data is loaded
        let count = 1
        document.addEventListener("currTemphilo", e => {
            if (count == 3) {
                showData()
            }
            count++
        })
        document.addEventListener("currTempSet", e => {
            if (count == 3) {
                showData()
            }
            count++
        })
        document.addEventListener("currTemphouly", e => {
            if (count == 3) {
                showData()
            }
            count++
        })

        //  get current high and low temp
        function getHL(lat, lng) {
            let url = 'http://api.wunderground.com/api/47e6f06078fb48ae/forecast/q/' + lat + ',' + lng + '.json'
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (j) {
                localStorage.setItem('lowF', j.forecast.simpleforecast.forecastday[0].low.fahrenheit);
                localStorage.setItem('highF', j.forecast.simpleforecast.forecastday[0].high.fahrenheit);
                localStorage.setItem('lowC', j.forecast.simpleforecast.forecastday[0].low.celsius);
                localStorage.setItem('highC', j.forecast.simpleforecast.forecastday[0].high.celsius);
                let evt = new Event("currTemphilo")

                document.dispatchEvent(evt)
                return
            })

        }

        // get current temp
        function getCurrTemp(lat, lng) {
            let url = "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/" + lat + "," + lng + ".json"
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (j) {
                localStorage.setItem('currIcon', j.current_observation.icon);
                localStorage.setItem('currTempF', j.current_observation.feelslike_f);
                localStorage.setItem('currTempC', j.current_observation.feelslike_c);
                let evt = new Event("currTempSet")
                document.dispatchEvent(evt)
                return
            })
        }

        // get all hourly temps
        function getHourly(lat, lng) {
            let url = "http://api.wunderground.com/api/47e6f06078fb48ae/hourly/q/" + lat + "," + lng + ".json"
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (j) {
                localStorage.setItem("tempList", JSON.stringify(j))
            }).then(function () {
                let evt = new Event("currTemphouly")
                document.dispatchEvent(evt)
            })
        }

        function showData() {
            // display day or night Icons
            var d = new Date();
            var n = d.getHours();
            let dayNight = ""
            let skycolor = document.querySelector(".container")
            if ((n >= 1 && n < 5) || (n >= 18 && n <= 24)) {
                dayNight = "night"
                skycolor.style.backgroundColor = "#364858"
            } else {
                dayNight = "day"
                skycolor.style.backgroundColor = "#007ced"
            }

            // populate header
            let dash = document.querySelector("#main")
            document.querySelector("#currImg").src = `./css/iconpack/${dayNight}/${localStorage.getItem("currIcon")}.png`
            document.querySelector("#high").innerHTML = localStorage.getItem("highF")
            document.querySelector("#low").innerHTML = localStorage.getItem("lowF")

            // populate hourly list
            let list = document.querySelector("#hourTable")
            list.innerHTML = ""
            let hour = JSON.parse(localStorage.getItem("tempList"))

            for (var i = 0; i < 9; i++) {
                list.insertAdjacentHTML("beforeend", `<tr>
                        <td id="hrt${i}">${hour.hourly_forecast[i].FCTTIME.civil}</td>
                        <td id="temp${i}">${hour.hourly_forecast[i].temp.english} F</td>
                        <td><img class="weatherIcon" src="./css/iconpack/${dayNight}/${hour.hourly_forecast[i].icon}.png" alt="weathericon"></td>
                        <td>${hour.hourly_forecast[i].wspd.english} ${hour.hourly_forecast[i].wdir.dir}</td>
                    </tr>`)
            }

            // tempformat toggle
            let tempSelect = document.querySelector("#tempSelect")
            tempSelect.addEventListener("click", e => {
                if (tempSelect.checked) {
                    document.querySelector("#low").innerHTML = localStorage.getItem("lowC")
                    document.querySelector("#high").innerHTML = localStorage.getItem("highC")
                    for (var i = 0; i < 9; i++) {
                        document.querySelector(`#temp${i}`).innerHTML = hour.hourly_forecast[i].temp.metric + " C"
                    }
                } else {
                    document.querySelector("#low").innerHTML = localStorage.getItem("lowF")
                    document.querySelector("#high").innerHTML = localStorage.getItem("highF")
                    for (var i = 0; i < 9; i++) {
                        document.querySelector(`#temp${i}`).innerHTML = hour.hourly_forecast[i].temp.english + " F"
                    }
                }
            })

            //timeformat toggle
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

        // run functions async
        let lat;
        let lng;
        const options = {
            method: 'Post'
        };
        let url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAKTaI3tOSjLN-HO2XC0BOKbSWHa1zHWdY"

        // geo location toggle
        if (runGeo) {

            fetch(url, options).then(function (response) {
                return response.json();
            }).then(function (d) {
                lat = d.location.lat.toFixed(3)
                lng = d.location.lng.toFixed(3)
                localStorage.setItem("lat", lat)
                localStorage.setItem("lng", lng)
                let geo = ["", lat, lng]
                return geo
            }).then(function (result) {
                return getHL(lat, lng)
            }).then(function (result) {
                return getCurrTemp(lat, lng)
            }).then(function (result) {
                return getHourly(lat, lng)
            })
        } else {
            fetch(url, options).then(function (response) {
                return
            }).then(function (d) {
                lat = localStorage.getItem("lat")
                lng = localStorage.getItem("lng")
                let geo = ["", lat, lng]
                return geo
            }).then(function (result) {
                return getHL(lat, lng)
            }).then(function (result) {
                return getCurrTemp(lat, lng)
            }).then(function (result) {
                return getHourly(lat, lng)
            })

        }
    }

    // change zip for both zip
    changeZip() {
        let zipInput = document.querySelector("#zipChange")
        zipInput.addEventListener("keyup", e => { // zip for weather
            if (zipInput.value.length == 5 && (!isNaN(zipInput.value))) {
                localStorage.setItem("geo", "false")
                document.querySelector("#geoLoc").checked = false
                this.ZipToLL(zipInput.value, this.getshowData)
            }
        })
        let addZip = document.querySelector("#addZip") // zip for map
        document.querySelector("#favZip button").addEventListener("click", e => {
            if (addZip.value.length == 5 && (!isNaN(addZip.value))) {
                this.ZipToLL(addZip.value, () => {
                    this.addMarkerToMap()
                })
            }
            addZip.value = ""
        })
    }
    //convert zip to lat,long
    ZipToLL(zip, callback) {

        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyDCbLmYX5sRQJ_KgkYgD0mZ2qwBOpXuzSE`;
        let run = "now"
        let lat = 0
        let lng = 0
        fetch(url).then(function (response) {
                return response.json();
            })
            .then(function (d) {
                localStorage.setItem("lat", d.results[0].geometry.location.lat.toFixed(3))
                localStorage.setItem("lng", d.results[0].geometry.location.lng.toFixed(3))
                callback(false)
                return
            })
    }
    // build map
    init_map(lat = 28.542, lng = -81.376) {
        var var_location = new google.maps.LatLng(lat, lng)
        var var_mapoptions = {
            center: var_location,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            panControl: false,
            rotateControl: false,
            streetViewControl: false
        }
        this.map = new google.maps.Map(
            document.getElementById("map"),
            var_mapoptions
        )

        var marker = new google.maps.Marker({
            position: var_location,
            map: this.map
        })
    }

    // add marker to map
    addMarkerToMap() {
        let latt = parseFloat(localStorage.getItem('lat'))
        let lngt = parseFloat(localStorage.getItem('lng'))

        let lat = latt.toFixed(5)
        let lng = lngt.toFixed(5)


        let url = "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/" + lat + "," + lng + ".json"
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (j) {
            let evt = new Event("addpin")
            evt.data = j
            document.dispatchEvent(evt)
        })
        document.addEventListener("addpin", addMarker.bind(this))


        // add marker
        function addMarker(e) {
            console.log(e.data);

            var contentString = `<h2>${e.data.current_observation.display_location.full}</h2>
            <p><img src="./css/iconpack/day/${e.data.current_observation.icon}.png" alt=""></p>
            <p>Current Temp: ${e.data.current_observation.feelslike_f}F/${e.data.current_observation.feelslike_c}C</p>`
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            var myLatLng = new google.maps.LatLng(lat, lng);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: this.map,
                animation: google.maps.Animation.DROP
            });
            marker.id = this.uniqueId;
            this.markers.push(marker)
            this.uniqueId++;
            this.map.panTo(myLatLng)

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });

        }

    }
}