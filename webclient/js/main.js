$( document ).ready(function() {
    var sess;
    var waypoints = {};
    var flightPath;
    var socket;

    $("#ip").val(localStorage.getItem("IP"));


	//general function
	function appendToConsole(msg){
		$("#console").prepend("<p>" + msg + "</p>");
	}

    //wamp rpc setup
    function rpcsetup(ip){
        //wamp rpc
        // WAMP session object
        appendToConsole("Attempt to connect to "+ip);

        socket = io({
            'reconnection': true,
            'reconnectionDelay': 200,
            'reconnectionDelayMax' : 1000
        }).connect(ip + ':3000');
        socket.on('connect', function () {
            appendToConsole("Connected to " + ip);
            $("#connectform").hide();
        }).on('disconnect', function () {
            appendToConsole("Disconnected from " + ip);
            $("#var_latency").html("Offline");
        }).on('data', function (data) {
            appendToConsole("received data");
            handleReturn(data.kernel);
        });

        setInterval(function(){
            if (socket.connected) {
                socket.emit('latency', Date.now(), function (startTime) {
                    $("#var_latency").html(Date.now() - startTime);
                });
            }
        }, 500);
    }
	//google maps
	var map;
    var centre = {lat: -34.397, lng: 150.644};

    var getMarkerUniqueId= function(lat, lng) {
        return lat + '_' + lng;
    }

    var getLatLng = function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    };

    if(localStorage.getItem("GmapCenterLat")){
        centre = new google.maps.LatLng(localStorage.getItem("GmapCenterLat"),localStorage.getItem("GmapCenterLon"));
    }

	var mapOptions = {
		zoom: 15,
        maxZoom: 45,
		center: centre,
		disableDefaultUI: true,
        disableDoubleClickZoom: true
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	var boatMarker = new google.maps.Marker({
		position: {lat: -34.397, lng: 150.644},
		map: map,
		title: 'invenavi',
        icon: "img/boat-icon.png"
	});
    google.maps.event.addListener(map, 'center_changed', function() {
        localStorage.setItem('GmapCenterLat' , map.getCenter().lat())
        localStorage.setItem('GmapCenterLon' , map.getCenter().lng())
    });
    google.maps.event.addListener(map, 'dblclick', function(event) {
        addMarker(event);
    });



    function addMarker(e){

        var lat = e.latLng.lat(); // lat of clicked point
        var lng = e.latLng.lng(); // lng of clicked point
        var markerId = getMarkerUniqueId(lat, lng); // an that will be used to cache this marker in markers object.
        /*var marker = new google.maps.Marker({
            position: getLatLng(lat, lng),
            map: map,
            draggable:true,
            id: markerId
        });*/
        var marker = new google.maps.Circle({
            map: map,
            draggable:true,
            id: markerId,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            center: getLatLng(lat, lng),
            radius: 5
        });
        waypoints[markerId] = marker; // cache marker in markers object
        bindMarkerEvents(marker); // bind right click event to marker
        updatePath();
    }

    function updatePath(){
        if(flightPath){
            flightPath.setMap(null);
        }


        var flightPlanCoordinates = [
            boatMarker.getPosition()
        ];

        for (var key in waypoints) {
            var obj = waypoints[key];
            flightPlanCoordinates.push(obj.getCenter());
        }


        flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        flightPath.setMap(map);
    }
    var bindMarkerEvents = function(marker) {
        google.maps.event.addListener(marker, "rightclick", function () {
            removeMarker(marker.id); // remove it
        });
        google.maps.event.addListener(marker, "center_changed", function () {

            marker.id = getMarkerUniqueId(marker.getCenter().lat(), marker.getCenter().lng()); // get marker id by using clicked point's coordinate;
            updatePath();
        });
    };

    var removeMarker = function(markerId) {
        for (var key in waypoints) {
            var obj = waypoints[key];
            if(obj.id == markerId){
                waypoints[key].setMap(null);
                delete waypoints[key];
            }
        }

        updatePath();
    };

    function handleReturn(result){
        console.log(result);
        if(result.gps_lat){
            latlng = new google.maps.LatLng(result.gps_lat,result.gps_lon);
            $("#var_lat").html(result.gps_lat);
            $("#var_lng").html(result.gps_lon);
            $("#var_speed").html(result.gps_speed);
            $("#var_alt").html(result.gps_alt);
            boatMarker.setPosition(latlng);
            map.setCenter(boatMarker.getPosition());
        }

        $("#var_throttle").html(result.throttle);
        $("#var_steering").html(result.steering);
        $("#var_temp_int").html(result.temperature);
        $("#var_press_int").html(result.pressure);
        $("#var_compass_heading").html(result.heading);
    }

    /***********************
     * Button Handlers
     ***********************/
    $("#activatenavbutton").on("click",function(e){
        e.preventDefault();
        // call a function and log result on success
        sess.call("protos:enable_nav").then(function(result){
            handleReturn(result);
        },function (error){
            appendToConsole(error);
        });
    });

    $("#deactivatenavbutton").on("click",function(e){
        e.preventDefault();
        // call a function and log result on success
        sess.call("protos:disable_nav").then(function(result){
            handleReturn(result);
        },function (error){
            appendToConsole(error);
        });
    });

    $("#saveplotter").on('click',function(e){
        e.preventDefault();
        // call a function and log result on success
        data = [];
        for (var key in waypoints) {
            var obj = waypoints[key];
            data.push([
                obj.getCenter().lat(),
                obj.getCenter().lng()
            ]);
        }

        sess.call("protos:waypoints", JSON.stringify(data)).then(function(result){
            handleReturn(result);
        },function (error){
            appendToConsole(error);
        });
    });

	$("#sendcommands").on('click',function(e){
        e.preventDefault();
		// call a function and log result on success
		sess.call("protos:set_drive", parseFloat($("#speeddial").val())/100 , parseFloat($("#directiondial").val())/10).then(function(result){
			handleReturn(result);
		},function (error){
			appendToConsole(error);
		});
	});

    $("#haltbutton").on('click',function(e){
        e.preventDefault();
        // call a function and log result on success
        sess.call("protos:set_drive", 0 , 0).then(function(result){
            handleReturn(result);
        },function (error){
            appendToConsole(error);
        });
    });

	$("#forcedata").on("click", function(e){
        e.preventDefault();
        // call a function and log result on success
        socket.emit('data');
	});

    $("#ipsubmit").on("click",function(e){
        e.preventDefault();
        var ip = $("#ip");
        localStorage.setItem("IP", ip.val());
        if(ip.val().trim() != ""){
            ip.parent().removeClass("has-error");
            rpcsetup(ip.val());
            $("#streamimage").attr("src",ip.val()+":8080/?action=stream")
        }else{
            ip.parent().addClass("has-error");
        }
    });

    $("#goToBoat").on("click",function(e){
        e.preventDefault();
        map.setCenter(boatMarker.getPosition());
    });

    $('#PlotterModal').on('show.bs.modal', function (e) {
        //display all
        var i = 1;
        $("#plottertable tbody").html("");
        for (var key in waypoints) {
            var obj = waypoints[key];
            $("#plottertable tbody").append("<tr><td>"+i+"</td><td>"+obj.id+"</td><td>"+obj.getCenter().lat()+"</td><td>"+obj.getCenter().lng()+"</td></tr>");
            i++;
        }
    });

    $(".speedcontroller span").on("click",function(e){
        $(".speedcontroller span").removeClass("active");
        $(this).addClass("active");
        $(".speedcontroller span").filter(function() {
            return $(this).attr("data-value") > $(this).attr("data-value");
        })
    });

});
