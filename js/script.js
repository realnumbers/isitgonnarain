$(function(){
	/* Configuration */
	// Initialization of content
var header = {
    "blank": {
        "title": "Dry"
    },
    "rain": {
        "0": "Dude, it's totally gonna rain today!",
        "1": "Brace yourselves, Rain is coming.",
        "2": "Rain. Rain everywhere.",
        "3": "Bad news, guys. It's gonna rain."
    },
    "clouds": {
        "0": "It might be raining today, but I'm not sure.",
        "1": "It could possibly rain today.",
        "2": "The possibily of rain is not to be ruled out.",
        "3": "It may very well rain today."
    },
    "clear": {
        "0": "Nothing to worry about.",
        "1": "Everything's fine.",
        "2": "Lookin' good!",
        "3": "You're in luck."
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
            "0": "Better get an umbrella or something.",
            "1": "I suggest staying at home and chilling out today.",
            "2": "If you're thinking of leaving the house, you best think again.",
            "3": "You should probably not leave the house without a jacket."
        },
        "clouds": {
            "0": "Take an umbrella, or don't. Your call. Don't blame me if you get wet, though.",
            "1": "It's hard to say whether it's goint to rain, so you better be prepared.",
            "2": "You should probably take an umbrella with you, just to be safe.",
            "3": "If you're leaving the house you should take an umbrella with you."
        },
        "clear": {
            "0": "No rain in sight.",
            "1": "Rain is really unlikely today.",
            "2": "It's not going to rain today.",
            "3": "I'm pretty sure it's not going to rain."
        },
        "about": {
        	"logo": "Designed and developed by <a href=\"http://julian.sparber.net\">Julian Sparber</a> and <a href=\"http://tobiasbernard.com\">Tobias Bernard</a> for the 2013 Open Data Hackathon.<br> <br>Weather Data by <a href=\"http://openweathermap.com\">OpenWeatherMap</a>.<br> <br>This application is <a href=\"https://www.gnu.org/philosophy/free-sw.html\">Free Software</a>, released under the <a href=\"https://www.gnu.org/licenses/gpl.html\">GPLv3</a> or later.<br>Get the source on <a href=\"https://github.com/realnumbers/isitgonnarain\">Github</a>."
        }
};	
	var slides = ["rain", "clouds", "clear", "error", "about", "blank"];
	var numberOfSlides = 6;
	var rainCt = 0, 
		cloudsCt = 0
		clearCt = 0;
	var city, country; 
	var nText, nSub, nIcon;
	var previousPage = "blank", 
		beforePage = "blank";
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
				function getWeather(callback) {
				var weather = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&units=metric&cnt=1&APPID=683af5473c859d5de2d9a1d6fdd40d9b';
				$.ajax({
				  dataType: "jsonp",
				  url: weather,
				  success: callback
				});
			}

			// get data:
			getWeather(function (data) {
				var mainLowercase = data.list[0].weather[0].main.toLowerCase();
				console.log('weather data received');
				console.log(mainLowercase);
				city = data.city.name;
				country = data.city.country;
				location.html(city+', <b>'+country+'</b>');
				changeSlide(mainLowercase);
				
			});

				weatherDiv.addClass('loaded');
				// Set the slider to the first slide

		}
		
		catch(e){
			/*Error:We can't find information about your city!*/
			alert("Error");
			locationError("NO_CITY_FOUND");
			window.console && console.error(e);
		}
	}

	function changeSlide(condition){
		//randomGen();
		/*var slide = document.getElementById("slide-" + condition);
		for (var i = 0; i < numberOfSlides; i++) {
			var s = document.getElementById("slide-" + slides[i]);
			s.style.display="none";
		}*/
		var tagsBody = document.getElementsByTagName('body');
		alert(tagsBody[0].id);
		tagsBody[0].id = "slide-" + condition;
		alert("After " + tagsBody[0].id);
		beforePage = previousPage;
		console.log(condition);
		previousPage = condition;
		//slide.style.display="block";
		
		randomTextOnSlide(condition);
		document.title = "Dry - " + nText;
	}
	function resetCt() {
		rainCt = 0;
		cloudsCt = 0;
		clearCt = 0;
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
		return Math.floor((Math.random()* (numberOfSlides - 2)));
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
