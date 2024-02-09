from flask import Flask, render_template,request, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

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
  """recieve the word from the client and check if the word is valid or not"""
  word = request.json['word']
  board = session["board"]
  response = make_boggle_game.check_valid_word(board, word)
 
  return jsonify({'result': response})

