import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import countriesService from "./services/countries";
import weatherService from "./services/weather";

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      find countries{" "}
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  );
};

const Countries = ({ countries, filter, setFilter }) => {
  if (!filter || countries.length === 0) {
    return <div></div>;
  }

  const filteredCountries = countries.filter(
    (country) =>
      !filter || country.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (filteredCountries.length === 1) {
    return <div></div>;
  }

  return (
    <ul>
      {filteredCountries.map((country) => (
        <li key={country.name}>
          {country.name}
          <button onClick={() => setFilter(country.name)}>show</button>
        </li>
      ))}
    </ul>
  );
};

const Weather = ({ countries, selectedCapital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const [lat, lng] = countries.find((c) => {
      if (!c.capital || c.capital.length === 0) {
        return false;
      }
      return c.capital[0] === selectedCapital;
    }).capitalLatlng;

    weatherService
      .getOne(lat, lng)
      .then((data) => {
        setWeather(data);
      })
      .catch((_) => alert("Failed to fetch weather"));
  }, [countries, selectedCapital]);

  if (!weather) {
    return <div></div>;
  }

  const weatherIcon = weather.weather[0].icon;

  return (
    <div>
      <h3>Weather in {selectedCapital}</h3>
      <div>temperature {weather.main.temp} Celsius</div>
      <img
        src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
        alt="weather"
      />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  );
};

const CountryDetails = ({ countries, filter }) => {
  if (!filter || countries.length === 0) {
    return <div></div>;
  }

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCountries.length !== 1) {
    return <div></div>;
  }

  const country = filteredCountries[0];

  const languages = Object.values(country.languages);

  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital.join(", ")}</div>
      <div>area {country.area}</div>
      <h3>languages</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flag} alt="flag" width="100" />

      <Weather countries={countries} selectedCapital={country.capital[0]} />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countriesService
      .getAll()
      .then((initialCountries) =>
        initialCountries.map((country) => ({
          name: country.name.common,
          capital: country.capital,
          capitalLatlng: country.capitalInfo.latlng,
          area: country.area,
          languages: country.languages,
          flag: country.flags.png,
        }))
      )
      .then((initialCountries) => {
        setCountries(initialCountries);
      })
      .catch((_) => alert("Failed to fetch countries"));
  }, []);

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <Countries countries={countries} filter={filter} setFilter={setFilter} />
      <CountryDetails countries={countries} filter={filter} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
