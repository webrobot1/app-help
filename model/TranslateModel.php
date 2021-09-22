<?php
namespace Edisom\App\help\model;

class TranslateModel extends \Edisom\Core\Model 
{	
	function get(array $callback = null):array{
		$where = array();	
		
		if(
			($count = $this->query('SELECT COUNT(*) as count FROM translate '.($callback?' WHERE '.static::explode($callback, ' AND '):''))[0]['count'])
				&&
			($data = $this->query('SELECT * FROM translate '.($callback?' WHERE '.static::explode($callback, ' AND '):'')))
		){
			
			
		}
		
		return array('count'=>$count, 'data'=>$data);
	}	
	
	function delete(string $from){
		$this->query('DELETE FROM translate where from = "'.$from.'"');
	}	
	
	function save(array $callback){
		if($callback['from'] = strtolower($callback['from']))
			$this->query('REPLACE INTO translate SET '.static::explode($callback));
	}	
}