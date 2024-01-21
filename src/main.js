

const options = ['items', 'talismans', 'bosses', 'ashes', 'incantations'];
const optionsLiArray = document.querySelectorAll('li');
const URL = 'https://eldenring.fanapis.com/api/';

// Receiving data from the API
async function getData(route) {
  try {
    const response = await fetch(`${URL}${route}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Replacing non-existing images with default one
function checkPhoto(img) {
  if (!img) {
    
    return (img = './src/img/default.jpg');
  } else {
    return img;
  }
}

// Updating html (rendering)
async function updateHtmlWithData(route) {
  try {
    const data = await getData(route);
    console.log(data);

    if (data && data.data && Array.isArray(data.data)) {
      const injectDataToHtml = document.querySelector('.card-container');

      data.data.forEach((item, i) => {
        if (item && item.description) {
          item.description = item.description;
          let cardHtml;
          switch (route) {
            case 'ashes':
              cardHtml = `
              <div class="card">
                <img src="${checkPhoto(item.image)}" alt="" />
                <p class="name">${item.name}</p>
                <p class="region">${item.affinity}</p>
                <p class="description">
                  ${item.description}
                </p>
                <button class="rm-${
                  i + 1
                } read-more show-details-btn">Read More</button>
              </div>
            `;
              break;
            case 'bosses':
              cardHtml = `
              <div class="card">
                <img src="${checkPhoto(item.image)}" alt="" />
                <p class="name">${item.name}</p>
                <p class="region">${item.region}</p>
                <p class="description">
                  ${item.description}
                </p>
                <button class="rm-${
                  i + 1
                } read-more show-details-btn">Read More</button>
              </div>
            `;
              break;
            case 'talismans':
              cardHtml = `
              <div class="card">
              <img src="${checkPhoto(item.image)}" alt="" />
              <p class="name">${item.name}</p>
              <p class="region">${item.effect}</p>
              <p class="description">
                ${item.description}
              </p>
              <button class="rm-${
                i + 1
              } read-more show-details-btn">Read More</button>
            </div>
              `;
              break;
            case 'items':
              cardHtml = `
              <div class="card">
                <img src="${checkPhoto(item.image)}" alt="" />
                <p class="name">${item.name}</p>
                <p class="region">${item.type}</p>
                <p class="description">
                  ${item.description}
                </p>
                <button class="rm-${
                  i + 1
                } read-more show-details-btn">Read More</button>
              </div>
            `;
              break;
            case 'incantations':
              cardHtml = `
              <div class="card">
                <img src="${checkPhoto(item.image)}" alt="" />
                <p class="name">${item.name}</p>
                <p class="region">${item.effects}</p>
                <p class="description">
                  ${item.description}
                </p>
                <button class="rm-${
                  i + 1
                } read-more show-details-btn">Read More</button>
              </div>
            `;
              break;
            // Add more cases for other routes as needed

            default:
              console.error('Invalid route:', route);
              return;
          }

          injectDataToHtml.insertAdjacentHTML('beforeend', cardHtml);
          const content = {
            option: route,
            name: item.name,
            description: item.description,
            health: item.health,
            drops: item.drops,
            location: item.location,
            region: item.region,
            location_img: item.image,
            affinity: item.affinity,
            skill: item.skill,
            type: item.type,
            cost: item.cost,
            slots: item.slots,
            effects: item.effects,
          };
          // Add an event listener to the button
          const readMoreButton = injectDataToHtml.querySelector(`.rm-${i + 1}`);
          readMoreButton.addEventListener('click', function () {
            openModal(content);
          });
        }
      });
    } else {
      console.error('Invalid data structure received from API.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const cardContainer = document.querySelector('.card-container');
const main = document.querySelector('main');
const main2 = document.querySelector('.main-section');
optionsLiArray.forEach((li, i) => {
  li.addEventListener('click', function (event) {
    main.style.display = 'block';
    main2.style.display = 'none';
    event.preventDefault(); // Prevent the default behavior of anchor links

    // Clear the container and then update it with new content
    cardContainer.innerHTML = '';
    updateHtmlWithData(options[i]);
  });
});
const headerBack = document.querySelector('header a');
headerBack.addEventListener('click', function () {
  main.style.display = 'none';
  main2.style.display = 'block';
});

// Modifying modal window depending on chosen card
function openModal(content) {
  console.log(content);
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');

  let healthLabel, skillLabel;

  switch (content.option) {
    case 'ashes':
      healthLabel = 'Affinity';
      skillLabel = 'Skill';
      break;
    case 'bosses':
      healthLabel = 'Health points';
      skillLabel = 'Loot';
      break;
    case 'talismans':
      healthLabel = 'Effect';
      skillLabel = 'Description';
      break;
    case 'items':
      healthLabel = 'Type';
      skillLabel = 'Description';
      break;
    case 'incantations':
      healthLabel = 'Effects';
      skillLabel = 'Description';
      break;
    default:
      console.error('Invalid option:', option);
      return;
  }

  const modalHTML = `
    <img src="${checkPhoto(
      content.location_img
    )}" alt="" class="img-main item" />
    <div class="desc-info item">
      <p>Name: <span class="name">${content.name}</span> <br /></p>
      <p>Description: <span class="description">${
        content.description
      }</span> <br /></p>
      ${
        content.health
          ? `<p>${healthLabel}: <span class="health">${content.health}</span> <br /></p>`
          : ''
      }
      ${
        content.drops
          ? `<p>${skillLabel}: <span class="health">${content.drops}</span> <br /></p>`
          : ''
      }
      ${
        content.effects
          ? `<p>${healthLabel}: <span class="drops">${content.effects}</span></p>`
          : ''
      }
      ${
        content.location
          ? `<p>Location: <span class="location">${content.location}</span></p>`
          : ''
      }
      ${
        content.affinity
          ? `<p>${skillLabel}: <span class="drops">${content.affinity}</span></p>`
          : ''
      }
      ${
        content.skill
          ? `<p>${skillLabel}: <span class="drops">${content.skill}</span></p>`
          : ''
      }
      
    </div>
  `;

  modalContent.innerHTML = modalHTML;
  modalOverlay.style.display = 'block';
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  modalOverlay.style.display = 'none';
}
window.addEventListener('click', (event) => {
  const modalOverlay = document.getElementById('modalOverlay');
  if (event.target === modalOverlay) {
    closeModal();
  }
});
