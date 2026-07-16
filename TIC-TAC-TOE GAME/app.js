
let player0 = true;
let boxes = document.querySelectorAll('.box');
let resetButton = document.querySelector('#resetButton');
let newGame = document.querySelector('#newGame');
const winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let msgcontainer = document.querySelector('.msg-container');
let msg = document.querySelector('#msg');
let count = 0
boxes.forEach((box) => {
    box.addEventListener('click', () => {
        if (player0 && box.textContent === '') {
            box.textContent = 'x';
            box.classList.add('x');
            player0 = false;
            count += 1;
        }
        else if (!player0 && box.textContent === '') {
            box.textContent = 'o';
            box.classList.add('o');
            player0 = true;
            count += 1;
        }
        checkwinner();
    });
});
const resetgame = () => {
    player0 = true;
    enableBoxes();
    msgcontainer.classList.add('hide');
}
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = '';
        box.classList.remove('x', 'o');
    }
}

const displaywinner = (winner) => {
    msg.innerText = `Congratulation, winner is ${winner}`;
    msgcontainer.classList.remove('hide');
    disableBoxes();
}
const nowinner = () => {
    msg.innerText = `No one is the winner, It's a Draw`
    msgcontainer.classList.remove('hide');
    disableBoxes();
}
const checkwinner = () => {
    for (pattern of winPatterns) {
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;

        if (pos1 !== '' && pos2 !== '' && pos3 !== '') {
            if (pos1 === pos2 && pos2 === pos3) {
                console.log('winner', pos1);
                displaywinner(pos1);
            }
            else if (count === 9) {
                nowinner();
            }
        }
    }
}
resetButton.addEventListener("click", resetgame);
newGame.addEventListener("click", resetgame);
