
# Weather

This site has been created for easy weather checking in any city around the world. The site features two charts: the first displays the weather forecast for today, while the second shows the forecast for the next five days.


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

