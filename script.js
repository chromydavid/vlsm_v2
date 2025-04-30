var login_array = [
  ["admin","5321654987"],
  ["Leo","93176248"]
]

function bubble_sort(arr) {
  let n = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    n--;
  } while (swapped);
  return arr;
}


//This function generates 3 columns of n rows of input boxes for host count of each LAN
function generate_network_size_input_boxes(){
  const number_of_networks = parseInt(document.getElementById("number_of_networks").value);
  const container = document.getElementById("network_size_input_boxes_container");
  container.innerHTML = "";

  for (let i = 1; i <= number_of_networks ; i++ ){
      const row = document.createElement("div");
      row.className = "input_network_size_row";

      const box = document.createElement("input");
      box.type = "number";
      box.id = "network_"+i+"_size" ; // network_5_size 
      box.placeholder = "hostů";
      box.className = "input_network_size_box"

      const box_name = document.createElement("p");
      box_name.textContent = "LAN "+i+": ";

      row.appendChild(box_name);
      row.appendChild(box);
      container.appendChild(row);
  }
}
for (let i = 0 ; i< login_array.length; i++){
  let str = login_array[i][1];
  let hashed = str.split("").reverse().join("");
  login_array[i][1] = hashed;
}

//This function generates the final table for VLSM
function calculate_vlsm_table(){
  const container = document.getElementById("vlsm_table_container");
  container.innerHTML = "";
  const number_of_networks = parseInt(document.getElementById("number_of_networks").value);
  const table = document.createElement("table");
  table.className = "vlsm_table";

  //create the first row (info about the columns)
  const r = document.createElement("tr");
  const a = document.createElement("td");
  a.textContent = "LAN";
  a.className = "table_box_text";
  const b = document.createElement("td");
  b.textContent = "Počet hostů";
  b.className = "table_box_text";
  const c = document.createElement("td");
  c.textContent = "Adresa sítě";
  c.className = "table_box_text";
  const d = document.createElement("td");
  d.textContent = "Rozsah";
  d.className = "table_box_text";
  const e = document.createElement("td");
  e.textContent = "Broadcast";
  e.className = "table_box_text";
  const f = document.createElement("td");
  f.textContent = "Maska";
  f.className = "table_box_text";
  r.appendChild(a);
  r.appendChild(b);
  r.appendChild(c);
  r.appendChild(d);
  r.appendChild(e);
  r.appendChild(f);
  table.appendChild(r);


  //Solve the network adresses
  const bases_of_2 = [2,4,8,16,32,64,128,256]; 
  var lan_host_count_original_array = [];
  var lan_host_count_sorted_array = [];
  var lan_size_bitsize_adr_br = []; //is sorted as above and stores [size, bitsize ,net adres, broadcast]
  var current_net_adr = 0;
  for (let j = 0 ; j < number_of_networks ; j++) {
    lan_host_count_original_array.push(parseInt(document.getElementById("network_"+(j+1)+"_size" ).value) +2);
    lan_host_count_sorted_array.push(parseInt(document.getElementById("network_"+(j+1)+"_size" ).value) + 2);
  }
  //Sort duplicate of array
  var lan_host_count_sorted_array = bubble_sort(lan_host_count_sorted_array);

  for (let x = number_of_networks-1 ; x >= 0 ; x--) {
    for (let y = 0; y < 8 ; y++){
      if (lan_host_count_sorted_array[x]<=bases_of_2[y]){
        lan_size_bitsize_adr_br.unshift([lan_host_count_sorted_array[x],bases_of_2[y],current_net_adr,current_net_adr+bases_of_2[y]-1]);
        current_net_adr += bases_of_2[y]; 
        break;
      }
    }
  }


  //for every Lan network 
  for (let i = 0 ; i < number_of_networks ; i++) {
    const row = document.createElement("tr");

    //Lan name
    const name = document.createElement("td");
    name.textContent = "LAN "+(i+1);
    name.className = "table_box_text";

    //Lan host count
    const hosts = document.createElement("td");
    hosts.textContent = document.getElementById("network_"+(i+1)+"_size" ).value;
    hosts.className = "table_box_text";


    //Lan network first 3 octets
    var network = ""+parseInt(document.getElementById("ipv41").value)+"."+parseInt(document.getElementById("ipv42").value)+"."+parseInt(document.getElementById("ipv43").value)+".";
    //Lan network address
    const network_adr = document.createElement("td");
    network_adr.className = "table_box_text";
    //Lan broadcast
    const broadcast = document.createElement("td");
    broadcast.className = "table_box_text";
    //Lan range
    const range = document.createElement("td");
    range.className = "table_box_text";
    //Lan mask
    const mask = document.createElement("td");
    mask.className = "table_box_text";

    for (let x = 0 ; x < lan_size_bitsize_adr_br.length ; x++) {
      const network_size =  parseInt(document.getElementById("network_"+(i+1)+"_size" ).value);
      if (network_size+2 == lan_size_bitsize_adr_br[x][0]){
        network_adr.textContent = network+""+lan_size_bitsize_adr_br[x][2];
        broadcast.textContent = network+""+lan_size_bitsize_adr_br[x][3];
        range.textContent= ""+(lan_size_bitsize_adr_br[x][2]+1)+"-"+(lan_size_bitsize_adr_br[x][3]-1);
        mask.textContent="255.255.255."+(256-lan_size_bitsize_adr_br[x][1]);
        lan_size_bitsize_adr_br[x][0]=-9999999999;
        break;
      }
    }




  
    

    //appending all the boxes into one row
    row.appendChild(name);
    row.appendChild(hosts);
    row.appendChild(network_adr);
    row.appendChild(range);
    row.appendChild(broadcast);
    row.appendChild(mask);
    table.appendChild(row);
  }
  //finally append the full table into div
  container.appendChild(table);
}

function check_for_calculate_vlsm_table(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  var try_count = 0;
  const container = document.getElementById("invalid_name_or_username");
  container.innerHTML = "";
  for (let i = 0 ; i < login_array.length ; i++){
    try_count++ ;
    if ((username == login_array[i][0]) && (password == login_array[i][1])) {
      calculate_vlsm_table();
      break;
    }else if (try_count== (login_array.length)){
      const a = document.createElement("p");
      a.className = "error_text"
      a.textContent = "Špatné jméno nebo heslo !!!";
      container.appendChild(a); 
    }
  }
  
}