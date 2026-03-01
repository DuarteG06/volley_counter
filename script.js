// Game Variables
let maxSets = 1;
let currentSet = 1;
let setsRequiredToWin = 1;

let scoreA = 0;
let scoreB = 0;
let setsA = 0;
let setsB = 0;

function startGame(sets) {
    maxSets = sets;
    currentSet = 1;
    setsRequiredToWin = Math.ceil(sets / 2); // e.g., Best of 5 needs 3 to win
    
    scoreA = 0;
    scoreB = 0;
    setsA = 0;
    setsB = 0;

    // Switch screens
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('scoreboard-screen').classList.remove('hidden');
    
    updateUI();
}

function getTargetScore() {
    // If it's a tiebreaker set (e.g., 5th set in a 5-set game, or 3rd in a 3-set game)
    if (currentSet === maxSets && maxSets > 1) {
        return 15;
    }
    // Standard sets go to 25
    return 25;
}

function addPoint(team) {
    if (team === 'A') scoreA++;
    if (team === 'B') scoreB++;

    checkSetWin();
    updateUI();
}

function checkSetWin() {
    const target = getTargetScore();
    
    // Check if either team has reached the target AND has a 2-point lead
    if (scoreA >= target && (scoreA - scoreB) >= 2) {
        winSet('A');
    } else if (scoreB >= target && (scoreB - scoreA) >= 2) {
        winSet('B');
    }
}

function winSet(winningTeam) {
    if (winningTeam === 'A') setsA++;
    if (winningTeam === 'B') setsB++;

    // Check if the whole match is over
    if (setsA === setsRequiredToWin) {
        alert("Team A wins the match!");
        resetToMenu();
        return;
    } else if (setsB === setsRequiredToWin) {
        alert("Team B wins the match!");
        resetToMenu();
        return;
    }

    // Move to next set
    currentSet++;
    scoreA = 0;
    scoreB = 0;
    alert(`Set won by Team ${winningTeam}! Moving to Set ${currentSet}.`);
}

function updateUI() {
    document.getElementById('score-a').innerText = scoreA;
    document.getElementById('score-b').innerText = scoreB;
    document.getElementById('sets-a').innerText = setsA;
    document.getElementById('sets-b').innerText = setsB;
    
    document.getElementById('match-status').innerText = `Set ${currentSet} of ${maxSets}`;
    document.getElementById('points-target').innerText = getTargetScore();
}

function resetMatch() {
    if(confirm("Are you sure you want to reset the current match?")) {
        resetToMenu();
    }
}

function resetToMenu() {
    document.getElementById('scoreboard-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
}