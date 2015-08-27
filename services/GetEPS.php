<?php
require_once('./conexion.php');

$clave=$_GET["clave"];

$query_sql = "
select array_to_json(array_agg(row.*)) AS eps 
from (
SELECT *
FROM (	
	select e.descripcion as label,a.grupoeps as value
	from (
		select grupoeps,count(*)
		from salud.gesius
		group by grupoeps
		order by 2
	) a
	left join salud.gep_eps e 
	on a.grupoeps=e.id	
)t
) row;
";
//equipo_pruebas  'N'
 //echo "$query_sql<br>";

$resultado = pg_query($cx, $query_sql) or die(pg_last_error());
$total_filas = pg_num_rows($resultado);

while ($fila_vertical = pg_fetch_assoc($resultado)) {
	$row_to_json = $fila_vertical['eps'];							
	echo "".$row_to_json."";
}	
// Liberando el conjunto de resultados
pg_free_result($resultado);

// Cerrando la conexión
pg_close($cx);
?>
