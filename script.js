document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '5w46zsxM8AdeQt3gDogs57l6JCn15ZQk';
    const countrySelect = document.getElementById('country');
    const holidayForm = document.getElementById('holidayForm');
    const resultsDiv = document.getElementById('results');

    // Fetch supported countries
    fetch(`https://calendarific.com/api/v2/countries?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => populateCountries(data.response.countries))
        .catch(error => console.error('Error fetching countries:', error));

    // Populate country dropdown with supported countries
    function populateCountries(countries) {
        countries.sort((a, b) => a.country_name.localeCompare(b.country_name));
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country['iso-3166'];
            option.textContent = country.country_name;
            countrySelect.appendChild(option);
        });
    }

    // Handle form submission
    holidayForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const country = countrySelect.value;
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        const type = document.getElementById('type').value;

        fetchHolidays(country, year, month, type);
    });

    // Fetch holidays based on selected options
    function fetchHolidays(country, year, month, type) {
        resultsDiv.innerHTML = ''; // Clear previous results
        fetch(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}&month=${month}&type=${type}`)
            .then(response => response.json())
            .then(data => displayHolidays(data.response.holidays))
            .catch(error => console.error('Error fetching holidays:', error));
    }

    // Display holidays in the results section
    function displayHolidays(holidays) {
        if (holidays.length === 0) {
            resultsDiv.innerHTML = '<p class="text-center">No holidays found for the selected criteria.</p>';
            return;
        }

        holidays.forEach(holiday => {
            const card = document.createElement('div');
            card.className = 'card holiday-card';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            cardHeader.textContent = holiday.name;
            card.appendChild(cardHeader);
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            cardBody.innerHTML = `
                <p><strong>Date:</strong> ${holiday.date.iso}</p>
                <p><strong>Description:</strong> ${holiday.description}</p>
                <p><strong>Type:</strong> ${holiday.type.join(', ')}</p>
            `;
            card.appendChild(cardBody);

            resultsDiv.appendChild(card);
        });
    }
});
