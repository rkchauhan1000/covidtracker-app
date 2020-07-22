import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Card,
  FormControl,
  MenuItem,
  Select,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./utils";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryCovid, setCountryCovid] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryCovid(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryCovid(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app-left">
        <div className="app_header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value} name={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryCovid.todayCases)}
            total={prettyPrintStat(countryCovid.cases)}
          />
          <InfoBox
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryCovid.todayRecovered)}
            total={prettyPrintStat(countryCovid.recovered)}
          />
          <InfoBox
            isRed
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryCovid.todayDeaths)}
            total={prettyPrintStat(countryCovid.deaths)}
          />
        </div>
        <Map
          countries={mapCountries}
          caseType={caseType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app-right">
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {caseType}</h3>
          <LineGraph className="app__graph" caseType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
