// Game Variables
let maxSets = 1;
let currentSet = 1;
let setsRequiredToWin = 1;

let scoreA = 0;
let scoreB = 0;
let setsA = 0;
let setsB = 0;

let isSetFinished = false;
let isMatchFinished = false;

function startGame(sets) {
    maxSets = sets;
    currentSet = 1;
    setsRequiredToWin = Math.ceil(sets / 2);
    
    scoreA = 0;
    scoreB = 0;
    setsA = 0;
    setsB = 0;
    isSetFinished = false;
    isMatchFinished = false;

    setServe('A'); // Default serve to Team A

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('scoreboard-screen').classList.remove('hidden');
    document.getElementById('next-set-btn').classList.add('hidden');
    
    updateUI();
}

function getTargetScore() {
    if (currentSet === maxSets && maxSets > 1) return 15;
    return 25;
}

function addPoint(team, event) {
    // Prevent point if clicking on the editable team name
    if (event.target.closest('h2')) return;
    
    // Stop adding points if the set or match is over
    if (isSetFinished || isMatchFinished) return;

    if (team === 'A') scoreA++;
    if (team === 'B') scoreB++;

    // Switch serve to whoever just scored
    setServe(team);

    updateUI();
    checkSetWin();
}

function setServe(team) {
    document.getElementById('serve-a').classList.remove('active');
    document.getElementById('serve-b').classList.remove('active');
    
    if (team === 'A') document.getElementById('serve-a').classList.add('active');
    if (team === 'B') document.getElementById('serve-b').classList.add('active');
}

function checkSetWin() {
    const target = getTargetScore();
    
    if (scoreA >= target && (scoreA - scoreB) >= 2) {
        winSet('A');
    } else if (scoreB >= target && (scoreB - scoreA) >= 2) {
        winSet('B');
    }
}

function winSet(winningTeam) {
    isSetFinished = true;
    
    if (winningTeam === 'A') setsA++;
    if (winningTeam === 'B') setsB++;
    updateUI();

    // Check if the match is completely over
    if (setsA === setsRequiredToWin || setsB === setsRequiredToWin) {
        isMatchFinished = true;
        showModal(`Match Ended!<br>Team ${winningTeam} Wins!`);
        // We do NOT show the Next Set button, and we stay on this screen.
    } else {
        showModal(`Set Ended!<br>Team ${winningTeam} Wins Set ${currentSet}`);
        document.getElementById('next-set-btn').classList.remove('hidden');
    }
}

function startNextSet() {
    currentSet++;
    scoreA = 0;
    scoreB = 0;
    isSetFinished = false;
    
    document.getElementById('next-set-btn').classList.add('hidden');
    updateUI();
}

/* Modal Functions */
function showModal(message) {
    document.getElementById('modal-message').innerHTML = message;
    document.getElementById('custom-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('custom-modal').classList.add('hidden');
}

/* Navigation & Reset Functions */
function updateUI() {
    document.getElementById('score-a').innerText = scoreA;
    document.getElementById('score-b').innerText = scoreB;
    document.getElementById('sets-a').innerText = setsA;
    document.getElementById('sets-b').innerText = setsB;
    
    document.getElementById('match-status').innerText = `Set ${currentSet} of ${maxSets}`;
    document.getElementById('points-target').innerText = getTargetScore();
}

function resetMatch() {
    if(confirm("Are you sure you want to restart the current match? All scores will reset to 0.")) {
        // Zero out the variables but DO NOT go to the home screen
        currentSet = 1;
        scoreA = 0;
        scoreB = 0;
        setsA = 0;
        setsB = 0;
        isSetFinished = false;
        isMatchFinished = false;
        setServe('A'); 
        
        document.getElementById('next-set-btn').classList.add('hidden');
        updateUI();
    }
}

function goHome() {
    if(isMatchFinished || confirm("Are you sure you want to go Home? The current match will be lost.")) {
        document.getElementById('scoreboard-screen').classList.add('hidden');
        document.getElementById('setup-screen').classList.remove('hidden');
    }
}