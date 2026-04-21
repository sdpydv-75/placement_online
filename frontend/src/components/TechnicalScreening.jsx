import React, { useState, useEffect, useRef } from 'react';

const technicalData = {
    codingMCQ: [
        { q: "What is the output of: console.log(typeof NaN);", options: ["number", "NaN", "undefined", "object"], correct: 0, lang: "JavaScript" },
        { q: "What will this output in Python: print(2 ** 3 ** 2)", options: ["64", "512", "128", "256"], correct: 1, lang: "Python" },
        { q: "Choose the correct C++ syntax for a pointer:", options: ["int &p = x;", "int p = *x;", "int *p = &x;", "ptr int p = x;"], correct: 2, lang: "C++" },
        { q: "In Java, can we override a static method?", options: ["Yes", "No", "Depends on visibility", "Only in the same package"], correct: 1, lang: "Java" },
        { q: "What does 'use strict' do in JS?", options: ["Makes the code run faster", "Enforces stricter parsing and error handling", "Prevents all console logs", "None of above"], correct: 1, lang: "JavaScript" }
    ],
    theory: [
        { q: "Which of the following is NOT an OOPs concept?", options: ["Inheritance", "Compilation", "Encapsulation", "Polymorphism"], correct: 1, cat: "OOPs" },
        { q: "What is the primary key in DBMS?", options: ["A key that allows duplicates", "A unique identifier for a row", "A key used for encryption", "A key that can be null"], correct: 1, cat: "DBMS" },
        { q: "What is virtual memory in OS?", options: ["RAM extension using Disk", "A way to increase CPU speed", "Cloud storage", "None"], correct: 0, cat: "OS" },
        { q: "Which layer is responsible for routing in OSI model?", options: ["Data Link", "Network", "Transport", "Physical"], correct: 1, cat: "CN" }
    ],
    codingProblems: [
        { 
            id: 1, 
            title: "Two Sum", 
            description: "Write a function that takes an array of numbers and a target. Return indices of the two numbers such that they add up to target.",
            starterCode: "function twoSum(nums, target) {\n  // Your code here\n  \n}\n\n// Test Case\nconsole.log(twoSum([2, 7, 11, 15], 9));"
        }
    ]
};

const TechnicalScreening = ({ onClose }) => {
    const [view, setView] = useState('selection'); // selection, mcq, theory, editor, results
    const [activeSubCat, setActiveSubCat] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [editorCode, setEditorCode] = useState("");
    const [editorOutput, setEditorOutput] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    const runCode = () => {
        setEditorOutput("Running...");
        try {
            const originalLog = console.log;
            let logs = [];
            console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
            
            const fn = new Function(editorCode);
            fn();
            
            console.log = originalLog;
            setEditorOutput(logs.join('\n') || "Code executed successfully (no output).");
        } catch (err) {
            setEditorOutput(`Error: ${err.message}`);
        }
    };

    const startModule = (type) => {
        if (type === 'mcq') {
            setQuestions([...technicalData.codingMCQ].sort(() => 0.5 - Math.random()));
            setView('mcq');
        } else if (type === 'theory') {
            setQuestions([...technicalData.theory].sort(() => 0.5 - Math.random()));
            setView('theory');
        } else if (type === 'editor') {
            setEditorCode(technicalData.codingProblems[0].starterCode);
            setView('editor');
        }
        setCurrentIdx(0);
        setAnswers({});
    };

    const handleSubmit = () => {
        setIsFinished(true);
        setView('results');
    };

    const calculateResults = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) correct++;
        });
        const percent = (correct / questions.length) * 100;
        return { correct, total: questions.length, percent };
    };

    if (view === 'selection') {
        return (
            <div style={styles.overlay}>
                <div style={styles.selectionCard} className="animate-fade-in-up">
                    <div style={styles.header}>
                        <h2 style={styles.title}>Technical <span style={styles.gradientText}>Screening</span></h2>
                        <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                    </div>
                    <p style={styles.subtitle}>Choose a specialized round to test your engineering skills.</p>
                    
                    <div style={styles.grid}>
                        <div onClick={() => startModule('mcq')} style={styles.menuItem} className="tech-menu-item">
                            <div style={styles.menuIcon}>💻</div>
                            <h3 style={styles.menuTitle}>Coding MCQs</h3>
                            <p style={styles.menuDesc}>Output & syntax tests for Java, C++, Python, JS.</p>
                        </div>
                        <div onClick={() => startModule('theory')} style={styles.menuItem} className="tech-menu-item">
                            <div style={styles.menuIcon}>📚</div>
                            <h3 style={styles.menuTitle}>Core Theory</h3>
                            <p style={styles.menuDesc}>OOPs, DBMS, OS, Networks & Web Dev.</p>
                        </div>
                        <div onClick={() => startModule('editor')} style={styles.menuItem} className="tech-menu-item">
                            <div style={styles.menuIcon}>🚀</div>
                            <h3 style={styles.menuTitle}>Live Coding IDE</h3>
                            <p style={styles.menuDesc}>Solve DSA problems in our immersive editor.</p>
                        </div>
                    </div>
                </div>
                <style>{css}</style>
            </div>
        );
    }

    if (view === 'mcq' || view === 'theory') {
        const q = questions[currentIdx];
        if (!q) return null;
        return (
            <div style={styles.overlay}>
                <div style={styles.quizContainer} className="animate-fade-in-up">
                    <div style={styles.quizHeader}>
                        <div style={styles.quizBadge}>{q.lang || q.cat || 'Technical'}</div>
                        <span style={styles.progressText}>Question {currentIdx + 1} / {questions.length}</span>
                        <button onClick={() => setView('selection')} style={styles.closeBtn}>&times;</button>
                    </div>
                    <h3 style={styles.questionText}>{q.q}</h3>
                    <div style={styles.optionsList}>
                        {q.options.map((opt, i) => (
                            <button 
                                key={i} 
                                onClick={() => setAnswers({ ...answers, [currentIdx]: i })}
                                style={{
                                    ...styles.optionBtn,
                                    borderColor: answers[currentIdx] === i ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                    background: answers[currentIdx] === i ? 'rgba(139,92,246,0.1)' : 'transparent'
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <div style={styles.controls}>
                        <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} style={styles.navBtn}>Back</button>
                        {currentIdx === questions.length - 1 ? (
                            <button onClick={handleSubmit} style={styles.submitBtn}>Submit</button>
                        ) : (
                            <button onClick={() => setCurrentIdx(prev => prev + 1)} style={styles.navBtn}>Next</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'editor') {
        return (
            <div style={styles.overlay}>
                <div style={styles.ideContainer} className="animate-fade-in-up">
                    <div style={styles.ideHeader}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                            <div style={styles.ideLogo}>{'</>'}</div>
                            <h3 style={{color: '#fff', fontSize: '1.1rem'}}>Coding Arena</h3>
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button style={styles.langBtn}>JavaScript</button>
                            <button onClick={runCode} style={styles.runBtn}>Run Code</button>
                            <button onClick={() => setView('selection')} style={styles.ideClose}>&times;</button>
                        </div>
                    </div>
                    <div style={styles.ideBody}>
                        <div style={styles.problemPane}>
                            <h4 style={styles.paneLabel}>Problem Statement</h4>
                            <h2 style={{color: '#fff', marginBottom: '15px'}}>{technicalData.codingProblems[0].title}</h2>
                            <p style={{color: '#94a3b8', lineHeight: '1.6'}}>{technicalData.codingProblems[0].description}</p>
                        </div>
                        <div style={styles.editorPane}>
                            <textarea 
                                value={editorCode}
                                onChange={(e) => setEditorCode(e.target.value)}
                                style={styles.editorArea}
                                spellCheck="false"
                            />
                        </div>
                        <div style={styles.outputPane}>
                            <h4 style={styles.paneLabel}>Console Output</h4>
                            <pre style={styles.outputContent}>{editorOutput}</pre>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'results') {
        const stats = calculateResults();
        return (
            <div style={styles.overlay}>
                <div style={styles.resultsCard} className="animate-fade-in-up">
                    <h2 style={styles.title}>Session <span style={styles.gradientText}>Complete</span></h2>
                    <div style={styles.statsRow}>
                        <div style={styles.statItem}>
                            <span>Correct</span>
                            <h4 style={{color: '#10b981'}}>{stats.correct}</h4>
                        </div>
                        <div style={styles.statItem}>
                            <span>Accuracy</span>
                            <h4 style={{color: '#8b5cf6'}}>{stats.percent}%</h4>
                        </div>
                    </div>
                    <button onClick={() => setView('selection')} style={styles.finishBtn}>Go Back</button>
                </div>
            </div>
        );
    }
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: '#0a0b1e', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    },
    selectionCard: {
        width: '100%', maxWidth: '900px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.05)', borderRadius: '40px', padding: '60px', textAlign: 'center'
    },
    header: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '15px' },
    title: { fontSize: '2.5rem', fontWeight: '900', color: '#fff' },
    gradientText: { background: 'linear-gradient(90deg, #814bf6, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: '#94a3b8', fontSize: '1.1rem', marginBottom: '50px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' },
    menuItem: {
        background: 'rgba(255,255,255,0.03)', padding: '40px 30px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'left'
    },
    menuIcon: { fontSize: '2.5rem', marginBottom: '20px' },
    menuTitle: { color: '#fff', fontSize: '1.3rem', fontWeight: '800', marginBottom: '10px' },
    menuDesc: { color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' },
    closeBtn: { position: 'absolute', right: '-30px', top: '0', background: 'none', border: 'none', color: '#64748b', fontSize: '2.5rem', cursor: 'pointer' },
    quizContainer: { width: '100%', maxWidth: '700px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' },
    quizHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    quizBadge: { background: '#8b5cf6', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' },
    progressText: { color: '#64748b', fontWeight: '600' },
    questionText: { fontSize: '1.6rem', color: '#f8fafc', marginBottom: '30px', lineHeight: '1.4' },
    optionsList: { display: 'grid', gap: '15px', marginBottom: '40px' },
    optionBtn: {
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1',
        padding: '18px 25px', borderRadius: '15px', textAlign: 'left', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s'
    },
    controls: { display: 'flex', justifyContent: 'space-between' },
    navBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '12px 30px', borderRadius: '12px', cursor: 'pointer' },
    submitBtn: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', padding: '12px 35px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
    ideContainer: { width: '100%', height: '90vh', background: '#0a0b1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    ideHeader: { height: '60px', background: '#11132d', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' },
    ideLogo: { width: '32px', height: '32px', background: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '0.9rem' },
    langBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '6px 15px', borderRadius: '8px', fontSize: '0.85rem' },
    runBtn: { background: '#22c55e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 15px rgba(34,197,94,0.3)' },
    ideClose: { background: 'none', border: 'none', color: '#64748b', fontSize: '1.8rem', cursor: 'pointer' },
    ideBody: { flex: 1, display: 'grid', gridTemplateColumns: '350px 1fr 300px', background: '#0a0b1e' },
    problemPane: { padding: '25px', borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' },
    paneLabel: { fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', marginBottom: '15px' },
    editorPane: { background: '#0d0f28', padding: '10px 0' },
    editorArea: { width: '100%', height: '100%', background: 'transparent', border: 'none', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '1rem', padding: '20px', resize: 'none', outline: 'none', lineHeight: '1.6' },
    outputPane: { background: '#050614', padding: '25px', borderLeft: '1px solid rgba(255,255,255,0.05)' },
    outputContent: { color: '#94a3b8', fontSize: '0.9rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', marginTop: '10px' },
    resultsCard: { width: '100%', maxWidth: '500px', background: 'rgba(255,255,255,0.03)', borderRadius: '35px', padding: '50px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' },
    statsRow: { display: 'flex', gap: '20px', justifyContent: 'center', margin: '40px 0' },
    statItem: { background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', flex: 1, border: '1px solid rgba(255,255,255,0.05)' },
    finishBtn: { width: '100%', background: '#8b5cf6', color: '#fff', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: '700', cursor: 'pointer' }
};

const css = `
    .tech-menu-item:hover {
        transform: translateY(-10px);
        background: rgba(139, 92, 246, 0.05);
        border-color: rgba(139, 92, 246, 0.3) !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @media (max-width: 992px) {
        .ide-body { grid-template-columns: 1fr !important; }
        .editor-pane { height: 400px; border-top: 1px solid rgba(255,255,255,0.05); }
        .selection-card { padding: 40px 25px !important; }
    }
`;

export default TechnicalScreening;
