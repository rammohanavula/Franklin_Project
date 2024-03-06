/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) {
    table.append(thead);
  }
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
}



async function createTableHeader(table){
    let tr=document.createElement("tr");
    let sno=document.createElement("th");sno.appendChild(document.createTextNode("S.No"));
    let name=document.createElement("th");name.appendChild(document.createTextNode("Name"));
    let location=document.createElement("th");location.appendChild(document.createTextNode("Location"));
    let country=document.createElement("th");country.appendChild(document.createTextNode("Country"));
    let abbr=document.createElement("th");abbr.appendChild(document.createTextNode("Abbreviation"));
    tr.append(sno);tr.append(name);tr.append(location);tr.append(country);tr.append(abbr);
    table.append(tr);
}
async function createTableRow(table,row,i){
    let tr=document.createElement("tr");
    let sno=document.createElement("td");sno.appendChild(document.createTextNode(i));
    let name=document.createElement("td");name.appendChild(document.createTextNode(row.Name));
    let location=document.createElement("td");location.appendChild(document.createTextNode(row.Location));
    let country=document.createElement("td");country.appendChild(document.createTextNode(row.Country));
    let abbr=document.createElement("td");abbr.appendChild(document.createTextNode(row.Abbreviation));
    tr.append(sno);tr.append(name);tr.append(location);tr.append(country);tr.append(abbr);
    table.append(tr);
}

async function createSelectMap(jsonURL){
    const optionsMap=new Map();
    const { pathname } = new URL(jsonURL);

    const resp = await fetch(pathname);
    optionsMap.set("all", "All Grounds"); optionsMap.set("australia", "Australia"); optionsMap.set("england", "England"); optionsMap.set("bangladesh", "Bangladesh"); optionsMap.set("india", "India"); optionsMap.set("newzeland", "Newzeland"); optionsMap.set("pakisthan", "Pakisthan"); optionsMap.set("southafrika", "SouthAfrika"); optionsMap.set("srilanka", "Srilanka"); optionsMap.set("uae", "UAE");
    const select=document.createElement('select');
    select.id = "region";
    select.name="region";
    optionsMap.forEach((val,key) => {
        const option = document.createElement('option');
        option.textContent = val;
        option.value = key;
        select.append(option);
      });
     
     const div=document.createElement('div'); 
     div.classList.add("region-select");
     div.append(select);
    return div;
}
async function createTable(jsonURL,val) {

    let  pathname = null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname= new URL(jsonURL);
    }
    
    const resp = await fetch(pathname);
    const json = await resp.json();
    console.log("=====JSON=====> {} ",json);
    
    const table = document.createElement('table');
    createTableHeader(table);
    json.data.forEach((row,i) => {

        createTableRow(table,row,(i+1));

      
    });
    
    return table;
}    

export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    const parientDiv=document.createElement('div');
    parientDiv.classList.add('contries-block');

    if (countries) {
        parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createTable(countries.href,null));
        countries.replaceWith(parientDiv);
        
    }
    const dropdown=document.getElementById('region');
      dropdown.addEventListener('change', () => {
        let url=countries.href;
        if(dropdown.value!='all'){
            url=countries.href+"?sheet="+dropdown.value;
        }
        const tableE=parientDiv.querySelector(":scope > table");
        let promise = Promise.resolve(createTable(url,dropdown.value));
        promise.then(function (val) {
            tableE.replaceWith(val);
        });
      });
  }
