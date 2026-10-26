export type EndpointLocationsList_OutputOK = {
  id: string;
  type: string;
  message_id: string;
  topic: string;
  qos: number;
  retained: boolean;
  created_at: number;
  source: string;
  batt: number;
  bs: number;
  acc: number;
  vac: number;
  lat: number;
  lon: number;
  alt: number;
  cog: number;
  rad: number;
  vel: number;
  p: number;
  t: string;
  tst: number;
  m: number;
  conn: string;
  poi: string;
  image: string;
  imagename: string;
  tag: string;
  inregions: string[];
  inrids: string[];
  motionactivities: string[];
  bssid: string;
  ssid: string;
  tid: string;
  created: string;
  updated: string;
}[];

export interface Contract {
  locations: {
    image: EndpointLocationsImage;
    list: EndpointLocationsList;
    track: EndpointLocationsTrack;
  };
}
export interface EndpointLocationsImage {
  method: "get";
  input: {
    query?: EndpointLocationsImage_InputQuery;
  };
  output: any;
  media: null;
}
export interface EndpointLocationsImage_InputQuery {
  date?: string;
}
export interface EndpointLocationsList {
  method: "get";
  input: {
    query?: EndpointLocationsList_InputQuery;
  };
  output: {
    OK: EndpointLocationsList_OutputOK;
  };
  media: null;
}
export interface EndpointLocationsList_InputQuery {
  date: string;
}
export interface EndpointLocationsTrack {
  method: "post";
  input: {
    body?: EndpointLocationsTrack_InputBody;
  };
  output: any;
  media: null;
}
export interface EndpointLocationsTrack_InputBody {
  message_id?: string;
  topic?: string;
  qos?: number;
  retained?: boolean;
  created_at?: number;
  source?: string;
  batt?: number;
  bs?: number;
  acc?: number;
  vac?: number;
  lat?: number;
  lon?: number;
  alt?: number;
  cog?: number;
  rad?: number;
  vel?: number;
  p?: number;
  t?: string;
  tst?: number;
  m?: number;
  conn?: string;
  poi?: string;
  image?: string;
  imagename?: string;
  tag?: string;
  inregions?: string[];
  inrids?: string[];
  motionactivities?: string[];
  tid?: string;
  _type?: string;
  _id?: string;
  SSID?: string;
  BSSID?: string;
}
