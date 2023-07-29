import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import 'slim-select/dist/slimselect.css';


const selectBtn = document.querySelector('.breed-select');
const loaderMessage = document.querySelector('.loader');
const errorMessage = document.querySelector('.error');
const info = document.querySelector('.cat-info');



selectBtn.addEventListener('change', selectCat);

function selectCat() {
  const selectedBreedId = selectBtn.value;
  showLoader();
  fetchCatByBreed(selectedBreedId)
    .then(cat => {
        displayCatInfo(cat);
        new SlimSelect({
        select: '.breed-select'
    })
      hideLoader();
    })
    .catch(error => {
      console.error(error);
      info.innerHTML = '';
      showError();
      hideLoader();
    });
}

function showLoader() {
  loaderMessage.style.display = 'block';
  hideError();
}

function hideLoader() {
  loaderMessage.style.display = 'none';
}

function showError() {
  Notiflix.Notify.failure(errorMessage.textContent);
}

function hideError() {
  errorMessage.style.display = 'none';
}

function populateBreedSelect(data) {
  const optionsCats = data
    .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
    .join('');

    selectBtn.insertAdjacentHTML('beforeend', optionsCats);

  hideLoader();
}

function displayCatInfo(cat) {
  info.innerHTML = `<img src="${cat.url}" alt="Cat Image">
    <h2>${cat.breeds[0].name}</h2>
    <p>${cat.breeds[0].description}</p>
    <h3>Temperament: ${cat.breeds[0].temperament}</h3>`;
}

showLoader();
fetchBreeds()
  .then(data => {
    populateBreedSelect(data);
    new SlimSelect({
      select: '.breed-select',
    });
  })
  .catch(error => {
    console.error(error);
    showError();
    hideLoader();
  });