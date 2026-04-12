import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

print("📥 Loading real historical flight data...")
# Read the Kaggle CSV. 
# (Note: Some of these datasets have 5 million rows. If your computer crashes, 
# add nrows=500000 to the read_csv function to load a smaller chunk!)
try:
    df = pd.read_csv('flights.csv', usecols=['SCHEDULED_DEPARTURE', 'WEATHER_DELAY', 'ARRIVAL_DELAY'])
except FileNotFoundError:
    print("❌ ERROR: Could not find 'flights.csv'. Please download it from Kaggle and place it in this folder.")
    exit()

print("🧹 Performing Data Cleaning & Feature Engineering...")

# 1. Handle Missing Values (Nulls usually mean the flight wasn't delayed)
df.fillna(0, inplace=True)

# 2. Feature Engineering: Convert military time (e.g., 1430) to just the Hour (14)
df['hour'] = (df['SCHEDULED_DEPARTURE'] // 100).astype(int)

# 3. Feature Engineering: Map real weather delays to our 'storm' and 'wind' inputs
# If the weather delay was greater than 15 mins, we classify it as an active storm
df['storm_active'] = (df['WEATHER_DELAY'] > 15).astype(int)

# We will synthetically estimate wind severity based on the length of the weather delay 
# (Since the DOT dataset doesn't explicitly track wind speed in km/h)
df['wind_speed'] = df['WEATHER_DELAY'] * 1.5 

# 4. Define the Target Variable (Is it delayed by more than 15 minutes?)
df['is_delayed'] = (df['ARRIVAL_DELAY'] > 15).astype(int)

# Select only the features our Node.js API sends
X = df[['hour', 'wind_speed', 'storm_active']]
y = df['is_delayed']

print(f"📊 Training on {len(df)} real flight records...")

# Split the data to test accuracy (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Random Forest
model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Test the model's accuracy on the 20% it hasn't seen
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"🎯 Model Accuracy on Real Data: {accuracy * 100:.2f}%")

# Save the trained AI model
joblib.dump(model, 'flight_delay_model.pkl')
print("✅ Enterprise Model trained and saved as 'flight_delay_model.pkl'")