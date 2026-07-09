# 🎬 CineFlix

CineFlix is a movie recommendation web application that helps users discover movies similar to the ones they already enjoy. Built using **Python, Flask, and Machine Learning**, CineFlix uses a **content-based recommendation system** to suggest movies based on their metadata rather than popularity.

The recommendation engine analyzes movie information such as **genres, keywords, cast, directors, and overviews** to understand movie similarities. Users can search for a movie, and CineFlix provides a list of similar movies along with their posters, creating an interactive movie discovery experience.

---

## ✨ Features

- 🎥 Content-based movie recommendations
- 🔍 Search and discover similar movies
- 🧠 Machine learning based similarity matching
- 🖼️ Movie posters fetched using TMDB API
- ⚡ Fast recommendations using pre-trained models
- 🌐 Flask-based interactive web application
- 🎨 Clean and responsive user interface

---

## 🛠️ Tech Stack

### Programming & Backend
- Python
- Flask

### Machine Learning
- Scikit-learn
- TF-IDF Vectorization
- Nearest Neighbors Algorithm
- Cosine Distance Similarity

### Data Processing
- Pandas
- NumPy

### Frontend
- HTML
- CSS
- JavaScript

### API
- TMDB API

---

## 🧠 Recommendation System Workflow

1. Movie datasets containing metadata, credits, and keywords are merged.
2. Unnecessary columns are removed and missing values are handled.
3. Important movie features are extracted:
   - Movie overview
   - Genres
   - Keywords
   - Cast
   - Director
4. These features are combined into a single **tags** representation.
5. Text data is transformed into numerical vectors using **TF-IDF Vectorization**.
6. A **Nearest Neighbors model with cosine distance** is trained to find similar movies.
7. The trained model is saved and used by the Flask application for real-time recommendations.

---

## 📂 Model Files

The trained recommendation system uses precomputed files:

```
movies.pkl      → Movie information
vectors.pkl     → TF-IDF feature vectors
model.pkl       → Trained Nearest Neighbors model
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/CineFlix.git
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Add TMDB API Key

Create a `.env` file:

```env
TMDB_API_KEY=your_api_key
```

### Run the application

```bash
python App.py
```

Open your browser:

```
http://127.0.0.1:5000
```

---

## 📸 Screenshots

Add screenshots of:

- Home page
- Movie search
- Recommendation results

---

## 🔮 Future Improvements

- User login and personalized recommendations
- Hybrid recommendation system combining content and collaborative filtering
- Movie trailers integration
- Online deployment
- Improved recommendation ranking

---

## 🙌 Learning Outcome

This project was developed to understand how recommendation systems work and how machine learning models can be integrated into real-world web applications using Flask.

It provided hands-on experience with data preprocessing, feature engineering, NLP techniques, model building, and deploying ML models into a web application.

---

## 👨‍💻 Author

**Vipul Kumar**  
B.Tech Chemical Engineering | NIT Warangal  
Interested in Machine Learning, AI, and Software Development
