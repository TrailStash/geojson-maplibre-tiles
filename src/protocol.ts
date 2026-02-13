import * as tilebelt from "@mapbox/tilebelt";
import vtPbf from "vt-pbf";
import geojsonvt from "geojson-vt";

type RequestParameters = {
  url: string;
  headers?: unknown;
  method?: "GET" | "POST" | "PUT";
  body?: string;
  type?: "string" | "json" | "arrayBuffer" | "image";
  credentials?: "same-origin" | "include";
  collectResourceTiming?: boolean;
};


export class Protocol {
  name: string
  func: Function
  minzoom: Number
  maxzoom: Number

  constructor(name: string, func: Function, minzoom: Number = 8, maxzoom: Number = 22) {
    this.name = name;
    this.func = func;
    this.minzoom = minzoom;
    this.maxzoom = maxzoom;
    this.tile = this.tile.bind(this);
  }
  async tile(params: RequestParameters, ac: AbortController) {
    if (params.type === "json") {
      const data = {
        tilejson: "3.0.0",
        scheme: "xyz",
        tiles: [`${params.url}/{z}/{x}/{y}`],
        vector_layers: [{id: "data", fields: {}}],
        minzoom: this.minzoom,
        maxzoom: this.maxzoom,
      };
      return { data };
    }

    const re = new RegExp(`^${this.name}://((.|\n)+)/(\\d+)/(\\d+)/(\\d+)$`, "m");
    const result = params.url.match(re);
    if (!result) {
      throw new Error("Invalid protocol URL");
    }
    const url = result[1];

    const z = parseInt(result[3]!);
    const x = parseInt(result[4]!);
    const y = parseInt(result[5]!);

    // get the bounding box
    const [minX, minY, maxX, maxY] = tilebelt.tileToBBOX([x, y, z]);

    const fc = await this.func(url, {x, y, z, minX, minY, maxX, maxY}, ac)

    const tile = geojsonvt(fc as never, {
      maxZoom: z,
      tolerance: 3,
      buffer: 64,
    });

    const layer = tile.getTile(z, x, y);

    if (!layer) {
      return { data: new ArrayBuffer(0) };
    }

    const pbf = vtPbf.fromGeojsonVt({ data: layer as never });
    return {
      data: pbf,
    };
  }
}
