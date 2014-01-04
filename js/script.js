$(function(){
	/* Configuration */
	// Initialization of content
	var header = {
		"blank": "Dry",
		"rain": "It's totally gonna rain today!",
		"clouds": "It might rain today.",
		"clear": "Nothing to worry about.",
		"snow": "Yay, it's going to snow!",
		"about": "About"
	}

	var subtitles = {
		"blank": "",
		"rain": "Better get an umbrella or something.",
		"clouds": "You should probably take an umbrella with you, just to be safe.",
		"clear": "Rain is really unlikely today.",
		"snow": "You should probably wear boots and warm clothes today.",
		"about": "Designed and developed by <a href=\"http://julian.sparber.net\" target=”_blank”>Julian Sparber</a> and <a href=\"http://tobiasbernard.com\" target=\”_blank\”>Tobias Bernard</a> for the 2013 Open Data Hackathon.<br> <br>Weather Data by <a href=\"http://openweathermap.com\" target=\”_blank\”>OpenWeatherMap</a>.<br> <br>This application is <a href=\"https://www.gnu.org/philosophy/free-sw.html\" target=\”_blank\”>Free Software</a>, released under the <a href=\"https://www.gnu.org/licenses/gpl.html\" target=\”_blank\”>GPLv3</a> or later.<br>Get the source on <a href=\"https://github.com/realnumbers/isitgonnarain\" target=\”_blank\”>Github</a>."
	};
	var numberOfSlides = 6;
	var city, country; 
	var nText, nSub, nIcon;
	var previousPage = "blank", 
		beforePage = "blank";
	var cache = false;
	var errorMsg;
	var weather = "NULL";
	var tmp_city;
	var weatherDiv = $('#weather'),
		location = $('p.location'),
		huge = $('.huge'),
		subtitle = $('h4.subtitle');
	textOnSlide("blank");
	// Interval of 3 h
	setInterval(function(){
	if ( nText !== undefined && nSub !== undefined && nIcon !== undefined )
		{
			//alert(nText +" "+ nSub + nIcon)
			notifyMe(nText, nSub, nIcon)
		}
	},  3 * 60 * 60 * 1000);
	
	// Load About Page
	$( ".info" ).click(function() {
		aboutPage();
	});
	
	// Change city settings
	$( ".location" ).click(function() {
		tmp_city = prompt("Manually choose a city (Leave empty for automatic detection):");
		if ( tmp_city !== null ){
			localStorage["city"] = tmp_city;
			if ( localStorage["city"] !== "" ){
			weather = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+localStorage["city"]+'&units=metric&cnt=1&APPID=683af5473c859d5de2d9a1d6fdd40d9b';
		locationSuccess();
		}
		else{
			weather = "NULL";
			localStorage["cache"] = "false";
			loadLocation();
		}
	}
	});
	if ( localStorage["cache"] !== "true" ){		
		loadLocation();
	}
	else {
		weather = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+localStorage["city"]+'&units=metric&cnt=1&APPID=683af5473c859d5de2d9a1d6fdd40d9b';
		locationSuccess();
	}
	
	function locationSuccess(position) {
		try{
			if ( weather === "NULL" ){
				weather = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&units=metric&cnt=1&APPID=683af5473c859d5de2d9a1d6fdd40d9b';
			}
	//	alert(weather);
			/*
			 function getWeather(callback) {
				var weather = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&units=metric&cnt=1&APPID=683af5473c859d5de2d9a1d6fdd40d9b';
				$.ajax({
				  dataType: "jsonp",
				  url: weather,
				  success: callback
				});
			}*/

			// get data:
			getWeather(weather, function (data) {
				var mainLowercase = data.list[0].weather[0].main.toLowerCase();
				console.log('weather data received');
				console.log(mainLowercase);
				city = data.city.name;
				localStorage["cache"] = "true";
				localStorage["city"] = city;
				country = data.city.country;
				location.html(city+', <b>'+country+'</b>');
				changeSlide(mainLowercase);
				
			});

				weatherDiv.addClass('loaded');
				// Set the slider to the first slide

		}
		
		catch(e){
			/*Error:We can't find information about your city!*/
			locationError("NO_CITY_FOUND");
			window.console && console.error(e);
		}
	}
	function supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
	function getWeather(weather, callback) {
		//var weather = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lon+'&units=metric&cnt=1&APPID=683af5473c859d5de2d9a1d6fdd40d9b';
		$.ajax({
		  dataType: "jsonp",
		  url: weather,
		  success: callback
		});
	}

	function changeSlide(condition){
		var tagsBody = document.getElementsByTagName('body');
		tagsBody[0].id = "slide-" + condition;
		beforePage = previousPage;
		console.log(condition);
		previousPage = condition;
		//slide.style.display="block";
		
		textOnSlide(condition);
		document.title = "Dry - " + nText;
	}
	function textOnSlide(currSlide) {		
		if (currSlide !== "error"){
			huge.html(header[currSlide]);
			nText = header[currSlide];
			subtitle.html(subtitles[currSlide]);
			nSub = subtitles[currSlide];
			nIcon = "img/" + currSlide + ".png";
		}
		else{
			if (currSlide === "error"){
				huge.html("Shit ain't working.");
				subtitle.html(errorMsg);
				nText = "Shit ain't working.";
			}
			/*else {
			huge.html(header[currSlide].title);
			subtitle.html(subtitles[currSlide].logo);
			// Delete this
			var about = $('p.about');
			about.html(subtitles[currSlide].logo);
			}
			*/
		}
	}
	function loadLocation(){
		// Does this browser support geolocation?
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
		}
		else{
			/*Error: Your browser does not support Geolocation!*/
			locationError("NO_GEOLOCATION");
		}
	}
	//Change Slide to About Page
	function aboutPage(){
		if (previousPage === "about"){
			nText = "Like a Weather app, but more useful";
			changeSlide(beforePage);
		}
		else {
			nText = "About";
			changeSlide("about");
		}
	}

	function notifyMe(notifyTitle, notifyBody, notifyIcon) {
		// Let's check if the browser supports notifications
		if (!"Notification" in window) {
			alert("This browser does not support web notifications");
		}
		// Let's check if the user is okay to get some notification
		else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
			/*var notification = new Notification(notifyMessage);*/
			var notification = new Notification(notifyTitle, {body: notifyBody, icon: notifyIcon});
		}
		// Otherwise, we need to ask the user for permission
		// Note, Chrome does not implement the permission static property
		// So we have to check for NOT 'denied' instead of 'default'
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
			// Whatever the user answers, we make sure Chrome stores the information
			if(!('permission' in Notification)) {
				Notification.permission = permission;
			}
			// If the user is okay, let's create a notification
			if (permission === "granted") {
				var notification = new Notification(notifyTitle, {body: notifyBody, icon: notifyIcon});
			}
			});
			}
			// At last, if the user already denied any notification, and you 
			// want to be respectful there is no need to bother him any more.
	}
	/* Error handling functions */
	function locationError(error){
		switch(error.code) {
			case error.TIMEOUT:
				errorMsg = 'A timeout occured! Please try again!';
				changeSlide(3);
				break;
			case error.POSITION_UNAVAILABLE:
				errorMsg = 'We can\'t detect your location. Sorry!';
				changeSlide(3);
				break;
			case error.PERMISSION_DENIED:
				errorMsg = "Please allow geolocation access for this to work.";
				changeSlide(3);
				break;
			case "NO_GEOLOCATION":
				errorMsg = 'Your browser does not support Geolocation!';
				changeSlide(3);
				break;
			case "NO_CITY_FOUND":
				errorMsg = 'We can\'t find information about your city!';
				changeSlide(3);
				break;
			case error.UNKNOWN_ERROR:
				errorMsg = 'An unknown error occured!';
				changeSlide(3);
				break;
		}
	}
	function showError(msg){
		weatherDiv.addClass('error').html(msg);
	}
});
