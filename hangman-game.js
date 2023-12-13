const prompt = require("prompt-sync")();

class Verify {
  static verifyInvalidInput(input) {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿç]+$/.test(input);
  }
}

class Player {
  constructor(word, wordTheme) {
    this.word = word.toUpperCase();
    this.wordTheme = wordTheme.toUpperCase();
    this.currentWordState = "|".repeat(word.length);
    this.maxAttempts = 6;
    this.wrongAttempts = 0;
    this.guessedLetterList = [];
  }

  guessLetter(letter) {
    if (this.guessedLetterList.includes(letter)) {
      console.log("Letra já utilizada. Tente novamente.");
      return;
    }

    this.checkGuessedLetter(letter);

    this.guessedLetterList.push(letter);

    this.displayGameState();

    this.checkGameState();
  }

  guessWord(word) {
    this.displayGameState();

    if (word.toUpperCase() === this.word) {
      this.currentWordState = this.word;
      this.addPlayerPoint();
      console.log("Parabéns! Você ganhou!");
      console.log(this.showPoints());
    } else {
      this.addGameMasterPoint();
      console.log("Você perdeu. A palavra era:", this.word);
      console.log(this.showPoints());
      this.wrongAttempts = this.maxAttempts;
    }
  }

  checkGuessedLetter(letter) {
    if (!this.word.includes(letter)) {
      this.wrongAttempts++;
      console.log(`Letra incorreta: ${letter}`);
    } else {
      console.log(`Letra correta: ${letter}`);
      this.updateWord(letter);
    }
  }

  updateWord(letter) {
    for (let i = 0; i < this.word.length; i++) {
      if (this.word[i] === letter) {
        this.currentWordState =
          this.currentWordState.substring(0, i) +
          letter +
          this.currentWordState.substring(i + 1);
      }
    }
  }
}

class Match extends Player {
  constructor(word, wordTheme) {
    super(word, wordTheme);
    this.playerPoint = 0;
    this.gameMasterPoint = 0;
  }

  displayGameState() {
    console.log("Palavra: ", this.currentWordState);
    console.log("Tema: ", this.wordTheme);
    console.log("Letras ditas: ", this.guessedLetterList.join(", "));
    console.log(
      `Tentativas restantes: ${this.maxAttempts - this.wrongAttempts}`
    );
  }

  checkGameState() {
    if (this.isGameWon()) {
      console.log("Parabéns! Você ganhou!");
      this.addPlayerPoint();
      console.log(this.showPoints());
    } else if (this.isGameLost()) {
      console.log("Você perdeu. A palavra era: ", this.word);
      this.addGameMasterPoint();
      console.log(this.showPoints());
    }
  }

  isGameWon() {
    return this.currentWordState === this.word;
  }

  isGameLost() {
    return this.wrongAttempts >= this.maxAttempts;
  }

  addPlayerPoint() {
    return this.playerPoint++;
  }

  addGameMasterPoint() {
    return this.gameMasterPoint++;
  }

  showPoints() {
    return `Player: ${this.playerPoint} | Game Master: ${this.gameMasterPoint}`;
  }
}

class GameController extends Match {
  constructor(word, maxWrongAttempts) {
    super(word, maxWrongAttempts);
    this.guess;
    this.choice;
    this.restartChoice;
  }

  startGame() {
    while (true) {
      this.displayGameState();

      while (!this.isGameWon() && !this.isGameLost()) {
        this.guessInput();
      }

      if (this.isGameWon() || this.isGameLost()) {
        this.restartChoice = prompt("Deseja jogar novamente? (S/N): ");
        if (this.restartChoice.toLowerCase() !== "s") {
          console.log("Encerrando Game.");
          break;
        } else {
          this.resetGame();
        }
      }
    }
  }

  guessInput() {
    this.guess = prompt(
      "Digite a letra ou a palavra (considere a acentuação): "
    ).toUpperCase();
    if (!Verify.verifyInvalidInput(this.guess)) {
      console.log("Input inválido.");
    } else {
      if (this.guess.length === 1) {
        this.guessLetter(this.guess);
      } else {
        this.guessWord(this.guess);
      }
    }
  }

  resetGame() {
    do {
      this.word = prompt("Digite uma nova palavra: ").toUpperCase();
      this.wordTheme = prompt("Digite o tema da palavra: ").toUpperCase();
      if (
        !Verify.verifyInvalidInput(this.word) ||
        !Verify.verifyInvalidInput(this.wordTheme)
      ) {
        console.log("Input inválido.");
      } else {
        break;
      }
    } while (true);
    this.currentWordState = "|".repeat(this.word.length);
    this.wrongAttempts = 0;
    this.guessedLetters = [];
  }

  showMenu() {
    console.log("Jogo da Forca");
    console.log("1. Iniciar Game");
    console.log("2. Encerrar Game");

    this.choice = prompt("Selecione uma das opções acima (1 or 2): ");

    switch (this.choice) {
      case "1":
        console.log("Iniciando Game...");
        this.startGame();
        break;
      case "2":
        console.log("Encerrando Game.");
        break;
      default:
        console.log("Opção inválida. Digite 1 or 2.");
        this.showMenu();
        break;
    }
  }
}

const game = new GameController("taça", "campeonato");
game.showMenu();
