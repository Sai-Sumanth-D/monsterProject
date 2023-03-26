
const playerAttackValue = 10; // this is constant and cannot change throughout the entire program.
const monsterAttackValue = 14; // this is the maximum constant random value that the monster can hit player with.
const strongAttackValue= 20;
const healingValue = 22;
const userInput = prompt('Please enter the maximum health life for player and monster', '100');
let chosenMaxLife = parseInt(userInput); // this value will be able to change. It is why we chose 'let'
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0){ // checks if the userInput is a number or not
    chosenMaxLife = 100; // if the user has entered something other than numbers
}

// these are the events with which we are dealing
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';



let currentMonsterHealth = chosenMaxLife; // monster health at a time frame 
let currentPlayerHealth = chosenMaxLife; // player health at a time frame
let hasBonusLife=true; //this tells whether the player has a bonus life or not.
let battleLog = [];
adjustHealthBars(chosenMaxLife);



function endRound(){
    const intialPlayerHealth = currentPlayerHealth; // this is the value of the player health before the attack by monster
    const playerDamage = dealPlayerDamage(monsterAttackValue);
    currentPlayerHealth -= playerDamage; // this is the player health after the attack of the monster.

    if (currentPlayerHealth<=0 && hasBonusLife){ // checks if both are true, if they are then proceeds to the following
        hasBonusLife=false;
        removeBonusLife(); // bonus life is used and removed
        currentPlayerHealth = intialPlayerHealth; //as bonus life is used and removed, we want to return to the health which was before the monster attacked the player. 
        setPlayerHealth(intialPlayerHealth); // setting the player health back to where it was before the monster attack.
        alert('Try again, the bonus life saved you!!');
    }
    if (currentMonsterHealth <=0 && currentPlayerHealth > 0){   // this condition is letting us know if the currentMonsterHealth is 0 or less. This is a win condition.
        alert('You won!');  
        reset();       // this resets the game back to start
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('You Lost!!');
        reset();      // this resets the game back to start

    }
    else if(currentMonsterHealth <= 0 && currentPlayerHealth <=0 ) {
        alert('you have a draw');
        reset();      // this resets the game back to start
    }
}

// this function describes player attacking monster  
function attack(mode){
    let maxDamage;
    if (mode ==='ATTACK'){
        maxDamage = playerAttackValue;
    }else if(mode === 'STRONG_ATTACK'){
        maxDamage = strongAttackValue;
    }
    const monsterDamage= dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage; 
    endRound(); // this function is declared above and is called to know the result.
    
}


// to launch an attack towards the monster and the player
function attacking(){
    attack('ATTACK');
}


//to launch a stronger attack.
function strongAttack(){
    attack('STRONG_ATTACK');


    // const monsterDamage= dealMonsterDamage(strongAttackValue);
    // currentMonsterHealth -= monsterDamage; 
    // const playerDamage = dealPlayerDamage(monsterAttackValue);
    // currentPlayerHealth -= playerDamage;
    // if (currentMonsterHealth <=0 && currentPlayerHealth > 0){   // this condition is letting us know if the currentMonsterHealth is 0 or less. This is a win condition.
    //     alert('You won!');        
    // }
    // else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
    //     alert('You Lost!!');

    // }
    // else if(currentMonsterHealth <= 0 && currentPlayerHealth <=0 ) {
    //     alert('you have a draw');
    // }
}

function healPlayer(){
    let healValMax;
    if (currentPlayerHealth >= chosenMaxLife - healingValue){ // this tells that if the player used healing value then it might go beyond the chosemaxlif which is 100. to avoid that
        alert('Not possible. The player health can not be greater than full life');
        healValMax = chosenMaxLife - currentPlayerHealth;
    } else {
        healValMax=healingValue; // if block fails means we can apply full healingValue declared which is 22
    }
    increasePlayerHealth(healingValue); // this is a function from vendor.js to increase player health
    currentPlayerHealth+= healingValue; // here we are adding the healing value to the players health
    endRound();
}



function reset(){ // this function is generally used once the game is done.
    currentMonsterHealth= chosenMaxLife; // this resets the monster health 
    currentPlayerHealth= chosenMaxLife; // this resets the player health to what player chose at first
    resetGame(chosenMaxLife);
}



function writeToLog(ev, val, monsterHealth, playerHealth ){
    let logEntry;
    if (ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry={
            event: ev, 
            value: val,
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    } else if( ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry={
            event: ev, 
            value: val,
            target: 'MONSTER',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    } else if (ev === LOG_EVENT_MONSTER_ATTACK){
        logEntry={
            event: ev, 
            value: val,
            target: 'PLAYER',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    } else if (ev === LOG_EVENT_PLAYER_HEAL ){
        logEntry={
            event: ev, 
            value: val,
            target: 'PLAYER',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    } else if(ev === LOG_EVENT_GAME_OVER){
        logEntry={
            event: ev, 
            value: val,
            target: 'PLAYER',
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
        };
    }
    battleLog.push(logEntry);
}

attackBtn.addEventListener('click', attacking); // vendor.js has this button specified already.
strongAttackBtn.addEventListener('click', strongAttack); // vendor.js has this buttons
healBtn.addEventListener('click', healPlayer);
logBtn.addEventListener('click', writeToLog);