var getColor=function(c,d,t,p) {

if(padre == "" || padre == p ){
	if( c=='Vereda'){	//ESCALA FIJA	//
			return d > 1  ? 'rgba(213,204,175,0.7)' :'rgba(213,204,175,0.7)';
	}else {			
		if(global_valores == undefined) {	//VALIDA SI YA SE REALIZÓ LA PETICIÓN
				var ident = $("#layers option:selected").attr('value'); //$('#layers').val();
				var tabla='gesius',escalaCuantil;
				if (c=='Cundinamarca'){
					escalaCuantil='cod_dpto';
				}else if (c=='Municipio'){
					escalaCuantil='municipio';
				}else{
					escalaCuantil='cod_prov';
				}
				global_valores=cuantiles(tabla,escalaCuantil);
				
				if(global_valores[0]==global_valores[1]){
					global_valores.shift();
				}
				global_valores[0]=1;
				AutoDisplayLeyend(global_valores);
		}
		if(global_valores[1]==global_valores[5]){
			return d > 1  ? 'rgba(255,255,255,0.7)' :'rgba(255,255,255,0.7)';
		}
		else{
		   if(global_valores.length==5){
		   		return d >= global_valores[4]  ? 'rgba(107,6,1,1)' :
		       d >= global_valores[3]  ? 'rgba(158,68,16,1)' :
		       d >= global_valores[2]  ? 'rgba(214,133,34,1)' :
		       d >= global_valores[1]   ? 'rgba(252,221,53,1)' :
		       d >= global_valores[0]  ? 'rgba(252,255,128,1)' :
		                   'rgb(255,255,255)';
		   }else{
		   		return d >= global_valores[5]  ? 'rgba(107,6,1,1)' :
		       d >= global_valores[4]  ? 'rgba(158,68,16,1)' :
		       d >= global_valores[3]  ? 'rgba(214,133,34,1)' :
		       d >= global_valores[2]  ? 'rgba(247,186,62,1)' :                   
		       d >= global_valores[1]   ? 'rgba(252,221,53,1)' :
		       d >= global_valores[0]  ? 'rgba(252,255,128,1)' :
		                   'rgb(255,255,255)';	
		   }
		}
		
	}	
}else
{
	return d = 'rgba(255,255,255,0.3)'; 
}			
   
};

var fill = new ol.style.Fill({
   color: 'rgba(255,255,255,0.3)'
 });
 var stroke = new ol.style.Stroke({
   color: '#3399CC',
   width: 1.25
 });
 var styles_none = [
   new ol.style.Style({
     fill: fill,
     stroke: stroke
   })
 ];
 


/************************** CALCULA LOS QUINTILES **************************/
var cuantiles=function(tabla,escalaCuantil){
	var url;
	var parametros=getparametros();
	
	var campos="sexo;";
	var atributo=parametros.sexo.replace('\\', '')+';';
	

	campos=parametros.msEPS.length==0?campos:campos+'grupoeps;';
	campos=parametros.msTipoAtencion.length==0?campos:campos+'tipoatencion;';
	campos=parametros.msEdad.length==0?campos:campos+'cod_edad_ciclo;';
	campos=parametros.msEtnia.length==0?campos:campos+'etnia;';
	campos=parametros.msTipoRegimen.length==0?campos:campos+'tiporegimen;';
	campos=parametros.msEstadoCivil.length==0?campos:campos+'estadocivil;';
	
	atributo=parametros.msEPS.length==0?atributo:atributo+parametros.msEPS.join(',')+";";
	atributo=parametros.msTipoAtencion.length==0?atributo:atributo+parametros.msTipoAtencion.join(',')+";";
	atributo=parametros.msEdad.length==0?atributo:atributo+parametros.msEdad.join(',')+";";
	atributo=parametros.msEtnia.length==0?atributo:atributo+parametros.msEtnia.join(',')+";";
	atributo=parametros.msTipoRegimen.length==0?atributo:atributo+parametros.msTipoRegimen.join(',')+";";
	atributo=parametros.msEstadoCivil.length==0?atributo:atributo+parametros.msEstadoCivil.join(',')+";";
	
	
	var params="&fecha_min="+parametros.fechaini+"&fecha_max="+parametros.fechafin+
	"&grupodiag="+parametros.grupodiag+"&cod_diag="+parametros.CodDiagnostico+"&escala="+parametros.msProcedencia+
	"&campos="+campos+"&atributos="+atributo;
	
	url="./services/breaksLeyend.php?tabla="+tabla+params;

	$.ajax({
	  url: url,
	  dataType: 'json',
	  async: false,
	  success: function(json) {
	    global_valores=json;	
	    for(var i=0;i<global_valores.length;i++){
	    	global_valores[i]=parseInt(global_valores[i]);
	    }		    
	    console.log("SRV: "+global_valores);
	  }
	});
	if(global_valores){}
	else{
		global_valores=[1, 200, 240,750, 1360, 10000];
	}
	
	if(escalaCuantil=='municipio'){
		escalaMun = global_valores; 	//console.log("SET ESCALA MPIO: " +escalaMun);
	}else if(escalaCuantil=='cod_prov'){
		escalaPro = global_valores;		//console.log("SET ESCALA PROV: " +escalaPro);
	}
	return 	global_valores;
};