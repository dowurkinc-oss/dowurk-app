import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Award, Trophy, RefreshCw, Share2 } from 'lucide-react';
import SocialShare from '@/components/SocialShare';

const QUIZ_QUESTIONS = [
  {
    category: 'Business Planning',
    question: 'What is the first step in creating a business plan?',
    options: [
      'Writing the executive summary',
      'Conducting market research',
      'Calculating financial projections',
      'Designing your logo'
    ],
    correct: 1,
    explanation: 'Market research should come first - understanding your market, customers, and competition informs every other section of your business plan.'
  },
  {
    category: 'Finance',
    question: 'What does "cash flow" refer to in business?',
    options: [
      'Total revenue in a year',
      'Money moving in and out of your business',
      'Profit after expenses',
      'Investment capital'
    ],
    correct: 1,
    explanation: 'Cash flow is the movement of money in and out of your business. Positive cash flow means more money coming in than going out.'
  },
  {
    category: 'Legal',
    question: 'In Louisiana, what business structure provides personal liability protection?',
    options: [
      'Sole Proprietorship',
      'Partnership',
      'LLC (Limited Liability Company)',
      'DBA (Doing Business As)'
    ],
    correct: 2,
    explanation: 'An LLC separates your personal assets from business liabilities, protecting you if the business faces legal issues or debt.'
  },
  {
    category: 'Marketing',
    question: 'What is the most cost-effective marketing channel for small businesses?',
    options: [
      'TV commercials',
      'Social media',
      'Billboard advertising',
      'Radio spots'
    ],
    correct: 1,
    explanation: 'Social media marketing is cost-effective, measurable, and allows direct engagement with your target audience - perfect for small businesses with limited budgets.'
  },
  {
    category: 'Grants & Funding',
    question: 'What does MBE certification stand for?',
    options: [
      'Major Business Enterprise',
      'Minority Business Enterprise',
      'Modern Business Education',
      'Managed Business Entity'
    ],
    correct: 1,
    explanation: 'MBE (Minority Business Enterprise) certification helps minority-owned businesses access contracts, supplier diversity programs, and funding opportunities.'
  },
  {
    category: 'Louisiana Specific',
    question: 'Louisiana is divided into parishes instead of counties. How many parishes are there?',
    options: [
      '48',
      '55',
      '64',
      '72'
    ],
    correct: 2,
    explanation: 'Louisiana has 64 parishes, making it unique among U.S. states in using this designation rather than counties.'
  },
  {
    category: 'Non-Profit',
    question: 'What tax status allows donations to be tax-deductible?',
    options: [
      '501(c)(4)',
      '501(c)(3)',
      '501(c)(6)',
      '403(b)'
    ],
    correct: 1,
    explanation: '501(c)(3) status makes an organization a public charity, allowing donors to deduct contributions on their taxes.'
  },
  {
    category: 'Leadership',
    question: 'What is the most important quality for an entrepreneur?',
    options: [
      'Having lots of capital',
      'Technical expertise',
      'Resilience and adaptability',
      'Having a large network'
    ],
    correct: 2,
    explanation: 'While all these help, resilience and adaptability are crucial. The entrepreneurial journey has inevitable setbacks - your ability to adapt and persist determines success.'
  }
];

function TestYourKnowledge() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === QUIZ_QUESTIONS[currentQuestion].correct;
    setAnswers([...answers, isCorrect]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
    setAnswers([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    if (percentage >= 90) return { title: 'Expert Level!', message: 'You have exceptional business knowledge!', emoji: '🏆' };
    if (percentage >= 70) return { title: 'Great Job!', message: 'You have strong entrepreneurial knowledge!', emoji: '🌟' };
    if (percentage >= 50) return { title: 'Good Start!', message: 'You\'re on the right track - keep learning!', emoji: '📚' };
    return { title: 'Keep Growing!', message: 'Every entrepreneur starts somewhere. Use DowUrk resources to level up!', emoji: '🌱' };
  };

  if (quizComplete) {
    const result = getScoreMessage();
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-4 border-[#A4D65E]">
            <CardHeader className="bg-gradient-to-r from-[#A4D65E] to-[#006847] text-white text-center pb-8">
              <div className="text-6xl mb-4">{result.emoji}</div>
              <CardTitle className="text-4xl mb-4">{result.title}</CardTitle>
              <div className="text-6xl font-bold mb-2">{score}/{QUIZ_QUESTIONS.length}</div>
              <p className="text-xl opacity-90">{percentage}% Correct</p>
            </CardHeader>
            <CardContent className="pt-8 space-y-6 text-center">
              <p className="text-lg text-gray-700">{result.message}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={restartQuiz} size="lg" variant="outline" className="border-[#006847] text-[#006847]">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-[#A4D65E] to-[#006847]">
                  <a href="/resources" className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Learn More
                  </a>
                </Button>
              </div>
              
              <div className="pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Share your score:</p>
                <div className="flex justify-center">
                  <SocialShare 
                    url="https://dowurktoday.com/test-your-knowledge"
                    title={`I scored ${score}/${QUIZ_QUESTIONS.length} (${percentage}%) on The DowUrk® FramewUrk Business Knowledge Quiz!`}
                    description="Test your entrepreneurial knowledge with DowUrk's interactive quiz"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <Badge className="bg-[#A4D65E] text-black">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </Badge>
          <Badge variant="outline" className="border-[#006847] text-[#006847]">
            Score: {score}/{currentQuestion}
          </Badge>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card className="border-2 border-[#A4D65E]">
            <CardHeader className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10">
              <Badge className="w-fit mb-3 bg-[#006847] text-white">{question.category}</Badge>
              <CardTitle className="text-2xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showExplanation
                      ? index === question.correct
                        ? 'border-green-500 bg-green-50'
                        : index === selectedAnswer
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      : 'border-gray-300 hover:border-[#A4D65E] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showExplanation && index === question.correct && (
                      <Award className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </button>
              ))}

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
                >
                  <p className="text-sm text-blue-900">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </motion.div>
              )}

              {showExplanation && (
                <Button
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                  size="lg"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Hint */}
        {!showExplanation && (
          <p className="text-center text-sm text-gray-500">
            Select an answer to see if you're correct
          </p>
        )}
      </div>
    </div>
  );
}

export default TestYourKnowledge;
