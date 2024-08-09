const cells = document.querySelectorAll('.celda');
const subCabeza = document.querySelector('#SubCabeza');
const jugadorX = document.querySelector('#jugadorX');
const jugadorO = document.querySelector('#jugadorO');
const reinicio = document.querySelector('#Reinicio');
const contadorX = document.querySelector('#contadorX');
const contadorO = document.querySelector('#contadorO');

let jugador = 'X';
let pausarJuego = false;
let iniciarJuego = false;

const inputCells = ['', '', '', '', '', '', '', '', ''];

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];


let victoriasX = localStorage.getItem('victoriasX') || 0;
let victoriasO = localStorage.getItem('victoriasO') || 0;

contadorX.textContent = `Victorias X: ${victoriasX}`;
contadorO.textContent = `Victorias O: ${victoriasO}`;

cells.forEach((celda, index) => {
    celda.addEventListener('click', () => tapCelda(celda, index));
});

function tapCelda(celda, index) {
    if (celda.textContent === '' && !pausarJuego) {
        iniciarJuego = true;
        updateCelda(celda, index);

        if (!checkWinner()) {
            changeJugador();
            radomPick();
        }
    }
}

function updateCelda(celda, index) {
    celda.textContent = jugador;
    inputCells[index] = jugador;
    celda.style.color = (jugador === 'X') ? '#39ff14' : '#39ff14';
}

function changeJugador() {
    jugador = (jugador === 'X') ? 'O' : 'X';
}

function radomPick() {
    pausarJuego = true;

    setTimeout(() => {
        let radomIndex;
        do {
            radomIndex = Math.floor(Math.random() * inputCells.length);
        } while (inputCells[radomIndex] !== '');

        updateCelda(cells[radomIndex], radomIndex);
        if (!checkWinner()) {
            changeJugador();
            pausarJuego = false;
        } else {
            jugador = (jugador === 'X') ? 'O' : 'X';
        }
    }, 1000);
}

function checkWinner() {
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] === jugador && inputCells[b] === jugador && inputCells[c] === jugador) {
            declareWinner([a, b, c]);
            return true;
        }
    }

    if (inputCells.every(cell => cell !== '')) {
        declareDraw();
        return true;
    }

    return false;
}

function declareWinner(winningIndices) {
    subCabeza.textContent = `${jugador} WIN`;
    pausarJuego = true;

    winningIndices.forEach(index => {
        cells[index].style.background = '#ffff7c';
    });

    reinicio.style.visibility = 'visible';

    if (jugador === 'X') {
        victoriasX++;
        localStorage.setItem('victoriasX', victoriasX);
        contadorX.textContent = `Victorias X: ${victoriasX}`;
    } else {
        victoriasO++;
        localStorage.setItem('victoriasO', victoriasO);
        contadorO.textContent = `Victorias O: ${victoriasO}`;
    }
}

function declareDraw() {
    subCabeza.textContent = 'Draw!';
    pausarJuego = true;
    reinicio.style.visibility = 'visible';
}

function elegirJugador(seleccionarJugador) {
    if (!iniciarJuego) {
        if (seleccionarJugador === 'X') {
            jugadorX.classList.add('jugador-active');
            jugadorO.classList.remove('jugador-active');
            jugador = 'X';
        } else {
            jugadorX.classList.remove('jugador-active');
            jugadorO.classList.add('jugador-active');
            jugador = 'O';
        }
    }
}

reinicio.addEventListener('click', () => {
    reinicio.style.visibility = 'hidden';
    inputCells.fill('');
    cells.forEach(celda => {
        celda.textContent = '';
        celda.style.background = '';
    });
    iniciarJuego = false;
    pausarJuego = false;
    subCabeza.textContent = 'Elige';
});
