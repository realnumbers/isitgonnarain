$(function(){
	/* Configuration */
	var header = {
        "rain": {
            "r1": "Dude, it's totally gonna rain today!",
            "r2": "Brace yourselves, Rain is coming.",
            "r3": "Rain. Rain everywhere.",
            "r4": "Bad news, guys. It's gonna rain."
        },
        "cloudy": {
            "c1": "It might be raining today, but I'm not sure.",
            "c2": "It could possibly rain today.",
            "c3": "The possibily of rain is not to be ruled out.",
            "c4": "It may very well rain today."
        },
        "sun": {
            "s1": "Nothing to worry about.",
            "s2": "Everything's fine.",
            "s3": "Lookin' good!",
            "s4": "You're in luck."
        }
    
    };
   var subtitles = {
        "rain": {
            "r1": "Better get an umbrella or something.",
            "r2": "I suggest staying at home and chilling out today.",
            "r3": "If you're thinking of leaving the house, you best think again.",
            "r4": "You should probably not leave the house without a jacket."
        },
        "cloudy": {
            "c1": "Take an umbrella, or don't. Your call. Don't blame me if you get wet, though.",
            "c2": "It's hard to say whether it's goint to rain, so you better be prepared.",
            "c3": "You should probably take an umbrella with you, just to be safe.",
            "c4": "If you're leaving the house you should take an umbrella with you."
        },
        "sun": {
            "s1": "No rain in sight.",
            "s2": "Rain is really unlikely today.",
            "s3": "It's not going to rain today.",
            "s4": "I'm pretty sure it's not going to rain."
        }
    
};


	var DEG = 'c';			// c for celsius, f for fahrenheit
	var rainCt = 0, cloudyCt = 0, sunCt = 0;
	var lastpage = 5;
	var lastpage2 = 5;
<<<<<<< HEAD
	notifyMe("Hello World");
=======
	
>>>>>>> 790b6129d7bee07bb3021920999f7fc5bd81f3cd
	
	var weatherDiv = $('#weather'),
		scroller = $('#scroller'),
		location = $('p.location'),
		huge = $('.huge'),
		subtitle = $('h4.subtitle');
<<<<<<< HEAD
		
		$( ".info" ).click(function() {
		aboutPage();
		});
=======
	var nText, nSub, nIcon;
	var randomNr = randomGen();
	
		setInterval(function(){
		if ( nText !== undefined && nSub !== undefined && nIcon !== undefined && lastpage !== 4 )
	{
		//alert(nText +" "+ nSub + nIcon)
		notifyMe(nText, nSub, nIcon)
	}
	},  2*60 * 100);
	// About Page	
	$( ".info" ).click(function() {
	aboutPage();
	});
	
	
	
>>>>>>> 790b6129d7bee07bb3021920999f7fc5bd81f3cd
	
	//Timer interval of 2min
	setInterval(function(){notifyMe("Hallo world!Nach 2 ");},  2*60 * 100);
	
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
						resetCt();
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
	}
	function changeSlide(slideNr){
		//randomGen();
		var slides = ["slide-rain", "slide-cloudy", "slide-sun", "slide-error", "slide-about", "slide-blank"];
		var slide = document.getElementById(slides[slideNr]);
		for (var i = 0; i < 6; i++) {
			var s = document.getElementById(slides[i]);
			s.style.display="none";
		} 
		lastpage2 = lastpage;
		lastpage = slideNr;

		slide.style.display="block";
		 
		randomSlide(slideNr);
		//notifyMe(nText, nSub, nIcon);
		document.title = "Dry - " + nText;
	}
	function resetCt() {
		rainCt = 0;
		cloudyCt = 0;
		sunCt = 0;
	}
	function randomSlide(currSlide) {
		
		switch(currSlide) {
			case 0:
				var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(header.rain, function(){
				if ( randomNr === randomSlideNumber ) {
					//alert(this);
					huge.html(this);
					return false;
					}
					else{randomSlideNumber++;}
					});
				var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(subtitles.rain, function(){
					if ( randomNr === randomSlideNumber ) {
						//alert(this);
						subtitle.html(this);
						randomNr = randomGen();
						return false;
						}
						else{randomSlideNumber++;}
						});
					var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(subtitles.rain, function(){
					if ( randomNr === randomSlideNumber ) {
						//alert(this);
						subtitle.html(this);
						randomNr = randomGen();
						nSub = this;
						nIcon = "img/rain.png";
						//alert(nIcon);
						
						return false;
						}
						else{randomSlideNumber++;}
						});
					
				break;
			case 1:
				var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(header.cloudy, function(){
				if ( randomNr === randomSlideNumber ) {
					//alert(this);
					huge.html(this);
					return false;
					}
					else{randomSlideNumber++;}
					});
				var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(subtitles.cloudy, function(){
					if ( randomNr === randomSlideNumber ) {
						//alert(this);
						subtitle.html(this);
						randomNr = randomGen();
						return false;
						}
						else{randomSlideNumber++;}
						});
					var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(subtitles.cloudy, function(){
					if ( randomNr === randomSlideNumber ) {
						//alert(this);
						subtitle.html(this);
						randomNr = randomGen();
						nSub = this;
						nIcon = "img/cloudy.png";
						//alert(nIcon);
						
						return false;
						}
						else{randomSlideNumber++;}
						});
					
				break;
			case 2:
				var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(header.sun, function(){
					if ( randomNr === randomSlideNumber ) {
						//alert(this);
						huge.html(this);
						randomNr = randomGen();
						nText = this;
						return false;
						}
						else{randomSlideNumber++;}
						});
				var randomSlideNumber = 1;
				randomNr = randomGen();
				$.each(subtitles.sun, function(){
					if ( randomNr === randomSlideNumber ) {
						//alert(this);
						subtitle.html(this);
						randomNr = randomGen();
						nSub = this;
						nIcon = "img/sun.png";
						//alert(nIcon);
						
						return false;
						}
						else{randomSlideNumber++;}
						});
					
				break;
			}
	}
	
	/*function notifyText(nText, nSub, nIcon) {
		var IconPath = "img/" + nIcon + ".png";
		//Timer interval of 2min
		notifyMe(nText, nSub, IconPath);
	}*/
	
	function randomGen() {
		return Math.floor((Math.random()*4)+1);
	}
	/* About Page*/
	function aboutPage(){
		if (lastpage === 4){
			changeSlide(lastpage2);
		}
		else {
			changeSlide(4);
		}
	}

<<<<<<< HEAD
	function notifyMe(notifyMessage) {
=======
	function notifyMe(notifyTitle, notifyBody, notifyIcon) {
>>>>>>> 790b6129d7bee07bb3021920999f7fc5bd81f3cd
		// Let's check if the browser supports notifications
		if (!"Notification" in window) {
			alert("This browser does not support desktop notification");
		}

		// Let's check if the user is okay to get some notification
		else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
<<<<<<< HEAD
			var notification = new Notification(notifyMessage);
=======
			/*var notification = new Notification(notifyMessage);*/
			var notification = new Notification(notifyTitle, {body: notifyBody, icon: notifyIcon});
>>>>>>> 790b6129d7bee07bb3021920999f7fc5bd81f3cd
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
<<<<<<< HEAD
				var notification = new Notification(notifyMessage);
=======
				var notification = new Notification(notifyTitle, {body: notifyBody, icon: notifyIcon});
>>>>>>> 790b6129d7bee07bb3021920999f7fc5bd81f3cd
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
				location.html('A timeout occured! Please try again!');
				changeSlide(3);
				break;
			case error.POSITION_UNAVAILABLE:
				location.html('We can\'t detect your location. Sorry!');
				changeSlide(3);
				break;
			case error.PERMISSION_DENIED:
				subtitle.html('Please allow geolocation access for this to work.');
				changeSlide(3);
				break;
			case "NO_GEOLOCATION":
				subtitle.html('Your browser does not support Geolocation!');
				changeSlide(3);
				break;
			case "NO_CITY_FOUND":
				location.html('We can\'t find information about your city!');
				changeSlide(3);
				break;
			case error.UNKNOWN_ERROR:
				location.html('An unknown error occured!');
				changeSlide(3);
				break;
				
		}

	}

	function convertTemperature(kelvin){
		// Convert the temperature to either Celsius or Fahrenheit:
		return Math.round(DEG == 'c' ? (kelvin - 273.15) : (kelvin*9/5 - 459.67));
	}

	function showError(msg){
		weatherDiv.addClass('error').html(msg);
	}

});
