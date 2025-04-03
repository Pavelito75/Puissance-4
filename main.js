class Puissance4 {
  constructor() {
    this.rows = 6;
    this.cols = 7;
    this.joueurActuel = 1;
    this.couleursJoueurs = ['red', 'blue', 'green', 'yellow'];
    this.nombreJoueurs = 2;
    this.historiqueCoups = [];
    this.scoreJoueurs = [0, 0, 0, 0];
    this.init();
  }

  init() {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols));
    document.getElementsByClassName('vainqueur')[0].innerHTML = '';
    const plateau = document.getElementsByClassName('plateau')[0];
    plateau.style.setProperty('--colonnes', this.cols);
    plateau.style.setProperty('--lignes', this.rows);
    this.afficherGrille();
    this.scoring();
  }

  afficherGrille() {
    const plateau = document.getElementsByClassName('plateau')[0];
    plateau.innerHTML = '';
  
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const trous = document.createElement('div');
        trous.classList.add('trous');
        trous.addEventListener('click', (evt) => this.jouerCoup(col));
        trous.style.backgroundColor = this.board[row][col];
        plateau.appendChild(trous);
      }
    }
  }

  jouerCoup(col) {
    if (this.gameOver) {
      return;
    }
    for (let row = this.rows - 1; row >= 0; row--) {
      if (!this.board[row][col]) {
        const couleur = this.couleursJoueurs[this.joueurActuel - 1];
        this.board[row][col] = couleur;
        this.historiqueCoups.push({ row, col, couleur });
        this.verifWin(row, col, couleur);
        
        if (this.checkDraw()) {
          document.getElementsByClassName('vainqueur')[0].innerHTML = 'Match nul !';
          this.gameOver = true;
          return;
        }

        this.joueurActuel = (this.joueurActuel % this.nombreJoueurs) + 1;

        const allTrous = document.querySelectorAll('.trous');
        const position = row * this.cols + col;
        const viserTrous = allTrous[position];

        viserTrous.classList.add('dropped');
        viserTrous.style.backgroundColor = couleur;
        
        return;
      }
    }
  }

  verifWin(row, col, couleur) {
    if (this.checkDirection(row, col, couleur, 0, 1) || this.checkDirection(row, col, couleur, 0, -1)) {
      this.updateWinner(couleur);
      return;
    }

    if (this.checkDirection(row, col, couleur, 1, 0) || this.checkDirection(row, col, couleur, -1, 0)) {
      this.updateWinner(couleur);
      return;
    }

    if (this.checkDirection(row, col, couleur, 1, 1) || this.checkDirection(row, col, couleur, -1, -1)) {
      this.updateWinner(couleur);
      return;
    }

    if (this.checkDirection(row, col, couleur, 1, -1) || this.checkDirection(row, col, couleur, -1, 1)) {
      this.updateWinner(couleur);
      return;
    }
  }

  updateWinner(couleur) {
    const playerNum = this.couleursJoueurs.indexOf(couleur);
    this.scoreJoueurs[playerNum]++;
    document.getElementsByClassName('vainqueur')[0].innerHTML = `Joueur ${playerNum + 1} a gagné !`;
    this.scoring();
    this.gameOver = true;
  }

  scoring() {
    document.getElementsByClassName('score')[0].innerHTML = `Joueur 1 : ${this.scoreJoueurs[0]}`;
    document.getElementsByClassName('score')[1].innerHTML = `Joueur 2 : ${this.scoreJoueurs[1]}`;
    document.getElementsByClassName('score')[2].innerHTML = `Joueur 3 : ${this.scoreJoueurs[2]}`;
    document.getElementsByClassName('score')[3].innerHTML = `Joueur 4 : ${this.scoreJoueurs[3]}`;
  }

  checkDirection(row, col, couleur, rowDir, colDir) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (this.board[newRow] && this.board[newRow][newCol] === couleur) {
        count++;
      }
    }
    for (let i = 1; i < 4; i++) {
      const newRow = row - i * rowDir;
      const newCol = col - i * colDir;
      if (this.board[newRow] && this.board[newRow][newCol] === couleur) {
        count++;
      }
    }
    return count >= 4;
  }

  reset() {
    this.scoreJoueurs = [0, 0, 0, 0];
    this.historiqueCoups = [];
    this.joueurActuel = 1;
    this.gameOver = false;
    this.init();
  }

  nouvellePartie() {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols));
    this.historiqueCoups = [];
    this.gameOver = false;
    this.afficherGrille();
  }

  undo() {
    const lastMove = this.historiqueCoups.pop();
    this.board[lastMove.row][lastMove.col] = null;
    this.joueurActuel = (this.joueurActuel - 1) || this.nombreJoueurs;
    this.afficherGrille();
  }

  updateDimensions() {
    const rows = Math.round(document.getElementsByClassName('lignes')[0].value);
    const cols = Math.round(document.getElementsByClassName('colonnes')[0].value);
    this.rows = rows;
    this.cols = cols;
    const plateau = document.getElementsByClassName('plateau')[0];
    plateau.style.setProperty('--colonnes', this.cols);
    plateau.style.setProperty('--lignes', this.rows);
    this.nouvellePartie();
  }

  updateCouleurs() {
    this.couleursJoueurs = [
      document.getElementsByClassName('couleur')[0].value,
      document.getElementsByClassName('couleur')[1].value,
      document.getElementsByClassName('couleur')[2].value,
      document.getElementsByClassName('couleur')[3].value
    ];
    this.nouvellePartie();
  }

  updateNombreJoueurs() {
    const nombreJoueurs = Math.round(document.getElementsByClassName('joueurs')[0].value);
    this.nombreJoueurs = nombreJoueurs;

    document.getElementsByClassName('couleur')[2].disabled = nombreJoueurs < 3;
    document.getElementsByClassName('couleur')[3].disabled = nombreJoueurs < 4;

    this.nouvellePartie();
  }

  checkDraw() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (!this.board[row][col]) {
          return false;
        }
      }
    }
    return true;
  }
}

const game = new Puissance4();