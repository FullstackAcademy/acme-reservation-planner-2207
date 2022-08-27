const { fetchJSON } = require('./apiHelpers');

let restaurants;
let users;
let reservations;

const usersList = document.querySelector('#users-list');

const restaurantsList = document.querySelector('#restaurants-list');
const reservationsList = document.querySelector('#reservations-list');

const renderUsers = ()=> {
  const id = window.location.hash.slice(1);
  const html = users.map( user => {
    return `
      <li class=${ id*1 === user.id ? 'selected': ''}>
        <a href='#${user.id}'>
        ${ user.name }
        </a>
      </li>
    `;
  }).join('');
  usersList.innerHTML = html;
};

const renderReservations = ()=> {
  const html = reservations.map(reservation => {
    const restaurant = restaurants.find( restaurant => restaurant.id === reservation.restaurantId);
    return `
      <li>
        ${ new Date(reservation.updatedAt).toLocaleString() }
        ${ restaurant.name }
        <button data-id='${ reservation.id }'>x</button>
      </li>
    `;
  }).join('');
  reservationsList.innerHTML = html;
};

const renderRestaurants = ()=> {
  const html = restaurants.map( restaurant => {
    const count = (reservations || []).filter(reservation=> reservation.restaurantId === restaurant.id).length;
    return `
      <li data-id='${ restaurant.id }' ${ count ? 'class=has-reservation': ''}>
        ${ restaurant.name } (${ count })
      </li>
    `;
  }).join('');
  restaurantsList.innerHTML = html;
};

const setup = async()=> {
  if(!users){
    users = await fetchJSON('/api/users'); 
  }
  if(!restaurants){
    restaurants = await fetchJSON('/api/restaurants');
  }

  const id = window.location.hash.slice(1);
  if(id){
    reservations = await fetchJSON(`/api/users/${id}/reservations`);
  }
  else {
    reservations = [];
  }

  renderUsers();
  renderReservations();
  renderRestaurants();
};

setup();

restaurantsList.addEventListener('click', async(ev)=> {
  const id = window.location.hash.slice(1);
  if(!id){
    return;
  }
  
  if(ev.target.tagName === 'LI'){
    const restaurantId = ev.target.getAttribute('data-id');
    const response = await fetch(`/api/users/${id}/reservations`, {
      method: 'POST',
      body: JSON.stringify({ restaurantId }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const reservation = await response.json();
    reservations.push(reservation);
    renderReservations();
    renderRestaurants();
  }
});

reservationsList.addEventListener('click', async(ev)=> {
  const target = ev.target;
  if(target.tagName === 'BUTTON'){
    const id = target.getAttribute('data-id')*1;
    await fetch(`/api/reservations/${id}`, {
      method: 'DELETE'
    });
    reservations = reservations.filter(reservation => reservation.id !== id);
    renderReservations();
    renderRestaurants();
  }
});

window.addEventListener('hashchange', setup);
