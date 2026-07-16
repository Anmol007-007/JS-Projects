let userscore = 0;
let compscore = 0;
let msg = document.querySelector('#msg')
let choices = document.querySelectorAll(".choice");
let uscore = document.querySelector('#user-score');
let cscore = document.querySelector('#comp-score');
const gencompchoice = () => {
    const options = ["rock", "paper", "scissors"];
    return options[Math.floor(Math.random() * 3)];
}


const playgame = (userchoice) => {
    console.log("user choise is: ", userchoice);
    const compchoice = gencompchoice();
    console.log("computer choise is: ", compchoice);
    let userwins = true;
    if (userchoice === compchoice) {
        console.log("Draw");
        msg.innerText = "Draw";
        msg.style.backgroundColor = "black";
    }
    else {
        if (userchoice === "rock") {
            userwins = compchoice === "paper" ? false : true;
        }
        else if (userchoice === "paper") {
            userwins = compchoice === "scissors" ? false : true;
        }
        else {
            userwins = compchoice === "rock" ? false : true;
        }
        winneris(userwins);
    }

}
const winneris = (userwins) => {
    if (userwins) {
        console.log("Congratulations You WIN!");
        msg.innerText = "You WIN!";
        msg.style.backgroundColor = "green";
        userscore += 1;
        uscore.innerText = userscore;
    }
    else {
        console.log("Oops You LOSE!");
        msg.innerText = "You LOSE!";
        msg.style.backgroundColor = "red";
        compscore += 1;
        cscore.innerText = compscore;
    }
}

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        let userchoice = choice.getAttribute("id");
        playgame(userchoice);

    })
})