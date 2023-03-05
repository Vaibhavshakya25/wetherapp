const usertab = document.querySelector('[usertab]');
const searchtab = document.querySelector('[searchtab]');
const grantbtn = document.querySelector('[grantpermission]');
const loader = document.querySelector('[loader]');
const grantlocation_tab = document.querySelector('[grantlocation]');
const your_tab_window = document.querySelector('[yourtab]');
const search_container = document.querySelector('[searchcontainer]');
const searchbtn = document.querySelector('[searchicon]');
const apikey = '6e465ced7f21c5207b02e1ebc68abaf0';
let currenttab = usertab;
currenttab.classList.add('current-tab');
getfromsessionstorage();
function getfromsessionstorage(){
    const localcordinate = sessionStorage.getItem('user_coordinate');
    if(!localcordinate){
        grantlocation_tab.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localcordinate);
        fetctUserweatherdata(coordinates);
    }
}

function renderUI(data){
    const city = document.querySelector('[location-data]');
    const flag = document.querySelector('[countryflag]');
    const description = document.querySelector('[desc]');
    const wethericon = document.querySelector('[wethericon]');
    const temperature = document.querySelector('[temperature]');
    const windspeed = document.querySelector('[windspeed]');
    const humidity = document.querySelector('[humidity]');
    const cloud = document.querySelector('[cloud]');
    try{
        city.innerText = data?.name;
        try{
            flag.src = `https://flagcdn.com/16x12/${data?.sys?.country.toLowerCase()}.png`;
        }
        catch(err){
            alert('Country Flag Fetching Problem');
        }
        description.innerText = data?.weather?.[0]?.description;
        try{
            wethericon.src = `http://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`;
        }
        catch(err){
            alert('Error in Wether Icon');
        }
        temperature.innerText = `${Math.floor((data?.main?.temp)-273.15)} °C`;
        windspeed.innerText = `${data?.wind?.speed} Km/h`;
        humidity.innerText = `${data?.main?.humidity}%`;
        cloud.innerText = `${data?.clouds?.all}%`;
    }
    catch(err){
        alert('Undefined Data',err);
    }
}
async function fetctUserweatherdata(coordinates){
    try{
       const{lat,lon} = coordinates;
        grantlocation_tab.classList.remove('active');
        loader.classList.add('active');
        const response =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
        const data = await response.json();
        loader.classList.remove('active');
        your_tab_window.classList.add('active');
        renderUI(data,aqi);
    }
    catch(err){
        loader.classList.remove('active');
        alert('Failed to Fetch data');
    }
}

function switchtab(clickedtab){
   if(clickedtab!=currenttab){
        currenttab.classList.remove('current-tab');
        currenttab = clickedtab;
        currenttab.classList.add('current-tab');
        if(!search_container.classList.contains('active')){
            your_tab_window.classList.remove('active');
            grantlocation_tab.classList.remove('active');
            search_container.classList.add('active');
        }
        else{
            search_container.classList.remove('active');
            your_tab_window.classList.remove('active');
            getfromsessionstorage();
        }
   }
}

grantbtn.addEventListener('click',()=>{
    if(window.navigator.geolocation){
        window.navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('Not Support in your Browser');
    }
})

function showPosition(position){
    const coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user_coordinate",JSON.stringify(coordinates));
    grantlocation_tab.classList.remove('active');
    fetctUserweatherdata(coordinates);
}
usertab.addEventListener('click',()=>{
    switchtab(usertab);
});
searchtab.addEventListener('click',()=>{
    switchtab(searchtab);
});

async function fetchCityUi(city){
    loader.classList.add('active');
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`);
        const data = await response.json();
        loader.classList.remove('active');
        your_tab_window.classList.add('active');
        renderUI(data);
    }
    catch(err){
        alert('Some Error is occured',err);
    }
}

searchbtn.addEventListener('click',()=>{
    your_tab_window.classList.remove('active');
    const searchcity = document.querySelector('[searchcity]');
    fetchCityUi(searchcity.value);
})