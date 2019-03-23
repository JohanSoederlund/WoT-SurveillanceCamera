module.exports = {
    "id": "pi",
    "name": "Surveillance Raspberry PI",
    "description": "WoT-connected Raspberry PI with camera and PIR.",
    "tags": [
      "raspberry",
      "pi",
      "WoT"
    ],
    "customFields" : {
      "port" : 3000
    },
    "links": {
      "product": {
        "link": "https://www.raspberrypi.org/products/raspberry-pi-2-model-b/",
        "title": "Product this Web Thing is based on"
      },
      "properties": {
        "link": "/properties",
        "title": "List of Properties",
        "resources": {
          "picture": {
            "name": "Camera",
            "description": "Sensor controlled HD camera.",
            "values": {
              "pic": {
                "name": "Camera picture",
                "description": "Last taken picture in BASE64",
                "unit": "jpg",
                "customFields": {
                  "camera": "j3"
                }
              }
            },
            "tags": [
              "camera",
              "private"
            ]
          },
          "pir": {
            "name": "Passive Infrared",
            "description": "A passive infrared sensor.",
            "values": {
              "p": {
                "name": "Presence",
                "description": "Date last triggered",
                "type": "boolean",
                "customFields": {
                  "gpio": 4
                }
              }
            },
            "tags": [
              "sensor",
              "private"
            ]
          }
        }
      },
      "actions": {
        "link": "/actions",
        "title": "Actions of this Web Thing",
        "resources": {
          
        }
      },
      "meta": {
        "link": "http://w3.org/TR/wot-thing-description/",
        "title": "Metadata"
      },
      "help": {
        "link": "http://github.com/1dv527/js223zs-examination-3/",
        "title": "Documentation"
      },
      "ui": {
        "link": "https://www.projectsbyjohan.com/surveillance/",
        "title": "User Interface"
      }
    }
  }
