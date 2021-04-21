import requests
import time
import datetime
import json
from pymongo import MongoClient
import datetime
#database connections
cluster= MongoClient("mongodb+srv://tanim:abbatanim1@clouddb.kzvmd.mongodb.net/abbatanim?retryWrites=true&w=majority",ssl=True, ssl_cert_reqs='CERT_NONE')
db= cluster["abbatanim"]
collections=db["testdata"]
#function to call fortnox REST endpoint for Products list
def send_request():

    try:
        r = requests.get(
            url="https://api.fortnox.se/3/articles?limit=5&filter=active",
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



def one_request(num):
    
    try:
        r = requests.get(
            url="https://api.fortnox.se/3/articles/{}".format(num),
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
        single_data=one_request(i['ArticleNumber'])
        single_data = json.loads(single_data)
        single_data= json.dumps(single_data, indent=2)
        single_data=single_data.replace(r"\u00e4", "ä").replace(r"\u00f6", "ö").replace(r"\u00e5", "å")
        x = json.loads(single_data)
        print("Article:", x["Article"]["ArticleNumber"])
        print("description:",x["Article"]["Description"])
        print("is being written on DB...")
        document={
            "Article":x["Article"]["ArticleNumber"],
            "productName":x["Article"]["Description"],
            "description":i['Description'],
            "netPrice":float(x["Article"]["SalesPrice"]),
            "price":float(x["Article"]["SalesPrice"]),
            "offer":0,
            "category":"600866d4ca85dd0017c3bfe1",
            "isAvailable":True,
            "qtyPerBox":int(x["Article"]["ManufacturerArticleNumber"]) if x["Article"]["ManufacturerArticleNumber"] else 0,
            "thumbnail":["https://firebasestorage.googleapis.com/v0/b/image-server-65bbd.appspot.com/o/restaurant%2Fimage_1611186419211.png?alt=media&token=c387814f-f9b2-4e2b-8afc-875164b43eb0"],
            "createdAt":datetime.datetime.utcnow()}
        values = { "$set": document }
        filt = { "Article": x["Article"]["ArticleNumber"] }
        collections.update_one(filt, values, True) 
        print("Done..")
        print(".................")
        time.sleep(2)
except:
    print("Something went wrong during writing in database")

finally:
    print("Data has been successfully written on remote DB")



  