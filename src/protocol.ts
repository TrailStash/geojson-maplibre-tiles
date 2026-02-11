import * as tilebelt from "@mapbox/tilebelt";
import vtPbf from "vt-pbf";
import geojsonvt from "geojson-vt";
import * as flatgeobuf from "flatgeobuf";

type ProtocolArgs = {
  url: string;
};

export const fgbProtocol = async (args: ProtocolArgs, ac: AbortController) => {
  const _url = args.url.replace("fgb://", "");

  const url = _url.split("?")[0];
  const params = new URLSearchParams(_url.split("?")[1]);

  const z = parseInt(params.get("z")!);
  const x = parseInt(params.get("x")!);
  const y = parseInt(params.get("y")!);

  // get the bounding box
  const [minX, minY, maxX, maxY] = tilebelt.tileToBBOX([x, y, z]);

  const fc = {
    type: "FeatureCollection",
    features: [] as flatgeobuf.IGeoJsonFeature[],
  };
  const iter = flatgeobuf.geojson.deserialize(url!, {
    minX,
    minY,
    maxX,
    maxY,
  });

  for await (const feature of iter) {
    fc.features.push(feature);
  }

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
};
