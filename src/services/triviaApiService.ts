import { Difficulty, Question } from '../types/quiz';
import { INITIAL_QUESTIONS } from '../data/mockQuestions';
import { storageService } from './storageService';

interface OpenTdbQuestion {
  category: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTdbResponse {
  response_code: number;
  results: OpenTdbQuestion[];
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  if (typeof document !== 'undefined') {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }
  // Fallback regex decode
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&eacute;/g, 'é')
    .replace(/&pi;/g, 'π');
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const triviaApiService = {
  /**
   * Fetches real quiz questions from Open Trivia Database API
   * With fallback to user-created custom questions & curated offline bank
   */
  async fetchQuestions(params: {
    categoryId: number;
    categoryName: string;
    difficulty: Difficulty;
    amount: number;
  }): Promise<{ questions: Question[]; source: 'api' | 'local_cache' | 'custom' }> {
    const { categoryId, categoryName, difficulty, amount } = params;

    // Check user's custom questions first if matching category
    const customQuestions = storageService.getCustomQuestions().filter(q => {
      const matchCat = q.categoryId === categoryId || q.category.toLowerCase() === categoryName.toLowerCase();
      const matchDiff = difficulty === 'any' || q.difficulty === difficulty;
      return matchCat && matchDiff;
    });

    let url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&type=multiple`;
    if (difficulty !== 'any') {
      url += `&difficulty=${difficulty}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for fast responsiveness

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`OpenTDB HTTP error: ${res.status}`);
      }

      const data: OpenTdbResponse = await res.json();

      // response_code 0 = Success
      if (data.response_code === 0 && data.results && data.results.length > 0) {
        const parsedQuestions: Question[] = data.results.map((raw, idx) => {
          const cleanQ = decodeHtmlEntities(raw.question);
          const cleanCorrect = decodeHtmlEntities(raw.correct_answer);
          const cleanIncorrect = raw.incorrect_answers.map(decodeHtmlEntities);
          const options = shuffleArray([cleanCorrect, ...cleanIncorrect]);

          return {
            id: `api_${categoryId}_${Date.now()}_${idx}`,
            category: decodeHtmlEntities(raw.category),
            categoryId,
            difficulty: raw.difficulty,
            question: cleanQ,
            correctAnswer: cleanCorrect,
            incorrectAnswers: cleanIncorrect,
            options,
            explanation: `The verified correct answer is ${cleanCorrect}.`,
          };
        });

        // Interleave custom questions if available
        if (customQuestions.length > 0) {
          const combined = [...customQuestions.slice(0, 2), ...parsedQuestions].slice(0, amount);
          return { questions: combined, source: 'api' };
        }

        return { questions: parsedQuestions, source: 'api' };
      }

      // If OpenTDB returned no results (e.g. response_code 1: No Results for this combo)
      // Fallback cleanly to curated offline bank
      return this.getFallbackQuestions(categoryId, categoryName, difficulty, amount, customQuestions);
    } catch (err) {
      console.warn('Open Trivia DB API unavailable or rate-limited. Serving offline bank.', err);
      return this.getFallbackQuestions(categoryId, categoryName, difficulty, amount, customQuestions);
    }
  },

  getFallbackQuestions(
    categoryId: number,
    categoryName: string,
    difficulty: Difficulty,
    amount: number,
    customQuestions: Question[] = []
  ): { questions: Question[]; source: 'local_cache' | 'custom' } {
    let pool = INITIAL_QUESTIONS.filter(q => q.categoryId === categoryId);

    // If category has few matches in initial bank, expand to general pool or custom
    if (pool.length === 0) {
      pool = INITIAL_QUESTIONS;
    }

    if (difficulty !== 'any') {
      const diffFiltered = pool.filter(q => q.difficulty === difficulty);
      if (diffFiltered.length > 0) {
        pool = diffFiltered;
      }
    }

    const allPool = shuffleArray([...customQuestions, ...pool]);
    const selected = allPool.slice(0, Math.min(amount, allPool.length));

    // If still less than requested amount, repeat with variation
    while (selected.length < amount && pool.length > 0) {
      const item = pool[selected.length % pool.length];
      selected.push({
        ...item,
        id: `${item.id}_rep_${selected.length}`,
      });
    }

    return {
      questions: selected,
      source: customQuestions.length > 0 ? 'custom' : 'local_cache',
    };
  },
};
