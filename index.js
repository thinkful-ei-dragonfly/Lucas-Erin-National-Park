'use strict';

const apiKey = 'f2htNpo67gntNRR5InkyxHZGSe1F1gxtee7zKJVi';

const searchURL = `https://developer.nps.gov/api/v1/parks?api_key=${apiKey}`;

const store = {
  parks: [],
};

function addParkstoState(parks, maxNumber) {
  store.parks = parks.data;
  if (store.parks.length > maxNumber) {
    store.parks.splice(maxNumber-1, store.parks.length-maxNumber);
  }
}

function render() {
  // console.log(responseJson);

  $('.results-list').empty();

  const html = store.parks.map(parkResult => {
    return `
      <li>
        <h3><a href= "${parkResult.url}">${parkResult.name}</a></h3>
        <p>${parkResult.description}</p>
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
  console.log('Request park with query and limit it to maxNum');
  const params = {
    q: query,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '&' + queryString;

  console.log(url);

  // const options = {
  //   headers: new Headers({
  //     "X-Api-Key": apiKey})
  // };

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        throw new Error(response.statusText);
      }})
    .then(responseJson => {
      addParkstoState(responseJson, maxNumber);
      render();
    })
    .catch(e => {
      $('.error-message').text(`Something went wrong: ${e.message}`);
      render();
    });
}

function watchForm() {
  $('#park-search').on('submit', event => {
    event.preventDefault();
    const searchTerm = event.target.querySearch.value;
    const maxResults = event.target.maxNum.value;
    requestPark(searchTerm, maxResults);
    console.log(`${searchTerm} ${maxResults}`);
  });
}

$(function() {
  watchForm();
  render();
});

// ----------
//Code from Rich's afternoon session

// function validateStates(states) {
//   states.split(',').every(state => state.length ===2);
// }

// //testing
// validateStates('ca, ny, va')

// function fetchPark(states, maxResults) {
//   if (!validateStates(states)) return;
//   const u = new URL('url')
//   u.searchParams.set('stateCode', states);
//   u.searchParams.set('limit', maxResults);
//   u.searchParams.set('apiKey', 'f2htNpo67gntNRR5InkyxHZGSe1F1gxtee7zKJVi');

//   return fetch(url)
//     .then(res => res.json)
// }

// //before fetch

// state.fetching = true;
// render();

// if(state.fetching) {
//   $(results).html(<p>Please wait...</p>)
// } else {
//   $(results).html(html);
// }