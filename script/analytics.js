
var data = {
    "Day": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "profit": [1, 2, 3, 4, 5, 6, 7],
    "sell": [1, 2, 3, 4, 5, 6, 7]
}



function area_graph(p) {
    console.log(p);
    p.setup = function () {

        p.createCanvas(p.windowWidth / 2, p.windowHeight / 2);
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
            p.drawingContext.fillStyle = gradient;
            p.rect(dataX, 10, barWidth, dataProfit, 0, 0, 10, 10);
            p.pop()

            p.push()
            p.textSize(12)
            p.scale(1, -1);
            p.translate(0, -p.height);
            p.textAlign(p.CENTER);
            p.text(data.Day[i], dataX + (barWidth / 2), p.height-2);
            p.pop()
        }

        // draw boundries
        p.strokeWeight(1);
        p.line(10, 10, 10, p.height - 20);
        p.line(10, 10, p.width, 10);

        p.pop()


    }
}
new p5(area_graph, 'graph1')
