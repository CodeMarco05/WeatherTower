const { invoke } = window.__TAURI__.tauri;
import { createDataArray, renderGraph } from './graph.js';


google.charts.setOnLoadCallback(getWeather);

// Function to fetch weather data and draw the chart
async function getWeather() {
  try {
    const response = await invoke('get_weather_data');
    createDataArray(response);
    renderGraph();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}





