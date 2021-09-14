<?php
namespace Edisom\App\help\controller;

class TranslateController extends \Edisom\Core\Backend
{	
	function index()
	{	
		$this->view->assign('words', $this->model->get($this->callback));
		$this->view->display('translate.html');
	}		
	
	function replace(){
		if(!$this->callback)
		{
			if($this->from)
				$this->view->assign('word', $this->model->get(['from'=>$this->from])['data'][0]);
			
			$this->view->display('word.html');
		}
		else{
			$this->model->save($this->callback);
			$this->redirect();	
		}		
	}	

	function delete(){
		$this->model->delete($this->from);
		$this->redirect();		
	}	
		
}