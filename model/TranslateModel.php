<?php
namespace Edisom\App\help\model;

class TranslateModel extends \Edisom\Core\Model 
{	
	function get(array $callback = null):array{
		$where = array();	
		
		if(
			($count = $this->query('SELECT COUNT(*) as count FROM translate '.($where?' WHERE '.implode(' AND ', $where):''))[0]['count'])
				&&
			($data = $this->query('SELECT * FROM translate '.($where?' WHERE '.implode(' AND ', $where):'').($callback['sort']?' ORDER BY '.$callback['sort'].' '.($callback['order']?'ASC':'DESC'):'').' LIMIT '.((int)$callback['page']*100).', 100'))
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