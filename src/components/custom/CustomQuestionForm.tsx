import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Question } from '../../types/quiz';
import { PlusCircle, CheckCircle, Trash2, Eye, HelpCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface FormErrors {
  question?: string;
  category?: string;
  difficulty?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctOption?: string;
  explanation?: string;
}

export const CustomQuestionForm: React.FC = () => {
  const {
    categories,
    addCustomQuestion,
    customQuestions,
    deleteCustomQuestion,
    setScreen,
  } = useQuiz();

  const [question, setQuestion] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0].id);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Question validation
    if (!question.trim()) {
      newErrors.question = 'Question text cannot be empty.';
    } else if (question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters long.';
    }

    // 2. Options validation
    const optA = optionA.trim();
    const optB = optionB.trim();
    const optC = optionC.trim();
    const optD = optionD.trim();

    if (!optA) newErrors.optionA = 'Option A is required.';
    if (!optB) newErrors.optionB = 'Option B is required.';
    if (!optC) newErrors.optionC = 'Option C is required.';
    if (!optD) newErrors.optionD = 'Option D is required.';

    // Check for uniqueness
    if (optA && optB && optA.toLowerCase() === optB.toLowerCase()) {
      newErrors.optionB = 'Options must have distinct unique values.';
    }
    if (optC && (optC.toLowerCase() === optA.toLowerCase() || optC.toLowerCase() === optB.toLowerCase())) {
      newErrors.optionC = 'Options must have distinct unique values.';
    }
    if (optD && (optD.toLowerCase() === optA.toLowerCase() || optD.toLowerCase() === optB.toLowerCase() || optD.toLowerCase() === optC.toLowerCase())) {
      newErrors.optionD = 'Options must have distinct unique values.';
    }

    // 3. Correct option check
    if (!['A', 'B', 'C', 'D'].includes(correctOption)) {
      newErrors.correctOption = 'Please select which option is correct.';
    }

    // 4. Explanation check
    if (explanation.trim() && explanation.trim().length < 5) {
      newErrors.explanation = 'Explanation must be at least 5 characters if provided.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const optionsMap = {
      A: optionA.trim(),
      B: optionB.trim(),
      C: optionC.trim(),
      D: optionD.trim(),
    };

    const correctAnswer = optionsMap[correctOption];
    const incorrectAnswers = Object.entries(optionsMap)
      .filter(([key]) => key !== correctOption)
      .map(([, val]) => val);

    const categoryObj = categories.find(c => c.id === categoryId) || categories[0];

    const newQuestion: Question = {
      id: `custom_${Date.now()}`,
      category: categoryObj.name,
      categoryId: categoryObj.id,
      difficulty,
      question: question.trim(),
      correctAnswer,
      incorrectAnswers,
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      explanation: explanation.trim() || `The correct answer is ${correctAnswer}.`,
      isCustom: true,
    };

    addCustomQuestion(newQuestion);

    // Reset Form
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanation('');
    setErrors({});
    setSuccessMessage('Custom question saved successfully! It is now active in quizzes.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <div className="text-xs text-slate-400 font-mono">
          GP 4 Validated Form Screen
        </div>
      </div>

      {/* Title & Introduction */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-slate-800/80 border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Create Custom Quiz Question
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Build your own challenging question. It will be validated according to specification (GP 4) and saved persistently on device (GP 2).
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Validated Form Container */}
      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
        {/* Field 1: Question Text */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Question Statement <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={question}
            onChange={e => {
              setQuestion(e.target.value);
              if (errors.question) setErrors(prev => ({ ...prev, question: undefined }));
            }}
            placeholder="e.g. Which algorithm is used for shortest paths in graphs with non-negative edge weights?"
            className={`w-full p-3 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.question
                ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-900/40'
                : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {errors.question && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.question}
            </p>
          )}
        </div>

        {/* Field 2 & 3: Category & Difficulty Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Select Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Difficulty Tier <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${
                    difficulty === diff
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Field 4: 4 Multiple Choice Options (A, B, C, D) + Radio for Correct Choice */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Multiple Choice Options <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Select the radio button beside the correct choice
            </span>
          </div>

          {/* Option A */}
          <div>
            <div className="flex items-center gap-2">
              <label
                title="Mark A as correct answer"
                className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border text-xs font-bold transition-all ${
                  correctOption === 'A'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="correctOption"
                  value="A"
                  checked={correctOption === 'A'}
                  onChange={() => setCorrectOption('A')}
                  className="sr-only"
                />
                A
              </label>
              <input
                type="text"
                value={optionA}
                onChange={e => {
                  setOptionA(e.target.value);
                  if (errors.optionA) setErrors(prev => ({ ...prev, optionA: undefined }));
                }}
                placeholder="Option A text..."
                className={`flex-1 p-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                  errors.optionA ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.optionA && (
              <p className="mt-1 text-xs text-red-500 pl-10 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.optionA}
              </p>
            )}
          </div>

          {/* Option B */}
          <div>
            <div className="flex items-center gap-2">
              <label
                title="Mark B as correct answer"
                className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border text-xs font-bold transition-all ${
                  correctOption === 'B'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="correctOption"
                  value="B"
                  checked={correctOption === 'B'}
                  onChange={() => setCorrectOption('B')}
                  className="sr-only"
                />
                B
              </label>
              <input
                type="text"
                value={optionB}
                onChange={e => {
                  setOptionB(e.target.value);
                  if (errors.optionB) setErrors(prev => ({ ...prev, optionB: undefined }));
                }}
                placeholder="Option B text..."
                className={`flex-1 p-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                  errors.optionB ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.optionB && (
              <p className="mt-1 text-xs text-red-500 pl-10 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.optionB}
              </p>
            )}
          </div>

          {/* Option C */}
          <div>
            <div className="flex items-center gap-2">
              <label
                title="Mark C as correct answer"
                className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border text-xs font-bold transition-all ${
                  correctOption === 'C'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="correctOption"
                  value="C"
                  checked={correctOption === 'C'}
                  onChange={() => setCorrectOption('C')}
                  className="sr-only"
                />
                C
              </label>
              <input
                type="text"
                value={optionC}
                onChange={e => {
                  setOptionC(e.target.value);
                  if (errors.optionC) setErrors(prev => ({ ...prev, optionC: undefined }));
                }}
                placeholder="Option C text..."
                className={`flex-1 p-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                  errors.optionC ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.optionC && (
              <p className="mt-1 text-xs text-red-500 pl-10 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.optionC}
              </p>
            )}
          </div>

          {/* Option D */}
          <div>
            <div className="flex items-center gap-2">
              <label
                title="Mark D as correct answer"
                className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border text-xs font-bold transition-all ${
                  correctOption === 'D'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="correctOption"
                  value="D"
                  checked={correctOption === 'D'}
                  onChange={() => setCorrectOption('D')}
                  className="sr-only"
                />
                D
              </label>
              <input
                type="text"
                value={optionD}
                onChange={e => {
                  setOptionD(e.target.value);
                  if (errors.optionD) setErrors(prev => ({ ...prev, optionD: undefined }));
                }}
                placeholder="Option D text..."
                className={`flex-1 p-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                  errors.optionD ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.optionD && (
              <p className="mt-1 text-xs text-red-500 pl-10 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.optionD}
              </p>
            )}
          </div>
        </div>

        {/* Field 5: Explanation / Educational Insight */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Explanation / Learning Fact (Optional)
          </label>
          <textarea
            rows={2}
            value={explanation}
            onChange={e => {
              setExplanation(e.target.value);
              if (errors.explanation) setErrors(prev => ({ ...prev, explanation: undefined }));
            }}
            placeholder="Explain why the selected option is correct so students learn from it."
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {errors.explanation && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.explanation}
            </p>
          )}
        </div>

        {/* Action Buttons: Preview & Submit */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-indigo-500" />
            <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <button
            type="submit"
            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 active:scale-[0.99] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Save Question to Device Storage</span>
          </button>
        </div>
      </form>

      {/* Live Preview Card */}
      {showPreview && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <span>Live Question Card Preview</span>
            <span className="capitalize">{difficulty}</span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {question || 'Your question will appear here...'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(['A', 'B', 'C', 'D'] as const).map(letter => {
              const val =
                letter === 'A'
                  ? optionA
                  : letter === 'B'
                  ? optionB
                  : letter === 'C'
                  ? optionC
                  : optionD;
              const isCorrect = correctOption === letter;

              return (
                <div
                  key={letter}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="truncate">{val || `Option ${letter}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List of Previously Saved Custom Questions */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Your Custom Questions ({customQuestions.length})
          </h2>
          <span className="text-xs text-slate-400">
            Saved to LocalStorage / SharedPreferences
          </span>
        </div>

        {customQuestions.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            No custom questions created yet. Use the form above to add your first question!
          </div>
        ) : (
          <div className="space-y-2.5">
            {customQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {q.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{q.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Answer: {q.correctAnswer}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {idx + 1}. {q.question}
                  </p>
                </div>

                <button
                  onClick={() => deleteCustomQuestion(q.id)}
                  title="Delete Custom Question"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
