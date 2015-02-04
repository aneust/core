<?php

class AttributeTest extends TestCase {

	public static function create($name = 'test', $type = 'integer')
	{
		$obj = new Attribute;
		$obj->name = $name;
		$obj->type = $type;
		return $obj;
	}

	public function testCreation()
	{
		$obj = AttributeTest::create();
		$this->assertTrue($obj->save());
	}

	public function testAttributes()
	{
		$attribute = AttributeTest::create();
		$attribute->save();
		$this->assertNotNull($attribute->name);
		$this->assertNotNull($attribute->type);
		$this->assertNull($attribute->created_at);
		$this->assertNull($attribute->updated_at);
	}

	public function testNameRequired()
	{
		$obj = AttributeTest::create();
		$obj->name = null;
		$this->setExpectedException('Illuminate\Database\QueryException');
		$obj->save();
	}

	public function testTypeRequired()
	{
		$obj = AttributeTest::create();
		$obj->type = null;
		$this->setExpectedException('Illuminate\Database\QueryException');
		$obj->save();
	}

	public function testTypes()
	{
		if (DB::connection() instanceof Illuminate\Database\SQLiteConnection) {
			// SQLite doesn't support enums
			return;
		}
		$obj = AttributeTest::create('test', 'integer');
		$obj->save();
		$obj->type = 'double';
		$obj->save();
		$obj->type = 'string';
		$obj->save();
		$obj->type = 'boolean';
		$obj->save();
		$obj->type = 'test';
		$this->setExpectedException('Illuminate\Database\QueryException');
		$obj->save();
	}
}