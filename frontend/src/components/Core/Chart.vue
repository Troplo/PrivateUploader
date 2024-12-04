<template>
  <div :id="'chartnext-' + id">
    <apexchart
      v-if="apex"
      :height="height"
      :options="chartOptions"
      :series="seriesRes"
      :type="type"
      :width="getWidth()"
      title=""
    />
    <template v-else-if="type === 'line'">
      <Line
        v-if="chartJSData"
        :data="chartJSData"
        :options="chartJSOptions"
        :style="height ? `max-height: ${height}px; height: ${height}px;` : ''"
      />
    </template>
    <template v-else-if="type === 'bar'">
      <Bar
        v-if="chartJSData"
        :data="chartJSData"
        :options="chartJSOptions"
        :style="height ? `max-height: ${height}px; height: ${height}px;` : ''"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Bar, Line } from "vue-chartjs";
import apexchart from "vue3-apexcharts";
import chartJS, {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { defineComponent } from "vue";
import { PrideVariant } from "@/types/pride";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement
);
export default defineComponent({
  name: "Chart",
  components: { Line, Bar, apexchart },
  props: [
    "data",
    "height",
    "width",
    "type",
    "id",
    "name",
    "color",
    "series",
    "horizontal",
    "apex"
  ],
  data() {
    return {
      gradient: ""
    };
  },
  computed: {
    chartJSData() {
      return {
        labels: this.data?.labels,
        datasets: [
          {
            label: this.name,
            data: this.data?.data,
            borderColor: (context) => {
              if (!this.$experiments.experiments.PRIDE)
                return this.color || this.$user.theme.colors.primary;
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return;
              return this.getGradient(ctx, chartArea);
            },
            backgroundColor: () => {
              if (!this.$experiments.experiments.PRIDE)
                return this.color || this.$user.theme.colors.primary;
              return this.gradient;
            }
          }
        ]
      };
    },
    chartJSOptions() {
      return {
        elements: {
          line: {
            tension: 0.1
          }
        },
        responsive: true,
        maintainAspectRatio: !this.height,
        title: {
          display: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: "index",
            intersect: false
          },
          hover: {
            mode: "index",
            intersect: false
          }
        },
        animation: {
          duration: 1
        }
      } as chartJS.ChartOptions;
    },
    chartOptions() {
      const result = {
        plotOptions: {
          bar: {
            horizontal: this.horizontal || false
          }
        },
        c: this.series,
        stroke: {
          colors: [this.color || this.$user.theme.colors.primary]
        },
        colors: [this.color || this.$user.theme.colors.primary],
        grid: {
          borderColor: "#474747"
        },
        dataLabels: {
          enabled: false
        },
        bar: {
          plotOptions: {
            total: {
              show: true,
              label: "Total"
            }
          }
        },
        theme: {
          mode: "dark",
          palette: "palette1"
        },
        chart: {
          markers: {
            colors: ["white"],
            size: 4,
            color: "white",
            strokeColors: "#fff"
          },
          animations: {
            enabled: false,
            easing: "easeinout",
            speed: 400,
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false
            }
          },
          background: "transparent",
          id: "chartnext-" + this.id
        },
        xaxis: undefined as any
      };
      if (!this.series) {
        result.xaxis = {
          categories: this.data.labels
        };
      }
      return result;
    },
    seriesRes() {
      return !this.series
        ? [
            {
              name: this.name || "TPUvNEXT-Default",
              data: this.data.data
            }
          ]
        : this.series;
    }
  },
  methods: {
    getGradient(ctx, chartArea) {
      let width, height, gradient;
      const chartWidth = chartArea.right - chartArea.left;
      const chartHeight = chartArea.bottom - chartArea.top;
      if (!gradient || width !== chartWidth || height !== chartHeight) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        PrideVariant.gradient(this.$experiments.experiments.PRIDE).forEach(
          (color, index) => {
            const offset = !color.offset ? 0 : color.offset;
            gradient.addColorStop(offset, color.stopColor);
          }
        );
      }

      this.gradient = gradient;
      return gradient;
    },
    getWidth() {
      if (this.width) return this.width;
      return "100%";
    }
  }
});
</script>

<style>
.apexcharts-svg {
  background: transparent !important;
}
</style>
