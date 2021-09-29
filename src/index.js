let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  document.querySelector('form.add-toy-form').addEventListener('submit', submitToy)
  const renderToys = (results) => results.forEach(renderToy);
  sendRequest('http://localhost:3000/toys', renderToys);
});

function renderToy(toy) {
  const collection = document.getElementById('toy-collection');
  const toyCard = document.createElement('div');
  toyCard.className = 'card';
  toyCard.id = `card-${toy.id}`

  const toyName = document.createElement('h2');
  toyName.textContent = toy.name;
  const toyImg = document.createElement('img');
  toyImg.src = toy.image;
  toyImg.className='toy-avatar';
  const toyLikes = document.createElement('p');
  toyLikes.textContent = `${toy.likes} Likes`;
  const toyLikeBttn = document.createElement('button');
  toyLikeBttn.textContent = 'Like <3';
  toyLikeBttn.id = toy.id;
  toyLikeBttn.className = 'like-btn';
  toyLikeBttn.addEventListener('click', addLike);

  toyCard.append(toyName, toyImg, toyLikes, toyLikeBttn);
  collection.append(toyCard);

}

function submitToy(e) {
  e.preventDefault();
  const form = e.target;

  const body = {
    'name': form.querySelector('input[name="name"]').value,
    'image': form.querySelector('input[name="image"]').value,
    'likes': 0
  };

  const url = 'http://localhost:3000/toys';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  }
  sendRequest(url, renderToy, options);

  form.reset();
}

function addLike(e) {
  const toyId = e.target.id;
  const url = `http://localhost:3000/toys/${toyId}`;
  // get likes, add one, patch likes
  const cbPatchLikes = (options) => sendRequest(url, updateLikes, options);
  const cbModifyLikes = (toy) => {
    toy.likes++;
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(toy)
    }
    cbPatchLikes(options);
  };
  sendRequest(url, cbModifyLikes);
}

function updateLikes(toy) {
  const card = document.getElementById(`card-${toy.id}`);
  const likes = card.querySelector('p');
  likes.textContent = `${toy.likes} Likes`
}

function sendRequest(url, callback, options={}) {
  fetch(url, options).then(resp => resp.json()).then(callback);
}
