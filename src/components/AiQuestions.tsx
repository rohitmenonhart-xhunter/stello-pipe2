import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BrdAnswers, FollowUpAnswer } from '../App';
import { generateFollowUpQuestions } from '../services/openai';

interface AiQuestionsProps {
  brdAnswers: BrdAnswers;
  onSubmit: (answers: FollowUpAnswer[]) => void;
  isLoading: boolean;
}

export const AiQuestions: React.FC<AiQuestionsProps> = ({ 
  brdAnswers,
  onSubmit,
  isLoading 
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const generateQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const generatedQuestions = await generateFollowUpQuestions(brdAnswers);
      setQuestions(generatedQuestions);
      // Initialize answers object with empty strings
      setAnswers(
        generatedQuestions.reduce((acc, _, index) => {
          acc[index] = '';
          return acc;
        }, {} as { [key: number]: string })
      );
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedAnswers: FollowUpAnswer[] = questions.map((question, index) => ({
      question,
      answer: answers[index] || '',
    }));
    
    onSubmit(formattedAnswers);
  };

  const isFormValid = () => {
    return questions.length > 0 && Object.values(answers).every((value) => value.trim() !== '');
  };

  if (isLoading || isGeneratingQuestions) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">
          {isGeneratingQuestions ? 'Generating AI questions...' : 'Processing responses...'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isGeneratingQuestions 
            ? 'Our AI is analyzing your responses to create targeted questions.'
            : 'We\'re processing your answers to generate the IA diagram.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI-Generated Questions</h2>
      
      {questions.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Click the button below to generate personalized questions based on your previous responses.
          </p>
          <button
            onClick={generateQuestions}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate AI Questions
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-gray-600 mb-6">
            Please answer these AI-generated questions to help us better understand your requirements.
          </p>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                  {question}
                </label>
                <textarea
                  id={`question-${index}`}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={answers[index] || ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                  required
                />
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isFormValid()
                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
                disabled={!isFormValid()}
              >
                Generate IA Diagram
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}; 