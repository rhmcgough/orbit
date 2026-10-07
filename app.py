from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enables Cross-Origin Resource Sharing

# Mock data to simulate the database temporarily
locations = [
    {"id": 1, "name": "Downtown Makerspace", "hobby": "3D Printing", "city": "Fullerton"},
    {"id": 2, "name": "Central Park Chess Tables", "hobby": "Chess", "city": "Fullerton"}
]

@app.route('/api/locations', methods=['GET'])
def get_locations():
    return jsonify(locations)

@app.route('/api/locations', methods=['POST'])
def add_location():
    new_location = request.get_json()
    # Simple ID generation for mock data
    new_location['id'] = len(locations) + 1
    locations.append(new_location)
    return jsonify(new_location), 201

if __name__ == '__main__':
    # Runs the server on port 5000 by default
    app.run(debug=True)
