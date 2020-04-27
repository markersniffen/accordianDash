// get main DIV
const container = d3.select('#box');

// get width/height
let height = container._groups[0][0].offsetHeight;
let width = container._groups[0][0].offsetWidth;
const padLeft = 80;
const padRight = 80;
const padBottom = 0;
const padTop = 0;
let innerWidth = width - padLeft - padRight;
let innerHeight = height - padTop - padBottom;

let mouseX, mouseY; 

const parseTime  = d3.timeParse("%m/%d/%Y")
const formatTime = d3.timeFormat("%B %d")

let timelineData = [];

function loadData() {
   d3.csv('data/timelineData.csv')
      .then( (data) => {
         timelineData = data.map(d => {
            let t = parseTime(d.time)
            
            return { 
               time: t,
               name: d.name,
               description: d.description,
               type: d.type
             }
         })
         render();
   });
}

function render() {

   const currentDate = new Date();
   

  const scaleTime = d3.scaleTime()
   .domain(d3.extent(timelineData.map( (d) => { return d.time })))
   .range([0, innerWidth])


  svg = container.selectAll('#svg').data([null])
   .join(
      enter => enter
      .append('svg')
      .attr('id', 'svg')
      .style('background-color', '#111111')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewbox', `${width/2} ${height/2} ${width} ${height}`)
   )

   let g = svg.selectAll('.gg').data([null])
   .join('g')
   .attr('class', 'gg')

   let pad = g.selectAll('.pad').data([null])
      .join('g')
      .attr('class', 'pad')
      .attr('transform', `translate(${padLeft},${height/2})`)

   timeLine = pad.selectAll('.timeLine').data([null])
      .join('path')
         .attr('class', 'timeLine')
         .attr('d', `M${0},0 L${innerWidth},0`)
         .style('stroke', 'white')
         .style('stroke-width', 2)

   let today = pad.selectAll('.today').data([null])
      .join('path')
      .attr('class', 'today')
      .attr('d', `M ${scaleTime(currentDate)},46 L${scaleTime(currentDate)},-46`)
      .style('stroke', '#771111')
      .style('stroke-width', 2)

   pad.selectAll(('.todayText')).data([null])
      .join('text')
      .attr('class', 'today')
      .text('today')
      .attr('x', scaleTime(currentDate))
      .attr('y', 58)
      .style('fill', 'red')
      .style('font-size', '.5em')

         
   let dots = pad.selectAll('.dots').data(timelineData)
      .join('circle')
         .attr('class', 'dots')
         .attr('cy', 0)
         .attr('cx', d => scaleTime(d.time))
         .attr('r', 10)
         .style('fill', 'steelblue')

   let dotLabels = pad.selectAll('.dotLabels').data(timelineData)
      .join('text')
         .attr('class', 'dotLabels')
         .attr('y', -30)
         .attr('x', d => scaleTime(d.time))
         .text(d => d.name)
         .style('fill', 'white')
         .style('font-size', '.5em')

   let dotDates = pad.selectAll('.dotDates').data(timelineData)
      .join('text')
         .attr('class', 'dotDates')
         .attr('y', 25)
         .attr('x', d => scaleTime(d.time))
         .text(d => formatTime(d.time))
         .style('fill', 'grey')
         .style('font-size', '.5em')

   
    
      svg.call(d3.zoom()
      .on('zoom', zoomed)
   )

      

   console.log(timelineData[0].time)
   console.log(currentDate)

 
   function zoomed() {
      g.attr("transform", d3.event.transform);
      }


}

loadData();

window.addEventListener('resize', render);