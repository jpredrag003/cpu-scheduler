const translations = {
    sr: {
        mainTitle: "Simulator CPU Raspoređivanja",
        configTitle: "⚙️ Konfiguracija sistema i procesa",
        lblArch: "Arhitektura",
        optSingle: "Jednoprocesorski",
        optSmp: "SMP (Simetrični)",
        optAsym: "Asimetrični (Master-Slave)",
        lblCpuCount: "Broj procesora",
        lblAlgo: "Algoritam",
        lblQuantum: "Kvantum (Q)",
        lblArrival: "Vreme dolaska",
        lblBurst: "Izvršavanje",
        lblPeriod: "Period (T)",
        lblDeadline: "Rok (Deadline)",
        btnReset: "Resetuj sve",
        btnAdd: "Dodaj proces",
        tableTitle: "📋 Pregled procesa i statistika",
        thProc: "Proces",
        thArrival: "Dolazak",
        thBurst: "Izvršavanje",
        thPeriod: "Period (T)",
        thDeadline: "Rok (D)",
        thComp: "Završetak",
        thTurnaround: "Vreme obilaska",
        thWaiting: "Vreme čekanja",
        thStatus: "Status Roka",
        thAction: "Akcija",
        ganttTitle: "📊 Gantt dijagram izvršavanja po procesorima",
        calcTitle: "📐 Detaljna računica i koraci izračunavanja",
        noProc: "Nema unetih procesa.",
        avgTurn: "Prosečno vreme obilaska: ",
        avgWait: "Prosečno vreme čekanja: ",
        deadlineMet: "Ispunjen rok",
        deadlineMissed: "PROBIJEN",
        delBtn: "Obriši",
        sysSingle: "Jednoprocesorski sistem.",
        sysSmp: "Simetrični Multiprocesorski sistem.",
        sysAsym: "Asimetrični Multiprocesorski sistem.",
        descFcfs: " FCFS: Procesi se izvršavaju redom dolaska.",
        descSjf: " SJF: Prednost imaju procesi sa kraćim vremenom izvršavanja.",
        descRr: " Round Robin: Deljenje vremena po fiksnom kvantumu.",
        descRt: " Real-Time algoritam: Upravljanje prioritetima i rokovima."
    },
    en: {
        mainTitle: "CPU Scheduling Simulator",
        configTitle: "⚙️ System and Process Configuration",
        lblArch: "Architecture",
        optSingle: "Uniprocessor",
        optSmp: "SMP (Symmetric)",
        optAsym: "Asymmetric (Master-Slave)",
        lblCpuCount: "CPU Count",
        lblAlgo: "Algorithm",
        lblQuantum: "Quantum (Q)",
        lblArrival: "Arrival Time",
        lblBurst: "Burst Time",
        lblPeriod: "Period (T)",
        lblDeadline: "Deadline (D)",
        btnReset: "Reset All",
        btnAdd: "Add Process",
        tableTitle: "📋 Process Overview & Statistics",
        thProc: "Process",
        thArrival: "Arrival",
        thBurst: "Burst",
        thPeriod: "Period (T)",
        thDeadline: "Deadline (D)",
        thComp: "Completion",
        thTurnaround: "Turnaround Time",
        thWaiting: "Waiting Time",
        thStatus: "Deadline Status",
        thAction: "Action",
        ganttTitle: "📊 CPU Execution Gantt Chart",
        calcTitle: "📐 Detailed Step-by-Step Calculation",
        noProc: "No processes entered.",
        avgTurn: "Average Turnaround Time: ",
        avgWait: "Average Waiting Time: ",
        deadlineMet: "Deadline Met",
        deadlineMissed: "MISSED",
        delBtn: "Delete",
        sysSingle: "Uniprocessor system.",
        sysSmp: "Symmetric Multiprocessor system.",
        sysAsym: "Asymmetric Multiprocessor system.",
        descFcfs: " FCFS: Processes are executed in order of arrival.",
        descSjf: " Processes with shorter burst time have priority.",
        descRr: " Round Robin: Time-sharing with a fixed quantum.",
        descRt: " Real-Time algorithm: Priority and deadline management."
    }
};

function fmtMath(latexStr) {
    try {
        return katex.renderToString(latexStr, { displayMode: false, throwOnError: false });
    } catch (e) {
        return latexStr;
    }
}

function initSettings() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtonUI(savedTheme);

    const savedLang = localStorage.getItem('lang') || 'sr';
    document.documentElement.setAttribute('data-lang', savedLang);
    updateLangButtonUI(savedLang);
    applyTranslations(savedLang);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonUI(newTheme);
}

function updateThemeButtonUI(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.innerText = theme === 'dark' ? '☀️' : '🌙';
}

function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'sr' ? 'en' : 'sr';
    document.documentElement.setAttribute('data-lang', newLang);
    localStorage.setItem('lang', newLang);
    updateLangButtonUI(newLang);
    applyTranslations(newLang);
    handleAlgorithmChange();
}

function updateLangButtonUI(lang) {
    const langText = document.getElementById('langText');
    if (langText) langText.innerText = lang === 'sr' ? 'EN' : 'SR';
}

function applyTranslations(lang) {
    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerText = t[key];
        }
    });
    renderTable();
}

let processes = [
    { id: 'P1', arrival: 0, burst: 8, period: 10, deadline: 10 },
    { id: 'P2', arrival: 1, burst: 4, period: 15, deadline: 15 },
    { id: 'P3', arrival: 2, burst: 6, period: 20, deadline: 20 },
    { id: 'P4', arrival: 3, burst: 5, period: 25, deadline: 25 }
];

const colors = ['#6366f1', '#f43f5e', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#64748b'];

function init() {
    initSettings();
    handleSystemChange();
}

function handleSystemChange() {
    const sysType = document.getElementById('systemType').value;
    const cpuGroup = document.getElementById('cpuCountGroup');
    cpuGroup.style.display = (sysType === 'SINGLE') ? 'none' : 'flex';
    handleAlgorithmChange();
}

function handleAlgorithmChange() {
    const lang = document.documentElement.getAttribute('data-lang');
    const t = translations[lang];
    const algo = document.getElementById('algorithmSelect').value;
    const descEl = document.getElementById('algoDesc');
    const sysType = document.getElementById('systemType').value;
    const quantumGroup = document.getElementById('quantumGroup');
    const periodGroup = document.getElementById('periodGroup');
    const deadlineGroup = document.getElementById('deadlineGroup');
    const thPeriod = document.getElementById('thPeriod');
    const thDeadline = document.getElementById('thDeadline');
    const thRealTimeStatus = document.getElementById('thRealTimeStatus');

    quantumGroup.style.display = 'none';
    periodGroup.style.display = 'none';
    deadlineGroup.style.display = 'none';
    if (thPeriod) thPeriod.style.display = 'none';
    if (thDeadline) thDeadline.style.display = 'none';
    if (thRealTimeStatus) thRealTimeStatus.style.display = 'none';

    let sysDesc = sysType === 'SINGLE' ? t.sysSingle : (sysType === 'SMP' ? t.sysSmp : t.sysAsym);
    if (algo === 'FCFS') {
        descEl.innerText = sysDesc + t.descFcfs;
    } else if (algo === 'SJF') {
        descEl.innerText = sysDesc + t.descSjf;
    } else if (algo === 'RR') {
        descEl.innerText = sysDesc + t.descRr;
        quantumGroup.style.display = 'flex';
    } else if (algo === 'RMS' || algo === 'EDF') {
        descEl.innerText = sysDesc + t.descRt;
        periodGroup.style.display = 'flex';
        deadlineGroup.style.display = 'flex';
        if (thPeriod) thPeriod.style.display = 'table-cell';
        if (thDeadline) thDeadline.style.display = 'table-cell';
        if (thRealTimeStatus) thRealTimeStatus.style.display = 'table-cell';
    }
    renderTable();
}

function addProcess() {
    const arrival = parseInt(document.getElementById('arrivalTime').value);
    const burst = parseInt(document.getElementById('burstTime').value);
    const period = parseInt(document.getElementById('periodInput').value) || 10;
    const deadline = parseInt(document.getElementById('deadlineInput').value) || 10;

    if (isNaN(arrival) || isNaN(burst) || burst <= 0 || arrival < 0) {
        alert(document.documentElement.getAttribute('data-lang') === 'sr' ? "Unesite validna vremena." : "Please enter valid times.");
        return;
    }

    const newId = 'P' + (processes.length + 1);
    processes.push({ id: newId, arrival, burst, period, deadline });
    renderTable();
}

function deleteProcess(index) {
    processes.splice(index, 1);
    processes.forEach((p, idx) => p.id = 'P' + (idx + 1));
    renderTable();
}

function resetProcesses() {
    processes = [];
    renderTable();
}

function simulateMultiProcessor() {
    if (processes.length === 0) return { results: [], timelines: {}, steps: [] };

    const sysType = document.getElementById('systemType').value;
    let cpuCount = sysType === 'SINGLE' ? 1 : parseInt(document.getElementById('cpuCountInput').value) || 2;
    const algo = document.getElementById('algorithmSelect').value;

    let cpus = [];
    for (let i = 0; i < cpuCount; i++) {
        cpus.push({
            id: i === 0 && sysType === 'ASYMMETRIC' ? 'Master CPU 0' : `CPU ${i}`,
            freeAt: 0,
            isMaster: (i === 0 && sysType === 'ASYMMETRIC')
        });
    }

    let procs = processes.map(p => ({
        ...p,
        remaining: p.burst,
        absDeadline: p.arrival + p.deadline
    }));

    procs.sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0;
    let completedCount = 0;
    let n = procs.length;
    let completionTimes = {};
    let timelines = {};
    let steps = [];

    cpus.forEach(c => timelines[c.id] = []);

    let availableCpus = sysType === 'ASYMMETRIC' ? cpus.slice(1) : cpus;
    if (sysType === 'ASYMMETRIC' && cpus.length === 1) {
        cpus = [{ id: 'Master CPU 0', freeAt: 0, isMaster: true }, { id: 'Slave CPU 1', freeAt: 0, isMaster: false }];
        availableCpus = [cpus[1]];
    }

    let safetyCounter = 0;
    while (completedCount < n && safetyCounter < 5000) {
        safetyCounter++;
        let readyQueue = procs.filter(p => p.arrival <= currentTime && p.remaining > 0 && p.completion === undefined);

        if (readyQueue.length === 0) {
            let unarrived = procs.filter(p => p.remaining > 0 && p.completion === undefined);
            if (unarrived.length > 0) {
                let nextArr = Math.min(...unarrived.map(p => p.arrival));
                steps.push(`Vreme ${fmtMath('t = ' + currentTime)}: Nema spremnih procesa. Sistem čeka do dolaska sledećeg procesa u ${fmtMath('t = ' + nextArr)}.`);
                currentTime = nextArr;
                continue;
            } else {
                break;
            }
        }

        if (algo === 'SJF') {
            readyQueue.sort((a, b) => a.burst !== b.burst ? a.burst - b.burst : a.arrival - b.arrival);
        } else if (algo === 'RMS') {
            readyQueue.sort((a, b) => a.period !== b.period ? a.period - b.period : a.arrival - b.arrival);
        } else if (algo === 'EDF') {
            readyQueue.sort((a, b) => a.absDeadline !== b.absDeadline ? a.absDeadline - b.absDeadline : a.arrival - b.arrival);
        } else {
            readyQueue.sort((a, b) => a.arrival - b.arrival);
        }

        let assigned = false;
        for (let cpu of availableCpus) {
            if (cpu.freeAt <= currentTime && readyQueue.length > 0) {
                let p = readyQueue.shift();
                let execTime = p.remaining;

                if (algo === 'RR') {
                    let quantum = parseInt(document.getElementById('quantumInput').value) || 2;
                    execTime = Math.min(p.remaining, quantum);
                }

                let startTime = currentTime;
                let endTime = startTime + execTime;

                timelines[cpu.id].push({ id: p.id, start: startTime, end: endTime });
                cpu.freeAt = endTime;
                p.remaining -= execTime;

                steps.push(`U trenutku ${fmtMath('t = ' + startTime)}, proces <strong>${p.id}</strong> se dodeljuje na <strong>${cpu.id}</strong> i izvršava se do ${fmtMath('t = ' + endTime)}.`);

                if (p.remaining === 0) {
                    completedCount++;
                    completionTimes[p.id] = endTime;
                    p.completion = endTime;
                    steps.push(`➔ Proces <strong>${p.id}</strong> je u potpunosti <strong>završen</strong> u trenutku ${fmtMath('t = ' + endTime)}.`);
                }
                assigned = true;
            }
        }

        if (!assigned) {
            let minFreeAt = Math.min(...availableCpus.map(c => c.freeAt));
            currentTime = Math.max(currentTime + 1, minFreeAt);
        } else {
            currentTime = Math.min(...availableCpus.map(c => Math.max(c.freeAt, currentTime)));
        }
    }

    let results = processes.map(p => {
        let completion = completionTimes[p.id] || p.arrival + p.burst;
        let turnaround = completion - p.arrival;
        let waiting = turnaround - p.burst;
        let isMet = completion <= (p.arrival + p.deadline);
        return { ...p, completion, turnaround, waiting, isMet };
    });

    return { results, timelines, steps };
}

function renderTable() {
    const lang = document.documentElement.getAttribute('data-lang');
    const t = translations[lang];
    const tbody = document.getElementById('processTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const algorithm = document.getElementById('algorithmSelect').value;
    let showRTCols = (algorithm === 'RMS' || algorithm === 'EDF');

    const thPeriod = document.getElementById('thPeriod');
    const thDeadline = document.getElementById('thDeadline');
    const thRealTimeStatus = document.getElementById('thRealTimeStatus');
    if (thPeriod) thPeriod.style.display = showRTCols ? 'table-cell' : 'none';
    if (thDeadline) thDeadline.style.display = showRTCols ? 'table-cell' : 'none';
    if (thRealTimeStatus) thRealTimeStatus.style.display = showRTCols ? 'table-cell' : 'none';

    if (processes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="color: var(--text-muted); padding: 25px;">${t.noProc}</td></tr>`;
        document.getElementById('summarySection').style.display = 'none';
        document.getElementById('ganttSection').style.display = 'none';
        document.getElementById('calcSection').style.display = 'none';
        return;
    }

    let output = simulateMultiProcessor();
    let results = output.results;
    let timelines = output.timelines;
    let steps = output.steps;

    let totalTurnaround = 0, totalWaiting = 0;
    results.forEach((p, index) => {
        totalTurnaround += p.turnaround;
        totalWaiting += p.waiting;

        const row = document.createElement('tr');
        let periodTd = showRTCols ? `<td>${p.period}</td>` : '';
        let deadlineTd = showRTCols ? `<td>${p.deadline}</td>` : '';
        let rtStatusTd = showRTCols ? `<td>${p.isMet ? `<span class="badge-success">${t.deadlineMet}</span>` : `<span class="badge-danger">${t.deadlineMissed}</span>`}</td>` : '';

        row.innerHTML = `
            <td><b>${p.id}</b></td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            ${periodTd}
            ${deadlineTd}
            <td>${p.completion}</td>
            <td>${p.turnaround}</td>
            <td>${p.waiting}</td>
            ${rtStatusTd}
            <td><button class="btn-danger" style="padding: 4px 10px; font-size: 12px;" onclick="deleteProcess(${index})">${t.delBtn}</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('avgTurnaround').innerText = `${t.avgTurn}${(totalTurnaround / results.length).toFixed(2)}`;
    document.getElementById('avgWaiting').innerText = `${t.avgWait}${(totalWaiting / results.length).toFixed(2)}`;
    document.getElementById('summarySection').style.display = 'flex';

    const calcList = document.getElementById('calcStepsList');
    calcList.innerHTML = '';
    results.forEach(p => {
        let li = document.createElement('li');
        let formulaHtml = fmtMath(`T_{\\text{obilazak}}(${p.id}) = T_{\\text{završetak}} - T_{\\text{dolazak}} = ${p.completion} - ${p.arrival} = ${p.turnaround}`);
        let waitFormulaHtml = fmtMath(`T_{\\text{čekanje}}(${p.id}) = T_{\\text{obilazak}} - T_{\\text{izvršavanje}} = ${p.turnaround} - ${p.burst} = ${p.waiting}`);
        li.innerHTML = `Proces <strong>${p.id}</strong>: <br> &nbsp;&nbsp;• ${formulaHtml} <br> &nbsp;&nbsp;• ${waitFormulaHtml}`;
        calcList.appendChild(li);
    });

    steps.forEach(step => {
        let li = document.createElement('li');
        li.innerHTML = step;
        calcList.appendChild(li);
    });

    document.getElementById('calcSection').style.display = 'block';
    renderGantt(timelines);
}

function renderGantt(timelines) {
    const container = document.getElementById('ganttChartsContainer');
    if (!container) return;
    container.innerHTML = '';
    document.getElementById('ganttSection').style.display = 'block';

    let allSegments = Object.values(timelines).flat();
    if (allSegments.length === 0) return;

    let endTime = Math.max(...allSegments.map(s => s.end), 1);
    let totalDuration = endTime;
    let uniqueIds = [...new Set(allSegments.map(t => t.id))];

    const legendDiv = document.createElement('div');
    legendDiv.className = 'gantt-legend';
    uniqueIds.forEach((id, idx) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[idx % colors.length];
        item.appendChild(colorBox);
        item.appendChild(document.createTextNode(id));
        legendDiv.appendChild(item);
    });
    container.appendChild(legendDiv);

    for (let [cpuName, segments] of Object.entries(timelines)) {
        const cpuRow = document.createElement('div');
        cpuRow.className = 'cpu-row';

        const label = document.createElement('div');
        label.className = 'cpu-label';
        label.innerHTML = `💻 ${cpuName}`;
        cpuRow.appendChild(label);

        const wrapper = document.createElement('div');
        wrapper.className = 'gantt-track-wrapper';

        const gridDiv = document.createElement('div');
        gridDiv.className = 'gantt-chart-grid';
        for (let t = 0; t <= endTime; t++) {
            let leftPercent = (t / totalDuration) * 100;
            const gridLine = document.createElement('div');
            gridLine.className = 'grid-line';
            gridLine.style.left = `${leftPercent}%`;
            gridDiv.appendChild(gridLine);
        }
        wrapper.appendChild(gridDiv);

        const chart = document.createElement('div');
        chart.className = 'gantt-chart';

        let currentTimelineTime = 0;
        segments.sort((a, b) => a.start - b.start);
        segments.forEach(seg => {
            if (seg.start > currentTimelineTime) {
                let emptyDuration = seg.start - currentTimelineTime;
                let emptyWidth = (emptyDuration / totalDuration) * 100;
                const emptyBlock = document.createElement('div');
                emptyBlock.className = 'gantt-block gantt-empty';
                emptyBlock.style.width = `${emptyWidth}%`;
                emptyBlock.innerText = `idle`;
                chart.appendChild(emptyBlock);
            }

            let duration = seg.end - seg.start;
            let widthPercent = (duration / totalDuration) * 100;
            const block = document.createElement('div');
            block.className = 'gantt-block';
            block.style.width = `${widthPercent}%`;
            block.style.backgroundColor = colors[uniqueIds.indexOf(seg.id) % colors.length];
            block.innerHTML = `<b>${seg.id}</b><span class="sub-time">[${seg.start}-${seg.end}]</span>`;
            block.title = `Proces ${seg.id}: Vreme ${seg.start} do ${seg.end}`;
            chart.appendChild(block);

            currentTimelineTime = seg.end;
        });

        if (currentTimelineTime < endTime) {
            let restWidth = ((endTime - currentTimelineTime) / totalDuration) * 100;
            const restBlock = document.createElement('div');
            restBlock.className = 'gantt-block gantt-empty';
            restBlock.style.width = `${restWidth}%`;
            restBlock.innerText = `kraj`;
            chart.appendChild(restBlock);
        }

        wrapper.appendChild(chart);

        const axis = document.createElement('div');
        axis.className = 'gantt-timeline-axis';
        for (let t = 0; t <= endTime; t++) {
            let leftPercent = (t / totalDuration) * 100;
            const marker = document.createElement('span');
            marker.className = 'axis-marker';
            marker.style.left = `${leftPercent}%`;
            marker.innerText = t;
            axis.appendChild(marker);
        }
        wrapper.appendChild(axis);

        cpuRow.appendChild(wrapper);
        container.appendChild(cpuRow);
    }
}

window.onload = init;