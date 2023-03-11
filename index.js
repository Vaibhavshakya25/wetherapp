const usertab = document.querySelector('[usertab]');
const searchtab = document.querySelector('[searchtab]');
const grantbtn = document.querySelector('[grantpermission]');
const loader = document.querySelector('[loader]');
const grantlocation_tab = document.querySelector('[grantlocation]');
const your_tab_window = document.querySelector('[yourtab]');
const search_container = document.querySelector('[searchcontainer]');
const message = document.querySelector('#message');
const cod = document.querySelector('#cod');
const searchbtn = document.querySelector('[searchicon]');
const minimum = document.querySelector('#minmum');
const maximum = document.querySelector('#maximum');
const search = document.getElementById('#search');
const errorimage = document.querySelector('.error-div');
const searchcity = document.querySelector('[searchcity]');
const visibility = document.querySelector('[visibility]');
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
    const progress = document.querySelector('#progress');
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
        windspeed.innerText = `${data?.wind?.speed} m/s`;
        humidity.innerText = `${data?.main?.humidity}%`;
        cloud.innerText = `${data?.clouds?.all}%`;
        progress.min = data?.sys?.sunrise;
        progress.max = data?.sys?.sunset;
        progress.value = data?.dt;
        minimum.innerText = ` Minimum Temerature ${Math.floor((data?.main?.temp_min)-273.15)} °C`;
        maximum.innerText = ` Maximum Temperature ${Math.floor((data?.main?.temp_max)-273.15)} °C`;
        visibility.innerText = `${(data?.visibility)/1000} Km`;
    }
    catch(err){
        alert('Undefined Data',err);
    }
}
async function fetctUserweatherdata(coordinates){
    grantlocation_tab.classList.remove('active');
    errorimage.classList.remove('active');
    loader.classList.add('active');
    try{
       const{lat,lon} = coordinates;
        const response =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
        const data = await response.json();
        loader.classList.remove('active');
        renderUI(data);
        your_tab_window.classList.add('active');
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
    let database = undefined;
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`);
        database = await response.json();
       if(database?.cod == 404){
            throw "Erorr 404 Found";
       }
       if((database?.cod)!=404){
        renderUI(database);
        your_tab_window.classList.add('active');
       }
    }
    catch(err){
        cod.innerText = database?.cod;
        message.innerText = database?.message;
        errorimage.classList.add('active');
    }
    loader.classList.remove('active');
}

searchbtn.addEventListener('click',()=>{
    your_tab_window.classList.remove('active');
    errorimage.classList.remove('active');
    fetchCityUi(searchcity.value);
})

searchcity.addEventListener('keypress',(e)=>{
   if(e.key == 'Enter'){
    your_tab_window.classList.remove('active');
    errorimage.classList.remove('active');
    fetchCityUi(searchcity.value);
   }
})