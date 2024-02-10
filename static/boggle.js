class BoggleGame {
  constructor() {
    this.guessSet = new Set();
    this.currentScore = 0;
    this.$pointElement = $("<span>").text(0);
    this.$currentScoreElement = $(".current-score");
    this.$currentScoreElement.append(this.$pointElement);
    this.timer = null;
    this.countdown = 60;
    this.$wordInputElement = $(".word");
    this.$submitButton = $(".submit-btn");
    this.$responseDiv = $(".response-from-server");
    this.$guessDiv = $(".client-correct-guess");
  }

  writeDownClientsGuess(guess) {
    const $newLi = $("<li>").text(guess);
    this.$guessDiv.append($newLi);
  }

  showResponseFromServer(resultFromServer) {
    const $msg = $("<p>").text(resultFromServer);
    this.$responseDiv.html($msg);
  }

  updateCountdown() {
    $("#countdown").text(`Time Left: ${this.countdown} seconds`);
  }

  disableGame() {
    this.$submitButton.off("click", this.handleSubmit);
    this.$submitButton.on("click", (evt) => {
      evt.preventDefault();
      alert("Your time is up!");
    });
    this.$wordInputElement.prop("disabled", true);
  }

  async sendScoreToServer() {
    try {
      await $.post("/score", { score: this.$pointElement.text() });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  handleSubmit = async (evt) => {
    evt.preventDefault();
    const inputVal = this.$wordInputElement.val();

    try {
      const sendDataToServer = await $.post("/checkValidWord", {
        word: inputVal,
      });

      if (!this.guessSet.has(inputVal)) {
        if (sendDataToServer.result === "ok") {
          this.showResponseFromServer("Your word is valid");
          // Handling duplicate words
          this.guessSet.add(inputVal);
          // Updating the point
          let pointsGet = inputVal.length;
          this.$pointElement.remove();
          let currentPoint = Number(this.$pointElement.text());
          currentPoint += pointsGet;
          this.$pointElement.text(`${currentPoint}`);
          this.$currentScoreElement.append(this.$pointElement);
          // Write down client's guess
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
    this.$submitButton.on("click", this.handleSubmit);
  }
}

const boggleGame = new BoggleGame();
boggleGame.startGame();
