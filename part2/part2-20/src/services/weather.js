import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5";
const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

const getOne = (lat, lon) => {
  return axios
    .get(`${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then((response) => response.data);
};

const countriesService = {
  getOne,
};

export default countriesService;
