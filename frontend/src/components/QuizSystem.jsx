import React, { useState, useEffect, useCallback } from 'react';

const questionsData = {
    "Mock Interviews": [
        { id: 1, q: "Tell me about yourself.", options: ["Talk about personal hobbies", "Focus on career journey and achievements", "Explain family background", "Just list your technical skills"], correct: 1 },
        { id: 2, q: "What is your greatest weakness?", options: ["I have no weaknesses", "I am a perfectionist", "A real minor flaw with improvement steps", "I don't know"], correct: 2 },
        { id: 3, q: "Why should we hire you?", options: ["Because I need a job", "Because I am the best", "Focus on how your skills solve company problems", "Because I live nearby"], correct: 2 },
        { id: 4, q: "Where do you see yourself in 5 years?", options: ["In your (interviewer's) position", "Growing with the company in a senior role", "Starting my own company", "Traveling the world"], correct: 1 },
        { id: 5, q: "How do you handle conflict at work?", options: ["I avoid it", "I complain to HR immediately", "Open communication and finding shared goals", "I argue until I win"], correct: 2 },
        { id: 6, q: "Describe a challenge you faced and how you overcame it.", options: ["The STAR method (Situation, Task, Action, Result)", "Just say it was hard", "Blame someone else", "Ignore the result"], correct: 0 },
        { id: 7, q: "Why do you want to work here?", options: ["Good salary", "Brand name", "Alignment with company values and mission", "No other options"], correct: 2 },
        { id: 8, q: "What is your leadership style?", options: ["Authoritarian", "Lead by example and empowerment", "Laissez-faire", "I don't like leading"], correct: 1 },
        { id: 9, q: "How do you handle tight deadlines?", options: ["Panic", "Prioritization and time management", "Ask for extension immediately", "Work slowly to ensure quality"], correct: 1 },
        { id: 10, q: "Tell me about a time you failed.", options: ["I never fail", "Something someone else did", "Accountability and lessons learned", "A small mistake I ignored"], correct: 2 }
    ],
    "Aptitude & Reasoning": [
        { id: 11, q: "If a train travels 120 km in 2 hours, what is its speed?", options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"], correct: 2 },
        { id: 12, q: "Which number comes next in the sequence: 2, 4, 8, 16, ...?", options: ["24", "32", "20", "48"], correct: 1 },
        { id: 13, q: "A is the father of B, but B is not the son of A. What is B to A?", options: ["Daughter", "Grandson", "Nephew", "Cousin"], correct: 0 },
        { id: 14, q: "If CAT is coded as 3120, how is DOG coded?", options: ["4157", "4151", "5157", "4147"], correct: 0 },
        { id: 15, q: "Find the odd one out.", options: ["Square", "Triangle", "Circle", "Rectangle"], correct: 2 },
        { id: 16, q: "A man is 35 years old and his son is 7. In how many years will the father be twice as old as the son?", options: ["21", "28", "14", "10"], correct: 0 },
        { id: 17, q: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", options: ["100 minutes", "5 minutes", "20 minutes", "50 minutes"], correct: 1 },
        { id: 18, q: "Which word does not belong with the others?", options: ["Parsley", "Basil", "Dill", "Mayonnaise"], correct: 3 },
        { id: 19, q: "In a stable, there are men and horses. There are 22 heads and 72 feet. How many men are there?", options: ["8", "12", "10", "14"], correct: 0 },
        { id: 20, q: "What is 15% of 200?", options: ["25", "35", "30", "40"], correct: 2 }
    ]
};

const QuizSystem = ({ category, onClose }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds
    const [isFinished, setIsFinished] = useState(false);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        // Randomize and select 10 questions
        const allQuestions = questionsData[category] || [];
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
    }, [category]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswer = (optionIdx) => {
        setAnswers({ ...answers, [currentIdx]: optionIdx });
    };

    const handleSubmit = useCallback(() => {
        setIsFinished(true);
    }, []);

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) correct++;
        });
        const wrong = questions.length - correct;
        const percent = (correct / questions.length) * 100;
        let msg = "Needs Improvement";
        if (percent >= 80) msg = "Excellent!";
        else if (percent >= 50) msg = "Good Job!";

        return { correct, wrong, percent, msg };
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (questions.length === 0) return null;

    if (isFinished) {
        const stats = calculateScore();
        return (
            <div style={styles.fullscreenOverlay}>
                <div style={styles.resultsCard} className="animate-fade-in-up">
                    <h2 style={styles.resultsTitle}>{stats.msg}</h2>
                    <div style={styles.statsGrid}>
                        <div style={styles.statBox}>
                            <span style={styles.statLabel}>Total</span>
                            <span style={styles.statVal}>{questions.length}</span>
                        </div>
                        <div style={styles.statBox}>
                            <span style={styles.statLabel}>Correct</span>
                            <span style={{...styles.statVal, color: '#10b981'}}>{stats.correct}</span>
                        </div>
                        <div style={styles.statBox}>
                            <span style={styles.statLabel}>Wrong</span>
                            <span style={{...styles.statVal, color: '#ef4444'}}>{stats.wrong}</span>
                        </div>
                        <div style={styles.statBox}>
                            <span style={styles.statLabel}>Score</span>
                            <span style={styles.statVal}>{stats.percent}%</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%', justifyContent: 'center' }}>
                        <button onClick={() => setShowReview(!showReview)} style={styles.reviewBtn}>
                            {showReview ? 'Hide Review' : 'Review Answers'}
                        </button>
                        <button onClick={onClose} style={styles.finishBtn}>
                            Finish & Exit
                        </button>
                    </div>

                    {showReview && (
                        <div style={styles.reviewList}>
                            {questions.map((q, idx) => (
                                <div key={idx} style={styles.reviewItem}>
                                    <p style={{fontWeight: '700', marginBottom: '8px', color: '#fff'}}>{idx + 1}. {q.q}</p>
                                    <p style={{color: answers[idx] === q.correct ? '#10b981' : '#ef4444', fontSize: '0.9rem'}}>
                                        Your Answer: {q.options[answers[idx]] || 'None'}
                                    </p>
                                    {answers[idx] !== q.correct && (
                                        <p style={{color: '#10b981', fontSize: '0.9rem'}}>
                                            Correct Answer: {q.options[q.correct]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div style={styles.fullscreenOverlay}>
            <div style={styles.quizContainer} className="animate-fade-in-up">
                {/* Header */}
                <div style={styles.quizHeader}>
                    <div style={styles.timerBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatTime(timeLeft)}
                    </div>
                    <div style={styles.categoryBadge}>{category}</div>
                    <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                </div>

                {/* Progress Bar */}
                <div style={styles.progressContainer}>
                    <div style={{...styles.progressBar, width: `${progress}%`}}></div>
                </div>

                {/* Question Area */}
                <div style={styles.questionArea}>
                    <span style={styles.qCount}>Question {currentIdx + 1} of {questions.length}</span>
                    <h2 style={styles.questionText}>{currentQ.q}</h2>

                    <div style={styles.optionsGrid}>
                        {currentQ.options.map((opt, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleAnswer(i)}
                                style={{
                                    ...styles.optionCard,
                                    borderColor: answers[currentIdx] === i ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                    background: answers[currentIdx] === i ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.03)'
                                }}
                            >
                                <div style={{
                                    ...styles.radio,
                                    background: answers[currentIdx] === i ? '#8b5cf6' : 'transparent',
                                    borderColor: answers[currentIdx] === i ? '#8b5cf6' : '#94a3b8'
                                }}>
                                    {answers[currentIdx] === i && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <span style={{ color: answers[currentIdx] === i ? '#fff' : '#cbd5e1' }}>{opt}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={styles.quizFooter}>
                    <button 
                        disabled={currentIdx === 0} 
                        onClick={() => setCurrentIdx(currentIdx - 1)}
                        style={{...styles.navBtn, opacity: currentIdx === 0 ? 0.5 : 1}}
                    >
                        Previous
                    </button>
                    {currentIdx === questions.length - 1 ? (
                        <button onClick={handleSubmit} style={styles.submitBtn}>
                            Submit Test
                        </button>
                    ) : (
                        <button onClick={() => setCurrentIdx(currentIdx + 1)} style={styles.navBtn}>
                            Next
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: scaleIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const styles = {
    fullscreenOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0f1123',
        backgroundLinear: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f1123 100%)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    quizContainer: {
        width: '100%',
        maxWidth: '800px',
        background: 'rgba(30, 33, 58, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '30px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
    },
    quizHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
    },
    timerBox: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        padding: '8px 16px',
        borderRadius: '100px',
        fontWeight: '700',
        fontSize: '1.1rem'
    },
    categoryBadge: {
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#a78bfa',
        padding: '6px 16px',
        borderRadius: '100px',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        fontSize: '2rem',
        cursor: 'pointer',
        lineHeight: 1
    },
    progressContainer: {
        width: '100%',
        height: '6px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        marginBottom: '40px',
        overflow: 'hidden'
    },
    progressBar: {
        height: '100%',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        transition: 'width 0.3s ease'
    },
    questionArea: {
        flex: 1,
        marginBottom: '40px'
    },
    qCount: {
        fontSize: '0.9rem',
        color: '#8b5cf6',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        display: 'block',
        marginBottom: '10px'
    },
    questionText: {
        fontSize: '1.6rem',
        color: '#f8fafc',
        fontWeight: '800',
        lineHeight: '1.4',
        marginBottom: '30px'
    },
    optionsGrid: {
        display: 'grid',
        gap: '15px'
    },
    optionCard: {
        padding: '18px 24px',
        borderRadius: '15px',
        border: '1px solid',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s ease'
    },
    radio: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid',
        marginRight: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    quizFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    },
    navBtn: {
        padding: '12px 30px',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    submitBtn: {
        padding: '12px 35px',
        background: 'linear-gradient(135deg, #22c55e, #10b981)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
    },
    resultsCard: {
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(30, 33, 58, 0.6)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '35px',
        padding: '50px',
        textAlign: 'center'
    },
    resultsTitle: {
        fontSize: '2.5rem',
        fontWeight: '900',
        color: '#fff',
        marginBottom: '40px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px'
    },
    statBox: {
        background: 'rgba(255,255,255,0.03)',
        padding: '20px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    statLabel: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: '8px'
    },
    statVal: {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#fff'
    },
    reviewBtn: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#cbd5e1',
        padding: '12px 25px',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    finishBtn: {
        background: '#8b5cf6',
        color: '#fff',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '12px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
    },
    reviewList: {
        marginTop: '30px',
        textAlign: 'left',
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: '10px'
    },
    reviewItem: {
        background: 'rgba(0,0,0,0.2)',
        padding: '15px',
        borderRadius: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(255,255,255,0.03)'
    }
};

export default QuizSystem;
