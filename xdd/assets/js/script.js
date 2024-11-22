let map;
let markers = [];
const OPENWEATHER_API_KEY = '280d0f22003a0540a8d84d83e024e343'; // Substitua pela sua chave da OpenWeatherMap

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 0 },
        zoom: 2,
    });

    map.addListener("click", (event) => {
        addMarker(event.latLng);
        getWeather(event.latLng);
    });

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const autocomplete = new google.maps.places.Autocomplete(searchInput);

    searchButton.addEventListener('click', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(12);
            addMarker(place.geometry.location);
            getWeather(place.geometry.location);
        }
    });
}

function addMarker(location) {
    clearMarkers();
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

async function getWeather(location) {
    const lat = location.lat();
    const lon = location.lng();
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        
        if (response.ok) {
            const data = await response.json();
            displayWeatherInfo(data);
        } else {
            throw new Error('Falha ao obter dados climáticos');
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('weather-info').innerHTML = 'Erro ao obter dados climáticos';
    }
}

function displayWeatherInfo(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>Clima em ${data.name}</h2>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Descrição: ${data.weather[0].description}</p>
        <p>Umidade: ${data.main.humidity}%</p>
        <p>Velocidade do Vento: ${data.wind.speed} m/s</p>
    `;
}

window.onload = initMap;