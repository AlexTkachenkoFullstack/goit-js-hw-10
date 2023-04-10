import './css/styles.css';
import { fetchCountries } from './JS/fetchCountries'
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';


const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
const classForNameOneCountry = 'titleForOneCountry';

inputEl.addEventListener('input', debounce(handleOnInputEl, DEBOUNCE_DELAY))

function handleOnInputEl(event) {
    const valueOfInputEl = event.target.value.trim();
  if (valueOfInputEl === '') {
    countryListEl.innerHTML = '';
    countryInfo.innerHTML = '';
    inputEl.style.backgroundColor='#fafafa'
        return
    }
  return fetchCountries(valueOfInputEl)
    .then(showOnScreen)
    .catch(() => {
       countryInfo.innerHTML = '';
    countryListEl.innerHTML = '';
      inputEl.style.backgroundColor = 'rgb(241, 121, 121)';
       Notiflix.Notify.failure('Oops, there is no country with that name')
    })
}

function showOnScreen(arreyOfCountries) {
  if (arreyOfCountries.length >= 10) {
    inputEl.style.backgroundColor = 'rgb(10, 208, 238)';
   
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  else if (arreyOfCountries.length === 1) {
    inputEl.style.backgroundColor='#a2f19b'
      makeMarkupCountriesList(arreyOfCountries, classForNameOneCountry);
      makeMarkupCountryInfo(arreyOfCountries);
  }
  else if (arreyOfCountries.length >= 2 && arreyOfCountries.length < 10) {
        makeMarkupCountriesList(arreyOfCountries)
        inputEl.style.backgroundColor = '#dceb5c';
        countryInfo.innerHTML=''
    }
}

function makeMarkupCountriesList(arreyOfCountries, classForNameOneCountry) {
  let markupCountiesList = ''
  markupCountiesList = arreyOfCountries.reduce((acc, { flags:{svg}, name:{common}}) => {
    acc += `<li>
          <img src="${svg}" width="40" height="25">
          <p class=${classForNameOneCountry ? classForNameOneCountry : 'classForNameAllCountries'}>${common}</li>`
    return acc
  }, '')
        
  countryListEl.innerHTML = markupCountiesList;
}

function makeMarkupCountryInfo(arreyOfCountries) {
  let markupCountryInfo = '';
  markupCountryInfo= arreyOfCountries.reduce((acc, {capital, population,languages}) => {
            acc += `
          <p><span class="title">Capital:</span> ${capital}</p>
          <p><span class="title">Population:</span> ${population}</p>
          <p><span class="title">Languages:</span> ${Object.values(languages).join(',')}</p>
          `
       return acc 
     }, '')
        countryInfo.innerHTML = markupCountryInfo;
}

