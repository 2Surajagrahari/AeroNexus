from flask import Flask, request, jsonify
import joblib
import datetime

app = Flask(__name__)

# Load the trained AI model into memory
model = joblib.load('flight_delay_model.pkl')

@app.route('/predict', methods=['GET'])
def predict_delay():
    try:
        # Get parameters from the Node.js server
        wind_speed = float(request.args.get('wind', 0))
        storm_active = int(request.args.get('storm', 0))
        
        # Get current hour (UTC)
        current_hour = datetime.datetime.utcnow().hour

        # Ask the AI to predict
        features = [[current_hour, wind_speed, storm_active]]
        
        # predict_proba returns [chance_of_on_time, chance_of_delay]
        delay_probability = model.predict_proba(features)[0][1] 

        return jsonify({
            "status": "success",
            "delay_probability_percent": round(delay_probability * 100, 2),
            "ai_assessment": "High Risk of Delay" if delay_probability > 0.5 else "On Time Expected"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Run on port 5000 so it doesn't conflict with Node.js on 3000
    app.run(port=5000, debug=True)