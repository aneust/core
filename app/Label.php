<?php namespace Dias;

class Label extends Attributable {

	/**
	 * Don't maintain timestamps for this model.
	 *
	 * @var boolean
	 */
	public $timestamps = false;

	// hide pivot table in annotation show output
	protected $hidden = array(
		'pivot'
	);

	public function parent()
	{
		return $this->belongsTo('Dias\Label');
	}
}
