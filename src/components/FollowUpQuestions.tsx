import React, { useState } from 'react';
import { FollowUpAnswer } from '../App';

interface FollowUpQuestionsProps {
  onSubmit: (answers: FollowUpAnswer[]) => void;
}

export const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({ onSubmit }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  // Predefined questions for the initial requirements gathering
  const questions = [
    "What specific user roles will need to access the website?",
    "Will you need a content management system (CMS) for updating content?",
    "Do you require any third-party integrations (payment gateways, CRM, etc.)?",
    "What are your SEO requirements and goals?",
    "Do you need multilingual support?"
  ];

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
    return Object.values(answers).every((value) => value.trim() !== '');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Initial Follow-up Questions</h2>
      <p className="text-gray-600 mb-6">
        Please answer these follow-up questions to help us understand your basic website requirements. After this, our AI will generate more specific questions based on your responses.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index}>
              <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
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
              Continue to AI Questions
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};