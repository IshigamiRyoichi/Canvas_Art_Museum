from flask import Flask, render_template

app = Flask(__name__)

@app.route("/museum",methods=["GET"])
def museaum():
    return render_template("museum.html")

if __name__ == "__main__":
    app.run(debug=True)