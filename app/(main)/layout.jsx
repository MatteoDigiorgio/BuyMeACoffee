import React from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Buy Me A Coffee</title>
      </head>
      <body>
        {/* <Header /> */}
        {children}
      </body>
    </html>
  );
}
