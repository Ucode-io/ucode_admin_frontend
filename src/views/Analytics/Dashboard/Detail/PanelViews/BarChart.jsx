import { ResponsiveBar } from "@nivo/bar"

const BarChart = () => {
  return (
    // <div>
      <ResponsiveBar
        data={data}
        keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
          },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "country",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "food",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={function (e) {
          return e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }}
      />
    // </div>
  )
}


const data = [
  {
    "country": "AD",
    "hot dog": 69,
    "hot dogColor": "hsl(251, 70%, 50%)",
    "burger": 144,
    "burgerColor": "hsl(280, 70%, 50%)",
    "sandwich": 33,
    "sandwichColor": "hsl(275, 70%, 50%)",
    "kebab": 174,
    "kebabColor": "hsl(326, 70%, 50%)",
    "fries": 168,
    "friesColor": "hsl(69, 70%, 50%)",
    "donut": 78,
    "donutColor": "hsl(97, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 21,
    "hot dogColor": "hsl(12, 70%, 50%)",
    "burger": 65,
    "burgerColor": "hsl(1, 70%, 50%)",
    "sandwich": 101,
    "sandwichColor": "hsl(137, 70%, 50%)",
    "kebab": 7,
    "kebabColor": "hsl(186, 70%, 50%)",
    "fries": 97,
    "friesColor": "hsl(213, 70%, 50%)",
    "donut": 91,
    "donutColor": "hsl(111, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 102,
    "hot dogColor": "hsl(211, 70%, 50%)",
    "burger": 11,
    "burgerColor": "hsl(24, 70%, 50%)",
    "sandwich": 149,
    "sandwichColor": "hsl(138, 70%, 50%)",
    "kebab": 187,
    "kebabColor": "hsl(55, 70%, 50%)",
    "fries": 54,
    "friesColor": "hsl(81, 70%, 50%)",
    "donut": 10,
    "donutColor": "hsl(244, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 3,
    "hot dogColor": "hsl(129, 70%, 50%)",
    "burger": 133,
    "burgerColor": "hsl(346, 70%, 50%)",
    "sandwich": 61,
    "sandwichColor": "hsl(144, 70%, 50%)",
    "kebab": 17,
    "kebabColor": "hsl(315, 70%, 50%)",
    "fries": 196,
    "friesColor": "hsl(322, 70%, 50%)",
    "donut": 153,
    "donutColor": "hsl(134, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 115,
    "hot dogColor": "hsl(211, 70%, 50%)",
    "burger": 11,
    "burgerColor": "hsl(355, 70%, 50%)",
    "sandwich": 144,
    "sandwichColor": "hsl(12, 70%, 50%)",
    "kebab": 40,
    "kebabColor": "hsl(42, 70%, 50%)",
    "fries": 120,
    "friesColor": "hsl(113, 70%, 50%)",
    "donut": 56,
    "donutColor": "hsl(207, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 85,
    "hot dogColor": "hsl(231, 70%, 50%)",
    "burger": 22,
    "burgerColor": "hsl(219, 70%, 50%)",
    "sandwich": 75,
    "sandwichColor": "hsl(151, 70%, 50%)",
    "kebab": 86,
    "kebabColor": "hsl(110, 70%, 50%)",
    "fries": 100,
    "friesColor": "hsl(43, 70%, 50%)",
    "donut": 91,
    "donutColor": "hsl(219, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 42,
    "hot dogColor": "hsl(105, 70%, 50%)",
    "burger": 16,
    "burgerColor": "hsl(6, 70%, 50%)",
    "sandwich": 76,
    "sandwichColor": "hsl(337, 70%, 50%)",
    "kebab": 100,
    "kebabColor": "hsl(81, 70%, 50%)",
    "fries": 140,
    "friesColor": "hsl(238, 70%, 50%)",
    "donut": 27,
    "donutColor": "hsl(11, 70%, 50%)"
  }
]

export default BarChart
