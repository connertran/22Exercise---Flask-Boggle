console.log("before click");
let submitBtn = document.querySelector(".submit-btn");
const currrentScore = document.querySelector(".current-score");
let point = document.createElement("span");
point.innerText = 0;
currrentScore.appendChild(point);

let timer; //storing the timer reference
let countdown = 60;

function writeDownClientsGuess(guess) {
  const guessDiv = document.querySelector(".client-correct-guess");
  const newLi = document.createElement("li");
  newLi.innerText = guess;
  guessDiv.appendChild(newLi);
}

function showResponseFromServer(resultFromServer) {
  const responseDiv = document.querySelector(".response-from-server");
  const msg = document.createElement("p");
  msg.innerText = resultFromServer;
  // responseDiv.appendChild(msg);
  responseDiv.innerHTML = msg.outerHTML;
}

function updateCountdown() {
  document.getElementById(
    "countdown"
  ).innerText = `Time Left: ${countdown} seconds`;
}

function disableGame() {
  submitBtn.removeEventListener("click", handleSubmit);
  submitBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    alert("Your time is up!");
  });
  document.querySelector(".word").disabled = true;
}

const handleSubmit = async (evt) => {
  evt.preventDefault();
  const inputBox = document.querySelector(".word");
  const inputVal = inputBox.value;
  console.log("You just clicked");
  console.log(inputVal);

  try {
    const sendDataToSever = await axios.post("/checkValidWord", {
      word: inputVal,
    });
    if (sendDataToSever.data.result === "ok") {
      showResponseFromServer("Your word is valid");
      // updating the point
      let pointsGet = inputVal.length;
      currrentScore.removeChild(point);
      currentPoint = Number(point.innerText);
      currentPoint += pointsGet;
      point.innerText = `${currentPoint}`;
      currrentScore.appendChild(point);
      // write down client's guess
      writeDownClientsGuess(inputVal);
    } else {
      showResponseFromServer("Your word is invalid");
    }

    console.log("In try");
  } catch (error) {
    console.error("Error:", error);
    console.log("In catch");
  }
};

if (submitBtn) {
  // set a timer for 60 sec
  timer = setInterval(() => {
    countdown--;
    updateCountdown();

    if (countdown <= 0) {
      clearInterval(timer);
      disableGame();
    }
  }, 1000);
  submitBtn.addEventListener("click", handleSubmit);
} else {
  console.error("Submit button not found");
}
