document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();
  
    let guessedWords = [[]];
    let availableSpace = 1;
  
    let word;
    let guessedWordCount = 0;
    let wordsArray = [];
  
    const keys = document.querySelectorAll(".keyboard-row button");
  
    function getNewWord() {
        const url = "js/sgb-words.txt";
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text(); // Get the content as text
          })
          .then(textContent => {
            wordsArray = textContent.split('\n').filter(word => word.trim() !== '');
            const randomIndex = Math.floor(Math.random() * wordsArray.length);
            word = wordsArray[randomIndex];
            // Now, 'word' contains the randomly selected word from the file
            console.log(word);
          })
          .catch(error => {
            console.error('Error:', error);
        });
    }
  
    function getCurrentWordArr() {
      const numberOfGuessedWords = guessedWords.length;
      return guessedWords[numberOfGuessedWords - 1];
    }
  
    function updateGuessedWords(letter) {
      const currentWordArr = getCurrentWordArr();
  
      if (currentWordArr && currentWordArr.length < 5) {
        currentWordArr.push(letter);
  
        const availableSpaceEl = document.getElementById(String(availableSpace));
  
        availableSpace = availableSpace + 1;
        availableSpaceEl.textContent = letter;
      }
    }
  
    function getTileColor(letter, index) {
      const isCorrectLetter = word.includes(letter);
  
      if (!isCorrectLetter) {
        return "rgb(58, 58, 60)";
      }
  
      const letterInThatPosition = word.charAt(index);
      const isCorrectPosition = letter === letterInThatPosition;
  
      if (isCorrectPosition) {
        return "rgb(83, 141, 78)";
      }
  
      return "rgb(181, 159, 59)";
    }
  
    /**
     * Handles the submission of a word in the Wordle game.
     * @function
     * @returns {void}
     */
    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
          window.alert("Word must be 5 letters");
          return; // Exit the function early if the word length is not 5
        }
      
        const currentWord = currentWordArr.join("");
      
        // Check if the currentWord is not in the list of valid words
        if (!wordsArray.includes(currentWord)) {
          window.alert("Word is not recognized!");
          return;
        }
      
        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);
      
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
          }, interval * index);
        });
      
        guessedWordCount += 1;
      
        if (currentWord === word) {
          window.alert("Congratulations!");
        }
      
        if (guessedWords.length === 6) {
          window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        }
      
        guessedWords.push([]);
    }
      
    function createSquares() {
      const gameBoard = document.getElementById("board");
  
      for (let index = 0; index < 30; index++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.classList.add("animate__animated");
        square.setAttribute("id", index + 1);
        gameBoard.appendChild(square);
      }
    }
  
    function handleDeleteLetter() {
      const currentWordArr = getCurrentWordArr();
      const removedLetter = currentWordArr.pop();
  
      guessedWords[guessedWords.length - 1] = currentWordArr;
  
      const lastLetterEl = document.getElementById(String(availableSpace - 1));
  
      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = ({ target }) => {
        const letter = target.getAttribute("data-key");
  
        if (letter === "enter") {
          handleSubmitWord();
          return;
        }
  
        if (letter === "del") {
          handleDeleteLetter();
          return;
        }
  
        updateGuessedWords(letter);
      };
    }
  });