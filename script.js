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

// Keeps track of what the user is trying to do when a confirmation pops up
let pendingAction = null;

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
    document.getElementById('score-a').innerText = scoreA;
    document.getElementById('score-b').innerText = scoreB;
    document.getElementById('sets-a').innerText = setsA;
    document.getElementById('sets-b').innerText = setsB;
    
    document.getElementById('match-status').innerText = `Set ${currentSet} of ${maxSets}`;
    document.getElementById('points-target').innerText = getTargetScore();
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
    pendingAction = null; // Clear the pending action
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
    // Replaces default confirm() with custom modal
    showConfirmModal("Are you sure you want to restart the match? All scores will reset to 0.", 'restart');
}

function goHome() {
    if (isMatchFinished) {
        // If the match is already over, just go home without asking
        pendingAction = 'home';
        executeConfirm(); 
    } else {
        // Replaces default confirm() with custom modal
        showConfirmModal("Are you sure you want to go Home? The current match will be lost.", 'home');
    }
}