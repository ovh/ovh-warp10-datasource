export default interface AnnotationResponse {

    annotation: {
      //should match the annotation name in Grafana
      name: string
      enabled: boolean
      datasource: string
    }

    title: string

    time: number

    text: string

    // Coma separated tags
    tags: string
}