import flask
from flask_cors import CORS
from flask import request
from datetime import date
from google.cloud import automl_v1beta1 as automl
import os
import json
import numpy as np
import random
from twilio.rest import Client

import firebase_admin
from firebase_admin import db
from firebase_admin import credentials

app = flask.Flask(__name__)
CORS(app)

cred = credentials.Certificate(
    "HAHA")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'HAHA/'
})
global calorieScores, foodName
calorieScores = 0
foodName = "Pizza"

account_sid = 'HAHA'
auth_token = 'HAHA'
client = Client(account_sid, auth_token)


USERS = db.reference('Users')
BUFFER = db.reference('Buffer')


@app.route("/get-username-by-userid", methods=['POST'])
def getUserNameByUserID():
    UserID = request.json['UserID'] 
    response = USERS.order_by_child('UserID').equal_to(UserID).get()
    for key, value in response.items():
        print(key)
        print(value)
    return(json.dumps(value['Name']))

@app.route("/get-total-calories-by-userid", methods=['POST'])
def getCalorieLimitByUserID():
    UserID = request.json['UserID'] 
    response = USERS.order_by_child('UserID').equal_to(UserID).get()
    for key, value in response.items():
        print(key)
        print(value)
    return(json.dumps(value['Calorie Limit']))

@app.route("/get-current-calories-by-userid", methods=['POST'])
def getCurrentCaloriesByUserID():
    UserID = request.json['UserID'] 
    response = USERS.order_by_child('UserID').equal_to(UserID).get()
    for key, value in response.items():
        print(key)
        print(value)
    return(json.dumps(value['Current Calories']))

@app.route("/get-food-consumed", methods=['POST'])
def getFoodConsumedByUserID():
    UserID = request.json['UserID'] 
    response = USERS.order_by_child('UserID').equal_to(UserID).get()
    for key, value in response.items():
        print(key)
        print(value)
    return(json.dumps(value['Food Consumed']))

def getCalorieLimitByUserIDInternal():
    UserID = request.json['UserID'] 
    response = USERS.order_by_child('UserID').equal_to(UserID).get()
    for key, value in response.items():
        print(key)
        print(value)
    return(value['Calorie Limit'])

@app.route("/set-total-calories-by-userid", methods=['POST'])
def setCalorieLimitByUserID():
    global calorieScores, foodName
    UserID = request.json['UserID']
    totCal = request.json['Calorie Limit']
    response = USERS.order_by_child('UserID').equal_to(UserID).get()
    calRef = USERS.child(UserID[-1])
    calRef.update({
        'Calorie Limit':totCal
    })
    return(json.dumps(UserID))

@app.route("/update-calories-by-userid", methods=['POST'])
def setCurrentCaloriesByUserID():
    UserID = request.json['UserID']
    response = USERS.order_by_child('UserID').equal_to(UserID).get()
    calRef = USERS.child(UserID[-1])
    for key, value in response.items():
        print(key)
        print(value)
    calCur = value['Current Calories']
    foodConsumed = value['Food Consumed']
    diet = value['Diet']
    
    
    calCur += calorieScores
    foodConsumed.append(foodName)
    calRef.update({
        'Current Calories':calCur,
        'Food Consumed': foodConsumed
    })
    if foodConsumed in ['Pizza', 'Hamburger', 'French Fries', 'Donut', 'Fried Rice'] and diet == "Keto":
        message = client.messages \
                .create(
                     body="Hi there! We noticed that you mentioned that you are on a Keto diet but you seem to be eating heavy carbs. But, that's alright, that's what NutriScan is for, so you'll get the hang of it in no time! :D",
                     from_= '+12564483158',
                     to= value['Phone Number'])
        print(message.sid)

    if foodConsumed in ['Pizza', 'Hamburger', 'French Fries', 'Chicken Wings'] and diet == "Low-fat":
        message = client.messages \
                .create(
                     body="Hi there! We noticed that you mentioned that you are on a low-fat diet but you seem to be eating fatty food. But, that's alright, that's what NutriScan is for, so you'll get the hang of it in no time! :D",
                     from_= '+12564483158',
                     to= value['Phone Number'])
        print(message.sid)
    
    calMax = value['Calorie Limit']
    if calCur > calMax:
        message = client.messages \
                .create(
                     body="Hi there! We noticed that you have gone over set calorie intake. But, that's alright, that's what NutriScan is for, so you'll get the hang of it in no time! :D",
                     from_= '+12564483158',
                     to= value['Phone Number'])
        print(message.sid)

    return(json.dumps(calCur))
    
# @app.route("/update-buffer", methods=["POST", "GET"])
# def updateBuffer():
#     req = BUFFER.child("1")
#     req.update({
#         "CalorieVal":250,
#         "FoodItem":"Donut"
#     })
#     return(json.dumps(req))

project_id = 'HAHA'
compute_region = 'us-central1'
model_id = 'HAHA'
# file_path = '/home/abdullahz/Desktop/food41/caesar_salad/70283.jpg'
score_threshold = '0.5'

CALORIES = {
    "Pizza":
    {
        "Energy": "277 kcal",
        "Protein": "10.97 g",
        "Total lipid (fat)": "11.61 g",
        "Carbohydrate, by difference" :  "29.68	g",
        "Fiber, total dietary": "0.6 g",
        "Sugars, total including NLEA":	"1.29 g",
        "Calcium, Ca": "258	mg",
        "Iron, Fe": "0.7 mg",
        "Sodium, Na": "594 mg",
        "Vitamin C, total ascorbic acid": "1.5 mg",
        "Vitamin A, IU": "323 IU",
        "Fatty acids, total saturated": "3.87 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "23	mg"
    },

    "Caesar Salad":
    {
        "Energy": "189 kcal",
        "Protein": "5.91 g",
        "Total lipid (fat)": "15.75 g",
        "Carbohydrate, by difference" :  "7.48	g",
        "Fiber, total dietary": "2 g",
        "Sugars, total including NLEA":	"1.57 g",
        "Calcium, Ca": "157	mg",
        "Iron, Fe": "1.06 mg",
        "Sodium, Na": "398 mg",
        "Vitamin C, total ascorbic acid": "16.5 mg",
        "Vitamin A, IU": "4134 IU",
        "Fatty acids, total saturated": "3.15 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "8 mg"
    },

    "Chicken Wings":
    {
        "Energy": "283 kcal",
        "Protein": "18.58 g",
        "Total lipid (fat)": "18.58 g",
        "Carbohydrate, by difference" :  "0	g",
        "Fiber, total dietary": "0 g",
        "Sugars, total including NLEA":	"0 g",
        "Calcium, Ca": "0 mg",
        "Iron, Fe": "0.96 mg",
        "Sodium, Na": "84 mg",
        "Vitamin C, total ascorbic acid": "0 mg",
        "Vitamin A, IU": "0 IU",
        "Fatty acids, total saturated": "5.31 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "84 mg"
    },
    "Donut":
    {
        "Energy": "324 kcal",
        "Protein": "5.63 g",
        "Total lipid (fat)": "11.27 g",
        "Carbohydrate, by difference" :  "53.52	g",
        "Fiber, total dietary": "1.4 g",
        "Sugars, total including NLEA":	"29.58 g",
        "Calcium, Ca": "85 mg",
        "Iron, Fe": "1.52 mg",
        "Sodium, Na": "408 mg",
        "Vitamin C, total ascorbic acid": "0 mg",
        "Vitamin A, IU": "704 IU",
        "Fatty acids, total saturated": "3.52 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "35 mg"
    },
    "Fried Rice":
    {
        "Energy": "170 kcal",
        "Protein": "7.69 g",
        "Total lipid (fat)": "3.21 g",
        "Carbohydrate, by difference" :  "27.24	g",
        "Fiber, total dietary": "1 g",
        "Sugars, total including NLEA":	"2.88 g",
        "Calcium, Ca": "13 mg",
        "Iron, Fe": "0.58 mg",
        "Sodium, Na": "381 mg",
        "Vitamin C, total ascorbic acid": "1.9 mg",
        "Vitamin A, IU": "240 IU",
        "Fatty acids, total saturated": "0.32 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "11 mg"
    },
    "Dumplings":
    {
        "Energy": "145 kcal",
        "Protein": "9.21 g",
        "Total lipid (fat)": "1.97 g",
        "Carbohydrate, by difference" :  "23.68	g",
        "Fiber, total dietary": "1.3 g",
        "Sugars, total including NLEA":	"1.32 g",
        "Calcium, Ca": "26 mg",
        "Iron, Fe": "1.89 mg",
        "Sodium, Na": "342 mg",
        "Vitamin C, total ascorbic acid": "6.3 mg",
        "Vitamin A, IU": "263 IU",
        "Fatty acids, total saturated": "0 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "13 mg"
    },
    "French Fries":
    {
        "Energy": "155 kcal",
        "Protein": "2.38 g",
        "Total lipid (fat)": "4.76 g",
        "Carbohydrate, by difference" :  "25 g",
        "Fiber, total dietary": "2.4 g",
        "Sugars, total including NLEA":	"1.19 g",
        "Calcium, Ca": "11 mg",
        "Iron, Fe": "0.43 mg",
        "Sodium, Na": "429 mg",
        "Vitamin C, total ascorbic acid": "333 mg",
        "Vitamin A, IU": "0  IU",
        "Fatty acids, total saturated": "2.38 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "5 mg"
    },
     "Hamburger":
    {
        "Energy": "186 kcal",
        "Protein": "9.3 g",
        "Total lipid (fat)": "2.33 g",
        "Carbohydrate, by difference" :  "44.19 g",
        "Fiber, total dietary": "9.3 g",
        "Sugars, total including NLEA":	"4.65 g",
        "Calcium, Ca": "93 mg",
        "Iron, Fe": "6.28 mg",
        "Sodium, Na": "465 mg",
        "Vitamin C, total ascorbic acid": "0 mg",
        "Vitamin A, IU": "0  IU",
        "Fatty acids, total saturated": "1.16 g",
        "Fatty acids, total trans": "0 g",
        "Cholesterol": "0 mg"
    }
}

@app.route("/get-predict", methods=['POST','GET'])
def predict():
    global calorieScores, foodName
    # TODO(developer): Uncomment and set the following variables
    automl_client = automl.AutoMlClient()

    # Get the full path of the model.
    model_full_id = automl_client.model_path(
        project_id, compute_region, model_id
    )

    r = request 
    # # # convert string of image data to uint8
    # nparr = np.fromstring(r.data, np.uint8)
    # # # decode image
    # img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
  
    # print("THE TYPE OF IMAGE IS ")
    # print(img)
    # Create client for prediction service.
    prediction_client = automl.PredictionServiceClient()

    # Read the image and assign to payload.
    # with open(r.data, "rb") as image_file:
    #     content = image_file.read()
    payload = {"image": {"image_bytes": r.data}}

    # params is additional domain-specific parameters.
    # score_threshold is used to filter the result
    # Initialize params
    params = {}
    if score_threshold:
        params = {"score_threshold": score_threshold}
    calorieScores = 0
    response = prediction_client.predict(model_full_id, payload, params)
    for result in response.payload:
        foodName = result.display_name
        classScore = result.classification.score
    if foodName == "caesar_salad":
        foodName = "Caesar Salad"
        calorieScores = 189
    elif foodName == "chicken_wings":
        foodName = "Chicken Wings"
        calorieScores = 283
    elif foodName == "donuts":
        foodName = "Donut"
        calorieScores = 324
    elif foodName == "fried_rice":
        foodName = "Ice Cream"
        calorieScores = 170
    elif foodName == "pizza":
        foodName = "Pizza"
        calorieScores = 277
    elif foodName == "dumplings":
        foodName = "Dumplings"
        calorieScores = 145
    elif foodName == "french_fries":
        foodName = "French Fries"
        calorieScores = 155
    elif foodName == "hamburger":
        foodName = "Hamburger"
        calorieScores = 186
    
    calories = CALORIES[foodName]
    print(calories)

    payload = {
        "foodName":foodName,
        "calories": calories
    }

    return(json.dumps(payload))
