**[Demonstrationsfilm](https://www.youtube.com/watch?v=t_opI8Ejhm8&feature=youtu.be)**

**Vad min "web thing" gör?**

Jag har valt att skapa en övervakningskamera som triggas av en infraröd rörelsedetektor. När ett varmt föremål/kropp passerar inom en halvcirkel med 5 meter radie aktiveras sensorn som skickar en signal från OUT pinnen till GPIO 4 på min Raspberry PIs moderkort. Min WoT node modul motion.js lyssnar på på denna input mha ['pi-pir-sensor'](https://www.npmjs.com/package/pi-pir-sensor) och surveillanceController.js lyssnar på rörelse-kanalen från motion.js. Därefter använder kontrollern camera.js som implementerar ['pi-camera-connect'](https://www.npmjs.com/package/pi-camera-connect) och tar en stillbild som sparas till disk, uppdaterar properties i APIet och skickar ut bilden i BASE64 kodning till registrerade websocket-webbklienter.

Klienten är skriven med REACT och visar ett live-flöde med bilder i ett bildgalleri, (se ['react-image-gallery'](https://www.npmjs.com/package/react-image-gallery) )

Hårdvara:

* [Raspberry Pi 3](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) - Model B
* Raspberry Pi [Camera Module](https://www.raspberrypi.org/products/pi-noir-camera-v2/)
* [PIR](https://projects.raspberrypi.org/en/projects/physical-computing/13) Rörelsedektor (GIPO 4)
* [Nätaggregat](https://www.raspberrypi.org/products/raspberry-pi-universal-power-supply/)
* [Låda](https://www.raspberrypi.org/products/raspberry-pi-a-case/)


[<img src="https://i.imgur.com/0yJsb82.png">](https://i.imgur.com/0yJsb82.png) 

**Hur applikationen/tjänsten fungerar - Vi vill kunna ha en adress att besöka, inte installera applikationen lokalt**

Klienten hittar du via länken [Surveillance camera](https://www.projectsbyjohan.com/surveillance).

Applikationen kommer visa den senast tagna bilden i ett bildgalleri. För att demonstrera applikationen under examination kan ni kontakta mig på 0707591825 så kan jag trigga en ny för att visa på att klienten kopplat upp sig korrekt till WoT APIet.

För att testa funktionalitet i REST APIet på läkarna nedan kan Surveillance.postman_collection.json användas: 

* GET [model](https://www.projectsbyjohan.com/surveillance) (publik).
* GET [properties](https://www.projectsbyjohan.com/surveillance/properties) (privat).
* POST [actions](https://www.projectsbyjohan.com/surveillance/actions) (privat).
* GET [things](https://www.projectsbyjohan.com/surveillance/things) (publik).

**En motivering kring hur din/er implementering stödjer sig på teorierna kring web of things. Använd de termer som tas upp i litteraturen så som integration pattern och de olika lagren i arkitekturmodellen.**

**Access**

För 'Access' lagret har jag använt mig av följande:

* Publik domän till mitt API
* WebSocket som Pub/Sub lösning
* HTTPS som protocal
* JSON som data-format
* REST API

Eftersom kameran fungerar som en övervakningskamera vill jag i dagsläget inte implementera någon vidare funktionalitet för att öka 'findability' men vid en implmentation där kameran används i ett mer offentligt syfte, (kanske att fotografera naturliv), skulle man kunna tänka sig att tillföra en QR kod eller NFC lösning i närheten av kameran.

Nu räcker det hursomhelst att den kan nås via mitt hemnätverk samt min publika adress för den som har tillgång till lösenordet.

**Direct integration pattern with REST**

TCP trafik (https) på mitt hemnätverk styrs om till min Raspberry PIs IP adress på vilken jag installerat [nginx](https://www.nginx.com/) som en "reversed proxy". Mitt WoT API körs på en server på localhost:3000 och bygger på REST principer. WoT APIet erbjuder json-data och modellerna för detta ligger under /server/api/app/models/. I min implmentation stödjer jag mig på [w3.org](https://www.w3.org/TR/wot-thing-description/) och försöker hålla mig till bokens [exempel modell](https://github.com/webofthings/web-thing-model/blob/gh-pages/models/modelExamplePi.json) i min design för att en generell klient ska kunna använda min WoT utan större konfigruation. Att jag implementerat Web Thing Model underlättar för maskiner att förstå vad min WoT är till för och är en viktig del av 'Find' lagret i arkitekturmodellen.

**Pub/sub interface via WebSockets**

Använder ['socket.io'](https://www.npmjs.com/package/socket.io) för att implementera publish-subsribe funktionalitet till mitt API för att klienter ska kunna få ett direkt flöde av nya bilder. Klienten ansluter till pathen: '/properties/camera/subs' och kopplar upp sig på kanalen camera med jwt-nyckeln som införskaffats via ett anrop till '/login' efter att ha angivit rätt lösenord.

**Share**

För att säkra upp WoT, API och klient använder jag ett lösenord för inloggning som är lagrat i en miljö variabel. Inloggning ger sen en temporär jwt som kan användas för att komma åt privata resurser så som properties, actions och pub/sub. Nginx på WoTen använder enbart HTTPS där jag har ett egetsignerat TLS certifikat och likaså hos klienten uppe på min Ubuntu server hos [aws amazon](https://aws.amazon.com/ec2/?sc_channel=PS&sc_campaign=acquisition_SW&sc_publisher=google&sc_medium=ACQ-P%7CPS-GO%7CBrand%7CDesktop%7CSU%7CCompute%7CEC2%7CSW%7CEN%7CText&sc_content=ec2_e&sc_detail=aws%20amazon%20ec2&sc_category=Compute&sc_segment=293621058453&sc_matchtype=e&sc_country=SW&s_kwcid=AL!4422!3!293621058453!e!!g!!aws%20amazon%20ec2&ef_id=EAIaIQobChMI7Pzvstaa4QIVGeaaCh3R-QlFEAAYASAAEgLXKfD_BwE:G:s).

**Compose**

Som tidigare nämnts har jag implementerat klienten mha REACT som loggar in och får en jwt, anropar properties för att få senaste tagna bilden och sedan ansluter till pub/sub sWebSocket kanalen för att få ett liveflöde av bilder. Bilderna kommer i BASE64 format vilket 'react-image-gallery' kan hantera direkt utan omvandling.
