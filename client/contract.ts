export const contract = {
  "locations": {
    "image": {
      "method": "get",
      "description": "Generate a 384px-wide black and white summary strip image with map and telemetry graphs",
      "noAuth": true,
      "encrypted": false,
      "isDownloadable": true,
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
          "additionalProperties": false
        }
      },
      "output": "custom"
    },
    "list": {
      "method": "get",
      "description": "Get recorded location coordinates and telemetry for a given date",
      "noAuth": false,
      "encrypted": true,
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
              "id": {
                "type": "string",
                "format": "uuid",
                "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
              },
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
                "type": "integer",
                "minimum": -2147483648,
                "maximum": 2147483647
              },
              "retained": {
                "type": "boolean"
              },
              "created_at": {
                "type": "integer",
                "minimum": -2147483648,
                "maximum": 2147483647
              },
              "source": {
                "type": "string"
              },
              "batt": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "bs": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "acc": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "vac": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "lat": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "lon": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "alt": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "cog": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "rad": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "vel": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "p": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "t": {
                "type": "string"
              },
              "tst": {
                "type": "integer",
                "minimum": -2147483648,
                "maximum": 2147483647
              },
              "m": {
                "type": "integer",
                "minimum": -2147483648,
                "maximum": 2147483647
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
                "type": "string",
                "format": "date-time"
              },
              "updated": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "id",
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
              "updated"
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
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "retained": {
              "type": "boolean"
            },
            "created_at": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "source": {
              "type": "string"
            },
            "batt": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "bs": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "acc": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "vac": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "lat": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "lon": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "alt": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "cog": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "rad": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "vel": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "p": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "t": {
              "type": "string"
            },
            "tst": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "m": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
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
