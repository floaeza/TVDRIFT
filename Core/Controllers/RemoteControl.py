import threading
import firebase_admin
import time
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import json
from datetime import date
from datetime import datetime

# Use a service account
cred = credentials.Certificate('/var/www/html/BBINCO/TV/Views/Scripts/FireBase/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()
stbDic = []
users_ref = db.collection(u'PaquetesVPL')
docs = users_ref.stream()
payload = {'Option': 'GetIdentifier'}
Identifier = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
#Identifier = requests.post('http://bbinco.fortiddns.com:669/BBINCO/TV/Core/Controllers/PY.php', data=payload)
IDF = json.loads(Identifier.content)
IDF = IDF[0]

#identificador = IDF['IDF']
identificador = 'VPL'
print(identificador)
numPaquetes = 0

today = date.today()
fechajson = today.strftime('%Y%m%d')
jsons = []

for i in range(1,100):
    try:
        with open('/var/www/html/BBINCO/TV/Core/Controllers/Epg/'+identificador+'/epg_'+fechajson+'_'+str(i)+'.json') as file:
            jsons.append(json.load(file))
    except:
        numPaquetes = i-1
        break

for i in range(0,numPaquetes):
    js = jsons[i]
    channels = js['C_Length']
    paquetes = {}
    for j in range(0, channels):
        paquetes.update({str(j):js[str(j)]['CHNL']+"|"+js[str(j)]['INDC']+"|"+js[str(j)]['LOGO']})
        
    # Add a new doc in collection 'cities' with ID 'LA'
    db.collection(u'Paquetes'+identificador).document(u'Paquete'+str(i+1)).set(paquetes)

# Create an Event for notifying main thread.
delete_done = threading.Event()

# Create a callback on_snapshot function to capture changes
def on_snapshot(col_snapshot, changes, read_time):
    for change in changes:
        if change.type.name == 'ADDED':
            
            #print(f'Nueva orden agregada: {change.document.id}')
            stbs = db.collection(identificador).document(f'{change.document.id}')
            stbb = stbs.get()
            stb = stbb.to_dict()
            if stb['status'] == 'pending':
                #print('Ejecutando Orden 66')
                payload = {'Option': 'InsertControl', 'mac_address': stb['mac_address'], 'guest':stb['guest'], 'IDGuest':stb['IDGuest'], 'orden':stb['order'], 'status':'pendingServer'}
                var = requests.post('http://localhost/BBINCO/TV/Core/Controllers/Firebase.php', data=payload)
                #requests.post('http://bbinco.fortiddns.com:669/BBINCO/TV/Core/Controllers/Firebase.php', data=payload)
                #print(json.loads(var.content))
                update = db.collection(identificador).document(f'{change.document.id}')
                update.update({u'status': 'pendingServer'})
                print('Orden 66 Ejecutada')
            
            #stbb.reference.delete()
            

        elif change.type.name == 'MODIFIED':
            print("MODIFIED")
        elif change.type.name == 'REMOVED':
            print(f'Removed: {change.document.id}')
            delete_done.set()

col_query = db.collection(identificador)

# Watch the collection query
query_watch = col_query.on_snapshot(on_snapshot)

while True:
    now = datetime.now()
    #print(now.hour)
    if now.hour == 00 and now.minute == 30 and now.second == 00:
        delet = db.collection(identificador)
        delete = delet.where(u'status', u'==', u'executed')
        for dele in delete.get():
            dele.reference.delete()

    if now.minute == 20 and now.second == 00:
        delet = db.collection(identificador)
        delete = delet.where(u'status', u'==', u'executed')
        for dele in delete.get():
            dele.reference.delete()
    time.sleep(1)