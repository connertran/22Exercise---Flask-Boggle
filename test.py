from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle
from werkzeug.datastructures import Headers
import json

class FlaskTests(TestCase):

    def setUp(self):
        """initialize this before every test"""
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<h1>Welcome to the Boggle Game!!</h1>', html)
            self.assertIn('board', session)
            self.assertIn('<h2 class="current-score">Score:</h2>',html)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""
        with app.test_client() as client:
           #set the session before the request
            with client.session_transaction() as sess:
                sess['board'] = [["C", "B", "B", "B", "B"], 
                                 ["B", "A", "B", "B", "B"], 
                                 ["B", "B", "T", "B", "B"], 
                                 ["B", "B", "B", "B", "B"], 
                                 ["B", "B", "B", "B", "B"]]
        # we want the data to be in json format
        headers = Headers({'Content-Type': 'application/json'})
        data = {'word': 'cat'}
        response = client.post('/checkValidWord', headers=headers, data=json.dumps(data))
        
        result = response.get_json()
        self.assertEqual(result['result'], 'ok')
    def test_invalid_word(self):
        """Test if word is in dictionary"""
        with app.test_client() as client:
            #set the session before the request
            with client.session_transaction() as sess:
                sess['board']= [["C", "B", "B", "B", "B"], 
                                 ["B", "A", "B", "B", "B"], 
                                 ["B", "B", "T", "B", "B"], 
                                 ["B", "B", "B", "B", "B"], 
                                 ["B", "B", "B", "B", "B"]]
        # we want the data to be in json format
        headers = Headers({'Content-Type': 'application/json'})
        data = {'word': 'apple'}
        response = client.post('/checkValidWord', headers=headers, data=json.dumps(data))
        
        result = response.get_json()
        self.assertEqual(result['result'], 'not-on-board')
    
    def test_invalid_word2(self):
        """Test if word is on board but doesn't exist in dictionary"""
        with app.test_client() as client:
            #set the session before the request
            with client.session_transaction() as sess:
                sess['board']= [["C", "B", "B", "B", "B"], 
                                 ["B", "A", "B", "B", "B"], 
                                 ["B", "B", "T", "B", "B"], 
                                 ["B", "B", "B", "B", "B"], 
                                 ["B", "B", "B", "B", "B"]]
        # we want the data to be in json format
        headers = Headers({'Content-Type': 'application/json'})
        data = {'word': 'bbbb'}
        response = client.post('/checkValidWord', headers=headers, data=json.dumps(data))
        
        result = response.get_json()
        self.assertEqual(result['result'], 'not-word')