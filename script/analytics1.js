
var data = {
    "Day": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "profit": [10, 7, 11, 8, 12, 9, 7],
    "sell": [18, 17, 20, 18, 22, 18, 15]
}

let selectedI;

function bar_graph(p) {
    // console.log(p);
    p.setup = function () {

        p.createCanvas(300, 230);
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
            
            if(p.mouseX > dataX- (barWidth*1.0) && p.mouseX < dataX + (1.0*barWidth) && p.mouseY > 10 && p.mouseY < p.height-20){
                selectedI = i;
                document.getElementById("profit_val_home").innerHTML = "Rs." + data.profit[i];
                document.getElementById("sell_val_home").innerHTML = "Rs." + data.sell[i];
                document.getElementById("growth_indicator_txt").innerHTML = ((data.profit[i] / data.sell[i] * 100)).toPrecision(2) + "%";
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
        p.line(10, 10, p.width, 10);



        p.pop()

        // draw curser crossline mouse
        p.strokeWeight(0.5);
        p.drawingContext.setLineDash([5,5])
        p.line(p.mouseX , 0 , p.mouseX , p.height)
        p.line(0 , p.mouseY , p.width , p.mouseY)
        p.drawingContext.setLineDash([1,1])

    }
}
new p5(bar_graph, 'home_page_graph')


// analytics page graph 1
let week_data = {
    "1": {
        "name": "1 Jan - 7 Jan",
        "data": {
        "mon": 450 , "tue": 420, "wed": 540, "thu": 600, "fri": 620, "sat": 710, "sun": 740
        }
    },
    "2": {
        "name": "8 Jan - 14 Jan",
        "data": {
        "mon": 420 , "tue": 510, "wed": 660, "thu": 700, "fri": 350, "sat": 800, "sun": 760
        }
    },
    "3": {
        "name": "14 Jan - 21 Jan",
        "data": {
        "mon": 550 , "tue": 500, "wed": 560, "thu": 520, "fri": 730, "sat": 650, "sun": 850
        }
    }
}


let [graphWidth, graphHeight] = [0, 0];
function base_line_graph(p){
    p.setup = function(){
        [graphWidth, graphHeight] = getDimensions("analytics_graph_1");
        p.createCanvas(graphWidth, graphHeight);
        p.background(255);
    }
    p.draw = function(){
        [graphWidth, graphHeight] = getDimensions("analytics_graph_1");
        p.resizeCanvas(graphWidth, graphHeight);
        p.background(255);
        p.fill("#EAEAEA")
        p.strokeWeight(1);
        drawScale(p);
        drawWeek(p);
    }

}

function drawScale(p){

    //find max value of week data and draw scale
    let max_1_week = Math.max(...Object.values(week_data["1"].data));
    let max_2_week = Math.max(...Object.values(week_data["2"].data));
    let max_3_week = Math.max(...Object.values(week_data["3"].data));
    let max_week = Math.max(max_1_week, max_2_week, max_3_week) + 10 ;
    let min_1_week = Math.min(...Object.values(week_data["1"].data));
    let min_2_week = Math.min(...Object.values(week_data["2"].data));
    let min_3_week = Math.min(...Object.values(week_data["3"].data));
    let min_week = Math.min(min_1_week, min_2_week, min_3_week) - 10;
    let no_of_scale = 7;

    for(let i = 0; i < no_of_scale; i++){
        let y = p.map(i, 0, no_of_scale, 20, p.height);
        p.strokeWeight(1);
        p.stroke("#000")
        p.line(20, y, 25, y);
        p.fill("#000");
        p.noStroke()
        p.textSize(10);
        p.text(Math.round(max_week - (max_week - min_week) * i / no_of_scale), 0, y+3);
        
        p.stroke("#EAEAEA")
        p.line(20, y, p.width, y)
        let x = p.map(i, 0, no_of_scale, 20, p.width)
        p.line(x,0,x,p.height);
        let multiplier = p.width/(no_of_scale*5)
        for(let j = 0 ; j < 5 ; j++){
            p.line(x+j*multiplier,0,x+j*multiplier,p.height)
        }
        
        p.strokeWeight(1)
    }

}
function drawWeek(p){
    let max_1_week = Math.max(...Object.values(week_data["1"].data));
    let max_2_week = Math.max(...Object.values(week_data["2"].data));
    let max_3_week = Math.max(...Object.values(week_data["3"].data));
    let max_week = Math.max(max_1_week, max_2_week, max_3_week) + 10;
    let min_1_week = Math.min(...Object.values(week_data["1"].data));
    let min_2_week = Math.min(...Object.values(week_data["2"].data));
    let min_3_week = Math.min(...Object.values(week_data["3"].data));
    let min_week = Math.min(min_1_week, min_2_week, min_3_week) - 10;
    p.strokeWeight(1);
    p.fill("#4087F3")
    p.rect(p.width/6+7 , 12 , 75 , 20)
    p.rect(p.width/2-7 , 12 , 75 , 20)
    p.rect(5*p.width/6+7 , 12 , 75 , 20)
    p.fill(255)
    p.stroke("#4087F3")
    p.text(week_data["1"].name , p.width/6+14 , 25)
    p.text(week_data["2"].name , p.width/2 , 25)
    p.text(week_data["3"].name , 5*p.width/6+8 , 25)
    for(let i = 0; i < 7; i++){
        //get the data for each day from 1 week
        let day_data = week_data["1"].data[Object.keys(week_data["1"].data)[i]];
        let last_day_data = 0;
        
        let x = p.map(i, 0, 7, 30, p.width/3 - 2);
        let last_x = x;
        let y = p.map(day_data, min_week, max_week, 0, p.height-20);
        let last_y = y;
        let bar_width = (p.width/3 - 40)/14;
        
        if(i > 0){
            last_day_data = week_data["1"].data[Object.keys(week_data["1"].data)[i-1]];
            last_x = p.map(i-1, 0, 7, 30, p.width/3 - 2);
            last_y = p.map(last_day_data, min_week, max_week, 0, p.height-20);
        }
        p.push();
        p.scale(1, -1);
        p.translate(0, -p.height);
        p.noFill()
        p.stroke("#4087F3")
        
        p.bezier(last_x +bar_width/2 , last_y,
                (last_x + x)/2 + bar_width/2, last_y,
                (last_x + x)/2 + bar_width/2, y,             
                x + bar_width/2 , y);
        p.strokeWeight(0)
        p.fill("#0000ff55")
        
        
        p.fill("#4087F344");
        p.strokeWeight(0);
        p.beginShape()
        p.vertex(last_x + bar_width/2 , 0);
        for (let i = 0; i <= 10; i++) {
            let t = i / 10;
            let x_ = p.bezierPoint(last_x +bar_width/2, (last_x + x)/2, (last_x + x)/2, x + bar_width/2, t);
            let y_ = p.bezierPoint(last_y, last_y, y, y, t);
            p.vertex(x_, y_);

            if(p.mouseX > x_ - (0.15*bar_width) && p.mouseX < x_ + (0.15*bar_width) && p.mouseY < p.height){
                if(p.frameCount % 50 < 10){
                    p.circle(p.mouseX, y_, 12)
                }
                if(p.frameCount % 30 < 10){
                    p.circle(p.mouseX, y_, 10)
                }
                p.circle(p.mouseX, y_, 8)
                p.stroke(0)
            }

          }
        p.vertex(x + bar_width/2 , 0);
        p.endShape()

        //p.rect(x , 0 , bar_width , y);
        p.pop();
        
        p.stroke(255)
        p.fill(0)
        p.text(Object.keys(week_data["1"].data)[i] , x+8 ,p.height-5)


        //get the data for each day from 2 week
        day_data = week_data["2"].data[Object.keys(week_data["2"].data)[i]];
        x = p.map(i, 0, 7, 30 + p.width/3, 2*p.width/3 - 2);
        y = p.map(day_data, min_week, max_week, 0, p.height-20);
        bar_width = (p.width/3 - 40)/14;        
        if(i == 0){
            last_day_data = week_data["1"].data[Object.keys(week_data["1"].data)[6]];
            last_x = p.map(6, 0, 7, 30, p.width/3 - 2);
            last_y = p.map(last_day_data, min_week, max_week, 0, p.height-20);
        }
        else{
            last_day_data = week_data["2"].data[Object.keys(week_data["2"].data)[i-1]];
            last_x = p.map(i-1, 0, 7, 30 + p.width/3, 2*p.width/3 - 2);
            last_y = p.map(last_day_data, min_week, max_week, 0, p.height-20);
        }
        p.push();
        p.scale(1, -1);
        p.translate(0, -p.height);
        p.noFill()
        p.stroke("#4087F3")
        p.bezier(last_x +bar_width/2 , last_y,
                (last_x + x)/2 + bar_width/2, last_y,
                (last_x + x)/2 + bar_width/2, y,             
                x + bar_width/2 , y);
        p.strokeWeight(0)
        p.fill("#0000ff55")
        
        
        p.fill("#4087F344");
        p.strokeWeight(0);
        p.beginShape()
        p.vertex(last_x + bar_width/2 , 0);
        for (let i = 0; i <= 10; i++) {
            let t = i / 10;
            let x_ = p.bezierPoint(last_x +bar_width/2, (last_x + x)/2, (last_x + x)/2, x + bar_width/2, t);
            let y_ = p.bezierPoint(last_y, last_y, y, y, t);
            p.vertex(x_, y_);

            if(p.mouseX > x_ - (0.15*bar_width) && p.mouseX < x_ + (0.15*bar_width) && p.mouseY < p.height){
                if(p.frameCount % 50 < 10){
                    p.circle(p.mouseX, y_, 12)
                }
                if(p.frameCount % 30 < 10){
                    p.circle(p.mouseX, y_, 10)
                }
                p.circle(p.mouseX, y_, 8)
            }

          }
        p.vertex(x + bar_width/2 , 0);
        p.endShape()

        //p.rect(x , 0 , bar_width , y);
        p.pop();
        p.stroke(255)
        p.fill(0)
        p.text(Object.keys(week_data["1"].data)[i] , x ,p.height-5)
    

        //get the data for each day from 3 week
        day_data = week_data["3"].data[Object.keys(week_data["3"].data)[i]];
        x = p.map(i, 0, 7, 30 + 2 * p.width/3, p.width - 2);
        y = p.map(day_data, min_week, max_week, 0, p.height-20);
        bar_width = (p.width/3 - 40)/14;
        if(i == 0){
            last_day_data = week_data["2"].data[Object.keys(week_data["2"].data)[6]];
            last_x = p.map(6, 0, 7, 30 + p.width/3, 2*p.width/3 - 2);
            last_y = p.map(last_day_data, min_week, max_week, 0, p.height-20);
        }
        if(i > 0){
            last_day_data = week_data["3"].data[Object.keys(week_data["3"].data)[i-1]];
            last_x = p.map(i-1, 0, 7, 30 + 2 * p.width/3, p.width - 2);
            last_y = p.map(last_day_data, min_week, max_week, 0, p.height-20);
        }

        p.push();
        p.scale(1, -1);
        p.translate(0, -p.height);
        p.noFill()
        p.stroke("#4087F3")
        p.bezier(last_x +bar_width/2 , last_y,
                (last_x + x)/2 + bar_width/2, last_y,
                (last_x + x)/2 + bar_width/2, y,             
                x + bar_width/2 , y);
        p.strokeWeight(0)
        p.fill("#0000ff55")
        
        
        p.fill("#4087F344");
        p.strokeWeight(0);
        p.beginShape()
        p.vertex(last_x + bar_width/2 , 0);
        for (let i = 0; i <= 15; i++) {
            let t = i / 15;
            let x_ = p.bezierPoint(last_x +bar_width/2, (last_x + x)/2, (last_x + x)/2, x + bar_width/2, t);
            let y_ = p.bezierPoint(last_y, last_y, y, y, t);
            p.vertex(x_, y_);
           
            if(p.mouseX > x_ - (0.15*bar_width) && p.mouseX < x_ + (0.15*bar_width) && p.mouseY < p.height){
                if(p.frameCount % 50 < 10){
                    p.circle(p.mouseX, y_, 12)
                }
                if(p.frameCount % 30 < 10){
                    p.circle(p.mouseX, y_, 10)
                }
                p.circle(p.mouseX, y_, 8)
            }

          }
        p.vertex(x + bar_width/2 , 0);
        p.endShape()
        //p.rect(x , 0 , bar_width , y);
        p.pop();

        p.stroke(255)
        p.fill(0)
        p.text(Object.keys(week_data["1"].data)[i] , x ,p.height-5)

    }
    if(p.mouseY < p.height){
    p.rect(0 , p.mouseY-6,25,15);
    p.fill(255)
    p.stroke(0)
    y_data = p.map(p.mouseY , 20 , p.height , max_week , min_week)
    y_data = Math.floor(y_data)
    p.text(y_data , 4 , p.mouseY+4)

    p.strokeWeight(0.5)
    p.drawingContext.setLineDash([5,5])
    p.line(30,p.mouseY , p.width-20 , p.mouseY)
    p.line(p.mouseX,0 , p.mouseX , p.height)
    p.drawingContext.setLineDash([1,1])
    }
}



// streak graph 
let dataGraph3 = [
    [2,2,3,0,0,3,2], [1,4,3,0,1,3,2], [0,0,0,0,0,0,0], [0,2,3,0,1,3,1],
    [1,2,2,0,1,3,0], [1,3,3,0,1,3,2], [4,4,3,2,1,3,2],[1,2,3,4,1,3,4],
    [1,2,2,0,1,3,2], [0,2,3,0,0,1,0], [1,0,3,0,1,3,2],[1,0,1,1,1,3,2],
    [0,3,4,4,4,1,0], [1,2,3,0,0,3,2], [0,2,2,0,0,3,2],[1,2,3,0,1,3,3],
    [1,4,2,0,1,3,2], [3,2,4,3,0,3,2], [1,2,3,1,1,3,2],[0,2,3,4,4,2,2],
    [1,1,1,0,1,3,0], [1,2,3,0,0,2,0], [1,1,3,2,1,3,0],[1,2,3,0,1,3,0],
    [4,2,0,3,0,2,2], [0,1,2,0,1,3,2], [0,2,2,4,1,2,2],[1,0,3,0,1,3,2],
    [0,2,0,4,1,3,2], [1,4,1,0,3,3,2], [1,2,3,1,1,3,2],[0,2,3,1,0,3,1],
    [1,2,2,0,1,3,2], [0,0,0,3,0,0,0], [3,3,3,2,0,1,2],[0,0,3,1,0,1,2],
    [3,3,3,4,2,2,0], [2,2,3,0,1,3,2], [1,2,3,0,1,3,2],[4,4,4,4,4,0,0],
]
// new p5( area_graph ,"graph2" );
let [graph3Width, graph3Height] = [0, 0];
function streak_graph(p){
    p.setup = function(){
        p.createCanvas(755, 200)
        p.background(255)
    }
    p.draw = function(){
        p.background(255);
        drawRects(p)
    }

}

let year_here = 2021;
let selected_date = ""
let date_position = [-20 , -20]
let selected_value = 0

function drawRects(p){
    p.stroke(getcolor(0))
    p.noFill()
    p.rect(10,10,730,165)
    for(let i = 0 ; i < 53 ; i++){
        let j = i * 13
        j += 40
        p.fill(getcolor(0))
        p.noStroke()
        for(k = 0 ; k < 7 ; k++){
        if((i*7)+k < 366){
            if(i < dataGraph3.length && k < dataGraph3[i].length){
                p.fill(getcolor(dataGraph3[i][k]))
            }else{
                p.fill(getcolor(5))
            }
            p.rect(j,30+15*k , 10 , 10) //1

        if(p.mouseX > j && p.mouseX < j+13 && p.mouseY > 30+15*k && p.mouseY < 30+15*k+10){
            let date = new Date("2020-01-01")
            let timeInMillisecondPassed = date.getTime() + (((i*7)+k)*24*60*60*1000)
            let newDate = new Date(timeInMillisecondPassed)
            // format date to dd-mm-yy
            let date_string = newDate.getDate() + "-" + (newDate.getMonth()+1) + "-" + newDate.getFullYear()
             selected_date = date_string
             date_position = [j,30+15*k]
             if(i < dataGraph3.length && k < dataGraph3[i].length){
              selected_value = dataGraph3[i][k]
             }else{
                 selected_value = "N/A"
             }
        }
        }
        
        }
        p.stroke(255)
        p.textSize(12)
        p.fill(66)
        p.text("Less" , 580 , 154)
        p.fill(getcolor(0))
        p.rect(610, 145 , 10 , 10) // indicator light
        p.fill(getcolor(1))
        p.rect(623, 145 , 10 , 10)
        p.fill(getcolor(2))
        p.rect(636, 145 , 10 , 10)
        p.fill(getcolor(3))
        p.rect(649, 145 , 10 , 10)
        p.fill(getcolor(4))
        p.rect(662, 145 , 10 , 10)
        p.fill(66)
        p.text("More" , 675 , 154)
        p.textSize(10)
        p.text("Mon" , 15 , 38)
        p.text("Wed" , 15 , 68)
        p.text("Fri" , 15 , 98)
        p.text("Sun" , 15 , 128)

        
    }
    if(p.mouseX > 20 && p.mouseX < 740 && p.mouseY > 10 && p.mouseY < 135){
    p.rectMode(p.CENTER)
    p.rect(date_position[0], date_position[1]-18 , 120 , 30 , 10)
    // draw a triangle
    p.noStroke()
    p.triangle(date_position[0]-6, date_position[1]-5 , date_position[0]+12, date_position[1]-5 , date_position[0]+3, date_position[1]+2)
    p.rectMode(p.CORNER)
    p.stroke(0)
    p.fill(255)
    p.text(selected_date , date_position[0]-45, date_position[1]-15)
    p.text(selected_value + " sell" , date_position[0]+15, date_position[1]-15)
    }
}

function getcolor(colorId){
    switch(colorId){
        case 0:
            return "#C4C4C4"
        case 1:
            return "#BBCDE8"
        case 2:
            return "#8AB3F0"
        case 3:
            return "#5998FA"
        case 4:
            return "#0088FF"
        default:
            return "#F4F4F4"
    }

}




// new p5( area_graph ,"graph2" );

new p5( streak_graph ,"graph3" );
window.addEventListener('DOMContentLoaded', () =>{
    new p5( base_line_graph ,"analytics_graph_1" );
})

function getDimensions(layout_name){
    Width = document.getElementById(layout_name).getBoundingClientRect().width;
    Height = document.getElementById(layout_name).getBoundingClientRect().height;
    return [Width, Height];
}