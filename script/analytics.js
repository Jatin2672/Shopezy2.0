
var data = {
    "Day": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon" , "Tue"],
    "profit": [10, 7, 11, 8, 12, 9, 7, 10, 5],
    "sell": [18, 17, 20, 18, 22, 18, 15, 20, 15]
}

let selectedI;



function bar_graph(p) {
    console.log(p);
    p.setup = function () {

        p.createCanvas(300, 200);
        p.background("#EAEAEA");
        p.fill(0);
        p.stroke(0);
        p.strokeWeight(1);

    }
    p.draw = function () {

        p.background("#EAEAEA");

        let minProfit = Math.min(...data.profit);
        let maxProfit = Math.max(...data.profit);

        let minSell = Math.min(...data.sell);
        let maxSell = Math.max(...data.sell);

        let minData = Math.min(minProfit, minSell);
        let maxData = Math.max(maxProfit, maxSell);

        let barWidth = (p.width * 0.5) / data.Day.length;
        let gridHeight = p.height / 7;


        p.push()
        p.scale(1, -1);
        p.translate(0, -p.height);

        for (let i = 0; i < data.profit.length; i++) {
            let dataX = (i * 2 + 0.5) * barWidth
            let dataProfit = p.map(data.profit[i], minData, maxData, 10, p.height - 20);
            let dataSell = p.map(data.sell[i], minData, maxData, 10, p.height - 20);

            // draw grids here
            p.strokeWeight(0.3);
            p.line(dataX + (barWidth / 2), 10, dataX + (barWidth / 2), p.height - 20);
            p.line(10, i * gridHeight, p.width, i * gridHeight);
            
            
            let gradient = p.drawingContext.createLinearGradient(0, 0, 0, dataSell);
            gradient.addColorStop(1, '#4087F3');
            gradient.addColorStop(0.5, '#bbF292');
            gradient.addColorStop(0, '#bbF29200');
            p.push()
            p.strokeWeight(0);
            p.drawingContext.fillStyle = gradient;
            p.rect(dataX, 10, barWidth, dataSell, 0, 0, 5, 5);
            p.pop()

            let gradient2 = p.drawingContext.createLinearGradient(0, 0, 0, dataProfit);
            gradient2.addColorStop(1, '#000');
            gradient2.addColorStop(0, '#bbF292');
            p.push()
            p.strokeWeight(0);
            p.drawingContext.fillStyle = gradient2;
            p.rect(dataX, 10, barWidth, dataProfit,0,0,5,5);
            p.pop()
            
            if(p.mouseX > dataX- (barWidth*1.5) && p.mouseX < dataX + (0.5*barWidth) && p.mouseY > 10 && p.mouseY < p.height-20){
                selectedI = i;
            }

            p.push()
            p.textSize(12)
            p.scale(1, -1);
            p.translate(0, -p.height);
            p.textAlign(p.CENTER);
            p.textSize(10)
            p.strokeWeight(0);
            p.text(data.Day[i], dataX + (barWidth / 2), p.height - 2);
            p.pop()
        }

        // draw boundries
        p.strokeWeight(1);
        p.line(10, 10, 10, p.height - 20);
        p.line(10, 10, p.width, 10);

        p.pop()


    }
}
new p5(bar_graph, 'graph1')

function line_graph(p) {
    console.log(p);
    p.setup = function () {

        p.createCanvas(640, 360);
        p.background("#EAEAEA");
        p.fill(0);
        p.stroke(0);
        p.strokeWeight(1);

    }
    p.draw = function () {

        p.background("#EAEAEA");

        let minProfit = Math.min(...data.profit);
        let maxProfit = Math.max(...data.profit);

        let minSell = Math.min(...data.sell);
        let maxSell = Math.max(...data.sell);

        let barWidth = (p.width * 0.5) / data.Day.length;
        let gridHeight = p.height / 7;


        p.push()
        p.scale(1, -1);
        p.translate(0, -p.height);

        let lastPoint = 0

        for (let i = 0; i < data.profit.length; i++) {
            let dataX = (i * 2 + 0.5) * barWidth
            let dataProfit = p.map(data.profit[i], minProfit, maxProfit, 10, p.height - 20);

            // draw grids here
            p.strokeWeight(0.3);
            p.line(dataX + (barWidth / 2), 10, dataX + (barWidth / 2), p.height - 20);
            p.line(10, i * gridHeight, p.width, i * gridHeight);

            let gradient = p.drawingContext.createLinearGradient(0, 0, 0, dataProfit);
            gradient.addColorStop(1, '#4087F3');
            gradient.addColorStop(0.2, '#92F2bb');
            gradient.addColorStop(0, '#92F2bb00');
            p.push()

            p.strokeWeight(0);
            p.strokeWeight(1);
            if (i > 0) {

                p.fill(0);
                p.strokeWeight(0);
                p.drawingContext.fillStyle = gradient;

                p.beginShape();
                p.vertex(dataX - (barWidth * 1.5), 10);
                p.vertex(dataX - (barWidth * 1.5), 10 + lastPoint);
                p.vertex(dataX - (barWidth * 0.5), lastPoint);
                p.vertex(dataX - (barWidth * 0.5), dataProfit);
                p.vertex(dataX + (0.5 * barWidth), 10 + dataProfit);
                p.vertex(dataX + (0.5 * barWidth), 10);
                p.endShape();
                //p.line(dataX - (barWidth*1.5), 10+lastPoint, dataX + (0.5*barWidth), 10+dataProfit);
                p.strokeWeight(1);
                p.noFill();
                p.bezier(dataX - (barWidth * 1.5), 10 + lastPoint,
                    dataX - (barWidth * 0.5), lastPoint,
                    dataX - (barWidth * 0.5), dataProfit,
                    dataX + (0.5 * barWidth), 10 + dataProfit);
                if(p.mouseX > dataX- (barWidth*2.5) && p.mouseX < dataX - (0.5*barWidth) && p.mouseY > 10 && p.mouseY < p.height-20){
                p.fill(0);
                p.strokeWeight(0.4);
                p.circle(dataX - (barWidth * 1.5), 10 + lastPoint, 12);
                p.circle(dataX - (barWidth * 1.5), 10 + lastPoint, 6);
                }

            }
            p.pop()
            lastPoint = dataProfit;
            p.push()
            p.textSize(12)
            p.scale(1, -1);
            p.translate(0, -p.height);
            p.textAlign(p.CENTER);
            p.textSize(10)
            p.strokeWeight(0);
            p.text(data.Day[i], dataX + (barWidth / 2), p.height - 2);
            p.pop()
        }

        // draw boundries
        p.strokeWeight(1);
        p.line(10, 10, 10, p.height - 20);
        p.line(10, 10, p.width, 10);

        //draw pointer
        p.strokeWeight(0.5);
        p.line(p.mouseX, 10, p.mouseX, p.height - 20);

        p.pop()


    }
}
new p5(line_graph, 'graph2')