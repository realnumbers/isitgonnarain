$(function(){

	/* Configuration */

	var DEG = 'c';			// c for celsius, f for fahrenheit
	var rainCt = 0, cloudyCt = 0, sunCt = 0; 
	var weatherDiv = $('#weather'),
		scroller = $('#scroller'),
		location = $('p.location');
		subtitle = $('h4.subtitle')
	// Does this browser support geolocation?
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	}
	else{
		/*Error: Your browser does not support Geolocation!*/
		locationError(error.NO_GEOLOCATION);
		
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
			locationError(error.NO_CITY_FOUND);
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
		var slides = ["slide-rain", "slide-cloudy", "slide-sun", "slide-error", "slide-about", "slide-blank"];
		var slide = document.getElementById(slides[slideNr]);
		for (var i = 0; i < 4; i++) {
			var s = document.getElementById(slides[i]);
			s.style.display="none";
		} 
		slide.style.display="block";
	}
	function resetCt () {
		rainCt = 0;
		cloudyCt = 0;
		sunCt = 0;
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
			case error.NO_GEOLOCATION:
				subtitle.html('Your browser does not support Geolocation!');
				changeSlide(3);
				break;
			case error.NO_CITY_FOUND:
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
