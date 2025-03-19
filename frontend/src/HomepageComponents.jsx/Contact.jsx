import React from 'react'


const Contact = () => {
    return (
      <section id="contact" className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-4 text-indigo-600">Contact Us</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Got questions or suggestions? Reach out to us!
          </p>
          <form className="max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              placeholder="Your message"
              rows="4"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            ></textarea>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    );
  };
  

export default Contact
