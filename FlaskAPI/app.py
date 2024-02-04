from urllib import response
from flask import Flask, request
from flask_cors import CORS, cross_origin

import os
import json
import pickle
import numpy as np
from scipy import stats
import requests

app = Flask(__name__)

cors = CORS(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

model = pickle.load(open('Flask_API/models/model.pkl','rb'))
housing_model = pickle.load(open('Flask_API/models/housing/model.pkl','rb'))
usa_housing_model = pickle.load(open('Flask_API/models/usa_housing/usa_housing.pkl', 'rb'))

def convertListToDict(lst):
    res_dct={}
    for i in lst:
        name= i['name']
        res_dct[name]=i['web_pages'][0]
        # res_dct[name]=i
    return res_dct

def convert(o):
    if isinstance(o, np.generic):
        return o.item()
    raise TypeError


@app.route("/predict_chances_of_admission", methods=["GET", "POST"])
def predictchancesofadmission():
    try:
        if request.method == "POST":
            form_values = request.form.to_dict()
            column_names = ["G", "T", "U", "S", "L", "C", "R"]
            input_data = np.asarray([float(form_values[i].strip()) for i in column_names]).reshape(
                1, -1
            )
            prediction_data = model.predict(input_data)
            return json.dumps(prediction_data[0])
            
    except:
        return json.dumps({"error":"Please Enter Valid Data"}, default=convert)

@app.route("/predict_chances_of_housing", methods=["GET", "POST"])
def predictchancesofhousing():
    try:
        if request.method == "POST":
            form_values = request.form.to_dict()
            column_names = ["area", "bedrooms", "yrsold"]
            input_data = np.asarray([float(form_values[i].strip()) for i in column_names]).reshape(
                1, -1
            )
            prediction_data = usa_housing_model.predict(input_data)

            print(prediction_data)
            return json.dumps(prediction_data[0])
    except:
            return json.dumps({"error":"Please Enter Valid Data"}, default=convert)

@app.route("/searchUniversity", methods=["GET", "POST"])
def searchUniversity():
    try:
        if request.method == "POST":
            response = request.form.to_dict()
            name = response["name"].strip()
            country = response["country"].strip()
            result = {}
            api='http://universities.hipolabs.com/search?'
            # http://universities.hipolabs.com/search?name=middle&country=turkey
            # get_data(#request se name and country,api)

            if name != "" and country != "":
                api = api + 'name=' + name + '&country=' + country
            elif name != "" and country == "":
                api = api + 'name=' + name
            elif country != "" and name == "":
                api = api + '&country=' + country
                
            result = requests.get(api)
            result = result.json()
            result = convertListToDict(result)
            # for key in result:
            #     print(result[key])
            return json.dumps(result)
            
    except:
         return json.dumps({"error":"Please Enter Valid Data"}, default=convert)

if __name__ == "__main__":
    app.run(host='localhost', debug=True)
