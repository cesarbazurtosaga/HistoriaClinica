<?php
require_once('./conexion.php');

$tabla=$_GET["tabla"];
$clave=$_GET["clave"];

if($tabla==2){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
	SELECT *
	FROM (	
		select gecodigo,gecodigo||' - '||genombre genombre
		from salud.gediagno_grupo g
		where EXISTS(SELECT 1  from salud.gesius 
		WHERE grupo_codigo_cie10 = g.gecodigo)
		UNION ALL 
		SELECT 'GRUSG1','CHIKUNGUNYA GRUPOS'	
	)t  where upper(genombre) like '%$clave%'
	order by gecodigo
	) row;
	";	
}elseif($tabla==1){
	$query_sql = "
	select array_to_json(array_agg(row(row.*))) AS diagnosticos 
	from (
	SELECT *
	FROM (	
		select gecodigo,gecodigo||' - '||genombre genombre
		from salud.gediagno_cie10 g
		where EXISTS(SELECT 1  from salud.gesius 
		WHERE cie10 = g.gecodigo)		
	)t   where upper(genombre) like '%$clave%'
	order by gecodigo  
	) row;
	";	
}

//equipo_pruebas  'N'
 //echo "$query_sql<br>";

$resultado = pg_query($cx, $query_sql) or die(pg_last_error());
$total_filas = pg_num_rows($resultado);

while ($fila_vertical = pg_fetch_assoc($resultado)) {
	$row_to_json = $fila_vertical['diagnosticos'];							
	echo "getDiagnostico(".$row_to_json.")";
}	
// Liberando el conjunto de resultados
pg_free_result($resultado);

// Cerrando la conexión
pg_close($cx);
?>
