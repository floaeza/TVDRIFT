/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Obtiene el tipo de navegador
 */


    var nVer = navigator.appVersion,
        nAgt = navigator.userAgent,
        browserName  = navigator.appName,
        fullVersion  = ''+parseFloat(navigator.appVersion), 
        majorVersion = parseInt(navigator.appVersion,10),
        nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
       browserName = "Opera";
       fullVersion = nAgt.substring(verOffset+6);
       if ((verOffset=nAgt.indexOf("Version"))!=-1) 
         fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
       browserName = "Microsoft Internet Explorer";
       fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
       browserName = "Chrome";
       fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
       browserName = "Safari";
       fullVersion = nAgt.substring(verOffset+7);
       if ((verOffset=nAgt.indexOf("Version"))!=-1) 
         fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
        browserName = nAgt.substring(nameOffset,verOffset);
        fullVersion = nAgt.substring(verOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
           browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
        fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
        fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion); 
        majorVersion = parseInt(navigator.appVersion,10);
    }

        Debug(''
        +'Browser name  = '+browserName+'<br>'
        +'Full version  = '+fullVersion+'<br>'
        +'Major version = '+majorVersion+'<br>'
        +'navigator.appName = '+navigator.appName+'<br>'
        +'navigator.userAgent = '+navigator.userAgent+'<br>');

/* Vendor: Amino
 * Modelo: A50
 * Browser: Opera
 * Version: 12.51
 */

/* Vendor: Kamai
 * Modelo: 500x
 * Browser: Safari
 * Version: 538.1
 */

/* Vendor: Infomir
 * Modelo: MAG420
 * Browser: Safari
 * Version: 538.1
 */

/* Vendor: Lg
 * Modelo: UU770H
 * Browser: Chrome
 * Version: 53.0.2785.34
 */