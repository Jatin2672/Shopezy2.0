/**  written in javascript and uses P5JS **/
var parentObj = []
let plotNumber = 0
var plottedPlotNumber = 0
class JGraph {
    constructor(graphType, divId , dataX , dataY) {

        //check for valid data
        if(dataX.length != dataY.length) {
            console.log("dataX and dataY must be the same length")
            return
        }
        
        this.divId = divId
        this.graphType = graphType 
        this.dataX = dataX
        this.dataY = dataY

        this.backgroundColor = "#ffffff"
        this.canvas_width = 400
        this.canvas_height = 400
        this.fillColor = "#ffffaaaa"
        this.labelColor = '#333388'
        this.strokeColor = '#000000'
        this.enableGrid = true
        this.YTicks = true

        this.roundness = 0
        this.roundedCornerLeftTop = 0
        this.roundedCornerLeftBottom = 0
        this.roundedCornerRightTop = 0
        this.roundedCornerRightBottom = 0



        parentObj[plotNumber] = this
        plotNumber++
    }
    plot() {
        if (this.graphType == "bar") new p5(this.bargraph, this.divId)
        else if (this.graphType == "pie") new p5(this.piechart, this.divId)
        else if (this.graphType == "lines") new p5(this.lineGraph, this.divId)
        else console.log("Graph type not supported")
    }

    // set (i) background color
    set background(backgroundColor) { this.backgroundColor = backgroundColor }
    get background() { return this.backgroundColor }

    // set (ii) width and height
    set width(canvas_width) { this.canvas_width = canvas_width }
    get width() { return this.canvas_width }
    set height(canvas_height) { this.canvas_height = canvas_height }
    get height() { return this.canvas_height }

    // set and get fill color for graph
    set fillC(fillColor) { this.fillColor = fillColor }
    get fillC() { return this.fillColor }

    // set and get stroke color for graph
    set strokeC(strokeColor) { this.strokeColor = strokeColor }
    get strokeC() { return this.strokeColor }

    //set and get labelColor
    set labelC(labelColor) { this.labelColor = labelColor }
    get labelC() { return this.labelColor }

    // set and get rounded corners
    set roundedCorners(roundness) { this.roundness = roundness }
    get roundedCorners() { return this.roundness }

    //set and get rounded corner leftTop
    set roundedCornerLeftTop(roundness) { this.leftTopRoundness = roundness }
    get roundedCornerLeftTop() { return this.leftTopRoundness }

    //set and get rounded corner leftBottom
    set roundedCornerLeftBottom(roundness) { this.leftBottomRoundness = roundness }
    get roundedCornerLeftBottom() { return this.leftBottomRoundness }

    // set and get rounded corner rightTop
    set roundedCornerRightTop(roundness) { this.rightTopRoundness = roundness }
    get roundedCornerRightTop() { return this.rightTopRoundness }

    // set and get rounded corner rightBottom
    set roundedCornerRightBottom(roundness) { this.rightBottomRoundness = roundness }
    get roundedCornerRightBottom() { return this.rightBottomRoundness }

    // set and get enableGrid property
    set grids (enableGrid){ this.enableGrid = enableGrid}
    get grids (){ return this.enableGrid }

    //enable and disable y ticks
    set enableYTicks(YTicks){this.YTicks = YTicks}
    get enableYTicks(){return this.YTicks}

    set style(styleName){
        if(styleName=="dark"){
            this.background = "#161A25"
            this.fillC = "#2962FF"
            this.labelC = "#A3A6AF"
            this.strokeC = "#ffffff"
            if(this.roundness == 0){
            this.roundedCornerLeftTop = 5
            this.roundedCornerRightTop = 5
            }
        }else if(styleName == "light"){
            this.background = "#fff"
            this.fillC = "#92F2bb"
            this.labelC = "#131722"
            this.strokeC = "#000000"
            if(this.roundness == 0){
            this.roundedCornerLeftTop = 5
            this.roundedCornerRightTop = 5
            }
        }else{

        }
    }

    // function for bar graph
    bargraph(p) {

        let index = plottedPlotNumber;
        plottedPlotNumber++;

        p.setup = function () {
            p.createCanvas(parentObj[index].width, parentObj[index].height) 
        }
        p.draw = function () {
            
            p.background(parentObj[index].background) 
            // calculate bar height using min and max of dataY
            let minY = Math.min(...parentObj[index].dataY)
            let maxY = Math.max(...parentObj[index].dataY)
            p.translate(p.width*0.05, p.height*0.95)
            p.scale(1,-0.9);
            if(parentObj[index].enableGrid){

                p.stroke(parentObj[index].strokeC)
                p.strokeWeight(0.3)
                for(let i = 0 ; i < 10 ; i++){
                    let x_loc = p.map(i , 0 , 10 , -10 , p.width*0.95)
                    let y_loc = p.map(i , 0 , 10 , 0 , p.height);
                    let yValue = p.map(i, 0, 10, 0, maxY)
                    p.line(x_loc , 0 , x_loc , p.height)
                    p.line(-10 , y_loc , p.width , y_loc)
                    if(parentObj[index].enableYTicks){
                        p.fill(parentObj[index].labelC)
                        p.strokeWeight(0)
                        p.push()
                        p.translate(-40,y_loc)
                        p.scale(1,-1)
                        p.text( Math.round(yValue) , 0 , 0)
                        p.pop()
                        p.strokeWeight(0.3)
                    }
                }
                p.strokeWeight(0)

            }
            let barWidth = p.width / parentObj[index].dataX.length;


           
            if(parentObj[index].roundedCornerLeftTop == 0) parentObj[index].roundedCornerLeftTop = parentObj[index].roundness;
            if(parentObj[index].roundedCornerLeftBottom == 0) parentObj[index].roundedCornerLeftBottom = parentObj[index].roundness;
            if(parentObj[index].roundedCornerRightTop == 0) parentObj[index].roundedCornerRightTop = parentObj[index].roundness;
            if(parentObj[index].roundedCornerRightBottom == 0) parentObj[index].roundedCornerRightBottom = parentObj[index].roundness;

            for (let i = 0; i < parentObj[index].dataX.length; i++) {

                let barHeight = p.map(parentObj[index].dataY[i], 0, maxY, 0, p.height)
                
                p.stroke(parentObj[index].strokeC)

                p.fill(parentObj[index].fillC)
                // let gradient = p.drawingContext.createLinearGradient(0, 0, 0, barHeight);
                // gradient.addColorStop(1, '#4087F3');
                // gradient.addColorStop(0.5, '#4087F3');
                // gradient.addColorStop(0, '#FFFFFF00');
                p.push()
                // p.drawingContext.fillStyle = gradient;
                p.rect( i * barWidth , 0 , barWidth/2 , barHeight , parentObj[index].roundedCornerLeftBottom , parentObj[index].roundedCornerRightBottom , parentObj[index].roundedCornerRightTop , parentObj[index].roundedCornerLeftTop)
                // p.rect(20, 20, 200, 100);
                p.pop()
                

                p.fill(parentObj[index].labelC)
                p.noStroke()
                p.push()
                p.translate( i * barWidth + barWidth/4 - 15,  barHeight + 5)
                p.scale(1,-1)

                p.textSize(10)

                // x label on axis
                p.text(parentObj[index].dataX[i] , 5, barHeight+14)

                //y label on bar
                p.text(parentObj[index].dataY[i], 5, 10)
               
                p.pop()
                p.stroke(0)

            }

            p.strokeWeight(0.5)
            p.stroke(parentObj[index].strokeC)
            p.line(-15, 0, p.width*0.9 , 0)
            p.line(-10, -5, -10 , p.height)
        }
    }

    piechart(p) {
        
        let index = plottedPlotNumber;
        plottedPlotNumber++;            
        let total = 0;
        let colors = []


        p.setup = function () {
            p.createCanvas(parentObj[index].width, parentObj[index].height)
            for (let i = 0; i < parentObj[index].dataY.length; i++) {
                var amountGreen = p.map(i, 0, parentObj[index].dataY.length, 0, 255)
                total += parentObj[index].dataY[i]
                colors.push([p.random(200), amountGreen, p.random(50)])
        }
        }            

        p.draw = function () {
            p.background(parentObj[index].background) 
            p.translate(p.width / 2, p.height / 2)
            p.scale(1, -1)
            p.strokeWeight(0)
            p.rotate(p.frameCount / 100)
            let lastAngle = 0;
            let maxY = Math.max(...parentObj[index].dataY)
            for(let i = 0 ; i < parentObj[index].dataY.length ; i++){
                let angle = p.map(parentObj[index].dataY[i] , 0 , total , 0 , 2*p.PI)
                p.fill(colors[i])
                let displacement = p.map(parentObj[index].dataY[i] , 0 , maxY , -30 , 30)
                p.arc( 0, 0, displacement + p.width / 3, displacement + p.width / 3, lastAngle, lastAngle + angle)
                lastAngle += angle
            }
            p.fill(parentObj[index].backgroundColor)
            p.circle(0, 0, p.width / 8)
        }

    }

    // function for line graph
    lineGraph(p) {

        let index = plottedPlotNumber;
        plottedPlotNumber++;

        p.setup = function () {
            p.createCanvas(parentObj[index].width, parentObj[index].height) 
        }
        p.draw = function () {
            p.background(parentObj[index].background) 
            // calculate bar height using min and max of dataY
            let minY = Math.min(...parentObj[index].dataY)
            let maxY = Math.max(...parentObj[index].dataY)

            p.translate(p.width*0.05, p.height*0.95)
            p.scale(1,-0.9);
            if(parentObj[index].enableGrid){

                p.stroke(parentObj[index].strokeC)
                p.strokeWeight(0.3)
                for(let i = 0 ; i < 10 ; i++){
                    let x_loc = p.map(i , 0 , 10 , -10 , p.width*0.95)
                    let y_loc = p.map(i , 0 , 10 , 0 , p.height);
                    let yValue = p.map(i, 0, 10, 0, maxY)
                    p.line(x_loc , 0 , x_loc , p.height)
                    p.line(-10 , y_loc , p.width , y_loc)
                    if(parentObj[index].enableYTicks){
                        p.fill(parentObj[index].labelC)
                        p.strokeWeight(0)
                        p.push()
                        p.translate(-40,y_loc)
                        p.scale(1,-1)
                        p.text( Math.round(yValue) , 0 , 0)
                        p.pop()
                        p.strokeWeight(0.3)
                    }
                }
                p.strokeWeight(0)

            }
            let barWidth = p.width / parentObj[index].dataX.length;


            
            if(parentObj[index].roundedCornerLeftTop == 0) parentObj[index].roundedCornerLeftTop = parentObj[index].roundness;
            if(parentObj[index].roundedCornerLeftBottom == 0) parentObj[index].roundedCornerLeftBottom = parentObj[index].roundness;
            if(parentObj[index].roundedCornerRightTop == 0) parentObj[index].roundedCornerRightTop = parentObj[index].roundness;
            if(parentObj[index].roundedCornerRightBottom == 0) parentObj[index].roundedCornerRightBottom = parentObj[index].roundness;
            
            let prevBarHeight = parentObj[index].dataY[0] 
            for (let i = 0; i < parentObj[index].dataX.length; i++) {
                
                let barHeight = p.map(parentObj[index].dataY[i], 0, maxY, 0, p.height)
                
                p.stroke(parentObj[index].strokeC)

                p.strokeWeight(3)
                p.stroke(parentObj[index].fillC)
                
                p.line( i * barWidth + barWidth/4 , barHeight , (i-1) * barWidth + barWidth/4 , prevBarHeight )
                
                prevBarHeight = barHeight;
                p.fill(parentObj[index].labelC)
                p.noStroke()
                p.push()
                p.translate( i * barWidth + barWidth/4 - 15,  barHeight + 5)
                p.scale(1,-1)

                p.textSize(12)

                // x label on axis
                p.text(parentObj[index].dataX[i] , 0, barHeight+18)

                //y label on bar
                p.text(parentObj[index].dataY[i], 0, 0)
                
                p.pop()
                p.stroke(0)

            }

            p.strokeWeight(0.5)
            p.stroke(parentObj[index].strokeC)
            p.line(-15, 0, p.width*0.9 , 0)
            p.line(-10, -5, -10 , p.height)
        }
    }
}

class JAudio{
    constructor(audio){
        this.audio = audio;
    }
}