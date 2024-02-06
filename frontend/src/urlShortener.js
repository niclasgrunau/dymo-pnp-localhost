// UrlShortener.js
import React, { useState } from "react";
import axios from "axios";
import QRCode from "qrcode.react";

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");

  const apiKey = "dklXZ5YlmsgocRzvqUJDewFiniUeV68sfCohvJkQKTzrqQUrwByzXJVzJYxC"; // Replace with your actual TinyURL API key

  const handleShortenUrl = async () => {
    try {
      const response = await axios.post(
        "https://api.tinyurl.com/create",
        {
          url: longUrl,
          domain: "tinyurl.com",
          // You can include additional parameters if needed, such as alias, tags, expires_at, description
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const result = response.data.data.tiny_url; // Extract the shortened URL from the response
      setShortenedUrl(result);
    } catch (error) {
      console.error("Error creating TinyURL:", error.response || error);
    }
  };

  const displayUrl = (url) => {
    // Check if the URL starts with "http://" or "https://"
    if (url.startsWith("http://")) {
      return url.slice(7); // Exclude the leading "http://"
    } else if (url.startsWith("https://")) {
      return url.slice(8); // Exclude the leading "https://"
    } else {
      return url; // No change if the URL doesn't start with either
    }
  };

  return (
    <div>
      <label>
        Enter your long URL:
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
      </label>
      <button onClick={handleShortenUrl}>Shorten URL</button>

      {shortenedUrl && (
        <div>
          <p>Shortened URL: {displayUrl(shortenedUrl)}</p>
          <QRCode value={shortenedUrl} />
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
