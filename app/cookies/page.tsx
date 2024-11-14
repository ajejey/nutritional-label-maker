export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <p className="mb-4">
            This Cookie Policy explains how NutritionLabelMaker uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
          <p className="mb-4">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p className="mb-4">
            Cookies set by the website owner (in this case, NutritionLabelMaker) are called "first party cookies". Cookies set by parties other than the website owner are called "third party cookies". Third party cookies enable third party features or functionality to be provided on or through the website (e.g. advertising, interactive content and analytics).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why do we use cookies?</h2>
          <p className="mb-4">We use first and third party cookies for several reasons.</p>
          <ul className="list-disc pl-8 mb-4">
            <li>Essential cookies: Necessary for the website to function properly</li>
            <li>Analytics cookies: Help us understand how visitors interact with our website</li>
            <li>Advertising cookies: Used to make advertising messages more relevant</li>
            <li>Performance cookies: Help us operate our site more efficiently</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies we use</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
            <p>These cookies are strictly necessary to provide you with services available through our website and to use some of its features.</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with our website. We use Google Analytics for this purpose.</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Advertising Cookies</h3>
            <p>These cookies are used to make advertising messages more relevant to you and your interests.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How can you control cookies?</h2>
          <p className="mb-4">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager.
          </p>
          <p className="mb-4">
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How often will we update this Cookie Policy?</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>
          <p className="mb-4">
            The date at the bottom of this Cookie Policy indicates when it was last updated.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">More information</h2>
          <p className="mb-4">
            If you have any questions about our use of cookies or other technologies, please email us at privacy@nutritionlabelmaker.com.
          </p>
        </section>

        <footer className="text-sm text-gray-500 mt-12">
          Last updated: {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  );
}
