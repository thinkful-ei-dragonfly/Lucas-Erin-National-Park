//For mentor: why does the page reload instead of opening the links?

'use strict';

const apiKey = 'f2htNpo67gntNRR5InkyxHZGSe1F1gxtee7zKJVi';

const searchURL = 'https://developer.nps.gov/api/v1/parks/';

const store = {
  parks: [],
};

// function validateStates(states) {
//   states.split(',').every(state => state.length ===2);
// }

function addParkstoState(parks) {
  store.parks = parks.data;
}

function render() {
  //look up html attribute to open it up in new tab
  const html = store.parks.map(parkResult => {
    return `
      <li>
        <h3>${parkResult.name}</h3>
        <p>${parkResult.description}</p>
        <a href="${parkResult.url}" target="_blank">${parkResult.url}</a>
      </li>`;
  }
  );
  $('.results').removeClass('hidden');
  $('.results-list').html(html);
}


function formatQueryParams(params) {
  const queryItems= Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function requestPark(query, maxNumber) {
  //console.log('Request park with query and limit it to maxNum');
  const params = {
    stateCode: query,
    //NPS API starts at 0 instead of 1?
    limit: maxNumber-1,
    api_key: apiKey,
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        throw new Error(response.statusText);
      }})
    .then(responseJson => {
      addParkstoState(responseJson);
      render();
    })
    .catch(e => {
      $('.error-message').text(`Something went wrong: ${e.message}`);
      render();
    });
}

function submitWatchForm() {
  $('#park-search').on('submit', event => {
    event.preventDefault();
    $('.results-list').empty();
    const searchTerm = event.target.querySearch.value.split(' ');
    const maxResults = event.target.maxNum.value;
    requestPark(searchTerm, maxResults);
    console.log(`${searchTerm} ${maxResults}`);
  });
}

$(function() {
  submitWatchForm();
  render();
});

