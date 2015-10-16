function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}



function displayContents_ok_menos_bb_hsbc(contents) {
	
	if (window.DOMParser)
	  {
	  parser=new DOMParser();
	  xmlDoc=parser.parseFromString(contents,"text/xml");
	  }
	else // Internet Explorer
	  {
	  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	  xmlDoc.async=false;
	  xmlDoc.loadXML(contents);
	  }	
	 // alert(xmlDoc.getElementsByTagName("ofx").length);
	  
	document.getElementById('file-content').innerHTML = contents;
	var json=contents;
	json = json.split('<OFX>');
	json = json[json.length-1];
	json = 'OFX>'+json;
	
	//limpando a string
	json = json.replace(/[[]/g, '(');
	json = json.replace(/[]]/g, ')');	
	json = json.replace(/]/g, ')');	
	json = json.replace(/\t/g, '');	
	json = json.replace(/	/g, '');	
	json = json.replace(/\s\s+/g, ' ');	
	json = json.replace(/\s</g, '<');	
	json = json.replace(/\n/g, '\r');	
	json = json.replace(/\r/g, '');	
	json = json.replace(/</g, '\r<');	
	json = json.replace(/'/g, '');
	json = json.replace(/"/g, '');	
	json = json.replace(/:/g, ' ');
	json = json.replace(/,/g, '.');
	json = json.replace(/{/g, '(');
	json = json.replace(/}/g, ')');

	json = json.replace(/\r/g, '"}\r');
	json = json.replace(/</g, '{"');
	json = json.replace(/>\r/g, '":[\r');
	json = json.replace(/>/g, '":"');
	json = json.replace(/:""}/g, ':[');
	json = json.replace(/{"[/].*":[[]/g, ']}');
	json = json.replace(/}\r{/g, '},\r{');
	json = json.replace(/},\r{"[/]OFX":"/g, '');
	json = json.replace(/\r/g, '');	
	
	json = '{"'+json+'}]}';	




	document.getElementById('file-content-2').innerHTML = json;
		json=JSON.parse(json);
		console.log(json);
	
	
	
}

function displayContents(contents) {
	
	if (window.DOMParser)
	  {
	  parser=new DOMParser();
	  xmlDoc=parser.parseFromString(contents,"text/xml");
	  }
	else // Internet Explorer
	  {
	  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	  xmlDoc.async=false;
	  xmlDoc.loadXML(contents);
	  }	
	 // alert(xmlDoc.getElementsByTagName("ofx").length);
	  
	document.getElementById('file-content').innerHTML = contents;
	
	json=document.getElementsByTagName('STMTTRN');
	//alert(json.length);
	var tb={};
	for(var n=0;n<json.length;n++){
		campos=json[n].innerHTML;
		campos = campos.replace(/	/g, '');	
		campos = campos.replace(/:/g, ' ');	
		campos = campos.replace(/\s\s+/g, ' ');			
		campos = campos.replace(/<[/].*>/g, '');
		campos = campos.replace(/]/g, ')');
		campos = campos.replace(/[[]/g, '(');
		campos = campos.replace(/\s</g, '<');	
		//campos = campos.replace(/</g, '');	

		//console.log(campos);
		
		campos = campos.split("<");
		//console.log(campos);		
		for(var a=0;a<campos.length;a++){
			campos[a]=campos[a].replace(/>/g, ':');
			campos[a]=campos[a].replace(/\r/g, '');
			campos[a]=campos[a].replace(/\n/g, '');
			js = '{"'+campos[a].replace(/:/g, '":"')+'"}';
			//campos[a]="{"+campos[a].toString()+"}";
			//console.log(js);
			if(js!='{""}'){
				campos[a]=JSON.parse(js);
				
			}
			
			//campos[a]=JSON.parse(js);
		}
		//console.log(campos.toString());
		//console.log(campos);
		tb[n]=campos;
		
	}
	console.log(tb);
	console.log(Object.keys(tb).length);	
	var table="<table class='uk-table uk-table-condensed' style='font-size:12px;'>";
		
		for(var n=0;n<Object.keys(tb).length;n++){
			table+="<tr>";
			//keys=Object.keys(tb[n]);
			for( b in tb[n]){
				key_=Object.keys(tb[n][b]);
				console.log(key_);
				for(c in tb[n][b]){table+="<td>"+tb[n][b][c]+"</td>";}
				
			}
			
			
			
			table+="</tr>";
			
			
		}
	 table+="</table>";
	console.log(table);
	document.getElementById('file-content-2').innerHTML = table;
	//alert(json.length);

	
	
	
}




function read_file() {
        var upload = document.getElementById('id_transactions')
        var files = upload.files
        if (files != undefined) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var extension = upload.value.split('.').pop().toLowerCase()
				////////////
				var ofxParts = e.result.split("\r?\n\r?\n"), ofxHeaders, ofxDocument;

				ofxHeaders = JSON.parse("{"
					+ ofxParts[0].replace(/(\w+) *: *(\w*)/g, "\"$1\": \"$2\"")
						.replace(/\r?\n/g, ", ") + "}");

				ofxDocument = new DOMParser().parseFromString(ofxParts[1]
						.replace(/<(\w+)>(?!\n|\r\n)(.*)/g, "<$1>$2</$1>"));				
				////////////////
				//
				//var $xfers = $ofx.find("STMTTRN");

				//content = $xfers.map(function(xf) {
				//	var $xf = $(xf), date = $xf.find("DTPOSTED").text();
				//	return "<tr><td>" + date.substring(4, 6) + "/" + date.substring(6)
				//		+ "/" + date.substring(0, 4) + "<td></td>" + $xf.find("NAME").text()
				//		+ "</td><td>" + $xf.find("TRNAMT").text() + "</td></tr>";
				//}).join("");

                $('#preview-table').html(ofxDocument);
            };
            reader.readAsText(files.item(0));
        }
}


















