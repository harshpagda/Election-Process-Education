import React, { useState, useEffect } from 'react';
import { faqService } from '../services';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        let data;
        if (searchQuery) {
          data = await faqService.searchFAQs(searchQuery, language);
        } else {
          data = await faqService.getFAQs(selectedCategory, language);
        }
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, [searchQuery, selectedCategory, language]);

  const categories = ['general', 'eligibility', 'registration', 'voting', 'voting-rights', 'candidates', 'results'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
            </select>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-4">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <details
                  key={faq._id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                >
                  <summary className="cursor-pointer font-semibold text-lg">{faq.question}</summary>
                  <div className="mt-4 pt-4 border-t text-gray-700">{faq.answer}</div>
                  <div className="mt-4 flex gap-2 text-sm">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        faqService.markHelpful(faq._id, true);
                      }}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                    >
                      ✓ Helpful
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        faqService.markHelpful(faq._id, false);
                      }}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                    >
                      ✗ Not Helpful
                    </button>
                  </div>
                </details>
              ))
            ) : (
              <div className="text-center py-12 text-gray-600">No FAQs found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
