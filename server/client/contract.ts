export const contract = {
  "locations": {
    "listAltitude": {
      "method": "get",
      "description": "Get recorded altitudes for a given date",
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
              "alt": {
                "type": "number"
              },
              "tst": {
                "type": "number"
              }
            },
            "required": [
              "alt",
              "tst"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "listBattery": {
      "method": "get",
      "description": "Get recorded battery levels for a given date",
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
              "batt": {
                "type": "number"
              },
              "tst": {
                "type": "number"
              }
            },
            "required": [
              "batt",
              "tst"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "listCoords": {
      "method": "get",
      "description": "Get recorded location coordinates for a given date",
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
              "lat": {
                "type": "number"
              },
              "lon": {
                "type": "number"
              },
              "tst": {
                "type": "number"
              }
            },
            "required": [
              "lat",
              "lon",
              "tst"
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
