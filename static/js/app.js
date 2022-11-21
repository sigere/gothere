$(document).ready(function () {
    const $form = $("#form").find("form");
    $form.submit(onFormSubmit);

    function startNavigation(data) {
        const points = data.Points;
        const UI_PointName = $("#js-point-name");
        const UI_PointAzimuth = $("#js-point-azimuth");
        const UI_PointDistance = $("#js-point-distance");
        let current = null;
        let currentIndex = 0;
        let id = null;

        watchNext();

        function watchNext() {
            navigator.geolocation.clearWatch(id)
            current = nextPoint();
            if (current) {
                UI_PointName.html(current.Name);
                id = navigator.geolocation.watchPosition(update, null, {enableHighAccuracy: true, maximumAge: 0});
            }
        }

        function update(position) {
            let myPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }

            const distance = getDistance(myPosition, current);
            const azimuth = getAzimuth(myPosition, current);
            if (distance < 1) {
                current = nextPoint();
                if (!current) {
                    navigator.geolocation.clearWatch(id);
                }
            }

            UI_PointAzimuth.html(azimuth.toFixed(2) + "°");
            UI_PointDistance.html(distance.toFixed(2) + "m");
        }

        function nextPoint() {
            if (currentIndex < points.length) {
                return points[currentIndex++];
            }
            return false;
        }
    }

    function onFormSubmit(event) {
        console.log(event);

        let $form = $(event.target);


        $.ajax({
            url: "/api/v1/path?" + $form.serialize(),
            type: "GET",
            success: startNavigation,
            error: function (jqXHR) {
                console.error(jqXHR.responseText);
            }
        });

        event.preventDefault()
    }
    // let point = {
    //     latitude: 50.017677,
    //     longitude: 22.663324,
    // };
    // let me = {
    //     latitude: 50.024786,
    //     longitude: 22.638130,
    // }
    // console.log(getAzimuth(point, me), getDistance(point, me));


    function getDistance(from, to) {
        const R = 6371e3;
        const lat1 = from.latitude * Math.PI/180;
        const lat2 = to.latitude * Math.PI/180;
        const deltaLat = (to.latitude-from.latitude) * Math.PI/180;
        const deltaLon = (to.longitude-from.longitude) * Math.PI/180;

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    function getAzimuth(from, to) {
        const delta = from.longitude - to.longitude;
        const x = Math.sin(delta) * Math.cos(to.latitude);
        const y = Math.cos(from.latitude) * Math.sin(to.latitude) - Math.sin(from.latitude) * Math.cos(to.latitude) * Math.cos(delta);
        let value = Math.atan2(x,y) * 180 / Math.PI;
        value = value % 360;
        return value < 0 ? value + 360 : value;
    }
})