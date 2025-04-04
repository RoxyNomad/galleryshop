import Document, { Html, Head, Main, NextScript } from 'next/document';

// Custom Document component to customize the structure of the HTML page
class MyDocument extends Document {
  render() {
    return (
      <Html lang="de"> {/* Set the language attribute to German */}
        <Head>
          {/* Define character encoding for the document */}
          <meta charSet="utf-8" />
          
          {/* Meta description for SEO purposes */}
          <meta name="description" content="galleryshop" />
          
          {/* Author meta tag */}
          <meta name="author" content="Roxana Zwicky" />
          
          {/* Ensure compatibility with Internet Explorer */}
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          
          {/* Favicon link - update the href with the actual path */}
          <link rel="icon" type="image/x-icon" href="" />
        </Head>
        <body style={{ margin: 0 }}> {/* Remove default margin from the body */}
          <Main /> {/* Main application content will be inserted here */}
          <NextScript /> {/* Next.js scripts for the application */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;