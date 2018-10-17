// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// export const environment = {
//     production: false,
//     hostname: "http://localhost:8080",
//     // configFile: 'assets/config.json'
//     // hostname: "http://139.162.53.218:8080/osdec-0.1"
//     // hostname: "http://spo.osdec.gov.my:8080/osdec-0.1"
// };




function loadJSON(filePath) {
    const json = loadTextFileAjaxSync(filePath, "application/json");
    return JSON.parse(json);
}

function loadTextFileAjaxSync(filePath, mimeType) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    if (mimeType != null) {
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType(mimeType);
        }
    }
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        return xmlhttp.responseText;
    }
    else {
        return null;
    }
}

export const environment = loadJSON('/assets/config.json');