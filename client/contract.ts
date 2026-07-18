export const contract = {
  "locations": {
    "list": {
      "method": "get",
      "description": "Get all recorded locations for a given date",
      "noAuth": true,
      "encrypted": false,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            }
          },
          "required": [
            "date"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "message_id": {
                "type": "string"
              },
              "topic": {
                "type": "string"
              },
              "qos": {
                "type": "number"
              },
              "retained": {
                "type": "boolean"
              },
              "created_at": {
                "type": "number"
              },
              "source": {
                "type": "string"
              },
              "batt": {
                "type": "number"
              },
              "bs": {
                "type": "number"
              },
              "acc": {
                "type": "number"
              },
              "vac": {
                "type": "number"
              },
              "lat": {
                "type": "number"
              },
              "lon": {
                "type": "number"
              },
              "alt": {
                "type": "number"
              },
              "cog": {
                "type": "number"
              },
              "rad": {
                "type": "number"
              },
              "vel": {
                "type": "number"
              },
              "p": {
                "type": "number"
              },
              "t": {
                "type": "string"
              },
              "tst": {
                "type": "number"
              },
              "m": {
                "type": "number"
              },
              "conn": {
                "type": "string"
              },
              "poi": {
                "type": "string"
              },
              "image": {
                "type": "string"
              },
              "imagename": {
                "type": "string"
              },
              "tag": {
                "type": "string"
              },
              "inregions": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "inrids": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "motionactivities": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "bssid": {
                "type": "string"
              },
              "ssid": {
                "type": "string"
              },
              "tid": {
                "type": "string"
              },
              "created": {
                "type": "string"
              },
              "updated": {
                "type": "string"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "type",
              "message_id",
              "topic",
              "qos",
              "retained",
              "created_at",
              "source",
              "batt",
              "bs",
              "acc",
              "vac",
              "lat",
              "lon",
              "alt",
              "cog",
              "rad",
              "vel",
              "p",
              "t",
              "tst",
              "m",
              "conn",
              "poi",
              "image",
              "imagename",
              "tag",
              "inregions",
              "inrids",
              "motionactivities",
              "bssid",
              "ssid",
              "tid",
              "created",
              "updated",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "track": {
      "method": "post",
      "description": "Receive an OwnTracks message. Location updates are recorded; all other message types are acknowledged and discarded.",
      "noAuth": true,
      "encrypted": false,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "message_id": {
              "type": "string"
            },
            "topic": {
              "type": "string"
            },
            "qos": {
              "type": "number"
            },
            "retained": {
              "type": "boolean"
            },
            "created_at": {
              "type": "number"
            },
            "source": {
              "type": "string"
            },
            "batt": {
              "type": "number"
            },
            "bs": {
              "type": "number"
            },
            "acc": {
              "type": "number"
            },
            "vac": {
              "type": "number"
            },
            "lat": {
              "type": "number"
            },
            "lon": {
              "type": "number"
            },
            "alt": {
              "type": "number"
            },
            "cog": {
              "type": "number"
            },
            "rad": {
              "type": "number"
            },
            "vel": {
              "type": "number"
            },
            "p": {
              "type": "number"
            },
            "t": {
              "type": "string"
            },
            "tst": {
              "type": "number"
            },
            "m": {
              "type": "number"
            },
            "conn": {
              "type": "string"
            },
            "poi": {
              "type": "string"
            },
            "image": {
              "type": "string"
            },
            "imagename": {
              "type": "string"
            },
            "tag": {
              "type": "string"
            },
            "inregions": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "inrids": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "motionactivities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "tid": {
              "type": "string"
            },
            "_type": {
              "type": "string"
            },
            "_id": {
              "type": "string"
            },
            "SSID": {
              "type": "string"
            },
            "BSSID": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "output": "custom"
    }
  }
} as const

export default contract
