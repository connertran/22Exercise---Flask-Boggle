console.log("before click");
let submitBtn = document.querySelector(".submit-btn");

const handleSubmit = async (evt) => {
  evt.preventDefault();
  const inputBox = document.querySelector(".word");
  const inputVal = inputBox.value;
  console.log("You just clicked");
  console.log(inputVal);

  try {
    const sendDataToSever = await axios.post("/checkValidWord/", {
      word: inputVal,
    });
    console.log(sendDataToSever);
  } catch (error) {
    console.error("Error:", error);
  }
};

submitBtn.addEventListener("click", handleSubmit);
