# WeatherTower
Weather Tower is a desktop application to monitor weather in different cites from germany. 
*(You can insert your own city)*

## Overview
- [Installation](#installation)
    - [Compile](#compile)
- [Insert own city](#insert-own-city)



# Installation
You can either download the code or take a pre fabricated installer. For adding your own city download the source code.

When you want the ready product just download the corresponding installer for your system. 

The example is shown with cargo because it is rusts package manager. But it also works with 
- npm
- Yarn
- pnpm

or basic `Bash`, `PowerShell` or `Bun`.

The installer may not be provided for your operating system. Explanation is under [Compile](#compile)


## Compile
Prerequisites are that you have a Tauri installed via a compatible package manager. The guide is here under [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites).

### Example for Cargo
Install Tauri:
```bash
$ cargo install create-tauri-app --locked
```
This should install Tauri with additional dependencies.

Open the source code folder from GitHub. 

### Command for build configuration and getting the installer.
```bash
$ cargo tauri build
```
Take in consideration that your operating system may take further setup to install. Instructions can be found here [Tauri instructions](https://tauri.app/v1/guides/building/).

Note that on the fist build this may take a while.

When it is done it should automatically open the installer. 
But for distributing or further use on this path is the corresponding installer for your operating system.

In bundle are installer bundles and the bin for your System is shown in the graph.

```
WeatherTower/
├─ src-tauri/
│  ├─ target/
│  │  ├─ release/
│  │  │  ├─ bundle/
│  │  │  ├─ Weather Tower (binary)

```

### Problems
When you have problems with compiling for your system. Consider using `$ cargo tauri dev` and then take a debug version of the binary for your system.

# Insert own city
When inserting your own city you need to download the source code first. 

```
WeatherTower/
├─ src/
│  ├─ index.html
├─ src/
│  ├─ main.rs
``` 
In the `index.html` file search for `options_div`. This is a div which holds all the options for the cities. Add your option there like the ones already in there.

In dhe `main.rs` file search for `get_coordinates_for_city`. This should be a function. There in the match statement add your city with the coordinates. 
Example:
```rust
fn get_coordinates_for_city(city: &str) -> (f64, f64) {
    match city {
        "ravensburg" => return (47.782, 9.6106),
        ...
        "leipzig" => return (51.3396, 12.3713),
        "<YourCityName>" => return (<latitude>, <longitude>),
        _ => panic!("City not found"),
    }
}
```
After you did this you should be able to compile and see your results. 