# Weather

- Weather portal is a Vue SPA which explores real-time weather updates for any city.
- It is using Open Weather Map API as a data source.
- Your local weather, determined by your IP address.
- Temperature represents as charts using Vue Charts.

## API Reference

#### Get weather info

```http
  GET https://api.openweathermap.org/${id}&appid=${api_key}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Your API key |
| `api_key` | `string` | **Required**. Your API key |

#### Get Forecast

```http
  GET https://api.openweathermap.org/data/2.5/forecast/?q=${city},${country}&units=metric&appid=${api_key}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `city`      | `string` | Name of city |
| `country`      | `string` |Name of country |
| `api_key` | `string` | **Required**. Your API key |

## Screenshots

### Home page
![main page](https://github.com/Greenfield-Taster/Weather-Vue/blob/main/src/assets/screenshots/mainPage.png?raw=true)
