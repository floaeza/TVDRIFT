#!/usr/bin/env python
# -*- coding: ascii -*-

from datetime import datetime
from datetime import timedelta
from bs4 import BeautifulSoup
import urllib.request
import json
import requests
import os

today = datetime.today()
today = today
listDays = [""]

for n in range(1):
    listDays[n] = today.strftime("%Y-%m-%d")
    today = today + timedelta(days=1)

####Numero de paquetes + 1#########
payload = {'Option': 'GetLastPackage'}
pak = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
pakk = json.loads(pak.content)
pakk = pakk[0]

paquetes = int(pakk['Pack'])+1

def start(day, pos):
    dataProgram = {}
    day = datetime.strptime(day, '%Y-%m-%d')
    print("Empezo")
    
    payload = {'Option': 'GetVersion'}
    Version = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
    Ver = json.loads(Version.content)
    Ver = Ver[0]

    payload = {'Option': 'GetIdentifier'}
    Identifier = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
    IDF = json.loads(Identifier.content)
    IDF = IDF[0]
    
    payload = {'Option': 'GetOffsetZone'}
    Zone = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
    OffSetZone = json.loads(Zone.content)
    OffSetZone = OffSetZone[0]

    payload = {'Option': 'GetGatoTime'}
    GTime = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
    GatoTime = json.loads(GTime.content)
    GatoTime = GatoTime[0]



    for ids in range(int(pakk['Pack']), paquetes):
        contadorCanal = 0
        data = {}
        data["C_Length"]=0

        #######################################################################################################
        ############################################ CANAL DIGITAL ############################################
        #######################################################################################################


        payload = {'Option': 'GetModulesBypackage', 'PackageID': ids}
        x = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
        channels = json.loads(x.content)
        for channel in channels:
            dataProgradm = {}
            dataProgradm['0'] = []
            dataProgradm['0'].append({
                "STTN": channel['STTN'],
                "DBKY": '',
                "TTLE": channel['NAME'],
                "DSCR": '',
                "DRTN": 24,
                "MNTS": 1440,
                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                "STRH": "00:00",
                "FNLH": "24:00",
                "TVRT": '',
                "STRS": '',
                "EPSD": ''
            })
            data[str(contadorCanal)] = []
            data[str(contadorCanal)].append({
                'PSCN': channel['PSCN'],
                'ADIO': channel['ADIO'],
                'PRGM': channel['PRGM'],
                'SRCE': channel['SRCE'],
                'QLTY': channel['QLTY'],
                'PORT': channel['PORT'],
                'CHNL': channel['CHNL'],
                'STTN': channel['STTN'],
                'NAME': channel['NAME'],
                'INDC': channel['INDC'],
                'LOGO': channel['LOGO'],
                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                'PROGRAMS': dataProgradm,
                'P_Length': 1
            })
            contadorCanal = contadorCanal + 1
            dataProgram.clear()


        #######################################################################################################
        ############################################# PROGAMACION #############################################
        #######################################################################################################
        payload = {'Option': 'GetChannelsInfoBypackage', 'PackageID': ids}
        x = requests.post('http://localhost/BBINCO/TV/Core/Controllers/PY.php', data=payload)
        channels = json.loads(x.content)
        #print(channels)
        
        a = 0
        for channel in channels:
            a = a + 1
            os.system ("clear") 
            print("Generando: ", 'epg_'+day.strftime("%Y%m%d") + '_' + str(ids) + '.json       ',"{:.2f}".format((a*100)/len(channels)), " %")
            print(channel['NAME'])
            print("Archivos restantes: ", (paquetes-ids)*(len(listDays)-pos))
            #print(channel)
            if 'GATO' in channel['STTN']:
                dataProgramGato = {}
                print('GATO TV')
                P_Length = 0
                try:
                    raw_html = urllib.request.urlopen('https://www.gatotv.com/canal/' + channel['NAME'] + day.strftime(
                        "%Y-%m-%d")).read().decode()
                    raw_html.encode('utf-8')
                    soup = BeautifulSoup(raw_html, 'html.parser')

                    prueba = soup.find('table', class_='tbl_EPG')

                    lista1 = prueba.find_all('tr', class_=['tbl_EPG_row', 'tbl_EPG_row_selected','tbl_EPG_rowAlternate'])
                    parttwo = False
                    lista = []
                    dif = GatoTime['Time']
                    if int(dif)!=0:
                        parttwo = True

                    horainicio = datetime.strptime("0"+dif+":00","%H:%M")
                    primero = True
                    for list in lista1:
                        try:
                            emicion = list.find_all('time')
                            inicio = datetime.strptime(emicion[0]['datetime'], "%H:%M")
                            fin = datetime.strptime(emicion[1]['datetime'], "%H:%M")
                            if (fin > horainicio) or primero == False:
                                if primero:
                                    inicio = horainicio
                                    primero = False

                                title1 = list.find('span')
                                title1 = title1.get_text()
                                tds = list.find_all('td')
                                if fin >= datetime.strptime("01:00","%H:%M") and lista1.index(list) == len(lista1)-1:
                                    fin = datetime.strptime("00:59","%H:%M")
                                    parttwo = False
                                if lista1.index(list) == len(lista1)-1 and parttwo == False:
                                    fin = datetime.strptime("23:59", "%H:%M")
                                inicio = inicio - timedelta(hours=int(dif))
                                fin = fin - timedelta(hours=int(dif))
                                dur = fin - inicio
                                if len(tds) == 3 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                    lista.append({
                                        'inicio': inicio.strftime("%H:%M"),
                                        'fin': fin.strftime("%H:%M"),
                                        'durh': float("{:.2f}".format((int(dur.seconds)/60)/60)),
                                        'durm': (int(dur.seconds)/60),
                                        'title': title1,
                                        'desc' : ''
                                    })
                                elif len(tds) == 4 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                    desc = tds[3].get_text().split('\n\n\n')
                                    lista.append({
                                        'inicio': inicio.strftime("%H:%M"),
                                        'fin' : fin.strftime("%H:%M"),
                                        'durh' : float("{:.2f}".format((int(dur.seconds) / 60) / 60)),
                                        'durm' : (int(dur.seconds) / 60),
                                        'title' : title1,
                                        'desc' : desc[2]
                                    })
                            else:
                                continue
                        except:
                            break
                    if int(dif)!=0 and parttwo == True:
                        tom = day + timedelta(days=1)
                        raw_html = urllib.request.urlopen('https://www.gatotv.com/canal/' + channel['NAME'] + tom.strftime(
                        "%Y-%m-%d")).read().decode()
                        raw_html.encode('utf-8')
                        soup = BeautifulSoup(raw_html, 'html.parser')

                        prueba = soup.find('table', class_='tbl_EPG')
                        brea = False
                        lista1 = prueba.find_all('tr', class_=['tbl_EPG_row', 'tbl_EPG_row_selected', 'tbl_EPG_rowAlternate'])
                        primero = True
                        for list in lista1:
                            if brea:
                                break
                            emicion = list.find_all('time')
                            inicio = datetime.strptime(emicion[0]['datetime'], "%H:%M")
                            fin = datetime.strptime(emicion[1]['datetime'], "%H:%M")
                            if inicio == (datetime.strptime(lista[-1]['inicio'], "%H:%M") + timedelta(hours=int(dif))) and fin == (datetime.strptime(lista[-1]['fin'], "%H:%M") + timedelta(hours=int(dif))):
                                continue
                            if primero:
                                inicio = datetime.strptime(lista[-1]['fin'], "%H:%M")+ timedelta(hours=int(dif))
                                primero = False
                            if fin > horainicio:
                                fin = horainicio
                                brea = True
                            title1 = list.find('span')
                            title1 = title1.get_text()
                            tds = list.find_all('td')
                            inicio = inicio - timedelta(hours=int(dif))
                            fin = fin - timedelta(hours=int(dif))
                            dur = fin - inicio
                            print("entre")
                            if len(tds) == 3 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                lista.append({
                                    'inicio': inicio.strftime("%H:%M"),
                                    'fin': fin.strftime("%H:%M"),
                                    'durh': float("{:.2f}".format((int(dur.seconds)/60)/60)),
                                    'durm': (int(dur.seconds)/60),
                                    'title': title1,
                                    'desc' : ''
                                })
                            elif len(tds) == 4 and (inicio.strftime("%H:%M") != fin.strftime("%H:%M")):
                                desc = tds[3].get_text().split('\n\n\n')
                                lista.append({
                                    'inicio': inicio.strftime("%H:%M"),
                                    'fin' : fin.strftime("%H:%M"),
                                    'durh' : float("{:.2f}".format((int(dur.seconds) / 60) / 60)),
                                    'durm' : (int(dur.seconds) / 60),
                                    'title' : title1,
                                    'desc' : desc[2]
                                })
                    for li in range(len(lista)):
                        dataProgramGato[str(li)] = []
                        dataProgramGato[str(li)].append({
                            "STTN": channel['STTN'],
                            "DBKY": '',
                            "TTLE": lista[li]['title'],
                            "DSCR": lista[li]['desc'],
                            "DRTN": lista[li]['durh'],
                            "MNTS": lista[li]['durm'],
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            "STRH": lista[li]['inicio'],
                            "FNLH": lista[li]['fin'],
                            "TVRT": '',
                            "STRS": '',
                            "EPSD": ''
                        })
                        P_Length += 1
                except:
                    print(channel['NAME'] + "   No encontrado (GATO)")

                if dataProgramGato != {}:
                    data[str(contadorCanal)] = []
                    data[str(contadorCanal)].append({
                        'PSCN': channel['PSCN'],
                        'ADIO': channel['ADIO'],
                        'PRGM': channel['PRGM'],
                        'SRCE': channel['SRCE'],
                        'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD' ,
                        'PORT': channel['PORT'],
                        'CHNL': channel['CHNL'],
                        'STTN': channel['STTN'],
                        'NAME': channel['NACH'],
                        'INDC': channel['INDC'],
                        'LOGO': channel['LOGO'],
                        'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                        'PROGRAMS': dataProgramGato,
                        'P_Length': P_Length
                    })
                else:
                    dataProgradm = {}
                    dataProgradm['0'] = []
                    dataProgradm['0'].append({
                        "STTN": channel['STTN'],
                        "DBKY": '',
                        "TTLE": channel['NACH'],
                        "DSCR": '',
                        "DRTN": 24,
                        "MNTS": 1440,
                        'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                        "STRH": "00:00",
                        "FNLH": "23:59",
                        "TVRT": '',
                        "STRS": '',
                        "EPSD": ''
                    })
                    data[str(contadorCanal)] = []
                    data[str(contadorCanal)].append({
                        'PSCN': channel['PSCN'],
                        'ADIO': channel['ADIO'],
                        'PRGM': channel['PRGM'],
                        'SRCE': channel['SRCE'],
                        'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                        'PORT': channel['PORT'],
                        'CHNL': channel['CHNL'],
                        'STTN': channel['STTN'],
                        'NAME': channel['NACH'],
                        'INDC': channel['INDC'],
                        'LOGO': channel['LOGO'],
                        'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                        'PROGRAMS': dataProgradm,
                        'P_Length': 1
                    })
                contadorCanal = contadorCanal + 1
            else:
                ##############  TV PASSPORT ##############
                if 'PASS' in channel['STTN']:
                    dataProgramPass = {}
                    P_Length = 0
                    dur=0
                    PASS = False
                    print('TV PASS')
                    daytwo = day - timedelta(days=1)
                    raw_html = urllib.request.urlopen(
                        'https://www.tvpassport.com/tv-listings/stations/' + channel['NAME'] + day.strftime(
                            "%Y-%m-%d")).read().decode()
                    raw_html.encode('utf-8')
                    soup = BeautifulSoup(raw_html, 'html.parser')

                    #################   UN DIA ATRAS    #################
                    raw_html2 = urllib.request.urlopen(
                        'https://www.tvpassport.com/tv-listings/stations/' + channel['NAME'] + daytwo.strftime(
                            "%Y-%m-%d")).read().decode()
                    raw_html2.encode('utf-8')
                    soup2 = BeautifulSoup(raw_html2, 'html.parser')
                    #################   UN DIA ATRAS    #################
                    try:
                        conta = 0
                        for i in range(1, 100):
                           

                            table = soup2.find(id="itemheader" + str(i))

                            if table == None:
                                break
                            ini = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S')
                            end = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S') + timedelta(minutes=int(table['data-duration']))
                            
                            inimin = (int(ini.hour)*60)+int(ini.minute)
                            endmin = (int(end.hour)*60)+int(end.minute)
                            
                            if end <= datetime.strptime(day.strftime("%Y-%m-%d")+' 00:00:00', '%Y-%m-%d %H:%M:%S'):
                                continue
                            if ini < datetime.strptime(day.strftime("%Y-%m-%d")+' 00:00:00', '%Y-%m-%d %H:%M:%S'):
                                ini = datetime.strptime(day.strftime("%Y-%m-%d")+' 00:00:00', '%Y-%m-%d %H:%M:%S')

                            inimin = (int(ini.hour)*60)+int(ini.minute)
                            endmin = (int(end.hour)*60)+int(end.minute)

                            if inimin <= endmin:
                                dur = endmin - inimin
                            else:
                                dur = endmin - inimin
                                dur = dur + 1440
                            
                            titles = ""
                            if table['data-showname'] == "Movie":
                                titles = table['data-episodetitle']
                            else:
                                titles = table['data-showname']

                            dataProgramPass[str(conta)] = []
                            dataProgramPass[str(conta)].append({
                                "STTN": channel['STTN'],
                                "DBKY": '',
                                "TTLE": titles,
                                "DSCR": table['data-description'],
                                "DRTN": float("{:.2f}".format(dur / 60)),
                                "MNTS": dur,
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                "STRH": ini.strftime("%H:%M"),
                                "FNLH": end.strftime("%H:%M"),
                                "TVRT": table['data-rating'],
                                "STRS": '',
                                "EPSD": table['data-episodetitle']
                            })
                            P_Length += 1
                            conta += 1
                        PASS = True
                    except:
                        print(channel['STTN'], '    No Encontrado (PASS1)')

                    if PASS:
                        try:
                            for i in range(1, 100):
                                
                                table = soup.find(id="itemheader" + str(i))
                                if table == None:
                                    break
                                ini = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S')
                                end = datetime.strptime(table['data-listdatetime'], '%Y-%m-%d %H:%M:%S') + timedelta(minutes=int(table['data-duration']))
                                if ini > datetime.strptime(day.strftime("%Y-%m-%d")+' 23:59:59', '%Y-%m-%d %H:%M:%S'):
                                    break
                                
                                inimin = (int(ini.hour)*60)+int(ini.minute)
                                endmin = (int(end.hour)*60)+int(end.minute)

                                if end > datetime.strptime(day.strftime("%Y-%m-%d")+' 23:59:59', '%Y-%m-%d %H:%M:%S'):
                                    end = datetime.strptime(day.strftime("%Y-%m-%d")+' 23:59:59', '%Y-%m-%d %H:%M:%S')
                                    endmin = (int(end.hour)*60)+int(end.minute)

                                if inimin <= endmin:
                                    dur = endmin - inimin
                                else:
                                    dur = endmin - inimin
                                    dur = dur + 1440


                                titles = ""
                                if table['data-showname'] == "Movie":
                                    titles = table['data-episodetitle']
                                else:
                                    titles = table['data-showname']

                                dataProgramPass[str(conta)] = []
                                dataProgramPass[str(conta)].append({
                                    "STTN": channel['STTN'],
                                    "DBKY": '',
                                    "TTLE": titles,
                                    "DSCR": table['data-description'],
                                    "DRTN": float("{:.2f}".format(dur / 60)),
                                    "MNTS": dur,
                                    'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                    "STRH": ini.strftime("%H:%M"),
                                    "FNLH": end.strftime("%H:%M"),
                                    "TVRT": table['data-rating'],
                                    "STRS": '',
                                    "EPSD": table['data-episodetitle']
                                })
                                P_Length += 1
                                conta += 1
                        except:
                            print(channel['STTN'], '    No Encontrado (PASS2)')

                    if dataProgramPass != {} and PASS:
                        data[str(contadorCanal)] = []
                        data[str(contadorCanal)].append({
                            'PSCN': channel['PSCN'],
                            'ADIO': channel['ADIO'],
                            'PRGM': channel['PRGM'],
                            'SRCE': channel['SRCE'],
                            'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                            'PORT': channel['PORT'],
                            'CHNL': channel['CHNL'],
                            'STTN': channel['STTN'],
                            'NAME': channel['NACH'],
                            'INDC': channel['INDC'],
                            'LOGO': channel['LOGO'],
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            'PROGRAMS': dataProgramPass,
                            'P_Length': P_Length
                        })
                    else:
                        if PASS:
                            dataProgramPass[str(conta)] = []
                            dataProgramPass[str(conta)].append({
                                "STTN": channel['STTN'],
                                "DBKY": '',
                                "TTLE": table['data-showname'],
                                "DSCR": table['data-description'],
                                "DRTN": float("{:.2f}".format(dur / 60)),
                                "MNTS": dur,
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                "STRH": dataProgramPass[str(conta-1):"STRH"],
                                "FNLH": '23:59',
                                "TVRT": table['data-rating'],
                                "STRS": '',
                                "EPSD": table['data-episodetitle']
                            })
                        else:
                            dataProgradm = {}
                            dataProgradm['0'] = []
                            dataProgradm['0'].append({
                                "STTN": channel['STTN'],
                                "DBKY": '',
                                "TTLE": channel['NACH'],
                                "DSCR": '',
                                "DRTN": 24,
                                "MNTS": 1440,
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                "STRH": "00:00",
                                "FNLH": "23:59",
                                "TVRT": '',
                                "STRS": '',
                                "EPSD": ''
                            })
                            data[str(contadorCanal)] = []
                            data[str(contadorCanal)].append({
                                'PSCN': channel['PSCN'],
                                'ADIO': channel['ADIO'],
                                'PRGM': channel['PRGM'],
                                'SRCE': channel['SRCE'],
                                'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                                'PORT': channel['PORT'],
                                'CHNL': channel['CHNL'],
                                'STTN': channel['STTN'],
                                'NAME': channel['NACH'],
                                'INDC': channel['INDC'],
                                'LOGO': channel['LOGO'],
                                'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                'PROGRAMS': dataProgradm,
                                'P_Length': 1
                            })
                    contadorCanal = contadorCanal + 1
                else:
                    if 'VIDEO' in channel['STTN'] or 'AUDIO' in channel['STTN'] or 'LOCAL' in channel[
                        'STTN'] or 'CONTENT' in channel['STTN']:
                        print('VIDEO/AUDIO/LOCAL/CONTENT')
                        dataProgradm = {}
                        dataProgradm['0'] = []
                        dataProgradm['0'].append({
                            "STTN": channel['STTN'],
                            "DBKY": '',
                            "TTLE": channel['NACH'],
                            "DSCR": '',
                            "DRTN": 24,
                            "MNTS": 1440,
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            "STRH": "00:00",
                            "FNLH": "24:00",
                            "TVRT": '',
                            "STRS": '',
                            "EPSD": ''
                        })
                        data[str(contadorCanal)] = []
                        data[str(contadorCanal)].append({
                            'PSCN': channel['PSCN'],
                            'ADIO': channel['ADIO'],
                            'PRGM': channel['PRGM'],
                            'SRCE': channel['SRCE'],
                            'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                            'PORT': channel['PORT'],
                            'CHNL': channel['CHNL'],
                            'STTN': channel['STTN'],
                            'NAME': channel['NACH'],
                            'INDC': channel['INDC'],
                            'LOGO': channel['LOGO'],
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            'PROGRAMS': dataProgradm,
                            'P_Length': 1
                        })
                        contadorCanal = contadorCanal + 1
                        dataProgram.clear()
                    else:
                        print('TRIBIUNE     ', channel['STTN'])
                        dataProgramTri = {}
                        contadorPrograma = 0
                        #deleteline(channel['STTN'])
                        statrec = open("/var/www/html/mnt/nv/epg/statrec.txt", "r", errors="ignore", encoding='ascii')
                        skedrec = open("/var/www/html/mnt/nv/epg/skedrec.txt", "r", errors="ignore", encoding='ascii')
                        progrec = open("/var/www/html/mnt/nv/epg/progrec.txt", "r", errors="ignore", encoding='ascii')
                        lineasSkedrec = skedrec.readlines()
                        lineasProgrec = progrec.readlines()
                        statrec.close()
                        skedrec.close()
                        progrec.close()
                        dataProgram = {}

                        if channel['STTN'] == '10244' or channel['STTN'] == '16619' or channel['STTN'] == '10242' or channel['STTN'] == '12508':
                            off = '-9'
                        else:
                            off = OffSetZone['OZN']
                        
                        for lineaSkedrec in lineasSkedrec:
                            listSkedrec = lineaSkedrec.split('|')

                            hinicio = datetime.strptime((listSkedrec[2] + " " + listSkedrec[3][0] + listSkedrec[3][1] + ":" + listSkedrec[3][2] + listSkedrec[3][3]), '%Y%m%d %H:%M')
                            duracion = datetime.strptime(listSkedrec[4][0] + listSkedrec[4][1]+':'+listSkedrec[4][2] + listSkedrec[4][3], '%H:%M')
                            
                            duracionh = duracion.strftime('%H')
                            duracionm = duracion.strftime('%M')
                            
                            hfin = hinicio + timedelta(hours=int(duracionh), minutes=int(duracionm))
                            hfin = hfin + timedelta(hours=int(OffSetZone['OZN']))
                            hinicio = hinicio + timedelta(hours=int(OffSetZone['OZN']))
                            ahora = datetime.strptime((day.strftime("%Y%m%d") + " 00:00"), '%Y%m%d %H:%M')
                            
                            duration = (int(duracionh) * 60) + int(duracionm)
                            durationh = duration/60
                            
                            if listSkedrec[0] == channel['STTN'] \
                                    and hinicio < (ahora + timedelta(hours=23, minutes=59)) \
                                    and (hfin > ahora):
                                if hinicio < ahora:
                                    hinicio = ahora
                                if hfin > (ahora + timedelta(hours=23, minutes=59)):
                                    hfin = ahora + timedelta(hours=23, minutes=59)

                                inimin = (int(hinicio.hour) * 60) + int(hinicio.minute)
                                finmin = (int(hfin.hour) * 60) + int(hfin.minute)

                                duration = finmin - inimin
                                durationh = duration/60

                                for linea2 in lineasProgrec:
                                    listProgrec = linea2.split('|')
                                    if listProgrec[0] == listSkedrec[1]:
                                        
                                        dataProgramTri[str(contadorPrograma)] = []
                                        dataProgramTri[str(contadorPrograma)].append({
                                            "STTN": channel['STTN'],
                                            "DBKY": listProgrec[0],
                                            "TTLE": listProgrec[1],
                                            "DSCR": listProgrec[159],
                                            "DRTN": float("{:.2f}".format(durationh)),
                                            "MNTS": duration,
                                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                                            "STRH": hinicio.strftime("%H:%M"),
                                            "FNLH": hfin.strftime("%H:%M"),
                                            "TVRT": '',
                                            "STRS": listProgrec[145],
                                            "EPSD": listProgrec[156]
                                        })

                                        contadorPrograma += 1
                                        break

                        data[str(contadorCanal)] = []
                        data[str(contadorCanal)].append({
                            'PSCN': channel['PSCN'],
                            'ADIO': channel['ADIO'],
                            'PRGM': channel['PRGM'],
                            'SRCE': channel['SRCE'],
                            'QLTY': 'HD' if (channel['QLTY']=='1') else 'SD',
                            'PORT': channel['PORT'],
                            'CHNL': channel['CHNL'],
                            'STTN': channel['STTN'],
                            'NAME': channel['NACH'],
                            'INDC': channel['INDC'],
                            'LOGO': channel['LOGO'],
                            'DATE' if Ver['VER'] == '2.0.7' else 'DTNU': day.strftime("%Y%m%d"),
                            'PROGRAMS': dataProgramTri,
                            'P_Length' : contadorPrograma
                        })
                        contadorCanal = contadorCanal + 1

        data["C_Length"] = contadorCanal
        with open('/var/www/html/BBINCO/TV/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(ids) + '.json', 'w', encoding='ascii') as file:
            json.dump(data, file, indent=4)

        with open('/var/www/html/BBINCO/TV/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(ids) + '.json', 'r') as file:
            filedata = file.read()

        filedata = filedata.replace('[', '').replace(']', '')
        with open('/var/www/html/BBINCO/TV/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(ids) + '.json', 'w') as file:
            file.write(filedata)
            print('/var/www/html/BBINCO/TV/Core/Controllers/Epg/'+IDF['IDF']+'/epg_'+day.strftime("%Y%m%d") + '_' + str(ids) + '.json ', 'CREADO')

        data.clear()

def deleteline(slinea):
    with open("/var/www/html/mnt/nv/epg/skedrec.txt", "r", encoding='ascii') as f:
        lines = f.readlines()
    f.close()
    with open("/var/www/html/mnt/nv/epg/skedrec_copia.txt", "w", encoding='ascii') as f:
        for line in lines:
            borrar = line.split('|')
            if borrar[0] == slinea:
                f.write(line)
    f.close()



for pos in range(len(listDays)):
    start(listDays[pos], pos)
    info = {'Option': 'UpdateParameter', 'PackageId': -1}
    req = requests.post('http://localhost/BBINCO/TV/Core/Controllers/Packages.php', data=info)

# os.system ("python3 /var/www/html/BBINCO/TV/Core/Controllers/main.py")

