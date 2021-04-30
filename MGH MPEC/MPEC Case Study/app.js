/* ************** MODEL *************** */
/* DATA INPUT / MANIPULATION / ANALYSIS */
/* ************************************ */
class Model {
    static REGEXP = new RegExp(
        '^BEGIN PATIENT (?<num>[0-9]+)[\n\r\s]*.*?init age: (?<age>[0-9]+) [\n\r\s]*?' +
        '.*?LMs (?<LMs>[0-9]+\.[0-9]+) .*?[\$] (?<CTT>[0-9]*)', 'gms');

    constructor() {
        this.fileIn = null;
        this.isValidFile = false;
        this.patientData = new Map();
    }


    /*  Setup model instance
        file: reference to trace file   */
    init(file) {
        this.fileIn = file;

        this._validate();
        this._readFile();
    }


    /*  Validate (approximated) MIMEtype of selected file   */
    async _validate() {
        try {
            const reader = new FileReader();
            reader.onload = async ( ) => {
                this.isValidFile = await Model._hasCorrectMIMEcode(reader.result);
            }

            await reader.readAsArrayBuffer(this.fileIn);

        } catch (err) {
            this.isValidFile = false;
            this.fileIn = null;
            throw `Error - File Load Failure: \n${err}`;
        }
    }


    /*  Return true if object MIMEtype equals expected value
        buffer: input file as ArrayBuffer                       */
    static _hasCorrectMIMEcode(buffer) {
        const data = new Array(...new Uint8Array(buffer).subarray(0, 4))
            .map( el => el.toString(16).toUpperCase() )
            .join('');

        return data === '3D3D3D3D';
    }


    /*  Parse trace file for required values
        this.patientData = Map -> { patient number: [init age, LMs, CTT] }  */
    async _readFile() {
        try {
            const reader = new FileReader();
            reader.onload = async () => { 
                if (!this.isValidFile) {
                    alert('Invalid File');      // how to promote exception from inside lambda's promise?
                    this.fileIn = null;
                    this.isValidFile = false;
                }

                await [...reader.result.matchAll(Model.REGEXP)]
                    .forEach( el => {[
                        this.patientData.set(String(el.groups.num), 
                            [ parseInt(el.groups.age),
                              parseFloat(el.groups.LMs),
                              parseFloat(el.groups.CTT) ]
                )]});
            };

            await reader.readAsText(this.fileIn);

        } catch (err) {
            this.isValidFile = false;
            this.fileIn = null;
            throw `Error - File Load Failure: \n${err}`;
        }
    }


    /*  Return array of averages used to determine summary statistics  */
    getAvgs() {
        // extract values then calculate cost-per-year & age at death for each patient
        const LMs = [], CTT = [], CPY = [], AaD = [];
        for (let [k, v] of this.patientData) {
            LMs.push(v[1]);
            CTT.push(v[2]);
            CPY.push((v[2] / v[1]) * 12);   // cost per year
            AaD.push(v[0] + v[1]);          // age at death
        }

        // return array of averages: [LMs, CTT, CPY, AaD]
        return [ LMs.reduce( (a, b) => (a + b), 0) / LMs.length, // "average number of months for all patients in the file"
                 CTT.reduce( (a, b) => (a + b), 0) / CTT.length, // "average costs for all patients"
                 CPY.reduce( (a, b) => (a + b), 0) / CPY.length, // "average of (CTT / LMs) * 12 for all patients"
                 AaD.reduce( (a, b) => (a + b), 0) / AaD.length  // "average age at death for all patients"
        ];
    }
}
