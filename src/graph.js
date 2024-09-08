let parsedData = null;
const options = {
  title: 'Temperature and Humidity Over Time',
  hAxis: { title: 'Time' },
  vAxes: {
    0: { title: 'Temperature' },
    1: { title: 'Rain / Snow in mm' },
  },
  series: {
    0: { targetAxisIndex: 0 },
    1: { targetAxisIndex: 1 },
    2: { targetAxisIndex: 1 }
  },
  vAxis: {viewWindow: {min: 0}},
  legend: { position: 'bottom' },
};

google.charts.load('current', { packages: ['corechart'] });
window.addEventListener('resize', renderGraph);

export function renderGraph() {

  let data = [ ['Time', 'Temperature', { role: 'annotation' }, 'Rain', 'Snow'] ];

  console.log(parsedData);
  
  const current_time = getCurrentDataInFromat();

  parsedData.forEach(entry => {
    const annotation = entry["time_formated"] == current_time ? 'Now' : null;
    data.push([entry["time_formated"], entry["temperature"], annotation, entry["rain"], (entry["snowfall"] * 10)]);
  });

  data = google.visualization.arrayToDataTable(data);

  //ensure google visualization library is loaded
  if (!google || !google.visualization || !google.visualization.arrayToDataTable) {
    throw new Error('Google Visualization library is not loaded');
  }

  const chart = new google.visualization.LineChart(document.getElementById('chart'));
  chart.draw(data, options);
}

function getCurrentDataInFromat() {
  //get current time in the format of D.M: H
  const date = new Date();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const current_time = `${day}.${month}: ${hours}h`;
  return current_time;
}


export function createDataArray(weatherData) {
  try {
    // Check if weatherData is already an object
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

  } catch (error) {
    console.error('Error parsing weather data:', error);
  }
}
