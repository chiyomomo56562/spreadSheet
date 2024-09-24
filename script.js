const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const rows = 10;
const cols = 10;
const spreadsheet = [];

class Cell{
    constructor(isHeader, disabled, data, row, col, rowName, colName, active = false) {
            this.isHeader = isHeader;
            this.data = data;
            this.disabled = disabled;
            this.row = row;
            this.col = col;
            this.rowName = rowName;
            this.colName = colName;
            this.active = active;
        }
}


function initSpreadsheet() {
    for(let i=0;i<rows;i++) {
        let spreadsheetRow = [];
        for(let j=0;j<cols;j++) {
            let cellData = '';
            let isHeader = false;

            //1열을 숫자로
            if(j===0){
                cellData = i;
                isHeader = true;
            }
            //1행을 알파벳으로
            if(i===0){
                cellData = '@'.charCodeAt() + j;
                cellData = String.fromCharCode(cellData);
                isHeader = true;
            }
            //1행 1열은 아무 값도 안갖는다.
            if(cellData===0 || cellData==='@'){
                cellData = '';
            }

            const rowName = i;
            const colName = String.fromCharCode(64 + j);

            //객체 생성
            const cell = new Cell(isHeader, isHeader, cellData, i, j , rowName, colName, false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    console.log(spreadsheet);
}

function createCellEl(cell) {
    const cellEl = document.createElement("input");
    cellEl.classList.add("cell");
    cellEl.id = 'cell_' + cell.row + cell.col;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader){
        cellEl.classList.add("header");
    }

    // 이거 화살표 빼면 안됨.
    cellEl.onclick = () => handleCellClick(cell);
    // 셀안의 컨텐츠가 바뀌었을때 발생하는 이벤트
    cellEl.onchange = (e) => handleOnchange(e.target.value, cell);
    return cellEl;
}

function handleOnchange(value, cell) {
    //셀의 data에 내용을 집어 넣는다.
    cell.data = value;
}


function handleCellClick(cell){
    clearActive(); 
    const colHeader = spreadsheet[0][cell.col];
    const rowHeader = spreadsheet[cell.row][0];
    const colHeaderEl = getElFromRowCol(colHeader.row, colHeader.col);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.col);

    // console.log(rowHeaderEl)
    // 액티브 클래스를 추가해 애니메이션을 재생시킨다.
    rowHeaderEl.classList.add("active");
    colHeaderEl.classList.add("active");

    document.querySelector("#cell-status").innerHTML = cell.colName + ""+cell.rowName;
}

function clearActive() {
    //이전의 하이라이트 된 부분을 지워주는 함수
    const activeCells = document.querySelectorAll(".active");
    // 클래스를 제거해 css가 작동하지 않도록한다.
    activeCells.forEach(cell => cell.classList.remove("active"));
}

function getElFromRowCol(row, col) {
    return document.querySelector("#cell_"+row+col);
}

function drawSheet() {
    for(let i=0; i<spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.classList.add("cell-row");

        for (let j=0; j<spreadsheet[i].length; j++) {
            //make cell element
            const cell = spreadsheet[i][j];
            spreadSheetContainer.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}

exportBtn.onclick = function(e) {
    let csv ="";
    for (let i=0;i<spreadsheet.length;i++) {
        if (i===0) continue;
        csv += 
            spreadsheet[i]
                .filter((item) => !item.isHeader)
                .map((item) =>item.data)
                .join(',') +"\r\n";
    }
    console.log(csv);
    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);

    const a =document.createElement("a");
    a.href = csvUrl;
    a.download = "spreadsheet.csv";
    a.click();
}

initSpreadsheet();
drawSheet();