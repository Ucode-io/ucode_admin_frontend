import FormElementGenerator from "../../../../../../components/ElementGenerators/FormElementGenerator"
import styles from "./style.module.scss"


const attributeSections = [
  {
    label: 'Pie chart attributes',
    fields: [
      {
        label: 'Key field slug',
        slug: 'attributes.PIE_CHART.label_field_slug'
      },
      {
        label: 'Value field slug',
        slug: 'attributes.PIE_CHART.value_field_slug'
      },
      {
        label: 'Inner radius',
        slug: 'attributes.PIE_CHART.innerRadius',
        type: "NUMBER",
        defaultValue: 0.5
      },
      {
        label: 'Pad angle',
        slug: 'attributes.PIE_CHART.padAngle',
        type: "NUMBER",
        defaultValue: 0.7
      },
      {
        label: 'Corner radius',
        slug: 'attributes.PIE_CHART.cornerRadius',
        type: "NUMBER",
        defaultValue: 3
      },
      {
        label: 'Border width',
        slug: 'attributes.PIE_CHART.borderWidth',
        type: "NUMBER",
        defaultValue: 1
      }
    ]
  },
  // {
  //   label: 'Bottom axis',
  //   fields: [
  //     {
  //       label: 'Tick size',
  //       slug: 'attributes.PIE_CHART.axisBottom.tickSize',
  //       type: "NUMBER",
  //       defaultValue: 5
  //     },
  //     {
  //       label: 'Tick padding',
  //       slug: 'attributes.PIE_CHART.axisBottom.tickPadding',
  //       type: "NUMBER",
  //       defaultValue: 0
  //     },
  //     {
  //       label: 'Tick rotation',
  //       slug: 'attributes.PIE_CHART.axisBottom.tickRotation',
  //       type: "NUMBER",
  //       defaultValue: 0
  //     },
  //     {
  //       label: 'Legend',
  //       slug: 'attributes.PIE_CHART.axisBottom.legend',
  //     },
  //     {
  //       label: 'Legend position',
  //       slug: 'attributes.PIE_CHART.axisBottom.legendPosition',
  //       type: "PICK_LIST",
  //       attributes: {
  //         options: ['start', 'middle', 'end']
  //       },
  //       defaultValue: 'middle'
  //     },
  //     {
  //       label: 'Legend offsett',
  //       slug: 'attributes.PIE_CHART.axisBottom.legendOffset',
  //       type: "NUMBER",
  //       defaultValue: 32
  //     }
  //   ]
  // },
  // {
  //   label: 'Left axis',
  //   fields: [
  //     {
  //       label: 'Tick size',
  //       slug: 'attributes.PIE_CHART.axisLeft.tickSize',
  //       type: "NUMBER",
  //       defaultValue: 5
  //     },
  //     {
  //       label: 'Tick padding',
  //       slug: 'attributes.PIE_CHART.axisLeft.tickPadding',
  //       type: "NUMBER",
  //       defaultValue: 0
  //     },
  //     {
  //       label: 'Tick rotation',
  //       slug: 'attributes.PIE_CHART.axisLeft.tickRotation',
  //       type: "NUMBER",
  //       defaultValue: 0
  //     },
  //     {
  //       label: 'Legend',
  //       slug: 'attributes.PIE_CHART.axisLeft.legend',
  //     },
  //     {
  //       label: 'Legend position',
  //       slug: 'attributes.PIE_CHART.axisLeft.legendPosition',
  //       type: "PICK_LIST",
  //       attributes: {
  //         options: ['start', 'middle', 'end']
  //       },
  //       defaultValue: 'middle'
  //     },
  //     {
  //       label: 'Legend offsett',
  //       slug: 'attributes.PIE_CHART.axisLeft.legendOffset',
  //       type: "NUMBER",
  //       defaultValue: -40
  //     }
  //   ]
  // }
]



const PieChartAttributes = ({ control }) => {
  return (
    <>

      {
        attributeSections?.map((section, index) => (
          <>
             <div key={index} className={styles.settingsSectionHeader}>{section.label}</div>
             <div className="p-2">
              {
                section.fields?.map(field => (
                  <FormElementGenerator control={control} field={field} />
                ))
              }
             </div>
          </>
        ))
      }
    </>
  )
}

export default PieChartAttributes
