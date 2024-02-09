console.log("insideboggle");
class BoggleGame {
  constructor() {
    this.guessSet = new Set();
    this.currentScore = 0;
    this.pointElement = document.createElement("span");
    this.pointElement.innerText = 0;
    this.currentScoreElement = document.querySelector(".current-score");
    this.currentScoreElement.appendChild(this.pointElement);
    this.timer = null;
    this.countdown = 60;
    this.wordInputElement = document.querySelector(".word");
    this.submitButton = document.querySelector(".submit-btn");
    this.responseDiv = document.querySelector(".response-from-server");
    this.guessDiv = document.querySelector(".client-correct-guess");
  }

  writeDownClientsGuess(guess) {
    const newLi = document.createElement("li");
    newLi.innerText = guess;
    this.guessDiv.appendChild(newLi);
  }

  showResponseFromServer(resultFromServer) {
    const msg = document.createElement("p");
    msg.innerText = resultFromServer;
    this.responseDiv.innerHTML = msg.outerHTML;
  }

  updateCountdown() {
    document.getElementById(
      "countdown"
    ).innerText = `Time Left: ${this.countdown} seconds`;
  }

  disableGame() {
    this.submitButton.removeEventListener("click", this.handleSubmit);
    this.submitButton.addEventListener("click", (evt) => {
      evt.preventDefault();
      alert("Your time is up!");
    });
    this.wordInputElement.disabled = true;
  }

  async sendScoreToServer() {
    const postScoreToServer = await axios.post("/score", {
      score: this.pointElement.innerText,
    });
  }

  handleSubmit = async (evt) => {
    evt.preventDefault();
    const inputVal = this.wordInputElement.value;

    try {
      const sendDataToSever = await axios.post("/checkValidWord", {
        word: inputVal,
      });
      if (!this.guessSet.has(inputVal)) {
        if (sendDataToSever.data.result === "ok") {
          this.showResponseFromServer("Your word is valid");
          // handling duplicate words
          this.guessSet.add(inputVal);
          // updating the point
          let pointsGet = inputVal.length;
          this.currentScoreElement.removeChild(this.pointElement);
          let currentPoint = Number(this.pointElement.innerText);
          currentPoint += pointsGet;
          this.pointElement.innerText = `${currentPoint}`;
          this.currentScoreElement.appendChild(this.pointElement);
          // write down client's guess
          this.writeDownClientsGuess(inputVal);
        } else {
          this.showResponseFromServer("Your word is invalid");
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  startGame() {
    this.timer = setInterval(() => {
      this.countdown--;
      this.updateCountdown();

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.disableGame();
        this.sendScoreToServer();
      }
    }, 1000);
    this.submitButton.addEventListener("click", this.handleSubmit);
  }
}

const boggleGame = new BoggleGame();
boggleGame.startGame();
