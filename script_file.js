// ================= SECURITY & SANITIZATION UTILITIES =================
function sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// ================= STUDENT PROFILE MANAGEMENT =================
const defaultProfile = {
    name: "Juan Dela Cruz",
    studentNo: "2026-01234-MN-0",
    year: "2nd Year",
    course: "BS Business Administration / Accountancy",
    schoolYear: "S.Y. 2026-2027 (1st Sem)",
    subject: "Obligations and Contracts (LAW 201)"
};

function loadStudentProfile() {
    let profile = defaultProfile;
    try {
        const saved = localStorage.getItem("studentProfile");
        if (saved) profile = JSON.parse(saved);
    } catch (e) {
        console.error("LocalStorage read error", e);
    }

    document.getElementById("disp-name").textContent = profile.name;
    document.getElementById("disp-student-no").textContent = profile.studentNo;
    document.getElementById("disp-year").textContent = profile.year;
    document.getElementById("disp-course").textContent = profile.course;
    document.getElementById("disp-school-year").textContent = profile.schoolYear;
    document.getElementById("disp-subject").textContent = profile.subject;

    document.getElementById("input-name").value = profile.name;
    document.getElementById("input-student-no").value = profile.studentNo;
    document.getElementById("input-year").value = profile.year;
    document.getElementById("input-course").value = profile.course;
    document.getElementById("input-school-year").value = profile.schoolYear;
    document.getElementById("input-subject").value = profile.subject;
}

function toggleProfileEdit(isEditing) {
    document.getElementById("profile-view").classList.toggle("hidden", isEditing);
    document.getElementById("profile-form").classList.toggle("hidden", !isEditing);
    document.getElementById("edit-profile-btn").classList.toggle("hidden", isEditing);
    document.getElementById("save-profile-btn").classList.toggle("hidden", !isEditing);
}

function saveStudentProfile() {
    const updatedProfile = {
        name: document.getElementById("input-name").value.trim() || defaultProfile.name,
        studentNo: document.getElementById("input-student-no").value.trim() || defaultProfile.studentNo,
        year: document.getElementById("input-year").value.trim() || defaultProfile.year,
        course: document.getElementById("input-course").value.trim() || defaultProfile.course,
        schoolYear: document.getElementById("input-school-year").value.trim() || defaultProfile.schoolYear,
        subject: document.getElementById("input-subject").value.trim() || defaultProfile.subject,
    };

    try {
        localStorage.setItem("studentProfile", JSON.stringify(updatedProfile));
    } catch (e) {
        console.error("LocalStorage write error", e);
    }

    loadStudentProfile();
    toggleProfileEdit(false);

    const alertBox = document.getElementById("profile-alert");
    alertBox.classList.remove("hidden");
    setTimeout(() => alertBox.classList.add("hidden"), 3000);
}

// ================= TAB NAVIGATION =================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-slate-800/80', 'text-amber-400');
    });

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.remove('hidden');

    const activeNavBtn = document.getElementById(`nav-${tabId}`);
    if (activeNavBtn) activeNavBtn.classList.add('bg-slate-800/80', 'text-amber-400');

    document.getElementById('mobile-menu').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// ================= DARK MODE TOGGLE =================
function toggleDarkMode() {
    const html = document.documentElement;
    const icon = document.getElementById("theme-icon");
    if (html.classList.contains("dark")) {
        html.classList.remove("dark");
        icon.className = "fa-solid fa-moon text-base";
        localStorage.setItem("theme", "light");
    } else {
        html.classList.add("dark");
        icon.className = "fa-solid fa-sun text-base";
        localStorage.setItem("theme", "dark");
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add("dark");
        document.getElementById("theme-icon").className = "fa-solid fa-sun text-base";
    }
}

// ================= FLASHCARDS & MASTERY =================
const flashcardsData = [
    { id: 1, term: "Mora Solvendi", category: "Delay", definition: "Default or delay on the part of the debtor to fulfill his obligation after demand." },
    { id: 2, term: "Mora Accipiendi", category: "Delay", definition: "Delay on the part of the creditor to accept performance without justifiable cause." },
    { id: 3, term: "Caso Fortuito", category: "Exemption", definition: "An extraordinary event which could not be foreseen, or which though foreseen, was inevitable." },
    { id: 4, term: "Dolo Causante", category: "Fraud", definition: "Causal fraud used to induce a party to enter into a contract; renders contract voidable." },
    { id: 5, term: "Culpa Aquiliana", category: "Torts", definition: "Negligence resulting in damages independent of any pre-existing contractual relationship." },
    { id: 6, term: "Solutio Indebiti", category: "Quasi-Contract", definition: "Payment made by mistake when no legal right to demand exists, creating an obligation to return." },
    { id: 7, term: "Negotiorum Gestio", category: "Quasi-Contract", definition: "Voluntary management of property or business of another without consent, requiring reimbursement." },
    { id: 8, term: "Novation", category: "Extinction", definition: "Extinction of an obligation through the creation of a new valid obligation substituted in its place." }
];

let masteredCards = new Set(JSON.parse(localStorage.getItem("masteredCards") || "[]"));

function renderFlashcards() {
    const container = document.getElementById("flashcard-grid");
    container.innerHTML = "";

    flashcardsData.forEach(card => {
        const isMastered = masteredCards.has(card.id);
        container.innerHTML += `
            <div class="h-56 w-full perspective-1000">
                <div class="card-inner relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <!-- FRONT -->
                    <div class="absolute inset-0 w-full h-full rounded-2xl bg-white dark:bg-slate-800 p-5 flex flex-col justify-between items-center text-center backface-hidden border-2 border-slate-100 dark:border-slate-700 cursor-pointer" onclick="flipCard(this.parentElement)">
                        <span class="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full">${card.category}</span>
                        <h3 class="text-lg font-bold font-serif text-navy-900 dark:text-slate-100">${sanitizeHTML(card.term)}</h3>
                        <p class="text-[11px] text-slate-400"><i class="fa-solid fa-rotate mr-1"></i>Click card to flip</p>
                    </div>
                    <!-- BACK -->
                    <div class="absolute inset-0 w-full h-full rounded-2xl bg-navy-900 text-white p-5 flex flex-col justify-between items-center text-center backface-hidden rotate-y-180 border-2 border-amber-500">
                        <p class="text-xs text-amber-400 font-bold">${sanitizeHTML(card.term)}</p>
                        <p class="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">${sanitizeHTML(card.definition)}</p>
                        <button onclick="toggleMastery(${card.id})" class="px-3 py-1 text-xs rounded-full transition font-semibold ${isMastered ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}">
                            ${isMastered ? '<i class="fa-solid fa-check mr-1"></i>Mastered' : 'Mark as Mastered'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    updateMasteryUI();
}

function flipCard(cardInner) {
    cardInner.classList.toggle("rotate-y-180");
}

function toggleMastery(id) {
    if (masteredCards.has(id)) {
        masteredCards.delete(id);
    } else {
        masteredCards.add(id);
    }
    localStorage.setItem("masteredCards", JSON.stringify([...masteredCards]));
    renderFlashcards();
}

function updateMasteryUI() {
    document.getElementById("flashcard-mastery-text").textContent = `${masteredCards.size} / ${flashcardsData.length} Mastered`;
}

// ================= CASE STUDY SCENARIO ANALYZER =================
const caseScenarios = [
    {
        title: "Scenario 1: GCash Money Transferred by Mistake",
        facts: "Alex intended to send ₱5,000 via GCash to his mother, but accidentally typed one wrong digit and sent it to Ben, a total stranger.",
        question: "Is Ben legally obligated to return the ₱5,000 to Alex?",
        options: [
            { text: "Yes, under Solutio Indebiti (Quasi-Contract).", correct: true, explain: "Correct! Art. 2154 states that if something is received when there is no right to demand it, and it was unduly delivered through mistake, the obligation to return it arises." },
            { text: "No, because Alex was negligent in typing the wrong number.", correct: false, explain: "Incorrect. Even if Alex made a mistake, Ben has no legal right or cause to retain the money." }
        ]
    },
    {
        title: "Scenario 2: Typhoon Destroys Promised Specific Car",
        facts: "Carlos contracted to sell his specific vintage car to David. Before delivery and without any delay or fault by Carlos, a super typhoon flooded the garage and destroyed the car.",
        question: "Is Carlos liable for monetary damages for failing to deliver?",
        options: [
            { text: "No, because the obligation is extinguished by Fortuitous Event (Art. 1262).", correct: true, explain: "Correct! The loss of a determinate or specific thing through a fortuitous event without debtor's fault extinguishes the obligation." },
            { text: "Yes, because seller always guarantees delivery under any circumstance.", correct: false, explain: "Incorrect. Fortuitous events exempt debtors from liability when the object is determinate and no prior default or negligence occurred." }
        ]
    }
];

function renderScenarios() {
    const container = document.getElementById("scenarios-container");
    container.innerHTML = "";

    caseScenarios.forEach((c) => {
        container.innerHTML += `
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 class="font-bold text-navy-900 dark:text-amber-400 text-base">${sanitizeHTML(c.title)}</h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300"><strong>Facts:</strong> ${sanitizeHTML(c.facts)}</p>
                <p class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"><strong>Legal Question:</strong> ${sanitizeHTML(c.question)}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    ${c.options.map((opt) => `
                        <button onclick="selectScenarioOption(this, ${opt.correct}, '${sanitizeHTML(opt.explain)}')" class="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm hover:border-amber-500 transition">
                            ${sanitizeHTML(opt.text)}
                        </button>
                    `).join('')}
                </div>
                <div class="scenario-feedback hidden p-3 rounded-xl text-xs mt-2"></div>
            </div>
        `;
    });
}

function selectScenarioOption(btn, isCorrect, explanation) {
    const feedbackBox = btn.parentElement.nextElementSibling;
    feedbackBox.classList.remove("hidden");
    if (isCorrect) {
        feedbackBox.className = "scenario-feedback p-3 rounded-xl text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
        feedbackBox.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> <strong>Correct Legal Reasoning!</strong> ${explanation}`;
    } else {
        feedbackBox.className = "scenario-feedback p-3 rounded-xl text-xs bg-red-100 text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
        feedbackBox.innerHTML = `<i class="fa-solid fa-circle-xmark text-red-600 mr-1"></i> <strong>Incorrect Legal Assessment.</strong> ${explanation}`;
    }
}

// ================= QUIZ ENGINE =================
const quizQuestions = [
    {
        question: "1. Under Art. 1156, what is the legal definition of an obligation?",
        options: ["A legal agreement between two business entities", "A juridical necessity to give, to do or not to do", "A moral duty enforced by societal pressure", "A voluntary promise without court sanction"],
        answer: 1,
        explanation: "Art. 1156 defines obligation as a juridical necessity to give, to do or not to do."
    },
    {
        question: "2. Which source of obligation arises from voluntary, lawful, and unilateral acts to prevent unjust enrichment?",
        options: ["Delict", "Quasi-Contract", "Quasi-Delict", "Contracts"],
        answer: 1,
        explanation: "Quasi-contracts arise from lawful, voluntary, and unilateral acts based on equity against unjust enrichment."
    },
    {
        question: "3. What type of obligation is demandable immediately without any condition or period?",
        options: ["Conditional Obligation", "Pure Obligation", "Joint Obligation", "Solidary Obligation"],
        answer: 1,
        explanation: "Pure obligations contain no condition or period and are demandable at once."
    },
    {
        question: "4. Which contract defect causes a contract to produce NO legal effect whatsoever from the start?",
        options: ["Rescissible Contract", "Voidable Contract", "Void or Inexistent Contract", "Unenforceable Contract"],
        answer: 2,
        explanation: "Void or inexistent contracts produce no legal effect and cannot be ratified."
    },
    {
        question: "5. What happens when the qualities of creditor and debtor are merged in the same person?",
        options: ["Novation", "Confusion or Merger", "Compensation", "Remission"],
        answer: 1,
        explanation: "Art. 1275 states that obligations are extinguished by confusion or merger of rights."
    },
    {
        question: "6. Which requisite of a contract refers to the meeting of minds upon the cause and object?",
        options: ["Consent", "Form", "Delivery", "Penal Clause"],
        answer: 0,
        explanation: "Consent is manifested by the meeting of the offer and the acceptance upon the object and cause."
    }
];

function renderQuiz() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    quizQuestions.forEach((q, qIndex) => {
        let optionsHTML = q.options.map((opt, oIndex) => `
            <label class="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition">
                <input type="radio" name="q${qIndex}" value="${oIndex}" onchange="updateQuizProgress()" class="text-amber-600 focus:ring-amber-500 h-4 w-4">
                <span class="text-xs sm:text-sm text-slate-700 dark:text-slate-200">${sanitizeHTML(opt)}</span>
            </label>
        `).join('');

        container.innerHTML += `
            <div class="space-y-3" id="q-block-${qIndex}">
                <p class="font-bold text-navy-900 dark:text-amber-400 text-xs sm:text-sm md:text-base">${sanitizeHTML(q.question)}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">${optionsHTML}</div>
                <div id="quiz-feedback-${qIndex}" class="hidden p-3 rounded-xl text-xs mt-2"></div>
            </div>
        `;
    });
}

function updateQuizProgress() {
    const total = quizQuestions.length;
    let answered = 0;
    quizQuestions.forEach((_, idx) => {
        if (document.querySelector(`input[name="q${idx}"]:checked`)) answered++;
    });
    const percent = (answered / total) * 100;
    document.getElementById("quiz-progress").style.width = `${percent}%`;
}

function submitQuiz() {
    let score = 0;

    quizQuestions.forEach((q, qIndex) => {
        const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
        const feedback = document.getElementById(`quiz-feedback-${qIndex}`);
        feedback.classList.remove("hidden");

        if (selected && parseInt(selected.value) === q.answer) {
            score++;
            feedback.className = "p-3 rounded-xl text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
            feedback.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> <strong>Correct!</strong> ${sanitizeHTML(q.explanation)}`;
        } else {
            feedback.className = "p-3 rounded-xl text-xs bg-red-100 text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
            feedback.innerHTML = `<i class="fa-solid fa-circle-xmark text-red-600 mr-1"></i> <strong>Incorrect.</strong> Correct answer: <em>${sanitizeHTML(q.options[q.answer])}</em>. ${sanitizeHTML(q.explanation)}`;
        }
    });

    document.getElementById("quiz-score-badge").textContent = `Score: ${score} / ${quizQuestions.length}`;
    document.getElementById("high-score-display").textContent = `${score} / ${quizQuestions.length}`;
    localStorage.setItem("quizHighScore", score);
}

function resetQuiz() {
    renderQuiz();
    document.getElementById("quiz-score-badge").textContent = `Score: 0`;
    document.getElementById("quiz-progress").style.width = `0%`;
}

// ================= GLOSSARY & SEARCH =================
const legalTerms = [
    { term: "Mora Solvendi", def: "Delay on the part of the debtor to perform his obligation." },
    { term: "Mora Accipiendi", def: "Delay on the part of the creditor to accept performance." },
    { term: "Compensation", def: "Mutual offsetting of debts between two persons who are creditors and debtors of each other." },
    { term: "Novation", def: "Extinction of an obligation by substituting it with a new valid obligation." },
    { term: "Solutio Indebiti", def: "Quasi-contractual obligation to return money or property delivered by mistake." },
    { term: "Negotiorum Gestio", def: "Quasi-contractual management of another's abandoned property without consent." },
    { term: "Rescissible Contract", def: "Valid contract that may be set aside due to economic lesion or damage." },
    { term: "Voidable Contract", def: "Valid contract until annulled due to incapacity or vitiated consent." }
];

function renderDictionary() {
    const list = document.getElementById("dictionary-list");
    list.innerHTML = legalTerms.map(item => `
        <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h4 class="font-bold text-navy-900 dark:text-amber-400 text-sm font-serif">${sanitizeHTML(item.term)}</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">${sanitizeHTML(item.def)}</p>
        </div>
    `).join('');
}

function handleGlobalSearch() {
    const query = document.getElementById("globalSearch").value.toLowerCase().trim();
    const modal = document.getElementById("searchResultsModal");
    const clearBtn = document.getElementById("clear-search-btn");

    if (!query) {
        modal.classList.add("hidden");
        clearBtn.classList.add("hidden");
        return;
    }

    clearBtn.classList.remove("hidden");
    modal.classList.remove("hidden");

    const matches = legalTerms.filter(t => t.term.toLowerCase().includes(query) || t.def.toLowerCase().includes(query));

    if (matches.length === 0) {
        modal.innerHTML = `<p class="text-xs text-slate-500 italic p-2 text-center">No matching legal terms found.</p>`;
    } else {
        modal.innerHTML = matches.map(m => `
            <div class="p-2 border-b border-slate-100 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700 rounded transition cursor-pointer" onclick="switchTab('dictionary-tab')">
                <p class="font-bold text-amber-700 dark:text-amber-400 text-xs">${sanitizeHTML(m.term)}</p>
                <p class="text-[11px] text-slate-600 dark:text-slate-300">${sanitizeHTML(m.def)}</p>
            </div>
        `).join('');
    }
}

function clearSearch() {
    document.getElementById("globalSearch").value = "";
    document.getElementById("searchResultsModal").classList.add("hidden");
    document.getElementById("clear-search-btn").classList.add("hidden");
}

// ================= INITIALIZATION =================
window.onload = function() {
    initTheme();
    loadStudentProfile();
    renderFlashcards();
    renderScenarios();
    renderQuiz();
    renderDictionary();

    const savedHighScore = localStorage.getItem("quizHighScore");
    if (savedHighScore !== null) {
        document.getElementById("high-score-display").textContent = `${savedHighScore} / ${quizQuestions.length}`;
    }
};