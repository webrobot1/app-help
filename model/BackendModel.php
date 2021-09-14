<?php
namespace Edisom\App\help\model;

class BackendModel extends \Edisom\Core\Model 
{	
	private $words = array();
	
	public function faq(int $id = null, array $callback = null)
	{
		if($data = $this->query('SELECT * FROM faq WHERE '.($id?'faq_id='.$id:(static::explode($callback, ' AND ').(!empty($callback['sort'])?' ORDER BY '.$callback['sort'].' '.(!empty($callback['order'])?'ASC':'DESC'):'').' LIMIT '.((int)$callback['page']*100).', 100'))))
		{
			foreach($data as &$row)
				$row['text'] = ($row['text']=="<br>"?'':$row['text']); // текстовый редактор оставляет перенос если удалить текст
		}
		
		return @($id?$data[0]:$data[0]['text']);
	}	
			
	function translate(string $word){
		$word = strtolower($word);
		if(!array_key_exists($word, $this->words))
			if(!$this->words[$word] = @$this->query('SELECT `to` FROM translate WHERE `from`="'.$word.'"')[0]['to'])
				$this->words[$word] = $word;
			else
				$this->words[$word] = mb_strtoupper(mb_substr($this->words[$word], 0, 1)).mb_substr($this->words[$word],1);
			
		return $this->words[$word];
	}	
	
	function faq_tree():array
	{
		$return = array();
		if($data = $this->query('select faq_id, app, page, action FROM faq')){
			$userModel = \Edisom\App\user\model\BackendModel::getInstance(); 
			foreach($data as $row){
				if(!$userModel->check_admin($row['page'], $row['action'], $row['app'])) continue;
				
				if(empty($return[$row['app']]))
					$return[$row['app']]['label'] = $this->translate($row['app']);
				if(empty($return[$row['app']]['children'][$row['page']])){
					$return[$row['app']]['children'][$row['page']]['label'] = $this->translate($row['page']);
					uasort($return[$row['app']]['children'], function($a, $b){return strnatcmp($a["label"], $b["label"]);});
				}
		
				$return[$row['app']]['children'][$row['page']]['children'][$row['action']]['label'] = $this->translate($row['action']);
				$return[$row['app']]['children'][$row['page']]['children'][$row['action']]['id'] = $row['faq_id'];
				
				uasort($return[$row['app']]['children'][$row['page']]['children'], function($a, $b){return strnatcmp($a["label"], $b["label"]);});
			}
			uasort($return, function($a, $b){return strnatcmp($a["label"], $b["label"]);});
		}
	
		return $return;
	}
	
	public function save(array $callback)
	{		
		$this->query('REPLACE INTO faq SET '.static::explode($callback));
	}
}