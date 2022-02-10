import Loadable from "react-loadable"
import TableLoader from "../TableLoader"
import { useEffect, useMemo, useState } from "react"
import axios from "../../utils/axios"
import { mapPropertyId } from "../../config/defaultSettings"
import centroid from "@turf/centroid"

const Map = Loadable({
  loader: () => import("../map/OpenMap"),
  loading: TableLoader,
})

const OpenMapContainer = ({
  coor,
  mapHeight,
  mapWidth,
  gisSwitch,
  selectedCityId,
  selectedRegionId,
}) => {
  const [protectedAreas, setProtectedAreas] = useState([])
  const [access, setAccess] = useState(false)
  const [entityList, setEntityList] = useState(null)

  const fetchEntityCoordinates = () => {
    if (!selectedCityId || !selectedRegionId) return setEntityList(null)

    axios
      .get("/entity-properties", {
        params: {
          city_id: selectedCityId,
          region_id: selectedRegionId,
          limit: 100,
        },
      })
      .then((res) => {
        setEntityList(res.entities)
      })
  }

  const coordinates = useMemo(() => {
    if (!entityList) return []

    return entityList.map((entity, index) => {
      const coordinates = JSON.parse(
        entity.entity_properties.filter(
          (property) => property.property_id === mapPropertyId
        )[0]?.value
      )

      const centerCoords = centroid({
        type: "Polygon",
        coordinates,
      })?.geometry?.coordinates

      return {
        id: index + 1,
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates,
        },

        properties: {
          id: index + 1,
          number: entity.entity_number,
          status: entity.status.name,
          city: entity.city.name,
          region: entity.region.name,
          address: entity.address,
          long: centerCoords?.[0] || coordinates?.[0]?.[0]?.[0],
          lat: centerCoords?.[1] || coordinates?.[0]?.[0]?.[1],
        },
      }
    })
  }, [entityList])

  const fetchGis = (limit, page) => {
    axios
      .get(`/gis?limit=${limit}&page=${page}`)
      .then((res) => {
        const polygons = res.Features
        const computedPolygons = polygons.map((polygon, index) => ({
          id: page * limit + index,
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: JSON.parse(polygon.Geometry.coordinates),
          },
          properties: {
            id: page * limit + index,
          },
        }))
        setProtectedAreas((prev) => [...prev, ...computedPolygons])
        fetchGis(limit, page + 1)
        // setCounter(prev => prev + 1)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    // if(!gisSwitch) return null
    if (gisSwitch) {
      setAccess(true)
    }
  }, [gisSwitch])

  useEffect(() => {
    if (access) {
      fetchGis(100, 1)
    }
  }, [access])

  useEffect(() => {
    fetchEntityCoordinates()
  }, [selectedRegionId])

  return (
    <Map
      polygonCoordinates={coor}
      initialFeatures={
        gisSwitch ? [...coordinates, ...protectedAreas] : coordinates
      }
      centerCoordinates={coor?.geometry?.coordinates?.[0]?.[0]}
      mapHeight={mapHeight}
      mapWidth={mapWidth}
    />
  )
}

export default OpenMapContainer
