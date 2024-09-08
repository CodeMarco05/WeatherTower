// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io::BufReader};

use serde_json::Value;
use weather_tower_lib::{get_json_weather_data, models::hour_element::Element, query_params::QueryParams};

fn get_weather_url_from_code(weather_code: u8) -> String{
    let file = File::open("./data/weather_codes.json").unwrap();
    let reader = BufReader::new(file);

    let json_data: Value = serde_json::from_reader(reader).unwrap();

    if let Some(map) = json_data.as_object() {
        for (key, value) in map {
            if key.parse::<u8>().unwrap() == weather_code {
                let image_url = value.get("day").and_then(|f|f.get("image")).unwrap();
                return image_url.to_string();
            }
        }
    }

    panic!();
}

fn transform_to_json(elements: &Vec<Element>) -> String {
    let mut res = String::new();  

    res.push('[');

    for (i, element) in elements.iter().enumerate() {
        if i > 0 {
            res.push(',');
        }
        res.push('{');
        let time_formated = element.time.format("%d.%m: %Hh");
        let hour = element.time.format("%H").to_string();
        let weather_code = element.weather_code;

        let weather_url = get_weather_url_from_code(weather_code);

        res.push_str(&format!(
            "\"time_formated\":\"{}\",
            \"hour\":\"{}\",
            \"temperature\":{},
            \"rain\":{},
            \"snowfall\":{},
            \"weather_code_url\":{}",
            time_formated, hour, element.temperature, element.rain, element.snowfall, weather_url
        ));
        res.push('}');
    }

    res.push(']');

    return res;
}

fn get_coordinates_for_city(city: &str) -> (f64, f64){
    match city {
        "ravensburg" => return (47.782, 9.6106),
        //"berlin" => return ()
        _ => panic!("City not found")
    }
}

#[tauri::command]
fn get_weather_data(city: String, past_days: u8) -> String{

    let coordinates: (f64, f64) = get_coordinates_for_city(&city);

    let params = QueryParams{
        latitude: coordinates.0,
        longitude: coordinates.1,
        hourly: vec!["temperature_2m", "rain", "snowfall", "weather_code"],
        timezone: "Europe/Berlin",
        past_days: past_days as i32
    };

    let elements = get_json_weather_data(params);

    let json = transform_to_json(&elements);

    return json;
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_weather_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
