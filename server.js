import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const API_KEY = process.env.API_KEY;
console.log(API_KEY);

function fetchNews(url, res) {
    axios.get(url)
        .then(response => {
            if (response.data.totalResults > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Fetching Data Success",
                    data: response.data
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "No more results to show"
                });
            }
        })
        .catch(error => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to fetch data from API",
                error: error.message
            });
        });
}

app.get("/all-news", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 40;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});

// TOP HEADLINES 
app.options("/top-headlines", cors());
app.get("/top-headlines", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "business";  // Fixed the typo here

    let url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);  // Added the missing call to fetchNews
});

//Country specific
app.options("/country/:iso",cors());
app.get("/country/:iso", async (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    const country = req.params.iso;
  
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${process.env.API_KEY}&page=${page}&pageSize=${pageSize}`;
    fetchNews(url,res);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
