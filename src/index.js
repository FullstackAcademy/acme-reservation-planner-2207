const usersList = document.querySelector('#users-list');

const restaurantsList = document.querySelector('#restaurants-list');
console.log(restaurantsList);

const setup = async()=> {
  console.log('starting');
  const responseUsers = await fetch('/api/users');
  const users = await responseUsers.json();
  const htmlUsers = users.map( user => {
    return `
      <li>
        ${ user.name }
      </li>
    `;
  }).join('');
  usersList.innerHTML = htmlUsers;

  const responseRestaurants = await fetch('/api/restaurants');
  const restaurants = await responseRestaurants.json();

  const htmlRestaurants = restaurants.map(restaurant=> {
    return `
      <li>
        ${ restaurant.name }
      </li>
    `;
  }).join('');
  restaurantsList.innerHTML = htmlRestaurants;
  console.log(htmlRestaurants);
};

setup();
