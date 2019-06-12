<?php

namespace Biigle\Tests\Policies;

use Cache;
use TestCase;
use Biigle\Role;
use Biigle\LabelTree;
use Biigle\Visibility;
use Biigle\Tests\UserTest;
use Biigle\LabelTreeVersion;
use Biigle\Tests\ProjectTest;
use Biigle\Tests\LabelTreeVersionTest;

class LabelTreeVersionPolicyTest extends TestCase
{
    private $version;
    private $user;
    private $editor;
    private $admin;
    private $globalAdmin;

    public function setUp()
    {
        parent::setUp();
        $this->version = LabelTreeVersionTest::create();
        $this->user = UserTest::create();
        $this->editor = UserTest::create();
        $this->admin = UserTest::create();
        $this->globalAdmin = UserTest::create(['role_id' => Role::adminId()]);
        $this->version->labelTree->addMember($this->editor, Role::editor());
        $this->version->labelTree->addMember($this->admin, Role::admin());
    }

    public function testCreate()
    {
        $this->assertFalse($this->user->can('create', [LabelTreeVersion::class, $this->version->labelTree]));
        $this->assertFalse($this->editor->can('create', [LabelTreeVersion::class, $this->version->labelTree]));
        $this->assertTrue($this->admin->can('create', [LabelTreeVersion::class, $this->version->labelTree]));
        $this->assertTrue($this->globalAdmin->can('create', [LabelTreeVersion::class, $this->version->labelTree]));
    }

    public function testAccessPublic()
    {
        $this->assertTrue($this->user->can('access', $this->version));
        $this->assertTrue($this->editor->can('access', $this->version));
        $this->assertTrue($this->admin->can('access', $this->version));
        $this->assertTrue($this->globalAdmin->can('access', $this->version));
    }

    public function testAccessPrivate()
    {
        $this->version->labelTree->visibility_id = Visibility::privateId();
        $this->version->labelTree->save();
        $this->assertFalse($this->user->can('access', $this->version));
        $this->assertTrue($this->editor->can('access', $this->version));
        $this->assertTrue($this->admin->can('access', $this->version));
        $this->assertTrue($this->globalAdmin->can('access', $this->version));
    }

    public function testAccessViaProjectMembership()
    {
        $this->version->labelTree->visibility_id = Visibility::privateId();
        $this->version->labelTree->save();
        $project = ProjectTest::create();
        $this->assertFalse($project->creator->can('access', $this->version));
        $project->labelTrees()->attach($this->version->labelTree);
        Cache::flush();
        $this->assertTrue($project->creator->can('access', $this->version));
    }

    public function testDestroy()
    {
        $this->assertFalse($this->user->can('destroy', $this->version));
        $this->assertFalse($this->editor->can('destroy', $this->version));
        $this->assertTrue($this->admin->can('destroy', $this->version));
        $this->assertTrue($this->globalAdmin->can('destroy', $this->version));
    }
}