import pickle
import os
import difflib
import pandas as pd
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env")

API_KEY = os.getenv("TMDB_API_KEY")

print("API Key:", API_KEY)

# Load pickle files
print("Loading movies...")
movies = pickle.load(open("movies.pkl", "rb"))   # <-- use the UPDATED movies.pkl (has collection_id)
print("✓ Movies loaded")

print("Loading vectors...")
vectors = pickle.load(open("vectors.pkl", "rb"))
print("✓ Vectors loaded")

print("Loading model...")
model = pickle.load(open("model.pkl", "rb"))
print("✓ Model loaded")


# -------------------------------------------------
# Fetch Movie Poster
# -------------------------------------------------
def fetch_poster(movie_title):

    url = "https://api.themoviedb.org/3/search/movie"

    params = {
        "api_key": API_KEY,
        "query": movie_title
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "results" in data and data["results"]:
        poster_path = data["results"][0].get("poster_path")

        if poster_path:
            return {
                "poster": "https://image.tmdb.org/t/p/w500" + poster_path,
                "rating": data["results"][0].get("vote_average") or 0.0,
                "release_date": data["results"][0].get("release_date") or ""
            }

    return {
        "poster": "https://via.placeholder.com/500x750?text=No+Poster",
        "rating": 0.0,
        "release_date": ""
    }


# -------------------------------------------------
# Recommendation Function
# -------------------------------------------------
def recommend(movie, k=5):

    try:
        movie = movie.strip().lower()
        titles_lower = movies["title"].str.lower()

        # 1) Exact match
        matches = movies[titles_lower == movie]

        # 2) Partial match ("conjuring" -> "The Conjuring")
        if matches.empty:
            matches = movies[titles_lower.str.contains(movie, na=False, regex=False)]

        # 3) Fuzzy match for typos ("intersteller" -> "Interstellar")
        if matches.empty:
            close = difflib.get_close_matches(movie, titles_lower.tolist(), n=1, cutoff=0.6)
            if close:
                matches = movies[titles_lower == close[0]]

        if matches.empty:
            return None

        movie_index = matches.index[0]
        my_title = movies.iloc[movie_index]["title"]
        my_collection = movies.iloc[movie_index].get("collection_id")

        # Pull a wider pool of neighbors than we need, so we have room to
        # dedupe and still hit k results after filtering.
        n_candidates = min(30, vectors.shape[0])
        distances, indices = model.kneighbors(vectors[movie_index], n_neighbors=n_candidates)

        seen_titles = {my_title}
        collection_indices = []
        other_indices = []

        # Same-franchise titles first (e.g. sequels), regardless of how far
        # apart they land in the content vector space.
        if pd.notna(my_collection):
            same_collection = movies[
                (movies["collection_id"] == my_collection) & (movies.index != movie_index)
            ]
            for idx in same_collection.index:
                t = movies.iloc[idx]["title"]
                if t not in seen_titles:
                    collection_indices.append(idx)
                    seen_titles.add(t)

        # Fill remaining slots with regular content-based neighbors.
        for i in indices[0]:
            t = movies.iloc[i]["title"]
            if t not in seen_titles:
                other_indices.append(i)
                seen_titles.add(t)

        final_indices = (collection_indices + other_indices)[:k]

        recommendations = []
        for i in final_indices:
            title = movies.iloc[i]["title"]
            movie_info = fetch_poster(title)

            recommendations.append({
                "title": title,
                "poster": movie_info["poster"],
                "rating": movie_info["rating"],
                "release_date": movie_info["release_date"]
            })

        return recommendations

    except IndexError:
        return None