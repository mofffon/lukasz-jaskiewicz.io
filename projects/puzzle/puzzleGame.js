// Orders JS to run in strict mode
("use strict");

// Pictures used in game.
const Pictures = [
  "Christmas_Eve",
  "Cats",
  "Sun_Flower",
  "Studio_Ghiblis_Totoro",
  "Pirate_Smurf",
];

// Main function of the app. Adds action to the menu buttons.
$(document).ready(function () {
  $(".startBTN").on("click", startGame);
  $(".resetBTN").on("click", resetGame);
  $(".nextPictureBTN").on("click", nextPicture);
  $(".prevPictureBTN").on("click", previousPicture);
  $(".cheatBTN").on("click", startCheating);
});

// Cheater button function. Adds cheat to the game.
const startCheating = () => {
  $(".cheatBTN").attr("disabled", true);

  alert("You are cheating !!\nNow you can freely switch the puzzles.");
  $(".cheatBTN").attr("data-cheat-enabled", true);
};

// Reset button function. Causes the game to reset.
const resetGame = () => {
  removeInteractivityFromGamePicture();
  updateButtonsAndMessages(0);
};

// Start game button function.
const startGame = () => {
  $(".cheatBTN").attr("data-cheat-enabled", false);
  randomizeCurrentPicture();
  addInteractivityToGamePicture();
  updateButtonsAndMessages(1);
};

// Next picture button function.
const nextPicture = () => {
  let currPicture = $(".game-table");
  let currPictureName = $(".game-table").attr("data-picture");

  if (Pictures.indexOf(currPictureName) !== Pictures.length - 1) {
    currPicture.attr(
      "data-picture",
      Pictures[Pictures.indexOf(currPictureName) + 1]
    );
  } else {
    currPicture.attr("data-picture", Pictures[0]);
  }

  printPicture(currPicture.attr("data-picture"));
};

// Function that prints current picture on the board. Used mainly when swithing pictures.
const printPicture = (pictureName) => {
  const picturePath = "./puzzle-pictures/" + pictureName + "/";

  $(".game-picture").each(function () {
    let picturePiece = $(this);
    let picturePieceNumber = $(this).attr("id").split("_")[1];

    picturePiece.attr("src", picturePath + picturePieceNumber + ".jpg");
  });
};

// Previous picture button function.
const previousPicture = () => {
  let currPicture = $(".game-table");
  let currPictureName = $(".game-table").attr("data-picture");

  if (Pictures.indexOf(currPictureName) !== 0) {
    currPicture.attr(
      "data-picture",
      Pictures[Pictures.indexOf(currPictureName) - 1]
    );
  } else {
    currPicture.attr("data-picture", Pictures[Pictures.length - 1]);
  }

  printPicture(currPicture.attr("data-picture"));
};

// Function used to scramble currently dispalyed picture.
const randomizeCurrentPicture = () => {
  let numberArray = [];

  const picturPath =
    "./puzzle-pictures/" + $(".game-table").attr("data-picture") + "/";

  for (let i = 1; i < 17; i++) {
    numberArray.push(i);
  }

  let indexOne, indexTwo;
  const ArrayLength = numberArray.length;

  for (let i = 0; i < 100; i++) {
    indexOne = Math.floor(Math.random() * ArrayLength);
    indexTwo = Math.floor(Math.random() * ArrayLength);

    let tempIndex = numberArray[indexOne];
    numberArray[indexOne] = numberArray[indexTwo];
    numberArray[indexTwo] = tempIndex;
  }

  for (let i = 1; i < 17; i++) {
    $("#game-picture_" + i).attr(
      "src",
      picturPath + numberArray[i - 1] + ".jpg"
    );
  }
};

// Function that adds the swapPieces function as a listener to puzzles. Hence allowing swapping puzzles.
const addInteractivityToGamePicture = () => {
  $(".game-picture").each(function () {
    $(this).on("click", swapPieces);

    if ($(this).attr("src").split("/")[3] === "16.jpg") {
      $(this).addClass("blank-piece");
    }
  });
};

// Function that removes swapPieces function as a listener from puzzles. Thus removing swapping capabilities.
const removeInteractivityFromGamePicture = () => {
  $(".game-picture").each(function () {
    $(this).off("click");
  });

  $(".blank-piece").removeClass("blank-piece");
};

// Heart of the game. Function that swaps two game puzzles - the clicked one and the blank one.
const swapPieces = (event) => {
  let clickedIMG = $(event.target);

  if (clickedIMG.hasClass("blank-piece")) {
    return;
  }

  let blankPiece = $(".blank-piece");

  if (checkIfCanSwapPicturePieces(clickedIMG, blankPiece) === true) {
    let blankPieceSRC = blankPiece.attr("src");

    blankPiece.attr("src", clickedIMG.attr("src"));
    clickedIMG.attr("src", blankPieceSRC);

    blankPiece.removeClass("blank-piece");
    clickedIMG.addClass("blank-piece");

    checkGameStatus();
  }
};

// Function that checks if the game is in progress, reset or won and acts accordingly.
const checkGameStatus = () => {
  let endGame = true;

  $(".game-picture").each(function () {
    let pictureId = $(this).attr("id").split("_")[1];
    let pictureNumFromPicSRC = $(this).attr("src").split("/")[3].split(".")[0];

    if (pictureId != pictureNumFromPicSRC) {
      endGame = false;
    }
  });

  if (endGame === true) {
    removeInteractivityFromGamePicture();
    updateButtonsAndMessages(2);
    return;
  }
};

// Not available to the gamer. Function that causes the game to win by the gamer.
const cheatWinGame = () => {
  for (let i = 1; i <= 16; i++) {
    $("#game-picture_" + i).attr(
      "src",
      "./puzzle-pictures/" +
        $(".game-table").attr("data-picture") +
        "/" +
        i +
        ".jpg"
    );
  }

  checkGameStatus();
};

// Function that checks if the game puzzles can be swapped (clicked one and blank one).
const checkIfCanSwapPicturePieces = (picture1, picture2) => {
  if ($(".cheatBTN").attr("data-cheat-enabled") == "true") {
    return true;
  }

  let pic1ID = picture1.attr("id").split("_")[1];

  let pic2ID = picture2.attr("id").split("_")[1];

  let possibleMoves = [];
  possibleMoves[0] = "0";
  possibleMoves[1] = "2,5";
  possibleMoves[2] = "1,3,6";
  possibleMoves[3] = "2,4,7";
  possibleMoves[4] = "3,8";
  possibleMoves[5] = "1,6,9";
  possibleMoves[6] = "2,5,7,10";
  possibleMoves[7] = "3,8,6,11";
  possibleMoves[8] = "4,7,12";
  possibleMoves[9] = "5,10,13";
  possibleMoves[10] = "9,11,6,14";
  possibleMoves[11] = "10,12,7,15";
  possibleMoves[12] = "11,8,16";
  possibleMoves[13] = "9,14";
  possibleMoves[14] = "13,10,15";
  possibleMoves[15] = "16,11,14";
  possibleMoves[16] = "15,12";

  let returnVal = possibleMoves[pic1ID].indexOf(pic2ID);

  if (returnVal >= 0) {
    return true;
  } else {
    return false;
  }
};

// Function that updates button status and displays game messages to the gamer.
const updateButtonsAndMessages = (param) => {
  switch (param) {
    case 0:
      $(".startBTN").attr("disabled", false);
      $(".nextPictureBTN").attr("disabled", false);
      $(".prevPictureBTN").attr("disabled", false);
      $(".resetBTN").attr("disabled", true);
      $(".cheatBTN").attr("disabled", true);

      if ($("html").attr("lang") == "pl") {
        $(".message").html("Wybierz obrazek i kliknij Start, aby grać.");
        $(".cheatBTN").prop("value", "Oszukuj !");
      } else {
        $(".message").html("Pick a picture and press Start to play.");
        $(".cheatBTN").prop("value", "Cheat !");
      }

      break;

    case 1:
      $(".startBTN").attr("disabled", true);
      $(".nextPictureBTN").attr("disabled", true);
      $(".prevPictureBTN").attr("disabled", true);
      $(".resetBTN").attr("disabled", false);
      $(".cheatBTN").attr("disabled", false);

      $(".message").html(
        "Put together the scrambled picture as it was before."
      );

      break;
    case 2:
      $(".startBTN").attr("disabled", false);
      $(".nextPictureBTN").attr("disabled", false);
      $(".prevPictureBTN").attr("disabled", false);
      $(".resetBTN").attr("disabled", true);
      $(".cheatBTN").attr("disabled", true);

      if ($(".cheatBTN").attr("data-cheat-enabled") === "true") {
        $(".message").html(
          "The game ends. You cheated. Click start to play again."
        );
        $(".cheatBTN").prop("value", "Cheat !");
        setTimeout(function () {
          alert("End of game. You cheated.");
        }, 100);
      } else {
        $(".message").html(
          "The game ends. You have won. Click start to play again."
        );
        setTimeout(function () {
          alert("End of game. You have won.");
        }, 100);
      }
  }
};
