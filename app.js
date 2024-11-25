// Fetch country data from the Rest Countries API
fetch('https://restcountries.com/v3.1/all')
    .then(response => {
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('countries-container');

        // Create continent categories
        const continents = {
            Africa: [],
            Asia: [],
            Europe: [],
            'North America': [],
            Oceania: [],
            'South America': [],
            Unrecognized: [],
        };

        // Explicitly map regions from the API to our categories
        const regionMapping = {
            Africa: 'Africa',
            Americas: 'North America', // Will handle South America separately
            Asia: 'Asia',
            Europe: 'Europe',
            Oceania: 'Oceania',
        };

        // Categorize countries into continents
        data.forEach(country => {
            const rawRegion = country.region || 'Unrecognized';
            let continent = regionMapping[rawRegion] || 'Unrecognized';

            // Further distinguish between North America and South America
            if (rawRegion === 'Americas') {
                if (country.subregion === 'South America') {
                    continent = 'South America';
                }
            }

            const countryInfo = {
                name: country.name.common || 'N/A',
                capital: country.capital ? country.capital[0] : 'N/A',
                population: country.population || 'N/A',
                flag: country.flags.svg || country.flags.png || null,
            };

            continents[continent].push(countryInfo);
        });

        // Helper function to create a continent section
        const createContinentSection = (continentName, countries) => {
            const section = document.createElement('div');
            section.classList.add('continent-section');

            const heading = document.createElement('h2');
            heading.textContent = continentName;
            section.appendChild(heading);

            const grid = document.createElement('div');
            grid.classList.add('grid');

            // Create country cards for this continent
            countries.forEach(country => {
                if (country.flag) {
                    const countryCard = document.createElement('div');
                    countryCard.classList.add('country-card');

                    countryCard.innerHTML = `
                        <img src="${country.flag}" alt="Flag of ${country.name}" class="flag-img">
                        <div class="country-name">${country.name}</div>
                        <div class="country-capital"><strong>Capital:</strong> ${country.capital}</div>
                        <div class="country-population"><strong>Population:</strong> ${country.population.toLocaleString()}</div>
                    `;

                    grid.appendChild(countryCard);
                }
            });

            section.appendChild(grid);
            return section;
        };

        // Render each continent
        Object.entries(continents).forEach(([continent, countries]) => {
            const section = createContinentSection(continent, countries.sort((a, b) => a.name.localeCompare(b.name)));
            container.appendChild(section);
        });
    })
    .catch(error => {
        console.error('Error fetching country data:', error.message);
        alert('Failed to load country data. Please try again later.');
    });