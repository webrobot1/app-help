<?php
namespace Edisom\App\help\controller;

class BackendController extends \Edisom\Core\Backend
{	
	function index()
	{	
		if($this->id){
			$this->view->assign('content', $this->model->faq($this->id));
			echo $this->view->fetch('faq_content.html');
		}
		else
		{
			$this->view->assign('tree', $this->model->faq_tree());
			$this->view->display('faq_list.html');
		}
	}		

	function save()
	{	
		$this->model->save($this->callback);
		if(!getallheaders()['X-Requested-With'])
			$this->redirect();
		else
			die();
	}		
	
	function delete_faq()
	{		
		$this->view->display('faq_list.html');
	}								
}