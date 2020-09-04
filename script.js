const cardList = document.getElementById('cardList');
const list = document.querySelector('ul');
const footer = document.querySelector('footer');
const form = document.querySelector('form');
const showCard = document.getElementById('showCard');
const showNav = document.getElementById('showNav');
const desName = document.getElementById('desName');
const desImage = document.getElementById('desImage');
const desTime = document.getElementById('desTime');
const overlay = document.getElementById('overlay');
const NavBarContainer = document.getElementById('NavBarContainer');
const saveConfirmed = document.getElementById('saveConfirmed');
const inputBox = document.getElementById('inputBox');
const home = document.getElementById('home');
const favorite = document.getElementById('Favorites');

let result = {}
let resultObject = [];
let currentObject = [];
let favorites = {};
let searchInput = ''
let newResultObject =[];
let isInHome = true;

//Get movies from Movie API
async function getMoviesPictures(page){
 try{
  home.classList.add('clickToBlue');
 	const response = await fetch("https://www.omdbapi.com/?apikey=64bcd12d&s=man&type=movie&page=2");
    result = await response.json();
    resultObject = result.Search;
    console.log(resultObject);
}catch(error){
	//catch error here
}
 createDom(page);
 createNavDom(page);
}

//Create Each Card Element
function createCardEl(arrayObject, page){
  arrayObject.forEach((result)=>{
    //Card
    const card = document.createElement('div');
    card.classList.add('card');
    //Image
    const image = document.createElement('img');
    image.src = result.Poster;
    image.alt ='image';
    //MovieName
    const movieName = document.createElement('span');
    movieName.classList.add('movieName');
    movieName.textContent = result.Title;
    //SelectionContainer
    const SelectionContainer = document.createElement('div');
    SelectionContainer.classList.add('SelectionContainer');
    //SelectionButton
    const SelectionButton = document.createElement('button');
    SelectionButton.classList.add('More');
    SelectionButton.textContent = 'More';
    SelectionButton.setAttribute('onclick', `displayDetail('${result.Title}')`);
    //Favorites
    const Favorites = document.createElement('div');
    Favorites.classList.add('Favorites');
    //Plus
    const plus = document.createElement('div');
    if(isInHome===true){
      plus.textContent ='+';
      Favorites.setAttribute('onclick',`saveFavorite('${result.Title}')`)
    }else{
      plus.textContent ='-';
      Favorites.setAttribute('onclick',`removeFavorite('${result.Title}')`)
    }
    //APPEND
    Favorites.append(plus);
    SelectionContainer.append(SelectionButton,Favorites);
    card.append(image,movieName, SelectionContainer);
    cardList.appendChild(card);
  })
}

//Create Card list
function createDom(page){
  currentObject = page ==='results' ? resultObject : Object.values(favorites);
  isInHome = page ==='results' ? true: false;
  createCardEl(currentObject, page);
  }

//Create Each Nav Element
function createNavEl(arrayObject, page){
arrayObject.forEach((result)=>{
    const li =document.createElement('li');
    // navMovieName
    const navMovieName = document.createElement('span');
    navMovieName.classList.add('NavMovieName');
    navMovieName.textContent = result.Title;
      //navBarSelection
      const navBarSelection = document.createElement('div');
      navBarSelection.classList.add('NavBarSelection')
      const navButton = document.createElement('button');
      navButton.classList.add('More');
      navButton.textContent = 'More';
      navButton.setAttribute('onclick', `displayDetail('${result.Title}')`);
      const navFavorites = document.createElement('div');
      navFavorites.classList.add('navFavorites');
      const navPlus = document.createElement('span');
      // Set saveFavorite or removeFavorite
      if(isInHome===true){
          navPlus.textContent = '+';
          navFavorites.setAttribute('onclick',`saveFavorite('${result.Title}')`)
      }else{
          navPlus.textContent = '-';
          navFavorites.setAttribute('onclick',`removeFavorite('${result.Title}')`)
      }
      //APPEND
      navFavorites.append(navPlus);
      navBarSelection.append(navButton,navFavorites);
      li.append(navMovieName, navBarSelection);
      list.append(li);
  })
}

//Create Nav bar
function createNavDom(page){
  const currentObject = page ==='results' ? resultObject : Object.values(favorites);
  const isInHome = page ==='results'? true:false;
	createNavEl(currentObject, page);
}

function displayCard(){
  NavBarContainer.hidden = true;
  cardList.classList.remove('disappear')
  // footer.classList.add('pageContainer');
}

function displayNav(){
  cardList.classList.add('disappear')
  NavBarContainer.hidden = false;
  // footer.classList.remove('pageContainer');
}

//Click More Button, get movie's detail
function displayDetail(movieTitle){
  //Loop through Results Array to select detail
  resultObject.forEach((result)=>{
    if (result.Title === movieTitle){
      desName.textContent = result.Title;
      desImage.src = result.Poster;
      desTime.textContent = result.Year;
      overlay.hidden = false;
    }
  })
}

function closeDetail(){
 overlay.hidden = true;
}

//Add movies to Favorites
function saveFavorite(movieTitle){
  //Loop through Results Array to select Favorite
  resultObject.forEach((result)=>{
    if(result.Title === movieTitle && !favorites[movieTitle]){
      favorites[movieTitle] = result;
      //Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(()=>{
        saveConfirmed.hidden = true;
      }, 2000);
      //Set Favorites in local Storage
      localStorage.setItem('moviesFavorites', JSON.stringify(favorites))
    }
  })
}

//Remove movies to Favorites
function removeFavorite(movieTitle){
  if(favorites[movieTitle] ){
    delete favorites[movieTitle];
    //Set Favorites in localStorage
    localStorage.setItem('moviesFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

//UpdateDOM
function updateDOM(page){
  if (page === 'results'){
    favorite.classList.remove('clickToBlue');
    home.classList.add('clickToBlue');
    footer.classList.add('pageContainer');
  }else{
    home.classList.remove('clickToBlue');
    favorite.classList.add('clickToBlue');
    footer.classList.remove('pageContainer');
  }
  //Get Favorites from localStorage
  if(localStorage.getItem('moviesFavorites')){
    favorites = JSON.parse(localStorage.getItem('moviesFavorites'));
  }
  cardList.textContent ='';
  list.textContent='';
  createDom(page);
  createNavDom(page);
}

//Get more movies
async function moreMovies(page,theme){
  try{
  const response = await fetch(`https://www.omdbapi.com/?apikey=64bcd12d&s=${theme}&type=movie&page=2`);
    result = await response.json();
    resultObject = result.Search;
}catch(error){
  //catch error here
}
 cardList.textContent ='';
 list.textContent='';
 createDom(page);
 createNavDom(page);
}

function SearchMovie(event){
  event.preventDefault();
  searchInput = event.target.name.value;
  newResultObject = currentObject.filter(result => result.Title.toLowerCase().includes(searchInput.toLowerCase()));
    cardList.textContent ='';
    list.textContent='';
    createCardEl(newResultObject)
    createNavEl(newResultObject)
    inputBox.value = '';
  }

//AddEventListener
showCard.addEventListener('click', displayCard);
showNav.addEventListener('click', displayNav);
form.addEventListener('submit', SearchMovie);
getMoviesPictures('results');