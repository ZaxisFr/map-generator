const View = {
    // ** Definition des refs
    canvasContainer: undefined,
    canvasElement: undefined,

    rowField: undefined,
    columnField: undefined,

    generateButton: undefined,

    canvasZoomSlider: undefined,

    elevationFrequencySlider: undefined,

    ileCheckBox: undefined,
    ileSize: undefined,
    ileLitCheckBox: undefined,

    townCheckBox: undefined,
    townFrequency: undefined,


    // ** Listeners du bouton generer.
    onUpdateGenerate() {
        Controller.generate().catch(r => alert("Erreur lors de l'execution" + r));

    },

    // ** Listeners du changement d'un paramettre.
    onUpdateParam() {
        Controller.setNbRow(this.rowField.value);
        Controller.setNbColumn(this.columnField.value);
        Controller.setElevationFrequency(this.elevationFrequencySlider.value);
        Controller.setIle(this.ileCheckBox.checked);
        Controller.setIleSize(this.ileSize.value);
        Controller.setTowns(this.townCheckBox.checked);
        Controller.setTownsFrequency(this.townFrequency.value);
        Controller.setIleLitto(this.ileLitCheckBox.checked);

        Controller.generate().then();
    },


    // ** Render methods
    printTile(tileMap) {
        const HEXTILES_IMAGE = new Image();
        HEXTILES_IMAGE.src = 'src/hextiles.png';
        let CnvCtx = this.canvasElement.getContext('2d');
        Promise.all([
            new Promise((resolve) => {
                HEXTILES_IMAGE.addEventListener('load', () => {
                    resolve();
                });
            })
        ])
            .then(() => {
                CnvCtx.clearRect(0, 0, CnvCtx.canvas.width, CnvCtx.canvas.height);
                CnvCtx.scale(0.5, 0.5);
                for (let y = 0; y < tileMap.rowNumber; y++) {
                    for (let x = 0; x < tileMap.columnsNumber; x++) {
                        let posx = x * 48;
                        if (y % 2 === 0) {
                            posx += 24;
                        }
                        CnvCtx.drawImage(HEXTILES_IMAGE, utils.tileToPixel(tileMap.result.tile[y][x]).x, utils.tileToPixel(tileMap.result.tile[y][x]).y, 32, 48, posx, 14 * y, 32, 48);
                    }
                }


                // ** Affichage du noms des villes
                for (let i = 0; i < tileMap.result.haveTowns.length; i++) {
                    let town = tileMap.result.haveTowns[i];
                    let townName = tileMap.result.townsNames[i];

                    let pos = utils.tileToPixelOnCanvas(new Point(town.x,town.y));

                    CnvCtx.font = '20px serif';
                    CnvCtx.fillText(townName, pos.x, pos.y);

                }

                // ** Display paths
                for (let i = 0; i < tileMap.result.foundedRiver.length; i++) {
                    let path = tileMap.result.foundedRiver[i];
                    for (let j = 0; j < path.length - 1; j++) {

                        // Conversion des Coordonées du point 1
                        let pos = utils.tileToPixelOnCanvas(path[j].point);
                        let posNext = utils.tileToPixelOnCanvas(path[j+1].point);

                        CnvCtx.beginPath();
                        CnvCtx.lineWidth = 8;
                        CnvCtx.strokeStyle = '#249fff';
                        let hexCenter = utils.getHexCenter(new Point(pos.x, pos.y));
                        CnvCtx.moveTo(hexCenter.x, hexCenter.y);

                        hexCenter = utils.getHexCenter(new Point(posNext.x, posNext.y));
                        CnvCtx.lineTo(hexCenter.x, hexCenter.y);
                        CnvCtx.stroke();
                    }

                }
                // ** Display paths
                for (let i = 0; i < tileMap.result.foundedPath.length; i++) {
                    let path = tileMap.result.foundedPath[i];
                    for (let j = 0; j < path.length - 1; j++) {

                        // Conversion des Coordonées du point 1
                        let pos = utils.tileToPixelOnCanvas(path[j].point);
                        let posNext = utils.tileToPixelOnCanvas(path[j+1].point);

                        CnvCtx.strokeStyle = '#000000';
                        CnvCtx.beginPath();
                        CnvCtx.lineWidth = 4;
                        let hexCenter = utils.getHexCenter(pos);
                        CnvCtx.moveTo(hexCenter.x, hexCenter.y);

                        hexCenter = utils.getHexCenter(posNext);
                        CnvCtx.lineTo(hexCenter.x, hexCenter.y);
                        CnvCtx.stroke();
                    }

                }
                CnvCtx.scale(2,2);
            });
    }

}
// ** Init
document.addEventListener('DOMContentLoaded', () => {

    // Définition des valeurs
    View.canvasContainer = document.getElementById('drawing-container');
    View.canvasElement = document.getElementById("drawing-area");
    View.columnField = document.getElementById('columns');
    View.rowField = document.getElementById('row');
    View.elevationFrequencySlider = document.getElementById('frequency');
    View.ileCheckBox = document.getElementById('ileCheckBox');
    View.ileSize = document.getElementById('ileSize');
    View.ileLitCheckBox = document.getElementById('lito');
    View.townCheckBox = document.getElementById('villes');
    View.townFrequency = document.getElementById('townFreq');

    // Bind des EventListeners
    document.getElementById('generate').addEventListener('click', View.onUpdateGenerate.bind(View));
    document.getElementById('row').addEventListener('change', View.onUpdateParam.bind(View));
    document.getElementById('columns').addEventListener('change', View.onUpdateParam.bind(View));
    document.getElementById('zoom').addEventListener('input', View.onUpdateParam.bind(View));
    document.getElementById('frequency').addEventListener("input", View.onUpdateParam.bind(View));
    document.getElementById('ileCheckBox').addEventListener('change', View.onUpdateParam.bind(View));
    document.getElementById('ileSize').addEventListener('change', View.onUpdateParam.bind(View));
    document.getElementById('lito').addEventListener('change', View.onUpdateParam.bind(View));
    document.getElementById('villes').addEventListener('change', View.onUpdateParam.bind(View));
    document.getElementById('townFreq').addEventListener('change', View.onUpdateParam.bind(View));


    Controller.init(View.rowField.value, View.columnField.value, View.elevationFrequencySlider.value);
    View.onUpdateParam();
});
