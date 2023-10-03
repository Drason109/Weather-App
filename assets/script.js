var APIKey = "a9bbadef8c1001c7a16868ab0cc46c65";//api key

var city = "";//empty array for the city

//grabs the search input when clicked on search
$("#search-btn").on("click", function(event){
    event.preventDefault();

    city = $("#search").val();
    if(city === ''){
        return alert('Enter a valid City Name!');

    }
    getweather(city);

    saveLocalStorage(city);

});
//makes a list of all the names that were searched
function historyCity(){
    var cityList = $("<li>");
    var cityButton = $('<button>');

    cityButton.attr('id', 'past-search');
    cityButton.text(city);
    cityList.append(cityButton);
    $("#history").append(cityList);
    $("#past-search").on("click", function(){
        var sameCity = $(this).text();
        getweather(sameCity);
    });

}
//gets the weather for the main weather display
function getweather(city){
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    fetch(apiURL).then(function(response){
        var time = new Date();
        time = time.getMonth() + time.getDay() + time.getFullYear();
        $("#search").empty()
        $("#forecast").empty()
        var mainCity = $("#current").append($("<p><h2>" + response.name + '(' + time + ')' + "<h2><p>"));
        var image = $('<img>').attr('src', 'https//openweathermap.org/img/w/' + response.weather[0].icon + '.png');
        var temperature = $('<p>').text('Temperature : ' + response.main.temp + '°F');
        var humidity = $('<p>').text('Humidity : ' + response.main.humidity + '%');
        var windMain = $('<p>').text('Wind Speed : ' + response.wind.speed + 'MPH');
        var uvindex = '&lat=' + response.coord.lat + '&lon=' + response.coord.lon;
        var cityTag = response.id;

        UVIndex(uvindex);
        displayForecast(cityTag);

        mainCity.append(image);
        mainCity.append(temperature);
        mainCity.append(humidity);
        mainCity.append(windMain);
        $('#history').empty();
        $('#history').append(mainCity);
    });
    
}
//gets the index of and makes a display box in the main box
function UVIndex(uv){
    var UVURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + uv;
    fetch(UVURL).then(function (response){
        var UVdisplay = $("<p><span>").text('UV-Index : ' + response.value);
    });
}
//displays the 5 days forecast
function displayForecast(c){
    var forecast = "https://api.openwaethermap.org/data/2.5/forecast?id=" + c + "&units=imperials&APPID=" + APIKey;
    fetch(forecast).then(function(response){
        var daysList = response.list;
        for(daysList[i]; i < daysList.length; i++){
            if(daysList[i].dt_txt.split(' ')[1] === "12:00:00"){
                var cityMain = $("#forecast");
                var days5 = $("<h4>").text(response.list[i].dt_txt.split(" ")[0]);
                var imageD = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + daysList[i].weather[0].icon + '.png');
                var degree = $('<p>').text('Temp : ' + daysList[i].main.temp + ' °F');               
                var humidityD = $('<p>').text('Humidity : ' + daysList[i].main.humidity + '%');
                var windD = $('<p>').text('Wind Speed : ' + daysList[i].wind.speed + 'MPH');                
                cityMain.append(days5)
                cityMain.append(imageD)
                cityMain.append(degree)
                cityMain.append(humidityD)
                cityMain.append(windD);
                $('#days').append(cityMain);
                
            }
        }
    });
}
//stores all the name that where looked up for future fetch
function checkLocalStorage(){
    var storeData = localStorage.getItem('info');
    var data = [];
    if(!storeData){
        console.log("no data");
    }else{
        storeData.trim();
        data = storeData.split(',');
        for(var i = 0;i < data.length; i++){
            historyCity(data[i]);
        }
    }
};

//save the local storage of city and their info
function saveLocalStorage(city){
    var saveData = localStorage.getItem('info');
    if(saveData){
        console.log(saveData, city)
    }else{
        saveData = city;
        localStorage.setItem('info', saveData);
    }
    if(saveData.indexOf(city)=== -1) {
      saveData = saveData + ',' + city;
      localStorage.setItem('info', saveData);
      historyCity(city);  
    }
}


