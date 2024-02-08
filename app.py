from boggle import Boggle
from flask import Flask, render_template,request, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "ilovewatchinganime"

# creating an instance of the Boogle() class
toolbar = DebugToolbarExtension(app)
make_boggle_game = Boggle()

@app.route('/')
def show_homepage():
  """showing the board on page"""
  board = make_boggle_game.make_board()
  session['board'] = board
  return render_template("homepage.html", board = board)

@app.route('/checkValidWord', methods=['POST'])
def check_word_afer_submission():
  word = request.json['word']
  print('___________________word_______________')
  print(word)
  print(request.json)
  print('___________________word_______________')
  return "hi"
