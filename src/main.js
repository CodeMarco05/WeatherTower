const { invoke } = window.__TAURI__.tauri;
import { createParsedData, renderGraph } from './graph.js';

google.charts.setOnLoadCallback(getWeather);



// Function to fetch weather data and draw the chart
async function getWeather() {
  try {

    let city = document.getElementById('city').value;
    let past_days = document.getElementById('past_days').value;
    past_days = parseInt(past_days);

    const response = await invoke('get_weather_data', {city: city, pastDays: past_days});
    createParsedData(response);
    renderGraph();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

document.getElementById('commit_button').addEventListener('click', getWeather);





