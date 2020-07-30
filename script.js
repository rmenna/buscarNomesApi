let inputSearch = null;
let buttonSearch = null;
let panelUsers = null;
let panelStatic = null;
let users = [];
let divSpinner = null;
let divInt = null;

const formatter = Intl.NumberFormat('pt-Br');

window.addEventListener('load', async () => {
  mapElements();
  await fetchUsers();

  addEvents();
});

function mapElements() {
  inputSearch = document.querySelector('#inputSearch');
  buttonSearch = document.querySelector('#buttonSearch');
  panelUsers = document.querySelector('#panelUsers');
  panelStatic = document.querySelector('#panelStatic');
  divSpinner = document.querySelector('#divSpinner');
  divInt = document.querySelector('#divInt');
}

async function fetchUsers() {
  const resource = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await resource.json();
  users = json.results
    .map(({ login, name, dob, picture, gender }) => {
      const fullName = `${name.first} ${name.last}`;
      return {
        id: login.uuid,
        name: fullName,
        nameLowerCase: fullName.toLowerCase(),
        age: dob.age,
        gender: gender,
        picture: picture.large,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  showInteraction();
}

function showInteraction() {
  setTimeout(() => {
    divSpinner.classList.add('hidden');
    divInt.classList.remove('hidden');
  }, 2000);
}

function addEvents() {
  inputSearch.addEventListener('keyup', handleKeyUp);
  inputSearch.addEventListener('click', handleButton);
}

function handleKeyUp(event) {
  const currentKey = event.key;

  if (currentKey !== 'Enter') {
    return;
  }

  const filterText = event.target.value;
  if (filterText.trim() !== '') {
    filterUsers(filterText);
  }
}

function handleButton(event) {
  const filterText = event.target.value;
  if (filterText.trim() !== '') {
    filterUsers(filterText);
  }
}

function filterUsers(filterText) {
  const filterTextLowerCase = filterText.toLowerCase();
  const filteredUsers = users.filter((user) => {
    return user.nameLowerCase.includes(filterTextLowerCase);
  });

  renderUser(filteredUsers);
  renderStatic(filteredUsers);
}

function renderUser(filteredUsers) {
  panelUsers.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = `${filteredUsers.length} usuário(s) encontrado(s)`;
  panelUsers.appendChild(h2);

  const ul = document.createElement('ul');

  filteredUsers.forEach((user) => {
    const li = document.createElement('li');
    li.classList.add('flex-row');
    li.classList.add('space-botton');
    const img = `<img class="avatar" src="${user.picture}" alt="${user.name}" />`;
    const userData = `<span>${user.name}, ${user.age} anos</span>`;
    li.innerHTML = `${img}${userData}`;
    ul.appendChild(li);
  });

  panelUsers.appendChild(ul);
}

function renderStatic(filteredUsers) {
  const countMale = filteredUsers.filter((user) => user.gender === 'male')
    .length;
  const countFemale = filteredUsers.filter((user) => user.gender === 'female')
    .length;

  const sumAges = filteredUsers.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const averageAge = sumAges / filteredUsers.length || 0;

  panelStatic.innerHTML = `
      <h2>Estatísticas</h2>

      <ul>
        <li>Sexo masculino: <strong>${countMale}</strong> </li>
        <li>Sexo feminino: <strong>${countFemale}</strong> </li>
        <li>Soma das idades: <strong> ${formatNumber(sumAges)}</strong> </li>
        <li>Média das idades: <strong>${formatAverage(
          averageAge
        )}</strong> </li>
      </ul>
    `;
}

function formatNumber(number) {
  return formatter.format(number);
}

function formatAverage(number) {
  return number.toFixed(2).replace('.', ',');
}
