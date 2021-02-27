const { inquirerMenu, pause, readInput, listPlaces } = require('./helpers/inquirer');
const Searches = require('./models/Searches');

const main = async() => {
    const searches = new Searches();
    let opt = '';

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                const placePattern = await readInput('What is the place you want to search?')

                // Search places
                const places = await searches.Places(placePattern);

                // Select the place
                const id = await listPlaces(places);
                
                if (id === 0) continue;

                const placeSel = places.find(p => p.id === id);

                searches.AddPlaceToRecords(placeSel.name);

                // Get Weather info
                const weather = await searches.WeatherPlace(placeSel.lat, placeSel.lng);

                // Show results
                console.clear();
                console.log('\nPlace Information\n'.bold.green);
                console.log('Location:',placeSel.name.green);
                console.log('Lat:', placeSel.lat);
                console.log('Lng:', placeSel.lng);
                console.log('Weather Info:', weather.desc.green);
                console.log(`Min: ${weather.min} ºC`);
                console.log(`Max: ${weather.max} ºC`);
                console.log(`Actual: ${weather.temp} ºC`);

                break;
            case 2:
                searches.CapitalizeRecords.forEach( (place, i) => {
                    const idx = `${ i + 1 }`;
                    console.log(`${ idx.green }.- ${ place }`);
                });
                break;
        }

        if (opt !== 0)
            await pause();

    } while (opt !== 0);
}

main();