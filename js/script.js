
var SERVER_ADDRESS = 'http://localhost:8081/'

function request_orch(url)
{
  t = $.ajax({
  url: url,
  async: false,
  error: function(jqXHR, textStatus, errorThrown){
    if (textStatus != 'parsererror'){
      alert("Connection Error. Try Again");

      return null;
    }
  },
  timeout: 3000});
  return t.responseText;
}

function call911()
{
  r = request_orch(SERVER_ADDRESS + 'orchestrator/call/911');
  j = JSON.parse(r);
  if (j == 1)
  {
    alert('POLICE CALLED');
  }
  else {
    alert('error');
  }
}

function update()
{
  $('.rows').remove();
  initialize()
}

function initialize()
{
  r = request_orch('data/allRooms.json');
  j = JSON.parse(r); 
  //TODO
  //instead of using JSON.parse on r, directly use t.responseJSON instead of t.responseText

  /*
  j structure : 
  0: Array(6) [ "1", "25", "36", "58", "open", "close"]
  1: Array(6) [ "2", "58", "14", … ]
  ​...
  */
  tab = document.getElementById("tab");
  for (var i = 0 ; i<j.length ; i++) //replace 2 by j.length
  {
    row = tab.insertRow();
    row.className = "rows";

    // Go through the current room and put all sensor/actuator value inside the current row
    for (var cellID = 0 ; cellID<j[i].length ; cellID++)
    {
      cell = row.insertCell();
      cell.innerText = j[i][cellID]; //insert value of the sensor inside the cell
      if (cellID === 4)
      {
        cell = row.insertCell();
        button = document.createElement("button");
        button.innerText = "Change"
        button.className = "btn btn-primary"
        button.name = "w" + j[i][0]
        button.onclick = function(){changeWindow(this)}
        cell.appendChild(button);
      }
      if (cellID === 5)
      {
        cell = row.insertCell();
        button = document.createElement("button");
        button.innerText = "Change"
        button.className = "btn btn-primary"
        button.name = "d" + j[i][0]
        button.onclick = function(){changeDoor(this)}
        cell.appendChild(button);
      }
    }

    cell = row.insertCell();
    roomID = i +1 
    cell.innerHTML = '<div id="graphSensor' + roomID + '"></div>'
    ajaxGraph("data/tox" + roomID +".json", "graphSensor" + roomID)

    //TODO
    //Implement on the same graph (just repeat, no big trouble) the radioactivity/EM, we need to implement the java


  }
}


function ajaxGraph(url, div){

  resp = $.ajax({
  url: url,
  async: false,
  error: function(jqXHR, textStatus, errorThrown){
    if (textStatus != 'parsererror'){
      alert("Connection Error. Try Again");

      return null;
    }
  },
  timeout: 3000});


  console.log(div)
  datas = resp.responseJSON
  dataFormatted = {}
  for(key in datas) { // "in" return keys
    temp = key.split("T")[1]
    dataFormatted[temp] = datas[key]
  }

  // Plot
    var layout = {
      title: "Tox room" + div,
      width:600,
      height:250,
      font: {
        size: 18
      },
      xaxis: {type: 'category', title: 'Time'},
      yaxis: {range:[0,100]},

     };

     x_data = [];
     y_data = [];

    for(x in dataFormatted){
      x_data.push(parseInt(x));
      y_data.push(dataFormatted[x]);
    } 

    var trace1 = {
      x: x_data,
      y: y_data
    };
    Plotly.newPlot(div, [trace1], layout, {responsive:true});


}

function plot(div,datas,title){
		var layout = {
		  title: title,

      autosize:true,
		  font: {
		  	size: 18
      },
      xaxis: {type: 'category', title: 'Number of room'},
      yaxis: {range:[0,100]},

	 	 };

	 	 x_data = [];
	 	 y_data = [];

		for(x in datas){
			x_data.push(parseInt(x));
			y_data.push(datas[x]);
		} 
		console.log(x_data);
		console.log(y_data);
		var trace1 = {
			x: x_data,
			y: y_data,
      mode: 'markers',
      type: 'bar'
		};
		Plotly.newPlot(div, [trace1], layout, {responsive:true});
	}

  function printGraph()
  {
    tab = document.getElementById("tab");
    rows = tab.getElementsByClassName("rows");
    electro = []
    tox = []
    radio = []
    for (var i = 0 ; i<rows.length ; i++)
    {
      electro[i] = rows[i].children[1].innerText
      tox[i] = rows[i].children[2].innerText
      radio[i] = rows[i].children[3].innerText
    }
    console.log(electro)
    plot(document.getElementById("electro"),electro, "Electromagnety per room");
    plot(document.getElementById("tox"),tox, "Toxicity per room");
    plot(document.getElementById("radio"),radio, "Radioactivity per room");
  }

function changeDoor(button)
{
  number = button.name.substr(1)

  url = 'http://localhost:8081/orchestrator/door/'

  j = request_orch(url.concat(number,'/status'));
  if (j === 'open')
  {
    req = request_orch(url.concat(number,'/close'));
    json = JSON.parse(req);
  }
  else {
    req = request_orch(url.concat(number,'/open'));
    json = JSON.parse(req);
  }

  if (json == 1)
  {
    alert('Change made')
  }
  else {
    alert('Connection error')
  }
}

function changeWindow(button)
{
  number = button.name.substr(1)

  url = 'http://localhost:8081/orchestrator/window/'

  j = request_orch(url.concat(number,'/status'));
  if (j === 'open')
  {
    req = request_orch(url.concat(number,'/close'));
    json = JSON.parse(req);
  }
  else {
    req = request_orch(url.concat(number,'/open'));
    json = JSON.parse(req);
  }

  if (json == 1)
  {
    alert('Change made')
  }
  else {
    alert('Connection error')
  }
}

function disableCB()
{
  r = request_orch('http://localhost:8081/orchestrator/disableCB');
  j = JSON.parse(r);
  if (j == 1)
  {
    alert('CB disabled');
  }
  else {
    alert('Connection error');
  }
}

function unbunkerisation()
{
  r = request_orch('http://localhost:8081/orchestrator/unbunkerisation');
  j = JSON.parse(r);
  if (j == 1)
  {
    alert('Building unbunkerised');
  }
  else {
    alert('Connection error');
  }
}

function testsms()
{
  request_orch('http://localhost:8081/orchestrator/testsms/');
}



  var a = {"2503":"50","2502":"45","2499":"21","2501":"22","2500":"15"}
