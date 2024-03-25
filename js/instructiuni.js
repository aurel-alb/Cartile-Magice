// index.js

// Selectăm containerul în care vom adăuga cărțile
const gameCardsContainer = document.getElementById('gameCards');

// Funcție pentru a crea o carte pe baza datelor personajului
function createCard(character) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <p class="hp"><span>${character.HP}</span></p>
        <img src="${character.imagine}" alt="${character.name}">
        <h2 class="poke-name">${character.name}</h2>
        <div class="types">
            <span>${character.tip}</span>
        </div>
        <div class ="descriere">
            <p>${character.descriere}</p>
        </div>
        <div class="stats">
            <div>
                <h3>${character.atac}</h3>
                <p>Atac</p>
            </div>
            <div>
                <h3>${character.aparare}</h3>
                <p>Aparare</p>
            </div>
            
        </div>
        </div>
    `;

    return card;
}

// Funcție pentru a afișa cărțile în container
function displayCards(characters) {
    characters.forEach(character => {
        const card = createCard(character);
        gameCardsContainer.appendChild(card);
    });
}

// Încărcăm datele din fișierul JSON și apoi afișăm cărțile
fetch('data.json')
    .then(response => response.json())
    .then(characters => displayCards(characters))
    .catch(error => console.error('Eroare la citirea datelor:', error));

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseover', () => {
            const cardId = card.dataset.id;
            const cardData = characters.find(character => character.id == cardId);
    
            if (cardData) {
                const cardInfo = document.getElementById('cardInfo');
                const cardDescription = document.getElementById('cardDescription');
    
                cardDescription.textContent = cardData.descriere;
    
                cardInfo.style.display = 'block';
            }
        });
    
        card.addEventListener('mouseout', () => {
            const cardInfo = document.getElementById('cardInfo');
            cardInfo.style.display = 'none';
        });
    });
