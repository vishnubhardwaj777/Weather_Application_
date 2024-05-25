// console.log("Hii Vishnu Bhardwaj")

const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")

const grantAccess = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"
getfromSessionStorage();

// Add background-color in userTab (Your Weather)
currentTab.classList.add("current-tab");





// SwitchTab Logic
function switchTab(clickedTab){
    if(clickedTab != currentTab){
      currentTab.classList.remove("current-tab");
      currentTab = clickedTab;
      currentTab.classList.add("current-tab");  
    }

    // kya searchTab kai anndar active class hai  aagar nhi hai to if condition chalegi
    // hum phelai userTab mai thai  
    if(!searchForm.classList.contains("active")){

      // weather information window hide karo
      userInfoContainer.classList.remove("active");

      // grant access window bhi hide karo
      grantAccess.classList.remove("active");

      // search form (SearchTab) ko visibal karo 
      searchForm.classList.add("active");
    }
    
    // hum phalai searchTab mai thai or humai ab userTab mai jana hai
    else{

      // searchTab ko hide kardiya
      searchForm.classList.remove("active");

      // phelai humai yai dekna hoga ki user kai pass coordinates ka access hai kai nhi 
      // aagar user kai pass coordinates ka access nhi hai to phelai humai Grant Location Access window dekhani hogi
      // iss liyai userInfoContainer mai hide (remove) class ko lagaya hai  
      userInfoContainer.classList.remove("active");


      // abb mai userTab kai andar aa gya hu or abb mujai check karna is function ki help sai ki user kai pass coordinate ka access hai kai nhi
      getfromSessionStorage();
    }
}



// event listener on userTab (Your Weather)
userTab.addEventListener("click", () => {
    switchTab(userTab);
})

// event listener on searchTab (Search Weather)
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})





function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  // agar local coordinates nhi miltai
  if(!localCoordinates) {
    
    // is case mai hum Grant Location Access ki window ko active karegai 
    // or hum Grant Access wale button pai event Listner lagaigai iska function nichai likha hai
    grantAccess.classList.add("active");

  }

  // agar local Coordinates mil jatai hai 
  else {

    // JSON.Parse (hamara sara data string form mai recive hua hai to hamai object mai change karnai kai liyai JSON.Parse ka use kiya hai)
    const coordinates = JSON.parse(localCoordinates);
    
    fetchUserWeatherInfo(coordinates);
  }
}





async function fetchUserWeatherInfo(coordinates) {

  const {lat, lon} = coordinates;

  // ab Grant Location Access ko hide karna hai
  grantAccess.classList.remove("active");

  // or loading Screen ko active karna hai
  loadingScreen.classList.add("active");

  // API call karo

  try {

    // yaha pai API call ki gyi hai
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

    const data = await response.json();

    // loading window ko remove kar rahe hai kyo ki data aa chuka hai
    loadingScreen.classList.remove("active");

    // ab userInfoContainer ko window pai dekhana hai kyo ki data aa chuka hai
    userInfoContainer.classList.add("active");

    randorWeatherInfo(data);

  } catch (error) {
    console.log(`Error Found`,error);
  }
}





function randorWeatherInfo(weatherInfo) {

  const cityName = document.querySelector("[data-city-name]");
  const countryIcon = document.querySelector("[data-country-icon]");
  const weatherDescription = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const weatherTemp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-wind-speed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloud]");

  // Api nai data diya usko JSON Object mai covert kar kai us mai sai data fetch kar raha hu (online JSON Formatter mai sai)
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;;
  weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;;
  weatherTemp.innerText = `${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed}%`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}





// coordinate find karnai kai liyai function
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert(`Geolocation not Support`);
  }
}

function showPosition(position) {
   const userCoordinates = {
     lat : position.coords.latitude, 
     lon : position.coords.longitude,
   }

   sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
   // userWeatherInfo function ko call kar kai data fetch karegai coordinates mai sai
   fetchUserWeatherInfo(userCoordinates);
}

// Add event listner on Grant Access Button
const grantAccessButton = document.querySelector("[data-grant-access]");
grantAccessButton.addEventListener("click", getLocation);





const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityName = searchInput.value;
  if(cityName == ""){
    return;
  }

  else {
    fetchUserWeatherInfoSearch(cityName);
  }
})

async function fetchUserWeatherInfoSearch(city) {
  loadingScreen.classList.add("active");
  grantAccess.classList.remove("active");
  userInfoContainer.classList.remove("active");

  try {
    // console.log(`all good`);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    // console.log(`all good 2`);
    const data = await response.json();

    loadingScreen.classList.remove(`active`);
    userInfoContainer.classList.add(`active`);
    randorWeatherInfo(data);
  } 
  catch (error) {
    console.log(`Error Occur`,error);
  }
}