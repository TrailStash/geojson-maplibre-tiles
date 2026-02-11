# **@rabbit-backend/fgb-maplibre-tiles**

A zero-server utility that lets **MapLibre GL JS read FlatGeobuf (`.fgb`) directly as vector tiles in the browser** via a custom protocol.

Your FlatGeobuf is **spatially queried per tile**, converted to Mapbox Vector Tiles (MVT), and streamed straight into MapLibre.


## 📦 Installation

```bash
npm install @rabbit-backend/fgb-maplibre-tiles
```

You still need MapLibre GL JS in your app:

```bash
npm install maplibre-gl
```

---

## 🗺️ Minimal working usage

```ts
import maplibregl from "maplibre-gl";
import { fgbProtocol } from "@rabbit-backend/fgb-maplibre-tiles";

// 1) Register protocol
maplibregl.addProtocol("fgb", fgbProtocol);

const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [-82.4869, 28.0303],
  zoom: 7,
});

map.on("load", () => {
  // 2) Add FlatGeobuf as vector source
  map.addSource("fgb-source", {
    type: "vector",
    tiles: ["fgb:///polygons.fgb?z={z}&x={x}&y={y}"],
    minzoom: 8,
  });

  // 3) Add layer (just like normal vector tiles)
  map.addLayer({
    id: "fgb-layer",
    source: "fgb-source",
    "source-layer": "data",
    type: "line",
    paint: {
      "line-width": 2,
    },
  });
});
```
