from flask import Flask, render_template, request, jsonify
from utilities import recommend, movies   # <-- import movies too

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/recommend", methods=["POST"])
def recommendation():
    movie = request.form["movie"]
    recommendations = recommend(movie)
    return render_template(
        "result.html",
        movie=movie,
        recommendations=recommendations
    )


@app.route("/suggest")
def suggest():
    q = request.args.get("q", "").lower()
    matches = movies[movies['title'].str.lower().str.contains(q, na=False)]['title']
    return jsonify(matches.drop_duplicates().head(8).tolist())


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)