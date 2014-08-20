$( document ).ready(function() {
	$('.chart').easyPieChart({
		barColor: '#3da0ea',
		animate: 2000,
		scaleColor: false,
		lineWidth: 12,
		lineCap: 'square',
		size: 75,
		trackColor: '#e5e5e5'
	});

	$("#speeddial").knob({
		'min':0
		,'max':100
		,'angleArc':300
		,'angleOffset':-150
		,'displayPrevious': true
	});

	//general function
	function appentoconsole(msg){
		$("#console").append("<p>" + msg + "</p>");
	}

	//google maps
	var map;
	var mapOptions = {
		zoom: 30,
		center: new google.maps.LatLng(-34.397, 150.644),
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(-34.397, 150.644),
		map: map,
		title: 'invenavi'
	});
	//wamp rpc
	// WAMP session object
	var sess = null;
	window.onload = function() {
		ab.debug(true,true);
		var wsuri = "ws://10.0.0.142:9000";

		// connect to WAMP server
		ab.connect(wsuri,
			// WAMP session was established
			function (session) {
				sess = session;
				appentoconsole("Connected to " + wsuri);
				// establish a prefix, so we can abbreviate procedure URIs ..
				sess.prefix("protos", "http://10.0.0.142/ws/protos#");
				getdata();
			},

			// WAMP session is gone
			function (code, reason) {
				sess = null;
				if (code == ab.CONNECTION_UNSUPPORTED) {
					window.location = "http://autobahn.ws/unsupportedbrowser";
				} else {
					appentoconsole(reason);
				}
			}
		);
	};

	function getdata(){
		// call a function and log result on success
		sess.call("protos:data").then(function(result){
			latlng = new google.maps.LatLng(convertlat(result.lat),convertlon(result.lon));
			$("#var_lat").html(convertlat(result.lat));
			$("#var_lng").html(convertlon(result.lon));
			$("#var_temp_int").html(result.temp);
			$("#var_press_int").html(result.press);
			$("#var_compass_heading").html(result.heading);
			map.setCenter(latlng);
			marker.setPosition(latlng)
		},function (error){
			appentoconsole(error);
		});
	}

	function convertlat( input ) {
		var lats = input+"";
		var lat1 = parseFloat(lats[2]+lats[3]+lats[4]+lats[5]+lats[6]+lats[7]+lats[8])/60;
		var lat = parseFloat(lats[0]+lats[1])+lat1;
		return lat;
	}
	function convertlon(input){
		var longs = input+"";
		var long1 = parseFloat(longs[3]+longs[4]+longs[5]+longs[6]+longs[7]+longs[8]+longs[9])/60;
		var long = parseFloat(longs[0]+longs[1]+longs[2])+long1;
		return long;
	}
	$("#sendcommands").on('click',function(){
		// call a function and log result on success
		sess.call("protos:set_drive", parseFloat($("#speeddial").val())/100 , parseFloat($("#directiondial").val())/10).then(function(result){
			getdata();
		},function (error){
			appentoconsole(error);
		});
	});
	$("#forcedata").on("click", function(e){
		e.preventDefault();
		getdata();
	});
	$("#takepicture").on("click", function(e){
		e.preventDefault();
		// call a function and log result on success
		sess.call("protos:picture").then(function(result){
			$("#datapicture").prop("src","data:image/jpg;base64,"+result.image);
		},function (error){
			appentoconsole(error);
		});
	});

});