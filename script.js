// Game Variables
let maxSets = 1;
let currentSet = 1;
let setsRequiredToWin = 1;
let defaultTargetScore = 25; 

let scoreA = 0;
let scoreB = 0;
let setsA = 0;
let setsB = 0;

let isSetFinished = false;
let isMatchFinished = false;
let currentServe = 'A'; 
let isSwapped = false; // Tracks if the court is visually flipped

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
    isSwapped = false; // Reset court sides on new game

    setServe('A'); 

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('scoreboard-screen').classList.remove('hidden');
    
    const nextBtn = document.getElementById('next-set-btn');
    if(nextBtn) nextBtn.classList.add('hidden');
    
    updateUI();
}

function getTargetScore() {
    if (defaultTargetScore === 25 && currentSet === maxSets && maxSets > 1) {
        return 15;
    }
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
    currentServe = team; 
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

function swapSides() {
    isSwapped = !isSwapped;
    updateUI();
}

function updateUI() {
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

    // Add match format text (e.g., " - Best of 3 sets")
    const elFormatText = document.getElementById('match-format-text');
    if (elFormatText) {
        elFormatText.innerText = maxSets > 1 ? ` - Best of ${maxSets} sets` : ` - 1 Set Game`;
    }

    // Apply the swap sides trick
    const scoreboard = document.querySelector('.scoreboard');
    if (scoreboard) {
        if (isSwapped) {
            scoreboard.classList.add('swapped');
        } else {
            scoreboard.classList.remove('swapped');
        }
    }

    saveData();
}

/* --- LOCAL STORAGE (SAVE/LOAD) LOGIC --- */

function saveData() {
    const gameState = {
        maxSets, currentSet, setsRequiredToWin, defaultTargetScore,
        scoreA, scoreB, setsA, setsB, isSetFinished, isMatchFinished, currentServe, isSwapped,
        nameA: document.getElementById('name-a') ? document.getElementById('name-a').innerText : "Team A",
        nameB: document.getElementById('name-b') ? document.getElementById('name-b').innerText : "Team B",
        isGameActive: !document.getElementById('scoreboard-screen').classList.contains('hidden')
    };
    localStorage.setItem('volleyData', JSON.stringify(gameState));
}

function loadData() {
    const saved = localStorage.getItem('volleyData');
    if (saved) {
        const data = JSON.parse(saved);
        
        if (data.isGameActive) {
            maxSets = data.maxSets;
            currentSet = data.currentSet;
            setsRequiredToWin = data.setsRequiredToWin;
            defaultTargetScore = data.defaultTargetScore;
            scoreA = data.scoreA;
            scoreB = data.scoreB;
            setsA = data.setsA;
            setsB = data.setsB;
            isSetFinished = data.isSetFinished;
            isMatchFinished = data.isMatchFinished;
            currentServe = data.currentServe || 'A';
            isSwapped = data.isSwapped || false; // Load the swapped state
            
            document.getElementById('name-a').innerText = data.nameA || "Team A";
            document.getElementById('name-b').innerText = data.nameB || "Team B";

            document.getElementById('setup-screen').classList.add('hidden');
            document.getElementById('scoreboard-screen').classList.remove('hidden');
            
            if (isSetFinished && !isMatchFinished) {
                document.getElementById('next-set-btn').classList.remove('hidden');
            } else {
                document.getElementById('next-set-btn').classList.add('hidden');
            }
            
            setServe(currentServe);
            updateUI(); 
        }
    }
}

window.onload = loadData;

/* Modal Functions */
function showModal(message) {
    document.getElementById('modal-message').innerHTML = message;
    document.getElementById('custom-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('custom-modal').classList.add('hidden');
}

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
        isSwapped = false; // Reset visual swap on match restart
        setServe('A'); 
        
        document.getElementById('next-set-btn').classList.add('hidden');
        updateUI();
    } else if (pendingAction === 'home') {
        document.getElementById('scoreboard-screen').classList.add('hidden');
        document.getElementById('setup-screen').classList.remove('hidden');
        saveData(); 
    }
    
    closeConfirmModal();
}

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