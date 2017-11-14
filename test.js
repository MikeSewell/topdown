function getHL(lat, lng) {
    let url = 'http://api.wunderground.com/api/47e6f06078fb48ae/forecast/q/' + lat + ',' + lng + '.json'
    fetch(url).then(function (response) {
        // Convert to JSON
        return response.json();
    }).then(function (j) {
        console.log(j);
        // console.log("getHL",this.lat); doesnt work

        localStorage.setItem('lowF', j.forecast.simpleforecast.forecastday[0].low.fahrenheit);
        localStorage.setItem('highF', j.forecast.simpleforecast.forecastday[0].high.fahrenheit);
        localStorage.setItem('lowC', j.forecast.simpleforecast.forecastday[0].low.celsius);
        localStorage.setItem('highC', j.forecast.simpleforecast.forecastday[0].high.celsius);
        localStorage.setItem('tempformat', true);

    })
}

function getCurrTemp(lat, lng) {
    let url = "http://api.wunderground.com/api/47e6f06078fb48ae/conditions/q/" + lat + "," + lng + ".json"
    fetch(url).then(function (response) {
        // Convert to JSON
        return response.json();
    }).then(function (j) {
        console.log("getCurrTemp", j);
        localStorage.setItem('currIcon', j.current_observation.icon_url);
        localStorage.setItem('currTempF', j.current_observation.feelslike_f);
        localStorage.setItem('currTempC', j.current_observation.feelslike_c);
    })
}

function getHourly(lat, lng) {
    let url = "http://api.wunderground.com/api/47e6f06078fb48ae/hourly/q/" + lat + "," + lng + ".json"
    return fetch(url).then(function (response) {
        // Convert to JSON
        return response.json();
    }).then(function (j) {
        localStorage.setItem("tempList", JSON.stringify(j))
    })
}

function showData() {
    //header
    let dash = document.querySelector("#main")
    dash.insertAdjacentHTML("afterbegin", `<p id="high">${localStorage.getItem("highF")}</p>`)
    dash.insertAdjacentHTML("afterbegin", `<p id="currTemp"> <img src="${localStorage.getItem("currIcon")}" alt=""></p>`)
    dash.insertAdjacentHTML("afterbegin", `<p id="low">${localStorage.getItem("lowF")}</p>`)

    //hourly list
    let list = document.querySelector("#hourTable")
    let hour = JSON.parse(localStorage.getItem("tempList"))
    console.log(hour);

    for (var i = 0; i < 9; i++) {
        list.insertAdjacentHTML("beforeend", `<tr>
                        <td id="hrt${i}">${hour.hourly_forecast[i].FCTTIME.civil}</td>
                        <td id="temp${i}">${hour.hourly_forecast[i].temp.english} F</td>
                        <td><img src="${hour.hourly_forecast[i].icon_url}" alt="weathericon"></td>
                        <td>${hour.hourly_forecast[i].wspd.english} ${hour.hourly_forecast[i].wdir.dir}</td>
                    </tr>`)
    }

    // tempformat toggle
    let tempSelect = document.querySelector("#tempSelect")
    tempSelect.addEventListener("click", e => {
        if (tempSelect.checked) {
            localStorage.setItem('tempformat', false);

            document.querySelector("#low").innerHTML = localStorage.getItem("lowC")
            document.querySelector("#high").innerHTML = localStorage.getItem("highC")


            for (var i = 0; i < 9; i++) {
                document.querySelector(`#temp${i}`).innerHTML = hour.hourly_forecast[i].temp.metric + " C"
            }
        } else {
            localStorage.setItem('tempformat', true);

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

// +++++++++++++++++++++

let lat = 0
let lng = 0

if (localStorage.getItem("geo") == "true") {
    const options = {
        method: 'Post'
    };
    let url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAKTaI3tOSjLN-HO2XC0BOKbSWHa1zHWdY"
    fetch(url, options).then(function (response) {
        return response.json();
    }).then(function (d) {
        console.log('promiseGeo', d);
        lat = d.location.lat.toFixed(3)
        lng = d.location.lng.toFixed(3)
        let geo = [lat, lng]
        return geo
    }).then(function (result) {
        getHL(result[0], result[1])
        console.log('promisCurrtemp', result);
        return result
    }).then(function (result) {
        console.log('promisgetHl', result);
        getCurrTemp(result[0], result[1])
        return result
    }).then(function (result) {
        console.log('promisGetHouly', result);
        getHourly(result[0], result[1])
        return result
    })

} else {


}
// 
ZipToLL(zip, callback) {

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyDCbLmYX5sRQJ_KgkYgD0mZ2qwBOpXuzSE`;

    fetch(url).then(function (response) {
        return response.json();
    }).then(function (d) {

        let lat = d.results[0].geometry.location.lat.toFixed(2)
        let lng = d.results[0].geometry.location.lng.toFixed(2)
        localStorage.setItem('lat', lat)
        localStorage.setItem('lng', lng)

        console.log('promiseZiptoll', d);
        lat = d.location.lat.toFixed(3)
        lng = d.location.lng.toFixed(3)
        let geo = [lat, lng]
        return geo
    })
}
        // .then(function(result){
        //     let latt = parseFloat(localStorage.getItem('userlat'))
        //     let lngt = parseFloat(localStorage.getItem('userlng'))
    
        //     let lat = latt.toFixed(1)
        //     let lng = lngt.toFixed(1)
    
        //     var myLatLng = new google.maps.LatLng(lat, lng);
        //     var marker = new google.maps.Marker({
        //         position: myLatLng,
        //         map: this.map,
        //         animation: google.maps.Animation.DROP
        //     });
    
        //     this.markers.push(lat, lng + "|")
        //     this.map.panTo(myLatLng)
        //     localStorage.setItem("markers", this.markers)
        // })