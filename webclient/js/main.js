$( document ).ready(function() {
    var sess;
    var waypoints = {};
    var flightPath;

    $("#ip").val(localStorage.getItem("IP"));


	//general function
	function appendToConsole(msg){
		$("#console").prepend("<p>" + msg + "</p>");
	}

    //get data
    function getData(){
        sess.call("protos:data").then(function(result){
            if(result.lat){
                latlng = new google.maps.LatLng(convertLat(result.lat),convertLon(result.lon));
                $("#var_lat").html(convertLat(result.lat));
                $("#var_lng").html(convertLon(result.lon));
                map.setCenter(latlng);
                boatMarker.setPosition(latlng);
            }

            $("#var_temp_int").html(result.temp);
            $("#var_press_int").html(result.press);
            $("#var_compass_heading").html(result.heading);
        },function (error){
            appendToConsole(error);
        });
    }

    //wamp rpc setup
    function rpcsetup(ip){
        //wamp rpc
        // WAMP session object
        ab.debug(true,true);
        var wsuri = "ws://"+ip+":9000";
        appendToConsole("Attempt to connect to "+ip);

        // connect to WAMP server
        ab.connect(wsuri,
            // WAMP session was established
            function (session) {
                $("#connectform").hide();

                sess = session;
                appendToConsole("Connected to " + wsuri);
                // establish a prefix, so we can abbreviate procedure URIs ..
                sess.prefix("protos", "http://10.0.0.142/ws/protos#");
            },

            // WAMP session is gone
            function (code, reason) {
                sess = null;
                if (code == ab.CONNECTION_UNSUPPORTED) {
                    window.location = "http://autobahn.ws/unsupportedbrowser";
                } else {
                    appendToConsole(reason);
                }
            }
        );
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

	function convertLat( input ) {
		var lats = input+"";
		var lat1 = parseFloat(lats[2]+lats[3]+lats[4]+lats[5]+lats[6]+lats[7]+lats[8])/60;
		return parseFloat(lats[0]+lats[1])+lat1;
	}

	function convertLon(input){
		var longs = input+"";
		var long1 = parseFloat(longs[3]+longs[4]+longs[5]+longs[6]+longs[7]+longs[8]+longs[9])/60;
		return parseFloat(longs[0]+longs[1]+longs[2])+long1;
	}

    /***********************
     * Button Handlers
     ***********************/

	$("#sendcommands").on('click',function(e){
        e.preventDefault();
		// call a function and log result on success
		sess.call("protos:set_drive", parseFloat($("#speeddial").val())/100 , parseFloat($("#directiondial").val())/10).then(function(result){
            if(result !== true){
                appendToConsole("Return was false");
            }
			getData();
		},function (error){
			appendToConsole(error);
		});
	});

    $("#haltbutton").on('click',function(e){
        e.preventDefault();
        // call a function and log result on success
        sess.call("protos:set_drive", 0 , 0).then(function(result){
            if(result.status === true){
                //set speed & heading to 0
            }
            getData();
        },function (error){
            appendToConsole(error);
        });
    });

	$("#forcedata").on("click", function(e){
        e.preventDefault();
        // call a function and log result on success
        getData();
	});

    $("#scannetwork").on("click",function(e){
        e.preventDefault();
        runIpFinder();
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
});