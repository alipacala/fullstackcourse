import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import countriesService from "./services/countries";

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
          area: country.area,
          languages: country.languages,
          flag: country.flags.png,
        }))
      )
      .then((initialCountries) => {
        setCountries(initialCountries);
        console.log(initialCountries);
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
