declare global {
  export interface Content {
    title: string
    map: Map
    popups: {
      [key: string]: Popup
    }
    layersGroup: LayerGroup[]
    layers: Layer[]
    geoJSON: GeoJson
  }

  interface Popup {
    title: string
    content: string
  }

  export interface Map {
    tiles: string
    overlays: Overlay[]
    maxBounds: number[][]
    initialZoom: number
    minZoom: number
    maxZoom: number
  }

  export interface Overlay {
    label: string
    image: string
    bounds: number[][]
    showInControls: boolean
  }

  export interface Geometry {
    type: 'Point' | 'LineString'
    coordinates: number[] | number[][]
  }

  export interface GeoJson {
    type: 'FeatureCollection'
    features: GeoJsonFeature[]
  }

  export interface GeoJsonFeature {
    type: string
    geometry: Geometry
    bbox?: number[]
    properties?: object
  }

  interface Layer {
    label: string
    slug: string
    type: 'Point' | 'LineString'
    image?: string
    imageSize?: 'size-4' | 'size-6' | 'size-8' | 'size-10'
    anchorPosition?: 'center' | 'bottom-center'
    lineColor?: string
    lineWeight?: number
    layerGroup: string
  }

  interface LayerGroup {
    label: string
    slug: string
    description?: string
  }
}
