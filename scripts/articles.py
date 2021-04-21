import requests
import time
import datetime
import json
from pymongo import MongoClient
import datetime
<<<<<<< HEAD
#database connections
cluster= MongoClient("mongodb+srv://tanim:abbatanim1@clouddb.kzvmd.mongodb.net/abbatanim?retryWrites=true&w=majority",ssl=True, ssl_cert_reqs='CERT_NONE')
db= cluster["abbatanim"]
collections=db["testdata"]
#function to call fortnox REST end point for Products

def send_request():

    try:
        r = requests.get(
            url="https://api.fortnox.se/3/articles?limit=500&filter=active",
            headers = {
                "Access-Token":"873fb692-e1ba-48f7-8b83-4926f0adad98",
                "Client-Secret":"BJlw5IuY1p",
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
        )
        
        return r.content
    except requests.exceptions.RequestException as e:
        print('HTTP Request failed')
#formating and unicode corrections
json_data=send_request() 
json_object = json.loads(json_data)
json_formatted_str = json.dumps(json_object, indent=2)
encodeddata=json_formatted_str.replace(r"\u00e4", "ä").replace(r"\u00f6", "ö").replace(r"\u00e5", "å")
y = json.loads(encodeddata)
#writing on DB
try:
    for i in y["Articles"]:
        filter = { "Article:": i['ArticleNumber'] }
        print("Article:", i['ArticleNumber'])
        print('Description: ',i['Description'])
        print("Being inserted to DB...")
        document={
            "Article":i['ArticleNumber'],
            "productName":i['Description'],
            "description":i['Description'],
            "netPrice":float(i['SalesPrice']),
            "price":float(i['SalesPrice']),
            "offer":0,
            "category":"600866d4ca85dd0017c3bfe1",
            "isAvailable":True,
            "qtyPerBox":10,
            "thumbnail":["https://firebasestorage.googleapis.com/v0/b/image-server-65bbd.appspot.com/o/restaurant%2Fimage_1611186419211.png?alt=media&token=c387814f-f9b2-4e2b-8afc-875164b43eb0"],
            "createdAt":datetime.datetime.utcnow()}
        values = { "$set": document }
        #collections.insert_one(document)
        collections.update_one(filter, values, True) 
        print("done.............")
        time.sleep(1)
        break
   
except:
    print("Something went wrong during writing in database")

finally:
    print("Data has been successfully written on remote DB")



  