# **geojson-maplibre-tiles**

An experimental zero-server utility that lets **MapLibre GL JS fetch data from services in a tiled
fashion via a custom protocol.**

Can be used to enable loading data in a tiled fashion from:

* [Postpass](./examples/postpass.html)
* [FlatGeoBuf files](./examples/flatgeobuf.html)
* Overpass
* Any other service you can query by bbox or slippy tile address and convert results to GeoJSON

Your service is **spatially queried per tile**, converted to Mapbox Vector Tiles (MVT), and streamed straight into MapLibre.

This is derived from https://github.com/rabbit-backend/fgb-maplibre-tiles


## 📦 Installation

**🚧 TODO:** actually publish to npm


```bash
npm install geojson-maplibre-tiles
```

You still need MapLibre GL JS in your app:

```bash
npm install maplibre-gl
```

---
