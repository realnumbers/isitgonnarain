$(function(){
	/* Configuration */
	// Initialization of content
var header = {
    "blank": {
        "title": "Dry"
    },
    "rain": {
        "1": "Dude, it's totally gonna rain today!",
        "2": "Brace yourselves, Rain is coming.",
        "3": "Rain. Rain everywhere.",
        "4": "Bad news, guys. It's gonna rain."
    },
    "cloudy": {
        "1": "It might be raining today, but I'm not sure.",
        "2": "It could possibly rain today.",
        "3": "The possibily of rain is not to be ruled out.",
        "4": "It may very well rain today."
    },
    "sun": {
        "1": "Nothing to worry about.",
        "2": "Everything's fine.",
        "3": "Lookin' good!",
        "4": "You're in luck."
    },
    "about": {
        "title": "About"
    }
}

   var subtitles = {
   		"blank": {
        "logo": ""
		},
        "rain": {
            "1": "Better get an umbrella or something.",
            "2": "I suggest staying at home and chilling out today.",
            "3": "If you're thinking of leaving the house, you best think again.",
            "4": "You should probably not leave the house without a jacket."
        },
        "cloudy": {
            "1": "Take an umbrella, or don't. Your call. Don't blame me if you get wet, though.",
            "2": "It's hard to say whether it's goint to rain, so you better be prepared.",
            "3": "You should probably take an umbrella with you, just to be safe.",
            "4": "If you're leaving the house you should take an umbrella with you."
        },
        "sun": {
            "1": "No rain in sight.",
            "2": "Rain is really unlikely today.",
            "3": "It's not going to rain today.",
            "4": "I'm pretty sure it's not going to rain."
        },
        "about": {
        	"logo": "Designed and developed by <a href=\"http://julian.sparber.net\">Julian Sparber</a> and <a href=\"http://tobiasbernard.com\">Tobias Bernard</a> for the 2013 Open Data Hackathon.<br> <br>Weather Data by <a href=\"http://openweathermap.com\">OpenWeatherMap</a>.<br> <br>This application is <a href=\"https://www.gnu.org/philosophy/free-sw.html\">Free Software</a>, released under the <a href=\"https://www.gnu.org/licenses/gpl.html\">GPLv3</a> or later.<br>Get the source on <a href=\"https://github.com/realnumbers/isitgonnarain\">Github</a>."
        }
};	
	var RAIN = 0, CLOUDY = 1, SUN = 2, ERR0R = 3, ABOUT = 4, BLANK = 5;
	var slides = ["rain", "cloudy", "sun", "error", "about", "blank"];
	var rainCt = 0, 
		cloudyCt = 0
		sunCt = 0;
	var nText, nSub, nIcon;
	var previousPage = BLANK, 
		beforePage = BLANK;
	var randomNr = randomGen();
	var errorMsg;
	var weatherDiv = $('#weather'),
		location = $('p.location'),
		huge = $('.huge'),
		subtitle = $('h4.subtitle');
	randomTextOnSlide("blank");
	// Interval of 3 h
	setInterval(function(){
	if ( nText !== undefined && nSub !== undefined && nIcon !== undefined )
		{
			//alert(nText +" "+ nSub + nIcon)
			notifyMe(nText, nSub, nIcon)
		}
	},  3 * 60 * 60 * 1000);
	
	// goto About Page
	$( ".info" ).click(function() {
	aboutPage();
	});
	
	// Does this browser support geolocation?
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	}
	else{
		/*Error: Your browser does not support Geolocation!*/
		locationError("NO_GEOLOCATION");
	}
	// Get user's location, and use OpenWeatherMap
	// to get the location name and weather forecast
	function locationSuccess(position) {
		try{
			// Retrive the cache
			var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
			var d = new Date();
			// If the cache is newer than 30 minutes, use the cache
			if(cache && cache.timestamp && cache.timestamp > d.getTime() - 30*60*1000){
				// Get the offset from UTC (turn the offset minutes into ms)
				var offset = d.getTimezoneOffset()*60*1000;
				var city = cache.data.city.name;
				var country = cache.data.city.country;
				$.each(cache.data.list, function(){
					// "this" holds a forecast object
					// Get the local time of this forecast (the api returns it in utc)
					var localTime = new Date(this.dt*1000 - offset);
					var sum = sunCt + cloudyCt + rainCt;
					if (sum > 3){
						determineSlide();
						return false;
					}
					else {
						checkForecast(this.weather[0].main);
					}
				});
				// Add the location to the page
				location.html(city+', <b>'+country+'</b>');
				weatherDiv.addClass('loaded');
				// Set the slider to the first slide
			}
			else{
				// If the cache is old or nonexistent, issue a new AJAX request
				var weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat='+position.coords.latitude+
									'&lon='+position.coords.longitude+'&callback=?'
				$.getJSON(weatherAPI, function(response){
					// Store the cache
					localStorage.weatherCache = JSON.stringify({
						timestamp:(new Date()).getTime(),	// getTime() returns milliseconds
						data: response
					});
					// Call the function again
					locationSuccess(position);
				});
			}
		}
		catch(e){
			/*Error:We can't find information about your city!*/
			locationError("NO_CITY_FOUND");
			window.console && console.error(e);
		}
	}
	function checkForecast(condition){
		if (condition === "Clear"){
			sunCt++;
		}
		else {
			if (condition === "Clouds"){
				cloudyCt++;
			}
			else {
				rainCt++;
			}
		}
	}
	function determineSlide(){
		if (rainCt > 2){
			changeSlide(0);
		}
		else { 
			if (sunCt + cloudyCt > 2){
				changeSlide(2);
			}
			else {
				changeSlide(1);
			}
		}
		resetCt();
	}
	function changeSlide(slideNr){
		//randomGen();
		var slide = document.getElementById("slide-" + slides[slideNr]);
		for (var i = 0; i < 6; i++) {
			var s = document.getElementById("slide-" + slides[i]);
			s.style.display="none";
		} 
		beforePage = previousPage;
		previousPage = slideNr;
		slide.style.display="block";
		randomTextOnSlide(slides[slideNr]);
		document.title = "Dry - " + nText;
	}
	function resetCt() {
		rainCt = 0;
		cloudyCt = 0;
		sunCt = 0;
	}
	function randomTextOnSlide(currSlide) {
		if (currSlide !== "about" && currSlide !== "blank" && currSlide !== "error"){
			randomNr = randomGen();
			huge.html(header[currSlide][randomNr]);
			nText = header[currSlide][randomNr];
			randomNr = randomGen();
			subtitle.html(subtitles[currSlide][randomNr]);
			nSub = subtitles[currSlide][randomNr];
			nIcon = "img/" + currSlide + ".png";
		}
		else{
			if (currSlide === "error"){
				huge.html("Shit ain't working.");
				subtitle.html(errorMsg);
				nText = "Shit ain't working.";
			}
			else {
			huge.html(header[currSlide].title);
			subtitle.html(subtitles[currSlide].logo);
			// Delete this
			var about = $('p.about');
			about.html(subtitles[currSlide].logo);
			}
		}
	}
	// Gernerate Random Number
	function randomGen() {
		return Math.floor((Math.random()*4)+1);
	}
	//Change Slide to About Page
	function aboutPage(){
		if (previousPage === ABOUT){
			nText = "Like a Weather app, but more useful";
			changeSlide(beforePage);
		}
		else {
			nText = "About";
			changeSlide(ABOUT);
		}
	}

	function notifyMe(notifyTitle, notifyBody, notifyIcon) {
		// Let's check if the browser supports notifications
		if (!"Notification" in window) {
			alert("This browser does not support desktop notification");
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
