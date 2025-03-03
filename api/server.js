// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fetch = require("node-fetch"); // node-fetch for server-side fetch API

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's address
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, "client/build")));

// Proxy endpoints
const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

// Helper function to process the response
async function handleResponse(response, res) {
  // Forward any cookies from the API response
  const cookies = response.headers.raw()["set-cookie"];
  if (cookies) {
    cookies.forEach((cookie) => {
      res.append("Set-Cookie", cookie);
    });
  }

  // Check content type to determine how to parse the response
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    // If JSON, parse and return as JSON
    const data = await response.json();
    return res.status(response.status).json(data);
  } else {
    // If not JSON, get text and return as text
    const text = await response.text();
    return res.status(response.status).send(text);
  }
}

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      credentials: "include",
    });

    return await handleResponse(response, res);
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      error: "An error occurred during login",
    });
  }
});

// Logout endpoint
app.post("/api/auth/logout", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies from client to the API
        Cookie: req.headers.cookie,
      },
      credentials: "include",
    });

    return await handleResponse(response, res);
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      error: "An error occurred during logout",
    });
  }
});

app.post("/api/dogs/search", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/search${req.query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie,
      },
      credentials: "include",
    });

    return await handleResponse(response, res);
  } catch (error) {
    console.error("Search error:", error.message);
    return res.status(500).json({
      error: "An error occurred during search",
    });
  }
});

app.post("/api/dogs", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie,
      },
      body: JSON.stringify(req.body),
      credentials: "include",
    });

    return await handleResponse(response, res);
  } catch (error) {
    console.error("Get Dogs error:", error.message);
    return res.status(500).json({
      error: "An error occurred when getting dogs",
    });
  }
});

app.post("/api/dogs/breeds", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie,
      },
      credentials: "include",
    });

    return await handleResponse(response, res);
  } catch (error) {
    console.error("Get Breeds error:", error.message);
    return res.status(500).json({
      error: "An error occurred when getting breeds",
    });
  }
});

app.post("/api/dogs/match", async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie,
      },
      body: JSON.stringify(req.body),
      credentials: "include",
    });

    return await handleResponse(response, res);
  } catch (error) {
    console.error("Get Match error:", error.message);
    return res.status(500).json({
      error: "An error occurred when getting match",
    });
  }
});

// Generic API endpoint proxy for other routes
app.all("/api/*", async (req, res) => {
  try {
    const endpoint = req.path.replace("/api", "");
    const method = req.method;

    // Construct URL with query parameters if present
    let url = `${API_BASE_URL}${endpoint}`;
    if (Object.keys(req.query).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(req.query)) {
        searchParams.append(key, value);
      }
      url += `?${searchParams.toString()}`;
    }

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie,
      },
      credentials: "include",
    };

    // Add body for non-GET requests
    if (method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);

    // Forward cookies
    const cookies = response.headers.raw()["set-cookie"];
    if (cookies) {
      cookies.forEach((cookie) => {
        res.append("Set-Cookie", cookie);
      });
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error(`API error (${req.path}):`, error.message);
    return res.status(500).json({
      error: "An error occurred while processing your request",
    });
  }
});

// For any other GET request, send React's index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
