const { invoke } = window.__TAURI__.tauri;


//display for the chart
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(getWeather);
window.addEventListener('resize', getWeather);

// Function to fetch weather data and draw the chart
async function getWeather() {
  try {
    const response = await invoke('get_weather_data');
    console.log('Weather data response:', response); // Log the response
    drawWeatherChart(response);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Function to draw the weather chart
function drawWeatherChart(weatherData) {
  console.log('Raw weather data:', weatherData); // Log the raw weather data
  try {
    // Check if weatherData is already an object
    let parsedData;
    if (typeof weatherData === 'string') {
      parsedData = JSON.parse(weatherData);
    } else if (typeof weatherData === 'object') {
      parsedData = weatherData;
    } else {
      throw new Error('Invalid weather data format');
    }


    // Ensure parsedData is an array
    if (!Array.isArray(parsedData)) {
      throw new Error('Parsed data is not an array');
    }

    // Convert the data into a format suitable for Google Visualization
    const dataArray = [['Time', 'Temperature', { role: 'annotation' }]];

    //get current time in the format of 06.09: 00h
    const date = new Date();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const current_time = `${day}.${month}: ${hours}h`;


    parsedData.forEach(entry => {
      const annotation = entry["time_formated"] == current_time ? 'Now' : null;
      dataArray.push([entry["time_formated"], entry["temperature"], annotation]);
    });

    console.log('Formatted data array:', dataArray);

    // Ensure Google Visualization library is loaded
    if (google && google.visualization && google.visualization.arrayToDataTable) {
      // Create the data table
      const data = google.visualization.arrayToDataTable(dataArray);


      // Additional code to draw the chart goes here
      const options = {
        title: 'Temperature over time',
        curveType: 'function',
        hAxis: {
          title: 'Time',
          titleTextStyle: {
            color: '#333'
          },
        },
        vAxis: {
          title: 'Temperature',
          titleTextStyle: {
            color: '#333'
          },
        }
      };

      const chart = new google.visualization.LineChart(document.getElementById('chart'));
      chart.draw(data, options);
    } else {
      throw new Error('Google Visualization library is not loaded');
    }

  } catch (error) {
    console.error('Error parsing weather data:', error);
  }
}



