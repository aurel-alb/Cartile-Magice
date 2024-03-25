let player1Cards = []; // Cărțile jucătorului 1
let player2Cards = []; // Cărțile jucătorului 2
let tableCards = []; // Cărțile de pe masa de joc
let currentPlayer = 1; // Jucătorul curent (1 sau 2)
let isPlayerTurn = true; // Este rândul jucătorului să joace
let selectedCardPlayer1 = null; // Cartea selectată de jucătorul 1
let selectedCardPlayer2 = null; // Cartea selectată de jucătorul 2
let roundInProgress = false; // Indicator pentru a verifica dacă o rundă este în desfășurare

async function fetchCards() {
    try {
        const response = await fetch('data.json');
        const cards = await response.json();
        return cards;
    } catch (error) {
        console.error('Eroare la încărcarea cărților:', error);
    }
}

// Funcție pentru a compara cărțile jucate de cei doi jucători
function compareCards(card1, card2) {
    const total1 = card1.atac + card1.aparare;
    const total2 = card2.atac + card2.aparare;

    if (total1 > total2) {
        console.log('Jucătorul 1 câștigă runda!');
    } else if (total2 > total1) {
        console.log('Jucătorul 2 câștigă runda!');
    } else {
        console.log('Este remiză.');
    }
}

// Funcție pentru a juca o carte
async function playCard(cardId) {
    try {
        const playerHand = currentPlayer === 1 ? player1Cards : player2Cards;

        // Verificăm dacă o rundă este deja în desfășurare
       // if (roundInProgress) {
        //    console.error('O rundă este deja în desfășurare');
        //    return;
        //}

        const cardIndex = playerHand.findIndex(card => card.id == cardId);
        if (cardIndex === -1) {
            console.error('Carte inexistentă');
            return;
        }

        // Verificăm dacă este tura jucătorului curent și dacă cartea a fost deja selectată
       // if (currentPlayer === 1 && selectedCardPlayer1 !== null) {
           // console.error('Este deja selectată o carte pentru jucătorul 1');
           // return;
       // } else if (currentPlayer === 2 && selectedCardPlayer2 === null) {
          //  console.error('Așteptăm selectarea unei cărți pentru jucătorul 1');
           // return;
       // }

        // Marchează începutul rundei
        roundInProgress = true;

        const card = playerHand.splice(cardIndex, 1)[0]; // Scoatem cartea din mâna jucătorului

        console.log(`Jucătorul ${currentPlayer} a ales cartea: ${card.name}`);

        // Dacă este tura jucătorului 1, reținem cartea selectată
        if (currentPlayer === 1) {
            selectedCardPlayer1 = card;
        } else if(currentPlayer === 2){
            selectedCardPlayer2 = card;
        }
        
        console.log(compareCards(selectedCardPlayer1, selectedCardPlayer2));
        

        // Schimbăm jucătorul curent
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    } catch (error) {
        console.error('Eroare la încărcarea cărților:', error);
    }
}

// Funcție pentru a crea elementul HTML al unei cărți și a-l adăuga în tablă
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id; // Adăugăm un atribut de dataset pentru a ține ID-ul cărții

    cardElement.innerHTML = `
        <p class="hp"><span>${card.HP}</span></p>
        <img src="${card.imagine}" alt="${card.name}">
        <h2 class="poke-name">${card.name}</h2>
        <div class="types">
            <span>${card.tip}</span>
        </div>
        <div class="stats">
            <div>
                <h3>${card.atac}</h3>
                <p>Atac</p>
            </div>
            <div>
                <h3>${card.aparare}</h3>
                <p>Aparare</p>
            </div>
        </div>
    `;

    return cardElement;
}

// Funcție pentru a împărți cărțile la jucători
function dealCards() {
    fetchCards()
        .then(cards => {
            const shuffledCards = shuffle(cards);
            const handSize = 6; // Numărul de cărți de împărțit la fiecare jucător

            player1Cards = shuffledCards.slice(0, handSize); // Împarte cărțile jucătorului 1
            player2Cards = shuffledCards.slice(handSize, handSize * 2); // Împarte cărțile jucătorului 2

            renderPlayerCards(); // Afisează cărțile jucătorilor
        })
        .catch(error => console.error('Eroare la împărțirea cărților:', error));
}

// Funcție pentru a afișa cărțile jucătorilor
function renderPlayerCards() {
    renderCards(player1Cards, document.getElementById('hand1'));
    renderCards(player2Cards, document.getElementById('hand2'));
}

// Funcție pentru a afișa cărțile de pe masă
function renderTableCards() {
    renderCards(tableCards, document.getElementById('gameTable'));
}

// Funcție pentru a afișa cărțile într-un container dat
function renderCards(cards, container) {
    container.innerHTML = ''; // Golește containerul

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        container.appendChild(cardElement);
    });
}

// Funcție pentru a amesteca cărțile
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Eveniment pentru butonul de împărțire a cărților
const dealButton = document.getElementById('dealButton');
dealButton.addEventListener('click', () => {
    dealCards();
    currentPlayer = 1; // Resetează jucătorul curent la 1 după fiecare împărțire
    isPlayerTurn = true; // Permite primului jucător să înceapă
});

// Evenimente pentru cărți
document.getElementById('hand1').addEventListener('click', event => {
    const cardId = event.target.closest('.card').dataset.id;
    playCard(cardId);
});

document.getElementById('hand2').addEventListener('click', event => {
    const cardId = event.target.closest('.card').dataset.id;
    playCard(cardId);
});
