'use strict';

const apiKey = 'f2htNpo67gntNRR5InkyxHZGSe1F1gxtee7zKJVi';

const searchURL = 'https://developer.nps.gov/api/v1/parks';

const store = {
  parks: [],
  errorMessage: null,
  formReady: false,
};

function formatQueryParams(params) {
  const queryItems= Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function requestPark(query, maxNum) {
  console.log('Request park with query and limit it to maxNum');
  const params = {
    q: query,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  //console.log(url);

  const options = {
    headers: new Headers({
      'X-Api-Key': apiKey
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => console.log(responseJson))
    .catch(e => {
      console.log(e);
    });
}

function watchForm() {
  //console.log('Set event listener here');
  $('#park-search').on('submit', event => {
    event.preventDefault();
    const searchTerm = event.target.querySearch.value;
    const maxResults = event.target.maxNum.value;
    requestPark(searchTerm, maxResults);
  });
}

$(function() {
  watchForm();
});