document.addEventListener('DOMContentLoaded', function() {
    let timer;
    let isRunning = false;
    let isWorkTime = true;
    let workMinutes = 25;
    let restMinutes = 5;
    let longRestMinutes = 15;
    let cycleCount = 1;
    let timeLeft = workMinutes * 60;
    let totalTime = workMinutes * 60;

    const startPauseButton = document.getElementById('start-pause');
    const resetButton = document.getElementById('reset');
    const setWorkTimeButton = document.getElementById('set-work-time');
    const workMinutesInput = document.getElementById('work-minutes');
    const timerDisplay = document.getElementById('timer-display');
    const progressRing = document.getElementById('progress-ring');
    const statusDisplay = document.getElementById('status-display');
    const cycleDisplay = document.getElementById('cycle-display');
    const circumference = 2 * Math.PI * 100; // r=100
    const audio = document.getElementById('pomodoro-audio');

    progressRing.setAttribute('stroke-dasharray', circumference);

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        // 更新圆环进度
        const offset = circumference * (1 - timeLeft / totalTime);
        progressRing.setAttribute('stroke-dashoffset', offset);

        statusDisplay.textContent = isWorkTime ? "工作中" : "休息中";
        cycleDisplay.textContent = `第 ${cycleCount} 个番茄钟`;
    }

    function playNotify() {
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    function switchPeriod() {
        if (isWorkTime) {
            // 工作结束，进入休息
            playNotify();
            isWorkTime = false;
            if (cycleCount % 4 === 0) {
                timeLeft = longRestMinutes * 60;
                totalTime = longRestMinutes * 60;
            } else {
                timeLeft = restMinutes * 60;
                totalTime = restMinutes * 60;
            }
        } else {
            // 休息结束，进入工作
            playNotify();
            isWorkTime = true;
            cycleCount = cycleCount + 1;
            timeLeft = workMinutes * 60;
            totalTime = workMinutes * 60;
        }
        updateDisplay();
    }

    function timerTick() {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            startPauseButton.textContent = "开始";
            switchPeriod();
            // 自动开始下一阶段
            startTimer();
        }
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startPauseButton.textContent = "暂停";
            timer = setInterval(timerTick, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startPauseButton.textContent = "开始";
    }

    function resetTimer() {
        pauseTimer();
        isWorkTime = true;
        cycleCount = 1;
        workMinutes = parseInt(workMinutesInput.value, 10) || 25;
        timeLeft = workMinutes * 60;
        totalTime = workMinutes * 60;
        updateDisplay();
    }

    startPauseButton.addEventListener('click', function() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetButton.addEventListener('click', resetTimer);

    setWorkTimeButton.addEventListener('click', function() {
        workMinutes = parseInt(workMinutesInput.value, 10) || 25;
        if (isWorkTime) {
            timeLeft = workMinutes * 60;
            totalTime = workMinutes * 60;
            updateDisplay();
        }
    });

    // 初始化显示
    updateDisplay();
});