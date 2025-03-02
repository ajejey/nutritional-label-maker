import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <strong>Name:</strong> Ajey Nagarkatti
            </div>
            
            <div>
              <strong>Email:</strong> 
              <a 
                href="mailto:ajejey@gmail.com" 
                className="text-blue-600 ml-2 hover:underline"
              >
                ajejey@gmail.com
              </a>
            </div>
            
            <div>
              <strong>LinkedIn:</strong> 
              <a 
                href="https://www.linkedin.com/in/ajey-nagarkatti-28273856/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 ml-2 hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">How Can We Help?</h2>
          <p>
            For any inquiries about our Nutrition Label Generator, 
            feel free to reach out via email. We aim to respond 
            within 2-3 business days.
          </p>
        </section>

       
      </div>
    </div>
  );
}
