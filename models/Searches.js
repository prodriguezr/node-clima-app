require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const Case = require('case');

class Searches {
    records = []; //['montevideo', 'londres', 'curicó'];
    dbPath = './database/database.json';

    constructor() {
        this.ReadDB();
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': process.env.LIMIT,
            'language': process.env.LANGUAGE,
        }        
    }

    get paramsOWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': process.env.OPENWEATHER_UNITS,
            'lang': process.env.LANGUAGE
        }
    }

    get CapitalizeRecords() {
        let returnValue = [];

        this.records.forEach(place => {
            returnValue.push(Case.title(place));
        });

        return returnValue;
    }

    async Places(placePattern = '') {
        try {
            // Http Request
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${placePattern}.json`,
                params: this.paramsMapbox
            });

            const response = await instance.get();

            return response.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1],
            }));
        }
        catch(err) {
            return []; // Return the places that match the pattern 
        }
    }

    async WeatherPlace(lat, lon) {
        try {
            // Http Request
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramsOWeather, lat, lon },
            });

            const response = await instance.get();
            const { weather, main } = response.data;
            
            return {
                desc: Case.title(weather[0].description),
                temp: main.temp,
                max: main.temp_max,
                min: main.temp_min,
            };

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    AddPlaceToRecords( place = '') {
        if (this.records.includes(place.toLocaleLowerCase())) return;

        // This limits the number of items in the history
        this.records = this.records.splice(0, 4);

        this.records.unshift(place.toLocaleLowerCase());

        this.SaveDB();
    }

    SaveDB() {
        const payload = {
            records: this.records,
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    ReadDB() {
        if (!fs.existsSync(this.dbPath))
            return;

        const db = fs.readFileSync(this.dbPath, { encoding: 'UTF-8' });
        const dbRecords = JSON.parse(db).records;

        this.records = dbRecords;
    }
}

module.exports = Searches;