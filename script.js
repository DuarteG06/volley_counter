// Game Variables
let maxSets = 1;
let currentSet = 1;
let setsRequiredToWin = 1;
let defaultTargetScore = 25; // Tells us if it's a 25 or 15 point game mode

let scoreA = 0;
let scoreB = 0;
let setsA = 0;
let setsB = 0;

let isSetFinished = false;
let isMatchFinished = false;

// Keeps track of what the user is trying to do when a confirmation pops up
let pendingAction = null;

function startGame(sets, target) {
    maxSets = sets;
    defaultTargetScore = target;
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
    
    const nextBtn = document.getElementById('next-set-btn');
    if(nextBtn) nextBtn.classList.add('hidden');
    
    updateUI();
}

function getTargetScore() {
    // If it's a 25-point game, the final tiebreaker set (e.g. 5th set) goes to 15
    if (defaultTargetScore === 25 && currentSet === maxSets && maxSets > 1) {
        return 15;
    }
    // Otherwise, use whatever the game mode target is
    return defaultTargetScore;
}

function addPoint(team, event) {
    if (event.target.closest('.team-header') || event.target.closest('.undo-btn')) return;
    if (isSetFinished || isMatchFinished) return;

    if (team === 'A') scoreA++;
    if (team === 'B') scoreB++;

    setServe(team);
    updateUI();
    checkSetWin();
}

function removePoint(team, event) {
    event.stopPropagation();
    if (isMatchFinished) return;

    if (team === 'A' && scoreA > 0) {
        if (isSetFinished && scoreA > scoreB) {
            setsA--;
            isSetFinished = false;
            document.getElementById('next-set-btn').classList.add('hidden');
        }
        scoreA--;
    } else if (team === 'B' && scoreB > 0) {
        if (isSetFinished && scoreB > scoreA) {
            setsB--;
            isSetFinished = false;
            document.getElementById('next-set-btn').classList.add('hidden');
        }
        scoreB--;
    }

    updateUI();
}

function setServe(team) {
    const serveA = document.getElementById('serve-a');
    const serveB = document.getElementById('serve-b');
    
    if(serveA) serveA.classList.remove('active');
    if(serveB) serveB.classList.remove('active');
    
    if (team === 'A' && serveA) serveA.classList.add('active');
    if (team === 'B' && serveB) serveB.classList.add('active');
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

    if (setsA === setsRequiredToWin || setsB === setsRequiredToWin) {
        isMatchFinished = true;
        showModal(`Match Ended!<br>Team ${winningTeam} Wins!`);
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

function updateUI() {
    // Safety checks added to completely prevent "null" errors
    const elScoreA = document.getElementById('score-a');
    if (elScoreA) elScoreA.innerText = scoreA;

    const elScoreB = document.getElementById('score-b');
    if (elScoreB) elScoreB.innerText = scoreB;

    const elSetsA = document.getElementById('sets-a');
    if (elSetsA) elSetsA.innerText = setsA;

    const elSetsB = document.getElementById('sets-b');
    if (elSetsB) elSetsB.innerText = setsB;

    const elTarget = document.getElementById('points-target');
    if (elTarget) elTarget.innerText = getTargetScore();
}

/* Modal Functions for Alerts (Okay) */
function showModal(message) {
    document.getElementById('modal-message').innerHTML = message;
    document.getElementById('custom-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('custom-modal').classList.add('hidden');
}

/* Modal Functions for Confirmation (Yes / Cancel) */
function showConfirmModal(message, action) {
    document.getElementById('confirm-message').innerHTML = message;
    pendingAction = action;
    document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    pendingAction = null; 
}

function executeConfirm() {
    if (pendingAction === 'restart') {
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
    } else if (pendingAction === 'home') {
        document.getElementById('scoreboard-screen').classList.add('hidden');
        document.getElementById('setup-screen').classList.remove('hidden');
    }
    
    closeConfirmModal();
}

/* Navigation & Reset Triggers */
function resetMatch() {
    showConfirmModal("Are you sure you want to restart the match? All scores will reset to 0.", 'restart');
}

function goHome() {
    if (isMatchFinished) {
        pendingAction = 'home';
        executeConfirm(); 
    } else {
        showConfirmModal("Are you sure you want to go Home? The current match will be lost.", 'home');
    }
}